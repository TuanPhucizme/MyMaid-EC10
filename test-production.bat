@echo off
echo 🚀 Testing Production Build Locally
echo ==================================

REM Set production environment
set NODE_ENV=production
set PORT=3000

echo 📦 Installing dependencies...
call npm install
cd server && call npm install
cd ..\client && call npm install
cd ..

echo 🏗️ Building client...
cd client
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Client build successful
) else (
    echo ❌ Client build failed
    exit /b 1
)

cd ..

echo 🌟 Starting production server...
echo Server will be available at: http://localhost:3000
echo Health check: http://localhost:3000/api/health
echo.
echo Press Ctrl+C to stop the server

call npm run start:production
