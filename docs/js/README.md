# JavaScript Styleguide

We use [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as our JavaScript styleguide.


## Structure

``` 
    javascripts/
    |
    |── components/           # [1]
    |   |── Component.js      # [2]
    |   …
    |
    |── plugins/              # [3]
    |   |── figureImgAsBg.js  
    |   |── toggle.js         
    |   …
    | 
    |── vendors/              # [4]
    |   |── vendor.js  
    |   …
    |
    `── head.js               # [5]
    `── app.js                # [6]
```

* **1.** Place all components here.
* **2.** Component placeholder.
* **3.** Place all plugins here.
* **4.** 3rd party vendors that aren't added from Bower/Npm.
* **5.** Place all JavaScript here you want to init in the head section of the HTML document.
* **6.** Init all the components. Placed in the bottom area of the HTML document.
