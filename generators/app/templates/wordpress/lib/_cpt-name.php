<?php
/* =======================================
 * Post Type Name
 * ======================================= */

namespace <%= appNameSpace %>\<%= appNamePascalize %>\CustomPostType\PostTypeName;

call_user_func(function() {
    $args = array(
        'labels' => array(
            'name' => __('Post Type Name', 'app'),
            'singular_name' => __('Post Type Singular Name', 'app'),
        ),
        'description' => 'Post type description',
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
}});

call_user_func(function() {
    $args = array(
        'labels' => array(
            'name' => __('Taxonomy Name', 'app'),
            'singular_name' => __('Taxonomy Singular Name', 'app'),
        ),
        'hierarchical' => true,
        'rewrite' => array('slug' => 'name/taxonomy'),
    );

    register_taxonomy('taxonomy_name', 'post_type_name', $args);
});
