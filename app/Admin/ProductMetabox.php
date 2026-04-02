<?php
/**
 * ProductMetabox class.
 *
 * Handles the custom meta box for the WooCommerce product edit screen.
 *
 * @since      1.0.0
 * @package    TubeBay
 * @subpackage TubeBay/Admin
 */

namespace TubeBay\Admin;

use TubeBay\Core\Plugin;
use TubeBay\Helper\Settings;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class ProductMetabox
 *
 * Handles the custom meta box for the WooCommerce product edit screen.
 *
 * @package    TubeBay
 * @subpackage TubeBay/Admin
 */
class ProductMetabox {

	/**
	 * The single instance of the class.
	 *
	 * @var ProductMetabox|null
	 * @since 1.0.0
	 */
	private static $instance = null;

	/**
	 * Gets an instance of this object.
	 *
	 * @return ProductMetabox
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
	 * @param \TubeBay\Core\Plugin $plugin The main plugin instance.
	 * @return void
	 * @since 1.0.0
	 */
	public function run( $plugin ) {
		$loader = $plugin->get_loader();
		// Hook into WooCommerce product meta boxes.
		$loader->add_action( 'add_meta_boxes_product', $this, 'add_metabox' );
		$loader->add_action( 'save_post_product', $this, 'save_metabox_data', 10, 2 );
		$loader->add_action( 'admin_enqueue_scripts', $this, 'enqueue_assets' );
	}

	/**
	 * Add the meta box to the product screen.
	 *
	 * @return void
	 * @since 1.0.0
	 */
	public function add_metabox() {
		$is_connected = ( Settings::get( 'connection_status', 'inactive' ) === 'connected' );

		// If not connected, only show metabox if product already has a video.
		if ( ! $is_connected ) {
			global $post;
			if ( $post ) {
				$video_id = get_post_meta( $post->ID, '_tubebay_video_id', true );
				if ( empty( $video_id ) ) {
					return; // Not connected and no video — hide metabox.
				}
			}
		}

		add_meta_box(
			'tubebay_product_video_metabox',
			__( 'TubeBay Video', 'tubebay' ),
			array( $this, 'render_metabox_content' ),
			'product',
			'side',
			'high'
		);
		tubebay_log( 'ProductMetabox: Added TubeBay Video metabox to product screen', 'debug' );
	}

	/**
	 * Enqueue JS and CSS for the metabox on the product screen.
	 *
	 * @param string $hook The current admin page.
	 * @return void
	 * @since 1.0.0
	 */
	public function enqueue_assets( $hook ) {
		global $post_type;

		if ( 'post.php' !== $hook && 'post-new.php' !== $hook ) {
			return;
		}

		if ( 'product' !== $post_type ) {
			return;
		}

		wp_enqueue_style(
			'tubebay-product-metabox-css',
			TUBEBAY_URL . 'assets/css/admin/product-metabox.css',
			array(),
			TUBEBAY_VERSION
		);

		wp_enqueue_script(
			'tubebay-product-metabox-js',
			TUBEBAY_URL . 'assets/js/admin/product-metabox.js',
			array( 'jquery' ),
			TUBEBAY_VERSION,
			true
		);

		// Pass localized data to script.
		$is_connected = ( Settings::get( 'connection_status', 'inactive' ) === 'connected' );
		wp_localize_script(
			'tubebay-product-metabox-js',
			'tubebayMetabox',
			array(
				'restUrl'     => esc_url_raw( rest_url( 'tubebay/v1/youtube/videos' ) ),
				'nonce'       => wp_create_nonce( 'wp_rest' ),
				'isConnected' => $is_connected,
				'i18n'        => array(
					'selectVideo' => __( 'Select Video', 'tubebay' ),
					'removeVideo' => __( 'Remove Video', 'tubebay' ),
					'loading'     => __( 'Loading...', 'tubebay' ),
					'error'       => __( 'Error loading videos.', 'tubebay' ),
					'loadMore'    => __( 'Load More', 'tubebay' ),
					'search'      => __( 'Search videos...', 'tubebay' ),
					'sort'        => array(
						'date_desc'  => __( 'Recently Added', 'tubebay' ),
						'date_asc'   => __( 'Oldest First', 'tubebay' ),
						'title_asc'  => __( 'Title (A-Z)', 'tubebay' ),
						'title_desc' => __( 'Title (Z-A)', 'tubebay' ),
						'view_count' => __( 'Most Viewed', 'tubebay' ),
					),
				),
			)
		);
	}

	/**
	 * Render the metabox HTML.
	 *
	 * @param \WP_Post $post The post object.
	 * @return void
	 * @since 1.0.0
	 */
	public function render_metabox_content( $post ) {
		wp_nonce_field( 'tubebay_product_metabox_nonce', 'tubebay_product_metabox_nonce_field' );

		// Retrieve existing values.
		$video_id    = get_post_meta( $post->ID, '_tubebay_video_id', true );
		$video_title = get_post_meta( $post->ID, '_tubebay_video_title', true );
		$video_thumb = get_post_meta( $post->ID, '_tubebay_video_thumbnail', true );

		// These are currently fixed for the free version.
		$display_location = 'default';

		$muted_autoplay = get_post_meta( $post->ID, '_tubebay_muted_autoplay', true );

		// Fallback to global defaults if not explicitly set yet.
		$muted_autoplay = ( '' === $muted_autoplay ) ? ( Settings::get( 'muted_autoplay', true ) ? '1' : '0' ) : $muted_autoplay;

		$is_connected = ( Settings::get( 'connection_status', 'inactive' ) === 'connected' );

		?>
		<div class="tubebay-metabox-wrapper">
			<!-- Hidden inputs to store selection -->
			<input type="hidden" id="tubebay_video_id" name="tubebay_video_id" value="<?php echo esc_attr( $video_id ); ?>" />
			<input type="hidden" id="tubebay_video_title" name="tubebay_video_title"
				value="<?php echo esc_attr( $video_title ); ?>" />
			<input type="hidden" id="tubebay_video_thumbnail" name="tubebay_video_thumbnail"
				value="<?php echo esc_attr( $video_thumb ); ?>" />
			<input type="hidden" name="tubebay_display_location" value="<?php echo esc_attr( $display_location ); ?>" />

			<div id="tubebay-selected-video-container" class="<?php echo empty( $video_id ) ? 'tubebay-hidden' : ''; ?>">
				<div class="tubebay-video-card">
					<div class="tubebay-video-thumbnail-wrap">
						<img id="tubebay_video_thumbnail_img" src="<?php echo esc_url( $video_thumb ); ?>"
							alt="Video Thumbnail" />
						<div class="tubebay-play-icon">▶</div>
						<div class="tubebay-video-actions">
							<?php if ( $is_connected ) : ?>
							<button type="button" class="button" id="tubebay_edit_video_btn"
								title="<?php esc_attr_e( 'Change Video', 'tubebay' ); ?>"><span
									class="dashicons dashicons-edit"></span></button>
							<?php endif; ?>
							<button type="button" class="button tubebay-danger-btn" id="tubebay_remove_video_btn"
								title="<?php esc_attr_e( 'Remove Video', 'tubebay' ); ?>"><span
									class="dashicons dashicons-trash"></span></button>
						</div>
					</div>
					<p id="tubebay_video_title_display" class="tubebay-video-title">
						<?php echo esc_html( $video_title ); ?>
					</p>
				</div>
			</div>

			<?php if ( $is_connected ) : ?>
			<div id="tubebay-add-video-container" class="<?php echo ! empty( $video_id ) ? 'tubebay-hidden' : ''; ?>">
				<button type="button" class="button button-primary" id="tubebay_select_video_btn">
					<?php esc_html_e( 'Select Video from Library', 'tubebay' ); ?>
				</button>
			</div>
			<?php else : ?>
				<?php if ( empty( $video_id ) ) : ?>
			<p class="description" style="margin-top: 8px; color: #b91c1c;">
					<?php esc_html_e( 'Connect your YouTube account in TubeBay Settings to select videos.', 'tubebay' ); ?>
			</p>
			<?php else : ?>
			<p class="description" style="margin-top: 8px; color: #b91c1c;">
				<?php esc_html_e( 'Reconnect your YouTube account in TubeBay Settings to change or add videos.', 'tubebay' ); ?>
			</p>
			<?php endif; ?>
			<?php endif; ?>

			<div id="tubebay-autoplay-setting" class="<?php echo empty( $video_id ) ? 'tubebay-hidden' : ''; ?>">
				<hr />
				<div class="tubebay-setting-row">
					<div class="tubebay-setting-label">
						<strong>
							<?php esc_html_e( 'Muted Autoplay', 'tubebay' ); ?>
						</strong>
						<p class="description">
							<?php esc_html_e( 'Video plays automatically without sound', 'tubebay' ); ?>
						</p>
					</div>
					<div class="tubebay-setting-control">
						<label class="tubebay-switch">
							<input type="checkbox" name="tubebay_muted_autoplay" value="1" <?php checked( $muted_autoplay, '1' ); ?> />
							<span class="tubebay-slider tubebay-round"></span>
						</label>
					</div>
				</div>
			</div>

			<?php if ( $is_connected ) : ?>
			<!-- Modal (Hidden by default) -->
			<div id="tubebay-video-modal" style="display:none;">
				<div class="tubebay-modal-overlay"></div>
				<div class="tubebay-modal-content">
					<div class="tubebay-modal-header">
						<h2>
							<?php esc_html_e( 'Select a Video', 'tubebay' ); ?>
						</h2>
						<span class="tubebay-modal-close">&times;</span>
					</div>

					<!-- Filter Toolbar -->
					<div class="tubebay-modal-toolbar">
						<input type="text" id="tubebay-modal-search" placeholder="<?php esc_attr_e( 'Search videos...', 'tubebay' ); ?>" />
						<select id="tubebay-modal-sort">
							<option value="date_desc"><?php esc_html_e( 'Recently Added', 'tubebay' ); ?></option>
							<option value="date_asc"><?php esc_html_e( 'Oldest First', 'tubebay' ); ?></option>
							<option value="title_asc"><?php esc_html_e( 'Title (A-Z)', 'tubebay' ); ?></option>
							<option value="title_desc"><?php esc_html_e( 'Title (Z-A)', 'tubebay' ); ?></option>
							<option value="view_count"><?php esc_html_e( 'Most Viewed', 'tubebay' ); ?></option>
						</select>
					</div>

					<div class="tubebay-modal-body" id="tubebay-modal-video-grid">
						<p class="tubebay-loading-text">
							<?php esc_html_e( 'Loading videos...', 'tubebay' ); ?>
						</p>
					</div>
					
					<div class="tubebay-modal-footer" id="tubebay-modal-footer" style="display:none;">
						<button type="button" class="button" id="tubebay-modal-load-more"><?php esc_html_e( 'Load More', 'tubebay' ); ?></button>
					</div>
				</div>
			</div>
			<?php endif; ?>
		</div>
		<?php
	}

	/**
	 * Save the metabox data.
	 *
	 * @param int      $post_id The post ID.
	 * @param \WP_Post $post    The post object.
	 * @return int The post ID.
	 * @since 1.0.0
	 */
	public function save_metabox_data( $post_id, $post ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter.FoundAfterLastUsed
		// Check if nonce is set.
		if ( ! isset( $_POST['tubebay_product_metabox_nonce_field'] ) ) {
			return $post_id;
		}

		$nonce = sanitize_text_field( wp_unslash( $_POST['tubebay_product_metabox_nonce_field'] ) );

		// Verify that the nonce is valid.
		if ( ! wp_verify_nonce( $nonce, 'tubebay_product_metabox_nonce' ) ) {
			tubebay_log( 'ProductMetabox: Save aborted - invalid nonce', 'error' );
			return $post_id;
		}

		// If this is an autosave, our form has not been submitted.
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return $post_id;
		}

		// Check the user's permissions.
		if ( isset( $_POST['post_type'] ) && 'product' === sanitize_text_field( wp_unslash( $_POST['post_type'] ) ) ) {
			if ( ! current_user_can( 'edit_post', $post_id ) ) {
				return $post_id;
			}
		}

		// Santize and save Video ID.
		if ( isset( $_POST['tubebay_video_id'] ) ) {
			$video_id = sanitize_text_field( wp_unslash( $_POST['tubebay_video_id'] ) );
			update_post_meta( $post_id, '_tubebay_video_id', $video_id );

			// If video ID is cleared, clear other video data too.
			if ( empty( $video_id ) ) {
				tubebay_log( 'ProductMetabox: Cleared video assignment for product ID ' . $post_id, 'info' );
				delete_post_meta( $post_id, '_tubebay_video_title' );
				delete_post_meta( $post_id, '_tubebay_video_thumbnail' );
			} else {
				tubebay_log( 'ProductMetabox: Saved video assignment ' . $video_id . ' for product ID ' . $post_id, 'info' );
				if ( isset( $_POST['tubebay_video_title'] ) ) {
					update_post_meta( $post_id, '_tubebay_video_title', sanitize_text_field( wp_unslash( $_POST['tubebay_video_title'] ) ) );
				}
				if ( isset( $_POST['tubebay_video_thumbnail'] ) ) {
					update_post_meta( $post_id, '_tubebay_video_thumbnail', esc_url_raw( wp_unslash( $_POST['tubebay_video_thumbnail'] ) ) );
				}
			}
		}

		// Display Location (hidden field for now).
		if ( isset( $_POST['tubebay_display_location'] ) ) {
			update_post_meta( $post_id, '_tubebay_display_location', sanitize_text_field( wp_unslash( $_POST['tubebay_display_location'] ) ) );
		}

		// Muted Autoplay Toggle (checkboxes only exist in $_POST if checked).
		$muted_autoplay = isset( $_POST['tubebay_muted_autoplay'] ) ? '1' : '0';
		update_post_meta( $post_id, '_tubebay_muted_autoplay', $muted_autoplay );
		tubebay_log( 'ProductMetabox: Saved muted_autoplay=' . $muted_autoplay . ' for product ID ' . $post_id, 'debug' );

		return $post_id;
	}
}
