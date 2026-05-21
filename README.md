# 🌿 Resilience Guardian — ጠባቂ ጥንካሬ

<div align="center">

**AI-Powered Crop Disease Advisor for Ethiopian Smallholder Farmers**

[![Live App](https://img.shields.io/badge/🌐%20Live%20App-resilienceguardian.onrender.com-2D6A0A?style=for-the-badge)](https://resilienceguardian.onrender.com)
[![PWA](https://img.shields.io/badge/📱%20PWA-Installable%20Offline-5A0FC8?style=for-the-badge)](https://resilienceguardian.onrender.com)
[![License](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-red?style=for-the-badge)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20አማርኛ%20%7C%20Oromiffa%20%7C%20ትግርኛ-blue?style=for-the-badge)](#)

<br>

> *"Empowering those who feed the nation."* — ሀገሪቱን የሚመግቡትን ማብቃት

<br>

**Creator & Developer:** [Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)](https://github.com/guleaada)<br>
Ethiopian AI Developer & Entrepreneur

</div>

---

## 📖 What Is Resilience Guardian?

Resilience Guardian is an **offline-first, multilingual AI web application** that helps Ethiopian smallholder farmers identify and manage crop diseases — in their own language, using research from their own institutions, even without internet access.

Ethiopia is among the world's top agricultural nations, with over 15 million smallholder farming families producing 95% of the country's food. Yet crop diseases destroy up to 40–80% of yields annually — and most farmers have no access to professional agronomic advice in their language.

**Resilience Guardian bridges that gap.**

---

## ✨ Features

### 🤖 AI Engine — Triple Fallback Architecture
| Provider | Model | Role |
|---|---|---|
| **Groq** | Llama 4 Scout 17B Vision | Primary — fastest, 14,400 req/day free |
| **OpenRouter** | Llama 3.2 11B Vision | Secondary fallback |
| **Google Gemini** | 2.0 Flash / 1.5 Flash | Tertiary fallback |

- **Visual disease detection** — AI analyzes uploaded plant photos directly
- **Multi-image upload** — leaf, stem, root, whole plant, fruit
- **Explicit image instruction** — AI is told to examine the photo, not just read symptoms
- **Automatic failover** — if one provider fails, next is tried instantly

### 🌱 8 Ethiopian Crops — 32+ Diseases
| Crop | Local Name | Diseases in Database |
|---|---|---|
| Enset | እንሰት | Bacterial Wilt (Xcm), Root Mealybug, Early Xcm, Kocho Failure |
| Teff | ጤፍ | Leaf Rust, Head Smudge, Shoot Fly, Blister Blight |
| Wheat | ስንዴ | Stripe Rust, Stem Rust Ug99, Fusarium Scab, Septoria Blotch, Loose Smut |
| Maize | በቆሎ | Northern Leaf Blight, Fall Armyworm, Common Rust, Streak Virus, Aflatoxin |
| Coffee | ቡና | Berry Disease (CBD), Wilt (CWD), Leaf Rust, Berry Borer |
| Potato | ድንች | Late Blight, Bacterial Wilt, Early Blight, Potato Virus Y |
| Barley | ገብስ | Scald, Net Blotch, Covered Smut, Stem Rust |
| Sorghum | ማሽላ | Anthracnose, Grain Mold, Head Smut, Shoot Fly, Striga |

### 🌍 Language & Accessibility
- **4 full languages:** English, አማርኛ (Amharic), Afaan Oromo, ትግርኛ (Tigrinya)
- Every button, label, result, and action translates instantly
- **Voice input** — speak symptoms in your language (toggle start/stop)
- **Voice output** — tap to hear the full diagnosis read aloud, with iOS keep-alive fix
- Offline results **auto-translate** to selected language when internet is available

### 📴 Offline / Online Mode
- **Professional mode selector** — farmer can manually choose Online AI or Offline DB
- **Smart symptom matching** — fuzzy keyword scoring ranks best disease match
- **Always gives an answer** — if no symptom match, shows all diseases for that crop
- **Disease list** — tap any disease card to see full treatment details
- **Auto-translation** — offline English results translated by AI when reconnected

### 📊 Diagnosis Output
- Disease name + confidence % + severity (High / Medium / Low)
- Estimated yield loss % if untreated
- Numbered immediate action steps
- Preventive measures
- **Treatment cost calculator** in Ethiopian Birr (ETB) — based on farm size
- Research source citation (which Ethiopian institution)
- Follow-up conversation chat (4 quick questions + free text + voice)

### 🌤️ Weather Intelligence
- Real-time 7-day forecast via Open-Meteo (no API key needed)
- Disease risk alerts: Low / Moderate / High based on humidity + rainfall
- 7 Ethiopian regions + GPS location

### 📞 All 17 Ethiopian Agricultural Research Centers
Every center with verified phone numbers, tap-to-call, crop specialty noted:
Ambo, Assosa, Bako, Chiro, Debre Zeit, Fogera, Holeta, Jimma, Kulumsa, Melkassa, Mehony, Pawe, Sebeta, Tepi, Wereillu, Werer, Wondo Genet

### 📱 Progressive Web App (PWA)
- Installable on Android, iPhone, iPad, Mac, Desktop
- Offline-first architecture
- Service Worker v4 — caches full app
- iOS splash screens for 5 iPhone sizes
- Background sync — queues analyses offline, sends when reconnected
- Auto-detects new version with refresh button

### 🔬 Research Foundation — 8 Ethiopian Peer-Reviewed Papers
| Research | Institution |
|---|---|
| Integrated Management of Enset Bacterial Wilt | Bonga University (2023) |
| Community-Based EBW Management | Werabe ARC / Central Ethiopia ARI (2023) |
| Enset Disease Detection CNN (98.87% accuracy) | Jimma University (2021) |
| McKnight-CCRP Integrated Management | McKnight Foundation |
| Major Tef Diseases in Ethiopia | EIAR Debre Zeit ARC (2021) |
| Tef Disease Distribution Central Highland | Int. J. Applied Agricultural Sciences (2021) |
| Early Warning System for Wheat Rust | Cambridge / CIMMYT / EIAR (2019) |
| Ethiopian Maize Disease & Management | MoA / FAO Ethiopia |

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript (no framework) |
| AI Primary | Groq — Llama 4 Scout 17B Vision |
| AI Fallback | OpenRouter, Google Gemini 2.0 Flash |
| Backend | Node.js + Express |
| Offline Storage | IndexedDB (history, profile, sync queue) |
| Weather | Open-Meteo (free, no key) |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| PWA | Service Worker v4 |
| Hosting | Render.com (free tier) + GitHub |
| Uptime | cron-job.org (pings server every 10 min) |

---

## 🚀 Local Development

### Requirements
- Node.js 18+
- A Groq API key (free at [console.groq.com](https://console.groq.com))

### Setup

```bash
git clone https://github.com/guleaada/ResilienceGuardian.git
cd ResilienceGuardian
npm install
cp .env.example .env
```

Edit `.env`:
```env
GROQ_API_KEY=your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here        # optional fallback
OpenRouter_API_KEY=your_openrouter_key     # optional fallback
PORT=3000
```

```bash
node server.js
# Open: http://localhost:3000
```

---

## 📁 Project Structure

```
ResilienceGuardian/
├── public/
│   ├── index.html              ← Full app (single file, ~860KB)
│   ├── manifest.json           ← PWA manifest
│   ├── service-worker.js       ← Offline caching v4
│   └── icons/                  ← App icons + iOS splash screens
├── server.js                   ← Express + triple AI fallback
├── package.json
├── .env                        ← API keys (never committed)
├── .env.example
├── README.md
├── RESEARCH.md
└── LICENSE
```

---

## 🌐 Try It Live

👉 **[resilienceguardian.onrender.com](https://resilienceguardian.onrender.com)**

> Free tier may take 30–50 seconds to wake up on first visit. cron-job.org keeps it warm every 10 minutes.

**Install as an app:**
- **Android** → Chrome → tap install banner
- **iPhone / iPad** → Safari → Share → Add to Home Screen
- **Desktop** → Chrome/Edge → click ⊕ in address bar

---

## 🗺️ Roadmap

- [x] 8 crops with real photos
- [x] 4-language full translation
- [x] Triple AI fallback (Groq → OpenRouter → Gemini)
- [x] Offline disease database — 32 diseases
- [x] Smart symptom matching with fuzzy scoring
- [x] Professional offline/online mode selector
- [x] Auto-translation of offline results
- [x] Visual AI diagnosis (actual image analysis)
- [x] Weather + disease risk widget
- [x] PWA — installable all devices
- [x] Severity + yield loss estimator
- [x] Treatment cost calculator in ETB
- [x] Voice input + voice read-aloud
- [x] All 17 Ethiopian ARC phone numbers
- [x] Follow-up conversation chat
- [ ] WhatsApp share for diagnosis results
- [ ] PDF diagnosis report download
- [ ] Farmer feedback + rating system
- [ ] Seasonal disease risk alerts by region
- [ ] SMS-based diagnosis for feature phones
- [ ] Fully offline TensorFlow.js AI model

---

## ⚖️ License & Intellectual Property

This project is licensed under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)**.

**You may:**
- View and study this code for personal learning
- Share it with attribution

**You may NOT:**
- Use this code or concept commercially without written permission
- Create derivative apps or products based on this work without permission
- Distribute modified versions

**Original creator and sole owner:**
**Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)**
All rights reserved. For licensing inquiries, contact via GitHub.

> This project was created independently as an original work. Unauthorized reproduction or commercial use will be pursued under applicable intellectual property law.

---

## 🙏 Acknowledgments

- Ethiopian farmers and Development Agents (DAs) across all regions
- EIAR, Jimma University, Werabe ARC, Bonga University, and all Ethiopian Regional Agricultural Research Institutes
- Groq, Google (Gemini), and OpenRouter for AI API access
- Open-Meteo for free weather data
- The Ethiopian agricultural research community whose published work forms the knowledge base of this tool

---

<div align="center">

**Built for Ethiopia 🇪🇹 — With Purpose 🌍**

**Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)**<br>
Ethiopian AI Developer & Entrepreneur

[GitHub](https://github.com/guleaada) · [Live App](https://resilienceguardian.onrender.com)

*"Empowering those who feed the nation."*

---

© 2025 Gulilat Kasiye Worku. All rights reserved.

</div>
