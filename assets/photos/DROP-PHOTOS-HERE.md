# Drop real photos here

Oak Grove Smoke House's only images live on a **Facebook** page
(facebook.com/p/Oak-Grove-Smokehouse-61554873096679), which is token-blocked —
those images cannot be downloaded programmatically. Their Vistaprint/Wix pages
are dead or empty, and other directory listings block image scraping (HTTP 403).

So the site currently ships with tasteful on-brand SVG placeholders. To swap in
real photography, drop files with these exact names into this folder and they can
be wired into `index.html` (replace the `.photo-fallback` blocks with `<img>`):

| Filename        | What it should show                                   |
|-----------------|-------------------------------------------------------|
| `hero.jpg`      | The smoke pit / hanging andouille, or the storefront   |
| `story.jpg`     | Founders (Robert & Babette Schexnaider) or vintage shop|
| `andouille.jpg` | Ropes of smoked andouille sausage (optional)           |
| `case.jpg`      | The meat case / counter (optional)                     |

Recommended: landscape or 4:5 portrait, JPG, ~1600px on the long edge.

Placeholders in the HTML are marked with `<!-- IMG-NEEDED -->` and a
`data-photo="..."` hint describing the intended shot.
