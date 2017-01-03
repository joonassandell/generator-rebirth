FROM php:5.6-apache

# https://github.com/boot2docker/boot2docker/issues/581
RUN usermod -u 1000 www-data

# Install system libraries
RUN apt-get update && apt-get install -y \
  build-essential unzip zlib1g-dev git libxml2-dev wget libfreetype6-dev \
  imagemagick php5-imagick libjpeg62-turbo-dev libmcrypt-dev libpng12-dev

# Install php extensions
RUN docker-php-ext-install iconv mcrypt soap zip mcrypt mysqli pdo pdo_mysql xml mbstring tokenizer \
    && docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
    && docker-php-ext-install gd

# Xdebug
RUN pecl install xdebug
RUN docker-php-ext-enable xdebug
RUN echo "xdebug.default_enable=1" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.remote_autostart=1" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.force_display_errors=1" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.remote_enable=1" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.remote_port=9000" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.remote_connect_back=1" >> /usr/local/etc/php/conf.d/xdebug.ini \
    && echo "xdebug.max_nesting_level=400" >> /usr/local/etc/php/conf.d/xdebug.ini

# Set php settings
RUN echo "max_execution_time=240" >> /usr/local/etc/php/conf.d/php-oras.ini \
    && echo "max_input_vars=1500" >> /usr/local/etc/php/conf.d/php-oras.ini

# Install Composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php \
    && php -r "unlink('composer-setup.php');" \
    && mv composer.phar /usr/local/bin/composer

# Install PHPUnit
RUN wget https://phar.phpunit.de/phpunit.phar \
    && chmod +x phpunit.phar \
    && mv phpunit.phar /usr/local/bin/phpunit

# Set environment variables
ENV APACHE_LOG_DIR=/var/log/apache2

# Configure apache
RUN a2ensite 000-default
RUN sed -i 's!/var/www/html!/var/www/html/typo3!g' /etc/apache2/sites-enabled/000-default.conf
RUN a2enmod rewrite
