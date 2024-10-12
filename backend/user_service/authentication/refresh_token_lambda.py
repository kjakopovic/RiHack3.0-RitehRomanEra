import json
import boto3
import os
from datetime import datetime, timezone
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = event.get('queryStringParameters', {})

    logger.info(f'REFRESH TOKEN - Checking is every required attribute found in query: {event}')

    try:
        email = event['user_email']
        refresh_token = event['refresh_token']
    except Exception as e:
        logger.error(f'REFRESH TOKEN - {e} is missing, please check and try again')

        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f'{e} is missing, please check and try again'
            })
        }
    
    logger.info(f'REFRESH TOKEN - Getting database client.')

    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info(f'REFRESH TOKEN - Checking if user exists.')

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
    except Exception as e:
        logger.error(f'REFRESH TOKEN - Unable to read item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to read item: {str(e)}"
            })
        }
    
    # Check if the refresh token is correct
    if not common_handler.check_is_refresh_token_valid(refresh_token):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Your session has expired. Please log in again.'
            })
        }
    
    # Generate new access token
    access_token = common_handler.generate_access_token(email)

    if not access_token:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to generate token. Please contact support."
            })
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'token': access_token
        })
    }