<?php
/* ========================================
 * Cleaner walker for wp_nav_menu()
 * ========================================
 *
 * Original https://github.com/roots/soil/blob/master/modules/nav-walker.php
 *
 * @usage
 *   wp_nav_menu(array(
 *     'walker' => new NavWalker(array(
 *       'nav_item_class' => 'Component-navItem', // <li>
 *       'nav_link_item_class' => 'Component-linkItem', // <a>
 *       'nav_sub_item_class' => 'Component-subItem' // <ul>
 *     ));
 *   ));
 */

namespace <%= appNameSpace %>\Nav;

use <%= appNameSpace %>\Utils;

class NavWalker extends \Walker_Nav_Menu {
  private $cpt;
  private $archive;

  public $nav_item_class;
  public $nav_sub_item_class;
  public $nav_link_item_class;

  public function __construct() {
    add_filter('nav_menu_css_class', array($this, 'navItemClasses'), 10, 2);
    add_filter('nav_menu_link_attributes', array($this, 'navLinkClasses'), 10, 3);
    $cpt           = get_post_type();
    $this->cpt     = in_array($cpt, get_post_types(array('_builtin' => false)));
    $this->archive = get_post_type_archive_link($cpt);
    $arguments     = func_get_args();

    if(!empty($arguments)) {
      foreach($arguments[0] as $key => $property) {
        if(property_exists($this, $key)) {
          $this->{$key} = $property;
        }
      }
    }
  }

  public function display_element($element, &$children_elements, $max_depth, $depth = 0, $args, &$output) {

    $element->is_subitem = ((!empty($children_elements[$element->ID]) && (($depth + 1) < $max_depth || ($max_depth === 0))));

    if ($element->is_subitem) {
      foreach ($children_elements[$element->ID] as $child) {
        if ($child->current_item_parent || Utils\url_compare($this->archive, $child->url)) {
          $element->classes[] = 'is-active';
        }
      }
    }

    $output = str_replace(
      '<ul class="sub-menu">',
      '<span class="Navbar-trigger"><i class="Navbar-trigger-icon"></i></span>
       <ul class="' . $this->nav_sub_item_class . '">',
    $output);

    $element->is_active = (!empty($element->url) && strpos($this->archive, $element->url));

    if ($element->is_active) {
      $element->classes[] = 'is-active';
    }

    parent::display_element($element, $children_elements, $max_depth, $depth, $args, $output);
  }

  public function navLinkClasses($atts, $item, $args) {
    $atts['class'] = $this->nav_link_item_class;
    return $atts;
  }

  public function navItemClasses($classes, $item) {
    $slug = sanitize_title($item->title);

    if ($this->cpt) {
      $classes = str_replace('current_page_parent', '', $classes);

      if (Utils\url_compare($this->archive, $item->url)) {
        $classes[] = 'is-active';
      }
    }

    $classes = preg_replace('/(current(-menu-|[-_]page[-_])(item|parent|ancestor))/', 'is-active', $classes);
    $classes = preg_replace('/^((menu|page)[-_\w+]+)+/', '', $classes);

    $classes[] = $this->nav_item_class . ' ' . $this->nav_item_class . '--' . $slug;

    $classes = array_unique($classes);

    return array_filter($classes, function($element) {
      $element = trim($element);
      return !empty($element);
    });
  }
}

/**
 * Clean up wp_nav_menu_args and setup defaults
 *
 * Remove the id="" on nav menu items
 */
function nav_menu_args($args = '') {
  $nav_menu_args = [];

  if (!$args['items_wrap']) {
    $nav_menu_args['items_wrap'] = '<ul>%3$s</ul>';
  }

  if (!$args['walker']) {
    $nav_menu_args['walker'] = new NavWalker(array(
      'nav_item_class' => 'Navbar-item',
      'nav_sub_item_class' => 'Navbar-sub',
      'nav_link_item_class' => 'Navbar-link'
    ));
  }

  return array_merge($args, $nav_menu_args);
}

add_filter('wp_nav_menu_args', __NAMESPACE__ . '\\nav_menu_args');
add_filter('nav_menu_item_id', '__return_null');
