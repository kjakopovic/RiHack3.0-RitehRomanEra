import json
import logging
import boto3
import os

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
                    event_item['Item']['participants'] = int(event_item['Item'].get('participants', 0))
                    events.append(event_item['Item'])
                    
            for currEvent in events:
                event_id = currEvent.get('event_id')
                s3_client = boto3.client('s3')

                picture = s3_client.get_object(Bucket=os.getenv('EVENT_PICTURES_BUCKET'), Key=f'{event_id}.jpg')
                logger.info(f"Picture: {picture}")
                
                currEvent['image'] = picture['Body']
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
