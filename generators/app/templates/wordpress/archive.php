<?php
$context = Timber::get_context();
$context['posts'] = new Timber\PostQuery();
$context['heading'] = __('Archive', 'app');
$templates = ['archive.twig', 'index.twig'];

if (is_day()) {
	$context['heading'] = __('Archive', 'app') . ' ' . get_the_date('D M Y');
} elseif (is_month()) {
	$context['heading'] = __('Archive', 'app') . ' ' . get_the_date('M Y');
} elseif (is_year()) {
	$context['heading'] = __('Archive', 'app') . ' ' . get_the_date('Y');
} elseif (is_tag()) {
	$context['heading'] = single_tag_title('', false);
} elseif (is_category()) {
	$context['heading'] = single_cat_title('', false);
	array_unshift($templates, 'archive-' . get_query_var('cat') . '.twig');
} elseif (is_post_type_archive()) {
	$context['heading'] = post_type_archive_title('', false);
	array_unshift($templates, 'archive-' . get_post_type() . '.twig');
}

Timber::render($templates, $context);
