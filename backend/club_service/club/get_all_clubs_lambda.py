import json
import boto3
import os
import logging
from decimal import Decimal
from boto3.dynamodb.conditions import Attr

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        event = event.get('queryStringParameters', {})

        longitude = event.get('longitude', None)
        latitude = event.get('latitude', None)

        logger.info(f'GET ALL CLUBS - Checking is longitude and latitude are provided.')

        if not longitude or not latitude:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Longitude and latitude are required.'
                })
            }
        
        logger.info(f'GET ALL CLUBS - Converting longitude: {longitude} and latitude: {latitude} to decimals.')
        
        longitude = str(longitude)
        latitude = str(latitude)
        
        logger.info(f'GET ALL CLUBS - Getting table for clubs.')

        dynamodb = boto3.resource('dynamodb')
        clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))

        try:
            range = 0.02
            # Getting clubs in the area
            min_latitude = float(latitude) - range
            max_latitude = float(latitude) + range
            min_longitude = float(longitude) - range
            max_longitude = float(longitude) + range
        except Exception as e:
            logger.error(f'GET ALL CLUBS - Unable to calculate range: {str(e)}')

            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': f"Unable to calculate range: {str(e)}"
                })
            }

        try:
            clubs = clubs_table.scan()
            clubs_items = clubs.get('Items', [])

            logger.info(f'GET ALL CLUBS - Found clubs: {clubs_items}')

            filtered_clubs = []

            for club in clubs_items:
                logger.info(f'GET ALL CLUBS - longitude {float(min_longitude) <= float(club['longitude']) <= float(max_longitude)}')
                logger.info(f'GET ALL CLUBS - latitude {float(min_latitude) <= float(club['latitude']) <= float(max_latitude)}')
                if (
                    min_longitude <= float(club['longitude']) <= max_longitude and
                    min_latitude <= float(club['latitude']) <= max_latitude
                    ):
                    club_response = {
                        'club_name': club['club_name'],
                        'working_days': club['working_days'],
                        'default_working_hours': club['default_working_hours'],
                        'club_id': club['club_id'],
                        'longitude': float(club['longitude']),
                        'latitude': float(club['latitude'])
                    }

                    filtered_clubs.append(club_response)

            logger.info(f'GET ALL CLUBS - Found clubs: {filtered_clubs}')
        except Exception as e:
            logger.error(f'GET ALL CLUBS - Unable to read item: {str(e)}')

            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': f"Unable to read item: {str(e)}"
                })
            }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'This are clubs in your range!',
                'clubs': filtered_clubs
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