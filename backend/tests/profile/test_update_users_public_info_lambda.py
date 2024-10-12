import json

from backend.user_service.profile import update_users_public_info_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, secrets_manager_eu_central_1_mock, create_jwt_secret, setup_env_variables

# Tests

def test_no_jwt_token_return_401(create_users_table):
    # Arrange
    event = {
    }

    # Act
    result = update_users_public_info_lambda.lambda_handler(event, "")

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
    result = update_users_public_info_lambda.lambda_handler(event, "")

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
    result = update_users_public_info_lambda.lambda_handler(event, "")

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
    result = update_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "We could not find your account. Please try again or contact support."

def test_when_nothing_passed_to_update_stays_the_same_return_200(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    usersTable = arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        first_name='John',
        last_name='Doe'
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
    result = update_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    expected_user = usersTable.get_item(
        Key={
            'email': 'john.doe@gmail.com'
        }
    )

    # Assert
    assert result["statusCode"] == 200
    assert "message" in response
    assert response["message"] == "Your public info has been updated successfully."
    assert expected_user['Item']['first_name'] == 'John'
    assert expected_user['Item']['last_name'] == 'Doe'

def test_when_items_passed_to_update_return_200(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    usersTable = arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        first_name='John',
        last_name='Doe'
    )

    token = arrange.generate_jwt_token_for_test(
        'john.doe@gmail.com'
    )
    
    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        },
        'body': json.dumps({
            'first_name': 'Joe',
            'last_name': 'Smith'
        })
    }

    # Act
    result = update_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    expected_user = usersTable.get_item(
        Key={
            'email': 'john.doe@gmail.com'
        }
    )

    # Assert
    assert result["statusCode"] == 200
    assert "message" in response
    assert response["message"] == "Your public info has been updated successfully."
    assert expected_user['Item']['first_name'] == 'Joe'
    assert expected_user['Item']['last_name'] == 'Smith'

def test_when_incorrect_items_types_passed_to_update_return_400(create_users_table, create_jwt_secret, setup_env_variables):
    # Arrange
    usersTable = arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'password123',
        first_name='John',
        last_name='Doe'
    )

    token = arrange.generate_jwt_token_for_test(
        'john.doe@gmail.com'
    )

    event = {
        'headers': {
            'authorization': f'Bearer {token}',
        },
        'body': json.dumps({
            'first_name': 777
        })
    }

    # Act
    result = update_users_public_info_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "Please provide correct types for request."