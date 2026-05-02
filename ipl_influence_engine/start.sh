#!/bin/bash
# Production start script
# Cloud Run exposes $PORT (default 8080)
# We prioritize FastAPI on the main port to serve the React Dashboard requests.

echo "Starting FastAPI on port ${PORT:-8080}..."
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
