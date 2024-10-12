import json
import logging
import random
import boto3
import os

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        error_response, email = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
    
        if error_response:
            return error_response
    
        event = event.get('queryStringParameters', {})

        giveaway_id = event.get('giveaway_id')
        entrance_number = event.get('entrance_number')

        if not giveaway_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Missing required attribute: giveaway_id'
                })
            }

        # Initialize a DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        giveaway_table = dynamodb.Table(os.getenv('GIVEAWAY_TABLE_NAME'))

        # get item from the DynamoDB table
        try:
            giveaway_item = giveaway_table.get_item(
                Key={
                    'giveaway_id': giveaway_id
                }
            )

            users = giveaway_item.get('users', [])
            entries = giveaway_item.get('entries', [])

            users.append(email)
            entries.append(entrance_number)

            giveaway_table.update_item(
                Key={
                    'giveaway_id': giveaway_id
                },
                UpdateExpression='SET users = :users, entries = :entries',
                ExpressionAttributeValues={
                    ':users': users,
                    ':entries': entries
                }
            )
        except Exception as e:
            logger.error(f'Error saving event to DynamoDB: {str(e)}')

            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Failed to join giveaway. Please try again or contact support.'
                })
            }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Joined giveaway successfully!'
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"An error occurred: {str(e)}"
            })
        }
