// cohorthome.app — the shift, hour by hour.
//
// The whole site is laid out on a clock. The header is a rail with a now-dot
// that travels the shift; the front page is one caregiver's day on the house
// phone, with the phone following the hours; the footer is the end-of-shift
// sheet. Every icon carries a stamp's ink dot, every entry is “Logged by ·
// at”, and nothing is red. Rewritten 2026-09-23 to Firaol's review: shorter,
// plainer, no build status, no sample-data confession, no sibling product.

import { esc, skip, waitlist, faq, tiers, sec, h2, eyebrow, reach , chapterRail, priceCalc } from '../shared.js';
import { iosShell, SURFACES, screenSwitch } from '../instruments.js';
import { EVERY_PLAN, JOIN } from '../../data/page.js';
import { STATE_SETS } from '../../data/states.js';
import { ic } from '../icons/cohort.js';
import { header, footer, SCREENS } from './cohort/chrome.js';
import { DAY, hid, tourKey, HOUSE_KEYS, APP, find, screenHref, neutral } from './cohort/data.js';
import { pages } from './cohort/pages.js';

export { header, footer, pages };

const S = SURFACES.cohort;
const screen = (key) => S.screens.find((s) => s.key === key);

/* ── the phone fold ─────────────────────────────────────────────────────
   Below 640px a long page opens as an index rather than a scroll. Each
   folded section becomes a tappable row carrying its own heading and the
   one-line gist below; js/site.js folds() builds the row. Nothing is
   deleted: the HTML still ships every word. `open` marks a section that
   starts open on a phone — the shift, because it is the page. */
const fold = (gist, html, open = false) => html.replace(
  '<section class="sec',
  `<section data-phone="fold" data-gist="${esc(gist)}"${open ? ' data-phone-open' : ''} class="sec`,
);

/* ── the hero device: a real tablist over the product's own screens ─────
   neutral() swaps the shared Today foot for this site's own line; see
   cohort/data.js. */
const HERO_SCREENS = ['today', 'handoff'];
const heroSwitch = () => neutral(screenSwitch('cohort', {
  id: 'sw-hero',
  on: 0,
  only: HERO_SCREENS,
  label: 'Cohort, on the house phone — pick a screen',
  notes: {
    today: { tab: 'Today', cap: 'The first screen after sign-in: what is due, what is documented, what is waiting on a decision.' },
    handoff: { tab: 'Handoff', cap: 'The other end of the shift, composed from the day rather than typed from memory.' },
  },
}));

/* ── “on this page”, and where you are in it ────────────────────────────
   One chip per stop. `data-spy` is js/site.js's own contract: it marks the
   chip whose section is in view. With scripting off it is still an index. */
const INDEX = [
  ['shift', 'The shift'],
  ['stops', 'Two stops'],
  ['record', 'The record'],
  ['roles', 'Who holds it'],
  ['questions', 'Questions'],
  ['pricing', 'Pricing'],
  ['join', 'Join'],
];
/* Round 4: one rail, following the reader, each stop with its stamp glyph
   (Firaol, family-wide: "make one of those list horizontal and interactive
   on scroll and connected to the interactive"). */
const IDX_ICON = { shift: 'clock', stops: 'gate', record: 'record', grammar: 'addendum', roles: 'people', house: 'house', questions: 'info', pricing: 'tag', join: 'pen' };
const IDX_LIVE = new Set(['shift', 'stops', 'grammar', 'pricing']);
const pageIndex = () => chapterRail(INDEX.map(([id, label]) => ({ id, label, live: IDX_LIVE.has(id), icon: ic(IDX_ICON[id] || 'stamp', 16) })), { tail: { href: '/screens', label: 'All five screens' } });

/* ── the hero ──────────────────────────────────────────────────────────── */
function hero(cfg, p) {
  const strip = find('hero').strip;
  const today = screen('today');
  const headline = esc(p.headline.text).replace('every shift', '<em>every shift</em>');
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap hero-in">
      <div class="hero-t">
        ${eyebrow('For Oregon care homes · runs on the house phone')}
        <h1 id="h1">${headline}</h1>
        <p class="lede"><b>${esc(p.descriptor)}.</b> ${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg" href="#join" data-cta="hero">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a>
          <a class="btn lg" href="#shift">${ic('clock', 18)}${esc(cfg.cta.secondary)}</a>
        </div>
        <p class="now" data-now><span class="now-dot" aria-hidden="true"></span><span class="now-t">It is <b data-oregon>06:55</b> in Oregon.</span> <span class="now-d" data-shift-word>Day shift.</span></p>
        <p class="fine">${esc(find('hero').fine)}</p>
      </div>
      <div class="hero-v">
        <div class="dev hero-dev">
          ${heroSwitch()}
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
      <p class="sim-hint">${ic('pill', 16)}<span>Tap a due row on the phone. Loratadine raises the allergy stop and asks for a reason.</span></p>
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
  compose: `<p class="tl-note" data-compose-note>${ic('count', 16)}<span>Watch the phone: the sheet fills itself as this step comes into view.</span></p>`,
};

function keysDialog() {
  const rows = [
    ['<kbd>J</kbd><kbd>K</kbd>', 'Next and previous hour on the shift'],
    ['<kbd>↓</kbd><kbd>↑</kbd>', 'The same, while an hour is focused'],
    ['<kbd>⌘</kbd><kbd>K</kbd>', 'Jump to a verb, a stop or a page'],
    ['<kbd>←</kbd><kbd>→</kbd>', 'Move across the screens — on the hero switcher and on the film strip'],
    ['<kbd>Home</kbd><kbd>End</kbd>', 'The first screen, and the last'],
    ['<kbd>T</kbd>', 'Back to the top'],
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
    return `<div class="tour-p ${present === 'compose' ? 'is-compose' : ''}" data-tour="${esc(k)}" ${i ? 'hidden' : ''}>${neutral(iosShell('cohort', { key, present: present === 'sheet' ? 'sheet' : 'none' }))}</div>`;
  }).join('');
  const steps = DAY.map((d, i) => `<li class="tl-i" id="${hid(d.at)}" data-tour="${esc(tourKey(d))}" data-at="${esc(d.at)}" ${i === 0 ? 'data-on' : ''}>
        <a class="tl-at" href="#${hid(d.at)}" data-tl-go aria-label="${esc(d.at)} — ${esc(d.t)}"><span class="tl-ic">${ic(d.icon, 16)}</span><time>${esc(d.at)}</time></a>
        <span class="tl-dot" aria-hidden="true"></span>
        <div class="tl-b"><h3><button type="button" class="tl-h" data-tl-go>${esc(d.t)}</button></h3><p>${esc(d.d)}</p>${d.widget ? WIDGET[d.widget] : ''}</div>
      </li>`).join('');
  return sec('shift', 'shift', `<div class="wrap">
    <div class="head shift-head">
      <div>${h2('shift', 'The shift, hour by hour.', 'What a caregiver does with Cohort between signing in and signing out.')}</div>
      <p class="shift-hint" aria-hidden="true">${ic('keyboard', 16)}<span>Tap an hour, or press <kbd>J</kbd> <kbd>K</kbd></span></p>
    </div>
    <div class="tl-g">
      <div class="tour" data-scroll-p="parent"><div class="tour-stick"><div class="crop"><div class="dev">${phones}</div></div><span class="tour-cap" aria-hidden="true"><i></i><span data-tour-cap>06:55</span></span></div></div>
      <ol class="tl">${steps}</ol>
    </div>
    ${keysDialog()}
    <button class="keysb" type="button" aria-controls="keys" aria-expanded="false" data-focus=".keys-x" data-fab-side aria-label="Keyboard shortcuts">${ic('keyboard', 18)}<span>Keys</span><kbd>?</kbd></button>
  </div>`);
}

/* ── the two stops, as cards that turn ─────────────────────────────────── */
function stops() {
  const gate = (n, title, front, back) => `<div class="gate-w"><button type="button" class="gate" aria-pressed="false" data-flip aria-label="${esc(title)} — turn the card over">
      <span class="gate-f"><span class="gate-n">${n}</span><span class="gate-t">${esc(title)}</span><span class="gate-p">${esc(front)}</span><span class="gate-cta">${ic('handoff', 15)}What an override records</span></span>
      <span class="gate-b"><span class="strip-l">What an override records · stop ${n}</span><span class="gate-p">${esc(back)}</span><span class="gate-cta">${ic('handoff', 15)}Turn back</span></span>
    </button></div>`;
  return sec('stops', 'stops', `<div class="wrap">
    <div class="head">${eyebrow('Inform, don’t police')}${h2('stops', 'Two stops. Nothing else.', 'Both because the harm is physical. Everything else informs and steps aside.')}</div>
    <div class="gates">
      ${gate(1, 'The allergy stop', 'A medication that matches a recorded allergy. The dialog asks for a reason before it signs.', 'The stop names the allergen, its severity and its reaction. The caregiver types a reason, it is recorded on the dose, and the manager is told.')}
      ${gate(2, 'The timing stop', 'An as-needed dose given too soon after the last one. The minimum interval is on the order.', 'The stop shows when the last dose was given and when the next one is allowed. Going on records a reason the same way.')}
    </div>
    <p class="stops-line">${ic('stamp', 16)}<span>Going on means typing a reason. It is recorded on the dose, the manager is told, and the pass continues. No countdown timers, no third stop.</span></p>
    <p class="more"><a href="/screens#cal-pass">${ic('screens', 16)}<span>See the allergy stop, pin by pin</span>${ic('right', 16)}</a></p>
  </div>`);
}

/* ── the record, with paper beside it ──────────────────────────────────── */
function record() {
  const s = find('evidence');
  const row = screen('marpass').rows.find((r) => r.state === 'given');
  const ink = `<svg class="paper-ink" viewBox="0 0 340 72" preserveAspectRatio="xMinYMid meet" aria-hidden="true"><path d="M12 44c4-15 8-17 11-4s5 9 9-2 7-13 11-1 6 9 10-1 6-13 10-2 4 8 8 0" /><path d="M96 43c3-12 6-14 8-3s4 8 8-2 5-12 8-1 4 9 8-1 5-12 8-2" /><path d="M156 46c2-6 4-10 7-9s5 7 6 12M172 34c3 2 5 7 5 12M186 37l6 10 7-16" /><path d="M222 45c3-10 6-14 9-3s5 8 9-2 6-11 10 0" /><path d="M268 30l7 11c-1 4-3 6-6 7M283 33c3 9 8 12 12 6" /><path d="M300 42l5 6 10-14" stroke-width="2.4" /></svg>`;
  const blocks = s.blocks.slice(0, 3);
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
      <p class="cmp-cap">Left, a hand-written MAR line. Right, the same dose in Cohort: a state word and a stamp.</p>
    </div>
    <div class="ev">${blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
  </div>`);
}

/* ── a correction, drawn: the addendum is under the original ───────────── */
function grammar() {
  const states = STATE_SETS.cohort;
  const row = (cls, k, t, who) => `<div class="adden-r ${cls}"><span class="adden-k">${esc(k)}</span><p>${esc(t)}</p><span class="stamp-a">${esc(who)}</span></div>`;
  return sec('grammar', 'grammar', `<div class="wrap">
    <div class="head">${eyebrow('Corrections')}${h2('grammar', 'A correction goes under the original.', 'Nothing is edited, struck through or removed. The record only grows.')}</div>
    <div class="corr">
      <div class="adden">
        ${row('is-orig', 'The original', 'Resident declined the 08:00 dose; offered again at 08:40.', 'Logged by A. Tesfaye · 08:05')}
        <span class="adden-j" aria-hidden="true">${ic('down', 16)}</span>
        ${row('is-add', 'The addendum', 'Correction: the second offer was at 09:10, not 08:40.', 'Logged by A. Tesfaye · 09:20')}
        <p class="adden-f">${ic('lock', 14)}<span>There is no third row. The original stays exactly as it was written.</span></p>
      </div>
      <div class="stleg"><span class="strip-l">The four words a dose can carry</span>
        <dl class="stleg-l">${states.map(([k, label, , why]) => `<div class="stleg-i"><dt><span class="st-a" data-state="${esc(k)}"><i></i>${esc(label)}</span></dt><dd>${esc(why)}</dd></div>`).join('')}</dl>
      </div>
    </div>
  </div>`);
}

/* ── three people, and who is holding the phone now ───────────────────── */
function roles() {
  const s = find('roles');
  const on = { provider: ['', ''], manager: ['1', ''], caregiver: ['1', '1'] };
  const icon = { provider: 'house', manager: 'clipboard', caregiver: 'care' };
  return sec('roles', 'roles', `<div class="wrap">
    <div class="head roles-head">
      <div>${h2('roles', s.heading, s.sub)}</div>
      <div class="seg" role="group" aria-label="Who is holding the phone"><button type="button" data-shift="now" aria-pressed="true">Now</button><button type="button" data-shift="day" aria-pressed="false">Day <span>06:55–19:00</span></button><button type="button" data-shift="night" aria-pressed="false">Night</button></div>
    </div>
    <div class="role-g" data-roles>${s.rows.map(([r, who, does, dev]) => `<div class="role" data-day="${on[r][0]}" data-night="${on[r][1]}">
      <span class="role-ic" aria-hidden="true">${ic(icon[r] || 'people', 22)}</span>
      <span class="role-n">${esc(r)}</span>
      <span class="role-on" data-role-on></span>
      <p class="role-w">${esc(who)}</p>
      <p class="role-d">${esc(does)}</p>
      <span class="role-r">${ic('clock', 14)}${esc(dev)}</span>
    </div>`).join('')}</div>
    <p class="closing">${esc(s.closing)}</p>
  </div>`);
}

/* ── your house: the door to app.cohorthome.app ────────────────────────── */
function house() {
  return sec('house', 'house', `<div class="wrap house-g">
    <div class="house-t">
      ${eyebrow('Already on Cohort')}
      ${h2('house', 'Your house is open at app.cohorthome.app.', 'The same record on the web: set up houses and residents, invite staff, review, print for the licensing file.')}
      <div class="ctas house-c">
        <a class="btn pri lg" href="${APP}" data-cta="house">${ic('house', 18)}Sign in to your house</a>
        <a class="btn lg" href="#join">I don’t have one yet</a>
      </div>
      <ul class="house-k">${HOUSE_KEYS.map(([k, v, i]) => `<li><span class="house-ki" aria-hidden="true">${ic(i, 18)}</span><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>
    </div>
    <div class="house-v">
      <a class="door" href="${APP}" aria-label="Open app.cohorthome.app">
        <span class="door-bar" aria-hidden="true"><i></i><i></i><i></i><span class="door-url">app.cohorthome.app</span></span>
        <span class="door-body" aria-hidden="true">
          <span class="door-card">
            <span class="door-tile">CO</span>
            <span class="door-name">Cohort</span>
            <b>Sign in to continue</b>
            <span class="door-p">Every entry is stamped with your name.</span>
            <span class="door-f">Email<span class="door-in">you@example.org</span></span>
            <span class="door-f">Password<span class="door-in">••••••••••</span></span>
            <span class="door-btn">Sign in</span>
            <small>New staff are added by invite. Ask an administrator to send you one.</small>
          </span>
          <span class="door-toast">Ready to work offline — your entries will queue.</span>
        </span>
      </a>
    </div>
  </div>`);
}

/* ── the questions, then a person to ask ───────────────────────────────── */
function questions(cfg, p) {
  const rows = find('objections').rows;
  return sec('questions', 'questions', `<div class="wrap">
    <div class="q-g">
      <div class="head">
        ${h2('questions', 'The questions we get.')}
        <label class="faq-f"><span class="sr-only">Filter the questions</span>${ic('search', 18)}<input class="faq-q" type="search" placeholder="Filter — wifi, export, stop…" autocomplete="off"><span class="faq-n" role="status" aria-live="polite">${rows.length} of ${rows.length}</span></label>
      </div>
      <div class="faq-w">${faq(rows)}<p class="faq-none" hidden>No question matches that. <a href="/contact">Ask it on the contact page.</a></p></div>
    </div>
    ${reach(cfg, p, { subject: 'A question — Cohort' })}
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
  const trial = p.pricing.rows.find(([n]) => /trial/i.test(n));
  const cta = { href: '#join', label: 'Get early access' };
  /* Round 4: the houses you set price the month (Firaol: "these need
     enhancement. they are big and no characters to it"). Pro fits one to
     three houses, Scale the rest; every price is brand.js's. */
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${eyebrow('One price per house')}${h2('pricing', s.heading, EVERY_PLAN)}</div>
    ${priceCalc(p, { id: 'pc-co', cls: 'pc-co', start: 1, max: 12, fit: { Pro: '1-3', Scale: '4-' }, main: 'Pro', mainLabel: 'Most houses', skip: trial ? [trial[0]] : [], cta: { Pro: cta, Scale: cta }, aside: trial ? `${trial[0]} · ${trial[1].toLowerCase()} · cancel in one tap` : '' })}
    <p class="fine">${esc(s.note)}</p>
    <p class="signup-line">${ic('stamp', 16)}<span><b>Signing up takes five minutes:</b> email, licence track, your first house, the agreements, card. <a href="/pricing">The trial and billing, in full</a></span></p>
  </div>`);
}

/* ── join ──────────────────────────────────────────────────────────────── */
const TEN_ON = ['today', 'residents', 'marpass', 'marpass', 'today'];
const SCREEN_TAB = Object.fromEntries(SCREENS.map((x) => [x.key, x.note.tab]));

function join(cfg, p) {
  const s = find('start');
  return sec('join', 'join', `<div class="wrap join-g">
    <div class="join-t">
      ${eyebrow(JOIN.eyebrow)}
      <h2 id="h-join">${esc(JOIN.heading)}</h2>
      <p class="sub">${esc(JOIN.sub)}</p>
      <div class="ten"><span class="strip-l">${esc(s.heading)}</span><ol class="ftn">${s.steps.map((t, i) => `<li><span>${esc(t)} <a class="ftn-s" href="${screenHref(TEN_ON[i] || 'today')}">${esc(SCREEN_TAB[TEN_ON[i] || 'today'])}</a></span></li>`).join('')}</ol></div>
    </div>
    <div class="join-f">${waitlist(cfg, p)}<p class="fine">${esc(JOIN.fine)}</p></div>
  </div>`);
}

/* The shift starts open on a phone: it is the page. Pricing never folds,
   because it is the section a reader came to find. Everything else opens
   as an entry on the index and unfolds on a tap. */
export function render(cfg, p) {
  return `${skip()}
${header(cfg, p, { page: 'home' })}
<main id="main" class="page face canvas" data-product="cohort" data-mode="light">
${hero(cfg, p)}
${pageIndex()}
${fold('Seven hours on the house phone, with the phone beside them', shift(), true)}
${fold('The allergy stop, and the timing stop', stops())}
${record()}
${fold('The addendum, and the four words a dose can carry', grammar())}
${fold('Provider, manager, caregiver', roles())}
${fold('Sign in at app.cohorthome.app', house())}
${fold('Wifi, exports, Therap, and a person to ask', questions(cfg, p))}
${pricing(cfg, p)}
${join(cfg, p)}
</main>
${footer(cfg, p, { page: 'home' })}`;
}
