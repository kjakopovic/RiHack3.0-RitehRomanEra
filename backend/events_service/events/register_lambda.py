import json
import logging
import uuid
import boto3
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # Parse the event body if present
    try:
        event = json.loads(event.get('body')) if 'body' in event else event

        logger.info(f'REGISTER CLUB - Checking if every required attribute is found: {event}')

        # Define the required attributes and their types
        required_attributes = {
            'club_id': str,
            'title': str,
            'category': str,
            'description': str,
            'startingAt': str,  # Use string for date validation
            'endingAt': str,    # Use string for date validation
            'performers': list,
            'giveaway': dict
        }

        # Define the structure of the giveaway object
        giveaway_attributes = {
            'prize': str,
            'description': str,
            'name': str
        }

        # Check for required attributes
        for key, expected_type in required_attributes.items():
            if key not in event:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': f'Missing required attribute: {key}'
                    })
                }
            if not isinstance(event[key], expected_type):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': f'Attribute {key} must be of type {expected_type.__name__}'
                    })
                }

        # Check the structure of the giveaway object
        for key, expected_type in giveaway_attributes.items():
            if key not in event['giveaway']:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': f'Missing required giveaway attribute: {key}'
                    })
                }
            if not isinstance(event['giveaway'][key], expected_type):
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': f'Giveaway attribute {key} must be of type {expected_type.__name__}'
                    })
                }

        # Check that at least one of genre, type, or theme is provided
        if not (event.get('genre') or event.get('type') or event.get('theme')):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'At least one of genre, type, or theme must be provided.'
                })
            }

        # Generate a unique event ID
        event_id = str(uuid.uuid4())
        logger.info(f'Generated event ID: {event_id}')

        # Prepare only the required attributes for saving
        item_to_save = {
            'event_id': event_id,
            'club_id': event['club_id'],
            'title': event['title'],
            'category': event['category'],
            'description': event['description'],
            'startingAt': event['startingAt'],
            'endingAt': event['endingAt'],
            'performers': event['performers'],
            'giveaway': event['giveaway'],
        }

        if event.get('genre'):
            item_to_save['genre'] = event['genre']
        if event.get('type'):
            item_to_save['type'] = event['type']
        if event.get('theme'):
            item_to_save['theme'] = event['theme']


        # Initialize a DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        events_table = dynamodb.Table(os.getenv('EVENTS_TABLE_NAME'))

        # Save the item in the DynamoDB table
        try:
            events_table.put_item(Item=item_to_save)
        except Exception as e:
            logger.error(f'Error saving event to DynamoDB: {str(e)}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Failed to register event due to internal server error.'
                })
            }

        logger.info(f'Event registered successfully: {item_to_save}')

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Event registered successfully!',
                'event_id': event_id  # Return the event ID for confirmation
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
