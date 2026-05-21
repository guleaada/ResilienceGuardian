# 🌿 Resilience Guardian

<div align="center">

**AI-Powered Crop Disease Advisor for Ethiopian Smallholder Farmers**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-resilienceguardian.onrender.com-2D6A0A?style=for-the-badge&logo=google-chrome&logoColor=white)](https://resilienceguardian.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-guleaada-181717?style=for-the-badge&logo=github)](https://github.com/guleaada/ResilienceGuardian)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?style=for-the-badge)](https://resilienceguardian.onrender.com)

*"Empowering those who feed the nation."*

</div>

---

## 📖 About the Project

**Resilience Guardian** is an offline-first, multilingual AI web application that helps Ethiopian smallholder farmers diagnose crop diseases — in their own language, using research from their own country, even without internet access.

It was built to fill a critical gap: no AI tool existed that spoke Amharic, Oromiffa, or Tigrinya; used research from Ethiopian institutions like EIAR, Jimma University, and Werabe ARC; or gave advice specific to Ethiopian crops, zones, and farming conditions.

> **Built by [Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)](https://github.com/guleaada)** — Ethiopian AI Developer & Entrepreneur.

---

## ✨ Key Features

### 🌱 Crop Coverage — 8 Ethiopian Crops

| Crop | Local Name | Primary Diseases Covered |
|---|---|---|
| Enset | እንሰት | Bacterial Wilt (Xcm), Root Mealybug |
| Teff | ጤፍ | Leaf Rust, Head Smudge |
| Wheat | ስንዴ | Stripe Rust, Stem Rust Ug99, Leaf Rust |
| Maize | በቆሎ | Northern Leaf Blight, Common Rust |
| Coffee | ቡና | Coffee Berry Disease, Coffee Wilt (CWD) |
| Potato | ድንች | Late Blight, Bacterial Wilt |
| Barley | ገብስ | Scald, Net Blotch |
| Sorghum | ማሽላ | Anthracnose, Grain Mold |

### 🤖 AI Capabilities
- **Visual Disease Detection** — upload photos of leaf, stem, root, or whole plant
- **Multi-Image Analysis** — analyze multiple plant parts simultaneously
- **Symptom-Based Diagnosis** — crop-specific symptom checklists
- **Severity Estimation** — score 0–100 with yield loss % if untreated
- **Treatment Cost Calculator** — estimated cost in Ethiopian Birr (ETB)
- **Offline Fallback** — local disease database works without internet

### 🌍 Language & Accessibility
- **4 Languages:** English, አማርኛ (Amharic), Afaan Oromo, ትግርኛ (Tigrinya)
- **Voice Input** — speak symptoms in your language
- **Full UI Translation** — every button, label, and result translates instantly
- **Google Translate** — auto-translates long-form modal content

### 🌤️ Weather & Risk Intelligence
- Real-time 7-day forecast via Open-Meteo (free, no API key needed)
- Disease risk alerts (Low / Moderate / High) based on humidity and rainfall
- Covers 7 Ethiopian regions + GPS location detection

### 📱 Progressive Web App (PWA)
- Installable on **Android, iPhone, iPad, Mac, and Desktop**
- Works **offline** — core features available without internet
- App icons and splash screens for all device sizes
- Background sync — queues analyses offline, sends when reconnected

### 🔬 Research Foundation — 8 Peer-Reviewed Papers

| Paper | Institution | Year |
|---|---|---|
| Integrated Management of Enset Bacterial Wilt | Bonga University | 2023 |
| Community-Based EBW Management | Werabe ARC / Central Ethiopia ARI | 2023 |
| Enset Disease & Pest ID Using CNN (98.87% accuracy) | Jimma University | 2021 |
| McKnight-CCRP Integrated Management Report | McKnight Foundation | — |
| Major Tef Diseases in Ethiopia | EIAR Debre Zeit ARC | 2021 |
| Distribution of Tef Diseases in Central Highland | Int. J. Applied Agricultural Sciences | 2021 |
| Early Warning System for Wheat Rust | Cambridge / CIMMYT / EIAR | 2019 |
| Ethiopian Maize Disease & Management | MoA / FAO Ethiopia | — |

### 📞 Direct Farmer Support
Tap-to-call links to 6 agricultural extension offices — EIAR, TARI (Tigray), Kulumsa (Oromia), ARARI (Amhara), SNNPR, and Ministry of Agriculture hotline.

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/guleaada/ResilienceGuardian.git
cd ResilienceGuardian
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Get a free Gemini API key at: [aistudio.google.com](https://aistudio.google.com)

### 4. Run the Application
```bash
# Development
npm run dev

# Production
npm start
```

Open: `http://localhost:3000`

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript | UI, translations, offline logic |
| AI Engine | Google Gemini 2.0 Flash | Disease diagnosis, multilingual response |
| Backend | Node.js + Express | Secure API proxy, rate limiting |
| Offline DB | IndexedDB | History, queued analyses, farmer profile |
| Weather | Open-Meteo API | Free real-time weather + disease risk |
| PWA | Service Worker v3 | Offline caching, background sync |
| Image | Client-side Canvas API | Photo compression before upload |
| Future | TensorFlow.js | Fully offline local AI model |

---

## 📁 Project Structure

```
ResilienceGuardian/
├── public/
│   ├── index.html              # Full application
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Offline caching
│   └── icons/
│       ├── apple-touch-icon.png  # iPhone icon (180x180)
│       ├── icon-72/96/128/192/512.png
│       └── splash-*.png        # iOS splash screens (5 sizes)
├── server.js                   # Express backend
├── package.json
├── .env                        # API key (not committed)
├── .env.example
├── README.md
├── RESEARCH.md
└── LICENSE
```

---

## 🌐 Live Demo

**Try it now:** [resilienceguardian.onrender.com](https://resilienceguardian.onrender.com)

> Note: Free tier may take 30–50 seconds to wake up after inactivity.

**Install as an app:**
- **Android:** Open in Chrome → tap the install banner
- **iPhone:** Open in Safari → Share → Add to Home Screen
- **Desktop:** Open in Chrome/Edge → click install icon (⊕) in address bar

---

## 🔮 Roadmap

- [x] 8 crops with real photos
- [x] 4-language full translation
- [x] AI diagnosis via Gemini 2.0 Flash
- [x] Offline disease database (16 diseases)
- [x] Weather + disease risk widget
- [x] PWA — installable on all devices
- [x] Multi-image upload with plant part selection
- [x] Severity + yield loss estimator
- [x] Treatment cost calculator in ETB
- [x] Farmer profile (persistent)
- [x] Tap-to-call agricultural offices
- [ ] TensorFlow.js fully offline AI model
- [ ] WhatsApp share for diagnosis results
- [ ] PDF download of diagnosis report
- [ ] Farmer feedback and rating system
- [ ] Seasonal disease risk alerts by region
- [ ] SMS-based diagnosis for feature phones
- [ ] Android APK via React Native

---

## 🤝 Contributing

Contributions are welcome — especially from agronomists, translators, and Ethiopian developers.

1. Fork the repository
2. Create your branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m 'Add YourFeature'`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

**Especially needed:**
- Oromiffa and Tigrinya translation improvements
- Disease data for additional Ethiopian crops
- Field testing feedback from real farmers

---

## 📄 License

MIT License — see [LICENSE](LICENSE).

Original creator: **Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)** — credit required in any derivative work.

---

## 🙏 Acknowledgments

- Ethiopian farmers and Development Agents (DAs) across all regions
- Researchers at EIAR, Jimma University, Werabe ARC, Bonga University, and all Regional Agricultural Research Institutes
- Google for Gemini API access
- Open-Meteo for free weather data
- The global open-source community

---

<div align="center">

**Built for Ethiopia 🇪🇹 — With Love 🌍**

Developer: **Gulilat Kasiye Worku (ጉልላት ካስዬ ዎርቁ)**

Ethiopian AI Developer & Entrepreneur

[GitHub](https://github.com/guleaada) · [Live App](https://resilienceguardian.onrender.com)

*"Empowering those who feed the nation."*

</div>
