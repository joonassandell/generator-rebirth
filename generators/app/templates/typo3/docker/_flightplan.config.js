/* ========================================
 * Coxa - Flightplan  config
 * ======================================== */

const config = {
  production: {
    host: process.env.PROD_SSH_HOST,
    username: process.env.PROD_SSH_USER,
    port: process.env.PROD_SSH_PORT,
    agent: process.env.SSH_AUTH_SOCK,
    readyTimeout: 999999,
    opts: {
      root: '/var/www/webroot/ROOT',
      typo3root: '/var/www/webroot/ROOT',
      extDir: '<%= dir %>',
    }
  },
  productionDB: {
    host: process.env.PROD_DB_SSH_HOST,
    username: process.env.PROD_DB_SSH_USER,
    port: process.env.PROD_DB_SSH_PORT,
    agent: process.env.SSH_AUTH_SOCK,
    readyTimeout: 999999,
    opts: {
      root: '',
      dbName: process.env.PROD_DB_NAME,
      dbUser: process.env.PROD_DB_USER,
      dbPw: process.env.PROD_DB_PASSWORD,
    }
  }
}

module.exports = config
