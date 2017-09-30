#! /usr/bin/env bash

set -e

if [ "$GIT_BRANCH" = "master" ]; then
  BRANCH=latest
elif [ "$GIT_BRANCH" = "staging" ]; then
  BRANCH=staging
else
  exit 0
fi

git clone git@github.com:CoderDojo/cp-zen-platform.git
cd cp-zen-platform || exit 1
git config --global user.email "webteam@coderdojo.com"
git config --global user.name "CoderDojo Foundation"
yarn add cp-zen-frontend@"$BRANCH"
git add .
git commit -m "[ci] Update frontend"
git push
