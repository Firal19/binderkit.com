// The iOS and web app shells — bottom tabs on phone, sidebar on desktop
// (D26). Three screens per product, each one the vault’s own, and one
// structural element per product that no sibling can carry. Everything reads
// the live face package through custom properties: every gap is a --t-step
// multiple, every corner a --t-r-*, every state one of the four words the
// product owns. The same markup renders five faces because the values move,
// not the markup.

import { productOf, mark, esc, state } from '../kit.js';
import { STATE_SETS } from '../data/states.js';

const E = esc;

/* ── the glyph set ─────────────────────────────────────────────────────── */
const I = {
  home: '<path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  people: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 19a4.5 4.5 0 0 1 5-4.4"/>',
  pill: '<rect x="3.5" y="9" width="17" height="6" rx="3" transform="rotate(-45 12 12)"/><path d="M8.5 15.5l7-7"/>',
  note: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
  doc: '<path d="M6 3h7.5L18 7.5V21H6z"/><path d="M13.5 3v4.5H18"/>',
  more: '<circle cx="6" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="18" cy="12" r="1.6"/>',
  box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  cart: '<path d="M4 5h2l2.2 10h9.6L20 8H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="16.5" cy="19" r="1.4"/>',
  menu: '<path d="M5 7h14M5 12h14M5 17h9"/>',
  plan: '<path d="M6 3h12v18H6z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  binder: '<path d="M7 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H7z"/><path d="M5 7h3M5 12h3M5 17h3"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>',
  shifts: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  badge: '<circle cx="12" cy="9" r="5"/><path d="M8.5 13.5 7 21l5-2.5 5 2.5-1.5-7.5"/>',
  post: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.5-4.5"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  back: '<path d="m15 6-6 6 6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  printer: '<path d="M7 8V3h10v5M7 17H4v-7h16v7h-3"/><path d="M7 14h10v7H7z"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  wifi: '<path d="M2.5 8.5a14 14 0 0 1 19 0M5.5 12a9.5 9.5 0 0 1 13 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1.2"/>',
  chat: '<path d="M4.5 5.5h15a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H10l-4.5 3.5V15.5h-1a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z"/>',
  chart: '<path d="M5 19V11M12 19V5M19 19v-5"/>',
  shield: '<path d="M12 3.5 19 6v6c0 4-3 7-7 8.5C8 19 5 16 5 12V6z"/><path d="m9 12 2 2 4-4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M4.2 7.5l2.2 1.3M17.6 15.2l2.2 1.3M4.2 16.5l2.2-1.3M17.6 8.8l2.2-1.3"/>',
  life: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.3 2.9c-.6.2-.9.8-.9 1.4v.4"/><circle cx="12" cy="17.2" r="1"/>',
  truck: '<path d="M2.5 6.5h10v9h-10z"/><path d="M12.5 9.5h4l3 3v3h-7z"/><circle cx="6.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/>',
  grad: '<path d="M2.5 9 12 5l9.5 4L12 13z"/><path d="M6.5 11v4.5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5V11"/>',
  spark: '<path d="M12 3.5 13.8 9 19.5 9.6 15.2 13 16.6 18.5 12 15.4 7.4 18.5 8.8 13 4.5 9.6 10.2 9z"/>',
  flag: '<path d="M6 21V4h12l-2.5 4L18 12H6"/>',
  layers: '<path d="m12 3.5 8.5 4.2L12 12 3.5 7.7z"/><path d="m3.5 12.4 8.5 4.2 8.5-4.2"/>',
  run: '<path d="M5 12h12"/><path d="m12.5 7.5 4.5 4.5-4.5 4.5"/>',
  panel: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M9.5 4.5v15"/>',
};
/* Optical sizing: the stroke is authored in the 24-unit viewBox, so a fixed
   1.7 paints thinner and thinner as the glyph shrinks. Scale it so every
   glyph lands near the same rendered weight — the same discipline Fraunces
   gets from opsz, applied to the one other drawn system on the board. */
export const icon = (name, size = 18) => {
  const sw = Math.max(1.25, Math.min(2.2, (1.7 * 18) / (Number(size) || 18))).toFixed(2);
  return `<svg class="ic" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[name] || I.more}</svg>`;
};

const TAB_ICONS = {
  pho: ['home', 'people', 'badge', 'binder', 'more'],
  cohort: ['home', 'people', 'pill', 'note', 'more'],
  careshop: ['home', 'box', 'cart', 'menu', 'more'],
  binderkit: ['plan', 'binder', 'clock', 'note', 'more'],
  aidepost: ['shifts', 'people', 'badge', 'post', 'more'],
};
/* One glyph per meaning. Four consecutive sidebar items sharing the page
   glyph stopped the icon column being scannable and read as a bug. */
const NAV_ICONS = {
  Today: 'home', Dashboard: 'home', Residents: 'people', 'Resident Management': 'people',
  MAR: 'pill', Documentation: 'doc', Incidents: 'note', Notes: 'note', Tasks: 'check',
  'People & access': 'people', Settings: 'gear', 'Settings & Admin': 'gear',
  Stock: 'box', 'Buy queue': 'cart', Shopping: 'cart', Menu: 'menu', Compliance: 'shield',
  Reserves: 'box', Analytics: 'chart',
  Houses: 'home', Plan: 'plan', Binders: 'binder', Versions: 'clock', Facilities: 'home',
  Shifts: 'shifts', Staff: 'people', 'Staff & Workforce': 'people', Credentials: 'badge',
  Onboarding: 'check', Timesheets: 'clock', Posts: 'post', Workspace: 'layers',
  Communication: 'chat', 'Digital Binder': 'binder', 'Reports & Analytics': 'chart',
  'Quality Assurance': 'shield', 'Regulatory Intelligence': 'search',
  'Inventory & Supplies': 'box', 'Business Portal': 'panel', Training: 'grad',
  'Job Board': 'post', 'Help & Support': 'life', Transportation: 'truck',
};
/* The nineteen customer modules, by the code the vault gives them. PHO is the
   only product whose navigation is numbered, because it is the only one that
   contains other products. */
const MODULE_NO = {
  Dashboard: 'M01', 'Resident Management': 'M02', 'Staff & Workforce': 'M03', Workspace: 'M04',
  Communication: 'M05', 'Digital Binder': 'M06', 'Job Board': 'M07', 'Reports & Analytics': 'M08',
  'Settings & Admin': 'M09', 'Business Portal': 'M10', Training: 'M11', Transportation: 'M13',
  'Inventory & Supplies': 'M14', 'Quality Assurance': 'M15', 'Help & Support': 'M16',
  'Regulatory Intelligence': 'M19',
};
/* Which room a module’s data graduated from. On PHO an accent is a SOURCE,
   never a severity — the one place four accents may appear at once. */
const GRADUATED = {
  'Resident Management': 'cohort', Workspace: 'cohort', 'Quality Assurance': 'cohort',
  'Staff & Workforce': 'aidepost', 'Job Board': 'aidepost',
  'Digital Binder': 'binderkit', 'Inventory & Supplies': 'careshop',
};

/* ── the shared primitives every screen is built from ──────────────────── */

const stLabel = (pid, key) => {
  const row = (STATE_SETS[pid] || STATE_SETS.pho || []).find((s) => s[0] === key);
  return row ? row[1] : key;
};
/** A state is a word, a dot and a weight — never a hue alone. */
const st = (pid, key, text) => (key
  ? `<span class="st-a" data-state="${E(key)}"><i></i>${E(text || stLabel(pid, key))}</span>`
  : '');
const tag = (text, kind = '') => `<span class="tg ${kind}">${E(text)}</span>`;
/** CareShop’s irreducible mark: how sure we are, beside the thing we claim. */
const conf = (kind) => (kind ? `<span class="conf-a" data-c="${E(kind)}">${E(kind)}</span>` : '');
/** Cohort’s irreducible mark: nothing else in the family signs anything. */
const stamp = (text) => (text ? `<span class="stamp-a">${E(text)}</span>` : '');
/** Binderkit’s irreducible mark: a placement, kept square so it reads as a
    stamp on paper rather than as a chip in an application. */
const place = (text) => (text ? `<span class="paper-place">${E(text)}</span>` : '');
const notice = (text, lead = '') => `<p class="notice-a">${lead ? `<b>${E(lead)}</b> ` : ''}${E(text)}</p>`;
const hit = (inner) => `<span class="hit-a">${inner}</span>`;
const num = (text) => `<span class="num-a">${E(text)}</span>`;
const btn = (text, kind = '', ic = '') => `<span class="btn-a ${kind}" aria-hidden="true">${ic ? icon(ic, 16) : ''}${E(text)}</span>`;

const EMPTY = {
  pho: { line: 'Three houses. Nothing waiting on the organisation.', note: 'Every house is running its own day; the roll-up is quiet.' },
  cohort: { line: 'Nothing is due this shift.', note: 'Completed items leave the list rather than sit in it.' },
  careshop: { line: 'Nothing is short. Nothing is dated inside the window.', note: 'The next menu will read the shelf and fill the queue by itself.' },
  binderkit: { line: 'No plan yet. Pick the licence track.', note: 'Then five questions, and the binders come out as paper.' },
  aidepost: { line: 'Every shift this week is covered.', note: 'Covered or not — that is the whole board.' },
};
const emptyA = (pid) => {
  const e = EMPTY[pid] || EMPTY.pho;
  return `<div class="empty-a"><span class="empty-a-m" aria-hidden="true">${mark(pid, 30, { label: false, mono: true })}</span><b>${E(e.line)}</b><span>${E(e.note)}</span></div>`;
};
const skelA = (n = 4) => `<div class="skel-wrap" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<div class="skel-row"><span class="skel-a" style="width:${[64, 46, 58, 38, 52, 44][i % 6]}%"></span><span class="skel-a sm"></span></div>`).join('')}</div>`;

/** The canvas’s own segmented control — the board’s `.seg` is chrome and
    carries `--b-*` into the product, which the Two-Vocabulary Rule forbids. */
const segA = (items, on) => `<span class="seg-a">${items.map((t) => `<span class="${t === on ? 'on' : ''}">${E(t)}</span>`).join('')}</span>`;

/** A list of rows. Every row may carry a state word, a signature stamp and a
    value; nothing here is product-specific except what the data says. */
const listA = (rows, pid, opts = {}) => `<div class="list-a ${opts.desk ? 'is-desk' : ''}">${rows.map((r) => `<div class="row-a ${r.on ? 'is-on' : ''}">
  <div class="row-a-main"><span class="row-a-t">${E(r.t)}${r.code ? ` <span class="mono-a">${E(r.code)}</span>` : ''}</span>${r.s ? `<span class="row-a-s">${E(r.s)}${r.conf ? ` ${conf(r.conf)}` : ''}</span>` : ''}${r.stamp ? stamp(r.stamp) : ''}</div>
  <span class="row-a-r">${r.state ? st(pid, r.state, r.stateText) : ''}${r.v ? `<span class="row-a-v">${num(r.v)}</span>` : ''}${r.chev ? icon('chevron', 16) : ''}</span>
</div>`).join('')}</div>`;

/** A table. A cell is a string, or { st }, { conf }, { tg }, { mono }, { dot }. */
const cell = (c, pid) => {
  if (c == null) return '';
  if (typeof c === 'string' || typeof c === 'number') return E(String(c));
  if (c.st) return st(pid, c.st, c.text);
  if (c.tg) return tag(c.tg, c.kind || '');
  if (c.mono) return `<span class="mono-a">${E(c.mono)}</span>`;
  if (c.conf) return `${E(c.text || '')} ${conf(c.conf)}`;
  if (c.grad) return `${E(c.text || '')} <i class="gdot" data-from="${E(c.grad)}" aria-hidden="true"></i>`;
  if (c.stamp) return stamp(c.stamp);
  return E(String(c.text || ''));
};
const tblA = (cols, rows, pid, opts = {}) => `<table class="tbl-a" data-density="${opts.density || 'regular'}">
  <thead><tr>${opts.select ? '<th class="th-x"><span class="ck-a" aria-hidden="true"></span></th>' : ''}${cols.map((c, i) => `<th${i === (opts.sort ?? -1) ? ' aria-sort="ascending"' : ''}>${E(c)}</th>`).join('')}</tr></thead>
  <tbody>${rows.map((r, i) => `<tr${i === opts.selected ? ' aria-selected="true"' : ''}>${opts.select ? `<td class="td-x"><span class="ck-a ${i === opts.selected ? 'on' : ''}" aria-hidden="true"></span></td>` : ''}${r.map((c, j) => `<td class="${j === 0 ? 'td-t' : ''}">${cell(c, pid)}</td>`).join('')}</tr>`).join('')}</tbody>
</table>`;

const tile = (t, d, extra = '', cls = '') => `<div class="tile-a ${cls}">${t ? `<div class="tile-a-t">${E(t)}</div>` : ''}${d ? `<div class="tile-a-d">${E(d)}</div>` : ''}${extra}</div>`;
const kv = (rows) => `<div class="kv-a">${rows.map(([k, v, hot]) => `<span>${E(k)}</span><b class="${hot ? 'is-accent' : ''}">${num(v)}</b>`).join('')}</div>`;

/* ── Aidepost’s week board and Binderkit’s sheet, exported so the landing
   hero can use the product’s own instrument rather than a fifth phone ──── */

/* Seven columns of names do not fit a 390pt screen, so a covered cell carries
   initials there and its full name on the wide board. An open cell carries
   nothing but the accent stroke — which is the whole emotion, and the key
   below names it. */
const initialsOf = (name) => String(name).split(/\s+/).map((w) => w.replace(/[^A-Za-z]/g, '').charAt(0)).filter(Boolean).join('').slice(0, 2).toUpperCase();

export function weekBoard(productId, opts = {}) {
  const s = screenFor(productId, { screen: 0 });
  const w = s.week || surfaces.aidepost.screens[0].week;
  const pid = productOf(productId).id;
  return `<div class="wk ${opts.wide ? 'is-wide' : ''}">
    <div class="wk-head"><span></span>${w.days.map((d) => `<span>${E(d)}</span>`).join('')}</div>
    ${w.rows.map(([name, cells]) => `<div class="wk-row"><span class="wk-lab">${E(name)}</span>${cells.map((c) => `<span class="wk-cell" data-state="${c ? 'covered' : 'open'}"><span class="wk-cell-t">${c ? E(c) : 'Open'}</span><span class="wk-cell-i" aria-hidden="true">${c ? E(initialsOf(c)) : ''}</span></span>`).join('')}</div>`).join('')}
    <div class="wk-key"><span class="st-a" data-state="covered"><i></i>${E(stLabel(pid, 'covered'))}</span><span class="st-a" data-state="open"><i></i>${E(stLabel(pid, 'open'))}</span><span class="st-a" data-state="pending"><i></i>${E(stLabel(pid, 'pending'))}</span></div>
  </div>`;
}

export function paperSheet(productId, opts = {}) {
  const s = screenFor('binderkit', { screen: 0 });
  return `<div class="paper ${opts.desk ? 'is-desk' : ''}">
    ${opts.desk ? `<div class="paper-title">${E(s.paperTitle)}</div>` : ''}
    <div class="paper-head"><span>Facility ______</span><span>Resident ______</span></div>
    ${s.rows.map(([n, item, auth, ev, pl]) => `<div class="paper-row"><span class="paper-n">${E(n)}</span><span class="paper-item">${E(item)}</span><span class="paper-auth">${E(auth)}${ev ? st('binderkit', ev) : ''}${place(pl)}</span></div>`).join('')}
    <div class="paper-foot"><span>${E(s.control)}</span><span>${E(s.printed)}</span><span>by Provider Hub Oregon</span></div>
  </div>`;
}

/* ── the screens, three per product, straight out of the vault ─────────── */

const surfaces = {
  cohort: {
    screens: [
      {
        key: 'today', tab: 0, nav: 'Today', badge: '6 due', tabBadge: { tab: 2, text: '6 due' },
        title: 'Today', sub: 'WH-1 · Day shift · 06:55',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Day shift'],
        desktopTitle: 'Today', desktopSub: 'Composed from each source surface at read time — Today stores nothing of its own.',
        gate: 'Room 2 · loratadine matches a recorded allergy. The Six Rights dialog will ask for a reason before it signs.',
        rows: [
          { t: 'Room 1', doc: '3 of 3', inc: '—', s: 'Documentation 3 of 3 · no incidents', state: 'given', stateText: '4 given', stamp: 'Logged by M. Okafor · 06:42', chev: true },
          { t: 'Room 2', doc: '2 of 3', inc: '—', s: 'Documentation 2 of 3 · allergy on file', state: 'due', stateText: '3 due', stamp: 'Next window 08:00', chev: true },
          { t: 'Room 3', doc: '3 of 3', inc: '—', s: 'Documentation 3 of 3 · held with a reason', state: 'held', stateText: '1 held', stamp: 'Logged by M. Okafor · 06:15', chev: true },
          { t: 'Room 4', doc: '1 of 3', inc: '1 awaiting sign-off', s: 'Documentation 1 of 3 · 1 incident awaiting sign-off', state: 'due', stateText: '2 due', stamp: 'Filed by T. Nguyen · 21:12', chev: true },
          { t: 'Room 5', doc: '0 of 3', inc: '—', s: 'Documentation 0 of 3 · window opens 08:00', state: 'due', stateText: '1 due', stamp: '—', chev: true },
        ],
        handoff: { t: 'Handoff · night shift', rows: [['MAR', '18 of 18 signed'], ['Documentation', '9 of 9'], ['Incidents', 'None'], ['Open issues', 'Fridge 2 reading high']], receipt: 'Read by J. Ruiz · 07:02' },
        foot: 'Nothing on this screen is red. Completed items leave the list rather than sit in it.',
        side: { kind: 'handoff', t: 'Handoff · night shift', rows: [['MAR', '18 of 18 signed'], ['Documentation', '9 of 9'], ['Incidents', 'None'], ['Open issues', 'Fridge 2 reading high']], receipt: 'Read by J. Ruiz · 07:02', cta: 'Mark as read' },
      },
      {
        key: 'marpass', tab: 2, nav: 'MAR', present: 'sheet',
        title: 'MAR · Room 2', sub: 'WH-1 · 08:00 window · 3 due',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Room 2 · 08:00'],
        desktopTitle: 'MAR pass', desktopSub: 'Scheduled → Six Rights → allergy check → PRN interval → signed, with who and when.',
        rows: [
          { t: 'Loratadine 10 mg · by mouth', s: '08:00 window · matches a recorded allergy', state: 'due', chev: true },
          { t: 'Metformin 500 mg · by mouth', s: '08:00 window · with food', state: 'due', chev: true },
          { t: 'Ibuprofen 200 mg · as needed', s: 'last dose 05:50 · minimum interval 4 h', state: 'due', chev: true },
          { t: 'Vitamin D 1000 IU', s: '06:00 window', state: 'given', stamp: 'Logged by M. Okafor · 06:04' },
          { t: 'Senna 8.6 mg', s: 'withheld — resident declined', state: 'held', stamp: 'Logged by M. Okafor · 06:15' },
        ],
        sheet: {
          title: 'Six Rights', sub: 'Loratadine 10 mg · Room 2 · 08:00',
          rows: [
            ['Right resident', 'Room 2 · WH-1'],
            ['Right drug', 'Loratadine 10 mg'],
            ['Right dose', 'One tablet'],
            ['Right route', 'By mouth'],
            ['Right time', '08:00 window · now 07:58'],
            ['Right documentation', 'Signs as Given, with who and when'],
          ],
          gates: [
            'Loratadine matches a recorded allergy. Recording an override requires a reason.',
            'Ibuprofen as-needed — 2 h 08 m since the last dose, under the 4 h minimum interval.',
          ],
          actions: ['Record an override', 'Cancel'],
        },
        foot: 'Two gates, both chosen because the harm of not stopping is physical. Everything else surfaces and steps aside.',
        side: { kind: 'handoff', t: 'This pass', rows: [['Scheduled', '6'], ['Signed', '3'], ['Gates raised', '2'], ['Overrides', 'None yet']], receipt: 'Witness co-sign is off — WH-1 is a solo house', cta: 'Start the pass' },
      },
      {
        key: 'incident', tab: 3, nav: 'Incidents',
        title: 'Incident · WH-1', sub: 'Filed 14 Sep · signed off · addendum',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Incident 0417'],
        desktopTitle: 'Incident', desktopSub: 'Filed offline-safe and idempotent → notified → reviewed → signed off → locked. Addenda append forever.',
        trail: [
          ['Filed', 'Offline-safe, idempotent', 'M. Okafor · 21:12', 'settled'],
          ['Manager notified', 'Push: “WH-1: an incident was filed.”', '21:12', 'settled'],
          ['Reviewed', 'Read on the house phone', 'J. Ruiz · 07:02', 'settled'],
          ['Signed off', 'With an addendum attached', 'J. Ruiz · 07:06', 'settled'],
          ['Addendum', 'Appended under the original — nothing replaced', 'M. Okafor · 09:20', 'given'],
        ],
        foot: 'Corrections are addenda under the original. Un-administering is forbidden by the state machine.',
        side: { kind: 'handoff', t: 'What left the house', rows: [['Email', '“You have 2 items waiting in Cohort for WH-1.”'], ['Push', '“WH-1: medication due.”'], ['Analytics', 'Per house per day, never per resident']], receipt: 'The house short-code is product-assigned, never typed', cta: 'Print for the licensing file' },
      },
      {
        key: 'handoff', tab: 4, nav: 'Handoff',
        title: 'Handoff', sub: 'WH-1 · night → day · 06:55',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Handoff'],
        desktopTitle: 'Handoff', desktopSub: 'Composed from the MAR, documentation, incidents, tasks and open issues — then read, with a receipt.',
        sheetRows: [['MAR', '18 of 18 signed', 'given'], ['Documentation', '9 of 9', 'given'], ['Incidents', 'None filed', 'given'], ['Tasks', '1 open · fridge 2', 'due'], ['Controlled count', 'Prompted at handover', 'due']],
        passage: 'Room 4 slept poorly; declined breakfast twice this week. Fridge 2 still reading high — work order filed.',
        receipt: 'Read by J. Ruiz · 07:02',
        foot: 'Acknowledgement is never assumed. The incoming caregiver reads, and a receipt is recorded.',
        side: { kind: 'handoff', t: 'Every shift', rows: [['Composed', 'from the record'], ['Written', 'one passage'], ['Read', 'with a receipt'], ['Printed', 'for the file']], receipt: 'Handoff history is kept per shift', cta: 'Start handover' },
      },
      {
        key: 'residents', tab: 1, nav: 'Residents',
        title: 'Residents', sub: 'WH-1 · five residents',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Residents'],
        desktopTitle: 'Residents', desktopSub: 'Directory; a profile with Overview, Allergies, Diagnoses, Contacts, Summary Sheet, Plans and History.',
        rows: [
          { t: 'Room 1', s: 'No allergies recorded · plan expires Jan', state: 'given', stateText: 'Enquired', chev: true },
          { t: 'Room 2', s: 'Allergy · loratadine', state: 'due', stateText: 'Allergy', chev: true },
          { t: 'Room 3', s: 'Allergy · tree nut, peanut', state: 'due', stateText: 'Allergy', chev: true },
          { t: 'Room 4', s: 'Elopement window · from the plan', state: 'held', stateText: 'Plan', chev: true },
          { t: 'Room 5', s: 'Nobody has recorded allergies yet', state: 'held', stateText: 'Not asked', chev: true },
        ],
        foot: '“No allergies recorded” and “nobody has asked yet” are two different facts, and the record keeps them apart.',
        side: { kind: 'handoff', t: 'Summary sheet', rows: [['Allergies', 'on file'], ['Diagnoses', '2'], ['Contacts', '3'], ['Plan version', 'v3 · expires Jan']], receipt: 'Printed for the licensing file', cta: 'Open the summary sheet' },
      },
    ],
  },

  careshop: {
    screens: [
      {
        key: 'buy', tab: 2, nav: 'Buy queue', badge: '2 pending', tabBadge: { tab: 2, text: '4' },
        title: 'Buy queue', sub: 'All houses · 2 pending · 3 approved',
        scope: ['Meadow Care', 'All houses', 'This week'],
        desktopTitle: 'Buy queue', desktopSub: 'What the house is short, who asked, who approved, and the cheapest store on the ledger.',
        banner: 'This rule set has not been reviewed. Every export carries this line.',
        rows: [
          { item: 'Whole milk · 2 gal', origin: 'Menu shortfall · Thu dinner', conf: '', state: 'short', stage: 'Pending', asked: 'K. Silva', approved: '—', store: 'WinCo · $4.98', house: 'WH-1' },
          { item: 'Bottled water · 24-pack × 3', origin: 'Reserve gap · 3 days × 5 beds', conf: 'inferred', state: 'short', stage: 'Approved', asked: 'Rule set', approved: 'M. Kebede', store: 'Costco · $9.99', house: 'All' },
          { item: 'Applesauce cups', origin: 'Expiry Watch · 2 days', conf: 'confirmed', state: 'expiring', stage: 'Approved', asked: 'T. Nguyen', approved: 'M. Kebede', store: 'Fred Meyer · $3.29', house: 'WH-2' },
          { item: 'Rice · 10 lb', origin: 'Par breach · 2 below par', conf: '', state: 'short', stage: 'Pending', asked: 'Shelf scan', approved: 'Auto · under $15', store: 'WinCo · $6.49', house: 'WH-1' },
          { item: 'Oat milk · 1 gal', origin: 'Diet tag · Room 3', conf: 'confirmed', state: 'stocked', stage: 'In cart', asked: 'K. Silva', approved: 'M. Kebede', store: 'WinCo · $4.29', house: 'WH-1' },
        ],
        foot: 'Pending → Approved → In cart → Bought → On the shelf. Every stock change is a ledger row with an actor and a reason.',
        side: { kind: 'ladder', t: 'Expiry Watch', rows: [['Applesauce cups', 2, 'expiring'], ['Whole milk · open', 3, 'expiring'], ['Yoghurt · 6', 5, 'expiring'], ['Sliced turkey', 9, 'stocked']], foot: 'Value at risk · $14.20', cta: 'Make the shopping list' },
      },
      {
        key: 'menu', tab: 3, nav: 'Menu',
        title: 'Menu · this week', sub: 'WH-1 · checked against who lives here',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Week of 14 Sep'],
        desktopTitle: 'Menu week', desktopSub: 'Residents’ tags shape the menu; the menu’s shortfall files into the queue.',
        warn: 'Thursday · peanut sauce contains peanut. Room 3 carries a peanut allergen tag. Change the dish or record a substitution.',
        menu: [
          ['Mon', 'Chicken and rice', 'stocked', 'Minced for Room 2', 'confirmed'],
          ['Tue', 'Baked cod, potatoes', 'stocked', 'No pork · Room 5', 'confirmed'],
          ['Wed', 'Beef stew', 'short', 'Shortfall · 2 gal milk', ''],
          ['Thu', 'Peanut noodles', 'expiring', 'Allergen · Room 3', 'confirmed'],
          ['Fri', 'Fish tacos', 'stocked', 'Minced for Room 2', 'confirmed'],
        ],
        tags: [['Room 2', 'minced · IDDSI 5'], ['Room 3', 'peanut · tree nut'], ['Room 5', 'no pork']],
        foot: 'A resident is a label — “Room 2 · A” — never a name. The validator refuses two capitalised words.',
        side: { kind: 'ladder', t: 'Allergen check', rows: [['Peanut', 1, 'expiring'], ['Tree nut', 1, 'expiring'], ['Milk', 0, 'stocked'], ['Egg', 0, 'stocked']], foot: 'The nine standard allergens · checked on cook', cta: 'Cook this' },
      },
      {
        key: 'expiry', tab: 1, nav: 'Stock',
        title: 'Expiry Watch', sub: 'All houses · most urgent first',
        scope: ['Meadow Care', 'All houses', 'Dated stock'],
        desktopTitle: 'Expiry Watch', desktopSub: 'Dated at entry, sorted by urgency, totalled as value at risk — use it, replace it, or discard it with a reason.',
        ladder: [
          ['Applesauce cups · WH-2', 2, '$3.29', 'expiring'],
          ['Whole milk · open · WH-1', 3, '$4.98', 'expiring'],
          ['Yoghurt · 6 · WH-1', 5, '$3.49', 'expiring'],
          ['Sliced turkey · WH-1', 9, '$2.44', 'stocked'],
          ['Frozen peas · GH-1', 40, '—', 'over'],
        ],
        risk: 'Value at risk · $14.20 — use it, replace it, or discard it with a reason.',
        foot: 'Value at risk · $14.20. No inspection language anywhere on this screen — it is food safety, not a finding.',
        side: { kind: 'ladder', t: 'Reserve', rows: [['WH-1 · 5 beds', 3, 'stocked'], ['WH-2 · 4 beds', 1, 'short'], ['GH-1 · 3 beds', 3, 'stocked']], foot: 'Target = N days × licensed bed count', cta: 'File the gap' },
      },
      {
        key: 'stock', tab: 1, nav: 'Stock',
        title: 'Stock', sub: 'WH-1 · by zone · counted this morning',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Pantry'],
        desktopTitle: 'Stock by zone', desktopSub: 'Zone is where it sits in the house. Category is the catalogue facet. Aisle is the route through a store. Never the same axis.',
        zones: ['Pantry', 'Fridge', 'Freezer', 'Reserve'],
        rows: [
          { t: 'Rice · 10 lb', s: 'Par 3 · on hand 1', state: 'short', stateText: '2 below par', v: '1' },
          { t: 'Whole milk · gal', s: 'Par 2 · opened Tue', state: 'expiring', stateText: '3 days', v: '2' },
          { t: 'Oatmeal · 42 oz', s: 'Par 2 · on hand 3', state: 'stocked', stateText: 'Stocked', v: '3' },
          { t: 'Applesauce · cups', s: 'Par 12 · dated 21 Sep', state: 'expiring', stateText: '2 days', v: '9' },
          { t: 'Bottled water · 24-pk', s: 'Reserve · 3 days × 5 beds', state: 'short', stateText: 'Gap', v: '2' },
        ],
        foot: 'On hand is never typed. Every change is a ledger row with an actor and a reason — count, scan, cook, discard, receipt.',
        side: { kind: 'ladder', t: 'Counted today', rows: [['Pantry', 0, 'stocked'], ['Fridge', 0, 'stocked'], ['Freezer', 4, 'expiring'], ['Reserve', 1, 'short']], foot: 'Four zones · walk order set by the house', cta: 'Scan an item' },
      },
      {
        key: 'cook', tab: 3, nav: 'Menu',
        title: 'Cook this', sub: 'Thu dinner · chicken and rice · 5 trays',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Cook mode'],
        desktopTitle: 'Cook mode', desktopSub: 'Today’s prep in the house’s own time zone; the allergen check before you plate; stock goes down when you complete, idempotently.',
        steps: [['1', 'Rinse and simmer the rice', '18 min', 'done'], ['2', 'Sear chicken thighs', '12 min', 'now'], ['3', 'Allergen check · 5 trays', 'before plating', 'next'], ['4', 'Complete → stock down', 'rice −2 cups · chicken −3 lb', 'next']],
        trays: [['Room 1', 'regular'], ['Room 2', 'minced · IDDSI 5'], ['Room 3', 'no peanut · no tree nut'], ['Room 4', 'regular'], ['Room 5', 'no pork']],
        foot: 'Tray notes are rendered from the resident’s tags, never stored. A resident is a label — “Room 2” — never a name.',
        side: { kind: 'ladder', t: 'Allergen check', rows: [['Peanut', 0, 'stocked'], ['Tree nut', 0, 'stocked'], ['Milk', 1, 'expiring'], ['Egg', 0, 'stocked']], foot: 'Nine standard allergens · warns, never blocks', cta: 'Complete' },
      },
      {
        key: 'shop', tab: 2, nav: 'Shopping',
        title: 'Shopping', sub: 'WinCo · aisle order · 3 picks queued offline',
        scope: ['Meadow Care', 'All houses', 'WinCo run'],
        desktopTitle: 'Shopping list', desktopSub: 'An aisle-ordered list priced by store. In shopping mode a pick becomes Purchased with the actual store and the actual cost; picks queue offline.',
        aisles: [
          ['Aisle 3 · Dairy', [['Whole milk · 2 gal', '$4.98', 'picked'], ['Oat milk · 1 gal', '$4.29', 'picked']]],
          ['Aisle 7 · Grains', [['Rice · 10 lb', '$6.49', 'picked'], ['Oatmeal · 42 oz', '$3.79', 'open']]],
          ['Aisle 12 · Water', [['Bottled water · 24-pk × 3', '$9.99 at Costco', 'open']]],
        ],
        total: 'Picked $15.76 · 2 left · receipt lands prices on the shelf',
        foot: 'Picks queue offline with an idempotency key, so a pick is never counted twice. Closing the run writes the ledger.',
        side: { kind: 'ladder', t: 'This run', rows: [['Picked', 3, 'stocked'], ['Left', 2, 'short'], ['Queued offline', 3, 'expiring']], foot: 'Till roll read on the device', cta: 'Close the run' },
      },
    ],
  },

  binderkit: {
    screens: [
      {
        key: 'contents', tab: 1, nav: 'Binders', badge: 'Print',
        title: 'Resident binder', sub: 'Contents · v1 · RB-0417',
        scope: ['Meadow Care', 'Facility WH-1', 'AFH-DD'],
        desktopTitle: 'Resident binder', desktopSub: 'Rendered on this machine, with the authority and the evidence tag beside every item.',
        paperTitle: 'Resident binder · contents',
        control: 'v1 · control no. RB-0417', printed: 'Printed 3 times · last 14 Sep 2026',
        rows: [
          ['Tab 1', 'Admission and documentation', 'OAR 411-360-0170', 'derived', ''],
          ['Tab 2', 'Health and medication records', 'OAR 411-360-0140', 'derived', ''],
          ['Tab 3', 'Emergency information', 'house practice', '', 'posted'],
          ['Tab 4', 'Incident and abuse reporting', 'OAR 411-360-0185', 'derived', ''],
          ['Tab 5', 'Standards', 'OAR 411-360-0130', 'derived', ''],
        ],
        foot: 'Illustrative rows — the AFH-DD library is v1’s content work. Identity fields are blank and hand-filled.',
        side: { kind: 'binders', t: 'Binders in this plan', rows: [['Resident binder', '5 tabs', 'RB-0417'], ['Staff binder', '4 tabs', 'SB-0418'], ['Facility binder', '6 tabs', 'FB-0419'], ['Emergency binder', 'posted', 'EB-0420'], ['Policy binder', '3 tabs', 'PB-0421']], cta: 'Print this binder' },
      },
      {
        key: 'intake', tab: 0, nav: 'Plan',
        title: 'Plan', sub: 'AFH-DD · five answers',
        scope: ['Meadow Care', 'Facility WH-1', 'Plan v1'],
        desktopTitle: 'Plan', desktopSub: 'Question zero selects the library; five answers generate the binders, the tabs and the reasoning.',
        refusal: 'This item is required by 411-360-0170; it can move but not go.',
        track: ['AFH-DD', 'AFH-APD', 'AFH-OHA', 'Agency'],
        questions: [
          ['0', 'Which licence track?', 'AFH-DD · OAR 411-360', 'verified'],
          ['1', 'Does the facility have staff other than the provider?', 'Yes — two caregivers', 'verified'],
          ['2', 'Does the provider live in the home?', 'Yes', 'verified'],
          ['3', 'How many residents is the home licensed for?', 'Five', 'verified'],
          ['4', 'Are any residents on one-to-one support?', 'No', 'derived'],
          ['5', 'Who keeps the policy binder?', 'The provider', 'derived'],
        ],
        foot: 'Illustrative answers — the five questions are v1’s content work. The same answers always produce the same plan.',
        side: { kind: 'binders', t: 'What comes out', rows: [['Contents page', 'per binder', ''], ['Tab dividers', '18 tabs', ''], ['One-page brief', 'per binder', ''], ['Standard operating procedure', 'per binder', '']], cta: 'Generate the plan' },
      },
      {
        key: 'versions', tab: 2, nav: 'Versions',
        title: 'Versions', sub: 'Resident binder · RB-0417 → RB-0418',
        scope: ['Meadow Care', 'Facility WH-1', 'Resident binder'],
        desktopTitle: 'Versions', desktopSub: 'An answer changed, the plan regenerated, the diff shown — notes carried by item ID.',
        diff: [
          ['v2 · RB-0418', 'Current', 'Answer 1 changed — “now has staff”', 'verified', '14 Sep 2026'],
          ['Tab 6 · Staff records', 'Added', 'OAR 411-360-0170', 'derived', ''],
          ['Tab 3 · Emergency information', 'Moved', 'Posted, not filed', 'derived', ''],
          ['v1 · RB-0417', 'Superseded, kept', 'Printed 3 times', 'superseded', '02 Sep 2026'],
        ],
        foot: 'A superseded version is kept, never deleted. Notes are carried by item ID; edits are discarded on reset, notes are not.',
        side: { kind: 'binders', t: 'Control numbers', rows: [['Resident binder', 'RB-0418', 'v2'], ['Staff binder', 'SB-0418', 'v1'], ['Facility binder', 'FB-0419', 'v1'], ['Emergency binder', 'EB-0420', 'v1'], ['Policy binder', 'PB-0421', 'v1']], cta: 'Compare versions' },
      },
      {
        key: 'print', tab: 1, nav: 'Binders',
        title: 'Print', sub: 'Resident binder · four artefacts',
        scope: ['Meadow Care', 'Facility WH-1', 'Print'],
        desktopTitle: 'Print', desktopSub: 'The contents page, the tab dividers, the brief and the procedure — each print writes a record with its control number.',
        artefacts: [['Contents page', '1 page · RB-0418', 'verified'], ['Tab dividers', '5 tabs · common divider stock', 'verified'], ['One-page brief', 'Why this binder exists', 'verified'], ['Standard operating procedure', 'How it is kept, in order', 'derived']],
        note: 'Printing every binder at once is permitted. Bulk editing is not.',
        foot: 'A print that fails consumes no control number. Any past control number reproduces the identical artefact.',
        side: { kind: 'binders', t: 'Print record', rows: [['RB-0418', 'today · 1 copy', 'v2'], ['RB-0417', '14 Sep · 3 copies', 'v1'], ['SB-0418', '02 Sep · 1 copy', 'v1']], cta: 'Print all binders' },
      },
      {
        key: 'editor', tab: 0, nav: 'Plan',
        title: 'Edit, guarded', sub: 'Resident binder · 5 tabs',
        scope: ['Meadow Care', 'Facility WH-1', 'Editor'],
        desktopTitle: 'The guarded editor', desktopSub: 'Add, remove or reorder a tab. Three guardrails answer in plain words: coverage, scope and access, cohesion.',
        tabsList: [['Tab 1', 'Admission and documentation', 'OAR 411-360-0170', 'required'], ['Tab 2', 'Health and medication records', 'OAR 411-360-0140', 'required'], ['Tab 3', 'Incident and abuse reporting', 'OAR 411-360-0185', 'required'], ['Tab 4', 'Emergency information', 'OAR 411-360-0150', 'movable'], ['Tab 5', 'Service plan and goals', 'OAR 411-360-0130', 'required'], ['Tab 6', 'House visitors log', 'Your own practice', 'custom']],
        refusal: 'This item is required by 411-360-0170; it can move but not go.',
        foot: 'A refusal names the guardrail, the rule and the alternative. A refusal that offers no alternative is a defect.',
        side: { kind: 'binders', t: 'Three guardrails', rows: [['Coverage', 'every required item stays', ''], ['Scope and access', 'nothing about a person', ''], ['Cohesion', 'a tab holds one subject', '']], cta: 'Save as version 3' },
      },
    ],
  },

  aidepost: {
    screens: [
      {
        key: 'board', tab: 0, nav: 'Shifts', badge: '1 open', tabBadge: { tab: 0, text: '1 open' },
        title: 'Open shifts', sub: 'WH-1 · this week',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'This week'],
        desktopTitle: 'Open shifts', desktopSub: 'One row per shift — covered, with a name, or open, in the accent.',
        week: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], rows: [['Day', ['M. Okafor', 'M. Okafor', 'J. Ruiz', 'J. Ruiz', 'M. Okafor', 'T. Nguyen', 'T. Nguyen']], ['Night', ['J. Ruiz', 'T. Nguyen', 'T. Nguyen', 'M. Okafor', 'J. Ruiz', '', 'T. Nguyen']]] },
        // `detail` is the legacy three-string shape the landing page reads;
        // `shift` is the same fact with the credentials the vault requires.
        detail: ['Sat · Night', 'Awake overnight · med-certified', 'Offer to own staff → post outward'],
        shift: {
          when: 'Sat · Night · 22:00 – 06:00', work: 'Awake overnight · medication-certified',
          needs: [['CPR', 'current'], ['Medication-certified', 'current'], ['21+ to work alone', 'a note']],
          caption: 'Surfaced, not required. The eligible filter shows what the shift asks for; it does not exclude.',
          actions: ['Offer to own staff', 'Post outward'],
        },
        foot: 'Covered or not. The shift describes the work, never the person — the schema has no field that can reference a resident.',
        side: { kind: 'expiry', t: 'Credentials', groups: [['Expired', [['M. Okafor · CPR', 'yesterday']], 'expired'], ['Seven-day notice', [['J. Ruiz · First Aid', 'Fri']], 'open'], ['Thirty-day notice', [['T. Nguyen · abuse-reporter', '21 days'], ['K. Silva · dementia training', '30 days']], 'pending']], cta: 'Send the seven-day notice' },
      },
      {
        key: 'credentials', tab: 2, nav: 'Credentials',
        title: 'Credentials', sub: 'WH-1 · surfaced, never enforced',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Staff'],
        desktopTitle: 'Credentials', desktopSub: 'Entered with an expiry → thirty-day notice → seven-day notice → expired, coral on the roster.',
        ladder: [
          ['M. Okafor · CPR', 'Expired yesterday', 'expired', 'Renewed as a new row; the old one is retained'],
          ['J. Ruiz · First Aid', 'Seven-day notice · Fri', 'open', 'Notice sent 11 Sep'],
          ['T. Nguyen · abuse-reporter training', 'Thirty-day notice · 21 days', 'pending', 'OAR 407-007'],
          ['K. Silva · dementia training', 'Thirty-day notice · 30 days', 'pending', 'ORS 443.743'],
          ['M. Okafor · exclusion screening', 'Re-screen due in 84 days', 'covered', 'OIG LEIE · SAM.gov'],
        ],
        foot: 'Never a background check — the provider runs ORCHARDS and Aidepost records the status and the date.',
        side: { kind: 'expiry', t: 'This week’s roster', groups: [['Open', [['Sat · Night', 'not offered yet']], 'open'], ['Offered', [['Sun · Day', 'awaiting an answer']], 'pending'], ['Covered', [['12 shifts', 'by name']], 'covered']], cta: 'Build next week' },
      },
      {
        key: 'caregiver', tab: 0, nav: 'Shifts', lane: 'caregiver',
        title: 'Shifts near you', sub: 'Tonight · within 12 miles',
        scope: ['Aidepost', 'Near you', 'Tonight'],
        desktopTitle: 'Open shifts', desktopSub: 'One row per shift — covered, with a name, or open, in the accent.',
        tabs: ['Shifts', 'My schedule', 'Credentials', 'Profile', 'More'],
        offers: [
          { t: 'Awake overnight · Sat', s: 'Willow House · 4.2 miles · 22:00 – 06:00', state: 'open', stateText: 'Open', chev: true },
          { t: 'Relief care · Sun', s: 'Cedar House · 7.8 miles · 07:00 – 15:00', state: 'open', stateText: 'Open', chev: true },
          { t: 'Substitute caregiver · Mon', s: 'Willow House · 4.2 miles · 15:00 – 23:00', state: 'pending', stateText: 'Applied', chev: true },
        ],
        free: 'No organisation, no card. Your credential dates are yours and travel with you.',
        foot: 'The only surface in the family a consumer has to be able to find — and the only one nobody pays for.',
        side: { kind: 'expiry', t: 'Credentials', groups: [['Current', [['CPR', 'Mar 2027'], ['Medication-certified', 'Jan 2027']], 'covered'], ['Expiring', [['First Aid', 'Fri']], 'open']], cta: 'Add a credential date' },
      },
      {
        key: 'hours', tab: 1, nav: 'Timesheets',
        title: 'Hours', sub: 'M. Okafor · week of 14 Sep',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Timesheets'],
        desktopTitle: 'Timesheets', desktopSub: 'Clock in at the house, clock out, a daily total, a weekly total, the overtime flag at forty hours. Approved, then exported. Never computed into pay.',
        days: [['Mon', 8], ['Tue', 8.5], ['Wed', 0], ['Thu', 8], ['Fri', 9], ['Sat', 8.5], ['Sun', 0]],
        total: '42 h', over: 'Over forty by 2 h · weekly flag, never daily',
        rows: [{ t: 'Week of 14 Sep', s: '42 h · submitted Sunday', state: 'pending', stateText: 'To approve' }, { t: 'Week of 7 Sep', s: '38 h · approved by M. Kebede', state: 'covered', stateText: 'Approved' }, { t: 'Week of 31 Aug', s: '40 h · exported', state: 'covered', stateText: 'Exported' }],
        foot: 'Hours are exported, never calculated into pay. A correction is an addendum with a reason; the original stays.',
        side: { kind: 'expiry', t: 'This week', groups: [['To approve', [['3 timesheets', 'Sunday close']], 'pending'], ['Flagged', [['M. Okafor', '42 h']], 'open'], ['Exported', [['Week of 31 Aug', 'CSV']], 'covered']], cta: 'Approve and export' },
      },
      {
        key: 'hire', tab: 3, nav: 'Posts',
        title: 'Posts', sub: 'Awake overnight · WH-1 · live',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'Posts'],
        desktopTitle: 'Postings and hiring', desktopSub: 'A post is drafted, paid, published. An application arrives with self-attested credentials. Screened → offered → accepted → hired → a staff row, onboarding open.',
        post: { t: 'Awake overnight · Sat & Sun', s: 'Willow House · $22/h · CPR, medication-certified', state: 'covered', stateText: 'Live · 6 days' },
        pipeline: [['R. Alvarez', 'Applied Tue · CPR self-attested', 'pending', 'Screened'], ['D. Park', 'Applied Wed · medication-certified', 'open', 'Offered'], ['S. Lee', 'Applied Thu', 'pending', 'Received']],
        foot: 'A posting describes work, not a person. “One-to-one for a resident who…” raises a warning and is rewritten before it goes live.',
        side: { kind: 'expiry', t: 'On hire', groups: [['Created', [['Staff row', 'membership attached']], 'covered'], ['Copied', [['Credentials', 'as self-attested']], 'covered'], ['Opened', [['Onboarding', 'the track’s checklist']], 'pending']], cta: 'Publish a post' },
      },
    ],
  },

  pho: {
    screens: [
      {
        key: 'dashboard', tab: 0, nav: 'Dashboard', badge: 'Org',
        title: 'Meadow Care', sub: 'All houses · 3 houses · 12 residents',
        scope: ['Meadow Care', 'All houses', 'Today'],
        desktopTitle: 'Dashboard', desktopSub: 'The organisation across its houses; a dot marks which room the column’s data graduated from.',
        houses: [
          ['WH-1', 'AFH-DD', '5', '6 due', '1 awaiting sign-off', '—', 'Met'],
          ['WH-2', 'AFH-APD', '4', '2 due', '—', '—', 'Gap · water'],
          ['GH-1', 'Agency', '3', '—', '—', '1 open', 'Met'],
        ],
        foot: 'The roll-up a provider with more than one house lands on (D32). Create and edit are pushed down to the house.',
        side: { kind: 'portals', t: 'External Portals', rows: [['Case managers', '2 view windows', 'WH-1 · WH-2'], ['Families', '5 view windows', 'scoped by assignment'], ['Licensor', 'Read, scoped', 'WH-1']], foot: 'View windows, not operational systems (#51)', cta: 'Manage portals' },
      },
      {
        key: 'apps', tab: 4, nav: 'Business Portal',
        title: 'Four front doors', sub: 'providerhub.us · one foundation',
        scope: ['Provider Hub Oregon', 'Meadow Care', 'Applications'],
        desktopTitle: 'Applications', desktopSub: 'Four applications on providerhub.us, each with its own host and its own audience.',
        apps: [
          ['Customer', 'app.providerhub.us', 'Providers, staff and caregivers', '19 modules · M01–M19', 'inFlight'],
          ['Super Admin', 'admin.providerhub.us', 'A platform team of three to five', '8 modules · SA-01–SA-08', 'paused'],
          ['External Portals', 'portal.providerhub.us', 'Case managers, families, licensors', 'Read-mostly, scoped by assignment', 'settled'],
          ['Job Board', 'jobs.providerhub.us', 'Providers and credentialed applicants', 'Per-hire fee · semi-closed', 'paused'],
        ],
        foot: 'Spec-first · ~3% built. Production is rebuilt from the specs, not patched from the sandbox.',
        side: { kind: 'portals', t: 'The scale of the design', rows: [['Modules designed', '27', '~102 sub-modules'], ['Roles · permissions', '32 · 380', '10 state machines'], ['Tables', '158 designed', '109 actual'], ['Canonical points', '154', '26 research questions']], foot: 'Real counts from the design, not a projection', cta: 'Open the module map' },
      },
      {
        key: 'module', tab: 1, nav: 'Resident Management',
        title: 'Resident Management', sub: 'M02 · Critical · graduated from Cohort',
        scope: ['Meadow Care', 'WH-1 · Willow House', 'M02'],
        desktopTitle: 'Resident Management', desktopSub: 'One of nineteen customer modules. A dot marks where a room’s data graduated in.',
        rows: [
          { t: 'Residents', code: 'M02', s: 'Five residents · one licence track', state: 'settled', stateText: 'Settled', chev: true },
          { t: 'Medication administration', code: 'M02', s: 'Same tables, same words, from Cohort', state: 'inFlight', stateText: 'In flight', chev: true },
          { t: 'Care documentation', code: 'M04', s: '16 fields, 11 field types', state: 'inFlight', stateText: 'In flight', chev: true },
          { t: 'Incidents and quality', code: 'M15', s: 'Filed, reviewed, signed off, locked', state: 'settled', stateText: 'Settled', chev: true },
          { t: 'Service plans', code: 'M02', s: 'Authoring lives here, not in Cohort', state: 'paused', stateText: 'Paused', chev: true },
        ],
        foot: 'Customers graduate by export → import: the same tables, the same words — org, house, licenceTrack, resident, MAR, incident.',
        side: { kind: 'portals', t: 'What carries up', rows: [['Data', 'One export per product', 'identical table shapes'], ['Decisions', 'The D-register', 'PHO-readable'], ['Vocabulary', 'Six words', 'the same in both'], ['Code and UI', 'Do not carry', 'rebuilt on PHO’s design']], foot: 'Graduation map · assumption, to be replaced by observation', cta: 'Open the ladder' },
      },
    ],
  },
};

/* The command palette is the cheapest place a product sounds like itself: it
   is a list of that product’s own verbs and nobody else’s. */
const PALETTE = {
  pho: ['Switch house', 'Open a portal window', 'Export for the licensing file', 'Compare two houses'],
  cohort: ['Sign a dose', 'File an incident', 'Start handover', 'Add an addendum'],
  careshop: ['Scan an item', 'Approve the queue', 'Make the shopping list', 'Cook this'],
  binderkit: ['Re-plan', 'Print the contents page', 'Add a note', 'Compare versions'],
  aidepost: ['Offer to own staff', 'Post outward', 'Add a credential date', 'Export timesheets'],
};

/* ── reading the board’s own view state ────────────────────────────────── */

const view = () => (state && state.view) || {};
const clampScreen = (pid, n) => {
  const list = surfaces[pid] ? surfaces[pid].screens : [];
  const i = Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : 0;
  return list[Math.max(0, Math.min(list.length - 1, i))] || list[0];
};
function screenFor(productId, opts = {}) {
  const pid = (productOf(productId) || {}).id || 'pho';
  if (opts.key) {
    const byKey = (surfaces[pid] ? surfaces[pid].screens : []).find((s) => s.key === opts.key);
    if (byKey) return byKey;
  }
  if (pid === 'aidepost' && opts.lane === 'caregiver') return clampScreen(pid, 2);
  const n = opts.screen != null ? opts.screen : view().shellScreen;
  return clampScreen(pid, n == null ? 0 : n);
}
const fillOf = (opts) => {
  const f = opts.fill != null ? opts.fill : view().shellFill;
  return f === 'empty' || f === 'loading' ? f : 'filled';
};
const presentOf = (s, opts) => {
  const p = opts.present != null ? opts.present : view().shellPresent;
  if (p === 'none') return '';
  return p || s.present || '';
};

/* ── the phone ─────────────────────────────────────────────────────────── */

function bodyIos(p, s, fill) {
  if (fill === 'empty') return emptyA(p.id);
  if (fill === 'loading') return skelA(4);
  const k = s.key;

  if (k === 'today') {
    return `${notice(s.gate, 'Surfaced')}
      ${listA(s.rows, p.id)}
      ${tile(s.handoff.t, '', `${kv(s.handoff.rows)}<p class="receipt-a">${E(s.handoff.receipt)}</p>`)}`;
  }
  if (k === 'marpass') return listA(s.rows, p.id);
  if (k === 'incident') {
    return `<ol class="trail-a">${s.trail.map(([t, d, who, state_]) => `<li class="trail-i"><span class="trail-d" aria-hidden="true"></span><div><span class="trail-t">${E(t)}</span>${d ? `<span class="trail-s">${E(d)}</span>` : ''}${stamp(who)}</div>${st(p.id, state_, '')}</li>`).join('')}</ol>`;
  }
  if (k === 'buy') {
    return `${notice(s.banner, 'Unreviewed')}
      ${listA(s.rows.map((r) => ({ t: r.item, s: `${r.origin} · asked by ${r.asked}`, conf: r.conf, state: r.state, stamp: `${r.approved === '—' ? 'Not approved yet' : `Approved by ${r.approved}`} · ${r.store}` })), p.id)}`;
  }
  if (k === 'menu') {
    return `${notice(s.warn, 'Allergen')}
      ${listA(s.menu.map(([d, dish, state_, note, c]) => ({ t: `${d} · ${dish}`, s: note, conf: c, state: state_ })), p.id)}
      ${tile('Who lives here', '', `<div class="chip-row">${s.tags.map(([r, t]) => `<span class="tg">${E(r)} · ${E(t)}</span>`).join('')}</div>`)}`;
  }
  if (k === 'expiry') {
    return `${ladderList(s.ladder, p.id)}<p class="receipt-a">${E(s.risk)}</p>`;
  }
  if (k === 'contents') return paperSheet(p.id, { desk: false });
  if (k === 'intake') {
    return `<div class="q-track">${segA(s.track, s.track[0])}</div>
      ${listA(s.questions.map(([n, q, a, ev]) => ({ t: q, code: n === '0' ? 'Q0' : `Q${n}`, s: a, state: ev })), p.id)}
      ${notice(s.refusal, 'Refused')}`;
  }
  if (k === 'versions') {
    return listA(s.diff.map(([t, what, why, ev, when]) => ({ t, code: what, s: why, state: ev, stamp: when })), p.id);
  }
  if (k === 'board') {
    const d = s.shift;
    return `${weekBoard(p.id)}
      ${tile(d.when, d.work, `<div class="chip-row">${d.needs.map(([n, kind]) => `<span class="need-a" data-kind="${E(kind)}">${E(n)}<i>${E(kind)}</i></span>`).join('')}</div>
        <p class="receipt-a">${E(d.caption)}</p>
        <div class="btn-row">${btn(d.actions[0], 'is-primary')}${btn(d.actions[1])}</div>`, 'is-lift')}`;
  }
  if (k === 'credentials') {
    return listA(s.ladder.map(([who, when, state_, why]) => ({ t: who, s: why, state: state_, stateText: when })), p.id);
  }
  if (k === 'caregiver') {
    return `${listA(s.offers, p.id)}
      ${tile('Free, for ever', s.free, '', 'is-quiet')}`;
  }
  if (k === 'dashboard') {
    return `${listA(s.houses.map(([h, tr, res, meds, inc, open, res2]) => ({
      t: h, code: tr, s: `${res} residents · ${meds === '—' ? 'no medications due' : meds} · ${open === '—' ? 'no open shifts' : open}`, chev: true,
      state: meds === '—' ? 'settled' : 'attention', stateText: meds === '—' ? 'Settled' : meds,
    })), p.id)}
      ${gradLegend()}`;
  }
  if (k === 'apps') {
    return listA(s.apps.map(([n, host, who, what, state_]) => ({ t: n, code: host, s: `${who} · ${what}`, state: state_ })), p.id);
  }
  if (k === 'module') return `${listA(s.rows, p.id)}${gradLegend()}`;

  /* ── the screens added for the landing pages ─────────────────────── */
  if (k === 'handoff') {
    return `${tile('The sheet', 'Composed at 06:55 from the record', `<div class="kv-a">${s.sheetRows.map(([a, b, st_]) => `<span>${E(a)}</span><b>${st(p.id, st_, b)}</b>`).join('')}</div>`)}
      ${tile('From the night shift', '', `<p class="passage-a">${E(s.passage)}</p><p class="receipt-a">${E(s.receipt)}</p>`)}
      <div class="btn-row">${btn('Post handoff', 'is-primary')}${btn('Print')}</div>`;
  }
  if (k === 'residents') return listA(s.rows, p.id);
  if (k === 'stock') {
    return `<div class="q-track">${segA(s.zones, s.zones[0])}</div>
      ${listA(s.rows, p.id)}`;
  }
  if (k === 'cook') {
    return `<ol class="steps-a">${s.steps.map(([n, t, d, state_]) => `<li class="steps-i" data-state="${E(state_)}"><span class="steps-n">${E(n)}</span><div><span class="steps-t">${E(t)}</span><span class="steps-d">${E(d)}</span></div></li>`).join('')}</ol>
      ${tile('Trays', '', `<div class="chip-row">${s.trays.map(([r, t]) => `<span class="tg">${E(r)} · ${E(t)}</span>`).join('')}</div>`)}`;
  }
  if (k === 'shop') {
    return `<div class="aisles-a">${s.aisles.map(([a, items]) => `<div class="aisle-a"><span class="aisle-h">${E(a)}</span>${items.map(([t, price, state_]) => `<div class="aisle-r" data-state="${E(state_)}"><span class="ck-a ${state_ === 'picked' ? 'on' : ''}" aria-hidden="true"></span><span class="aisle-t">${E(t)}</span><span class="aisle-p">${E(price)}</span></div>`).join('')}</div>`).join('')}</div>
      <p class="receipt-a">${E(s.total)}</p>`;
  }
  if (k === 'print') {
    return `${listA(s.artefacts.map(([t, d, ev]) => ({ t, s: d, state: ev, chev: true })), p.id)}
      <p class="receipt-a">${E(s.note)}</p>
      <div class="btn-row">${btn('Print all', 'is-primary', 'printer')}</div>`;
  }
  if (k === 'editor') {
    return `${listA(s.tabsList.map(([n, t, auth, kind]) => ({ t, code: n, s: auth, state: kind === 'required' ? 'verified' : kind === 'custom' ? 'open' : 'derived', stateText: kind })), p.id)}
      ${notice(s.refusal, 'Refused')}`;
  }
  if (k === 'hours') {
    const max = Math.max(...s.days.map(([, h]) => h), 1);
    return `<div class="bars-a" role="img" aria-label="Hours worked this week, ${E(s.total)}">${s.days.map(([d, h]) => `<div class="bars-c"><span class="bars-v">${h ? E(String(h)) : ''}</span><span class="bars-b" style="--h:${Math.round((h / max) * 100)}%" data-off="${h ? '' : '1'}"></span><span class="bars-l">${E(d)}</span></div>`).join('')}</div>
      ${tile(s.total, s.over, '', 'is-accent')}
      ${listA(s.rows, p.id)}`;
  }
  if (k === 'hire') {
    return `${listA([s.post], p.id)}
      ${tile('Applicants', '3 received', `<div class="list-a">${s.pipeline.map(([who, when, state_, stage]) => `<div class="row-a"><div class="row-a-main"><span class="row-a-t">${E(who)}</span><span class="row-a-s">${E(when)}</span></div><span class="row-a-r">${st(p.id, state_, stage)}</span></div>`).join('')}</div>`)}`;
  }
  return emptyA(p.id);
}

const ladderList = (rows, pid) => `<div class="lad-a">${rows.map((r) => {
  const [t, days, val, state_] = r.length === 4 ? r : [r[0], r[1], '', r[2]];
  const pct = Math.max(6, Math.min(100, 100 - (Number(days) || 0) * 9));
  return `<div class="lad-i"><div class="lad-h"><span class="lad-t">${E(t)}</span>${st(pid, state_, `${days} ${Number(days) === 1 ? 'day' : 'days'}`)}</div><span class="lad-bar" style="--fill:${pct}%" aria-hidden="true"></span>${val ? `<span class="lad-v">${E(val)}</span>` : ''}</div>`;
}).join('')}</div>`;

const gradLegend = () => `<div class="grad-key"><span class="grad-key-t">Graduated from</span>${['cohort', 'careshop', 'binderkit', 'aidepost'].map((id) => `<span class="grad-key-i"><i class="gdot" data-from="${id}" aria-hidden="true"></i>${E(productOf(id).short)}</span>`).join('')}</div>`;

const sheetIos = (p, s) => {
  const sh = s.sheet;
  if (!sh) return '';
  return `<div class="scrim-a" aria-hidden="true"></div>
  <div class="sheet-a" role="group" aria-label="${E(sh.title)}">
    <div class="sheet-h"><span class="sheet-t">${E(sh.title)}</span><span class="sheet-s">${E(sh.sub)}</span></div>
    <div class="kv-a sheet-kv">${sh.rows.map(([k, v]) => `<span>${E(k)}</span><b>${E(v)}</b>`).join('')}</div>
    ${sh.gates.map((g) => notice(g, 'Gate')).join('')}
    <div class="btn-row">${btn(sh.actions[0], 'is-primary')}${btn(sh.actions[1])}</div>
  </div>`;
};

export function iosShell(productId, opts = {}) {
  const p = productOf(productId);
  const s = screenFor(p.id, opts);
  const mode = opts.mode === 'dark' ? 'dark' : 'light';
  const fill = fillOf(opts);
  const present = presentOf(s, opts);
  const lane = s.lane === 'caregiver' ? 'caregiver' : 'provider';
  const tabs = (s.tabs || p.tabs).map((t, i) => `<span class="tab ${i === s.tab ? 'on' : ''}">${icon(TAB_ICONS[p.id][i], 22)}<span>${E(t)}</span>${s.tabBadge && s.tabBadge.tab === i && fill === 'filled' ? `<span class="tab-b">${E(s.tabBadge.text)}</span>` : ''}</span>`).join('');
  const scopeLabel = (s.scope && s.scope[1]) || p.short;

  return `<div class="phone face canvas" data-product="${p.id}" data-mode="${mode}" data-lane="${lane}" data-screen="${E(s.key)}" role="img" aria-label="${E(p.name)} on iPhone: ${E(s.title)}">
    <div class="phone-screen">
      <div class="status ${mode === 'dark' ? 'dark' : ''}"><span class="status-time">9:41</span><span class="island" aria-hidden="true"></span><span class="status-r">${icon('wifi', 14)}<span class="batt"></span></span></div>
      <div class="navbar">
        <span class="navbar-l">${icon('layers', 17)}<span class="navbar-scope">${E(scopeLabel)}</span>${icon('down', 13)}</span>
        <span class="navbar-title">${E(s.title)}</span>
        <span class="navbar-r">${hit(icon('search', 17))}${hit(icon('bell', 17))}</span>
      </div>
      <div class="content">
        <div class="ltitle"><h2>${E(s.title)}</h2><span class="ltitle-sub">${E(s.sub)}</span></div>
        ${bodyIos(p, s, fill)}
      </div>
      <p class="foot-a">${E(s.foot)}</p>
      ${present === 'sheet' ? sheetIos(p, s) : ''}
      <div class="tabbar">${tabs}</div>
      <div class="home-ind" aria-hidden="true"></div>
    </div>
  </div>`;
}

/* ── the desktop ───────────────────────────────────────────────────────── */

function bodyWeb(p, s, fill) {
  if (fill === 'empty') return emptyA(p.id);
  if (fill === 'loading') return skelA(6);
  const k = s.key;

  if (k === 'today') {
    return `${notice(s.gate, 'Surfaced')}
      ${tblA(['Resident', 'Medications', 'Documentation', 'Incidents', 'Last entry'], s.rows.map((r) => [
      r.t, { st: r.state, text: r.stateText }, r.doc, r.inc, { stamp: r.stamp },
    ]), p.id, { sort: 0 })}`;
  }
  if (k === 'marpass') {
    return `${tblA(['Medication', 'Window', 'State', 'Signed by'], s.rows.map((r) => [
      r.t, r.s, { st: r.state }, { stamp: r.stamp || '—' },
    ]), p.id, { sort: 1 })}
      ${notice('Loratadine matches a recorded allergy. Recording an override requires a reason.', 'Gate')}`;
  }
  if (k === 'incident') {
    return `<ol class="trail-a is-desk">${s.trail.map(([t, d, who, state_]) => `<li class="trail-i"><span class="trail-d" aria-hidden="true"></span><div><span class="trail-t">${E(t)}</span><span class="trail-s">${E(d)}</span>${stamp(who)}</div>${st(p.id, state_, '')}</li>`).join('')}</ol>`;
  }
  if (k === 'buy') {
    return `${notice(s.banner, 'Unreviewed')}
      <div class="toolbar"><span class="bar-a"><span class="ck-a on" aria-hidden="true"></span>1 selected</span><span class="toolbar-r">${btn('Approve', 'is-primary sm')}${btn('Mark purchased', 'sm')}</span></div>
      ${tblA(['Item', 'Origin', 'Stock', 'Stage', 'Asked → approved', 'Cheapest at'], s.rows.map((r) => [
      `${r.item} · ${r.house}`, { conf: r.conf, text: r.origin }, { st: r.state },
      { tg: r.stage, kind: r.stage === 'Approved' || r.stage === 'In cart' ? 'is-teal' : '' },
      `${r.asked} → ${r.approved}`, r.store,
    ]), p.id, { select: true, selected: 1, sort: 0, density: 'compact' })}`;
  }
  if (k === 'menu') {
    return `${notice(s.warn, 'Allergen')}
      ${tblA(['Day', 'Dinner', 'Stock', 'Checked against', 'Confidence'], s.menu.map(([d, dish, state_, note, c]) => [
      d, dish, { st: state_ }, note, c ? { conf: c, text: '' } : '—',
    ]), p.id, { sort: 0 })}`;
  }
  if (k === 'expiry') return ladderList(s.ladder, p.id);
  if (k === 'contents') return paperSheet(p.id, { desk: true });
  if (k === 'intake') {
    return `<div class="q-track">${segA(s.track, s.track[0])}</div>
      ${tblA(['#', 'Question', 'Answer', 'Evidence'], s.questions.map(([n, q, a, ev]) => [
      { mono: n === '0' ? 'Q0' : `Q${n}` }, q, a, { st: ev },
    ]), p.id, { sort: 0 })}
      ${notice(s.refusal, 'Refused')}`;
  }
  if (k === 'versions') {
    return tblA(['Version or item', 'Change', 'Why', 'Evidence', 'Date'], s.diff.map(([t, what, why, ev, when]) => [
      t, { tg: what, kind: what === 'Current' ? 'is-teal' : '' }, why, { st: ev }, when || '—',
    ]), p.id, { sort: 4 });
  }
  if (k === 'board' || k === 'caregiver') {
    const d = surfaces.aidepost.screens[0].shift;
    return `${weekBoard(p.id, { wide: true })}
      ${tile(`${d.when} · ${d.work}`, 'Nobody on staff has taken it yet.', `<div class="chip-row">${d.needs.map(([n, kind]) => `<span class="need-a" data-kind="${E(kind)}">${E(n)}<i>${E(kind)}</i></span>`).join('')}</div>
        <p class="receipt-a">${E(d.caption)}</p>
        <div class="btn-row">${btn(d.actions[0], 'is-primary')}${btn(d.actions[1])}</div>`, 'is-lift')}`;
  }
  if (k === 'credentials') {
    return tblA(['Person and credential', 'State', 'Stage', 'Recorded'], s.ladder.map(([who, when, state_, why]) => [
      who, { st: state_ }, when, why,
    ]), p.id, { sort: 1 });
  }
  if (k === 'dashboard') {
    return `${tblA(['House', 'Track', 'Residents', 'Medications', 'Incidents', 'Open shifts', 'Reserve'], s.houses.map(([h, tr, res, meds, inc, open, rsv]) => [
      h, { mono: tr }, { grad: 'cohort', text: `${res} residents` },
      meds === '—' ? '—' : { st: 'attention', text: meds },
      inc, open === '—' ? '—' : { grad: 'aidepost', text: open },
      { grad: 'careshop', text: rsv },
    ]), p.id, { sort: 0 })}
      ${gradLegend()}
      ${tile('Regulatory intelligence', 'OAR 411-325 was amended on 15 January 2026 — 99 citations in the agency library await verification against the amendment. Shown, not enforced.')}`;
  }
  if (k === 'apps') {
    return tblA(['Application', 'Host', 'Audience', 'What it holds', 'State'], s.apps.map(([n, host, who, what, state_]) => [
      n, { mono: host }, who, what, { st: state_ },
    ]), p.id, { sort: 0 });
  }
  if (k === 'module') {
    return `${tblA(['Surface', 'Module', 'What it does', 'State'], s.rows.map((r) => [
      r.t, { mono: r.code }, r.s, { st: r.state, text: r.stateText },
    ]), p.id, { sort: 1 })}${gradLegend()}`;
  }

  /* ── the screens added for the landing pages ─────────────────────── */
  if (k === 'handoff') {
    return `${tblA(['Section', 'What the night shift left', 'State'], s.sheetRows.map(([a, b, st_]) => [a, b, { st: st_ }]), p.id)}
      ${tile('From the night shift', '', `<p class="passage-a">${E(s.passage)}</p><p class="receipt-a">${E(s.receipt)}</p>`)}`;
  }
  if (k === 'residents') {
    return tblA(['Resident', 'Allergies', 'State'], s.rows.map((r) => [r.t, r.s, { st: r.state, text: r.stateText }]), p.id, { sort: 0 });
  }
  if (k === 'stock') {
    return `<div class="q-track">${segA(s.zones, s.zones[0])}</div>
      ${tblA(['Item', 'Par and count', 'On hand', 'State'], s.rows.map((r) => [r.t, r.s, r.v, { st: r.state, text: r.stateText }]), p.id, { sort: 3 })}`;
  }
  if (k === 'cook') {
    return `<ol class="steps-a is-desk">${s.steps.map(([n, t, d, state_]) => `<li class="steps-i" data-state="${E(state_)}"><span class="steps-n">${E(n)}</span><div><span class="steps-t">${E(t)}</span><span class="steps-d">${E(d)}</span></div></li>`).join('')}</ol>
      ${tblA(['Tray', 'Note, rendered'], s.trays, p.id)}`;
  }
  if (k === 'shop') {
    return `<div class="aisles-a is-desk">${s.aisles.map(([a, items]) => `<div class="aisle-a"><span class="aisle-h">${E(a)}</span>${items.map(([t, price, state_]) => `<div class="aisle-r" data-state="${E(state_)}"><span class="ck-a ${state_ === 'picked' ? 'on' : ''}" aria-hidden="true"></span><span class="aisle-t">${E(t)}</span><span class="aisle-p">${E(price)}</span></div>`).join('')}</div>`).join('')}</div>
      <p class="receipt-a">${E(s.total)}</p>`;
  }
  if (k === 'print') {
    return tblA(['Artefact', 'What prints', 'Evidence'], s.artefacts.map(([t, d, ev]) => [t, d, { st: ev }]), p.id);
  }
  if (k === 'editor') {
    return `${tblA(['Tab', 'Item', 'Authority', 'Guard'], s.tabsList.map(([n, t, auth, kind]) => [{ mono: n }, t, { mono: auth }, { tg: kind, kind: kind === 'required' ? 'is-teal' : '' }]), p.id)}
      ${notice(s.refusal, 'Refused')}`;
  }
  if (k === 'hours') {
    const max = Math.max(...s.days.map(([, h]) => h), 1);
    return `<div class="bars-a is-desk" role="img" aria-label="Hours worked this week, ${E(s.total)}">${s.days.map(([d, h]) => `<div class="bars-c"><span class="bars-v">${h ? E(String(h)) : ''}</span><span class="bars-b" style="--h:${Math.round((h / max) * 100)}%" data-off="${h ? '' : '1'}"></span><span class="bars-l">${E(d)}</span></div>`).join('')}</div>
      ${tblA(['Week', 'Hours', 'State'], s.rows.map((r) => [r.t, r.s, { st: r.state, text: r.stateText }]), p.id)}`;
  }
  if (k === 'hire') {
    return `${tblA(['Applicant', 'Application', 'Stage'], s.pipeline.map(([who, when, state_, stage]) => [who, when, { st: state_, text: stage }]), p.id)}
      ${tile(s.post.t, s.post.s, `<p class="receipt-a">${E(s.foot)}</p>`, 'is-lift')}`;
  }
  return emptyA(p.id);
}

function railWeb(p, s) {
  const side = s.side || {};
  if (side.kind === 'handoff') {
    return tile(side.t, '', `${kv(side.rows)}<p class="receipt-a">${E(side.receipt)}</p>${btn(side.cta, 'sm')}`, 'is-lift');
  }
  if (side.kind === 'ladder') {
    return tile(side.t, '', `${ladderList(side.rows, p.id)}<p class="receipt-a">${E(side.foot)}</p>${btn(side.cta, 'sm')}`, 'is-lift');
  }
  if (side.kind === 'binders') {
    return `<div class="spines">${side.rows.map(([n, what, ctrl]) => `<div class="spine"><span class="spine-n">${E(n)}</span><span class="spine-w">${E(what)}</span>${ctrl ? `<span class="spine-c">${E(ctrl)}</span>` : ''}<span class="spine-p">${icon('printer', 14)}Print</span></div>`).join('')}</div>
    ${btn(side.cta, 'sm')}`;
  }
  if (side.kind === 'expiry') {
    return tile(side.t, '', `${side.groups.map(([g, rows, state_]) => `<div class="exp-g"><div class="exp-h">${st(p.id, state_, g)}</div>${rows.map(([who, when]) => `<div class="exp-r"><span>${E(who)}</span><b>${E(when)}</b></div>`).join('')}</div>`).join('')}${btn(side.cta, 'sm')}`, 'is-lift');
  }
  if (side.kind === 'portals') {
    return tile(side.t, '', `${side.rows.map(([a, b, c]) => `<div class="prt-r"><span class="prt-t">${E(a)}</span><span class="prt-v">${num(b)}</span><span class="prt-s">${E(c)}</span></div>`).join('')}${side.foot ? `<p class="receipt-a">${E(side.foot)}</p>` : ''}${btn(side.cta, 'sm')}`, 'is-lift');
  }
  return tile(side.t || '', '', `${kv(side.rows || [])}${btn(side.cta || '', 'sm')}`, 'is-lift');
}

const paletteWeb = (p) => `<div class="scrim-a" aria-hidden="true"></div>
<div class="pal-a" role="group" aria-label="Command palette">
  <div class="pal-q">${icon('search', 16)}<span>Type a verb…</span><span class="kbd-a">esc</span></div>
  <div class="pal-l">${(PALETTE[p.id] || []).map((v, i) => `<span class="pal-r ${i === 0 ? 'on' : ''}">${icon('run', 15)}${E(v)}</span>`).join('')}</div>
</div>`;

export function webShell(productId, opts = {}) {
  const p = productOf(productId);
  const s = screenFor(p.id, opts);
  const mode = opts.mode === 'dark' ? 'dark' : 'light';
  const fill = fillOf(opts);
  const present = presentOf(s, opts) === 'palette' ? 'palette' : '';
  const w = opts.width != null ? opts.width : view().shellW;
  const width = [1280, 1024, 768].includes(Number(w)) ? Number(w) : 1280;
  const isPho = p.id === 'pho';

  const nav = p.nav.map((g) => `<div class="snav-group"><div class="snav-g">${E(g.group)}</div>${g.items.map((it) => {
    const code = isPho ? MODULE_NO[it] : '';
    const from = isPho ? GRADUATED[it] : '';
    return `<span class="snav-item ${it === s.nav ? 'on' : ''}">${icon(NAV_ICONS[it] || 'more', 16)}<span class="snav-l">${code ? `<b class="mono-a">${E(code)}</b>` : ''}<span class="snav-t">${E(it)}</span></span>${from ? `<i class="gdot" data-from="${E(from)}" aria-hidden="true"></i>` : ''}</span>`;
  }).join('')}</div>`).join('');

  const crumb = (s.scope || []).map((c, i, a) => `${i ? '<i aria-hidden="true"></i>' : ''}${i === a.length - 1 ? `<b>${E(c)}</b>` : E(c)}`).join('');

  return `<div class="browser face canvas" data-product="${p.id}" data-mode="${mode}" data-w="${width}" data-screen="${E(s.key)}" role="img" aria-label="${E(p.name)} on the web: ${E(s.desktopTitle)}">
    <div class="browser-bar"><span class="lights" aria-hidden="true"><i></i><i></i><i></i></span><span class="url">app.${E(isPho ? 'providerhub.us' : p.domain)}</span></div>
    <div class="app">
      <aside class="snav">
        <div class="snav-brand">${mark(p.id, 24, { label: false })}<span class="snav-name">${E(p.short)}</span></div>
        ${isPho ? `<div class="appsw">${['Customer', 'Super Admin', 'Portals', 'Jobs'].map((a, i) => `<span class="${i === 0 ? 'on' : ''}">${E(a)}</span>`).join('')}</div>` : ''}
        <div class="snav-scroll">${nav}</div>
        <div class="snav-foot"><span class="avatar-a">MK</span><span class="snav-who"><b>M. Kebede</b><br>provider</span><span class="snav-cl" aria-hidden="true">${icon('panel', 15)}</span></div>
      </aside>
      <main class="main">
        <div class="topbar">
          <span class="topbar-l"><span class="ham" aria-hidden="true">${icon('menu', 18)}</span><span class="scope">${icon('layers', 15)}<span>${E((s.scope && s.scope[1]) || p.short)}</span>${icon('down', 14)}</span></span>
          <span class="search-a">${icon('search', 15)}Search ${E(p.short)}<span class="kbd-a">⌘K</span></span>
          <span class="topbar-r">${hit(icon('bell', 17))}<span class="avatar-a sm">MK</span></span>
        </div>
        <div class="page-head">
          <div><nav class="crumb" aria-label="Scope">${crumb}</nav><h2>${E(s.desktopTitle)}</h2><p>${E(s.desktopSub)}</p></div>
          ${p.id === 'binderkit' ? btn('Print', 'is-primary', 'printer') : ''}
        </div>
        <div class="page-grid">
          <section class="page-main">${bodyWeb(p, s, fill)}</section>
          <aside class="page-side">${railWeb(p, s)}</aside>
        </div>
      </main>
    </div>
    ${present === 'palette' ? paletteWeb(p) : ''}
  </div>`;
}

/* Screen 0 stays the shape the rest of the board already reads, with the
   other two hanging off it — a new key, never a changed one. */
export const SURFACES = Object.fromEntries(Object.entries(surfaces).map(([id, s]) => [id, { ...s.screens[0], screens: s.screens }]));
export const SCREENS = Object.fromEntries(Object.entries(surfaces).map(([id, s]) => [id, s.screens.map((x) => ({ key: x.key, title: x.title }))]));
