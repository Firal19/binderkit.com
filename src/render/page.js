// The page — one spine, one face. This file is a block registry and a frame:
// the sections themselves are data in ../data/page.js, the order is the SPINE
// and cannot be bent, and every colour, corner, rhythm and rule weight
// arrives through the face variables in css/faces.css. A block returns
// exactly one element and never names a colour.

import { productOf, mark, esc } from '../kit.js';
import { iosShell, webShell, weekBoard as shellWeek, paperSheet as shellPaper, SURFACES, icon } from './instruments.js';
import { PAGES, SPINE, SIGNUP_SIX, SIGNUP_FIVE, BILLING_STATES, JOIN, siblingsFor } from '../data/page.js';

/* ── the spine, enforced rather than requested ─────────────────────────── */
const slot = (k) => SPINE.indexOf(k);
const ordered = (spec) => spec.sections
  .filter((s) => slot(s.key) >= 0)
  .map((s, i) => ({ ...s, _i: i }))
  .sort((a, b) => (slot(a.key) - slot(b.key)) || (a._i - b._i));

export function spineViolations() {
  const out = [];
  for (const [id, spec] of Object.entries(PAGES)) {
    let last = -1;
    for (const s of spec.sections) {
      const at = slot(s.key);
      if (at < 0) { out.push(`${id}: “${s.key}” is not a spine slot`); continue; }
      if (at <= last) out.push(`${id}: “${s.key}” is out of spine order`);
      last = at;
    }
  }
  return out;
}

/* Every string a callout puts in curly quotes must occur in the markup of the
   instrument standing beside it. Tag boundaries normalise to the family's own
   “ · ” separator, so a three-element phrase on the sheet still matches. */
const instrumentText = (html) => html
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' · ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, '’')
  .replace(/\s*·\s*(·\s*)*/g, ' · ')
  .replace(/\s+/g, ' ');

export function calloutFaults() {
  const out = [];
  for (const [id, spec] of Object.entries(PAGES)) {
    const p = productOf(id);
    const ctx = makeCtx(p, {});
    for (const s of spec.sections) {
      if (!s.callouts || !s.instrument) continue;
      const text = instrumentText(instrument(s.instrument.desktop, p, ctx));
      for (const [on] of s.callouts) {
        for (const q of targetOf(on, id).match(/“[^”]+”/g) || []) {
          const want = q.slice(1, -1);
          if (!text.includes(want)) out.push(`${id} · ${s.id}: the callout quotes “${want}”, which the instrument beside it does not render`);
        }
      }
    }
  }
  return out;
}

/* ── the render context ──────────────────────────────────────────────────
   accent() is the budget made countable: at most three accent appearances on
   a page, all of them states, never controls. Past the budget it returns
   false and the block renders without the accent, so the budget is enforced
   by construction rather than by good intentions. */
function makeCtx(p, cfg) {
  const spec = PAGES[p.id];
  let spent = 0;
  return {
    p, spec, cfg,
    accent() { spent += 1; return spent <= spec.accentBudget; },
    spent: () => spent,
  };
}

/* ── small pieces every block shares ───────────────────────────────────── */
const chip = (text, kind = '') => `<span class="lp-chip ${kind}">${esc(text)}</span>`;
const stateChip = (key, label) => `<span class="st-a" data-state="${esc(key)}"><i aria-hidden="true"></i>${esc(label)}</span>`;
const pull = (text) => (text ? `<p class="lp-pull">${esc(text)}</p>` : '');
const caption = (text) => (text ? `<p class="lp-cap">${esc(text)}</p>` : '');
const closing = (text) => (text ? `<p class="lp-closing">${esc(text)}</p>` : '');
const mono = (text) => `<span class="lp-mono">${esc(text)}</span>`;

function head(s) {
  if (!s.heading && !s.sub) return '';
  return `<div class="lp-head">${s.heading ? `<h2 id="h-${esc(s.id)}">${esc(s.heading)}</h2>` : ''}${s.sub ? `<p class="lp-sub">${esc(s.sub)}</p>` : ''}</div>`;
}

function sec(s, ctx, inner) {
  const ctl = ctx.spec.control ? `<div class="lp-ctl">${esc(ctx.spec.control)}-${String(s._n).padStart(2, '0')}</div>` : '';
  const labelled = s.heading ? ` aria-labelledby="h-${esc(s.id)}"` : ` aria-label="${esc(s.id)}"`;
  return `<section class="lp-sec lp-${esc(s.key)}" id="${esc(s.id)}" data-kind="${esc(s.kind)}"${labelled} data-reveal>${head(s)}${inner}${ctl}</section>`;
}

/* ── the hero instruments ────────────────────────────────────────────────
   Three different instruments is what makes three thumbnails tell each other
   apart: Cohort a phone with full device chrome, Binderkit a printed sheet at
   paper aspect with no device chrome at all, Aidepost the wide week board as
   a bare surface. */
function paperHero() {
  const s = SURFACES.binderkit;
  return `<div class="lp-sheet"><div class="paper is-desk">
    <div class="paper-title">${esc(s.paperTitle)}</div>
    <div class="paper-head"><span>Facility ______</span><span>Resident ______</span></div>
    ${s.rows.map(([n, item, auth, ev]) => `<div class="paper-row"><span class="paper-n">${esc(n)}</span><span class="paper-item">${esc(item)}</span><span class="paper-auth">${esc(auth)}${ev ? `<span class="tg ${ev === 'derived' ? 'is-accent' : ''}">${esc(ev)}</span>` : ''}</span></div>`).join('')}
    <div class="paper-foot"><span>${esc(s.control)}</span><span>by Provider Hub Oregon</span></div>
  </div></div>`;
}

function weekHero() {
  const s = SURFACES.aidepost;
  return `<div class="lp-board"><div class="lp-board-in" tabindex="0" role="group" aria-label="This week’s shift board — scroll sideways for the rest of the week">
    <table class="tbl-a"><caption class="sr-only">Shift coverage for the week, by house</caption><thead><tr><th><span class="sr-only">House</span></th>${s.week.days.map((d) => `<th scope="col">${esc(d)}</th>`).join('')}</tr></thead><tbody>
    ${s.week.rows.map(([name, cells]) => `<tr><th scope="row">${esc(name)}</th>${cells.map((c, i) => `<td><span class="cell-a ${c ? 'is-covered' : 'is-open'}">${c ? (i % 2 ? 'J. Ruiz' : 'M. Okafor') : 'Open'}</span></td>`).join('')}</tr>`).join('')}
    </tbody></table>
  </div><p class="lp-board-c">${esc(s.detail[0])} · ${esc(s.detail[1])} — ${esc(s.detail[2])}</p></div>`;
}

/* A desktop shell is shown at TRUE SIZE and panned on a narrow viewport,
   never shrunk to fit: a 1280 canvas scaled into 390 renders its body text at
   three pixels, which is the defect this exists to remove. */
function panned(inner) {
  return `<div class="lp-pan"><div class="lp-scrollx" tabindex="0" role="group" aria-label="The desktop screen, at true size — scroll sideways for the rest">${inner}</div>
    <p class="lp-cap lp-pan-c">Shown at true size. Drag sideways for the rest — it is not shrunk to fit, because a shrunk screen cannot be read.</p></div>`;
}

function instrument(which, p, ctx) {
  if (which === 'web') return panned(webShell(p.id, { mode: 'light' }));
  if (which === 'ios') return iosShell(p.id, { mode: 'light' });
  if (which === 'ios-dark') return iosShell(p.id, { mode: 'dark' });
  // CareShop's hero is a phone held at the shelf: cropped wide to the buy
  // queue rows, so a row is legible rather than a phone being admired.
  if (which === 'crop') return `<div class="lp-crop">${iosShell(p.id, { mode: 'light' })}</div>`;
  if (which === 'paper') return paperHero();
  if (which === 'week') return weekHero();
  return iosShell(p.id, { mode: 'light' });
}

/* ── 1 · hero ──────────────────────────────────────────────────────────── */
function stripOf(st) {
  return `<div class="lp-strip is-${esc(st.kind || 'mono')}">
    ${st.label ? `<span class="lp-strip-l">${esc(st.label)}</span>` : ''}
    <div class="lp-strip-c">${st.cells.map((c) => `<span>${esc(c)}</span>`).join('')}</div>
    ${st.foot ? `<p class="lp-strip-f">${esc(st.foot)}</p>` : ''}
  </div>`;
}

const hero = (s, ctx) => {
  const { p, cfg } = ctx;
  ctx.accent();                                // the one live state in the instrument
  const lede = s.descriptorInline ? `<b>${esc(p.descriptor)}.</b> ${esc(p.lede)}` : esc(p.lede);
  return `<section class="lp-hero ${s.wide ? 'is-wide' : ''}" id="${esc(s.id)}" aria-labelledby="h1">
    <div class="lp-hero-t">
      <span class="lp-eyebrow">${esc(s.eyebrow || p.descriptor)}</span>
      <h1 id="h1">${esc(p.headline.text)}</h1>
      <p class="lp-lede">${lede}</p>
      <div class="lp-ctas">
        <a class="lp-btn pri" href="${esc(cfg.cta.primaryHref || '#join')}" data-cta="hero">${esc(cfg.cta.primary)}</a>
        <a class="lp-btn" href="${esc(cfg.cta.secondaryHref)}">${esc(cfg.cta.secondary)}</a>
      </div>
      <p class="lp-fine">${esc(s.fine)}</p>
      ${s.strip ? stripOf(s.strip) : ''}
    </div>
    <div class="lp-hero-v"${s.live ? ` data-live="${esc(s.live)}"` : ''}>${instrument(s.instrument.desktop, p, ctx)}</div>
  </section>`;
};

/* ── 2 · the three reasons ─────────────────────────────────────────────── */
const proof = (s, ctx) => `<section class="lp-sec lp-proof" id="${esc(s.id)}" data-kind="proof" aria-label="Why this one" data-reveal>
  <ul class="lp-proofs">${s.items.map(([t, d]) => `<li><b>${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul>
</section>`;

/* ── 3 · one screen, annotated ───────────────────────────────────────────
   A callout target is prose, or a function of the product's own surfaces
   entry. The function form is the one to reach for whenever the callout
   quotes the screen: the quoted string is then READ from the instrument
   rather than typed a second time beside it, so the two cannot drift. */
const targetOf = (on, productId) => (typeof on === 'function' ? on(SURFACES[productId]) : on);

const callouts = (s, ctx) => `<ol class="lp-annot">${s.callouts.map(([on, text], i) => `<li data-annot="${i + 1}">
    <span class="lp-annot-n" aria-hidden="true"></span>
    <span class="lp-annot-b"><b>${esc(targetOf(on, ctx.p.id))}</b> — ${esc(text)}</span>
  </li>`).join('')}</ol>`;

const screen = (s, ctx) => sec(s, ctx, `
  <div class="lp-screen-g ${s.split ? 'is-split' : ''}">
    <div class="lp-screen-v">${instrument(s.instrument.desktop, ctx.p, ctx)}</div>
    <div class="lp-screen-a">${callouts(s, ctx)}${s.side ? `<div class="lp-side"><span class="lp-side-l">${esc(s.side.label)}</span><p>${esc(s.side.text)}</p></div>` : ''}</div>
  </div>
  ${caption(s.caption)}
  ${s.figure ? figureOf(s.figure) : ''}
  ${s.strip ? stripOf(s.strip) : ''}`);

const figureOf = (f) => `<div class="lp-fig">
  <span class="lp-fig-l lp-strip-l">${esc(f.heading)}</span>
  <div class="lp-fig-g"><s class="lp-fig-x">${esc(f.rejected)}</s><span class="lp-fig-k">${esc(f.kept)}</span></div>
  ${caption(f.caption)}
</div>`;

/* ── 4 · the mechanism, drawn ────────────────────────────────────────────
   One glyph per product, taken from that product's own mark geometry: the
   five-dot rhythm, the tab notch, the seven-cell week. The spine between
   nodes is CSS, so the same markup rotates from a row to a column on a phone
   instead of being a squeezed picture. */
const GLYPH = {
  dots: (on) => `<svg viewBox="0 0 24 24" aria-hidden="true">${[0, 1, 2, 3, 4].map((i) => `<circle cx="${4 + i * 4}" cy="12" r="${i === 4 ? 2.6 : 2}" fill="${on && i === 4 ? 'var(--t-accent)' : 'currentColor'}"/>`).join('')}</svg>`,
  arc: () => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9a9 9 0 0 0 18 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 9h18" stroke="currentColor" stroke-width="1.4"/></svg>',
  tabs: () => '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v16" stroke="currentColor" stroke-width="2"/><path d="M4 8h12v6H4" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  week: () => `<svg viewBox="0 0 24 24" aria-hidden="true">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="${1.5 + i * 3.1}" y="9" width="2.2" height="6" rx="0.7" fill="currentColor"/>`).join('')}</svg>`,
};

const loop = (s, ctx) => {
  const g = GLYPH[s.device] || GLYPH.dots;
  const granted = s.nodes.some((n) => n.accent) ? ctx.accent() : false;
  const first = s.nodes.findIndex((n) => n.accent);
  const nodes = s.nodes.map((n, i) => {
    const hot = Boolean(n.accent && granted && i === first);
    return `<li class="lp-node ${hot ? 'is-accent' : ''} ${n.accent && !hot ? 'is-gate' : ''}">
      <span class="lp-node-g">${g(hot)}</span>
      <span class="lp-node-n">${mono(String(i))}</span>
      <span class="lp-node-t">${esc(n.label)}</span>
      ${n.note ? `<span class="lp-node-d">${esc(n.note)}</span>` : ''}
      ${n.states ? `<span class="lp-node-s">${n.states.map(([k, l]) => stateChip(k, l)).join('')}</span>` : ''}
      ${s.quote && s.quote.at === i ? `<span class="lp-quote">${esc(s.quote.text)}</span>` : ''}
    </li>`;
  }).join('');
  const gates = s.gates ? `<div class="lp-gates">${s.gates.map((t) => `<div class="lp-gate">${esc(t)}</div>`).join('')}${s.gateNote ? `<p class="lp-gate-n">${esc(s.gateNote)}</p>` : ''}</div>` : '';
  const machines = s.machines ? `<div class="lp-machines">${s.machines.map(([n, seq]) => `<div class="lp-machine"><b>${esc(n)}</b><span>${esc(seq)}</span></div>`).join('')}</div>` : '';
  return sec(s, ctx, `<ol class="lp-flow is-${esc(s.device)}">${nodes}</ol>${gates}${pull(s.pull)}${closing(s.closing)}${machines}`);
};

/* ── 5 · depth, as a table ───────────────────────────────────────────────
   One DOM at every width. Each cell carries the column it answers to, and
   below 720px the stylesheet turns the rows into cards that read that label
   instead of a header row three screens up. */
const table = (s, ctx) => {
  const body = s.rows.map((r) => `<tr>${r.map((v, i) => (i === 0
    ? `<th scope="row" data-col="${esc(s.cols[i])}">${cell(v, i, s)}</th>`
    : `<td data-col="${esc(s.cols[i])}">${cell(v, i, s)}</td>`)).join('')}</tr>`).join('');
  const struck = s.struck ? `<div class="lp-struck"><span class="lp-strip-l">${esc(s.struck.heading)}</span><div class="lp-struck-w">${s.struck.words.map((w) => `<s>${esc(w)}</s>`).join('')}</div><p class="lp-cap">${esc(s.struck.foot)}</p></div>` : '';
  return sec(s, ctx, `<div class="lp-tblw"><table class="lp-tbl">
    <thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${body}</tbody>
  </table></div>${pull(s.pull)}${struck}${closing(s.closing)}`);
};

const cell = (v, i, s) => ((s.mono || []).includes(i) ? mono(v) : esc(v));

/* ── 6 · the boundary, as a section rather than a grey box ─────────────── */
const boundary = (s, ctx) => sec(s, ctx, `<div class="lp-bnd" data-cols="${s.cols.length}">${s.cols.map((c) => `<div class="lp-bnd-c is-${esc(c.kind)}">
    <span class="lp-strip-l">${esc(c.label)}</span>
    <ul class="lp-list">${c.items.map(([text, to, note]) => (to
      ? `<li><a class="lp-next" href="https://${esc(productOf(to).domain)}" rel="noopener"><span class="lp-next-m face" data-product="${esc(to)}">${mark(to, 18, { label: false })}</span><span class="lp-next-t">${esc(text)}<i class="lp-next-d face" data-product="${esc(to)}" style="--src: var(--t-accent)" aria-hidden="true"></i>${note ? `<em>${esc(note)}</em>` : `<em>${esc(productOf(to).name)} · ${esc(productOf(to).domain)}</em>`}</span><span class="lp-next-c" aria-hidden="true">${icon('chevron', 16)}</span></a></li>`
      : `<li>${esc(text)}</li>`)).join('')}</ul>
  </div>`).join('')}</div>
  ${s.strip ? stripOf(s.strip) : ''}
  ${pull(s.pull)}`);

/* ── 7 · how the record is kept ────────────────────────────────────────── */
const evidence = (s, ctx) => {
  const blocks = s.blocks ? `<div class="lp-ev">${s.blocks.map((b) => `<div class="lp-ev-b ${b.wide ? 'is-wide' : ''}">
      <span class="lp-strip-l">${esc(b.label)}</span>
      ${b.quote ? `<p class="lp-quote">${esc(b.quote)}</p>` : ''}
      ${b.text ? `<p>${esc(b.text)}</p>` : ''}
    </div>`).join('')}</div>` : '';
  const cl = s.closingBlocks ? `<div class="lp-ev-cl">${s.closingBlocks.map((b) => `<div class="lp-note">${b.heading ? `<h3>${esc(b.heading)}</h3>` : ''}<p>${esc(b.text)}</p></div>`).join('')}</div>` : '';
  return sec(s, ctx, `${blocks}${cl}`);
};

/* ── the caregiver side — the one structural insert in the family ─────── */
const caregiver = (s, ctx) => `<section class="lp-sec lp-caregiver face canvas" id="${esc(s.id)}" data-kind="caregiver" data-product="${esc(ctx.p.id)}" data-mode="dark" aria-labelledby="h-${esc(s.id)}" data-reveal>
  <div class="lp-care-g">
    <div class="lp-care-t">
      <h2 id="h-${esc(s.id)}">${esc(s.heading)}</h2>
      <p class="lp-sub">${esc(s.sub)}</p>
      <ul class="lp-list">${s.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
      <p class="lp-promise">${esc(s.promise)}</p>
      <div class="lp-ctas">${s.ctas.map(([label, href], i) => `<a class="lp-btn ${i === 0 ? 'pri' : ''}" href="${esc(href)}" data-cta="caregiver">${esc(label)}</a>`).join('')}</div>
      <p class="lp-fine">${esc(s.fine)}</p>
      <p class="lp-mono-f">${esc(s.mono)}</p>
    </div>
    <div class="lp-care-v">${iosShell(ctx.p.id, { mode: 'dark' })}</div>
  </div>
</section>`;

/* ── 8 · roles: who, what they do, device AND rhythm ───────────────────── */
const roles = (s, ctx) => {
  const perms = s.perms ? `<div class="lp-perms ${s.leaders ? 'is-leaders' : ''}">${s.perms.map(([k, v]) => `<div class="lp-perm"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join('')}</div>` : '';
  const body = `<div class="lp-tblw"><table class="lp-tbl lp-roles-t">
    <thead><tr>${s.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
    <tbody>${s.rows.map((r) => `<tr class="${r[4] ? 'is-wash' : ''}"><th scope="row" data-col="${esc(s.cols[0])}">${mono(r[0])}</th><td data-col="${esc(s.cols[1])}">${esc(r[1])}</td><td data-col="${esc(s.cols[2])}">${esc(r[2])}</td><td class="lp-dev" data-col="${esc(s.cols[3])}">${esc(r[3])}</td></tr>`).join('')}</tbody>
  </table></div>`;
  return sec(s, ctx, `${body}${perms}${closing(s.closing)}`);
};

/* ── 9 · the questions we get ──────────────────────────────────────────── */
const qa = (s, ctx) => sec(s, ctx, `<div class="lp-qa">${s.rows.map(([q, a], i) => `<details class="lp-qa-r" ${i === 0 ? 'open' : ''}>
  <summary><h3>${esc(q)}</h3><span class="lp-qa-i" aria-hidden="true"></span></summary>
  <div class="lp-qa-a"><p>${esc(a)}</p></div>
</details>`).join('')}</div>`);

/* ── 10 · the first ten minutes, and the Family Standard ───────────────── */
function signupBlock(s) {
  const sg = s.signup === 'five' ? SIGNUP_FIVE : SIGNUP_SIX;
  return `<div class="lp-note"><h3>${esc(s.signupHeading || sg.heading)}</h3>
    <ol class="lp-arrow">${sg.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>
    <p class="lp-cap">${esc(sg.tail)}</p></div>`;
}
const billingBlock = () => `<div class="lp-note"><h3>${esc(BILLING_STATES.heading)}</h3>
  <dl class="lp-defs-in">${BILLING_STATES.rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl></div>`;

const stepList = (list) => `<ol class="lp-steps">${list.map((t, i) => `<li><span class="lp-n">${i + 1}</span><span>${esc(t)}</span></li>`).join('')}</ol>`;

const start = (s, ctx) => {
  const top = s.columns
    ? `<div class="lp-two">${s.columns.map((c) => `<div class="lp-two-c ${c.wash ? 'is-wash' : ''}"><span class="lp-strip-l">${esc(c.label)}</span>${stepList(c.steps)}${c.foot ? `<p class="lp-cap">${esc(c.foot)}</p>` : ''}</div>`).join('')}</div>`
    : stepList(s.steps);
  return sec(s, ctx, `${top}<div class="lp-subs">${signupBlock(s)}${billingBlock()}</div>`);
};

/* ── 11 · the waitlist — the one control on the page that does something ─ */
const join = (s, ctx) => {
  const { p } = ctx;
  const opt = (v) => `<option value="${esc(v)}">${esc(v)}</option>`;
  return `<section class="lp-sec lp-join" id="${esc(s.id)}" data-kind="join" aria-labelledby="h-join" data-reveal>
    <div class="lp-join-g">
      <div class="lp-join-t">
        <span class="lp-eyebrow">${esc(JOIN.eyebrow)}</span>
        <h2 id="h-join">${esc(JOIN.heading)}</h2>
        <p class="lp-sub">${esc(JOIN.sub)}</p>
        <p class="lp-fine">${esc(JOIN.fine)}</p>
      </div>
      <form class="lp-form" id="joinform" method="post" action="/api/waitlist" novalidate>
        <input type="hidden" name="product" value="${esc(p.id)}">
        <label class="lp-field is-wide">
          <span>${esc(JOIN.fields.email)}</span>
          <input type="email" name="email" required autocomplete="email" inputmode="email" placeholder="you@yourhouse.com" spellcheck="false">
        </label>
        <label class="lp-field">
          <span>${esc(JOIN.fields.track)}</span>
          <select name="track">${JOIN.tracks.map(opt).join('')}</select>
        </label>
        <label class="lp-field">
          <span>${esc(JOIN.fields.houses)}</span>
          <select name="houses">${[...JOIN.houseOptions, ...(ctx.cfg.joinHouses || [])].map(opt).join('')}</select>
        </label>
        <p class="lp-hp" aria-hidden="true"><label>Leave this empty<input type="text" name="company" tabindex="-1" autocomplete="off"></label></p>
        <button class="lp-btn pri" type="submit">${esc(JOIN.button)}</button>
        <p class="lp-form-msg" role="status" aria-live="polite"></p>
      </form>
    </div>
  </section>`;
};

/* ── 12 · pricing, from the vault and nowhere else ─────────────────────── */
const tiers = (s, ctx) => {
  // A tier whose number is not set yet says so in a smaller voice, and says
  // the true thing: "Early access" in the price slot reads as a plan you can
  // buy, not as a price that does not exist. Two display-size lines side by
  // side would also read as a placeholder, hence .is-soon.
  const rows = ctx.p.pricing.rows.map(([n, price, d]) => [n, /^Open/.test(price) ? 'Not priced yet' : price, d, /^Open/.test(price)]);
  const notes = s.notes ? `<div class="lp-subs">${s.notes.map((n) => `<div class="lp-note"><h3>${esc(n.heading)}</h3><p>${esc(n.text)}</p></div>`).join('')}</div>` : '';
  return sec(s, ctx, `<div class="lp-tiers">${rows.map(([name, price, d, soon], i) => `<div class="lp-tier ${i === s.main ? 'is-main' : ''}">
      <span class="lp-tier-n">${esc(name)}</span>
      <span class="lp-tier-p ${soon ? 'is-soon' : ''}">${esc(price)}</span>
      <span class="lp-tier-d">${esc(d)}</span>
    </div>`).join('')}</div>${s.note ? `<p class="lp-fine">${esc(s.note)}</p>` : ''}${notes}
    <div class="lp-ctas"><a class="lp-btn pri" href="${esc(ctx.cfg.cta.primaryHref || '#join')}" data-cta="pricing">${esc(ctx.cfg.cta.primary)}</a></div>`);
};

/* ── 13 · the ladder ───────────────────────────────────────────────────── */
const map = (s, ctx) => sec(s, ctx, `<div class="lp-map ${s.leaders ? 'is-leaders' : ''}">${s.rows.map(([from, to]) => `<div class="lp-map-r"><span class="lp-map-a">${esc(from)}</span><span class="lp-map-x" aria-hidden="true">→</span><span class="lp-map-b">${mono(to)}</span></div>`).join('')}</div>
  ${s.footer ? `<p class="lp-cap">${esc(s.footer)}</p>` : ''}${pull(s.pull)}${closing(s.closing)}`);

/* ── 14 · the family band, and the foot ────────────────────────────────── */
const band = (s, ctx) => {
  const { p } = ctx;
  const sibs = siblingsFor(p.id);
  const text = s.text || `${p.name} is one room of the house. The others are whole on their own too — and all four grow into Provider Hub Oregon Enterprise when you need the whole house.`;
  return `<section class="lp-sec lp-family ${s.second ? 'is-second' : ''}" id="${esc(s.id)}" data-kind="band" aria-labelledby="h-family" data-reveal>
    <div class="lp-family-t">
      <span class="lp-motif" aria-hidden="true"></span>
      <span class="lp-byline">${esc(s.byline)}</span>
      <h2 id="h-family">${esc(s.heading)}</h2>
      <p>${esc(text)}</p>
    </div>
    <div class="lp-sibs">${sibs.map((m) => `<a class="lp-sib face" data-product="${m.id}" href="https://${esc(m.domain)}" rel="noopener">${mark(m.id, 22, { label: false })}<b>${esc(m.name)}</b><span>${esc(m.id === 'pho' ? 'The whole house' : m.descriptor)}</span></a>`).join('')}</div>
  </section>`;
};

const foot = (s, ctx) => {
  const { p, cfg } = ctx;
  return `<footer class="lp-foot" id="foot">
    <div class="lp-foot-t">
      <div class="lp-foot-l">${mark(p.id, 22, { label: false })}<span>${esc(p.name)}</span><span class="lp-foot-by">${esc(s.by)}</span></div>
      <nav class="lp-foot-r" aria-label="Footer">
        <a href="${esc(cfg.cta.primaryHref || '#join')}">${esc(cfg.cta.nav)}</a>
        <a href="/privacy">Privacy</a>
        <a href="https://providerhub.us" rel="noopener">Provider Hub Oregon</a>
      </nav>
    </div>
    <p class="lp-foot-d">${esc(s.disclaimer)} ${esc(cfg.legalLine)}</p>
    ${ctx.spec.control ? `<div class="lp-ctl">${esc(ctx.spec.control)}-${String(s._n).padStart(2, '0')}</div>` : ''}
  </footer>`;
};

/* ── the registry ──────────────────────────────────────────────────────── */
const BLOCKS = { hero, proof, screen, loop, table, boundary, evidence, caregiver, roles, qa, start, join, tiers, map, band, foot };

/* ── nav ─────────────────────────────────────────────────────────────────
   A real header: it sticks, it says where you are, and on a phone it opens a
   panel rather than pretending three links fit beside a wordmark. */
const ICO = (body) => `<svg class="ic-x" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const MOON = ICO('<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>').replace('ic-x', 'ic-x ic-moon');
const SUN = ICO('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M5.2 18.8l1.4-1.4M17.4 6.6l1.4-1.4"/>').replace('ic-x', 'ic-x ic-sun');

function nav(p, cfg) {
  const links = cfg.nav.map((l) => `<a href="#${esc(l.id)}">${esc(l.label)}</a>`).join('');
  return `<header class="lp-top" id="top-bar">
    <div class="lp-nav">
      <a class="lp-brand" href="/" aria-label="${esc(p.name)} — home">${mark(p.id, 26, { label: false })}<span class="lp-brand-n">${esc(p.name)}</span></a>
      <nav class="lp-links" aria-label="Sections">${links}</nav>
      <div class="lp-nav-r">
        ${cfg.signIn ? `<a class="lp-signin" href="${esc(cfg.signIn.href)}">${esc(cfg.signIn.label)}</a>` : ''}
        <button class="lp-mode" type="button" aria-pressed="false" aria-label="Switch to dark">${MOON}${SUN}</button>
        <a class="lp-btn pri sm" href="${esc(cfg.cta.primaryHref || '#join')}" data-cta="nav">${esc(cfg.cta.nav)}</a>
        <button class="lp-burger" type="button" aria-expanded="false" aria-controls="lp-menu" aria-label="Open menu">${icon('menu', 22)}</button>
      </div>
    </div>
    <div class="lp-progress" aria-hidden="true"><i></i></div>
    <div class="lp-menu" id="lp-menu" hidden>
      <nav aria-label="Sections, mobile">${links}${cfg.signIn ? `<a href="${esc(cfg.signIn.href)}">${esc(cfg.signIn.label)}</a>` : ''}</nav>
      <a class="lp-btn pri" href="${esc(cfg.cta.primaryHref || '#join')}" data-cta="menu">${esc(cfg.cta.primary)}</a>
    </div>
  </header>`;
}

export function renderPage(productId, cfg) {
  const p = productOf(productId);
  const spec = PAGES[p.id];
  const ctx = makeCtx(p, cfg);
  const body = ordered(spec)
    .map((s, i) => (BLOCKS[s.kind] || BLOCKS.table)({ ...s, _n: i + 1 }, ctx))
    .join('\n');
  return `<a class="lp-skip" href="#main">Skip to content</a>
${nav(p, cfg)}
<main class="lp face canvas" id="main" data-product="${p.id}" data-mode="light">
${body}
</main>`;
}

export { PAGES, ordered };
