# Multi-stage Dockerfile to build the frontend and run FastAPI on Cloud Run.
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY ipl_influence_engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY ipl_influence_engine/ .

COPY --from=frontend-builder /app/frontend/dist ./static

# Cloud Run provides PORT at runtime.
ENV PORT=8080
EXPOSE ${PORT}

CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"]
