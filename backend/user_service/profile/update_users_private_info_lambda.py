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
        points = event['points'] if 'points' in event else None
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
    
    if (points is not None and not isinstance(points, int)):
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

        if points is not None:
            update_expression += "points = :points, "
            expression_attribute_values[':points'] = response.get('Item').get('points') + points

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