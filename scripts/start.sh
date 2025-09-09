#!/bin/bash

# Start the backend Azure Functions app
# Get the project root (parent of scripts directory)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$PROJECT_ROOT/backend"
npm install
echo "Starting Azure Functions backend..."
func start &

# Wait a bit for the backend to initialize
sleep 5

# Navigate to project root and start the frontend
cd "$PROJECT_ROOT"
echo "Starting frontend..."
npm install
npm run dev

# When the script is interrupted, kill background processes
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
