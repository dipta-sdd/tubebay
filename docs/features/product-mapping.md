# Product Mapping

Product Mapping is the core feature of TubeBay. it allows you to link specific YouTube videos to your WooCommerce products, making your store more interactive and helping customers see your products in action.

## How it works
Each video in your synced library can be "Attached" to one or more WooCommerce products. Once attached, the video will automatically appear on the single product page of your store.

## Mapping a Video
1. Go to **TubeBay > Library**.
2. Find the video you want to map.
3. Click the **Attach** button (or click **Change** if it's already mapped).

![Library Attach Button](file:///docs/public/img/feature-product-mapping.png)

4. In the product selector window, search for the WooCommerce product by its name or SKU.
5. Select the product from the dropdown list.
6. The video is now mapped!

![Product Search and Selection](file:///docs/public/img/feature-product-mapping-search.png)

## Mapping Multiple Products
*(Note: Current version supports 1-to-1 mapping. Support for multiple products per video is coming in a future update!)*

---

## Technical Details
- **Storage:** Mappings are stored in a custom WordPress database table (`wp_tubebay_mappings`).
- **Performance:** TubeBay uses optimized queries to fetch mapped videos, ensuring your product pages remain fast.
- **Auto-Sync:** If you delete a product in WooCommerce, the mapping will automatically be cleaned up during the next sync.
- **Persistent Links:** Once a video is mapped, the link remains until you manually unmap it or delete the product.

## Product Search
The mapping search bar utilizes the WooCommerce product search API, allowing you to find products by:
- Title
- SKU
- ID

## Automated Suggestions (Pro)
The Pro version of TubeBay includes smart mapping features that can automatically suggest or link videos to products based on:
- Matching YouTube video titles to WooCommerce product names.
- Extracting SKUs from video descriptions.
- Mapping entire YouTube playlists to specific WooCommerce categories.
