# Santhica — website

The marketing website for **Santhica**, applied AI for healthcare. Tagline: *Care that connects.*

Santhica turns what already happens in a consultation — a spoken conversation, a handwritten prescription, a lab report — into a structured, FHIR-aligned patient record that stays useful across visits. The product is mobile-first and offline-capable, built for clinics, nursing homes and hospitals in India.

> The repository is named `quantivara-digital-health` for historical reasons. The product and the domain are Santhica.

## What this repo contains

| Path | What it is | Published? |
| --- | --- | --- |
| `site/` | The static marketing site — plain HTML, CSS and JS, no build step | **Yes — this is santhica.com** |
| `src/`, `index.html`, `vite.config.ts` | The earlier React + Vite + shadcn/ui app, including the `_prototype/` demo flows | No — kept for reference, still runs locally |
| `backend/` | Demo API server for the React prototype | No |
| `demo/`, `sample-data/` | Fixtures and scripts for the React prototype | No |

The static site replaced the React landing page as what gets deployed. The React app was left in place rather than deleted so the prototype work stays available; it simply isn't what ships.

## Site map

**Product** — `index.html` (the full story: Voice Scribe, longitudinal context, agents, clinical safety net, outpatient and inpatient previews, app download links) · `platform.html` · `voice-scribe.html` · `agents.html` · `clinical-workflows.html` · `strategy.html` (placeholder)

**Company** — `about.html` · `careers.html` (placeholder) · `contact.html` (composes an email draft locally, no backend)

**Writing** — `blogs.html` and three articles: longitudinal patient context, paper prescriptions as a starting point, and carrying context from outpatient into inpatient care

**Legal and compliance** — `privacy-policy.html` · `terms-of-service.html` · `account-deletion/` (required by the Google Play listing) · `media-credits.html`

## What is and isn't real

This matters, because the site shows clinical-looking data throughout.

- **Every patient, value and prescription is fictional.** The potassium and Hb results, the amoxicillin and warfarin examples — all invented sample data. No real patient information appears anywhere.
- **Product mockups are HTML and CSS**, not screenshots of the running app.
- **Care Closure and agent-assisted coordination are labelled in development**, not shipped features.
- **The 13,000-hour figure is an explicit model**, not a measured result: 500 visits × 26 days × 12 months × 5 assumed minutes ÷ 60.
- **ABDM certification is on the roadmap**, not held.
- **Background clips are licensed stock footage.** The people and facilities shown are not Santhica customers or staff. See [site/assets/video/LICENSES.md](site/assets/video/LICENSES.md).

## Running the site locally

No build step, no dependencies:

```sh
cd site
python3 -m http.server 4173 --bind 127.0.0.1
```

Then open <http://127.0.0.1:4173/>.

Note that `python3 -m http.server` does not serve extensionless URLs. GitHub Pages does, so `/privacy-policy` works in production but needs `/privacy-policy.html` locally.

Stylesheets load in order, each layer overriding the last: `site.css` (foundations) → `landing.css` (light-theme tokens) → `blog.css` / `legal.css` → `components.css` (product cards, agents, safety net, device mockups). Motion is opt-in behind `prefers-reduced-motion: no-preference`.

## Deploying

```sh
npm run deploy      # publishes site/ to the gh-pages branch
```

GitHub Pages serves the `gh-pages` branch at santhica.com.

Things that must not be removed from `site/`, because the deploy publishes that directory verbatim:

- **`CNAME`** — without it the custom domain unbinds and santhica.com stops resolving
- **`.nojekyll`** — tells Pages to serve the tree as-is instead of running Jekyll over it (the `--dotfiles` flag in the deploy script is what carries it across)
- **`googleb46f9a6aff4e74a5.html`** — Google Search Console verification
- **`account-deletion/`** — linked from the Google Play listing
- **`robots.txt`** and **`sitemap.xml`**

`npm run deploy:legacy-react` still builds and publishes the old React app, if the change ever needs reverting.

## Running the React prototype

```sh
npm install && npm run dev      # frontend on :8080
cd backend && npm install && npm run dev   # API on :3001
```
