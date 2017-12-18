/* ========================================
 * Remote actions
 * ======================================== */

require('dotenv').config()
const plan = require('flightplan')
const cfg = require('./flightplan.config')


/* ======
 * Config
 * ====== */

/**
 * Target servers
 */
plan.target('production', cfg.production, cfg.production.opts)
plan.target('production-db', cfg.productionDB, cfg.productionDB.opts)

/**
 * Setup folders etc. ready for files
 */
let sshUser, sshPort, sshHost, root, url, dbName, dbUser, dbPw
const date = new Date().getTime()
const tmpDir = `wp-update-${date}`

plan.local('start', local => {
  const input = local.prompt('Are you sure you want to continue with the process? [y/n]')

  if (input.indexOf('y') === -1) {
    plan.abort('Plan canceled.')
  }
})

plan.local(['start', 'update', 'assets-push', 'db-replace'], local => {
  sshHost = plan.runtime.hosts[0].host
  sshUser = plan.runtime.hosts[0].username
  sshPort = plan.runtime.hosts[0].port
  root = plan.runtime.options.root
  url = plan.runtime.options.url
  dbName = plan.runtime.options.dbName
  dbUser = plan.runtime.options.dbUser
  dbPw = plan.runtime.options.dbPw
})


/* ======
 * Install WordPress
 * ====== */

plan.remote(['start', 'update'], remote => {
  remote.exec(`mkdir -p ${root}/tmp/wp-deployments`, { silent: true, failsafe: true })
})

plan.local(['start', 'update'], local => {
  const filesToCopy = [
    'wp/.htaccess.example',
    'wp/index.php',
    'wp/wp-content/mu-plugins/register-theme-directory.php',
    'wp/wp-config.php',
    'wp/composer.json',
    'wp/auth.json'
  ]

  local.log('Transferring local files ready for remote installation...')
  local.transfer(filesToCopy, `${root}/tmp/wp-deployments/${tmpDir}`, { failsafe: true })
})

plan.remote(['start', 'update'], remote => {
  remote.log('Installing Composer...')
  remote.exec(`curl -sS https://getcomposer.org/installer | php && mv composer.phar ${root}`)

  remote.log('Copying files...')
  const deploymentPath = `${root}/tmp/wp-deployments/${tmpDir}`

  remote.exec(`cp ${deploymentPath}/wp/auth.json ${root}`, { failsafe: true })
  remote.exec(`cp ${deploymentPath}/wp/composer.json ${root}`)

  if (plan.runtime.task === 'start') {
    remote.exec(`cp ${deploymentPath}/wp/.htaccess.example ${root}/.htaccess`)
    remote.exec(`cp ${deploymentPath}/wp/index.php ${root}`)
    remote.exec(`mkdir -p ${root}/wp-content/mu-plugins/`, { silent: true, failsafe: true })
    remote.exec(`cp ${deploymentPath}/wp/wp-content/mu-plugins/register-theme-directory.php \
      ${root}/wp-content/mu-plugins/`)
    remote.exec(`cp ${deploymentPath}/wp/wp-config.php ${root}`)
  }

  remote.log('Installing Composer dependencies...')
  remote.exec(`mkdir ${root}/vendor`, { failsafe: true })
  remote.with(`cd ${root}`, () => { remote.exec(`php composer.phar update`)})

  remote.log('Removing uploaded files...')
  remote.exec(`rm -r ${root}/auth.json`, { failsafe: true })
  remote.exec(`rm -r ${root}/composer.json`, { failsafe: true })
  remote.exec(`rm -r ${deploymentPath}`)
})


/* ======
 * Push assets
 * ====== */

 plan.local(['assets-push'], local => {
  local.log('Deploying uploads folder...')
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    wp/wp-content/uploads ${sshUser}@${sshHost}:${root}/wp-content`, { failsafe: true })
 })


/* ======
 * Replace database
 * ====== */

plan.local(['db-replace'], local => {
  local.log('Creating local database dump...')
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true })
  local.exec(`docker-compose exec mysql bash -c "mysqldump -uroot -proot \
    wordpress > database/local/wordpress-${date}.sql"`)

  local.log('Pushing local database dump to remote...')
  local.transfer([
    `database/migrate.remote.txt`,
    `database/local/wordpress-${date}.sql`
  ], `${root}/tmp`)
})

plan.remote(['db-replace'], remote => {
  remote.log('Backuping remote database...')
  remote.exec(`mv ${root}/tmp/database/migrate.remote.txt ${root}`)
  remote.exec(`mysqldump -u${dbUser} -p${dbPw} -f ${dbName} > \
    ${root}/tmp/database/remote/wordpress-${date}.sql;`, { failsafe: true })

  remote.log('Dropping remote database...')
  remote.exec(`mysql -u${dbUser} -p${dbPw} -e 'drop database ${dbName};'`, { failsafe: true })

  remote.log('Replacing remote database...')
  remote.exec(`
    mysql -u${dbUser} -p${dbPw} \
      -e ' \
        create database ${dbName}; use ${dbName}; \
        source ${root}/tmp/database/local/wordpress-${date}.sql; \
        set @DEVELOPMENT_URL="${process.env.DEV_URL}"; \
        set @DEVELOPMENT_SITE_URL="${process.env.DEV_URL}/wp"; \
        set @REMOTE_URL="${url}"; \
        set @REMOTE_SITE_URL="${url}/wp"; \
        source ${root}/migrate.remote.txt;'
  `, { failsafe: true })

  remote.exec(`rm ${root}/migrate.remote.txt`, { silent: true, failsafe: true })
  remote.exec(`rm -r ${root}/tmp/database/local`, { silent: true, failsafe: true })
})
