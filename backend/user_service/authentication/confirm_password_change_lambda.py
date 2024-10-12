import json
import boto3
import bcrypt
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'CONFIRM PASSWORD CHANGE - Checking is every required attribute found in body: {event}')

    try:
        email = event['email']
        new_password = event['new_password']
    except Exception as e:
        logger.error(f'CONFIRM PASSWORD CHANGE - Missing required attributes: {e}')

        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f'{e} is missing, please check and try again'
            })
        }
    
    logger.info(f'CONFIRM PASSWORD CHANGE - Creating client for database')
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info(f'CONFIRM PASSWORD CHANGE - Checking if user exists')

    # Find user in the table by email
    try:
        response = users_table.get_item(
            Key={
                'email': email
            }
        )

        # Check if user exists
        if not response.get('Item'):
            logger.error(f'CONFIRM PASSWORD CHANGE - User not found')

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
        logger.error(f'CONFIRM PASSWORD CHANGE - Couldn\'t read item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to read item."
            })
        }
    
    logger.info(f'CONFIRM PASSWORD CHANGE - Updating password')
    
    # Hash and update user password
    try:
        salt = bcrypt.gensalt(rounds=5)
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), salt).decode('utf-8')

        response = users_table.update_item(
            Key={
                'email': email
            },
            UpdateExpression='SET password = :new_password',
            ExpressionAttributeValues={
                ':new_password': hashed_password
            }
        )
    except Exception as e:
        logger.error(f'CONFIRM PASSWORD CHANGE - Unable to update item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to update item."
            })
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Your password change was successful. You can now login with your new password.'
        })
    }