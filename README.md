# 🌱 Cintrack - Carbon Footprint Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Built with: React & FastAPI](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI-emerald.svg)](#-tech-stack)

**Cintrack** is a state-of-the-art personal carbon footprint tracking platform created by **abhishek**. It is designed to help individuals **understand** their climate impact, **track** their emissions over time, and **reduce** their footprint through actionable, AI-powered insights.

---

## ✨ Features

- 🚗 **Multi-Step Stepper Wizard:** Intuitive step-by-step form separating travel, home energy, and lifestyle inputs.
- 🎛️ **Tactile Range Sliders:** Synchronized range sliders and number input boxes for interactive, drag-to-adjust inputs.
- 📊 **Animated SVG Circular Gauge:** A premium glowing central gauge indicating annual CO₂e emissions, with color-coded sustainability statuses.
- 💡 **Checklist Action Cards:** Quantified, AI-powered recommendations that calculate "Committed Annual Savings" dynamically when checked.
- 📉 **SVG Sparkline Trend Chart:** Visually plots your historical carbon footprint trends over time with zero external graphing dependencies.
- 🏛️ **History Stats Dashboard:** High-level summary cards showing total entries, averages, and your best-recorded emission scores.
- ♿ **Strict Accessibility (WCAG AA):** Built with semantic markup, ARIA roles, skip links, and full contrast compliance.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, CSS Variables (Obsidian-Emerald Dark Theme / Glassmorphism).
- **Backend:** FastAPI (Python 3.11+), Uvicorn.
- **AI Engine:** Google Gemini (Vertex AI) with deterministic rule-based fallback.
- **Database:** Firestore (Native Mode) with process-local Memory Repository fallback.

---

## 💻 Running Locally

### 1. Backend Server Setup
Navigate to the `backend` directory, activate a virtual environment, and install dependencies:

```bash
cd backend
python -m venv .venv
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Launch the local Uvicorn server in offline-mode:
```bash
$env:USE_GEMINI="false"
$env:USE_FIRESTORE="false"
uvicorn app.main:app --reload
```
The API documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Dev Setup
Navigate to the `frontend` directory, install packages, and start the Vite dev server:

```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser to view the application.

---

## 🧪 Testing & Verification

Cintrack includes automated testing for both layers:

- **Backend tests:** Run `pytest` in the `backend` directory.
- **Frontend tests:** Run `npm run test` in the `frontend` directory. All 45 component and accessibility (axe-core) tests are verified passing.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. Created by **abhishek**.
