#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Variables for script
# PORT=8080

# Save the original working directory of the parent script
# export PARENT_SCRIPT_DIR=$(pwd)
# Export environment variables for use in child scripts
# export UNITY_PROJECTS_DIR="storage/unity_projects"
# export UNITY_PROJECT_TEST_DIR="test123456"
# export DOMAIN_URL="https://canvasunityplayer.hudini.online/"
# export CLIENT_SIDE_DIR="frontend"
# export CLIENT_SIDE_URL="${DOMAIN_URL}${CLIENT_SIDE_DIR}/"


# Kill existing process using the PORT (suppress errors if nothing is running)
kill $(lsof -ti tcp:$PORT) 2>/dev/null || true
# Uncomment below to force kill if needed
# kill -9 $(lsof -ti tcp:$PORT) 2>/dev/null || true

cd ../client
rm -rf ./dist/*


# Build the frontend
export VITE_DOMAIN_URL="https://canvasunityplayer.hudini.online/"
export VITE_CLIENT_URL_BASE="frontend"
npm run build
cd ../server

rm -rf ./dist/*

# Create dist AND resources directories if they dont exist
mkdir -p ./dist/resources/
mv ../client/dist/ ./dist/resources/frontend

npm run build && npm start
