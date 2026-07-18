#!/usr/bin/env bash

echo "Installing npm packages..."
npm install

echo "Installing Chrome..."
export PUPPETEER_CACHE_DIR=./.cache/puppeteer

npx puppeteer browsers install chrome

echo "Chrome installation completed."