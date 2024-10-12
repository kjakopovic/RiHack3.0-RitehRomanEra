#!/bin/bash

# Variables
SERVICE_NAME=$1
LAMBDA_FILE=$2
ARTIFACTS_DIR=$3

# Ensure SERVICE_NAME is provided
if [ -z "$SERVICE_NAME" ]; then
  echo "Error: SERVICE_NAME not provided."
  exit 1
fi

# Ensure LAMBDA_FILE is provided
if [ -z "$LAMBDA_FILE" ]; then
  echo "Error: LAMBDA_FILE not provided."
  exit 1
fi

# Ensure ARTIFACTS_DIR is provided
if [ -z "$ARTIFACTS_DIR" ]; then
  echo "Error: ARTIFACTS_DIR not provided."
  exit 1
fi

# Create ARTIFACTS_DIR if it doesn't exist
if [ ! -d "$ARTIFACTS_DIR" ]; then 
    mkdir -p "$ARTIFACTS_DIR"
fi

# Create the __init__.py file
touch "$ARTIFACTS_DIR/__init__.py"

# Copy the LAMBDA_FILE to ARTIFACTS_DIR
cp "$LAMBDA_FILE" "$ARTIFACTS_DIR/"

# Remove the bin directory if it exists
if [ -d "$ARTIFACTS_DIR/bin" ]; then 
    rm -rf "$ARTIFACTS_DIR/bin"
fi
