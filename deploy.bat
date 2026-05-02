@echo off
setlocal enabledelayedexpansion

REM =====================================================
REM  IPL INFLUENCE ENGINE — One-Command Cloud Run Deploy
REM  Edit these 3 variables once, then never touch again
REM =====================================================
REM =====================================================
REM  CONFIGURE THESE 3 VARIABLES
REM =====================================================
set PROJECT_ID=YOUR_GCP_PROJECT_ID
set SERVICE_NAME=ipl-influence-engine
set REGION=asia-south1

REM Optional: Set your Gemini API key here or in .env
set GEMINI_API_KEY=%GEMINI_API_KEY%
set API_KEY=%API_KEY%

REM Derived values
set IMAGE=gcr.io/%PROJECT_ID%/%SERVICE_NAME%

REM =====================================================
echo.
echo ======================================================
echo   IPL INFLUENCE ENGINE — AUTO DEPLOY PIPELINE
echo ======================================================
echo.

REM =====================================================
echo [1/5] VALIDATING PROJECT FILES...
echo =====================================================
if not exist "main.py" (
    echo ERROR: main.py not found! Run this from the project root.
    pause
    exit /b 1
)
if not exist "Dockerfile" (
    echo ERROR: Dockerfile not found!
    pause
    exit /b 1
)
if not exist "requirements.txt" (
    echo ERROR: requirements.txt not found!
    pause
    exit /b 1
)
echo  All critical files found.
echo.

REM =====================================================
echo [2/5] GIT COMMIT ^& PUSH TO GITHUB...
echo =====================================================
git add .
git status --short
git commit -m "deploy: auto update %date% %time%"
git push origin main
if !errorlevel! neq 0 (
    echo WARNING: Git push failed. Continuing with cloud build anyway...
)
echo  Code pushed to GitHub.
echo.

REM =====================================================
echo [3/5] BUILDING CONTAINER VIA GOOGLE CLOUD BUILD...
echo =====================================================
echo  This submits your code to Google Cloud Build (no local Docker needed)
gcloud builds submit --tag %IMAGE% --project %PROJECT_ID%
if !errorlevel! neq 0 (
    echo ERROR: Cloud Build failed! Check logs above.
    pause
    exit /b 1
)
echo  Container image built successfully.
echo.

REM =====================================================
echo [4/5] DEPLOYING TO CLOUD RUN...
echo =====================================================
gcloud run deploy %SERVICE_NAME% ^
    --image %IMAGE% ^
    --platform managed ^
    --region %REGION% ^
    --allow-unauthenticated ^
    --port 8080 ^
    --memory 1Gi ^
    --cpu 1 ^
    --min-instances 0 ^
    --max-instances 3 ^
    --set-env-vars "GEMINI_API_KEY=%GEMINI_API_KEY%,API_KEY=%API_KEY%" ^
    --project %PROJECT_ID%

if !errorlevel! neq 0 (
    echo ERROR: Cloud Run deployment failed!
    pause
    exit /b 1
)
echo.

REM =====================================================
echo [5/5] FETCHING LIVE URL...
echo =====================================================
gcloud run services describe %SERVICE_NAME% ^
    --platform managed ^
    --region %REGION% ^
    --project %PROJECT_ID% ^
    --format "value(status.url)"

echo.
echo ======================================================
echo   DEPLOYMENT COMPLETE!
echo   Your IPL Influence Engine is LIVE.
echo ======================================================
echo.
pause
