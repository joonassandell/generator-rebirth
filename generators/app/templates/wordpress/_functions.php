<?php
/* ========================================
 * Functions
 * ======================================== */

require_once locate_template('/lib/clean-up.php');
require_once locate_template('/lib/utility.php');

if (!class_exists('Timber') || !function_exists('acf')) {
    add_action('admin_notices', function() {
        echo '<div class="error"><p>Timber or ACF not activated. Make sure you activate
        the plugins in <a href="' . esc_url(admin_url('plugins.php')) . '">' .
        esc_url(admin_url('plugins.php')) . '</a></p></div>';
    });
    return;
}


/* ======
 * Setup application
 * ====== */

Timber::$dirname = array('components', 'partials', 'templates');

class App extends TimberSite {
    function __construct() {
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_shortcodes'));
        add_action('init', array($this, 'register_navs'));
        add_filter('timber_context', array($this, 'add_to_context'));
        add_action('wp_enqueue_scripts', array($this, 'scripts'), '1');
        $this->thumbnails();
        $this->acf_site_settings();
        parent::__construct();
    }

    /**
     * Timber context
     */
    function add_to_context($context) {
        $context['WP_DEV'] = defined('WP_DEV');
        $context['site'] = $this;
        $context['options'] = get_fields('option');
        $context['nav_primary'] = new TimberMenu('nav-primary');
        return $context;
    }

    /**
     * Custom post types and taxonomies
     * require_once locate_template('/lib/custom-post-types/cpt.php');
     */
    function register_post_types() {}

    /**
     * Shortcodes
     * require_once locate_template('/lib/shortcodes/name.php');
     */
    function register_shortcodes() {}

    /**
     * Make theme available for translation
     */
    function theme_language() {
        load_theme_textdomain('app', get_template_directory() . '/languages');
    }

    /**
     * Thumbnails
     *
     * 1. Landscape images
     * 2. Cropped default image sizes
     */
    function thumbnails() {
        add_theme_support('post-thumbnails');

        /* [1] */
        add_image_size('landscape_l', 1920, 960, true);
        add_image_size('landscape_m', 1280, 640, true);
        add_image_size('landscape_s', 640, 320, true);

        /* [2] */
        add_image_size('medium_crop', 320, 160, true);
        set_post_thumbnail_size(160, 160, array('center', 'center'));
    }

    /**
     * Scripts
     *
     * 1. Disable jQuery. Remove this if some plugin is dependent.
     */
    function scripts() {
        /**
         * [1]
         */
        wp_deregister_script('jquery');
        wp_register_script('jquery', '');
        wp_enqueue_script('jquery');
    }

    /**
     * Navigations
     */
    function register_navs() {
        register_nav_menus(array(
            'nav-primary' => 'Primary navigation',
        ));
    }

    /**
     * Sitewide settings page
     */
    function acf_site_settings() {
        if (function_exists('acf')) {
            acf_add_options_page(array(
                'page_title'  => __('Sitewide settings', 'app'),
                'menu_title'  => __('Sitewide settings', 'app'),
                'menu_slug'   => 'sitewide-settings',
                'capability'  => 'edit_posts',
                'redirect'    => false
            ));
        }
    }
}

new App();
