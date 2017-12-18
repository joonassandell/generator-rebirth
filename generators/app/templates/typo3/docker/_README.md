# <%= appNameHumanize %> - TYPO3 Docker

> Docker development environment for `<%= dir %>`. Generated on <%= (generatorDate) %> with [<%= pkg.name %> v<%= pkg.version %>](<%= (generatorRepository) %>).

# Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
* [docker-compose](https://github.com/docker/compose)
* [make](https://www.gnu.org/software/make/manual/make.html) (optional)
* VPN, SSH access and [rsync](https://linux.die.net/man/1/rsync) (Optional but required for syncing assets and databases)

# Installation 

**1.** Clone this repository recursively

```
$ git clone git@bitbucket.org:<%= appAuthorDasherize %>/<%= dir %>-docker.git --recurse-submodules
```

**2. Prepare for installation** 

1.  Copy [`.env.example`](.env.example) to `.env` file and set your environment variables. Most of the vars should already be set by the creator of the project. Especially make sure that all the `PROD_*` vars are set (e.g `PROD_DB_PASSWORD`). 

2. Map your localhost to the development address in your host machine's hosts-file (`/etc/hosts` in linux/osx). For example with Docker machine: `192.168.99.100 <%= dir %>.dev` or native `127.0.0.1 <%= dir %>.dev`.

**3. Install**

1. Clone production environment to your local development environment (requires SSH access and production server credentials):

        $ make start-clone

2. Or kickstart your project:

        $ make start

Crab a cup of :coffee: as the installation process may take a while. If you are not able to run these please refer to the [Makefile](Makefile) and run the commands manually.

**4. Navigate to [<%= dir %>.dev:8000](<%= dir %>.dev:8000)**

Login to TYPO3 and setup your newly created site if you kickstarted the project, otherwise just login with the production credentials and verify everything works properly. 

**5. Start extension development**

Head to [`<%= dir %>`](https://bitbucket.org/<%= appAuthorDasherize %>/<%= dir %>/) to learn about the extension development. 

# Usage

All the commands are near equivalents to `$ docker` / `$ docker-compose` commands and `$ npm ...` scripts. If you are not able to run these please refer to the [Makefile](Makefile), [package.json](package.json) (npm scripts), [Docker compose reference](https://docs.docker.com/compose/reference) and [Docker CLI](https://docs.docker.com/engine/reference/commandline/). 

## Local commands

These commands are for setting up your local development environment.

#### `$ make start`

Kickstart your project from scratch. Builds, creates and starts Docker containers and updates all dependencies. 

#### `$ make start-clone`

Clone production environment to your local development environment. Creates Docker containers, updates all dependencies, pulls assets, pulls MySQL dump, replaces local database with the remote database. Make sure database server credentials are set in the `.env` file.

#### `$ make dev`

Use this to resume developing after installing the project. Starts Docker containers.

#### `$ make stop`

Stop Docker containers.

#### `$ make update`

Update development dependencies (Git, Composer).

#### `$ make rebuild`

Rebuild TYPO3 (`app`) container.

#### `$ make restart`

Rebuild and reinstall _everything_ (excluding `node_modules/` folder) including your MySQL container (Note that you will lose your data).

#### `$ make bash`

Connect to TYPO3 (`app`) container.

#### `$ make mysql`

Connect to MySQL (`mysql`) container.

#### `$ make assets-pull`

Pull uploaded files from production environment (`uploads/`  folder etc.) to your local environment.

#### `$ make db-pull`

Backup your mysql container database to `database/local/`.

#### `$ make db-pull`

Create and pull MySQL dump from the production environment to the `database/remote` folder, backup current database to  `database/local` folder and places the pulled dump ready for replacing (`database/typo3.sql`). Make sure database server credentials are set in the `.env` file.

#### `$ make db-replace`

Backups current database and replaces it with `database/typo3.sql` dump. 

#### `$ make db-replace-clone`

Backups local database, runs `$ make db-pull` and replaces local database with `database/typo3.sql` dump.

## Remote commands

**:warning: Be extremely careful with the remote commands or you may break the server configuration! You need SSH access (RSA Key Pair) for the remote commands.** Make sure all the production server credentials are set in the `.env` file.

#### `$ make production-start`

Install TYPO3 to the production server. This is most likely **required only once**, so be careful not to reinstall accidentally. After TYPO3 is installed, head to your remote url and setup TYPO3.

You may want to:

* Deploy your extension first.
* `$ make production-db-replace`: Replace remote database with your local one. Make sure the database name matches with the remote in `.env` (`PROD_DB_NAME`).
* `$ make production-assets-push` to sync your local materials to the server.

If you want to add new new server environments (e.g. stage) you need to modify [flightplan.remote.js](flightplan.remote.js), [flightplan.config.js](flightplan.config.js), [Makefile](Makefile), [package.json](package.json), [.env](.env) and [.env.example](.env.example) files. 

#### `$ make production-db-replace`

Creates dump of your local database to `database/local/typo3-xxx.sql` and replaces production database with the newly created dump. 

#### `$ make production-update`

Updates dependencies in the remote (Composer).

#### `$ make production-assets-push`

Push your local assets to the production server.


# Information

### Default `docker-compose` credentials

```
# Database
MYSQL_USER: root
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: typo3
```

### Custom docker settings

If you want to extend existing docker settings, create `docker-compose.override.yml` and add your custom settings there. 

---

Learn about the project structure in [Rebirth docs](https://github.com/joonasy/generator-rebirth/tree/master/docs)
