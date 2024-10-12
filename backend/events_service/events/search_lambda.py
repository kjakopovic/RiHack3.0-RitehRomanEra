import json
import logging
import boto3
import os
from boto3.dynamodb.conditions import Attr
from datetime import datetime, timedelta, timezone

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # Initialize DynamoDB resource
    dynamodb = boto3.resource('dynamodb')
    events_table = dynamodb.Table(os.getenv('EVENTS_TABLE_NAME'))

    # Extract query string parameters
    query_params = event.get('queryStringParameters', {}) or {}

    name = query_params.get('name')
    theme = query_params.get('theme')
    genre = query_params.get('genre')
    event_type = query_params.get('type')
    event_date = query_params.get('date')

    # Set default date if no date is provided
    if not event_date:
        current_date = datetime.now(timezone.utc)
    else:
        try:
            current_date = datetime.strptime(event_date, '%Y-%m-%dT%H:%M:%S')
        except ValueError as e:
            # Return an error response if date format is incorrect
            logger.error(f"Invalid date format: {str(e)}")
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': f"Invalid date format: {str(e)}"
                })
            }

    ten_days_from_now = current_date + timedelta(days=10)
    current_date_str = current_date.isoformat()
    ten_days_from_now_str = ten_days_from_now.isoformat()

    # Build the filter expression for DynamoDB query (only date range)
    filter_expression = Attr('startingAt').between(current_date_str, ten_days_from_now_str)

    try:
        # Query DynamoDB with pagination handling
        events = []
        scan_kwargs = {
            'FilterExpression': filter_expression
        }

        done = False
        start_key = None

        while not done:
            if start_key:
                scan_kwargs['ExclusiveStartKey'] = start_key
            response = events_table.scan(**scan_kwargs)
            events.extend(response.get('Items', []))
            start_key = response.get('LastEvaluatedKey', None)
            done = start_key is None

        # Apply additional filters manually
        filtered_events = []
        for event_item in events:
            if name and name.lower() not in event_item.get('title', '').lower():
                continue
            if theme and theme.lower() != event_item.get('theme', '').lower():
                continue
            if genre and genre.lower() != event_item.get('genre', '').lower():
                continue
            if event_type and event_type.lower() != event_item.get('type', '').lower():
                continue
            filtered_events.append(event_item)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'events': filtered_events,
                'message': 'Search completed successfully.'
            }, default=str)
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
