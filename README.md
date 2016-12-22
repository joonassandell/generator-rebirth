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

* GNU/Linux/Unix with Docker ([Docker toolbox](https://www.docker.com/products/docker-toolbox), [Vagrant](https://www.vagrantup.com/downloads.html) VM with Docker or [native Linux with Docker](http://docs.docker.com/linux/step_one/)). Could also work in [Windows](https://docs.docker.com/docker-for-windows/#/what-to-know-before-you-install) but not tested just yet.
* [docker-compose](https://github.com/docker/compose)
* [make](https://www.gnu.org/software/make/manual/make.html) (GNU/Linux/Unix, optional)

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

    yo my [my-new-project-directory] --project=typo3

If you are building a *Typo3 project* all special characters are removed from the extension directory name e.g. `my-project_name` -> `myprojectname`.

**3.** Learn about the generated project structure:

* [TYPO3](docs/project/typo)
* [HTML](docs/project)

All of these documents will be converted to html docs later on.


### Options

| Option      | Type    | Default | Description                                                                                                                    |
|-------------|---------|---------|--------------------------------------------------------------------------------------------------------------------------------|
| `--docker`  | Boolean | true    | Set to false if you want to install extension/theme only. <br> Before install run docker-machine if you need to and stop all your other containers. |
| `--project` | String  | typo3   | Choose between `typo3`, `html` and `wordpress` project types                                                                   |

## Todo (in random order)

* WordPress project guide
* Publish and finish the documentation
* Typo3 content element starters
* WordPress content element (ACF) starters
* Sub generators for starters
* Browserify -> Webpack (?)
* Testing

## License

Copyright (c) 2017 Joonas Ylitalo (Twitter: @joonasy) Licensed under the MIT license.
