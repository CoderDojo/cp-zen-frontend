#! /usr/bin/env sh
set -e
cd /usr/src/app || exit
if [ ! -d "node_modules" ]; then
  yarn
  rm -rf node_modules/cp-translations
  ln -s /usr/src/cp-translations node_modules/cp-translations
fi
yarn dev
