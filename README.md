# 🌿 SebilAI — ሰብሊAI

<div align="center">

**Localized, Explainable, and Evolving AI for Ethiopian Smallholder Farmers**

[![Live App](https://img.shields.io/badge/🌐%20Live-sebilai.com-2D6A0A?style=for-the-badge)](https://sebilai.com)
[![PWA](https://img.shields.io/badge/📱%20PWA-Offline%20Capable-5A0FC8?style=for-the-badge)](https://sebilai.com)
[![Score](https://img.shields.io/badge/App%20Score-46%2F46%20Checks-gold?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red?style=for-the-badge)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20አማርኛ%20%7C%20Oromiffa%20%7C%20ትግርኛ%20%7C%20Soomaali%20%7C%20Qafar-blue?style=for-the-badge)](#)

<br>

> *"Empowering those who feed the nation."*
> 
> **Sebil (ሰብሊ) = Crops in Amharic. SebilAI = AI for Ethiopian Crops.**

**Developer:** [Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)](https://github.com/guleaada)<br>
Ethiopian AI Developer & Entrepreneur | Hawassa, Ethiopia<br>
gulilatkasiye4@gmail.com | +251 704 161 402<br>
[github.com/guleaada](https://github.com/guleaada) · [linkedin.com/in/gulilat-k-worku-63a02520a](https://linkedin.com/in/gulilat-k-worku-63a02520a)

**🌐 Live at: [sebilai.com](https://sebilai.com)**

</div>

---

## 🎯 Competition Narrative

> **"SebilAI: Localized, Explainable, and Evolving AI for Ethiopian Farmers"**

This is not a generic AI wrapper. It is purpose-built for Ethiopia's unique challenges — low internet, multilingual needs, and culturally vital crops like Enset ("Tree Against Hunger") and Teff. Every diagnosis links to real Ethiopian research. Farmers contribute feedback that improves the AI. The system works completely offline for 42 diseases across 8 crops.

**Goal:** Reduce crop losses by 40–70% for 15 million Ethiopian farming families.

---

## ✨ Complete Feature Set

### 🤖 AI Engine — Triple Fallback + Local Model Ready
| Provider | Model | Role |
|---|---|---|
| Groq | Llama 4 Scout 17B Vision | Primary |
| OpenRouter | Llama 3.2 11B Vision | Fallback |
| Google Gemini | 2.0 Flash / 1.5 Flash | Last resort |
| TF.js Local | MobileNetV2 per crop | Infrastructure ready — training in progress |

### 🛰️ Satellite & Drone Intelligence
- **Google Earth Engine** (Sentinel-2) NDVI analysis via real REST API with JWT auth + token caching
- Crop-specific risk thresholds (8 crops — Coffee >0.55, Teff >0.40, etc.)
- **Drone upload endpoint** — `/api/drone-upload` using Groq Vision for aerial field analysis
- NDVI panel auto-loads after GPS/region selection

### 🌍 Full 6-Language Support
| Language | Code | Speakers in Ethiopia |
|---|---|---|
| English | en | Official language |
| አማርኛ Amharic | am | 32M speakers |
| Afaan Oromo | om | 40M speakers |
| ትግርኛ Tigrinya | ti | 7M speakers |
| Soomaali Somali | so | 6M speakers — **NEW** |
| Qafar Afar | aa | 2M speakers — **NEW** |

- **AI forces full translation** — every diagnosis field in selected language
- **Server-side TTS** (`/api/tts`) — natively speaks all 6 languages (Afar uses Somali TTS)
- **Voice input** — English + Somali native STT; Amharic/Oromiffa/Tigrinya/Afar use English STT + AI translate
- **95 translation keys** per language — complete UI coverage
- Auto-fallback: missing keys show English instead of crashing

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

All 40 symptom chips translated in all 6 languages.

### 📊 Rich Diagnosis Output
- Disease name + confidence % + severity badge
- **7-day action plan** — Day 1 / Days 2-3 / Week 1 colour-coded
- **ETB yield loss estimator** — quintals + birr using ECX 2025 prices
- **Climate Resilience Score** (0–100) with Ethiopian adaptation plan
- **Traditional Local Remedies** — neem, wood ash, garlic, Bordeaux mixture
- **Sustainability score** — chemical use, climate resilience, soil health
- Research citation card per crop (linked to Ethiopian papers)
- WhatsApp share (Amharic/English) + PDF report download

### 🔔 Push Notifications + Auto SMS Alerts
- **Push notifications** via Web Push API + `web-push` library with VAPID
- **Auto SMS** via Africa's Talking — farmer enters phone once, server sends daily
- Daily risk checker — seasonal calendar + satellite NDVI drives alerts
- Messages in all 6 languages: high risk, rain alert, weekly healthy check
- Legitimacy info shown: source, data basis, max 1 per day
- Push + SMS subscribers persisted to JSON files (survive server restarts)

### 📊 Impact Dashboard
- Total diagnoses run per device
- ETB loss prevented (calculated per diagnosis × farm size)
- Crops analyzed breakdown + most analyzed crop
- Accessible from More tab

### 🔐 Privacy & Security
- **Inline privacy modal** — 6-language, no external redirect, opens in-app
- **Consent checkbox** in onboarding — Start button disabled until accepted
- **Privacy notice** in profile modal before entering phone number
- Standalone privacy page: **[sebilai.com/privacy.html](https://sebilai.com/privacy.html)**
- GDPR compliant — no cookies, no tracking, no accounts, no data sold
- Daily rate limit: 100 diagnoses/IP/day + 20 req/min

### 📴 Offline-First Architecture
- 42 diseases work with zero internet
- Smart symptom matching with fuzzy keyword scoring
- Weather cached 6-hour TTL with offline fallback
- Feedback queued offline, syncs automatically via Service Worker v4
- Last diagnosis auto-saved — restored on next visit (24hr TTL)
- IndexedDB v5 — 7 stores: feedback, analyses, farmerLogs, marketPrices, diseases, crops, treatments

### 📞 All 17 Ethiopian Agricultural Research Centers
Verified tap-to-call numbers for all EIAR regional centers.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS — single-file PWA (1MB) |
| AI Primary | Groq — Llama 4 Scout 17B Vision |
| AI Fallback | OpenRouter → Gemini 2.0 Flash |
| Satellite | Google Earth Engine REST API (Sentinel-2, JWT auth) |
| Voice TTS | Google Translate TTS via `/api/tts` proxy |
| Push Notifications | Web Push + VAPID + `web-push` library |
| SMS | Africa's Talking API |
| Translate | Google Translate free proxy `/api/translate` |
| Backend | Node.js + Express v3.1 (16 endpoints) |
| Offline Storage | IndexedDB v5 (7 stores) |
| Persistence | JSON files in `/tmp/rg_data/` |
| Weather | Open-Meteo (free, no key) |
| Hosting | Render.com + GitHub CI |
| Domain | **sebilai.com** |
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
git clone https://github.com/guleaada/ResilienceGuardian.git
cd ResilienceGuardian
npm install
cp .env.example .env
# Required: GROQ_API_KEY, GEMINI_API_KEY, OpenRouter_API_KEY
# Optional: GEE_SERVICE_ACCOUNT_KEY, AT_API_KEY, AT_USERNAME
# Optional: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
node server.js
# Open: http://localhost:3000
```

### Environment Variables (Render)
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
| `ADMIN_KEY` | Optional | Admin dashboard password |

---

## 🗺️ Roadmap

- [x] Triple AI fallback (Groq → OpenRouter → Gemini)
- [x] 42 diseases, 8 crops — fully offline
- [x] 7-day action plan + ETB yield estimator
- [x] Climate Resilience Score + Traditional Local Remedies
- [x] **6 languages** — EN, አማርኛ, Oromiffa, ትግርኛ, Soomaali, Qafar
- [x] Server TTS — all 6 languages speak diagnoses
- [x] Voice input — English/Somali native + AI translate for others
- [x] Farmer feedback system + admin dashboard
- [x] 30-day seasonal disease risk calendar
- [x] All 17 Ethiopian ARC phone numbers (tap-to-call)
- [x] PDF report + WhatsApp share + citations export
- [x] PWA installable on all devices
- [x] Satellite NDVI (GEE Sentinel-2, real JWT auth)
- [x] Push notifications with disease alerts (6 languages)
- [x] Auto SMS alerts — server sends daily without admin
- [x] TF.js infrastructure built (model loading ready)
- [x] Inline privacy policy (6 languages, consent flow)
- [x] Impact metrics dashboard (ETB prevented)
- [x] Drone upload endpoint (Groq Vision analysis)
- [x] File persistence (subscribers survive restarts)
- [x] Daily rate limiting (100/IP/day)
- [x] **sebilai.com** custom domain live
- [ ] Custom TF.js models per crop (need 200+ photos each)
- [ ] WhatsApp bot integration
- [ ] Community disease feed (anonymized, regional)
| [ ] Full PostgreSQL database (replace JSON file storage)

---

## 📋 Audit Results

**46/46 checks passed** — verified May 2026

| Category | Score |
|---|---|
| Branding | ✅ 51× SebilAI, 0× old brands |
| Translation | ✅ 95 keys × 6 languages |
| Voice | ✅ TTS + STT all 6 languages |
| Push + SMS | ✅ Auto-sends daily |
| Privacy | ✅ GDPR compliant |
| Mobile | ✅ No crash patterns |
| Server | ✅ 16 endpoints, file persistence |
| Satellite | ✅ Real GEE JWT auth |

---

## ⚖️ License

**CC BY-NC-ND 4.0** — View and study ✅ | Commercial use ❌ | Derivatives ❌

**Original creator:** Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ) — All rights reserved.

---

<div align="center">

**Built for Ethiopia 🇪🇹 — With Purpose 🌍**

**Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)**<br>
[GitHub](https://github.com/guleaada) · [LinkedIn](https://linkedin.com/in/gulilat-k-worku-63a02520a) · [Live App](https://sebilai.com) · [Privacy Policy](https://sebilai.com/privacy.html)

*"Empowering those who feed the nation."*

© 2026 Gulilat Kasiye Worku. All rights reserved.

</div>
