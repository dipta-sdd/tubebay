# TubeBay — Google OAuth Verification Demo Video Script

> **Purpose:** This video demonstrates how TubeBay (by WPAnchorBay) uses the `youtube.readonly` scope to fetch and display YouTube videos on a WordPress website. It is intended for Google's Trust & Safety review team.

---

## Scene 1 — Introduction (0:00–0:15)

**[Screen: WordPress Admin Dashboard]**

> "This is TubeBay, a WordPress plugin developed by WPAnchorBay. TubeBay allows WordPress site owners to connect their YouTube channel and automatically display their video library on their website. The plugin requires read-only access to the user's YouTube data."

---

## Scene 2 — Navigate to Settings (0:15–0:25)

**[Action: Click on TubeBay → Settings in the WordPress sidebar]**

> "From the WordPress admin panel, we navigate to the TubeBay settings page. Here, users can connect their YouTube account using Google OAuth."

---

## Scene 3 — Initiate Google Sign-In (0:25–0:40)

**[Action: Show the Connect Account card with the 'Google OAuth (Recommended)' tab selected. Click 'Sign in with Google'.]**

> "The user clicks the 'Sign in with Google' button. This opens a new tab and redirects the user to Google's standard OAuth consent screen."

---

## Scene 4 — Google Consent Screen (0:40–1:05)

**[Action: Show the Google consent screen in the new tab. Slowly scroll through the permissions displayed.]**

> "On the Google consent screen, the application is identified as 'WPAnchorBay' — this is the parent company that develops and maintains the TubeBay plugin. The only permission requested is 'View your YouTube account', which corresponds to the `youtube.readonly` scope. No write, upload, or management permissions are requested."

**[Action: Highlight the URL bar showing the Client ID and scope parameter.]**

> "As visible in the URL, the scope parameter is set to `youtube.readonly`, confirming that the application can only read data."

**[Action: Click 'Continue' / 'Allow' on the consent screen.]**

---

## Scene 5 — Copy the Access Code (1:05–1:20)

**[Action: Show the WPAnchorBay authorization success page with the access code displayed.]**

> "After authorization, the user is presented with their access code on the WPAnchorBay secure proxy page. The user copies this code."

**[Action: Click the 'Copy Access Code' button.]**

---

## Scene 6 — Paste and Connect (1:20–1:40)

**[Action: Switch back to the WordPress tab. Paste the access code into the 'Access Code' field. Click 'Connect Account'.]**

> "Back in the WordPress dashboard, the user pastes the access code into the designated field and clicks 'Connect Account'. The plugin validates the code and establishes a secure connection to the user's YouTube channel."

**[Action: Show the success confirmation with the channel name and avatar displayed.]**

> "The connection is now established. The plugin displays the connected channel name and thumbnail, confirming a successful link."

---

## Scene 7 — Demonstrate Data Usage (1:40–2:10)

**[Action: Navigate to TubeBay → Channel Library.]**

> "Now let's see how TubeBay uses the YouTube data. Navigating to the Channel Library page, the plugin fetches and displays the user's videos — including titles, thumbnails, publication dates, and video IDs."

**[Action: Scroll through the video grid. Click on a video to show the detail/preview modal.]**

> "Each video can be previewed directly within the admin panel. This data is used exclusively to generate video galleries and embedded players on the user's WordPress website. No data is shared with third parties, and no modifications are made to the user's YouTube account."

---

## Scene 8 — Show Frontend Output (2:10–2:30)

**[Action: Navigate to a product page or frontend page where TubeBay videos are embedded.]**

> "On the frontend of the WordPress site, the fetched videos are displayed as an embedded gallery. Site visitors can browse and watch the videos directly on the page. All of this is powered by the read-only data retrieved through the `youtube.readonly` scope."

---

## Scene 9 — Disconnect Flow (2:30–2:45)

**[Action: Navigate back to TubeBay → Settings. Click 'Remove Account & Clear Credentials'. Confirm in the modal.]**

> "Users can disconnect their YouTube account at any time from the settings page. Clicking 'Remove Account' clears all stored credentials, cached data, and revokes the connection entirely. The user remains in full control of their data."

---

## Scene 10 — Summary (2:45–3:00)

**[Screen: Back on the TubeBay Settings page, now showing a disconnected state.]**

> "To summarize: TubeBay by WPAnchorBay uses the `youtube.readonly` scope exclusively to read a user's YouTube channel metadata and video library. It does not upload, edit, delete, or manage any YouTube content. Users can connect and disconnect at any time, and all data handling follows the principle of least privilege."

---

## Recording Checklist

- [ ] WordPress admin dashboard is clearly visible
- [ ] TubeBay plugin version number is visible
- [ ] Google consent screen shows 'WPAnchorBay' as the app name
- [ ] URL bar is clearly visible during consent (showing Client ID and scope)
- [ ] Only `youtube.readonly` scope is shown on consent screen
- [ ] Access code copy/paste flow is demonstrated
- [ ] Channel Library shows fetched video data
- [ ] Frontend video display is shown
- [ ] Disconnect/remove account flow is demonstrated
- [ ] Video resolution is at least 1280×720
- [ ] No sensitive credentials (API keys, tokens) are visible on screen
