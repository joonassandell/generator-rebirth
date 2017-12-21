<?php
/*
 * Template Name: Homepage
 * Description: A Page template for Homepage
 */
$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

Timber::render(array('template-home.twig'), $context);
