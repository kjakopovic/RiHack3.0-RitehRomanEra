SERVICE=club_service
HOME_PATH=~/work/RiHack3.0-RitehRomanEra/RiHack3.0-RitehRomanEra
COMMON_CODE_PATH=$(HOME_PATH)/backend/common

build:
	$(HOME_PATH)/backend/scripts/build/build_script.sh ${SERVICE} ${LAMBDA_FILE} ${ARTIFACTS_DIR}
	$(HOME_PATH)/backend/scripts/build/copy_common_code_script.sh ${SERVICE} ${COMMON_CODE_PATH} ${ARTIFACTS_DIR}

build-RegisterClubFunction:
	$(MAKE) build LAMBDA_FILE=club/register_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-LoginClubFunction:
	$(MAKE) build LAMBDA_FILE=club/login_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-GetAllClubsFunction:
	$(MAKE) build LAMBDA_FILE=club/get_all_clubs_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-LogoutClubFunction:
	$(MAKE) build LAMBDA_FILE=club/logout_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-RefreshTokenFunction:
	$(MAKE) build LAMBDA_FILE=club/refresh_token_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)
