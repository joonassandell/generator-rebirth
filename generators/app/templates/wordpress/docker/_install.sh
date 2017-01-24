#!/bin/bash

# Make sure submodules are up to date
if [ ! "$(ls -A <%= dir %>)" ]
then
  git submodule update --init --recursive
fi

# Start docker containers
docker-compose up -d

# Run composer install
if [ ! -d "wp/wp-content/plugins" ]
then
  docker run --rm --volumes-from=<%= dir %>-app --workdir=/var/www/html/ \
    composer/composer:alpine install
else
  docker run --rm --volumes-from=<%= dir %>-app --workdir=/var/www/html/ \
    composer/composer:alpine update
fi
