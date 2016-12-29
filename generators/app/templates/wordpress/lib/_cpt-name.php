<?php
/* ============================================
 * Custom post type - Name
 * ============================================ */

namespace <%= appNameSpace %>\CustomPostType\Name;

function cpt_name() {
  $labels = array(
    'name'               => 'Name', 'post type general name',
    'all_items'          => 'All name',
    'menu_name'          => 'Name'
  );

  $args = array(
    'labels'        => $labels,
    'description'   => 'Description',
    'public'        => true,
    'menu_position' => 30,
    'hierarchical'  => false,
    'supports'      => array(
      'title',
      'editor',
      'author',
      'thumbnail',
      'excerpt',
      'custom-fields',
      'revisions'
    ),
    'has_archive'   => true
  );

  register_post_type('name', $args);
}

add_action('init', __NAMESPACE__ . '\\cpt_name');

function taxonomy_name() {
  $labels = array(
    'name'          => 'Name taxonomies',
    'singular_name' => 'Name taxonomy'
  );

  $args = array(
    'labels' => $labels,
    'hierarchical' => true,
    'rewrite' => array('slug' => 'name/taxonomy')
  );

  register_taxonomy('name_taxonomy', 'name', $args);
}

add_action('init', __NAMESPACE__ . '\\taxonomy_name', 0);
