#!/bin/bash
# setup_venv.sh

set -e

UPDATE=false
if [[ "$1" == "-u" || "$1" == "--update" ]]; then
    UPDATE=true
fi

if [ "$UPDATE" = true ]; then
    sudo apt update
    sudo apt install -y python3-venv
    pip install --upgrade pip
fi

FREEZE=false
if [[ "$1" == "-f" || "$1" == "--freeze" ]]; then
    FREEZE=true
fi

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
fi

source .venv/bin/activate
pip install -r requirements.txt

if [ "$FREEZE" = true ]; then
    pip freeze > requirements.txt
fi