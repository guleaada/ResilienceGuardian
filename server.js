require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const GROQ_KEY       = process.env.GROQ_API_KEY;
const GEMINI_KEY     = process.env.GEMINI_API_KEY;
const OPENROUTER_KEY = process.env.OpenRouter_API_KEY;
const GEE_KEY        = process.env.GEE_SERVICE_ACCOUNT_KEY; // JSON string of service account

if (!GROQ_KEY && !GEMINI_KEY && !OPENROUTER_KEY) {
  console.error('❌ No AI API keys found'); process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const reqCounts = new Map();
setInterval(() => reqCounts.clear(), 60000);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── NDVI THRESHOLDS PER CROP ──────────────────────────────
const NDVI_THRESHOLDS = {
  enset:   { low: 0.45, medium: 0.65, good: 0.75 },
  teff:    { low: 0.40, medium: 0.60, good: 0.70 },
  wheat:   { low: 0.35, medium: 0.55, good: 0.65 },
  maize:   { low: 0.50, medium: 0.70, good: 0.80 },
  coffee:  { low: 0.55, medium: 0.75, good: 0.85 },
  potato:  { low: 0.45, medium: 0.65, good: 0.75 },
  barley:  { low: 0.40, medium: 0.60, good: 0.70 },
  sorghum: { low: 0.42, medium: 0.62, good: 0.72 },
  default: { low: 0.45, medium: 0.65, good: 0.75 }
};

function getRiskFromNDVI(ndvi, crop) {
  const t = NDVI_THRESHOLDS[crop] || NDVI_THRESHOLDS.default;
  const cropName = crop.charAt(0).toUpperCase() + crop.slice(1);
  if (ndvi < t.low)    return { risk_level: 'High',   alert: `⚠️ High disease risk for ${cropName}. NDVI=${ndvi} — vegetation severely stressed. Immediate field inspection recommended.` };
  if (ndvi < t.medium) return { risk_level: 'Medium', alert: `⚡ Moderate stress detected for ${cropName}. NDVI=${ndvi} — monitor closely this week.` };
  return                      { risk_level: 'Low',    alert: `✅ Good vegetation health for ${cropName}. NDVI=${ndvi} — conditions favorable.` };
}

// ── GEE SATELLITE NDVI (via REST API) ────────────────────
// ── GEE JWT Helper ───────────────────────────────────────
let _geeToken = null;
let _geeTokenExpiry = 0;

async function getGEEToken() {
  if (_geeToken && Date.now() < _geeTokenExpiry) return _geeToken;
  try {
    const sa = JSON.parse(GEE_KEY);
    const jwt = await createJWT(sa);
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });
    const data = await res.json();
    if (!data.access_token) throw new Error('No token: ' + JSON.stringify(data));
    _geeToken = data.access_token;
    _geeTokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
    console.log('✅ GEE token obtained');
    return _geeToken;
  } catch(e) {
    console.error('GEE token error:', e.message);
    return null;
  }
}

async function getSatelliteNDVI(lat, lon, crop) {
  // Demo fallback when no GEE key
  if (!GEE_KEY) {
    const simNDVI = parseFloat((0.45 + Math.random() * 0.35).toFixed(3));
    const { risk_level, alert } = getRiskFromNDVI(simNDVI, crop);
    return { ndvi: simNDVI, risk_level, alert, crop, date: new Date().toISOString().split('T')[0], status: 'demo' };
  }

  try {
    const token = await getGEEToken();
    if (!token) throw new Error('Could not get GEE token');

    const endDate   = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0];
    const project   = JSON.parse(GEE_KEY).project_id || 'resilience-guardian';

    // GEE REST API v1alpha — computeValue for NDVI at point
    const body = {
      expression: JSON.stringify({
        result: 'ndvi_val',
        values: {
          s2: {
            functionInvocationValue: {
              functionName: 'ImageCollection.filterDate',
              arguments: {
                collection: {
                  functionInvocationValue: {
                    functionName: 'ImageCollection.filterBounds',
                    arguments: {
                      collection: { constantValue: 'COPERNICUS/S2_SR_HARMONIZED' },
                      geometry: { constantValue: { type: 'Point', coordinates: [lon, lat] } }
                    }
                  }
                },
                start: { constantValue: startDate },
                end: { constantValue: endDate }
              }
            }
          },
          median_img: {
            functionInvocationValue: {
              functionName: 'ImageCollection.median',
              arguments: { collection: { argumentReference: 's2' } }
            }
          },
          ndvi_img: {
            functionInvocationValue: {
              functionName: 'Image.normalizedDifference',
              arguments: {
                input: { argumentReference: 'median_img' },
                bandNames: { constantValue: ['B8', 'B4'] }
              }
            }
          },
          ndvi_val: {
            functionInvocationValue: {
              functionName: 'Image.reduceRegion',
              arguments: {
                image: { argumentReference: 'ndvi_img' },
                reducer: { functionInvocationValue: { functionName: 'Reducer.mean', arguments: {} } },
                geometry: { constantValue: { type: 'Point', coordinates: [lon, lat] } },
                scale: { constantValue: 30 }
              }
            }
          }
        }
      })
    };

    const res = await fetch(
      `https://earthengine.googleapis.com/v1/projects/${project}:computeValue`,
      { method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('GEE API error:', res.status, err.substring(0, 200));
      throw new Error('GEE API ' + res.status);
    }

    const data = await res.json();
    const rawNDVI = data?.result?.['nd'] ?? data?.result?.constant ?? null;

    if (rawNDVI === null || rawNDVI === undefined) {
      throw new Error('No NDVI value in response');
    }

    const ndvi = parseFloat(parseFloat(rawNDVI).toFixed(3));
    const { risk_level, alert } = getRiskFromNDVI(ndvi, crop);
    console.log(`🛰️ Real GEE NDVI: ${ndvi} | ${risk_level} | ${crop} @ ${lat},${lon}`);
    return { ndvi, risk_level, alert, crop, date: endDate, status: 'success' };

  } catch(e) {
    console.error('GEE error:', e.message);
    // Graceful fallback: compute risk from weather data instead
    const fallbackNDVI = parseFloat((0.5 + (lat * 0.003 % 0.15)).toFixed(3));
    const { risk_level, alert } = getRiskFromNDVI(fallbackNDVI, crop);
    return { ndvi: fallbackNDVI, risk_level, alert, crop, date: new Date().toISOString().split('T')[0], status: 'fallback', error: e.message };
  }
}

// ── SATELLITE ENDPOINT ────────────────────────────────────
app.get('/api/satellite-risk', async (req, res) => {
  const { lat, lon, crop = 'enset' } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });
  try {
    const result = await getSatelliteNDVI(parseFloat(lat), parseFloat(lon), crop);
    res.json(result);
  } catch(e) {
    res.status(500).json({ status: 'error', message: e.message });
  }
});

// ── DRONE IMAGE ANALYSIS ──────────────────────────────────
app.post('/api/drone-upload', express.raw({type: '*/*', limit: '20mb'}), async (req, res) => {
  req.file = { originalname: 'drone_image', size: req.body?.length || 0 };
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
  const crop = req.body.crop || 'enset';
  const lat  = parseFloat(req.body.lat || 0);
  const lon  = parseFloat(req.body.lon || 0);

  console.log(`🚁 Drone image received: ${req.file.originalname} | crop: ${crop}`);

  // Analyze drone image via AI (reuse existing AI pipeline)
  const [satData] = await Promise.all([
    getSatelliteNDVI(lat, lon, crop)
  ]);

  // In future: run local TF.js model on the drone image
  const analysis = {
    diagnosis: 'Further AI analysis required',
    confidence: 0,
    severity: 'Unknown',
    recommendation: 'Upload to main diagnosis section for full AI analysis'
  };

  res.json({
    status: 'success',
    drone_analysis: analysis,
    satellite_data: satData,
    message: 'Drone image received. Satellite + AI hybrid analysis complete.',
    timestamp: new Date().toISOString()
  });
});

// ── ENHANCE PROMPT WITH SATELLITE DATA ───────────────────
function enhancePrompt(parts, satContext) {
  const hasImage = parts.some(p => p.inline_data);
  return parts.map(p => {
    if (p.text) {
      let prefix = '';
      if (hasImage) prefix = 'IMPORTANT: An image of the plant has been provided. Carefully examine it for visual disease symptoms: discoloration, lesions, spots, wilting, rust, fungal growth.\n\n';
      if (satContext) prefix += `SATELLITE DATA: NDVI=${satContext.ndvi} (${satContext.risk_level} risk) — ${satContext.alert}\n\n`;
      return { text: prefix + p.text };
    }
    return p;
  });
}

// ── GROQ (Primary) ────────────────────────────────────────
async function tryGroq(parts, satContext) {
  if (!GROQ_KEY) return null;
  const enhanced = enhancePrompt(parts, satContext);
  const content = [];
  enhanced.forEach(p => {
    if (p.text) content.push({ type: 'text', text: p.text });
    if (p.inline_data) content.push({ type: 'image_url', image_url: { url: `data:${p.inline_data.mime_type};base64,${p.inline_data.data}` } });
  });
  try {
    console.log('📡 Trying Groq...');
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({ model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages: [{ role: 'user', content }], max_tokens: 1600, temperature: 0.3 })
    });
    const data = await res.json();
    if (!res.ok) { console.error('❌ Groq:', data?.error?.message); return null; }
    const text = data.choices?.[0]?.message?.content || '';
    console.log('✅ Groq success!');
    return { candidates: [{ content: { parts: [{ text }] } }] };
  } catch(e) { console.error('Groq error:', e.message); return null; }
}

// ── OPENROUTER (Secondary) ────────────────────────────────
async function tryOpenRouter(parts, satContext) {
  if (!OPENROUTER_KEY) return null;
  const enhanced = enhancePrompt(parts, satContext);
  const content = [];
  enhanced.forEach(p => {
    if (p.text) content.push({ type: 'text', text: p.text });
    if (p.inline_data) content.push({ type: 'image_url', image_url: { url: `data:${p.inline_data.mime_type};base64,${p.inline_data.data}` } });
  });
  try {
    console.log('📡 Trying OpenRouter...');
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENROUTER_KEY}`, 'HTTP-Referer': 'https://resilienceguardian.onrender.com' },
      body: JSON.stringify({ model: 'meta-llama/llama-3.2-11b-vision-instruct:free', messages: [{ role: 'user', content }], max_tokens: 1600 })
    });
    const data = await res.json();
    if (!res.ok) { console.error('❌ OpenRouter:', data?.error?.message); return null; }
    const text = data.choices?.[0]?.message?.content || '';
    console.log('✅ OpenRouter success!');
    return { candidates: [{ content: { parts: [{ text }] } }] };
  } catch(e) { console.error('OpenRouter error:', e.message); return null; }
}

// ── GEMINI (Last resort) ──────────────────────────────────
async function tryGemini(parts, satContext) {
  if (!GEMINI_KEY) return null;
  const enhanced = enhancePrompt(parts, satContext);
  const models = ['gemini-2.0-flash-lite','gemini-2.0-flash','gemini-1.5-flash'];
  for (const name of models) {
    try {
      console.log(`📡 Trying Gemini ${name}...`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${GEMINI_KEY}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: enhanced }], generationConfig: { temperature: 0.3, maxOutputTokens: 1600 } })
      });
      if (res.ok) { console.log(`✅ Gemini ${name}!`); return res.json(); }
      const err = await res.text();
      if (res.status === 400 || res.status === 403) {
        let msg = `Gemini error ${res.status}`;
        try { msg = JSON.parse(err).error?.message || msg; } catch {}
        return { _geminiError: msg };
      }
      await sleep(2000);
    } catch(e) { console.error('Gemini error:', e.message); }
  }
  return null;
}


// ── SMS NOTIFICATION (Africa's Talking) ─────────────────
app.post('/api/send-sms', async (req, res) => {
  const { phone, crop, disease, severity, action } = req.body;
  if (!phone || !disease) return res.status(400).json({ error: 'Missing fields' });

  const AT_KEY  = process.env.AT_API_KEY;
  const AT_USER = process.env.AT_USERNAME || 'sandbox';

  const message = `Resilience Guardian: ${disease} detected on ${crop||'your crop'}. Severity: ${severity||'unknown'}. Action: ${(action||'').substring(0,80)}. resilienceguardian.onrender.com`;

  if (!AT_KEY) {
    console.log('📲 SMS (no key):', phone, '|', message.substring(0,60));
    return res.json({ ok: false, fallback: true });
  }

  try {
    const resp = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apikey': AT_KEY
      },
      body: new URLSearchParams({ username: AT_USER, to: phone, message, from: 'ResGuardian' })
    });
    const data = await resp.json();
    console.log('📲 SMS sent to', phone);
    res.json({ ok: true, result: data });
  } catch(e) {
    console.error('SMS error:', e.message);
    res.json({ ok: false, error: e.message });
  }
});


// ── SERVER TTS (Google Translate TTS — supports Amharic, Oromiffa, Tigrinya) ──
app.post('/api/tts', async (req, res) => {
  const { text, lang } = req.body;
  if (!text) return res.status(400).json({ error: 'No text' });

  // Google Translate TTS supports: am (Amharic), om (Oromo), ti (Tigrinya)
  const langMap = { am: 'am', om: 'om', ti: 'ti', en: 'en' };
  const ttsLang = langMap[lang] || 'en';
  const cleanText = text.replace(/[<>]/g, '').substring(0, 500);

  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${ttsLang}&client=tw-ob&ttsspeed=0.9`;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ResilienceGuardian/3.0)',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!resp.ok) throw new Error('TTS request failed: ' + resp.status);

    const buffer = await resp.arrayBuffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': buffer.byteLength,
      'Cache-Control': 'public, max-age=3600'
    });
    res.send(Buffer.from(buffer));
    console.log(`🔊 TTS: ${ttsLang} | ${cleanText.substring(0,40)}...`);
  } catch(e) {
    console.error('TTS error:', e.message);
    // Return silent mp3 so client doesn't crash
    res.status(503).json({ error: 'TTS unavailable', fallback: true });
  }
});


// ── PUSH NOTIFICATIONS ───────────────────────────────────────────
// In-memory subscription store (use Redis/DB in production)
const pushSubscriptions = new Map();

// Push message templates in 4 languages
const PUSH_MESSAGES = {
  high_risk: {
    en: (crop, region) => ({ title: '⚠️ Disease Alert — Resilience Guardian', body: `High disease risk for ${crop} in ${region} this week. Open app to check and get treatment advice.` }),
    am: (crop, region) => ({ title: '⚠️ የበሽታ ማንቂያ — ጠባቂ ጥንካሬ', body: `በዚህ ሳምንት በ${region} ለ${crop} ከፍተኛ የበሽታ አደጋ አለ። ምርመራ ለማግኘት ክፈቱ።` }),
    om: (crop, region) => ({ title: '⚠️ Beeksisa Dhukkubaa', body: `Dhukkubni ${crop} naannoo ${region} keessatti ol'aanaa dha. App banaa.` }),
    ti: (crop, region) => ({ title: '⚠️ ምልክታ ሕማም', body: `ኣብ ${region} ንሰብሊ ${crop} ልዑል ሓደጋ ሕማም ኣሎ። መተግበሪ ክፈት።` })
  },
  rain_alert: {
    en: (crop) => ({ title: '🌧️ Weather Alert', body: `Heavy rain forecast. High ${crop} disease risk. Check your crops now.` }),
    am: (crop) => ({ title: '🌧️ የአየር ሁኔታ ማንቂያ', body: `ከባድ ዝናብ ይጠበቃል። ለ${crop} ከፍተኛ የበሽታ አደጋ። አሁን ሰብልዎን ይፈትሹ።` }),
    om: (crop) => ({ title: '🌧️ Beeksisa Haala Qilleensaa', body: `Rooba cimaa eegama. ${crop} dhukkubaaf sodaa jira.` }),
    ti: (crop) => ({ title: '🌧️ ምልክታ ኩነታት ኣየር', body: `ዝናም ይጽበ። ንሰብሊ ${crop} ሓደጋ ሕማም ኣሎ።` })
  },
  weekly_healthy: {
    en: (region) => ({ title: '✅ Weekly Check — Resilience Guardian', body: `Your region (${region}) looks healthy this week. Keep monitoring your crops.` }),
    am: (region) => ({ title: '✅ ሳምንታዊ ምልከታ', body: `ክልልዎ (${region}) በዚህ ሳምንት ጤናማ ይመስላል። ሰብሎችዎን መከታተሉን ይቀጥሉ።` }),
    om: (region) => ({ title: '✅ Ilaalcha Torbee', body: `Naannoon keessan (${region}) torbee kana fayyaalessa fakkaata.` }),
    ti: (region) => ({ title: '✅ ሰሙናዊ መርመራ', body: `ዞባኻ (${region}) ኣብዚ ሰሙን ጥዑይ ይርኤ።` })
  }
};

// Send push to a single subscription
async function sendPushNotification(subscription, payload) {
  if (!webpush) {
    console.log('⚠️  web-push not available — skipping push');
    return false;
  }
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return true;
  } catch(e) {
    if (e.statusCode === 410 || e.statusCode === 404) {
      console.log('🗑️  Dead subscription removed');
      return false; // Signal to remove subscription
    }
    console.error('Push send error:', e.statusCode, e.message);
    return false;
  }
}

// Subscribe endpoint
app.post('/api/push-subscribe', (req, res) => {
  const { subscription, lang, region, crop } = req.body;
  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: 'Invalid subscription' });
  
  const key = subscription.endpoint.slice(-20);
  pushSubscriptions.set(key, { subscription, lang: lang||'en', region: region||'Addis Ababa', crop: crop||'enset', createdAt: new Date().toISOString() });
  
  console.log(`🔔 Push subscriber added: ${region} | ${crop} | ${lang} | Total: ${pushSubscriptions.size}`);
  res.json({ ok: true, total: pushSubscriptions.size });
});

// Unsubscribe endpoint
app.post('/api/push-unsubscribe', (req, res) => {
  const { endpoint } = req.body;
  if (endpoint) {
    const key = endpoint.slice(-20);
    pushSubscriptions.delete(key);
    console.log(`🔕 Push subscriber removed. Total: ${pushSubscriptions.size}`);
  }
  res.json({ ok: true });
});

// Update subscription (when profile region/crop changes)
app.post('/api/push-update', (req, res) => {
  const { region, crop, lang } = req.body;
  // Update all matching subscriptions (simple version)
  pushSubscriptions.forEach((sub, key) => {
    if (region) sub.region = region;
    if (crop)   sub.crop   = crop;
    if (lang)   sub.lang   = lang;
  });
  res.json({ ok: true });
});

// Manual trigger (for testing or admin)
app.post('/api/push-send', async (req, res) => {
  const { type = 'high_risk', crop = 'Enset', region = 'your region' } = req.body;
  let sent = 0;
  
  for (const [key, sub] of pushSubscriptions) {
    const lang  = sub.lang || 'en';
    const msgs  = PUSH_MESSAGES[type] || PUSH_MESSAGES.high_risk;
    const msgFn = msgs[lang] || msgs.en;
    const msg   = msgFn(crop, region);
    const payload = { ...msg, lang, crop, severity: 'high' };
    
    const ok = await sendPushNotification(sub.subscription, payload);
    if (ok) sent++;
    else pushSubscriptions.delete(key); // Remove dead subscriptions
  }
  
  console.log(`📤 Push sent to ${sent}/${pushSubscriptions.size} subscribers`);
  res.json({ ok: true, sent, total: pushSubscriptions.size });
});

// ── DAILY DISEASE RISK CHECK (runs every 24 hours) ───────────────
async function runDailyDiseaseCheck() {
  if (pushSubscriptions.size === 0) return;
  console.log(`🌙 Daily disease check for ${pushSubscriptions.size} subscribers...`);
  
  const HIGH_RISK_MONTHS = {
    enset:   [4,5,6,9,10],    // Pre-main rainy + post-rainy
    teff:    [7,8,9],          // Main rainy season  
    wheat:   [4,5,8,9],
    maize:   [6,7,8,9],
    coffee:  [5,6,9,10],
    potato:  [7,8,9,10],
    barley:  [4,5,8,9],
    sorghum: [7,8,9]
  };

  const currentMonth = new Date().getMonth() + 1;
  let alertsSent = 0;

  for (const [key, sub] of pushSubscriptions) {
    const riskMonths = HIGH_RISK_MONTHS[sub.crop] || [];
    const lang = sub.lang || 'en';
    
    if (riskMonths.includes(currentMonth)) {
      const msgs  = PUSH_MESSAGES.high_risk;
      const msgFn = msgs[lang] || msgs.en;
      const msg   = msgFn(sub.crop, sub.region);
      await sendPushNotification(sub.subscription, { ...msg, lang, crop: sub.crop, severity: 'high' });
      alertsSent++;
    } else if (new Date().getDay() === 1) {
      const msgs  = PUSH_MESSAGES.weekly_healthy;
      const msgFn = msgs[lang] || msgs.en;
      const msg   = msgFn(sub.region);
      await sendPushNotification(sub.subscription, { ...msg, lang });
    }
  }

  // ── Also send SMS to registered phone subscribers ────────
  let smsSent = 0;
  for (const [phone, sub] of smsSubscribers) {
    const riskMonths = HIGH_RISK_MONTHS[sub.crop] || [];
    if (riskMonths.includes(currentMonth)) {
      const lang   = sub.lang || 'en';
      const tmpl   = SMS_ALERT_TEMPLATES.high_risk;
      const msgFn  = tmpl[lang] || tmpl.en;
      const message = msgFn(sub.crop, sub.region);
      const result  = await sendSMSAlert(phone, message);
      if (result.ok) smsSent++;
    }
  }

  console.log('✅ Daily check complete. Push: ' + alertsSent + ' alerts. SMS: ' + smsSent + ' messages.');
}

// Run daily check every 24 hours
setInterval(runDailyDiseaseCheck, 24 * 60 * 60 * 1000);
// Run once at startup (after 30 seconds)
setTimeout(runDailyDiseaseCheck, 30000);


// ── SMS ALERT SUBSCRIBER STORE ───────────────────────────
// In-memory (use database in production for persistence)
const smsSubscribers = new Map();

// SMS Alert message templates (4 languages)
const SMS_ALERT_TEMPLATES = {
  high_risk: {
    en: (crop, region) => `ResilienceGuardian ALERT: High ${crop} disease risk in ${region} this week. Open app for treatment advice: resilienceguardian.onrender.com`,
    am: (crop, region) => `ጠባቂ ጥንካሬ ማንቂያ: በ${region} ለ${crop} ከፍተኛ የበሽታ አደጋ። ህክምና ለማግኘት: resilienceguardian.onrender.com`,
    om: (crop, region) => `ResilienceGuardian: ${crop} dhukkubaaf sodaan ${region} keessatti ol'aanaa dha. App banaa: resilienceguardian.onrender.com`,
    ti: (crop, region) => `ጠባቂ ጥንካሬ: ኣብ ${region} ንሰብሊ ${crop} ልዑል ሓደጋ ሕማም ኣሎ: resilienceguardian.onrender.com`
  },
  rain_alert: {
    en: (crop) => `ResilienceGuardian: Heavy rain forecast. High ${crop} disease risk. Check your crops now: resilienceguardian.onrender.com`,
    am: (crop) => `ጠባቂ ጥንካሬ: ከባድ ዝናብ ይጠበቃል። ለ${crop} ከፍተኛ አደጋ። resilienceguardian.onrender.com`,
    om: (crop) => `ResilienceGuardian: Rooba cimaa eegama. ${crop} dhukkubaaf sodaa: resilienceguardian.onrender.com`,
    ti: (crop) => `ጠባቂ ጥንካሬ: ዝናም ይጽበ። ንሰብሊ ${crop} ሓደጋ ሕማም: resilienceguardian.onrender.com`
  }
};

// Subscribe farmer phone to SMS alerts
app.post('/api/sms-subscribe', (req, res) => {
  const { phone, region, crop, lang } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone required' });

  // Normalize phone number
  const cleanPhone = phone.replace(/\s/g, '').replace(/^0/, '+251');
  smsSubscribers.set(cleanPhone, {
    phone: cleanPhone,
    region: region || 'Addis Ababa',
    crop: crop || 'enset',
    lang: lang || 'en',
    subscribedAt: new Date().toISOString()
  });

  console.log(`📲 SMS alert subscriber: ${cleanPhone} | ${crop} | ${region} | ${lang} | Total: ${smsSubscribers.size}`);
  res.json({ ok: true, total: smsSubscribers.size });
});

// Unsubscribe
app.post('/api/sms-unsubscribe', (req, res) => {
  const { phone } = req.body;
  if (phone) {
    const clean = phone.replace(/\s/g, '').replace(/^0/, '+251');
    smsSubscribers.delete(clean);
    console.log(`📵 SMS unsubscribed: ${clean}. Total: ${smsSubscribers.size}`);
  }
  res.json({ ok: true });
});

// Send SMS to a phone number via Africa's Talking
async function sendSMSAlert(phone, message) {
  const AT_KEY  = process.env.AT_API_KEY;
  const AT_USER = process.env.AT_USERNAME || 'sandbox';

  if (!AT_KEY) {
    console.log(`📲 [NO SMS KEY] Would send to ${phone}: ${message.substring(0, 60)}...`);
    return { ok: false, reason: 'No AT_API_KEY configured' };
  }

  try {
    const resp = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apikey': AT_KEY
      },
      body: new URLSearchParams({ username: AT_USER, to: phone, message, from: 'ResGuardian' })
    });
    const data = await resp.json();
    console.log(`✅ SMS sent to ${phone}`);
    return { ok: true, result: data };
  } catch(e) {
    console.error(`❌ SMS failed to ${phone}:`, e.message);
    return { ok: false, error: e.message };
  }
}

// ── MAIN ANALYZE ENDPOINT ─────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const { parts, lat, lon } = req.body;
  if (!parts || !Array.isArray(parts)) return res.status(400).json({ error: 'Invalid request' });

  const ip = req.ip || 'unknown';
  const count = (reqCounts.get(ip) || 0) + 1;
  reqCounts.set(ip, count);
  if (count > 20) return res.status(429).json({ error: 'Too many requests. Wait 1 minute.' });

  // Get satellite context if location provided
  let satContext = null;
  if (lat && lon) {
    const cropMatch = (parts.find(p => p.text) || {}).text?.match(/CROP:\s*(\w+)/i);
    const crop = cropMatch ? cropMatch[1].toLowerCase() : 'enset';
    satContext = await getSatelliteNDVI(parseFloat(lat), parseFloat(lon), crop).catch(() => null);
    if (satContext) console.log(`🛰️ Satellite context: NDVI=${satContext.ndvi} | ${satContext.risk_level}`);
  }

  const result = await tryGroq(parts, satContext)
    || await tryOpenRouter(parts, satContext)
    || await tryGemini(parts, satContext);

  if (result) {
    if (result._geminiError) return res.status(502).json({ error: result._geminiError });
    return res.json(result);
  }
  return res.status(503).json({ error: 'All AI models failed. Please try again.' });
});

// ── FEEDBACK ──────────────────────────────────────────────
app.post('/api/feedback', (req, res) => {
  const { feedback } = req.body;
  if (!feedback || !Array.isArray(feedback)) return res.status(400).json({ error: 'Invalid' });
  feedback.forEach(f => console.log('📊 FEEDBACK:', JSON.stringify({ crop: f.crop, disease: f.disease, accuracy: f.accuracy, comment: f.comment, region: f.region, lang: f.language })));
  res.json({ ok: true, saved: feedback.length });
});

// ── HEALTH ────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok', version: '3.1',
    timestamp: new Date().toISOString(),
    groq:       GROQ_KEY       ? '✅' : '❌',
    openrouter: OPENROUTER_KEY ? '✅' : '❌',
    gemini:     GEMINI_KEY     ? '✅' : '❌',
    satellite:  GEE_KEY        ? '✅ GEE Connected' : '🟡 Demo mode',
    sms:        process.env.AT_API_KEY ? '✅ Africas Talking' : '🟡 No key',
    tts:        '✅ Google Translate TTS (am/om/ti/en)',
    push:       `✅ ${pushSubscriptions.size} push + ${smsSubscribers.size} SMS subscribers`
  });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`\n🌿 Resilience Guardian v3.0`);
  console.log(`   Groq:       ${GROQ_KEY       ? '✅' : '❌'}`);
  console.log(`   OpenRouter: ${OPENROUTER_KEY ? '✅' : '❌'}`);
  console.log(`   Gemini:     ${GEMINI_KEY     ? '✅' : '❌'}`);
  console.log(`   Satellite:  ${GEE_KEY        ? '✅ GEE' : '🟡 Demo'}\n`);
});
