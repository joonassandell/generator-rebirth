<?php
/* =======================================
 * Plugins
 * ======================================= */

include_once (ABSPATH . 'wp-admin/includes/plugin.php');

/**
 * Automatically activate required plugins
 */
foreach ([
    'timber-library/timber.php',
    'advanced-custom-fields-pro/acf.php',
    'sitepress-multilingual-cms/sitepress.php',
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
