<?php

namespace TubeBay\Api;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use TubeBay\Data\Entities\Channel;

class YouTubeController extends ApiController
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

        // Route to test YouTube Connection
        register_rest_route($namespace, '/youtube/test-connection', array(
            array(
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => array($this, 'test_connection'),
                'permission_callback' => array($this, 'get_item_permissions_check'),
            ),
        ));

        // Route to manually sync/refresh the library
        register_rest_route($namespace, '/youtube/sync-library', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'sync_library'),
                'permission_callback' => array($this, 'get_item_permissions_check'),
            ),
        ));

        // Route to manually sync the library returning only status
        register_rest_route($namespace, '/youtube/sync-library-status', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'sync_library_status'),
                'permission_callback' => array($this, 'get_item_permissions_check'),
            ),
        ));

        // Route to get cached videos
        register_rest_route($namespace, '/youtube/videos', array(
            array(
                'methods' => WP_REST_Server::READABLE,
                'callback' => array($this, 'get_videos'),
                'permission_callback' => array($this, 'get_item_permissions_check'),
            ),
        ));
    }

    public function test_connection($request)
    {
        $params = $request->get_params();
        $api_key = $params['api_key'];
        $channel_id = $params['channel_id'];

        tubebay_log("Testing connection for Channel ID: {$channel_id}", 'debug');

        $channel = new Channel(array(
            'api_key' => $api_key ? $api_key : '--',
            'channel_id' => $channel_id ? $channel_id : '--'
        ));

        if (!$channel->is_configured()) {
            tubebay_log('Connection test failed: API Key or Channel ID missing', 'error');
            return new \WP_Error('not_configured', __('API Key or Channel ID missing.', 'tubebay'), array('status' => 400));
        }

        $result = $channel->test_connection();

        if (is_wp_error($result)) {
            tubebay_log('Connection test failed: ' . $result->get_error_message(), 'error');
            return new \WP_Error('connection_failed', $result->get_error_message(), array('status' => 400));
        }

        tubebay_log("Connection test successful for channel: " . ($result['title'] ?? 'Unknown'), 'info');

        return new WP_REST_Response(array(
            'success' => true,
            'message' => __('Connection successful!', 'tubebay'),
            'channel_name' => $result['title'] ?? '',
            'channel_description' => $result['description'] ?? '',
        ), 200);
    }


    public function sync_library($request)
    {
        tubebay_log('Manual sync_library request received', 'debug');
        $channel = new Channel();

        if (!$channel->is_configured()) {
            tubebay_log('Sync failed: Channel not configured', 'error');
            return new \WP_Error('not_configured', __('API Key or Channel ID missing.', 'tubebay'), array('status' => 400));
        }

        // Force a refresh from the API bypassing transient caches
        $videos = $channel->get_latest_videos(true);

        if (is_wp_error($videos)) {
            \TubeBay\Helper\Settings::set('connection_status', 'failed');
            return new \WP_Error('sync_failed', $videos->get_error_message(), array('status' => 400));
        }

        \TubeBay\Helper\Settings::set('connection_status', 'connected');

        // Send back an array of the newly fetched videos
        $response_videos = [];
        foreach ($videos as $video) {
            $response_videos[] = $video->to_array();
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => __('Library synced successfully.', 'tubebay'),
            'videos' => $response_videos,
        ), 200);
    }

    public function sync_library_status($request)
    {
        tubebay_log('Manual sync_library_status request received', 'debug');
        $channel = new Channel();

        if (!$channel->is_configured()) {
            tubebay_log('Sync status failed: Channel not configured', 'error');
            return new \WP_Error('not_configured', __('API Key or Channel ID missing.', 'tubebay'), array('status' => 400));
        }

        // Force a refresh from the API bypassing transient caches
        $videos = $channel->get_latest_videos(true);

        if (is_wp_error($videos)) {
            \TubeBay\Helper\Settings::set('connection_status', 'failed');
            tubebay_log('Sync status failed during get_latest_videos: ' . $videos->get_error_message(), 'error');
            return new \WP_Error('sync_failed', $videos->get_error_message(), array('status' => 400));
        }

        \TubeBay\Helper\Settings::set('connection_status', 'connected');
        tubebay_log('Library sync_status successful, fetched ' . count($videos) . ' videos', 'info');

        \TubeBay\Helper\Settings::set('connection_status', 'connected');

        return new WP_REST_Response(array(
            'success' => true,
            'message' => __('Library synced successfully.', 'tubebay'),
            'last_sync_time' => \TubeBay\Helper\Settings::get_last_sync_time(),
        ), 200);
    }

    public function get_videos($request)
    {
        $channel = new Channel();

        if (!$channel->is_configured()) {
            return new WP_REST_Response(array('success' => true, 'videos' => []), 200);
        }

        $videos = $channel->get_latest_videos(false);

        if (is_wp_error($videos)) {
            return new \WP_Error('fetch_failed', $videos->get_error_message(), array('status' => 400));
        }

        $response_videos = [];
        foreach ($videos as $video) {
            $response_videos[] = $video->to_array();
        }

        return new WP_REST_Response(array(
            'success' => true,
            'videos' => $response_videos,
        ), 200);
    }
}
