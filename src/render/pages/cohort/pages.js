// The five marketing pages: features, pricing, security, about, contact.
// Each is a full body in the same chrome as the front page.

import { esc, skip, sec, h2, eyebrow, tiers, contact, CONTACT, byline, hello, mailto, social, mark } from '../../shared.js';
import { webShell } from '../../instruments.js';
import { SIGNUP_SIX, BILLING_STATES, EVERY_PLAN, TRIAL_FINE } from '../../../data/page.js';
import { MINIS, PRODUCTS } from '../../../data/brand.js';
import { ic } from '../../icons/cohort.js';
import { header, footer } from './chrome.js';
import { find, MODULES, MOVED, REMOVED, NOT_NOW, LARGER, REFUSALS, NOT_STORED, TOPICS, APP } from './data.js';

const shell = (cfg, p, page, inner) => `${skip()}
${header(cfg, p, { page })}
<main id="main" class="page face canvas is-sub" data-product="cohort" data-mode="light">
${inner}
</main>
${footer(cfg, p, { page })}`;

const phead = (eye, h1, sub, extra = '') => `<section class="phead" aria-labelledby="h1"><div class="wrap phead-in"><div>${eyebrow(eye)}<h1 id="h1">${h1}</h1>${sub ? `<p class="sub">${esc(sub)}</p>` : ''}</div>${extra}</div></section>`;

const MOD_ICON = { '01': 'gate', '02': 'house', '03': 'bed', '04': 'pill', '05': 'note', '06': 'flag', '07': 'clock', '08': 'check', '09': 'record', 10: 'wave', 11: 'info', 12: 'count', 13: 'tag', 14: 'mail', 15: 'people', 16: 'shield', '—': 'link' };
const stageKey = (s) => (/^v1/.test(s) ? 'v1' : /^v2/.test(s) ? 'v2' : 'later');

/* ── /features ─────────────────────────────────────────────────────────── */
function features(cfg, p) {
  const total = MODULES.reduce((a, [, , rows]) => a + rows.length, 0);
  const filter = `<div class="fstage" role="group" aria-label="Show features by stage">
      ${[['all', 'All'], ['v1', 'v1'], ['v2', 'v2'], ['later', 'Later']].map(([k, l], i) => `<button type="button" data-stage="${k}" aria-pressed="${i === 0}">${l}</button>`).join('')}
      <span class="fs-n" role="status" aria-live="polite">${total} of ${total}</span>
    </div>`;
  const groups = MODULES.map(([no, name, rows]) => `<div class="fmod" data-mod="${esc(no)}">
      <div class="fmod-h"><span class="fmod-no">${ic(MOD_ICON[no] || 'now', 18)}<span>${esc(no === '—' ? 'Cross-cutting' : `Module ${no}`)}</span></span><h3>${esc(no === '—' ? 'Across the product' : name)}</h3><span class="fmod-n">${rows.length}</span></div>
      <ul class="frows">${rows.map(([id, t, d, stage, tier, phi]) => `<li class="frow" data-stage="${stageKey(stage)}"><span class="frow-id">${esc(id)}</span><div class="frow-b"><b>${esc(t)}</b>${d ? `<span class="frow-d">${esc(d)}</span>` : ''}</div><span class="frow-m"><span class="tg is-stage" data-s="${stageKey(stage)}">${esc(stage)}</span>${tier !== '—' ? `<span class="tg">${esc(tier)}</span>` : ''}${phi !== '—' ? `<span class="tg">${esc(phi)}</span>` : ''}</span></li>`).join('')}</ul>
    </div>`).join('');
  const moved = (rows, verb) => `<ul class="mv-l">${rows.map(([id, t, to, why]) => `<li><span class="frow-id">${esc(id)}</span><div><b>${esc(t)}</b><span>${esc(verb)} <em>${esc(to)}</em> — ${esc(why)}</span></div></li>`).join('')}</ul>`;
  return shell(cfg, p, 'features', `
    ${phead('Features · the register', 'Everything Cohort does.', `Grouped by the product’s sixteen modules, as the feature register lists them — ${total} rows. Beside each: the stage it belongs to, the tier, and the kind of data it touches.`, filter)}
    ${sec('modules', 'fmods', `<div class="wrap"><div class="fgrid">${groups}</div><p class="fs-none" hidden>Nothing at that stage. Every module has something in v1.</p></div>`, { label: 'Features by module' })}
    ${sec('gates', 'fgates', `<div class="wrap">
      <div class="head">${eyebrow('The two stops')}${h2('gates', 'Two of those rows can stop a caregiver. The rest inform.', 'The allergy gate and the PRN interval gate — both in the MAR module, both chosen because the harm of not stopping is physical.')}</div>
      <div class="fg2">${find('loop').gates.map((g, i) => `<div class="note"><span class="gate-n">${i + 1}</span><p>${esc(g)}</p></div>`).join('')}</div>
      <p class="more"><a href="/#stops">${ic('gate', 16)}<span>See the two stops on the front page</span>${ic('right', 16)}</a></p>
    </div>`)}
    ${sec('moved', 'fmoved', `<div class="wrap fm-g">
      <div><div class="head">${eyebrow('Moved out')}${h2('moved', 'Three rows left for the room next door.', 'Products are split by domain, not activity. Their specs travel with them.')}</div>${moved(MOVED, 'Now in')}</div>
      <div><div class="head">${eyebrow('Removed')}${h2('removed', 'Three rows were cut.', 'One of them removed the product’s third hard gate, which is why the two-gate rule has its present form.')}${moved(REMOVED, 'Belongs to')}</div></div>
    </div>`)}
    ${sec('never', 'fnever', `<div class="wrap">
      <div class="head">${eyebrow('Removed and never')}${h2('never', 'Refused on principle.', 'Eleven refusals, each with the reason given for it. This is the product manifesto, and it prints on one page from the front page.')}</div>
      <ol class="ref-l">${REFUSALS.map(([t, why], i) => `<li><span class="ref-n">${String(i + 1).padStart(2, '0')}</span><div><b>${esc(t)}</b><span>${esc(why)}</span></div></li>`).join('')}</ol>
      <div class="fn-g">
        <div class="note"><h3>Belongs to a larger platform</h3><ul class="dot-l">${LARGER.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
        <div class="note"><h3>Not stored, by design</h3><p>${NOT_STORED.map(esc).join(' · ')}.</p></div>
      </div>
      <div class="notnow"><span class="strip-l">Not in this version — and what would change that</span><dl class="defs">${NOT_NOW.map(([t, c]) => `<dt>${esc(t)}</dt><dd>${esc(c)}</dd>`).join('')}</dl></div>
      <div class="ctas"><a class="btn pri lg" href="/#join">${ic('stamp', 18)}${esc(cfg.cta.primary)}</a><a class="btn lg" href="/security">${ic('shield', 18)}What it holds</a></div>
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
      <p class="fine">${esc(p.pricing.note)}</p>
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
    ${sec('holds', 'sholds', `<div class="wrap">
      <div class="head">${eyebrow('What it holds')}${h2('holds', 'Three kinds of table.', 'Written in the same words as the product. If a sentence here and a screen in the application disagree, the screen is the bug.')}</div>
      <div class="pv-g">${cfg.privacy.holds.map(([label, text]) => `<div class="pv-c"><span class="strip-l">${esc(label)}</span><p>${esc(text)}</p></div>`).join('')}</div>
    </div>`)}
    ${sec('mechanism', 'smech', `<div class="wrap">
      <div class="head">${eyebrow('The mechanism')}${h2('mechanism', 'How the record is held up.', 'The protection is mechanism, not adjectives.')}</div>
      <div class="ev">${ev.blocks.map((b) => `<div class="ev-b"><span class="strip-l">${esc(b.label)}</span>${b.quote ? `<p class="quote">${esc(b.quote)}</p>` : ''}${b.text ? `<p>${esc(b.text)}</p>` : ''}</div>`).join('')}</div>
      <div class="ev-cl">${ev.closingBlocks.map((b) => `<div class="note">${b.heading ? `<h3>${esc(b.heading)}</h3>` : '<h3>Where it lives, and the agreement</h3>'}<p>${esc(b.text)}</p></div>`).join('')}</div>
    </div>`)}
    ${sec('left', 'sleft', `<div class="wrap">
      <div class="head">${eyebrow('What left the house')}${h2('left', 'An incident, and everything that left the house because of it.', 'The desktop app, shown at true size: filed, notified with a house code and nothing else, reviewed, signed off, locked — and the email, the push and the analytics beside it.')}</div>
      <div class="shell-w" data-scrollx><div class="shell">${webShell('cohort', { key: 'incident', width: 1024 })}</div></div>
    </div>`)}
    ${sec('sgates', 'sgates', `<div class="wrap">
      <div class="head">${eyebrow('The two stops')}${h2('sgates', 'Exactly two actions may stop a caregiver.', loop.gateNote)}</div>
      <div class="fg2">${loop.gates.map((g, i) => `<div class="note"><span class="gate-n">${i + 1}</span><p>${esc(g)}</p></div>`).join('')}</div>
      <div class="ctas"><a class="btn pri lg" href="/privacy">${ic('shield', 18)}The privacy page, in full</a><a class="btn lg" href="/contact">${ic('mail', 18)}Ask about security</a></div>
    </div>`)}`);
}

/* ── /about ────────────────────────────────────────────────────────────── */
function about(cfg, p) {
  const pho = PRODUCTS[0];
  const ladder = find('ladder');
  const rooms = MINIS.map((m) => `<a class="room ${m.id === p.id ? 'is-here' : ''}" href="${m.id === p.id ? '/' : `https://${esc(m.domain)}`}" ${m.id === p.id ? 'aria-current="page"' : 'rel="noopener"'}>
      <span class="room-mk">${mark(m.id, 44, { label: false })}</span>
      <span class="room-n">${esc(m.name)}${m.id === p.id ? '<span class="room-here">This room</span>' : ''}</span>
      <span class="room-d">${esc(m.descriptor)}</span>
      <span class="room-o">${ic('house', 14)}${esc(m.owns)}</span>
      <span class="room-u">${esc(m.domain)}</span>
    </a>`).join('');
  return shell(cfg, p, 'about', `
    ${phead('About · the family', 'One house. Four rooms.', pho.lede)}
    ${sec('rooms', 'arooms', `<div class="wrap">
      <div class="rooms">${rooms}</div>
      <p class="closing">${esc(pho.toneLine)} Cohort is the room that keeps the residents’ record; the other three keep the kitchen, the paperwork and the workforce, and ${esc(pho.name)} is the house they all live in.</p>
    </div>`, { label: 'The four rooms' })}
    ${sec('standing', 'astand', `<div class="wrap">
      <div class="head">${eyebrow('Where Cohort stands')}${h2('standing', 'Not open yet, and plain about it.', p.status)}</div>
      <ul class="proof">${p.proof.map((t) => `<li>${ic('check', 16)}<span>${esc(t)}</span></li>`).join('')}</ul>
    </div>`)}
    ${sec('ladder', 'aladder', `<div class="wrap">
      <div class="head">${eyebrow('The ladder')}${h2('ladder', ladder.heading, ladder.sub)}</div>
      <dl class="defs lad">${ladder.rows.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>
      <p class="cap">${esc(ladder.footer)}</p>
      <p class="closing">${esc(ladder.closing)}</p>
    </div>`)}
    ${sec('company', 'acompany', `<div class="wrap company">
      <div>${eyebrow('The company')}${h2('company', 'Made in Oregon, for Oregon houses.', `${pho.name} — ${pho.descriptor.toLowerCase()}.`)}
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
          <p class="fine">New staff are added by an administrator, never by a sign-up page.</p>
        </div>
      </aside>
    </div>`, { label: 'Write to us' })}`);
}

export const pages = [
  { path: 'features', title: 'Features', description: 'Everything Cohort does, grouped by module: the MAR and its two gates, documentation, incidents, the handoff, tasks, plans — and what it refuses on principle.', render: features },
  { path: 'pricing', title: 'Pricing', description: 'One price per house. The three-day trial, the six signup steps, what happens if a payment fails, and how many houses each plan covers.', render: pricingPage },
  { path: 'security', title: 'Security and privacy', description: 'What Cohort holds, how the record is held up, what leaves the house, and the two stops — in the same words as the product.', render: security },
  { path: 'about', title: 'About', description: 'One house, four rooms: Cohort and its three siblings, the ladder to Provider Hub Oregon, and the company behind them.', render: about },
  { path: 'contact', title: 'Contact', description: 'Write to a person. One inbox, read by the people who build Cohort, answered from the same address.', render: contactPage },
];
