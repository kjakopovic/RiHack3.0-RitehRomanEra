SERVICE=events_service
HOME_PATH=~/work/RiHack3.0-RitehRomanEra/RiHack3.0-RitehRomanEra
COMMON_CODE_PATH=$(HOME_PATH)/backend/common

build:
	$(HOME_PATH)/backend/scripts/build/build_script.sh ${SERVICE} ${LAMBDA_FILE} ${ARTIFACTS_DIR}
	$(HOME_PATH)/backend/scripts/build/copy_common_code_script.sh ${SERVICE} ${COMMON_CODE_PATH} ${ARTIFACTS_DIR}

build-RegisterEventFunction:
	$(MAKE) build LAMBDA_FILE=events/register_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-GetRandomGiveawayWinnerFunction:
	$(MAKE) build LAMBDA_FILE=giveaway/get_random_winner_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)

build-SearchEventFunction:
	$(MAKE) build LAMBDA_FILE=events/search_lambda.py ARTIFACTS_DIR=$(ARTIFACTS_DIR)