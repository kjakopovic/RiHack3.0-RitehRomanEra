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
    
    logger.info("DELETE USER PROFILE - Getting database client.")
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info("DELETE USER PROFILE - Checking if user exists.")

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
                    'message': 'We could not find your account. Please try again or contact support.'
                })
            }
        
        logger.info("DELETE USER PROFILE - Deleting user profile.")

        # Delete profile
        common_handler.delete_profile_picture_from_s3(email)

        users_table.delete_item(
            Key={
                'email': email
            }
        )
    except Exception as e:
        logger.error(f"DELETE USER PROFILE - Couldn't delete user profile: {str(e)}")

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Couldn't delete user profile. Please try again or contact support."
            })
        }
    
    return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': "Deleted profile successfully."
            })
        }