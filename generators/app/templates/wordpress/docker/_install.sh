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

# Run composer
docker run --rm --volumes-from=<%= dir %>-app --workdir=/var/www/html/ \
  composer/composer:alpine install

