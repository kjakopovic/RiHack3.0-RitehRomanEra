import json

from backend.user_service.authentication import request_password_change_lambda

import backend.tests.arrange_setups as arrange
from backend.tests.common_test_setup import aws_credentials, dynamodb_eu_central_1_mock, create_users_table, ses_eu_central_1_mock

# Tests

def test_when_missing_parameters_in_body_return_400(create_users_table):
    # Arrange
    event = {
    }

    # Act
    result = request_password_change_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "'email' is missing, please check and try again"

def test_when_user_not_found_return_400(create_users_table):
    # Arrange
    event = {
        'email': 'john.doe@gmail.com'
    }

    # Act
    result = request_password_change_lambda.lambda_handler(event, "")

    response = json.loads(result['body'])

    # Assert
    assert result["statusCode"] == 400
    assert "message" in response
    assert response["message"] == "We could not find your email. Please try again or contact support."

def test_when_user_found_return_200(create_users_table, ses_eu_central_1_mock):
    # Arrange
    usersTable = arrange.add_user_to_the_table(
        'john.doe@gmail.com',
        'Password123_'
    )

    event = {
        'email': 'john.doe@gmail.com'
    }

    # Act
    result = request_password_change_lambda.lambda_handler(event, "")

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
