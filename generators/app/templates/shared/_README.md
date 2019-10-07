# <%= appNameHumanize %>

> <%= appDescription %>. Generated on <%= (generatorDate) %> with [<%= pkg.name %> v<%= pkg.version %>](<%= (generatorRepository) %>).

## Requirements

<% if (typo3) { %>

- [Typo3](http://typo3.org)
- [Vhs](http://typo3.org/extensions/repository/view/vhs)<% } if (wp) { %>
- [WordPress](https://wordpress.org/)
- [Timber](https://www.upstatement.com/timber)
- [Advanced Custom Fields Pro](http://www.advancedcustomfields.com/pro/)<% } if (typo3 || wp) { %>
- [Composer](https://getcomposer.org/)<% } %>
- [Node.js](http://nodejs.org/)
- [Npm](https://www.npmjs.org/)
- SSH access (RSA Key Pair) for deployments<% if (appDevURL) { %>

## Getting started

[<%= name() %> Development Environment for <%= appNameHumanize %>](<%= appDevURL %>) installs all the required dependencies and builds your development environment. Otherwise clone this <% if (typo3) { %>extension to your `ext` folder<% } if (wp) { %>theme to your `themes` folder<% } %> and do the install process.

<% } %>## Install

1. Clone this repository
2. Install node modules: `$ npm install`<% if (typo3 || wp) { %>
3. Install composer dependencies: `$ composer install`
   4.<% } else { %>3.<% } %> Copy [`.env.example`](.env.example) to `.env` file and set your environment variables.

## Usage

- `$ npm run build`: Build the application
- `$ npm run deploy`: Build the application and deploy it to the server<% if (typo3 || wp) { %>
  - Make sure [`shipitfile.js`](shipitfile.js) has correct root and [`package.json`](package.json) has correct `repository` set<% } if (html) { %>
- `$ npm run dist`: Build the application and start a local server for testing purposes<% } %>
- `$ npm run dev`: Watches files and sets up development environment

# Environment variables

- `DEVELOPMENT_URL=http://127.0.0.1:8000`: Local development url
- `DISABLE_OPEN=true`: Disable BrowserSync from automatically opening the browser

---

You may learn about the project structure in [Rebirth docs](https://joonasy.github.io/rebirth)
