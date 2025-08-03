#!/bin/bash

# Start the backend Azure Functions app
cd backend
npm install
echo "Starting Azure Functions backend..."
func start &

# Wait a bit for the backend to initialize
sleep 5

# Navigate back to root and start the frontend
cd ..
echo "Starting frontend..."
npm install
npm run dev

# When the script is interrupted, kill background processes
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
