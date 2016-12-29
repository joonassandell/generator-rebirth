## TYPO3 project type

TYPO3 is Open Source Enterprise CMS and Scalable Web Application Framework. 

## Extension folder structure

For all the shared files and structure see [shared files across project types](../).

```
extension/                        # [1]
|
|── Assets/                       # [2]
|── Classes/                      # [3]
|── Configuration/                # [4]
|── Resources/                    # [5]
|   |
|   |── Private/                  # [6]
|   |   |── Layouts/
|   |   |   `── App.html          # [7]
|   |   |── Partials/
|   |   |   `── Bottom.html       # [8]
|   |   |   `── Top.html          # [9]
|   |   |   `── Bottom.dist.html  # [10]
|   |   |   `── Top.dist.html     # [11]
|   |   |── Templates/ 
|   |   |   `── HomePage.html     # [12]
|   |── Public/                   # [13]
|
|── Media/                        # [14]
|── typo3/                        # [15]
    `── composer.json             # [16]
`── ext_emconf.php                # [17]
`── ext_tables.php                # [18]
```

* **1.** Extension folder
* **2.** This folder contains all assets which follow the [Rebirth project structure](https://github.com/joonasy/rebirth/tree/master/docs/markdown), [Rebirth CSS styleguide](https://github.com/joonasy/rebirth/tree/master/docs/markdown/css) and [Rebirth JavaScript styleguide](https://github.com/joonasy/rebirth/tree/master/docs/markdown/js)
* **3. / 4.** Typo3 settings
* **5.** Public and private files
* **6.** Site layouts, partials and templates
* **7.** Default application layout
* **8.** This file contains all the JavaScripts and material that are located in the bottom of the HTML document 
* **9.** This file contains all the CSS, JavaScripts and material that are located in the top of the HTML document
* **10. / 11.** These are the build process made files which contain the new references to the build assets. These should be ignored from git
* **12.** HomePage template
* **13.** Public folder where build assets are placed
* **14.** This folder contains temporary material that are used mainly in Html templates
* **15.** Typo3 installation folder
* **16.** Contains all Typo3 dependencies
* **17. / 18.** Typo extension configuration

## Docker folder structure

```
project-folder/                       
    extension/                        # [1]
    |    …
    |
    typo3/                            # [2]
    |    …
    |
    `── .gitignore                    # [3]
    `── .gitmodules                   # [4]
    `── .docker-compose.override.yml  # [5]
    `── .docker-compose.yml           # [6]
    `── Dockerfile                    # [7]
    `── install.sh                    # [8]
    `── Makefile                      # [9]
    `── README.md                     # [10]
```

* **1.** Extension folder as described above
* **2.** TYPO3 install folder
* **3.** Set your git ignores here
* **4.** Gitmodules which contains the extension repo
* **5.** Your custom docker settings
* **6.** Docker settings
* **7.** Dockerfile which installs the docker container
* **8.** Install script which install and setups TYPO3
* **9.** Makefile to simplify docker commands
* **10.** Installation instructions and command reference

## Issues and FAQ

Head to [Github issues](https://github.com/joonasy/generator-rebirth/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aclosed%20is%3Aopen%20label%3Atypo3%20)
