#!/bin/bash
set -e  # Exit immediately if a command exits with a non-zero status

DOMAIN_URL="https://canvasunityplayer.hudini.online/"


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
cp -ra ../client/dist/ ./dist/resources/frontend

npm run build && npm start
