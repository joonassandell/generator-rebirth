/* =======================================
 * Rebirth
 * ======================================= */

const _ = require('underscore.string');
const { copy: copy } = require('../../utility');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const moment = require('moment');
const yosay = require('yosay');

module.exports = class Rebirth extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.pkg = require('../../package.json');
    this.generatorDate = moment().format('D.M.YYYY');
    this.generatorRepository = this.pkg.repository;

    this.argument('dir', {
      desc: 'Your project folder',
      required: true,
      type: String,
    });

    this.option('project', {
      defaults: 'wordpress',
      type: String,
    });

    this.rebirthSrc = this.templatePath(
      '../../../node_modules/rebirth-ui/src/',
    );
    this.typo3 =
      this.options.project === 'typo3' || this.options.project === 'typo';
    this.wp =
      this.options.project === 'wordpress' || this.options.project === 'wp';
    this.html = this.options.project === 'html';

    this.name = () => {
      if (this.typo3) {
        return 'TYPO3';
      } else if (this.wp) {
        return 'WordPress';
      } else {
        return 'Html';
      }
    };

    this.dir = this.options.dir.toLowerCase();
    this.typo3 ? (this.dir = _.trim(this.dir, '_')) : this.dir;
    this.wp ? (this.dir = _.slugify(this.dir)) : this.dir;

    this.destinationRoot(this.dir);
  }

  prompts() {
    this.log(
      yosay(
        `Hi! Welcome to ${chalk.blue('Rebirth')}. Let's create a ${chalk.green(
          this.name(),
        )} project!`,
      ),
    );

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: this.dir,
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author:',
        default: this.user.git.name() ? this.user.git.name() : 'Author',
      },
      {
        type: 'input',
        name: 'appNameSpace',
        message: 'Namespace:',
        default: () => 'App',
        when: () => this.typo3,
      },
      {
        type: 'input',
        name: 'textDomain',
        message: 'Text Domain:',
        default: () => 'app',
        when: () => this.wp,
      },
      {
        type: 'input',
        name: 'url',
        message: 'Homepage (production):',
        default: (props) => `https://${_.slugify(props.name)}.com`,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Description:',
        default: (props) => `Website for ${_.humanize(props.name)}`,
      },
      {
        type: 'input',
        name: 'repositoryURL',
        message: 'Git repository (SSH):',
        default: (props) =>
          `git@bitbucket.org:${_.slugify(props.author)}/${this.dir}.git`,
      },
      {
        type: 'confirm',
        name: 'pluginWPML',
        message: 'Are you using WPML?',
        default: true,
        when: () => this.wp,
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.appName = props.name;
      this.appNameDasherize = _.slugify(props.name);
      this.appNameHumanize = _.humanize(this.appNameDasherize);
      this.appNameUnderscored = _.underscored(this.appNameDasherize);
      this.appNamePascalize = _.capitalize(_.camelize(this.appNameDasherize));
      this.appAuthor = props.author;
      this.appAuthorDasherize = _.slugify(this.appAuthor);
      this.appNameSpace = _.capitalize(_.camelize(props.appNameSpace));
      this.textDomain = _.underscored(props.textDomain);
      this.appURL = props.url;
      this.appDescription = props.description;
      this.appRepositoryURL = props.repositoryURL;
      this.dirCapitalize = _.capitalize(this.dir);
      this.pluginWPML = props.pluginWPML;
    });
  }

  setup() {
    if (this.typo3) {
      this.config.set('assetsPath', 'Assets/');
    }
    if (this.html) {
      this.config.set('assetsPath', 'src/assets/');
    }
    if (this.wp) {
      this.config.set('assetsPath', 'assets/');
    }
  }

  copySharedFiles() {
    copy(`shared/_README.md`, `README.md`, this);
    copy(`shared/_gitignore`, `.gitignore`, this);
    copy(`shared/editorconfig`, `.editorconfig`, this);
    copy(`shared/eslintrc`, `.eslintrc`, this);
    copy(`shared/browserslistrc`, `.browserslistrc`, this);
    copy(`shared/prettierrc`, `.prettierrc`, this);

    if (this.html) {
      copy(`shared/_dploy.example.yaml`, `dploy.example.yaml`, this);
      copy(`shared/_dploy.example.yaml`, `dploy.yaml`, this);
    }
  }

  assets() {
    const assetsPath = this.config.get('assetsPath');

    [
      'components/Heading/',
      'components/Icon/',
      'components/Text/_index.scss',
      'components/Text/_Text.scss',
      'components/Text/_Text.config.scss',
      'components/Text/_Text.mixins.scss',
      'containers/Container/',
      'containers/Width/',
      'containers/Wrap/',
      'containers/Grid/_Grid.scss',
      'containers/Grid/_Grid.config.scss',
      'containers/Grid/_index.scss',
      'containers/App/',
      'containers/Header/',
      'containers/Footer/',
      'containers/Template/',
      'stylesheets/generic/',
      'stylesheets/helpers/_helper.scss',
      'stylesheets/mixins/',
      '_config.scss',
      'config.js',
      'head.js',
      'images/',
      'javascripts/feature.js',
      'javascripts/polyfill.js',
      'javascripts/utility.js',
    ].forEach((file) => {
      copy(`${this.rebirthSrc}${file}`, `${assetsPath}${file}`, this);
    });

    copy(`shared/gitkeep`, `${assetsPath}fonts/.gitkeep`, this);
  }

  typo3() {
    if (this.typo3) {
      copy(`typo3/Assets/index.scss`, `Assets/index.scss`, this);
      copy(`typo3/Assets/index.js`, `Assets/index.js`, this);
      copy(`typo3/_env`, `.env`, this);
      copy(`typo3/_env`, `.env.example`, this);
      copy(`typo3/_package.json`, `package.json`, this);
      copy(`typo3/_shipitfile.js`, `shipitfile.js`, this);
      copy(`typo3/_gulpfile.js`, `gulpfile.js`, this);
      copy(
        `typo3/Configuration/TypoScript/_setup.txt`,
        `Configuration/TypoScript/setup.txt`,
        this,
      );
      copy(
        `typo3/Configuration/PageTSConfig/backendLayout.txt`,
        `Configuration/PageTSConfig/backendLayout.txt`,
        this,
      );
      copy(
        `typo3/Configuration/TCA/Overrides/_sys_template.php`,
        `Configuration/TCA/Overrides/sys_template.php`,
        this,
      );
      copy(
        `typo3/Resources/Private/Templates/_HomePage.html`,
        `Resources/Private/Templates/HomePage.html`,
        this,
      );
      copy(
        `typo3/Resources/Private/Templates/_Default.html`,
        `Resources/Private/Templates/Default.html`,
        this,
      );
      copy(
        `typo3/Resources/Private/Partials/_Head.html`,
        `Resources/Private/Partials/Head.html`,
        this,
      );
      copy(
        `typo3/Resources/Private/Partials/_Foot.html`,
        `Resources/Private/Partials/Foot.html`,
        this,
      );
      copy(
        `typo3/Resources/Private/Layouts/App.html`,
        `Resources/Private/Layouts/App.html`,
        this,
      );

      copy(`typo3/_ext_localconf.php`, `ext_localconf.php`, this);
      copy(`typo3/_ext_emconf.php`, `ext_emconf.php`, this);
      copy(`typo3/_composer.json`, `composer.json`, this);
      copy(`typo3/nvmrc`, `.nvmrc`, this);
    }
  }

  html() {
    if (this.html) {
      copy(`html/src/assets/index.scss`, `src/assets/index.scss`, this);
      copy(`html/src/assets/index.js`, `src/assets/index.js`, this);
      copy(`html/_package.json`, `package.json`, this);
      copy(`html/nvmrc`, `.nvmrc`, this);
      copy(`html/_assemblefile.js`, `assemblefile.js`, this);
      copy(`html/src/_app.json`, `src/app.json`, this);
      copy(`html/src/templates/_index.hbs`, `src/templates/index.hbs`, this);
      copy(`html/src/partials/foot.hbs`, `src/partials/foot.hbs`, this);
      copy(`html/src/helpers/assets.js`, `src/helpers/assets.js`, this);
      copy(`html/src/containers/app.hbs`, `src/containers/app.hbs`, this);
      copy(`html/src/partials/head.hbs`, `src/partials/head.hbs`, this);
    }
  }

  wp() {
    if (this.wp) {
      const rebirthWordPressSrc = this.templatePath(
        '../../../node_modules/rebirth-wordpress/',
      );
      const assetsPath = this.config.get('assetsPath');

      copy(`wordpress/assets/index.scss`, `assets/index.scss`, this);
      copy(
        `wordpress/assets/stylesheets/vendors/gutenberg.scss`,
        `assets/stylesheets/vendors/gutenberg.scss`,
        this,
      );
      copy(`wordpress/assets/index.js`, `assets/index.js`, this);
      copy(`wordpress/_package.json`, `package.json`, this);
      copy(`wordpress/_gulpfile.js`, `gulpfile.js`, this);
      copy(`wordpress/_functions.php`, `functions.php`, this);
      copy(`wordpress/lib/clean-up.php`, `lib/clean-up.php`, this);
      copy(`wordpress/lib/utility.php`, `lib/utility.php`, this);
      copy(`wordpress/lib/_plugins.php`, `lib/plugins.php`, this);
      copy(`wordpress/lib/_setup.php`, `lib/setup.php`, this);
      copy(`wordpress/lib/acf.php`, `lib/acf.php`, this);
      copy(`wordpress/lib/gutenberg.php`, `lib/gutenberg.php`, this);
      copy(`wordpress/lib/roles.php`, `lib/roles.php`, this);
      copy(
        `wordpress/lib/custom-post-types/cpt-name.php`,
        `lib/custom-post-types/cpt-name.php`,
        this,
      );
      copy(
        `wordpress/lib/custom-post-types/shared-components.php`,
        `lib/custom-post-types/shared-components.php`,
        this,
      );
      copy(
        `wordpress/lib/shortcodes/sc-name.php`,
        `lib/shortcodes/sc-name.php`,
        this,
      );
      copy(`wordpress/_style.css`, `style.css`, this);
      copy(`wordpress/header.php`, `header.php`, this);
      copy(`wordpress/archive.php`, `archive.php`, this);
      copy(`wordpress/search.php`, `search.php`, this);
      copy(`wordpress/footer.php`, `footer.php`, this);
      copy(`wordpress/index.php`, `index.php`, this);
      copy(`wordpress/404.php`, `404.php`, this);
      copy(`wordpress/page.php`, `page.php`, this);
      copy(`wordpress/template-archive.php`, `template-archive.php`, this);
      copy(`wordpress/template-home.php`, `template-home.php`, this);
      copy(
        `wordpress/template-flexible-layout.php`,
        `template-flexible-layout.php`,
        this,
      );
      copy(`wordpress/single.php`, `single.php`, this);
      copy(`wordpress/containers`, `containers`, this);
      copy(`wordpress/partials`, `partials`, this);
      copy(`wordpress/templates`, `templates`, this);
      copy(`wordpress/languages`, `languages`, this);
      copy(`shared/gitkeep`, `acf-json/.gitkeep`, this);
      copy(`wordpress/_shipitfile.js`, `shipitfile.js`, this);
      copy(`wordpress/_env`, `.env`, this);
      copy(`wordpress/_env`, `.env.example`, this);
      copy(`wordpress/nvmrc`, `.nvmrc`, this);
      copy(`wordpress/_composer.json`, `composer.json`, this);

      [
        'components/Article/',
        'components/List/',
        'components/Nav/',
        'components/Navbar/_index.scss',
        'components/Navbar/index.js',
        'components/Navbar/NavbarDefault.js',
        'components/Navbar/_Navbar.scss',
        'components/Navbar/_Navbar.config.scss',
        'components/Navbar/_Navbar--default.scss',
        'components/Button/_index.scss',
        'components/Button/index.js',
        'components/Button/Button.js',
        'components/Button/_Button.scss',
        'components/Button/_Button.config.scss',
        'components/Button/_Button--default.scss',
        'components/Button/_Button--primary.scss',
        'components/Form/_index.scss',
        'components/Form/_Form.scss',
        'components/Form/_Form.config.scss',
        'components/Form/_Form--default.scss',
        'components/Form/_Form-grid.scss',
        'components/Breadcrumb/',
        'components/Pagination/',
        'containers/Aside/_Aside.scss',
        'containers/Aside/_Aside.config.scss',
        'containers/Aside/_index.scss',
      ].forEach((file) => {
        copy(`${this.rebirthSrc}${file}`, `${assetsPath}${file}`, this);
      });

      [
        'components/Article.twig',
        'components/Breadcrumb.twig',
        'components/Icon.ref.twig',
        'components/Icon.twig',
        'components/List.twig',
        'components/Nav.twig',
        'components/Pagination.twig',
      ].forEach((file) => {
        copy(`${rebirthWordPressSrc}${file}`, `${file}`, this);
      });
    }
  }

  install() {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: false,
      npm: true,
      callback: () => {
        this._end();
      },
    });
  }

  _end() {
    this.log(
      `\n  ===================================================================== \n`,
    );
    this.log(`${chalk.green('  !')} ${chalk.bold('Project details')} \n`);
    this.log(`${chalk.green('  ❯')} Name: ${chalk.cyan(this.appName)}`);
    this.log(
      `${chalk.green('  ❯')} Description: ${chalk.cyan(this.appDescription)}`,
    );
    this.log(`${chalk.green('  ❯')} Author: ${chalk.cyan(this.appAuthor)}`);
    this.log(`${chalk.green('  ❯')} Type: ${chalk.cyan(this.name())}`);
    this.log(
      `${chalk.green('  ❯')} Production URL: ${chalk.cyan(this.appURL)} \n`,
    );

    this.log(
      `${chalk.green('  !')} Please read ${chalk.cyan(
        'README.md',
      )} for instructions and available commands.`,
    );
    this.log(
      `${chalk.green(
        '  !',
      )} Make sure all the settings such as git urls are correctly generated.`,
    );
    this.log(`${chalk.green('  ! Happy developing! :)')}`);
    this.log(
      `\n  ===================================================================== \n`,
    );
  }
};
