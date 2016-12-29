<?php
/* ============================================
 * Setup
 * ============================================ */

namespace <%= appNameSpace %>\Setup;

/**
 * Options pages
 */
if(function_exists('acf_add_options_page')) {
  acf_add_options_page(array(
    'page_title'  => __('Global settings', 'app'),
    'menu_title'  => __('Global settings', 'app'),
    'menu_slug'   => 'global-settings',
    'capability'  => 'edit_posts',
    'redirect'    => false
  ));
}

/**
 * Register navigation menus
 */
function register_navs() {
  register_nav_menus(array(
    'nav-primary' => 'Primary navigation',
  ));
}

add_action('init', __NAMESPACE__ . '\\register_navs');<% if (pluginWPMLuserID) { %>

/**
 * Make theme available for translation
 */
function theme_language() {
  load_theme_textdomain('app', get_template_directory() . '/languages');
}

add_action('after_setup_theme', __NAMESPACE__ . '\\theme_language');<% } %>

/**
 * Thumbnails
 *
 * 1. Landscape images
 * 2. Cropped default image sizes
 */
add_theme_support('post-thumbnails');

/* [1]  */
add_image_size('landscape_l', 1920, 1280, true);
add_image_size('landscape_m', 1280, 960, true);
add_image_size('landscape_xs', 640, 320, true);
set_post_thumbnail_size(320, 180, true);

/* [2] */
add_image_size('medium_crop', 640, 640, true);

/**
 * Scripts
 */
function jquery() {
  wp_deregister_script('jquery');
  wp_register_script('jquery', '');
  wp_enqueue_script('jquery');
}

if (!is_admin()) {
  add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\jquery', 11);
}
