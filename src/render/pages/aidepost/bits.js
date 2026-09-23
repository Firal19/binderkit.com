// aidepost.com — the pieces the pages are built from.
//
// Everything a visitor can tap lives here as markup that reads with JS off:
// the board is a table, the toys are buttons and range inputs with their
// resting state rendered, the deck is a list, the flip cards are <details>.
// js/pages/aidepost.js upgrades each one by class.

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
   Both are post-processed here rather than in instruments.js, because
   instruments.js is the shared renderer and three other sites draw from
   it. The pattern is screens.js's own sx(): take the instrument's bytes
   and change the one attribute this site needs changed.

   1 · THE STRIP'S OUTER ID. filmStrip puts the id it is given on the
   .fstrip wrapper AND derives every child id from it — the rail, the hint
   and one per card. On /screens the strip sits inside sec('strip', …),
   which already owns #strip, so the built page carried the id twice:
   getElementById('strip') and the #strip fragment both resolved to the
   section, and the Link button beside the heading copied an address that
   was ambiguous in the bytes. The section keeps the name — it is what the
   index links to and what the button copies — and the wrapper gives it up.
   Nothing reads the wrapper's own id: site.js reaches the strip through
   [data-rail] and .closest('.fstrip'), the cards keep #strip-caregiver and
   the rest, and box.id is consulted only to find a [data-sw-rail] switcher,
   which this site does not render. */
export function filmStrip(productId, opts = {}) {
  const html = rawFilmStrip(productId, opts);
  return html.replace(/^(\s*<div class="fstrip[^"]*") id="[^"]*"/, '$1');
}

/* 2 · THE CALLOUT LIST TAKES A KEYBOARD. site.js lights a callout on
   pointerover and on focusin, and the sentence on /screens tells a reader
   to move through the list with a keyboard — but callouts() renders each
   sentence as a plain <li>, so nothing in the list could take focus and
   the focusin half of the handler could never fire. Each row becomes a
   focusable region: it is not a button, because activating it does
   nothing — reaching it is the whole interaction, exactly as hovering it
   is. aria-describedby is not needed; the row IS the description. */
export function callouts(inner, list = [], opts = {}) {
  return rawCallouts(inner, list, opts).replace(/<li class="cal-i"/g, '<li class="cal-i" tabindex="0"');
}

/* A section that folds on a phone. Two attributes, and site.js folds() does
   the rest: below 640 the section collapses to a 64px summary carrying its
   own heading and this gist, the same gist fills the sheet's page index, a
   hash link opens the target before scrolling, print opens everything, and
   with scripting off nothing folds at all.

   Only sections that are CLOSED on arrival are marked. A section that is
   open on arrival would carry its own heading twice — once in the summary
   row, once at display size two lines below — so the three that stay open
   (the hero, the section carrying the claim, the closing call) are simply
   not folds, and the sheet's split menu carries their destinations. */
export const fold = (gist, html) =>
  html.replace('<section ', `<section data-phone="fold" data-gist="${esc(gist)}" `);

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
    const inner = `<span class="tier-n">${esc(name)}</span><span class="tier-p ${soon ? 'is-soon' : ''}">${esc(soon ? 'Not priced yet' : price)}</span><span class="tier-d">${esc(d)}</span>`;
    if (post) {
      return `<details class="tier is-post"><summary>${inner}<span class="tier-more">${ic('down', 16, { pin: false })}What one charge buys</span></summary><div class="tier-x"><ul><li>A listing that goes live when it is paid — an unpaid post stays a draft.</li><li>Reachable without an account, at an opaque address that carries no organisation, house or sequence.</li><li>Applications arrive with her profile and her credentials as self-attested — one per person per posting, never ranked or scored.</li><li>Available on every plan, including the trial.</li></ul></div></details>`;
    }
    return `<div class="tier ${i === main ? 'is-main' : ''}">${inner}</div>`;
  };
  return `<div class="pr">
    <div class="pr-sw" role="group" aria-label="Who pays">
      <button class="pr-b is-prov" type="button" data-side-set="provider" aria-pressed="true">Providers</button>
      <button class="pr-b is-care" type="button" data-side-set="caregiver" aria-pressed="false">Caregivers</button>
    </div>
    <div class="tiers s-prov">${rows.map(tier).join('')}</div>
    <div class="s-prov">${openNote(p)}</div>
    <div class="tier-care s-care"><span class="tier-n">${ic('free', 18, { pin: 'open' })}Caregiver</span><span class="tier-p">$0, for ever</span><span class="tier-d">No organisation, no card. Your credential dates are yours and travel with you.</span></div>
  </div>`;
}

/* ── the annotated web board, with spotlights ─────────────────────────── */
export function annotatedBoard() {
  const s = find('screen');
  const on = (fn) => (typeof fn === 'function' ? fn(S) : fn);
  return `<div class="shell" tabindex="0" role="group" aria-label="The desktop board, at true size — scroll sideways for the rest" data-shell>${webShell('aidepost', { key: 'board' })}</div>
  <span class="shell-cap">Drag sideways — the board goes on past the edge.</span>
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

/* ══ THE SECOND TWENTY-FIVE ═══════════════════════════════════════════════
   Everything below is the working demo: the routes as a ring you can walk,
   the page as an index you can see, the product's own screens as a strip you
   can operate, and the four things a partner asks that this product can
   answer from the vault rather than from a deck. Nothing here invents a
   number, a customer or a date. Where a fact is not decided, it says so. */

/* ── the ring of routes ───────────────────────────────────────────────
   ROUTES and pager() live in chrome.js and are re-exported here so every
   page module keeps importing them from the same place. They had to move:
   /privacy is rendered by the kit's shared render/privacy.js, which this
   site cannot add a section to — but it does call this product's own
   footer(), and that is in chrome.js. bits.js already imports chrome.js,
   so the ring has to sit on the chrome side of that edge or the import
   graph closes on itself. */
export { ROUTES, routeIx, pager } from './chrome.js';

/* ── "what is on this page", and which side each part belongs to ───────
   data-spy is site.js's own scroll spy: it puts aria-current on the link
   whose section is in view. Two tones, because on this site every part of
   every page belongs to one of exactly two people. */
export function ixNav(rows, opts = {}) {
  if (!rows || !rows.length) return '';
  return `<nav class="ix" aria-label="${esc(opts.label || 'What is on this page')}" data-spy data-ix>
    <span class="ix-k">${ic('board', 16)}On this page</span>
    <ol class="ix-l" data-scrollx>${rows.map(([id, label, side]) => `<li><a href="#${esc(id)}" data-side-hint="${esc(side || 'both')}">${esc(label)}</a></li>`).join('')}</ol>
  </nav>`;
}

/* ── a section heading you can copy the address of ────────────────────
   site.js delegates [data-copy] globally, so this costs no script at all.
   The address is absolute on purpose: the reason to copy it is to paste it
   somewhere that is not this page.

   The address must carry its own route. The first version of this took a
   bare id and assumed the home page, which is where #ledger does live —
   but #ladder lives only on /about and #board only on /providers, so two
   of the five buttons copied an address for a section that was not on the
   page named, and one of the two was a fragment that exists nowhere. A
   bare id now throws at build time rather than shipping a dead link: the
   button's whole job is that the address it hands over works. */
export const deepLink = (addr, what) => {
  const s = String(addr);
  if (!s.startsWith('/')) throw new Error(`deepLink("${s}"): an address must start with the route it lives on — "/${s}" or "/about#${s}", not a bare id`);
  const [route, frag] = s.split('#');
  const href = `https://aidepost.com/${route.replace(/^\//, '')}${frag ? `#${frag}` : ''}`;
  return `<button class="dl" type="button" data-copy="${esc(href)}" data-copied="Link copied" aria-label="Copy a link to ${esc(what)}">${ic('copy', 14, { pin: false })}<span>Link</span></button>`;
};

/* ── the four words this product owns ─────────────────────────────────
   Lifted from data/states.js, which is lifted from the system board. The
   fourth one is a borrow and says so: Aidepost takes Cohort's coral for an
   expired credential rather than inventing a fifth colour. */
export const stateLegend = () => `<dl class="stl" aria-label="The four words Aidepost uses">${STATE_SETS.aidepost.map(([k, label, tone, why]) => `<div class="stl-i is-${esc(k)}"><dt><span class="stl-d" aria-hidden="true"></span>${esc(label)}</dt><dd>${esc(why)}${tone === 'borrowed' ? '' : ''}</dd></div>`).join('')}</dl>`;

/* ── the family band ──────────────────────────────────────────────────
   The other three rooms and the house above them, each with its own mark,
   its own live address and its own honest state. The line under each one
   is what it takes off Aidepost's plate, read from Aidepost's own doesNot
   list — so the band is a boundary statement, not a logo wall. */
const TAKES = {
  pho: 'The enterprise layer Aidepost graduates into, by export → import.',
};
/* A progress percentage with no definition behind it is a metric, and an
   undefined one. brand.js carries “Spec-first · ~3% built” for the
   umbrella; nothing on this site or in the vault says what the denominator
   is, so the figure is dropped and the sourced half of the state is kept.
   Every other state string — Live, Draft v2.1 · not built · pilot named —
   is the vault's own wording for that product and is printed verbatim. */
const sourced = (state) => String(state).replace(/\s*·\s*~?\d+(\.\d+)?%\s*built/i, '');
export function familyBand() {
  const order = ['pho'];
  return `<div class="fam-g">${order.map((id) => {
    const q = byId[id];
    return `<a class="fam" href="https://${esc(q.domain)}" rel="noopener"><span class="fam-mk">${mark(id, 34, { label: false })}</span><b>${esc(q.name)}</b><span class="fam-d">${esc(q.descriptor)}</span><span class="fam-t">${esc(TAKES[id])}</span></a>`;
  }).join('')}</div>`;
}

/* ── the graduation path ──────────────────────────────────────────────
   data/page.js carries the rows; the claim is only that the shapes match,
   which is the claim the vault makes. */
export function gradLadder() {
  const s = find('ladder');
  return `<div class="grd">
    <ol class="grd-l">${s.rows.map(([what, where]) => `<li><b>${esc(what)}</b><span>${ic('arrow', 15, { pin: false })}${esc(where)}</span></li>`).join('')}</ol>
    <p class="fine">${esc(s.footer)}</p>
  </div>`;
}

/* ── the shift record, field by field ─────────────────────────────────
   The point of this block is an absence, and an absence cannot be drawn by
   drawing something. So the fields are listed, and then the field that is
   not there is named — and the schema check that asserts it is named too. */
export const SHIFT_FIELDS = ['house', 'date', 'start', 'end', 'role', 'credentials required', 'awake overnight', 'ratio', 'rate'];
export const schemaBlock = () => `<div class="schm">
  <span class="strip-l">${ic('shift', 16)}Every field on a shift</span>
  <ul class="schm-f" aria-label="The fields a shift record carries">${SHIFT_FIELDS.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
  <p class="schm-n"><b>And nothing that can describe a person receiving care.</b> The schema check asserts that no such field exists, and a code review that finds one is a blocker, not a finding. Shifts are never public; a job posting is, and only once you have published it.</p>
</div>`;

/* ── everything Aidepost is able to say ───────────────────────────────
   Sixteen messages, and the send function has no body parameter — so the
   set of sentences this product can emit is finite and printable. Both
   renderings below are the vault's own strings. */
export function messages() {
  const ev = find('evidence');
  const q = (label) => ev.blocks.find((b) => b.label === label) || {};
  const rows = [q('What an email says'), q('What a push says')];
  return `<div class="msg">
    <span class="strip-l">${ic('mail', 16)}Every sentence it can send</span>
    <ol class="msg-l">${rows.map((b) => `<li><q class="msg-q">${esc(b.quote || '')}</q><span class="msg-w">${esc(b.text || '')}</span></li>`).join('')}</ol>
    <p class="fine">Sixteen messages may be sent at all. The send function takes an event key and references, so there is no body parameter and nothing to write free text into. Where a message names a time it renders as a day and a shift name — “Sat night” — never a date and time, because a precise time identifies a person’s routine to anyone holding the phone.</p>
  </div>`;
}

/* ── the first ten minutes, ticked off against the demo above ─────────
   Four checkboxes and no script: :checked does the whole thing. The steps
   are brand.js's own firstTen for this product, unedited. */
export function firstTen(p) {
  const steps = p.firstTen || [];
  return `<div class="ft10">
    <span class="strip-l">${ic('clock', 16)}The first ten minutes</span>
    <ul class="ft10-l">${steps.map((t, i) => `<li><input class="ft10-x" type="checkbox" id="ft10-${i}"><label for="ft10-${i}">${esc(t)}</label></li>`).join('')}</ul>
    <p class="fine">Four things, in this order, on the day you sign up. The screens they happen on are all in the rail above — tick them off as you find them.</p>
  </div>`;
}

/* ── the boundary, read straight off brand.js ─────────────────────────
   "run payroll or background checks (the provider does; …)" splits at the
   bracket into the refusal and who holds it instead, and where the second
   half names another room the card links to it. Nothing is rewritten. */
const ROOM = [['Cohort', 'cohort'], ['CareShop', 'careshop'], ['Binderkit', 'binderkit'], ['PHO', 'pho']];
export function doesNotList(p) {
  const items = p.doesNot || [];
  return `<ul class="dn" aria-label="What Aidepost does not do, and who does it instead">${items.map((raw) => {
    const m = String(raw).match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    const what = m ? m[1] : raw;
    const who = m ? m[2] : '';
    const hit = ROOM.find(([name]) => who.includes(name));
    const q = hit ? byId[hit[1]] : null;
    return `<li><b>${esc(what.charAt(0).toUpperCase() + what.slice(1))}</b>${who ? `<span>${q ? `<a href="https://${esc(q.domain)}" rel="noopener">${esc(who)}</a>` : esc(who)}</span>` : ''}</li>`;
  }).join('')}</ul>`;
}

/* ── the product's own map, from its own navigation ───────────────────── */
export function productMap(p) {
  return `<div class="pmap">
    <div class="pmap-g">${(p.nav || []).map((g) => `<div class="pmap-c"><span class="strip-l">${ic(g.group === 'Organisation' ? 'house' : 'board', 16)}${esc(g.group)}</span><ul>${g.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`).join('')}</div>
    <p class="fine">Five tabs on a phone — ${(p.tabs || []).map((t) => esc(t)).join(', ')} — and the same eight destinations on a desktop. That is the whole product; there is no second one behind a sales call.</p>
  </div>`;
}

/* ── what is invented here, named ─────────────────────────────────────
   The disclaimer in the footer says the screens use sample data. This says
   which data, because a reader who has just operated five screens deserves
   to know exactly where the fiction starts and stops. */
export const sampleNote = () => `<details class="smp">
  <summary><b>${ic('question', 18)}What on these screens is invented, exactly</b><span class="faq-x" aria-hidden="true"></span></summary>
  <div class="smp-b">
    <ul>
      <li><b>Invented:</b> the house identifiers (WH-1 and WH-2), the staff names (M. Okafor, J. Ruiz, T. Nguyen, K. Silva, R. Alvarez, D. Park, S. Lee), the dates, the hours, the rate, and the distances.</li>
      <li><b>Not invented:</b> the field names, the state words, the notice intervals, the wording of every message, the order of every flow, and every refusal. Those are the specification.</li>
      
    </ul>
    <p class="fine">No resident appears on any screen, in sample form or otherwise: a shift record has no field that could hold one, and neither has a posting.</p>
  </div>
</details>`;
