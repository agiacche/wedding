// language switcher (toggle)

$(document).ready(function () {
  let currentLang = 'it'; // default

  function switchLang(lang) {
    $('[data-lang]').each(function () {
      $(this).toggle($(this).attr('data-lang') === lang);
    });

    // checked = EN
    $('#en-it').prop('checked', lang === 'en');
    currentLang = lang;
  }

  switchLang(currentLang);

  // When toggle changes
  $('#en-it').on('change', function () {
    const newLang = this.checked ? 'en' : 'it';
    switchLang(newLang);
  });
});

// Scroll behaviour (apply "active" to wrapper)
const langButton = document.querySelector('.lang-toggle-wrap');
langButton.classList.add('active');

window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    langButton.classList.add('active');
  }
});