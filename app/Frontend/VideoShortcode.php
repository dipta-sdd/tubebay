<?php
/**
 * Shortcode for rendering YouTube videos.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Frontend
 */

namespace TubeBay\Frontend;

use TubeBay\Core\Plugin;
use TubeBay\Helper\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * VideoShortcode class.
 */
class VideoShortcode {

	/**
	 * The single instance of the class.
	 *
	 * @var VideoShortcode|null
	 */
	private static $instance = null;

	/**
	 * Gets an instance of this object.
	 *
	 * @return VideoShortcode
	 * @since 1.0.0
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Register hooks for this class.
	 *
	 * @param Plugin $plugin The plugin instance.
	 * @since 1.0.0
	 */
	public function run( $plugin ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.Found
		tubebay_log( 'VideoShortcode: Registering [tubebay_video] shortcode', 'debug' );
		add_shortcode( 'tubebay_video', array( $this, 'render_shortcode' ) );
	}

	/**
	 * Render the [tubebay_video] shortcode.
	 *
	 * Usage: [tubebay_video id="VIDEO_ID" autoplay="1" mute="1" controls="1" width="560" height="315"]
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string HTML output.
	 */
	public function render_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'id'       => '',
				'autoplay' => null,
				'mute'     => null,
				'controls' => null,
				'width'    => '',
				'height'   => '',
			),
			$atts,
			'tubebay_video'
		);

		$video_id = sanitize_text_field( $atts['id'] );

		if ( empty( $video_id ) ) {
			tubebay_log( 'VideoShortcode: render_shortcode called without a video ID — returning empty', 'debug' );
			return '';
		}

		tubebay_log( 'VideoShortcode: Rendering video ID ' . $video_id, 'info' );

		// Resolve settings: shortcode attrs override globals.
		$muted_autoplay = null !== $atts['autoplay']
			? ( '1' === $atts['autoplay'] )
			: (bool) Settings::get( 'muted_autoplay', true );
		$show_controls  = null !== $atts['controls']
			? ( '1' === $atts['controls'] )
			: (bool) Settings::get( 'show_controls', true );

		// Build the YouTube embed URL.
		$embed_url = 'https://www.youtube.com/embed/' . esc_attr( $video_id ) . '?rel=0';

		if ( $muted_autoplay ) {
			$embed_url .= '&autoplay=1&mute=1';
		}
		if ( ! $show_controls ) {
			$embed_url .= '&controls=0';
		}

		$width  = ! empty( $atts['width'] ) ? intval( $atts['width'] ) : '';
		$height = ! empty( $atts['height'] ) ? intval( $atts['height'] ) : '';

		ob_start();
		?>
		<div class="tubebay-shortcode-video-wrapper">
			<div class="tubebay-responsive-iframe-container">
				<iframe 
				<?php
				if ( $width ) :
					?>
					width="
			<?php echo esc_attr( $width ); ?>" <?php endif; ?>
			<?php
			if ( $height ) :
				?>
				height="
			<?php echo esc_attr( $height ); ?>" <?php endif; ?> src="<?php echo esc_url( $embed_url ); ?>"
					title="<?php esc_attr_e( 'TubeBay Video', 'tubebay' ); ?>" frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen>
				</iframe>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
