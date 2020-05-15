<?php
/* =======================================
 * Setup Theme Defaults
 * ======================================= */


/* ======
 * Basics
 * ====== */

add_action('after_setup_theme', function() {
    /**
     * Register navigations
     */
    register_nav_menus([
        'nav-primary' => 'Primary navigation',
    ]);

    /**
     * Add featured image support
     */
    add_theme_support('post-thumbnails');

    /**
     * Add additional images
     */
    add_image_size('landscape_l', 1920, 960, true);
    add_image_size('landscape_m', 1280, 720, true);
    add_image_size('landscape_s', 640, 360, true);
    add_image_size('landscape_xs', 384, 216, true);

    /**
     * Create cropped default image sizes
     */
    add_image_size('large_crop', 960, 960, true);
    set_post_thumbnail_size(168, 168, ['center', 'center']);

    /**
     * Make theme available for translation
     */
    load_theme_textdomain('<%= textDomain %>', get_template_directory() . '/languages');
});
