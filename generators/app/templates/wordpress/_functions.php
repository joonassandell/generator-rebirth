<?php
/* ========================================
 * Functions
 * ======================================== */

/**
 * Library
 * Clean up wordpress, modify navigation behavior etc.
 */
require_once locate_template('/lib/clean-up.php');
require_once locate_template('/lib/NavWalker.php');
require_once locate_template('/lib/utils.php');<% if (pluginACFkey) { %>
require_once locate_template('/lib/utils-acf.php');<% } %>

/**
 * Global setup, option pages etc.
 */
require_once locate_template('/lib/setup.php');

/**
 * Custom post types
 *
 * require_once locate_template('/lib/cpt-name.php');
 */

/**
 * Shortcodes
 *
 * require_once locate_template('/lib/sc-name.php');
 */
