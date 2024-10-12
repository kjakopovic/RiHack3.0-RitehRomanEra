#!/bin/bash

# Set AWS region
AWS_REGION="eu-central-1"

# List of services to deploy
SERVICES=("user_service", "club_service")

# Save the initial working directory
ROOT_DIR=$(pwd)

# Loop through each service and deploy it
for SERVICE in "${SERVICES[@]}"
do
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
done

echo "============================================="
echo "All services have been deployed successfully."
echo "============================================="