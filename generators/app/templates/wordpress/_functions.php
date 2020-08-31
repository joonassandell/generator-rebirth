<?php
/* =======================================
 * Functions
 * ======================================= */

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/lib/plugins.php';
require_once __DIR__ . '/lib/utility.php';
if (!class_exists('Timber') || !class_exists('ACF')) return;

Timber::$dirname = ['containers', 'components', 'partials', 'templates'];

class App extends TimberSite {
    function __construct() {
        $this->setup();
        add_action('init', [$this, 'register_post_types']);
        add_action('init', [$this, 'register_shortcodes']);
        add_filter('timber_context', [$this, 'add_to_context']);
        add_filter('timber/twig', [$this, 'add_to_twig']);
        add_action('wp_enqueue_scripts', [$this, 'scripts'], '1');
        // add_action('pre_get_posts', [$this, 'cpt_archive_pagination'], 1);
        parent::__construct();
    }


    /* ======
     * Basics
     * ====== */

    function setup() {
        require_once locate_template('/lib/acf.php');
        require_once locate_template('/lib/clean-up.php');
        require_once locate_template('/lib/gutenberg.php');
        require_once locate_template('/lib/roles.php');
        require_once locate_template('/lib/setup.php');
    }

    function add_to_context($context) {
        $context['WP_DEV'] = getenv('WORDPRESS_ENV') == 'development';
        $context['lang'] = !empty($GLOBALS['sitepress']) ? ICL_LANGUAGE_CODE : get_locale();
        $context['nav_primary'] = new TimberMenu('nav-primary');
        $context['options'] = get_fields('option');
        $context['site'] = $this;

        return $context;
    }

    function register_post_types() {
       require_once locate_template('/lib/custom-post-types/shared-components.php');
    }

    function register_shortcodes() {
        // require_once locate_template('/lib/shortcodes/name.php');
    }


    /* ======
     * Extend Twig
     * ====== */

    function add_to_twig($twig) {
        $twig->addFunction(new Timber\Twig_Function('display_template_file', [$this, 'display_template_file']));
        $twig->addFunction(new Timber\Twig_Function('get_posts', [$this, 'get_posts']));
        $twig->addFunction(new Timber\Twig_Function('get_terms', [$this, 'get_terms']));
        class_exists('HelloNico\Twig') && $twig->addExtension(new HelloNico\Twig\DumpExtension());
        return $twig;
    }

    function display_template_file() {
        if (getenv('WORDPRESS_ENV') == 'development') {
            global $template;
            $parts = explode('/', $template);
            $file = end($parts);
            return '<small>Current template: ' . $file . '</small>';
        }
    }

    function get_posts($post_type = 'post', $posts_per_page = 10,
        $addKeysFromValue = null, $additionalArgs = []) {
        $posts = Timber::get_posts(array_merge([
            'post_type' => $post_type,
            'posts_per_page' => $posts_per_page,
        ], $additionalArgs));

        if (is_array($addKeysFromValue)) {
            $newPosts = [];
            foreach ($posts as $key => $post) {
                foreach ($addKeysFromValue as $newKey => $fromKey) {
                    $post->$newKey = $post->$fromKey;
                }
                $newPosts[$key] = $post;
            }
            return $newPosts;
        }

        return $posts;
    }

    function get_terms($taxonomy = 'categories', $addKeysFromValue = null, $additionalArgs = []) {
        $terms = Timber::get_terms(array_merge([
            'taxonomy' => $taxonomy,
            'hide_empty' => false,
        ], $additionalArgs));

        $queried_object = get_queried_object();

        if ($queried_object) {
            foreach ($terms as $term) {
                if ($term->id == $queried_object->term_id) {
                    $term->active = true;
                }
            }
        }

        if (is_array($addKeysFromValue)) {
            $newTerms = [];
            foreach ($terms as $key => $term) {
                foreach ($addKeysFromValue as $newKey => $fromKey) {
                    $term->$newKey = $term->$fromKey;
                }
                $newTerms[$key] = $term;
            }
            return $newTerms;
        }

        return $terms;
    }


    /* ======
     * Various
     * ====== */

    function cpt_archive_pagination($query) {
        $main_query = $query->is_main_query() && !is_admin();

        if ($main_query && is_post_type_archive('post_type_name')) {
            $query->set('posts_per_page', 2);
            $query->set('paged', get_query_var('paged'));
        }
    }
}

new App();
