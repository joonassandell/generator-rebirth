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
 * Filter allowed block types
 */
add_filter('allowed_block_types', function($allowed_blocks) {
    return array(
        'core/code',
        'core/file',
        'core/embed',
        'core/heading',
        'core/image',
        'core/list',
        'core/paragraph',
        'core/pullquote',
        'core/shortcode',
        'core/separator',
        'core/quote',
        'core/video',
        'core-embed/twitter',
        'core-embed/facebook',
        'core-embed/instagram',
        'core-embed/youtube',
        'core-embed/vimeo',
        'core-embed/issuu',
        // 'acf/gutenberg_block_name',
    );
});

/**
 * Remove advanced metabox & h1 from heading settings
 */
add_action('admin_head', function() {
    echo '
        <style>
            .editor-block-inspector__advanced {
                display: none;
            }
            .components-button[aria-label="Heading 1"] {
                display: none;
            }
        </style>
    ';
});

/**
 * Remove colors
 */
add_action('after_setup_theme', function() {
    add_theme_support('editor-color-palette');
    add_theme_support('disable-custom-colors');
});

/**
 * Add custom blocks
 */
// add_action('acf/init', function() {
//     acf_register_block([
//         'name'            => 'gutenberg_block_name',
//         'title'           => __('Gutenberg block name', 'app'),
//         'description'     => __('Gutenberg block name', 'app'),
//         'render_callback' => 'gutenberg_block',
//         'category'        => 'common',
//         'icon'            => 'yes',
//         'keywords'        => ['list'],
//         'supports'        => ['align' => false]
//     ]);
// });

// function gutenberg_block($block, $content = '', $is_preview = false) {
//     $context = Timber::context();
//     $context['component_variable'] = get_field('component_field');
//     Timber::render(__DIR__  . '/../components/Component.twig', $context);
// }

/**
 * Add custom Gutenberg CSS
 */
add_action('enqueue_block_editor_assets', function() {
    wp_enqueue_style(
        'gutenberg_css',
        get_template_directory_uri() . '/build/assets/gutenberg.css',
    [], time());
});
