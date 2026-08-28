/**
 * Language switcher (EN / IT)
 *
 * - Toggles bilingual content using data-lang attributes
 * - Remembers the selected language in localStorage
 * - Shares the preference across all pages of the site
 */

$(document).ready(function () {
  const STORAGE_KEY = 'wedding-language';

  /**
   * Restore the previously selected language.
   * Italian remains the default.
   */
  let currentLang = 'it';

  try {
    const storedLang = localStorage.getItem(STORAGE_KEY);

    if (storedLang === 'it' || storedLang === 'en') {
      currentLang = storedLang;
    }
  } catch (error) {
    // If localStorage is unavailable, simply use Italian.
  }

  function switchLang(lang) {
    $('[data-lang]').each(function () {
      $(this).toggle($(this).attr('data-lang') === lang);
    });

    /**
     * Toggle convention:
     * unchecked = IT
     * checked   = EN
     */
    $('#en-it').prop('checked', lang === 'en');

    currentLang = lang;

    /**
     * Also update the document language for accessibility.
     */
    document.documentElement.lang = lang;

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      // Language switching still works without persistence.
    }
  }

  switchLang(currentLang);

  $('#en-it').on('change', function () {
    switchLang(this.checked ? 'en' : 'it');
  });
});


/**
 * Language toggle visibility / behaviour on scroll
 */
const langButton = document.querySelector('.lang-toggle-wrap');

if (langButton) {
  langButton.classList.add('active');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      langButton.classList.add('active');
    }
  });
}