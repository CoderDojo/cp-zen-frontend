#!/usr/bin/env bash
echo "BUILD_BRANCH: ${BUILD_BRANCH}"
if [[ $BUILD_BRANCH == "staging" ]]; then
  echo "Building staging"
  npm install --save cp-translations@staging @coderdojo/cd-common@staging
elif [[ "${BUILD_BRANCH}" =~ ^pull/[0-9]+$ ]]; then
  echo "Building PR"
  PR_ID=$(echo "${BUILD_BRANCH}" | cut -d '/' -f 2)
  PR_JSON=$(curl "https://api.github.com/repos/coderdojo/cp-zen-frontend/pulls/${PR_ID}" 2>/dev/null)
  PR_BRANCH_NAME=$(echo "${PR_JSON}" | jq -r '.head.ref')
  PR_TARGET_BRANCH_NAME=$(echo "${PR_JSON}" | jq -r '.base.ref')
  echo "Source branch: ${PR_BRANCH_NAME}"
  echo "Target branch: ${PR_TARGET_BRANCH_NAME}"

  # cp-translations
  CP_TRANSLATIONS_BRANCH_STATUS=$(curl -I "https://api.github.com/repos/${GITHUB_USERNAME}/cp-translations/branches/${PR_BRANCH_NAME}" 2>/dev/null | head -n 1 | cut -d$' ' -f2)
  if [[ "${CP_TRANSLATIONS_BRANCH_STATUS}" == "200" ]]; then
    echo "Installing cp-translations from ${GITHUB_USERNAME}:${PR_BRANCH_NAME}"
    npm install "git://github.com/${GITHUB_USERNAME}/cp-translations.git#${PR_BRANCH_NAME}" --save
  elif [[ "${PR_TARGET_BRANCH_NAME}" == 'staging' ]]; then
    echo "Installing cp-translations@staging"
    npm install --save cp-translations@staging
  fi

  # cd-common
  # TODO: Allow install from PR branch
  if [[ "${PR_TARGET_BRANCH_NAME}" == "staging" ]]; then
    echo "Installing @coderdojo/cd-common@staging"
    npm install --save @coderdojo/cd-common@staging
  fi
fi
