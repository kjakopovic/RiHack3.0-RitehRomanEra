import json
import logging
import boto3
import os
from boto3.dynamodb.conditions import Attr
from datetime import datetime, timedelta, timezone
from math import radians, sin, cos, sqrt, atan2

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def calculate_distance(lat1, lon1, lat2, lon2):
    # Approximate radius of earth in kilometers
    R = 6371.0

    lat1_rad = radians(lat1)
    lon1_rad = radians(lon1)
    lat2_rad = radians(lat2)
    lon2_rad = radians(lon2)

    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad

    a = sin(dlat / 2.0)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2.0)**2
    c = 2.0 * atan2(sqrt(a), sqrt(1 - a))

    distance = R * c

    return distance

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
    latitude = query_params.get('latitude')
    longitude = query_params.get('longitude')

    # Validate latitude and longitude
    if (latitude is not None and longitude is None) or (latitude is None and longitude is not None):
        # Return an error response if only one of latitude or longitude is provided
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': "Both latitude and longitude must be provided together."
            })
        }

    if latitude is not None and longitude is not None:
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except ValueError:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': "Invalid latitude or longitude. They must be valid numbers."
                })
            }

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
                'headers': {'Content-Type': 'application/json'},
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
        scan_kwargs = {'FilterExpression': filter_expression}

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
            if latitude is not None and longitude is not None:
                event_lat = event_item.get('latitude')
                event_lon = event_item.get('longitude')
                if event_lat is None or event_lon is None:
                    continue  # Skip events without location data
                try:
                    event_lat = float(event_lat)
                    event_lon = float(event_lon)
                except ValueError:
                    continue  # Skip events with invalid latitude or longitude
                distance = calculate_distance(latitude, longitude, event_lat, event_lon)
                if distance > 20:
                    continue  # Skip events farther than 20 km
            filtered_events.append(event_item)

        new_filtered_events = []

        for filt_event in filtered_events:
            event_id = filt_event.get('event_id')
            s3_client = boto3.client('s3')

            picture = s3_client.get_object(Bucket=os.getenv('EVENT_PICTURES_BUCKET'), Key=f'{event_id}.jpg')
            logger.info(f"Picture: {picture}")
            
            image = picture['Body']

            new_filtered_events.append({
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
                'image': image,
                'club_id': event_item['Item'].get('club_id')
            })

        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'events': new_filtered_events,
                'message': 'Search completed successfully.'
            }, default=str)
        }

    except Exception as e:
        logger.error(f"Error querying DynamoDB: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': f"An error occurred: {str(e)}"
            })
        }
