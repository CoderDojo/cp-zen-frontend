#! /usr/bin/env sh
cd /usr/src/cp-translations || exit
yarn link
cd /usr/src/app || exit
yarn && \
yarn link cp-translations && \
yarn dev
