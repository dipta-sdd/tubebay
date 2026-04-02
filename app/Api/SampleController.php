<?php
/**
 * SampleController class.
 *
 * Demonstrates how to create REST API endpoints in TubeBay.
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
use WP_REST_Server;

/**
 * A sample REST API controller demonstrating how to create endpoints.
 *
 * This controller serves as a starting point for building your own API endpoints.
 * It demonstrates a GET and POST endpoint with proper permission checks.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Api
 * @author     sankarsan <wpanchorbay@gmail.com>
 */
class SampleController extends ApiController {

	/**
	 * The single instance of the class.
	 *
	 * @var SampleController|null
	 * @since 1.0.0
	 */
	private static $instance = null;

	/**
	 * Gets an instance of this object.
	 *
	 * @static
	 * @access public
	 * @return SampleController
	 * @since 1.0.0
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register the routes for this controller.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function register_routes() {
		$namespace = $this->namespace . $this->version;

		// GET endpoint: Retrieve sample data.
		register_rest_route(
			$namespace,
			'/sample',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_sample_data' ),
					'permission_callback' => array( $this, 'get_item_permissions_check' ),
				),
			)
		);

		// POST endpoint: Create/update sample data.
		register_rest_route(
			$namespace,
			'/sample',
			array(
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => array( $this, 'update_sample_data' ),
					'permission_callback' => array( $this, 'update_item_permissions_check' ),
				),
			)
		);
	}

	/**
	 * Handle GET request for sample data.
	 *
	 * @param \WP_REST_Request $request Full data about the request.
	 * @return \WP_REST_Response
	 * @since 1.0.0
	 */
	public function get_sample_data( $request ) {
		$data = array(
			'message' => __( 'Hello from TubeBay!', 'tubebay' ),
			'version' => TUBEBAY_VERSION,
			'time'    => current_time( 'mysql' ),
		);

		return new WP_REST_Response( $data, 200 );
	}

	/**
	 * Handle POST request to update sample data.
	 *
	 * @since 1.0.0
	 * @param WP_REST_Request $request Full data about the request.
	 * @return WP_REST_Response
	 */
	public function update_sample_data( $request ) {
		$body    = $request->get_json_params();
		$message = isset( $body['message'] ) ? sanitize_text_field( $body['message'] ) : '';

		// Example: Save to options.
		update_option( TUBEBAY_OPTION_NAME . '_sample_message', $message );

		return new WP_REST_Response(
			array(
				'success' => true,
				'message' => $message,
			),
			200
		);
	}
}
