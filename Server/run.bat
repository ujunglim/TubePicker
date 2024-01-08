@echo off
echo Starting PM2 processes...
set APP_NAME=tube_picker
set SCRIPT_PATH=./bin/www

REM Check if the process is running
pm2 list | findstr /C:"%APP_NAME%" >nul
if %errorlevel% equ 0 (
  echo The process %APP_NAME% is already running in PM2.
  pm2 restart %APP_NAME%
) else (
  echo The process %APP_NAME% is not currently running in PM2.
  pm2 start %SCRIPT_PATH% --name %APP_NAME% -- dev
)

echo All PM2 processes started.


