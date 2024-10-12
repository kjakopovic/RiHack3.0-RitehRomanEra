#!/bin/bash

# Variables for SERVICE_NAME and ARTIFACTS_DIR passed as arguments
SERVICE_NAME=$1
COMMON_CODE_PATH=$2
ARTIFACTS_DIR=$3

echo "--------------------"
echo "Building common file"
echo "--------------------"

# Check if ARTIFACTS_DIR is provided, else use default
if [ -z "$ARTIFACTS_DIR" ]; then
  echo "Error: ARTIFACTS_DIR not provided."
  exit 1
fi

# Ensure SERVICE_NAME is provided
if [ -z "$SERVICE_NAME" ]; then
  echo "Error: SERVICE_NAME not provided."
  exit 1
fi

# Ensure COMMON_CODE_PATH is provided
if [ -z "$COMMON_CODE_PATH" ]; then
  echo "Error: COMMON_CODE_PATH not provided."
  exit 1
fi

# Create the directory structure
if [ ! -d "$ARTIFACTS_DIR/backend/common" ]; then
    mkdir -p "$ARTIFACTS_DIR/backend/common"
fi

# Create __init__.py files
touch "$ARTIFACTS_DIR/backend/__init__.py"
touch "$ARTIFACTS_DIR/backend/common/__init__.py"

# Copy common.py to the common directory
cp "$COMMON_CODE_PATH/common.py" "$ARTIFACTS_DIR/backend/common/"
python3 -m pip install -r "$COMMON_CODE_PATH/requirements.txt" --target "$ARTIFACTS_DIR"
