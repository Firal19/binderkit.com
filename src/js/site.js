/* site.js — the page works without it. Everything here is an upgrade on
   something that already functions: the nav links are anchors, the questions
   are <details>, the waitlist is a form with a real action, and the mode
   starts correct from an inline script in <head>. 4 KB, no dependencies,
   no framework, one listener per job. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── reveal ───────────────────────────────────────────────────────────
     Sections rise once, the first time they are needed. Anything already on
     screen at load is shown without animating, so the fold never flickers. */
  const reveal = () => {
    const items = $$('[data-reveal]');
    if (calm.matches || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      document.documentElement.classList.add('is-ready');
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.04 });
    items.forEach((el, i) => {
      if (i < 2 || el.getBoundingClientRect().top < window.innerHeight) { el.classList.add('is-in'); return; }
      io.observe(el);
    });
    // A reveal that never fires is a blank page. Whatever is still hidden
    // three seconds in is shown, observer or no observer.
    setTimeout(() => items.forEach((el) => el.classList.add('is-in')), 3000);
  };

  /* ── the header: stuck, progress, and where you are ───────────────── */
  const header = () => {
    const top = $('#top-bar');
    const bar = $('.lp-progress i');
    const links = $$('.lp-top .lp-links a');
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    let ticking = false;

    const paint = () => {
      ticking = false;
      const y = window.scrollY;
      if (top) top.toggleAttribute('data-stuck', y > 8);
      if (bar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.setProperty('--p', `${h > 0 ? Math.min(100, (y / h) * 100).toFixed(2) : 0}%`);
      }
      if (targets.length) {
        const line = y + window.innerHeight * 0.32;
        let on = -1;
        targets.forEach((t, i) => { if (t.offsetTop <= line) on = i; });
        links.forEach((a, i) => {
          if (i === on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
  };

  /* ── the menu ─────────────────────────────────────────────────────── */
  const menu = () => {
    const btn = $('.lp-burger');
    const panel = $('#lp-menu');
    if (!btn || !panel) return;
    const set = (open) => {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
    };
    btn.addEventListener('click', () => set(panel.hidden));
    panel.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { set(false); btn.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 900 && !panel.hidden) set(false); });
  };

  /* ── light and dark ───────────────────────────────────────────────── */
  const mode = () => {
    const btn = $('.lp-mode');
    if (!btn) return;
    const apply = (m) => {
      document.documentElement.dataset.mode = m;
      const main = $('#main');
      if (main) main.dataset.mode = m;
      btn.setAttribute('aria-pressed', String(m === 'dark'));
      btn.setAttribute('aria-label', m === 'dark' ? 'Switch to light' : 'Switch to dark');
    };
    apply(document.documentElement.dataset.mode === 'dark' ? 'dark' : 'light');
    btn.addEventListener('click', () => {
      const next = document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('phub.mode', next); } catch { /* private mode */ }
    });
  };

  /* ── the annotated screen ─────────────────────────────────────────────
     A callout lights up on hover and on focus; on a narrow screen, where the
     list is read rather than pointed at, the one nearest the middle lights
     up as you pass it. Decoration only — nothing here carries meaning that
     the text does not already carry. */
  const annots = () => {
    const items = $$('.lp-annot li');
    if (!items.length) return;
    const clear = (list) => list.forEach((el) => el.removeAttribute('data-on'));
    items.forEach((li) => {
      li.addEventListener('mouseenter', () => { clear(items); li.setAttribute('data-on', ''); });
      li.addEventListener('mouseleave', () => li.removeAttribute('data-on'));
      li.addEventListener('focusin', () => { clear(items); li.setAttribute('data-on', ''); });
    });
    if (calm.matches || !window.matchMedia('(hover: none)').matches) return;
    let ticking = false;
    const scan = () => {
      ticking = false;
      const mid = window.innerHeight / 2;
      let best = null, bestD = Infinity;
      for (const li of items) {
        const r = li.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) { bestD = d; best = li; }
      }
      clear(items);
      if (best && bestD < window.innerHeight * 0.25) best.setAttribute('data-on', '');
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(scan); } }, { passive: true });
  };

  /* ── the waitlist ─────────────────────────────────────────────────────
     The form posts on its own without this; JS only keeps the reader on the
     page and says what happened in place. */
  const waitlist = () => {
    const form = $('#joinform');
    if (!form) return;
    const msg = $('.lp-form-msg', form);
    const btn = $('button[type="submit"]', form);
    const email = form.elements.email;
    const label = btn ? btn.textContent : 'Join the list';

    const say = (state, html) => { msg.dataset.state = state; msg.innerHTML = html; };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      email.removeAttribute('aria-invalid');
      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        email.setAttribute('aria-invalid', 'true');
        say('err', 'That email does not look right. Check it and try again.');
        email.focus();
        return;
      }
      if (form.elements.company && form.elements.company.value) return;   // a bot filled the hidden field

      form.classList.add('is-busy');
      if (btn) btn.textContent = form.dataset.busy || 'Sending…';
      say('', '');
      try {
        const body = Object.fromEntries(new FormData(form).entries());
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          form.querySelectorAll('.lp-field, button[type="submit"]').forEach((el) => el.remove());
          say('ok', (form.dataset.done || 'You are on the list.'));
          return;
        }
        say('err', data.message || 'That did not send. Try again in a moment.');
      } catch {
        say('err', 'That did not send — you may be offline. Try again in a moment.');
      } finally {
        form.classList.remove('is-busy');
        if (btn) btn.textContent = label;
      }
    });
  };

  /* An in-page jump should land under the sticky header and move the reading
     position too, so the next Tab goes where the eye went. */
  const anchors = () => {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const t = document.getElementById(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: calm.matches ? 'auto' : 'smooth', block: 'start' });
      t.setAttribute('tabindex', '-1');
      t.focus({ preventScroll: true });
      history.replaceState(null, '', `#${id}`);
    });
  };

  const boot = () => { reveal(); header(); menu(); mode(); annots(); waitlist(); anchors(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
