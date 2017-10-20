# Rebirth Yeoman generator

Yeoman generator for [Rebirth](https://github.com/joonasy/rebirth.git). Scaffold a new project and install Docker development environment automatically.

## Features

* Choose between TYPO3, WordPress or HTML project types
* CSS Autoprefixing
* Livereloading with Browsersync
* Automatical Sass compilation
* Image optimization
* Combine media queries
* Browserify
* Docker development environment

## Requirements

* [Node.js](http://nodejs.org/) & [Npm](https://www.npmjs.org/)
* [Yeoman](http://yeoman.io/) `npm install -g yo`
* [Bower](http://bower.io/) `npm install -g bower`
* [Git](https://git-scm.com/)

### Docker

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker, [native Linux with Docker](http://docs.docker.com/linux/step_one/) or [Docker for Mac](https://docs.docker.com/docker-for-mac/)).
* [docker-compose](https://github.com/docker/compose)
* [make](https://www.gnu.org/software/make/manual/make.html) (optional)

### TYPO3

* [TYPO3 v^7.6.0](http://typo3.org)
* [Flux](http://typo3.org/extensions/repository/view/flux)
* [Fluid Pages Engine](http://typo3.org/extensions/repository/view/fluidpages)
* [Fluid Content Engine](http://typo3.org/extensions/repository/view/fluidcontent)
* [Vhs](http://typo3.org/extensions/repository/view/vhs)

### WordPress

* [Advanced Custom Fields Pro](http://www.advancedcustomfields.com/pro/) (recommended)

## Getting started

**1.** Install generator:

    npm install -g generator-rebirth

**2.** Run the generator in your desired location, pass install directory and your project type (`typo3`, `html` or `wordpress`):

    yo rebirth [my-new-project-directory] --project=typo3

If you are building a *Typo3 project* all special characters are removed from the extension directory name e.g. `my-project_name` -> `myprojectname`.

### Documentation 

Learn about the generated project structure. All of these documents will be converted to html docs later on.

* [General structure](docs/)
* [TYPO3 structure](docs/typo3/)
* [Rebirth structure](https://github.com/joonasy/rebirth/tree/master/docs/markdown) (Front-end assets)


### Options

| Option           | Type    | Default | Description                                                                                                                                         |
|------------------|---------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `--docker`       | Boolean | true    | Set to `false` if you want to install extension/theme only. Before installing, <br> start your docker-machine if you need to and stop all your other containers. |
| `--project`      | String  | typo3   | Choose between `typo3`, `html` and `wordpress` project types.                                                                                        |
| `--skip-install` | Boolean | false   | Skip all installations.                                                                      |

## Todo

* WordPress and HTML project types are currenly far behind. Fixing them asap.
*[Milestones - v1.0](https://github.com/joonasy/generator-rebirth/milestone/11)

## License

Copyright (c) 2017 Joonas Ylitalo (Twitter: @joonasy) Licensed under the MIT license.
