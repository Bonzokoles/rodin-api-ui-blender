#!/bin/bash
echo "================================"
echo "   ZEN_on_3D_CreatoR Startup"
echo "================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "[INFO] pnpm not found, installing globally..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install pnpm"
        exit 1
    fi
fi

# Navigate to project directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Failed to install dependencies"
        exit 1
    fi
fi

# Start the development server
echo "[INFO] Starting ZEN_on_3D_CreatoR development server..."
echo "[INFO] Application will be available at: http://localhost:3035"
echo
echo "Press Ctrl+C to stop the server"
echo

pnpm dev -p 3035