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
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info("GET USERS PUBLIC INFO - Fetching user information.")

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
        
        user_profile_picture = common_handler.get_profile_picture_as_base64_from_s3(email)
    except Exception as e:
        logger.error(f"GET USERS PUBLIC INFO - Couldn't get public info: {str(e)}")

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Couldn't get public info. Please try again or contact support."
            })
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'info': {
                'email': response['Item']['email'] if response.get('Item').get('email') else None,
                'first_name': response['Item']['first_name'] if response.get('Item').get('first_name') else None,
                'last_name': response['Item']['last_name'] if response.get('Item').get('last_name') else None,
                'profile_picture': user_profile_picture
            }
        })
    }