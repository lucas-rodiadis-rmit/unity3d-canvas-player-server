#!/bin/bash

# Kill existing node on the port to avoid port conflicts
kill $(lsof -ti tcp:$PORT)
# kill -9 $(lsof -ti tcp:$PORT)
# Force kill, if necessary

# Get path variables from a .env file
# The following should be defined in .env as they are used in this script:
#   PORT, 
#   UNITY_PROJECTS_DIR
source .env

# Create the folder to store the unity projects, if it doesn't already exist
mkdir -p "$UNITY_PROJECTS_DIR" &&


# Build client-side code
../client/build_client_side.sh &&


# Move to server repository
cd ../server &&
# (Assuming dependencies are installed) Build the server and run it
npm run build && npm start
