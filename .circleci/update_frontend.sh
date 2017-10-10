#! /usr/bin/env bash

set -e

GIT_BRANCH=$1
TAG=$2
git clone git@github.com:CoderDojo/cp-zen-platform.git
cd cp-zen-platform || exit 1
git config --global user.email "webteam@coderdojo.com"
git config --global user.name "CoderDojo Foundation"
git checkout "$GIT_BRANCH"
yarn add cp-zen-frontend@"$TAG"
git add .
git commit -m "[ci] Update frontend"
git push
