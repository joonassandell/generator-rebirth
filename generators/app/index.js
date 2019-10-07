/* =======================================
 * Rebirth
 * ======================================= */

const _ = require('underscore.string');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const moment = require('moment');
const yosay = require('yosay');

function copy(source, destination, gen) {
  gen.fs.copyTpl(
    gen.templatePath(source),
    gen.destinationPath(destination),
    gen,
  );
}

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
      defaults: 'typo3',
      type: String,
    });

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
    this.wp ? (this.dir = _.dasherize(this.dir)) : this.dir;

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
        message: 'Author name:',
        default: this.user.git.name() ? this.user.git.name() : 'Author',
      },
      {
        type: 'input',
        name: 'appNameSpace',
        message: 'Project namespace:',
        default: (props) => props.author,
        when: () => this.typo3 || this.wp,
      },
      {
        type: 'input',
        name: 'url',
        message: 'Project URL (in production):',
        default: (props) => `https://${_.dasherize(_.slugify(props.name))}.com`,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: (props) => `Website for ${_.humanize(props.name)}`,
      },
      {
        type: 'input',
        name: 'repositoryURL',
        message: 'Project repository URL:',
        default: (props) =>
          `git@bitbucket.org:${_.dasherize(_.slugify(props.author))}/${
            this.dir
          }.git`,
      },
      {
        type: 'input',
        name: 'devURL',
        message: 'Project development repository URL:',
        default: (props) =>
          `https://bitbucket.org/${_.dasherize(_.slugify(props.author))}/${
            this.dir
          }-dev.git`,
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
      this.appNameDasherize = _.dasherize(_.slugify(props.name));
      this.appNameHumanize = _.humanize(this.appNameDasherize);
      this.appNameUnderscored = _.underscored(this.appNameDasherize);
      this.appNamePascalize = _.capitalize(_.camelize(this.appNameDasherize));
      this.appAuthor = props.author;
      this.appAuthorDasherize = _.dasherize(_.slugify(this.appAuthor));
      this.appNameSpace = _.capitalize(_.camelize(props.appNameSpace));
      this.appURL = props.url;
      this.appDescription = props.description;
      this.appRepositoryURL = props.repositoryURL;
      this.appDevURL = props.devURL;
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
    const assetsDir = this.templatePath(
      '../../../node_modules/rebirth-ui/src/',
    );

    const assets = [
      'components/Heading/',
      'components/Icon/',
      'components/Text/_index.scss',
      'components/Text/_Text.scss',
      'components/Text/_Text.config.scss',
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
      'javascripts/feature.js',
      'javascripts/utility.js',
    ].forEach((file) => {
      copy(
        `${assetsDir}${file}`,
        `${this.config.get('assetsPath')}${file}`,
        this,
      );
    });

    copy(
      `${assetsDir}/index.base.js`,
      `${this.config.get('assetsPath')}index.js`,
      this,
    );

    copy(
      `${assetsDir}/index.base.scss`,
      `${this.config.get('assetsPath')}index.scss`,
      this,
    );

    copy(
      `shared/gitkeep`,
      `${this.config.get('assetsPath')}images/.gitkeep`,
      this,
    );
    copy(
      `shared/gitkeep`,
      `${this.config.get('assetsPath')}fonts/.gitkeep`,
      this,
    );
  }

  typo3() {
    if (this.typo3) {
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
      copy(`wordpress/_package.json`, `package.json`, this);
      copy(`wordpress/_gulpfile.js`, `gulpfile.js`, this);
      copy(`wordpress/_functions.php`, `functions.php`, this);
      copy(`wordpress/lib/clean-up.php`, `lib/clean-up.php`, this);
      copy(`wordpress/lib/utility.php`, `lib/utility.php`, this);
      copy(`wordpress/lib/plugins.php`, `lib/plugins.php`, this);
      copy(`wordpress/lib/setup.php`, `lib/setup.php`, this);
      copy(
        `wordpress/lib/custom-post-types/cpt-name.php`,
        `lib/custom-post-types/cpt-name.php`,
        this,
      );
      copy(
        `wordpress/lib/shortcodes/sc-name.php`,
        `lib/shortcodes/sc-name.php`,
        this,
      );
      copy(`wordpress/_style.css`, `style.css`, this);
      copy(`wordpress/header.php`, `header.php`, this);
      copy(`wordpress/footer.php`, `footer.php`, this);
      copy(`wordpress/index.php`, `index.php`, this);
      copy(`wordpress/page.php`, `page.php`, this);
      copy(`wordpress/template-home.php`, `template-home.php`, this);
      copy(`wordpress/single.php`, `single.php`, this);
      copy(`wordpress/containers`, `containers`, this);
      copy(`wordpress/partials`, `partials`, this);
      copy(`wordpress/templates`, `templates`, this);
      copy(`wordpress/components`, `components`, this);
      copy(`shared/gitkeep`, `languages/.gitkeep`, this);
      copy(`shared/gitkeep`, `acf-json/.gitkeep`, this);
      copy(`wordpress/_shipitfile.js`, `shipitfile.js`, this);
      copy(`wordpress/_env`, `.env`, this);
      copy(`wordpress/_env`, `.env.example`, this);
      copy(`wordpress/nvmrc`, `.nvmrc`, this);
      copy(`wordpress/_composer.json`, `composer.json`, this);
    }
  }

  install() {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      bower: false,
      npm: false,
      yarn: true,
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
