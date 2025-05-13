#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

# Load environment variables from .env
# Ensure .env defines: PORT
source .env

# Export environment variables for use in child scripts
export UNITY_PROJECTS_DIR="./storage/unity-projects"
export DOMAIN_URL="https://canvasunityplayer.hudini.online/"
export PUBLIC_URL="${DOMAIN_URL}public/"

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