/**
 * Password gate (client-side)
 * - Shows a modal overlay asking for a password.
 * - Locks page scrolling while the overlay is visible.
 * - Stores an "unlocked" flag in sessionStorage, so refreshes in the same tab
 *   won't ask again until the tab/window is closed.
 *
 * NOTE: This is a light deterrent only (password is visible in source).
 */
(function () {
  // Password required to enter the site (client-side, not secure)
  const PASSWORD = "ale&silvia-2026";

  // Cache DOM elements used by the gate
  const gate   = document.getElementById("password-gate");
  const input  = document.getElementById("password-input");
  const button = document.getElementById("password-submit");
  const error  = gate.querySelector(".password-error");

  // Used to restore scroll position when unlocking
  let lastScrollY = 0;

  // If already unlocked for this browser tab/session, remove gate immediately
  if (sessionStorage.getItem("site_unlocked") === "1") {
    gate.remove();
    return;
  }

  /**
   * Prevent background scrolling while the password gate is open.
   * We store the current scroll position and "freeze" the body in place.
   */
  function lockScroll() {
    lastScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add("password-locked");
    // Keep the page visually at the same position even though body is fixed
    document.body.style.top = (-lastScrollY) + "px";
  }

  /**
   * Re-enable scrolling and restore the previous scroll position.
   */
  function unlockScroll() {
    document.body.classList.remove("password-locked");
    document.body.style.top = "";
    window.scrollTo(0, lastScrollY);
  }

  /**
   * Show the password gate with a fade-in animation.
   * requestAnimationFrame ensures the initial CSS state is applied first,
   * then we add the class that triggers the transition.
   */
  function showGate() {
    lockScroll();
    gate.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      gate.classList.add("is-visible");
      input.focus();
    });
  }

  /**
   * Hide the password gate with a fade-out animation,
   * then remove it from the DOM once the transition has finished.
   */
  function hideGate() {
    // Start fade out
    gate.classList.add("is-hiding");
    gate.classList.remove("is-visible");
    gate.setAttribute("aria-hidden", "true");

    // After transition ends, unlock + remove
    setTimeout(() => {
      unlockScroll();
      gate.remove();
    }, 300); // should be slightly > CSS transition duration (e.g. 0.28s)
  }

  /**
   * Validate the entered password.
   * - If correct: mark session unlocked and close the gate.
   * - If wrong: show error message and reset input.
   */
  function checkPassword() {
    if (input.value === PASSWORD) {
      sessionStorage.setItem("site_unlocked", "1");
      hideGate();
    } else {
      error.style.display = "block";
      input.value = "";
      input.focus();
    }
  }

  // Button click submits password
  button.addEventListener("click", checkPassword);

  // Pressing Enter in the input submits password
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkPassword();
  });

  // Start: show the gate immediately on page load
  showGate();
})();