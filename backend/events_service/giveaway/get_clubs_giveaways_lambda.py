import json
import logging
import boto3
import os

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        error_response, email = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
    
        if error_response:
            return error_response

        # Initialize a DynamoDB resource
        dynamodb = boto3.resource('dynamodb')
        clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))
        giveaways_table = dynamodb.Table(os.getenv('GIVEAWAY_TABLE_NAME'))

        # get item from the DynamoDB table
        try:
            club_item = clubs_table.get_item(
                Key={
                    'club_id': email
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
            
            logger.info("We have club item")
            
            giveaway_ids = club_item['Item'].get('giveaways', [])

            logger.info(f"Giveaway ids: {giveaway_ids}")

            if not giveaway_ids:
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json'
                    },
                    'body': json.dumps({
                        'message': 'No giveaways found for this club'
                    })
                }

            events = []

            for id in giveaway_ids:
                giveaway_item = giveaways_table.get_item(
                    Key={
                        'giveaway_id': id
                    }
                )

                if 'Item' in giveaway_item:
                    events.append({
                        'giveaway_id': id,
                        'title': giveaway_item['Item'].get('title'),
                        'description': giveaway_item['Item'].get('description'),
                        'prize': giveaway_item['Item'].get('prize'),
                        'entries': giveaway_item['Item'].get('entries'),
                        'users': giveaway_item['Item'].get('users')
                    })
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
                'message': 'Got users events!',
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
