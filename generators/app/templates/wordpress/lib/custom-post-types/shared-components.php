<?php
/* ==========================================
 * Shared Components
 * ========================================== */

call_user_func(function() {
    $args = array(
        'labels' => array(
            'name' => __('Shared Components', 'app'),
            'singular_name' => __('Shared Component', 'app'),
        ),
        'description' => 'Reusable components with content to use in multiple locations. Use with Flexible Layout and setup with ACF.',
        'has_archive' => false,
        'public' => true,
        'menu_position' => 30,
        'hierarchical' => false,
        'exclude_from_search' => true,
        'show_in_nav_menus' => false,
        'publicly_queryable' => false,
        'supports' => array(
            'title',
            'custom-fields',
            'revisions',
        ),
    );

    register_post_type('shared_components', $args);
});

call_user_func(function() {
    $args = array(
        'labels' => array(
            'name' => __('Component Types', 'app'),
            'singular_name' => __('Component Type', 'app'),
        ),
        'description' => 'Allowed component types. Setup with ACF.',
        'hierarchical' => true,
        'publicly_queryable' => false,
        'show_in_nav_menus' => false,
        'show_in_quick_edit' => false,
        'meta_box_cb' => false,
        'show_in_menu' => is_admin(),
    );

    register_taxonomy('component_type', 'shared_components', $args);
});
