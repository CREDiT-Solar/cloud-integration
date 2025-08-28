#!/bin/bash

cd aws-backend/isa-api || exit
python3 isa-api.py &

BACKEND_PID=$!

while ! nc -z localhost 8000; do
  sleep 1
done

cd credit-frontend || exit
npx expo start
