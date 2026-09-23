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
    const paint = () => { const m = current(); btns.forEach((b) => { b.setAttribute('aria-pressed', String(m === 'dark')); b.setAttribute('aria-label', m === 'dark' ? 'Switch to light' : 'Switch to dark'); if (b.hasAttribute('data-tip')) b.setAttribute('data-tip', b.getAttribute('aria-label')); }); const metas = $$('meta[name="theme-color"]'); if (metas.length && b0) { const c = m === 'dark' ? (b0.getAttribute('data-theme-dark') || '#17201F') : (b0.getAttribute('data-theme-light') || metas[0].getAttribute('content')); /* both, because the page ships one meta per colour scheme: an explicit choice has to win whichever one the OS is currently matching. */ metas.forEach((x) => x.setAttribute('content', c)); } };
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
      /* token match, not equality: a tour that shows the same screen at two
         steps had to render it twice (5 kB on cohort) because a shell could
         only claim one key. data-tour="marpass handoff" now serves both. */
      phones.forEach((p) => { p.hidden = !(` ${p.dataset.tour} `).includes(` ${key} `); });
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
          f.querySelectorAll('.field, button[type="submit"], .contact-alt, .send-two, .send-note, .draft-b, .field-fix').forEach((el) => el.remove());
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
      /* A card in a film strip is reached sideways, not from the top: pull
         it to the start of its own rail and leave the page where it is.
         This is what makes /#strip-cohort-marpass a link to one screen. */
      const rail = t.closest('[data-rail]');
      t.scrollIntoView(rail ? { behavior: calm.matches ? 'auto' : 'smooth', inline: 'start', block: 'nearest' } : { behavior: calm.matches ? 'auto' : 'smooth', block: 'start' });
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
        /* an address is copied AND opened: the copy is for pasting elsewhere,
           the mail app is what most people wanted in the first place */
        if (EMAIL.test(text) && !c.hasAttribute('data-copy-only')) setTimeout(() => { location.href = 'mailto:' + text; }, 420);
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


  /* ── cookies, and the choice about them ───────────────────────────────
     This family set no cookie at all until now, and both privacy pages said
     so in those words. That is why the banner exists and why it is honest:
     NOTHING is stored until someone chooses. "Only what it needs" keeps the
     one cookie that records the choice itself, and nothing else. */
  const cookie = {
    get: (k) => (document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]*)')) || [])[1] || '',
    set: (k, v, days) => {
      const sec = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${k}=${encodeURIComponent(v)}; Max-Age=${Math.round(days * 86400)}; Path=/; SameSite=Lax${sec}`;
    },
    drop: (k) => { document.cookie = `${k}=; Max-Age=0; Path=/; SameSite=Lax`; },
  };
  const CONSENT = 'pho-consent';
  const consented = () => cookie.get(CONSENT) === 'all';
  /* Anything stored beyond the choice itself goes through here, so revoking
     consent really does leave nothing behind. */
  const keep = {
    read: (k) => { try { return consented() ? localStorage.getItem(k) : null; } catch { return null; } },
    write: (k, v) => { try { if (consented()) localStorage.setItem(k, v); } catch { /* private mode */ } },
    drop: (k) => { try { localStorage.removeItem(k); } catch { /* private mode */ } },
  };

  const consent = () => {
    if (cookie.get(CONSENT)) return;                       // already answered
    const el = document.createElement('div');
    el.className = 'ckb';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Cookies');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `
      <div class="ckb-in">
        <p class="ckb-t"><b>Nothing is kept here until you say so — except the theme you picked.</b></p>
        <p class="ckb-p">Say yes and it keeps a draft of anything you start writing, so a refresh or a wrong tap does not lose it, and remembers you next time. Say no and it keeps one cookie recording that you said no — nothing else. <a href="/privacy#cookies">What is kept</a>.</p>
        <p class="ckb-p ckb-short">Keep a draft of what you write, and remember you next time? <a href="/privacy#cookies">What is kept</a>.</p>
        <div class="ckb-b">
          <button class="btn pri" type="button" data-consent="all">Yes, remember</button>
          <button class="btn" type="button" data-consent="min">No, only what it needs</button>
        </div>
      </div>`;
    const close = (choice) => {
      cookie.set(CONSENT, choice, 365);
      if (choice !== 'all') { keep.drop('pho-draft'); try { localStorage.removeItem('pho-draft'); } catch { /* private mode */ } }
      el.classList.add('is-out');
      root.classList.remove('has-ckb');
      setTimeout(() => el.remove(), calm.matches ? 0 : 220);
      if (choice === 'all') drafts();                       // start remembering now
    };
    el.addEventListener('click', (e) => {
      const b = e.target.closest('[data-consent]');
      if (b) close(b.dataset.consent === 'all' ? 'all' : 'min');
    });
    /* First in the DOM, so it is the first thing Tab reaches. It is fixed, so
       document order costs nothing visually — and appending it last meant 92–106
       Tab presses to answer it. Not focus-stealing: a dialog that grabs focus on
       load interrupts a screen reader mid-sentence. */
    document.body.prepend(el);
    root.classList.add('has-ckb');
    requestAnimationFrame(() => el.classList.add('is-in'));
  };

  /* ── the draft: what you typed survives a refresh ────────────────────
     Only with consent, only on this device, and cleared the moment it sends —
     a half-written message about a house is not something to leave lying in
     a browser. */
  const DRAFT = 'pho-draft';
  const drafts = () => {
    const forms = $$('#contactform, #joinform');
    if (!forms.length || !consented()) return;
    let saved = null;
    try { saved = JSON.parse(keep.read(DRAFT) || 'null'); } catch { saved = null; }
    forms.forEach((f) => {
      const fields = () => [...f.elements].filter((el) => el.name && el.name !== 'company' && el.type !== 'hidden' && el.type !== 'submit');
      if (saved && saved.id === f.id && saved.at && Date.now() - saved.at < 1000 * 60 * 60 * 24 * 14) {
        const has = Object.entries(saved.v || {}).some(([, v]) => String(v).trim());
        if (has) {
          const bar = document.createElement('p');
          bar.className = 'draft-b';
          bar.innerHTML = `<span>You started this before. <button type="button" class="lk" data-draft="use">Put it back</button> · <button type="button" class="lk" data-draft="drop">Start fresh</button></span>`;
          bar.addEventListener('click', (e) => {
            const b = e.target.closest('[data-draft]'); if (!b) return;
            if (b.dataset.draft === 'use') fields().forEach((el) => { if (saved.v[el.name] != null) el.value = saved.v[el.name]; });
            else keep.drop(DRAFT);
            bar.remove();
          });
          f.prepend(bar);
        }
      }
      let t = 0;
      f.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          const v = {}; fields().forEach((el) => { if (el.value) v[el.name] = el.value; });
          if (Object.keys(v).length) keep.write(DRAFT, JSON.stringify({ id: f.id, at: Date.now(), v }));
        }, 400);
      });
      f.addEventListener('pho:sent', () => keep.drop(DRAFT));
    });
  };

  /* ── the email, checked while you type ───────────────────────────────
     Not a blocker: a quiet line under the field that offers the spelling you
     probably meant. Typing an address wrong is the commonest reason a reply
     never arrives, and the person never finds out. */
  const DOMAINS = ['gmail.com', 'googlemail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'me.com', 'aol.com', 'comcast.net', 'live.com', 'msn.com', 'proton.me', 'protonmail.com'];
  const near = (a, b) => {
    if (Math.abs(a.length - b.length) > 2) return 99;
    const d = []; for (let i = 0; i <= a.length; i++) d[i] = [i];
    for (let j = 0; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[a.length][b.length];
  };
  const emailCheck = () => {
    $$('input[type="email"]').forEach((el) => {
      const f = el.closest('form'); if (!f) return;
      let hint = null;
      const clear = () => { if (hint) { hint.remove(); hint = null; } };
      el.addEventListener('blur', () => {
        clear();
        const v = el.value.trim().toLowerCase();
        if (!v || !v.includes('@')) return;
        const dom = v.split('@')[1] || '';
        if (!dom || DOMAINS.includes(dom)) return;
        const best = DOMAINS.map((d) => [d, near(dom, d)]).sort((a, b) => a[1] - b[1])[0];
        if (!best || best[1] > 2) return;
        hint = document.createElement('p');
        hint.className = 'field-fix';
        hint.innerHTML = `Did you mean <button type="button" class="lk" data-fix="${esc(v.split('@')[0] + '@' + best[0])}">${esc(v.split('@')[0] + '@' + best[0])}</button>?`;
        hint.addEventListener('click', (e) => {
          const b = e.target.closest('[data-fix]'); if (!b) return;
          el.value = b.dataset.fix; clear(); el.focus();
        });
        el.insertAdjacentElement('afterend', hint);
      });
      el.addEventListener('input', clear);
    });
  };
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ── the other way to send: your own mail app ────────────────────────
     Same inbox either way. What this buys you is a copy in your own Sent
     folder and the ability to attach something, which a web form cannot do. */
  const sendByMail = () => {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-send-mail]'); if (!b) return;
      const f = b.closest('form'); if (!f) return;
      const g = (n) => (f.elements[n] && f.elements[n].value || '').trim();
      const subject = `${g('topic') || 'Question'}${g('name') ? ` — ${g('name')}` : ''}`;
      const body = [g('message'), '', '—', g('name'), g('email'), g('phone')].filter(Boolean).join('\n');
      /* This is a real send, so the draft must go the same way it does on the
         fetch path — the privacy page promises it is deleted the moment the
         message sends, and a mail-app send is a send. */
      f.dispatchEvent(new CustomEvent('pho:sent', { bubbles: true, detail: { via: 'mailto' } }));
      location.href = `mailto:${b.dataset.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  };


  /* The floating write-to-us appears once the hero is behind you, so the page
     opens with one call to action rather than two competing ones. */
  const fab = () => {
    const el = $('[data-fab]'); if (!el) return;
    /* four voices, one per visit — random, so no storage is needed and a
       returning reader meets a different line without being tracked */
    el.setAttribute('data-fab-v', String(Math.floor(Math.random() * 4)));
    /* the dock: the fab, and anything a site marks data-fab-side (cohort's
       Keys), one fixed corner rather than two things fighting for it */
    const dock = document.createElement('div');
    dock.className = 'fabs';
    el.parentNode.insertBefore(dock, el);
    for (const side of $$('[data-fab-side]')) { side.classList.add('fab-side'); dock.appendChild(side); }
    dock.appendChild(el);
    const hero = $('#top') || $('main .hero') || $('main > section');
    const show = () => {
      const byHero = hero ? hero.getBoundingClientRect().bottom < 40 : false;
      const on = byHero || window.scrollY > window.innerHeight * 0.9;
      el.classList.toggle('is-on', on);
      dock.classList.toggle('is-on', on);
    };
    show();
    const sync = () => { const on = el.classList.contains('is-on'); el.setAttribute('tabindex', on ? '0' : '-1'); $$('.fab-side', dock).forEach((b) => { b.tabIndex = on ? 0 : -1; }); };
    sync();
    new MutationObserver(sync).observe(el, { attributes: true, attributeFilter: ['class'] });
    addEventListener('scroll', show, { passive: true });
    addEventListener('resize', show, { passive: true });
  };

  /* ── the next page, floating: shown once the reader is well into the page ── */
  const nxt = () => {
    const el = $('[data-next]'); if (!el) return;
    const show = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.classList.toggle('is-on', max > 600 && window.scrollY > max * 0.42);
    };
    show();
    addEventListener('scroll', show, { passive: true });
    addEventListener('resize', show, { passive: true });
  };

  /* ── scroll-driven instruments ────────────────────────────────────────
     Any [data-scroll-p] element gets --sp: 0 as its top enters the bottom of
     the viewport, 1 as its bottom leaves the top — so a ring can turn, a
     phone can travel and a bar can fill in step with the reader rather than
     on a timer. [data-turn] additionally gets --turn in degrees, over the
     element's own scroll span (data-turn="360" is one full turn). A
     [data-scroll-p="parent"] reads its parent section's span instead, which
     is what lets a sticky instrument follow the list beside it. */
  const scrollDrive = () => {
    const els = $$('[data-scroll-p], [data-turn]');
    if (!els.length || calm.matches) return;
    let ticking = false;
    const paint = () => {
      ticking = false;
      const vh = window.innerHeight;
      for (const el of els) {
        const ref = el.getAttribute('data-scroll-p') === 'parent' ? (el.closest('section') || el.parentElement) : el;
        const r = ref.getBoundingClientRect();
        const span = r.height + vh;
        const p = span > 0 ? Math.min(1, Math.max(0, (vh - r.top) / span)) : 0;
        el.style.setProperty('--sp', p.toFixed(4));
        if (el.hasAttribute('data-turn')) el.style.setProperty('--turn', (p * (parseFloat(el.getAttribute('data-turn')) || 360)).toFixed(2) + 'deg');
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll, { passive: true });
    paint();
  };

  /* ── icon-only controls say what they do ─────────────────────────────
     Every button or link in the chrome that carries only an icon gets its
     aria-label as a hover tooltip, so a sighted reader learns what the
     lamp, the share glyph and the search glass are before pressing. */
  const tips = () => {
    for (const el of $$('header button[aria-label], header a[aria-label], footer button[aria-label], .fabs button[aria-label], [data-fab-side][aria-label]')) {
      if (el.hasAttribute('data-tip') || el.classList.contains('brand')) continue;
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (text) continue;
      el.setAttribute('data-tip', el.getAttribute('aria-label'));
      const r = el.getBoundingClientRect();
      if (r.left > window.innerWidth * 0.7) el.setAttribute('data-tip-at', 'end');
      else if (r.left < window.innerWidth * 0.2) el.setAttribute('data-tip-at', 'start');
    }
  };

  /* ── the working demo: rails, screen switchers, callouts ─────────────
     The shared behaviour behind filmStrip(), screenSwitch() and
     callouts() in render/instruments.js. Everything here is an upgrade on
     something that already works: the rail is a real overflow-x container
     that a finger, a trackpad and a scrollbar already scroll, its captions
     are already in the HTML, the switcher already renders every screen
     with scripting off, and a callout list is an ordered list of
     sentences whatever happens.

     One delegated listener per behaviour, never one per element: a page
     may carry three rails of eight screens and the listener count does not
     move. Nothing is attached at all on a page that has none.

     BOTH POINTERS. A finger scrolls the rail natively, with momentum and
     snap, so drag is bound to a mouse pointer only — hijacking touchmove
     would take the momentum away and give nothing back. Keys, snap sync,
     the index announcement, the tabs and the callout lighting are
     pointer-agnostic and run on every device.

     REDUCED MOTION. Every programmatic scroll asks for 'auto' rather than
     'smooth' when the reader has asked for less motion; the stylesheet
     makes the matching call for its transitions by declaring them inside
     prefers-reduced-motion: no-preference rather than switching them off
     afterwards. */
  const RAIL = '[data-rail]';
  const STEP = { ArrowLeft: -1, ArrowRight: 1, Home: 'h', End: 'e' };
  let dg = null, slid = false, spoke = 0;
  const kids = (r) => $$('.fs-i', r);
  /* A caller's selector is data, so it may be wrong; a bad one must cost a
     missing pin, never a thrown exception that takes the rest of the page
     down with it. */
  const pick = (root, sel) => { try { return sel && root ? root.querySelector(sel) : null; } catch (x) { return null; } };
  const pct = (a, b) => ((a / b) * 100).toFixed(2) + '%';
  const ease = () => (calm.matches ? 'auto' : 'smooth');
  /* The rail is position:relative, so a card's offsetLeft is measured from
     the same origin as scrollLeft and the snapped card is simply the one
     whose left edge sits nearest the left edge of the visible strip. */
  const nearest = (r) => {
    const el = kids(r);
    if (!el.length) return 0;
    const x = r.scrollLeft + el[0].offsetLeft;
    let b = 0, d = Infinity;
    for (let i = 0; i < el.length; i++) { const v = Math.abs(el[i].offsetLeft - x); if (v < d) { d = v; b = i; } }
    return b;
  };
  const goTo = (r, i) => {
    const el = kids(r);
    const n = el[Math.max(0, Math.min(el.length - 1, i))];
    if (n) n.scrollIntoView({ behavior: ease(), inline: 'start', block: 'nearest' });
  };
  const swSet = (box, i, move) => {
    const tabs = $$('[role="tab"]', box);
    if (!tabs.length) return;
    i = Math.max(0, Math.min(tabs.length - 1, i));
    if (box.dataset.at === String(i) && !move) return;
    box.dataset.at = i;
    const ps = $$('.swx-p', box);
    tabs.forEach((t, j) => { t.setAttribute('aria-selected', j === i ? 'true' : 'false'); t.tabIndex = j === i ? 0 : -1; });
    ps.forEach((x, j) => x.toggleAttribute('data-on', j === i));
    if (!move) return;
    tabs[i].focus();
    const rid = box.getAttribute('data-sw-rail');
    const strip = rid ? document.getElementById(rid) : null;
    const rail = strip ? $(RAIL, strip) : null;
    if (rail) goTo(rail, i);
  };
  const railSync = (r) => {
    const i = nearest(r);
    if (r.dataset.at === String(i)) return;
    const first = r.dataset.at === undefined;
    r.dataset.at = i;
    const el = kids(r);
    el.forEach((x, j) => x.toggleAttribute('data-on', j === i));
    const box = r.closest('.fstrip');
    if (!box) return;
    $$('.fs-jump a', box).forEach((a, j) => { if (j === i) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    const sw = box.id ? $('[data-sw-rail="' + box.id + '"]') : null;
    if (sw) swSet(sw, i, false);
    /* Say it once the strip has come to rest. Announcing every card a fast
       flick passes over is noise, not status. */
    const live = $('.fs-live', box);
    if (!live || first) return;
    clearTimeout(spoke);
    spoke = setTimeout(() => { live.textContent = (i + 1) + ' of ' + el.length + ', ' + (el[i] ? el[i].getAttribute('data-t') || '' : ''); }, 300);
  };
  /* A pin that names a selector is placed from the measured element, so it
     stays right through a zoom change, a font swap and a reflow. A pin
     whose selector stops matching hides itself rather than pointing at the
     wrong thing — the sentence is still in the list underneath. */
  const place = () => {
    for (const w of $$('[data-callouts]')) {
      const stage = $('.cal-stage', w);
      if (!stage) continue;
      const b = stage.getBoundingClientRect();
      if (!b.width) continue;
      for (const pin of $$('.cal-pin[data-sel]', w)) {
        const t = pick(stage, pin.getAttribute('data-sel'));
        if (!t) { pin.hidden = true; continue; }
        const q = t.getBoundingClientRect();
        pin.hidden = false;
        pin.style.setProperty('--x', pct(q.left + q.width / 2 - b.left, b.width));
        pin.style.setProperty('--y', pct(q.top + q.height / 2 - b.top, b.height));
      }
    }
  };
  let litB = null;
  const dark = (w) => {
    if (!w) return;
    for (const x of $$('[data-cal][data-on],[data-lit-t]', w)) { x.removeAttribute('data-on'); x.removeAttribute('data-lit-t'); }
    w.removeAttribute('data-lit');
  };
  const light = (e) => {
    const t = e.target;
    const n = t && t.closest ? t.closest('[data-callouts] [data-cal]') : null;
    const w = n ? n.closest('[data-callouts]') : null;
    if (litB && litB !== w) { dark(litB); litB = null; }
    if (!w) return;
    const k = n.getAttribute('data-cal');
    if (w.getAttribute('data-lit') === k) return;
    dark(w);
    litB = w;
    w.setAttribute('data-lit', k);
    for (const x of $$('[data-cal="' + k + '"]', w)) x.setAttribute('data-on', '');
    const pin = $('.cal-pin[data-cal="' + k + '"]', w);
    const q = pick($('.cal-stage', w), pin && pin.getAttribute('data-sel'));
    if (q) q.setAttribute('data-lit-t', '');
  };
  const demos = () => {
    const rails = $$(RAIL);
    const boxes = $$('[data-switch]');
    const cals = $$('[data-callouts]');
    if (!rails.length && !boxes.length && !cals.length) return;

    if (rails.length || boxes.length) {
      document.addEventListener('keydown', (e) => {
        const k = STEP[e.key];
        if (k === undefined || e.metaKey || e.ctrlKey || e.altKey) return;
        const t = e.target;
        if (!t || !t.matches) return;
        if (t.matches('[role="tab"]')) {
          const box = t.closest('[data-switch]');
          if (!box) return;
          const tabs = $$('[role="tab"]', box);
          const n = tabs.length;
          /* A tablist wraps, a rail does not: the tabs are a ring of five
             names, the rail is a line with a first and a last card. */
          e.preventDefault();
          swSet(box, k === 'h' ? 0 : k === 'e' ? n - 1 : (tabs.indexOf(t) + k + n) % n, true);
          return;
        }
        /* Only when the rail itself holds focus: a link inside a caption
           keeps the arrow keys it is entitled to. */
        if (!t.matches(RAIL)) return;
        const el = kids(t);
        const to = k === 'h' ? 0 : k === 'e' ? el.length - 1 : nearest(t) + k;
        if (to < 0 || to >= el.length) return;
        e.preventDefault();
        goTo(t, to);
      });
      /* Capture, so the drag guard gets in front of anchors() below and a
         drag that happens to end on a link does not follow it. */
      document.addEventListener('click', (e) => {
        if (slid) { slid = false; e.preventDefault(); e.stopPropagation(); return; }
        const b = e.target.closest ? e.target.closest('[data-sw-to]') : null;
        const box = b ? b.closest('[data-switch]') : null;
        if (box) { e.preventDefault(); swSet(box, Number(b.getAttribute('data-sw-to')), true); }
      }, true);
    }

    if (rails.length) {
      let pend = null;
      document.addEventListener('scroll', (e) => {
        const t = e.target;
        if (!t || t.nodeType !== 1 || !t.matches(RAIL) || pend === t) return;
        pend = t;
        requestAnimationFrame(() => { const r = pend; pend = null; if (r) railSync(r); });
      }, { capture: true, passive: true });
      document.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse' || e.button) return;
        const r = e.target.closest ? e.target.closest(RAIL) : null;
        if (r) dg = { r, x: e.clientX, l: r.scrollLeft, id: e.pointerId, on: false };
      });
      document.addEventListener('pointermove', (e) => {
        if (!dg || e.pointerId !== dg.id) return;
        const dx = e.clientX - dg.x;
        if (!dg.on) {
          if (Math.abs(dx) < 5) return;
          dg.on = true;
          dg.r.classList.add('is-drag');
          try { dg.r.setPointerCapture(dg.id); } catch (x) { }
        }
        dg.r.scrollLeft = dg.l - dx;
      });
      const stop = () => { if (!dg) return; slid = dg.on; dg.r.classList.remove('is-drag'); dg = null; };
      document.addEventListener('pointerup', stop);
      document.addEventListener('pointercancel', stop);
      rails.forEach((r) => railSync(r));
      /* A link someone pasted. The browser's own fragment scroll only brings
         a card far enough in to be visible, which for a rail means it lands
         wherever it happens to land; align it to the start so the screen
         that was shared is the screen you arrive on. */
      const land = () => {
        const t = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
        if (t && t.closest(RAIL)) t.scrollIntoView({ inline: 'start', block: 'nearest' });
      };
      land();
      addEventListener('hashchange', land);
    }

    /* A tab strip that fits is not a scroller. .swx-tabs keeps overflow-x: auto
       so it still scrolls with scripting off, where it is the only way to reach
       a tab that does not fit; when it DOES fit, this marks it and the sheet
       turns the overflow off, so no assistive tech is handed a scroll region
       with nothing in it. Measured, not guessed, and re-measured on resize. */
    const strips = $$('.swx-tabs');
    if (strips.length) {
      const fits = () => strips.forEach((x) => x.toggleAttribute('data-fits', x.scrollWidth <= x.clientWidth + 1));
      fits();
      addEventListener('resize', fits, { passive: true });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(fits);
    }

    if (cals.length) {
      document.addEventListener('pointerover', light);
      document.addEventListener('focusin', light);
      place();
      addEventListener('resize', place, { passive: true });
      /* The shells are drawn in the page's own faces, so a pin measured
         before the webfont lands is measured against the fallback. */
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    }
  };

  window.PHO = { $, $$, calm, toast, root, EMAIL };
  const boot = () => { reveal(); header(); menus(); mode(); tour(); forms(); anchors(); verbs(); clocks(); pageIndex(); folds(); demos(); consent(); drafts(); emailCheck(); sendByMail(); fab(); nxt(); scrollDrive(); tips(); document.dispatchEvent(new CustomEvent('pho:ready')); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
