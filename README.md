# 🏏 IPL Influence Engine | AI-Driven Sponsor ROI & Debate Platform

An advanced AI platform for IPL brand sponsor ROI analytics, fan-driven debate generation, and viral influence insights using Google Gemini.

**Live URL**: `https://ipl-agent-1009309757911.us-central1.run.app` (Deploy pending quota resolution)

---

## ✨ Recent Updates (May 2026)

### 🗑️ Sponsor Removals
- **Removed Marriott Bonvoy** from MI team dashboard (₹48 Cr, 96/100 visibility)
- **Removed Samsung** from MI team dashboard (₹35 Cr, 90/100 visibility)
- Updated MI team total sponsor value from **₹172 Cr → ₹89 Cr**
- Front chest and front center positions now available for new sponsors

### 🔧 Backend Improvements
- Fixed frontend serving to properly handle React SPA routing
- Updated CORS configuration for Cloud Run deployment
- Re-enabled API key validation with hardcoded key support
- Improved static file serving for unified frontend/backend deployment
- Added proper error handling for missing static assets

### 🚀 Deployment Status
- ✅ Docker image built and pushed: `gcr.io/neural-orbit-458402-q5/ipl-influence-engine`
- ✅ Frontend properly integrated into backend static files
- ⚠️ Cloud Run deployment blocked due to regional quota exceeded
- 🔄 Working on quota resolution

---

## 🏗️ Local Development Setup

### 1. Backend Setup (FastAPI)

The backend handles AI orchestration, ROI calculations, and debate logic.

```powershell
# Navigate to backend
cd ipl_influence_engine

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
create .env file:
GEMINI_API_KEY=your_gemini_api_key_here
API_KEY=AIzaSyCo_3jymK3meF7ma1mbUP7TiMXv6JqoeUo

# Run server
python main.py
# API live at http://localhost:8000
```

### 2. Frontend Setup (React + Vite)

High-performance React dashboard with glassmorphic UI.

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
# Dashboard live at http://localhost:5173
```

### 3. Build for Production

```powershell
# Build frontend
cd frontend
npm run build

# Copy to backend static folder
xcopy dist\* ..\ipl_influence_engine\static\ /E /I /Y

# Run unified backend (serves frontend + API)
cd ..\ipl_influence_engine
python main.py
```

---

## ☁️ Cloud Run Deployment

### Prerequisites
- Google Cloud SDK (`gcloud`) installed
- Docker daemon running
- Project ID: `neural-orbit-458402-q5`

### Build & Deploy

```bash
# Build and push Docker image
gcloud builds submit --tag gcr.io/neural-orbit-458402-q5/ipl-influence-engine

# Deploy to Cloud Run (if quota available)
gcloud run deploy ipl-agent \
  --image gcr.io/neural-orbit-458402-q5/ipl-influence-engine \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --min-instances 0 \
  --max-instances 1 \
  --set-env-vars API_KEY=AIzaSyCo_3jymK3meF7ma1mbUP7TiMXv6JqoeUo
```

### Current Deployment Issue
⚠️ **Quota Exceeded**: Cannot create new Cloud Run revisions due to regional quota limits.

**Solutions**:
1. Wait 24 hours for quota reset
2. Delete existing revisions to free quota:
   ```bash
   gcloud run revisions list --service ipl-agent --region us-central1
   gcloud run revisions delete [REVISION_NAME] --region us-central1
   ```
3. Contact Google Cloud support to increase quota

---

## 🔌 API Endpoints

### Health & Status
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves React frontend (or returns API status if static files missing) |
| `/health` | GET | Health check endpoint |

### Chat & AI
| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/chat` | POST | Yes | AI query processing with Gemini |
| `/chat` | POST | No | Simple chat endpoint (fallback) |

### Sponsor ROI
| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/sponsors/brands` | GET | Yes | List all known sponsor brands |
| `/api/sponsors/roi` | POST | Yes | Calculate sponsor ROI |
| `/api/sponsors/compare` | POST | Yes | Compare multiple sponsors |
| `/api/reports/sponsor` | POST | Yes | Export sponsor report |
| `/api/reports/summary` | GET | Yes | Get report summary |

### Debate Engine
| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/debates` | POST | Yes | Create new debate |
| `/api/debates/history` | GET | Yes | Get debate history |
| `/api/debates/vote` | POST | Yes | Vote on debate |

### System
| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/cache/stats` | GET | Yes | Cache statistics for cost monitoring |

**Authentication**: All API endpoints (except `/health` and `/`) require `X-API-Key` header with value: `AIzaSyCo_3jymK3meF7ma1mbUP7TiMXv6JqoeUo`

---

## 📊 Dashboard Features

### 🏠 Dashboard
- Real-time sponsor ROI metrics
- 3D jersey visualization with sponsor zones
- Interactive heatmaps showing camera exposure
- Brand impact analytics

### 🤖 Ask AI
- Natural language queries about IPL sponsors
- AI-powered ROI insights using Google Gemini
- Debate generation and analysis

### 📈 Sponsor ROI
- Detailed sponsor performance metrics
- Compare multiple sponsors
- Export reports

### 🎽 3D Jerseys
- Interactive 3D jersey models for all 10 IPL teams
- Sponsor zone highlighting
- Visibility scores and camera exposure data

### ⚔️ Debate Arena
- AI-generated debates on IPL topics
- Fan voting system
- Viral content suggestions

### 📋 Reports
- Comprehensive sponsor analytics
- Historical data trends
- Export capabilities

---

## 🛠️ Troubleshooting

### Database
- Uses SQLite (`ipl_data.db`)
- Initializes automatically on first backend run

### CORS Issues
- CORS configured for `https://gdgbzw.web.app` and `http://localhost:5173`
- Modify `allowed_origins` in `main.py` if needed

### Frontend Not Loading
- Check if `index.html` exists in `ipl_influence_engine/static/`
- Verify Docker image includes frontend build: `COPY --from=frontend-builder /app/frontend/dist ./static`

### API Key Errors
- Default API Key: `AIzaSyCo_3jymK3meF7ma1mbUP7TiMXv6JqoeUo`
- Pass in header: `X-API-Key: AIzaSyCo_3jymK3meF7ma1mbUP7TiMXv6JqoeUo`

### Gemini API Issues
- Ensure `GEMINI_API_KEY` is valid in environment
- Falls back to tool-based simulation if API unavailable

---

## 📂 Project Structure

```
ipl-agent/
├── ipl_influence_engine/          # FastAPI Backend
│   ├── agents/                    # AI Orchestration
│   │   ├── orchestrator.py        # Query routing
│   │   ├── module_a_sponsor_roi.py # Sponsor ROI agent
│   │   └── module_b_debate.py     # Debate engine agent
│   ├── services/                  # Business logic
│   │   ├── sponsor_roi.py         # ROI calculations
│   │   └── debate_engine.py       # Debate logic
│   ├── data/                      # Database layer
│   ├── utils/                     # Utilities & cache
│   ├── static/                    # Frontend build (auto-copied)
│   ├── main.py                    # FastAPI application
│   └── requirements.txt           # Python dependencies
│
├── frontend/                      # React + Vite Frontend
│   ├── src/
│   │   ├── views/                 # Page components
│   │   │   ├── Dashboard.tsx      # Main dashboard
│   │   │   ├── AskAI.tsx        # AI chat interface
│   │   │   ├── SponsorROI.tsx   # ROI analytics
│   │   │   └── JerseyEngineView.tsx # 3D jerseys
│   │   ├── components/            # Reusable components
│   │   ├── data/                  # Data files
│   │   │   └── teamData.ts        # Team & sponsor data
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   ├── public/                    # Static assets
│   ├── index.html                 # HTML template
│   └── package.json               # NPM dependencies
│
├── cloudbuild.yaml                # Google Cloud Build config
├── Dockerfile                     # Multi-stage Docker build
└── README.md                      # This file
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `API_KEY` | Internal API security key | No (has default) |
| `CORS_ORIGINS` | Comma-separated allowed origins | No |
| `PORT` | Server port (default: 8080) | No |

---

## 📝 Changelog

### May 4, 2026
- Removed Marriott Bonvoy and Samsung from MI team sponsors
- Fixed frontend serving for Cloud Run deployment
- Updated CORS configuration
- Improved API key validation
- Built and pushed latest Docker image
- Documented Cloud Run quota issue

### May 3, 2026
- Fixed Docker build issues (symlinks, google-adk removal)
- Added root endpoint to serve frontend
- Configured Cloud Build triggers
- Initial Cloud Run deployment attempts

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

---

## 📧 Support

For issues or questions:
- Check the troubleshooting section above
- Review Cloud Run quota limits if deployment fails
- Ensure all environment variables are properly set

---

## 📜 License

MIT License - Feel free to use and modify as needed.

---

**Built with ❤️ using FastAPI, React, Three.js, and Google Gemini**
