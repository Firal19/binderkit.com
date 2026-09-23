/* binderkit.com — the binder's own behaviour. Everything below upgrades
   something that already reads without it: the tabs are anchors, the sheet
   is printed markup, the planner's demonstration is rendered at build. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const PHO = window.PHO || {};
  const calm = PHO.calm || window.matchMedia('(prefers-reduced-motion: reduce)');
  const toast = PHO.toast || (() => {});
  const phone = () => window.matchMedia('(max-width: 900px)').matches;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const scrollTo = (t) => { t.scrollIntoView({ behavior: calm.matches ? 'auto' : 'smooth', block: 'start' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); if (t.id) history.replaceState(null, '', `#${t.id}`); };

  /* ── the running control number, and the page number on a phone ────── */
  const run = () => {
    const el = $('#run-ctl'); const secs = $$('[data-ctl]'); const pn = $('[data-page-n]'); const pt = $('[data-page-total]');
    const nm = $('[data-page-name]');
    if (!el && !pn) return;
    if (pt) pt.textContent = String(secs.length || 1);
    let t = false;
    const paint = () => {
      t = false;
      const line = window.scrollY + window.innerHeight * 0.32;
      let on = secs[0] || null; let i = 0;
      secs.forEach((s, k) => { if (s.offsetTop <= line) { on = s; i = k; } });
      if (el && on) el.textContent = on.dataset.ctl;
      if (pn) pn.textContent = `p. ${i + 1}`;
      /* the foot bar says WHERE, not just how far: a page number on a
         seven-thousand-pixel phone page is a progress bar, and a name is a
         location. Both, on one line, under the thumb. */
      if (nm && on && on.dataset.name) nm.textContent = on.dataset.name;
    };
    window.addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(paint); } }, { passive: true });
    window.addEventListener('resize', paint, { passive: true });
    paint();
  };

  /* ── the index tabs: the strip follows the current tab; ← → move ───── */
  const tabs = () => {
    const nav = $('.tabs[data-spy]'); if (!nav) return [];
    const list = $('.tabs-l', nav); const links = $$('a.dtab[href^="#"]', nav);
    const follow = () => {
      const cur = $('a.dtab[aria-current="true"]', nav); if (!cur || !phone()) return;
      const r = cur.getBoundingClientRect(); const lr = list.getBoundingClientRect();
      if (r.left < lr.left + 8 || r.right > lr.right - 8) list.scrollTo({ left: list.scrollLeft + r.left - lr.left - 16, behavior: calm.matches ? 'auto' : 'smooth' });
    };
    const mo = new MutationObserver(follow);
    links.forEach((a) => mo.observe(a, { attributes: true, attributeFilter: ['aria-current'] }));
    follow();
    return links;
  };
  const idxOf = (links) => links.findIndex((a) => a.hasAttribute('aria-current'));

  /* ── the dialogs: the lens, the keys card, the palette ──────────────── */
  const lens = () => {
    const d = $('#lens'); if (!d || !d.showModal) return;
    const host = $('[data-lens-sheet]', d);
    const open = (ruler) => {
      const src = $('[data-print-sheet]') || $('[data-sheet]'); if (!src) return;
      host.innerHTML = '';
      const c = src.cloneNode(true);
      c.removeAttribute('data-sheet'); c.removeAttribute('data-print-sheet'); c.removeAttribute('role'); c.removeAttribute('aria-label');
      c.classList.remove('is-hero', 'is-page'); c.classList.add('is-true');
      host.appendChild(c);
      d.toggleAttribute('data-ruler', Boolean(ruler));
      d.showModal();
      $('.lens-scroll', d).scrollTo(0, 0);
    };
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lens]');
      if (b) { e.preventDefault(); open(b.hasAttribute('data-ruler')); return; }
      if (e.target.closest('[data-lens-close]') || e.target === d) { d.close(); return; }
      const s = e.target.closest('.cp.is-hero, .cp.is-page');
      if (s && phone() && !e.target.closest('a, button')) open(false);
    });
  };
  const keysCard = () => {
    const k = $('#keys'); if (!k || !k.showModal) return null;
    k.addEventListener('click', (e) => { if (e.target.closest('[data-keys-close]') || e.target === k) k.close(); });
    return () => { if (!k.open) k.showModal(); };
  };
  const palette = () => {
    const d = $('#palette'); if (!d || !d.showModal) return null;
    const q = $('[data-pal-q]', d); const rows = $$('.cmd-r', d);
    const vis = () => rows.filter((r) => !r.parentElement.hidden);
    const cur = () => vis().findIndex((r) => r.getAttribute('aria-current') === 'true');
    const mark = (i) => { const v = vis(); v.forEach((r) => r.removeAttribute('aria-current')); if (v[i]) { v[i].setAttribute('aria-current', 'true'); v[i].scrollIntoView({ block: 'nearest' }); } };
    const filter = () => { const s = q.value.trim().toLowerCase(); rows.forEach((r) => { r.parentElement.hidden = Boolean(s) && !r.textContent.toLowerCase().includes(s); }); mark(0); };
    const run = (verb) => {
      d.close();
      if (verb === 'replan') { const f = $('#planner'); if (f) { scrollTo(f.closest('.sec') || f); const i = $('input[name="track"]:checked', f) || $('select', f); if (i) i.focus({ preventScroll: true }); } else location.href = '/plan#answers'; return; }
      if (verb === 'print') { window.print(); return; }
      if (verb === 'note') { location.href = '/contact'; return; }
      if (verb === 'compare') { const v = $('#versions'); if (v) { scrollTo(v); const b = $('.vtog [data-v="2"]'); if (b) b.click(); } else location.href = '/#versions'; return; }
      if (verb === 'lamp') { const b = $('[data-mode-toggle]'); if (b) b.click(); return; }
      if (verb === 'share') { const b = $('[data-share]'); if (b) b.click(); return; }
      if (verb.startsWith('go:')) { const t = document.getElementById(verb.slice(3)); if (t) scrollTo(t); return; }
      if (verb.startsWith('chapter:')) { location.href = verb.slice(8); return; }
      /* every section of every other chapter, by name or by control
         number — the palette is this binder's index finger. */
      if (verb.startsWith('open:')) location.href = verb.slice(5);
    };
    q.addEventListener('input', filter);
    d.addEventListener('click', (e) => { const b = e.target.closest('.cmd-r'); if (b) run(b.dataset.verb); else if (e.target === d) d.close(); });
    $('[data-pal]', d).addEventListener('submit', (e) => { e.preventDefault(); const v = vis(); const i = Math.max(0, cur()); if (v[i]) run(v[i].dataset.verb); });
    d.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); mark(Math.min(vis().length - 1, cur() + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); mark(Math.max(0, cur() - 1)); }
    });
    return () => { if (d.open) return; q.value = ''; filter(); d.showModal(); q.focus(); };
  };

  /* ── keys: ← → between tabs, p prints, l lamps, ? the card, ⌘K ─────── */
  const keys = (links, openKeys, openPal) => {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); if (openPal) openPal(); return; }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && t.matches && t.matches('input, select, textarea, [contenteditable="true"]')) return;
      if ($('dialog[open]')) return;
      /* The film strip and the screen switcher own the arrow keys while
         they hold focus. site.js demos() binds them on the SAME document
         and calls preventDefault() but not stopPropagation(), so without
         this guard one ArrowRight both advanced the strip and chapter-
         navigated the page — which moved focus off the rail, so every
         press after the first scrolled the page and the strip was
         unreachable. The two selectors are exactly the two demos() acts
         on, so the rail keeps the keys it implements and a link inside a
         plate caption keeps the ones it is entitled to. */
      if (t && t.matches && t.matches('[data-rail], [role="tab"]')) return;
      if (e.key === 'ArrowRight' && links.length) { e.preventDefault(); const a = links[Math.min(links.length - 1, idxOf(links) + 1)]; if (a) a.click(); }
      else if (e.key === 'ArrowLeft' && links.length) { e.preventDefault(); const i = idxOf(links); if (i > 0) links[i - 1].click(); else window.scrollTo({ top: 0, behavior: calm.matches ? 'auto' : 'smooth' }); }
      else if (e.key === 'p') { e.preventDefault(); window.print(); }
      else if (e.key === '?') { e.preventDefault(); if (openKeys) openKeys(); }
      else if (e.key === 'l') { const b = $('[data-mode-toggle]'); if (b) b.click(); }
    });
  };

  /* ── the planner: five answers in, the plan and the sheet out ───────── */
  let planTwice = null;
  const planner = () => {
    const form = $('#planner'); const out = $('#plan-out'); const dataEl = $('#bk-plan-data');
    if (!form || !out || !dataEl) return;
    const D = JSON.parse(dataEl.textContent);
    /* the same rule as render/pages/binderkit/chrome.js, character for character */
    function computePlan(D, a) {
      const track = D.tracks.find((t) => t.id === a.track) || D.tracks[0];
      const B = D.binders;
      const same = Object.keys(D.demo).every((k) => D.demo[k] === a[k]);
      const out = { track: track.id, ok: Boolean(track.ok), notice: track.notice || '', same, binders: [], left: [], skipped: [], rows: D.rows.slice(), counts: null, version: same ? D.versions.v1 : D.versions.v2 };
      if (!track.ok) return out;
      const skip = (k) => a[k] === 'skip';
      const staffQ1 = a.q1 === 'yes' || skip('q1');
      const staffQ2 = a.q2 === 'no';
      const residents = skip('q3') ? 5 : Math.max(1, Math.min(5, Number(a.q3) || 5));
      const oneToOne = a.q4 === 'yes' || skip('q4');
      const policy = a.q5 === 'provider' || skip('q5');
      const rTabs = B.resident.tabs + (oneToOne ? 1 : 0);
      if (oneToOne) out.rows = out.rows.concat([D.extra]);
      out.binders.push({ key: 'resident', name: B.resident.name, copies: residents, tabs: rTabs, auth: B.resident.auth, code: B.resident.code, why: B.resident.why + (oneToOne ? ` ${B.resident.whyExtra}` : ''), fromSkip: skip('q3') || (oneToOne && skip('q4')) });
      if (staffQ1 || staffQ2) out.binders.push({ key: 'staff', name: B.staff.name, copies: 1, tabs: B.staff.tabs, auth: B.staff.auth, code: B.staff.code, why: a.q1 === 'yes' ? B.staff.why : skip('q1') ? B.staff.whySkip : B.staff.whyLive, fromSkip: !(a.q1 === 'yes') && skip('q1') });
      else out.left.push({ key: 'staff', name: B.staff.name, why: B.staff.left });
      out.binders.push({ key: 'facility', name: B.facility.name, copies: 1, tabs: B.facility.tabs, auth: B.facility.auth, code: B.facility.code, why: B.facility.why, fromSkip: false });
      out.binders.push({ key: 'emergency', name: B.emergency.name, copies: 1, tabs: 0, posted: true, auth: B.emergency.auth, code: B.emergency.code, why: B.emergency.why, fromSkip: false });
      if (policy) out.binders.push({ key: 'policy', name: B.policy.name, copies: 1, tabs: B.policy.tabs, auth: B.policy.auth, code: B.policy.code, why: a.q5 === 'provider' ? B.policy.why : B.policy.whySkip, fromSkip: skip('q5') });
      else out.left.push({ key: 'policy', name: B.policy.name, why: B.policy.left });
      for (const q of D.questions) if (skip(q.id)) out.skipped.push(`Q${q.no}`);
      const physical = out.binders.filter((b) => !b.posted).reduce((n, b) => n + b.copies, 0);
      const tabs = out.binders.reduce((n, b) => n + b.tabs, 0);
      const dividers = out.binders.reduce((n, b) => n + b.tabs * b.copies, 0);
      out.counts = { kinds: out.binders.length, physical, tabs, dividers };
      return out;
    }
    const cite = (t) => `<a class="cite" href="#cites" data-cite="${esc(t)}">${esc(t)}</a>`;
    const evTag = (t) => (t ? `<i class="ev is-${esc(t)}">${esc(t)}</i>` : '');
    const place = (t) => (t ? `<i class="place">${esc(t)}</i>` : '');
    const labelOf = (q, v, track) => { const opts = track === 'Agency' && q.agency ? q.agency.options : q.options; const o = opts.find((x) => x[0] === v); return o ? o[1].replace(/ — .*$/, '') : v; };
    const planText = (plan, a) => {
      const lines = [`Binderkit plan — illustrative · ${plan.track}`];
      lines.push(`Answers: ${D.questions.map((q) => `Q${q.no} ${labelOf(q, a[q.id], a.track)}`).join(' · ')}`);
      if (!plan.ok) { lines.push(plan.notice); return lines.join('\n'); }
      plan.binders.forEach((b, i) => lines.push(`${i + 1}. ${b.name}${b.copies > 1 ? ` ×${b.copies}` : ''} — ${b.posted ? 'posted' : `${b.tabs} tabs`} — ${b.auth} — ${b.why}`));
      plan.left.forEach((b) => lines.push(`— ${b.name}: ${b.why}`));
      lines.push(`To buy: ${plan.counts.physical} binders, ${plan.counts.dividers} dividers. ${plan.counts.tabs} tabs across ${plan.counts.kinds} binders.`);
      lines.push(plan.version.control);
      return lines.join('\n');
    };
    const planOut = (plan) => {
      if (!plan.ok) return `<div class="po"><div class="po-head"><span class="strip-l">The plan</span><span class="po-v" data-plan-version>${esc(plan.track)}</span></div><p class="po-notice">${esc(plan.notice)}</p></div>`;
      const c = plan.counts;
      return `<div class="po">
  <div class="po-head"><span class="strip-l">The plan, with its reasoning</span><span class="po-v" data-plan-version>${esc(plan.version.control)}</span></div>
  <ol class="po-l">${plan.binders.map((b, i) => `<li class="po-b" data-key="${esc(b.key)}"><span class="po-n">${i + 1}</span><div class="po-m"><b>${esc(b.name)}${b.copies > 1 ? ` <em>× ${b.copies}</em>` : ''}</b><span class="po-why">${esc(b.why)}${b.fromSkip ? ' <i class="po-skip">from a skipped question</i>' : ''}</span></div><span class="po-t">${b.posted ? 'posted' : `${b.tabs} tabs`}</span><span class="po-a">${cite(b.auth)}</span></li>`).join('')}</ol>
  ${plan.left.length ? `<ul class="po-left">${plan.left.map((b) => `<li><s>${esc(b.name)}</s> <span>${esc(b.why)}</span></li>`).join('')}</ul>` : ''}
  <dl class="po-counts"><div><dt>Binders</dt><dd>${c.kinds} kinds · ${c.physical} physical</dd></div><div><dt>Tabs</dt><dd>${c.tabs}</dd></div><div><dt>Dividers to buy</dt><dd>${c.dividers}</dd></div>${plan.skipped.length ? `<div><dt>Skipped</dt><dd>${esc(plan.skipped.join(', '))} — resolved the inclusive way</dd></div>` : ''}</dl>
  <p class="po-banner" data-plan-banner ${plan.same ? 'hidden' : ''}>${plan.same ? '' : 'Re-plan: v1 → v2. In the product this is an offer and a diff, and nothing changes until you accept it; here it is applied so you can see the page.'}</p>
</div>`;
    };
    const rowHtml = ([no, item, auth, tag, pl]) => `<li class="cp-r" data-ev="${esc(tag || 'none')}"><span class="cp-n">${esc(no)}</span><span class="cp-i">${esc(item)}</span><span class="cp-a">${cite(auth)}${evTag(tag)}${place(pl)}</span></li>`;
    const swapQ5 = () => {
      const tr = $('input[name="track"]:checked', form); const q5 = D.questions.find((q) => q.id === 'q5'); const sel = $('[data-q="q5"]', form);
      if (!q5 || !sel) return;
      const want = tr && tr.value === 'Agency' && q5.agency ? 'agency' : 'base';
      if ((sel.dataset.variant || 'base') === want) return;
      const v = want === 'agency' ? q5.agency : q5; const keep = sel.value;
      sel.innerHTML = v.options.map(([val, l]) => `<option value="${esc(val)}">${esc(l)}</option>`).join('');
      sel.value = v.options.some((o) => o[0] === keep) ? keep : (want === 'base' ? D.demo.q5 : v.options[0][0]);
      sel.dataset.variant = want;
      const t = $('[data-q-text="q5"]', form); const w = $('[data-q-why="q5"]', form);
      if (t) t.textContent = v.text; if (w) w.textContent = v.why;
    };
    const read = () => { const a = {}; const tr = $('input[name="track"]:checked', form); a.track = tr ? tr.value : D.demo.track; for (const q of D.questions) { const s = $(`[data-q="${q.id}"]`, form); a[q.id] = s ? s.value : D.demo[q.id]; } return a; };
    const paint = () => {
      swapQ5();
      const a = read(); const plan = computePlan(D, a);
      out.innerHTML = planOut(plan);
      $$('[data-sheet]').forEach((sh) => {
        if (!plan.ok) { sh.dataset.track = plan.track; return; }
        delete sh.dataset.track;
        const rows = $('[data-sheet-rows]', sh); if (rows) rows.innerHTML = plan.rows.map(rowHtml).join('');
        const c = $('[data-sheet-control]', sh); if (c) c.textContent = plan.version.control;
        const pr = $('[data-sheet-printed]', sh); if (pr) pr.textContent = plan.version.printed;
      });
      const copy = $('[data-plan-copy]', form); if (copy) copy.setAttribute('data-copy', planText(plan, a));
      form.dataset.same = String(plan.same);
      form.dataset.version = plan.version.control;
      document.dispatchEvent(new CustomEvent('bk:plan', { detail: plan }));
    };
    /* The whole investment case in one button: the same answers, run
       through the rule twice, compared character for character. The
       product's own test is stronger — two generations from one library
       version produce byte-identical FILES — but this is the same rule. */
    planTwice = () => { const a = read(); const A = planText(computePlan(D, a), a); const B = planText(computePlan(D, a), a); return { n: A.length, same: A === B }; };
    form.addEventListener('change', paint);
    form.addEventListener('submit', (e) => { e.preventDefault(); paint(); });
    const reset = $('[data-plan-reset]', form);
    if (reset) reset.addEventListener('click', () => {
      const tr = $(`input[name="track"][value="${D.demo.track}"]`, form); if (tr) tr.checked = true;
      swapQ5();
      for (const q of D.questions) { const s = $(`[data-q="${q.id}"]`, form); if (s) s.value = D.demo[q.id]; }
      paint(); toast('Back to the demonstration — v1');
    });
    paint();
  };

  /* ── the legend: verified · derived · open, filtering the sheet ─────── */
  const legend = () => {
    const btns = $$('[data-ev-toggle]'); if (!btns.length) return;
    const apply = () => {
      const on = new Set(btns.filter((b) => b.getAttribute('aria-pressed') === 'true').map((b) => b.dataset.evToggle));
      $$('[data-sheet]').forEach((sh) => {
        const rows = $$('.cp-r', sh); let shown = 0;
        rows.forEach((r) => { const t = r.dataset.ev; const show = t === 'none' || on.has(t); r.hidden = !show; if (show) shown += 1; });
        const c = $('[data-sheet-count]', sh); if (c) { c.hidden = on.size === 3; c.textContent = `${shown} of ${rows.length} rows shown · ${['verified', 'derived', 'open'].filter((t) => !on.has(t)).join(', ')} hidden`; }
      });
      const lc = $('[data-legend-count]'); const sh = $('[data-print-sheet]') || $('[data-sheet]');
      if (lc && sh) { const rows = $$('.cp-r', sh); lc.textContent = `${rows.filter((r) => !r.hidden).length} of ${rows.length} rows`; }
    };
    btns.forEach((b) => b.addEventListener('click', () => { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); apply(); }));
    document.addEventListener('bk:plan', apply);
    apply();
  };

  /* ── citations: a paper popover on hover or tap ─────────────────────── */
  const cites = () => {
    const dict = {};
    $$('[data-cite-row]').forEach((r) => { const b = $('dt b', r); const d = $('dd', r); dict[r.dataset.citeRow] = { name: b ? b.textContent : '', what: d ? d.textContent : '' }; });
    if (!Object.keys(dict).length) return;
    const hover = window.matchMedia('(hover: hover)');
    let pop = null; let cur = null; let hideT = 0;
    const el = () => {
      if (pop) return pop;
      pop = document.createElement('div'); pop.className = 'pop'; pop.setAttribute('role', 'note'); pop.hidden = true;
      pop.addEventListener('mouseenter', () => clearTimeout(hideT)); pop.addEventListener('mouseleave', () => schedule());
      document.body.appendChild(pop); return pop;
    };
    const hide = () => { if (pop) pop.hidden = true; cur = null; };
    const schedule = () => { clearTimeout(hideT); hideT = setTimeout(hide, 240); };
    const show = (a) => {
      const c = a.dataset.cite; const d = dict[c]; if (!d) return;
      const p = el();
      p.innerHTML = `<b class="pop-c">${esc(c)}</b><span class="pop-n">${esc(d.name)}</span><p>${esc(d.what)}</p><a class="pop-l" href="#cites">All citations on this page →</a>`;
      p.hidden = false; cur = a;
      const r = a.getBoundingClientRect(); const w = p.offsetWidth;
      let left = r.left + window.scrollX; if (left + w > window.scrollX + window.innerWidth - 12) left = window.scrollX + window.innerWidth - 12 - w;
      p.style.left = `${Math.max(12, left)}px`; p.style.top = `${r.bottom + window.scrollY + 8}px`;
    };
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a.cite');
      if (a) { if (a.closest('dialog[open]')) return; e.preventDefault(); e.stopPropagation(); show(a); return; }
      if (e.target.closest('.pop-l')) { hide(); return; }
      if (!e.target.closest('.pop')) hide();
    }, true);
    document.addEventListener('mouseover', (e) => { const a = e.target.closest('a.cite'); if (a && hover.matches && !a.closest('dialog[open]')) { clearTimeout(hideT); show(a); } });
    document.addEventListener('mouseout', (e) => { const a = e.target.closest('a.cite'); if (a && hover.matches) schedule(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
    window.addEventListener('scroll', () => { if (cur && !hover.matches) hide(); }, { passive: true });
  };

  /* ── versions: v1 against v2 ────────────────────────────────────────── */
  const versions = () => {
    const t = $('[data-vtable]'); if (!t) return;
    const btns = $$('.vtog [data-v]'); const banner = $('[data-v-banner]');
    const set = (v) => { t.dataset.v = v; btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === v))); if (banner) banner.hidden = v !== '2'; };
    btns.forEach((b) => b.addEventListener('click', () => set(b.dataset.v)));
  };

  /* ── the page turn, the ledger ticks, the pricing switch ────────────── */
  const turn = () => {
    const b = $('[data-turn]'); const leaf = $('[data-leaf]'); if (!b || !leaf) return;
    let settle = 0;
    const flat = () => { if (!leaf.classList.contains('is-turned')) leaf.classList.remove('is-3d'); };
    b.addEventListener('click', () => { const on = !leaf.classList.contains('is-turned'); clearTimeout(settle); if (on) { leaf.classList.add('is-3d'); void leaf.offsetWidth; } leaf.classList.toggle('is-turned', on); b.setAttribute('aria-pressed', String(on)); const s = $('span', b); if (s) s.textContent = on ? 'Turn back' : 'Turn the page'; if (!on) settle = setTimeout(flat, 1000); });
    leaf.addEventListener('transitionend', (e) => { if (e.propertyName === 'transform') flat(); });
    window.addEventListener('beforeprint', () => { leaf.classList.remove('is-turned', 'is-3d'); b.setAttribute('aria-pressed', 'false'); });
  };
  const ledger = () => {
    const items = $$('[data-ledger] li'); if (!items.length) return;
    if (calm.matches || !('IntersectionObserver' in window)) { items.forEach((li) => li.classList.add('is-in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: 0.4 });
    items.forEach((li, i) => { li.style.setProperty('--d', `${i * 110}ms`); io.observe(li); });
    setTimeout(() => items.forEach((li) => { if (li.getBoundingClientRect().top < window.innerHeight) li.classList.add('is-in'); }), 2500);
  };
  const sell = () => {
    const btns = $$('[data-sell]'); const note = $('[data-sell-note]'); if (!btns.length || !note) return;
    btns.forEach((b) => b.addEventListener('click', () => { btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); note.textContent = note.dataset[b.dataset.sell] || note.textContent; $$('[data-sell-p]').forEach((x) => { x.hidden = x.dataset.sellP !== b.dataset.sell; }); }));
  };

  /* ── questions: a hash opens its answer; the shell hint goes on scroll ─ */
  const faq = () => {
    const open = () => { const id = location.hash.slice(1); if (!id) return; const d = $$('details[id]').find((x) => x.id === id); if (d) d.open = true; };
    window.addEventListener('hashchange', open);
    open();
  };
  const shell = () => {
    $$('.shell[data-scrollx]').forEach((s) => {
      const hint = s.nextElementSibling;
      s.addEventListener('scroll', () => { if (hint && hint.hasAttribute('data-shell-hint')) hint.hidden = true; }, { passive: true, once: true });
    });
  };

  /* ── the fold's bulk switch, in the contents sheet ──────────────────
     site.js folds() listens for pho:openall; pageIndex() would install this
     listener too, but only for a site that asks it to build an index, and
     this one already has a designed contents list with leader dots and
     control numbers. A chapter with nothing to fold loses the button
     rather than offering a control that does nothing. */
  const openAll = () => {
    const btns = $$('[data-open-all]');
    if (!btns.length) return;
    if (!$('[data-phone="fold"]')) { btns.forEach((b) => b.remove()); return; }
    btns.forEach((b) => {
      b.hidden = false;
      b.addEventListener('click', () => document.dispatchEvent(new CustomEvent('pho:openall')));
    });
  };

  /* ── the fold summary, dressed as an index row ─────────────────────
     site.js owns the fold: it builds the button, it hides the body, it
     tears both down above 640. This only re-letters what it built, so it
     has to run again every time site.js rebuilds. A MutationObserver on
     each section is the only ordering-proof way to know that: two
     matchMedia listeners on two different query lists fire in creation
     order, which is an implementation detail, and a page that quietly
     grows a second summary row on a rotate is worse than a long one.

     What it changes: the <h2>'s claim gives way to the section's short
     name, the control number hangs on the right behind the same dotted
     leader the contents page and the footer sheet use, and the claim's
     job passes to the gist that was always there. Four lines of text per
     row become two, and seven identical blocks become a list. */
  const foldRows = () => {
    const secs = $$('.page [data-phone="fold"][data-fold-n]');
    if (!secs.length) return;
    const dress = (s) => {
      const b = s.querySelector(':scope > .fold-s');
      if (!b || b.dataset.bkRow) return;
      const t = b.querySelector('.fold-h');
      if (!t) return;
      b.dataset.bkRow = '1';
      t.textContent = s.getAttribute('data-fold-n');
      const row = document.createElement('span');
      row.className = 'fold-r';
      t.replaceWith(row);
      row.appendChild(t);
      row.insertAdjacentHTML('beforeend',
        '<span class="fold-l" aria-hidden="true"></span>' +
        `<span class="fold-no">${esc(s.getAttribute('data-ctl') || '')}</span>`);
    };
    secs.forEach((s) => {
      dress(s);
      new MutationObserver(() => dress(s)).observe(s, { childList: true });
    });
    /* the head of the run: what these rows are, how many there are, and
       the same bulk switch the sheet offers. Injected rather than
       rendered, because it exists only when something is folded — with
       scripting off nothing folds and no control appears that does
       nothing. */
    const first = secs[0];
    if (!first || $('.fold-lead')) return;
    const lead = document.createElement('div');
    lead.className = 'fold-lead';
    lead.innerHTML = `<span class="strip-l">${secs.length} section${secs.length === 1 ? '' : 's'} folded</span>` +
      '<button class="toc-all" type="button" data-open-all hidden>' +
      '<span>Open all</span></button>';
    first.parentNode.insertBefore(lead, first);
  };

  /* ── determinism, checked in the page ──────────────────────────────── */
  const determinism = () => {
    const b = $('[data-determinism]'); const out = $('[data-det-out]');
    if (!b || !out || !planTwice) { if (b) b.remove(); return; }
    b.addEventListener('click', () => {
      const r = planTwice();
      out.dataset.state = r.same ? 'ok' : 'bad';
      out.textContent = r.same
        ? `Generated twice from the answers above: identical, ${r.n} characters, character for character.`
        : 'The two generations differed. That would be a defect, and finding it is what this button is for.';
    });
  };

  /* ── the three guardrails, played ───────────────────────────────────
     Every word of the refusal is already in the markup, on the button
     that asks for it, so this moves strings rather than holding them. */
  const guards = () => {
    const out = $('[data-guard-out]'); if (!out) return;
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-guard-try]'); if (!b) return;
      $$('[data-guard-try]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      out.innerHTML = `<p class="tryg-g">${esc(b.dataset.gname)} answered</p><p class="tryg-r">\u201c${esc(b.dataset.refusal)}\u201d</p><p class="tryg-alt">${esc(b.dataset.alt)}</p>`;
    });
  };

  const boot = () => {
    run(); foldRows(); openAll();
    const links = tabs();
    lens();
    const openKeys = keysCard();
    const openPal = palette();
    keys(links, openKeys, openPal);
    planner(); determinism(); guards(); legend(); cites(); versions(); turn(); ledger(); sell(); faq(); shell();
    document.documentElement.setAttribute('data-bk', 'set');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
