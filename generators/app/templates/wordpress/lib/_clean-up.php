<?php
/* =======================================
 * Clean up
 * ======================================= */

namespace <%= appNameSpace %>\<%= appNamePascalize %>\CleanUp;

/**
 * Clean up wp_head()
 */
function head_cleanup() {
  add_filter('use_default_gallery_style', '__return_false');
  remove_action('wp_head', 'feed_links', 2);
  remove_action('wp_head', 'feed_links_extra', 3);
  remove_action('wp_head', 'rsd_link');
  remove_action('wp_head', 'wlwmanifest_link');
  remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
  remove_action('wp_head', 'wp_generator');
  remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
  remove_action('wp_head', 'print_emoji_detection_script', 7);
  remove_action('admin_print_scripts', 'print_emoji_detection_script');
  remove_action('wp_print_styles', 'print_emoji_styles');
  remove_action('admin_print_styles', 'print_emoji_styles');
  remove_filter('the_content_feed', 'wp_staticize_emoji');
  remove_filter('comment_text_rss', 'wp_staticize_emoji');
  remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
  unregister_taxonomy_for_object_type('post_tag', 'post');
}

add_action('init', __NAMESPACE__ . '\\head_cleanup');

/**
 * Remove unnecessary dashboard widgets
 */
function remove_dashboard_widgets() {
  remove_action('welcome_panel', 'wp_welcome_panel');
  remove_meta_box('dashboard_incoming_links', 'dashboard', 'normal');
  remove_meta_box('dashboard_plugins', 'dashboard', 'normal');
  remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
  remove_meta_box('dashboard_quick_press', 'dashboard', 'normal');
  remove_meta_box('dashboard_primary', 'dashboard', 'normal');
  remove_meta_box('dashboard_secondary', 'dashboard', 'normal');
}

add_action('admin_init', __NAMESPACE__ . '\\remove_dashboard_widgets');

/**
 * Disable XML-RPC
 */
add_filter('xmlrpc_enabled', '__return_false');

function disable_x_pingback($headers) {
    unset($headers['X-Pingback']);
    return $headers;
}

add_filter('wp_headers', __NAMESPACE__ . '\\disable_x_pingback');<% if (pluginWPML) { %>

/**
 * WPML
 */
if (!empty($GLOBALS['sitepress'])) {
  add_action('wp_head', function() {
    remove_action(
      current_filter(),
      array ($GLOBALS['sitepress'], 'meta_generator_tag')
    );
  }, 0);
}

define('ICL_DONT_LOAD_NAVIGATION_CSS', true);
define('ICL_DONT_LOAD_LANGUAGE_SELECTOR_CSS', true);
define('ICL_DONT_LOAD_LANGUAGES_JS', true);<% } %>
