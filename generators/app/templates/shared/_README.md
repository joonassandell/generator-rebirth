# <%= appNameHumanize %>

> <%= appDescription %>. Generated on <%= (generatorDate) %> with [<%= pkg.name %> v<%= pkg.version %>](<%= (generatorRepository) %>).

## Requirements

<% if (typo3) { %>

- [Typo3](http://typo3.org)
- [VHS](http://typo3.org/extensions/repository/view/vhs)<% } if (wp) { %>
- [WordPress](https://wordpress.org/)
- [Timber](https://www.upstatement.com/timber)
- [Advanced Custom Fields Pro](http://www.advancedcustomfields.com/pro/)<% } if (typo3 || wp) { %>
- [Composer](https://getcomposer.org/)<% } %>
- [Node.js & Npm](http://nodejs.org/)
- SSH access (RSA Key Pair) for deployments

## Getting started

1. Install node modules: `$ npm install`<% if (typo3 || wp) { %>
2. Install composer dependencies: `$ composer install`
   3.<% } else { %>2.<% } %> Copy [`.env.example`](.env.example) to `.env` file and set your environment variables.

## Usage

- `$ npm run build`: Build the application<% if (wp) { %>
- `$ npm run build:production`: Build the production version of the app. If you set `WP_DEV` (in functions.php) to false you can test the production version locally.<% } %>
- `$ npm run watch`: Watches files<% if (typo3 || wp) { %> and proxies server url<% } %>
- `$ npm run deploy`: Build the application and deploy it to the server<% if (typo3 || wp) { %>
  - Make sure [`PRODUCTION_WEBROOT`](.env) has correct root and [`package.json`](package.json) has correct `repository` set<% } if (html) { %>
- `$ npm run dist`: Build the application and start a local server for testing purposes<% } %>

# Environment variables

- `DEVELOPMENT_URL`: Local development url which is proxied by the BrowserSync
- `$ DISABLE_OPEN=true npm run dev`: Disable BrowserSync from automatically opening the browser<% if (wp) { %>
- `THEME_DIR`: Tell the deployment script where your theme is located (based on your Git root). If your theme has its own git repository you can change this to `./`<% } if (typo3) { %>
- `EXT_DIR`: Tell the deployment script where your extension is located (based on your Git root). If your extension has its own git repository you can change this to `./`<% } %>

---

You may learn about the project structure in [Rebirth docs](https://joonasy.github.io/rebirth)
