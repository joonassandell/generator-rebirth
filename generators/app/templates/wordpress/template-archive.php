<?php
/*
 * Template Name: Archive (Latest news etc.)
 */
$context = Timber::get_context();
$post = Timber::query_post();
$context['posts'] = new Timber\PostQuery([
    'post_type' => 'post',
    'paged' => get_query_var('paged'),
]);
$context['heading'] = $post->post_title;

Timber::render('template-archive.twig', $context);
