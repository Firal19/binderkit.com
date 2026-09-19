// cohorthome.app — the shift, hour by hour.
//
// The page is built around one device: a caregiver's day on the house phone.
// A timeline runs down the left; the phone on the right changes screen as
// the reader passes each hour. Everything else on the page — the two stops,
// the record, the refusals — is what that day is made of.

import { esc, nav, foot, waitlist, faq, tiers, sec, h2, eyebrow, byline, ICON } from '../shared.js';
import { iosShell } from '../instruments.js';
import { PAGES, SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, JOIN } from '../../data/page.js';

const spec = PAGES.cohort;
const find = (k) => spec.sections.find((s) => s.key === k);

/* ── the day ─────────────────────────────────────────────────────────── */
const DAY = [
  { at: '06:55', t: 'Sign in with a staff code', d: 'On the house phone, or switch the acting person on a device already signed in. A code alone never opens a device with no valid session.', screen: 'today' },
  { at: '07:02', t: 'Read the handoff', d: 'What the night shift left — MAR status per resident, documentation done, incidents, open issues. Reading it records a receipt. Acknowledgement is never assumed.', screen: 'handoff' },
  { at: '08:00', t: 'The MAR pass', d: 'Scheduled → Six Rights → allergy check → PRN interval → signed. The only two things in the product that can stop you are in this step, and both are physical.', screen: 'marpass', present: 'sheet' },
  { at: '10:30', t: 'Documentation, per resident', d: 'Entries are stamped “Logged by · at”. If the wifi drops, they queue, are marked pending, and catch up. The caregiver does not wait for the record.', screen: 'residents' },
  { at: '13:40', t: 'An incident', d: 'Filed from where she is, with the immediate action taken. Managers are notified with a house code and nothing else. The external report is hers to make, outside the system.', screen: 'incident' },
  { at: '18:45', t: 'Start handover', d: 'The sheet composes itself from the day. A controlled-substance count is prompted. She writes one passage for the next shift and posts.', screen: 'handoff' },
  { at: '19:00', t: 'Sign out', d: 'Or the next caregiver switches in with her own code. Every record from the shift remains, attributed to the person who made it, for ever.', screen: 'today' },
];

const REFUSALS = [
  ['Any compliance score, readiness percentage, or grade', 'It measures the record rather than the care, and it invites managing the number.'],
  ['Countdown timers on regulatory obligations', 'An obligation stated as immediate must not be rendered as a clock.'],
  ['A third blocking check', 'Two exist because physical harm justifies them; a third erodes the principle that the product informs rather than polices.'],
  ['Deleting anything', 'The record’s value is that it cannot be quietly changed.'],
  ['Editing a filed incident narrative', 'Same reason. A correction is an addendum under the original.'],
  ['Sending any resident information outside the system', 'Every message announces existence; content is read after signing in.'],
  ['Notifying a family member or external party', 'The obligation and the judgement belong to the provider.'],
  ['Deriving a regulatory number from operational data', 'Capacity is typed by a human.'],
  ['Inventing a regulatory citation, threshold, or window', 'Where a source is not established, the statement is shown without one.'],
  ['Bulk-recording care', 'Each administration, sign-off, and completion is an individual attestation.'],
  ['Ranking houses or people', 'It turns a record into a performance instrument.'],
];

const NOT_STORED = ['staff credentials and expiry dates', 'rosters, clock events, timesheets', 'stock, menus, receipts', 'resident funds', 'documents other than plan versions', 'card numbers', 'anything about a family member beyond the contact list'];

const MACHINES = find('loop').machines;

/* ── blocks ──────────────────────────────────────────────────────────── */
function hero(cfg, p) {
  const strip = find('hero').strip;
  return `<section class="hero" id="top" aria-labelledby="h1">
    <div class="wrap hero-in">
      <div class="hero-t">
        ${eyebrow('For Oregon adult foster homes · runs on the house phone')}
        <h1 id="h1">${esc(p.headline.text)}</h1>
        <p class="lede"><b>${esc(p.descriptor)}.</b> ${esc(p.lede)}</p>
        <div class="ctas">
          <a class="btn pri lg" href="#join" data-cta="hero">${esc(cfg.cta.primary)}</a>
          <a class="btn lg" href="#shift">${esc(cfg.cta.secondary)}</a>
        </div>
        <p class="fine">Offline-safe. Two safety gates and nothing else that blocks. Every entry stamped “Logged by · at”.</p>
        <div class="strip"><span class="strip-l">${esc(strip.label)}</span><div class="strip-c">${strip.cells.map((c) => `<s>${esc(c)}</s>`).join('')}</div></div>
      </div>
      <div class="hero-v"><div class="dev">${iosShell('cohort', { key: 'today' })}</div></div>
    </div>
  </section>`;
}

function shift() {
  const keys = [...new Set(DAY.map((d) => `${d.screen}${d.present ? '+' + d.present : ''}`))];
  const phones = keys.map((k) => {
    const [screen, present] = k.split('+');
    return `<div class="tour-p" data-tour="${esc(k)}" ${k === keys[0] ? '' : 'hidden'}>${iosShell('cohort', { key: screen, present: present || 'none' })}</div>`;
  }).join('');
  return sec('shift', 'shift', `<div class="wrap">
    <div class="head">${eyebrow('One shift, on one phone')}${h2('shift', 'The shift, hour by hour.', 'This is what a caregiver does with Cohort between signing in and signing out. Nothing on it is a score, and nothing on it is red.')}</div>
    <div class="tl-g">
      <ol class="tl">${DAY.map((d, i) => `<li class="tl-i" data-tour="${esc(`${d.screen}${d.present ? '+' + d.present : ''}`)}" ${i === 0 ? 'data-on' : ''}>
        <span class="tl-at">${esc(d.at)}</span>
        <span class="tl-dot" aria-hidden="true"></span>
        <div class="tl-b"><h3>${esc(d.t)}</h3><p>${esc(d.d)}</p></div>
      </li>`).join('')}</ol>
      <div class="tour"><div class="tour-stick"><div class="dev">${phones}</div></div></div>
    </div>
  </div>`);
}

function stops() {
  const loop = find('loop');
  return sec('stops', 'stops', `<div class="wrap">
    <div class="head">${eyebrow('Inform, don’t police')}${h2('stops', 'Two stops. Nothing else.', 'Both were chosen because the harm of not stopping is physical. An override is recorded with a reason; then the pass proceeds. There is no third gate, and there are no countdown timers.')}</div>
    <div class="gates">
      <div class="gate"><span class="gate-n">1</span><h3>The allergy gate</h3><p>A medication that matches a recorded allergy. The Six Rights dialog asks for a reason before it will sign, and a manager is told.</p></div>
      <div class="gate"><span class="gate-n">2</span><h3>The PRN interval gate</h3><p>An as-needed dose given too soon after the last one. The minimum interval is on the order; the clock is the record’s, not a countdown.</p></div>
    </div>
    <p class="pull">${esc(loop.pull)}</p>
    <div class="machines"><span class="strip-l">Four state machines, and what each one refuses</span>
      ${MACHINES.map(([n, seq]) => `<div class="machine"><b>${esc(n)}</b><span>${esc(seq)}</span></div>`).join('')}
    </div>
  </div>`);
}

function refuses() {
  return sec('refuses', 'refuse', `<div class="wrap">
    <div class="head">${eyebrow('The manifesto')}${h2('refuses', 'What Cohort will not do, and why.', 'Eleven refusals. Each one is a position, not a missing feature, and each carries its reason.')}</div>
    <ol class="ref-l">${REFUSALS.map(([t, why], i) => `<li><span class="ref-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(t)}</b><span>${esc(why)}</span></div></li>`).join('')}</ol>
    <div class="notstored"><span class="strip-l">Not stored, by design</span><p>${NOT_STORED.map(esc).join(' · ')}.</p></div>
    <p class="boundary">Cohort keeps the residents’ record. It does not schedule staff, run the kitchen, or build binders.</p>
  </div>`);
}

function record() {
  const s = find('evidence');
  return sec('record', 'record', `<div class="wrap">
    <div class="head">${eyebrow('The record')}${h2('record', s.heading, s.sub)}</div>
    <div class="ev">${s.blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
    <div class="ev-cl">${s.closingBlocks.map((b) => `<div class="note">${b.heading ? `<h3>${esc(b.heading)}</h3>` : ''}<p>${esc(b.text)}</p></div>`).join('')}</div>
  </div>`);
}

function roles() {
  const s = find('roles');
  return sec('roles', 'roles', `<div class="wrap">
    <div class="head">${h2('roles', s.heading, s.sub)}</div>
    <div class="role-g">${s.rows.map(([r, who, does, dev]) => `<div class="role"><span class="role-n">${esc(r)}</span><p class="role-w">${esc(who)}</p><p class="role-d">${esc(does)}</p><span class="role-r">${esc(dev)}</span></div>`).join('')}</div>
    <p class="closing">${esc(s.closing)}</p>
  </div>`);
}

const APP = 'https://app.cohorthome.app';
const HOUSE_KEYS = [
  ['By invite', 'New staff are added by an administrator, never by a sign-up page.'],
  ['Logged by · at', 'Every entry carries who made it, and when.'],
  ['Offline-ready', 'Entries made without signal queue, are marked pending, and catch up.'],
];

/* The door: the sign-in the reader will actually meet, drawn as it is. */
function house() {
  return sec('house', 'house', `<div class="wrap house-g">
    <div class="house-t">
      ${eyebrow('Already on Cohort')}
      ${h2('house', 'Your house is open at app.cohorthome.app.', 'The same record, on the web: set up houses and residents, invite staff, review the roll-ups, print for the licensing file. Sign in with the address your administrator invited.')}
      <div class="ctas">
        <a class="btn pri lg" href="${APP}" data-cta="house">Sign in to your house</a>
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

function questions(cfg) {
  return sec('questions', 'questions', `<div class="wrap q-g">
    <div class="head">${h2('questions', 'The questions we get.')}</div>
    ${faq(find('objections').rows)}
  </div>`);
}

function pricing(cfg, p) {
  const s = find('pricing');
  return sec('pricing', 'pricing', `<div class="wrap">
    <div class="head">${h2('pricing', s.heading, EVERY_PLAN)}</div>
    ${tiers(p, 1)}
    <p class="fine">${esc(s.note)}</p>
    <div class="subs">
      <div class="note"><h3>${esc(SIGNUP_SIX.heading)}</h3><ol class="arrow">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(SIGNUP_SIX.tail)}</p></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>
  </div>`);
}

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
  return `${nav(cfg, p)}
<main id="main" class="page face canvas" data-product="cohort" data-mode="light">
${hero(cfg, p)}
${shift()}
${stops()}
${refuses()}
${record()}
${roles()}
${house()}
${questions(cfg)}
${pricing(cfg, p)}
${join(cfg, p)}
</main>
${foot(cfg, p, { fine: find('foot').disclaimer })}`;
}
