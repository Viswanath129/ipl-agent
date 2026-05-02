# 🏏 IPL Influence Engine — Local Run Guide

Follow these steps to get the full AI dashboard and backend running on your machine.

---

## 🏗️ 1. Backend Setup (FastAPI)

The backend handles AI orchestration, ROI calculations, and debate logic.

1.  **Navigate to the backend directory**:
    ```powershell
    cd ipl_influence_engine
    ```

2.  **Create a Virtual Environment** (Recommended):
    ```powershell
    python -m venv venv
    .\venv\Scripts\activate
    ```

3.  **Install Dependencies**:
    ```powershell
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**:
    Create a `.env` file (or update the existing one) with your Gemini API Key:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    API_KEY=optional_internal_security_key
    ```

5.  **Run the Server**:
    ```powershell
    python main.py
    ```
    *The API will be live at `http://localhost:8000`*

---

## 🎨 2. Frontend Setup (React + Vite)

The frontend is a high-performance React dashboard with glassmorphic UI.

1.  **Navigate to the frontend directory**:
    ```powershell
    cd frontend
    ```

2.  **Install Dependencies**:
    ```powershell
    npm install
    ```

3.  **Run in Development Mode**:
    ```powershell
    npm run dev
    ```
    *The dashboard will be live at `http://localhost:5173`*

---

## 🛠️ Troubleshooting

- **Database**: The project uses SQLite (`ipl_data.db`). It initializes automatically on the first run of the backend.
- **CORS**: If the frontend cannot reach the backend, ensure `main.py` has `http://localhost:5173` in its `allowed_origins`. (I have already configured this for you).
- **Gemini API**: Ensure your `GEMINI_API_KEY` is valid, otherwise the "Ask AI" tab will fall back to tool-based simulation results.

---

## 📂 Project Structure

- `ipl_influence_engine/`: FastAPI Backend
  - `agents/`: AI Orchestration & Gemini integration.
  - `services/`: ROI formulas & Debate logic.
  - `data/`: Persistence layer (SQLAlchemy).
- `frontend/`: React Dashboard
  - `src/App.tsx`: Main UI logic & API integration.
  - `src/index.css`: Design system & Glassmorphism.
