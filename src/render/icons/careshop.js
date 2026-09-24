// careshop.app — the LABEL icon set.
//
// Every glyph is a grocery sticker: a solid label on a 24×24 grid with a
// notched top-right corner and a punched hole at the top left, and the
// picture knocked OUT of it. One even-odd path in currentColor draws the
// label and the cut at once, so the knock-out is real transparency and the
// sticker sits on any surface — paper, card, sage, a receipt — with nothing
// to configure. Filled silhouettes, never strokes; where a picture needs a
// line inside its cut (a clock hand, a door) it is painted back in ink.
// The motif — notch + hole — is what makes a CareShop icon unlike any
// sibling's from across the room.

const LABEL = 'M6 2h10.6L22 7.4V18a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4zM6 4.6a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z';

/* k = an ink detail painted back on top of a cut; ks = the same as a line */
const k = (d) => `<path class="ic-cs-k" d="${d}"/>`;
const ks = (d, w = 1.4) => `<path class="ic-cs-ks" stroke-width="${w}" d="${d}"/>`;

/* [the cut-outs, as sub-paths that never overlap one another · the ink details] */
export const ICONS = {
  basket: ['M6.8 11.6h11.4l-1.5 6.6a1 1 0 0 1-1 .8H9.3a1 1 0 0 1-1-.8zM9.7 11.4a2.8 2.8 0 0 1 5.6 0h-1.6a1.2 1.2 0 0 0-2.4 0z', k('M10.6 13.6h1v3h-1zM13.4 13.6h1v3h-1z')],
  shelf: ['M6.4 12h12.2v1.7H6.4zM6.4 18.4h12.2v1.7H6.4zM8.2 8.6h3.2V12H8.2zM13.6 9.6h3.2V12h-3.2zM7.6 14.4h4.4v4h-4.4z'],
  tag: ['M7.4 10.6l5-1.7 5.8 5.8-4.2 4.2-5.8-5.8z', k('M10.6 12a1.1 1.1 0 1 0 2.2 0 1.1 1.1 0 0 0-2.2 0z')],
  clock: ['M12.5 8.9a5 5 0 1 1 0 10 5 5 0 0 1 0-10z', ks('M12.5 10.8v3.4l2.3 1.5', 1.5)],
  leaf: ['M7.2 19.6c0-6.4 3.8-10.2 11-10.2 0 6.4-3.8 10.2-11 10.2z', ks('M8.6 18.2c2.2-3.4 4.6-5.8 7.2-7.2', 1.2)],
  pot: ['M6.8 12.2h11.4v4.6a2.6 2.6 0 0 1-2.6 2.6H9.4a2.6 2.6 0 0 1-2.6-2.6zM7.8 10.2h9.4v1.3H7.8zM4.8 13h1.5v1.6H4.8zM18.7 13h1.5v1.6h-1.5z', k('M11.8 8.4h1.4v1.6h-1.4z')],
  receipt: ['M8 8.8h9v10.8l-1.5-1-1.5 1-1.5-1-1.5 1-1.5-1-1.5 1z', ks('M10 11.6h5M10 14h5M10 16.4h3', 1.2)],
  barcode: ['M6.8 9.6h1.3v8.8H6.8zM9.1 9.6h.8v8.8h-.8zM10.9 9.6h1.7v8.8h-1.7zM13.6 9.6h.8v8.8h-.8zM15.4 9.6h1.3v8.8h-1.3zM17.7 9.6h.8v8.8h-.8z'],
  scale: ['M8 19.2h9v1.4H8zM11.8 10.4h1.4v.8h-1.4zM11.8 12.4h1.4v6.8h-1.4zM7.4 11.2h10.2v1.2H7.4zM6.6 15.4a2.2 2.2 0 0 0 4.4 0zM14 15.4a2.2 2.2 0 0 0 4.4 0z', k('M12.5 9.5a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8z')],
  water: ['M12.5 8.4c2.7 3.3 4.1 5.6 4.1 7.6a4.1 4.1 0 0 1-8.2 0c0-2 1.4-4.3 4.1-7.6z', k('M10.4 16.2a2.1 2.1 0 0 0 1.6 1.9v-1.2a.9.9 0 0 1-.6-.7z')],
  store: ['M6.6 9.2h11.8l1.6 3.6H5zM7 13.6h11v6.2H7z', k('M11.3 15.8h2.4v4h-2.4zM8.2 15.2h2v1.8h-2z')],
  cart: ['M6.4 9.2h2.4v1.4H6.4zM8.2 10.6h10.4l-1.7 5.6H9.7zM10.6 17.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM15.4 17.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z'],
  nut: ['M7.9 10.2h9.2v1.6H7.9zM8.6 11.8h7.8v1.4a3.9 3.9 0 0 1-7.8 0zM11.9 8.4h1.2v1.8h-1.2z', k('M14.6 15.1a1 1 0 1 0 2 0 1 1 0 0 0-2 0z')],
  check: ['M7.6 13.9l1.6-1.6 2.3 2.3 4.9-4.9L18 11.3l-6.5 6.5z'],
  x: ['M8.8 10.7l1.5-1.5 2.4 2.4 2.4-2.4 1.5 1.5-2.4 2.4 2.4 2.4-1.5 1.5-2.4-2.4-2.4 2.4-1.5-1.5 2.4-2.4z'],
  close: ['M8.8 10.7l1.5-1.5 2.4 2.4 2.4-2.4 1.5 1.5-2.4 2.4 2.4 2.4-1.5 1.5-2.4-2.4-2.4 2.4-1.5-1.5 2.4-2.4z'],
  menu: ['M6.8 9.8h11.4v1.8H6.8zM6.8 13.7h11.4v1.8H6.8zM6.8 17.6h7.2v1.8H6.8z'],
  left: ['M14.4 9.2l1.5 1.5-3.6 3.5 3.6 3.5-1.5 1.5-5.1-5z'],
  right: ['M10.6 9.2L9.1 10.7l3.6 3.5-3.6 3.5 1.5 1.5 5.1-5z'],
  down: ['M7.6 12.2l1.5-1.5 3.4 3.5 3.4-3.5 1.5 1.5-4.9 5z'],
  up: ['M7.6 16.2l1.5 1.5 3.4-3.5 3.4 3.5 1.5-1.5-4.9-5z'],
  cord: ['M11.2 8.6a3.9 3.9 0 0 1 2.4 7.1v1.6H9.4v-1.6a3.9 3.9 0 0 1 1.8-7.1zM9.7 18.2h4v1.4h-4zM17.65 8.2h1.3v6.4h-1.3zM18.3 15.4a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z'],
  copy: ['M7.2 11.2h7.2v8.2H7.2zM9.8 8.6h7.2v8.2H15.4v-6.6H9.8z'],
  share: ['M12.5 7.8l3.6 3.6-1.4 1.4-1.2-1.2v5h-2v-5l-1.2 1.2-1.4-1.4zM7.4 14.8h1.8v3.2h6.6v-3.2h1.8v5H7.4z'],
  print: ['M9 8.4h7v3.4H9zM6.8 12.4h11.4v5.2h-2.4v-2.2H9.2v2.2H6.8zM9.8 16h5.4v3.8H9.8z', ks('M11.2 17.9h2.6', 1.1)],
  mail: ['M6.8 10.2h11.4v8.4H6.8z', ks('M7.4 10.8l5.1 3.7 5.1-3.7', 1.3)],
  search: ['M11.4 8.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zM11.4 10.3a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zM14.9 15.1l3.4 3.4-1.5 1.5-3.4-3.4z'],
  house: ['M6.6 14.2l5.9-5.4 5.9 5.4v5.6H6.6z', k('M11.3 16.2h2.4v3.6h-2.4z')],
  person: ['M12.5 8.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8zM8.3 19.8a4.2 4.2 0 0 1 8.4 0z'],
  calc: ['M7.8 8.6h9.4v11.2H7.8z', k('M9.4 10.2h6.2v2.6H9.4zM9.4 14.2h1.6v1.6H9.4zM11.7 14.2h1.6v1.6h-1.6zM14 14.2h1.6v1.6H14zM9.4 16.6h1.6v1.6H9.4zM11.7 16.6h1.6v1.6h-1.6zM14 16.6h1.6v1.6H14z')],
  sort: ['M9.6 8.6l2.6 3.2h-1.7v7.4H8.7v-7.4H7zM15.4 20.2l-2.6-3.2h1.7V9.6h1.8v7.4h1.7z'],
  book: ['M7 9.2h4.6v10.4H7zM13.4 9.2H18v10.4h-4.6z', ks('M8.4 11.6h1.8M8.4 13.6h1.8M14.8 11.6h1.8M14.8 13.6h1.8', 1)],
  back: ['M9 12.6l4-4 1.4 1.4-1.6 1.6H18v2h-5.2l1.6 1.6L13 16.6z'],
  arrow: ['M7.5 11.6h6.2l-1.6-1.6L13.5 8.6l4 4-4 4-1.4-1.4 1.6-1.6H7.5z'],
  bed: ['M6.6 12.2h11.8v6.8h-1.6v-1.6H8.2v1.6H6.6z', k('M8.2 13.6h3.2v2.2H8.2z')],
  plus: ['M11.5 9.4h2v3.1h3.1v2h-3.1v3.1h-2v-3.1H8.4v-2h3.1z'],
  minus: ['M8.4 12.5h8.2v2H8.4z'],
  pin: ['M12.5 8.4a3.9 3.9 0 0 1 3.9 3.9c0 2.9-3.9 7.5-3.9 7.5s-3.9-4.6-3.9-7.5a3.9 3.9 0 0 1 3.9-3.9z', k('M12.5 10.8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z')],
  spark: ['M12.5 8.2l1.3 3.6 3.6 1.3-3.6 1.3-1.3 3.6-1.3-3.6-3.6-1.3 3.6-1.3z'],
  keyboard: ['M6.6 10.4h11.8v7.2H6.6z', k('M8.2 12h1.4v1.4H8.2zM10.6 12H12v1.4h-1.4zM13 12h1.4v1.4H13zM15.4 12h1.4v1.4h-1.4zM8.2 14.6h1.4V16H8.2zM10.6 14.6h4.2V16h-4.2zM15.4 14.6h1.4V16h-1.4z')],
  lock: ['M9.2 12.4V11a3.3 3.3 0 0 1 6.6 0v1.4h1v7.2H8.2v-7.2zM10.8 11v1.4h3.4V11a1.7 1.7 0 0 0-3.4 0z', k('M11.7 14.8h1.6v2.2h-1.6z')],
  phone: ['M9.4 8.4h6.2v11.4H9.4z', k('M11.4 17.8h2.2v.9h-2.2z')],
  /* the six seats: one sticker each, so six cards read as six people */
  key: ['M12.88 11.7A3.4 3.4 0 1 0 12.88 13.5h1.02v1.9h1.5v-1.9h.9v1.9h1.5v-1.9h.8v-1.8zM9.6 11.1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z'],
  clipboard: ['M10.6 8.2h3.8v1.2h1.6a1 1 0 0 1 1 1v8.6a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-8.6a1 1 0 0 1 1-1h1.6z', k('M10 14.8l1.2-1.2 1.5 1.5 3-3 1.2 1.2-4.2 4.2z')],
  scan: ['M6.8 9.6h1.3v8.8H6.8zM9.1 9.6h.8v8.8h-.8zM10.9 9.6h1.7v8.8h-1.7zM13.6 9.6h.8v8.8h-.8zM15.4 9.6h1.3v8.8h-1.3zM17.7 9.6h.8v8.8h-.8z', ks('M5.6 14h13.6', 1.3)],
  link: ['M6.2 12.6a3.5 2.7 0 1 1 7 0 3.5 2.7 0 0 1-7 0zM7.8 12.6a1.9 1.1 0 1 0 3.8 0 1.9 1.1 0 0 0-3.8 0zM11.8 12.6a3.5 2.7 0 1 1 7 0 3.5 2.7 0 0 1-7 0zM13.4 12.6a1.9 1.1 0 1 0 3.8 0 1.9 1.1 0 0 0-3.8 0z'],
  wrench: ['M10.2 7.6h1.2v2.2h2.2V7.6h1.2l1.6 1.6v2.4l-1.8 1.8h-.8v6a1.3 1.3 0 0 1-2.6 0v-6h-.8L8.6 11.6V9.2z'],
};

/** One sticker. `opts.cls` adds classes; `opts.title` names it (otherwise hidden). */
export function ic(name, size = 20, opts = {}) {
  const [cut, detail = ''] = ICONS[name] || ICONS.tag;
  const named = opts.title ? `role="img" aria-label="${String(opts.title).replace(/"/g, '&quot;')}"` : 'aria-hidden="true"';
  return `<svg class="ic-cs ${opts.cls || ''}" width="${size}" height="${size}" viewBox="0 0 24 24" ${named} focusable="false"><path class="ic-cs-l" fill-rule="evenodd" d="${LABEL}${cut}"/>${detail}</svg>`;
}

export const ICON_NAMES = Object.keys(ICONS);
