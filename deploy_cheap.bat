@echo off
setlocal EnableDelayedExpansion

REM ============================================================
REM CHEAPEST GCP DEPLOY SCRIPT - $5 Budget Optimization
REM ============================================================

echo ========================================
echo  CHEAP DEPLOY - IPL Influence Engine
echo  Budget: $5 for 10+ days
echo ========================================
echo.

REM Check prerequisites
echo [1/8] Checking prerequisites...

where gcloud >nul 2>nul
if errorlevel 1 (
    echo ERROR: gcloud CLI not found. Install from https://cloud.google.com/sdk
    exit /b 1
)

where firebase >nul 2>nul
if errorlevel 1 (
    echo ERROR: firebase CLI not found. Run: npm install -g firebase-tools
    exit /b 1
)

where docker >nul 2>nul
if errorlevel 1 (
    echo WARNING: Docker not found. Using --source deploy method.
)

REM Check environment variables
echo [2/8] Checking environment variables...

if "%GCP_PROJECT%"=="" (
    echo ERROR: GCP_PROJECT not set
    echo Run: set GCP_PROJECT=your-project-id
    exit /b 1
)

if "%GEMINI_API_KEY%"=="" (
    echo WARNING: GEMINI_API_KEY not set. AI features will be disabled.
)

if "%API_KEY%"=="" (
    echo WARNING: API_KEY not set. Using default.
    set API_KEY=dev-key-change-in-prod
)

REM Set default region (cheapest)
if "%GCP_REGION%"=="" set GCP_REGION=asia-south1
set SERVICE_NAME=gdgbzw-backend
set FRONTEND_URL=https://gdgbzw.web.app

echo Project: %GCP_PROJECT%
echo Region: %GCP_REGION% (cheapest available)
echo Service: %SERVICE_NAME%
echo.

REM ============================================================
REM DEPLOY BACKEND (Cloud Run - Scale to Zero)
REM ============================================================
echo [3/8] Deploying backend to Cloud Run (cheapest settings)...
echo Settings: min-instances=0, max=1, 512Mi RAM, 80 concurrency
echo.

cd ipl_influence_engine

REM Build and deploy with cost-optimized settings
gcloud run deploy %SERVICE_NAME% ^
    --source . ^
    --project=%GCP_PROJECT% ^
    --region=%GCP_REGION% ^
    --min-instances=0 ^
    --max-instances=1 ^
    --memory=512Mi ^
    --cpu=1 ^
    --concurrency=80 ^
    --timeout=300 ^
    --no-cpu-boost ^^    --allow-unauthenticated ^
    --set-env-vars="GEMINI_API_KEY=%GEMINI_API_KEY%,API_KEY=%API_KEY%,CORS_ORIGINS=%FRONTEND_URL%,DB_URL=sqlite:///./ipl_data.db" ^
    --set-env-vars="PYTHONUNBUFFERED=1" ^
    --quiet

if errorlevel 1 (
    echo ERROR: Backend deployment failed
    cd ..
    exit /b 1
)

REM Get backend URL
echo [4/8] Getting backend URL...
for /f "tokens=*" %%a in ('gcloud run services describe %SERVICE_NAME% --region=%GCP_REGION% --project=%GCP_PROJECT% --format="value(status.url)"') do (
    set BACKEND_URL=%%a
)

echo Backend URL: %BACKEND_URL%
cd ..

REM ============================================================
REM UPDATE FRONTEND CONFIG
REM ============================================================
echo [5/8] Updating frontend configuration...
cd frontend

echo VITE_API_URL=%BACKEND_URL% > .env.local
echo FRONTEND_URL=%FRONTEND_URL%
echo BACKEND_URL=%BACKEND_URL%

REM ============================================================
REM BUILD FRONTEND
REM ============================================================
echo [6/8] Building frontend for production...
npm run build

if errorlevel 1 (
    echo ERROR: Frontend build failed
    cd ..
    exit /b 1
)

REM ============================================================
REM DEPLOY FRONTEND (Firebase Hosting - FREE TIER)
REM ============================================================
echo [7/8] Deploying frontend to Firebase Hosting (free tier)...

firebase deploy --only hosting --project=%GCP_PROJECT%

if errorlevel 1 (
    echo ERROR: Frontend deployment failed
    cd ..
    exit /b 1
)

cd ..

REM ============================================================
REM VALIDATION
REM ============================================================
echo [8/8] Validating deployment...
echo.
echo Testing health endpoint...
curl -s -o /dev/null -w "%%{http_code}" %BACKEND_URL%/health > tmp.txt
set /p HEALTH_CODE=<tmp.txt
del tmp.txt

if "%HEALTH_CODE%"=="200" (
    echo ✅ Health check passed (%HEALTH_CODE%)
) else (
    echo ⚠️ Health check returned: %HEALTH_CODE%
)

REM ============================================================
REM FINAL OUTPUT
REM ============================================================
echo.
echo ========================================
echo  DEPLOYMENT COMPLETE
echo ========================================
echo.
echo 🌐 FRONTEND (FREE): %FRONTEND_URL%
echo 🔧 BACKEND ($0 idle): %BACKEND_URL%
echo.
echo 📊 COST SETTINGS:
echo    - Region: %GCP_REGION% (lowest cost)
echo    - Min instances: 0 (scale to zero)
echo    - Max instances: 1 (prevent runaway)
echo    - Memory: 512Mi (minimum stable)
echo    - Concurrency: 80 (cost efficient)
echo.
echo 💰 ESTIMATED DAILY COST:
echo    - 0 users: $0.00 (scales to zero)
echo    - 50 users/day: $0.10-0.30
echo    - 100 users/day: $0.20-0.50
echo.
echo 🛑 EMERGENCY SHUTDOWN:
echo    gcloud run services delete %SERVICE_NAME% --region=%GCP_REGION%
echo    firebase hosting:disable
echo.
echo 📈 Monitor costs: https://console.cloud.google.com/billing
echo.

endlocal
