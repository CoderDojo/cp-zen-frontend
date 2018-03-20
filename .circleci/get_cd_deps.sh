#!/usr/bin/env bash
set -e

GITHUB_AUTH_TOKEN="cb22643b3777b22c663f09e8621a2a985b720426" # public read-only

echo "BUILD_BRANCH: ${BUILD_BRANCH}"
if [[ "${BUILD_BRANCH}" =~ ^pull/[0-9]+$ ]]; then
  echo "Building PR"
  PR_ID=$(echo "${BUILD_BRANCH}" | cut -d '/' -f 2)
  PR_JSON=$(curl "https://api.github.com/repos/coderdojo/cp-zen-frontend/pulls/${PR_ID}?access_token=${GITHUB_AUTH_TOKEN}")
  PR_BRANCH_NAME=$(echo "${PR_JSON}" | jq -r '.head.ref')
  PR_TARGET_BRANCH_NAME=$(echo "${PR_JSON}" | jq -r '.base.ref')
  echo "Source branch: ${PR_BRANCH_NAME}"
  echo "Target branch: ${PR_TARGET_BRANCH_NAME}"

  # cp-translations
  CP_TRANSLATIONS_BRANCH_STATUS=$(curl -I "https://api.github.com/repos/${GITHUB_USERNAME}/cp-translations/branches/${PR_BRANCH_NAME}?access_token=${GITHUB_AUTH_TOKEN}" | head -n 1 | cut -d$' ' -f2)
  if [[ "${CP_TRANSLATIONS_BRANCH_STATUS}" == "200" ]]; then
    echo "Installing cp-translations from ${GITHUB_USERNAME}:${PR_BRANCH_NAME}"
    yarn add "git://github.com/${GITHUB_USERNAME}/cp-translations.git#${PR_BRANCH_NAME}"
  fi
fi
