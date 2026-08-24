/* ==========================================================================
   FRAGRANCE DATA  —  this is the only file you need to edit to change products
   ==========================================================================

   HOW TO ADD A FRAGRANCE
   ----------------------
   Copy one { ... } block, paste it, change the values. Order here = order on
   the page. Put the product photo in  assets/img/  and use its filename.

   >>> IMPORTANT — PLACEHOLDER CONTENT <<<
   The scent notes below were written as a starting point from the bottle
   names only. They have NOT been confirmed with the shop. Prices are not set.
   Replace both before you show this site to customers.

   >>> IMPORTANT — PLACEHOLDER PHOTOS <<<
   The images are stills pulled from your Maracuja video, used so the layout is
   not empty. Only Maracuja's photo actually shows Maracuja. Replace each one
   with a real photo of that fragrance before you show this to customers.

   While DRAFT is true, a small notice appears above the collection telling
   visitors that notes and prices are provisional.
   When your real notes and prices are in, change it to false and the notice
   disappears.
   ========================================================================== */

const DRAFT = true;

const FRAGRANCES = [
  {
    name: 'Alpha Male',
    line: 'Eau de Parfum',
    size: '100 ml',
    // price: 'R850',   <-- remove the // and set your price to show it
    price: null,
    image: 'assets/img/smoke.jpg',
    // Short line shown under the name. One sentence, plain language.
    blurb: 'Warm and resinous, built to last through a long evening.',
    notes: {
      top: ['Bergamot', 'Pink pepper'],
      heart: ['Rose', 'Cinnamon'],
      base: ['Oud', 'Amber', 'Musk'],
    },
  },
  {
    name: 'More 2.0',
    line: 'Eau de Parfum',
    size: '100 ml',
    price: null,
    image: 'assets/img/bottle-marble.jpg',
    blurb: 'Clean and sharp at the top, deep and smoky underneath.',
    notes: {
      top: ['Citrus', 'Green apple'],
      heart: ['Lavender', 'Jasmine'],
      base: ['Vanilla', 'Cedar', 'Tonka'],
    },
  },
  {
    name: 'Maracuja',
    line: 'Eau de Parfum',
    size: '100 ml',
    price: null,
    image: 'assets/img/bottle-glow.jpg',
    blurb: 'Bright passionfruit over a soft, powdery base.',
    notes: {
      top: ['Passionfruit', 'Mandarin'],
      heart: ['Peach blossom', 'Orange flower'],
      base: ['Vanilla', 'White musk', 'Sandalwood'],
    },
  },
];
