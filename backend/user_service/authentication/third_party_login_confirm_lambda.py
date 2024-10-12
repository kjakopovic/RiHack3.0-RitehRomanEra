import json
import boto3
import os
import requests
import logging

import backend.common.common as common_handler

logger = logging.getLogger()
logger.setLevel(logging.INFO)

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_INFO_URL = "https://api.github.com/user"
GITHUB_USER_EMAIL_URL = "https://api.github.com/user/emails"

FACEBOOK_TOKEN_URL = "https://graph.facebook.com/v13.0/oauth/access_token"
FACEBOOK_USER_INFO_URL = "https://graph.facebook.com/me?fields=id,name,email,picture"

def lambda_handler(event, context):
    try:
        # Extract the code and state parameters from the query string
        query_params = event.get('queryStringParameters', {})
        code = query_params.get('code')
        state = query_params.get('state')

        logger.info(f'THIRD PARTY LOGIN CONFIRM - Checking if code and state parameters are present: {code}, {state}')

        if not code or not state:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Missing code or state parameter'})
            }
        
        logger.info(f'THIRD PARTY LOGIN CONFIRM - Retrieving secrets from AWS Secrets Manager')

        # Retrieve secret string from AWS Secrets Manager
        secrets = common_handler.get_secrets_from_aws_secrets_manager(
            os.getenv('THIRD_PARTY_CLIENTS_SECRET_NAME'),
            os.getenv('SECRETS_REGION_NAME')
        )

        logger.info(f'THIRD PARTY LOGIN CONFIRM - Determining URLs and parameters based on state: {state}')
        
        # Determine URLs and parameters based on state
        token_url = user_info_url = None
        client_id_key = client_secret_key = None
        headers = {'Accept': 'application/json'}

        if state == 'google':
            token_url = GOOGLE_TOKEN_URL
            user_info_url = GOOGLE_USER_INFO_URL
            client_id_key = secrets['google_client_id']
            client_secret_key = secrets['google_client_secret']
        elif state == 'facebook':
            token_url = FACEBOOK_TOKEN_URL
            user_info_url = FACEBOOK_USER_INFO_URL
            client_id_key = secrets['facebook_client_id']
            client_secret_key = secrets['facebook_client_secret']
        elif state == 'github':
            token_url = GITHUB_TOKEN_URL
            user_info_url = GITHUB_USER_INFO_URL
            client_id_key = secrets['github_client_id']
            client_secret_key = secrets['github_client_secret']
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Unsupported state parameter'})
            }
        
        logger.info(f'THIRD PARTY LOGIN CONFIRM - Requesting access token')

        # Request access token
        payload = {
            'code': code,
            'client_id': client_id_key,
            'client_secret': client_secret_key,
            'redirect_uri': secrets['callback_uri'],
            'grant_type': 'authorization_code'
        }

        token_response = requests.post(token_url, data=payload, headers=headers)
        token_response.raise_for_status()
        access_token = token_response.json().get('access_token')

        if not access_token:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'Failed to obtain access token'})
            }
        
        logger.info(f'THIRD PARTY LOGIN CONFIRM - Fetching user information')

        # Fetch user information
        headers = {'Authorization': f'Bearer {access_token}'}
        user_info_response = requests.get(user_info_url, headers=headers)
        user_info_response.raise_for_status()
        user_info = user_info_response.json()

        logger.info(f'THIRD PARTY LOGIN CONFIRM - Extracting user information')

        # Extract user information
        user_name = user_info.get('name').split(' ')
        user_email = user_info.get('email')
        user_profile_picture_url = user_info.get('picture', {}).get('data', {}).get('url') if state == 'facebook' else user_info.get('avatar_url') if state == 'github' else user_info.get('picture')

        logger.info(f'THIRD PARTY LOGIN CONFIRM - Checking if email is empty and state is github')

        # In github if email field is empty call the email endpoint
        if (user_email == '' or user_email is None) and state == 'github':
            user_email_response = requests.get(GITHUB_USER_EMAIL_URL, headers=headers)
            user_email_response.raise_for_status()
            temporary_user_email = user_email_response.json()

            user_email = temporary_user_email[0].get('email')

        logger.info(f'THIRD PARTY LOGIN CONFIRM - Getting database')
        
        # Process and register user in the database
        dynamodb = boto3.resource('dynamodb')
        user_table = dynamodb.Table(os.getenv('USERS_TABLE_NAME'))

        logger.info(f'THIRD PARTY LOGIN CONFIRM - Checking if user already exists')

        # Getting user by email
        response = user_table.get_item(
            Key={
                'email': user_email
            }
        )

        # Check if the user already exists
        if not response.get('Item'):
            logger.info(f'THIRD PARTY LOGIN CONFIRM - User does not exist, creating a new user')

            user_table.put_item(
                Item={
                    'email': user_email,
                    'first_name': user_name[0],
                    'last_name': user_name[1],
                }
            )

            logger.info(f'THIRD PARTY LOGIN CONFIRM - Storing profile picture if found')
            
            # Default value, if an error happens it will be set to False 
            # ( This is only for the case when picture is there but we can't download it and it is used for different success message )
            is_profile_picture_saved = True

            fetching_profile_picture_result = requests.get(user_profile_picture_url)

            try:
                if fetching_profile_picture_result.status_code == 200:
                    logger.info(f'THIRD PARTY LOGIN CONFIRM - Converting profile picture to data.')

                    profile_picture_data = fetching_profile_picture_result.content

                    logger.info(f'THIRD PARTY LOGIN CONFIRM - Saving profile picture to S3.')

                    common_handler.save_profile_picture_to_s3(profile_picture_data, user_email, False)
            except Exception as e:
                logger.error(f'THIRD PARTY LOGIN CONFIRM - Unable to save profile picture: {str(e)}')

                is_profile_picture_saved = False

        logger.info(f'THIRD PARTY LOGIN CONFIRM - Generating tokens')

        # Generating tokens
        token = common_handler.generate_access_token(user_email)
        refresh_token = common_handler.generate_refresh_token(user_table, user_email)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'message': "You're logged in successfully!" if is_profile_picture_saved else "You're logged in successfully but we couldn/'t fetch you profile picture.",
                'token': token,
                'refresh_token': refresh_token
            })
        }
    except requests.RequestException as e:
        logger.error(f'THIRD PARTY LOGIN CONFIRM - Request error: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': f'Request error: {str(e)}'})
        }
    except Exception as e:
        logger.error(f'THIRD PARTY LOGIN CONFIRM - Internal server error: {str(e)}')

        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': f'Internal server error: {str(e)}'})
        }