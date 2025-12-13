FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libicu-dev \
    libpq-dev # For PostgreSQL

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo_mysql pdo_pgsql mbstring exif pcntl bcmath opcache sockets zip intl

# Set working directory
WORKDIR /var/www/html

# Copy composer.lock and composer.json
COPY composer.json composer.lock ./

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install Composer dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy the rest of the application code
COPY . .

# Run build steps from build.sh
RUN set -e \
    && echo "--- Installing NPM Dependencies ---" \
    && npm install \
    && echo "--- Building Frontend Assets ---" \
    && npm run build \
    && echo "--- Discovering Laravel Packages ---" \
    && php artisan package:discover --ansi \
    && echo "--- Running Laravel Migrations ---" \
    && php artisan migrate --force \
    && echo "--- Running Database Seeders ---" \
    && php artisan db:seed --force \
    && echo "--- Checking Database Environment Variables ---" \
    && echo "DB_CONNECTION: $DB_CONNECTION" \
    && echo "DB_HOST: $DB_HOST" \
    && echo "DB_PORT: $DB_PORT" \
    && echo "DB_DATABASE: $DB_DATABASE" \
    && echo "DB_USERNAME: $DB_USERNAME" \
    && echo "DB_PASSWORD: $DB_PASSWORD" \
    && echo "--- Creating Storage Link ---" \
    && php artisan storage:link \
    && echo "--- Caching Laravel Configuration ---" \
    && php artisan config:cache \
    && echo "--- Caching Laravel Routes ---" \
    && php artisan route:cache \
    && echo "--- Caching Laravel Views ---" \
    && php artisan view:cache \
    && echo "--- Build process completed successfully ---"

# Expose port 8000 for the Laravel development server
EXPOSE 8000

# Command to run the Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]