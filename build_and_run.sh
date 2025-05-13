#!/bin/bash

# Get environment variables from a .env file
# The following should be defined in .env as they are used in this script:
#   PORT, 
source .env

# The directory where the Unity projects will be stored
UNITY_PROJECTS_DIR="./storage/unity-projects"
UNITY_PROJECTS_DIR="$UNITY_PROJECTS_DIR" ../client/build_client_side.sh # Pass the directory to the client-side build script

# The domain URL for the server
DOMAIN_URL="https://canvasunityplayer.hudini.online/"
DOMAIN_URL="$DOMAIN_URL" ../client/build_client_side.sh # Pass the domain URL to the client-side build script
# Public assets directory for the server
PUBLIC_URL="${DOMAIN_URL}public/"
PUBLIC_URL="$PUBLIC_URL" ../client/build_client_side.sh # Pass the public URL to the client-side build script

# Kill existing node on the port to avoid port conflicts
kill $(lsof -ti tcp:$PORT)
# kill -9 $(lsof -ti tcp:$PORT)
# Force kill, if necessary

# Create the folder to store the unity projects, if it doesn't already exist
mkdir -p "$UNITY_PROJECTS_DIR" &&

# Build client-side code
../client/build_client_side.sh &&

# (Assuming dependencies are installed) Build the server and run it
npm run build && npm start