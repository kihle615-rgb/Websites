# Son of the Middle East Fragrances — website

A single-page site for the shop at Dolphins Leap Centre, Humewood Road,
Summerstrand, Gqeberha. Visitors browse the range and then call, WhatsApp, or
come in — there is no cart or online payment.

## Viewing it

It is plain HTML, so there is no build step and nothing to install. To preview
locally:

```bash
cd "Son of the middle east"
python3 -m http.server 8000
# open http://localhost:8000
```

To publish, upload the whole folder to any static host (Netlify, Vercel,
Cloudflare Pages, or ordinary shared hosting).

## Before you show it to customers

Three things in here are placeholders and need replacing:

1. **Scent notes** — written from the bottle names as a starting point, not
   confirmed with the shop.
2. **Prices** — not set. Cards currently read "Ask in store".
3. **Product photos** — stills pulled from the Maracuja video. Only the
   Maracuja card shows the right product.

While placeholders are in, a small notice appears above the collection telling
visitors that notes and pricing are provisional. Once the real details are in,
open `assets/js/fragrances.js` and change `const DRAFT = true;` to
`const DRAFT = false;` and the notice disappears.

## Changing the fragrances

Everything about the products lives in **`assets/js/fragrances.js`** — that is
the only file you need for adding, removing, reordering, or repricing. Each
fragrance is one block:

```js
{
  name: 'Alpha Male',
  line: 'Eau de Parfum',
  size: '100 ml',
  price: 'R850',                        // or null to show "Ask in store"
  image: 'assets/img/alpha-male.jpg',   // put the photo in assets/img/
  blurb: 'One sentence about how it wears.',
  notes: {
    top:   ['Bergamot', 'Pink pepper'],
    heart: ['Rose', 'Cinnamon'],
    base:  ['Oud', 'Amber', 'Musk'],
  },
},
```

Copy a block, paste it, edit the values. Order in the file is order on the page.

## Changing shop details

Phone number, address, and opening hours are in `index.html`. The number appears
in several places (the WhatsApp buttons, the phone link, the structured data
near the top), so search for `4340` to find them all.

Hours are 9 am – 9 pm every day, listed in the Contact section and repeated in
the structured data near the top of `index.html` — change both if they move.
The current day is highlighted automatically.

### The menu

The dropdown next to the logo is the site's main navigation — and the only one
on phones, since the gold rail is desktop-only. To change what is in it, edit
the `<ul class="menu__list">` block in `index.html`; each item is a link to a
section id further down the same page.

### The map

The "Find us" section embeds Google Maps. If a visitor's browser blocks the
embed, or they are offline, the page swaps in an address panel with a link to
Google Maps instead — so the section is never broken, just simpler.

## How it is put together

| File | What it does |
|---|---|
| `index.html` | All page content and copy |
| `assets/css/site.css` | All styling and the design tokens at the top |
| `assets/css/fonts.css` | Self-hosted font declarations — do not edit |
| `assets/js/fragrances.js` | Product data — **edit this one** |
| `assets/js/site.js` | Renders the products, menu, scroll progress, reveals |
| `assets/fonts/` | Unbounded and Sora, self-hosted (no Google requests) |
| `assets/img/`, `assets/video/` | Brand imagery and the hero video |

The hero video ships in two formats — `hero.webm` (VP9) and `hero.mp4` (H.264) —
so it plays in every browser. `hero-source.mp4` is the untouched original at full
quality; re-encode from that one if you ever need different dimensions.

### Design notes

- **Colour** is sampled from the brand's own gold-on-black logo (`#D8B679`,
  highlight `#EAD09A`) rather than picked to look "luxury".
- **Type** is Unbounded for headings — a heavy geometric display face with tight
  tracking, for a bold modern feel — with Sora for body text.
- **The gold line down the left edge** is the site's one signature device. It is
  the *sillage*, the trail a fragrance leaves behind, and it doubles as scroll
  progress and a section index. On phones it becomes a hairline at the top.
- Fonts are self-hosted, so the site makes no third-party requests at all.

### Accessibility

Checked and passing: text contrast (no failures at WCAG AA), heading order,
image alt text, visible keyboard focus, pointer targets at 24px minimum, and
`prefers-reduced-motion` — which stops the reveals, the scroll animation, and
autoplay of the hero video.
