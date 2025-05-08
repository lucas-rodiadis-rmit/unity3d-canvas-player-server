#!/bin/bash

mkdir -p ./resources/player &&
cd ../client/ &&
npx vite build && cp -ra ./dist/* ../server/resources/player &&
cd ../server &&
npm run build && npm start
