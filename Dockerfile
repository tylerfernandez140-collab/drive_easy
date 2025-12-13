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
    libpq-dev \
    nodejs \
    npm # For PostgreSQL, Node.js, and npm

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

RUN set -e \
    && echo "--- Installing NPM Dependencies ---" \
    && npm install \
    && echo "--- Building Frontend Assets ---" \
    && npm run build \
    && echo "--- Discovering Laravel Packages ---" \
    && php artisan package:discover --ansi \
    && echo "--- Creating Storage Link ---" \
    && php artisan config:cache \
    && echo "--- Caching Laravel Routes ---" \
    && php artisan route:cache \
    && echo "--- Caching Laravel Views ---" \
    && php artisan view:cache \
    && echo "--- Build process completed successfully ---"

# Expose port 9000 for PHP-FPM
EXPOSE 9000

# Start PHP-FPM
CMD ["php-fpm"]