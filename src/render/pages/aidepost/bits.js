// aidepost.com — the pieces the pages are built from.
//
// Everything a visitor can tap lives here as markup that reads with JS off:
// the board is a table, the toys are buttons and range inputs with their
// resting state rendered, the flip cards are <details>. js/pages/aidepost.js
// upgrades each one by class. Rewritten 2026-09-23 to Firaol's review: short
// copy, no sibling product, no "sample data" confession, a designed phone
// board, a fit quiz for caregivers, prices that exist.

import { esc, skip, sec, h2, eyebrow, waitlist, faq, openNote } from '../../shared.js';
import { iosShell, webShell, SURFACES } from '../../instruments.js';
import { PAGES, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, JOIN } from '../../../data/page.js';
import { ic } from '../../icons/aidepost.js';
import { header, footer } from './chrome.js';
import { byId } from '../../../data/brand.js';
import { STATE_SETS } from '../../../data/states.js';
import { mark } from '../../shared.js';
import { screensOf, filmStrip as rawFilmStrip, screenSwitch, callouts as rawCallouts } from '../../instruments.js';

export { esc, skip, sec, h2, eyebrow, waitlist, faq, iosShell, webShell, ic, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, JOIN };
export { screensOf, screenSwitch, mark, byId, STATE_SETS };

/* ── two shared instruments, adjusted for this site ───────────────────
   1 · THE STRIP'S OUTER ID. filmStrip puts the id it is given on the
   .fstrip wrapper AND derives every child id from it; on /screens the strip
   sits inside sec('strip', …), which already owns #strip. The section keeps
   the name and the wrapper gives it up. */
export function filmStrip(productId, opts = {}) {
  const html = rawFilmStrip(productId, opts);
  return html.replace(/^(\s*<div class="fstrip[^"]*") id="[^"]*"/, '$1');
}

/* 2 · THE CALLOUT LIST TAKES A KEYBOARD: each sentence is a focusable
   region, so focusin lights it the way pointerover does. */
export function callouts(inner, list = [], opts = {}) {
  return rawCallouts(inner, list, opts).replace(/<li class="cal-i"/g, '<li class="cal-i" tabindex="0"').replace('<div class="cal-wrap', '<div data-scrollx class="cal-wrap');
}

/* A section that folds on a phone: two attributes, and site.js folds()
   does the rest. Only sections that are CLOSED on arrival are marked. */
export const fold = (gist, html) => html.replace('<section class="sec', `<section data-phone="fold" data-gist="${esc(gist)}" class="sec`);

export const spec = PAGES.aidepost;
export const find = (k) => spec.sections.find((s) => s.key === k);
export const S = SURFACES.aidepost;
export const screen = (key) => S.screens.find((s) => s.key === key);
export const initials = (name) => String(name).split(/\s+/).map((w) => w.replace(/[^A-Za-z]/g, '').charAt(0)).filter(Boolean).join('').slice(0, 2).toUpperCase();

/* The three staff on the sample roster. instruments.js draws the same
   three on every screen; every name here matches it, so the board, the
   claim sheet, the roster toy and the phones all agree. */
export const NAMES = ['A. Tesfaye', 'J. Ruiz', 'T. Nguyen'];
export const RELIEF = 'R. Alemu';

export const STEPS = [
  ['Build the week', 'A pattern per house makes the roster. Every shift is a row: a name, or open.', 'board'],
  ['Offer inward first', 'Your own staff see it first. A lapsed card or an overlap is shown beside a name, and nobody is removed.', 'credentials'],
  ['Post outward second', 'Nobody took it. Relief caregivers near the house see the work, the hours and the distance.', 'hire'],
];

/* The wallet: [type key, credential, issuer, expiry, state, state label, seen-by] */
export const WALLET = [
  ['cpr', 'CPR / BLS', 'American Heart Association', 'Mar 2027', 'covered', 'Current', 'Seen by M. Kebede · 12 Sep'],
  ['firstaid', 'First Aid', 'American Red Cross', 'This Friday', 'open', 'Seven-day notice', 'Seen by M. Kebede · 12 Sep'],
  ['meds', 'Medication-certified', 'Oregon DHS', 'Jan 2027', 'covered', 'Current', 'Seen by M. Kebede · 3 Aug'],
  ['shield', 'Abuse-reporter training', 'Oregon DHS', 'In 21 days', 'pending', 'Thirty-day notice', 'Self-attested'],
];

/* what Aidepost never does to a caregiver — four calm lines, no manifesto */
export const NEVER = [
  ['No background check is run on you', 'The house runs it. Aidepost holds only a status and a date.'],
  ['No rating, ever', 'Attendance is showed, did not show, or late by a number of minutes. Nothing else.'],
  ['No pay is computed here', 'Hours are exported as hours.'],
  ['No charge', 'Free, for ever. No organisation, no card, nothing to cancel.'],
];

/* ── the page wrapper every page shares ───────────────────────────────── */
export function shell(cfg, p, opts, body) {
  const fine = opts.fine != null ? opts.fine : find('foot').disclaimer;
  return `${skip()}
${header(cfg, p, opts)}
<main id="main" class="page face canvas" data-product="aidepost" data-mode="light" data-page="${esc(opts.page)}">
${body}
</main>
${footer(cfg, p, { ...opts, fine })}`;
}

/* ── the board: a table that reads, an open cell that opens ─────────────
   Desktop: the table, with a hover detail on every covered cell and the
   open cell as the one call to action. Phone (<=640): the same week drawn
   as seven day cards in a snap strip, because a 7x2 table squeezed to
   initials is a table squeezed, not a phone board. Both are in the DOM;
   CSS shows one. The card strip's open cell is a proxy for the table's
   real button, so the claim sheet has one owner. The cards are a labelled
   group of divs rather than a list: each row inside one is a 12px label
   (Day / Night) over a name, a data cell and not a line of reading matter,
   and a list item would hold it to the 15px prose floor. */
const SHIFT_HOURS = { Day: '06:00 – 14:00', Night: '22:00 – 06:00' };
export function boardTable(opts = {}) {
  const w = S.week;
  const cellOf = (c, day, row) => {
    if (c) return `<span class="cell is-covered" data-day="${esc(day)}" data-tip="${esc(c)} · ${esc(day)} ${esc(row.toLowerCase())} · ${esc(SHIFT_HOURS[row] || '')}" tabindex="0"><span class="cell-a" aria-hidden="true">${esc(initials(c))}</span><span class="cell-t">${esc(c)}</span></span>`;
    return `<button class="cell is-open" type="button" data-day="${esc(day)}" data-cell-open aria-controls="claim" aria-expanded="false" aria-label="${esc(day)} ${esc(row.toLowerCase())} is open — see how it gets covered"><span class="cell-t">Open</span><span class="cell-go" aria-hidden="true">${ic('arrow', 14, { pin: false })}</span></button>`;
  };
  const cards = w.days.map((d, i) => {
    const rows = w.rows.map(([name, cells]) => {
      const c = cells[i];
      return c
        ? `<span class="wkc-r"><i>${esc(name)}</i><b>${esc(c)}</b></span>`
        : `<button class="wkc-r is-open" type="button" data-cell-proxy aria-label="${esc(d)} ${esc(name.toLowerCase())} is open — see how it gets covered"><i>${esc(name)}</i><b>Open</b>${ic('arrow', 14, { pin: false })}</button>`;
    }).join('');
    return `<div class="wkc-d${w.rows.some(([, cells]) => !cells[i]) ? ' has-open' : ''}" data-day="${esc(d)}"><span class="wkc-n">${esc(d)}<i class="wkc-tn" aria-hidden="true">tonight</i></span>${rows}</div>`;
  }).join('');
  return `<div class="board-w" role="group" aria-label="This week’s shift board">
    <table class="board"><caption class="sr-only">Shift coverage for the week, by house</caption>
      <thead><tr><th><span class="sr-only">Shift</span></th>${w.days.map((d) => `<th scope="col" data-day="${esc(d)}"><span class="board-d">${esc(d)}</span></th>`).join('')}</tr></thead>
      <tbody>${w.rows.map(([name, cells]) => `<tr><th scope="row">${esc(name)}<small>${esc(SHIFT_HOURS[name] || '')}</small></th>${cells.map((c, i) => `<td>${cellOf(c, w.days[i], name)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  </div>
  <div class="wkc" data-scrollx role="group" aria-label="This week, day by day">${cards}</div>
  <div class="board-u">
    <p class="board-c"><b>${esc(S.detail[0])}</b> · ${esc(S.detail[1])} — ${esc(S.detail[2])}</p>
    <p class="tonight" data-tonight aria-live="polite"><span class="tonight-k">${ic('clock', 16)}Who’s on tonight</span><span class="tonight-v">Pick a day on the board.</span></p>
  </div>
  ${opts.claim === false ? '' : claimSheet(opts)}`;
}

/* ── the claim sheet: how Saturday night gets covered ─────────────────── */
/* everyone on staff at WH-1, with the marker each carries — read by the claim
   sheet and by the phone board, so both list the same three people */
export const ELIGIBLE = [
  [NAMES[0], 'CPR expired yesterday', 'expired'],
  [NAMES[1], 'already on that night · WH-2', 'open'],
  [NAMES[2], '', ''],
];
const eligList = (label) => `<ul class="elig" aria-label="${esc(label)}">${ELIGIBLE.map(([n, m, k]) => `<li class="elig-i"><span class="elig-n">${esc(n)}</span>${m ? `<span class="elig-m" data-kind="${esc(k)}">${esc(m)}</span>` : '<span class="elig-m is-none">no marker</span>'}</li>`).join('')}</ul>`;
export function claimSheet(opts = {}) {
  const d = S.shift;
  const share = `https://${esc(opts.domain || 'aidepost.com')}/#board`;
  return `<div class="claim" id="claim" hidden data-claim>
    <div class="claim-c">
      <div class="claim-h">
        <span class="claim-k">${ic('shift', 18, { pin: 'open' })}<span>Open shift</span></span>
        <b class="claim-t">${esc(d.when)}</b>
        <span class="claim-s">${esc(d.work)}</span>
        <button class="claim-x" type="button" data-close aria-label="Close">${ic('x', 18, { pin: false })}</button>
      </div>
      <ul class="needs" aria-label="What the shift asks for">${d.needs.map(([n, k]) => `<li class="need" data-kind="${esc(k)}">${esc(n)}<i>${esc(k)}</i></li>`).join('')}</ul>
      <p class="claim-cap">Shown, not required. Nobody is removed from the list.</p>
      <ol class="claim-steps" data-step="0">
        <li class="cs" data-s="1"><span class="cs-n">1</span><div><b>${esc(d.actions[0])}</b><span class="cs-w">Everyone on staff at WH-1. Two carry a marker; both stay on the list.</span>
          ${eligList('Everyone on staff at WH-1')}
          <span class="cs-r" data-cs-r="1"></span></div></li>
        <li class="cs" data-s="2"><span class="cs-n">2</span><div><b>${esc(d.actions[1])}</b><span class="cs-w">Nobody took it by Friday evening. Relief caregivers near the house see it, with the distance.</span><span class="cs-r" data-cs-r="2"></span></div></li>
        <li class="cs" data-s="3"><span class="cs-n">3</span><div><b>Claimed, then confirmed</b><span class="cs-w">The first claim stands. You decide who enters your house.</span><span class="cs-r" data-cs-r="3"></span></div></li>
      </ol>
      <div class="claim-a">
        <button class="btn pri" type="button" data-claim-act="offer">${esc(d.actions[0])}</button>
        <button class="btn" type="button" data-claim-act="post" disabled>${esc(d.actions[1])}</button>
        <button class="btn pri" type="button" data-claim-act="confirm" hidden>Confirm ${esc(RELIEF)}</button>
        <button class="btn" type="button" data-claim-act="reset" hidden>${ic('reset', 16, { pin: false })}Reset the board</button>
        <button class="btn ghost" type="button" data-share="${share}" data-share-title="Sat night at WH-1 is open — Aidepost">${ic('share', 16, { pin: false })}Share this shift</button>
      </div>
      <p class="claim-rec" data-claim-rec aria-live="polite"></p>
    </div>
  </div>`;
}

/* ── the two doors, with a boundary that follows the pointer ──────────── */
export function doors() {
  return `<div class="doors" data-doors style="--x:50%">
    <div class="doors-bg" aria-hidden="true"></div>
    <a class="door is-prov" href="#providers" data-side-set="provider"><span class="door-k">${ic('house', 22)}I run a house</span><b>Staff, credentials, the roster, hours. And the board that shows what is not covered.</b><span class="door-go">For providers ${ic('arrow', 18, { pin: false })}</span></a>
    <a class="door is-care" href="#caregivers" data-side-set="caregiver"><span class="door-k">${ic('phone', 22, { pin: 'open' })}I’m a caregiver</span><b>Open shifts near you, your own credential dates, your own hours. Free, for ever.</b><span class="door-go">For caregivers ${ic('arrow', 18, { pin: false })}</span></a>
  </div>`;
}

/* ── the roster toy: tap a cell, watch the count ──────────────────────── */
export function rosterToy() {
  const w = S.week;
  const covered = w.rows.reduce((n, [, cells]) => n + cells.filter(Boolean).length, 0);
  const total = w.rows.reduce((n, [, cells]) => n + cells.length, 0);
  return `<div class="ros" data-ros data-names="${esc(NAMES.join('|'))}">
    <div class="ros-h"><span class="ros-k">${ic('board', 20)}Build the week yourself</span><b class="ros-n" data-ros-n>${covered} of ${total} covered</b></div>
    <div class="ros-w" data-scrollx><div class="ros-g" role="group" aria-label="A seven-by-two roster; each cell is a button that changes who is on">
      <span class="ros-c0"></span>${w.days.map((d) => `<span class="ros-d">${esc(d)}</span>`).join('')}
      ${w.rows.map(([name, cells]) => `<span class="ros-l">${esc(name)}</span>${cells.map((c, i) => { const who = c ? NAMES.indexOf(c) : 3; return `<button class="ros-c ${c ? 'is-covered' : 'is-open'}" type="button" data-who="${who}" aria-label="${esc(w.days[i])} ${esc(name.toLowerCase())}: ${c ? esc(c) : 'open'}"><span class="ros-t">${c ? esc(c) : 'Open'}</span><span class="ros-i" aria-hidden="true">${c ? esc(initials(c)) : 'Open'}</span></button>`; }).join('')}`).join('')}
    </div></div>
    <p class="fine">Tap a cell to change who is on. A pattern per house makes the week; you only touch what changed.</p>
  </div>`;
}

/* ── credentials: the rail, then the slider ───────────────────────────
   The rail is the whole idea in five stations you can read in one glance:
   recorded, thirty days, seven days, expired, renewed. The slider below
   lets a reader move one card through the same stations. */
export const CRED_RAIL = [
  ['badge', 'Recorded', 'With its dates. Marked self-attested.', ''],
  ['bell', '30 days', 'The holder is told by name. You see a count.', 'pending'],
  ['bell', '7 days', 'Both, again. And on the day.', 'open'],
  ['flag', 'Expired', 'Marked on the roster. Still assignable. Your call.', 'expired'],
  ['check', 'Renewed', 'A new row. The old one stays as history.', 'covered'],
];
export const credRail = () => `<ol class="crail" aria-label="What happens to a credential, in order">${CRED_RAIL.map(([icon, t, d, k]) => `<li class="crail-s${k ? ` is-${k}` : ''}"><span class="crail-i">${ic(icon, 18, { pin: k === 'expired' || k === 'open' ? 'open' : 'ink' })}</span><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ol>`;

export function credTimeline() {
  return `<div class="tl" data-tl>
    <div class="tl-card" data-tl-card data-state="current">
      <span class="tl-k">${ic('badge', 18)}<span data-tl-k>Current</span></span>
      <b class="tl-who">${esc(NAMES[1])} · First Aid</b>
      <span class="tl-when" data-tl-when>Expires in 90 days</span>
      <p class="tl-n" data-tl-n>Recorded with its dates. Nothing to say yet.</p>
    </div>
    <div class="tl-r">
      <label class="tl-lab" for="tl-in">Move through the days: <output data-tl-out>90 days out</output></label>
      <input class="tl-in" id="tl-in" type="range" min="0" max="95" value="0" step="1" data-tl-in aria-valuetext="90 days before expiry">
      <ol class="tl-rail" aria-hidden="true"><li style="--at:0%">Recorded</li><li style="--at:63.2%">30 days</li><li style="--at:87.4%">7 days</li><li style="--at:94.7%" class="is-open">Expires</li></ol>
    </div>
    <p class="fine">Nothing on this line blocks an assignment. The decision stays yours.</p>
  </div>`;
}

/* ── the timesheet toy: seven bars, one weekly flag ───────────────────── */
export function timesheetToy() {
  const h = screen('hours');
  const HOURS = { Mon: 8, Tue: 8.5, Wed: 8, Thu: 8, Fri: 9, Sat: 8.5, Sun: 8 };
  return `<div class="ts" data-ts>
    <div class="ts-h"><span class="ts-k">${ic('timesheet', 20)}${esc(h.sub)}</span><b class="ts-t" data-ts-t>${esc(h.total)}</b></div>
    <div class="ts-w" data-scrollx><div class="ts-bars" role="group" aria-label="Seven days; each is a button that toggles whether she worked it">
      ${h.days.map(([d, hrs]) => `<button class="ts-d" type="button" data-h="${HOURS[d]}" aria-pressed="${hrs ? 'true' : 'false'}" aria-label="${esc(d)}: ${hrs ? `${HOURS[d]} hours` : 'not worked'}"><span class="ts-v">${hrs ? esc(String(HOURS[d])) : '—'}</span><span class="ts-b" style="--h:${Math.round((HOURS[d] / 9) * 100)}%"></span><span class="ts-l">${esc(d)}</span></button>`).join('')}
    </div></div>
    <p class="ts-f" data-ts-f>${esc(h.over)}</p>
    <div class="ts-a"><button class="btn sm" type="button" data-ts-export>${ic('export', 16, { pin: false })}Export CSV</button><span class="fine">Hours leave as hours, never as pay.</span></div>
  </div>`;
}

/* ── clock in at the house: a ring that closes ────────────────────────── */
export function clockToy() {
  return `<div class="ck" data-ck>
    <div class="ck-v" aria-hidden="true">
      <svg class="ck-ring" viewBox="0 0 120 120" aria-hidden="true"><circle class="ck-track" cx="60" cy="60" r="52"/><circle class="ck-arc" cx="60" cy="60" r="52" pathLength="100"/></svg>
      <span class="ck-house">${ic('house', 30)}</span>
      <span class="ck-id">WH-1</span>
    </div>
    <div class="ck-t">
      <b>Clock in at the house.</b>
      <p>No signal? It queues, and lands once. A clock event is never edited; a correction sits beside it.</p>
      <div class="ck-act"><button class="btn pri" type="button" data-ck-btn>${ic('clockin', 18, { pin: false })}<span data-ck-l>Clock in</span></button><span class="ck-stamp" data-ck-stamp aria-live="polite"></span></div>
    </div>
  </div>`;
}

/* ── the distance slider on the dark side ─────────────────────────────── */
export function distanceToy(id = 'dist') {
  const c = screen('caregiver');
  const miles = (s) => Number((s.match(/([\d.]+) miles/) || [])[1] || 0);
  return `<div class="dist" data-dist>
    <label class="dist-lab" for="${esc(id)}">${ic('distance', 20, { pin: 'open' })}Within <output data-dist-out>12</output> miles<span class="dist-n" data-dist-n>· 3 shifts</span></label>
    <input class="dist-in" id="${esc(id)}" type="range" min="2" max="25" value="12" step="1" data-dist-in aria-valuetext="12 miles">
    <ul class="offers" aria-live="polite">${c.offers.map((o) => `<li class="offer" data-mi="${miles(o.s)}"><span class="offer-t">${esc(o.t)}</span><span class="offer-s">${esc(o.s)}</span><span class="offer-st is-${esc(o.state)}">${esc(o.stateText)}</span></li>`).join('')}</ul>
    <p class="fine">Soonest first, then nearest. The work, the hours, the rate, the distance. Never a resident, never an address before you are confirmed.</p>
  </div>`;
}

/* ── does this shift fit you? four quick answers, one honest card ──────
   Never a block: a missing credential is named and the shift stays
   claimable, because that is how the product behaves on the other side. */
export const FIT_SHIFT = { when: 'Sat · Night', where: 'WH-1 · 6.2 miles', hours: '22:00 – 06:00 · awake overnight', rate: '$24 / h', needs: ['medication-certified', 'awake overnight'] };
export function fitQuiz() {
  const q = (key, label, opts) => `<div class="fq-q" role="group" aria-label="${esc(label)}"><span class="fq-l">${esc(label)}</span><div class="fq-o">${opts.map(([v, t], i) => `<button type="button" data-fq="${esc(key)}" data-v="${esc(v)}" aria-pressed="${i === 0 ? 'true' : 'false'}">${esc(t)}</button>`).join('')}</div></div>`;
  return `<div class="fq" data-fq-box>
    <div class="fq-h"><span class="fq-k">${ic('sparkle', 18, { pin: 'open' })}Does this shift fit you?</span><span class="fq-s">Four taps. Nothing here is a test.</span></div>
    <div class="fq-g">
      <div class="fq-qs">
        ${q('mi', 'How far will you go?', [['5', '5 mi'], ['10', '10 mi'], ['25', '25 mi']])}
        ${q('night', 'Awake overnight?', [['yes', 'Yes'], ['no', 'Rather not']])}
        ${q('meds', 'Medication-certified?', [['yes', 'Yes'], ['no', 'Not yet']])}
        ${q('sat', 'Free Saturday night?', [['yes', 'Yes'], ['no', 'No']])}
      </div>
      <div class="fq-card" data-fq-card data-fit="yes">
        <span class="fq-when">${esc(FIT_SHIFT.when)}</span>
        <b class="fq-where">${esc(FIT_SHIFT.where)}</b>
        <span class="fq-hours">${esc(FIT_SHIFT.hours)} · ${esc(FIT_SHIFT.rate)}</span>
        <p class="fq-out" data-fq-out aria-live="polite">This fits. Claim it, and the house confirms.</p>
        <span class="fq-note">A missing credential is shown beside your name. It never removes you from the list.</span>
      </div>
    </div>
  </div>`;
}

/* ── the wallet ───────────────────────────────────────────────────────── */
export const walletCards = () => `<div class="wallet" role="list" aria-label="A caregiver’s credentials, as cards">${WALLET.map(([kind, t, issuer, when, st, label, seen]) => `<div class="wcard is-${esc(st)}" role="listitem" data-kind="${esc(kind)}"><span class="wcard-i">${ic(kind, 22, { pin: false })}</span><span class="wcard-k">${esc(label)}</span><b>${esc(t)}</b><span class="wcard-by">${esc(issuer)} · ${esc(seen)}</span><span class="wcard-w">${esc(when)}</span></div>`).join('')}</div>`;

/* ── roles as flip cards ──────────────────────────────────────────────── */
const ROLE_ICON = { provider: 'house', manager: 'clipboard', caregiver: 'person', applicant: 'phone', 'relief worker': 'distance' };
export function flipRoles() {
  const s = find('roles');
  return `<div class="role-g">${s.rows.map(([r, who, does, dev, wash]) => `<details class="flip ${wash ? 'is-free' : ''}"><summary class="flip-f"><span class="role-n">${ic(ROLE_ICON[r] || 'person', 18, { pin: wash ? 'open' : 'ink' })}${esc(r)}</span><span class="role-w">${esc(who)}</span><span class="flip-hint">${ic('reset', 14, { pin: false })}Turn over</span></summary><div class="flip-b"><span class="role-n">${esc(r)}</span><p class="role-d">${esc(does)}</p><span class="role-r">${ic('phone', 14, { pin: false })}${esc(dev)}</span></div></details>`).join('')}</div>`;
}

/* ── pricing: two tiers, one post, and the caregiver exception ────────── */
const priceOf = (price) => {
  const i = String(price).indexOf(' / ');
  return i < 0 ? `<span class="tier-p">${esc(price)}</span>` : `<span class="tier-p">${esc(price.slice(0, i))}<small>${esc(price.slice(i))}</small></span>`;
};
export function tierBlock(p) {
  const rows = p.pricing.rows;
  const trial = rows.find(([n]) => /trial/i.test(n));
  const post = rows.find(([n]) => /^Job post/i.test(n));
  const plans = rows.filter((r) => r !== trial && r !== post);
  const FEATS = {
    Pro: ['Up to three houses', 'Staff and credential dates', 'The roster and the open-shift board', 'Clock-in and timesheets'],
    Scale: ['Unlimited houses', 'Agency roles', 'Training-plan items', 'Everything in Pro'],
  };
  return `<div class="pr">
    <div class="pr-sw" role="group" aria-label="Who pays">
      <button class="pr-b is-prov" type="button" data-side-set="provider" aria-pressed="true">Providers</button>
      <button class="pr-b is-care" type="button" data-side-set="caregiver" aria-pressed="false">Caregivers</button>
    </div>
    <div class="s-prov">
      <div class="tiers">${plans.map(([name, price, d], i) => `<div class="tier ${i === 0 ? 'is-main' : ''}">${i === 0 ? '<span class="tier-flag">Most houses</span>' : ''}<span class="tier-n">${esc(name)}</span>${priceOf(price)}<span class="tier-d">${esc(d)}</span><ul class="tier-f">${(FEATS[name] || []).map((t) => `<li>${ic('check', 14, { pin: false })}${esc(t)}</li>`).join('')}</ul><a class="btn ${i === 0 ? 'pri' : ''}" href="#join" data-cta="tier">Get early access</a></div>`).join('')}</div>
      ${post ? `<div class="tier-post"><span class="tier-post-i">${ic('post', 22)}</span><div><span class="tier-n">${esc(post[0])}</span><span class="tier-d">${esc(post[2])} On every plan, the trial included.</span></div>${priceOf(post[1])}</div>` : ''}
      ${trial ? `<p class="tier-trial">${ic('clock', 15, { pin: false })}${esc(trial[0])}: ${esc(trial[2])}</p>` : ''}
      ${openNote(p)}
    </div>
    <div class="tier-care s-care"><span class="tier-n">${ic('free', 18, { pin: 'open' })}Caregiver</span><span class="tier-p">$0<small> for ever</small></span><span class="tier-d">No organisation, no card. Your credential dates are yours and travel with you.</span><a class="btn pri" href="#join" data-cta="tier-care">Join as a caregiver</a></div>
  </div>`;
}

/* ── the board figure: the desktop mock, the phone board, five pins ────
   Above 640 the desktop shell at true size, with a row of five numbered
   chips under it and one panel that reads the active chip's sentence.
   Hover, focus or press a chip and the thing it names is ringed on the
   board. Below 640 the shell goes: a 768px picture at zoom .6 with its
   right fifth past the edge is a squeezed desktop, not a phone board.
   phoneBoard() draws the same screen for a thumb instead. Both are in the
   DOM; CSS shows one, and the chips ring the same five things on
   whichever is showing.
     annot: false — no chips (the /providers chapter tells it in steps)
     live: false  — no claim sheet on the page, so the board's actions
                    are a line, not buttons that would do nothing */
export function annotatedBoard(opts = {}) {
  const s = find('screen');
  const on = (fn) => (typeof fn === 'function' ? fn(S) : fn);
  const short = ['A covered cell', 'The open cell', 'The detail card', 'Two actions, in order', 'The eligibility list'];
  const annot = opts.annot === false ? '' : `<div class="annot" data-annot>
    <ol class="an-row" data-scrollx>${s.callouts.map(([t, d], i) => `<li><button class="an-b" type="button" data-spot="${i + 1}" aria-pressed="${i === 0 ? 'true' : 'false'}" data-an-t="${esc(on(t))}" data-an-d="${esc(d)}"><span class="an-n">${i + 1}</span><span class="an-l">${esc(short[i] || on(t))}</span></button></li>`).join('')}</ol>
    <p class="an-out" data-an-out aria-live="polite"><b>${esc(on(s.callouts[0][0]))}</b> — ${esc(s.callouts[0][1])}</p>
  </div>`;
  return `<div class="aboard" data-aboard>
    <div class="board-desk"><div class="shell" tabindex="0" role="group" aria-label="The desktop board" data-shell>${webShell('aidepost', { key: 'board' })}</div></div>
    <div class="board-phone">${phoneBoard(opts)}</div>
    ${annot}
  </div>`;
}

/* ── the board on a phone ───────────────────────────────────────────────
   The same screen the desktop mock shows, drawn at phone size: the week as
   a seven-by-two grid that fits inside the gutter at 320 (initials in a
   cell, the full name for a screen reader), Saturday night open in the
   accent, then the shift card with its two actions and the eligibility
   list — the five things the chips name. On the front page the two actions
   are real: they open the claim sheet and run it, inward first. */
export function phoneBoard(opts = {}) {
  const w = S.week; const d = S.shift;
  const live = opts.live !== false;
  const openN = w.rows.reduce((n, [, cells]) => n + cells.filter((c) => !c).length, 0);
  const cell = (c, i, r) => (c
    ? `<span class="pb-c is-covered"${i === 0 && r === 0 ? ' data-spot-el="1"' : ''}><i aria-hidden="true">${esc(initials(c))}</i><span class="sr-only">${esc(c)}</span></span>`
    : '<span class="pb-c is-open" data-spot-el="2">Open</span>');
  const acts = live
    ? `<div class="pb-act" data-spot-el="4"><button class="btn pri sm" type="button" data-claim-go="offer">${esc(d.actions[0])}</button><button class="btn sm" type="button" data-claim-go="post">${esc(d.actions[1])}</button></div>`
    : `<p class="pb-next" data-spot-el="4"><b>${esc(d.actions[0])}</b> → ${esc(d.actions[1])}</p>`;
  return `<div class="pb" data-pboard>
    <div class="pb-h"><span class="pb-k">Open shifts</span><span class="pb-s">WH-1 · this week</span><b class="pb-n">${openN} open</b></div>
    <table class="pb-g">
      <caption class="sr-only">This week at WH-1: one row per shift, covered with a name or open</caption>
      <colgroup><col class="pb-c0"><col span="7"></colgroup>
      <thead><tr><th scope="col"><span class="sr-only">Shift</span></th>${w.days.map((day) => `<th scope="col" data-day="${esc(day)}">${esc(day)}</th>`).join('')}</tr></thead>
      <tbody>${w.rows.map(([name, cells], r) => `<tr><th scope="row">${esc(name)}</th>${cells.map((c, i) => `<td>${cell(c, i, r)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
    <div class="pb-card" data-spot-el="3">
      <b class="pb-when">${esc(d.when)}</b>
      <span class="pb-work">${esc(d.work)}</span>
      <span class="pb-none">Nobody on staff has taken it yet.</span>
      <ul class="needs" aria-label="What the shift asks for">${d.needs.map(([n, k]) => `<li class="need" data-kind="${esc(k)}">${esc(n)}<i>${esc(k)}</i></li>`).join('')}</ul>
      ${acts}
    </div>
    <div class="pb-el" data-spot-el="5">
      <span class="pb-el-k">Everyone on staff at WH-1</span>
      ${eligList('Everyone on staff at WH-1, with any marker')}
      <span class="pb-el-c">Shown, not required. Nobody is removed from the list.</span>
    </div>
  </div>`;
}

/* ── the join block ───────────────────────────────────────────────────── */
export function joinBlock(cfg, p) {
  const s = find('start');
  return `<div class="wrap join-g">
    <div class="join-t">${eyebrow(JOIN.eyebrow)}<h2 id="h-join">${esc(JOIN.heading)}</h2><p class="sub">${esc(JOIN.sub)}</p>
      <div class="two">${s.columns.map((c) => `<div class="two-c ${c.wash ? 'is-free' : ''}"><span class="strip-l">${ic(c.wash ? 'phone' : 'house', 16, { pin: c.wash ? 'open' : 'ink' })}${esc(c.label)}</span><ol>${c.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>${c.foot ? `<p class="cap">${esc(c.foot)}</p>` : ''}</div>`).join('')}</div>
    </div>
    <div class="join-f">${waitlist(cfg, p, { housesLabel: 'You are' })}<p class="fine">${esc(JOIN.fine)}</p></div>
  </div>`;
}

/* ── the ring of routes ──────────────────────────────────────────────── */
export { ROUTES, routeIx, nextOf } from './chrome.js';

/* ── "what is on this page", and which side each part belongs to ─────── */
export function ixNav(rows, opts = {}) {
  if (!rows || !rows.length) return '';
  return `<nav class="ix" aria-label="${esc(opts.label || 'What is on this page')}" data-spy data-ix>
    <span class="ix-k">${ic('board', 16)}On this page</span>
    <ol class="ix-l" data-scrollx>${rows.map(([id, label, side]) => `<li><a href="#${esc(id)}" data-side-hint="${esc(side || 'both')}">${esc(label)}</a></li>`).join('')}</ol>
  </nav>`;
}

/* ── a section heading you can copy the address of ────────────────────── */
export const deepLink = (addr, what) => {
  const s = String(addr);
  if (!s.startsWith('/')) throw new Error(`deepLink("${s}"): an address must start with the route it lives on`);
  const [route, frag] = s.split('#');
  const href = `https://aidepost.com/${route.replace(/^\//, '')}${frag ? `#${frag}` : ''}`;
  return `<button class="dl" type="button" data-copy="${esc(href)}" data-copy-only data-copied="Link copied" aria-label="Copy a link to ${esc(what)}">${ic('copy', 14, { pin: false })}<span>Link</span></button>`;
};

/* ── the four words this product owns ─────────────────────────────────── */
export const stateLegend = () => `<dl class="stl" aria-label="The four words Aidepost uses">${STATE_SETS.aidepost.map(([k, label, , why]) => `<div class="stl-i is-${esc(k)}"><dt><span class="stl-d" aria-hidden="true"></span>${esc(label)}</dt><dd>${esc(why)}</dd></div>`).join('')}</dl>`;

/* ── the shift record, field by field ─────────────────────────────────── */
export const SHIFT_FIELDS = ['house', 'date', 'start', 'end', 'role', 'credentials required', 'awake overnight', 'ratio', 'rate'];
export const schemaBlock = () => `<div class="schm">
  <span class="strip-l">${ic('shift', 16)}Every field on a shift</span>
  <ul class="schm-f" aria-label="The fields a shift record carries">${SHIFT_FIELDS.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  <p class="schm-n"><b>And nothing that can describe a person receiving care.</b> The schema check asserts it. Shifts are never public; a job post is, and only once you publish it.</p>
</div>`;

/* ── everything Aidepost is able to say ───────────────────────────────── */
export function messages() {
  const ev = find('evidence');
  const q = (label) => ev.blocks.find((b) => b.label === label) || {};
  const rows = [q('What an email says'), q('What a push says')];
  return `<div class="msg">
    <span class="strip-l">${ic('mail', 16)}Every sentence it can send</span>
    <ol class="msg-l">${rows.map((b) => `<li><q class="msg-q">${esc(b.quote || '')}</q><span class="msg-w">${esc(b.text || '')}</span></li>`).join('')}</ol>
    <p class="fine">Sixteen messages, and no free-text body. A time renders as “Sat night”, never as a clock time, because a precise time gives away a person’s routine.</p>
  </div>`;
}

/* ── the first ten minutes, ticked off ────────────────────────────────── */
export function firstTen(p) {
  const steps = p.firstTen || [];
  return `<div class="ft10">
    <span class="strip-l">${ic('clock', 16)}The first ten minutes</span>
    <ul class="ft10-l">${steps.map((t, i) => `<li><input class="ft10-x" type="checkbox" id="ft10-${i}"><label for="ft10-${i}">${esc(t)}</label></li>`).join('')}</ul>
    <p class="fine">Four things, in this order, on the day you sign up. Tick them off as you find them in the rail above.</p>
  </div>`;
}

/* ── the product's own map, from its own navigation ───────────────────── */
export function productMap(p) {
  return `<div class="pmap">
    <div class="pmap-g">${(p.nav || []).map((g) => `<div class="pmap-c"><span class="strip-l">${ic(g.group === 'Organisation' ? 'house' : 'board', 16)}${esc(g.group)}</span><ul>${g.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>
    <p class="fine">Five tabs on a phone — ${(p.tabs || []).map((t) => esc(t)).join(', ')} — and the same eight destinations on a desktop. That is the whole product.</p>
  </div>`;
}
