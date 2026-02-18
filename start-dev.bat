@echo off
REM Temple Management System - Development Startup Script for Windows

echo Starting Temple Management System...
echo.

REM Start backend server
echo Starting Backend API Server...
cd backend

REM Check if .env exists
if not exist .env (
    echo .env file not found. Creating from .env.example...
    copy .env.example .env
    echo .env file created. Please update it with your MySQL credentials.
    echo.
)

REM Check if node_modules exists
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
    echo.
)

start "Backend API" cmd /k npm start

REM Wait for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend
echo Starting React Frontend...
cd ..\frontend

REM Check if node_modules exists
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
    echo.
)

call npm start
