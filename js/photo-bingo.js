/**
 * Photo Bingo
 *
 * - Tap a card to mark/unmark it.
 * - Progress is stored locally on the guest's device.
 * - No login, backend, cookies or server storage.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'alessandro-silvia-photo-bingo-v1';

  const cards = Array.from(document.querySelectorAll('.photo-bingo-card'));
  const progressCount = document.getElementById('bingo-progress-count');
  const progressBar = document.getElementById('bingo-progress-bar');
  const completeMessage = document.getElementById('bingo-complete');
  const resetButton = document.getElementById('bingo-reset');

  if (!cards.length) return;

  function loadCompleted() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(stored) ? stored.map(String) : [];
    } catch (error) {
      return [];
    }
  }

  let completed = new Set(loadCompleted());

  function saveCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(completed)));
    } catch (error) {
      // The game still works if localStorage is unavailable;
      // progress simply will not survive a refresh.
    }
  }

  function render() {
    cards.forEach(function (card) {
      const id = String(card.dataset.bingoId);
      const isComplete = completed.has(id);

      card.classList.toggle('is-complete', isComplete);
      card.setAttribute('aria-pressed', isComplete ? 'true' : 'false');
    });

    const done = completed.size;
    const total = cards.length;
    const percent = total ? (done / total) * 100 : 0;

    if (progressCount) {
      progressCount.textContent = done + ' / ' + total;
    }

    if (progressBar) {
      progressBar.style.width = percent + '%';
    }

    if (completeMessage) {
      completeMessage.hidden = done !== total;
    }
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      const id = String(card.dataset.bingoId);

      if (completed.has(id)) {
        completed.delete(id);
      } else {
        completed.add(id);
      }

      saveCompleted();
      render();
    });
  });

  if (resetButton) {
    resetButton.addEventListener('click', function () {
      const italianIsActive = !document.getElementById('en-it')?.checked;
      const question = italianIsActive
        ? 'Vuoi davvero azzerare il Foto Bingo?'
        : 'Do you really want to reset the Photo Bingo?';

      if (!window.confirm(question)) return;

      completed.clear();
      saveCompleted();
      render();

      window.scrollTo({
        top: document.querySelector('.photo-bingo-progress-wrap')?.offsetTop - 30 || 0,
        behavior: 'smooth'
      });
    });
  }

  render();
})();
