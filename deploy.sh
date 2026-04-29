#!/bin/bash

# Email addresses to notify
NOTIFY_EMAIL="amaykadakia@gmail.com"

# 1. Navigate to your project folder
cd /home/laezy/amaykadakia.com

# 2. Pull the latest code from main
git pull origin main

# 3. Build the Angular app
npx ng build --configuration production

# 4. Move files to the domain folder
sudo rm -rf /var/www/amaykadakia.com/public_html/*
sudo cp -r dist/amaykadakia-portfolio/* /var/www/amaykadakia.com/public_html/

# 5. Reset permissions
sudo chown -R www-data:www-data /var/www/amaykadakia.com/

# 6. Activate the Python API
echo "Restarting Backend API..."
pkill -f "python app.py" || true

cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors python-dotenv python-escpos pyusb --quiet
nohup python app.py > api.log 2>&1 &
cd ..

# 7. Restart Apache
echo "Restarting Apache..."
sudo systemctl restart apache2

# 8. Send success email
DEPLOY_TIME=$(date)
echo "Deployment to amaykadakia.com was successful at $DEPLOY_TIME." \
  | mail -s "✅ Deploy Successful – amaykadakia.com" $NOTIFY_EMAIL

echo "Deployment to amaykadakia.com successful and API activated at $DEPLOY_TIME"