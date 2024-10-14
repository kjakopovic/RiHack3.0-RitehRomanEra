import json
import logging
import boto3
import os
from boto3.dynamodb.conditions import Attr
from math import radians, cos, sin, asin, sqrt

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
    latitude = query_params.get('latitude')
    longitude = query_params.get('longitude')

    # Build the filter expression for DynamoDB scan
    filter_expression = None

    if theme:
        filter_expression = Attr('theme').eq(theme)
    if genre:
        if filter_expression is None:
            filter_expression = Attr('genre').eq(genre)
        else:
            filter_expression = filter_expression & Attr('genre').eq(genre)
    if event_type:
        if filter_expression is None:
            filter_expression = Attr('type').eq(event_type)
        else:
            filter_expression = filter_expression & Attr('type').eq(event_type)

    try:
        # Scan DynamoDB
        scan_kwargs = {}
        if filter_expression is not None:
            scan_kwargs['FilterExpression'] = filter_expression

        response = events_table.scan(**scan_kwargs)
        events = response.get('Items', [])

        # Convert latitude and longitude to float if provided
        if latitude and longitude:
            try:
                latitude = float(latitude)
                longitude = float(longitude)
            except ValueError:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': "Invalid latitude or longitude format."
                    })
                }

        # Apply additional filters manually
        filtered_events = []
        for event_item in events:
            if name and name.lower() not in event_item.get('title', '').lower():
                continue

            # If longitude and latitude are provided, filter events within 20 km radius
            if latitude and longitude:
                event_latitude = event_item.get('latitude')
                event_longitude = event_item.get('longitude')

                if event_latitude is None or event_longitude is None:
                    continue

                try:
                    event_latitude = float(event_latitude)
                    event_longitude = float(event_longitude)
                except ValueError:
                    continue

                # Calculate distance between two points using Haversine formula
                distance = haversine(longitude, latitude, event_longitude, event_latitude)
                if distance > 20:
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

def haversine(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees).
    Returns distance in kilometers.
    """
    # Convert decimal degrees to radians 
    lon1_rad, lat1_rad, lon2_rad, lat2_rad = map(radians, [lon1, lat1, lon2, lat2])

    # Haversine formula 
    dlon = lon2_rad - lon1_rad 
    dlat = lat2_rad - lat1_rad 
    a = sin(dlat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 

    r = 6371  # Radius of earth in kilometers
    return c * r