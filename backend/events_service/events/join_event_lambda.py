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

        # Parse event body
        event_body = json.loads(event.get('body')) if 'body' in event else event

        logger.info(f'JOIN EVENT - Event body: {event_body}')

        # Check if 'event_id' is in event_body
        if 'event_id' not in event_body:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Missing required attribute: event_id'
                })
            }

        event_id = event_body['event_id']

        # Initialize DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        events_table = dynamodb.Table(os.getenv('EVENTS_TABLE_NAME'))
        users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

        # Fetch the event item
        event_response = events_table.get_item(Key={'event_id': event_id})

        if 'Item' not in event_response:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Event not found'
                })
            }

        # Fetch the user item
        user_response = users_table.get_item(Key={'email': email})

        if 'Item' not in user_response:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'User not found'
                })
            }

        # Update the event item: increment 'participants' field by 1
        try:
            events_table.update_item(
                Key={'event_id': event_id},
                UpdateExpression='SET participants = if_not_exists(participants, :start) + :inc',
                ExpressionAttributeValues={
                    ':start': 0,
                    ':inc': 1
                },
                ReturnValues='UPDATED_NEW'
            )
        except Exception as e:
            logger.error(f'Error updating event participants: {str(e)}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Failed to join event due to internal server error.'
                })
            }

        # Update the user item: append event_id to 'events' list field
        try:
            users_table.update_item(
                Key={'email': email},
                UpdateExpression='SET events = list_append(if_not_exists(events, :empty_list), :event_id_list)',
                ExpressionAttributeValues={
                    ':empty_list': [],
                    ':event_id_list': [event_id]
                },
                ReturnValues='UPDATED_NEW'
            )
        except Exception as e:
            logger.error(f'Error updating user events: {str(e)}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Failed to join event due to internal server error.'
                })
            }

        logger.info(f'User {email} joined event {event_id} successfully.')

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Successfully joined the event.'
            })
        }
    except Exception as e:
        logger.error(f'An error occurred: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"An error occurred: {str(e)}"
            })
        }
