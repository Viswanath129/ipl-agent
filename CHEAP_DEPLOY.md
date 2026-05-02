# 🚀 CHEAPEST GCP DEPLOYMENT GUIDE
## Budget: $5 for 10+ Days

---

## ARCHITECTURE (Zero Idle Cost)

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────┐
│  Firebase       │──────▶  Cloud Run      │──────▶  SQLite     │
│  Hosting        │      │  Backend        │      │  (container)│
│  (FREE TIER)    │      │  (Scale to 0)   │      │             │
└─────────────────┘      └──────────────────┘      └─────────────┘
```

---

## COST BREAKDOWN

| Service | Free Tier | Paid Rate | Est. Daily Cost |
|---------|-----------|-----------|-----------------|
| Firebase Hosting | 10GB/month | $0.15/GB | ~$0.00 |
| Cloud Run (idle) | 0 instances = $0 | $0/req | ~$0.00 |
| Cloud Run (active) | 2M req/month | $0.40/million | $0.01-0.05 |
| Gemini API | 1500 req/day | $0.50/1K req | $0.00-0.25 |
| **TOTAL ESTIMATED** | | | **$0.10-0.50/day** |

**$5 budget lasts: 10-50 days**

---

## CHEAPEST CLOUD RUN SETTINGS

```bash
# Region: asia-south1 (Mumbai) - cheapest in India
gcloud run deploy gdgbzw-backend \
  --source . \
  --region=asia-south1 \
  --min-instances=0 \
  --max-instances=1 \
  --cpu=1 \
  --memory=512Mi \
  --concurrency=80 \
  --timeout=300 \
  --no-cpu-boost \
  --service-account=default
```

---

## FILES TO MODIFY

### 1. frontend/.env
```
VITE_API_URL=https://gdgbzw-backend-aq2k4rjcja-el.a.run.app
```

### 2. backend/.env
```
GEMINI_API_KEY=your_key_here
API_KEY=your_api_secret
CORS_ORIGINS=https://gdgbzw.web.app,https://gdgbzw.firebaseapp.com
DB_URL=sqlite:///./ipl_data.db
```

---

## DEPLOY COMMANDS

### Step 1: Deploy Backend (Cloud Run)
```bash
cd ipl_influence_engine
gcloud run deploy gdgbzw-backend \
  --source . \
  --region=asia-south1 \
  --min-instances=0 \
  --max-instances=1 \
  --memory=512Mi \
  --concurrency=80 \
  --timeout=300 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=${GEMINI_API_KEY},API_KEY=${API_KEY},CORS_ORIGINS=https://gdgbzw.web.app"
```

### Step 2: Get Backend URL
```bash
BACKEND_URL=$(gcloud run services describe gdgbzw-backend --region=asia-south1 --format='value(status.url)')
echo "Backend URL: $BACKEND_URL"
```

### Step 3: Update Frontend .env
```bash
cd ../frontend
echo "VITE_API_URL=$BACKEND_URL" > .env
npm run build
```

### Step 4: Deploy Frontend (Firebase)
```bash
firebase deploy --only hosting
```

---

## COST OPTIMIZATIONS

### 1. Gemini API (Biggest Cost Saver)
- Use `gemini-1.5-flash` (cheapest)
- Cache repeated queries in SQLite
- Limit response tokens to 500

### 2. Cloud Run (Scale to Zero)
- `--min-instances=0` = $0 when idle
- Cold start ~2-3 seconds
- `--concurrency=80` = handle more per instance

### 3. SQLite vs Firestore
- SQLite = $0 (file in container)
- Firestore = Pay per read/write
- Use SQLite for MVP

---

## EMERGENCY SHUTDOWN

```bash
# Stop all billing immediately
gcloud run services delete gdgbzw-backend --region=asia-south1
firebase hosting:disable
```

---

## MONITOR COSTS

```bash
# Check daily spending
gcloud billing accounts list
# Visit: https://console.cloud.google.com/billing
```

---

## UPGRADE PATH (When Budget Increases)

1. **$10/month**: Add Cloud SQL (PostgreSQL)
2. **$20/month**: Add CDN, increase max-instances to 3
3. **$50/month**: Add load balancer, multi-region

