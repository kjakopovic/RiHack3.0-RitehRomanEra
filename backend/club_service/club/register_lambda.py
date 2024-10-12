import json
import bcrypt
import boto3
import os
import logging
from decimal import Decimal

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    event = json.loads(event.get('body')) if 'body' in event else event

    logger.info(f'REGISTER CLUB - Checking if every required attribute is found: {event}')

    try:
        email = event['email']
        password = event['password']
        club_name = event['club_name']
        default_working_hours = event['default_working_hours']
        working_days = event['working_days']
        longitude = event['longitude']
        latitude = event['latitude']
    except Exception as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f'{e} is missing, please check and try again'
            })
        }
    
    logger.info(f'REGISTER CLUB - Getting table for clubs.')

    dynamodb = boto3.resource('dynamodb')
    clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))

    logger.info(f'REGISTER CLUB - Checking if club already exists.')

    # Getting club by email
    try:
        response = clubs_table.get_item(
            Key={
                'club_id': email
            }
        )

        # Check if club already exists
        if response.get('Item'):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Club with this email already exists. Do you want to login instead?'
                })
            }
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
    
    logger.info(f'REGISTER CLUB - Adding club to the table.')

    # Add new club to the table
    try:
        salt = bcrypt.gensalt(rounds=5)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        clubs_table.put_item(
            Item={
                'club_id': email,
                'password': hashed_password,
                'club_name': club_name,
                'default_working_hours': default_working_hours,
                'working_days': working_days,
                'longitude': Decimal(longitude),
                'latitude': Decimal(latitude)
            }
        )
    except Exception as e:
        logger.error(f'REGISTER USER - Unable to add item: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': f"Unable to add item: {str(e)}"
            })
        }

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': json.dumps({
            'message': 'Registered successfully, welcome!'
        })
    }