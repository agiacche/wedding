# Alessandro & Silvia — Wedding Website

This repository contains the source code for **Alessandro & Silvia’s wedding website** (EN/IT), hosted with **GitHub Pages**.

## Features

- **Bilingual content (EN/IT)** with a toggle switch
- **Password gate** (session-based) to restrict access
- **Countdown** to the wedding date
- **RSVP link** to an external Google Form
- **Photo galleries** with lightbox + optional hidden video
- **Info modals** (Cities / Food / Nature) to keep pages compact
- Responsive layout (Bootstrap-based)

## Structure

- `index.html` — main page (all sections + modal markup)
- `css/` — stylesheets (template + custom tweaks in `style.css`)
- `js/` — scripts:
  - `main.js` — template behaviours
  - `language-switcher.js` — EN/IT toggle logic
  - `password-gate.js` — password overlay + scroll lock
  - `simplyCountdown.js` + `countdown-init.js` — countdown + configuration
  - `galleries.js` — Magnific Popup bindings for gallery groups
- `images/` — images used across the website (hero, timeline icons, galleries, etc.)

## Local development

You can open `index.html` directly in a browser, but for best results use a local server.

## Deployment (GitHub Pages)

1. Push changes to the default branch (e.g. `main`).
2. On GitHub, go to **Settings** → **Pages**.
3. Select **Deploy from a branch**, choose the branch and **/ (root)**.
4. Click **Save** — GitHub will publish the site at the provided Pages URL.

## Credits / License

This website is based on a free HTML5 template originally distributed via ThemeWagon / FreeHTML5.co.
Original design credit remains with the template authors; see in-page footer credit.

All custom content (text, images, and wedding-specific modifications) belongs to **Alessandro & Silvia**.

## Technical notes

- This project is based on a legacy HTML5 template that relies on `jQuery` and several classic plugins (Waypoints, Magnific Popup, Owl Carousel, etc.).
- Not all bundled libraries are actively used by the current site, but some remain included because they are referenced internally by `main.js` or template styles.
- JavaScript functionality is intentionally split into small, focused files:
  - `main.js` handles template-wide behaviour (animations, scrolling, layout helpers).
  - Custom features (language switcher, password gate, countdown initialisation, galleries) live in separate scripts to keep changes isolated and readable.
- Content is duplicated per language using `data-lang` attributes and toggled at runtime; no build step or framework is used.
- The site is entirely static and does not require any backend or build tooling.

## Security note

- The password gate is implemented entirely on the client side using JavaScript and `sessionStorage`.
- It is intended only as a light deterrent to prevent casual access, not as a security mechanism.
- The password is visible in the source code and can be bypassed by anyone with basic technical knowledge.
- No sensitive or private data should be considered protected by this mechanism.