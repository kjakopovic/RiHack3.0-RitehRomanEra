import json
import boto3
import os
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    error_response, _ = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
    
    if error_response:
        return error_response
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info("GET USERS PRIVATE INFO - Fetching user information.")

    # Find user in the table by email
    try:
        response = users_table.scan()

        logger.info(f"GET USERS PRIVATE INFO - Found {response}")

        # Check if user exists
        if not response.get('Items'):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'We could not find your account. Please try again or contact support.'
                })
            }
        
        users = response['Items']

        logger.info(f"GET USERS PRIVATE INFO - Found {users} users.")

        filtered_users = []

        for user in users:
            filtered_users.append({
                'email': user['email'],
                'points': float(user['points']),
                'first_name': user['first_name'],
                'last_name': user['last_name']
            })

    except Exception as e:
        logger.error(f"GET USERS PRIVATE INFO - Couldn't get private info: {str(e)}")

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Couldn't get private info. Please try again or contact support."
            })
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'users': filtered_users
        })
    }