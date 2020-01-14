<?php
/*
 * Template Name: Archive
 */
$context = Timber::get_context();
$context['posts'] = Timber::get_posts(array(
    'numberposts' => -1,
    'post_type' => 'post',
));

Timber::render('template-archive.twig', $context);
