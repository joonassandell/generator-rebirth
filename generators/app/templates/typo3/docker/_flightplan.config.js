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
      root: process.env.PROD_ROOT,
      typo3root: process.env.PROD_TYPO3_ROOT,
      url: process.env.PROD_URL,
      extDir: process.env.PROD_EXT,
    }
  },
  productionDB: {
    host: process.env.PROD_DB_SSH_HOST,
    username: process.env.PROD_DB_SSH_USER,
    port: process.env.PROD_DB_SSH_PORT,
    agent: process.env.SSH_AUTH_SOCK,
    readyTimeout: 999999,
    opts: {
      root: process.env.PROD_DB_ROOT,
      url: process.env.PROD_URL,
      dbName: process.env.PROD_DB_NAME,
      dbUser: process.env.PROD_DB_USER,
      dbPw: process.env.PROD_DB_PASSWORD,
    }
  }
}

module.exports = config
