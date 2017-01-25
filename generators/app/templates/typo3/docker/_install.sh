#!/bin/bash

# Make sure submodules are up to date
git submodule update --recursive --remote

# Start docker containers
docker-compose up -d

# Run composer install
if [ ! -d "typo3/vendor" ]
then
  docker-compose run --rm app bash -c "cd typo3 && composer install"
else
  docker-compose run --rm app bash -c "cd typo3 && composer update"
fi

# Add write permissions
docker-compose run --rm app bash -c "chmod a+w typo3 typo3/typo3conf typo3/typo3conf/ext"

# Run the TYPO3 installer
if [ ! -e "typo3/typo3conf/LocalConfiguration.php" ]
then
  docker-compose run --rm app bash -c "touch typo3/FIRST_INSTALL"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms install:setup \
    --non-interactive --database-host-name=mysql --database-user-name=typo3 \
    --database-user-password=typo3 --database-name=typo3 --use-existing-database=true \
    --admin-user-name=admin --admin-password=password --site-name=\"<%= appNameHumanize %>\""
  docker-compose run --rm app bash -c "chmod a+w typo3 typo3/typo3temp"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate flux"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate fluidcontent"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate fluidpages"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate vhs"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate realurl"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate powermail"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate news"
  docker-compose run --rm app bash -c "cd typo3 && ./vendor/bin/typo3cms extension:activate <%= dir %>"
  docker-compose run --rm app bash -c "chmod 777 -R typo3/typo3temp"
  docker-compose run --rm app bash -c "chmod a+w typo3/typo3conf/LocalConfiguration.php"
fi

# Add write permissions
docker-compose run --rm app bash -c "chmod 777 -R typo3/uploads/ \
  && chmod 777 -R typo3/typo3conf/l10n/ \
  && chmod 777 -R typo3/fileadmin/"
