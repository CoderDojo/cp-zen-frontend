#!/user/bin/env sh
set -e

if [ -z "$2" ]; then
  echo "Usage ./update_platform.sh [NPM_TAG] [BRANCH_TO_UPDATE]"
  exit 1
fi

NPM_TAG=$1
BRANCH_TO_UPDATE=$2

curl -u "$CIRCLE_TOKEN": \
  -d build_parameters[CIRCLE_JOB]=update-frontend \
  -d build_parameters[CP_ZEN_FRONTEND_NPM_TAG]="$NPM_TAG" \
  https://circleci.com/api/v1.1/project/github/CoderDojo/cp-zen-platform/tree/"$BRANCH_TO_UPDATE"
