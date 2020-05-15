<?php
/* =======================================
 * Plugins
 * ======================================= */

include_once (ABSPATH . 'wp-admin/includes/plugin.php');

/**
 * This ensures that Timber is loaded and available as a PHP class
 */
if (class_exists('Timber\Timber')) {
    $timber = new \Timber\Timber();
} else {
	add_action('admin_notices', function() {
            echo '<div class="error"><p>Timber not activated. Make sure you
            have installed composer dependencies.</p></div>';
		}
    );
}

/**
 * Automatically activate required plugins
 */
foreach ([
    'advanced-custom-fields-pro/acf.php',<% if (pluginWPML) { %>
    'sitepress-multilingual-cms/sitepress.php',<% } %>
] as $plugin) {
    if (!is_plugin_active($plugin)) {
        activate_plugin($plugin);

        add_action('admin_notices', function() use ($plugin) {
            echo '<div class="updated"><p>' . sprintf('<strong>%s</strong> plugin is required and auto-enabled by the current theme.', $plugin) . '</p></div>';
        });
    }
}

/**
 * Simple History: Reduce visibility
 */
add_filter('simple_history/view_history_capability', function($cap) {
    $cap = 'manage_options';
    return $cap;
});<% if (pluginWPML) { %>

/**
 * WPML: Remove metas and unneeded assets
 */
if (!empty($GLOBALS['sitepress'])) {
    add_action('wp_head', function() {
        remove_action(
            current_filter(),
            array ($GLOBALS['sitepress'], 'meta_generator_tag')
        );
    }, 0);

    define('ICL_DONT_LOAD_NAVIGATION_CSS', true);
    define('ICL_DONT_LOAD_LANGUAGE_SELECTOR_CSS', true);
    define('ICL_DONT_LOAD_LANGUAGES_JS', true);
}<% } %>
