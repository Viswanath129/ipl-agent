# 🚀 IPL AI Agent — One-Command Deploy

**Double-click `deploy_simple.bat` → Get live URL.**

---

## ONE-TIME SETUP (Do This First)

### 1. Install Requirements
- [Git](https://git-scm.com/download/win)
- [Python 3.11+](https://python.org)
- [Docker Desktop](https://docker.com/products/docker-desktop)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)

### 2. Login to Google Cloud
```cmd
gcloud auth login
gcloud config set project YOUR_GCP_PROJECT_ID
```

### 3. Enable APIs (One-time)
```cmd
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
```

### 4. Configure deploy_simple.bat
Edit `deploy_simple.bat` and set:
```bat
set PROJECT_ID=your-real-project-id
set SERVICE_NAME=ipl-ai-agent
set REGION=asia-south1
```

### 5. First GitHub Setup
```cmd
cd b:\projects\gdgBZW\ipl_influence_engine
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Viswanath129/ipl-agent.git
git push -u origin main
```

**Git config (if first time):**
```cmd
git config --global user.name "Your Name"
git config --global user.email "you@email.com"
```

---

## EVERYDAY WORKFLOW

### Deploy Full Stack (FastAPI + Streamlit)
Double-click: `deploy.bat`

### Deploy Minimal Flask (Quick Test)
Double-click: `deploy_simple.bat`

**What happens:**
1. ✅ Validates files
2. ✅ Git commit + push
3. ✅ Cloud Build container
4. ✅ Cloud Run deploy
5. ✅ Returns live URL

---

## DEPLOYMENT OPTIONS

| Mode | File | Use Case |
|------|------|----------|
| **Full Stack** | `deploy.bat` | Production with FastAPI + Streamlit |
| **Minimal** | `deploy_simple.bat` | Quick test / Flask only |
| **Cloud Build** | `cloudbuild.yaml` | CI/CD triggers |

---

## STRUCTURE

```
IPL Agent/
├── main.py                  # Full FastAPI + Streamlit
├── main_minimal.py          # Flask test version
├── requirements.txt         # Full dependencies
├── requirements_minimal.txt # Flask only
├── Dockerfile              # Full multi-process
├── Dockerfile.minimal      # Single Flask process
├── deploy.bat              # Full deploy script
├── deploy_simple.bat       # Quick deploy script
└── DEPLOY_GUIDE.md         # This file
```

---

## LIVE URL

After deploy, your app is at:
```
https://ipl-ai-agent-xxxxx.a.run.app
```

---

## ZERO-ERROR CHECKLIST

| Error | Fix |
|-------|-----|
| Git fails | Run git config commands above |
| Docker error | Start Docker Desktop |
| Permission denied | Run `gcloud auth login` |
| Billing error | Enable billing in GCP console |
| Port conflict | Use `--port 8080` (Cloud Run default) |

---

## UPGRADE PATH

Once minimal deploy works:
1. Replace `main_minimal.py` with full `main.py`
2. Use `deploy.bat` instead of `deploy_simple.bat`
3. Add Google ADK agents
4. Add Redis/PostgreSQL

The deploy script stays the same forever.
