@echo off
setlocal

cd /d "%~dp0"

rem Clear stale lock files that can block SBT boot server on Windows.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-ChildItem \"$env:USERPROFILE\.sbt\" -Recurse -Filter \"*lock*\" -Force -ErrorAction SilentlyContinue | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue" >nul 2>&1

set "REAL_SBT=C:\tools\sbt\sbt\bin\sbt.bat"
if not exist "%REAL_SBT%" set "REAL_SBT=%USERPROFILE%\scoop\shims\sbt.cmd"

call "%REAL_SBT%" %*
endlocal
