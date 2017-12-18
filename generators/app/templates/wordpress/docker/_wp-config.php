<?php
/* ========================================
 * The base configuration for WordPress
 * ========================================
 *
 * https://github.com/WordPress/WordPress/blob/master/wp-config-sample.php
 */

/**
 * Load database info and local development parameters
 */
if (file_exists(dirname( __FILE__ ) . '/wp-config.development.php')) {
  include(dirname( __FILE__ ) . '/wp-config.development.php');
} else {
  /**
   * Database connection
   */
  define('DB_NAME', 'database_name_here');
  define('DB_USER', 'database_user_here');
  define('DB_PASSWORD', 'database_password_here');
  define('DB_HOST', 'localhost');

  /**
   * WordPress URLs
   */
  define('WP_HOME', '<%= appURL %>');
  define('WP_SITEURL', '<%= appURL %>/wp');

  /**
   * Custom content directory
   */
  define('WP_CONTENT_DIR', dirname(__FILE__) . '/wp-content');
  define('WP_CONTENT_URL', 'http://' . $_SERVER['HTTP_HOST'] . '/wp-content');

  /**
   * Random settings
   */
  define('WP_DEBUG_DISPLAY', false);
  ini_set('display_errors', 0);
}

/**
 * Table prefix
 * Change this if you have multiple installs in the same database
 */
$table_prefix  = 'wp_';

/**
 * If we're behind a proxy server and using HTTPS, we need to alert Wordpress of that fact
 * see also http://codex.wordpress.org/Administration_Over_SSL#Using_a_Reverse_Proxy
 */
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
  $_SERVER['HTTPS'] = 'on';
}

/**
 * Bootstrap WordPress
 */
if (!defined('ABSPATH'))
  define( 'ABSPATH', dirname( __FILE__ ) . '/wp/' );
require_once( ABSPATH . 'wp-settings.php' );
