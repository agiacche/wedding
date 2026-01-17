/**
 * Language switcher (EN / IT)
 *
 * This script handles:
 * - Toggling bilingual content using data attributes
 * - Activating the language toggle UI
 *
 * Language handling is intentionally simple:
 * - No persistence (language resets on refresh)
 * - No framework or build step
 * - Pure DOM + jQuery
 */

$(document).ready(function () {

  /**
   * Current language
   * Default: Italian
   */
  let currentLang = 'it';

  /**
   * Switch visible language
   *
   * Elements must declare:
   *   data-lang="it" or data-lang="en"
   *
   * Only elements matching the active language are shown.
   */
  function switchLang(lang) {
    $('[data-lang]').each(function () {
      $(this).toggle($(this).attr('data-lang') === lang);
    });

    /**
     * Sync toggle UI
     * Convention:
     * - unchecked = IT
     * - checked   = EN
     */
    $('#en-it').prop('checked', lang === 'en');

    currentLang = lang;
  }

  // Initialise page with default language
  switchLang(currentLang);

  /**
   * React to toggle changes
   */
  $('#en-it').on('change', function () {
    const newLang = this.checked ? 'en' : 'it';
    switchLang(newLang);
  });

});


/**
 * Language toggle visibility / behaviour on scroll
 *
 * The toggle is shown as soon as JS runs
 * (password gate or other overlays may delay visibility via CSS).
 *
 * The scroll handler is intentionally minimal:
 * - Adds `.active` after the user scrolls a bit
 * - Allows CSS to handle transitions / opacity
 */

const langButton = document.querySelector('.lang-toggle-wrap');

// Make toggle visible once JS is active
if (langButton) {
  langButton.classList.add('active');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      langButton.classList.add('active');
    }
  });
}