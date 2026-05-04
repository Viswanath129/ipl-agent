# Root Dockerfile for Cloud Run Auto-Deployment
# This allows Cloud Run to build the backend from the repository root
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements first to leverage Docker cache
COPY ipl_influence_engine/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code into the container
COPY ipl_influence_engine/ .

# Ensure the startup script is executable
RUN chmod +x start.sh

# Cloud Run uses PORT environment variable (defaults to 8080)
ENV PORT=8080
EXPOSE ${PORT}

# Run the application using the start script
CMD ["./start.sh"]
