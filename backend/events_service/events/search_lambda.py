import json
import logging
import boto3
import os
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime, timedelta, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # Initialize a DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    events_table = dynamodb.Table(os.getenv('EVENTS_TABLE_NAME'))

    # Extract query string parameters
    query_params = event.get('queryStringParameters', {})
    name = query_params.get('name')
    theme = query_params.get('theme')
    genre = query_params.get('genre')
    event_type = query_params.get('type')
    event_date = query_params.get('date')

    # Set default date if no date is provided
    if not event_date:
        current_date = datetime.now(timezone.utc)  # Get current UTC time
        ten_days_from_now = current_date + timedelta(days=10)
        current_date_str = current_date.isoformat()
        ten_days_from_now_str = ten_days_from_now.isoformat()
    else:
        current_date = datetime.strptime(event_date, '%Y-%m-%dT%H:%M:%S')
        ten_days_from_now = current_date + timedelta(days=10)
        current_date_str = current_date.isoformat()
        ten_days_from_now_str = ten_days_from_now.isoformat()

    # Build the filter expression
    filter_expression = Attr('startingAt').between(current_date_str, ten_days_from_now_str)
    
    if name:
        filter_expression &= Attr('title').contains(name)
    if theme:
        filter_expression &= Attr('theme').eq(theme)
    if genre:
        filter_expression &= Attr('genre').eq(genre)
    if event_type:
        filter_expression &= Attr('type').eq(event_type)

    try:
        # Query DynamoDB
        response = events_table.scan(
            FilterExpression=filter_expression
        )
        events = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'events': events,
                'message': 'Search completed successfully.'
            })
        }
    except Exception as e:
        logger.error(f"Error querying DynamoDB: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"An error occurred: {str(e)}"
            })
        }
