# <%= appNameHumanize %> - TYPO3 Docker

> Docker development environment for `<%= dir %>`. Generated on <%= (generatorDate) %> with [<%= pkg.name %> v<%= pkg.version %>](<%= (generatorRepository) %>).

# Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker or [native Linux with Docker](http://docs.docker.com/linux/step_one/)). Could also work in [Windows](https://docs.docker.com/docker-for-windows/#/what-to-know-before-you-install) but not tested just yet.
* [Docker-compose](https://github.com/docker/compose)
* [make](https://www.gnu.org/software/make/manual/make.html) (GNU/Linux/Unix, optional)

# Installation 

**1.** Clone this repository recursively

```
$ git clone git@bitbucket.org:<%= appAuthorDasherize %>/<%= dir %>-docker.git --recurse-submodules
```

**2.** Run install (start your docker-machine if you need to)

```
$ make install
```

You can import SQL dump automatically in project startup by placing your dump in `./database` folder with the name `typo3.sql`. Download `fileadmin` folder from the production server and replace it with your local version if you like.

If you can't run shell scripts, run the commands manually from [install.sh](install.sh).

**3.** Map your localhost to the development address in your host machine's hosts-file (/etc/hosts in linux/osx, somewhere in sys files in windows). For example:

```
192.168.99.100 <%= dir %>.dev
```

**4.** Locate to [<%= dir %>.dev:8000/typo3](http://<%= dir %>.dev:8000/typo3) and setup your extension

**5.** See extension development usage in [<%= dir %>](https://bitbucket.org/<%= appAuthorDasherize %>/<%= dir %>) 

# Usage

All the commands are near equivalents to docker / docker-compose commands. If you are not able to run these please refer to the [Makefile](Makefile), [Docker compose reference](https://docs.docker.com/compose/reference) and [ Docker CLI](https://docs.docker.com/engine/reference/commandline/). 

* `make install`: Kickstart your project and install all dependencies
* `make update`: Update all dependencies
* `make start`: Start containers
* `make stop`: Stop containers
* `make up`: Build, create and start your containers if not already build
* `make bash`: Connect to TYPO3 container
* `make mysql`: Connect to MySQL container
* `make rebuild`: Rebuild TYPO3 container
* `make reinstall`: Rebuild and reinstall everything, including your MySQL container (Note that you will lose your data)

# Information

### Default credentials

```
# TYPO3 user
User: admin
Password: password
```

```
# Database
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: typo3
MYSQL_USER: typo3
MYSQL_PASSWORD: typo3
```

### Import SQL dump

You can import SQL dump automatically in project startup by placing your dump in `./database` folder with the name `typo3.sql`.

### Custom docker settings

If you want to extend existing docker settings, create `docker-compose.override.yml` and add your custom settings there. 

---

Learn about the project structure in [Rebirth docs](https://github.com/joonasy/generator-rebirth/tree/master/docs)
