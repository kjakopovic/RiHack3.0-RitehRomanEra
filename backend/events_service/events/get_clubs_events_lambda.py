import json
import logging
import boto3
import os
import base64

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters', {}) or {}

        club_id = query_params.get('club_id')

        # Initialize a DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))
        events_table = dynamodb.Table(os.getenv('EVENTS_TABLE_NAME'))

        # get item from the DynamoDB table 
        try:
            club_item = clubs_table.get_item(
                Key={
                    'club_id': club_id
                }
            )

            if 'Item' not in club_item:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': 'User not found'
                    })
                }
            
            event_ids = club_item['Item'].get('events', [])

            events = []

            for id in event_ids:
                event_item = events_table.get_item(
                    Key={
                        'event_id': id
                    }
                )

                if 'Item' in event_item:
                    event_id = id
                    s3_client = boto3.client('s3')

                    picture = s3_client.get_object(Bucket=os.getenv('EVENT_PICTURES_BUCKET'), Key=f'{event_id}.jpg')
                    logger.info(f"Picture: {picture}")
                    
                    image = picture['Body'].read()

                    events.append({
                        'event_id': event_id,
                        'title': event_item['Item'].get('title'),
                        'description': event_item['Item'].get('description'),
                        'startAt': event_item['Item'].get('startAt'),
                        'endingAt': event_item['Item'].get('endingAt'),
                        'theme': event_item['Item'].get('theme'),
                        'genre': event_item['Item'].get('genre'),
                        'type': event_item['Item'].get('type'),
                        'latitude': event_item['Item'].get('latitude'),
                        'longitude': event_item['Item'].get('longitude'),
                        'participants': int(event_item['Item'].get('participants', 0)),
                        'image': base64.b64encode(image).decode('utf-8'),
                        'club_id': event_item['Item'].get('club_id')
                    })
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
                'message': 'Got clubs events',
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
