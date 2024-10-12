import json
import boto3
import os
import logging
from decimal import Decimal
from boto3.dynamodb.conditions import Attr

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        error_response, _ = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)

        logger.info(f'GET ALL CLUBS - User is logged in')
        
        if error_response:
            return error_response

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
        
        logger.info(f'GET ALL CLUBS - Converting longitude and latitude to decimals.')
        
        longitude = Decimal(longitude)
        latitude = Decimal(latitude)
        
        logger.info(f'GET ALL CLUBS - Getting table for clubs.')

        dynamodb = boto3.resource('dynamodb')
        clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))

        try:
            range = Decimal(0.02)
            # Getting clubs in the area
            min_latitude = latitude - range
            max_latitude = latitude + range
            min_longitude = longitude - range
            max_longitude = longitude + range
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
            clubs = clubs_table.scan(
                FilterExpression=Attr('latitude').between(min_latitude, max_latitude) &
                                Attr('longitude').between(min_longitude, max_longitude)
            )

            clubs_items = clubs.get('Items', [])

            for club in clubs_items:
                club['latitude'] = float(club['latitude'])
                club['longitude'] = float(club['longitude'])

            logger.info(f'REGISTER CLUB - Found clubs: {clubs}')
        except Exception as e:
            logger.error(f'REGISTER CLUB - Unable to read item: {str(e)}')

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
                'clubs': clubs.get('Items', [])
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