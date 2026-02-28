<?php

namespace TubeBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use TubeBay\Core\Cron;
use TubeBay\Data\Entities\Channel;
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
        return new WP_REST_Response(Settings::get_all_settings(), 200);
    }

    public function update_settings($request)
    {
        $body = $request->get_json_params();
        $creds_changed = false;

        if (isset($body['api_key'])) {
            $old = Settings::get('api_key');
            $new = sanitize_text_field($body['api_key']);
            if ($old !== $new) {
                Settings::set('api_key', $new);
                $creds_changed = true;
            }
        }

        if (isset($body['channel_id'])) {
            $old = Settings::get('channel_id');
            $new = sanitize_text_field($body['channel_id']);
            if ($old !== $new) {
                Settings::set('channel_id', $new);
                $creds_changed = true;
            }
        }

        if ($creds_changed) {
            // Credentials changed — verify the new connection
            $channel = new Channel();

            if ($channel->is_configured()) {
                $result = $channel->test_connection();

                if (!is_wp_error($result)) {
                    Settings::set('channel_name', $result['title'] ?? '');
                    Settings::set('connection_status', 'connected');
                } else {
                    Settings::set('channel_name', '');
                    Settings::set('connection_status', 'failed');
                }
            } else {
                Settings::set('channel_name', '');
                Settings::set('connection_status', 'disconnected');
            }
        }

        if (isset($body['cache_duration'])) {
            Settings::set('cache_duration', absint($body['cache_duration']));
        }

        if (isset($body['auto_sync'])) {
            Settings::set('auto_sync', (bool) $body['auto_sync']);
            Cron::get_instance()->check_and_schedule();
        }

        if (isset($body['video_placement'])) {
            Settings::set('video_placement', sanitize_text_field($body['video_placement']));
        }

        if (!$creds_changed && isset($body['connection_status'])) {
            Settings::set('connection_status', sanitize_text_field($body['connection_status']));
        }


        return new WP_REST_Response(array(
            'success' => true,
            'data' => Settings::get_all_settings(),
            'message' => __('Settings saved successfully.', 'tubebay'),
        ), 200);
    }
}
