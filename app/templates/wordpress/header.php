<!doctype html>
<html class="no-js" <?php language_attributes(); ?>>
  <head>
    <meta charset="utf-8">
    <title><?php wp_title('|', true, 'right'); ?></title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="msapplication-tap-highlight" content="no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <?php
      wp_head();
      if (defined('WP_DEV')) {
        get_template_part('partials/top');
      } else {
        get_template_part('dist/partials/top.dist');
      }
    ?>
  </head>
  <body>

    <!--[if lte IE 9]>
      <p class="IeFrame">Hi, you are using <strong>outdated browser</strong>. For a better experience keep your browser up to date. <a href="http://outdatedbrowser.com/">Check here for latest versions</a>, Thank you!</p>
    <![endif]-->
