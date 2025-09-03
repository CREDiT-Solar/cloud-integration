#!/usr/bin/env bash
set -e

# Kill any existing ngrok processes
pkill -f "ngrok" >/dev/null 2>&1 || true

command -v ngrok >/dev/null 2>&1 || { echo "Error: ngrok is not installed or not in PATH." >&2; exit 1; }
command -v jq >/dev/null 2>&1 || { echo "Error: jq is not installed. Install it with 'sudo apt install jq'." >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: python3 is not installed." >&2; exit 1; }
command -v npx >/dev/null 2>&1 || { echo "Error: npx (Node.js) is not installed." >&2; exit 1; }

VENV_PATH=".venv"

if [[ -z "$VIRTUAL_ENV" ]]; then
  if [[ ! -d "$VENV_PATH" ]]; then
    echo "Error: Virtual environment not found at $VENV_PATH." >&2
    echo "Please create it with 'python3 -m venv .venv' and install dependencies." >&2
    exit 1
  fi

  source "$VENV_PATH/bin/activate"

  PYTHON_EXE=$(which python3)
  if [[ "$PYTHON_EXE" != *"$VENV_PATH"* ]]; then
    echo "Error: Python is not using the virtual environment ($VENV_PATH)." >&2
    exit 1
  fi
fi

python3 aws-backend/isa-api/isa-api.py &
FLASK_PID=$!

ngrok http 5000 --response-header-add "Access-Control-Allow-Origin: *" > /dev/null &
NGROK_PID=$!

sleep 2

API_URL=$(curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[0].public_url')

if [[ -z "$API_URL" || "$API_URL" == "null" ]]; then
  echo "Error: Failed to retrieve ngrok URL. Ensure ngrok is running." >&2
  kill $FLASK_PID $NGROK_PID
  exit 1
fi

echo "API_URL=$API_URL" > credit-frontend/.env

cd credit-frontend
npx expo start --tunnel

trap "kill $FLASK_PID $NGROK_PID >/dev/null 2>&1" EXIT
