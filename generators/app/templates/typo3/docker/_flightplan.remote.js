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
let sshUser, sshPort, sshHost, webRoot, dbName, dbUser, dbPw
const date = new Date().getTime()
const tmpDir = `typo3-update-${date}`

plan.local('start', local => {
  const input = local.prompt('Are you sure you want to continue with the process? [y/n]')

  if (input.indexOf('y') === -1) {
    plan.abort('Plan canceled.')
  }
})

plan.local(['start', 'assets-push', 'db-replace'], local => {
  sshHost = plan.runtime.hosts[0].host
  sshUser = plan.runtime.hosts[0].username
  sshPort = plan.runtime.hosts[0].port
  webRoot = plan.runtime.options.webRoot
  dbName = plan.runtime.options.dbName
  dbUser = plan.runtime.options.dbUser
  dbPw = plan.runtime.options.dbPw
})


/* ======
 * Install TYPO3
 * ====== */

plan.remote('start', remote => {
  remote.exec(`mkdir -p ${webRoot}tmp/typo3-deployments/${tmpDir}`, { silent: true, failsafe: true })
})

plan.local('start', local => {
  const filesToCopy = [
    `typo3/composer.json`,
    `typo3/auth.json`
  ]

  local.log('Transferring local files ready for remote installation...')
  local.transfer(filesToCopy, `${webRoot}tmp/typo3-deployments/${tmpDir}`, { failsafe: true })
})

plan.remote('start', remote => {
  remote.log('Installing Composer...')
  remote.exec(`curl -sS https://getcomposer.org/installer | php && mv composer.phar ${root}`)

  remote.log('Copying files...')
  remote.exec(`cp ${webRoot}tmp/typo3-deployments/${tmpDir}/typo3/composer.json ${root}`)
  remote.exec(`cp ${webRoot}tmp/typo3-deployments/${tmpDir}/typo3/auth.json ${root}`, { failsafe: true })

  remote.log('Installing Composer dependencies...')
  remote.with(`cd ${webRoot}`, () => { remote.exec(`
    php composer.phar update \
    && touch FIRST_INSTALL
  `)})

  remote.log('Removing uploaded files...')
  remote.exec(`rm -r ${webRoot}auth.json`, { failsafe: true })
  remote.exec(`rm -r ${webRoot}composer.json`, { failsafe: true })
  remote.exec(`rm -rf ${webRoot}tmp/typo3-deployments/${tmpDir}`)
})


/* ======
 * Push assets
 * ====== */

 plan.local(['assets-push'], local => {
  local.log('Deploying uploads folder...')
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    typo3/uploads ${sshUser}@${sshHost}:${webRoot}uploads`, { failsafe: true })
 })


/* ======
 * Replace database
 * ====== */

plan.local(['db-replace'], local => {
  local.log('Creating local database dump..')
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true })
  local.exec(`docker-compose exec mysql bash -c "mysqldump -uroot -proot \
    typo3 > database/local/typo3-${date}.sql"`)

  local.log('Pushing local database dump to remote...')
  local.transfer([
    `database/local/typo3-${date}.sql`
  ], `${webRoot}tmp`)
})

plan.remote(['db-replace'], remote => {
  remote.log('Backuping remote database...')
  remote.exec(`mkdir -p ${webRoot}tmp/database/remote`, { silent: true, failsafe: true })
  remote.exec(`mysqldump -u${dbUser} -p${dbPw} -f ${dbName} > \
    ${webRoot}tmp/database/remote/${dbName}-${date}.sql;`, { failsafe: true })

  remote.log('Dropping remote database...')
  remote.exec(`mysql -u${dbUser} -p${dbPw} -e 'drop database ${dbName};'`, { failsafe: true })

  remote.log('Replacing remote database...')
  remote.exec(`
    mysql -u${dbUser} -p${dbPw} \
      -e 'create database ${dbName}; use ${dbName}; \
          source ${webRoot}tmp/database/local/typo3-${date}.sql;'
  `, { failsafe: true })

  remote.log('Remove transferred local database from remote...')
  remote.exec(`rm -r ${webRoot}tmp/database/local`, { silent: true, failsafe: true })
})
