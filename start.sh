#!/bin/bash
# This script starts both the backend and frontend servers for development.

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to clean up background processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill 0
}
trap cleanup EXIT

echo "Starting servers... (Press Ctrl+C to stop all)"

# Start the backend server in the background
echo "-> Starting backend server..."
(cd server && npm run dev) &
# Give the backend a moment to initialize
sleep 3

# Start the frontend server in the foreground
echo "-> Starting frontend server..."
(cd client && npm run dev)

# The trap will handle cleanup when you Ctrl+C the frontend process
