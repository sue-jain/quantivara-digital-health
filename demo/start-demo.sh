#!/bin/bash

# Quantivara Digital Health - Demo Startup Script

echo "🏥 Starting Quantivara Digital Health Demo..."
echo "============================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Function to open URL in browser
open_browser() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$1"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$1"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        start "$1"
    fi
}

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd ../backend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
fi

# Start backend in background
echo -e "${GREEN}✓ Starting backend on http://localhost:3001${NC}"
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start Frontend
cd ../..
echo -e "${BLUE}Starting Frontend Server...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env
fi

# Start frontend in background
echo -e "${GREEN}✓ Starting frontend on http://localhost:5173${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 5

echo ""
echo -e "${GREEN}🚀 Demo is ready!${NC}"
echo "============================================"
echo -e "Frontend: ${BLUE}http://localhost:5173${NC}"
echo -e "Backend API: ${BLUE}http://localhost:3001/api/v1${NC}"
echo -e "WebSocket: ${BLUE}ws://localhost:3001/ws${NC}"
echo ""
echo "Demo Features:"
echo -e "  • ABHA ID Lookup: ${BLUE}http://localhost:5173/demo/abha-lookup${NC}"
echo -e "  • Document Processor: ${BLUE}http://localhost:5173/processor${NC}"
echo -e "  • Analytics Dashboard: ${BLUE}http://localhost:5173/demo/analytics${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"

# Open browser
echo ""
echo -e "${BLUE}Opening demo in browser...${NC}"
sleep 2
open_browser "http://localhost:5173"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✓ Demo stopped${NC}"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT

# Keep script running
while true; do
    sleep 1
done