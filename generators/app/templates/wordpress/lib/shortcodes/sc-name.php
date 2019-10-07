<?php
/* =======================================
 * Shortcode Name
 * ======================================= */

function shortcode_name($atts, $content = null) {
  extract(shortcode_atts(array(
    'something' => '',
    'somethingElse' => null
  ), $atts));

  $return = '<div>';
    $return .= unwpautop($content);
  $return .= '</div>';

  return $return;
}

add_shortcode('shortcode_name', 'shortcode_name');
