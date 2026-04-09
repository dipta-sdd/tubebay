# Connection Guide

To start using TubeBay, you need to connect your YouTube account. This allows the plugin to read your video library and synchronize content to your WooCommerce store.

TubeBay offers two connection methods: **Google OAuth (Recommended)** and **Manual API Key**.

## Google OAuth 2.0 (Recommended)
This is the easiest and most secure way to connect. It uses our secure authentication proxy to link your account without requiring you to create a Google Cloud project.

### Steps to Connect:
1. Navigate to **TubeBay > Settings** in your WordPress dashboard.
2. Select the **Google OAuth** tab.
3. Click the **Connect with Google** button.
4. You will be redirected to Google to authorize TubeBay.
5. Once authorized, you will receive a **Refresh Token**. Copy this token.
6. Paste the token into the **Refresh Token** field in your WordPress dashboard and click **Connect**.

::: tip Security
OAuth is safer because it doesn't give TubeBay your password and allows you to revoke access at any time from your Google Account settings.
:::

## Manual API Key (Advanced)
If you prefer to use your own Google Cloud project and API credentials, you can use the Manual method.

### Steps to Connect:
1. Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the **YouTube Data API v3**.
3. Create an **API Key** credentials.
4. Go to **TubeBay > Settings** and select the **Manual API** tab.
5. Enter your **API Key** and your **YouTube Channel ID**.
6. Click **Connect**.

### How to find your Channel ID?
You can find your YouTube Channel ID by visiting your [YouTube Account Advanced Settings](https://www.youtube.com/account_advanced). It usually starts with `UC...`.

## Verifying the Connection
Once connected, TubeBay will attempt to fetch your channel details (Name and Thumbnail). If successful, your connection status will change to **Connected**.

::: warning Connection Errors
If you see an error message, double-check your API key or ensure your Google project has the YouTube Data API enabled.
:::
