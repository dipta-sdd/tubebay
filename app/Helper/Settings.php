<?php

namespace TubeBay\Helper;

class Settings
{
    /**
     * Get a plugin option.
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get($key, $default = false)
    {
        return get_option('tubebay_' . $key, $default);
    }

    /**
     * Set a plugin option.
     *
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    public static function set($key, $value)
    {
        return update_option('tubebay_' . $key, $value);
    }

    /**
     * Get the configured API Key.
     */
    public static function get_api_key()
    {
        return self::get('api_key', '');
    }

    /**
     * Get the configured Channel ID.
     */
    public static function get_channel_id()
    {
        return self::get('channel_id', '');
    }

    /**
     * Get the cache duration in seconds.
     * Defaults to 12 hours (43200 seconds).
     */
    public static function get_cache_duration()
    {
        $duration = self::get('cache_duration', 12); // Default to 12 hours
        return (int) $duration * HOUR_IN_SECONDS;
    }

    /**
     * Get the OAuth Access Token (Phase 2).
     */
    public static function get_access_token()
    {
        return self::get('access_token', '');
    }

    /**
     * Get the OAuth Refresh Token (Phase 2).
     */
    public static function get_refresh_token()
    {
        return self::get('refresh_token', '');
    }

    /**
     * Get the OAuth Token Expiration time (Phase 2).
     */
    public static function get_token_expires()
    {
        return self::get('token_expires', 0);
    }
}
