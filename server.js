/**
 * Resilience Guardian - Final Optimized Backend Server
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
  console.error('\n❌ ERROR: GEMINI_API_KEY is not set in .env file!');
  console.error('Please create .env file with your Gemini API key.\n');
  process.exit(1);
}

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Simple Rate Limiting
const requestCounts = new Map();
setInterval(() => requestCounts.clear(), 60000);

// ===================== MAIN API ENDPOINT =====================
app.post('/api/analyze', async (req, res) => {
  const { parts } = req.body;

  if (!parts || !Array.isArray(parts)) {
    return res.status(400).json({
      error: 'Invalid request. "parts" array is required.'
    });
  }

  // Rate limiting — 30 requests per minute per IP
  const ip = req.ip || 'unknown';
  const currentCount = (requestCounts.get(ip) || 0) + 1;
  requestCounts.set(ip, currentCount);
  if (currentCount > 30) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment before trying again.'
    });
  }

  try {
    console.log(`📡 Processing request — ${parts.length} part(s)...`);

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', geminiResponse.status, errorText);
      return res.status(502).json({
        error: `Gemini API error (${geminiResponse.status})`
      });
    }

    const data = await geminiResponse.json();
    res.json(data);

  } catch (error) {
    console.error('Server Error:', error);
    res.status(503).json({
      error: 'Service temporarily unavailable. Please check your connection and try again.'
    });
  }
});

// ===================== HEALTH CHECK =====================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.3',
    message: 'Resilience Guardian Backend is Running',
    timestamp: new Date().toISOString(),
    gemini: GEMINI_API_KEY ? 'Connected' : 'Not Configured'
  });
});

// ===================== SPA FALLBACK =====================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`\n🌿 ========================================`);
  console.log(`   Resilience Guardian Server Started`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Status: Ready for Ethiopian Farmers`);
  console.log(`   Gemini API: ${GEMINI_API_KEY ? '✅ Connected' : '❌ Missing'}`);
  console.log(`========================================\n`);
});
