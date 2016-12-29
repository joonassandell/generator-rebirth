<?php
/* ========================================
 * Utilities
 * ======================================== */

namespace <%= appNameSpace %>\Utils;

/**
 * Make a URL relative
 */
function root_relative_url($input) {
  $url = parse_url($input);
  if (!isset($url['host']) || !isset($url['path'])) {
    return $input;
  }
  $site_url = parse_url(network_site_url());  // falls back to site_url

  if (!isset($url['scheme'])) {
    $url['scheme'] = $site_url['scheme'];
  }
  $hosts_match = $site_url['host'] === $url['host'];
  $schemes_match = $site_url['scheme'] === $url['scheme'];
  $ports_exist = isset($site_url['port']) && isset($url['port']);
  $ports_match = ($ports_exist) ? $site_url['port'] === $url['port'] : true;

  if ($hosts_match && $schemes_match && $ports_match) {
    return wp_make_link_relative($input);
  }

  return $input;
}

/**
 * Compare URL against relative URL
 */
function url_compare($url, $rel) {
  $url = trailingslashit($url);
  $rel = trailingslashit($rel);
  return ((strcasecmp($url, $rel) === 0) || root_relative_url($url) == $rel);
}

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

/**
 * Show only sub menu
 * filter_hook function to react on sub_menu flag
 */
function show_submenu_only($sorted_menu_items, $args) {
  if (isset($args->sub_menu)) {
    $root_id = 0;

    /**
     * Find the current menu item
     */
    foreach ($sorted_menu_items as $menu_item) {
      if ($menu_item->current) {

        /**
         * Set the root id based on whether the current menu item has a parent or not
         */
        $root_id = ($menu_item->menu_item_parent) ? $menu_item->menu_item_parent : $menu_item->ID;
        break;
      }
    }

    /**
     * Find the top level parent
     */
    if (!isset($args->direct_parent)) {
      $prev_root_id = $root_id;

      while ($prev_root_id != 0) {
        foreach ($sorted_menu_items as $menu_item) {
          if ($menu_item->ID == $prev_root_id) {
            $prev_root_id = $menu_item->menu_item_parent;

            /**
             * Don't set the root_id to 0 if we've reached the top of the menu
             */
            if ($prev_root_id != 0) $root_id = $menu_item->menu_item_parent;
            break;
          }
        }
      }
    }

    $menu_item_parents = array();
    foreach ($sorted_menu_items as $key => $item) {

      /**
       * Init menu_item_parents
       */
      if ($item->ID == $root_id) $menu_item_parents[] = $item->ID;

      if (in_array($item->menu_item_parent, $menu_item_parents)) {

        /**
         * Part of sub-tree: keep!
         */
        $menu_item_parents[] = $item->ID;
      } else if (!(isset($args->sub_menu_show_parent) && in_array($item->ID, $menu_item_parents))) {

        /**
         * Not part of sub-tree: away with it!
         */
        unset($sorted_menu_items[$key]);
      }
    }

    return $sorted_menu_items;
  } else {
    return $sorted_menu_items;
  }
}

add_filter('wp_nav_menu_objects', __NAMESPACE__ . '\\show_submenu_only', 10, 2);
