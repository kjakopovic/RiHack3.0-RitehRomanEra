import json
import logging
import boto3
import os
import decimal  # Import the decimal module
from boto3.dynamodb.conditions import Key,Attr
import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def convert_decimals(obj):
    if isinstance(obj, list):
        return [convert_decimals(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimals(v) for k, v in obj.items()}
    elif isinstance(obj, decimal.Decimal):
        return float(obj)
    else:
        return obj

def lambda_handler(event, context):
    try:
        # Check if the user is authenticated and fetch email
        error_response, email = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
        if error_response:
            return error_response

        # Parse the event body or query parameters to get event_id
        event_id = None
        if 'body' in event and event['body']:
            try:
                event_body = json.loads(event['body'])
                event_id = event_body.get('event_id')
            except json.JSONDecodeError as e:
                logger.error(f'Error decoding JSON body: {str(e)}')
        if not event_id and 'queryStringParameters' in event and event['queryStringParameters']:
            event_id = event['queryStringParameters'].get('event_id')

        if not event_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'Missing required attribute: event_id'
                })
            }

        # Initialize DynamoDB resources
        dynamodb = boto3.resource('dynamodb')
        events_table = dynamodb.Table(os.getenv('EVENTS_TABLE_NAME'))
        event_images_table = dynamodb.Table(os.getenv('EVENT_IMAGES_TABLE_NAME'))

        # Fetch event info
        event_response = events_table.get_item(Key={'event_id': event_id})
        if 'Item' not in event_response:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'Event not found'})
            }
        event_info = event_response['Item']

        # Fetch event images
        # Assuming 'event_id' is a Global Secondary Index (GSI) on the event_images_table
        try:
            images_response = event_images_table.scan(
                FilterExpression=Attr('event_id').eq(event_id)
            )
            event_images = images_response.get('Items', [])
        except Exception as e:
            logger.error(f'Error fetching event images: {str(e)}')
            event_images = []
        # Prepare the response
        response_body = {
            'event_info': event_info,
            'event_images': event_images
        }

        # Convert Decimal instances to floats
        response_body = convert_decimals(response_body)

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps(response_body)
        }

    except Exception as e:
        logger.error(f'An error occurred: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': f"An error occurred: {str(e)}"})
        }
