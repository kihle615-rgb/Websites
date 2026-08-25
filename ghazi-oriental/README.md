# Ghazi Oriental — website

A one-page site for the Ghazi Oriental fragrance collection at **Son of the
Middle East**, Gqeberha. Visitors watch the film, check the price list, search
the 204 fragrances on the shelf, then call or WhatsApp. There is no cart and no
online payment — the shop is the checkout.

## Viewing it

Plain HTML. No build step, nothing to install.

```bash
cd ghazi-oriental
python3 -m http.server 8000
# open http://localhost:8000
```

To publish, upload the whole folder to any static host — Vercel, Netlify,
Cloudflare Pages, or ordinary shared hosting.

## Two things to check before you show it to customers

1. **The shop address.** The Contact section and the structured data both say
   *Dolphins Leap Centre, Humewood Road, Summerstrand, Gqeberha*. That was
   carried over from the existing Son of the Middle East site — confirm it is
   still right, or change it in `index.html` (search for `Dolphins`).
2. **The fragrance list.** 204 names, transcribed from the list you sent. A few
   entries were tidied or merged — see *What was changed in the list* below.

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
alphabetically and builds the A–Z rail itself, and the counts on the buttons and
in the search box update on their own.

## Changing the prices

Also in `assets/js/catalogue.js`, at the top:

```js
const SIZES = [
  { ml: 30,  price: 'R100' },
  { ml: 50,  price: 'R150' },
  { ml: 100, price: 'R250' },
];
```

Add or remove a size and the price panels follow. Prices are deliberately not
attached to individual fragrances — the whole point of the Prices section is
that they aren't.

## Changing the shop details

Phone number, Instagram, TikTok and address are in `index.html`. The number
appears in several places (the WhatsApp buttons, the phone link, the structured
data near the top), so search for `5264` to find them all.

## What was changed in the list

Your list had a few entries twice under slightly different names. These were
merged so the index doesn't show the same scent twice:

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

## How it is put together

| File | What it does |
|---|---|
| `index.html` | All page content and copy |
| `assets/css/site.css` | All styling; the design tokens are at the top |
| `assets/css/fonts.css` | Self-hosted font declarations — do not edit |
| `assets/js/catalogue.js` | Fragrances and prices — **edit this one** |
| `assets/js/site.js` | The film, the scroll, the search |
| `assets/fonts/` | Marcellus and Jost, self-hosted (no Google requests) |
| `assets/img/`, `assets/video/` | Brand imagery and the film |

The film ships twice — `film.mp4` (H.264) and `film.webm` (VP9) — so it plays
everywhere. Browsers download only the first one they can play. The untouched
original is in `../references/ghazi-oriental/`; re-encode from that if you ever
need different dimensions.

## Design notes

- **Colour** is sampled from the brand film itself, not picked to look
  "luxury": the deep emerald of the end card (`#04100E`, `#08211E`), the gold of
  the arabesque (`#C9A24D`), the cream of the wordmark (`#F2EADB`).
- **Type** is Marcellus for headings — Roman inscriptional capitals, carved
  rather than fashionable — with Jost for everything else. Prices are set in
  tabular figures so the three panels line up.
- **The signature is the film.** It sits in a drawn arch and is scrubbed
  frame-by-frame by the scroll wheel, so the bottle turns as you read. If a
  browser can't seek smoothly, the film notices within a second and quietly
  falls back to looping — the words still change with the scroll either way.
- **The index is the other half of the job.** 204 names is only useful if it can
  be searched, so it is: type any part of a name, filter by collection, and the
  match is marked in gold.

## Accessibility

Checked and passing: text contrast (no failures at WCAG AA — the lightest pair
is gold on the raised band at 6.0:1), sequential heading order, image alt text,
visible keyboard focus, pointer targets at 24 px minimum, and
`prefers-reduced-motion` — which turns the pinned film into a still poster,
stops the reveals, and pauses the video.
