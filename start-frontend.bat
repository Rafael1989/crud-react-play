@echo off
echo Parando frontend anterior...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2

echo Iniciando frontend...
cd /d "%~dp0frontend"
npm run dev
pause
