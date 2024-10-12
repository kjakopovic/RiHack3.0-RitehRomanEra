import json
import boto3
import os
import logging
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    error_response, _ = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
    
    if error_response:
        return error_response

    event = event.get('queryStringParameters', {})

    longitude = event.get('longitude', None)
    latitude = event.get('latitude', None)

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
    
    logger.info(f'REGISTER CLUB - Getting table for clubs.')

    dynamodb = boto3.resource('dynamodb')
    clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))

    logger.info(f'REGISTER CLUB - Checking if club already exists.')

    # Getting clubs in the area
    min_latitude = latitude - 0.02
    max_latitude = latitude + 0.02
    min_longitude = longitude - 0.02
    max_longitude = longitude + 0.02

    try:
        clubs = clubs_table.scan(
            FilterExpression=Attr('latitude').between(min_latitude, max_latitude) &
                            Attr('longitude').between(min_longitude, max_longitude)
        )

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
            'clubs': clubs
        })
    }