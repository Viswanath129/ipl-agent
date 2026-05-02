"""Minimal Flask app for quick Cloud Run deployment testing."""
from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "IPL AI Agent Running Successfully on Cloud Run!"

@app.route("/health")
def health():
    return jsonify({"status": "healthy", "service": "ipl-ai-agent"})

@app.route("/api/info")
def info():
    return jsonify({
        "name": "IPL AI Agent",
        "version": "1.0.0",
        "endpoints": ["/", "/health", "/api/info"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
