# Ghazi Oriental — website

A one-page site for Ghazi Oriental, Moffett On Main, Walmer, Gqeberha. The film
plays, five drawn bottles stand in lit glass, all 204 fragrances are searchable,
and the map sits at the foot of the page. There is no cart and no online
payment — people call or WhatsApp, or come in.

## Viewing it

Plain HTML. No build step, nothing to install.

```bash
cd ghazi-oriental
python3 -m http.server 8000
# open http://localhost:8000
```

To publish, upload the whole folder to any static host — Vercel, Netlify,
Cloudflare Pages, or ordinary shared hosting.

## Where it is live

**https://ghazi-oriental-uaa-agency.vercel.app**

That is a Vercel production deployment on the *UAA agency* team. It was pushed
as files rather than linked to this repository, because the deploy route
available here carries text, not binaries. So the split is:

| Served by Vercel | Served by jsDelivr |
|---|---|
| `index.html`, `site.css`, `fonts.css`, `site.js`, `catalogue.js` | the fonts, the wordmark, the favicon, the arabesque, the poster frame and the film |

The jsDelivr URLs point at this repository pinned to commit `5a461f6`:

```
https://cdn.jsdelivr.net/gh/kihle615-rgb/Websites@5a461f61015fc1413494617b0c535d6945710a9e/ghazi-oriental/assets/…
```

Pinning to a commit means the CDN can cache them forever and they can never
change under the site. **It also means a new commit does not reach the live
page** — if you replace the film or the logo, the URLs in `index.html` and
`fonts.css` have to be repointed at the new commit.

### Moving it onto a proper Git deployment

The better long-term setup is a Vercel project linked to this repository, which
serves every file itself and rebuilds on every push — no CDN, no pinned commit.
It could not be created from here (Vercel could not verify the repository link),
so it takes two clicks in the dashboard:

1. Vercel → **Add New… → Project** → import `kihle615-rgb/Websites`.
2. Set **Root Directory** to `ghazi-oriental`, and set the production branch to
   whichever branch carries this folder.

Framework preset is *Other*; there is no build command and no output directory.
Once that project exists, `index.html` and `fonts.css` can drop the jsDelivr
URLs and go back to plain `assets/…` paths.

---

## The five bottles

There are no product photographs on the site. The five shapes in the Products
section are **drawn**, as inline SVG, in the same gold hairline as the arch
around the film — a waisted column, a faceted flacon, a round flask, a
rectangular flask and an attar bottle under an onion dome. Each one draws
itself in as you scroll to it.

That means the site owns every pixel it serves and has nothing to break: no
CDN, no missing-image frames, no photography to commission before launch. It
also scales to any screen without going soft.

**To edit a bottle**, find its `<svg class="vessel__art">` in `index.html`. The
viewBox is `0 0 64 104` — 64 wide, 104 tall, with the bottle standing on the
bottom edge. Every shape carries `pathLength="1"`, which is what lets one CSS
rule draw paths of wildly different lengths at the same speed; keep that
attribute on anything you add.

**To use real photographs instead**, replace the `<svg>` inside a
`.vessel__glass` with an `<img>`. The glass pane, the number, the caption and
the fact chips underneath all stay as they are.

---

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
alphabetically and builds the A–Z rail itself.

**Every number quoted on the page is counted from this file**, so it can never
go stale: the 204 in the About and Why-we're-different copy, the 87 ladies and
92 gentlemen on the product plates, the 28 unisex and the 11 oud fragrances, and
the counts in the search box and under the filters. Add a bottle and they all
move on their own.

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

- The number appears in seven places — the bar button, the two hero and contact
  buttons, the phone link, the contact rows and the structured data at the top.
  Search for `5264` to find them all. Every WhatsApp link points at
  `wa.me/27631425264`.
- Opening hours are the `<ul class="hours">` block. Each row carries a
  `data-day` number (Sunday is `0`, Monday `1`, through Saturday `6`); the page
  reads the visitor's own clock and marks the right row **Today** by itself.
  The same hours are repeated in the structured data near the top of the file —
  change both if they move.
- The address appears in the contact rows, the map panel, both map links and the
  structured data.

## The menu

The dropdown next to the logo is the site's whole navigation, at every screen
size — there is nothing that only exists on a desktop. To change what is in it,
edit the `<ul class="menu__list">` block in `index.html`; each item is a link to
a section id further down the same page, with a one-line hint underneath.

It closes on Escape, on a click outside, on choosing something, and when you tab
past the last item.

## The map

The map at the foot of the page is a keyless Google Maps embed pointed at
*Moffett On Main, 17th Ave, Walmer, Gqeberha, 6070*. Three things to know:

1. **Check the pin once it is live.** Google could not be reached from the
   machine this was built on, so the pin has not been seen with human eyes. If
   it lands in the wrong spot, replace the `src` on `<iframe class="map__frame">`
   with an embed URL copied from Google Maps → Share → Embed a map.
2. **It will not appear inside a Claude preview link.** That sandbox blocks all
   external content by design, so the panel behind the embed shows instead. On
   your own hosting it loads normally.
3. **It degrades on purpose.** The address, the postcode, *Open in Google Maps*
   and *Get directions* are always on the page, not a fallback that appears when
   the embed fails. If a visitor's network or extension blocks Google, the
   section still tells them where the shop is and how to drive there.

## Where the words came from

The product captions, the About, Why-we're-different and History sections were
written for the site. Two things worth knowing:

- **The facts are real and checkable.** Eau de parfum concentration (15–20%
  against an eau de toilette's 5–15%), Tapputi on the Mesopotamian tablet,
  Al-Kindi's *Book of the Chemistry of Perfume*, Ibn Sina and rose distillation,
  and how oud forms in an Aquilaria tree are all established fragrance and
  chemistry history, not marketing.
- **The claims about the shop are only yours.** Everything the site says Ghazi
  Oriental does comes from the list you supplied — the four signature promises,
  the two collection lines, the prices, and *available in store and online*.
  Nothing about the products has been invented. If any line reads wrong, it is
  in `index.html` in plain English and safe to change.

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
| `assets/js/site.js` | The film, the menu, the search, the counts, today's hours |
| `assets/fonts/` | Chakra Petch, IBM Plex Sans and IBM Plex Mono, self-hosted (no Google requests) |
| `assets/img/`, `assets/video/` | Brand imagery and the film |

Every image on the site comes out of the brand film: the wordmark, the
arabesque, the favicon and the poster frame. The film ships once, as
`film.mp4` (H.264), which every current browser plays. The untouched original is
in `../references/ghazi-oriental/`; re-encode from that if you ever need
different dimensions.

## Design notes

- **Colour** is sampled from the brand film itself, not picked to look
  "luxury": the deep emerald of the end card (`#04100E`, `#08211E`), the gold of
  the arabesque (`#C9A24D`), the cream of the wordmark (`#F2EADB`).
- **Type is three faces doing three jobs.** Chakra Petch sets the headings and
  the prices — a technical grotesque whose chamfered corners are the same cut as
  the glass on the bottles, so the headings carry the product's own geometry. IBM
  Plex Sans sets the running text: engineered rather than friendly, and it holds
  its weight at small sizes. IBM Plex Mono carries every label, count, price tag,
  chip, opening hour and readout — the data on this page is set as data, in
  tabular figures, so every column lines up.
- **The film plays on its own**, muted and looping, from the moment the page
  opens. It sits in a drawn ogee arch — the same arch clips the video and draws
  the gold line around it, so they can never drift apart. The placeholder plates
  use the same arch, which is why they read as part of the set.
- **The numbers are the argument.** 204 on the shelf, 87 and 92 across the two
  collections, 11 oud — all counted live from the data rather than typed into
  the copy.
- **The page is not one long green corridor.** Two sections invert to a warm
  bone ground — the price list and the history — which is why the R100/R150/R250
  panel lands the way it does. A light section does not restyle its contents: it
  re-points the colour tokens and every rule inside follows, including darkening
  the label gold, because brand gold on bone is 1.9:1 and unreadable.
- **The glass is where the modern note is.** The product panes and the four
  promises are translucent, blurred, lit along the top edge, with a warm bloom
  behind them so there is something to refract and each bottle stands in its own
  pool of light.

## Accessibility

Checked and passing: text contrast (no failures at WCAG AA — the lightest pair
is gold on the raised band at 6.0:1), sequential heading order, image alt text,
visible keyboard focus, a menu that closes on Escape and returns focus to its
button, pointer targets at 24 px minimum, and `prefers-reduced-motion` — which
holds the film on its poster frame and stops the reveals.
