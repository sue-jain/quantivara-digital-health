#!/bin/bash

# Quantivara Digital Health - Enhanced Demo Runner
# This script handles all demo setup and startup with better error handling

echo "🏥 Quantivara Digital Health Demo Runner"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
BACKEND_PORT=3001
FRONTEND_PORT=8080
SITE_PASSWORD="NmptGd3qAja?X7gY"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    if check_port $1; then
        echo -e "${YELLOW}Port $1 is in use. Killing process...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Function to wait for server
wait_for_server() {
    local port=$1
    local name=$2
    local attempts=0
    local max_attempts=30
    
    echo -e "${BLUE}Waiting for $name to start...${NC}"
    
    while ! check_port $port; do
        attempts=$((attempts + 1))
        if [ $attempts -eq $max_attempts ]; then
            echo -e "${RED}❌ $name failed to start after $max_attempts seconds${NC}"
            return 1
        fi
        sleep 1
    done
    
    echo -e "${GREEN}✅ $name is ready!${NC}"
    return 0
}

# Function to open URL in browser
open_browser() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "$1"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$1" 2>/dev/null || echo -e "${YELLOW}Please open $1 in your browser${NC}"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        start "$1"
    else
        echo -e "${YELLOW}Please open $1 in your browser${NC}"
    fi
}

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites satisfied${NC}"
echo ""

# Clean up any existing processes
echo -e "${BLUE}Cleaning up existing processes...${NC}"
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT
pkill -f "nodemon" 2>/dev/null || true
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

# Start Backend
echo -e "${BLUE}Starting Backend Server...${NC}"
cd backend 2>/dev/null || {
    echo -e "${RED}❌ Backend directory not found. Are you in the project root?${NC}"
    exit 1
}

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install || {
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    }
fi

# Create .env if missing
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating backend .env file...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        echo -e "${RED}⚠️  No .env.example found. Backend may not work correctly.${NC}"
    fi
fi

# Start backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend
if wait_for_server $BACKEND_PORT "Backend"; then
    echo -e "${GREEN}✅ Backend API available at: ${BLUE}http://localhost:$BACKEND_PORT/api/v1${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check backend.log for errors.${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
echo ""

# Start Frontend
echo -e "${BLUE}Starting Frontend Server...${NC}"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install || {
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    }
fi

# Create .env if missing
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating frontend .env file...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        echo "VITE_API_URL=http://localhost:$BACKEND_PORT" > .env
    fi
fi

# Start frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend
if wait_for_server $FRONTEND_PORT "Frontend"; then
    echo -e "${GREEN}✅ Frontend available at: ${BLUE}http://localhost:$FRONTEND_PORT${NC}"
else
    echo -e "${RED}❌ Frontend failed to start. Check frontend.log for errors.${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 1
fi

# Success! Display information
echo ""
echo -e "${GREEN}🚀 Demo is ready!${NC}"
echo "========================================"
echo -e "${BLUE}Frontend:${NC} http://localhost:$FRONTEND_PORT"
echo -e "${BLUE}Password:${NC} ${YELLOW}$SITE_PASSWORD${NC}"
echo ""
echo -e "${BLUE}Demo Features:${NC}"
echo "  • ABHA ID Lookup: http://localhost:$FRONTEND_PORT/demo/abha-lookup"
echo "  • Document Processor: http://localhost:$FRONTEND_PORT/processor"
echo "  • Analytics Dashboard: http://localhost:$FRONTEND_PORT/demo/analytics"
echo ""
echo -e "${BLUE}Test ABHA IDs:${NC}"
echo "  • 1234-5678-9012-34 (Diabetes patient)"
echo "  • 9876-5432-1098-76 (Allergy patient)"
echo "  • 4567-8901-2345-67 (Heart patient)"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
echo "========================================"

# Open browser after 2 seconds
sleep 2
echo -e "${BLUE}Opening demo in browser...${NC}"
open_browser "http://localhost:$FRONTEND_PORT"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill_port $BACKEND_PORT
    kill_port $FRONTEND_PORT
    pkill -f "nodemon" 2>/dev/null || true
    echo -e "${GREEN}✅ Demo stopped successfully${NC}"
    exit 0
}

# Set trap to cleanup on Ctrl+C
trap cleanup INT TERM

# Keep script running and show logs
echo ""
echo -e "${BLUE}Monitoring servers... (Press Ctrl+C to stop)${NC}"
echo -e "${YELLOW}Tip: Check 'backend.log' and 'frontend.log' if you see any issues${NC}"
echo ""

# Monitor processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend crashed! Check backend.log for errors${NC}"
        cleanup
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend crashed! Check frontend.log for errors${NC}"
        cleanup
    fi
    sleep 5
done