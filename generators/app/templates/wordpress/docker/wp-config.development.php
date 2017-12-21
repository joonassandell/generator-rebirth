<?php
/* ========================================
 * Development
 * ======================================== */

define('DB_NAME', 'wordpress');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'mysql');
define('SAVEQUERIES', true);
define('WP_DEBUG', true);
define('FS_METHOD', 'direct');
define('WP_DEV', true);

/**
 * WordPress URLs
 */
define('WP_HOME', 'http://127.0.0.1:8000');
define('WP_SITEURL', 'http://127.0.0.1:8000/wp');

/**
 * Custom content directory
 */
define('WP_CONTENT_DIR', dirname( __FILE__ ) . '/wp-content');
define('WP_CONTENT_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/wp-content');
