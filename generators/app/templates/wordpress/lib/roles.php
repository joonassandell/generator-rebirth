<?php
/* =======================================
 * Roles
 * ======================================= */

/* ======
 * Modify editor role
 * ====== */

add_action('init', function() {
    if (get_option('add_editor_custom_cap_once') != 'done') {
        $editor_role = get_role('editor');
        $editor_role->add_cap('edit_theme_options');
        update_option('add_editor_custom_cap_once', 'done');
    }
});

add_action('admin_menu', function() {
    if (!current_user_can('administrator')) {
        remove_menu_page('tools.php');
        remove_submenu_page('themes.php', 'themes.php');
        remove_submenu_page('themes.php', 'widgets.php');

        global $submenu;
        unset($submenu['themes.php'][6]);
    }
});

add_action('admin_init', function() {
    if (!current_user_can('administrator')) {
        global $pagenow;

        if ($pagenow == 'themes.php' || $pagenow == 'widgets.php'
            || $pagenow == 'customize.php') {
            wp_redirect(admin_url('/nav-menus.php'), 302);
            exit;
        }
    }
});
