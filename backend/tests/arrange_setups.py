import boto3
import os
import json
import jwt
import uuid
from datetime import datetime, timedelta, timezone

def add_user_to_the_table(email, password, age=None, first_name=None, last_name=None, refresh_token=None, refresh_token_expiration=None, six_digit_code=None, six_digit_code_expiration=None):
    users_table = boto3.resource('dynamodb', region_name='eu-central-1').Table(os.getenv('USERS_TABLE_NAME'))

    users_table.put_item(
        Item={
            'email': email,
            'password': password,
            'first_name': first_name,
            'last_name': last_name,
            'age': age,
            'refresh_token': refresh_token,
            'refresh_token_expiration': refresh_token_expiration,
            'six_digit_code': six_digit_code,
            'six_digit_code_expiration': six_digit_code_expiration
        }
    )

    return users_table

def add_message_history(sent_from, send_to, message, chat_id):
    message_history_table = boto3.resource('dynamodb', region_name='eu-central-1').Table(os.getenv('MESSAGE_HISTORY_TABLE_NAME'))

    message_history_table.put_item(
        Item={
            'message_id': str(uuid.uuid4()),
            'sent_from': sent_from,
            'send_to': send_to,
            'message': message,
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'chat_id': chat_id
        }
    )

    return message_history_table

def add_connection_to_the_table(email, connection_id):
    connections_table = boto3.resource('dynamodb', region_name='eu-central-1').Table(os.getenv('CONNECTIONS_TABLE_NAME'))

    connections_table.put_item(
        Item={
            'email': email,
            'connection_id': connection_id
        }
    )

    return connections_table

def add_chat_room_to_the_table(chat_id, connections):
    chat_room_table = boto3.resource('dynamodb', region_name='eu-central-1').Table(os.getenv('CHAT_ROOM_TABLE_NAME'))

    chat_room_table.put_item(
        Item={
            'chat_id': chat_id,
            'connections': connections
        }
    )

    return chat_room_table

def generate_jwt_token_for_test(email, is_expired=False, is_refresh=False):
    secrets_manager = boto3.client(
        service_name='secretsmanager',
        region_name=os.getenv('SECRETS_REGION_NAME')
    )

    secret_string = secrets_manager.get_secret_value(
        SecretId=os.getenv('JWT_SECRET_NAME')
    )

    secret_string_json = json.loads(secret_string['SecretString'])

    # Generating tokens
    if is_expired:
        token_expiration_time = datetime.now(timezone.utc) - timedelta(minutes=5)
    else:
        token_expiration_time = datetime.now(timezone.utc) + timedelta(minutes=5)

    return jwt.encode(
        {'email': email, 'exp': token_expiration_time}, 
        secret_string_json['refresh_secret'] if is_refresh else secret_string_json['jwt_secret'], 
        algorithm='HS256'
    )
