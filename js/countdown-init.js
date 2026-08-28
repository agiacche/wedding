/**
 * Countdown initialisation (SimplyCountdown.js)
 *
 * Wedding:
 * 30 August 2026, 13:30 CEST (Italy)
 * = 30 August 2026, 11:30 UTC
 *
 * Using UTC ensures that all visitors count down to the same instant,
 * regardless of their local time zone.
 */

$(document).ready(function () {
  const countdownSelectors = [
    '.simply-countdown-one',
    '#simply-countdown-losange'
  ];

  countdownSelectors.forEach(selector => {
    $(selector).simplyCountdown({
      year: 2026,
      month: 8,
      day: 30,
      hours: 11,
      minutes: 30,
      seconds: 0,
      enableUtc: true
    });
  });
});