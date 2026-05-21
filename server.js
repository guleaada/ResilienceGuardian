require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_KEY      = process.env.GROQ_API_KEY;
const GEMINI_KEY    = process.env.GEMINI_API_KEY;
const OPENROUTER_KEY = process.env.OpenRouter_API_KEY;

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const reqCounts = new Map();
setInterval(() => reqCounts.clear(), 60000);
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function tryGroq(parts) {
  if (!GROQ_KEY) return null;
  const content = [];
  parts.forEach(p => {
    if (p.text) content.push({ type: 'text', text: p.text });
    if (p.inline_data) content.push({ type: 'image_url', image_url: { url: `data:${p.inline_data.mime_type};base64,${p.inline_data.data}` } });
  });
  console.log('📡 Trying Groq...');
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages: [{ role: 'user', content }], max_tokens: 1600, temperature: 0.3 })
  });
  const data = await res.json();
  if (!res.ok) { console.error('❌ Groq:', data?.error?.message); return null; }
  console.log('✅ Groq success!');
  return { candidates: [{ content: { parts: [{ text: data.choices[0].message.content }] } }] };
}

async function tryOpenRouter(parts) {
  if (!OPENROUTER_KEY) return null;
  const content = [];
  parts.forEach(p => {
    if (p.text) content.push({ type: 'text', text: p.text });
    if (p.inline_data) content.push({ type: 'image_url', image_url: { url: `data:${p.inline_data.mime_type};base64,${p.inline_data.data}` } });
  });
  console.log('📡 Trying OpenRouter...');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': 'https://resilienceguardian.onrender.com' },
    body: JSON.stringify({ model: 'meta-llama/llama-3.2-11b-vision-instruct:free', messages: [{ role: 'user', content }], max_tokens: 1600 })
  });
  const data = await res.json();
  if (!res.ok) { console.error('❌ OpenRouter:', data?.error?.message); return null; }
  console.log('✅ OpenRouter success!');
  return { candidates: [{ content: { parts: [{ text: data.choices[0].message.content }] } }] };
}

async function tryGemini(parts) {
  if (!GEMINI_KEY) return null;
  const models = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];
  for (const name of models) {
    try {
      console.log(`📡 Trying Gemini ${name}...`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { temperature: 0.3, maxOutputTokens: 1600 } })
      });
      if (res.ok) { console.log(`✅ Gemini ${name} success!`); return res.json(); }
      console.error(`❌ Gemini ${name} → ${res.status}`);
      await sleep(2000);
    } catch (e) { console.error('Gemini error:', e.message); }
  }
  return null;
}

app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;
  if (!parts || !Array.isArray(parts)) return res.status(400).json({ error: 'Invalid request' });

  const ip = req.ip || 'unknown';
  const count = (reqCounts.get(ip) || 0) + 1;
  reqCounts.set(ip, count);
  if (count > 20) return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });

  const result = await tryGroq(parts)
    || await tryOpenRouter(parts)
    || await tryGemini(parts);

  if (result) return res.json(result);
  return res.status(503).json({ error: 'All AI models failed. Please try again in 1 minute.' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '3.0', timestamp: new Date().toISOString(),
    groq: GROQ_KEY ? '✅' : '❌',
    openrouter: OPENROUTER_KEY ? '✅' : '❌',
    gemini: GEMINI_KEY ? '✅' : '❌' });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🌿 Resilience Guardian v3.0`);
  console.log(`   Groq:       ${GROQ_KEY       ? '✅' : '❌'}`);
  console.log(`   OpenRouter: ${OPENROUTER_KEY ? '✅' : '❌'}`);
  console.log(`   Gemini:     ${GEMINI_KEY     ? '✅' : '❌'}\n`);
});
