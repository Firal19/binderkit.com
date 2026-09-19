// aidepost.com — the pieces the pages are built from.
//
// Everything a visitor can tap lives here as markup that reads with JS off:
// the board is a table, the toys are buttons and range inputs with their
// resting state rendered, the deck is a list, the flip cards are <details>.
// js/pages/aidepost.js upgrades each one by class.

import { esc, skip, sec, h2, eyebrow, waitlist, faq } from '../../shared.js';
import { iosShell, webShell, SURFACES } from '../../instruments.js';
import { PAGES, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, JOIN } from '../../../data/page.js';
import { ic } from '../../icons/aidepost.js';
import { header, footer } from './chrome.js';

export { esc, skip, sec, h2, eyebrow, waitlist, faq, iosShell, webShell, ic, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, JOIN };

export const spec = PAGES.aidepost;
export const find = (k) => spec.sections.find((s) => s.key === k);
export const S = SURFACES.aidepost;
export const screen = (key) => S.screens.find((s) => s.key === key);
export const initials = (name) => String(name).split(/\s+/).map((w) => w.replace(/[^A-Za-z]/g, '').charAt(0)).filter(Boolean).join('').slice(0, 2).toUpperCase();

export const STEPS = [
  ['Build the week', 'A pattern per house generates the roster. Every shift is a row: covered, with a name — or open.', 'board'],
  ['Offer inward first', 'Everyone eligible on staff is listed. Two carry markers — a lapsed certificate, an overlapping shift — and neither is removed.', 'credentials'],
  ['Post outward second', 'Nobody on staff took it. Relief workers whose area covers the house and whose availability includes nights see it, with distance.', 'hire'],
];

export const WALLET = [
  ['CPR', 'Mar 2027', 'covered', 'Current'],
  ['First Aid', 'Fri', 'open', 'Seven-day notice'],
  ['Medication-certified', 'Jan 2027', 'covered', 'Current'],
  ['Abuse-reporter training', '21 days', 'pending', 'Thirty-day notice'],
];

export const REFUSED = [
  ['Running or receiving background checks', 'FCRA territory — it changes the legal character of the business. The provider runs ORCHARDS; Aidepost holds the status she types.'],
  ['Verifying a credential with its issuer', 'The product records that a card was seen. It never claims a verification it did not perform.'],
  ['Sharing attendance facts between employers', 'Supplying assessments of a person to third parties is a regulated activity.'],
  ['Ratings, stars, or opinions about a worker', 'The same regulated activity in a friendlier costume. There is no field anywhere for an opinion about a person.'],
  ['Computing pay', 'One arithmetic error becomes a wage claim. Hours are exported, never calculated.'],
  ['Any resident-referencing field on a shift or a posting', 'Structural, not a policy — the field must not exist.'],
  ['Blocking an assignment for a credential, an age, or incomplete onboarding', 'The employer is responsible; the system informs.'],
];

export const BOUNDARY = 'Aidepost is the workforce record. It does not keep residents’ records, run the kitchen, build binders, process payroll, or run background checks.';

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

/* ── the board: a table that reads, an open cell that opens ───────────── */
export function boardTable(opts = {}) {
  const w = S.week;
  const cellOf = (c, day, row) => {
    if (c) return `<span class="cell is-covered" data-day="${esc(day)}"><span class="cell-t">${esc(c)}</span><span class="cell-i" aria-hidden="true">${esc(initials(c))}</span></span>`;
    return `<button class="cell is-open" type="button" data-day="${esc(day)}" data-cell-open aria-controls="claim" aria-expanded="false" aria-label="${esc(day)} ${esc(row.toLowerCase())} is open — see how it gets covered"><span class="cell-t">Open</span><span class="cell-i" aria-hidden="true">Open</span></button>`;
  };
  return `<div class="board-w" role="group" aria-label="This week’s shift board — it scrolls sideways on a phone">
    <table class="board"><caption class="sr-only">Shift coverage for the week, by house</caption>
      <thead><tr><th><span class="sr-only">Shift</span></th>${w.days.map((d) => `<th scope="col" data-day="${esc(d)}"><span class="board-d">${esc(d)}</span></th>`).join('')}</tr></thead>
      <tbody>${w.rows.map(([name, cells]) => `<tr><th scope="row">${esc(name)}</th>${cells.map((c, i) => `<td>${cellOf(c, w.days[i], name)}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>
  </div>
  <div class="board-u">
    <p class="board-c"><b>${esc(S.detail[0])}</b> · ${esc(S.detail[1])} — ${esc(S.detail[2])}</p>
    <p class="tonight" data-tonight aria-live="polite"><span class="tonight-k">${ic('clock', 16)}Who’s on tonight</span><span class="tonight-v">Pick a day on the board.</span></p>
  </div>
  ${opts.claim === false ? '' : claimSheet(opts)}`;
}

/* ── the claim sheet: how Saturday night gets covered ─────────────────── */
export function claimSheet(opts = {}) {
  const d = S.shift;
  const ELIGIBLE = [
    ['M. Okafor', 'CPR expired yesterday', 'expired'],
    ['J. Ruiz', 'already assigned that night · WH-2', 'open'],
    ['T. Nguyen', '', ''],
  ];
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
      <p class="claim-cap">${esc(d.caption)}</p>
      <ol class="claim-steps" data-step="0">
        <li class="cs" data-s="1"><span class="cs-n">1</span><div><b>${esc(d.actions[0])}</b><span class="cs-w">Everyone eligible at WH-1 is listed. Two carry markers; neither is removed, neither needs an override.</span>
          <ul class="elig">${ELIGIBLE.map(([n, m, k]) => `<li class="elig-i"><span class="elig-n">${esc(n)}</span>${m ? `<span class="elig-m" data-kind="${esc(k)}">${esc(m)}</span>` : '<span class="elig-m is-none">no marker</span>'}</li>`).join('')}</ul>
          <span class="cs-r" data-cs-r="1"></span></div></li>
        <li class="cs" data-s="2"><span class="cs-n">2</span><div><b>${esc(d.actions[1])}</b><span class="cs-w">Nobody on staff accepted by Friday evening. Relief workers whose area covers the house and whose availability includes nights see it, with distance.</span><span class="cs-r" data-cs-r="2"></span></div></li>
        <li class="cs" data-s="3"><span class="cs-n">3</span><div><b>Claimed, then confirmed</b><span class="cs-w">The first claim stands; the second is told immediately. You decide who enters your house.</span><span class="cs-r" data-cs-r="3"></span></div></li>
      </ol>
      <div class="claim-a">
        <button class="btn pri" type="button" data-claim-act="offer">${esc(d.actions[0])}</button>
        <button class="btn" type="button" data-claim-act="post" disabled>${esc(d.actions[1])}</button>
        <button class="btn pri" type="button" data-claim-act="confirm" hidden>Confirm R. Alvarez</button>
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
    <a class="door is-prov" href="#providers" data-side-set="provider"><span class="door-k">${ic('house', 22)}I run a house</span><b>Staff, credentials, the roster, hours — and the board that shows what is not covered.</b><span class="door-go">For providers ${ic('arrow', 18, { pin: false })}</span></a>
    <a class="door is-care" href="#caregivers" data-side-set="caregiver"><span class="door-k">${ic('phone', 22, { pin: 'open' })}I’m a caregiver</span><b>Open shifts near you, your own credential dates, your own hours. Free, for ever.</b><span class="door-go">For caregivers ${ic('arrow', 18, { pin: false })}</span></a>
  </div>`;
}

/* ── the roster toy: tap a cell, watch the count ──────────────────────── */
export function rosterToy() {
  const w = S.week;
  const NAMES = ['M. Okafor', 'J. Ruiz', 'T. Nguyen'];
  const covered = w.rows.reduce((n, [, cells]) => n + cells.filter(Boolean).length, 0);
  const total = w.rows.reduce((n, [, cells]) => n + cells.length, 0);
  return `<div class="ros" data-ros data-names="${esc(NAMES.join('|'))}">
    <div class="ros-h"><span class="ros-k">${ic('board', 20)}Build the week yourself</span><b class="ros-n" data-ros-n>${covered} of ${total} covered</b></div>
    <div class="ros-w" data-scrollx><div class="ros-g" role="group" aria-label="A seven-by-two roster; each cell is a button that changes who is on">
      <span class="ros-c0"></span>${w.days.map((d) => `<span class="ros-d">${esc(d)}</span>`).join('')}
      ${w.rows.map(([name, cells]) => `<span class="ros-l">${esc(name)}</span>${cells.map((c, i) => { const who = c ? NAMES.indexOf(c) : 3; return `<button class="ros-c ${c ? 'is-covered' : 'is-open'}" type="button" data-who="${who}" aria-label="${esc(w.days[i])} ${esc(name.toLowerCase())}: ${c ? esc(c) : 'open'}"><span class="ros-t">${c ? esc(c) : 'Open'}</span><span class="ros-i" aria-hidden="true">${c ? esc(initials(c)) : 'Open'}</span></button>`; }).join('')}`).join('')}
    </div></div>
    <p class="fine">Tap a cell: M. Okafor → J. Ruiz → T. Nguyen → Open. A pattern per house generates this; you only touch what changed. The roster shown is sample data.</p>
  </div>`;
}

/* ── the credential timeline: a slider through the four states ────────── */
export function credTimeline() {
  return `<div class="tl" data-tl>
    <div class="tl-card" data-tl-card data-state="current">
      <span class="tl-k">${ic('badge', 18)}<span data-tl-k>Current</span></span>
      <b class="tl-who">J. Ruiz · First Aid</b>
      <span class="tl-when" data-tl-when>Expires in 90 days</span>
      <p class="tl-n" data-tl-n>Recorded with its dates and marked self-attested, because that is what it is. Nothing to say yet.</p>
    </div>
    <div class="tl-r">
      <label class="tl-lab" for="tl-in">Move through the days: <output data-tl-out>90 days out</output></label>
      <input class="tl-in" id="tl-in" type="range" min="0" max="95" value="0" step="1" data-tl-in aria-valuetext="90 days before expiry">
      <ol class="tl-rail" aria-hidden="true"><li style="--at:0%">Recorded</li><li style="--at:63.2%">30 days</li><li style="--at:87.4%">7 days</li><li style="--at:94.7%" class="is-open">Expires</li></ol>
    </div>
    <p class="fine">Nothing is blocked at any point on this line. Expired is marked on the roster and in the eligible list, naming the credential; the assignment still proceeds on a single action. Renewed is a new row; the old one stays as history.</p>
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
    <div class="ts-a"><button class="btn sm" type="button" data-ts-export>${ic('export', 16, { pin: false })}Export CSV</button><span class="fine">Hours are exported, never calculated into pay. Exporting is recorded.</span></div>
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
      <p>Offline if she must — the event queues, marked pending, and is submitted exactly once on reconnection. A clock event is never edited or deleted; a correction is a new record beside the original.</p>
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
    <p class="fine">Soonest first, then nearest — the work, the schedule in words, the rate, the credentials asked for, the distance. Never a resident, never another caregiver, and never a house’s address before a relationship exists.</p>
  </div>`;
}

/* ── the wallet ───────────────────────────────────────────────────────── */
export const walletCards = () => `<div class="wallet" role="list" aria-label="A caregiver’s credentials, as cards">${WALLET.map(([t, when, st, label]) => `<div class="wcard is-${esc(st)}" role="listitem"><span class="wcard-k">${ic('badge', 16, { pin: st === 'open' ? 'open' : 'ink' })}${esc(label)}</span><b>${esc(t)}</b><span class="wcard-w">${esc(when)}</span></div>`).join('')}</div>`;

/* ── the refusals as a deck ───────────────────────────────────────────── */
export function deck() {
  return `<div class="deck" data-deck>
    <ol class="deck-r" data-scrollx>${REFUSED.map(([t, why], i) => `<li class="deck-c"><span class="deck-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(t)}</b><span>${esc(why)}</span></li>`).join('')}</ol>
    <div class="deck-nav"><button class="deck-b" type="button" data-deck-prev aria-label="Previous">${ic('left', 20, { pin: false })}</button><span class="deck-dots" data-deck-dots aria-hidden="true">${REFUSED.map((_, i) => `<i class="${i === 0 ? 'on' : ''}"></i>`).join('')}</span><button class="deck-b" type="button" data-deck-next aria-label="Next">${ic('right', 20, { pin: false })}</button></div>
  </div>`;
}

/* ── roles as flip cards ──────────────────────────────────────────────── */
export function flipRoles() {
  const s = find('roles');
  return `<div class="role-g">${s.rows.map(([r, who, does, dev, wash]) => `<details class="flip ${wash ? 'is-free' : ''}"><summary class="flip-f"><span class="role-n">${esc(r)}</span><span class="role-w">${esc(who)}</span><span class="flip-hint">${ic('reset', 14, { pin: false })}Turn over</span></summary><div class="flip-b"><span class="role-n">${esc(r)}</span><p class="role-d">${esc(does)}</p><span class="role-r">${ic('phone', 14, { pin: false })}${esc(dev)}</span></div></details>`).join('')}</div>`;
}

/* ── pricing: the tiers, the per-post explainer, the caregiver exception ─ */
export function tierBlock(p) {
  const rows = p.pricing.rows;
  const main = 1;
  const tier = ([name, price, d], i) => {
    const soon = /^Open/.test(price);
    const post = /^Job post/.test(name);
    const inner = `<span class="tier-n">${esc(name)}</span><span class="tier-p ${soon ? 'is-soon' : ''}">${esc(soon ? 'Early access' : price)}</span><span class="tier-d">${esc(d)}</span>`;
    if (post) {
      return `<details class="tier is-post"><summary>${inner}<span class="tier-more">${ic('down', 16, { pin: false })}What one charge buys</span></summary><div class="tier-x"><ul><li>A listing that goes live when it is paid — an unpaid post stays a draft.</li><li>Reachable without an account, at an opaque address that carries no organisation, house or sequence.</li><li>Applications arrive with her profile and her credentials as self-attested — one per person per posting, never ranked or scored.</li><li>Available on every plan, including the trial. The amount is set at launch.</li></ul></div></details>`;
    }
    return `<div class="tier ${i === main ? 'is-main' : ''}">${inner}</div>`;
  };
  return `<div class="pr">
    <div class="pr-sw" role="group" aria-label="Who pays">
      <button class="pr-b is-prov" type="button" data-side-set="provider" aria-pressed="true">Providers</button>
      <button class="pr-b is-care" type="button" data-side-set="caregiver" aria-pressed="false">Caregivers</button>
    </div>
    <div class="tiers s-prov">${rows.map(tier).join('')}</div>
    <div class="tier-care s-care"><span class="tier-n">${ic('free', 18, { pin: 'open' })}Caregiver</span><span class="tier-p">$0, for ever</span><span class="tier-d">${esc(p.pricing.note)} No organisation, no card. Your credential dates are yours and travel with you.</span></div>
  </div>`;
}

/* ── the annotated web board, with spotlights ─────────────────────────── */
export function annotatedBoard() {
  const s = find('screen');
  const on = (fn) => (typeof fn === 'function' ? fn(S) : fn);
  return `<div class="shell" tabindex="0" role="group" aria-label="The desktop board, at true size — scroll sideways for the rest" data-shell>${webShell('aidepost', { key: 'board' })}</div>
  <ol class="annot" data-annot data-scrollx>${s.callouts.map(([t, d], i) => `<li><button class="an-b" type="button" data-spot="${i + 1}" aria-pressed="false"><span class="an-n">${i + 1}</span><b>${esc(on(t))}</b></button><span class="an-d">${esc(d)}</span></li>`).join('')}</ol>`;
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
