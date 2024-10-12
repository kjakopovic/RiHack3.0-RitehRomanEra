import json
import bcrypt

from backend.user_service.authentication import confirm_password_change_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, ses_eu_central_1_mock

# Tests

def test_when_missing_parameters_in_body_return_400(create_users_table):
    # Arrange
    event = {
        'new_password': 'Pass1'
    }

    # Act
    result = confirm_password_change_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "'email' is missing, please check and try again"

def test_when_user_not_found_return_400(create_users_table):
    # Arrange
    event = {
        'email': 'john.doe@gmail.com',
        'new_password': 'Pass_'
    }

    # Act
    result = confirm_password_change_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "We could not find your email. Please try again or contact support."

def test_when_successful_password_change_return_200(create_users_table):
    # Arrange
    usersTable = arrange.add_user_to_the_table(
        'john.doe@gmail.com', 
        'password123'
    )

    event = {
        'email': 'john.doe@gmail.com',
        'new_password': 'Pass123_'
    }

    # Act
    result = confirm_password_change_lambda.lambda_handler(event, "")
    response = json.loads(result['body'])
    updated_user = usersTable.get_item(
        Key={
            'email': 'john.doe@gmail.com'
        }
    )

    # Assert
    assert result["statusCode"] == 200
    assert "message" in response
    assert response["message"] == 'Your password change was successful. You can now login with your new password.'
    assert bcrypt.checkpw('Pass123_'.encode(), updated_user['Item']['password'].encode())
