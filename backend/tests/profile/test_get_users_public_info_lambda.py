import json

from backend.user_service.profile import get_users_public_info_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, secrets_manager_eu_central_1_mock, create_jwt_secret, setup_env_variables, s3_bucket_eu_central_1_mock, create_profile_pictures_bucket

# Tests

def test_no_jwt_token_return_401(create_users_table):
    # Arrange
    event = {
    }

    # Act
    result = get_users_public_info_lambda.lambda_handler(event, "")

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
    result = get_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 401
    assert "message" in response
    assert response["message"] == "Invalid token"

def test_when_expired_token_return_401(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    token = arrange.generate_jwt_token_for_test(
        'john.doe@gmail.com',
        is_expired=True
    )

    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        }
    }

    # Act
    result = get_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 401
    assert "message" in response
    assert response["message"] == "Token has expired"

def test_when_user_not_found_return_400(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    token = arrange.generate_jwt_token_for_test(
        'john.doe@gmail.com'
    )

    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        }
    }

    # Act
    result = get_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "We could not find your account. Please try again or contact support."

def test_when_successful_retrieval_of_data_return_200(create_users_table, create_jwt_secret, setup_env_variables, create_profile_pictures_bucket):
    # Arrange
    arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        first_name='John',
        last_name='Doe',
        age=30
    )

    token = arrange.generate_jwt_token_for_test(
        'john.doe@gmail.com'
    )

    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        }
    }

    # Act
    result = get_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 200
    assert "info" in response
    assert response["info"]['email'] == "john.doe@gmail.com"
    assert response["info"]['first_name'] == "John"
    assert response["info"]['last_name'] == "Doe"
    assert response["info"]['profile_picture'] is None