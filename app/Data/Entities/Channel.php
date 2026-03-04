<?php

namespace TubeBay\Data\Entities;

use TubeBay\Helper\Settings;
use TubeBay\Data\Entities\Video;

/**
 * Channel class.
 *
 * Handles YouTube channel-related data operations.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Data/Entities
 */
class Channel
{
    /**
     * YouTube API key.
     *
     * @var string
     */
    private $api_key;

    /**
     * YouTube channel ID.
     *
     * @var string
     */
    private $channel_id;

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data to initialize the channel.
     *
     *     @type string $api_key    YouTube API key.
     *     @type string $channel_id YouTube channel ID.
     * }
     */
    public function __construct($data = [])
    {
        $this->api_key = !empty($data['api_key']) ? $data['api_key'] : Settings::get_api_key();
        $this->channel_id = !empty($data['channel_id']) ? $data['channel_id'] : Settings::get_channel_id();
    }

    /**
     * Check if the API is correctly configured.
     *
     * @return bool True if configured, false otherwise.
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
                tubebay_log('get_latest_videos: Returning cached videos', 'debug');
                $videos = [];
                foreach ($cached as $v) {
                    $videos[] = new Video($v);
                }
                return $videos;
            }
        }

        tubebay_log('get_latest_videos: Fetching fresh videos from API', 'info');
        // Need to fetch fresh data
        $videos = $this->fetch_videos_from_api();

        if (is_wp_error($videos)) {
            tubebay_log('get_latest_videos: Failed to fetch videos - ' . $videos->get_error_message(), 'error');
            return $videos;
        }

        // Cache the raw array format
        $to_cache = [];
        foreach ($videos as $video) {
            $to_cache[] = $video->to_array();
        }

        set_transient($transient_key, $to_cache, Settings::get_cache_duration());
        Settings::set_last_sync_time(time());

        return $videos;
    }

    /**
     * Perform the actual API call to YouTube.
     * Phase 1 format.
     *
     * @return Video[]|\WP_Error Array of Video objects or a WP_Error on failure.
     */
    private function fetch_videos_from_api()
    {
        // 1. Get the uploads playlist ID
        tubebay_log('fetch_videos_from_api: Requesting channel details for uploads playlist', 'debug');
        $channel_url = add_query_arg([
            'id' => $this->channel_id,
            'part' => 'snippet,contentDetails',
            'key' => $this->api_key,
        ], 'https://www.googleapis.com/youtube/v3/channels');

        $channel_response = wp_remote_get($channel_url);

        if (is_wp_error($channel_response)) {
            tubebay_log('fetch_videos_from_api: Network error fetching channel details - ' . $channel_response->get_error_message(), 'error');
            return $channel_response;
        }

        $channel_body = json_decode(wp_remote_retrieve_body($channel_response), true);

        if (isset($channel_body['error'])) {
            tubebay_log('fetch_videos_from_api: API error fetching channel details - ' . ($channel_body['error']['message'] ?? 'Unknown Error'), 'error');
            return new \WP_Error('api_error', $channel_body['error']['message'] ?? 'Unknown API Error');
        }

        if (empty($channel_body['items'][0]['contentDetails']['relatedPlaylists']['uploads'])) {
            tubebay_log('fetch_videos_from_api: No uploads playlist found', 'error');
            return new \WP_Error('no_uploads_playlist', __('Could not find the uploads playlist for this channel.', 'tubebay'));
        }

        $channel_data = $channel_body['items'][0];
        $uploads_playlist_id = $channel_data['contentDetails']['relatedPlaylists']['uploads'];

        // Sync channel snippet info
        if (!empty($channel_data['snippet'])) {
            $snippet = $channel_data['snippet'];
            Settings::set('channel_name', $snippet['title'] ?? '');
            Settings::set('thumbnails_default', $snippet['thumbnails']['default']['url'] ?? '');
            Settings::set('thumbnails_medium', $snippet['thumbnails']['medium']['url'] ?? '');
            tubebay_log('fetch_videos_from_api: Synced channel details: ' . ($snippet['title'] ?? 'no title'), 'debug');
        }

        // 2. Get up to 50 videos from the uploads playlist
        tubebay_log("fetch_videos_from_api: Fetching videos from playlist {$uploads_playlist_id}", 'debug');
        $playlist_url = add_query_arg([
            'playlistId' => $uploads_playlist_id,
            'part' => 'snippet',
            'maxResults' => 50,
            'key' => $this->api_key,
        ], 'https://www.googleapis.com/youtube/v3/playlistItems');

        $playlist_response = wp_remote_get($playlist_url);

        if (is_wp_error($playlist_response)) {
            tubebay_log('fetch_videos_from_api: Network error fetching playlist items - ' . $playlist_response->get_error_message(), 'error');
            return $playlist_response;
        }

        $playlist_body = json_decode(wp_remote_retrieve_body($playlist_response), true);

        if (isset($playlist_body['error'])) {
            tubebay_log('fetch_videos_from_api: API error fetching playlist items - ' . ($playlist_body['error']['message'] ?? 'Unknown Error'), 'error');
            return new \WP_Error('api_error', $playlist_body['error']['message'] ?? 'Unknown API Error');
        }

        if (empty($playlist_body['items'])) {
            tubebay_log('fetch_videos_from_api: Playlist is empty', 'info');
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
     * Search and sort videos using the YouTube Search API.
     * Supports pagination via pageToken.
     *
     * @param string $query       Search term.
     * @param string $sort        Sorting order ('date_desc', 'date_asc', 'title_asc', 'title_desc', 'view_count').
     * @param string $page_token  Next page token.
     * @param int    $limit       Max results per request (1-50).
     * @return array|\WP_Error    Array with 'videos' (Video[]) and 'next_page_token' (string|null).
     */
    public function search_videos($query = '', $sort = 'date_desc', $page_token = '', $limit = 50)
    {
        if (!$this->is_configured()) {
            return new \WP_Error('not_configured', __('TubeBay API Key or Channel ID is missing.', 'tubebay'));
        }

        // Map our internal sort keys to YouTube API 'order'
        $order = 'date'; // Default: Resources are sorted in reverse chronological order
        switch ($sort) {
            case 'date_desc':
            case 'date_asc': // YouTube Search API doesn't support proper chronological ascending, so we fallback
                $order = 'date';
                break;
            case 'title_asc':
            case 'title_desc':
                $order = 'title';
                break;
            case 'view_count':
                $order = 'viewCount';
                break;
            default:
                $order = 'date';
                break;
        }

        $args = [
            'channelId' => $this->channel_id,
            'part' => 'snippet',
            'type' => 'video', // Limit to videos only
            'maxResults' => max(1, min((int) $limit, 50)),
            'order' => $order,
            'key' => $this->api_key,
        ];

        if (!empty($query)) {
            $args['q'] = sanitize_text_field($query);
        }

        if (!empty($page_token)) {
            $args['pageToken'] = sanitize_text_field($page_token);
        }

        $search_url = add_query_arg($args, 'https://www.googleapis.com/youtube/v3/search');

        tubebay_log("search_videos: Querying YouTube search API. URL params: " . json_encode($args), 'debug');

        $response = wp_remote_get($search_url);

        if (is_wp_error($response)) {
            tubebay_log('search_videos: Network error - ' . $response->get_error_message(), 'error');
            return $response;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (isset($body['error'])) {
            tubebay_log('search_videos: API error - ' . ($body['error']['message'] ?? 'Unknown Error'), 'error');
            return new \WP_Error('api_error', $body['error']['message'] ?? 'Unknown API Error');
        }

        $videos = [];
        if (!empty($body['items'])) {
            foreach ($body['items'] as $item) {
                $snippet = $item['snippet'];

                // Thumbnail selection
                $thumbnails = $snippet['thumbnails'] ?? [];
                $thumb_url = '';
                if (isset($thumbnails['high']['url'])) {
                    $thumb_url = $thumbnails['high']['url'];
                } elseif (isset($thumbnails['medium']['url'])) {
                    $thumb_url = $thumbnails['medium']['url'];
                } elseif (isset($thumbnails['default']['url'])) {
                    $thumb_url = $thumbnails['default']['url'];
                }

                // In Search API, ID is in id.videoId
                $video_id = $item['id']['videoId'] ?? '';

                if (empty($video_id)) {
                    continue; // Skip rare cases where it's not a video
                }

                $videos[] = new Video([
                    'id' => $video_id,
                    'title' => $snippet['title'] ?? '',
                    'thumbnail_url' => $thumb_url,
                    'published_at' => $snippet['publishedAt'] ?? '',
                    'description' => $snippet['description'] ?? '',
                ]);
            }
        }

        // Search API reverse sort fix
        // YouTube API doesn't support reverse sorts for title or date ascending natively.
        // We'll flip the array manually for the specific page if requested.
        if ($sort === 'date_asc' || $sort === 'title_desc') {
            $videos = array_reverse($videos);
        }

        $next_page_token = $body['nextPageToken'] ?? null;

        return [
            'videos' => $videos,
            'next_page_token' => $next_page_token,
        ];
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

        // $transient_key = 'tubebay_channel_details_' . $this->channel_id;
        // $cached = get_transient($transient_key);

        // if ($cached !== false && is_array($cached)) {
        //     tubebay_log('get_channel_details: Returning cached details', 'debug');
        //     return $cached;
        // }

        tubebay_log('get_channel_details: Fetching fresh details from API', 'info');
        $channel_url = add_query_arg([
            'id' => $this->channel_id,
            'part' => 'snippet',
            'key' => $this->api_key,
        ], 'https://www.googleapis.com/youtube/v3/channels');

        $channel_response = wp_remote_get($channel_url);

        if (is_wp_error($channel_response)) {
            tubebay_log('get_channel_details: Network error fetching details - ' . $channel_response->get_error_message(), 'error');
            return $channel_response;
        }

        $channel_body = json_decode(wp_remote_retrieve_body($channel_response), true);

        if (isset($channel_body['error'])) {
            tubebay_log('get_channel_details: API error - ' . ($channel_body['error']['message'] ?? 'Unknown API Error'), 'error');
            return new \WP_Error('api_error', $channel_body['error']['message'] ?? 'Unknown API Error');
        }

        if (empty($channel_body['items'][0]['snippet'])) {
            tubebay_log('get_channel_details: Could not find channel snippet', 'error');
            return new \WP_Error('api_error', __('Could not fetch channel details.', 'tubebay'));
        }

        $snippet = $channel_body['items'][0]['snippet'];

        tubebay_log('get_channel_details: Channel details fetched successfully', 'debug');
        tubebay_log('get_channel_details: Channel details - ' . json_encode($snippet), 'debug');

        $details = [
            'title' => $snippet['title'] ?? '',
            'description' => $snippet['description'] ?? '',
            'thumbnails_default' => $snippet['thumbnails']['default']['url'] ?? '',
            'thumbnails_medium' => $snippet['thumbnails']['medium']['url'] ?? '',
        ];

        tubebay_log('get_channel_details: Success, setting transient cache', 'debug');
        // set_transient($transient_key, $details, Settings::get_cache_duration());

        return $details;
    }

    /**
     * Test the connection to YouTube using current credentials.
     * Does NOT modify any stored settings — purely a read-only check.
     *
     * @return array|\WP_Error  Channel details array on success, WP_Error on failure.
     */
    public function test_connection()
    {
        if (!$this->is_configured()) {
            return new \WP_Error('not_configured', __('API Key or Channel ID is missing.', 'tubebay'));
        }

        $details = $this->get_channel_details();

        if (is_wp_error($details)) {
            return $details;
        }

        return $details;
    }

    /**
     * Reconnect: save the current credentials to Settings and re-test.
     *
     * @return true|\WP_Error
     */
    public function reconnect()
    {
        Settings::set('api_key', $this->api_key);
        Settings::set('channel_id', $this->channel_id);

        return $this->test_connection();
    }

    /**
     * Disconnect: clear connection state in Settings.
     *
     * @return void
     */
    public function disconnect()
    {
        Settings::set('connection_status', 'disconnected');
        Settings::set('channel_name', '');
    }
}
