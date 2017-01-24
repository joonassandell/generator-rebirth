# <%= appNameHumanize %> - TYPO3 Docker

> Docker development environment for `<%= dir %>`. Generated on <%= (generatorDate) %> with [<%= pkg.name %> v<%= pkg.version %>](<%= (generatorRepository) %>).

# Requirements

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker or [native Linux with Docker](http://docs.docker.com/linux/step_one/)). Could also work in [Windows](https://docs.docker.com/docker-for-windows/#/what-to-know-before-you-install) but not tested just yet.
* [Docker-compose](https://github.com/docker/compose)
* [make](https://www.gnu.org/software/make/manual/make.html) (GNU/Linux/Unix, optional)

# Installation 

**1.** Clone this repository recursively:

```
$ git clone git@bitbucket.org:<%= appAuthorDasherize %>/<%= dir %>.git --recursive
```

**2.** If you are able to run make / shell scripts you are in luck (first, start your docker-machine if you need to): 

```
$ make install
```

Otherwise run [install.sh](install.sh) or run the commands manually.

**3.** Map your localhost to the development address in your host machine's hosts-file (/etc/hosts in linux/osx, somewhere in sys files in windows). For example:

```
192.168.99.100 <%= dir %>.dev
```

**4.** Locate to [<%= dir %>.dev:8000/typo3](http://<%= dir %>.dev:8000/typo3) and setup your extension

**5.** See extension development usage in [<%= dir %>](<%= dir %>) 

# Usage

All the commands are near equivalents to docker / docker-compose commands. If you are not able to run these please refer to the [Makefile](Makefile), [Docker compose reference](https://docs.docker.com/compose/reference) and [ Docker CLI](https://docs.docker.com/engine/reference/commandline/). 

* `make install`: Kickstart your project and/or update all dependencies
* `make update`: Update all dependencies
* `make start`: Start containers
* `make stop`: Stop containers
* `make up`: Build, create and start your containers if not already build
* `make bash`: Connect to TYPO3 container
* `make mysql`: Connect to MySQL container
* `make rebuild`: Rebuild TYPO3 container
* `make reinstall`: Rebuild and reinstall everything, including your MySQL container (Note that you will lose your data)

# Information

### Default database credentials

```
User: admin
Password: password
```

```
MYSQL_ROOT_PASSWORD: root
MYSQL_DATABASE: typo3
MYSQL_USER: typo3
MYSQL_PASSWORD: typo3
```

### Import SQL dump

You can import SQL dump automatically in project startup. Create docker-compose.override.yml and add the following to the `mysql` section:

```
mysql:
  volumes:
    - /folder-to-local-sql-dump/:/docker-entrypoint-initdb.d/
```

---

Learn more about the project structure in [Docs](https://github.com/joonasy/generator-rebirth/tree/master/docs)
