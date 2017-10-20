/* ========================================
 * <%= appNameHumanize %> - Deployment
 * ======================================== */

require('dotenv').config()
const pkg = require('./package.json')
const PROD_TYPO3_ROOT = '/var/www/webroot/ROOT'
const WORKSPACE = process.env.WORKSPACE || '/tmp/<%= dir %>'

module.exports = shipit => {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      workspace: WORKSPACE,
      repositoryUrl: pkg.repository,
      ignores: [".*", "gulpfile.js", "package.json", "README.md", "rev-manifest.json", "shipitfile.js", "./Assets/", "node_modules/", "selection.json", "yarn.lock", "config.md"],
      keepReleases: 5,
      deleteOnRollback: false,
      rsync: ['--include="dist/**/*"'],
    },
    production: {
      branch: 'master',
      deployTo: `${PROD_TYPO3_ROOT}/typo3conf/releases/<%= dir %>`,
      servers: process.env.PRODUCTION_SSH,
    }
  })

  shipit.blTask('npm', (e) => {
    shipit.log('Installing dependencies...')
    return shipit.local('npm install', { cwd: WORKSPACE })
      .then(() => shipit.log('Successfully installed dependencies'))
      .catch(() =>  {
        shipit.log('Failed to install dependencies')
        process.exit()
      })
  })

  shipit.blTask('build', () => {
    shipit.log('Running build...')
    return shipit.local('npm run build', { cwd: WORKSPACE })
      .then(() => shipit.log('Build successful'))
      .catch(() => {
        shipit.log('Build failed')
        process.exit()
      })
  })

  shipit.blTask('setup', () => {
    shipit.log('Running setup...')
    shipit.remote(`
      if [ ! -d "${PROD_TYPO3_ROOT}/typo3conf/ext/<%= dir %>" ]
        then
          mkdir -p ${PROD_TYPO3_ROOT}/typo3conf/releases/<%= dir %> \
          && ln -s ${PROD_TYPO3_ROOT}/typo3conf/releases/<%= dir %>/current \
            ${PROD_TYPO3_ROOT}/typo3conf/ext/<%= dir %>
      fi
    `)
  })

  shipit.on('fetched', () => {
    shipit.start('npm', 'build')
  })

  shipit.on('published', () => {
    shipit.start('setup')
  })
}
