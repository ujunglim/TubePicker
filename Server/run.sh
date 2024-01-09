#!/bin/bash

echo "Starting PM2 processes..."
APP_NAME="tube_picker"
SCRIPT_PATH="/home/ubuntu/TubePicker/Server/app.js"
PM2="/home/ubuntu/.nvm/versions/node/v17.9.1/bin/pm2"

# Check if the process is running
if "$PM2" list | grep -q "$APP_NAME"; then
  echo "The process $APP_NAME is already running in PM2."
  "$PM2" restart "$APP_NAME"
else
  echo "The process $APP_NAME is not currently running in PM2."
  "$PM2" start "$SCRIPT_PATH" --name "$APP_NAME" --max-restarts=1 -- pro
fi

echo "All PM2 processes started."