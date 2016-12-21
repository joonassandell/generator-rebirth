# Changelog

## 0.5.0

* Project renamed to generator-rebirth
* Starters are now in external repo

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

## 0.4.2 (2016-10-11)

* New folder structure for CSS components and layout components:

```
components/
|
|── ComponentName/
|   `── _ComponentName.config.scss     # Component specific configs
|   `── _ComponentName.scss            # Default component CSS
|   `── _ComponentName--modifier.scss  # Component modifier and so on ...
|   `── _index.scss                    # Import all components
```

* Default .Page{} element added
* Fix chrome issues with the custom select
* Switched border (`.-border`) as part of the default button/form implementation

## 0.4.1 (2016-9-22)

* Breakpoint mixin -> sass-mq
* Updated normalize
* Removed Pull/Push components
* Other minor dependency updates and fixes

## 0.4.0 (2016-6-28)

* Component collections are no named as plurals e.g. .Buttons{}. Switch button collection to --default modifier as there might be some additional button collection in the projects.
* Mutual component files are now in their own folders
* Fixes

## 0.3.9 (2016-6-2)

* Go back to the old structure in typo3/wordpress project types as it's easier to control individual extensions side by side this way. However now the cms files are included and installed outside the app root and included as separate example files in the version controlled theme/extension.
* JSCS removed and ESlint added
* jQuery loaded and set global in `app.js`
* Dev env instruction improved

## 0.3.6 (2016-2-11)

* Updated style guides
* Shitload of Component fixes
* Assemble updates
* Typo3/WordPress: Structure to include cms installations inside the extension/theme w/ composer
* Added WordPress project type

## 0.2.3 (2015-10-23)

* Rest of IE9 support dropped
* `.Grid{}`, `.Hero{}`, `.Nav{}`, `.Form{}`, `.Button{}` have been reworked and changed to use flexbox
* `.Form-collection{}` and `.ButtonCollection` are vertically aligned by default and can be switched to horizontal with `.-horizontal` (includes responsive variants) class
* `imgToParentBg.js` now supports `<picture>`. Also Because Safari and iOS doesn't support `object-position` so there are optional parameters to target them.
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
* Component (scss/js) files restructured into their root folder. No more default `assets` folder.

## 0.1.0 (2015-05-07)
* Rest of the CSS styleguide done
* Part of JS styleguide 
* Project structure instructions
* Wiredepp added and bunch of gruntfile configs fixed
* Components modified based on the new styleguide
* Form, Block and component starters
* Hero uses object-fit with lazyloading (+ fallback).

## 0.0.7 (2015-03-13)
* CSS styleguide done ```docs/css```
* Buttons, Navbar, Hero components are ready ```app/templates/starters/src/assets/stylesheets/components```
* Bunch of helpers added ```app/templates/starters/src/assets/stylesheets/helpers```
* Components and other css now follow the new styleguide syntax and structure

## 0.0.6 (2015-02-17)
* Project is now converted to (Mediasignal) Yeoman generator (generator-msc). Please read all the new project docs ```README.md & docs/*``` .
* Default assets (CSS/JS) modified a lot. See ```app/templates/assets/```
* CSS styleguide added
* CSS starters (components, helpers etc.) added ```app/templates/starters/src/assets/stylesheets/```
* JS starters added ```app/templates/starters/src/assets/javascripts/```
* IE support 9+
* Forced enquire.js, respond.js  and config.js removed
* [Assemble.io](http://assemble.io) is now the default Html project builder 
  * Jade -> Handlebars
* Manual normalize.scss and jquery replaced with Bower components

## 0.0.5 (2013-10-18)
* Now I'll be using the preconfigured grunt/bower config for future projects (/joonasy-bp). Yeoman is nice but it think configuring it is unnecesserary step at least for now. I should make some bash script for creating projects.
  * E.g. mkdir prototype && cp -a joonasy-bp/joonasy-bp/. prototype/ && cd prototype && npm install && bower install 
* Dropped support for IE 7 which was kind of minimal anyway
* box-sizing: border-box
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

## 0.0.4 (2013-06-16)
* Better structuring logic learned from tampere.fi -project.

## 0.0.3 (2013-05-13)
* Git init
* Converted the html boilerplate to middleman boilerplate. Lot's of changes.. OOCSS, BEM, directory structure etc.

## 0.0.2 (2013-04-15)
* Switched to SMACSS approach. All the .scss files are now separated into specific categories and combined in a master file.
    * assets/modules/ <- The modules directory is reserved for Sass code that doesn’t cause Sass to actually output CSS. Things like mixin declarations, functions, and variables.
    * assets/partials/ <- The partials directory is where the meat of CSS is constructed.
    * assets/vendor/ <- The vendor directory is for third-party CSS. This is handy when using prepackaged components developed by other people (or for your own components that are maintained in another project).
* assets/js/lib/ -> assets/js/vendor/ for precise naming

## 0.0.1 (2013-02-27)
* Removed all rem -related stuff. I'd rather just use em's
* Removed unnecessary mixins and plugins
* Combined _2-base.scss & _3-global.scss
* Update to Normalize.css 2.1.0.
* Update to jQuery 1.9.1

## 0.0.0 (2013-02-7)
* Removed the old approach serving IE it's own stylesheet without media queries. I'm using respond.js again. Reason: much cleaner <head> and faster Sass compiling.
* Updated vendors

## 0.0.0 (2012-11-28)
* Modified files based on stuff learned from various project
* Small edits

## 0.0.0 (2013-2011)
* LESS -> SASS
* Project started
