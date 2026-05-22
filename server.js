require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const KEY  = process.env.GEMINI_API_KEY;

if (!KEY) { console.error('❌ GEMINI_API_KEY missing'); process.exit(1); }

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting
const reqCounts = new Map();
setInterval(() => reqCounts.clear(), 60000);

// Each model uses its correct API version
const MODELS = [
  { name: 'gemini-2.0-flash',        api: 'v1beta' },
  { name: 'gemini-1.5-flash',         api: 'v1'     },
  { name: 'gemini-1.5-flash-latest',  api: 'v1'     },
  { name: 'gemini-1.5-pro',           api: 'v1'     },
];

app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;
  if (!parts || !Array.isArray(parts)) {
    return res.status(400).json({ error: 'Invalid request: parts array required' });
  }

  const ip    = req.ip || 'unknown';
  const count = (reqCounts.get(ip) || 0) + 1;
  reqCounts.set(ip, count);
  if (count > 30) return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });

  let lastError = 'All models failed';

  for (const model of MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/${model.api}/models/${model.name}:generateContent?key=${KEY}`;
      console.log(`📡 Trying ${model.name} (${model.api})...`);

      const gemRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1600, topP: 0.95 }
        })
      });

      const text = await gemRes.text();

      if (gemRes.ok) {
        console.log(`✅ Success: ${model.name}`);
        return res.json(JSON.parse(text));
      }

      console.error(`❌ ${model.name} → ${gemRes.status}:`, text.substring(0, 150));

      // 429 = rate limit → try next model
      if (gemRes.status === 429) {
        lastError = `${model.name} rate limit (429) — trying next model`;
        continue;
      }

      // 404 = model not found → try next model  
      if (gemRes.status === 404) {
        lastError = `${model.name} not found (404) — trying next model`;
        continue;
      }

      // 400/403 = bad key or bad request — no point retrying
      if (gemRes.status === 400 || gemRes.status === 403) {
        let errMsg = `Gemini error ${gemRes.status}`;
        try { errMsg = JSON.parse(text).error?.message || errMsg; } catch {}
        return res.status(502).json({ error: errMsg });
      }

      // Other error → try next model
      lastError = `${model.name} error (${gemRes.status})`;
      continue;

    } catch (err) {
      console.error(`${model.name} fetch failed:`, err.message);
      lastError = err.message;
      continue;
    }
  }

  return res.status(503).json({ error: `All models failed. Last: ${lastError}` });
});


app.post('/api/feedback', (req, res) => {
  const { feedback } = req.body;
  if (!feedback || !Array.isArray(feedback)) return res.status(400).json({ error: 'Invalid feedback' });
  feedback.forEach(f => {
    console.log('📊 FEEDBACK:', JSON.stringify({
      crop: f.crop, disease: f.disease, accuracy: f.accuracy,
      comment: f.comment, region: f.region, lang: f.language, time: f.timestamp
    }));
  });
  res.json({ ok: true, saved: feedback.length });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.5', timestamp: new Date().toISOString(), gemini: KEY ? 'Connected' : 'Missing' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌿 Resilience Guardian v1.5`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Gemini: ${KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log(`   Models: ${MODELS.map(m => m.name).join(', ')}\n`);
});
