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

const reqCounts = new Map();
setInterval(() => reqCounts.clear(), 60000);

const MODELS = [
  { name: 'gemini-1.5-flash',      api: 'v1' },
  { name: 'gemini-1.5-flash-8b',   api: 'v1' },
  { name: 'gemini-2.0-flash',      api: 'v1beta' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;
  if (!parts || !Array.isArray(parts))
    return res.status(400).json({ error: 'Invalid request: parts array required' });

  const ip = req.ip || 'unknown';
  const count = (reqCounts.get(ip) || 0) + 1;
  reqCounts.set(ip, count);
  if (count > 20) return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });

  let lastError = 'All models failed';

  for (let i = 0; i < MODELS.length; i++) {
    const model = MODELS[i];
    if (i > 0) await sleep(2000); // 2s delay between retries

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

      console.error(`❌ ${model.name} → ${gemRes.status}:`, text.substring(0, 200));

      if (gemRes.status === 429) { lastError = `Rate limit on ${model.name}`; continue; }
      if (gemRes.status === 404) { lastError = `${model.name} not found`; continue; }
      if (gemRes.status === 400 || gemRes.status === 403) {
        let msg = `Gemini error ${gemRes.status}`;
        try { msg = JSON.parse(text).error?.message || msg; } catch {}
        return res.status(502).json({ error: msg });
      }
      lastError = `${model.name} error (${gemRes.status})`;

    } catch (err) {
      console.error(`${model.name} fetch failed:`, err.message);
      lastError = err.message;
    }
  }

  return res.status(503).json({ error: `All models failed. Last: ${lastError}` });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.6', timestamp: new Date().toISOString(), gemini: KEY ? 'Connected' : 'Missing' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌿 Resilience Guardian v1.6`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Gemini: ${KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log(`   Models: ${MODELS.map(m => m.name).join(', ')}\n`);
});
