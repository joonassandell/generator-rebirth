<?php
$context = Timber::get_context();
$search_query = get_search_query();
$results = new Timber\PostQuery([
    'post_type' => 'any',
    's' => $search_query,
]);
$context['search_query'] = $search_query;
$context['results'] = $results;

Timber::render('search.twig', $context);
?>
