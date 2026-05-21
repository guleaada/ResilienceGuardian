# 🌿 Resilience Guardian

**AI-Powered Crop Disease Advisor for Ethiopian Smallholder Farmers**

---

## 📋 About the Project

**Resilience Guardian** is an offline-first, multilingual web application designed to help Ethiopian smallholder farmers quickly diagnose crop diseases using Artificial Intelligence.

It combines **real Ethiopian agricultural research** with modern AI to deliver practical, actionable advice in farmers' local languages.

---

### ✨ Key Features

- **8 Important Ethiopian Crops**: Enset, Teff, Wheat, Maize, Coffee, Potato, Barley, Sorghum
- **4 Languages**: English, አማርኛ (Amharic), Oromiffa, ትግርኛ (Tigrinya)
- **Smart Image Upload** with automatic compression
- **Input Validation** for better accuracy
- **Research-Backed Diagnoses** from EIAR and Ethiopian institutions
- **Responsive Mobile Design** (PWA ready)
- **Hybrid AI Architecture** (Gemini + future TensorFlow.js local model)

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
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Run the Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Open your browser and go to: `http://localhost:3000`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| AI | Google Gemini 2.0 Flash |
| Backend | Node.js + Express |
| Image Processing | Client-side compression |
| Offline Storage | IndexedDB + Background Sync |
| Future | TensorFlow.js (Local Model) |

---

## 📚 Research Foundation

This application is built using peer-reviewed research from:

- **EIAR** – Ethiopian Institute of Agricultural Research
- **Jimma Agricultural Research Center** – Coffee & Enset
- **Werabe Agricultural Research Center** – Enset Bacterial Wilt
- **Kulumsa Agricultural Research Center** – Wheat & Barley
- **Debre Zeit Agricultural Research Center** – Tef & Maize
- **Bako Agricultural Research Center** – Maize Research
- **Bonga University & Wolkite University** – Enset Disease Studies

---

## 📁 Project Structure

```
ResilienceGuardian/
├── public/
│   └── index.html          # Main Application (UI + translations + offline)
├── server.js               # Backend API Proxy (hides Gemini API key)
├── package.json            # Dependencies
├── .env                    # Gemini API Key (not committed to GitHub)
├── .env.example            # Template for environment setup
├── README.md
├── RESEARCH.md             # Research papers and sources
└── LICENSE
```

---

## 🔮 Future Roadmap

- [ ] Full offline diagnosis using TensorFlow.js local model
- [ ] Voice input and output in all 4 languages
- [ ] Farmer feedback and continuous learning system
- [ ] Seasonal disease risk alerts by region
- [ ] Multi-language voice guidance for low-literacy farmers
- [ ] SMS-based diagnosis for feature phones

---

## 🤝 Contributing

Contributions are welcome! Whether you're a developer, agronomist, student, or translator — your help can make this tool more useful for Ethiopian farmers.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.  
Original creator: **Gulilat Kasiye Worku** — credit required in any derivative work.

---

## 🙏 Acknowledgments

- Ethiopian farmers and Development Agents (DAs) across all regions
- Researchers at EIAR and all Regional Agricultural Research Institutes
- Google for Gemini API support
- The open-source community

---

<div align="center">

**Built in Ethiopia 🇪🇹 with love for Ethiopian farmers**

Developer: **Gulilat Kasiye Worku**  
Purpose: To bridge modern AI with traditional Ethiopian farming knowledge

*"Empowering those who feed the nation."*

</div>
