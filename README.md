# Download Link Tracker

A JavaScript library that automatically tracks clicks on external links and opens them in new windows. Designed for websites that need to monitor outbound link activity while maintaining good user experience.

## Features

- **Automatic Detection**: Automatically identifies external links vs internal links
- **Dynamic Content Support**: Uses MutationObserver to handle dynamically added content (React, Vue, etc.)
- **Configurable Tracking**: Supports custom tracking URLs and identifiers
- **File Type Categorization**: Automatically categorizes links by file type (PDF, audio, video, etc.)
- **Non-Intrusive**: Works with existing websites without requiring modifications to existing links
- **Fallback Support**: Works with or without jQuery

## Quick Start

1. Include the script in your HTML:

```html
<script src="download-link-tracker.js"></script>
```

2. Configure tracking variables:

```html
<script>
  window.mt_id = 'your-tracking-id';
  window.tracker_url = 'https://your-tracking-server.com/track'; // Optional
</script>
```

3. That's it! The tracker will automatically start monitoring external links.

## Configuration

### Required Variables

- `window.mt_id`: Your tracking identifier (required)

### Optional Variables

- `window.tracker_url`: Custom tracking endpoint (defaults to 'https://track.door43.org/track')

### Dependencies

- **jQuery** (optional): If available, uses `$.ajax()` for tracking requests
- **Fallback**: Uses native `fetch()` if jQuery is not available

## How It Works

### Link Detection

The tracker distinguishes between internal and external links:

**Internal Links (not tracked):**

- Relative URLs: `/page`, `./file.html`, `../parent/`
- Same domain: `https://yourdomain.com/page`
- Subdomains: `https://sub.yourdomain.com/page`

**External Links (tracked):**

- Different domains: `https://external-site.com/file.pdf`
- External subdomains: `https://cdn.example.com/resource`

### File Categorization

Links are automatically categorized based on file extension and filename patterns:

- **Documents**: `.pdf`, `.docx`, `.epub`, `.odt`

  - `obs-tq` → 'tq' (Translation Questions)
  - `obs-tn` → 'tn' (Translation Notes)
  - `obs-sn` → 'sn' (Study Notes)
  - `obs-sq` → 'sq' (Study Questions)
  - Default → 'stories'

- **Audio**: `.mp3`, `.3gp`
- **Video**: `.mp4`
- **Archives**: `.zip` (categorized by contents if filename indicates audio/video)

### Tracking Parameters

When an external link is clicked, a tracking request is sent with these parameters:

- `mt_id`: Your tracking identifier
- `mt_lang`: Language code (defaults to 'en')
- `mt_file`: Filename from the URL
- `mt_category`: Automatically determined category

Example tracking URL:

```
https://track.door43.org/track?mt_id=your-id&mt_lang=en&mt_file=document.pdf&mt_category=stories
```

## Dynamic Content Support

The tracker automatically handles content added after page load:

```javascript
// This will work automatically - no additional setup needed
document.getElementById('container').innerHTML = `
    <a href="https://external-site.com/file.pdf">New External Link</a>
`;
```

Perfect for:

- React components
- Vue.js apps
- jQuery content updates
- Any dynamically loaded content

## Manual Tracking

You can also manually track links:

```javascript
// Track a specific anchor element
const anchor = document.querySelector('a[href="https://example.com/file.pdf"]');
track_clicks(anchor);

// Track with custom mt_id
track_clicks(anchor, 'custom-tracking-id');
```

## Testing

Open `example.html` in a web browser to see the tracker in action:

1. Open browser developer console
2. Click on various external links
3. Observe tracking requests and link behavior
4. Test dynamic content by clicking "Add Dynamic External Links"

## Browser Support

- Modern browsers with ES6 support
- MutationObserver support (IE11+)
- Fetch API or jQuery for HTTP requests

## GitHub Pages Deployment

This library is designed to work seamlessly with GitHub Pages:

1. Upload `download-link-tracker.js` to your repository
2. Include it in your GitHub Pages site
3. Configure tracking variables
4. Deploy and monitor external link activity

## License

MIT License - feel free to use in your projects.

## Contributing

Contributions welcome! Please test with the provided `example.html` file before submitting changes.
