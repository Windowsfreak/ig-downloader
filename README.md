# Instagram Downloader (formerly Promaster) — Cleaned & Open Source

A lightweight, powerful, and **100% free & open-source** Manifest V3 browser extension for downloading Instagram photos, videos, Reels, Stories, and Highlights — both individually and in bulk.

---

## 📖 The Story Behind This Project

This project was originally known on the Chrome Web Store as **"Downloader for Instagram – Promaster"**, a widely used browser extension for downloading media from Instagram. 

Unfortunately, in a recent update pushed by the previous commercial maintainer, an obfuscated backdoor / trojan payload was embedded into the extension. The extension began exhibiting malicious background activity, prompting Google to ban and remove it from the Chrome Web Store.

Recognizing the utility of the original tool, **Windowsfreak** retrieved the extension files to perform a complete security audit, clean-up, and architectural overhaul:

1. **Malicious Backdoor Removed**: Completely purged all unauthorized tracking payloads, remote script loaders, and backdoor mechanisms.
2. **Nagware & Promotional Redirects Stripped**:
   - Disabled the rating nag banner (`promaster-rate-us`) that repeatedly prompted users for 5-star store reviews.
   - Removed all external promotional links and policy redirects to third-party domains (`https://sites.google.com/view/downloader-promaster`).
   - Automatically bypasses policy gates on clean install without opening unwanted new tabs.
3. **Dead Code Elimination**: Removed over 3,140 lines of unused, bundled third-party libraries (such as a legacy Browserified `JSZip 3.0` bundle) that were needlessly bloating the extension.
4. **Instagram API Modernization**: Replaced deprecated, broken Instagram GraphQL queries and endpoints with modern, working API calls for Reels, Stories, and Highlights.
5. **Comprehensive Deobfuscation**: Systematically refactored minified, single-character variable names and Webpack module exports into clean, readable, self-documenting JavaScript.

Today, this codebase is provided **100% free of charge and open source** for users, developers, and security researchers to experiment with and build upon.

---

## ✨ Features

- **Single Post & Video Downloads**: Download high-resolution photos and MP4 videos directly from Instagram feed posts, carousels, and single-item views.
- **Reels Downloader**: Dedicated download buttons injected directly onto Reels with audio and video extraction.
- **Stories & Highlights**: Download active Stories or entire Highlight collections, with automatic naming based on the username and timestamp.
- **Advanced Bulk Downloader**:
  - Download all posts from any user's profile with one click.
  - Filter downloads by date range (`for_days`), media type (photo vs. video), or popularity (most liked / most viewed percentiles).
  - Streams downloaded files directly into a `.zip` archive with zero server dependencies.
- **Privacy First**: Zero analytics, zero remote telemetry, zero external tracking servers. All network requests go directly between your browser and Instagram's official content delivery network (CDN).

---

## 🚀 Installation Guide

Because this extension is independent and open-source (not distributed via the Chrome Web Store), you install it as an **unpacked extension** in developer mode:

### In Google Chrome / Chromium / Brave / Edge / Vivaldi:

1. **Download / Clone this repository**:
   ```bash
   git clone https://github.com/Windowsfreak/ig-downloader.git
   ```
2. Open your browser and navigate to the Extensions page:
   - Chrome / Brave: `chrome://extensions`
   - Edge: `edge://extensions`
3. Toggle the **"Developer mode"** switch (usually located in the top-right corner).
4. Click the **"Load unpacked"** button in the top toolbar.
5. Select the **`extension`** folder inside this repository:
   ```
   ig-downloader/extension
   ```
6. Navigate to [Instagram](https://www.instagram.com) — download and repost buttons will automatically appear next to posts, reels, and stories!

---

## 🛠 Project Structure & Architecture

```
ig-downloader/
├── README.md                  # Project overview and documentation
└── extension/
    ├── manifest.json          # Chrome Manifest V3 configuration
    ├── css/
    │   ├── fonts.css          # Local typography definitions
    │   ├── pp.css             # Local privacy policy page styles
    │   └── styles.css         # Injected buttons, modal overlays, progress bars
    ├── html/
    │   ├── options.html       # Extension options UI
    │   └── pp.html            # Local terms & permissions documentation
    ├── img/                   # Icons and SVG UI assets
    ├── js/
    │   ├── bg.js              # Background service worker (headers, download dispatcher)
    │   ├── app.js             # Content script (DOM observer, bulk downloader, UI injectors)
    │   ├── options.js         # Settings controller
    │   └── pp.js              # Local policy page script
    └── _locales/              # Multi-language localization dictionaries (50+ locales)
```

### Core Architecture Highlights

- **`extension/js/bg.js` (Service Worker)**:
  - Manages required Instagram session headers (`x-ig-app-id`, `x-csrftoken`, `x-asbd-id`).
  - Listens for download requests via `chrome.downloads` to save media to the user's Downloads directory.
  - Proxies media information queries (`baseMediaInfoRequest`, `requestStories`, `requestHighlights`).
- **`extension/js/app.js` (Content Script)**:
  - **`uiController`**: Observes Instagram's Single Page Application (SPA) DOM mutations and injects download buttons onto posts, Reels, and Stories without slowing down the page.
  - **`bulkDownloadController`**: Handles batch timeline downloads with cursor-based pagination and filter logic.
  - **`taskQueue`**: Manages parallel chunk downloading and memory-safe streaming into `.zip` packages.
  - **`instaUtils`**: Comprehensive Instagram helper utilities for shortcode conversions, URL parsing, and viewport detection.

---

## 🔒 Security & Privacy

- **No Data Collection**: The extension does not record, log, or transmit passwords, personal identifiers, or browsing activity.
- **Local Storage Only**: User preferences are saved strictly in your browser's local `chrome.storage`.
- **Direct Requests**: Media and API queries are communicated solely with `*.instagram.com` domains using your existing authenticated session cookies.

---

## ⚖️ Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Instagram, Meta, or Google. Use responsibly and respect the copyright and privacy of content creators when downloading media.
