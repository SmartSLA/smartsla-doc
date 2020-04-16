#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd .vuepress/dist

git config --global user.name "CI Bot"
git config --global user.email "bot@linagora.com"

git init
git add -A
git commit -m 'deploy'
git push -f https://bot-linagora:${GITHUB_TOKEN}@github.com/smartsla/smartsla.github.io.git master
