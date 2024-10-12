#!/bin/bash

# Set AWS region
AWS_REGION="eu-central-1"

# List of known services
KNOWN_SERVICES=("user_service" "club_service" "events_service")

# Check if a service name was provided as an argument
if [ -z "$1" ]; then
  echo "Usage: $0 <service_name>"
  echo "Please provide the name of the service to deploy."
  exit 1
fi

SERVICE="$1"

# Check if the provided service is in the list of known services
if [[ ! " ${KNOWN_SERVICES[@]} " =~ " ${SERVICE} " ]]; then
  echo "Error: Unknown service '$SERVICE'."
  echo "Known services are: ${KNOWN_SERVICES[@]}"
  exit 1
fi

# Save the initial working directory
ROOT_DIR=$(pwd)

echo "======================"
echo "Deploying $SERVICE"
echo "======================"

# Navigate to the service directory
SERVICE_DIR="$ROOT_DIR/../../$SERVICE"
if [ ! -d "$SERVICE_DIR" ]; then
  echo "Error: Service directory $SERVICE_DIR does not exist."
  exit 1
fi

cd "$SERVICE_DIR" || exit

# Build the SAM application
echo "Building $SERVICE..."
if ! sam build; then
  echo "Error: Failed to build $SERVICE"
  exit 1
fi

# Deploy the SAM application
echo "Deploying $SERVICE..."
if ! sam deploy --no-confirm-changeset --region $AWS_REGION; then
  echo "Error: Failed to deploy $SERVICE"
  exit 1
fi

# Go back to the root directory
cd "$ROOT_DIR" || exit

echo "$SERVICE deployment completed."
echo ""
echo "============================================="
echo "Service '$SERVICE' has been deployed successfully."
echo "============================================="
