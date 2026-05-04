# Multi-stage Dockerfile to serve both Frontend and Backend from Cloud Run
# Stage 1: Build the Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
# Build for production (Unified URL)
RUN npm run build

# Stage 2: Build the Backend and Serve Frontend
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

# Copy built frontend assets from Stage 1
# They will be served by FastAPI
COPY --from=frontend-builder /app/frontend/dist ./static

# Ensure the startup script is executable
RUN chmod +x start.sh

# Cloud Run uses PORT environment variable (defaults to 8080)
ENV PORT=8080
EXPOSE ${PORT}

# Run the application
CMD ["./start.sh"]
