# Ghazi Oriental — website

A one-page site for Ghazi Oriental, Moffett On Main, Walmer, Gqeberha. The film
plays, five product plates carry the bottles, all 204 fragrances are searchable,
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

---

## The five product photographs

Each plate loads its photograph from the shop's media CDN:

```
https://d8j0ntlcm91z4.cloudfront.net/user_3HmYniPCTtYjteyTOhNw7cCb8VU/hf_...png
```

The `<img>` for each plate carries that URL as its `src` and a `data-fallback`
pointing at a local file in `assets/img/bottles/`. If the photograph cannot be
fetched — the CDN is down, the visitor is offline, a content policy blocks the
host — the plate swaps to the local placeholder and shows a *Photo to come*
chip, rather than a broken image. Nothing to configure; it is automatic.

**Two things worth doing before this is a real production site:**

1. **Check the order.** The five URLs were mapped to the five plates in the
   order they were sent — clear column, crystal flacon, pink trio, dark trio,
   emerald oud bottle. That mapping has not been verified with human eyes,
   because the CDN is unreachable from the machine this was built on. Open the
   Products section, and if two plates are swapped, swap their `src` values in
   `index.html`.

2. **Make it self-contained.** A website that depends on somebody else's CDN
   breaks the day that CDN changes. Download each photograph over its matching
   `assets/img/bottles/bottle-N.jpg`, then delete the CDN URL from that
   plate's `src` and put `assets/img/bottles/bottle-N.jpg` in its place. The
   fallback machinery does no harm if you leave it, and the site then owns
   every byte it serves.

They are cropped to 4:5 and centred, so a portrait or square original both work.

**They will not appear inside a Claude preview link.** That sandbox blocks
every external host by design, so the preview shows the placeholder panels.
On your own hosting — or a local `python3 -m http.server` — they load normally.

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
| `assets/fonts/` | Chakra Petch and Jost, self-hosted (no Google requests) |
| `assets/img/bottles/` | The five product plates — **replace these** |
| `assets/img/`, `assets/video/` | Brand imagery and the film |

Apart from the five product plates, every image comes out of the brand film: the
wordmark, the arabesque, the favicon and the poster frame. The film ships twice —
`film.mp4` (H.264) and `film.webm` (VP9) — so it plays everywhere; browsers
download only the first one they can play. The untouched original is in
`../references/ghazi-oriental/`; re-encode from that if you ever need different
dimensions.

## Design notes

- **Colour** is sampled from the brand film itself, not picked to look
  "luxury": the deep emerald of the end card (`#04100E`, `#08211E`), the gold of
  the arabesque (`#C9A24D`), the cream of the wordmark (`#F2EADB`).
- **Type** is Chakra Petch for everything that carries weight — headings,
  numerals, labels and buttons. It is a technical grotesque whose chamfered
  corners are the same cut as the faceted glass on the bottles, so the headings
  carry the product's own geometry. Jost sets the running text. Prices, hours
  and counts use tabular figures so columns line up.
- **The film plays on its own**, muted and looping, from the moment the page
  opens. It sits in a drawn ogee arch — the same arch clips the video and draws
  the gold line around it, so they can never drift apart. The placeholder plates
  use the same arch, which is why they read as part of the set.
- **The numbers are the argument.** 204 on the shelf, 87 and 92 across the two
  collections, 11 oud — all counted live from the data rather than typed into
  the copy.

## Accessibility

Checked and passing: text contrast (no failures at WCAG AA — the lightest pair
is gold on the raised band at 6.0:1), sequential heading order, image alt text,
visible keyboard focus, a menu that closes on Escape and returns focus to its
button, pointer targets at 24 px minimum, and `prefers-reduced-motion` — which
holds the film on its poster frame and stops the reveals.
