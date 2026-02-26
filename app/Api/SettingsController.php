<?php

namespace TubeBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use TubeBay\Helper\Settings;

class SettingsController extends ApiController
{
    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function register_routes()
    {
        $namespace = $this->namespace . $this->version;

        register_rest_route($namespace, '/settings', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_settings'),
                'permission_callback' => array($this, 'get_item_permissions_check'),
            ),
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'update_settings'),
                'permission_callback' => array($this, 'update_item_permissions_check'),
            ),
        ));
    }

    public function get_settings($request)
    {
        $data = array(
            'api_key' => Settings::get_api_key(),
            'channel_id' => Settings::get_channel_id(),
            'channel_name' => Settings::get_channel_name(),
            'connection_status' => Settings::get_connection_status(),
            'cache_duration' => Settings::get('cache_duration', 12),
            'auto_sync' => Settings::get('auto_sync', true),
            'video_placement' => Settings::get('video_placement', 'below_gallery'),
        );

        return new WP_REST_Response($data, 200);
    }

    public function update_settings($request)
    {
        $body = $request->get_json_params();

        if (isset($body['api_key'])) {
            Settings::set('api_key', sanitize_text_field($body['api_key']));
        }

        if (isset($body['channel_id'])) {
            Settings::set('channel_id', sanitize_text_field($body['channel_id']));
        }

        if (isset($body['channel_name'])) {
            Settings::set('channel_name', sanitize_text_field($body['channel_name']));
        }

        if (isset($body['connection_status'])) {
            Settings::set('connection_status', sanitize_text_field($body['connection_status']));
        }

        if (isset($body['cache_duration'])) {
            Settings::set('cache_duration', absint($body['cache_duration']));
        }

        if (isset($body['auto_sync'])) {
            Settings::set('auto_sync', (bool) $body['auto_sync']);
            \TubeBay\Core\Cron::get_instance()->check_and_schedule();
        }

        if (isset($body['video_placement'])) {
            Settings::set('video_placement', sanitize_text_field($body['video_placement']));
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => __('Settings saved successfully.', 'tubebay'),
        ), 200);
    }
}
