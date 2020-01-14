<?php
/* =======================================
 * Advanced Custom Field Settings
 * ======================================= */

/**
 * Global settings page
 */
acf_add_options_page(array(
    'page_title'  => __('Global Settings', 'app'),
    'menu_title'  => __('Global Settings', 'app'),
    'menu_slug'   => 'global-settings',
    'capability'  => 'edit_posts',
    'redirect'    => false,
));

/**
 * Allow shortcodes in textareas
 */
add_filter('acf/format_value/type=textarea', 'do_shortcode');

/**
 * Modify Basic wysiwyg fields
 * https://www.tiny.cloud/docs-3x/reference/buttons/
 */
add_filter('acf/fields/wysiwyg/toolbars', function($toolbars) {
	$toolbars['Basic'] = array();
	$toolbars['Basic'][1] = array(
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'bullist',
        'numlist',
        'link',
        'undo',
        'redo',
        'wp_fullscreen',
        'formatselect',
    );

	return $toolbars;
});
