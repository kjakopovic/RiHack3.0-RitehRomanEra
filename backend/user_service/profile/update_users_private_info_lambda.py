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
    
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'UPDATE USERS PRIVATE INFO - Checking if every required attribute is found: {event}')

    try:
        new_users_age = event['age'] if 'age' in event else None
        new_phone_number = event['phone_number'] if 'phone_number' in event else None
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
    
    logger.info(f'UPDATE USERS PRIVATE INFO - Checking if request parameters are in valid format')
    
    if (new_users_age is not None and not isinstance(new_users_age, int)) or (new_phone_number is not None and not isinstance(new_phone_number, str)):
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Please provide correct types for request.'
            })
        }
    
    dynamodb = boto3.resource('dynamodb')
    users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

    logger.info("UPDATE USERS PRIVATE INFO - Updating user information.")

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
        
        # Update user's private info
        update_expression = "SET "
        expression_attribute_values = {}

        if new_phone_number is not None:
            update_expression += "phone_number = :phone_number, "
            expression_attribute_values[':phone_number'] = new_phone_number

        if new_users_age is not None:
            update_expression += "age = :age, "
            expression_attribute_values[':age'] = new_users_age

        # Check if there is anything to update
        if expression_attribute_values:
            update_expression = update_expression.rstrip(', ')

            users_table.update_item(
                Key={
                    'email': email
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
    except Exception as e:
        logger.error(f"UPDATE USERS PRIVATE INFO - Couldn't update private info: {str(e)}")

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Couldn't update private info. Please try again or contact support."
            })
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Your private info has been updated successfully.'
        })
    }