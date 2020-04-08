# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.6.4x]

- WordPress:
  - Added/renamed following templates: template-flexible-layout.twig/.php, template-archive.twig/.php, home.twig -> template-home.twig
  - Moved WordPress components to [rebirth-wordpress](https://github.com/joonasy/rebirth-wordpress)
  - ACF: Allow shortcodes in textareas
  - Isolated setup material (gutenberg.php, plugins.php etc)
  - Added initial modified role settings for editor
  - Slightly better starting point with new containers comps and templates (404, Archives, Breadcrumb, Pagination, Search etc.)
  - Add translations
  - Load required plugins automatically
  - Add macros to encourage their usage
  - Added some twig funcs/filter: display template name, merge_object
  - Add `THEME_DIR` to inform the deployment script where the theme dir is located
  - Allow videos/embeds
  - Fix: Install composer vendors in deployment
  - Add missing text domain
  - Add gutenberg css & block examples
  - Add initial placeholder to fix custom posts à page in custom post type archives
- Typo3:
  - Add `EXT_DIR` to inform the deployment script where the ext dir is located
  - Fix: Install composer vendors in deployment
- Gulp
  - Build (`$ npm run build`) is now dev build. Use `$ npm run build:production` to create production build.
  - Remove deprecated gulp-util and use other libs
  - Update dependencies / vulnerabilities
  - New gulp version
  - Clarify gulp func names and clean up

## [0.6.3x]

- Add core-js
- Update babel, preset-env, browserify and other deps
- Update deps with vulnerabilities
- Copy master App container component
- Remove console logs in build (uglify)
- Rename index.js to use just the revision name in build
- Update node version (10.13.0)
- Yarn -> Npm
- Add core-js@3 w/ `"useBuiltIns": "usage"`
  - Add `"regenerator-runtime": "^0.13.3"` to allow async funcs
- WordPress
  - Add App class to `<body class="App">`
  - Rename build folder from `dist/` to `build/`
  - Structure WordPress files better
  - ACF: Remove unnecessary stuff from WYSIWYG toolbar
  - Remove useless Gutenberg block types and settings
  - Remove unnecessary namespaces
  - Add some initial content to templates
  - Add category template
- HTML
  - Add App class to `<body class="App">`
  - Rename build folder from `dist/` to `build/`
  - Add .nvmrc
- Updated to Rebirth 0.6.0 ([Rebirth CHANGELOG]([https://github.com/joonasy/rebirth/blob/master/CHANGELOG.md))

## [0.6.2x]

- **Removed development environment generation!**. We are now using plain git repos to create our dev envs:
  - WordPress [rebirth-wordpress-dev](https://github.com/joonasy/rebirth-wordpress-dev.git)
  - TYPO3 [rebirth-typo3-dev](https://github.com/joonasy/rebirth-typo3-dev.git)
- Updated to Rebirth 0.5.4 ([Rebirth CHANGELOG]([https://github.com/joonasy/rebirth/blob/master/CHANGELOG.md))
- Added initial docs
- Add .nvmrc
- Added prettier
  - Git precommit during stage w/ husky & lint-staged
- ESLint
  - Now lints all the files (e.g. gulpfile)
  - Gulp-eslint & task removed
- HTML
  - Fix default layout behavior
  - Rename
    - top.hbs -> app.head.hbs
    - bottom.hbs -> app.foot.hbs
- TYPO3
  - Use `v:condition.context.isDevelopment` / `v:condition.context.isProduction` for checking the environments
  - Rename
    - Top.html -> Head.html
    - Bottom.html -> Foot.html
- WordPress
  - Rename
    - top.twig -> head.twig
    - bottom.twig -> foot.twig

## [0.5.5x]

- Updated to Rebirth 0.5.3 ([Rebirth CHANGELOG]([https://github.com/joonasy/rebirth/blob/master/CHANGELOG.md))
- Add iconfile for referencing SVG icons ([#55]([../../issues/55) [#28]([../../issues/28))
- Use localhost (127.0.0.1:8000) rather than generated dev address ([#48]([../../issues/48))
- Simplify gulpfile ([#28]([../../issues/28))
  - Use real env variables
  - Remove unnecessary config
- WordPress
  - Added flightplan and ENV file for handling shell scripts and deployments in dev environments ([#9]([../../issues/9))
    - You can now deploy local environment to production. See Makefile
  - Switch to official WordPress Docker image ([#15]([../../issues/15))
  - Added shipit for deploying theme ([#47]([../../issues/47), [#11]([../../issues/11))
  - Added Timber ([#24]([../../issues/24))
  - Block WordPress xmlrpc.php requests ([#50]([../../issues/50))
  - Switch WPML composer sources to the official ones ([#52]([../../issues/52))

## [0.5.4x]

- Added flightplan and ENV file for handling shell scripts and deployments in dev environments ([#46](../../issues/46), , [#8](../../issues/8))
- TYPO3 (^8.7.8, ^7.6.0):
  - You can now deploy local environment to production. See Makefile ([#46](../../issues/46), [#8](../../issues/8))
  - Use [applicationContext = Development] to determine environment ([#43](../../issues/43))
  - Added shipit for deploying extension ([#44](../../issues/44))
  - Remove dploy ([#10](../../issues/10))

## [0.5.3x]

- TYPO3:
  - Add support for TYPO3 8 (^8.7.8) ([#29](../../issues/29))
  - Use new docker image ([#42](../../issues/42))
  - Prompt for the new typo3 version
  - Simplify install scripts and extension files
  - Isolate TYPO3 composer and extension installers ([#32](../../issues/32))
  - Add tests ([#38](../../issues/38))
- Update to yeoman 1.1, fresh node version, ES2015 ([#33](../../issues/33))
- Convert index.js to ES6 ([#12](../../issues/12))
- Remove cross-env ([#30](../../issues/30))
- Remove bower ([#36](../../issues/36))
  - [How to migrate away from Bower in older projects](https://bower.io/blog/2017/how-to-migrate-away-from-bower/)
- Stop ignoring composer.lock ([#26](../../issues/26))

## [0.5.2x]

- TYPO3: Copy .htaccess file ([#7](../../issues/7))
- TYPO3: Add automatic database (`typo3.sql`) import ([#13](../../issues/13))

## [0.5.1x]

- **Do not use versions below this**
- Applied new Rebirth component structure and naming
- Fix TYPO3 install errors and show errors in development
- Set automatically docker suffix for the generated development repo
- Use the composer installed wp instead (easier to change wp versions)
- Updated documentation
- Gulpfile:
  - New Rebirth component structure
  - `open=false` -> `--disable_open`
  - `['objectfit']` always part of custom modernizr

## [0.5.0]

- Project renamed to generator-rebirth
- Starters are now in [Rebirth](https://github.com/joonasy/rebirth.git)
- Old npm package deprecated

## [0.4.3x] 2016-12-21

- TYPO3: Remove the bloated boilerplate and use simpler Docker approach
- Simple WordPress boilerplate
- Added Makefile for docker installs
- Better instructions
- Updated [yeoman-generator 1.0](http://yeoman.io/blog/hello-generator-1.0.html) and dependencies
- Use global git user if provided
- Fit html build / generation

## [0.4.3](2016-12-15

- Added [TYPO3 docker boilerplate](https://github.com/webdevops/TYPO3-docker-boilerplate)
- WordPress boilerplate tweaked
- Docker repository git inited and extension/theme set as submodule
- New flags for generator `--docker`, `--project` see README.md
- `dir` is required argument
- TYPO3 dir is now always underscored and without special chars
- Removed unneeded prompts
- `NODE_ENV` added back w/ [cross-env](https://www.npmjs.com/package/cross-env)
- Eslint rules updated

## [0.3.9] 2016-6-2

- Go back to the old structure in typo3/wordpress project types as it's easier to control individual extensions side by side this way. However now the cms files are included and installed outside the app root and included as separate example files in the version controlled theme/extension.
- JSCS removed and ESlint added
- Dev env instruction improved

## [0.3.6] 2016-2-11

- Assemble updates
- Typo3/WordPress: Structure to include cms installations inside the extension/theme w/ composer
- Added WordPress project type

## [0.2.3] 2015-10-23

- Chromeframe removed

## [0.2.0] 2015-08-11

- Project renamed to `My Web Starter Kit` / `generator-my`
- Grunt removed
- Compass removed
- [Gulp](http://gulpjs.com) added
- [Browserify](browserify.org) added
- [Browsersync](http://www.browsersync.io/) added
- [Assemble](http://assemble.io) updated (`assemblefile.js`)
- Deployment option added [Dploy](http://leanmeanfightingmachine.github.io/dploy/)
- [JSCS](https://github.com/jscs-dev/node-jscs) styleguide checking

## [0.1.0] 2015-05-07

- Project structure instructions
- Wiredepp added and bunch of gruntfile configs fixed

## [0.0.6] 2015-02-17

- Project is now converted to Yeoman generator
- [Assemble.io](http://assemble.io) is now the default Html project builder
  - Jade -> Handlebars

## [0.0.5] 2013-10-18

- Now I'll be using the preconfigured grunt/bower config for future projects (/joonasy-bp). Yeoman is nice but it think configuring it is unnecesserary step at least for now. I should make some bash script for creating projects.
  - E.g. mkdir prototype && cp -a joonasy-bp/joonasy-bp/. prototype/ && cd prototype && npm install && bower install
- Grunt
  - Added custom modernizr building task
  - Jade for default marking
  - Use autoprefixer always
- Bower
  - Enquire, Respond, Fastclick, Normalize
  - Note: Remember to manually convert normalize.css to \_normalize.scss because seems that all the normalize scss versions add some unwanted variables

## [0.0.5] 2013-07-08

- Started using Yeoman/Grunt for it's flexibility. I'm not going to explain here all the features they have, so just look at the code.
- Bower is awesome, going to use it definitely
- Smaller tab sizing, better comment styling and made some minor structural changes.

## [0.0.3] 2013-05-13

- Git init

## [0.0.0] 2013-2011

- Modified files based on stuff learned from various projects
- Small edits
- LESS -> SASS
- Project started
