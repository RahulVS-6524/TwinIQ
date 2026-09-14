@echo off
title TwinIQ Launcher

echo.
echo ==========================================
echo       TwinIQ - Living Cognitive Business Twin
echo ==========================================
echo.

echo [1/2] Starting Backend...
start "TwinIQ Backend" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%~dp0backend\twiniq-backend'; Write-Host 'TwinIQ Backend starting...' -ForegroundColor Cyan; .\mvnw.cmd spring-boot:run"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend...
start "TwinIQ Frontend" powershell -NoExit -ExecutionPolicy Bypass -Command "Set-Location '%~dp0frontend'; Write-Host 'TwinIQ Frontend starting...' -ForegroundColor Green; npm run dev"

echo.
echo ==========================================
echo       Waiting for TwinIQ services...
echo ==========================================
echo.

echo Checking Frontend on port 5173...

:WAIT_FRONTEND
powershell -NoProfile -Command "try { $r=Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){exit 0}else{exit 1} } catch { exit 1 }"

if errorlevel 1 (
    timeout /t 2 /nobreak >nul
    goto WAIT_FRONTEND
)

echo.
echo ==========================================
echo       TwinIQ Frontend is READY!
echo ==========================================
echo.
echo Opening TwinIQ...
echo.

start "" "http://localhost:5173"

echo.
echo TwinIQ has been started.
echo You can close this launcher window.
echo.
pause