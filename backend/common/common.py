import json
import os
import boto3
import jwt
import random
import base64
from datetime import datetime, timezone, timedelta
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def check_is_user_authenticated_and_fetch_email_from_jwt(event):
    logger.info("SERVICE - Checking if user is authenticated")

    # Check if user is authenticated
    authorization_header = event.get('headers', {}).get('Authorization') or event.get('headers', {}).get('authorization')
    
    if not authorization_header:
        logger.error(f"SERVICE - No authorization header found: {authorization_header}")

        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Unauthorized: Missing Authorization header'})
        }, None
    
    logger.info("SERVICE - Getting token.")
    
    token = authorization_header.split(' ')[1] if ' ' in authorization_header else authorization_header
    
    try:
        logger.info("SERVICE - Accessing jwt secret.")

        # Get jwt secret for generating jwt token
        secrets = get_secrets_from_aws_secrets_manager(
            os.getenv('JWT_SECRET_NAME'),
            os.getenv('SECRETS_REGION_NAME')
        )

        logger.info("SERVICE - Verifying token and extracting email.")

        # Decode and verify the JWT token
        decoded_token = jwt.decode(token, secrets['jwt_secret'], algorithms=['HS256'])
        email = decoded_token['email']

        return None, email
    
    except jwt.ExpiredSignatureError:
        logger.error("SERVICE - Token has expired.")

        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Token has expired'})
        }, None
    except jwt.InvalidTokenError:
        logger.error(f"SERVICE - Invalid token: {token}")

        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Invalid token'})
        }, None
    except Exception as e:
        logger.error(f"SERVICE - Couldn/'t decode the token: {token}. Error: {str(e)}")

        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': f'There was an error trying to decode the token: {str(e)}'})
        }, None

def generate_access_token(user_email):
    try:
        logger.info(f'SERVICE - Getting secret value.')

        # Get jwt secret for generating jwt token
        secrets = get_secrets_from_aws_secrets_manager(
            os.getenv('JWT_SECRET_NAME'),
            os.getenv('SECRETS_REGION_NAME')
        )

        logger.info(f'SERVICE - Generating new token.')

        # Generating token
        token_expiration_time = datetime.now(timezone.utc) + timedelta(days=1)
        token_expiration_timestamp = int(token_expiration_time.timestamp())
        return jwt.encode({'email': user_email, 'exp': token_expiration_timestamp}, secrets['jwt_secret'], algorithm='HS256')
    except Exception as e:
        return None
    
def generate_refresh_token(table, user_email, is_clubs_table=False):
    try:
        logger.info(f'SERVICE - Getting secret value.')

        # Get jwt secret for generating jwt token
        secrets = get_secrets_from_aws_secrets_manager(
            os.getenv('JWT_SECRET_NAME'),
            os.getenv('SECRETS_REGION_NAME')
        )

        logger.info(f'SERVICE - Generating new refresh token.')

        refresh_token_expiration_time = datetime.now(timezone.utc) + timedelta(days=1)
        refresh_token = jwt.encode({'email': user_email, 'exp': refresh_token_expiration_time}, secrets['refresh_secret'], algorithm='HS256')

        logger.info(f'SERVICE - Saving refresh token to the database.')

        if is_clubs_table:
            table.update_item(
                Key={
                    'club_id': user_email
                },
                UpdateExpression='SET refresh_token = :refresh_token',
                ExpressionAttributeValues={
                    ':refresh_token': refresh_token
                })
        else:
            table.update_item(
                Key={
                    'email': user_email
                },
                UpdateExpression='SET refresh_token = :refresh_token',
                ExpressionAttributeValues={
                    ':refresh_token': refresh_token
                }
            )

        return refresh_token
    except Exception as e:
        return None
    
def check_is_refresh_token_valid(refresh_token, is_clubs_table=False):
    try:
        logger.info(f'SERVICE - Getting secret value.')

        # Get jwt secret for generating jwt token
        secrets = get_secrets_from_aws_secrets_manager(
            os.getenv('JWT_SECRET_NAME'),
            os.getenv('SECRETS_REGION_NAME')
        )

        logger.info(f'SERVICE - Verifying refresh token.')

        decoded_token = jwt.decode(refresh_token, secrets['refresh_secret'], algorithms=['HS256'])

        logger.info('SERVICE - Getting database client')

        dynamodb = boto3.resource('dynamodb')

        if is_clubs_table:
            clubs_table = dynamodb.Table(os.getenv('CLUBS_TABLE_NAME'))

            logger.info('SERVICE - Getting user from the database')

            club_table_item = clubs_table.get_item(
                Key={
                    'club_id': decoded_token['email']
                }
            )
            
            return (
                club_table_item.get('Item') and 
                club_table_item.get('Item').get('refresh_token') and
                club_table_item.get('Item').get('refresh_token') == refresh_token
            )
        else:
            users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

            logger.info('SERVICE - Getting user from the database')

            user_table_item = users_table.get_item(
                Key={
                    'email': decoded_token['email']
                }
            )
            
            return (
                user_table_item.get('Item') and 
                user_table_item.get('Item').get('refresh_token') and
                user_table_item.get('Item').get('refresh_token') == refresh_token
            )
    except jwt.ExpiredSignatureError:
        logger.error(f'SERVICE - Refresh token has expired.')

        return False
    except jwt.InvalidTokenError:
        logger.error(f'SERVICE - Invalid refresh token.')

        return False
    except Exception as e:
        logger.error(f'SERVICE - Unable to verify refresh token: {str(e)}')

        return False

def save_profile_picture_to_s3(profile_picture, user_email, should_convert_from_base64=True):
    try:
        logger.info(f'SERVICE - Converting profile picture to data.')

        if should_convert_from_base64:
            profile_picture_data = base64.b64decode(profile_picture)
        else:
            profile_picture_data = profile_picture

        logger.info(f'SERVICE - Saving profile picture to S3.')

        s3_client = boto3.client('s3')

        s3_client.put_object(
            Bucket=os.getenv('PROFILE_PICTURES_BUCKET'),
            Key=f"{os.getenv('PROFILE_PICTURES_PREFIX')}{user_email}.jpg",
            Body=profile_picture_data,
            ContentType='image/jpeg'
        )

        return True
    except Exception as e:
        logger.info(f'SERVICE - There was an error while trying to upload profile picture to S3. Error: {str(e)}')

        return False
    
def get_profile_picture_as_base64_from_s3(user_email):
    try:
        logger.info("SERVICE - Getting client for profile picture deletion")

        s3_client = boto3.client('s3')

        logger.info("SERVICE - Fetching profile picture")

        response = s3_client.get_object(
            Bucket=os.getenv('PROFILE_PICTURES_BUCKET'),
            Key=f"{os.getenv('PROFILE_PICTURES_PREFIX')}{user_email}.jpg",
        )

        if 'Body' in response:
            logger.info("SERVICE - Converting to base64")

            picture_data = response['Body'].read()

            return base64.b64encode(picture_data).decode('utf-8')
    except Exception as e:
        logger.error(f'SERVICE - Unable to get profile picture: {str(e)}')
        return None
    
def delete_profile_picture_from_s3(user_email):
    try:
        logger.info("SERVICE - Getting client for profile picture deletion")

        s3_client = boto3.client('s3')

        logger.info("SERVICE - Checking if profile picture exists")

        response = s3_client.get_object(
            Bucket=os.getenv('PROFILE_PICTURES_BUCKET'),
            Key=f"{os.getenv('PROFILE_PICTURES_PREFIX')}{user_email}.jpg",
        )

        if 'Body' in response:
            logger.info("SERVICE - Deleting profile picture")

            s3_client.delete_object(
                Bucket=os.getenv('PROFILE_PICTURES_BUCKET'),
                Key=f"{os.getenv('PROFILE_PICTURES_PREFIX')}{user_email}.jpg"
            )
    except Exception as e:
        logger.error(f'SERVICE - Unable to delete profile picture: {str(e)}')

def generate_six_digit_code():
    number = random.randint(0, 999999)
    return f'{number:06}'

def check_is_six_digit_code_valid(entered_six_digit_code, email):
    try:
        logger.info("SERVICE - Getting database client.")

        dynamodb = boto3.resource('dynamodb')
        users_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

        logger.info("SERVICE - Getting user.")

        user_table_item = users_table.get_item(
            Key={
                'email': email
            }
        )

        logger.info("SERVICE - Checking if items exist in the database.")

        if (
            not user_table_item.get('Item') or 
            not user_table_item.get('Item').get('six_digit_code_expiration') or 
            not user_table_item.get('Item').get('six_digit_code')
        ):
            logger.error("SERVICE - Six digit code data not found in the database.")

            return False
        
        expiration_time = datetime.fromisoformat(user_table_item['Item']['six_digit_code_expiration'])
        current_time = datetime.now(timezone.utc)

        return expiration_time > current_time and user_table_item['Item']['six_digit_code'] == entered_six_digit_code
    except Exception as e:
        return False

def send_email(sendTo, subject, body):
    try:
        ses_client = boto3.client('ses', region_name=os.getenv('SES_REGION_NAME'))

        ses_client.send_email(
            Source=os.getenv('EMAIL_SENDER'),
            Destination={
                'ToAddresses': [sendTo],
            },
            Message={
                'Subject': {
                    'Data': subject,
                },
                'Body': {
                    'Text': {
                        'Data': body,
                    },
                },
            }
        )
    except Exception as e:
        logger.error(f'SERVICE - Unable to send email: {str(e)}')

def get_secrets_from_aws_secrets_manager(secret_id, region_name):
    try:
        secrets_manager = boto3.client(
            service_name='secretsmanager', 
            region_name=region_name
        )

        secret_string = secrets_manager.get_secret_value(
            SecretId=secret_id
        )

        return json.loads(secret_string['SecretString'])
    except Exception as e:
        logger.error(f'SERVICE - Failed to retrieve secrets: {str(e)}')
        return None