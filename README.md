# Oak Grove Smoke House — website redesign concept

A modern, single-page website concept for **Oak Grove Smoke House Inc** — the
family-run smokehouse and Cajun meat market at 17618 Old Jefferson Hwy,
Prairieville, LA, in business since 1972.

This is an **unsolicited redesign concept** — a "this could be yours" pitch piece,
not the business's official site.

## Why a redesign

Oak Grove's only current web presence is a Vistaprint-hosted page
(`renderrush.digital.vistaprint.io/s/oakgrovemix`) that **does not load / can't be
found** — effectively no working website. A business with 50+ years of history, a
5-star reputation, and products shipped across five states deserves better than a
dead link. This concept gives them:

- A clear, appetizing identity built around real oak smoke and the meat case
- Their **full documented product line** — smoked meats (andouille, tasso,
  sausage) plus the retail Cajun mixes, with real published prices where available
- A real **money feature**: click-to-call ordering plus a large-order / catering
  inquiry form
- Accurate hours, address, phone, and a directions link
- Polished, tasteful motion and a fully responsive, mobile-first layout

## How to view

Just open **`index.html`** in any browser (double-click it) — the site is fully
static and self-contained (one Google Fonts `<link>`, otherwise no build step, no
frameworks, no external dependencies).

## Notes on content

- Business facts (address, phone, hours, founding, product line, prices) are drawn
  from public directory listings, retailer catalogs, and the company's own
  historical blurb. Daily meat-case pricing isn't published online, so smoked-meat
  items say "call for today's price" rather than inventing a number.
- No real photos were downloadable (the business's images are Facebook-only and
  token-blocked; other sources block scraping). The site ships with on-brand SVG
  placeholders marked `<!-- IMG-NEEDED -->`. See
  `assets/photos/DROP-PHOTOS-HERE.md` to swap in real photography.

## Files

```
index.html      # markup
styles.css      # all styling
script.js       # nav, scroll-reveal, form (vanilla JS)
assets/photos/  # drop-folder for real images
```
