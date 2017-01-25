#!/bin/bash

# Make sure submodules are up to date
git submodule update --recursive --remote

# Start docker containers
docker-compose up -d

# Install theme dependencies
if [ ! -d "<%= dir %>" ]
  then
    (cd <%= dir %> && npm install)
fi

if [ ! -d "<%= dir %>/bower_components" ]
  then
    (cd <%= dir %> && bower install)
fi

# Run composer
if [ ! -d "wp/wp-content/plugins" ]
then
  docker run --rm --volumes-from=<%= dir %>-app --workdir=/var/www/html/ \
    composer/composer:alpine install
else
  docker run --rm --volumes-from=<%= dir %>-app --workdir=/var/www/html/ \
    composer/composer:alpine update
fi
