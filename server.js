require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_KEY   = process.env.GROQ_API_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!GROQ_KEY && !GEMINI_KEY) { console.error('❌ No API keys found'); process.exit(1); }

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const reqCounts = new Map();
setInterval(() => reqCounts.clear(), 60000);

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function tryGroq(parts) {
  if (!GROQ_KEY) return null;
  const messages = [{ role: 'user', content: [] }];
  parts.forEach(p => {
    if (p.text) messages[0].content.push({ type: 'text', text: p.text });
    if (p.inline_data) messages[0].content.push({
      type: 'image_url',
      image_url: { url: `data:${p.inline_data.mime_type};base64,${p.inline_data.data}` }
    });
  });

  console.log('📡 Trying Groq llama-3.2-90b-vision...');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages,
      max_tokens: 1600,
      temperature: 0.3
    })
  });

  const data = await res.json();
  if (!res.ok) {
    console.error('❌ Groq error:', res.status, data?.error?.message);
    return null;
  }

  const text = data.choices?.[0]?.message?.content || '';
  console.log('✅ Groq success!');
  return { candidates: [{ content: { parts: [{ text }] } }] };
}

async function tryGemini(parts) {
  if (!GEMINI_KEY) return null;
  const models = [
    { name: 'gemini-2.0-flash-lite', api: 'v1beta' },
    { name: 'gemini-2.0-flash',      api: 'v1beta' },
    { name: 'gemini-1.5-flash',      api: 'v1beta' },
  ];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/${model.api}/models/${model.name}:generateContent?key=${GEMINI_KEY}`;
      console.log(`📡 Trying Gemini ${model.name}...`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.3, maxOutputTokens: 1600 } })
      });
      if (res.ok) { console.log(`✅ Gemini ${model.name} success!`); return res.json(); }
      console.error(`❌ Gemini ${model.name} → ${res.status}`);
      await sleep(2000);
    } catch (e) { console.error('Gemini fetch error:', e.message); }
  }
  return null;
}

app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;
  if (!parts || !Array.isArray(parts))
    return res.status(400).json({ error: 'Invalid request' });

  const ip = req.ip || 'unknown';
  const count = (reqCounts.get(ip) || 0) + 1;
  reqCounts.set(ip, count);
  if (count > 20) return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });

  // Try Groq first (faster, generous free tier)
  const groqResult = await tryGroq(parts);
  if (groqResult) return res.json(groqResult);

  // Fallback to Gemini
  const geminiResult = await tryGemini(parts);
  if (geminiResult) return res.json(geminiResult);

  return res.status(503).json({ error: 'All AI models failed. Please try again in 1 minute.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0', timestamp: new Date().toISOString(),
    groq: GROQ_KEY ? 'Connected' : 'Missing',
    gemini: GEMINI_KEY ? 'Connected' : 'Missing' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌿 Resilience Guardian v2.0`);
  console.log(`   Groq:   ${GROQ_KEY   ? '✅ Connected' : '❌ Missing'}`);
  console.log(`   Gemini: ${GEMINI_KEY ? '✅ Connected' : '❌ Missing'}\n`);
});
