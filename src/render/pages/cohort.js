// cohorthome.app — the shift, hour by hour.
//
// The whole site is laid out on a clock. The header is a time rail with a
// now-dot that travels the shift; the front page is one caregiver's day on
// the house phone, with the phone following the hours; the footer is the
// end-of-shift sheet the product composes at 18:45. Every icon carries a
// stamp's ink dot, every entry is “Logged by · at”, and nothing is red.

import { esc, skip, waitlist, faq, tiers, sec, h2, eyebrow } from '../shared.js';
import { iosShell, SURFACES } from '../instruments.js';
import { SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, JOIN } from '../../data/page.js';
import { ic } from '../icons/cohort.js';
import { header, footer } from './cohort/chrome.js';
import { DAY, hid, tourKey, REFUSALS, NOT_STORED, HOUSE_KEYS, APP, find } from './cohort/data.js';
import { pages } from './cohort/pages.js';

export { header, footer, pages };

const S = SURFACES.cohort;
const screen = (key) => S.screens.find((s) => s.key === key);

/* ── the phone fold ─────────────────────────────────────────────────────
   Below 640px a long page opens as an index rather than a scroll: three
   sections stay open — the hero, the one that carries the claim, and the
   closing call — and every other section becomes a tappable row carrying
   its own heading and the one-line gist below. js/site.js folds() builds
   the row; responsive.css shows it; above 640 none of it exists.

   Nothing is deleted: the HTML still ships every word, so find-in-page
   after opening, search engines and the printer all see the whole page.

   shared.js's sec() takes no extra attributes and is not ours to edit, so
   the two the fold needs are spliced onto the tag it returns — sec() always
   opens with exactly this string. The same data-gist feeds the "In this
   page" index inside the shift sheet. */
const fold = (gist, html) => html.replace(
  '<section class="sec',
  `<section data-phone="fold" data-gist="${esc(gist)}" class="sec`,
);

/* ── 06:55 · the hero ──────────────────────────────────────────────────── */
function hero(cfg, p) {
  const strip = find('hero').strip;
  const today = screen('today');
  const headline = esc(p.headline.text).replace('every shift', '<em>every shift</em>');
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap hero-in">
      <div class="hero-t">
        ${eyebrow('For Oregon adult foster homes · runs on the house phone')}
        <h1 id="h1">${headline}</h1>
        <p class="lede"><b>${esc(p.descriptor)}.</b> ${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg" href="#join" data-cta="hero">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a>
          <a class="btn lg" href="#shift">${ic('clock', 18)}${esc(cfg.cta.secondary)}</a>
        </div>
        <p class="now" data-now><span class="now-dot" aria-hidden="true"></span><span class="now-t">It is <b data-oregon>06:55</b> in Oregon.</span> <span class="now-d" data-due>The demo shift signs in at 06:55.</span></p>
        <p class="fine">Offline-safe. Two safety gates and nothing else that blocks. Every entry stamped “Logged by · at”.</p>
      </div>
      <div class="hero-v">
        <div class="dev hero-dev">
          ${iosShell('cohort', { key: 'today' })}
          <span class="float f1" aria-hidden="true"><span class="stamp-a">${esc(today.rows[0].stamp)}</span><span class="float-l">every entry, stamped</span></span>
          <span class="float f2" aria-hidden="true"><span class="st-a" data-state="due"><i></i>${esc(today.tabBadge.text)}</span><span class="float-l">a count, never a score</span></span>
          <span class="float f3" aria-hidden="true"><span class="float-l">the night handoff</span><b>${esc(today.handoff.receipt)}</b></span>
        </div>
      </div>
      <div class="strip"><span class="strip-l">${esc(strip.label)}</span><div class="strip-c">${strip.cells.map((c) => `<s>${esc(c)}</s>`).join('')}</div></div>
    </div>
  </section>`;
}

/* ── the shift: a timeline and a phone that follows it ─────────────────── */
const WIDGET = {
  sim: `<div class="sim" data-sim>
      <p class="sim-hint">${ic('pill', 16)}<span>Tap a due row on the phone. Loratadine raises the allergy gate and asks for a reason before it signs.</span></p>
      <div class="sim-bar"><span class="sim-n" role="status" aria-live="polite">Signed 0 of 3</span><button type="button" class="sim-reset">${ic('handoff', 15)}<span>Start over</span></button></div>
    </div>`,
  air: `<div class="air" data-air>
      <div class="air-row">
        <button type="button" class="air-sw" role="switch" aria-checked="false"><span class="air-k" aria-hidden="true"></span>${ic('plane', 16)}<span>Airplane mode</span></button>
        <button type="button" class="air-add">${ic('pen', 16)}<span>Log a care note</span></button>
        <span class="air-out" role="status" aria-live="polite"><b>0</b> in the outbox</span>
      </div>
      <ol class="air-l" aria-label="Entries made in this demo"></ol>
    </div>`,
  compose: `<p class="tl-note" data-compose-note>${ic('count', 16)}<span>Watch the phone: the sheet composes itself line by line as this step comes into view.</span></p>`,
};

function keysDialog() {
  const rows = [
    ['<kbd>J</kbd><kbd>K</kbd>', 'Next and previous hour on the shift'],
    ['<kbd>↓</kbd><kbd>↑</kbd>', 'The same, while an hour is focused'],
    ['<kbd>⌘</kbd><kbd>K</kbd>', 'Jump to a verb, a stop or a page'],
    ['<kbd>T</kbd>', 'Back to 06:55'],
    ['<kbd>?</kbd>', 'This sheet'],
    ['<kbd>Esc</kbd>', 'Close whatever is open'],
  ];
  return `<div class="keys" id="keys" hidden>
    <div class="keys-in" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
      <div class="keys-h"><span class="eyebrow">Keys</span><button class="keys-x" type="button" data-close aria-label="Close the shortcuts">${ic('close', 20)}</button></div>
      <dl class="keys-l">${rows.map(([k, d]) => `<dt>${k}</dt><dd>${esc(d)}</dd>`).join('')}</dl>
    </div>
    <button class="keys-scrim" type="button" data-close aria-label="Close"></button>
  </div>`;
}

function shift() {
  const keys = [...new Set(DAY.map(tourKey))];
  const phones = keys.map((k, i) => {
    const [key, present] = k.split('+');
    return `<div class="tour-p ${present === 'compose' ? 'is-compose' : ''}" data-tour="${esc(k)}" ${i ? 'hidden' : ''}>${iosShell('cohort', { key, present: present === 'sheet' ? 'sheet' : 'none' })}</div>`;
  }).join('');
  const steps = DAY.map((d, i) => `<li class="tl-i" id="${hid(d.at)}" data-tour="${esc(tourKey(d))}" data-at="${esc(d.at)}" ${i === 0 ? 'data-on' : ''}>
        <a class="tl-at" href="#${hid(d.at)}" aria-label="${esc(d.at)} — ${esc(d.t)}, link to this hour"><span class="tl-ic">${ic(d.icon, 15)}</span><time>${esc(d.at)}</time></a>
        <span class="tl-dot" aria-hidden="true"></span>
        <div class="tl-b"><h3>${esc(d.t)}</h3><p>${esc(d.d)}</p>${d.widget ? WIDGET[d.widget] : ''}</div>
      </li>`).join('');
  return sec('shift', 'shift', `<div class="wrap">
    <div class="head shift-head">
      <div>${h2('shift', 'The shift, hour by hour.', 'This is what a caregiver does with Cohort between signing in and signing out. Nothing on it is a score.')}</div>
      <button class="keysb" type="button" aria-controls="keys" aria-expanded="false" data-focus=".keys-x">${ic('keyboard', 18)}<span>Keys</span><kbd>?</kbd></button>
    </div>
    <div class="tl-g">
      <div class="tour"><div class="tour-stick"><div class="crop"><div class="dev">${phones}</div></div><span class="tour-cap" aria-hidden="true"><i></i><span data-tour-cap>06:55</span></span></div></div>
      <ol class="tl">${steps}</ol>
    </div>
    ${keysDialog()}
  </div>`);
}

/* ── 08:00 · the two stops, as cards that turn ─────────────────────────── */
function stops() {
  const loop = find('loop');
  const gate = (n, title, front, back) => `<div class="gate-w"><button type="button" class="gate" aria-pressed="false" data-flip aria-label="${esc(title)} — turn the card over">
      <span class="gate-f"><span class="gate-n">${n}</span><span class="gate-t">${esc(title)}</span><span class="gate-p">${esc(front)}</span><span class="gate-cta">${ic('handoff', 15)}What the override records</span></span>
      <span class="gate-b"><span class="strip-l">What the override records · stop ${n}</span><span class="gate-p is-strong">Choosing Override means typing a reason of at least ten characters. The reason is recorded on the dose, written to the audit log, and the manager is told.</span><span class="gate-p">${esc(back)}</span><span class="gate-cta">${ic('handoff', 15)}Turn back</span></span>
    </button></div>`;
  return sec('stops', 'stops', `<div class="wrap">
    <div class="head">${eyebrow('Inform, don’t police')}${h2('stops', 'Two stops. Nothing else.', 'Both were chosen because the harm of not stopping is physical. An override is recorded with a reason; then the pass proceeds. There is no third gate, and there are no countdown timers.')}</div>
    <div class="gates">
      ${gate(1, 'The allergy gate', 'A medication that matches a recorded allergy. The Six Rights dialog asks for a reason before it will sign, and a manager is told.', 'The stop names the allergen, its severity, its reaction and where the information came from. The limitation is stated rather than hidden: the match is by name and ingredient plus a manual flag, and it misses drug-class conflicts.')}
      ${gate(2, 'The PRN interval gate', 'An as-needed dose given too soon after the last one. The minimum interval is on the order; the clock is the record’s, not a countdown.', 'Two conditions, not one — before the order’s minimum interval, or beyond its maximum in twenty-four hours. The stop shows when the last dose was given and when the next one is permitted.')}
    </div>
    <p class="pull">${esc(loop.pull)}</p>
    <div class="machines"><span class="strip-l">Four records, and what each one will not do</span>
      ${loop.machines.map(([n, seq]) => `<div class="machine"><b>${esc(n)}</b><span>${esc(seq)}</span></div>`).join('')}
    </div>
  </div>`);
}

/* ── the manifesto, printable on its own ───────────────────────────────── */
function refuses() {
  return sec('refuses', 'refuse', `<div class="wrap">
    <div class="head ref-head">
      <div>${h2('refuses', 'What Cohort will not do, and why.', 'Eleven refusals. Each one is a position, not a missing feature, and each carries its reason.')}</div>
      <button class="printb" type="button" data-print data-print-only="refuses">${ic('print', 18)}<span>Print this list</span></button>
    </div>
    <ol class="ref-l">${REFUSALS.map(([t, why], i) => `<li><span class="ref-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(t)}</b><span>${esc(why)}</span></div></li>`).join('')}</ol>
    <div class="notstored"><span class="strip-l">Not stored, by design</span><p>${NOT_STORED.map(esc).join(' · ')}.</p></div>
    <p class="boundary">Cohort keeps the residents’ record. It does not schedule staff, run the kitchen, or build binders.</p>
    <p class="ref-print" aria-hidden="true">Cohort · What it will not do · cohorthome.app · by Providerhub Oregon</p>
  </div>`);
}

/* ── 13:40 · the record, with paper beside it ──────────────────────────── */
function record() {
  const s = find('evidence');
  const row = screen('marpass').rows.find((r) => r.state === 'given');
  const ink = `<svg class="paper-ink" viewBox="0 0 340 72" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><path d="M12 44c4-15 8-17 11-4s5 9 9-2 7-13 11-1 6 9 10-1 6-13 10-2 4 8 8 0" /><path d="M96 43c3-12 6-14 8-3s4 8 8-2 5-12 8-1 4 9 8-1 5-12 8-2" /><path d="M156 46c2-6 4-10 7-9s5 7 6 12M172 34c3 2 5 7 5 12M186 37l6 10 7-16" /><path d="M222 45c3-10 6-14 9-3s5 8 9-2 6-11 10 0" /><path d="M268 30l7 11c-1 4-3 6-6 7M283 33c3 9 8 12 12 6" /><path d="M300 42l5 6 10-14" stroke-width="2.4" /></svg>`;
  return sec('record', 'record', `<div class="wrap">
    <div class="head">${eyebrow('The record')}${h2('record', s.heading, s.sub)}</div>
    <div class="cmp-w">
      <span class="strip-l">Paper, then the record — slide the handle</span>
      <div class="cmp" style="--x:50%">
        <div class="cmp-a" aria-hidden="true"><span class="paper"><span class="paper-l">MAR · Sept</span>${ink}</span></div>
        <div class="cmp-b"><span class="rec"><span class="rec-main"><span class="rec-t">${esc(row.t)}</span><span class="rec-s">${esc(row.s)}</span><span class="stamp-a">${esc(row.stamp)}</span></span><span class="st-a" data-state="given"><i></i>Given</span></span></div>
        <input class="cmp-r" type="range" min="0" max="100" value="50" aria-label="Compare the paper MAR line with the stamped entry" aria-valuetext="Half paper, half record">
        <span class="cmp-h" aria-hidden="true">${ic('handoff', 16)}</span>
        <span class="cmp-l cmp-la" aria-hidden="true">Paper</span><span class="cmp-l cmp-lb" aria-hidden="true">Cohort</span>
      </div>
      <p class="cmp-cap">Left, a hand-written MAR line: who, when and whether, if you can read it. Right, the same dose in Cohort: a state word and a stamp.</p>
    </div>
    <div class="ev">${s.blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
    <div class="ev-cl">${s.closingBlocks.map((b) => `<div class="note">${b.heading ? `<h3>${esc(b.heading)}</h3>` : ''}<p>${esc(b.text)}</p></div>`).join('')}</div>
  </div>`);
}

/* ── three people, and who is holding the phone now ───────────────────── */
function roles() {
  const s = find('roles');
  const on = { provider: ['', ''], manager: ['1', ''], caregiver: ['1', '1'] };
  return sec('roles', 'roles', `<div class="wrap">
    <div class="head roles-head">
      <div>${h2('roles', s.heading, s.sub)}</div>
      <div class="seg" role="group" aria-label="Who is holding the phone"><button type="button" data-shift="now" aria-pressed="true">Now</button><button type="button" data-shift="day" aria-pressed="false">Day <span>06:55–19:00</span></button><button type="button" data-shift="night" aria-pressed="false">Night</button></div>
    </div>
    <div class="role-g" data-roles>${s.rows.map(([r, who, does, dev]) => `<div class="role" data-day="${on[r][0]}" data-night="${on[r][1]}"><span class="role-n">${ic(r === 'caregiver' ? 'pill' : r === 'manager' ? 'pen' : 'house', 16)}${esc(r)}</span><span class="role-on" data-role-on></span><p class="role-w">${esc(who)}</p><p class="role-d">${esc(does)}</p><span class="role-r">${ic('clock', 14)}${esc(dev)}</span></div>`).join('')}</div>
    <p class="closing">${esc(s.closing)}</p>
  </div>`);
}

/* ── your house: the door to app.cohorthome.app ────────────────────────── */
function house() {
  return sec('house', 'house', `<div class="wrap house-g">
    <div class="house-t">
      ${eyebrow('Already on Cohort')}
      ${h2('house', 'Your house is open at app.cohorthome.app.', 'The same record, on the web: set up houses and residents, invite staff, review the roll-ups, print for the licensing file. Sign in with the address your administrator invited.')}
      <div class="ctas">
        <a class="btn pri lg" href="${APP}" data-cta="house">${ic('house', 18)}Sign in to your house</a>
        <a class="btn lg" href="#join">I don’t have one yet</a>
      </div>
      <ul class="house-k">${HOUSE_KEYS.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>
    </div>
    <div class="house-v">
      <a class="door" href="${APP}" aria-label="Open app.cohorthome.app">
        <span class="door-bar" aria-hidden="true"><i></i><i></i><i></i><span class="door-url">app.cohorthome.app</span></span>
        <span class="door-body" aria-hidden="true">
          <span class="door-card">
            <span class="door-tile">CO</span>
            <span class="door-name">Cohort</span>
            <b>Sign in to continue</b>
            <span class="door-p">Care entries are stamped with your identity per record.</span>
            <span class="door-f">Email<span class="door-in">you@example.org</span></span>
            <span class="door-f">Password<span class="door-in">••••••••••</span></span>
            <span class="door-btn">Sign in</span>
            <small>Identity is recorded with every entry. New staff are added by invite — ask an administrator to send you one.</small>
          </span>
          <span class="door-toast">Ready to work offline — your entries will queue.</span>
        </span>
      </a>
    </div>
  </div>`);
}

/* ── the questions, with a filter that counts ──────────────────────────── */
function questions() {
  const rows = find('objections').rows;
  return sec('questions', 'questions', `<div class="wrap q-g">
    <div class="head">
      ${h2('questions', 'The questions we get.')}
      <label class="faq-f"><span class="sr-only">Filter the questions</span>${ic('search', 18)}<input class="faq-q" type="search" placeholder="Filter — wifi, export, stop…" autocomplete="off"><span class="faq-n" role="status" aria-live="polite">${rows.length} of ${rows.length}</span></label>
    </div>
    <div class="faq-w">${faq(rows)}<p class="faq-none" hidden>No question matches that. <a href="/contact">Ask it on the contact page.</a></p></div>
  </div>`);
}

/* ── pricing, by houses ────────────────────────────────────────────────── */
export function houseStepper() {
  return `<div class="hs-w"><span class="strip-l">How many houses?</span>
    <div class="hs" role="group" aria-label="How many houses?">${['1', '2–3', '4–9', '10+'].map((h, i) => `<button type="button" data-h="${esc(h)}" aria-pressed="${i === 0}">${esc(h)}</button>`).join('')}</div>
    <p class="hs-line" role="status" aria-live="polite">One house — Pro covers it, and every plan sees every screen.</p>
  </div>`;
}

function pricing(cfg, p) {
  const s = find('pricing');
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${eyebrow('One price per house')}${h2('pricing', s.heading, EVERY_PLAN)}</div>
    ${houseStepper()}
    ${tiers(p, 1)}
    <p class="fine">${esc(s.note)}</p>
    <div class="subs">
      <div class="note"><h3>${esc(SIGNUP_SIX.heading)}</h3><ol class="arrow">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(SIGNUP_SIX.tail)}</p></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>
      <p class="more"><a href="/pricing">${ic('tag', 16)}<span>Pricing in full — the trial and how signup works</span>${ic('right', 16)}</a></p>
  </div>`);
}

/* ── 19:00 · join ──────────────────────────────────────────────────────── */
function join(cfg, p) {
  const s = find('start');
  return sec('join', 'join', `<div class="wrap join-g">
    <div class="join-t">
      ${eyebrow(JOIN.eyebrow)}
      <h2 id="h-join">${esc(JOIN.heading)}</h2>
      <p class="sub">${esc(JOIN.sub)}</p>
      <div class="ten"><span class="strip-l">${esc(s.heading)}</span><ol>${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
    </div>
    <div class="join-f">${waitlist(cfg, p)}<p class="fine">${esc(JOIN.fine)}</p></div>
  </div>`);
}

export function render(cfg, p) {
  return `${skip()}
${header(cfg, p, { page: 'home' })}
<main id="main" class="page face canvas" data-product="cohort" data-mode="light">
${hero(cfg, p)}
${fold('Seven hours on the house phone', shift())}
${fold('Allergy, and the PRN interval', stops())}
${fold('Eleven refusals, with reasons', refuses())}
${record()}
${fold('Who is holding the phone', roles())}
${fold('The same record, on the web', house())}
${fold('Wi-fi, exports, the stops', questions())}
${pricing(cfg, p)}
${join(cfg, p)}
</main>
${footer(cfg, p, { page: 'home', fine: find('foot').disclaimer })}`;
}
