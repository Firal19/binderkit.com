// binderkit.com — the PUNCHED set.
//
// Every glyph sits inside a 1px square box with two punched holes on its
// left edge — the ring-binder holes — and is drawn at 1.5px with square caps
// and mitred joins. Nothing round unless it is a hole or a ring. The box is
// the motif: an icon here is a stamp on paper, not a pictogram in a chip.
// The glyph field is x 8–20, y 5–19 on the 24-unit grid.

import { esc } from '../../kit.js';

export const ICONS = {
  tab: 'M8.5 18.5v-13h7v3h4v10z',
  contents: 'M9 7h2M13 7h6M9 12h2M13 12h6M9 17h2M13 17h6',
  page: 'M9 19V5h7l3 3v11zM16 5v3h3',
  binder: 'M10 5h9v14h-9zM10 9H8M10 15H8M13 9h3',
  ring: 'M14 7.5a4.5 4.5 0 1 1 0 9a4.5 4.5 0 0 1 0-9zM14 5v2.5M14 16.5V19',
  stamp: 'M9 12h10v5H9zM12 12V8h4v4M11 19h6',
  print: 'M10.5 9V5h7v4M9 9h10v6h-2v4h-6v-4H9zM12 14h4',
  punch: 'M9 15h10v3H9zM11 15v-5h6v5M14 10V6',
  pen: 'M9 19l1-4 8-8 3 3-8 8zM16 9l3 3',
  question: 'M11 9.5a3 3 0 1 1 3 3v2M14 18v.5',
  track: 'M14 5v6M14 11l-4 4v4M14 11l4 4v4',
  version: 'M9 8h8M14 5l3 3-3 3M19 16h-8M14 13l-3 3 3 3',
  note: 'M9 6h10v12H9zM12 10h4M12 14h4',
  lock: 'M10 11h8v8h-8zM11.5 11V8.5a2.5 2.5 0 0 1 5 0V11',
  lamp: 'M10 11h8l-2-5h-4zM14 11v7M10 18h8',
  copy: 'M11 9h8v10h-8zM9 15V5h8',
  share: 'M14 5v10M10 9l4-4 4 4M9 13v6h10v-6',
  mail: 'M8 7h12v10H8zM8 8l6 5 6-5',
  close: 'M10 8l8 8M18 8l-8 8',
  menu: 'M9 8h10M9 12h10M9 16h10',
  right: 'M12 7l5 5-5 5',
  left: 'M16 7l-5 5 5 5',
  down: 'M9 10l5 5 5-5',
  up: 'M9 14l5-5 5 5',
  check: 'M9 12.5l3.5 3.5 6.5-7',
  search: 'M13 7.5a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM16 14.5l3.5 3.5',
  zoom: 'M13 7.5a4 4 0 1 1 0 8a4 4 0 0 1 0-8zM16 14.5l3.5 3.5M13 9.5v4M11 11.5h4',
  ruler: 'M8 16l8-8 4 4-8 8zM11 13l1.5 1.5M13 11l1.5 1.5M15 9l1.5 1.5',
  keys: 'M8 8h12v8H8zM10.5 11h1M13.5 11h1M16.5 11h1M11 13.5h6',
  reset: 'M9.5 12a4.5 4.5 0 1 0 1.3-3.2M9.5 6v3h3',
  shelf: 'M8 18h12M10 18V8h3v10M15 18V6h3v12',
  arrow: 'M9 12h10M15 8l4 4-4 4',
  turn: 'M9 5h10v10l-4 4H9zM19 15h-4v4',
  filter: 'M9 7h10l-4 5v5l-2 1v-6z',
  house: 'M9 12l5-5 5 5v7H9zM12.5 19v-4h3v4',
  person: 'M14 6a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM9 19a5 5 0 0 1 10 0z',
  chapter: 'M9 5h7v14H9zM16 8h3v11h-3M11 9h3',
  scale: 'M14 5v14M9 9l5-2 5 2M9 9l-2 5h4zM19 9l-2 5h4z',
  /* the three seats: the key that the licence holder carries, the printer
     the manager runs, the reading glasses of the one who only reads */
  key: 'M11 9.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 0 1 0-5zM13.5 12h6.5M17.5 12v2.5M20 12v2',
  glasses: 'M8 13.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0zM15 13.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0zM13 13.5h2M8 13.5V11l1-1.5M20 13.5V11l-1-1.5',
};

const BOX = '<rect x="1.5" y="1.5" width="21" height="21" stroke-width="1"/><circle cx="4.75" cy="8" r="1.25" stroke-width="1"/><circle cx="4.75" cy="16" r="1.25" stroke-width="1"/>';

/** One punched icon. `opts.bare` drops the box for a place that already has one. */
export function ic(name, size = 20, opts = {}) {
  const d = ICONS[name];
  if (!d) return '';
  const label = opts.label ? `role="img" aria-label="${esc(opts.label)}"` : 'aria-hidden="true"';
  return `<svg class="ic-binderkit ${opts.cls || ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" ${label}>${opts.bare ? '' : BOX}<path d="${d}"/></svg>`;
}

/** The lamp, with its light: the cone is drawn only when the lamp is on. */
export function lampIcon(size = 20) {
  return `<svg class="ic-binderkit ic-lamp" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${BOX}<path d="${ICONS.lamp}"/><path class="lamp-on" d="M11 13.5l-1.5 3M17 13.5l1.5 3M14 13v1" stroke-width="1"/></svg>`;
}
