<div align="center">
  <img src="assets/logo.png" alt="IPL Influence Engine Logo" width="200">
  <h1>IPL Influence Engine</h1>
  <p>AI-powered IPL sponsor intelligence simulator and debate engagement platform</p>
</div>

This project now uses a real Google ADK entrypoint when `google-adk` is installed, with deterministic FastAPI fallbacks so the app still works when local ADK dependencies are unavailable.

## What Works

- FastAPI chat endpoint with validation, optional API key auth, and basic rate limiting
- Real `google.adk.agents.Agent` imports in `agent.py` / `agents/agent.py`
- Deterministic query classifier for sponsor, debate, mixed, and general routes
- Callable Python tools for sponsor ROI and IPL debate generation
- SQLite-backed sponsor metrics and query logs through SQLAlchemy
- Streamlit UI with four real tabs: Ask AI, Sponsor ROI, Debate Arena, Reports
- Docker healthcheck that does not require curl

## Local Development

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
streamlit run ui/app.py --server.port 8080
```

Set `API_KEY` in `.env` to require `X-API-Key` for API calls. Leave it unset only for local demos.

## ADK Entrypoint

```text
agent.py              # exports root_agent
agents/agent.py       # defines root_agent with real google.adk Agent
tools/                # ADK-callable Python tools
```

## Project Structure

```text
ipl_influence_engine/
├── agent.py
├── main.py
├── agents/
│   ├── agent.py
│   ├── orchestrator.py
│   ├── module_a_sponsor_roi.py
│   └── module_b_debate.py
├── tools/
│   ├── sponsor_tools.py
│   └── debate_tools.py
├── data/
│   ├── database.py
│   └── mock_db.py
└── ui/
    └── app.py
```

## Reality Check

The product is still a simulator until connected to real sponsor spend, match exposure, social, and sentiment feeds. Do not sell current outputs as live ROI analytics.
