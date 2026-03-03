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

        // 4. Ensure we are ONLY replacing the MAIN image, not the gallery thumbnails
        $main_image_id = get_post_thumbnail_id($post->ID);

        // Check if there is no main image, or if we are processing the main image
        if (empty($main_image_id) || $post_thumbnail_id == $main_image_id) {

            // Get player settings
            $muted_autoplay = get_post_meta($post->ID, '_tubebay_muted_autoplay', true);
            if ($muted_autoplay === '') {
                $muted_autoplay = Settings::get('muted_autoplay', true) ? '1' : '0';
            }
            $show_controls = Settings::get('show_controls', true) ? '1' : '0';

            $embed_url = 'https://www.youtube.com/embed/' . esc_attr($video_id) . '?rel=0';
            if ('1' === $muted_autoplay) {
                $embed_url .= '&autoplay=1&mute=1';
            }
            if ('0' === $show_controls) {
                $embed_url .= '&controls=0';
            }

            // 1. Get the YouTube thumbnail to use for the WooCommerce navigation strip
            $yt_thumb = get_post_meta($post->ID, '_tubebay_video_thumbnail', true);
            if (empty($yt_thumb)) {
                $yt_thumb = 'https://i.ytimg.com/vi/' . esc_attr($video_id) . '/hqdefault.jpg';
            }

            tubebay_log('WooCommerce: Replacing main image for product ID ' . $post->ID . ' with video gallery slide ' . $video_id, 'info');

            // 2. Build the Video Slide HTML. 
            // Notice the 'data-thumb' attribute. This tells WooCommerce to make a clickable thumbnail!
            ob_start();
            ?>
            <div data-thumb="<?php echo esc_url($yt_thumb); ?>" class="woocommerce-product-gallery__image tubebay-video-slide">
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; width: 100%;">
                    <iframe src="<?php echo esc_url($embed_url); ?>"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            <?php
            $video_slide_html = ob_get_clean();

            // 3. The Magic: We return BOTH the Video Slide AND the original Main Image!
            // This makes the Video = Slide 1, and the Main Image = Slide 2.

            // If the product doesn't have an image, we just return the video slide
            // instead of including the WooCommerce placeholder image inline.
            if (empty($main_image_id)) {
                return $video_slide_html;
            }

            return $video_slide_html . $html;
        }

        // Return standard HTML for all other gallery thumbnails
        return $html;
    }
}
