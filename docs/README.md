# Project

> Project instructions, development information and structure

Please read Rebirth [CSS Styleguide](https://github.com/joonasy/rebirth/tree/master/docs/css) and [JavaScript Styleguide](https://github.com/joonasy/rebirth/tree/master/docs/js)

Project specific instructions: 

* [Typo3](typo3)

## Usage (Gulp tasks)

* `npm run build`: Build the application
* `npm run deploy`: Build the application and deploy it to the server. Required [dploy](https://github.com/lucasmotta/dploy) setup.
* `npm run dev`: Watches files and sets up development environment.
    * `--open=false`: Disables automatic browser opening.
    * `--host=yourlocalhost.app`: Assign your custom host for the BrowserSync


## Shared starter files and folder structure across project types

```
project-folder/
    project/                     # [1]
    |
    |── assets/                  # [2]
    |   |
    |   |── fonts/               # [3]
    |   |── images/              # [4]
    |   |── javascripts/         # [5]
    |   |── stylesheets/         # [6]    
    |
    |── bower_components/        # [7]   
    |── node_modules/            # [8]   
    |
    `── .editorconfig            # [9]
    `── .gitignore               # [10]
    `── .jscsrc                  # [11]
    `── .yo-rc.json              # [12]
    `── bower.json               # [13]
    `── dploy.example.yaml       # [14]
    `── gulpfile.js              # [15]
    `── package.json             # [16]
    `── README.md                # [17]
    `── rev-manifest.json        # [18]
```

* **1.** Source folder of your project type (e.g. theme, extension, src)
* **2.** This folder contains all static assets. Lettercase may vary
* **3.** Folder for self-hosted fonts and icon fonts
* **4.** Static images that are referenced via CSS
* **5.** JavaScripts please refer to [JavaScript Styleguide](/docs/js/)
* **6.** Stylesheets please refer to [CSS Styleguide](/docs/css/)
* **7.** This folder contains all [Bower](http://bower.io) components *
* **8.** This folder contains all [Npm](https://www.npmjs.com/) modules *
* **9.** [EditorConfig](http://editorconfig.org/) settings
* **10.** Set your git ignores here
* **11.** [JavaScript coding style](http://jscs.info/overview.html) settings that follow our [JavaScript Styleguide](../js/)
* **12.** Contains settings for the Yeoman generator
* **13.** Add your [Bower packages](http://bower.io/#save-packages) here
* **14.** Your deployment [DPLOY](https://leanmeanfightingmachine.github.io/dploy/) settings. Rename this to `dploy.yaml` * and make sure it's ignored by git _NEVER UPLOAD YOUR DEPLOYMENT SETTINGS ANYWHERE_
* **15.** [Gulpfile](http://gulpjs.com/) that handles the build process 
* **16.** [Npm package](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
* **17.** Add your project specific instructions here
* **18.** In build process an asset manifest, mapping the original paths to the revisioned paths, will be written here

<sub>\* Ignored from [Git](http://git-scm.com/).</sub>

