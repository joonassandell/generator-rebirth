<?php
/* =======================================
 * Post Type Name
 * ======================================= */

call_user_func(function() {
    $args = [
        'description' => 'Post type description.',
        'has_archive'  => true,
        'hierarchical' => false,
        'labels' => [
            'name' => __('Post types name', 'app'),
            'menu_name' => __('Post types name', 'app'),
            'singular_name' => __('Post type name', 'app'),
        ],
        'menu_position' => 30,
        'public' => true,
        'show_in_rest' => true,
        'supports' => [
            'author',
            'editor',
            'excerpt',
            'title',
            'thumbnail',
            'revisions'
        ],
    ];

    register_post_type('post_type_name', $args);
});

call_user_func(function() {
    $args = [
        'hierarchical' => true,
        'labels' => [
            'name' => __('Taxonomys name', 'app'),
            'menu_name' => __('Taxonomys name', 'app'),
            'singular_name' => __('Taxonomy name', 'app'),
        ],
        'rewrite' => ['slug' => 'name/taxonomy'],
    ];

    register_taxonomy('taxonomy_name', 'post_type_name', $args);
});
