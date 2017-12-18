<?php
/* ========================================
 * Functions
 * ======================================== */

call_user_func(function() {
    if (!class_exists('Timber') || !function_exists('acf')) {
        add_action('admin_notices', function() {
            echo '<div class="error"><p>Timber or ACF not activated. Make sure you activate
            the plugins in <a href="' . esc_url( admin_url( 'plugins.php' )) . '">' .
            esc_url(admin_url('plugins.php')) . '</a></p></div>';
        });
        return;
    }
});


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
