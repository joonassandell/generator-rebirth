## Typo3 project type

Typo3 is Open Source Enterprise CMS and Scalable Web Application Framework. 

## Starter extension folder structure

For all the shared files and structure see [shared files across project types](../)

```
project-folder/                       
    extension_name/                   # [1]
    |
    |── Classes/                      # [2]
    |── Configuration/                # [3]
    |── Resources/                    # [4]
    |   |
    |   |── Private/                  # [5]
    |   |   |── Layouts/
    |   |   |   `── App.html          # [6]
    |   |   |── Partials/
    |   |   |   `── Bottom.html       # [7]
    |   |   |   `── Top.html          # [8]
    |   |   |   `── Bottom.dist.html  # [9]
    |   |   |   `── Top.dist.html     # [10]
    |   |   |── Templates/ 
    |   |   |   `── HomePage.html     # [11]
    |   |── Public/                   # [12]
    |
    |── Media/                        # [13]
    |── typo3/                        # [14]
        `── composer.json             # [15]
    `── ext_emconf.php                # [16]
    `── ext_tables.php                # [17]
```

* **1.** Extension folder
* **2.** Typo3 settings
* **3.** Typo3 settings
* **4.** Public and private files
* **5.** Site layouts, partials and templates
* **6.** Default application layout
* **7.** This file contains all the JavaScripts and material that are located in the bottom of the HTML document 
* **8.** This file contains all the CSS, JavaScripts and material that are located in the top of the HTML document
* **9., 10.** These are the build process made files which contain the new references to the build assets. These should be ignored from git
* **11.** HomePage template
* **12.** Public folder where build assets are placed
* **13.** This folder contains temporary material that are used mainly in Html templates
* **14.** Typo3 installation folder
* **15.** Contains all Typo3 dependencies
* **16., 17.** Typo extension configuration

## Usual Workflow

1. Html, CSS, JavaScript and static Typo3 templates are built
    * After the static material is done add a separate `html` branch for easier referencing and testing in the future once compared to the `master` branch.
2. Static material is converted to work with the CMS.
3. If deployment settings have been set run `npm run deploy` to build and deploy. Otherwise run `npm run build` and move changed and build files to server manually.

## FAQ

**How can I add my custom hostname to work with the development environment?**

It's recommended to keep consistent naming and not to bloat the repository with extra env material. However here is how to do it:

* 1. Use host flag `npm run dev --host=mycustomhost.app` to setup proxy
* 2. Add your host to the dev environment in _Configuration/TypoScript/setup.txt_:
```
[globalString = ENV:HTTP_HOST = project-name.dev:8000] || [globalString = ENV:HTTP_HOST = mycustomhost.app] 
  plugin.tx_myextension.settings.dev = 1
[END]
```
* 3. Clear all your caches in Install tool
* 4. You may experience [this issue](https://wiki.typo3.org/Exception/CMS/1396795884). Follow the instructions and add you host to the trusted hosts.

## Useful Typo3 extensions

Here you'll find listed some useful extensions that you should check out first
before writing your own functionality.

### Dev tools

* [nocache](https://github.com/FluidTYPO3/uncache) - Disables caching in Typo3. No need to clear caches manually.
* [t3adminer](https://github.com/TYPO3-svn-archive/t3adminer) - Adminer database admin tool as a module for Typo3.

### Forms

* [Powermail](http://typo3.org/extensions/repository/view/powermail) - All around tool for handling any kind of form.
