// The five marketing pages: features, pricing, security, about, contact.
// Each is a full body in the same chrome as the front page.

import { esc, skip, sec, h2, eyebrow, tiers, contact, CONTACT, byline, hello, mailto, social } from '../../shared.js';
import { webShell, iosShell, filmStrip, callouts } from '../../instruments.js';
import { SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, TRIAL_FINE } from '../../../data/page.js';
import { PRODUCTS, MINIS } from '../../../data/brand.js';
import { ic } from '../../icons/cohort.js';
import CONFIGS from '../../../configs.js';
import { header, footer } from './chrome.js';
import { find, MODULES, MOVED, REMOVED, NOT_NOW, LARGER, REFUSALS, NOT_STORED, TOPICS, APP,
  SCREEN_ORDER, SCREEN_NOTES, SITE, STRIP, PASS } from './data.js';

/* The page descriptions below are plain strings handed to build.mjs's head(),
   so they cannot call hello(cfg) at render time; they read the same source. */
const ADDR = hello(CONFIGS.cohort);

const shell = (cfg, p, page, inner) => `${skip()}
${header(cfg, p, { page })}
<main id="main" class="page face canvas is-sub" data-product="cohort" data-mode="light">
${inner}
</main>
${footer(cfg, p, { page })}`;

const phead = (eye, h1, sub, extra = '') => `<section class="phead" aria-labelledby="h1"><div class="wrap phead-in"><div class="phead-t">${eyebrow(eye)}<h1 id="h1">${h1}</h1></div>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}${extra}</div></section>`;

/* The phone fold, spliced onto a section shared.js's sec() already built —
   see the note in render/pages/cohort.js. The page head and the closing
   call stay open; everything between them folds. */
const fold = (gist, html) => html.replace(
  '<section class="sec',
  `<section data-phone="fold" data-gist="${esc(gist)}" class="sec`,
);

const MOD_ICON = { '01': 'gate', '02': 'house', '03': 'bed', '04': 'pill', '05': 'note', '06': 'flag', '07': 'clock', '08': 'check', '09': 'record', 10: 'wave', 11: 'info', 12: 'count', 13: 'tag', 14: 'mail', 15: 'people', 16: 'shield', '—': 'link' };
const stageKey = (s) => (/^v1/.test(s) ? 'v1' : /^v2/.test(s) ? 'v2' : 'later');
const STAGE_LABEL = { v1: 'First release', 'v1 min': 'First release', v2: 'Next', 'v2 min': 'Next', later: 'Later' };

/* ── /features ─────────────────────────────────────────────────────────── */
function features(cfg, p) {
  const total = MODULES.reduce((a, [, , rows]) => a + rows.length, 0);
  const filter = `<div class="fstage" role="group" aria-label="Show features by stage">
      ${[['all', 'All'], ['v1', 'First release'], ['v2', 'Next'], ['later', 'Later']].map(([k, l], i) => `<button type="button" data-stage="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}
      <span class="fs-n" role="status" aria-live="polite">${total} of ${total}</span>
    </div>`;
  /* `.frow` is a three-part row — the capability's own code in a 64px mono
     column, then the name and its detail, then the stage/plan/data tags
     under them. The code was never emitted, so every name was squeezed into
     that 64px column one word per line and the tags stretched to match: a
     29-row list ran 7,583px on a phone and 12 screens on a 1440px desktop
     for 297 words. The row below is the layout `.frow` was written for.
     `.fmod-no` is the module NUMBER — it was printing the module name, so
     every card carried its own title twice, at both widths. */
  const groups = MODULES.map(([no, name, rows]) => `<div class="fmod" data-mod="${esc(no)}">
      <div class="fmod-h"><span class="fmod-no">${ic(MOD_ICON[no] || 'now', 18)}<span>${esc(no === '—' ? 'Across' : `Module ${no}`)}</span></span><h3>${esc(no === '—' ? 'Across the product' : name)}</h3><span class="fmod-n">${rows.length}</span></div>
      <ul class="frows">${rows.map(([id, t, d, stage, tier, phi]) => `<li class="frow" data-stage="${stageKey(stage)}"><span class="frow-id">${esc(id)}</span><div class="frow-b"><b>${esc(t)}</b>${d ? `<span class="frow-d">${esc(d)}</span>` : ''}</div><span class="frow-m"><span class="tg is-stage" data-s="${stageKey(stage)}">${esc(STAGE_LABEL[stage] || stage)}</span>${tier !== '—' ? `<span class="tg">${esc(tier)}</span>` : ''}${phi !== '—' ? `<span class="tg">${esc(phi)}</span>` : ''}</span></li>`).join('')}</ul>
    </div>`).join('');
  const moved = (rows) => `<ul class="mv-l">${rows.map(([, t, , why]) => `<li><div><b>${esc(t)}</b><span>${esc(why)}</span></div></li>`).join('')}</ul>`;
  return shell(cfg, p, 'features', `
    ${phead('Features', 'Everything Cohort does.', `Grouped the way the product is built — ${total} capabilities. Beside each: whether it is in the first release, what plan it sits on, and whether it touches care data.`, filter)}
    ${sec('modules', 'fmods', `<div class="wrap"><div class="fgrid">${groups}</div><p class="fs-none" hidden>Nothing at that stage. Every group has something in the first release.</p></div>`, { label: 'Features by group' })}
    ${fold('Allergy, and the PRN interval', sec('gates', 'fgates', `<div class="wrap">
      <div class="head">${h2('gates', 'Two of those can stop a caregiver. The rest inform.', 'The allergy gate and the PRN interval gate — both in the MAR, both chosen because the harm of not stopping is physical.')}</div>
      <div class="fg2">${find('loop').gates.map((g, i) => `<div class="note"><span class="gate-n">${i + 1}</span><p>${esc(g)}</p></div>`).join('')}</div>
      <ol class="pass" aria-label="The seven states of a medication pass">${PASS.map(([label, stop, note]) => `<li class="pass-s"${stop ? ` data-stop="${stop}"` : ''}><b>${esc(label)}</b><span>${esc(note)}</span>${stop ? `<span class="pass-b">Stop ${stop}</span>` : ''}</li>`).join('')}</ol>
      <p class="cap">Seven states, and exactly two of them stop a caregiver. The number is fixed by a rule, not by taste: no module may add a third.</p>
      <p class="more"><a href="/#stops">${ic('gate', 16)}<span>See the two stops on the front page</span>${ic('right', 16)}</a></p>
    </div>`))}
    ${fold('And what came out on purpose', sec('moved', 'fmoved', `<div class="wrap fm-g">
      <div><div class="head">${h2('moved', 'Not in this product.', 'Cohort keeps the residents’ record. Scheduling and the kitchen are not in it.')}</div>${moved(MOVED)}</div>
      <div><div class="head">${h2('removed', 'Taken out on purpose.', 'One of them would have been a third hard gate. The product stops a caregiver twice, and no more.')}</div>${moved(REMOVED)}</div>
    </div>`))}
    ${fold('Eleven refusals, with reasons', sec('never', 'fnever', `<div class="wrap">
      <div class="head">${h2('never', 'Refused on principle.', 'Eleven refusals, each with the reason given for it. The same list prints from the front page.')}</div>
      <ol class="ref-l">${REFUSALS.map(([t, why], i) => `<li><span class="ref-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(t)}</b><span>${esc(why)}</span></div></li>`).join('')}</ol>
      <div class="fn-g">
        <div class="note"><h3>Belongs to a larger platform</h3><ul class="dot-l">${LARGER.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div class="note"><h3>Not stored, by design</h3><p>${NOT_STORED.map(esc).join(' · ')}.</p></div>
      </div>
      <div class="notnow"><span class="strip-l">Not in this version — and what would change that</span><dl class="defs">${NOT_NOW.map(([t, c]) => `<dt>${esc(t)}</dt><dd>${esc(c)}</dd>`).join('')}</dl></div>
    </div>`))}
    ${sec('fjoin', 'fjoin', `<div class="wrap">
      <div class="head">${eyebrow('Early access')}${h2('fjoin', 'That is the whole product.', `${total} capabilities, two stops, eleven refusals. Ask for the list in writing, or come and see it run a shift.`)}</div>
      <div class="ctas"><a class="btn pri lg" href="/#join">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a><a class="btn lg" href="/security">${ic('shield', 18)}What it holds</a></div>
    </div>`)}`);
}

/* ── /screens ───────────────────────────────────────────────────────────
   The whole product, on its own route. A full five-screen strip is 30 kB
   of HTML; tools/check.mjs measures /index.html and nothing else, so the
   strip lives here where it costs the budget nothing — and a route called
   “Screens” is the link a reader actually sends to someone else. */
const NOTES = Object.fromEntries(SCREEN_ORDER.map((k) => [k, SCREEN_NOTES[k]]));

function screens(cfg, p) {
  const strip = filmStrip('cohort', {
    id: STRIP,
    only: SCREEN_ORDER,
    notes: NOTES,
    label: 'Every screen in Cohort, at the size it ships',
    hint: 'Drag it, scroll it, or use the arrow keys. Every screen here is the product itself, drawn from the specification and filled with sample data.',
    jumpLabel: 'Jump to a screen',
  });
  /* present:'sheet' is passed explicitly. The board's own view state sets
     shellPresent:'none', and presentOf() lets that beat the screen's own
     default — so a marpass shell rendered with no options draws the list
     and no Six Rights dialog, which is the thing three of these four pins
     are pointing at. */
  const pass = callouts(iosShell('cohort', { key: 'marpass', present: 'sheet' }), [
    { n: 1, text: 'Six Rights, six boxes, all of them required — and the sixth is the record itself: signing writes who and when.', sel: '.sheet-h' },
    { n: 2, text: 'The first stop. The allergy is named before the dose is signed, not after it, with its severity, its reaction and where the information came from.', sel: '.notice-a' },
    { n: 3, text: 'The second stop, on the same screen: an as-needed dose before its minimum interval. Two conditions, not one — the interval, and the ceiling in twenty-four hours.', sel: '.notice-a + .notice-a' },
    { n: 4, text: 'And the cost of going on: Override means typing a reason of at least ten characters, recorded on the dose, written to the audit log, and the manager is told.', sel: '.btn-row' },
  ], { id: 'cal-pass', label: 'The allergy gate, as a caregiver meets it' });
  const desk = callouts(webShell('cohort', { key: 'today', width: 1024 }), [
    { n: 1, text: 'Today on the desktop: one row per resident, composed at read time from the MAR, documentation and incidents. Today stores nothing of its own.', sel: '.tbl-a' },
    { n: 2, text: 'The same allergy, surfaced rather than enforced — this screen states it, and the MAR is where it stops anyone.', sel: '.notice-a' },
    { n: 3, text: 'Every row ends in a stamp: who last wrote to that resident’s record, and when.', sel: '.stamp-a' },
  ], { id: 'cal-desktop', label: 'Today, on the desktop app' });
  const link = (key, tab) => `<li class="dl-i"><b>${esc(tab)}</b><code class="dl-u">${esc(SITE)}/screens#${STRIP}-${key}</code><button type="button" class="copyb" data-copy="${esc(SITE)}/screens#${STRIP}-${key}" data-copied="Link to the ${esc(tab)} screen copied" aria-label="Copy the link to the ${esc(tab)} screen">${ic('copy', 16)}</button></li>`;
  return shell(cfg, p, 'screens', `
    ${phead('Screens', 'Every screen, at the size it ships.', 'Five surfaces, drawn from the specification and filled with sample data. The phones are at the size they ship. The desktop window is 1024px across and it is that size on a desktop; on a phone you get the app’s own narrow build instead of a shrunken wide one, at 80%, panned sideways. Nothing here is scaled down to the point where it cannot be read. Drag the strip, or use the arrow keys.')}
    ${sec('strip', 'sstrip', `<div class="wrap">${strip}</div>`, { label: 'The five screens' })}
    ${fold('The allergy gate, pin by pin', sec('annot', 'sannot', `<div class="wrap">
      <div class="head">${eyebrow('The stop, annotated')}${h2('annot', 'The allergy gate, pin by pin.', 'Four numbered pins over the real screen. Move across a sentence and the element it quotes lights up; the sentences are an ordered list underneath, so nothing is lost when a pin cannot be placed.')}</div>
      ${pass}
    </div>`))}
    ${fold('The same record, on the desktop', sec('desk', 'sdesk', `<div class="wrap">
      <div class="head">${eyebrow('The same record, wider')}${h2('desk', 'And the same record on the desktop.', 'One record, two devices, one rule. On a desktop this is the 1024px app at its real size. On a phone it is not that window shrunk — it is the app’s own narrow build, one column with the rail folded away, at 80%; drag sideways for the rest of it.')}</div>
      <div class="shell-w" data-scrollx tabindex="0" role="group" aria-label="Today on the desktop app — scroll sideways for the rest of the screen">${desk}</div>
    </div>`))}
    ${fold('Every screen has an address', sec('deep', 'sdeep', `<div class="wrap">
      <div class="head">${h2('deep', 'Every screen has an address.', 'Send one. It opens on that screen, not at the top of the page.')}</div>
      <ul class="dl-l">${SCREEN_ORDER.map((k) => link(k, SCREEN_NOTES[k].tab)).join('')}</ul>
      <p class="more"><a href="/#shift">${ic('clock', 16)}<span>Or watch them in order, across one shift</span>${ic('right', 16)}</a></p>
    </div>`))}
    ${sec('sjoin', 'sjoin', `<div class="wrap">
      <div class="head">${eyebrow('Early access')}${h2('sjoin', 'That is the product.', 'Five screens, two stops, one record that cannot be quietly changed.')}</div>
      <div class="ctas"><a class="btn pri lg" href="/#join">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a></div>
    </div>`)}`);
}

/* ── /pricing ──────────────────────────────────────────────────────────── */
function pricingPage(cfg, p) {
  const s = find('pricing');
  const stepper = `<div class="hs-w"><span class="strip-l">How many houses?</span>
    <div class="hs" role="group" aria-label="How many houses?">${['1', '2–3', '4–9', '10+'].map((h, i) => `<button type="button" data-h="${esc(h)}" aria-pressed="${i === 0}">${esc(h)}</button>`).join('')}</div>
    <p class="hs-line" role="status" aria-live="polite">One house — Pro covers it, and every plan sees every screen.</p>
  </div>`;
  return shell(cfg, p, 'pricing', `
    ${phead('Pricing', esc(s.heading), EVERY_PLAN)}
    ${sec('plans', 'pplans', `<div class="wrap">
      ${stepper}
      ${tiers(p, 1)}
      <p class="fine">${esc(s.note)}</p>
      <div class="trial"><span class="trial-i">${ic('stamp', 22)}</span><div><span class="strip-l">The trial</span><p>${esc(TRIAL_FINE)}</p></div></div>
    </div>`, { label: 'Plans' })}
    ${sec('signup', 'psignup', `<div class="wrap subs">
      <div class="note"><h3>${esc(SIGNUP_SIX.heading)}</h3><ol class="six">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(SIGNUP_SIX.tail)}</p></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>`, { label: 'Signing up, and if a payment fails' })}
    ${sec('pjoin', 'pjoin', `<div class="wrap">
      <div class="head">${eyebrow('Early access')}${h2('pjoin', 'Be in the first houses on it.', 'Leave an email on the front page and we will tell you when it opens, what it costs, and how to get in.')}</div>
      <div class="ctas"><a class="btn pri lg" href="/#join">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a><a class="btn lg" href="/contact">${ic('mail', 18)}Ask about pricing</a></div>
    </div>`)}`);
}

/* ── /security ─────────────────────────────────────────────────────────── */
function security(cfg, p) {
  const ev = find('evidence');
  const loop = find('loop');
  return shell(cfg, p, 'security', `
    ${phead('Security and privacy', esc(ev.heading), ev.sub)}
    ${fold('Nineteen tables, three kinds', sec('holds', 'sholds', `<div class="wrap">
      <div class="head">${h2('holds', 'What it holds.', 'Three kinds of record, in the same words as the product.')}</div>
      <div class="pv-g">${cfg.privacy.holds.map(([label, text]) => `<div class="pv-c"><span class="strip-l">${esc(label)}</span><p>${esc(text)}</p></div>`).join('')}</div>
    </div>`))}
    ${sec('mechanism', 'smech', `<div class="wrap">
      <div class="head">${eyebrow('The mechanism')}${h2('mechanism', 'How the record is held up.', 'The protection is mechanism, not adjectives.')}</div>
      <div class="ev">${ev.blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
      <div class="ev-cl">${ev.closingBlocks.map((b) => `<div class="note">${b.heading ? `<h3>${esc(b.heading)}</h3>` : '<h3>Where it lives, and the agreement</h3>'}<p>${esc(b.text)}</p></div>`).join('')}</div>
    </div>`)}
    ${fold('One incident, and what left', sec('left', 'sleft', `<div class="wrap">
      <div class="head">${eyebrow('What left the house')}${h2('left', 'An incident, and everything that left the house because of it.', 'Filed, notified with a house code and nothing else, reviewed, signed off, locked — and the push beside it.')}</div>
      <div class="left-ph" aria-hidden="true">${iosShell('cohort', { key: 'incident' })}</div>
      <div class="left-w">
        <span class="strip-l">The same incident, on the desktop</span>
        <div class="shell-w" data-scrollx tabindex="0" role="group" aria-label="The incident on the desktop app — scroll sideways for the rest of the screen"><div class="shell">${webShell('cohort', { key: 'incident', width: 1024 })}</div></div>
        <p class="cap left-cap"><span class="left-cap-w">Shown at true size. Drag sideways for the rest — it is not shrunk to fit, because a shrunk screen cannot be read.</span><span class="left-cap-p">The app at its own narrow layout: the navigation rail is behind the ☰ and the trail reads top to bottom. Drag sideways for the panel beside it.</span></p>
      </div>
    </div>`))}
    ${sec('sgates', 'sgates', `<div class="wrap">
      <div class="head">${eyebrow('The two stops')}${h2('sgates', 'Exactly two actions may stop a caregiver.', loop.gateNote)}</div>
      <div class="fg2">${loop.gates.map((g, i) => `<div class="note"><span class="gate-n">${i + 1}</span><p>${esc(g)}</p></div>`).join('')}</div>
      <div class="ctas"><a class="btn pri lg" href="/privacy">${ic('shield', 18)}The privacy page, in full</a><a class="btn lg" href="/contact">${ic('mail', 18)}Ask about security</a></div>
    </div>`)}`);
}

/* ── /about ────────────────────────────────────────────────────────────── */
function about(cfg, p) {
  const pho = PRODUCTS[0];
  return shell(cfg, p, 'about', `
    ${phead('About', 'Daily operations for Oregon care homes.', p.lede)}
    ${sec('standing', 'astand', `<div class="wrap">
      <div class="head">${h2('standing', 'What Cohort is built on.', 'Three things the product holds to.')}</div>
      <ul class="proof">${p.proof.map((t) => `<li>${ic('check', 16)}<span>${esc(t)}</span></li>`).join('')}</ul>
    </div>`)}
    ${sec('company', 'acompany', `<div class="wrap company">
      <div>${h2('company', 'Made in Oregon, for Oregon houses.', `${pho.name} — ${pho.descriptor.toLowerCase()}.`)}
        <p class="company-l">${esc(cfg.legalLine)}</p>
        <div class="ctas"><a class="btn lg" href="https://${esc(pho.domain)}" rel="noopener">${ic('ext', 18)}${esc(pho.domain)}</a><a class="btn pri lg" href="/contact">${ic('mail', 18)}Write to a person</a></div>
      </div>
      <div class="company-by">${byline(false)}</div>
    </div>`)}`);
}

/* ── /contact ──────────────────────────────────────────────────────────── */
function contactPage(cfg, p) {
  return shell(cfg, p, 'contact', `
    ${phead('Contact', 'Write to a person.', CONTACT.sub)}
    ${sec('write', 'cwrite', `<div class="wrap c-g">
      <div class="c-f">${contact(cfg, p, { topics: TOPICS, placeholder: 'What would you like to know? A house, a pilot, a price, a worry — anything.' })}</div>
      <aside class="c-side">
        <div class="note">
          <span class="strip-l">Straight to the inbox</span>
          <p class="c-mail"><a href="${mailto(cfg)}">${esc(hello(cfg))}</a><button class="copyb" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied" aria-label="Copy the address">${ic('copy', 16)}</button></p>
          <p class="fine">${esc(CONTACT.fine)}</p>
        </div>
        <div class="note">
          <span class="strip-l">Cohort, elsewhere</span>
          ${social(p.id, { text: true, cls: 'stamps is-labelled', size: 18, label: 'Cohort on social' })}
        </div>
        <div class="note">
          <span class="strip-l">Already on Cohort?</span>
          <p class="c-app"><a href="${APP}">${ic('house', 16)}Sign in to your house</a></p>
          <p class="fine">New staff are added by an administrator, never by a sign-up page. If nobody has added you, write to <a href="${mailto(cfg, `I’m staff — ${p.name}`)}">${esc(hello(cfg))}</a> — we cannot add you, but we will tell you who can.</p>
        </div>
      </aside>
    </div>`, { label: 'Write to us' })}`);
}

export const pages = [
  { path: 'screens', title: 'Screens', description: 'Every screen in Cohort at the size it ships: Today, the MAR pass, an incident, the handoff and the resident record — with what each one proves.', render: screens },
  { path: 'features', title: 'Features', description: 'Everything Cohort does: the MAR and its two gates, documentation, incidents, the handoff, tasks, plans — and what it refuses on principle.', render: features },
  { path: 'pricing', title: 'Pricing', description: 'One price per house. The three-day trial, the six signup steps, what happens if a payment fails, and how many houses each plan covers.', render: pricingPage },
  { path: 'security', title: 'Security and privacy', description: 'What Cohort holds, how the record is held up, what leaves the house, and the two stops — in the same words as the product.', render: security },
  { path: 'about', title: 'About', description: 'Cohort is daily operations for Oregon care homes, made in Oregon by Providerhub Oregon.', render: about },
  { path: 'contact', title: 'Contact', description: `Write to a person at ${ADDR}. One inbox, one person reads it and answers.`, render: contactPage },
];
