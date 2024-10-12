import json
import boto3
import os
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    error_response, email = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
    
    if error_response:
        return error_response
    
    logger.info("LOGOUT USER - Getting database client.")
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info("LOGOUT USER - Checking if user exists.")

    # Find user in the table by email
    try:
        response = users_table.get_item(
            Key={
                'email': email
            }
        )

        # Check if user exists
        if not response.get('Item'):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'We could not find your email. Please try again or contact support.'
                })
            }
        
        logger.info("LOGOUT USER - Logging out user.")
        
        # Terminate the refresh token
        users_table.update_item(
            Key={
                'email': email
            },
            UpdateExpression='REMOVE refresh_token, refresh_token_expiration'
        )

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': "Logged out successfully."
            })
        }
    except Exception as e:
        logger.error(f"LOGOUT USER - Couldn't logout user: {str(e)}")

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Couldn't logout user. Please try again or contact support."
            })
        }