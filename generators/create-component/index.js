/* =======================================
 * New Component Boilerplate
 * ======================================= */

const _ = require('underscore.string');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const { copy: copy } = require('../../utility');

module.exports = class Component extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', {
      desc: 'Your component name',
      required: true,
      type: String,
    });

    this.name = _.capitalize(
      _.camelize(_.dasherize(_.slugify(this.options.name))),
    );
    this.assetsPath = this.config.get('assetsPath');
    this.dist = `${this.config.get('assetsPath')}components/${this.name}/`;
  }

  copyFiles() {
    copy(
      `_Component.config.scss`,
      `${this.dist}_${this.name}.config.scss`,
      this,
    );
    copy(`_Component.scss`, `${this.dist}_${this.name}.scss`, this);
    copy(
      `_Component--default.scss`,
      `${this.dist}_${this.name}--default.scss`,
      this,
    );
    copy(`_index.scss`, `${this.dist}_index.scss`, this);
  }

  end() {
    this.log(
      `\n  ===================================================================== \n`,
    );
    this.log(
      `${chalk.green('  !')} ${chalk.bold(this.name)} component created to ${
        this.dist
      }`,
    );
    this.log(
      `${chalk.green('  ❯')} Import component SCSS (in ${chalk.bold(
        this.assetsPath + 'index.scss',
      )}): ${chalk.cyan("@import 'components/" + this.name + "/index';")}`,
    );
    this.log(
      `\n  ===================================================================== \n`,
    );
  }
};
