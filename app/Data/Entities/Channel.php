<?php

namespace TubeBay\Data\Entities;

use TubeBay\Helper\Settings;
use TubeBay\Data\Entities\Video;

class Channel
{
    private $api_key;
    private $channel_id;

    public function __construct($data = [])
    {
        $this->api_key = !empty($data['api_key']) ? $data['api_key'] : Settings::get_api_key();
        $this->channel_id = !empty($data['channel_id']) ? $data['channel_id'] : Settings::get_channel_id();
    }

    /**
     * Check if the API is correctly configured.
     */
    public function is_configured()
    {
        return !empty($this->api_key) && !empty($this->channel_id);
    }

    /**
     * Fetch and return the latest 50 videos from the channel.
     * Wraps around the transient cache.
     * 
     * @param bool $force_refresh
     * @return Video[]|\WP_Error
     */
    public function get_latest_videos($force_refresh = false)
    {
        if (!$this->is_configured()) {
            return new \WP_Error('not_configured', __('TubeBay API Key or Channel ID is missing.', 'tubebay'));
        }

        $transient_key = 'tubebay_videos_cache_' . $this->channel_id;

        if (!$force_refresh) {
            $cached = get_transient($transient_key);
            if ($cached !== false && is_array($cached)) {
                $videos = [];
                foreach ($cached as $v) {
                    $videos[] = new Video($v);
                }
                return $videos;
            }
        }

        // Need to fetch fresh data
        $videos = $this->fetch_videos_from_api();

        if (is_wp_error($videos)) {
            return $videos;
        }

        // Cache the raw array format
        $to_cache = [];
        foreach ($videos as $video) {
            $to_cache[] = $video->to_array();
        }

        set_transient($transient_key, $to_cache, Settings::get_cache_duration());

        return $videos;
    }

    /**
     * Perform the actual API call to YouTube.
     * Phase 1 format.
     * 
     * @return Video[]|\WP_Error
     */
    private function fetch_videos_from_api()
    {
        // 1. Get the uploads playlist ID
        $channel_url = add_query_arg([
            'id' => $this->channel_id,
            'part' => 'contentDetails',
            'key' => $this->api_key,
        ], 'https://www.googleapis.com/youtube/v3/channels');

        $channel_response = wp_remote_get($channel_url);

        if (is_wp_error($channel_response)) {
            return $channel_response;
        }

        $channel_body = json_decode(wp_remote_retrieve_body($channel_response), true);

        if (isset($channel_body['error'])) {
            return new \WP_Error('api_error', $channel_body['error']['message'] ?? 'Unknown API Error');
        }

        if (empty($channel_body['items'][0]['contentDetails']['relatedPlaylists']['uploads'])) {
            return new \WP_Error('no_uploads_playlist', __('Could not find the uploads playlist for this channel.', 'tubebay'));
        }

        $uploads_playlist_id = $channel_body['items'][0]['contentDetails']['relatedPlaylists']['uploads'];

        // 2. Get up to 50 videos from the uploads playlist
        $playlist_url = add_query_arg([
            'playlistId' => $uploads_playlist_id,
            'part' => 'snippet',
            'maxResults' => 50,
            'key' => $this->api_key,
        ], 'https://www.googleapis.com/youtube/v3/playlistItems');

        $playlist_response = wp_remote_get($playlist_url);

        if (is_wp_error($playlist_response)) {
            return $playlist_response;
        }

        $playlist_body = json_decode(wp_remote_retrieve_body($playlist_response), true);

        if (isset($playlist_body['error'])) {
            return new \WP_Error('api_error', $playlist_body['error']['message'] ?? 'Unknown API Error');
        }

        if (empty($playlist_body['items'])) {
            return [];
        }

        // 3. Map to Entity
        $videos = [];
        foreach ($playlist_body['items'] as $item) {
            $snippet = $item['snippet'];

            // Thumbnail selection
            $thumbnails = $snippet['thumbnails'] ?? [];
            $thumb_url = '';
            if (isset($thumbnails['maxres']['url'])) {
                $thumb_url = $thumbnails['maxres']['url'];
            } elseif (isset($thumbnails['high']['url'])) {
                $thumb_url = $thumbnails['high']['url'];
            } elseif (isset($thumbnails['medium']['url'])) {
                $thumb_url = $thumbnails['medium']['url'];
            } elseif (isset($thumbnails['default']['url'])) {
                $thumb_url = $thumbnails['default']['url'];
            }

            // Real video ID is stored in snippet.resourceId.videoId for playlistItems
            $videos[] = new Video([
                'id' => $snippet['resourceId']['videoId'] ?? '',
                'title' => $snippet['title'] ?? '',
                'thumbnail_url' => $thumb_url,
                'published_at' => $snippet['publishedAt'] ?? '',
                'description' => $snippet['description'] ?? '',
            ]);
        }

        return $videos;
    }

    /**
     * Fetch channel details (like title) from the API.
     * 
     * @return array|\WP_Error
     */
    public function get_channel_details()
    {
        if (!$this->is_configured()) {
            return new \WP_Error('not_configured', __('TubeBay API Key or Channel ID is missing.', 'tubebay'));
        }

        $transient_key = 'tubebay_channel_details_' . $this->channel_id;
        $cached = get_transient($transient_key);

        if ($cached !== false && is_array($cached)) {
            return $cached;
        }

        $channel_url = add_query_arg([
            'id' => $this->channel_id,
            'part' => 'snippet',
            'key' => $this->api_key,
        ], 'https://www.googleapis.com/youtube/v3/channels');

        $channel_response = wp_remote_get($channel_url);

        if (is_wp_error($channel_response)) {
            return $channel_response;
        }

        $channel_body = json_decode(wp_remote_retrieve_body($channel_response), true);

        if (isset($channel_body['error'])) {
            return new \WP_Error('api_error', $channel_body['error']['message'] ?? 'Unknown API Error');
        }

        if (empty($channel_body['items'][0]['snippet'])) {
            return new \WP_Error('api_error', __('Could not fetch channel details.', 'tubebay'));
        }

        $snippet = $channel_body['items'][0]['snippet'];

        $details = [
            'title' => $snippet['title'] ?? '',
            'description' => $snippet['description'] ?? '',
        ];

        set_transient($transient_key, $details, Settings::get_cache_duration());

        return $details;
    }
}
