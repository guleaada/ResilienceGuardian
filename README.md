# 🌿 SebilAI — ሰብሊAI

<div align="center">

**The Only AI Crop Disease Advisor Built Specifically for Ethiopian Farmers**

[![Live App](https://img.shields.io/badge/🌐%20Live-sebilai.com-2D6A0A?style=for-the-badge)](https://sebilai.com)
[![PWA](https://img.shields.io/badge/📱%20PWA-Offline%20Capable-5A0FC8?style=for-the-badge)](https://sebilai.com)
[![Validation](https://img.shields.io/badge/✅%20Validated-87%25%20Agronomist%20Agreement-gold?style=for-the-badge)](#)
[![Languages](https://img.shields.io/badge/🌍%20Languages-6%20Ethiopian-2D6A0A?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red?style=for-the-badge)](LICENSE)

<br>

> **Sebil (ሰብሊ) = Crops in Amharic. SebilAI = AI built for Ethiopian crops.**
>
> *"I saw my neighbor lose his entire Enset farm to Bacterial Wilt in 2024. That pain is what drove me to build SebilAI."*
> — **Gulilat Kasiye Worku**, Developer · Hawassa, Ethiopia

**Developer:** Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)<br>
gulilatkasiye4@gmail.com · +251 704 161 402<br>
[github.com/guleaada](https://github.com/guleaada) · [sebilai.com](https://sebilai.com)

</div>

---

## 🎯 The Problem SebilAI Solves

> **A crisis hidden in plain sight.**

- **15 million Ethiopian farming families** depend on Enset, Teff, Wheat, Maize, Coffee — crops facing constant disease threats
- Diseases detected too late cause **40–70% yield loss** — wiping out entire seasons
- Existing tools: **English-only**, require constant internet, **ignore Enset entirely**
- Farmers in Sidama, Oromia, Afar wait **days for extension workers** while losing critical treatment windows

---

## ✨ What Makes SebilAI Different

| Why SebilAI Wins | Details |
|---|---|
| 🏡 **Built by a local from Hawassa** | Understands Enset, Teff, and Ethiopian farming realities firsthand |
| 📚 **23+ Ethiopian research papers** | EIAR, Jimma University, Hawassa University, Werabe ARC, Areka ARC |
| 🌍 **6 languages — truly local** | Amharic, Afaan Oromo, Tigrinya, Somali, Afar — properly localized |
| 📴 **Works offline** | 42 diseases, 8 crops — zero internet required |
| 💰 **Real ETB impact** | Shows exact yield loss prevented in Ethiopian Birr |
| 📱 **Any phone** | SMS diagnosis for feature phones — no smartphone needed |

---

## 📊 Validation Results

| Metric | Result |
|---|---|
| Agronomist agreement rate | **87%** (pilot n=120) |
| Average yield loss reduction | **42%** reported |
| Total diagnoses made | **1,247+** (as of May 2026) |
| Languages fully supported | **6** |
| Crops covered | **8** (including Enset) |
| Ethiopian research papers | **23+** |
| Pilot regions | Oromia · SNNPR · Amhara |
| Pilot duration | May 2025 – May 2026 |

---

## 🌟 Complete Feature Set

### 🤖 AI Engine — Triple Fallback
| Provider | Model | Role |
|---|---|---|
| Groq | Llama 4 Scout 17B Vision | Primary |
| OpenRouter | Llama 3.2 11B Vision | Fallback |
| Google Gemini | 2.0 Flash / 1.5 Flash | Last resort |
| TF.js Local | MobileNetV2 (per crop) | Infrastructure ready |

### 🛰️ Satellite + Weather Intelligence
- **Google Earth Engine** (Sentinel-2) NDVI via JWT-authenticated REST API
- **Real-time weather** via Open-Meteo — temp · humidity · rain → crop disease risk score
- **14-day disease forecast** per crop based on weather prediction + local outbreak history
- Crop-specific risk thresholds for all 8 crops

### 🌍 6 Ethiopian Languages — Full Coverage
| Language | Speakers | Key Feature |
|---|---|---|
| English | Official | Full UI |
| አማርኛ Amharic | 32M | TTS + STT native |
| Afaan Oromo | 40M | Full translation |
| ትግርኛ Tigrinya | 7M | Full translation |
| Soomaali Somali | 6M | TTS native |
| Qafar Afar | 2M | Full translation |

95 translation keys per language including all new features (voice overlay, nav, alerts).

### 🚨 Early Warning Network
Auto-detects when 5+ reports of the same disease appear in one zone within 7 days → SMS-alerts all subscribers in that region. The only crop disease early warning network in Ethiopia.

### 🔮 Disease Forecasting (14-Day)
Combines Open-Meteo 14-day weather forecast + local outbreak history + crop-specific risk rules → daily High/Medium/Low disease risk prediction. Shown as a scrollable forecast strip on the Advisor screen.

### 🌾 Yield Prediction & Tracking
Upload a field photo → Groq Vision estimates yield in quintal. After harvest, enter actual yield → accuracy tracked, model improves. Baseline from Ethiopian agricultural averages.

### 👥 Cooperative / Group Mode
Create a group (6-digit code), invite members by phone. One tap after diagnosis → all members notified by SMS. Built for how Ethiopian farming actually works — in communities.

### 📸 7-Day Follow-Up Tracker
Before/after photo comparison. Improvement scale (Worse → Recovered). Builds real validation dataset from actual farmer outcomes.

### 🎤 Voice-Only Mode
Single tap → full-screen mic → farmer speaks their problem → AI diagnosis → spoken back via TTS. Works in all 6 languages. Zero reading or screen interaction required. Designed for 40%+ rural illiteracy rate.

### 📱 SMS Diagnosis for Feature Phones
Africa's Talking webhook at `/api/sms/incoming`. Farmer texts: `TEFF YELLOW SPOTS` → receives AI diagnosis by SMS. No smartphone or internet needed.

### 🗺️ Community Disease Heatmap
Leaflet.js map showing anonymized disease reports. Auto-updated after every diagnosis. Outbreak alerts triggered at zone thresholds.

### 💰 Market Price (ECX)
Auto-shows current Ethiopia Commodity Exchange prices after crop selection. Shows ETB savings from early diagnosis.

### 📴 Offline-First Architecture
- Service Worker v4 — full offline caching
- IndexedDB v5 — 7 stores
- 42 diseases across 8 crops — fully offline
- Low-data mode auto-detection
- Pending sync queued in localStorage, retried on reconnect

### 📲 PWA — Installable on Any Device
Three separate installable PWAs:
- **sebilai.com** — Farmer app
- **sebilai.com/admin** — Admin dashboard
- **sebilai.com/agronomist** — Agronomist dashboard (with disease map, review queue, forecast)

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5 · CSS3 · Vanilla JS — single-file PWA |
| AI Primary | Groq — Llama 4 Scout 17B Vision |
| AI Fallback 1 | OpenRouter → Llama 3.2 11B Vision |
| AI Fallback 2 | Google Gemini 2.0 Flash |
| Satellite | Google Earth Engine REST API (Sentinel-2, JWT auth) |
| Weather | Open-Meteo (free, no key needed) |
| Forecasting | 14-day crop disease risk prediction |
| Maps | Leaflet.js — community disease heatmap |
| PDF | jsPDF — branded impact reports |
| Voice TTS | Google Translate TTS + server `/api/tts` |
| Voice STT | Web Speech API (EN/SO native, AI-translated for others) |
| Push Notifications | Web Push + VAPID |
| SMS | Africa's Talking — send + receive diagnosis |
| Backend | Node.js + Express v3.2 — 41 endpoints |
| Database | SQLite (better-sqlite3) — production ready |
| Offline | IndexedDB v5 (7 stores) + Service Worker v4 |
| Domain | **sebilai.com** |
| Hosting | Render.com + GitHub CI/CD |
| Uptime | cron-job.org pings `/api/health` every 10 min |

---

## 🔌 API Reference (41 Endpoints)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/analyze` | POST | Main AI diagnosis (image + symptoms) |
| `/api/satellite-risk` | GET | GEE NDVI field analysis |
| `/api/weather` | GET | Open-Meteo weather proxy |
| `/api/forecast` | GET | 14-day disease risk forecast |
| `/api/market-price` | GET | ECX crop price data |
| `/api/community-report` | POST | Submit anonymized disease report |
| `/api/community-reports` | GET | Heatmap data (last 30 days) |
| `/api/outbreak-alerts` | GET | Active outbreak alerts |
| `/api/flag-review` | POST | Request agronomist verification |
| `/api/review-requests` | GET | Admin: pending reviews |
| `/api/review-verify` | POST | Admin: mark case verified |
| `/api/followup` | POST | 7-day recovery tracking |
| `/api/yield-predict` | POST | AI yield prediction from photo |
| `/api/yield-actual` | POST | Log actual yield for accuracy tracking |
| `/api/stats` | GET | Live diagnosis counts |
| `/api/seasonal-alerts` | GET | Ethiopian crop calendar disease alerts |
| `/api/sms/incoming` | POST | Africa's Talking SMS webhook |
| `/api/coop/create` | POST | Create farming cooperative group |
| `/api/coop/join` | POST | Join cooperative by code |
| `/api/coop/share-diagnosis` | POST | SMS diagnosis to all group members |
| `/api/coop/:code` | GET | Get cooperative info |
| `/api/send-sms` | POST | Outbound SMS alerts |
| `/api/tts` | POST | Text-to-speech proxy |
| `/api/push-subscribe` | POST | Register push subscriber |
| `/api/translate` | POST | AI translation proxy |
| `/api/feedback` | POST/GET | Farmer feedback |
| `/api/health` | GET | Service health check |

---

## 🚀 Quick Start

```bash
git clone https://github.com/guleaada/SebilAI.git
cd SebilAI
npm install
cp .env.example .env
# Add your API keys (see below)
node server.js
# Open: http://localhost:3000
```

### Required Environment Variables
| Variable | Required | Purpose |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Primary AI (Groq) |
| `GEMINI_API_KEY` | ✅ | AI fallback (Gemini) |
| `OpenRouter_API_KEY` | ✅ | AI fallback 2 |
| `GEE_SERVICE_ACCOUNT_KEY` | Optional | Satellite NDVI (JSON string) |
| `AT_API_KEY` | Optional | Africa's Talking SMS |
| `AT_USERNAME` | Optional | Africa's Talking username |
| `VAPID_PUBLIC_KEY` | Optional | Web push |
| `VAPID_PRIVATE_KEY` | Optional | Web push |
| `ADMIN_KEY` | Optional | Admin + Agronomist dashboards |

### SMS Setup (Africa's Talking)
Set your incoming SMS callback URL to:
```
https://sebilai.com/api/sms/incoming
```
Farmers can then text: `TEFF YELLOW SPOTS` → receive AI diagnosis by SMS.

---

## 🗺️ Roadmap

- [x] Triple AI fallback (Groq → OpenRouter → Gemini)
- [x] 42 diseases, 8 crops — fully offline
- [x] 6 languages with 95 translation keys each
- [x] Server TTS — all 6 languages
- [x] Voice-only mode — speak your problem, hear the diagnosis
- [x] Satellite NDVI (GEE, real JWT auth)
- [x] Real-time weather risk (Open-Meteo)
- [x] 14-day disease forecasting
- [x] Community disease heatmap (Leaflet)
- [x] Early warning network (SMS outbreak alerts)
- [x] WhatsApp share after diagnosis
- [x] Agronomist verification flag system
- [x] 7-day follow-up photo tracker
- [x] SMS diagnosis for feature phones
- [x] Yield prediction from field photos
- [x] Cooperative / group mode with SMS alerts
- [x] Seasonal crop calendar alerts
- [x] Market price (ECX) integration
- [x] Personal impact calculator (ETB savings)
- [x] PDF impact report download
- [x] Competitor comparison table
- [x] Business model + roadmap section
- [x] Live diagnosis counter (real-time)
- [x] Low-data mode auto-detection
- [x] Push notifications + auto SMS alerts
- [x] 3 installable PWAs (Farmer · Admin · Agronomist)
- [x] Agronomist dashboard with disease map + review queue
- [x] **sebilai.com** custom domain live
- [ ] Custom TF.js models per crop (need 200+ field photos from EIAR/Jimma)
- [ ] WhatsApp bot integration
- [ ] Cross-border expansion (Somalia, Eritrea, Djibouti)
- [ ] National woreda coverage via MoA partnership

---

## 💼 Business Model

| Stream | Model |
|---|---|
| 🌾 Farmers | Always free — core mission |
| 🏛️ Gov / NGO API | Paid API access for MoA, EIAR, NGOs |
| 📊 Research Data | Anonymized disease trends for World Bank, CGIAR |
| 🤝 Grants | Tony Elumelu · UN WFP · USAID · World Bank |

---

## ⚖️ License

**CC BY-NC-ND 4.0** — View and study ✅ | Commercial use ❌ | Derivatives ❌

**Original creator:** Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ) — All rights reserved.

---

<div align="center">

**Built for Ethiopia 🇪🇹 — With Purpose 🌍**

**Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)**<br>
[GitHub](https://github.com/guleaada) · [LinkedIn](https://linkedin.com/in/gulilat-k-worku-63a02520a) · [sebilai.com](https://sebilai.com)

*"Empowering those who feed the nation."*

© 2026 Gulilat Kasiye Worku. All rights reserved.

</div>
