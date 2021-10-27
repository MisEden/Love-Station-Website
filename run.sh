#!/bin/bash
set -e

#apt update
echo "\nStep1. apt update\n"
apt update

#install npm
echo "\nStep2. install npm\n"
apt install nodejs npm

#install npm forever
echo "\nStep3. install npm forever\n"
npm install forever -g

#run website in background
echo "\nStep4. run nodejs\n"
forever start index.js
