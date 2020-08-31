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
            'add_new_item' => __('Add New Post Type', 'app'),
            'edit_item' => __('Edit Post Type', 'app'),
            'menu_name' => __('Post Types', 'app'),
            'name' => __('Post Type', 'app'),
            'new_item' => __('New Post Type', 'app'),
            'singular_name' => __('Post Type', 'app'),
            'view_item' => __('View Post Type', 'app'),
            'view_items' => __('View Post Types', 'app'),
        ],
        'menu_position' => 30,
        'public' => true,
        'rewrite' => ['slug' => 'cpt-slug'],
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
            'add_new_item' => __('Add New Taxonomy', 'app'),
            'edit_item' => __('Edit Taxonomy', 'app'),
            'menu_name' => __('Taxonomies', 'app'),
            'name' => __('Taxonomy', 'app'),
            'new_item' => __('New Taxonomy', 'app'),
            'singular_name' => __('Taxonomy', 'app'),
            'view_item' => __('View Taxonomy', 'app'),
            'view_items' => __('View Taxonomies', 'app'),
        ],
        'rewrite' => ['slug' => 'cpt-slug/taxonomy-slug'],
        'show_in_rest' => true,
    ];

    register_taxonomy('taxonomy_name', 'post_type_name', $args);
});
