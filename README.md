# Mediasignal Web Starter Kit ([generator-msc](https://bitbucket.org/mediasignal/generator-msc.git))

> Mediasignals combined styleguide, starter kit and Yeoman generator for new web projects (Typo3/Html).

This startekit contains methods and ideas from various sources such as [BEM](https://bem.info/), [HTML5BP](http://html5boilerplate.com/), [Bootstrap](http://getbootstrap.com), [Foundation](http://foundation.zurb.com/), [INUITCSS](https://github.com/inuitcss), [SMACSS](https://smacss.com/), [OOCSS](http://oocss.org/), [SUIT CSS](https://github.com/suitcss/suit). By default this template supports IE9+, Mobile first -ideology and progressive enhancement.

This starter kit is **not a framework** but it contains predefined components and helpers that are meant to be modified based on your project needs.


## Features

* CSS Autoprefixing
* Built-in preview server with LiveReload
* Automatically compile Sass
* Automatically wire up your Bower components
* Image Optimization
* Autobuild modernizr based on project needs
* Combine media queries


## Getting started

Please read and understand all of the following before doing anything. All of these documents will be converted to html docs later on.


### Styleguides

* [CSS styleguide](https://bitbucket.org/mediasignal/mediasignal-web-starter-kit/src/master/docs/css/)
* [JS styleguide (work in progress)](docs/js)


### Project structures and workflows

* [Typo3](docs/project)
* [Html](docs/project)


## Requirements

Install all the requirements before installing the generator.

* [Node.js](http://nodejs.org/) ([Npm](https://www.npmjs.org/))
* [Compass](http://compass-style.org/) ([Ruby](https://www.ruby-lang.org/en/)) ```gem install compass```
* [Yeoman](http://yeoman.io/) ```npm install -g yo```
* [Grunt](http://gruntjs.com/) ```npm install -g grunt-cli```
* [Bower](http://bower.io/) ```npm install -g bower```


## Installing

**1.** Install ```generator-msc```:

    npm install -g generator-msc

**2.** Run the generator in your current directory or optionally pass a new install location (Note that if you are building a *Typo3 project*, your project folder will be used as your *extension path*):

    yo msc [my-new-project-directory]

or alternatively make a new directory, cd into it and run the generator:

    mkdir my-new-project && cd $_ && yo msc


## Usage

Run ```grunt``` for building and ```grunt dev``` for developing.


## Contribute

Please discuss about new ideas and things that you think should be modified. Currently all the styleguiding, components (CSS/JS) and generator logic has been made by Joonas Ylitalo [@joonasy](https://twitter.com/joonasy).

[Learn more about contributing](https://bitbucket.org/mediasignal/mediasignal-web-starter-kit/src/master/docs/contribute.md)


## Todo (in random order)

* All necessary CSS components
* Sub generators for starters
* CSS modular scale
* Some sort of integration/forking with [generator-typo3](https://github.com/Milanowicz/generator-typo3)
* Livereload to browsersync
* Use Libsass and get rid of Compass
* Deployment settings (Phploy (?))
* JavaScript styleguide
* Testing for JavaScript
* Gitignores and readmes to generator
* Grunt -> Gulp
* Consider adding babel.js and removing jQuery


## License

MIT
