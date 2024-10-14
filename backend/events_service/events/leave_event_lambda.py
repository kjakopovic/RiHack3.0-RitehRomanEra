import json
import logging
import boto3
import os
import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Check if user is authenticated and fetch email
        error_response, email = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
        if error_response:
            return error_response

        # Parse event body
        event_body = json.loads(event.get('body')) if 'body' in event else event
        logger.info(f'LEAVE EVENT - Event body: {event_body}')

        # Check if 'event_id' is provided
        if 'event_id' not in event_body:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'Missing required attribute: event_id'})
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
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'Event not found'})
            }

        # Fetch the user item
        user_response = users_table.get_item(Key={'email': email})
        if 'Item' not in user_response:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'User not found'})
            }

        # Check if user is registered for the event
        user_events = user_response['Item'].get('events', [])
        if event_id not in user_events:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'User is not registered for the event.'})
            }

        # Remove event_id from user's events list
        user_events.remove(event_id)
        users_table.update_item(
            Key={'email': email},
            UpdateExpression='SET events = :events',
            ExpressionAttributeValues={':events': user_events},
            ReturnValues='UPDATED_NEW'
        )

        # Decrement participants in the event, ensuring it doesn't go below zero
        events_table.update_item(
            Key={'event_id': event_id},
            UpdateExpression='SET participants = if_not_exists(participants, :start) - :dec',
            ExpressionAttributeValues={
                ':start': 0,
                ':dec': 1,
                ':zero': 0
            },
            ConditionExpression='participants > :zero OR attribute_not_exists(participants)',
            ReturnValues='UPDATED_NEW'
        )

        logger.info(f'User {email} left event {event_id} successfully.')

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': 'Successfully left the event.'})
        }

    except Exception as e:
        logger.error(f'An error occurred: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': f"An error occurred: {str(e)}"})
        }
