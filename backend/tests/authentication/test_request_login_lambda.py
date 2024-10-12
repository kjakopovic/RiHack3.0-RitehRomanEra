import json
import bcrypt

from backend.user_service.authentication import request_login_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, ses_eu_central_1_mock

# Tests

def test_when_missing_parameters_in_body_return_400(create_users_table):
    # Arrange
    event = {
        'password': 'password123',
    }

    # Act
    result = request_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "'email' is missing, please check and try again"

def test_when_unable_to_read_items_from_the_database_return_500():
    # Arrange
    event = {
        'email': 'john.doe@gmail.com',
        'password': 'password123'
    }

    # Act
    result = request_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 500
    assert "message" in response
    assert "Unable to read item" in response["message"]

def test_when_cannot_find_user_return_400(create_users_table):
    # Arrange
    event = {
        'email': 'john.doe@gmail.com',
        'password': 'password123'
    }

    # Act
    result = request_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Incorrect email or password."

def test_when_bcrypt_throws_hashing_error_return_500(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123'
    )

    event = {
        'email': 'john.doe@gmail.com',
        'password': 'password1223123'
    }

    # Act
    result = request_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 500
    assert "message" in response
    assert response["message"] == "There was a mistake with hashing your password, please try again or ask support!"

def test_when_user_is_found_but_password_is_incorrect_return_400(create_users_table):
    # Arrange
    salt = bcrypt.gensalt(rounds=5)
    hashedPassword = bcrypt.hashpw('password123'.encode('utf-8'), salt).decode('utf-8')

    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        hashedPassword
    )

    event = {
        'email': 'john.doe@gmail.com',
        'password': 'password1223123'
    }

    # Act
    result = request_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Incorrect email or password."

def test_when_everything_is_correct_return_200(create_users_table, ses_eu_central_1_mock):
    # Arrange
    salt = bcrypt.gensalt(rounds=5)
    hashedPassword = bcrypt.hashpw('password123'.encode('utf-8'), salt).decode('utf-8')

    usersTable = arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        hashedPassword
    )

    event = {
        'email': 'john.doe@gmail.com',
        'password': 'password123'
    }

    # Act
    result = request_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    updated_user = usersTable.get_item(
        Key={
            'email': 'john.doe@gmail.com'
        }
    )

    # Assert
    assert result["statusCode"] == 200
    assert "message" in response
    assert response["message"] == "Your confirmation code has been sent to your email"

    assert updated_user['Item']['six_digit_code'] is not None
    assert len(updated_user['Item']['six_digit_code']) == 6
    assert updated_user['Item']['six_digit_code_expiration'] is not None