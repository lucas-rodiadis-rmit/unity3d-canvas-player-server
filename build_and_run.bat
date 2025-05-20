@echo off
setlocal enabledelayedexpansion

REM Exit on error (manually handled since batch doesn't support `set -e`)
REM Define PORT to use
set PORT=8080

REM Kill existing process using the PORT
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%PORT% ^| findstr LISTENING') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Navigate to client directory
cd /d ..\client

REM Delete the dist directory contents
if exist dist (
    rmdir /s /q dist
    mkdir dist
)

REM Set environment variables for Vite
set VITE_DOMAIN_URL=https://canvasunityplayer.hudini.online/
set VITE_CLIENT_URL_BASE=frontend

REM Build frontend
call npm run build

REM Navigate to server directory
cd /d ..\server

REM Clean server dist directory
if exist dist (
    rmdir /s /q dist
)
mkdir dist\resources

REM Copy frontend build to server dist/resources/frontend
xcopy /e /i /y ..\client\dist dist\resources\frontend

REM Create storage directory if it doesn't exist
if not exist storage (
    mkdir storage
)

REM Build and start the server
call npm run build
call npm start
