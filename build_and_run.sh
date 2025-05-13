#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Variables for script
PORT=8080

# Save the original working directory of the parent script
export PARENT_SCRIPT_DIR=$(pwd)
# Export environment variables for use in child scripts
export UNITY_PROJECTS_DIR="storage/unity_projects"
export UNITY_PROJECT_TEST_DIR="test123456"
export DOMAIN_URL="https://canvasunityplayer.hudini.online/"
export CLIENT_SIDE_DIR="frontend"
export CLIENT_SIDE_URL="${DOMAIN_URL}${CLIENT_SIDE_DIR}/"

# Kill existing process using the PORT (suppress errors if nothing is running)
kill $(lsof -ti tcp:$PORT) 2>/dev/null || true
# Uncomment below to force kill if needed
# kill -9 $(lsof -ti tcp:$PORT) 2>/dev/null || true

# Create Unity projects directory if it doesn't exist
mkdir -p "$UNITY_PROJECTS_DIR"

# Build client-side code
../client/build_client_side.sh

# Build and start server
npm run build && npm start