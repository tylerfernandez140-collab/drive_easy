#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status.
set -e



echo "--- Installing NPM Dependencies ---
npm install

echo "--- Building Frontend Assets ---
npm run build

echo "--- Discovering Laravel Packages ---"
php artisan package:discover --ansi

echo "--- Running Laravel Migrations ---"
php artisan migrate --force

echo "--- Running Database Seeders ---"
php artisan db:seed --force

echo "--- Checking Database Environment Variables ---"
echo "DB_CONNECTION: $DB_CONNECTION"
echo "DB_HOST: $DB_HOST"
echo "DB_PORT: $DB_PORT"
echo "DB_DATABASE: $DB_DATABASE"
echo "DB_USERNAME: $DB_USERNAME"
echo "DB_PASSWORD: $DB_PASSWORD"

echo "--- Creating Storage Link ---
php artisan storage:link

echo "--- Caching Laravel Configuration ---
php artisan config:cache

echo "--- Caching Laravel Routes ---
php artisan route:cache

echo "--- Caching Laravel Views ---
php artisan view:cache

echo "--- Build process completed successfully ---