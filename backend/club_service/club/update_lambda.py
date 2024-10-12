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

    logger.info(f'UPDATE CLUBS INFO - Checking if every required attribute is found: {event}')

    try:
        club_name = event['club_name'] if 'club_name' in event else None
        default_working_hours = event['default_working_hours'] if 'default_working_hours' in event else None
        working_days = event['working_days'] if 'working_days' in event else None
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
    
    logger.info(f'UPDATE CLUBS INFO - Checking if request parameters are in valid format')
    
    if (
        (club_name is not None and not isinstance(club_name, str)) or 
        (default_working_hours is not None and not isinstance(default_working_hours, str)) or 
        (working_days is not None and not isinstance(working_days, str))
    ):
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
    clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))

    logger.info("UPDATE CLUBS INFO - Updating club information.")

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
                    'message': 'We could not find your account. Please try again or contact support.'
                })
            }
        
        # Update user's public info
        update_expression = "SET "
        expression_attribute_values = {}

        if club_name is not None:
            update_expression += "club_name = :club_name, "
            expression_attribute_values[':club_name'] = club_name

        if default_working_hours is not None:
            update_expression += "default_working_hours = :default_working_hours, "
            expression_attribute_values[':default_working_hours'] = default_working_hours

        if working_days is not None:
            update_expression += "working_days = :working_days, "
            expression_attribute_values[':working_days'] = working_days

        # Check if there is anything to update
        if expression_attribute_values:
            update_expression = update_expression.rstrip(', ')
            
            clubs_table.update_item(
                Key={
                    'club_id': email
                },
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values
            )
    except Exception as e:
        logger.error(f"UPDATE CLUBS INFO - Couldn't update info: {str(e)}")

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Couldn't update info. Please try again or contact support."
            })
        }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Your clubs info has been updated successfully.'
        })
    }