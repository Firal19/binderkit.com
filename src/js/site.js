/* site.js — the page works without it. Everything here is an upgrade on
   something that already functions: the nav links are anchors, the questions
   are <details>, the two forms have real actions. One listener per job, no
   framework. A product's own script (js/pages/<id>.js) is appended after
   this and reaches these helpers through window.PHO. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ── a small toast, for “copied” and the like ────────────────────── */
  let toastEl = null; let toastT = 0;
  const toast = (text) => {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); toastEl.setAttribute('aria-live', 'polite'); document.body.appendChild(toastEl); }
    toastEl.textContent = text;
    toastEl.classList.add('is-on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2200);
  };

  /* ── reveal ─────────────────────────────────────────────────────────── */
  const reveal = () => {
    const items = $$('[data-reveal]');
    if (calm.matches || !('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) { if (!e.isIntersecting) continue; e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.03 });
    items.forEach((el, i) => {
      if (i < 2 || el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('is-in'); return; }
      io.observe(el);
    });
    setTimeout(() => items.forEach((el) => el.classList.add('is-in')), 3000);
  };

  /* ── the header: stuck, where you are, and how far ──────────────────
     Any element with data-spy is a list of section links; the one whose
     section is in view gets aria-current. Any [data-progress] gets --p. */
  const header = () => {
    const top = $('#top-bar');
    const navs = $$('[data-spy]').map((n) => {
      const links = $$('a[href^="#"]', n);
      return { links, targets: links.map((a) => document.getElementById(a.getAttribute('href').slice(1))) };
    });
    const bars = $$('[data-progress]');
    let ticking = false;
    const paint = () => {
      ticking = false;
      const y = window.scrollY;
      if (top) top.toggleAttribute('data-stuck', y > 8);
      root.toggleAttribute('data-scrolled', y > 120);
      const line = y + window.innerHeight * 0.32;
      let section = '';
      for (const { links, targets } of navs) {
        let on = -1;
        targets.forEach((t, i) => { if (t && t.offsetTop <= line) on = i; });
        links.forEach((a, i) => { if (i === on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
        if (on >= 0 && !section) section = targets[on].id;
      }
      if (section) root.dataset.section = section; else delete root.dataset.section;
      if (bars.length) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
        bars.forEach((b) => b.style.setProperty('--p', p.toFixed(4)));
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
  };

  /* ── disclosures: any button with aria-controls toggles its panel ──── */
  const menus = () => {
    const btns = $$('button[aria-controls]');
    if (!btns.length) return;
    const set = (btn, panel, open) => {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      const label = btn.getAttribute('data-label-open');
      if (label) btn.setAttribute('aria-label', open ? (btn.getAttribute('data-label-close') || 'Close') : label);
      if (btn.hasAttribute('data-lock')) document.body.classList.toggle('is-locked', open);
      if (open && btn.hasAttribute('data-focus')) { const f = $(btn.getAttribute('data-focus'), panel); if (f) f.focus(); }
    };
    btns.forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      if (!btn.getAttribute('data-label-open') && btn.getAttribute('aria-label')) btn.setAttribute('data-label-open', btn.getAttribute('aria-label'));
      btn.addEventListener('click', () => set(btn, panel, panel.hidden));
      panel.addEventListener('click', (e) => { if (e.target.closest('a') || e.target.closest('[data-close]')) set(btn, panel, false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { set(btn, panel, false); btn.focus(); } });
      if (btn.hasAttribute('data-lock')) window.addEventListener('resize', () => { if (window.innerWidth > 900 && !panel.hidden) set(btn, panel, false); });
    });
  };

  /* ── the fold: below 640 a page opens as an index, not a scroll ──────
     A section marked data-phone="fold" gets a 64px summary row carrying
     its own heading and its data-gist, and its contents are hidden behind
     it. Nothing is deleted: the HTML still carries every word, so search,
     in-page find after opening, and the printer all still see the whole
     document.

     `hidden`, never `display: none`. Undoing a display override needs
     `revert`, and revert rolls back to the USER-AGENT value — so a
     `.wrap { display: grid }` would come back as `block` and the section
     would break silently. The hidden attribute is the UA's own mechanism
     and removing it restores the element's real computed display exactly.
     No author display declaration is touched anywhere in here.

     Guarantees: no JS, nothing folds. Print opens everything. A hash link
     opens its target before scrolling. Above 640 every section is open and
     every button is removed. */
  const FOLD = '[data-phone="fold"]';
  const CHEV = '<svg class="fold-c" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  const folds = () => {
    const secs = $$(FOLD);
    if (!secs.length) return;
    const mq = window.matchMedia('(max-width: 640px)');
    const open = (s, on) => {
      if (!s._fold) return;
      s.toggleAttribute('data-open', on);
      for (const kid of s.children) { if (kid !== s._fold) kid.toggleAttribute('hidden', !on); }
      s._fold.setAttribute('aria-expanded', on ? 'true' : 'false');
      if (on) $$('[data-reveal]', s).forEach((el) => el.classList.add('is-in'));
    };
    const build = (s) => {
      if (s._fold) return s._fold;
      const head = s.querySelector('h2, h3, h1');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'fold-s';
      b.setAttribute('aria-expanded', 'false');
      const t = document.createElement('span'); t.className = 'fold-t';
      const h = document.createElement('span'); h.className = 'fold-h';
      h.textContent = head ? head.textContent.trim() : (s.getAttribute('aria-label') || s.id || 'Section');
      t.appendChild(h);
      if (s.dataset.gist) { const g = document.createElement('span'); g.className = 'fold-g'; g.textContent = s.dataset.gist; t.appendChild(g); }
      b.appendChild(t);
      b.insertAdjacentHTML('beforeend', CHEV);
      b.addEventListener('click', () => open(s, !s.hasAttribute('data-open')));
      s.insertBefore(b, s.firstChild);
      s.classList.add('is-in');
      s._fold = b;
      return b;
    };
    const drop = (s) => {
      for (const kid of s.children) { if (kid !== s._fold) kid.removeAttribute('hidden'); }
      if (s._fold) { s._fold.remove(); s._fold = null; }
      s.removeAttribute('data-open');
    };
    const reveal = (el) => { const s = el && el.closest && el.closest(FOLD); if (s && s._fold) open(s, true); };
    const sync = () => {
      for (const s of secs) {
        if (mq.matches) { build(s); open(s, s.hasAttribute('data-open') || s.hasAttribute('data-phone-open')); }
        else drop(s);
      }
      if (mq.matches && location.hash) reveal(document.getElementById(location.hash.slice(1)));
    };
    window.addEventListener('hashchange', () => reveal(document.getElementById(location.hash.slice(1))));
    document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#"]'); if (a) reveal(document.getElementById(a.getAttribute('href').slice(1))); }, true);
    window.addEventListener('beforeprint', () => secs.forEach((s) => open(s, true)));
    mq.addEventListener('change', sync);
    document.addEventListener('pho:openall', () => secs.forEach((s) => open(s, true)));
    sync();
  };

  /* ── the counterweight: a folded page has to be navigable ────────────
     Any element with data-page-index is filled with one --tap-row row per
     foldable section — its heading and its gist — plus one button that
     opens every section at once. The data is the same data-gist the fold
     already reads, so a site declares it once. */
  const pageIndex = () => {
    const holders = $$('[data-page-index]');
    if (!holders.length) return;
    const secs = $$(FOLD).filter((s) => s.id);
    if (!secs.length) { holders.forEach((h) => h.remove()); return; }
    for (const holder of holders) {
      const frag = document.createDocumentFragment();
      for (const s of secs) {
        const head = s.querySelector('h2, h3, h1');
        const a = document.createElement('a');
        a.className = 'msheet-r';
        a.href = `#${s.id}`;
        const box = document.createElement('span');
        const b = document.createElement('b');
        b.textContent = head ? head.textContent.trim() : s.id;
        box.appendChild(b);
        if (s.dataset.gist) { const sm = document.createElement('small'); sm.textContent = s.dataset.gist; box.appendChild(sm); }
        a.appendChild(box);
        frag.appendChild(a);
      }
      const all = document.createElement('button');
      all.type = 'button';
      all.className = 'msheet-r';
      all.dataset.openAll = '';
      all.textContent = holder.getAttribute('data-open-all') || 'Open every section';
      frag.appendChild(all);
      holder.appendChild(frag);
    }
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-open-all]')) return;
      document.dispatchEvent(new CustomEvent('pho:openall'));
    });
  };

  /* ── light and dark: a real switch, remembered, that respects the OS ── */
  const mode = () => {
    const btns = $$('[data-mode-toggle]');
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const current = () => { const m = root.getAttribute('data-mode'); return m === 'dark' || m === 'light' ? m : (dark.matches ? 'dark' : 'light'); };
    const paint = () => { const m = current(); btns.forEach((b) => { b.setAttribute('aria-pressed', String(m === 'dark')); b.setAttribute('aria-label', m === 'dark' ? 'Switch to light' : 'Switch to dark'); }); const meta = $('meta[name="theme-color"]'); if (meta && b0) meta.setAttribute('content', m === 'dark' ? (b0.getAttribute('data-theme-dark') || '#17201F') : (b0.getAttribute('data-theme-light') || meta.getAttribute('content'))); };
    const b0 = btns[0];
    btns.forEach((b) => b.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-mode', next);
      try { localStorage.setItem('pho-mode', next); } catch { /* private mode */ }
      paint();
    }));
    dark.addEventListener('change', () => { if (root.getAttribute('data-mode') === 'auto') paint(); });
    paint();
  };

  /* ── the tour: a phone that follows a timeline (Cohort) ─────────────
     Each step names the screen it belongs to; the phone beside the list
     shows the step nearest the middle of the viewport. */
  const tour = () => {
    const steps = $$('.tl-i[data-tour]');
    const phones = $$('.tour-p[data-tour]');
    if (!steps.length || !phones.length) return;
    let current = steps[0].dataset.tour;
    const show = (key) => {
      if (key === current) return;
      current = key;
      phones.forEach((p) => { p.hidden = p.dataset.tour !== key; });
    };
    let ticking = false;
    const scan = () => {
      ticking = false;
      const mid = window.innerHeight * 0.45;
      let best = null, bestD = Infinity;
      for (const s of steps) {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + Math.min(r.height / 2, 80) - mid);
        if (d < bestD) { bestD = d; best = s; }
      }
      if (best) { steps.forEach((s) => s.removeAttribute('data-on')); best.setAttribute('data-on', ''); show(best.dataset.tour); }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(scan); } }, { passive: true });
    steps.forEach((s) => s.addEventListener('mouseenter', () => { steps.forEach((x) => x.removeAttribute('data-on')); s.setAttribute('data-on', ''); show(s.dataset.tour); }));
  };

  /* ── the two forms: one submitter ───────────────────────────────────── */
  const form = (id, check) => {
    const f = document.getElementById(id);
    if (!f) return;
    const msg = $('.form-msg', f);
    const btn = $('button[type="submit"]', f);
    const label = btn ? btn.textContent : 'Send';
    const say = (state, text) => { if (!msg) return; msg.dataset.state = state; msg.textContent = text; };
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const bad = check(f);
      if (bad) { say('err', bad.text); bad.el.setAttribute('aria-invalid', 'true'); bad.el.focus(); return; }
      $$('[aria-invalid]', f).forEach((el) => el.removeAttribute('aria-invalid'));
      if (f.elements.company && f.elements.company.value) return;
      f.classList.add('is-busy');
      if (btn) btn.textContent = f.dataset.busy || 'Sending…';
      say('', '');
      try {
        const body = Object.fromEntries(new FormData(f).entries());
        const res = await fetch(f.action, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          f.querySelectorAll('.field, button[type="submit"], .contact-alt').forEach((el) => el.remove());
          f.classList.add('is-done');
          say('ok', f.dataset.done || 'Sent.');
          f.dispatchEvent(new CustomEvent('pho:sent', { bubbles: true, detail: data }));
          return;
        }
        say('err', data.message || 'That did not send. Try again in a moment.');
      } catch {
        say('err', 'That did not send — you may be offline. Try again in a moment.');
      } finally {
        f.classList.remove('is-busy');
        if (btn) btn.textContent = label;
      }
    });
  };
  const forms = () => {
    form('joinform', (f) => {
      const email = f.elements.email;
      if (!email.value || !EMAIL.test(email.value.trim())) return { el: email, text: 'That email does not look right. Check it and try again.' };
      return null;
    });
    form('contactform', (f) => {
      const email = f.elements.email; const m = f.elements.message;
      if (!email.value || !EMAIL.test(email.value.trim())) return { el: email, text: 'That email does not look right. Check it and try again.' };
      if (!m.value || m.value.trim().length < 4) return { el: m, text: 'Write a line or two so we know what to answer.' };
      return null;
    });
  };

  /* ── an in-page jump lands under the sticky header and moves focus ─── */
  const anchors = () => {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      const t = id && document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: calm.matches ? 'auto' : 'smooth', block: 'start' });
      t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
      history.replaceState(null, '', `#${id}`);
    });
  };

  /* ── copy, share, print: three verbs any page may put on a button ──── */
  const verbs = () => {
    document.addEventListener('click', async (e) => {
      const c = e.target.closest('[data-copy]');
      if (c) {
        e.preventDefault();
        const text = c.getAttribute('data-copy') || c.textContent.trim();
        try { await navigator.clipboard.writeText(text); toast(c.getAttribute('data-copied') || 'Copied'); } catch { toast(text); }
        return;
      }
      const s = e.target.closest('[data-share]');
      if (s) {
        e.preventDefault();
        const url = s.getAttribute('data-share') || location.href;
        const title = s.getAttribute('data-share-title') || document.title;
        if (navigator.share) { try { await navigator.share({ title, url }); } catch { /* dismissed */ } return; }
        try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { toast(url); }
        return;
      }
      const p = e.target.closest('button[data-print], a[data-print]');
      if (p) { e.preventDefault(); window.print(); }
    });
  };

  /* ── a live clock, wherever a page asks for one ─────────────────────── */
  const clocks = () => {
    const els = $$('[data-clock]');
    if (!els.length) return;
    const tick = () => {
      const d = new Date();
      els.forEach((el) => {
        const f = el.getAttribute('data-clock');
        el.textContent = f === 'day'
          ? d.toLocaleDateString(undefined, { weekday: 'long' })
          : f === 'date'
            ? d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })
            : f === '24'
              ? `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
              : d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      });
    };
    tick();
    setInterval(tick, 15000);
  };

  window.PHO = { $, $$, calm, toast, root, EMAIL };
  const boot = () => { reveal(); header(); menus(); mode(); tour(); forms(); anchors(); verbs(); clocks(); pageIndex(); folds(); document.dispatchEvent(new CustomEvent('pho:ready')); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
