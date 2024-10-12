import json
import bcrypt
import boto3
import os
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'REGISTER USER - Checking if every required attribute is found: {event}')

    try:
        email = event['email']
        password = event['password']
        first_name = event['first_name']
        last_name = event['last_name']
        age = event['age']
        profile_picture_base64 = event.get('profile_picture')
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
    
    logger.info(f'REGISTER USER - Getting database client.')
    
    dynamodb = boto3.resource('dynamodb')
    user_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info(f'REGISTER USER - Checking if user already exists.')

    # Getting user by email
    try:
        response = user_table.get_item(
            Key={
                'email': email
            }
        )

        # Check if the user already exists
        if response.get('Item'):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'User with this email already exists. Do you want to login instead?'
                })
            }
    except Exception as e:
        logger.error(f'REGISTER USER - Unable to read item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to read item: {str(e)}"
            })
        }
    
    logger.info(f'REGISTER USER - Adding user to the table.')

    # Add the new user to the table
    try:
        salt = bcrypt.gensalt(rounds=5)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        user_table.put_item(
            Item={
                'email': email,
                'password': hashed_password,
                'first_name': first_name,
                'last_name': last_name,
                'age': age
            }
        )
    except Exception as e:
        logger.error(f'REGISTER USER - Unable to add item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to add item: {str(e)}"
            })
        }
    
    logger.info(f'REGISTER USER - Saving profile picture.')

    if profile_picture_base64:
        successful_upload = common_handler.save_profile_picture_to_s3(profile_picture_base64, email)

        if not successful_upload:
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': "User registered without profile picture. Please try the upload again."
                })
            }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Registered successfully, welcome!'
        })
    }