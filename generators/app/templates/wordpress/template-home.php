<?php
/*
 * Template Name: Home
 * Description: A Page template for Homepage
 */
$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;

Timber::render('home.twig', $context);
