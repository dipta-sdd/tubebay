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
                'methods' => WP_REST_Server::READABLE,
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
    }

    public function test_connection($request)
    {
        $channel = new Channel();

        if (!$channel->is_configured()) {
            return new \WP_Error('not_configured', __('API Key or Channel ID missing.', 'tubebay'), array('status' => 400));
        }

        // Force a false cache flag to prove the connection works live
        $videos = $channel->get_latest_videos(true);

        if (is_wp_error($videos)) {
            return new \WP_Error('connection_failed', $videos->get_error_message(), array('status' => 400));
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => __('Connection successful! Found ' . count($videos) . ' videos.', 'tubebay'),
        ), 200);
    }

    public function sync_library($request)
    {
        $channel = new Channel();

        if (!$channel->is_configured()) {
            return new \WP_Error('not_configured', __('API Key or Channel ID missing.', 'tubebay'), array('status' => 400));
        }

        // Force a refresh from the API bypassing transient caches
        $videos = $channel->get_latest_videos(true);

        if (is_wp_error($videos)) {
            return new \WP_Error('sync_failed', $videos->get_error_message(), array('status' => 400));
        }

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
}
