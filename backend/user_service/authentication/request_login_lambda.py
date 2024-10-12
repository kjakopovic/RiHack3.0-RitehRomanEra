import json
import bcrypt
import boto3
import os
from datetime import datetime, timedelta, timezone
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'REQUEST USER LOGIN - Checking is every required attribute found in body: {event}')

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
    
    logger.info(f'REQUEST USER LOGIN - Getting database client.')
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info(f'REQUEST USER LOGIN - Getting user from the database.')

    # Find user in the table by email
    try:
        response = users_table.get_item(
            Key={
                'email': email
            }
        )
    except Exception as e:
        logger.error(f'REQUEST USER LOGIN - Unable to read item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to read item: {str(e)}"
            })
        }

    # Check if the user exists and if password is correct
    try:
        logger.info(f'REQUEST USER LOGIN - Checking if user exists.')

        if response.get('Item'):
            user = response['Item']
            stored_password_hash = user.get('password')

            logger.info(f'REQUEST USER LOGIN - Checking if password is correct.')

            if not bcrypt.checkpw(password.encode(), stored_password_hash.encode()):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': 'Incorrect email or password.'
                    })
                }
        else:
            logger.error(f'REQUEST USER LOGIN - User does not exist, return an error.')

            # User does not exist, return an error
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Incorrect email or password.'
                })
            }
    except Exception as e:
        logger.error(f'REQUEST USER LOGIN - {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': "There was a mistake with hashing your password, please try again or ask support!"
            })
        }
    
    logger.info(f'REQUEST USER LOGIN - Generating six digit code.')
    
    # Generate six digit code and it's expiration date
    six_digit_code = common_handler.generate_six_digit_code()
    expiration_time_iso = (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()

    logger.info(f'REQUEST USER LOGIN - Saving the six digit code and it\'s expiration date to the database.')

    # Save the six_digit_code and it's expiration date to the database
    try:
        response = users_table.update_item(
            Key={
                'email': email
            },
            UpdateExpression="set six_digit_code = :c, six_digit_code_expiration = :e",
            
            ExpressionAttributeValues={
                ':c': '000000', # TODO: six_digit_code,
                ':e': expiration_time_iso
            },
            ReturnValues="UPDATED_NEW"
        )
    except Exception as e:
        logger.error(f'REQUEST USER LOGIN - Unable to update item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to update item: {str(e)}"
            })
        }
    
    logger.info(f'REQUEST USER LOGIN - Sending email.')
    
    #TODO: uncomment email service
    # Send six_digit_code to users email
    # common_handler.send_email(
    #     email, 
    #     'Your account login confirmation', 
    #     f'Your six digit code is: {six_digit_code}'
    # )

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Your confirmation code has been sent to your email'
        })
    }