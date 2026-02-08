#!/bin/bash

# 1. Navigate to your project folder
cd /home/laezy/amaykadakia.com

# 2. Pull the latest code from the feature branch (as seen in your logs)
git pull origin main

# 3. Build the Angular app
npx ng build --configuration production

# 4. Move files to the NEW specific domain folder
# Note: Using your project name 'amaykadakia-portfolio' from previous logs
sudo rm -rf /var/www/amaykadakia.com/public_html/*
sudo cp -r dist/amaykadakia-portfolio/* /var/www/amaykadakia.com/public_html/

# 5. Reset permissions
sudo chown -R www-data:www-data /var/www/amaykadakia.com/

echo "Deployment to amaykadakia.com successful at $(date)"