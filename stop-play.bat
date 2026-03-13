@echo off
setlocal

echo [1/3] Stopping Java/SBT processes...
taskkill /F /IM java.exe /T >nul 2>&1
taskkill /F /IM javaw.exe /T >nul 2>&1
taskkill /F /IM sbt.exe /T >nul 2>&1

echo [2/3] Releasing Play ports (9000, 9001, 9002, 9443, 9555)...
for %%P in (9000 9001 9002 9443 9555) do (
  for /f "tokens=5" %%I in ('netstat -ano ^| findstr ":%%P" ^| findstr "LISTENING"') do (
    taskkill /F /PID %%I >nul 2>&1
  )
)

echo [3/3] Checking port 9000...
powershell -NoProfile -ExecutionPolicy Bypass -Command "if (Test-NetConnection -ComputerName localhost -Port 9000 -InformationLevel Quiet -WarningAction SilentlyContinue) { Write-Output 'Port 9000 is still in use' } else { Write-Output 'Play stopped successfully (port 9000 is free)' }"

echo.
echo Done.
endlocal
