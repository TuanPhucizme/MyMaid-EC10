#!/bin/bash

echo "🚀 Testing Production Build Locally"
echo "=================================="

# Set production environment
export NODE_ENV=production
export PORT=3000

echo "📦 Installing dependencies..."
npm install
cd server && npm install
cd ../client && npm install
cd ..

echo "🏗️ Building client..."
cd client
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Client build successful"
else
    echo "❌ Client build failed"
    exit 1
fi

cd ..

echo "🌟 Starting production server..."
echo "Server will be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/api/health"
echo ""
echo "Press Ctrl+C to stop the server"

npm run start:production
