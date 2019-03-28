/* =======================================
 * Deployment
 * ======================================= */

require('dotenv').config();
const pkg = require('./package.json');
const WEBROOT = process.env.PRODUCTION_WEBROOT;
const WORKSPACE = process.env.WORKSPACE || '/tmp/<%= dir %>';

module.exports = (shipit) => {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      workspace: WORKSPACE,
      repositoryUrl: pkg.repository,
      ignores: [
        '.*',
        'gulpfile.js',
        'package.json',
        'README.md',
        'rev-manifest.json',
        'shipitfile.js',
        './Assets/',
        'node_modules/',
        'selection.json',
        'yarn.lock',
      ],
      keepReleases: 5,
      deleteOnRollback: false,
      rsync: ['--include="dist/**/*"'],
      shallowClone: false,
    },
    production: {
      branch: 'master',
      deployTo: `${WEBROOT}/typo3conf/releases/<%= dir %>`,
      servers: process.env.PRODUCTION_SSH,
    },
  });

  shipit.on('init', () => {
    return shipit.local(`mkdir -p ${WORKSPACE}`);
  });

  shipit.blTask('install', () => {
    shipit.log('Installing dependencies...');
    return shipit
      .local('yarn', { cwd: WORKSPACE })
      .then(() => shipit.log('Successfully installed dependencies'))
      .catch(() => {
        shipit.log('Failed to install dependencies');
        process.exit();
      });
  });

  shipit.blTask('build', () => {
    shipit.log('Running build...');
    return shipit
      .local('yarn build', { cwd: WORKSPACE })
      .then(() => shipit.log('Build successful'))
      .catch(() => {
        shipit.log('Build failed');
        process.exit();
      });
  });

  shipit.blTask('setup', () => {
    shipit.log('Running setup...');
    shipit.remote(`
      if [ ! -d "${WEBROOT}/typo3conf/ext/<%= dir %>" ]
        then
          mkdir -p ${WEBROOT}/typo3conf/ext/<%= dir %> \
          mkdir -p ${WEBROOT}/typo3conf/releases/<%= dir %> \
          && ln -s ${WEBROOT}/typo3conf/releases/<%= dir %>/current \
            ${WEBROOT}/typo3conf/ext/<%= dir %>
      fi
    `);
  });

  shipit.on('fetched', () => {
    shipit.start('install', 'build');
  });

  shipit.on('published', () => {
    shipit.start('setup');
  });
};
