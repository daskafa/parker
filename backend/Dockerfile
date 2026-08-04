FROM php:8.4-fpm-alpine

RUN apk add --no-cache git curl zip unzip libzip icu-libs oniguruma \
    && apk add --no-cache --virtual .build-deps libzip-dev icu-dev oniguruma-dev \
    && docker-php-ext-install pdo pdo_mysql zip intl opcache bcmath \
    && apk del --no-cache .build-deps

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --ignore-platform-reqs

COPY . .

RUN composer install --no-scripts --optimize-autoloader --ignore-platform-reqs \
    && composer dump-autoload --optimize \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
