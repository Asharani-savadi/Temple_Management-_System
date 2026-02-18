#!/bin/bash

# Temple Management System - Development Startup Script

echo "🚀 Starting Temple Management System..."
echo ""

# Start backend server
echo "🔧 Starting Backend API Server..."
cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your MySQL credentials."
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing backend dependencies..."
    npm install
    echo ""
fi

npm start &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "⚛️  Starting React Frontend..."
cd ../frontend

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
    echo ""
fi

npm start

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
