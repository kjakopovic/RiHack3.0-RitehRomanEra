import json
import boto3
import os
from datetime import datetime, timedelta, timezone
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'REQUEST PASSWORD CHANGE - Checking is every required attribute found in body: {event}')
    
    try:
        email = event['email']
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
    
    logger.info(f'REQUEST PASSWORD CHANGE - Getting database client.')
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info(f'REQUEST PASSWORD CHANGE - Checking if user exists.')

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
        logger.error(f'REQUEST PASSWORD CHANGE - Unable to read item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to read item: {str(e)}"
            })
        }
    
    logger.info(f'REQUEST PASSWORD CHANGE - Generating six digit code and it\'s expiration date.')
    
    # Generate six digit code and it's expiration date
    six_digit_code = common_handler.generate_six_digit_code()
    expiration_time_iso = (datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()

    logger.info(f'REQUEST PASSWORD CHANGE - Saving the six digit code and it\'s expiration date to the database.')

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
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to update item: {str(e)}"
            })
        }
    
    logger.info(f'REQUEST PASSWORD CHANGE - Sending email.')
    
    # TODO: uncomment email sender
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