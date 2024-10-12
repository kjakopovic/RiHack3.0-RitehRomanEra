import json
from datetime import datetime, timedelta, timezone

from backend.user_service.authentication import refresh_token_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, create_jwt_secret, secrets_manager_eu_central_1_mock, setup_env_variables

# Tests

def test_when_missing_parameters_in_body_return_400(create_users_table):
    # Arrange
    event = {
        'queryStringParameters': {
            'refresh_token': 'token',
        }
    }

    # Act
    result = refresh_token_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "'user_email' is missing, please check and try again"

def test_when_user_not_found_return_400(create_users_table):
    # Arrange
    event = {
        'queryStringParameters': {
            'refresh_token': 'token',
            'user_email': 'john.doe@gmail.com'
        }
    }

    # Act
    result = refresh_token_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "We could not find your email. Please try again or contact support."

def test_when_refresh_token_not_found_return_400(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
    )

    event = {
        'queryStringParameters': {
            'refresh_token': 'token',
            'user_email': 'john.doe@gmail.com'
        }
    }

    # Act
    result = refresh_token_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert "message" in response
    assert response["message"] == "Your session has expired. Please log in again."
    assert result["statusCode"] == 400

def test_when_refresh_token_incorrect_return_400(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        refresh_token='token2',
        refresh_token_expiration=(datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()
    )

    event = {
        'queryStringParameters': {
            'refresh_token': 'token',
            'user_email': 'john.doe@gmail.com'
        }
    }

    # Act
    result = refresh_token_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Your session has expired. Please log in again."

def test_when_refresh_token_expired_return_400(create_users_table):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        refresh_token='token2',
        refresh_token_expiration=(datetime.now(timezone.utc) - timedelta(minutes=30)).isoformat()
    )

    event = {
        'queryStringParameters': {
            'refresh_token': 'token2',
            'user_email': 'john.doe@gmail.com'
        }
    }

    # Act
    result = refresh_token_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Your session has expired. Please log in again."

def test_creating_tokens_return_200(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    refresh_token = arrange.generate_jwt_token_for_test(
        'john.doe@gmail.com',
        is_refresh=True
    )

    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        refresh_token=refresh_token
    )

    event = {
        'queryStringParameters': {
            'refresh_token': refresh_token,
            'user_email': 'john.doe@gmail.com'
        }
    }

    # Act
    result = refresh_token_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 200
    assert "token" in response