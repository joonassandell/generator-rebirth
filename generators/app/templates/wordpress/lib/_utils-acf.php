<?php
/* ========================================
 * Utilities for advanced custom fields
 * ======================================== */

namespace <%= appNameSpace %>\Utils\Acf;

/**
 * Get image url from an img array and fallback to some other thumnail image
 * Make sure the field is defined as an array.
 *
 * @param {Integer} $id ID of the post
 * @param {String} $field Custom field name. Make sure it's defined as array.
 * @param {String} $fallback Fallback custom field name
 * @param {String} $thumbnail Fallback thumbnail size name
 * @return {String} Image URL
 */
function get_field_image_url($id, $field, $fallback, $thumbnail) {
  return get_field($field) ? get_field($field)['url'] : wp_get_attachment_image_src(get_post_meta($id, $fallback, 1), $thumbnail)[0];
}

/**
 * Get sub field image url from an img array and fallback to some other thumnail image
 * Make sure the field is defined as an array.
 *
 * @param {String} $field Custom field name.
 * @param {String} $fallback Fallback custom field name
 * @param {String} $thumbnail Fallback thumbnail size name
 * @return {String} Image URL
 */
function get_sub_field_image_url($field, $fallback, $thumbnail) {
  return get_sub_field($field) ? get_sub_field($field)['url'] : get_sub_field($fallback)['sizes'][$thumbnail];
}
