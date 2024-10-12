SERVICE=user_service
HOME_PATH=~/work/RiHack-Template/RiHack-Template
COMMON_CODE_PATH=$(HOME_PATH)/backend/common

build:
	$(HOME_PATH)/backend/scripts/build/build_script.sh ${SERVICE} ${LAMBDA_FILE} ${ARTIFACTS_DIR}
	$(HOME_PATH)/backend/scripts/build/copy_common_code_script.sh ${SERVICE} ${COMMON_CODE_PATH} ${ARTIFACTS_DIR}

build-RegisterUserFunction:
	$(MAKE) build LAMBDA_FILE=authentication/register_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-RequestUserLoginFunction:
	$(MAKE) build LAMBDA_FILE=authentication/request_login_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-ValidateUserLoginFunction:
	$(MAKE) build LAMBDA_FILE=authentication/validate_login_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-RequestPasswordChangeFunction:
	$(MAKE) build LAMBDA_FILE=authentication/request_password_change_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-ValidatePasswordChangeFunction:
	$(MAKE) build LAMBDA_FILE=authentication/validate_password_change_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-ConfirmPasswordChangeFunction:
	$(MAKE) build LAMBDA_FILE=authentication/confirm_password_change_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-RefreshTokenFunction:
	$(MAKE) build LAMBDA_FILE=authentication/refresh_token_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-LogoutUserFunction:
	$(MAKE) build LAMBDA_FILE=authentication/logout_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-ThirdPartyLoginRequestFunction:
	$(MAKE) build LAMBDA_FILE=authentication/third_party_login_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-ThirdPartyLoginValidateFunction:
	$(MAKE) build LAMBDA_FILE=authentication/third_party_login_confirm_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-GetUsersPublicInfoFunction:
	$(MAKE) build LAMBDA_FILE=profile/get_users_public_info_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-GetUsersPrivateInfoFunction:
	$(MAKE) build LAMBDA_FILE=profile/get_users_private_info_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-DeleteProfileFunction:
	$(MAKE) build LAMBDA_FILE=profile/delete_profile_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-UpdateUsersPublicInfoFunction:
	$(MAKE) build LAMBDA_FILE=profile/update_users_public_info_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-UpdateUsersPrivateInfoFunction:
	$(MAKE) build LAMBDA_FILE=profile/update_users_private_info_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)
