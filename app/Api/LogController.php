<?php
/**
 * LogController class.
 *
 * Handles API endpoints for retrieving plugin logs.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Api
 */

namespace TubeBay\Api;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

/**
 * LogController class.
 *
 * @since 1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Api
 * @author     sankarsan <wpanchorbay@gmail.com>
 */
class LogController extends ApiController {

	/**
	 * Route base.
	 *
	 * @var string
	 * @since 1.0.0
	 */
	protected $rest_base = 'logs';

	/**
	 * Instance of this class.
	 *
	 * @var LogController|null
	 * @since 1.0.0
	 */
	protected static $instance = null;

	/**
	 * Get instance of this class.
	 *
	 * @return LogController
	 * @since 1.0.0
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register the routes for the objects of the controller.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function register_routes() {
		tubebay_log( 'Registering routes for LogController', 'info' );

		$namespace = $this->namespace . $this->version;

		// GET endpoint: Retrieve sample data.
		register_rest_route(
			$namespace,
			'/logs',
			array(
				array(
					'methods'             => \WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_items' ),
					'permission_callback' => array( $this, 'get_items_permissions_check' ),
				),
			)
		);

		// POST endpoint: Create/update sample data.
		register_rest_route(
			$namespace,
			'/logs',
			array(
				array(
					'methods'             => \WP_REST_Server::DELETABLE,
					'callback'            => array( $this, 'delete_items' ),
					'permission_callback' => array( $this, 'update_items_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Check if a given request has access to get items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool True if permitted, false otherwise.
	 * @since 1.0.0
	 */
	public function get_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Check if a given request has access to delete items.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return bool True if permitted, false otherwise.
	 * @since 1.0.0
	 */
	public function update_items_permissions_check( $request ) {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get logs from file.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 * @since 1.0.0
	 */
	public function get_items( $request ) {
		tubebay_log( 'LogController: Handling GET /logs request', 'debug' );
		$upload_dir = wp_upload_dir();
		$log_dir    = $upload_dir['basedir'] . '/' . TUBEBAY_TEXT_DOMAIN . '-logs/';

		// Find the most recent log file.
		$files = glob( $log_dir . 'plugin-log-*.log' );
		if ( empty( $files ) ) {
			tubebay_log( 'LogController: No log files found in ' . $log_dir, 'debug' );
			return rest_ensure_response( array( 'content' => '' ) );
		}

		// Sort by name desc (dates will sort correctly).
		rsort( $files );
		$log_file = $files[0];

		if ( ! file_exists( $log_file ) ) {
			tubebay_log( 'LogController: Most recent log file does not exist: ' . $log_file, 'debug' );
			return rest_ensure_response( array( 'content' => '' ) );
		}

		tubebay_log( 'LogController: Returning content from log file: ' . basename( $log_file ), 'debug' );
		$content = file_get_contents( $log_file ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
		return rest_ensure_response( array( 'content' => $content ) );
	}

	/**
	 * Clear logs.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response|\WP_Error
	 * @since 1.0.0
	 */
	public function delete_items( $request ) {
		tubebay_log( 'LogController: Handling DELETE /logs request — clearing all log files', 'info' );
		$upload_dir = wp_upload_dir();
		$log_dir    = $upload_dir['basedir'] . '/' . TUBEBAY_TEXT_DOMAIN . '-logs/';

		// Delete all log files.
		$files = glob( $log_dir . 'plugin-log-*.log' );
		if ( $files ) {
			foreach ( $files as $file ) {
				if ( file_exists( $file ) ) {
					wp_delete_file( $file );
					tubebay_log( 'LogController: Deleted log file: ' . basename( $file ), 'debug' );
				}
			}
		} else {
			tubebay_log( 'LogController: No log files found to delete', 'debug' );
		}

		tubebay_log( 'LogController: Log clear complete', 'info' );
		return rest_ensure_response( array( 'success' => true ) );
	}
}
