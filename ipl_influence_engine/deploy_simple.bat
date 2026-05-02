@echo off
setlocal enabledelayedexpansion

REM =====================================================
REM  IPL AI AGENT — ONE-COMMAND AUTO DEPLOY
REM  Edit these 3 variables once, deploy forever
REM =====================================================
set PROJECT_ID=YOUR_GCP_PROJECT_ID
set SERVICE_NAME=ipl-ai-agent
set REGION=asia-south1

set IMAGE=gcr.io/%PROJECT_ID%/%SERVICE_NAME%

echo.
echo =====================================
echo  IPL AI AGENT — AUTO DEPLOY PIPELINE
echo =====================================
echo.

REM =====================================================
echo [1/4] VALIDATING PROJECT FILES...
echo =====================================
if not exist "main.py" (
    echo ERROR: main.py not found!
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
echo  All files found.
echo.

REM =====================================================
echo [2/4] GIT COMMIT ^& PUSH...
echo =====================================
git add .
git commit -m "deploy: auto update %date% %time%" || echo No changes to commit
git push origin main
if !errorlevel! neq 0 (
    echo WARNING: Git push failed. Continuing...
)
echo  Code pushed.
echo.

REM =====================================================
echo [3/4] BUILDING CONTAINER...
echo =====================================
gcloud builds submit --tag %IMAGE% --project %PROJECT_ID%
if !errorlevel! neq 0 (
    echo ERROR: Cloud Build failed!
    pause
    exit /b 1
)
echo  Container built.
echo.

REM =====================================================
echo [4/4] DEPLOYING TO CLOUD RUN...
echo =====================================
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
    --project %PROJECT_ID%

if !errorlevel! neq 0 (
    echo ERROR: Cloud Run deployment failed!
    pause
    exit /b 1
)

echo.
echo =====================================
echo  FETCHING LIVE URL...
echo =====================================
for /f "tokens=*" %%a in ('gcloud run services describe %SERVICE_NAME% --platform managed --region %REGION% --project %PROJECT_ID% --format "value(status.url)"') do (
    echo.
    echo =====================================
    echo   DEPLOYED SUCCESSFULLY!
    echo   URL: %%a
    echo =====================================
)

echo.
pause
