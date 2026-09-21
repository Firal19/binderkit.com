// The STAMP set — Cohort's own icons. A 24-unit grid, a 1.75 stroke with
// round caps and joins, and on every glyph one 2px ink dot: the dot a rubber
// stamp leaves where the ink pooled. Nothing here is shared with the other
// three sites, and the instruments keep their own glyphs.

const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="1" fill="currentColor" stroke="none"/>`;

export const ICONS = {
  clock: `<circle cx="12" cy="12" r="8.25"/><path d="M12 7.75V12l3.1 1.9"/>${dot(12, 12)}`,
  sun: `<circle cx="12" cy="12" r="3.6"/><path d="M12 3.25v1.9M12 18.85v1.9M3.25 12h1.9M18.85 12h1.9M5.8 5.8l1.35 1.35M16.85 16.85l1.35 1.35M5.8 18.2l1.35-1.35M16.85 7.15l1.35-1.35"/>${dot(18.6, 5.4)}`,
  moon: `<path d="M19.5 14.2A7.75 7.75 0 0 1 9.8 4.5a7.75 7.75 0 1 0 9.7 9.7z"/>${dot(17, 6.5)}`,
  pill: `<rect x="3" y="9.25" width="18" height="5.5" rx="2.75" transform="rotate(-45 12 12)"/><path d="M9.2 14.8l5.6-5.6"/>${dot(7.6, 16.4)}`,
  note: `<path d="M6.5 3.5h7.5l4 4v13h-11.5z"/><path d="M14 3.5v4h4M9.5 12h5M9.5 15.5h5"/>${dot(9.5, 8.5)}`,
  flag: `<path d="M6.5 20.5V4.25h10.75l-2.25 3.75 2.25 3.75H6.5"/>${dot(6.5, 20.5)}`,
  handoff: `<path d="M4.5 8.5h12.75M14 5.25l3.25 3.25L14 11.75M19.5 15.5H6.75M10 12.25 6.75 15.5 10 18.75"/>${dot(4.5, 8.5)}${dot(19.5, 15.5)}`,
  house: `<path d="M4 11 12 4.25 20 11v9a.75.75 0 0 1-.75.75H14.5V15h-5v5.75H4.75A.75.75 0 0 1 4 20z"/>${dot(12.75, 17.6)}`,
  bed: `<path d="M3.5 19V9.5M20.5 19v-7.25M3.5 12.75h17M3.5 17h17"/><path d="M6.5 12.75V10.5a1.25 1.25 0 0 1 1.25-1.25h3a1.25 1.25 0 0 1 1.25 1.25v2.25"/>${dot(16.5, 10.75)}`,
  record: `<path d="M6.5 3.5h7.5l4 4v13h-11.5z"/><path d="M14 3.5v4h4"/><rect x="9.25" y="11.5" width="5.5" height="5.5" rx="1.25" transform="rotate(-8 12 14.25)"/>${dot(12, 14.25)}`,
  gate: `<path d="M5 20.5V6.5M19 20.5V6.5M5 10.5h14M5 16h14M12 6.5v14"/>${dot(12, 3.75)}`,
  wifioff: `<path d="M4 9.25a11.5 11.5 0 0 1 7-3M17.25 7.6a11.5 11.5 0 0 1 2.75 1.65M6.75 12.75a7.5 7.5 0 0 1 5.25-2.2M15.5 11.5a7.5 7.5 0 0 1 1.75 1.25M9.5 16.25a3.5 3.5 0 0 1 5 0M4 4l16 16"/>${dot(12, 19.5)}`,
  print: `<path d="M7.25 8.25V3.75h9.5v4.5M7.25 17H4.5v-7.25a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5V17h-2.75"/><path d="M7.25 13.75h9.5v6.5h-9.5z"/>${dot(17, 11.75)}`,
  copy: `<rect x="8.75" y="8.75" width="11.5" height="11.5" rx="2"/><path d="M5.5 15.25h-.25a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5h8.5a1.5 1.5 0 0 1 1.5 1.5v.25"/>${dot(14.5, 14.5)}`,
  share: `<path d="M12 3.75v10.5M8.25 7.5 12 3.75l3.75 3.75M5.5 12.5v6.25a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V12.5"/>${dot(12, 17)}`,
  mail: `<rect x="3.25" y="5.25" width="17.5" height="13.5" rx="2.25"/><path d="m4 7.25 8 5.75 8-5.75"/>${dot(12, 13)}`,
  close: `<path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"/>${dot(12, 12)}`,
  menu: `<path d="M4.5 7.25h15M4.5 12h15M4.5 16.75h9"/>${dot(17, 16.75)}`,
  left: `<path d="M14.75 6 8.75 12l6 6"/>${dot(8.75, 12)}`,
  right: `<path d="m9.25 6 6 6-6 6"/>${dot(15.25, 12)}`,
  down: `<path d="m6 9.25 6 6 6-6"/>${dot(12, 15.25)}`,
  up: `<path d="m6 14.75 6-6 6 6"/>${dot(12, 8.75)}`,
  check: `<path d="m5.25 12.5 4.25 4.25L18.75 7.5"/>${dot(5.25, 12.5)}`,
  search: `<circle cx="10.75" cy="10.75" r="6.25"/><path d="m15.5 15.5 4.5 4.5"/>${dot(10.75, 10.75)}`,
  keyboard: `<rect x="3.25" y="6.25" width="17.5" height="11.5" rx="2"/><path d="M7 10h.01M10.5 10h.01M14 10h.01M17.5 10h.01M8.25 14h7.5"/>${dot(6.5, 14)}`,
  totop: `<path d="M12 19.5V7.25M7.5 11.5 12 7l4.5 4.5M6.5 4.25h11"/>${dot(12, 19.5)}`,
  text: `<path d="M3.75 18.25 8.5 6.25l4.75 12M5.6 13.75h5.8"/><path d="M19.75 11.5v6.75M19.75 14.9a2.6 2.6 0 1 0-2.6 3.35 2.6 2.6 0 0 0 2.6-2.35"/>${dot(19.75, 18.25)}`,
  plane: `<path d="M10.25 13.75 4 11.5l1.75-1.75 7.25 1.25 4.5-4.5a1.6 1.6 0 0 1 2.25 2.25l-4.5 4.5 1.25 7.25L14.75 22l-2.25-6.25-3.25 3.25.25 2.5-1.5 1.5-1.5-3.75-3.75-1.5 1.5-1.5z"/>${dot(17.4, 6.6)}`,
  link: `<path d="M10 14a3.75 3.75 0 0 0 5.3 0l2.95-2.95a3.75 3.75 0 0 0-5.3-5.3l-1.2 1.2M14 10a3.75 3.75 0 0 0-5.3 0l-2.95 2.95a3.75 3.75 0 0 0 5.3 5.3l1.2-1.2"/>${dot(12, 12)}`,
  pen: `<path d="m14.5 5.25 4.25 4.25L8.5 19.75H4.25V15.5zM12.75 7l4.25 4.25M4.25 21.5h15.5"/>${dot(6.5, 17.5)}`,
  people: `<circle cx="9" cy="8.25" r="3.25"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><path d="M15.5 5.5a3.25 3.25 0 0 1 0 5.5M17 14.4a5.5 5.5 0 0 1 3.5 4.6"/>${dot(9, 8.25)}`,
  stamp: `<path d="M9.5 8.75V6a2.5 2.5 0 0 1 5 0v2.75M5.25 13.5a2.75 2.75 0 0 1 2.75-2.75h8a2.75 2.75 0 0 1 2.75 2.75v1.75H5.25zM6 18.75h12"/>${dot(12, 7)}`,
  shield: `<path d="M12 3.5 19 6v6c0 4-3 7-7 8.5C8 19 5 16 5 12V6z"/>${dot(12, 11.5)}`,
  ext: `<path d="M14 4.5h5.5V10M19.5 4.5 11 13M9.5 6.5h-3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3"/>${dot(11, 13)}`,
  tag: `<path d="M3.75 12.5V5.25A1.5 1.5 0 0 1 5.25 3.75h7.25l7.75 7.75a1.5 1.5 0 0 1 0 2.1l-6.4 6.4a1.5 1.5 0 0 1-2.1 0z"/>${dot(8.25, 8.25)}`,
  now: `<circle cx="12" cy="12" r="6.5"/>${dot(12, 12)}`,
  info: `<circle cx="12" cy="12" r="8.25"/><path d="M12 11v5.25"/>${dot(12, 8)}`,
  addendum: `<path d="M5 5.5h14M5 10h14M5 14.5h6.5"/><path d="M15.5 17.5h5M18 15v5"/>${dot(5, 14.5)}`,
  count: `<rect x="4" y="4.5" width="16" height="15" rx="2.25"/><path d="M8 9.5h8M8 13.5h5"/>${dot(16, 16.25)}`,
  screens: `<rect x="3.25" y="5" width="11" height="14" rx="1.75"/><path d="M17 7.75h3.75v8.5H17"/>${dot(8.75, 16.5)}`,
  grad: `<path d="M12 20.25V9.5M8.25 12.75 12 9l3.75 3.75"/><path d="M4.75 20.25h14.5M4.75 4.5h14.5"/>${dot(12, 4.5)}`,
  ledger: `<path d="M5.25 4h13.5v16H5.25z"/><path d="M8.75 8.25h6.5M8.75 12h6.5M8.75 15.75h3.5"/>${dot(5.25, 20)}`,
  wave: `<path d="M3.5 12c2.2 0 2.2-3.5 4.4-3.5S10.1 12 12.3 12s2.2-3.5 4.4-3.5S18.9 12 21 12"/><path d="M3.5 16.5c2.2 0 2.2-3.5 4.4-3.5"/>${dot(21, 12)}`,
};

/** One stamp-set glyph. `opts.cls` adds a class; `opts.sw` overrides the stroke. */
export function ic(name, size = 20, opts = {}) {
  const body = ICONS[name] || ICONS.now;
  return `<svg class="ic-cohort ${opts.cls || ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${opts.sw || 1.75}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export const ICON_NAMES = Object.keys(ICONS);
