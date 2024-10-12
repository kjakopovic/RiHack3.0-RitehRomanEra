import json
import boto3
import os
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'VALIDATE USER LOGIN - Checking if every required attribute is found in body: {event}')

    try:
        email = event['email']
        six_digit_code = event['six_digit_code']
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f'{e} is missing, please check and try again'
            })
        }
    
    logger.info(f'VALIDATE USER LOGIN - Getting database client.')
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info(f'VALIDATE USER LOGIN - Checking if user exists in the database.')

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
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to read item: {str(e)}"
            })
        }

    # Check if the six digit code is correct
    if not common_handler.check_is_six_digit_code_valid(six_digit_code, email):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Your six digit code has expired or is incorrect. Please request a new one.'
            })
        }
    
    # Terminate the six digit code data
    users_table.update_item(
        Key={
            'email': response['Item']['email']
        },
        UpdateExpression='REMOVE six_digit_code, six_digit_code_expiration'
    )
    
    # Generate jwt and refresh tokens
    access_token = common_handler.generate_access_token(email)
    refresh_token = common_handler.generate_refresh_token(users_table, email)

    if not access_token or not refresh_token:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to generate tokens. Please contact support."
            })
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Logged in successfully, welcome!',
            'token': access_token,
            'refresh_token': refresh_token
        })
    }