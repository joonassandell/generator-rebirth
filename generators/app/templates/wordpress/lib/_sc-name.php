<?php
/* =======================================
 * Shoctcode Name
 * ======================================= */

namespace <%= appNameSpace %>\<%= appNamePascalize %>\Shortcode\ShortCodeName;

use <%= appNameSpace %>\<%= appNamePascalize %>\Utility;

function shortcode_name($atts, $content = null) {
  extract(shortcode_atts(array(
    'something' => '',
    'somethingElse' => null
  ), $atts));

  $return = '<div>';
    $return .= Utility\unwpautop($content);
  $return .= '</div>';

  return $return;
}

add_shortcode('shortcode_name',  __NAMESPACE__ . '\\shortcode_name');
