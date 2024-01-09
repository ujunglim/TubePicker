#!/bin/bash

echo "Starting PM2 processes..."
APP_NAME="tube_picker"
SCRIPT_PATH="app.js"

# Check if the process is running
if pm2 list | grep -q "$APP_NAME"; then
  echo "The process $APP_NAME is already running in PM2."
  pm2 restart "$APP_NAME"
else
  echo "The process $APP_NAME is not currently running in PM2."
  pm2 start "$SCRIPT_PATH" --name "$APP_NAME" --max-restarts=1 -- pro
fi

echo "All PM2 processes started."