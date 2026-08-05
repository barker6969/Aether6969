#!/bin/bash
# Run Aether locally without Docker
# Requirements: Python 3.11+, Node 20+, yarn, MongoDB running on localhost:27017

set -e

echo "=== Starting Aether locally ==="

# Backend setup
echo ""
echo "--- Setting up backend ---"
cd backend

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created backend/.env from .env.example — fill in your secrets before running again."
  exit 1
fi

if [ ! -d venv ]; then
  python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt

echo "Starting backend on http://localhost:8001 ..."
uvicorn server:app --host 0.0.0.0 --port 8001 --reload &
BACKEND_PID=$!
cd ..

# Frontend setup
echo ""
echo "--- Setting up frontend ---"
cd frontend
yarn install --silent

echo "Starting frontend on http://localhost:3000 ..."
REACT_APP_BACKEND_URL=http://localhost:8001 yarn start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=== Aether is running ==="
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8001/api"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
