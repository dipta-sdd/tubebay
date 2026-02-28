<?php

namespace TubeBay\Integration;

use TubeBay\Core\Plugin;
use TubeBay\Helper\Settings;

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class WooCommerce
 *
 * Handles integration with WooCommerce hooks.
 *
 * @package    TubeBay
 * @subpackage TubeBay/Integration
 */
class WooCommerce
{
    /**
     * The single instance of the class.
     *
     * @var WooCommerce|null
     */
    private static $instance = null;

    /**
     * Gets an instance of this object.
     *
     * @return WooCommerce
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Register hooks for this class.
     *
     * @param Plugin $plugin
     */
    public function run($plugin)
    {
        $loader = $plugin->get_loader();

        // Get the chosen display location, defaulting to after product summary
        $placement_hook = Settings::get('video_placement', 'woocommerce_after_single_product_summary');

        // Only hook if placement is valid (not empty/null)
        if (!empty($placement_hook)) {
            $loader->add_action('woocommerce_product_thumbnails', $this, 'render_product_video', 20);
            // $loader->add_action($placement_hook, $this, 'render_product_video', 20);
        }
    }

    /**
     * Render the video iframe if a video is attached to the current product.
     */
    public function render_product_video()
    {
        global $product;

        if (!$product || !is_a($product, 'WC_Product')) {
            return;
        }

        $video_id = get_post_meta($product->get_id(), '_tubebay_video_id', true);

        if (empty($video_id)) {
            return;
        }

        $muted_autoplay = get_post_meta($product->get_id(), '_tubebay_muted_autoplay', true);
        $show_controls = get_post_meta($product->get_id(), '_tubebay_show_controls', true);

        // Build the YouTube embed URL
        $embed_url = 'https://www.youtube.com/embed/' . esc_attr($video_id) . '?rel=0';

        if ('1' === $muted_autoplay) {
            $embed_url .= '&autoplay=1&mute=1';
        }
        if ('0' === $show_controls) {
            $embed_url .= '&controls=0';
        }

        ?>
        <div class="tubebay-product-video-wrapper">
            <div class="tubebay-responsive-iframe-container">
                <iframe width="560" height="315" src="<?php echo esc_url($embed_url); ?>"
                    title="<?php esc_attr_e('TubeBay Product Video', 'tubebay'); ?>" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
            </div>
        </div>
        <?php
    }
}
