#!/usr/bin/env bash

set -e

wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-stable-linux-amd64.zip -O ngrok.zip

unzip -o ngrok.zip

sudo mv ngrok /usr/local/bin/

rm ngrok.zip

ngrok version
