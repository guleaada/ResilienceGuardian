require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_KEY       = process.env.GROQ_API_KEY;
const GEMINI_KEY     = process.env.GEMINI_API_KEY;
const OPENROUTER_KEY = process.env.OpenRouter_API_KEY;

if (!GROQ_KEY && !GEMINI_KEY && !OPENROUTER_KEY) {
  console.error('❌ No API keys found'); process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const reqCounts = new Map();
setInterval(() => reqCounts.clear(), 60000);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Inject image analysis instruction into prompt
function enhancePrompt(parts) {
  const hasImage = parts.some(p => p.inline_data);
  if (!hasImage) return parts;
  return parts.map(p => {
    if (p.text) {
      return { text: 'IMPORTANT: An image of the plant has been provided. Carefully examine it for visual disease symptoms: discoloration, lesions, spots, wilting, rust, fungal growth, pest damage. Base your diagnosis on BOTH the image AND the reported symptoms.\n\n' + p.text };
    }
    return p;
  });
}

// ── GROQ (Primary — fastest, generous free tier) ──
async function tryGroq(parts) {
  if (!GROQ_KEY) return null;
  const enhanced = enhancePrompt(parts);
  const content = [];
  enhanced.forEach(p => {
    if (p.text) content.push({ type: 'text', text: p.text });
    if (p.inline_data) content.push({
      type: 'image_url',
      image_url: { url: `data:${p.inline_data.mime_type};base64,${p.inline_data.data}` }
    });
  });
  try {
    console.log('📡 Trying Groq...');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [{ role: 'user', content }],
        max_tokens: 1600, temperature: 0.3
      })
    });
    const data = await res.json();
    if (!res.ok) { console.error('❌ Groq:', data?.error?.message); return null; }
    const text = data.choices?.[0]?.message?.content || '';
    console.log('✅ Groq success!');
    return { candidates: [{ content: { parts: [{ text }] } }] };
  } catch (e) { console.error('Groq fetch error:', e.message); return null; }
}

// ── OPENROUTER (Secondary fallback) ──
async function tryOpenRouter(parts) {
  if (!OPENROUTER_KEY) return null;
  const enhanced = enhancePrompt(parts);
  const content = [];
  enhanced.forEach(p => {
    if (p.text) content.push({ type: 'text', text: p.text });
    if (p.inline_data) content.push({
      type: 'image_url',
      image_url: { url: `data:${p.inline_data.mime_type};base64,${p.inline_data.data}` }
    });
  });
  try {
    console.log('📡 Trying OpenRouter...');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://resilienceguardian.onrender.com'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-11b-vision-instruct:free',
        messages: [{ role: 'user', content }],
        max_tokens: 1600
      })
    });
    const data = await res.json();
    if (!res.ok) { console.error('❌ OpenRouter:', data?.error?.message); return null; }
    const text = data.choices?.[0]?.message?.content || '';
    console.log('✅ OpenRouter success!');
    return { candidates: [{ content: { parts: [{ text }] } }] };
  } catch (e) { console.error('OpenRouter fetch error:', e.message); return null; }
}

// ── GEMINI (Last resort fallback) ──
async function tryGemini(parts) {
  if (!GEMINI_KEY) return null;
  const enhanced = enhancePrompt(parts);
  const models = [
    { name: 'gemini-2.0-flash-lite', api: 'v1beta' },
    { name: 'gemini-2.0-flash',      api: 'v1beta' },
    { name: 'gemini-1.5-flash',      api: 'v1beta' },
  ];
  for (const model of models) {
    try {
      console.log(`📡 Trying Gemini ${model.name}...`);
      const url = `https://generativelanguage.googleapis.com/${model.api}/models/${model.name}:generateContent?key=${GEMINI_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: enhanced }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1600 }
        })
      });
      if (res.ok) {
        console.log(`✅ Gemini ${model.name} success!`);
        return res.json();
      }
      const errText = await res.text();
      console.error(`❌ Gemini ${model.name} → ${res.status}`);
      if (res.status === 400 || res.status === 403) {
        let msg = `Gemini error ${res.status}`;
        try { msg = JSON.parse(errText).error?.message || msg; } catch {}
        return { _geminiError: msg };
      }
      await sleep(2000);
    } catch (e) { console.error('Gemini error:', e.message); }
  }
  return null;
}

// ── MAIN ANALYZE ENDPOINT ──
app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;
  if (!parts || !Array.isArray(parts))
    return res.status(400).json({ error: 'Invalid request' });

  const ip = req.ip || 'unknown';
  const count = (reqCounts.get(ip) || 0) + 1;
  reqCounts.set(ip, count);
  if (count > 20) return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });

  const hasImage = parts.some(p => p.inline_data);
  console.log(`🖼️ Request: ${hasImage ? 'WITH image' : 'text only'}`);

  // Try providers in order
  const groqResult = await tryGroq(parts);
  if (groqResult) return res.json(groqResult);

  const orResult = await tryOpenRouter(parts);
  if (orResult) return res.json(orResult);

  const geminiResult = await tryGemini(parts);
  if (geminiResult) {
    if (geminiResult._geminiError) return res.status(502).json({ error: geminiResult._geminiError });
    return res.json(geminiResult);
  }

  return res.status(503).json({ error: 'All AI models failed. Please try again in 1 minute.' });
});

// ── FEEDBACK ENDPOINT ──
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

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok', version: '2.0',
    timestamp: new Date().toISOString(),
    groq:       GROQ_KEY       ? '✅' : '❌',
    openrouter: OPENROUTER_KEY ? '✅' : '❌',
    gemini:     GEMINI_KEY     ? '✅' : '❌'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🌿 Resilience Guardian v2.0`);
  console.log(`   Groq:       ${GROQ_KEY       ? '✅ Connected' : '❌ Missing'}`);
  console.log(`   OpenRouter: ${OPENROUTER_KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log(`   Gemini:     ${GEMINI_KEY     ? '✅ Connected' : '❌ Missing'}\n`);
});
