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

# Determine the correct path to backend directory
# Check if we're in demo directory or project root
if [ -d "../backend" ]; then
    # We're in demo directory
    cd ../backend
elif [ -d "backend" ]; then
    # We're in project root
    cd backend
else
    echo -e "${RED}❌ Backend directory not found. Please run from project root or demo directory.${NC}"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install || {
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    }
fi

# Check if database needs setup
echo -e "${BLUE}Checking database status...${NC}"
echo -e "${YELLOW}Note: Using db:add-demo to ensure consistent demo ABHA IDs are always present${NC}"
DB_FILE="data/quantivara.db"
NEEDS_SETUP=false
NEEDS_SEED=false

# Check if database file exists
if [ ! -f "$DB_FILE" ]; then
    echo -e "${YELLOW}Database file not found. Will setup database...${NC}"
    NEEDS_SETUP=true
    NEEDS_SEED=true
else
    # Check if database has the abha_id column in medical_documents table
    if ! sqlite3 "$DB_FILE" "SELECT abha_id FROM medical_documents LIMIT 1;" > /dev/null 2>&1; then
        echo -e "${YELLOW}Database exists but missing abha_id column. Will setup database...${NC}"
        NEEDS_SETUP=true
        NEEDS_SEED=true
    else
        # Check if database has data by querying users table
        if ! sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM users;" > /dev/null 2>&1; then
            echo -e "${YELLOW}Database exists but tables may be missing. Will setup database...${NC}"
            NEEDS_SETUP=true
            NEEDS_SEED=true
        else
            # Check specifically for demo ABHA IDs
            DEMO_ABHA_COUNT=$(sqlite3 "$DB_FILE" "SELECT COUNT(*) FROM users WHERE abha_id IN ('12345678901234', '98765432109876', '45678901234567', '11112222333344', '55556666777788');" 2>/dev/null || echo "0")
            
            if [ "$DEMO_ABHA_COUNT" -eq "5" ]; then
                echo -e "${GREEN}✅ Database is ready with demo ABHA IDs${NC}"
            else
                echo -e "${YELLOW}Database exists but missing demo ABHA IDs. Will reset for consistent demo...${NC}"
                NEEDS_SEED=true
            fi
        fi
    fi
fi

# Setup database if needed
if [ "$NEEDS_SETUP" = true ]; then
    echo -e "${BLUE}Setting up database schema...${NC}"
    npm run db:setup || {
        echo -e "${RED}❌ Database setup failed${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Database schema created${NC}"
fi

# Add missing demo data (preserves existing data)
if [ "$NEEDS_SEED" = true ]; then
    echo -e "${BLUE}Adding missing demo data (preserving existing data)...${NC}"
    npm run db:add-demo || {
        echo -e "${RED}❌ Demo data addition failed${NC}"
        exit 1
    }
    echo -e "${GREEN}✅ Demo data added successfully${NC}"
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
npm run dev > ../demo/backend.log 2>&1 &
BACKEND_PID=$!

# Return to project root (whether we came from demo/ or root)
if [ -d "../demo" ]; then
    # We came from demo directory
    cd ..
else
    # We came from project root
    cd ..
fi

# Wait for backend
if wait_for_server $BACKEND_PORT "Backend"; then
    echo -e "${GREEN}✅ Backend API available at: ${BLUE}http://localhost:$BACKEND_PORT/api/v1${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check demo/backend.log for errors.${NC}"
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
echo "  • 1234-5678-9012-34 (Ramesh Kumar - Diabetes)"
echo "  • 9876-5432-1098-76 (Priya Sharma - Asthma)"
echo "  • 4567-8901-2345-67 (Suresh Patel - Heart Disease)"
echo "  • 1111-2222-3333-44 (Ashok Gupta - Hypertension)"
echo "  • 5555-6666-7777-88 (Meera Singh - Thyroid)"
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
echo -e "${YELLOW}Tip: Check 'demo/backend.log' and 'frontend.log' if you see any issues${NC}"
echo ""

# Monitor processes
while true; do
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Backend crashed! Check demo/backend.log for errors${NC}"
        cleanup
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend crashed! Check frontend.log for errors${NC}"
        cleanup
    fi
    sleep 5
done