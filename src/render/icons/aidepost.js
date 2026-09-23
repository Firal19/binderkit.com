// Aidepost's icon set — the BADGE set.
//
// A bold 2.25 stroke with round caps on a 24 grid, generous geometry, and
// the motif: every glyph carries a small filled disc in its top-right corner,
// the pin. The pin is ink by default and orchid only when the thing it marks
// is open or expired — the same two meanings the accent has everywhere else
// on the site. Nothing here is shared with the instruments' glyph set or
// with any sibling site.

const PIN = '<circle class="ic-pin" cx="20.25" cy="3.75" r="2.4" fill="currentColor" stroke="none"/>';

export const ICONS = {
  board: '<rect x="2.5" y="5" width="15" height="14" rx="3"/><path d="M2.5 10h15M7.5 10v9M12.5 10v9"/>',
  shift: '<rect x="2.5" y="6" width="14.5" height="13" rx="3"/><path d="M2.5 11h14.5M7 3.5v4M12.5 3.5v4"/>',
  person: '<circle cx="10" cy="8" r="3.75"/><path d="M3.5 20.5a6.5 6.5 0 0 1 13 0"/>',
  people: '<circle cx="8" cy="8.5" r="3.25"/><path d="M2.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="15.5" cy="10" r="2.5"/><path d="M14 20a4.5 4.5 0 0 1 5.5-4.4"/>',
  badge: '<circle cx="10" cy="9" r="5"/><path d="M6.5 13.5 5 21l5-2.5 5 2.5-1.5-7.5"/>',
  clock: '<circle cx="11" cy="12" r="8"/><path d="M11 7.5V12l3 2"/>',
  clockin: '<path d="M10 21s-6.5-5.5-6.5-11a6.5 6.5 0 0 1 13 0c0 5.5-6.5 11-6.5 11z"/><circle cx="10" cy="10" r="2.25"/>',
  timesheet: '<path d="M4.5 19.5V10M9.5 19.5V5M14.5 19.5v-7"/><path d="M2.5 19.5h14.5"/>',
  post: '<rect x="3" y="4" width="14" height="16" rx="3"/><path d="M7 9h6M7 13h6M7 17h3"/>',
  wallet: '<rect x="2.5" y="7" width="15.5" height="13" rx="3"/><path d="M2.5 11.5h15.5M14 15.75h1.5"/>',
  phone: '<rect x="6" y="3" width="11" height="18" rx="3"/><path d="M10 17.5h3"/>',
  house: '<path d="M3 11.5 11 4.5l8 7"/><path d="M5.5 10.5V20h11v-9.5"/><path d="M9.5 20v-5.5h3V20"/>',
  sun: '<circle cx="11" cy="12" r="4"/><path d="M11 3.5v2M11 18.5v2M2.5 12h2M17.5 12h2M5 6l1.4 1.4M15.6 16.6 17 18M5 18l1.4-1.4M15.6 7.4 17 6"/>',
  moon: '<path d="M18 14.5A7.5 7.5 0 0 1 8.5 5a7.5 7.5 0 1 0 9.5 9.5z"/>',
  check: '<path d="m4.5 12.5 4.5 4.5 9.5-10"/>',
  x: '<path d="M5 6l11 11M16 6 5 17"/>',
  close: '<path d="M5 6l11 11M16 6 5 17"/>',
  menu: '<path d="M3.5 7h14M3.5 12h14M3.5 17h9"/>',
  down: '<path d="m5.5 9.5 6 6 6-6"/>',
  up: '<path d="m5.5 15 6-6 6 6"/>',
  left: '<path d="m14 5.5-6 6 6 6"/>',
  right: '<path d="m8 5.5 6 6-6 6"/>',
  arrow: '<path d="M3.5 12h14M12 6.5l5.5 5.5-5.5 5.5"/>',
  back: '<path d="M18 12H4M9.5 6.5 4 12l5.5 5.5"/>',
  copy: '<rect x="8" y="8" width="11" height="12" rx="2.5"/><path d="M5 15.5A2.5 2.5 0 0 1 3 13V6a2.5 2.5 0 0 1 2.5-2.5H12"/>',
  share: '<path d="M11 3.5v11M7 7.5l4-4 4 4"/><path d="M4 12.5v5a2.5 2.5 0 0 0 2.5 2.5h8a2.5 2.5 0 0 0 2.5-2.5v-5"/>',
  print: '<path d="M6.5 8V4h9v4"/><path d="M6.5 16.5H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5a2 2 0 0 1-2 2h-1.5"/><rect x="6.5" y="13.5" width="9" height="6.5" rx="1.5"/>',
  mail: '<rect x="2.5" y="6" width="15.5" height="13" rx="3"/><path d="m3 8.5 7.25 5.5L17.5 8.5"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 5 5"/>',
  keyboard: '<rect x="2.5" y="7" width="17" height="11" rx="2.5"/><path d="M6.5 11h1M10.5 11h1M14.5 11h1M7 14.5h8"/>',
  filter: '<path d="M3.5 6.5h13.5L11.5 13v5l-3 2v-7z"/>',
  distance: '<path d="M3.5 17.5h13M6.5 17.5v-3M10 17.5v-3M13.5 17.5v-3"/><path d="M15 12.5s-3-2.6-3-5a3 3 0 0 1 6 0c0 2.4-3 5-3 5z"/>',
  sides: '<circle cx="11" cy="12" r="8"/><path d="M11 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/>',
  bell: '<path d="M5.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 2h-14z"/><path d="M9 20.5a2 2 0 0 0 4 0"/>',
  reset: '<path d="M4 12a7 7 0 1 0 2-4.9"/><path d="M4 4v4h4"/>',
  question: '<circle cx="11" cy="12" r="8"/><path d="M8.6 9.6a2.5 2.5 0 1 1 3.4 2.3c-.7.3-1 .8-1 1.4v.5"/><circle cx="11" cy="16.6" r=".7" fill="currentColor" stroke="none"/>',
  free: '<circle cx="11" cy="12" r="8"/><path d="M8.25 14.4c0 1.2 1.2 2 2.75 2s2.75-.8 2.75-2-1.2-1.7-2.75-2.1-2.75-.9-2.75-2.1 1.2-2 2.75-2 2.75.8 2.75 2"/><path d="M11 6.75v10.5"/>',
  family: '<rect x="3" y="3" width="6" height="6" rx="1.75"/><rect x="3" y="12" width="6" height="6" rx="1.75"/><rect x="12" y="12" width="6" height="6" rx="1.75"/>',
  offline: '<path d="M2.5 8.5a14 14 0 0 1 12.7-3.6M5.5 12a9.5 9.5 0 0 1 6.5-2.5M8.5 15.5a5 5 0 0 1 4.5-1"/><circle cx="12" cy="19" r="1.2" fill="currentColor" stroke="none"/><path d="M3 21 19 4"/>',
  pen: '<path d="M4 20h4l10-10-4-4L4 16z"/><path d="m12 8 4 4"/>',
  export: '<path d="M11 15V4M7 8l4-4 4 4"/><path d="M4 14v3.5A2.5 2.5 0 0 0 6.5 20h9a2.5 2.5 0 0 0 2.5-2.5V14"/>',
  /* round three: the nav, the wallet and the fit quiz */
  tag: '<path d="M3.5 4.5h7l8 8-7 7-8-8z"/><circle cx="7.5" cy="8.5" r="1.4" fill="currentColor" stroke="none"/>',
  clipboard: '<rect x="4" y="5" width="13" height="16" rx="2.5"/><path d="M7.5 5V3.5h6V5"/><path d="m7.5 13 2.2 2.2L14 10.7"/>',
  sparkle: '<path d="M11 3.5 12.7 9l5.5 1.7-5.5 1.7L11 18l-1.7-5.6-5.5-1.7 5.5-1.7z"/>',
  flag: '<path d="M5 21V4.5"/><path d="M5 5h10.5l-2 3.5 2 3.5H5"/>',
  cpr: '<path d="M11 19.5S3.5 14.8 3.5 9.4A4 4 0 0 1 11 7.2a4 4 0 0 1 7.5 2.2c0 5.4-7.5 10.1-7.5 10.1z"/><path d="M6.5 12h2.5l1.2-2.5 1.6 5 1.2-2.5h2.5"/>',
  firstaid: '<rect x="3" y="6" width="16" height="14" rx="3"/><path d="M8.5 6V4.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V6"/><path d="M11 10v6M8 13h6"/>',
  meds: '<rect x="2.6" y="9.4" width="17" height="7.5" rx="3.75" transform="rotate(-45 11 13)"/><path d="m8.4 10.4 5.2 5.2"/>',
  shield: '<path d="M11 3.5 4.5 6v5.5c0 4.5 2.8 7.6 6.5 9 3.7-1.4 6.5-4.5 6.5-9V6z"/><path d="m8.2 12.4 2 2 3.6-4"/>',
};

/**
 * One badge-set glyph. `opts.pin` is 'ink' (default), 'open' (orchid) or
 * false (no disc — used only where the disc would collide with a count).
 * `opts.label` names the glyph for assistive technology; otherwise it is
 * decorative and hidden.
 */
export function ic(name, size = 20, opts = {}) {
  const body = ICONS[name] || ICONS.board;
  const pin = opts.pin === false ? '' : PIN;
  const named = opts.label ? `role="img" aria-label="${String(opts.label).replace(/"/g, '&quot;')}"` : 'aria-hidden="true" focusable="false"';
  return `<svg class="ic-aidepost${opts.cls ? ` ${opts.cls}` : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" data-pin="${opts.pin === 'open' ? 'open' : 'ink'}" ${named}>${body}${pin}</svg>`;
}

export default ic;
