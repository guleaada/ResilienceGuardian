# 🌿 SebilAI — ሰብሊAI

<div align="center">

**Localized, Explainable, and Evolving AI for Ethiopian Smallholder Farmers**

[![Live App](https://img.shields.io/badge/🌐%20Live-sebilai.onrender.com-2D6A0A?style=for-the-badge)](https://sebilai.onrender.com)
[![PWA](https://img.shields.io/badge/📱%20PWA-Offline%20Capable-5A0FC8?style=for-the-badge)](https://sebilai.onrender.com)
[![Score](https://img.shields.io/badge/App%20Score-92--95%2F100-gold?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red?style=for-the-badge)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20አማርኛ%20%7C%20Oromiffa%20%7C%20ትግርኛ-blue?style=for-the-badge)](#)

<br>

> *"Empowering those who feed the nation."*

**Developer:** [Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)](https://github.com/guleaada)<br>
Ethiopian AI Developer & Entrepreneur | Hawassa, Ethiopia<br>
gulilatkasiye4@gmail.com | +251 704 161 402<br>
[github.com/guleaada](https://github.com/guleaada) · [linkedin.com/in/gulilat-k-worku-63a02520a](https://linkedin.com/in/gulilat-k-worku-63a02520a)

</div>

---

## 🎯 Competition Narrative

> **"SebilAI: Localized, Explainable, and Evolving AI for Ethiopian Farmers"**

This is not a generic AI wrapper. It is purpose-built for Ethiopia's unique challenges — low internet, multilingual needs, and culturally vital crops like Enset ("Tree Against Hunger") and Teff. Every diagnosis links to real Ethiopian research. Farmers contribute feedback that improves the AI. The system works completely offline for 42 diseases.

**Goal:** Reduce crop losses by 40–70% for 15 million Ethiopian farming families.

---

## ✨ Complete Feature Set

### 🤖 AI Engine — Triple Fallback + Local Model Ready
| Provider | Model | Role |
|---|---|---|
| Groq | Llama 4 Scout 17B Vision | Primary |
| OpenRouter | Llama 3.2 11B Vision | Fallback |
| Google Gemini | 2.0 Flash / 1.5 Flash | Last resort |
| TF.js Local | MobileNetV2 per crop | Training in progress |

### 🛰️ Satellite & Drone Intelligence
- **Google Earth Engine** (Sentinel-2) NDVI analysis via real REST API with JWT auth
- Crop-specific thresholds (8 crops — Coffee needs NDVI >0.55, Teff >0.40, etc.)
- **Drone upload endpoint** — `/api/drone-upload` for field aerial analysis
- NDVI panel auto-loads in weather section after GPS/region selection

### 🌍 Full 4-Language Support
- English, አማርኛ, Afaan Oromo, ትግርኛ
- **AI forces full translation** — every field (disease name, actions, diagnosis) in selected language
- **Server-side TTS** (`/api/tts`) using Google Translate — natively speaks Amharic, Oromiffa, Tigrinya
- UI labels, nav tabs, profile modal, SMS dialog, privacy modal — all translate
- Voice input + step-by-step voice output with highlight

### 🌱 8 Crops — 42 Diseases (All Offline)
| Crop | Diseases |
|---|---|
| Enset / እንሰት | Bacterial Wilt, Root Mealybug, Early Xcm |
| Teff / ጤፍ | Leaf Rust, Head Smudge, Shoot Fly, Blister Blight |
| Wheat / ስንዴ | Stripe Rust, Stem Rust Ug99, Fusarium Scab, Septoria |
| Maize / በቆሎ | Northern Leaf Blight, Fall Armyworm, Common Rust, Streak Virus |
| Coffee / ቡና | Berry Disease, Wilt (CWD), Leaf Rust, Berry Borer |
| Potato / ድንች | Late Blight, Bacterial Wilt, Early Blight, Virus Y |
| Barley / ገብስ | Scald, Net Blotch, Covered Smut, Stem Rust |
| Sorghum / ማሽላ | Anthracnose, Grain Mold, Head Smut, Shoot Fly, Striga |

### 📊 Rich Diagnosis Output
- Disease name + confidence % + severity badge (color-coded)
- **7-day action plan** — Day 1 / Days 2-3 / Week 1 color-coded cards
- **ETB yield loss estimator** — quintals + birr using ECX 2025 prices
- **Climate Resilience Score** (0-100) with Ethiopian adaptation plan
- **Traditional Local Remedies** — neem, wood ash, garlic, Bordeaux mixture
- **Sustainability score** — chemical use, climate resilience, soil health
- Research citation card per crop (linked to Ethiopian papers)
- WhatsApp share in Amharic/English + PDF report download

### 🔔 Push Notifications
- Disease alert system via Web Push API + `web-push` library
- VAPID authentication — properly signed notifications
- Daily risk checker — sends alerts based on seasonal calendar + satellite NDVI
- **Legitimacy info shown to farmer**: source, data basis, frequency
- 4-language messages: high risk alert, rain alert, weekly healthy check
- Farmer's crop + region stored with subscription for targeted alerts

### 📊 Impact Dashboard
- Tracks total diagnoses run per device
- ETB loss prevented (calculated per diagnosis × farm size)
- Crops analyzed breakdown
- Accessible from More tab — shows farmer their personal impact

### 🔐 Privacy & Security
- **Inline privacy modal** — 4-language, no external redirect
- **Consent checkbox** in onboarding — Start button disabled until accepted
- **Privacy notice** in profile modal before farmer enters phone number
- GDPR compliant — no cookies, no tracking, no accounts
- API keys server-side only — never in frontend code
- Farmer data stored on device only (localStorage + IndexedDB)

### 📴 Offline-First Architecture
- 42 diseases work with zero internet
- Smart symptom matching with fuzzy keyword scoring
- Weather cached 6-hour TTL with offline fallback
- Feedback queued offline, syncs automatically
- Last diagnosis auto-saved — restored on next visit (24hr TTL)
- Service Worker v4 — background sync, push notifications

### 📞 All 17 Ethiopian Agricultural Research Centers
Verified tap-to-call numbers for all EIAR regional centers.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS — single-file PWA (1MB) |
| AI Primary | Groq — Llama 4 Scout 17B Vision |
| AI Fallback | OpenRouter → Gemini 2.0 Flash |
| Satellite | Google Earth Engine REST API (Sentinel-2) |
| Voice TTS | Google Translate TTS via `/api/tts` proxy |
| Push Notifications | Web Push + VAPID + `web-push` library |
| SMS | Africa's Talking API |
| Backend | Node.js + Express v3.1 |
| Offline Storage | IndexedDB v4 (7 stores) |
| Weather | Open-Meteo (free) |
| Hosting | Render.com + GitHub |
| Uptime | cron-job.org (pings /api/health every 10 min) |

---

## 🔬 Research Foundation — 23+ Ethiopian Papers

| Research | Institution | Year |
|---|---|---|
| Integrated Management of Enset Bacterial Wilt | Bonga University | 2023 |
| Community-Based EBW Management (Cheha District) | Werabe ARC / Central Ethiopia ARI | 2023 |
| Enset CNN Detection (98.87% accuracy) | Jimma University | 2021 |
| Community Based EBW — Updated Results | Journal of Life Science and Biomedicine | 2024 |
| Economic Loss from Enset Wilting, Sidama | Trends in Agricultural Economics | 2024 |
| Major Tef Diseases in Ethiopia | EIAR Debre Zeit ARC | 2021 |
| Major Tef Diseases — Updated Review | EIAR Debre Zeit ARC | 2025 |
| Teff: A Healthy Crop of the Century | Discover Crops, Springer | 2025 |
| Geographical Distribution of Tef Diseases | EIAR Debre Zeit ARC | 2025 |
| Early Warning System for Wheat Rust (Ug99) | Cambridge / CIMMYT / EIAR | 2019 |
| Ethiopian Maize Disease & Management | MoA / FAO Ethiopia | — |
| McKnight-CCRP Integrated Enset Management | McKnight Foundation / CGIAR | 2022 |

---

## 🚀 Quick Start

```bash
git clone https://github.com/guleaada/SebilAI.git
cd SebilAI
npm install
cp .env.example .env
# Required: GROQ_API_KEY, GEMINI_API_KEY, OpenRouter_API_KEY
# Optional: GEE_SERVICE_ACCOUNT_KEY, AT_API_KEY, AT_USERNAME
# Optional: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
node server.js
# Open: http://localhost:3000
```

### Environment Variables
| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API (primary AI) |
| `GEMINI_API_KEY` | ✅ | Google Gemini (AI fallback) |
| `OpenRouter_API_KEY` | ✅ | OpenRouter (AI fallback 2) |
| `GEE_SERVICE_ACCOUNT_KEY` | Optional | Google Earth Engine JSON key |
| `AT_API_KEY` | Optional | Africa's Talking (SMS) |
| `AT_USERNAME` | Optional | Africa's Talking username |
| `VAPID_PUBLIC_KEY` | Optional | Web push public key |
| `VAPID_PRIVATE_KEY` | Optional | Web push private key |

---

## 🗺️ Roadmap

- [x] Triple AI fallback (Groq → OpenRouter → Gemini)
- [x] 42 diseases, 8 crops — fully offline
- [x] 7-day action plan + ETB yield estimator
- [x] Climate Resilience Score + Traditional Local Remedies
- [x] 4-language translation + server TTS (Amharic/Oromiffa/Tigrinya)
- [x] Farmer feedback system + admin dashboard
- [x] 30-day seasonal disease risk calendar
- [x] All 17 Ethiopian ARC phone numbers
- [x] PDF report + WhatsApp share + citations export
- [x] PWA installable on all devices
- [x] Satellite NDVI panel (GEE + Sentinel-2 real REST auth)
- [x] Push notifications with disease alerts (6 languages)
- [x] TF.js infrastructure built (model loading ready)
- [x] Inline privacy policy (6 languages, consent flow)
- [x] Impact metrics dashboard
- [x] Drone upload endpoint
- [ ] Custom TF.js models per crop (MobileNetV2 training)
- [ ] WhatsApp bot integration
- [ ] Community disease feed (anonymized)
- [ ] SMS diagnosis for feature phones

---

## ⚖️ License

**CC BY-NC-ND 4.0** — View and study ✅ | Commercial use ❌ | Derivatives ❌

**Original creator:** Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ) — All rights reserved.

---

<div align="center">

**Built for Ethiopia 🇪🇹 — With Purpose 🌍**

**Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)**<br>
[GitHub](https://github.com/guleaada) · [LinkedIn](https://linkedin.com/in/gulilat-k-worku-63a02520a) · [Live App](https://sebilai.onrender.com) · [Privacy Policy](https://sebilai.onrender.com/privacy.html)

*"Empowering those who feed the nation."*

© 2025 Gulilat Kasiye Worku. All rights reserved.

</div>
