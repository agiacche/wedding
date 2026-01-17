/**
 * Galleries (Magnific Popup)
 * - Binds the Magnific Popup lightbox to each gallery group on the page.
 * - Most galleries are image-only (standard lightbox with arrows).
 * - The "Nacho" gallery is mixed content: images + an optional inline item
 *   (e.g. hidden markup) and/or video files.
 *
 * Requirements:
 * - jQuery loaded before this file
 * - Magnific Popup JS + CSS loaded
 *
 * Naming convention:
 * - Each gallery is identified by a CSS class on the <a> elements
 *   (e.g. <a class="gallery-2024" href="...">...</a>).
 */
$(document).ready(function () {

  /**
   * Helper: common config for image-only galleries.
   * `titleSrc: 'title'` means it uses the anchor's `title=""` attribute as caption.
   */
  function bindImageGallery(selector) {
    $(selector).magnificPopup({
      type: 'image',
      gallery: { enabled: true },      // enable next/prev arrows
      image: { titleSrc: 'title' },    // caption source (HTML title attribute)
      removalDelay: 300,               // helps the fade-out feel smoother
      mainClass: 'mfp-fade'            // uses the CSS fade transition
    });
  }

  // --- Image-only galleries (years + "before") ---
  bindImageGallery('.gallery-before');
  bindImageGallery('.gallery-2017');
  bindImageGallery('.gallery-2018');
  bindImageGallery('.gallery-2019');
  bindImageGallery('.gallery-2020');
  bindImageGallery('.gallery-2021');
  bindImageGallery('.gallery-2022');
  bindImageGallery('.gallery-2023');
  bindImageGallery('.gallery-2024');
  bindImageGallery('.gallery-2025');
  bindImageGallery('.gallery-2026');

  /**
   * Mixed gallery: images + inline content + videos.
   *
   * elementParse lets us decide, per clicked item, what content type it is:
   * - href starts with "#" => inline popup (uses an element already in the page)
   * - href ends with .mp4/.mov/.webm => treat as iframe (Magnific plays it)
   * - otherwise => image
   *
   * NOTE: Magnific Popup's "iframe" type works best with embeddable URLs
   * (YouTube/Vimeo). For direct MP4 links, behaviour depends on browser.
   * If you want guaranteed HTML5 video playback, we can switch to `type: 'inline'`
   * and inject a <video controls> element instead.
   */
  $('.gallery-Nacho').magnificPopup({
    gallery: { enabled: true },
    removalDelay: 300,
    mainClass: 'mfp-fade',
    image: { titleSrc: 'title' },

    callbacks: {
      elementParse: function (item) {
        // Inline item (e.g. href="#nacho-video")
        if (item.src.charAt(0) === '#') {
          item.type = 'inline';
          return;
        }

        // Direct video file (best-effort)
        if (/\.(mp4|mov|webm)$/i.test(item.src)) {
          item.type = 'iframe';
          return;
        }

        // Default: image
        item.type = 'image';
      }
    }
  });

});