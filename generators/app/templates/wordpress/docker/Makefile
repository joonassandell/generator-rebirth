# ========================================
# Local commands
# ========================================

start:
	docker-compose up -d
	npm install
	npm run --silent start

start-clone:
	docker-compose up -d
	npm install
	npm run --silent start
	npm run --silent db:pull
	npm run --silent assets:pull
	npm run --silent db:replace

dev:
	docker-compose up -d

stop:
	docker-compose stop

update:
	npm run --silent start

rebuild:
	docker-compose stop
	docker-compose rm -f app
	docker-compose up -d

restart:
	docker-compose stop
	docker-compose rm -f app
	docker-compose rm -f mysql
	make start

app:
	docker-compose exec app bash

mysql:
	docker-compose exec mysql bash

assets-pull:
	npm run --silent assets:pull

db-backup:
	npm run --silent db:backup

db-pull:
	npm run --silent db:backup
	npm run --silent db:pull

db-replace:
	npm run --silent db:backup
	npm run --silent db:replace

db-replace-clone:
	npm run --silent db:backup
	npm run --silent db:pull
	npm run --silent db:replace


# ========================================
# Remote commands
# ========================================

production-start:
	npm run --silent production:start

production-db-replace:
	npm run --silent production:db:replace

production-update:
	npm run --silent production:update

production-assets-push:
	npm run --silent production:assets:push
