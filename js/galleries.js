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

  /* ------------------------------------------------------------------------
   * Scroll lock (prevents background page scrolling while the lightbox is open)
   * Uses a body class + fixed positioning, which works well on mobile/iOS.
   * ------------------------------------------------------------------------ */
  let lastScrollY = 0;

  function lockPageScroll() {
    lastScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("mfp-scroll-lock");
    document.body.style.top = (-lastScrollY) + "px";
  }

  function unlockPageScroll() {
    document.body.classList.remove("mfp-scroll-lock");
    document.body.style.top = "";
    window.scrollTo(0, lastScrollY);
  }

  /* ------------------------------------------------------------------------
   * Swipe + slide-like transition BETWEEN items
   *
   * NOTE: This expects the CSS classes below to exist in your custom CSS:
   *   .mfp-img { transition: transform 220ms ease, opacity 220ms ease; }
   *   .mfp-img.mfp-swipe-out-left  { transform: translateX(-40px); opacity: 0; }
   *   .mfp-img.mfp-swipe-out-right { transform: translateX(40px);  opacity: 0; }
   *   .mfp-img.mfp-swipe-in-left   { transform: translateX(40px);  opacity: 0; }
   *   .mfp-img.mfp-swipe-in-right  { transform: translateX(-40px); opacity: 0; }
   * ------------------------------------------------------------------------ */
  function enableSwipeAndSlide(instance) {
    if (!instance) return;

    let lastIndex = instance.index || 0;

    function getImgEl() {
      // instance.content is a jQuery element
      return (instance.content && instance.content.find)
        ? instance.content.find('img.mfp-img')
        : null;
    }

    // --- Swipe gesture (touch) ---
    let startX = 0;
    let startY = 0;
    let tracking = false;

    const threshold = 50;  // px swipe distance
    const restraint = 80;  // max vertical movement allowed

    function onTouchStart(e) {
      const touches = e.originalEvent.touches;
      if (!touches || !touches.length) return;
      const t = touches[0];

      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    }

    function onTouchEnd(e) {
      if (!tracking) return;
      tracking = false;

      const changed = e.originalEvent.changedTouches;
      if (!changed || !changed.length) return;
      const t = changed[0];

      const dx = t.clientX - startX;
      const dy = t.clientY - startY;

      // horizontal swipe only (avoid hijacking vertical movement)
      if (Math.abs(dx) > threshold && Math.abs(dy) < restraint) {
        if (dx < 0) instance.next();
        else instance.prev();
      }
    }

    // Bind swipe on the popup wrapper
    $(document).on('touchstart.mfpSwipe', '.mfp-wrap', onTouchStart);
    $(document).on('touchend.mfpSwipe', '.mfp-wrap', onTouchEnd);

    // --- Slide-like "out" on next/prev BEFORE content swaps ---
    const origNext = instance.next;
    instance.next = function () {
      const img = getImgEl();
      if (img && img.length) img.addClass('mfp-swipe-out-left');
      return origNext.apply(this, arguments);
    };

    const origPrev = instance.prev;
    instance.prev = function () {
      const img = getImgEl();
      if (img && img.length) img.addClass('mfp-swipe-out-right');
      return origPrev.apply(this, arguments);
    };

    // --- Slide-like "in" when new content is ready ---
    // We hook into updateStatus, but keep any existing callback if present.
    instance.st.callbacks = instance.st.callbacks || {};
    const userUpdateStatus = instance.st.callbacks.updateStatus;

    instance.st.callbacks.updateStatus = function (data) {
      if (typeof userUpdateStatus === "function") userUpdateStatus.call(this, data);
      if (!data || data.status !== "ready") return;

      const img = getImgEl();
      if (!img || !img.length) return;

      const newIndex = instance.index;
      const dir = (newIndex >= lastIndex) ? "left" : "right";

      // Reset any previous classes
      img.removeClass('mfp-swipe-in-left mfp-swipe-in-right mfp-swipe-out-left mfp-swipe-out-right');

      // Start slightly offscreen (opposite direction) then animate into place
      img.addClass(dir === "left" ? "mfp-swipe-in-left" : "mfp-swipe-in-right");

      requestAnimationFrame(() => {
        img.removeClass('mfp-swipe-in-left mfp-swipe-in-right');
      });

      lastIndex = newIndex;
    };
  }

  function disableSwipe() {
    $(document).off('.mfpSwipe');
  }

  /**
   * Helper: common config for image-only galleries.
   * `titleSrc: 'title'` means it uses the anchor's `title=""` attribute as caption.
   */
  function bindImageGallery(selector) {
    $(selector).magnificPopup({
      type: 'image',
      gallery: { enabled: true },
      image: { titleSrc: 'title' },

      // open/close animation class (your custom CSS can animate this)
      removalDelay: 250,
      mainClass: 'mfp-move-horizontal',

      callbacks: {
        beforeOpen: function () {
          // adds mfp-with-anim so the CSS can animate the opening
          this.st.image.markup = this.st.image.markup.replace(
            'mfp-figure',
            'mfp-figure mfp-with-anim'
          );
        },

        open: function () {
          // lock background scroll + enable swipe/slide transitions
          lockPageScroll();
          enableSwipeAndSlide($.magnificPopup.instance);
        },

        close: function () {
          // unlock scroll + cleanup swipe listeners
          disableSwipe();
          unlockPageScroll();
        }
      }
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
   */
  $('.gallery-Nacho').magnificPopup({
    gallery: { enabled: true },
    removalDelay: 250,
    mainClass: 'mfp-move-horizontal',
    image: { titleSrc: 'title' },

    callbacks: {
      beforeOpen: function () {
        // only applies to image markup; safe to keep
        this.st.image.markup = this.st.image.markup.replace(
          'mfp-figure',
          'mfp-figure mfp-with-anim'
        );
      },

      open: function () {
        lockPageScroll();
        enableSwipeAndSlide($.magnificPopup.instance);
      },

      close: function () {
        disableSwipe();
        unlockPageScroll();
      },

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