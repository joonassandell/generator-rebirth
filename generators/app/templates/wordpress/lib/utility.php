<?php
/* ========================================
 * Utilities
 * ======================================== */

/**
 * Reverse wpautop
 */
function unwpautop($s) {
  $s = str_replace("\n", "", $s);
  $s = str_replace("<p>", "", $s);
  $s = str_replace(array("<br />", "<br>", "<br/>"), "\n", $s);
  $s = str_replace("</p>", "\n\n", $s);
  return $s;
}
