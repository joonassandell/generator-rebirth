<?php
/* ============================================
 * Shortcode - Name
 * ============================================ */

namespace <%= appNameSpace %>\Shortcode\Name;

use <%= appNameSpace %>\Utility;

function name($atts, $content = null) {
  extract(shortcode_atts(array(
    'something' => '',
    'somethingElse' => null
  ), $atts));

  $return = '<div>';
    $return .= Utility\unwpautop($content);
  $return .= '</div>';

  return $return;
}

add_shortcode('name',  __NAMESPACE__ . '\\name');
