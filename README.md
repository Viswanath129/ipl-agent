# ⚡ IPL Influence Engine

**AI-Powered IPL Sponsor ROI Analytics & Viral Debate Generator**

Built with Google ADK, FastAPI, Streamlit, and deployed on Google Cloud Run.

## Architecture

```
User → Streamlit Dashboard (port 8080) → FastAPI Backend (port 8000)
                                              ↓
                                    Master Orchestrator Agent
                                       ↙              ↘
                              Module A                Module B
                          (Sponsor ROI)           (Debate Engine)
```

## Local Development

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Set environment variables
copy .env.example .env
# Edit .env with your GEMINI_API_KEY

# Run both servers
# Terminal 1: FastAPI
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Streamlit
streamlit run ui/app.py --server.port 8080
```

## Deploy to Google Cloud Run

### One-time setup:
1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Run `gcloud auth login`
3. Edit `deploy.bat` — set your `PROJECT_ID` and `GEMINI_API_KEY`

### Every deploy:
```
deploy.bat
```

That's it. Your app goes live.

## Project Structure

```
ipl_influence_engine/
├── main.py                  # FastAPI backend
├── start.sh                 # Multi-process startup for Cloud Run
├── Dockerfile               # Cloud Run container config
├── deploy.bat               # One-command deploy script
├── cloudbuild.yaml           # Optional CI/CD config
├── requirements.txt
├── .gitignore
├── .dockerignore
├── .env.example
├── agents/
│   ├── orchestrator.py      # Master Orchestrator (routes queries)
│   ├── module_a_sponsor_roi.py  # Sponsor ROI Agent
│   └── module_b_debate.py   # Debate Engine Agent
├── tools/
│   ├── sponsor_tools.py     # ROI calculation tools
│   └── debate_tools.py      # Player stats & bias detection
├── data/
│   └── mock_db.py           # Mock database
├── google_adk/              # Local ADK shim
│   ├── agent.py
│   └── tools.py
└── ui/
    └── app.py               # Streamlit dashboard
```

## License

MIT
