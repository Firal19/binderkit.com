/* cohort.js — the site's own interactivity, on top of site.js. Everything
   here upgrades markup that already works: the rail is anchors, the sheet is
   a disclosure, the simulator sits over a rendered screen, the clocks are
   text the page already prints. */
(() => {
  'use strict';
  const P = window.PHO || {};
  const $ = P.$ || ((s, r = document) => r.querySelector(s));
  const $$ = P.$$ || ((s, r = document) => Array.from(r.querySelectorAll(s)));
  const root = document.documentElement;
  const calm = P.calm || { matches: false };
  const toast = P.toast || (() => {});
  const pad = (n) => String(n).padStart(2, '0');
  const hhmm = (d = new Date()) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  /* ── Oregon time: the shift is on Pacific time, wherever the reader is ── */
  const ZONE = 'America/Los_Angeles';
  const oregon = () => {
    try {
      const t = new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date());
      return t.replace(/^24/, '00');
    } catch { return hhmm(); }
  };
  const oregonMin = () => { const [h, m] = oregon().split(':').map(Number); return h * 60 + m; };
  const isDay = (min) => min >= 6 * 60 + 55 && min < 19 * 60;

  /* ── the hero clock: Oregon time, and which shift it is ─────────────── */
  const clock = () => {
    const els = $$('[data-oregon]');
    const shorts = $$('[data-oregon-short]');
    const word = $('[data-shift-word]');
    if (!els.length && !shorts.length) return;
    const tick = () => {
      const t = oregon();
      const min = oregonMin();
      els.forEach((el) => { el.textContent = t; });
      shorts.forEach((el) => { el.textContent = t; });
      const day = isDay(min);
      root.dataset.shiftNow = day ? 'day' : 'night';
      if (word) word.textContent = day ? 'Day shift.' : 'Night shift.';
    };
    tick();
    setInterval(tick, 15000);
  };

  /* ── the footer's sign-out time, in the same 24-hour form as the shift ──
     site.js fills [data-clock] in the locale's 12-hour form; these two nodes
     are swapped for fresh ones it no longer holds, and kept on the hour. */
  const signOut = () => {
    const els = $$('.eos [data-clock]').map((el) => { const c = el.cloneNode(false); c.removeAttribute('data-clock'); c.setAttribute('data-clock-24', ''); el.replaceWith(c); return c; });
    if (!els.length) return;
    const tick = () => els.forEach((el) => { el.textContent = hhmm(); });
    tick();
    setInterval(tick, 15000);
  };

  /* ── the rail: a now-dot that travels the stops with the scroll ──────── */
  const rail = () => {
    const nav = $('.rail');
    if (!nav) return;
    const stops = $$('.rail-stop', nav).map((a) => { const h = a.getAttribute('href') || ''; return h.startsWith('#') ? document.getElementById(h.slice(1)) : null; });
    if (!stops.length || !stops.every(Boolean)) return;
    let tick = false;
    const paint = () => {
      tick = false;
      const line = window.scrollY + window.innerHeight * 0.32;
      const tops = stops.map((s) => s.offsetTop);
      let i = -1;
      tops.forEach((t, k) => { if (t <= line) i = k; });
      let pos = 0;
      if (i >= 0) {
        const a = tops[i];
        const b = i + 1 < tops.length ? tops[i + 1] : root.scrollHeight - window.innerHeight * 0.68;
        const f = b > a ? Math.min(1, Math.max(0, (line - a) / (b - a))) : 1;
        pos = i + 1 < tops.length ? (i + f) / (tops.length - 1) : 1;
      }
      nav.style.setProperty('--now', pos.toFixed(4));
    };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on, { passive: true });
    paint();
  };

  /* ── the phone tab bar: the current tab is the last one above the line ── */
  const tabs = () => {
    const nav = $('.tabs[data-tabs]');
    if (!nav) return;
    const links = $$('a[href^="#"]', nav);
    const targets = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    if (!targets.every(Boolean)) return;
    let tick = false;
    const paint = () => {
      tick = false;
      const line = window.scrollY + window.innerHeight * 0.38;
      let best = 0; let bestTop = -1;
      targets.forEach((t, i) => { if (t.offsetTop <= line && t.offsetTop >= bestTop) { best = i; bestTop = t.offsetTop; } });
      links.forEach((a, i) => { if (i === best) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
    };
    const on = () => { if (!tick) { tick = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on, { passive: true });
    paint();
  };

  /* ── larger text, remembered ─────────────────────────────────────────── */
  const textSize = () => {
    const btns = $$('[data-text-toggle]');
    if (!btns.length) return;
    let saved = '';
    try { saved = localStorage.getItem('pho-text') || ''; } catch { saved = ''; }
    const apply = (on) => {
      if (on) root.setAttribute('data-text', 'lg'); else root.removeAttribute('data-text');
      btns.forEach((b) => b.setAttribute('aria-pressed', String(on)));
    };
    apply(saved === 'lg');
    btns.forEach((b) => b.addEventListener('click', () => {
      const on = root.getAttribute('data-text') !== 'lg';
      apply(on);
      try { localStorage.setItem('pho-text', on ? 'lg' : ''); } catch { /* private mode */ }
      toast(on ? 'Larger text, remembered' : 'Regular text');
    }));
  };

  /* ── night shift reaches the phones too ──────────────────────────────── */
  const phoneMode = () => {
    const phones = $$('.phone[data-product="cohort"]');
    if (!phones.length) return;
    const dark = window.matchMedia('(prefers-color-scheme: dark)');
    const current = () => { const m = root.getAttribute('data-mode'); return m === 'dark' || m === 'light' ? m : (dark.matches ? 'dark' : 'light'); };
    const paint = () => {
      const m = current();
      phones.forEach((p) => { p.setAttribute('data-mode', m); const st = $('.status', p); if (st) st.classList.toggle('dark', m === 'dark'); });
    };
    new MutationObserver(paint).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
    dark.addEventListener('change', paint);
    paint();
  };

  /* ── ⌘K: the product's verbs, the stops, the pages ───────────────────── */
  const palette = () => {
    const pal = $('#pal');
    const btn = $('button[aria-controls="pal"]');
    if (!pal || !btn) return;
    const input = $('.pal-in', pal);
    const rows = $$('.pal-l li', pal);
    const none = $('.pal-none', pal);
    const list = $('.pal-l', pal);
    /* Read the rows out of the DOM, not out of the captured array: filter()
       reorders them, and Enter takes whatever is first ON THE SCREEN. */
    const links = () => $$('.pal-l > li:not([hidden]) > a', pal);
    /* RANKING. Rows ship in DOM order — verbs, the five screens, the stops,
       the pages — and the first visible one is what Enter takes. With a
       plain substring filter, typing “handoff” matched the verb row “Read
       the handoff” first and Enter went to /#0702, the top of the front
       page, while the row that goes to /screens#strip-cohort-handoff sat
       second. The feature's own sentence says the opposite. So a match on
       the row's NAME outranks a match anywhere in the row, and a name that
       STARTS with what you typed outranks a name that merely contains it —
       which is what puts “Handoff — the screen” above “Read the handoff”
       without special-casing a kind. Ties keep DOM order, so nothing else
       about this list moves. */
    const items = rows.map((li, i) => {
      const t = $('.pal-t', li);
      return { li, i, name: (t ? t.textContent : li.textContent).trim().toLowerCase(), all: li.textContent.toLowerCase() };
    });
    const score = (it, q) => {
      if (it.name === q) return 4;
      if (it.name.startsWith(q)) return 3;
      if (it.name.split(/[^a-z0-9]+/).some((w) => w && w.startsWith(q))) return 2;
      if (it.name.includes(q)) return 1;
      return it.all.includes(q) ? 0 : -1;
    };
    const filter = () => {
      const q = input.value.trim().toLowerCase();
      let n = 0;
      if (!q) {
        items.forEach((it) => { it.li.hidden = false; list.appendChild(it.li); });
        n = items.length;
      } else {
        const hits = [];
        for (const it of items) {
          const sc = score(it, q);
          it.li.hidden = sc < 0;
          if (sc >= 0) hits.push({ it, sc });
        }
        hits.sort((a, b) => (b.sc - a.sc) || (a.it.i - b.it.i));
        hits.forEach(({ it }) => list.appendChild(it.li));
        n = hits.length;
      }
      none.hidden = n > 0;
      links().forEach((a, i) => a.classList.toggle('is-on', i === 0));
    };
    input.addEventListener('input', filter);
    pal.addEventListener('keydown', (e) => {
      const ls = links();
      if (!ls.length) return;
      const i = ls.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (ls[Math.min(ls.length - 1, i + 1)] || ls[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (i <= 0) input.focus(); else ls[i - 1].focus(); }
      else if (e.key === 'Enter' && document.activeElement === input) { e.preventDefault(); ls[0].click(); }
    });
    pal.addEventListener('focusin', (e) => { const a = e.target.closest('.pal-r'); if (a) links().forEach((x) => x.classList.toggle('is-on', x === a)); });
    const reset = () => { if (!pal.hidden) { input.value = ''; filter(); } };
    btn.addEventListener('click', reset);
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); btn.click(); }
    });
  };

  /* ── the hours are tappable: the step goes on and the phone follows ──
     site.js tour() keys the phone to the step nearest the middle of the
     viewport, so a tap lands the step there and the two agree. The phones
     are switched here as well so the screen changes on the tap itself,
     not a frame later. The listener is capture-phase and stops the event,
     so site.js's own anchor handler (block: start) does not fight it. */
  /* Where a step lands. On a desk the phone stands beside the list, and the
     step goes to the 45% line site.js tour() scans on, so the two agree. At
     <=900 the phone is pinned ACROSS the top of the list (cohort.css: .tour
     is sticky at --hdr, crop + cap tall) and that same line put the tapped
     hour under it — measured at 390x844, the time link at y331 beneath a
     phone that ends at 364. There the step goes where its scroll-margin-top
     says: 8px under the phone. position is read off .tour itself, because
     the sideways-phone tier makes it static again. */
  const pinned = () => { const t = $('.tour'); return Boolean(t) && getComputedStyle(t).position === 'sticky'; };
  const land = (li) => {
    const behavior = calm.matches ? 'auto' : 'smooth';
    if (pinned()) { li.scrollIntoView({ block: 'start', behavior }); return; }
    const y = li.getBoundingClientRect().top + window.scrollY - (window.innerHeight * 0.45 - 80) + 8;
    window.scrollTo({ top: Math.max(0, y), behavior });
  };
  const settle = (li) => {
    const steps = $$('.tl-i');
    steps.forEach((s2) => s2.removeAttribute('data-on'));
    li.setAttribute('data-on', '');
    const key = li.dataset.tour;
    $$('.tour-p[data-tour]').forEach((p2) => { p2.hidden = !(' ' + p2.dataset.tour + ' ').includes(' ' + key + ' '); });
    land(li);
    history.replaceState(null, '', '#' + li.id);
  };
  const tapHours = () => {
    if (!$('.tl')) return;
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tl-go]');
      if (!b) return;
      const li = b.closest('.tl-i');
      if (!li) return;
      e.preventDefault();
      e.stopPropagation();
      settle(li);
    }, true);
  };

  /* ── J and K walk the shift; ? opens the keys sheet; T goes home ─────── */
  const keys = () => {
    const steps = $$('.tl-i');
    const kbtn = $('button[aria-controls="keys"]');
    const typing = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || '') || e.target.isContentEditable;
    const go = (dir) => {
      const cur = steps.findIndex((s) => s.hasAttribute('data-on'));
      const next = steps[Math.max(0, Math.min(steps.length - 1, (cur < 0 ? 0 : cur) + dir))];
      if (!next) return;
      steps.forEach((s) => s.removeAttribute('data-on'));
      next.setAttribute('data-on', '');
      land(next);
      const a = $('.tl-at', next);
      if (a) a.focus({ preventScroll: true });
    };
    document.addEventListener('keydown', (e) => {
      if (typing(e) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (!(e.target instanceof Element)) return;
      if (document.body.classList.contains('is-locked')) return;
      const inTl = Boolean(e.target.closest('.tl'));
      if (e.key === 'j' || (inTl && e.key === 'ArrowDown')) { if (steps.length) { e.preventDefault(); go(1); } }
      else if (e.key === 'k' || (inTl && e.key === 'ArrowUp')) { if (steps.length) { e.preventDefault(); go(-1); } }
      else if (e.key === '?' && kbtn) { e.preventDefault(); kbtn.click(); }
      else if (e.key === 't') { e.preventDefault(); window.scrollTo({ top: 0, behavior: calm.matches ? 'auto' : 'smooth' }); }
    });
  };

  /* ── the hour under the phone follows the step that is on ────────────── */
  const caption = () => {
    const c = $('[data-tour-cap]');
    const tl = $('.tl');
    if (!c || !tl) return;
    const paint = () => { const on = $('.tl-i[data-on]', tl); if (on) c.textContent = `${on.dataset.at} · ${($('h3', on) || {}).textContent || ''}`; };
    new MutationObserver(paint).observe(tl, { attributes: true, subtree: true, attributeFilter: ['data-on'] });
    paint();
  };

  /* ── on a phone, the step that is on is the one just under the phone ──
     site.js tour() keys the phone to the step whose head is nearest 45% of
     the viewport, and the desktop keeps that. At <=900 the phone is pinned
     ACROSS the top of the list, crop + cap tall, so that line is wrong twice
     over: on an 844px-tall phone it sits 16px under the phone, barely right,
     and on a 667px-tall one it sits UNDER the phone, so the screen it showed
     belonged to the step the phone was hiding — one behind the step being
     read. Measured at 375x667 after landing 07:02 the phone still showed
     06:55; at 320x568 five of seven hours showed the hour before. The line
     here is the landed step's own head: 8px of air under the phone plus the
     80px site.js measures a step's head at. It runs after site.js's scan on
     the same scroll frame — both listeners queue one animation frame per
     scroll event, in the order they were added, and this file boots after
     site.js — so its answer is the one that paints. Off a phone, and on a
     sideways phone where .tour is static again, it does nothing. */
  const phoneScan = () => {
    const tour = $('.tour');
    const steps = $$('.tl-i[data-tour]');
    const phones = $$('.tour-p[data-tour]');
    if (!tour || !steps.length || !phones.length) return;
    let ticking = false;
    const scan = () => {
      ticking = false;
      if (!pinned()) return;
      const line = tour.getBoundingClientRect().bottom + 8 + 80;
      let best = null; let bestD = Infinity;
      for (const s of steps) {
        const r = s.getBoundingClientRect();
        const d = Math.abs(r.top + Math.min(r.height / 2, 80) - line);
        if (d < bestD) { bestD = d; best = s; }
      }
      if (!best || best.hasAttribute('data-on')) return;
      steps.forEach((s) => s.removeAttribute('data-on'));
      best.setAttribute('data-on', '');
      const key = best.dataset.tour;
      phones.forEach((p) => { p.hidden = !(' ' + p.dataset.tour + ' ').includes(' ' + key + ' '); });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(scan); } }, { passive: true });
  };

  /* ── 08:00 · the MAR pass, played on the rendered screen ─────────────── */
  const simulator = () => {
    const pane = $('.tour-p[data-tour="marpass+sheet"]');
    const box = $('[data-sim]');
    if (!pane || !box) return;
    const phone = $('.phone', pane);
    const content = phone && $('.content', phone);
    const sheet = phone && $('.sheet-a', phone);
    if (!phone || !content || !sheet) return;
    phone.classList.add('is-sim');
    phone.setAttribute('role', 'group');
    phone.setAttribute('aria-label', 'The MAR pass on iPhone — an interactive demo');
    const html0 = content.innerHTML;
    const sheet0 = sheet.innerHTML;
    const count = $('.sim-n', box);
    const resetBtn = $('.sim-reset', box);
    const GATES = {
      loratadine: 'Loratadine matches a recorded allergy. Recording an override requires a reason.',
      ibuprofen: 'Ibuprofen as-needed — 2 h 08 m since the last dose, under the 4 h minimum interval.',
    };
    let signed = 0; let total = 0; let openRow = null;
    const paint = () => {
      count.textContent = `Signed ${signed} of ${total}`;
      const sub = $('.ltitle-sub', content);
      if (sub) sub.textContent = `WH-1 · 08:00 window · ${total - signed} due`;
    };
    const close = () => { phone.classList.remove('is-open'); if (openRow) { openRow.focus(); openRow = null; } };
    const el = (tag, cls, text) => { const x = document.createElement(tag); if (cls) x.className = cls; if (text != null) x.textContent = text; return x; };
    const openSheet = (row) => {
      openRow = row;
      const title = $('.row-a-t', row).textContent.trim();
      const drug = title.split('·')[0].trim();
      const key = drug.split(' ')[0].toLowerCase();
      const gate = GATES[key];
      sheet.innerHTML = sheet0;
      const sub = $('.sheet-s', sheet);
      if (sub) sub.textContent = `${drug} · Room 2 · 08:00`;
      const vals = $$('.sheet-kv b', sheet);
      if (vals[1]) vals[1].textContent = drug;
      if (vals[2]) vals[2].textContent = drug.replace(/^\S+\s*/, '') || 'As ordered';
      if (vals[3]) vals[3].textContent = /by mouth/i.test(title) ? 'By mouth' : 'As on the order';
      if (vals[4]) vals[4].textContent = `08:00 window · now ${hhmm()}`;
      $$('.notice-a', sheet).forEach((x) => x.remove());
      const actions = $('.btn-row', sheet);
      actions.innerHTML = '';
      const sign = el('button', 'btn-a is-primary sim-sign', gate ? 'Override and sign' : 'Sign as Given');
      sign.type = 'button';
      const cancel = el('button', 'btn-a sim-cancel', 'Cancel');
      cancel.type = 'button';
      let reason = null;
      if (gate) {
        const p = el('p', 'notice-a');
        p.append(el('b', '', 'Gate'), ` ${gate}`);
        actions.before(p);
        const lab = el('label', 'sim-reason-l');
        lab.append(el('span', '', 'Reason for the override — at least ten characters'));
        reason = el('input', 'sim-reason');
        reason.type = 'text'; reason.maxLength = 200; reason.autocomplete = 'off'; reason.placeholder = 'Why the dose is given anyway';
        lab.append(reason);
        actions.before(lab);
        sign.disabled = true;
        reason.addEventListener('input', () => { sign.disabled = reason.value.trim().length < 10; });
      }
      actions.append(sign, cancel);
      cancel.addEventListener('click', close);
      sign.addEventListener('click', () => {
        const st = $('.st-a', row);
        if (st) { st.setAttribute('data-state', 'given'); st.innerHTML = '<i></i>Given'; }
        const main = $('.row-a-main', row);
        if (main) main.append(el('span', 'stamp-a', gate ? `Logged by you · ${hhmm()} · override, reason recorded, manager told` : `Logged by you · ${hhmm()}`));
        row.classList.add('is-signed');
        row.removeAttribute('role'); row.removeAttribute('tabindex'); row.removeAttribute('aria-label');
        signed += 1;
        paint();
        openRow = null;
        phone.classList.remove('is-open');
        toast(gate ? 'Signed with an override — the reason is on the dose' : 'Signed as Given, with who and when');
      });
      phone.classList.add('is-open');
      (reason || sign).focus();
    };
    const bind = () => {
      const rows = $$('.row-a', content).filter((r) => $('.st-a[data-state="due"]', r));
      total = rows.length; signed = 0; paint();
      rows.forEach((r) => {
        r.setAttribute('role', 'button'); r.tabIndex = 0;
        r.setAttribute('aria-label', `${$('.row-a-t', r).textContent.trim()} — open the Six Rights`);
        const on = (e) => {
          if (r.classList.contains('is-signed')) return;
          if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
          e.preventDefault();
          openSheet(r);
        };
        r.addEventListener('click', on);
        r.addEventListener('keydown', on);
      });
    };
    bind();
    resetBtn.addEventListener('click', () => { content.innerHTML = html0; sheet.innerHTML = sheet0; phone.classList.remove('is-open'); openRow = null; bind(); toast('The pass starts over'); });
    const scrim = $('.scrim-a', phone);
    if (scrim) scrim.addEventListener('click', close);
    phone.addEventListener('keydown', (e) => { if (e.key === 'Escape' && phone.classList.contains('is-open')) { e.stopPropagation(); close(); } });
  };

  /* ── 10:30 · airplane mode: entries queue, then catch up with stamps ─── */
  const airplane = () => {
    const box = $('[data-air]');
    if (!box) return;
    const sw = $('.air-sw', box);
    const add = $('.air-add', box);
    const out = $('.air-out b', box);
    const list = $('.air-l', box);
    const phoneList = $('.tour-p[data-tour="residents"] .list-a');
    let room = 2;
    const stampOf = (t) => `Logged by you · ${t}`;
    const pending = () => $$('li[data-pending]', list);
    const outbox = () => { out.textContent = String(pending().length); };
    const settle = (pr, at) => {
      if (!pr) return;
      const st = $('.st-a', pr);
      if (st) { st.setAttribute('data-state', 'given'); st.innerHTML = '<i></i>Logged'; }
      const s = $('.stamp-a', pr);
      if (s) s.textContent = stampOf(at);
    };
    const onPhone = (t, at) => {
      if (!phoneList) return null;
      const r = document.createElement('div');
      r.className = 'row-a';
      r.innerHTML = `<div class="row-a-main"><span class="row-a-t">${t}</span><span class="stamp-a">queued on the device · ${at}</span></div><span class="row-a-r"><span class="st-a" data-state="held"><i></i>Pending</span></span>`;
      phoneList.prepend(r);
      return r;
    };
    add.addEventListener('click', () => {
      const at = hhmm();
      const t = `Care note · Room ${room}`;
      room = (room % 5) + 1;
      const off = sw.getAttribute('aria-checked') === 'true';
      const li = document.createElement('li');
      const label = document.createElement('span'); label.textContent = t;
      const chip = document.createElement('span');
      li.append(label, chip);
      li.dataset.at = at;
      const pr = onPhone(t, at);
      if (pr) li.phoneRow = pr;
      if (off) { li.dataset.pending = '1'; chip.className = 'chip is-pending'; chip.textContent = 'pending'; }
      else { chip.className = 'stamp'; chip.textContent = stampOf(at); settle(pr, at); }
      list.prepend(li);
      outbox();
      toast(off ? 'Queued — no signal. It will catch up.' : 'Logged, and stamped.');
    });
    sw.addEventListener('click', () => {
      const on = sw.getAttribute('aria-checked') !== 'true';
      sw.setAttribute('aria-checked', String(on));
      if (on) { toast('Airplane mode — new entries will queue'); return; }
      const ps = pending().reverse();
      ps.forEach((li, i) => setTimeout(() => {
        delete li.dataset.pending;
        const chip = $('.chip', li);
        if (chip) { chip.className = 'stamp'; chip.textContent = `${stampOf(li.dataset.at)} · synced ${hhmm()}`; }
        settle(li.phoneRow, li.dataset.at);
        outbox();
      }, calm.matches ? 0 : 450 * (i + 1)));
      if (ps.length) toast(`Back online — ${ps.length} catching up`);
    });
  };

  /* ── 18:45 · the handoff sheet composes itself as the step comes in ──── */
  const compose = () => {
    const li = document.getElementById('1845');
    /* One handoff phone, not two. 07:02 and 18:45 are the same screen, and
       rendering it twice cost 5 kB of index.html for a wrapper class. The
       class is put on and taken off around the 18:45 step instead, so the
       07:02 reader still sees the sheet whole. */
    const pane = $('.tour-p[data-tour="handoff"]');
    if (!li || !pane) return;
    const items = $$('.kv-a > *', pane);
    const extra = $$('.passage-a, .receipt-a', pane);
    let timers = [];
    const stop = () => { timers.forEach(clearTimeout); timers = []; };
    const clear = () => { stop(); pane.classList.remove('is-done', 'is-compose'); items.forEach((x) => x.classList.remove('is-in')); extra.forEach((x) => x.classList.remove('is-in')); };
    const run = () => {
      clear();
      pane.classList.add('is-compose');
      const step = calm.matches ? 0 : 220;
      items.forEach((x, i) => timers.push(setTimeout(() => x.classList.add('is-in'), 200 + step * Math.floor(i / 2))));
      const base = 300 + step * Math.ceil(items.length / 2);
      extra.forEach((x, i) => timers.push(setTimeout(() => x.classList.add('is-in'), base + i * 260)));
      timers.push(setTimeout(() => pane.classList.add('is-done'), base + extra.length * 260 + 200));
    };
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) run(); else clear(); }), { threshold: 0.35 });
    io.observe(li);
  };

  /* ── the two stops turn over ─────────────────────────────────────────── */
  const flips = () => $$('[data-flip]').forEach((b) => {
    const back = $('.gate-b', b);
    const front = $('.gate-f', b);
    if (back) back.setAttribute('aria-hidden', 'true');
    b.addEventListener('click', () => {
      const f = b.classList.toggle('is-flipped');
      b.setAttribute('aria-pressed', String(f));
      if (back) back.setAttribute('aria-hidden', String(!f));
      if (front) front.setAttribute('aria-hidden', String(f));
    });
  });

  /* ── who is holding the phone: now, by day, by night ─────────────────── */
  const roles = () => {
    const g = $('[data-roles]');
    const seg = $('.seg');
    if (!g || !seg) return;
    const cards = $$('.role', g);
    const btns = $$('button', seg);
    let mode = 'now';
    const onShift = () => {
      const day = mode === 'day' || (mode === 'now' && isDay(oregonMin()));
      const t = oregon();
      cards.forEach((c) => {
        const on = day ? c.dataset.day === '1' : c.dataset.night === '1';
        c.classList.toggle('is-on', on);
        const l = $('[data-role-on]', c);
        if (l) l.textContent = on ? (mode === 'now' ? `On the phone now · ${t}` : `On the ${day ? 'day' : 'night'} shift`) : (c.dataset.day === '1' ? 'Days only' : 'Weekly, not by shift');
      });
      g.classList.add('is-live');
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.shift === mode)));
    };
    btns.forEach((b) => b.addEventListener('click', () => { mode = b.dataset.shift; onShift(); }));
    onShift();
    setInterval(() => { if (mode === 'now') onShift(); }, 30000);
  };

  /* ── paper, then the record ──────────────────────────────────────────── */
  const compare = () => $$('.cmp').forEach((c) => {
    const r = $('.cmp-r', c);
    if (!r) return;
    const paint = () => {
      c.style.setProperty('--x', `${r.value}%`);
      r.setAttribute('aria-valuetext', r.value < 34 ? 'Mostly paper' : r.value > 66 ? 'Mostly the record' : 'Half paper, half record');
    };
    r.addEventListener('input', paint);
    paint();
  });

  /* ── the questions, filtered as you type ─────────────────────────────── */
  const faqs = () => {
    const q = $('.faq-q');
    const list = $('.faq-w');
    if (!q || !list) return;
    const items = $$('.faq-i', list);
    const n = $('.faq-n');
    const none = $('.faq-none', list);
    q.addEventListener('input', () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      items.forEach((d) => { const hit = !s || d.textContent.toLowerCase().includes(s); d.hidden = !hit; if (hit) { k += 1; if (s) d.open = true; } });
      if (n) n.textContent = `${k} of ${items.length}`;
      if (none) none.hidden = k > 0;
    });
  };

  /* ── how many houses: the tier line, the card, and the waitlist field ── */
  const houses = () => $$('.hs').forEach((hs) => {
    const line = hs.parentElement.querySelector('.hs-line');
    const btns = $$('button', hs);
    const tiers = $$('.tier');
    const sel = $('#joinform select[name="houses"]');
    const LINES = {
      '1': ['One house — Pro, $39 a month. Every plan sees every screen.', 1],
      '2–3': ['Two or three houses — Pro, $39 per house a month.', 1],
      '4–9': ['Four to nine houses — Scale, $79 per house a month, with roll-ups and agency roles.', 2],
      '10+': ['Ten houses and up — Scale, and worth a conversation about the roll-ups you need.', 2],
    };
    const pick = (h) => {
      const [t, i] = LINES[h] || LINES['1'];
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.h === h)));
      if (line) line.textContent = t;
      tiers.forEach((el, k) => el.classList.toggle('is-pick', k === i));
      if (sel && [...sel.options].some((o) => o.value === h)) sel.value = h;
    };
    btns.forEach((b) => b.addEventListener('click', () => pick(b.dataset.h)));
    tiers.forEach((el, k) => el.classList.toggle('is-pick', k === 1));
  });

  /* ── every heading copies its own link ───────────────────────────────── */
  const LINK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a3.75 3.75 0 0 0 5.3 0l2.95-2.95a3.75 3.75 0 0 0-5.3-5.3l-1.2 1.2M14 10a3.75 3.75 0 0 0-5.3 0l-2.95 2.95a3.75 3.75 0 0 0 5.3 5.3l1.2-1.2"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/></svg>';
  const headingLinks = () => $$('main h2[id]').forEach((h) => {
    const sec = h.closest('section[id]');
    const id = sec ? sec.id : h.id;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'h-link';
    b.setAttribute('data-copy', `${location.origin}${location.pathname}#${id}`);
    b.setAttribute('data-copied', 'Link copied');
    b.setAttribute('aria-label', `Copy a link to “${h.textContent.trim()}”`);
    b.innerHTML = LINK;
    h.append(b);
  });

  /* ── back to 06:55 ─────────────────────────────────────────────────────
     It also stands down while a sideways-scrolling strip is on screen: a
     44px disc floating at the right edge lands squarely on the part of a
     panned desktop mock the reader has not reached yet, and covering the
     thing you are asking someone to drag is worse than losing the shortcut
     for one screen. */
  const totop = () => {
    const a = $('.totop');
    if (!a) return;
    const after = document.getElementById('shift');
    const strips = $$('[data-scrollx]');
    if (strips.length && 'IntersectionObserver' in window) {
      const seen = new Set();
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
        a.classList.toggle('is-away', seen.size > 0);
      }, { rootMargin: '-10% 0px -20% 0px' });
      strips.forEach((s) => io.observe(s));
    }
    let tick = false;
    const paint = () => {
      tick = false;
      const th = after ? after.offsetTop + after.offsetHeight * 0.5 : 600;
      a.classList.toggle('is-on', window.scrollY > th);
    };
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
    paint();
  };

  /* ── the end-of-shift sheet folds into an accordion on phones ──────────
     Every disclosure closes below 900, including the first. It used to stay
     open, and on every route but the front page what it held was an index of
     the FRONT PAGE's sections: 431px of it, 386px more than the closed row,
     on all seven routes. On /about that one list was 13% of the document.
     The page index a phone visitor actually wants is in the shift sheet,
     built from the same data the fold reads, one tap from the header.
     Closed, the four disclosures read as four 54px rows between the
     sign-off and the signature, and the footer comes down from 1,337px. */
  const footer = () => {
    const ds = $$('.eos-d');
    if (!ds.length) return;
    const mq = window.matchMedia('(max-width: 900px)');
    const apply = () => ds.forEach((d) => { d.open = !mq.matches; });
    apply();
    mq.addEventListener('change', apply);
  };

  /* ── the day/night switch says what it does ──────────────────────────
     site.js tips() turns an icon-only control's aria-label into a hover
     tooltip, but it skips any control with text inside it — and the
     header's switch carries its visually-hidden Day / Night words, so at
     1440 it was the one chrome control with no tip (measured: data-tip
     null, ::after content none). It gets one here, in the product's own
     words, and it is kept in step with the label site.js rewrites on every
     switch, so the tip always says which shift the press leads to. */
  const shiftTip = () => {
    const b = $('.tr-tools .shiftb[data-mode-toggle]');
    if (!b) return;
    const word = (l) => l.replace(/\bdark\b/, 'night shift').replace(/\blight\b/, 'day shift');
    const paint = () => {
      const l = word(b.getAttribute('aria-label') || '');
      if (!l) return;
      if (b.getAttribute('aria-label') !== l) b.setAttribute('aria-label', l);
      if (b.getAttribute('data-tip') !== l) b.setAttribute('data-tip', l);
    };
    const r = b.getBoundingClientRect();
    if (r.left > window.innerWidth * 0.7) b.setAttribute('data-tip-at', 'end');
    else if (r.left < window.innerWidth * 0.2) b.setAttribute('data-tip-at', 'start');
    new MutationObserver(paint).observe(b, { attributes: true, attributeFilter: ['aria-label', 'data-tip'] });
    paint();
  };

  /* ── the features page: rows by stage ────────────────────────────────── */
  const stages = () => {
    const g = $('.fstage');
    if (!g) return;
    const btns = $$('button', g);
    const rows = $$('.frow');
    const mods = $$('.fmod');
    const n = $('.fs-n', g);
    const none = $('.fs-none');
    let touched = false;
    const show = (s) => {
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.stage === s)));
      let k = 0;
      rows.forEach((r) => { const hit = s === 'all' || r.dataset.stage === s; r.hidden = !hit; if (hit) k += 1; });
      mods.forEach((m) => { m.hidden = !$$('.frow', m).some((r) => !r.hidden); });
      if (n) n.textContent = `${k} of ${rows.length}`;
      if (none) none.hidden = k > 0;
    };
    btns.forEach((b) => b.addEventListener('click', () => { touched = true; show(b.dataset.stage); }));
    /* On a phone the list opens on the first release instead of on all 29.
       #modules is 69% of /features, and what opening on v1 holds back is the
       three rows marked Next and the two marked Later — with the filter that
       brings them back as the 44px row directly above the list and the count
       beside it reading "24 of 29", so nothing is withheld without saying so.
       Above 640 the page still opens on All, which is what the h1 promises on
       a screen wide enough to hold it. A reader who touches the filter owns
       it from then on, at every width. */
    const mq = window.matchMedia('(max-width: 640px)');
    const sync = () => { if (!touched) show(mq.matches ? 'v1' : 'all'); };
    sync();
    mq.addEventListener('change', sync);
  };

  /* ── the pins are asked again the moment the stage has a width ────────
     site.js place() measures each .cal-stage and skips it when the rect is
     zero (`if (!b.width) continue`), and it only ever runs at boot, on
     resize and on fonts.ready. At <=640 both annotated screens sit inside a
     collapsed fold, so at boot they measure 0 and every pin stays hidden —
     and opening the fold never asked again. Measured on /screens at 390
     before this: boot [hidden x4] -> fold opened [hidden x4] -> one pixel of
     resize [visible, --x/--y set]. The headline mechanic of the feature was
     dead on the device the product ships on.

     A ResizeObserver asks again, and only on the 0 -> painted edge: place()
     is itself a resize listener, so anything that fired on every frame would
     be a loop. The initial width is recorded before observe() so the
     callback ResizeObserver fires immediately is not mistaken for that edge
     on a desktop, where the stages are painted from the start. */
  const pins = () => {
    const stages = $$('[data-callouts] .cal-stage');
    if (!stages.length || typeof ResizeObserver === 'undefined') return;
    const was = new WeakMap();
    stages.forEach((el) => was.set(el, el.getBoundingClientRect().width));
    let t = 0;
    const ro = new ResizeObserver((entries) => {
      let woke = false;
      for (const e of entries) {
        const w = e.contentRect.width;
        if (w > 1 && (was.get(e.target) || 0) <= 1) woke = true;
        was.set(e.target, w);
      }
      if (!woke) return;
      clearTimeout(t);
      t = setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    });
    stages.forEach((el) => ro.observe(el));
  };

  /* ── the shift sheet keeps its way out on screen ──────────────────────
     .ssheet-h is sticky now (see cohort.css); this only draws its hairline
     once the sheet has actually been scrolled. */
  const sheetEdge = () => {
    const sh = $('.ssheet');
    if (!sh) return;
    sh.addEventListener('scroll', () => { sh.toggleAttribute('data-scrolled', sh.scrollTop > 4); }, { passive: true });
  };

  const boot = () => {
    clock(); signOut(); rail(); tabs(); textSize(); phoneMode(); palette(); keys(); tapHours(); caption(); phoneScan();
    simulator(); airplane(); compose(); flips(); roles(); compare(); faqs(); houses();
    headingLinks(); totop(); footer(); shiftTip(); stages(); pins(); sheetEdge();
  };
  if (window.PHO) boot(); else document.addEventListener('pho:ready', boot);
})();
