@echo off
echo Stopping previous frontend process...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2

echo Starting frontend...
cd /d "%~dp0frontend"
npm run dev
pause
