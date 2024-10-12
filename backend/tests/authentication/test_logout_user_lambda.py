import json
from datetime import datetime, timedelta, timezone

from backend.user_service.authentication import logout_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, create_jwt_secret, secrets_manager_eu_central_1_mock, setup_env_variables

# Tests

def test_when_missing_parameters_in_header_return_401(create_users_table):
    # Arrange
    event = {
    }

    # Act
    result = logout_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 401
    assert "message" in response
    assert response["message"] == "Unauthorized: Missing Authorization header"

def test_when_invalid_token_return_401(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    event = {
        'headers': {
            'authorization': 'Bearer token',
        }
    }

    # Act
    result = logout_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 401
    assert "message" in response
    assert response["message"] == "Invalid token"

def test_when_expired_token_return_401(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    token = arrange.generate_jwt_token_for_test('john.doe@gmail.com', is_expired=True)
    
    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        }
    }

    # Act
    result = logout_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 401
    assert "message" in response
    assert response["message"] == "Token has expired"

def test_when_user_not_found_return_400(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    token = arrange.generate_jwt_token_for_test('john.doe@gmail.com')
    
    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        }
    }

    # Act
    result = logout_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "We could not find your email. Please try again or contact support."

def test_when_correct_token_return_200(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'Password123_',
        refresh_token='token',
        refresh_token_expiration=(datetime.now(timezone.utc) + timedelta(minutes=30)).isoformat()
    )

    token = arrange.generate_jwt_token_for_test('john.doe@gmail.com')
    
    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        }
    }

    # Act
    result = logout_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 200
    assert "message" in response
    assert response["message"] == "Logged out successfully."