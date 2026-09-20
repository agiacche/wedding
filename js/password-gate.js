/**
 * Password gate (client-side)
 * - Shows a modal overlay asking for a password.
 * - Locks page scrolling while the overlay is visible.
 * - Stores an "unlocked" flag in localStorage so the same device is remembered.
 *
 * NOTE: This is a light deterrent only (password is visible in source).
 */
(function () {
  // Password required to enter the site (client-side, not secure)
  const PASSWORD = "ale&silvia-2026";

  // Cache DOM elements used by the gate
  const gate = document.getElementById("password-gate");
  if (!gate) return;
  const input  = document.getElementById("password-input");
  const button = document.getElementById("password-submit");
  const error  = gate.querySelector(".password-error");

  if (!input || !button || !error) return;

  // Used to restore scroll position when unlocking
  let lastScrollY = 0;

  let alreadyUnlocked = false;
  try {
    alreadyUnlocked = localStorage.getItem("site_unlocked") === "1";
  } catch (storageError) {
    // Storage may be unavailable in privacy-restricted browser contexts.
  }

  // If this device has already been unlocked, remove the gate immediately.
  if (alreadyUnlocked) {
    gate.remove();
    return;
  }

  function setBackgroundInert(inert) {
    const page = document.getElementById("page");
    const languageToggle = document.querySelector(".lang-toggle-wrap");
    [page, languageToggle].forEach(function (element) {
      if (!element) return;
      if (inert) element.setAttribute("aria-hidden", "true");
      else element.removeAttribute("aria-hidden");
      if ("inert" in element) element.inert = inert;
    });
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
    setBackgroundInert(true);
    gate.setAttribute("aria-hidden", "false");

    requestAnimationFrame(() => {
      gate.classList.add("is-visible");
	  requestAnimationFrame(() => input.focus({ preventScroll: true }));
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
      setBackgroundInert(false);
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
      try {
        localStorage.setItem("site_unlocked", "1");
      } catch (storageError) {
        // Unlock the current visit even if permanent storage is unavailable.
      }
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

  input.addEventListener("input", function () {
    error.style.display = "none";
  });

  gate.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    const focusable = [input, button];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Start: show the gate immediately on page load
  showGate();
})();
