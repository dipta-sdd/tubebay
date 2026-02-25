<?php

/**
 * Fired when the user clicks "Delete" for the plugin.
 *
 * @since      1.0.0
 * @package    WPAB_Boilerplate
 */

// If uninstall not called from WordPress, then exit.
if (! defined('WP_UNINSTALL_PLUGIN')) {
	exit;
}

define('TUBEBAY_OPTION_NAME', 'tubebay');
define('TUBEBAY_TEXT_DOMAIN', 'tubebay');

tubebay_run_uninstall();

/**
 * The main controller function for the uninstallation process.
 *
 * @since 1.0.0
 */
function tubebay_run_uninstall()
{
	$options = get_option(TUBEBAY_OPTION_NAME);

	// Only proceed if user opted in to delete all data.
	if (! empty($options['advanced_deleteAllOnUninstall']) && true === $options['advanced_deleteAllOnUninstall']) {
		tubebay_drop_custom_tables();
		tubebay_delete_plugin_options();
		tubebay_remove_capabilities();
	}
}

/**
 * Drop Custom Database Tables.
 *
 * @since 1.0.0
 */
function tubebay_drop_custom_tables()
{
	global $wpdb;

	$tables = array(
		$wpdb->prefix . 'tubebay_items',
	);

	foreach ($tables as $table) {
		$wpdb->query("DROP TABLE IF EXISTS {$table}"); // phpcs:ignore
	}
}

/**
 * Delete Plugin Options.
 *
 * @since 1.0.0
 */
function tubebay_delete_plugin_options()
{
	delete_option(TUBEBAY_OPTION_NAME);
}

/**
 * Remove Custom Capabilities.
 *
 * @since 1.0.0
 */
function tubebay_remove_capabilities()
{
	$editable_roles = get_editable_roles();

	foreach ($editable_roles as $role_name => $role_info) {
		$role = get_role($role_name);
		if ($role && $role->has_cap('manage_tubebay')) {
			$role->remove_cap('manage_tubebay');
		}
	}
}
