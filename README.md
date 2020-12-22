# Rebirth Yeoman generator

Yeoman generator for [Rebirth](https://github.com/joonassandell/rebirth.git). Scaffold a new WordPress theme, TYPO3 extension, static HTML or custom (TODO) project. Learn more in [Docs](https://joonassandell.github.io/rebirth/docs/getting-started/generator/).

## Quick start

Run the generator in your desired location, pass in your project name (required; this will be your installation directory also) and your project type (`typo3`, `html` or `wordpress`):

```
$ npm install yo -g && npm install generator-rebirth -g
$ yo rebirth [my-new-project] --project=wordpress
```

If you are building a _Typo3 project_ all special characters are removed from the extension directory name e.g. `my-project_folder` -> `myprojectfolder`.

## Documentation

Rebirths documentation is built with Assemble and publicly hosted on GitHub Pages at [https://joonassandell.github.io/rebirth](https://joonassandell.github.io/rebirth).

## Development

Remember to link this package, rebirth and rebirth-wordpress:

1. `$ npm link`
2. `$ npm link rebirth-ui`
3. `$ npm link rebirth-wordpress`

## License

Copyright (c) 2020 Joonas Sandell (Twitter: [@joonassandell](https://twitter.com/joonassandell)). Licensed under the MIT license.
