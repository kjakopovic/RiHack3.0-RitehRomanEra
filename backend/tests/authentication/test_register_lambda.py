import json
import boto3
import bcrypt

from backend.user_service.authentication import register_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, s3_bucket_eu_central_1_mock, create_profile_pictures_bucket

# Tests

def test_when_missing_parameters_in_body_return_400(create_users_table):
    # Arrange
    event = {
        'password': 'password123',
        'first_name': 'John',
        'last_name': 'Doe',
        'age': 30
    }

    # Act
    result = register_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "'email' is missing, please check and try again"

def test_when_unable_to_read_from_database_return_500():
    # Arrange
    event = {
        'email': 'john.doe@gmail.com',
        'password': 'password123',
        'first_name': 'John',
        'last_name': 'Doe',
        'age': 30
    }

    # Act
    result = register_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 500
    assert "message" in response
    assert "Unable to read item" in response["message"]

def test_when_user_already_exists_return_400(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com', 
        'password123'
    )

    event = {
        'email': 'john.doe@gmail.com',
        'password': 'password123',
        'first_name': 'John',
        'last_name': 'Doe',
        'age': 30
    }

    # Act
    result = register_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "User with this email already exists. Do you want to login instead?"

def test_when_user_added_successfuly_and_bcrypt_is_hashing_correctly_return_200(create_users_table):
    # Arrange
    usersTable = boto3.resource('dynamodb', region_name='eu-central-1').Table('users')

    event = {
        'email': 'john.doe@gmail.com',
        'password': 'Password123_',
        'first_name': 'John',
        'last_name': 'Doe',
        'age': 30
    }

    # Act
    result = register_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    resultFromTable = usersTable.get_item(
        Key={
            'email': event['email']
        }
    )

    tableResultValues = resultFromTable['Item']

    # Assert
    assert result["statusCode"] == 200
    assert "message" in response
    assert response["message"] == "Registered successfully, welcome!"

    assert tableResultValues['first_name'] == event['first_name']
    assert tableResultValues['last_name'] == event['last_name']
    assert tableResultValues['age'] == event['age']

    assert bcrypt.checkpw(event['password'].encode('utf-8'), tableResultValues['password'].encode('utf-8'))