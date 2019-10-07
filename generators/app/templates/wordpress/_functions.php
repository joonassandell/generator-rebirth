<?php
/* =======================================
 * Functions
 * ======================================= */

if (!class_exists('Timber') || !function_exists('acf')<% if (pluginWPML) { %> || empty($GLOBALS['sitepress'])<% } %>) {
    add_action('admin_notices', function() {
        echo '<div class="error"><p>Timber<% if (pluginWPML) { %>, ACF or WPML<% } else { %> or AFC<% } %> not activated. Make sure you activate
        the plugins in <a href="' . esc_url(admin_url('plugins.php')) . '">' .
        esc_url(admin_url('plugins.php')) . '</a></p></div>';
    });
    return;
}


/* ======
 * Setup application
 * ====== */

Timber::$dirname = array('containers', 'components', 'templates', 'partials');

class App extends TimberSite {
    function __construct() {
        add_action('init', array($this, 'register_post_types'));
        add_action('init', array($this, 'register_shortcodes'));
        add_filter('timber_context', array($this, 'add_to_context'));
        add_action('wp_enqueue_scripts', array($this, 'scripts'), '1');

        $this->setup();
        parent::__construct();
    }

    /**
     * Timber context
     */
    function add_to_context($context) {
        $context['WP_DEV'] = getenv('WORDPRESS_ENV') == 'development';
        $context['site'] = $this;
        $context['options'] = get_fields('option');

        $context['nav_primary'] = new TimberMenu('nav-primary');<% if (pluginWPML) { %>

        $context['lang'] = ICL_LANGUAGE_CODE;<% } %>

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
}

new App();
