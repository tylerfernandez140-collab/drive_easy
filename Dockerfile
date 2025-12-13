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

# Copy the rest of the application code
COPY . .

# Expose port 8000 for the Laravel development server
EXPOSE 8000

# Command to run the Laravel development server
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]