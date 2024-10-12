import json
from datetime import datetime, timedelta, timezone

from backend.user_service.authentication import validate_login_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, secrets_manager_eu_central_1_mock, create_jwt_secret, setup_env_variables

# Tests

def test_when_missing_parameters_in_body_return_400(create_users_table):
    # Arrange
    event = {
        'six_digit_code': '001777'
    }

    # Act
    result = validate_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "'email' is missing, please check and try again"

def test_when_email_is_none_return_400(create_users_table):
    # Arrange
    event = {
        'six_digit_code': '001777',
        'email': None
    }

    # Act
    result = validate_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "We could not find your email. Please try again or contact support."

def test_when_six_digit_code_not_found_return_400(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123'
    )

    event = {
        'email': 'john.doe@gmail.com',
        'six_digit_code': '001777'
    }

    # Act
    result = validate_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Your six digit code has expired or is incorrect. Please request a new one."

def test_when_six_digit_code_incorrect_return_400(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        six_digit_code='001778',
        six_digit_code_expiration=(datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()
    )

    event = {
        'email': 'john.doe@gmail.com',
        'six_digit_code': '001777'
    }

    # Act
    result = validate_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Your six digit code has expired or is incorrect. Please request a new one."

def test_when_six_digit_code_expired_return_400(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        six_digit_code='001777',
        six_digit_code_expiration=(datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat()
    )

    event = {
        'email': 'john.doe@gmail.com',
        'six_digit_code': '001777'
    }

    # Act
    result = validate_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Your six digit code has expired or is incorrect. Please request a new one."

def test_creating_tokens_return_200(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    usersTable = arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        six_digit_code='001777',
        six_digit_code_expiration=(datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()
    )

    event = {
        'email': 'john.doe@gmail.com',
        'six_digit_code': '001777'
    }

    # Act
    result = validate_login_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    updated_user = usersTable.get_item(
        Key={
            'email': 'john.doe@gmail.com'
        }
    )

    # Assert
    assert result["statusCode"] == 200
    assert "message" in response
    assert response["message"] == "Logged in successfully, welcome!"
    assert "token" in response
    assert "refresh_token" in response
    assert updated_user['Item']['refresh_token'] == response['refresh_token']