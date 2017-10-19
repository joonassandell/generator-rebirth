# <%= appNameHumanize %>

> <%= appDescription %>. Generated on <%= (generatorDate) %> with [<%= pkg.name %> v<%= pkg.version %>](<%= (generatorRepository) %>).

## Requirements

<% if (typo3) { %>* [Typo3](http://typo3.org)
* [Flux](http://typo3.org/extensions/repository/view/flux)
* [Fluid Pages Engine](http://typo3.org/extensions/repository/view/fluidpages)
* [Fluid Content Engine](http://typo3.org/extensions/repository/view/fluidcontent)
* [Vhs](http://typo3.org/extensions/repository/view/vhs)<% } if (wp) { %> 
* [WordPress](https://wordpress.org/)<% if (pluginACFkey) { %>
* [Advanced Custom Fields Pro](http://www.advancedcustomfields.com/pro/)<% }} if (typo3 || wp) { %>
* [Composer](https://getcomposer.org/)<% } %>
* [Node.js](http://nodejs.org/)
* [Npm](https://www.npmjs.org/)<% if (docker) { %>

## Getting started

[<%= appNameHumanize %> - <%= name() %> Docker](https://bitbucket.org/<%= appAuthorDasherize %>/<%= dir %>-docker.git) installs all the required dependencies and builds your development environment. Works with GNU/Linux/Unix and could also work in Windows. Otherwise clone this theme to your themes folder and do the install process.<% } %>

## Install

**1.** Clone this repository<% if (typo3) { %> to `<%= dir %>` folder<% } %>

**2.** Install node modules
  
    npm install

## Usage

* `npm run build`: Build the application
* `npm run deploy`: Build the application and deploy it to the server<% if (html) { %>* `npm run dist`: Build the application and start a local server for testing purposes<% } %>
* `npm run dev`: Watches files and sets up development environment.
    * `--host=yourlocalhost.app`: Assign your custom host for the BrowserSync
    * `--disable_open`: Disables automatic browser opening

---

Learn about the project structure in [Rebirth docs](https://github.com/joonasy/generator-rebirth/tree/master/docs)
