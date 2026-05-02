#!/bin/bash
# Cloud Run start script
# Runs FastAPI (internal API) and Streamlit (user-facing UI)
# Cloud Run exposes $PORT (default 8080) — Streamlit listens on it

# Start FastAPI backend on internal port 8000
uvicorn main:app --host 0.0.0.0 --port 8000 &

# Start Streamlit on Cloud Run's PORT (8080 by default)
streamlit run ui/app.py \
    --server.port ${PORT:-8080} \
    --server.address 0.0.0.0 \
    --server.headless true \
    --server.enableCORS false \
    --server.enableXsrfProtection false \
    --browser.gatherUsageStats false
