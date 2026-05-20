/**
 * Resilience Guardian — Backend Proxy Server
 * ------------------------------------------
 * Keeps the Gemini API key off the client.
 * Serves the frontend and proxies AI requests.
 *
 * Setup:
 *   1. npm install
 *   2. Copy .env.example → .env and add your GEMINI_API_KEY
 *   3. node server.js  (or: npm start)
 *   4. Open http://localhost:3000
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const fetch    = (...args) => import('node-fetch').then(({default:f}) => f(...args));

const app  = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('\n❌  GEMINI_API_KEY is not set.\n   Create a .env file with:\n   GEMINI_API_KEY=your_key_here\n');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));   // allow base64 images
app.use(express.static(path.join(__dirname, 'public')));

/* ── /api/analyze ──────────────────────────────────────────────────────────
   Accepts: { parts: [...] }  (Gemini-style parts array)
   Returns: Gemini response JSON (candidates[0].content.parts[0].text)
   Strips the API key — it never leaves this server.
   ────────────────────────────────────────────────────────────────────────── */
app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;

  if (!parts || !Array.isArray(parts)) {
    return res.status(400).json({ error: 'Missing or invalid parts array.' });
  }

  // Basic sanity: at most one inline_data block (the photo)
  const textParts  = parts.filter(p => p.text);
  const imageParts = parts.filter(p => p.inline_data);
  if (!textParts.length) {
    return res.status(400).json({ error: 'At least one text part is required.' });
  }

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      }
    );

    if (!upstream.ok) {
      const errText = await upstream.text();
      console.error('Gemini API error:', upstream.status, errText);
      return res.status(502).json({ error: `Gemini API returned ${upstream.status}` });
    }

    const data = await upstream.json();
    return res.json(data);

  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(503).json({ error: 'Could not reach Gemini API. Check server connectivity.' });
  }
});

/* ── health check ─────────────────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

/* ── catch-all → index.html (SPA) ─────────────────────────────────────────── */
app.get('*', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🌿  Resilience Guardian server running at http://localhost:${PORT}`);
  console.log(`    API key: ****${GEMINI_API_KEY.slice(-4)} (hidden from client)\n`);
});
