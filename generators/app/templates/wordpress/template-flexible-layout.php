<?php
/*
 * Template Name: Flexible Layout
 */
$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

Timber::render('template-flexible-layout.twig', $context);
