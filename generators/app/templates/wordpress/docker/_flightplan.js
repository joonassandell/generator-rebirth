/* ========================================
 * Local actions
 * ======================================== */

require('dotenv').config()
const plan = require('flightplan')
const cfg = require('./flightplan.config')


/* ======
 * Configuration
 * ====== */

/**
 * Target servers
 */
plan.target('local', {})
plan.target('production', cfg.production, cfg.production.opts)
plan.target('production-db', cfg.productionDB, cfg.productionDB.opts)

/**
 * Setup folders, prompts etc. ready for install
 */
let sshUser, sshPort, sshHost, root, url, dbName, dbUser, dbPw
let date = `${new Date().getTime()}`

plan.local(['start', 'assets-pull', 'db-pull', 'db-replace'], local => {
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
 * Start & update
 * ====== */

plan.local(['start'], local => {
  local.log('Updating submodules...')
  local.exec(`
    if [ -d ".git" ]
      then
        git submodule update --rebase --remote
    fi
  `, { failsafe: true })

  local.log('Installing dependencies...')
  local.exec(`
    if [ ! -d "<%= dir %>/node_modules" ]
      then
        (cd <%= dir %> && npm install)
    fi

    # Start Docker
    docker-compose up -d

    docker run --rm --volumes-from=<%= dir %>-app --workdir=/var/www/html/ \
      composer/composer:alpine update
  `)
})


/* ======
 * Pull assets
 * ====== */

plan.local(['assets-pull'], local => {
  local.log('Downloading uploads folder...')
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    ${sshUser}@${sshHost}:${root}/wp-content/uploads wp/wp-content`, { failsafe: true })
})


/* ======
 * Backup database
 * ====== */

plan.local(['db-backup'], local => {
  local.log('Creating local backups...')
  local.exec(`mkdir -p database/local`, { silent: true, failsafe: true })
  local.exec(`docker-compose exec mysql bash -c "mysqldump -uroot -proot \
      wordpress > /database/local/wordpress-${date}.sql"`)
})


/* ======
 * Pull database
 * ====== */

plan.remote(['db-pull'], remote => {
  remote.log('Creating remote database dump...')
  remote.exec(`mkdir -p ${root}/tmp/database/remote`, { silent: true, failsafe: true })
  remote.exec(`mysqldump -u${dbUser} -p${dbPw} ${dbName} > ${root}/tmp/database/remote/${dbName}-${date}.sql`)
})

plan.local(['db-pull'], local => {
  local.log('Pulling database...')
  local.exec(`mkdir -p database/remote`, { silent: true, failsafe: true })
  local.exec(`rsync -avz -e "ssh -p ${sshPort}" \
    ${sshUser}@${sshHost}:${root}/tmp/database/remote/${dbName}-${date}.sql ./database/remote`)
  local.exec(`cp ./database/remote/${dbName}-${date}.sql ./database/wordpress.sql`)
})

plan.remote(['db-pull'], remote => {
  remote.log('Removing remote database dump...')
  remote.exec(`rm ${root}/tmp/database/remote/${dbName}-${date}.sql`)
})


/* ======
 * Replace database
 * ====== */

plan.local(['db-replace'], local => {
  local.log('Replacing database...')
  local.exec(String.raw`
    if [ -f "database/wordpress.sql" ]
      then
        docker-compose exec mysql bash -c "mysql -uroot \
          -proot \
          -e ' \
            drop database wordpress; create database wordpress; \
            use wordpress; source wordpress.sql; \
            set @DEVELOPMENT_URL=\"${process.env.DEV_URL}\"; \
            set @DEVELOPMENT_SITE_URL=\"${process.env.DEV_URL}/wp\"; \
            set @REMOTE_URL=\"${url}\"; \
            set @REMOTE_SITE_URL=\"${url}/wp\"; \
            source migrate.txt;'"
    fi
  `)
});
