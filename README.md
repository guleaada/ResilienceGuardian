# 🌿 Resilience Guardian — ጠባቂ ጥንካሬ

<div align="center">

**Localized, Explainable, and Evolving AI for Ethiopian Smallholder Farmers**

[![Live App](https://img.shields.io/badge/🌐%20Live%20App-resilienceguardian.onrender.com-2D6A0A?style=for-the-badge)](https://resilienceguardian.onrender.com)
[![PWA](https://img.shields.io/badge/📱%20PWA-Offline%20Capable-5A0FC8?style=for-the-badge)](https://resilienceguardian.onrender.com)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red?style=for-the-badge)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20አማርኛ%20%7C%20Oromiffa%20%7C%20ትግርኛ-blue?style=for-the-badge)](#)

<br>

> *"Empowering those who feed the nation."*

**Developer:** [Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)](https://github.com/guleaada)<br>
Ethiopian AI Developer & Entrepreneur | Hawassa, Ethiopia<br>
gulilatkasiye4@gmail.com | +251 704 161 402<br>
[github.com/guleaada](https://github.com/guleaada) | [linkedin.com/in/gulilat-k-worku-63a02520a](https://linkedin.com/in/gulilat-k-worku-63a02520a)

</div>

---

## 🎯 Competition Narrative

> **"Resilience Guardian: Localized, Explainable, and Evolving AI for Ethiopian Farmers"**

This is not a generic AI wrapper. It is purpose-built for Ethiopia's unique challenges — low internet, multilingual needs, and culturally vital crops like Enset ("Tree Against Hunger") and Teff. Every diagnosis links to real Ethiopian research. Farmers contribute feedback that improves the AI. The system works completely offline for 42 diseases.

**Goal:** Reduce crop losses by 40–70% for 15 million Ethiopian farming families.

---

## ✨ Key Features

### 🤖 Triple AI Engine
| Provider | Model | Status |
|---|---|---|
| Groq | Llama 4 Scout 17B Vision | ✅ Primary |
| OpenRouter | Llama 3.2 11B Vision | ✅ Fallback |
| Google Gemini | 2.0 Flash / 1.5 Flash | ✅ Last resort |
| TF.js Local | MobileNetV2 per crop | 🔄 Training in progress |

### 🛰️ Satellite Intelligence
- Sentinel-2 NDVI analysis via Google Earth Engine
- Crop-specific thresholds (8 crops)
- 7-day weather risk calendar with real per-day humidity data
- 30-day seasonal disease risk calendar
- Auto-loads weather on startup from saved region

### 🌱 8 Crops — 42 Diseases (All Offline)
Enset, Teff, Wheat, Maize, Coffee, Potato, Barley, Sorghum

### 🌍 Language & Voice
- 4 languages: English, አማርኛ, Afaan Oromo, ትግርኛ
- Voice input + step-by-step voice output with highlighting
- Offline results auto-translate when reconnected

### 📊 Diagnosis Output
- 7-day action plan with research-backed timelines per disease
- ETB yield loss estimator (quintals + birr value)
- Sustainability score (chemical use, climate resilience, soil health)
- Treatment cost in Ethiopian Birr
- WhatsApp share + PDF report download
- Research citation export (18+ Ethiopian papers)

### 📴 Offline-First
- 42 diseases work without any internet
- Smart symptom matching with fuzzy scoring
- Weather cached for offline viewing (6-hour TTL)
- Feedback queued offline, syncs automatically

### 📞 All 17 Ethiopian Agricultural Research Centers
All with verified tap-to-call numbers.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JS (single-file PWA, 928KB) |
| AI Primary | Groq — Llama 4 Scout 17B Vision |
| AI Fallback | OpenRouter → Gemini 2.0 Flash |
| Satellite | Google Earth Engine (Sentinel-2 NDVI) |
| Future Local AI | TF.js MobileNetV2 (per crop) |
| Backend | Node.js + Express v3.0 |
| Offline Storage | IndexedDB |
| Weather | Open-Meteo (free) |
| PWA | Service Worker v4 |
| Hosting | Render.com + GitHub |

---

## 🚀 Quick Start

```bash
git clone https://github.com/guleaada/ResilienceGuardian.git
cd ResilienceGuardian
npm install
cp .env.example .env
# Add: GROQ_API_KEY, GEMINI_API_KEY, OpenRouter_API_KEY
# Optional: GEE_SERVICE_ACCOUNT_KEY (for real satellite data)
node server.js
```

---

## 🔬 Research Foundation — 18+ Ethiopian Papers

| Research | Institution | Year |
|---|---|---|
| Integrated Management of Enset Bacterial Wilt | Bonga University | 2023 |
| Community-Based EBW Management | Werabe ARC / Central Ethiopia ARI | 2023 |
| Enset CNN Detection (98.87% accuracy) | Jimma University | 2021 |
| Major Tef Diseases in Ethiopia | EIAR Debre Zeit ARC | 2021 |
| Early Warning System for Wheat Rust (Ug99) | Cambridge / CIMMYT / EIAR | 2019 |
| Ethiopian Maize Disease & Management | MoA / FAO Ethiopia | — |

---

## 🗺️ Roadmap

- [x] Triple AI fallback (Groq → OpenRouter → Gemini)
- [x] 42 diseases, 8 crops in offline database
- [x] 7-day action plan + ETB yield estimator
- [x] 4-language translation + voice input/output
- [x] Farmer feedback system + admin dashboard with charts
- [x] 30-day seasonal disease risk calendar
- [x] All 17 Ethiopian ARC phone numbers
- [x] PDF report + WhatsApp share + citations export
- [x] PWA installable on all devices
- [x] Satellite NDVI panel (GEE + Sentinel-2)
- [x] TF.js infrastructure built (model loading ready)
- [ ] Custom TF.js models per crop (MobileNetV2 training)
- [ ] Grad-CAM++ visual explainability
- [ ] WhatsApp broadcast for extension workers
- [ ] SMS diagnosis for feature phones

---

## ⚖️ License

**CC BY-NC-ND 4.0** — View and study ✅ | Commercial use ❌ | Derivatives ❌

**Original creator:** Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ) — All rights reserved.

---

<div align="center">

**Built for Ethiopia 🇪🇹 — With Purpose 🌍**

**Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)**<br>
[GitHub](https://github.com/guleaada) · [LinkedIn](https://linkedin.com/in/gulilat-k-worku-63a02520a) · [Live App](https://resilienceguardian.onrender.com)

*"Empowering those who feed the nation."*

© 2025 Gulilat Kasiye Worku. All rights reserved.

</div>
