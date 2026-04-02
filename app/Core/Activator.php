<?php

namespace TubeBay\Core;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

use TubeBay\Data\DbManager;
use TubeBay\Helper\Settings;

/**
 * Fired during plugin activation.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Core
 * @author     sankarsan <wpanchorbay@gmail.com>
 */
class Activator
{
	/**
	 * The main activation method.
	 *
	 * @since 1.0.0
	 * @access public
	 * @return void
	 */
	public static function activate()
	{
		tubebay_log('Running Activator sequence', 'info');

		tubebay_log('Activator: Setting default plugin options', 'debug');
		foreach (Settings::get_defaults() as $key => $value) {
			if (get_option(Settings::PREFIX . $key) === false) {
				Settings::set($key, $value);
			}
		}

		// Create custom database tables.
		tubebay_log('Activator: Creating custom database tables', 'debug');
		self::create_custom_tables();

		// Flush rewrite rules.
		tubebay_log('Activator: Flushing rewrite rules', 'debug');
		flush_rewrite_rules();

		// Secure the log directory.
		tubebay_log('Activator: Securing log directory', 'debug');
		self::secure_log_directory();

		// Add custom capabilities.
		tubebay_log('Activator: Adding custom plugin capabilities', 'debug');
		self::add_plugin_roles_and_capabilities();

		tubebay_log('Activator: Activation sequence complete', 'info');
	}

	/**
	 * Instantiates the DB Manager and creates the custom tables.
	 *
	 * @since 1.0.0
	 * @access private
	 * @return void
	 */
	private static function create_custom_tables()
	{
		DbManager::get_instance()->create_tables();
	}

	/**
	 * Secures the log directory by creating an .htaccess file and an index.php file.
	 *
	 * @since    1.0.0
	 * @access private
	 * @return void
	 */
	private static function secure_log_directory()
	{
		$upload_dir = wp_upload_dir();
		$log_dir = $upload_dir['basedir'] . '/' . TUBEBAY_TEXT_DOMAIN . '-logs/';

		if (!is_dir($log_dir)) {
			wp_mkdir_p($log_dir);
			tubebay_log('Activator: Created log directory at ' . $log_dir, 'debug');
		}

		$htaccess_file = $log_dir . '.htaccess';
		if (!file_exists($htaccess_file)) {
			$htaccess_content = "
			# Protect log files from direct access
			<Files *.log>
				Order allow,deny
				Deny from all
			</Files>
			";
			file_put_contents($htaccess_file, $htaccess_content); // phpcs:ignore
			tubebay_log('Activator: Created .htaccess to protect log directory', 'debug');
		}

		$index_file = $log_dir . 'index.php';
		if (!file_exists($index_file)) {
			$index_content = "<?php\n// Silence is golden.\n";
			file_put_contents($index_file, $index_content); // phpcs:ignore
			tubebay_log('Activator: Created index.php in log directory', 'debug');
		}
	}

	/**
	 * Adds custom roles and capabilities required by the plugin.
	 *
	 * @since 1.0.0
	 * @access private
	 * @static
	 */
	private static function add_plugin_roles_and_capabilities()
	{
		$custom_capability = 'manage_tubebay';

		$admin_role = get_role('administrator');
		if ($admin_role && !$admin_role->has_cap($custom_capability)) {
			$admin_role->add_cap($custom_capability);
			tubebay_log('Activator: Added capability ' . $custom_capability . ' to administrator role', 'info');
		} else {
			tubebay_log('Activator: Capability ' . $custom_capability . ' already exists on administrator role', 'debug');
		}
	}
}
