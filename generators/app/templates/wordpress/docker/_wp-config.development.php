<?php
/* ========================================
 * Development config for WordPress
 * ========================================
 *
 * Include the four main database defines. You may include other settings here
 * that you only want enabled on your local development checkouts
 */

define('DB_NAME', 'wordpress');
define('DB_USER', 'root');
define('DB_PASSWORD', 'password');
define('DB_HOST', 'mysql');
define('SAVEQUERIES', true);
define('WP_DEBUG', true);
define('FS_METHOD', 'direct');
define('WP_DEV', true);
