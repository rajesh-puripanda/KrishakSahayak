# Kisan Saathi Unified Agriculture Platform

This repository combines three separate projects into one agriculture ecosystem:

- KisanSaathi main: farmer + agriculture officer dashboards
- NDVI map project: satellite field analysis and plot health visualization
- Voice module: farmer voice assistant for Hindi/Odia agricultural guidance

The goal is to unify them under one Kisan Saathi design language and user flow so that:

- the farmer can use the dashboard and voice assistant
- the agricultural officer can view NDVI insights and farmer details together
- the interface keeps the warm, earthy Kisan Saathi theme
- the farmer can switch between dashboard and voice/plot experience from one screen

---

## 1. Project Structure

```text
SIH_KrishiSahayak/
├── README.md
├── KisaanSaathi-main/
│   └── KisaanSaathi-main/
│       ├── src/
│       ├── package.json
│       └── vite.config.js
├── Kisan_saathi_voice_module-main/
│   ├── backend/
│   ├── frontend/
│   ├── requirements.txt
│   └── README.md
├── NVDI_map-main/
│   └── NVDI_map-main/
│       ├── public/
│       ├── server.js
│       └── package.json
└── .gitignore (if present)
```

---

## 2. What Each Project Does

### A. KisanSaathi main

This is the main app shell and design system.

- farmer login and dashboard
- officer login and dashboard
- multilingual agriculture interface
- cards for weather, distress, loans, schemes, fertilizer, machinery, market
- warm brown/golden theme and mobile-first design

### B. NDVI map project

This adds plot health and crop monitoring.

- saved plots
- NDVI historical analysis
- plot geospatial data
- weather and soil metrics for a selected field
- can be attached to officer view or farmer field view

### C. Voice module

This adds the voice assistant experience.

- Hindi/Odia question answering
- voice input and speech output
- demo chips for farming prompts
- farmer-guidance assistant for crop, field, and weather-related queries

---

## 3. Recommended Unified Flow

### Farmer Flow

1. Farmer logs into KisanSaathi
2. Sees dashboard with crop health, risk score, weather, loans, schemes
3. At bottom, a floating voice assistant is available
4. Top area shows selected plot/map visibility
5. Toggle button allows switching between dashboard and voice/plot view

### Officer Flow

1. Officer logs in to KisanSaathi
2. Sees farmer list and selected field analytics
3. NDVI map panel shows crop health and field indicators
4. All officer details stay within the same Kisan Saathi theme

---

## 4. Setup Instructions

### Prerequisites

- Node.js 18+
- npm
- Python 3.10+
- pip

---

## 5. Start All 3 Projects

### Terminal 1: Start KisanSaathi frontend

```bash
cd "c:\Users\HP\Downloads\SIH_KrishiSahayak\KisaanSaathi-main\KisaanSaathi-main"
npm install
npm run dev
```

Expected URL:

- http://localhost:5173

---

### Terminal 2: Start NDVI map backend

```bash
cd "c:\Users\HP\Downloads\SIH_KrishiSahayak\NVDI_map-main\NVDI_map-main"
npm install
npm start
```

Expected URL:

- http://localhost:3000

This API provides:

- /api/plots
- /api/analyze-field

---

### Terminal 3: Start voice assistant backend

On Windows PowerShell:

```powershell
cd "c:\Users\HP\Downloads\SIH_KrishiSahayak\Kisan_saathi_voice_module-main"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python backend/main.py
```

Expected URL:

- http://127.0.0.1:8000

This API provides:

- /api/health
- /api/query
- /api/prompts
- /api/tts

---

## 6. Integration Plan for the Final Combined App

### Design Integration

- Use KisanSaathi as the base design system
- Keep color palette from KisanSaathi: earthy browns, cream backgrounds, mustard accents, green field tones
- Match padding, card radius, typography, and mobile layout
- Keep consistent components across farmer and officer screens

### Feature Integration

- Add a toggle button in the farmer view to switch between:
  - Farmer dashboard
  - Voice + plot mode
- Place the voice assistant at the bottom of the screen like a floating chat panel
- Place the plot map at the top of the mobile screen for quick crop health monitoring
- Add NDVI layer on officer dashboard for selected farmer field
- Use the same user and role state from KisanSaathi for continuity

### Recommended Merge Architecture

```text
KisanSaathi frontend
  ├── farmer dashboard
  ├── officer dashboard
  ├── NDVI map panel
  ├── voice assistant panel
  └── state/context shared across modules

NDVI backend (Express)
  └── /api/plots
  └── /api/analyze-field

Voice backend (FastAPI)
  └── /api/query
  └── /api/tts
```

---

## 7. Merge Requirements to Implement Later

### Farmer screen

- Top area: live plot map card
- Bottom area: floating voice chat panel
- Small toggle button: dashboard / voice-map mode
- Use KisanSaathi theme and colors

### Officer screen

- Keep KisanSaathi layout and cards
- Add NDVI map visualization to the right panel or below summary cards
- Include farm-level stats and crop health trend

### Voice agent behavior

- Farmer should be able to ask questions in Hindi or Odia
- The voice module should answer using crop, soil, and weather context
- The interface should feel like a real agriculture advisor, not just a generic chatbot

---

## 8. Prompt to Ask Antigravity

Use this prompt exactly or adapt it:

```text
Build a unified agriculture platform by combining these three projects into one mobile-first web app using the KisanSaathi design language as the main theme.

Requirements:
1. Use the KisanSaathi app as the primary frontend and keep its warm brown, cream, and mustard color palette.
2. Keep both user roles: farmer and agricultural officer.
3. Add the NDVI map project into the officer dashboard so the agricultural officer can see field health, plot information, and NDVI analytics along with the farmer details.
4. Keep the same design system and card styling as KisanSaathi, but integrate NDVI visualizations cleanly.
5. In the farmer experience, add a floating voice assistant at the bottom of the screen.
6. At the top of the farmer screen, show the farmer's plot map.
7. Add a small toggle button so the farmer can switch between the standard farmer dashboard and the voice + map mode.
8. Keep the flow smooth and premium, like a modern agri-tech dashboard.
9. The voice module should support Hindi/Odia and respond like an agricultural advisor.
10. Connect the NDVI backend APIs and the voice backend APIs into the same application architecture.
11. The result should be one combined product, not three separate apps.

Important:
- The app should feel like a single product under KisanSaathi branding.
- The farmer interface should be intuitive for mobile users.
- The officer interface should remain rich and analytical with NDVI-based insights.
- Use modern React architecture and keep code modular and scalable.

Please generate the codebase structure, integration plan, and implementation for this combined app.
```

---

## 9. Recommended Next Step

The best next step is to:

1. choose KisanSaathi as the main frontend shell
2. embed the NDVI panel inside the officer dashboard
3. add the voice assistant as a floating mobile bottom sheet
4. create the dashboard toggle in the farmer view
5. then wire the API calls to the Express NDVI backend and FastAPI voice backend

This gives a clean merged product without losing the identity of the original Kisan Saathi app.

---

## 10. Summary

This repo is best treated as a three-part agri platform:

- KisanSaathi = the app identity and design system
- NDVI map = field health and officer analytics
- Voice assistant = farmer advisory and interaction layer

The final merged app should present as one branded product with a consistent theme, a farmer dashboard, an officer dashboard, NDVI field data, and an AI voice agent experience.
