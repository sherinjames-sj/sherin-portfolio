# Sherin James · Portfolio

**Live site:** https://sherinjames-sj.github.io/sherin-portfolio/

A single-page personal portfolio for Sherin James, AI & Data Professional (MSc Artificial Intelligence, Distinction, University of East London). Built as one self-contained HTML file with a playful, hand-drawn visual identity layered over a professional case for hiring managers and recruiters.

## What's in it

The site is a single-page app: one `index.html` loads once, and JavaScript toggles which "view" is visible. There's no routing library and no page reloads: clicking a nav pill just shows a different `<div class="view">` and hides the rest.

Sections (in nav order):

- **Home**: hero intro, a technical proof strip (role, core skills, current-status line), quick stats, and a bubble-style nav into every other section.
- **About**: background and career narrative (business operations → enterprise systems/data → MSc → applied AI).
- **Projects**: the MSc dissertation as a featured case study (problem, pipeline, models, results, what was learned), plus two self-built AI tools (Purrfect Match, Brainrot-O-Meter) and an AI red-teaming/testing writeup.
- **Experience**: full career history: Hotel Kerala Cafe → UPS → Marks & Spencer → Taiko Foods Ltd (three roles in 13 months: Production Administrator → Specifications Coordinator → Technical Assistant & Business Support Analyst) → a self-directed career break → current volunteer media/communications role.
- **Beyond Work**: travel, the career-break self-study period, and personal life context.
- **Skills**: grouped into AI & Machine Learning, Applied AI, Data Engineering & Cloud, Analytics & BI, and Enterprise Systems.
- **Education**: MSc and BCA details, plus certifications.
- **Made**: a short "how this site was built" page (AI-assisted, human-directed).
- **Play**: a small built-in game (Pond Derby) as a bit of personality.
- **Contact**: email (with a clipboard-copy fallback), LinkedIn, and a CV download.

## Tech stack

Deliberately dependency-free:

- Plain **HTML, CSS, and vanilla JavaScript**: no framework, no bundler, no build step.
- Fonts loaded from **Google Fonts** (`Fredoka`, `Quicksand`, `Space Mono`) via `@import` in the `<style>` block.
- Light and dark themes via CSS custom properties, switching automatically with the visitor's OS-level `prefers-color-scheme`.
- Fully responsive: tested from 320px (small phones) up through 1440px (desktop), with a scrollable pill-style nav bar on mobile.
- No analytics, no cookies, no third-party scripts beyond the Google Fonts stylesheet.

Because there's no build step, "the source" and "the deployed site" are the same file: what you see in `index.html` is exactly what's served.

## Files

| File | Purpose |
|---|---|
| `index.html` | The entire site: markup, CSS, and JavaScript in one file. |
| `Sherin_James_CV.pdf` | The CV served by the "Download CV" button on the Home and Contact pages. |

**Important:** the Download CV button links to `Sherin_James_CV.pdf` by that exact filename. If the CV is ever replaced, either keep the filename identical or update the two `href="Sherin_James_CV.pdf"` links in `index.html` to match the new name.

## Hosting

Served by **GitHub Pages**, building from the `main` branch, root folder (`/`). GitHub rebuilds the live site automatically within about a minute of any push to `main`: no manual deploy step, no CI config needed for a static site like this one.

Live URL: `https://sherinjames-sj.github.io/sherin-portfolio/`

## Making changes

**Small edits (recommended for quick fixes):**
1. Open `index.html` in this repo on GitHub.
2. Click the pencil (edit) icon.
3. Make the change and commit directly to `main`.
4. Give it a minute: GitHub Pages will rebuild and the live site will update itself.

**Bigger changes (recommended for anything non-trivial):**
1. Clone the repo locally: `git clone https://github.com/sherinjames-sj/sherin-portfolio.git`
2. Open `index.html` directly in a browser to preview changes; no server or build step required.
3. Commit and push to `main` once happy with the result.

**Replacing the CV:**
1. Add the new PDF to the repo.
2. Either name it exactly `Sherin_James_CV.pdf` (overwriting the old one), or update both `href="Sherin_James_CV.pdf"` references in `index.html` if using a different filename.

## Custom domain (optional, not yet set up)

This site currently lives at the default `sherinjames-sj.github.io/sherin-portfolio/` address. To point a purchased domain (e.g. `sherinjames.com`) at it instead:
1. Add a `CNAME` file to the repo root containing just the domain name.
2. At the domain registrar, add a `CNAME` DNS record (for a subdomain like `www`) or `A` records (for an apex domain) pointing at GitHub Pages; see [GitHub's custom domain docs](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site) for the exact records.
3. Set the custom domain in **Settings → Pages** on this repo.

Nothing about the site itself needs to change for this: the domain just points at the same GitHub Pages deployment.

## Credits

Designed and built by Sherin James, with help from Claude (Anthropic) for structure, copywriting, and front-end implementation.
