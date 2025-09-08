// language switcher

$(document).ready(function() {
  let currentLang = 'it'; // default

  function switchLang(lang) {
    $('[data-lang]').each(function() {
      if ($(this).attr('data-lang') === lang) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
    $('#en-it').text(lang === 'en' ? 'IT' : 'EN');
    currentLang = lang;
  }
  switchLang(currentLang);
  $('#en-it').click(function() {
    const newLang = currentLang === 'en' ? 'it' : 'en';
    switchLang(newLang);
  });
});

const langButton = document.getElementById('en-it');
window.addEventListener('scroll', () => {
  if (window.scrollY > 100) {
    langButton.classList.add('active');
  } else {
    langButton.classList.remove('active');
  }
});