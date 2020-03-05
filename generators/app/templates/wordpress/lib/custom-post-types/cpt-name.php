<?php
/* =======================================
 * Post Type Name
 * ======================================= */

call_user_func(function() {
    $args = array(
        'labels' => array(
            'name' => __('Post types name', 'app'),
            'menu_name' => __('Post types name', 'app'),
            'singular_name' => __('Post type name', 'app'),
        ),
        'description' => 'Post type description.',
        'public' => true,
        'menu_position' => 30,
        'hierarchical' => false,
        'supports' => array(
            'author',
            'editor',
            'excerpt',
            'title',
            'thumbnail',
            'revisions'
        ),
        'has_archive'  => true,
    );

    register_post_type('post_type_name', $args);
});

call_user_func(function() {
    $args = array(
        'labels' => array(
            'name' => __('Taxonomys name', 'app'),
            'menu_name' => __('Taxonomys name', 'app'),
            'singular_name' => __('Taxonomy name', 'app'),
        ),
        'hierarchical' => true,
        'rewrite' => array('slug' => 'name/taxonomy'),
    );

    register_taxonomy('taxonomy_name', 'post_type_name', $args);
});
