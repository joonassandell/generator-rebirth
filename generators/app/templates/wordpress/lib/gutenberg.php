<?php
/* =======================================
 * Gutenberg
 * ======================================= */

/**
 * Disable default Gutenberg block styles
 */
add_action('wp_print_styles', function() {
    wp_dequeue_style('wp-block-library');
}, 100);

/**
 * Gilter allowed block types
 */
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
