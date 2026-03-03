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
 * @since      1.0.0
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
        $placement_hook = Settings::get('video_placement', 'woocommerce_product_thumbnails');

        // Only hook if placement is valid (not empty/null)
        if (!empty($placement_hook)) {
            if ('replace_main_image' === $placement_hook) {
                tubebay_log('WooCommerce: Registering replace_main_image on hook: woocommerce_single_product_image_thumbnail_html', 'debug');
                $loader->add_filter('woocommerce_single_product_image_thumbnail_html', $this, 'video_as_main_image', 10, 2);
            } else {
                tubebay_log('WooCommerce: Registering render_product_video on hook: ' . $placement_hook, 'debug');
                $loader->add_action($placement_hook, $this, 'render_product_video', 20);
            }
        } else {
            tubebay_log('WooCommerce: No video placement hook configured, skipping registration', 'debug');
        }
    }

    /**
     * Render the video iframe if a video is attached to the current product.
     *
     * @return void
     * @since 1.0.0
     */
    public function render_product_video()
    {
        global $product;

        if (!$product || !is_a($product, 'WC_Product')) {
            tubebay_log('WooCommerce: render_product_video called but no valid WC_Product found', 'debug');
            return;
        }

        $video_id = get_post_meta($product->get_id(), '_tubebay_video_id', true);

        if (empty($video_id)) {
            tubebay_log('WooCommerce: No video assigned to product ID ' . $product->get_id(), 'debug');
            return;
        }

        tubebay_log('WooCommerce: Rendering video ' . $video_id . ' for product ID ' . $product->get_id(), 'info');

        $muted_autoplay = get_post_meta($product->get_id(), '_tubebay_muted_autoplay', true);

        // Fallback to global defaults if product meta is missing
        if ($muted_autoplay === '') {
            $muted_autoplay = Settings::get('muted_autoplay', true) ? '1' : '0';
        }

        // Show player controls only uses global setting
        $show_controls = Settings::get('show_controls', true) ? '1' : '0';

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

    /**
     * Replace the main product image with the video iframe.
     *
     * @param string $html              The original image HTML.
     * @param int    $post_thumbnail_id The thumbnail ID.
     * @return string
     * @since 1.0.0
     */
    public function video_as_main_image($html, $post_thumbnail_id)
    {
        global $post;

        // 1. Check if we are on a single product page
        if (!is_singular('product') || !$post) {
            return $html;
        }

        // 2. Get the saved video ID
        $video_id = get_post_meta($post->ID, '_tubebay_video_id', true);

        // 3. If no video, return normal image
        if (empty($video_id)) {
            return $html;
        }

        $main_image_id = get_post_thumbnail_id($post->ID);

        // 1. Get the YouTube thumbnail to use for the WooCommerce navigation strip and the facade
        $yt_thumb = get_post_meta($post->ID, '_tubebay_video_thumbnail', true);
        if (empty($yt_thumb)) {
            // hqdefault is the highest resolution guaranteed to exist for all videos
            $yt_thumb = 'https://i.ytimg.com/vi/' . esc_attr($video_id) . '/hqdefault.jpg';
        }

        tubebay_log('WooCommerce: Replacing main image for product ID ' . $post->ID . ' with lazy-load video facade ' . $video_id, 'info');

        // Build the Lazy Load Facade HTML
        ob_start();
        ?>
        <div data-thumb="<?php echo esc_url($yt_thumb); ?>" class="woocommerce-product-gallery__image tubebay-video-slide">

            <!-- The Facade Container -->
            <div class="tubebay-video-facade" data-video-id="<?php echo esc_attr($video_id); ?>"
                style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; width: 100%; cursor: pointer; background: #000;">

                <!-- The Thumbnail Image -->
                <img src="<?php echo esc_url($yt_thumb); ?>" alt="Product Video"
                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" />

                <!-- The SVG Play Button -->
                <div class="tubebay-play-button"
                    style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 48px; transition: all 0.2s ease-in-out;">
                    <svg viewBox="0 0 68 48" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path class="tubebay-play-bg"
                            d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                            fill="#212121" fill-opacity="0.8"></path>
                        <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                    </svg>
                </div>

            </div>

        </div>
        <?php
        $video_slide_html = ob_get_clean();

        // SCENARIO 1: No Image
        if (empty($main_image_id)) {
            return $video_slide_html;
        }

        // SCENARIO 2: Has Image
        if ($post_thumbnail_id == $main_image_id) {
            return $video_slide_html . $html;
        }

        // For all other gallery thumbnails, just return the normal image HTML
        return $html;
    }
}
