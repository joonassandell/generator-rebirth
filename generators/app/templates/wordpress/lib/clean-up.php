<?php
/* ========================================
 * Clean up
 * ======================================== */

/**
 * Clean up wp_head()
 */
add_action('init', function() {
    add_filter('use_default_gallery_style', '__return_false');
    add_filter('emoji_svg_url', '__return_false');
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);
    remove_action('wp_head', 'wp_oembed_add_host_js');
    remove_action('wp_head', 'rest_output_link_wp_head', 10);
    remove_action('rest_api_init', 'wp_oembed_register_route');
    remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    unregister_taxonomy_for_object_type('post_tag', 'post');
});

/**
 * Remove unnecessary dashboard widgets
 */
add_action('admin_init', function() {
    remove_action('welcome_panel', 'wp_welcome_panel');
    remove_meta_box('dashboard_incoming_links', 'dashboard', 'normal');
    remove_meta_box('dashboard_plugins', 'dashboard', 'normal');
    remove_meta_box('dashboard_quick_press', 'dashboard', 'normal');
    remove_meta_box('dashboard_primary', 'dashboard', 'normal');
    remove_meta_box('dashboard_secondary', 'dashboard', 'normal');
});

/**
 * Disable XML-RPC
 */
add_filter('xmlrpc_enabled', '__return_false');
add_filter('wp_headers', function($headers) {
    unset($headers['X-Pingback']);
    return $headers;
});

/**
 * Disable default Gutenberg block styles
 */
add_action('wp_print_styles', function() {
    wp_dequeue_style('wp-block-library');
}, 100);


/* ======
 * Disable Comments
 * ====== */

/**
 * Disable support for comments and trackbacks in post types
 */
add_action('admin_init', function() {
    $post_types = get_post_types();
	foreach ($post_types as $post_type) {
		if (post_type_supports($post_type, 'comments')) {
			remove_post_type_support($post_type, 'comments');
			remove_post_type_support($post_type, 'trackbacks');
		}
	}
});

/**
 * Close comments on the front-end
 */
add_filter('comments_open', function() { return false; }, 20, 2);
add_filter('pings_open', function() { return false; }, 20, 2);

/**
 * Hide existing comments
 */
add_filter('comments_array', function() {
	return array();
}, 10, 2);

/**
 * Remove comments page in menu
 */
add_action('admin_menu', function() {
    remove_menu_page('edit-comments.php');
});

/**
 * Redirect any user trying to access comments page
 */
add_action('admin_init', function() {
    global $pagenow;
	if ($pagenow === 'edit-comments.php') {
		wp_redirect(admin_url()); exit;
	}
});

/**
 * Remove comments metabox from dashboard
 */
add_action('admin_init', function() {
    remove_meta_box('dashboard_recent_comments', 'dashboard', 'normal');
});

/**
 * Remove comment menu from admin bar
 */
add_action('wp_before_admin_bar_render', function() {
    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('comments');
});

/**
 * Remove the latest comments from the Activity Dashboard widget
 */
add_action('admin_head-index.php', function() {
    print '<style>#latest-comments{ display:none; }</style>';
});


/* ======
 * Other
 * ====== */

/**
 * Remove <p></p> tags from category description
 */
remove_filter('term_description','wpautop');

/**
 * Move jQuery to footer
 */
add_action('wp_enqueue_scripts', function() {
    wp_scripts()->add_data('jquery', 'group', 1);
    wp_scripts()->add_data('jquery-core', 'group', 1);
    wp_scripts()->add_data('jquery-migrate', 'group', 1);

    /**
     * Alternatively disable jQuery
     */
    // wp_deregister_script('jquery');
    // wp_register_script('jquery', '');
    // wp_enqueue_script('jquery');
});

/**
 * Remove wp-embed.js
 */
add_action('wp_footer', function() {
    wp_deregister_script('wp-embed');
});

/**
 * Tweak admin menu so that wider custom post type names stay in a single line
 */
add_action('admin_head', function() {
    echo '
        <style>
            .wp-menu-name {
                max-width: 74%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                word-wrap: normal;
            }
        </style>
    ';
});
