# Ghazi Oriental — website

A one-page site for Ghazi Oriental, Moffett On Main, Walmer, Gqeberha. The film
plays, the price list is one panel, all 204 fragrances are searchable, and the
map is at the foot of the page. There is no cart and no online payment — people
call or WhatsApp, or come in.

## Viewing it

Plain HTML. No build step, nothing to install.

```bash
cd ghazi-oriental
python3 -m http.server 8000
# open http://localhost:8000
```

To publish, upload the whole folder to any static host — Vercel, Netlify,
Cloudflare Pages, or ordinary shared hosting.

## Changing the fragrances

Everything about the shelf lives in **`assets/js/catalogue.js`** — that is the
only file you need. Each fragrance is one line:

```js
{ name: 'Sauvage',            for: 'him' },
{ name: 'Yara Tous',          for: 'unisex' },
{ name: 'Elie Saab',          for: 'her him' },
```

`for` decides which filter button it appears under:

| Value | Shows under |
|---|---|
| `her` | Ladies |
| `him` | Gentlemen |
| `her him` | both, as two separate scents |
| `unisex` | Unisex |

Copy a line, paste it, edit it. Order doesn't matter — the page sorts
alphabetically and builds the A–Z rail itself, and the counts in the search box
and under the filters update on their own.

## Changing the prices

Also in `assets/js/catalogue.js`, at the top:

```js
const SIZES = [
  { ml: 30,  price: 'R100' },
  { ml: 50,  price: 'R150' },
  { ml: 100, price: 'R250' },
];
```

Add or remove a size and the price panels follow.

## Changing the shop details

Phone, WhatsApp, Instagram, TikTok, address and opening hours are all in
`index.html`.

- The number appears in five places — the two WhatsApp buttons, the phone link,
  the contact rows and the structured data at the top. Search for `5264` to find
  them all. Every WhatsApp link points at `wa.me/27631425264`.
- Opening hours are the `<ul class="hours">` block. Each row carries a
  `data-day` number (Sunday is `0`, Monday `1`, through Saturday `6`); the page
  reads the visitor's own clock and marks the right row **Today** by itself.
  The same hours are repeated in the structured data near the top of the file —
  change both if they move.
- The address appears in the Visit rows, the map panel, the map link and the
  structured data.

## The map

The map at the foot of the page is a keyless Google Maps embed pointed at
*Moffett On Main, 17th Ave, Walmer, Gqeberha, 6070*. Two things to know:

1. **Check it once it is live.** The embed could not be loaded from the machine
   this was built on, so the pin has not been seen with human eyes. If it lands
   in the wrong spot, replace the `src` on `<iframe class="map__frame">` with an
   embed URL copied from Google Maps → Share → Embed a map.
2. **It degrades on purpose.** The address panel, the postcode and the *Open in
   Google Maps* button are always on the page, not a fallback that appears when
   the embed fails. If a visitor's network, extension or company policy blocks
   Google, the section still tells them where the shop is.

## What was changed in the fragrance list

Your list had a few entries twice under slightly different names. These were
merged so the collection doesn't show the same scent twice:

| In your list | On the site |
|---|---|
| *Daisy (Marc Jacobs)* and *Marc Jacobs Daisy* | Marc Jacobs Daisy |
| *Christian Dior Miss Dior cherry* and *Miss Dior (Cherry)* | Miss Dior Cherry |
| *CR7 legacy* and *Cristiano Ronaldo Legacy* | CR7 Legacy |
| *Ariana Grande Cloud* (listed twice) | Ariana Grande Cloud |

Obvious spellings were corrected: *Vinilla* → Vanilla, *Qawha* → Qahwa,
*Laquer* → Lacquer, *Parada* → Prada, *Intio* → Initio, *Poco Rabanne* → Paco
Rabanne. One stray line reading just **"Intense"** sat between *Nebras by
Lattafa* and *Wanted Girl* — it wasn't clear what it belonged to, so it was left
out. Add it back in `catalogue.js` if it's a real bottle.

*Antonio Banderas Blue Seduction*, *Elie Saab* and *Issey Miyake* appeared in
both collections, so they're tagged **Ladies · Gentlemen** — one row, both
shelves.

That leaves **204** fragrances.

## How it is put together

| File | What it does |
|---|---|
| `index.html` | All page content and copy |
| `assets/css/site.css` | All styling; the design tokens are at the top |
| `assets/css/fonts.css` | Self-hosted font declarations — do not edit |
| `assets/js/catalogue.js` | Fragrances and prices — **edit this one** |
| `assets/js/site.js` | The film, the scroll, the search, today's hours |
| `assets/fonts/` | Marcellus and Jost, self-hosted (no Google requests) |
| `assets/img/`, `assets/video/` | Brand imagery and the film |

Every image on the site comes out of the brand film: the wordmark, the
arabesque behind the promise, the favicon and the poster frame. Nothing else is
used. The film ships twice — `film.mp4` (H.264) and `film.webm` (VP9) — so it
plays everywhere; browsers download only the first one they can play. The
untouched original is in `../references/ghazi-oriental/`; re-encode from that if
you ever need different dimensions.

## Design notes

- **Colour** is sampled from the brand film itself, not picked to look
  "luxury": the deep emerald of the end card (`#04100E`, `#08211E`), the gold of
  the arabesque (`#C9A24D`), the cream of the wordmark (`#F2EADB`).
- **Type** is Marcellus for headings — Roman inscriptional capitals, carved
  rather than fashionable — with Jost for everything else. Prices and hours are
  set in tabular figures so the columns line up.
- **The film plays on its own**, muted and looping, from the moment the page
  opens. It sits in a drawn ogee arch — the same arch clips the video and draws
  the gold line around it, so they can never drift apart.
- **The collection is searchable**, because 204 names is only useful if it can
  be. Type any part of a name, filter by collection, and the match is marked in
  gold. Choosing Ladies or Gentlemen brings up that collection's own line.

## Accessibility

Checked and passing: text contrast (no failures at WCAG AA — the lightest pair
is gold on the raised band at 6.0:1), sequential heading order, image alt text,
visible keyboard focus, pointer targets at 24 px minimum, and
`prefers-reduced-motion` — which holds the film on its poster frame and stops
the reveals.
