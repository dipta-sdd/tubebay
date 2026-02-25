<?php

/**
 * API Configuration
 *
 * Use this file to register your API controllers.
 * Each controller must extend TubeBay\Api\ApiController
 * and implement get_instance() and run().
 */

return array(
    \TubeBay\Api\SettingsController::class,
    \TubeBay\Api\YouTubeController::class,
);
