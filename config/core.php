<?php

/**
 * Core Configuration
 *
 * Use this file to register your Core classes that need to be initialized.
 * Each class should implement a run($loader) method or similar logic
 * to register its hooks with the Loader.
 */

return array(
    \TubeBay\Admin\Admin::class,
    \TubeBay\Admin\ProductMetabox::class,
    \TubeBay\Helper\Settings::class,
    \TubeBay\Core\Cron::class,
    \TubeBay\Integration\WooCommerce::class,
    \TubeBay\Frontend\VideoShortcode::class,
);
