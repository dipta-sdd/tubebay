# Shortcodes

While TubeBay handles video placement automatically based on your settings, you often need more control for specific page layouts or landing pages. Our shortcodes allow you to embed videos anywhere that supports WordPress shortcodes.

## The Global Video Shortcode
Use this shortcode within a single product page to display the video mapped to that specific product.

```text
[tubebay_video]
```

- **How it works:** This shortcode automatically detects the current product ID and renders the linked video.
- **Attributes:** It inherits the global player settings (autoplay, controls, etc.).

## The Specific Video Shortcode
Use this to embed a specific YouTube video anywhere on your site, regardless of product mapping.

```text
[tubebay_video id="YOUTUBE_VIDEO_ID"]
```

### Attributes:
- `id`: (Required) The 11-character YouTube video ID.
- `width`: (Optional) The width of the player (e.g., `100%` or `600px`).
- `autoplay`: (Optional) `yes` or `no`.
- `mute`: (Optional) `yes` or `no`.

## Shortcode with Product ID
Display the video mapped to a specific product on any page (like a "Video of the Day" on your homepage).

```text
[tubebay_video product_id="123"]
```

## Using in Page Builders
TubeBay shortcodes are compatible with all major page builders:
- **Elementor:** Use the Shortcode widget.
- **Divi:** Use the Code or Text module.
- **Gutenberg:** Use the Shortcode or Custom HTML block.
- **Beaver Builder:** Use the HTML or Text module.
