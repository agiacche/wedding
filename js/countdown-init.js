/**
 * Countdown initialisation (SimplyCountdown.js)
 *
 * This script initialises the wedding countdown in all places where
 * a SimplyCountdown widget is present.
 *
 * It is intentionally kept separate from simplyCountdown.js itself:
 * - simplyCountdown.js = third-party library (do not edit)
 * - this file = site-specific configuration (date, selectors)
 *
 * Requirements:
 * - jQuery loaded
 * - simplyCountdown.js loaded before this script
 */

$(document).ready(function () {

  /**
   * Wedding date
   * NOTE:
   * - Months are 0-based in JavaScript Date (7 = August)
   * - Time is interpreted in the *viewer’s local time zone*
   */
  const weddingDate = new Date(2026, 7, 30, 13, 30, 0);

  /**
   * All DOM locations where the countdown should appear.
   * We initialise the same countdown in multiple places using selectors.
   */
  const countdownSelectors = [
    '.simply-countdown-one',
    '#simply-countdown-losange'
  ];

  /**
   * Initialise SimplyCountdown for each selector
   */
  countdownSelectors.forEach(selector => {
    $(selector).simplyCountdown({
      year:    weddingDate.getFullYear(),
      month:   weddingDate.getMonth() + 1, // convert from 0-based
      day:     weddingDate.getDate(),
      hours:   weddingDate.getHours(),
      minutes: weddingDate.getMinutes(),
      seconds: weddingDate.getSeconds(),

      // Use local time of the visitor (important for international guests)
      enableUtc: false
    });
  });

});