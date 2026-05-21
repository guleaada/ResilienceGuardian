/**
 * Resilience Guardian - Backend Server
 * Secure Gemini Proxy with Image Support
 */
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('\n❌ ERROR: GEMINI_API_KEY is not set!');
  process.exit(1);
}

// ── Middleware ─────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ── Rate limiting ──────────────────────────────────────────
const requestCounts = new Map();
setInterval(() => requestCounts.clear(), 60000);

// ── Main API endpoint ──────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;

  if (!parts || !Array.isArray(parts) || parts.length === 0) {
    return res.status(400).json({ error: 'Invalid request: parts array required' });
  }

  // Rate limit: 30 requests/min per IP
  const ip = req.ip || 'unknown';
  const count = (requestCounts.get(ip) || 0) + 1;
  requestCounts.set(ip, count);
  if (count > 30) {
    return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });
  }

  // Try multiple model names in case one is deprecated
  const models = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
  ];

  let lastError = null;

  for (const model of models) {
    try {
      console.log(`📡 Trying model: ${model} (${parts.length} parts)`);

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1600,
              topP: 0.95,
            }
          })
        }
      );

      const responseText = await geminiRes.text();

      if (!geminiRes.ok) {
        console.error(`Model ${model} error:`, geminiRes.status, responseText.substring(0, 200));

        // API key invalid — no point trying other models
        if (geminiRes.status === 400 || geminiRes.status === 403) {
          let errMsg = `Gemini API error (${geminiRes.status})`;
          try {
            const errJson = JSON.parse(responseText);
            errMsg = errJson.error?.message || errMsg;
          } catch {}
          return res.status(502).json({ error: errMsg });
        }

        lastError = `${model} error (${geminiRes.status})`;
        continue; // try next model
      }

      const data = JSON.parse(responseText);
      console.log(`✅ Success with model: ${model}`);
      return res.json(data);

    } catch (err) {
      console.error(`Model ${model} fetch error:`, err.message);
      lastError = err.message;
      continue;
    }
  }

  // All models failed
  return res.status(503).json({ error: `All models failed. Last error: ${lastError}` });
});

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.4',
    message: 'Resilience Guardian Backend Running',
    timestamp: new Date().toISOString(),
    gemini: GEMINI_API_KEY ? 'Connected' : 'Not Configured',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-flash-latest']
  });
});

// ── SPA fallback ───────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌿 ========================================`);
  console.log(`   Resilience Guardian Server v1.4`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Gemini API: ${GEMINI_API_KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log(`========================================\n`);
});
