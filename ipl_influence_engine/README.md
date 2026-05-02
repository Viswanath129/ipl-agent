# IPL Influence Engine

AI-assisted IPL sponsor ROI and fan debate workbench.

## Reality Disclosure

This is a simulation-ready product, not a live analytics product until connected to real feeds. Every ROI response includes a `data_status` and `do_not_misrepresent` disclosure. The architecture is designed so real CV, broadcast, social, sentiment, and sponsorship-spend connectors can replace the local curated fixtures without changing the API contract.

## What It Solves

### IPL Brand Sponsor ROI Agent

- Jersey logo visibility tracking shaped like CV detection output
- Player association and placement weighting
- Social mentions, impressions, engagement, meme virality, and sentiment
- Exposure scoring and estimated media value
- ROI formula engine with matchday spend assumptions
- Brand comparison and markdown report export
- Sponsor recommendations

### IPL AI Debate Agent

- Stats retrieval for IPL players and teams
- Player/team comparison under batting, captaincy, team legacy, or overall lenses
- Legacy analysis
- Counterargument generation
- Bias detection
- Final judge verdict with confidence score
- Viral shareable output
- Fan voting and debate history

## Main API

```text
GET  /health
POST /api/chat
POST /api/sponsors/roi
POST /api/sponsors/compare
POST /api/reports/sponsor
POST /api/debates
POST /api/debates/vote
GET  /api/debates/history
GET  /api/reports/summary
```

## Local Development

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Next dashboard:

```bash
npm install
npm run dev
```

Streamlit dashboard:

```bash
streamlit run ui/app.py --server.port 8080
```

## Tests

```bash
python -m pytest -q
npm run build
```

## ADK Entrypoint

```text
agent.py              # exports root_agent
agents/agent.py       # Google ADK Agent when google-adk is installed
tools/                # ADK-callable sponsor and debate tools
services/             # deterministic domain engines
```

## Security

Set `API_KEY` in deployed environments to require `X-API-Key`. Keep `.env` local only. Never commit real Gemini or social API keys.

