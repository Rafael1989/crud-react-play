@echo off
echo Parando processos Java/SBT anteriores...
taskkill /F /IM java.exe >nul 2>&1
taskkill /F /IM sbt.exe >nul 2>&1
timeout /t 3

echo Iniciando backend...
cd /d "%~dp0backend"
call .\sbt.cmd run
pause
