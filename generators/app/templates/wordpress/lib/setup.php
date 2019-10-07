<?php
/* =======================================
 * Setup Theme Defaults
 * ======================================= */


/* ======
 * Various
 * ====== */

add_action('after_setup_theme', function() {
    /**
     * Register navigations
     */
    register_nav_menus(array(
        'nav-primary' => 'Primary navigation',
    ));

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
    set_post_thumbnail_size(168, 168, array('center', 'center'));

    /**
     * Make theme available for translation
     */
    load_theme_textdomain('app', get_template_directory() . '/languages');
});


/* ======
 * Gutenberg
 * ====== */

add_filter('allowed_block_types', function($allowed_blocks) {
    return array(
        'core/image',
        'core/paragraph',
        'core/heading',
        'core/list',
        'core/quote',
        'core/file',
        'core/separator',
        'core/shortcode',
        'core/embed',
        'core-embed/twitter',
        'core-embed/facebook',
        'core-embed/instagram',
        'core-embed/youtube',
        'core-embed/vimeo',
        'core-embed/issuu',
    );
});

/**
 * Remove advanced metabox.
 */
add_action('admin_head', function() {
    echo '
        <style>
            .editor-block-inspector__advanced {
                display: none;
            }
        </style>
    ';
});

/**
 * Remove colors from Gutenberg
 */
add_action('after_setup_theme', function() {
    add_theme_support('editor-color-palette');
    add_theme_support('disable-custom-colors');
});


/* ======
 * Various
 * ====== */

/**
 * Mark post type parent as active item in Wordpress Navigation.
 * https://gist.github.com/markhowellsmead/5aeb12903281f196af9678dc1cf87e20
 */
add_action('nav_menu_css_class', function($classes, $item) {
    $post = get_queried_object();

	if (isset($post->post_type)) {
		if ($post->post_type == 'post') {
			$current_post_type_slug = get_permalink(get_option('page_for_posts'));
		} else {
			$current_post_type = get_post_type_object(get_post_type($post->ID));
			$current_post_type_slug = $current_post_type->rewrite['slug'];
		}

		$menu_slug = strtolower(trim($item->url));

		if ($current_post_type_slug && strpos($menu_slug, $current_post_type_slug) !== false) {
			$classes[] = 'is-active';
		}
    }

	return $classes;
}, 10, 2);
