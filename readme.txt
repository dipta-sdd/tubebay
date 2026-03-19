=== TubeBay ===
Contributors: sankarsan, wpanchorbay, forhadkhan, arifac
Tags: woocommerce, youtube, video-product, video-gallery, lazy-load
Requires at least: 6.8
Tested up to: 6.9
Requires PHP: 7.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Boost your WooCommerce conversions by replacing static product images with high-performance YouTube videos.

== Description ==

**TubeBay** is the ultimate bridge between your YouTube channel and your WooCommerce store. Effortlessly enrich your product pages with engaging video content while maintaining peak performance.

Unlike standard video plugins, TubeBay focuses on **Visual Excellence** and **Speed**. Our unique "Video Facade" technology ensures your site stays fast, protecting your SEO and User Experience.

**Key Features:**

*   **Native Gallery Integration**: Replace the main product image or seamlessly append YouTube videos to your WooCommerce gallery strip.
*   **Performance First (Video Facade)**: Only loads YouTube iframe scripts when the user clicks play, maintaining a fast Largest Contentful Paint (LCP) and high Core Web Vitals.
*   **Direct YouTube API Connection**: Securely authenticate, sync, and browse your entire YouTube channel right from the custom admin dashboard.
*   **Flexible Video Controls**: Adjust player behaviors globally or on a per-product basis, including toggling player controls and muted autoplay.
*   **Interactive React Dashboard**: A premium, ultra-responsive settings panel built with React and Tailwind CSS, providing an unmatched user experience.
*   **Universal Theme Compatibility**: Designed to hook into standard WooCommerce gallery filters, ensuring seamless integration with your chosen theme.
*   **Strict Security & Clean Up**: Developed strictly adhering to WordPress coding standards, complete data sanitization, and comprehensive uninstall cleanup routines.

== External Services ==

This plugin relies on the official YouTube Data API v3 (provided by Google) to fetch and display YouTube videos, channels, and playlists within your WooCommerce store.

* **What the service does:** The YouTube API is used to retrieve video data (such as titles, thumbnails, and embed URLs) so that store administrators can easily browse their YouTube library and attach YouTube videos to their WooCommerce products.
* **What data is sent and when:** This plugin makes API requests to the YouTube API only when the site administrator configures the plugin or syncs video data within the WordPress admin dashboard (e.g., fetching channel playlists, or syncing videos). The plugin sends the administrator's Google API Key and relevant queries (e.g., channel IDs, playlist IDs or video IDs) to Google's servers. 

**Privacy Notice:** The plugin does not track visitors on the frontend. It only communicates with the YouTube API during administrative actions initiated by the store owner. 

**Policies:**
By using this plugin and its API connection, you agree to be bound by the YouTube Terms of Service and Google Privacy Policy.
* YouTube Terms of Service: [https://www.youtube.com/t/terms](https://www.youtube.com/t/terms)
* Google Privacy Policy: [https://policies.google.com/privacy](https://policies.google.com/privacy)

== Installation ==

1.  Upload the `tubebay` folder to the `/wp-content/plugins/` directory.
2.  Activate the plugin through the 'Plugins' menu in WordPress.
3.  Go to the **TubeBay** menu and connect your YouTube Channel.
4.  Edit any product to assign a video from your library!

== Frequently Asked Questions ==

= Does it affect my page speed or LCP score? =
TubeBay is built specifically to address the performance issues of most video plugins. Our "Video Facade" technology ensures that heavy YouTube iframes only load into the DOM when requested by the user, protecting your Largest Contentful Paint (LCP) and Core Web Vitals.

= Can I put the video as the main product image? =
Yes! You can use the "Replace Main Image" setting within the plugin dashboard to make your YouTube video the primary media for your product instead of a static image. You can also override this on individual products.

= Do I need my own YouTube API key? =
Yes. In order to sync your channel library securely, the plugin requires you to connect your YouTube Data API v3 credentials. We provide a step-by-step guide inside the setup wizard to easily obtain this key from the Google Cloud Console.

= Will this work with my custom WooCommerce theme? =
TubeBay hooks directly into standard WooCommerce gallery filters. It is designed to be highly compatible with modern WooCommerce themes right out of the box.

= Can I auto-play the video when the page loads? =
To preserve the user experience, respect modern browser autoplay policies, and maintain ultra-fast page speed, TubeBay focuses on the click-to-play "Facade" model. However, when the user clicks the facade thumbnail, the video will automatically start playing. We also provide "Muted Autoplay" controls for when the actual iframe is embedded.

= Where is my video data stored? =
Your YouTube videos remain hosted securely and entirely on Google's YouTube servers. TubeBay simply saves the video references (video ID, title, and thumbnail URL) in your local WordPress database as Post Meta, ensuring your database remains lightweight and fast.

== Screenshots ==

1.  Admin Dashboard - Manage your YouTube channel connection.
2.  Product Metabox - Assign videos to products easily.
3.  Frontend Gallery - High-performance video integrated into the WooCommerce product gallery.

== Changelog ==

= 1.0.0 =
*   Initial release.

== Upgrade Notice ==

= 1.0.0 =
This is the initial release. No upgrade necessary.