<?php

/**
 * Plugin Name:       TubeBay
 * Plugin URI:        wpanchorbay.com
 * Source URI:        https://github.com/dipta-sdd/tubebay
 * Description:       A modern WordPress plugin boilerplate with React/TypeScript admin UI, REST API, and modular PHP architecture.
 * Requires at least: 5.6
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Stable tag:        1.0.0
 * Author:            sankarsan
 * Author URI:        wpanchorbay.com
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tubebay
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

define('TUBEBAY_PATH', plugin_dir_path(__FILE__));
define('TUBEBAY_DIR', plugin_dir_path(__FILE__));
define('TUBEBAY_URL', plugin_dir_url(__FILE__));
define('TUBEBAY_VERSION', '1.0.0');
define('TUBEBAY_PLUGIN_NAME', 'tubebay');
define('TUBEBAY_TEXT_DOMAIN', 'tubebay');
define('TUBEBAY_OPTION_NAME', 'tubebay');
define('TUBEBAY_PLUGIN_BASENAME', plugin_basename(__FILE__));
define('TUBEBAY_DEV_MODE', true);

if (file_exists(TUBEBAY_PATH . 'vendor/autoload.php')) {
	require_once TUBEBAY_PATH . 'vendor/autoload.php';
}

require_once TUBEBAY_PATH . 'app/functions.php';

register_activation_hook(__FILE__, 'tubebay_activate');
register_deactivation_hook(__FILE__, 'tubebay_deactivate');
/**
 * Begins execution of the plugin.
 *
 * @since    1.0.0
 */
if (!function_exists('tubebay_run')) {
	function tubebay_run()
	{
		tubebay_log('Initializing TubeBay plugin...', 'info');
		$plugin = \TubeBay\Core\Plugin::get_instance();
		add_action('plugins_loaded', array($plugin, 'run'));
	}
}
tubebay_run();

/**
 * Plugin activation hook.
 *
 * @since    1.0.0
 */
function tubebay_activate()
{
	tubebay_log('TubeBay plugin activated', 'info');
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	\TubeBay\Core\Activator::activate();
}

/**
 * Plugin deactivation hook.
 *
 * @since    1.0.0
 */
function tubebay_deactivate()
{
	tubebay_log('TubeBay plugin deactivated', 'info');
	\TubeBay\Core\Deactivator::deactivate();
}
