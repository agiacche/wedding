💍 Alessandro & Silvia — Wedding Website

This repository contains the source code for Alessandro & Silvia’s wedding website (EN/IT), hosted with GitHub Pages 🌐

⸻

✨ Features

* 🌍 Bilingual content (EN/IT) with a toggle switch
* 🔒 Password gate on the main wedding page (session-based) to restrict casual access
* ⏳ Countdown to the wedding date
* 📝 RSVP link to an external Google Form
* 🖼️ Photo galleries with lightbox + optional hidden video
* 🧩 Info modals (Cities / Food / Nature) to keep pages compact
* 📸 Photo Bingo game page, designed primarily for mobile access via QR code
* 📱 Responsive layout (Bootstrap-based)

⸻

🗂️ Structure

* index.html — main wedding page (all sections + modal markup)
* photo-bingo.html — standalone bilingual Photo Bingo game page
* css/ — stylesheets:
    * style.css — template styles + general custom tweaks
    * photo-bingo.css — Photo Bingo-specific styles
* js/ — scripts:
    * main.js — template behaviours
    * language-switcher.js — EN/IT toggle logic
    * password-gate.js — password overlay + scroll lock for the main page
    * simplyCountdown.js + countdown-init.js — countdown + configuration
    * galleries.js — Magnific Popup bindings for gallery groups
    * photo-bingo.js — Photo Bingo interactions and local progress storage
* images/ — images used across the website (hero, timeline icons, galleries, etc.)

⸻

🧪 Local development

You can open the HTML files directly in a browser, but for best results use a local server 🚀

⸻

🚀 Deployment (GitHub Pages)

1. 📤 Push changes to the branch used for GitHub Pages.
2. ⚙️ On GitHub, go to Settings → Pages.
3. 🌿 Select Deploy from a branch, choose the relevant branch and / (root).
4. ✅ Click Save — GitHub will publish the site at the provided Pages URL.

⸻

🙏 Credits / License

This website is based on a free HTML5 template originally distributed via ThemeWagon / FreeHTML5.co.
Original design credit remains with the template authors; see in-page footer credit.

All custom content (text, images, and wedding-specific modifications) belongs to Alessandro & Silvia 💙

⸻

🛠️ Technical notes

* 🧱 This project is based on a legacy HTML5 template that relies on jQuery and classic plugins (Waypoints, Magnific Popup, Owl Carousel, etc.).
* 🧹 Not all bundled libraries are actively used by every page, but some remain included because they are referenced internally by main.js or template styles.
* 🧩 JavaScript functionality is intentionally split into small, focused files:
    * main.js handles template-wide behaviour (animations, scrolling, layout helpers).
    * Custom features (language switcher, password gate, countdown initialisation, galleries, Photo Bingo) live in separate scripts to keep changes isolated and readable.
* 🗣️ Content is duplicated per language using data-lang attributes and toggled at runtime; no build step or framework is used.
* 📸 Photo Bingo progress is stored locally in the guest’s browser using localStorage; no account, database, or backend is required.
* 📄 The site is entirely static and does not require any backend or build tooling.

⸻

🔐 Security note

* 🧾 The password gate is implemented entirely on the client side using JavaScript and localStorage.
* 🔓 It applies to the main wedding page; photo-bingo.html is intentionally accessible without a password so guests can open it directly from a QR code.
* 🪶 The password gate is intended only as a light deterrent to prevent casual access, not as a security mechanism.
* 👀 The password is visible in the source code and can be bypassed by anyone with basic technical knowledge.
* 🚫 No sensitive or private data should be considered protected by this mechanism.