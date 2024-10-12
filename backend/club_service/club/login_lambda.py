import json
import boto3
import os
import bcrypt
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'LOGIN - Checking if every required attribute is found in body: {event}')

    try:
        email = event['email']
        password = event['password']
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

    logger.info(f'LOGIN - Getting database client.')
    
    dynamodb = boto3.resource('dynamodb')
    clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))

    logger.info(f'CLUB LOGIN - Checking if user exists in the database.')

    # Find user in the table by email
    try:
        response = clubs_table.get_item(
            Key={
                'club_id': email
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
                    'message': 'We could not find your club_id. Please try again or contact support.'
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

    # Verify password (assuming the password is stored in hashed form)
    club = response.get('Item')

    if not club:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Unable to generate tokens. Please contact support.'
            })
        }
        
    stored_password = club.get('password')
    
    if not bcrypt.checkpw(password.encode(), stored_password.encode()):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Incorrect email or password.'
            })
        }
    # Generate JWT and refresh tokens
    access_token = common_handler.generate_access_token(email)
    refresh_token = common_handler.generate_refresh_token(clubs_table, email)

    logger.info(f'LOGIN - Generated tokens: {access_token}, {refresh_token}')

    if not access_token or not refresh_token:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Unable to generate tokens. Please contact support.'
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
