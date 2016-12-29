## TYPO3 project type

TYPO3 is Open Source Enterprise CMS and Scalable Web Application Framework. 

## Extension folder structure

For all the shared files and structure see [shared files across project types](../).

```
extension/                        # [1]
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
* **9. / 10.** These are the build process made files which contain the new references to the build assets. These should be ignored from git
* **11.** HomePage template
* **12.** Public folder where build assets are placed
* **13.** This folder contains temporary material that are used mainly in Html templates
* **14.** Typo3 installation folder
* **15.** Contains all Typo3 dependencies
* **16. / 17.** Typo extension configuration

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
