#!/bin/bash

# Start docker containers
docker-compose up -d

# Install extension dependencies
if [ ! -d "<%= dir %>/node_modules" ]
  then
    (cd <%= dir %> && npm install)
fi

if [ ! -d "<%= dir %>/bower_components" ]
  then
    (cd <%= dir %> && bower install)
fi

# Run composer
docker run --rm --volumes-from=<%= dir %>-app --workdir=/var/www/html/typo3/ composer install

# Setup TYPO3 install
docker-compose run app bash -c "touch typo3/FIRST_INSTALL"
