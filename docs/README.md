# Project

> Project instructions, development information and structure

Please read Rebirth [CSS Styleguide](https://github.com/joonasy/rebirth/tree/master/docs/css) and [JavaScript Styleguide](https://github.com/joonasy/rebirth/tree/master/docs/js)

Project specific instructions: 

* [Typo3](typo3)

## Gulp tasks

* `npm run build`: Build the application
* `npm run deploy`: Build the application and deploy it to the server. Required [dploy](https://github.com/lucasmotta/dploy) setup.
* `npm run dev`: Watches files and sets up development environment.
    * `--disable_open`: Disables automatic browser opening.
    * `--host=yourlocalhost.app`: Assign your custom host for the BrowserSync

## Structure across project types

```
src/                         # [1]
|
|── assets/                  # [2]
|   |   …
|
|── bower_components/        # [3]   
|── node_modules/            # [4]   
|
`── .editorconfig            # [5]
`── .gitignore               # [6]
`── .jscsrc                  # [7]
`── .yo-rc.json              # [8]
`── bower.json               # [9]
`── dploy.example.yaml       # [10]
`── gulpfile.js              # [11]
`── package.json             # [12]
`── README.md                # [13]
`── rev-manifest.json        # [14]
```

* **1.** Source folder of your project type (theme, extension, src)
* **2.** This folder contains all assets which follow the [Rebirth project structure](https://github.com/joonasy/rebirth/tree/master/docs/markdown), [Rebirth CSS styleguide](https://github.com/joonasy/rebirth/tree/master/docs/markdown/css) and [Rebirth JavaScript styleguide](https://github.com/joonasy/rebirth/tree/master/docs/markdown/js). Lettercase may vary
* **3.** This folder contains all [Bower](http://bower.io) components *
* **4.** This folder contains all [Npm](https://www.npmjs.com/) modules *
* **5.** [EditorConfig](http://editorconfig.org/) settings
* **6.** Set your git ignores here
* **7.** [JavaScript coding style](http://jscs.info/overview.html) settings that follow our [JavaScript Styleguide](../js/)
* **8.** Contains settings for the Yeoman generator
* **9.** Add your [Bower packages](http://bower.io/#save-packages) here
* **10.** Your deployment [DPLOY](https://leanmeanfightingmachine.github.io/dploy/) settings. Rename this to `dploy.yaml` * and make sure it's ignored by git _NEVER UPLOAD YOUR DEPLOYMENT SETTINGS ANYWHERE_
* **11.** [Gulpfile](http://gulpjs.com/) that handles the build process 
* **12.** [Npm package](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
* **13.** Add your project specific instructions here
* **14.** In build process an asset manifest, mapping the original paths to the revisioned paths, will be written here *

<sub>\* Ignored from [Git](http://git-scm.com/).</sub>

