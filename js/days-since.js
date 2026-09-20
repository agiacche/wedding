/**
 * Shows complete 24-hour periods elapsed since the wedding instant.
 * The timestamp is the same one configured by the former countdown:
 * 30 August 2026, 13:30 CEST = 30 August 2026, 11:30 UTC.
 */
(function () {
  'use strict';

  const weddingTimestamp = Date.UTC(2026, 7, 30, 11, 30, 0);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const counters = Array.from(document.querySelectorAll('[data-days-since]'));

  if (!counters.length) return;

  function completeDaysSinceWedding() {
    return Math.max(0, Math.floor((Date.now() - weddingTimestamp) / millisecondsPerDay));
  }

  function update() {
    const days = String(completeDaysSinceWedding());
    counters.forEach(function (counter) {
      counter.querySelectorAll('[data-days-since-value]').forEach(function (value) {
        value.textContent = days;
      });
    });
  }

  update();
  window.setInterval(update, 60 * 1000);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) update();
  });
})();
