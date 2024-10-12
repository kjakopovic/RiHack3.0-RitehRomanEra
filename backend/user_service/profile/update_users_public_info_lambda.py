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

    logger.info(f'UPDATE USERS PUBLIC INFO - Checking if every required attribute is found: {event}')

    try:
        new_first_name = event['first_name'] if 'first_name' in event else None
        new_last_name = event['last_name'] if 'last_name' in event else None
        new_profile_picture = event['profile_picture'] if 'profile_picture' in event else None
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
    
    logger.info(f'UPDATE USERS PUBLIC INFO - Checking if request parameters are in valid format')
    
    if (new_first_name is not None and not isinstance(new_first_name, str)) or (new_last_name is not None and not isinstance(new_last_name, str)) or (new_profile_picture is not None and not isinstance(new_profile_picture, str)):
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

    logger.info("UPDATE USERS PUBLIC INFO - Updating user information.")

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
        
        # Update user's public info
        update_expression = "SET "
        expression_attribute_values = {}

        if new_first_name is not None:
            update_expression += "first_name = :first_name, "
            expression_attribute_values[':first_name'] = new_first_name

        if new_last_name is not None:
            update_expression += "last_name = :last_name, "
            expression_attribute_values[':last_name'] = new_last_name

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
        logger.error(f"UPDATE USERS PUBLIC INFO - Couldn't update public info: {str(e)}")

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Couldn't update public info. Please try again or contact support."
            })
        }
    
    # Update profile picture if it exists
    if new_profile_picture:
        successful_upload = common_handler.save_profile_picture_to_s3(new_profile_picture, email)

        if not successful_upload:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': f"Couldn't update public info. Please try again or contact support."
                })
            }
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Your public info has been updated successfully.'
        })
    }