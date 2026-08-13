#!/bin/bash
# Startup script for Text Analysis API

echo "========================================"
echo "Unknown Hands - Text Analysis API"
echo "========================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if requirements are installed
echo "Checking dependencies..."
python3 -c "import flask, flask_cors, sklearn, pandas, numpy, scipy" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required packages..."
    SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
    pip3 install -r "$SCRIPT_DIR/requirements.txt"
fi

echo ""
echo "Starting API server on http://localhost:5001"
echo "Press Ctrl+C to stop"
echo ""

# Start the API
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
python3 "$SCRIPT_DIR/api.py"
