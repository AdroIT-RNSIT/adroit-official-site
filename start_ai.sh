#!/bin/bash

# Check if .env is configured
if grep -q "CHANGE_ME_TO_YOUR_GEMINI_API_KEY" ai-service/.env; then
  echo "❌ Error: You need to set your GEMINI_API_KEY in ai-service/.env first!"
  exit 1
fi

echo "🚀 Starting AdroIT AI Service..."
cd ai-service

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Run uvicorn
uvicorn main:app --reload --port 8000
