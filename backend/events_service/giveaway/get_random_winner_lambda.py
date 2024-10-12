import json
import logging
import random
import boto3
import os

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        event = event.get('queryStringParameters', {})

        giveaway_id = event.get('giveaway_id')

        if not giveaway_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Missing required attribute: giveaway_id'
                })
            }

        # Initialize a DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        giveaway_table = dynamodb.Table(os.getenv('GIVEAWAY_TABLE_NAME'))
        users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

        # get item from the DynamoDB table
        try:
            giveaway_item = giveaway_table.get_item(
                Key={
                    'giveaway_id': giveaway_id
                }
            )

            users = giveaway_item.get('users', [])
            entries = giveaway_item.get('entries', [])

            if len(users) == 0 or len(entries) == 0:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': 'No users found in the giveaway'
                    })
                }

            winner = random.choices(users, weights=entries, k=1)[0]

            user = users_table.get_item(
                Key={
                    'email': winner
                }
            )
        except Exception as e:
            logger.error(f'Error saving event to DynamoDB: {str(e)}')
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'message': 'Failed to register event due to internal server error.'
                })
            }

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': 'Event registered successfully!',
                'winner': {
                    'email': winner,
                    'first_name': user.get('first_name'),
                    'last_name': user.get('last_name')
                }
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
