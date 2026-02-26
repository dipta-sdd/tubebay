<?php

namespace TubeBay\Core;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

use TubeBay\Helper\Settings;
use TubeBay\Data\Entities\Channel;

/**
 * Handles WP-Cron scheduling for automatic daily sync.
 */
class Cron
{
    private static $instance = null;

    /**
     * Cron hook name.
     */
    const HOOK_NAME = 'tubebay_daily_sync_event';

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Initial hook registration.
     */
    public function run($plugin)
    {
        $loader = $plugin->get_loader();

        // Register the action that actually performs the sync
        $loader->add_action(self::HOOK_NAME, $this, 'do_daily_sync');

        // Check and schedule if needed on plugin load/admin init etc.
        $loader->add_action('init', $this, 'check_and_schedule');
    }

    /**
     * Schedules the daily sync if auto_sync is enabled and not already scheduled.
     */
    public function check_and_schedule()
    {
        $auto_sync = Settings::get('auto_sync', true);

        if ($auto_sync) {
            if (!wp_next_scheduled(self::HOOK_NAME)) {
                // Schedule to start at 3:00 AM local time or soon after
                $timestamp = strtotime('03:00:00');

                // If 3:00 AM today has already passed, start tomorrow
                if ($timestamp < time()) {
                    $timestamp += DAY_IN_SECONDS;
                }

                wp_schedule_event($timestamp, 'daily', self::HOOK_NAME);
            }
        } else {
            // Unschedule if auto_sync is disabled
            $timestamp = wp_next_scheduled(self::HOOK_NAME);
            if ($timestamp) {
                wp_unschedule_event($timestamp, self::HOOK_NAME);
            }
        }
    }

    /**
     * The callback function for the cron event.
     */
    public function do_daily_sync()
    {
        $channel = new Channel();

        if (!$channel->is_configured()) {
            return;
        }

        // Force refresh from API
        $channel->get_latest_videos(true);
    }
}
