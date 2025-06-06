/**
 * Download Link Tracker
 * Tracks clicks on external links and opens them in new windows
 * Requires jQuery for AJAX functionality
 */

(function () {
  'use strict';

  function track_clicks(anchor, custom_mt_id = '') {
    let href = anchor.getAttribute("href");
    if (!href) {
      return;
    }

    let my_mt_id = custom_mt_id || window.mt_id;
    let my_tracker_url = window.tracker_url || 'https://track.door43.org/track';

    if (!my_mt_id) {
      console.warn("No mt_id provided for tracking. This must be supplied in the HTML as a JavaScript variable mt_id or as a 2nd parameter.");
      return;
    }

    let download_url = href;
    let filename = '';
    let ext = '';
    let lang = 'en';
    let category = 'stories'

    const urlObj = new URL(download_url);

    filename = urlObj.pathname.split('/').pop() || '';
    ext = filename.slice(filename.lastIndexOf(".")) || '';

    // Check if the domain is preview and set extension to pdf as we'll assume that's what they are after
    try {
      if (urlObj.hostname.includes('preview.door43.org')) {
        ext = 'pdf';
        // For preview.door43.org URLs, extract the 3rd path segment as filename
        const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
        if (pathSegments.length >= 3) {
          filename = pathSegments[2] + '_preview-door43-org.pdf';
        }
      }
    } catch (e) {
      // Invalid URL, continue with existing logic
    }

    if (!ext) {
      console.warn("No file extension found in the URL. Cannot track this download.");
      return;
    }
    console.log("Extension found:", ext);

    if (['pdf', 'docx', 'epub', 'odt'].includes(ext)) {
      if (filename.includes('obs-tq'))
        category = 'tq';
      else if (filename.includes('obs-tn'))
        category = 'tn';
      else if (filename.includes('obs-sn'))
        category = 'sn';
      else if (filename.includes('obs-sq'))
        category = 'sq';
    } else if (['mp3', '3gp'].includes(ext))
      category = 'audio';
    else if (['mp4'].includes(ext))
      category = 'video';
    else if (['zip'].includes(ext)) {
      if (filename.includes('mp3'))
        category = 'audio';
      else if (filename.includes('mp4') || filename.includes('3gp'))
        category = 'video';
    } else if (filename.includes('obs-tq'))
      category = 'tq';
    else if (filename.includes('obs-tn'))
      category = 'tn';
    else if (filename.includes('obs-sn'))
      category = 'sn';
    else if (filename.includes('obs-sq'))
      category = 'sq';

    if (!category) {
      console.warn("No category determined for the file. Cannot track this download.");
      return;
    }

    const url = `${my_tracker_url}?mt_id=${encodeURIComponent(my_mt_id)}&mt_lang=${encodeURIComponent(lang)}&mt_file=${encodeURIComponent(filename)}&mt_category=${encodeURIComponent(category)}`;
    console.log("Tracking URL: ", url);

    // Use jQuery if available, otherwise use fetch
    if (window.jQuery && window.jQuery.ajax) {
      window.jQuery.ajax({
        url: url,
      });
    } else {
      fetch(url).catch(function (error) {
        console.warn('Tracking request failed:', error);
      });
    }
  }

  // Function to check if a URL is external
  function isExternalLink(href) {
    if (!href) return false;

    // Handle relative URLs (always internal)
    if (href.startsWith('/') || href.startsWith('./') || href.startsWith('../')) {
      return false;
    }

    // Handle protocol-relative URLs
    if (href.startsWith('//')) {
      href = 'https:' + href;
    }

    // Handle URLs without protocol
    if (!href.startsWith('http://') && !href.startsWith('https://')) {
      return false;
    }

    try {
      const url = new URL(href);
      const currentDomain = window.location.hostname.toLowerCase();
      const linkDomain = url.hostname.toLowerCase();

      // Check if it's the same domain or subdomain of current site
      if (linkDomain === currentDomain || linkDomain.endsWith('.' + currentDomain) || currentDomain.endsWith('.' + linkDomain)) {
        return false;
      }

      // It's an external domain
      return true;
    } catch (e) {
      return false;
    }
  }

  // Function to handle external link clicks
  function handleExternalLinkClick(event, anchor) {
    event.preventDefault();

    // Call track_clicks first
    track_clicks(anchor);

    // Small delay to allow tracking request to be sent, then open link
    setTimeout(function () {
      window.open(anchor.href, '_blank', 'noopener,noreferrer');
    }, 100);
  }

  // Function to process existing and new anchor elements
  function processAnchors(container = document) {
    const anchors = container.querySelectorAll('a[href]');

    anchors.forEach(function (anchor) {
      // Skip if already processed
      if (anchor.hasAttribute('data-external-tracked')) {
        return;
      }

      const href = anchor.getAttribute('href');
      if (isExternalLink(href)) {
        // Mark as processed
        anchor.setAttribute('data-external-tracked', 'true');

        // Add click event listener
        anchor.addEventListener('click', function (event) {
          handleExternalLinkClick(event, anchor);
        });

        console.log('Download link tracking added for:', href);
      }
    });
  }

  // Initialize MutationObserver to watch for dynamically added content
  function initializeExternalLinkTracker() {
    // Process existing links
    processAnchors();

    // Create observer for new content
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          // Process if it's an element node
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the node itself is an anchor
            if (node.tagName === 'A' && node.hasAttribute('href')) {
              processAnchors(node.parentElement);
            } else {
              // Check for anchor descendants
              processAnchors(node);
            }
          }
        });
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    console.log('Download link tracker initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeExternalLinkTracker);
  } else {
    initializeExternalLinkTracker();
  }

  // Expose track_clicks function globally for manual use
  window.track_clicks = track_clicks;

})();
