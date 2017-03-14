# Changelog

## 0.5.2x

* TYPO3: Copy .htaccess file ([#7](../../issues/7))
* TYPO3: Add automatic database (`typo3.sql`) import ([#13](../../issues/13))

## 0.5.1x

* **Do not use versions below this**
* Applied new Rebirth component structure and naming
* Fix TYPO3 install errors and show errors in development
* Set automatically docker suffix for the generated development repo
* Use the composer installed wp instead (easier to change wp versions)
* Updated documentation
* Gulpfile:
  * New Rebirth component structure
  * `open=false` -> `--disable_open`
  * `['objectfit']` always part of custom modernizr

## 0.5.0

* Project renamed to generator-rebirth
* Starters are now in [Rebirth](https://github.com/joonasy/rebirth.git)
* Old npm package deprecated

## 0.4.3x (2016-12-21)

* TYPO3: Remove the bloated boilerplate and use simpler Docker approach
* Simple WordPress boilerplate
* Added Makefile for docker installs
* Better instructions
* Updated [yeoman-generator 1.0](http://yeoman.io/blog/hello-generator-1.0.html) and dependencies
* Use global git user if provided
* Fit html build / generation

## 0.4.3 (2016-12-15)

* Added [TYPO3 docker boilerplate](https://github.com/webdevops/TYPO3-docker-boilerplate)
* WordPress boilerplate tweaked
* Docker repository git inited and extension/theme set as submodule
* New flags for generator `--docker`, `--project` see README.md
* `dir` is required argument
* TYPO3 dir is now always underscored and without special chars
* Removed unneeded prompts
* `NODE_ENV` added back w/ [cross-env](https://www.npmjs.com/package/cross-env)
* Eslint rules updated

## 0.3.9 (2016-6-2)

* Go back to the old structure in typo3/wordpress project types as it's easier to control individual extensions side by side this way. However now the cms files are included and installed outside the app root and included as separate example files in the version controlled theme/extension.
* JSCS removed and ESlint added
* Dev env instruction improved

## 0.3.6 (2016-2-11)

* Assemble updates
* Typo3/WordPress: Structure to include cms installations inside the extension/theme w/ composer
* Added WordPress project type

## 0.2.3 (2015-10-23)

* Chromeframe removed

## 0.2.0 (2015-08-11)
* Project renamed to `My Web Starter Kit` / `generator-my`
* Grunt removed
* Compass removed
* [Gulp](http://gulpjs.com) added
* [Browserify](browserify.org) added
* [Browsersync](http://www.browsersync.io/) added
* [Assemble](http://assemble.io) updated (`assemblefile.js`)
* Deployment option added [Dploy](http://leanmeanfightingmachine.github.io/dploy/)
* [JSCS](https://github.com/jscs-dev/node-jscs) styleguide checking

## 0.1.0 (2015-05-07)

* Project structure instructions
* Wiredepp added and bunch of gruntfile configs fixed

## 0.0.6 (2015-02-17)

* Project is now converted to Yeoman generator
* [Assemble.io](http://assemble.io) is now the default Html project builder 
  * Jade -> Handlebars

## 0.0.5 (2013-10-18)
* Now I'll be using the preconfigured grunt/bower config for future projects (/joonasy-bp). Yeoman is nice but it think configuring it is unnecesserary step at least for now. I should make some bash script for creating projects.
  * E.g. mkdir prototype && cp -a joonasy-bp/joonasy-bp/. prototype/ && cd prototype && npm install && bower install 
* Grunt
  * Added custom modernizr building task
  * Jade for default marking
  * Use autoprefixer always
* Bower 
  * Enquire, Respond, Fastclick, Normalize
  * Note: Remember to manually convert normalize.css to _normalize.scss because seems that all the normalize scss versions add some unwanted variables

## 0.0.5 (2013-07-08)

* Started using Yeoman/Grunt for it's flexibility. I'm not going to explain here all the features they have, so just look at the code.
* Bower is awesome, going to use it definitely
* Smaller tab sizing, better comment styling and made some minor structural changes.

## 0.0.3 (2013-05-13)

* Git init

## 0.0.0 (2013-2011)

* Modified files based on stuff learned from various projects
* Small edits
* LESS -> SASS
* Project started
