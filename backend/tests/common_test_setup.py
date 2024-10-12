import os
import pytest
import boto3
import json
from unittest.mock import patch

from moto import mock_aws

@pytest.fixture(scope="function")
def aws_credentials():
    os.environ["AWS_ACCESS_KEY_ID"] = "testing"
    os.environ["AWS_SECRET_ACCESS_KEY"] = "testing"
    os.environ["AWS_SECURITY_TOKEN"] = "testing"
    os.environ["AWS_SESSION_TOKEN"] = "testing"
    os.environ["AWS_DEFAULT_REGION"] = "eu-central-1"

# DynamoDB setup
@pytest.fixture(scope="function")
def dynamodb_eu_central_1_mock(aws_credentials):
    with mock_aws():
        yield boto3.resource("dynamodb", region_name="eu-central-1")

# Users table setup
@pytest.fixture(scope="function")
def create_users_table(dynamodb_eu_central_1_mock):
    os.environ["USERS_TABLE_NAME"] = "users"

    table = boto3.resource('dynamodb').create_table(
        TableName=os.getenv('USERS_TABLE_NAME'),
        KeySchema=[
            {
                'AttributeName': 'email',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'email',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )

    # Wait until the table exists
    table.meta.client.get_waiter('table_exists').wait(TableName=os.getenv('USERS_TABLE_NAME'))

# Message history table setup
@pytest.fixture(scope="function")
def create_message_history_table(dynamodb_eu_central_1_mock):
    os.environ["MESSAGE_HISTORY_TABLE_NAME"] = "message_history"

    table = boto3.resource('dynamodb').create_table(
        TableName=os.getenv('MESSAGE_HISTORY_TABLE_NAME'),
        KeySchema=[
            {
                'AttributeName': 'message_id',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'message_id',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'chat_id',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'timestamp',
                'AttributeType': 'S'
            }
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'ChatIdIndex',
                'KeySchema': [
                    {
                        'AttributeName': 'chat_id',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'timestamp',
                        'KeyType': 'RANGE'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                },
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 5,
                    'WriteCapacityUnits': 1
                }
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        },
        SSESpecification={
            'Enabled': True
        }
    )

    # Wait until the table exists
    table.meta.client.get_waiter('table_exists').wait(TableName=os.getenv('MESSAGE_HISTORY_TABLE_NAME'))

# Chat room table setup
@pytest.fixture(scope="function")
def create_chat_room_table(dynamodb_eu_central_1_mock):
    os.environ["CHAT_ROOM_TABLE_NAME"] = "chat_room"

    table = boto3.resource('dynamodb').create_table(
        TableName=os.getenv('CHAT_ROOM_TABLE_NAME'),
        KeySchema=[
            {
                'AttributeName': 'chat_id',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'chat_id',
                'AttributeType': 'S'
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )

    # Wait until the table exists
    table.meta.client.get_waiter('table_exists').wait(TableName=os.getenv('CHAT_ROOM_TABLE_NAME'))

# Connections table setup
@pytest.fixture(scope="function")
def create_connections_table(dynamodb_eu_central_1_mock):
    os.environ["CONNECTIONS_TABLE_NAME"] = "connections"

    table = boto3.resource('dynamodb').create_table(
        TableName=os.getenv('CONNECTIONS_TABLE_NAME'),
        KeySchema=[
            {
                'AttributeName': 'email',
                'KeyType': 'HASH'
            }
        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'email',
                'AttributeType': 'S'
            },
            {
                'AttributeName': 'connection_id',
                'AttributeType': 'S'
            }
        ],
        GlobalSecondaryIndexes=[
            {
                'IndexName': 'ConnectionIdIndex',
                'KeySchema': [
                    {
                        'AttributeName': 'connection_id',
                        'KeyType': 'HASH'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL'
                },
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 1,
                    'WriteCapacityUnits': 1
                }
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 1,
            'WriteCapacityUnits': 1
        },
        SSESpecification={
            'Enabled': True
        }
    )

    # Wait until the table exists
    table.meta.client.get_waiter('table_exists').wait(TableName=os.getenv('CONNECTIONS_TABLE_NAME'))

# SecretsManager setup
@pytest.fixture(scope="function")
def secrets_manager_eu_central_1_mock(aws_credentials):
    with mock_aws():
        yield boto3.client('secretsmanager', region_name='eu-central-1')

@pytest.fixture(scope="function")
def create_jwt_secret(secrets_manager_eu_central_1_mock):
    boto3.client('secretsmanager').create_secret(
        Name = "python-lambda-app/prod/jwt-secret",
        SecretString = json.dumps(
            {
                "jwt_secret": "ioejfi8rjwiojfekajgvurasjfiaedjgboigrfjsgfivdklcbnrsjhfgujdlbknfusghvcxkjbhnfsoj",
                "refresh_secret": "fidahfudhfudhufjfudsfushusdfhushsufhduhusudfhdsusuhdsfu",
            })
    )

@pytest.fixture(scope="function")
def create_fake_secret(secrets_manager_eu_central_1_mock):
    boto3.client('secretsmanager').create_secret(
        Name = "python-lambda-app/prod/jwt-secret",
        SecretString = json.dumps({"fake_secret": "my_secret_value"})
    )

# S3 bucket setup
@pytest.fixture(scope="function")
def s3_bucket_eu_central_1_mock(aws_credentials):
    with mock_aws():
        yield boto3.client('s3', region_name='eu-central-1')

@pytest.fixture(scope="function")
def create_profile_pictures_bucket(s3_bucket_eu_central_1_mock):
    boto3.client('s3').create_bucket(
        Bucket='lambda-profile-pictures',
        CreateBucketConfiguration={
            'LocationConstraint': 'eu-central-1'
        }
    )

# Simple email service setup
@pytest.fixture(scope="function")
def ses_eu_central_1_mock(aws_credentials):
    with mock_aws():
        yield boto3.client('ses', region_name='eu-central-1')

# Environment variables setup
@pytest.fixture(scope="function")
def setup_env_variables():
    with patch.dict(os.environ, {
        'SECRETS_REGION_NAME': 'eu-central-1',
        'JWT_SECRET_NAME': 'python-lambda-app/prod/jwt-secret'
    }):
        yield