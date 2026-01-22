#!/bin/bash

# 1. Navigate to your project folder
cd /home/pi/amay-portfolio

# 2. Pull the latest changes from GitHub
git pull origin main

# 3. Install dependencies (if any new ones were added)
npm install

# 4. Build the Angular app
# Using the local project name found in your package.json
npx ng build --configuration production

# 5. Clear the old web files and move the new build
sudo rm -rf /var/www/html/*
sudo cp -r dist/amay-portfolio/browser/* /var/www/html/

# 6. Ensure Apache has correct permissions
sudo chown -R www-data:www-data /var/www/html/

echo "Deployment successful at $(date)"