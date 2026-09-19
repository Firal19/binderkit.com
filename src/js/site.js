/* site.js — the page works without it. Everything here is an upgrade on
   something that already functions: the nav links are anchors, the questions
   are <details>, the waitlist is a form with a real action. One listener per
   job, no framework. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

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

  /* ── the header: stuck, and where you are ─────────────────────────── */
  const header = () => {
    const top = $('#top-bar');
    const links = $$('.nav .links a');
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    let ticking = false;
    const paint = () => {
      ticking = false;
      const y = window.scrollY;
      if (top) top.toggleAttribute('data-stuck', y > 8);
      if (targets.length) {
        const line = y + window.innerHeight * 0.32;
        let on = -1;
        targets.forEach((t, i) => { if (t.offsetTop <= line) on = i; });
        links.forEach((a, i) => { if (i === on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
  };

  /* ── the menu ───────────────────────────────────────────────────────── */
  const menu = () => {
    const btn = $('.burger');
    const panel = $('#menu');
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

  /* ── the tour: a phone that follows a timeline ──────────────────────
     Each step names the screen it belongs to; the phone beside the list
     shows the step nearest the middle of the viewport. Decoration only —
     every step's words are on the page whether or not this runs. */
  const tour = () => {
    const steps = $$('.tl-i[data-tour]');
    const phones = $$('.tour-p[data-tour]');
    if (!steps.length || !phones.length) return;
    let current = steps[0].dataset.tour;
    const show = (key) => {
      if (key === current) return;
      current = key;
      phones.forEach((p) => { p.hidden = p.dataset.tour !== key; });
      steps.forEach((s) => { if (s.dataset.tour === key && !s.hasAttribute('data-on')) s.setAttribute('data-on', ''); else if (s.dataset.tour !== key) s.removeAttribute('data-on'); });
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

  /* ── the waitlist ───────────────────────────────────────────────────── */
  const waitlist = () => {
    const form = $('#joinform');
    if (!form) return;
    const msg = $('.form-msg', form);
    const btn = $('button[type="submit"]', form);
    const email = form.elements.email;
    const label = btn ? btn.textContent : 'Join the list';
    const say = (state, text) => { msg.dataset.state = state; msg.textContent = text; };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      email.removeAttribute('aria-invalid');
      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        email.setAttribute('aria-invalid', 'true');
        say('err', 'That email does not look right. Check it and try again.');
        email.focus();
        return;
      }
      if (form.elements.company && form.elements.company.value) return;
      form.classList.add('is-busy');
      if (btn) btn.textContent = form.dataset.busy || 'Sending…';
      say('', '');
      try {
        const body = Object.fromEntries(new FormData(form).entries());
        const res = await fetch(form.action, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json().catch(() => ({}));
        if (res.ok) {
          form.querySelectorAll('.field, button[type="submit"]').forEach((el) => el.remove());
          say('ok', form.dataset.done || 'You are on the list.');
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

  /* An in-page jump lands under the sticky header and moves focus too. */
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

  const boot = () => { reveal(); header(); menu(); tour(); waitlist(); anchors(); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
