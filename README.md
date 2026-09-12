# Sherin James · Portfolio

**Live site:** https://sherinjames-sj.github.io/sherin-portfolio/

Hello, This is Sherin James and welcome to my portfolio, I am an AI & Data Professional (MSc Artificial Intelligence, Distinction, University of East London). Built as a set of plain HTML pages sharing one stylesheet and one script, with a playful, hand-drawn visual identity layered over a professional case for hiring managers and recruiters.

## What's in it

The site is a traditional multi-page site: each section is its own HTML file, sharing a common `styles.css` and `script.js`. Clicking a nav pill is a real link to a real page, not a JavaScript view toggle.

Pages (in nav order):

- **`index.html`** (Home): hero intro, a technical proof strip (role, core skills, current-status line), quick stats, and a bubble-style nav into every other page.
- **`about.html`**: background and career narrative (business operations → enterprise systems/data → MSc → applied AI).
- **`projects.html`**: the MSc dissertation as a featured case study (problem, pipeline, models, results, what was learned), plus two self-built AI tools (Purrfect Match, Brainrot-O-Meter) and an AI red-teaming/testing writeup.
- **`experience.html`**: full career history: Hotel Kerala Cafe → UPS → Marks & Spencer → Taiko Foods Ltd (three roles in 13 months: Production Administrator → Specifications Coordinator → Technical Assistant & Business Support Analyst) → a self-directed career break → current volunteer media/communications role.
- **`beyond-work.html`**: travel, the career-break self-study period, and personal life context.
- **`skills.html`**: grouped into AI & Machine Learning, Applied AI, Data Engineering & Cloud, Analytics & BI, and Enterprise Systems.
- **`education.html`**: MSc and BCA details, plus certifications.
- **`made.html`**: a short "how this site was built" page (AI-assisted, human-directed).
- **`play.html`**: a small built-in game (Pond Derby) as a bit of personality.
- **`contact.html`**: email (with a clipboard-copy fallback), LinkedIn, and a CV download.

## Tech stack

Deliberately dependency-free:

- Plain **HTML, CSS, and vanilla JavaScript**: no framework, no bundler, no build step.
- Fonts loaded from **Google Fonts** (`Fredoka`, `Quicksand`, `Space Mono`) via `@import` in `styles.css`.
- Light and dark themes via CSS custom properties, switching automatically with the visitor's OS-level `prefers-color-scheme`.
- Fully responsive: tested from 320px (small phones) up through 1440px (desktop), with a scrollable pill-style nav bar on mobile.
- No analytics, no cookies, no third-party scripts beyond the Google Fonts stylesheet.

Because there's no build step, "the source" and "the deployed site" are the same files: what you see in each `.html` file is exactly what's served.

## Files

| File | Purpose |
|---|---|
| `index.html`, `about.html`, `projects.html`, `experience.html`, `beyond-work.html`, `skills.html`, `education.html`, `made.html`, `play.html`, `contact.html` | One page per section, sharing the same topbar and nav. |
| `styles.css` | All shared styling, including the light/dark theme tokens. |
| `script.js` | The roaming critters, the Pond Derby game, and the mailto/clipboard-copy logic. Loaded on every page; each feature only activates itself if the matching element exists on that page. |
| `images/` | Project screenshots used on `projects.html`. |
| `Sherin_James_CV.pdf` | The CV served by the "Download CV" button on the Home and Contact pages. |

**Important:** the Download CV button links to `Sherin_James_CV.pdf` by that exact filename. If the CV is ever replaced, either keep the filename identical or update every `href="Sherin_James_CV.pdf"` link across the pages to match the new name.

## Hosting

Served by **GitHub Pages**, building from the `main` branch, root folder (`/`). GitHub rebuilds the live site automatically within about a minute of any push to `main`: no manual deploy step, no CI config needed for a static site like this one.

Live URL: `https://sherinjames-sj.github.io/sherin-portfolio/`

## Making changes

**Small edits (recommended for quick fixes):**
1. Open the relevant `.html` file (or `styles.css`) in this repo on GitHub.
2. Click the pencil (edit) icon.
3. Make the change and commit directly to `main`.
4. Give it a minute: GitHub Pages will rebuild and the live site will update itself.

**Bigger changes (recommended for anything non-trivial):**
1. Clone the repo locally: `git clone https://github.com/sherinjames-sj/sherin-portfolio.git`
2. Open any `.html` file directly in a browser to preview changes; no server or build step required.
3. Commit and push to `main` once happy with the result.

**Changing the shared nav or footer:** the topbar and nav markup is repeated at the top of every page, so a nav change needs to be made in each `.html` file, not just one.

**Replacing the CV:**
1. Add the new PDF to the repo.
2. Either name it exactly `Sherin_James_CV.pdf` (overwriting the old one), or update every `href="Sherin_James_CV.pdf"` reference across the pages if using a different filename.
