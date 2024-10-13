import json
import logging
import boto3
import os
import uuid
import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    try:
        # Check if the user is authenticated and fetch email
        error_response, email = common_handler.check_is_user_authenticated_and_fetch_email_from_jwt(event)
        if error_response:
            return error_response

        # Parse the event body
        event_body = json.loads(event.get('body')) if 'body' in event else event
        logger.info(f'Event body: {event_body}')

        # Validate required fields
        missing_attrs = []
        if 'event_id' not in event_body:
            missing_attrs.append('event_id')
        if 'image_link' not in event_body:
            missing_attrs.append('image_link')

        if missing_attrs:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': f"Missing required attributes: {', '.join(missing_attrs)}"
                })
            }

        event_id = event_body['event_id']
        image_link = event_body['image_link']

        # Initialize DynamoDB resources
        dynamodb = boto3.resource('dynamodb')
        event_images_table = dynamodb.Table(os.getenv('EVENT_IMAGES_TABLE_NAME'))
        users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

        # Fetch the user item
        user_response = users_table.get_item(Key={'email': email})
        if 'Item' not in user_response:
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'message': 'User not found'})
            }

        user_item = user_response['Item']
        first_name = user_item.get('first_name', '')
        last_name = user_item.get('last_name', '')

        # Generate a unique ID for the new item
        item_id = str(uuid.uuid4())

        # Prepare the item to be saved
        item = {
            'id': item_id,
            'event_id': event_id,
            'user_id': email,
            'first_name': first_name,
            'last_name': last_name,
            'image_link': image_link
        }

        # Save the item to the EventImagesTable
        try:
            event_images_table.put_item(Item=item)
        except Exception as e:
            logger.error(f'Error saving image to EventImagesTable: {str(e)}')
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({
                    'message': 'Failed to save image due to internal server error.'
                })
            }

        logger.info(f'Image saved successfully for user {email} and event {event_id}.')

        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'message': 'Image saved successfully.',
                'id': item_id
            })
        }

    except Exception as e:
        logger.error(f'An error occurred: {str(e)}')
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': f"An error occurred: {str(e)}"})
        }
