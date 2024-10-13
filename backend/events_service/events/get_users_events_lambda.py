import json
import logging
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

        # Initialize a DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))
        events_table = dynamodb.Table(os.getenv('EVENTS_TABLE_NAME'))

        # get item from the DynamoDB table
        try:
            user_item = users_table.get_item(
                Key={
                    'email': email
                }
            )

            if 'Item' not in user_item:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': 'User not found'
                    })
                }
            
            event_ids = user_item['Item'].get('events', [])

            events = []

            for id in event_ids:
                event_item = events_table.get_item(
                    Key={
                        'event_id': id
                    }
                )

                if 'Item' in event_item:
                    event_item['Item']['participants'] = int(event_item['Item'].get('participants', 0))
                    events.append(event_item['Item'])
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
                'message': 'Got users events!',
                'events': events
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
