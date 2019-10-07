<?php
/* =======================================
 * Various plugin related tweaks
 * ======================================= */

/**
 * Simple History: Reduce visibility
 */
add_filter('simple_history/view_history_capability', function($cabability) {
    $capability = 'manage_options';
    return $capability;
});

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
}
