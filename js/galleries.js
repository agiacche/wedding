/**
 * Accessible fullscreen media viewer.
 *
 * The gallery grid and its URLs remain unchanged. This file only replaces the
 * viewer previously supplied by Magnific Popup, keeping the implementation
 * dependency-free and deliberately small.
 */
(function () {
  'use strict';

  const galleryLinks = Array.from(document.querySelectorAll('a[class*="gallery-"]'));
  const galleryOpeners = Array.from(document.querySelectorAll('[data-gallery-open]'));
  if (!galleryLinks.length) return;

  const labels = {
    en: {
      dialog: 'Fullscreen media viewer', close: 'Close viewer', previous: 'Previous item',
      next: 'Next item', photo: 'Wedding gallery photo', of: 'of'
    },
    it: {
      dialog: 'Visualizzatore multimediale a schermo intero', close: 'Chiudi visualizzatore',
      previous: 'Elemento precedente', next: 'Elemento successivo',
      photo: 'Foto della galleria del matrimonio', of: 'di'
    }
  };

  const viewer = document.createElement('div');
  viewer.className = 'media-viewer';
  viewer.hidden = true;
  viewer.setAttribute('role', 'dialog');
  viewer.setAttribute('aria-modal', 'true');
  viewer.setAttribute('aria-describedby', 'media-viewer-caption');
  viewer.innerHTML = [
    '<div class="media-viewer__topbar">',
    '  <span class="media-viewer__counter" aria-live="polite"></span>',
    '  <button class="media-viewer__close" type="button"><span aria-hidden="true">×</span></button>',
    '</div>',
    '<button class="media-viewer__nav media-viewer__nav--prev" type="button"><span aria-hidden="true">‹</span></button>',
    '<div class="media-viewer__stage" tabindex="-1">',
    '  <div class="media-viewer__media"></div>',
    '  <div class="media-viewer__loading" role="status"><span class="sr-only">Loading</span></div>',
    '</div>',
    '<button class="media-viewer__nav media-viewer__nav--next" type="button"><span aria-hidden="true">›</span></button>',
    '<div class="media-viewer__caption" id="media-viewer-caption"></div>'
  ].join('');
  document.body.appendChild(viewer);

  const mediaHost = viewer.querySelector('.media-viewer__media');
  const stage = viewer.querySelector('.media-viewer__stage');
  const counter = viewer.querySelector('.media-viewer__counter');
  const caption = viewer.querySelector('.media-viewer__caption');
  const closeButton = viewer.querySelector('.media-viewer__close');
  const previousButton = viewer.querySelector('.media-viewer__nav--prev');
  const nextButton = viewer.querySelector('.media-viewer__nav--next');

  let items = [];
  let index = 0;
  let opener = null;
  let scrollY = 0;
  let currentMedia = null;
  let adjacentImages = [];
  let closeTimer = null;
  let scale = 1;
  let panX = 0;
  let panY = 0;
  let gesture = null;
  let lastTap = null;

  function language() {
    return document.documentElement.lang === 'en' ? 'en' : 'it';
  }

  function galleryClass(link) {
    return Array.from(link.classList).find(function (name) {
      return name.indexOf('gallery-') === 0;
    });
  }

  function sourcesFor(link) {
    const href = link.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return [];
    const inlineVideo = document.querySelector(href + ' video');
    if (!inlineVideo) return [];
    return Array.from(inlineVideo.querySelectorAll('source')).map(function (source) {
      return { src: source.getAttribute('src'), type: source.getAttribute('type') || '' };
    }).filter(function (source) { return source.src; });
  }

  function itemFor(link) {
    const href = link.getAttribute('href') || '';
    const videoSources = sourcesFor(link);
    return {
      caption: link.getAttribute('title') || '',
      src: href,
      type: videoSources.length || /\.(mp4|mov|webm)(?:$|[?#])/i.test(href) ? 'video' : 'image',
      videoSources: videoSources
    };
  }

  function updateLabels() {
    const text = labels[language()];
    viewer.setAttribute('aria-label', text.dialog);
    closeButton.setAttribute('aria-label', text.close);
    previousButton.setAttribute('aria-label', text.previous);
    nextButton.setAttribute('aria-label', text.next);
  }

  function lockPage() {
    scrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = (-scrollY) + 'px';
    document.body.classList.add('media-viewer-open');
    const page = document.getElementById('page');
    const languageToggle = document.querySelector('.lang-toggle-wrap');
    if (page) {
      page.setAttribute('aria-hidden', 'true');
      if ('inert' in page) page.inert = true;
    }
    if (languageToggle) languageToggle.setAttribute('aria-hidden', 'true');
  }

  function unlockPage() {
    const page = document.getElementById('page');
    const languageToggle = document.querySelector('.lang-toggle-wrap');
    if (page) {
      page.removeAttribute('aria-hidden');
      if ('inert' in page) page.inert = false;
    }
    if (languageToggle) languageToggle.removeAttribute('aria-hidden');
    document.body.classList.remove('media-viewer-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
  }

  function cleanupMedia() {
    if (currentMedia && currentMedia.tagName === 'VIDEO') {
      currentMedia.pause();
      Array.from(currentMedia.querySelectorAll('source')).forEach(function (source) {
        source.removeAttribute('src');
      });
      currentMedia.removeAttribute('src');
      currentMedia.load();
    }
    mediaHost.textContent = '';
    currentMedia = null;
    adjacentImages = [];
  }

  function setTransform(animate) {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    currentMedia.classList.toggle('is-zoom-animating', Boolean(animate));
    currentMedia.style.transform = 'translate3d(' + panX + 'px,' + panY + 'px,0) scale(' + scale + ')';
    stage.classList.toggle('is-zoomed', scale > 1);
  }

  function resetZoom() {
    scale = 1;
    panX = 0;
    panY = 0;
    stage.classList.remove('is-zoomed');
    setTransform(false);
  }

  function toggleZoom(clientX, clientY) {
    if (!currentMedia || currentMedia.tagName !== 'IMG') return;
    if (scale > 1) {
      scale = 1;
      panX = 0;
      panY = 0;
    } else {
      scale = 2.25;
      const rect = stage.getBoundingClientRect();
      panX = (rect.left + rect.width / 2 - clientX) * 0.55;
      panY = (rect.top + rect.height / 2 - clientY) * 0.55;
    }
    setTransform(true);
  }

  function preloadAdjacent() {
    adjacentImages = [];
    if (items.length < 2) return;
    const candidates = [items[(index - 1 + items.length) % items.length], items[(index + 1) % items.length]];
    const seen = new Set();
    candidates.forEach(function (item) {
      if (item.type !== 'image' || seen.has(item.src)) return;
      seen.add(item.src);
      const image = new Image();
      image.decoding = 'async';
      image.src = item.src;
      adjacentImages.push(image);
    });
  }

  function render(direction) {
    cleanupMedia();
    resetZoom();
    updateLabels();

    const item = items[index];
    const text = labels[language()];
    viewer.classList.add('is-loading');
    counter.textContent = (index + 1) + ' ' + text.of + ' ' + items.length;
    caption.textContent = item.caption;
    caption.hidden = !item.caption;

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.preload = 'metadata';
      video.setAttribute('aria-label', item.caption || 'Video');
      const sources = item.videoSources.length ? item.videoSources : [{ src: item.src, type: '' }];
      sources.forEach(function (entry) {
        const source = document.createElement('source');
        source.src = entry.src;
        if (entry.type) source.type = entry.type;
        video.appendChild(source);
      });
      video.addEventListener('loadedmetadata', function () { viewer.classList.remove('is-loading'); }, { once: true });
      video.addEventListener('canplay', function () { viewer.classList.remove('is-loading'); }, { once: true });
      currentMedia = video;
    } else {
      const image = document.createElement('img');
      image.src = item.src;
      image.alt = item.caption || text.photo;
      image.decoding = 'async';
      image.draggable = false;
      image.addEventListener('load', function () { viewer.classList.remove('is-loading'); }, { once: true });
      image.addEventListener('error', function () { viewer.classList.remove('is-loading'); }, { once: true });
      currentMedia = image;
    }

    currentMedia.className = 'media-viewer__asset media-viewer__asset--' + item.type;
    if (direction) currentMedia.classList.add(direction === 'next' ? 'from-right' : 'from-left');
    mediaHost.appendChild(currentMedia);
    requestAnimationFrame(function () {
      if (currentMedia) currentMedia.classList.add('is-visible');
    });
    preloadAdjacent();
  }

  function show(newIndex, direction) {
    if (!items.length) return;
    index = (newIndex + items.length) % items.length;
    render(direction);
  }

  function next() { show(index + 1, 'next'); }
  function previous() { show(index - 1, 'previous'); }

  function open(link, trigger) {
    const group = galleryClass(link);
    if (!group) return;
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    const links = galleryLinks.filter(function (candidate) { return candidate.classList.contains(group); });
    items = links.map(itemFor);
    index = Math.max(0, links.indexOf(link));
    opener = trigger || link;
    lockPage();
    viewer.hidden = false;
    requestAnimationFrame(function () { viewer.classList.add('is-open'); });
    render();
    closeButton.focus();
  }

  function close() {
    if (viewer.hidden) return;
    const focusTarget = opener;
    viewer.classList.remove('is-open');
    cleanupMedia();
    closeTimer = window.setTimeout(function () {
      viewer.hidden = true;
      unlockPage();
      if (focusTarget && document.contains(focusTarget)) focusTarget.focus();
      opener = null;
      items = [];
      closeTimer = null;
    }, 180);
  }

  galleryLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      open(link, link);
    });
  });

  galleryOpeners.forEach(function (trigger) {
    trigger.addEventListener('click', function (event) {
      const group = trigger.getAttribute('data-gallery-open');
      const firstLink = galleryLinks.find(function (link) {
        return link.classList.contains(group);
      });
      if (!firstLink) return;
      event.preventDefault();
      open(firstLink, trigger);
    });
  });

  closeButton.addEventListener('click', close);
  previousButton.addEventListener('click', previous);
  nextButton.addEventListener('click', next);
  viewer.addEventListener('click', function (event) {
    if (event.target === viewer) close();
  });
  stage.addEventListener('dblclick', function (event) {
    toggleZoom(event.clientX, event.clientY);
  });

  document.addEventListener('keydown', function (event) {
    if (viewer.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    } else if (event.key === 'Tab') {
      const focusable = Array.from(viewer.querySelectorAll('button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  function distance(a, b) {
    return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
  }

  stage.addEventListener('touchstart', function (event) {
    if (event.touches.length === 2 && currentMedia && currentMedia.tagName === 'IMG') {
      gesture = {
        type: 'pinch', startDistance: distance(event.touches[0], event.touches[1]),
        startScale: scale
      };
      return;
    }
    if (event.touches.length !== 1) return;
    const touch = event.touches[0];
    gesture = {
      type: scale > 1 ? 'pan' : 'swipe', startX: touch.clientX, startY: touch.clientY,
      originX: panX, originY: panY, started: Date.now()
    };
  }, { passive: true });

  stage.addEventListener('touchmove', function (event) {
    if (!gesture) return;
    if (gesture.type === 'pinch' && event.touches.length === 2) {
      event.preventDefault();
      scale = Math.min(4, Math.max(1, gesture.startScale * distance(event.touches[0], event.touches[1]) / gesture.startDistance));
      if (scale === 1) { panX = 0; panY = 0; }
      setTransform(false);
    } else if (gesture.type === 'pan' && event.touches.length === 1) {
      event.preventDefault();
      panX = gesture.originX + event.touches[0].clientX - gesture.startX;
      panY = gesture.originY + event.touches[0].clientY - gesture.startY;
      setTransform(false);
    }
  }, { passive: false });

  stage.addEventListener('touchend', function (event) {
    if (!gesture) return;
    const ended = event.changedTouches[0];
	const startX = gesture.startX == null ? (ended ? ended.clientX : 0) : gesture.startX;
	const startY = gesture.startY == null ? (ended ? ended.clientY : 0) : gesture.startY;
    const dx = ended ? ended.clientX - startX : 0;
    const dy = ended ? ended.clientY - startY : 0;

    if (gesture.type === 'swipe' && Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      dx < 0 ? next() : previous();
      lastTap = null;
	} else if ((gesture.type === 'swipe' || gesture.type === 'pan') && ended && Date.now() - gesture.started < 260 && Math.abs(dx) < 18 && Math.abs(dy) < 18) {
      const tap = { x: ended.clientX, y: ended.clientY, time: Date.now() };
      if (lastTap && tap.time - lastTap.time < 320 && Math.hypot(tap.x - lastTap.x, tap.y - lastTap.y) < 32) {
        toggleZoom(tap.x, tap.y);
        lastTap = null;
      } else {
        lastTap = tap;
      }
    }
    gesture = null;
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (!viewer.hidden && scale === 1) {
      panX = 0;
      panY = 0;
      setTransform(false);
    }
  });
})();
