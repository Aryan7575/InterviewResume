#!/usr/bin/env bash

echo "Installing npm packages..."
npm install

echo "Installing Chrome for Puppeteer..."
npx puppeteer browsers install chrome

echo "Chrome installation completed."