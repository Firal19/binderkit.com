// The marketing pages: screens, features, pricing, security, about, contact.
// Each is a full body in the same chrome as the front page.

import { esc, skip, sec, h2, eyebrow, tiers, contact, CONTACT, byline, hello, mailto, social, reach, priceCalc } from '../../shared.js';
import { webShell, iosShell, filmStrip, callouts } from '../../instruments.js';
import { SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, TRIAL_FINE } from '../../../data/page.js';
import { ic } from '../../icons/cohort.js';
import CONFIGS from '../../../configs.js';
import { header, footer } from './chrome.js';
import { find, MODULES, REFUSALS, TOPICS, APP, SCREEN_ORDER, SCREEN_NOTES, SITE, STRIP, PASS, neutral } from './data.js';

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

/* The phone fold, spliced onto a section shared.js's sec() already built. */
const fold = (gist, html) => html.replace(
  '<section class="sec',
  `<section data-phone="fold" data-gist="${esc(gist)}" class="sec`,
);

const MOD_ICON = { '01': 'key', '02': 'house', '03': 'bed', '04': 'pill', '05': 'note', '06': 'flag', '07': 'clock', '08': 'check', '09': 'record', 10: 'wave', 11: 'info', 12: 'count', 13: 'tag', 14: 'mail', 15: 'people', '—': 'link' };
const stageKey = (s) => (/^v1/.test(s) ? 'v1' : /^v2/.test(s) ? 'v2' : 'later');
const STAGE_LABEL = { v1: 'First release', 'v1 min': 'First release', v2: 'Next', 'v2 min': 'Next', later: 'Later' };

/* ── /features ─────────────────────────────────────────────────────────── */
function features(cfg, p) {
  const total = MODULES.reduce((a, [, , rows]) => a + rows.length, 0);
  const filter = '';
  const groups = MODULES.map(([no, name, rows]) => `<div class="fmod" data-mod="${esc(no)}">
      <div class="fmod-h"><span class="fmod-no">${ic(MOD_ICON[no] || 'now', 18)}<span>${esc(no === '—' ? 'Across' : `Module ${no}`)}</span></span><h3>${esc(name)}</h3><span class="fmod-n">${rows.length}</span></div>
      <ul class="frows">${rows.map(([id, t, d, stage, tier, phi]) => `<li class="frow" data-stage="${stageKey(stage)}"><span class="frow-id">${esc(id)}</span><div class="frow-b"><b>${esc(t)}</b>${d ? `<span class="frow-d">${esc(d)}</span>` : ''}</div><span class="frow-m">${tier !== '—' ? `<span class="tg">${esc(tier)}</span>` : ''}${phi !== '—' ? `<span class="tg">${esc(phi)}</span>` : ''}</span></li>`).join('')}</ul>
    </div>`).join('');
  return shell(cfg, p, 'features', `
    ${phead('Features', 'Everything Cohort does.', `${total} capabilities, grouped the way the product is built. Beside each: which plan it sits on, and whether it touches care data.`, filter)}
    ${sec('modules', 'fmods', `<div class="wrap"><div class="fgrid">${groups}</div></div>`, { label: 'Features by group' })}
    ${fold('The allergy stop, and the timing stop', sec('gates', 'fgates', `<div class="wrap">
      <div class="head">${h2('gates', 'Two of those can stop a caregiver. The rest inform.', 'Both in the MAR, both because the harm is physical.')}</div>
      <div class="fg2">${find('loop').gates.map((g, i) => `<div class="note"><span class="gate-n">${i + 1}</span><p>${esc(g)}</p></div>`).join('')}</div>
      <ol class="pass" aria-label="The seven states of a medication pass">${PASS.map(([label, stop, note]) => `<li class="pass-s"${stop ? ` data-stop="${stop}"` : ''}><b>${esc(label)}</b><span>${esc(note)}</span>${stop ? `<span class="pass-b">Stop ${stop}</span>` : ''}</li>`).join('')}</ol>
      <p class="cap">Seven states, and exactly two of them stop a caregiver. No module may add a third.</p>
      <p class="more"><a href="/#stops">${ic('gate', 16)}<span>See the two stops on the front page</span>${ic('right', 16)}</a></p>
    </div>`))}
    ${fold('Four things it will not do, with the reason', sec('never', 'fnever', `<div class="wrap">
      <div class="head">${h2('never', 'Refused on principle.', 'Four things Cohort will not do. They are positions, not missing features.')}</div>
      <ul class="ref-g">${REFUSALS.map(([t, why], i) => `<li class="ref-c"><span class="ref-n">${String(i + 1).padStart(2, '0')}</span><b>${esc(t)}</b><p>${esc(why)}</p></li>`).join('')}</ul>
    </div>`))}
    ${sec('fjoin', 'fjoin', `<div class="wrap">
      <div class="head">${eyebrow('Early access')}${h2('fjoin', 'That is the whole product.', `${total} capabilities, two stops, one record that cannot be quietly changed.`)}</div>
      <div class="ctas"><a class="btn pri lg" href="/#join">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a><a class="btn lg" href="/security">${ic('shield', 18)}What it holds</a></div>
    </div>`)}`);
}

/* ── /screens ───────────────────────────────────────────────────────────
   The whole product, on its own route. */
const NOTES = Object.fromEntries(SCREEN_ORDER.map((k) => [k, SCREEN_NOTES[k]]));

function screens(cfg, p) {
  const strip = neutral(filmStrip('cohort', {
    id: STRIP,
    only: SCREEN_ORDER,
    notes: NOTES,
    label: 'Every screen in Cohort, at the size it ships',
    hint: 'Drag it, scroll it, or use the arrow keys.',
    jumpLabel: 'Jump to a screen',
  }));
  const pass = callouts(iosShell('cohort', { key: 'marpass', present: 'sheet' }), [
    { n: 1, text: 'Six Rights, six boxes, all required. The sixth is the record itself: signing writes who and when.', sel: '.sheet-h' },
    { n: 2, text: 'The first stop. The allergy is named before the dose is signed, with its severity and its reaction.', sel: '.notice-a' },
    { n: 3, text: 'The second stop, on the same screen: an as-needed dose before its minimum interval.', sel: '.notice-a + .notice-a' },
    { n: 4, text: 'Going on means typing a reason. It is recorded on the dose, and the manager is told.', sel: '.btn-row' },
  ], { id: 'cal-pass', label: 'The allergy stop, as a caregiver meets it' });
  const desk = callouts(webShell('cohort', { key: 'today', width: 1024 }), [
    { n: 1, text: 'Today on the desktop: one row per resident, composed at read time from the MAR, documentation and incidents.', sel: '.tbl-a' },
    { n: 2, text: 'The same allergy, surfaced here and stopping only in the MAR.', sel: '.notice-a' },
    { n: 3, text: 'Every row ends in a stamp: who last wrote to that resident’s record, and when.', sel: '.stamp-a' },
  ], { id: 'cal-desktop', label: 'Today, on the desktop app' });
  const link = (key, tab) => `<li class="dl-i"><b>${esc(tab)}</b><code class="dl-u">${esc(SITE)}/screens#${STRIP}-${key}</code><button type="button" class="copyb" data-copy="${esc(SITE)}/screens#${STRIP}-${key}" data-copy-only data-copied="Link to the ${esc(tab)} screen copied" aria-label="Copy the link to the ${esc(tab)} screen">${ic('copy', 16)}</button></li>`;
  return shell(cfg, p, 'screens', `
    ${phead('Screens', 'Every screen, at the size it ships.', 'Five screens on the phone, and the same record on the desktop. Drag the strip, or use the arrow keys.')}
    ${sec('strip', 'sstrip', `<div class="wrap">${strip}</div>`, { label: 'The five screens' })}
    ${fold('The allergy stop, pin by pin', sec('annot', 'sannot', `<div class="wrap">
      <div class="head">${eyebrow('The stop, annotated')}${h2('annot', 'The allergy stop, pin by pin.', 'Four numbered pins over the real screen. Move across a sentence and the element it names lights up.')}</div>
      ${pass}
    </div>`))}
    ${fold('The same record, on the desktop', sec('desk', 'sdesk', `<div class="wrap">
      <div class="head">${eyebrow('The same record, wider')}${h2('desk', 'And the same record on the desktop.', 'One record, two devices, one rule. On a phone, drag sideways for the rest of it.')}</div>
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
  const cta = { href: '/#join', label: 'Get early access' };
  return shell(cfg, p, 'pricing', `
    ${phead('Pricing', esc(s.heading), EVERY_PLAN)}
    ${sec('plans', 'pplans', `<div class="wrap">
      ${priceCalc(p, { id: 'pc-cop', cls: 'pc-co', start: 1, max: 12, fit: { Pro: '1-3', Scale: '4-' }, main: 'Pro', mainLabel: 'Most houses', skip: ['3-day trial'], cta: { Pro: cta, Scale: cta } })}
      <p class="fine">${esc(s.note)}</p>
      <div class="trial"><span class="trial-i">${ic('stamp', 22)}</span><div><span class="strip-l">The trial</span><p>${esc(TRIAL_FINE)}</p></div></div>
    </div>`, { label: 'Plans' })}
    ${sec('signup', 'psignup', `<div class="wrap subs">
      <div class="note"><h3>${esc(SIGNUP_SIX.heading)}</h3><ol class="six">${SIGNUP_SIX.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol><p class="cap">${esc(SIGNUP_SIX.tail)}</p></div>
      <div class="note"><h3>${esc(BILLING_STATES.heading)}</h3><dl class="defs">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>
    </div>`, { label: 'Signing up, and if a payment fails' })}
    ${sec('pjoin', 'pjoin', `<div class="wrap">
      <div class="head">${eyebrow('Early access')}${h2('pjoin', 'Be in the first houses on it.', 'Leave an email on the front page. We write once, when it opens.')}</div>
      <div class="ctas"><a class="btn pri lg" href="/#join">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a><a class="btn lg" href="/contact">${ic('mail', 18)}Ask about pricing</a></div>
    </div>`)}`);
}

/* ── /security ─────────────────────────────────────────────────────────── */
function security(cfg, p) {
  const ev = find('evidence');
  const loop = find('loop');
  return shell(cfg, p, 'security', `
    ${phead('Security and privacy', esc(ev.heading), ev.sub)}
    ${fold('Three kinds of record', sec('holds', 'sholds', `<div class="wrap">
      <div class="head">${h2('holds', 'What it holds.', 'Three kinds of record, in the same words as the product.')}</div>
      <div class="pv-g">${cfg.privacy.holds.map(([label, text]) => `<div class="pv-c"><span class="strip-l">${esc(label)}</span><p>${esc(text)}</p></div>`).join('')}</div>
    </div>`))}
    ${sec('mechanism', 'smech', `<div class="wrap">
      <div class="head">${eyebrow('The mechanism')}${h2('mechanism', 'How the record is held up.', 'The protection is mechanism, not adjectives.')}</div>
      <div class="ev is-4">${ev.blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
      <div class="ev-cl is-3">${ev.closingBlocks.map((b) => `<div class="note"><h3>${esc(b.heading)}</h3><p>${esc(b.text)}</p></div>`).join('')}</div>
    </div>`)}
    ${fold('One incident, and what left the house', sec('left', 'sleft', `<div class="wrap">
      <div class="head">${eyebrow('What left the house')}${h2('left', 'An incident, and everything that left the house because of it.', 'Filed, notified by house code and nothing else, reviewed, signed off, locked.')}</div>
      <div class="left-ph" aria-hidden="true">${iosShell('cohort', { key: 'incident' })}</div>
      <div class="left-w">
        <span class="strip-l">The same incident, on the desktop</span>
        <div class="shell-w" data-scrollx tabindex="0" role="group" aria-label="The incident on the desktop app — scroll sideways for the rest of the screen"><div class="shell">${webShell('cohort', { key: 'incident', width: 1024 })}</div></div>
        <p class="cap left-cap"><span class="left-cap-w">Shown at true size. Drag sideways for the rest.</span><span class="left-cap-p">The app’s own narrow layout. Drag sideways for the panel beside it.</span></p>
      </div>
    </div>`))}
    ${sec('sgates', 'sgates', `<div class="wrap">
      <div class="head">${eyebrow('The two stops')}${h2('sgates', 'Exactly two actions can stop a caregiver.', loop.gateNote)}</div>
      <div class="fg2">${loop.gates.map((g, i) => `<div class="note"><span class="gate-n">${i + 1}</span><p>${esc(g)}</p></div>`).join('')}</div>
      <div class="ctas"><a class="btn pri lg" href="/privacy">${ic('shield', 18)}The privacy page, in full</a><a class="btn lg" href="/contact">${ic('mail', 18)}Ask about security</a></div>
    </div>`)}`);
}

/* ── /about ────────────────────────────────────────────────────────────── */
function about(cfg, p) {
  return shell(cfg, p, 'about', `
    ${phead('About', 'Daily operations for Oregon care homes.', p.lede)}
    ${sec('standing', 'astand', `<div class="wrap">
      <div class="head">${h2('standing', 'What Cohort is built on.', 'Three things the product holds to.')}</div>
      <ul class="proof">${p.proof.map((t) => `<li>${ic('check', 16)}<span>${esc(t)}</span></li>`).join('')}</ul>
    </div>`)}
    ${sec('company', 'acompany', `<div class="wrap company">
      <div>${h2('company', 'Made in Oregon, for Oregon houses.', 'Built with adult foster homes, for the phone their staff already carry.')}
        <p class="company-l">${esc(cfg.legalLine)}</p>
        <div class="ctas"><a class="btn pri lg" href="/contact">${ic('mail', 18)}Write to a person</a><a class="btn lg" href="${APP}">${ic('house', 18)}Sign in to your house</a></div>
      </div>
      <div class="company-by">${byline(false)}</div>
    </div>`)}
    ${sec('aask', 'aask', `<div class="wrap">${reach(cfg, p, { id: 'reach-about', subject: 'A question — Cohort' })}</div>`, { label: 'Ask a person' })}`);
}

/* ── /contact ──────────────────────────────────────────────────────────── */
function contactPage(cfg, p) {
  return shell(cfg, p, 'contact', `
    ${phead('Contact', 'Write to a person.', CONTACT.sub)}
    ${sec('write', 'cwrite', `<div class="wrap c-g">
      <div class="c-f">${contact(cfg, p, { topics: TOPICS, placeholder: 'What would you like to know? A house, a demo, a price, a worry — anything.' })}</div>
      <aside class="c-side">
        <div class="note">
          <span class="strip-l">Straight to the inbox</span>
          <p class="c-mail"><a href="${mailto(cfg)}">${esc(hello(cfg))}</a><button class="copyb" type="button" data-copy="${esc(hello(cfg))}" data-copied="Address copied — opening your mail app" aria-label="Copy the address and open your mail app">${ic('copy', 16)}</button></p>
          <p class="fine">${esc(CONTACT.fine)}</p>
        </div>
        <div class="note">
          <span class="strip-l">Cohort, elsewhere</span>
          ${social(p.id, { text: true, cls: 'stamps is-labelled', size: 18, label: 'Cohort on social' })}
        </div>
        <div class="note">
          <span class="strip-l">Already on Cohort?</span>
          <p class="c-app"><a href="${APP}">${ic('house', 16)}Sign in to your house</a></p>
          <p class="fine">An administrator at your house adds staff. If nobody has added you, write to <a href="${mailto(cfg, `I’m staff — ${p.name}`)}">${esc(hello(cfg))}</a> and we will tell you who can.</p>
        </div>
      </aside>
    </div>`, { label: 'Write to us' })}`);
}

export const pages = [
  { path: 'screens', title: 'Screens', description: 'Every screen in Cohort at the size it ships: Today, the MAR pass, an incident, the handoff and the resident record.', render: screens },
  { path: 'features', title: 'Features', description: 'Everything Cohort does: the MAR and its two stops, documentation, incidents, the handoff, tasks and plans.', render: features },
  { path: 'pricing', title: 'Pricing', description: 'One price per house: Pro at $39, Scale at $79, a three-day trial, and what happens if a payment fails.', render: pricingPage },
  { path: 'security', title: 'Security and privacy', description: 'What Cohort holds, how the record is held up, what leaves the house, and the two stops.', render: security },
  { path: 'about', title: 'About', description: 'Cohort is daily operations for Oregon care homes, made in Oregon by Providerhub Oregon.', render: about },
  { path: 'contact', title: 'Contact', description: `Write to a person at ${ADDR}. One inbox, one person reads it and answers.`, render: contactPage },
];
