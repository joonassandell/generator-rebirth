#!/bin/bash

# Start docker containers
docker-compose up -d

# Install extension dependencies
if [ ! -d "<%= dir %>/node_modules" ]
  then
    (cd <%= dir %> && npm install)
fi

# Update composer dependencies
docker-compose exec app composer update
