/* careshop.js — the store's own interactivity. Everything here upgrades
   markup that already works: the signs are anchors, the drawer is a real
   disclosure, the demos are HTML with their starting numbers printed. */
(() => {
  'use strict';
  const init = () => {
    const { $, $$, calm, toast, root } = window.PHO;
    const io = 'IntersectionObserver' in window;
    const fmt = (n, dec = 2) => Number(n).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });

    /* ── where you are: the tally bar reads the lit sign; ←/→ walk the aisles ──
       MEASURED BUG, fixed here. The dock is the only persistent wayfinding on
       a phone, and it used to spy #aisles alone — the desktop sign strip,
       which is display:none below 900 and carries signs for six of this
       page's fourteen sections. With the fold on, the nine folded sections
       compress to about 128px of scroll each, so the label flickered through
       four names in one thumb flick and then stuck: `cook`, `reserve`,
       `record`, `roles` and `questions` could never be named at all, and the
       last 2,235px of the page — the whole receipt included — still read
       "Checkout · Pricing".

       It now walks every stop the page has: the signs where there are signs
       (they carry the aisle number, which is the store's own numbering), the
       folded sections by the short name the renderer wrote as data-stop, and
       the receipt at the foot. data-stop, NOT data-where — [data-where] is
       the selector for the OUTPUT elements three lines up. */
    const where = () => {
      const bar = $('#top-bar');
      const out = $$('[data-where]');
      const signs = $$('#aisles .sign[href^="#"]');
      if (!bar) return;
      const fallback = bar.getAttribute('data-here') || '';
      const railLinks = $$('.rail a[href^="#"]');
      const railBox = $('.rail');
      const foot = $('#foot');
      const top = (el) => el.getBoundingClientRect().top + window.scrollY;
      /* every stop in document order, each with the shortest true name.
         offsetTop is relative to the offset parent; these sections are, but
         a later wrapper would not be — so measure against the page. */
      const seen = new Set();
      const stops2 = [];
      const addStop = (el, label) => { if (!el || !label || seen.has(el)) return; seen.add(el); stops2.push({ el, label }); };
      signs.forEach((a) => addStop(document.getElementById(a.getAttribute('href').slice(1)), `${a.querySelector('.sign-a')?.textContent || ''} · ${a.querySelector('.sign-t')?.textContent || ''}`.replace(/^ · /, '')));
      $$('[data-stop]').forEach((s) => addStop(s, s.dataset.stop || ''));
      /* and every ticket on the entrance board, so the dock names a stop on
         the nine routes that carry no aisle signs of their own. addStop
         skips an element already named, so a folded section's own data-stop
         still wins — this only fills the gaps. */
      $$('.dir-i').forEach((a) => addStop(document.getElementById(a.getAttribute('href').slice(1)), (a.querySelector('b') || {}).textContent || ''));
      stops2.sort((a, b) => top(a.el) - top(b.el));
      const spy = (links) => {
        const line = window.scrollY + window.innerHeight * 0.32;
        let on = null;
        links.forEach((a) => { const t = document.getElementById(a.getAttribute('href').slice(1)); if (t && t.offsetTop <= line) on = a; });
        return on;
      };
      /* the station rail follows the reader. It is sticky for 4,776px of
         /loop; showing "1 Count · 2 Queue · 3 Approve" for all of it while
         the dock underneath says Cook is leftover desktop chrome. Scrolling
         the rail's own scroller — not scrollIntoView — keeps the page still. */
      let followed = null;
      const follow = () => {
        if (!railBox) return;
        const a = railBox.querySelector('a[aria-current]');
        if (!a || a === followed) return;
        followed = a;
        const max = railBox.scrollWidth - railBox.clientWidth;
        if (max <= 4) return;
        const want = a.offsetLeft - (railBox.clientWidth - a.offsetWidth) / 2;
        railBox.scrollTo({ left: Math.max(0, Math.min(max, want)), behavior: calm.matches ? 'auto' : 'smooth' });
      };
      const paint = () => {
        const line = window.scrollY + window.innerHeight * 0.32;
        let label = fallback;
        if (foot && top(foot) <= line) label = `${fallback} · The receipt`;
        else {
          const rail = railLinks.length ? spy(railLinks) : null;
          if (rail) label = `${fallback} · ${rail.textContent.replace(/^\s*\d+\s*/, '').trim()}`;
          else { let here = null; for (const s of stops2) { if (top(s.el) <= line) here = s; } if (here) label = here.label; }
        }
        out.forEach((el) => { if (el.textContent !== label) el.textContent = label; });
        follow();
      };
      let tick = false;
      window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; paint(); }); } }, { passive: true });
      window.addEventListener('resize', paint, { passive: true });
      /* opening or closing an aisle moves every stop below it */
      document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.fold-s')) requestAnimationFrame(paint); });
      paint();
      /* keyboard: ←/→ move between aisles, Home to the front */
      const stops = signs.map((a) => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
      document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const tag = (e.target.tagName || '').toLowerCase();
        if (['input', 'textarea', 'select'].includes(tag) || e.target.isContentEditable) return;
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        if (!stops.length) return;
        const y = window.scrollY + 8;
        let i = -1;
        stops.forEach((s, n) => { if (s.offsetTop <= y + 4) i = n; });
        const next = e.key === 'ArrowRight' ? Math.min(stops.length - 1, i + 1) : Math.max(0, i - 1);
        if (next === i && e.key === 'ArrowLeft' && i === 0) { window.scrollTo({ top: 0, behavior: calm.matches ? 'auto' : 'smooth' }); return; }
        e.preventDefault();
        const target = stops[next];
        target.scrollIntoView({ behavior: calm.matches ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', `#${target.id}`);
        signs[next]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: calm.matches ? 'auto' : 'smooth' });
      });
    };

    /* ── the loop ring turns with the reader; the strip lights the card in view ── */
    const ring = () => {
      const wrap = $('[data-ring-wrap]');
      if (wrap) {
        const nodes = $$('.ring-n', wrap);
        const station = $('[data-ring-station]', wrap);
        const names = nodes.map((n) => n.querySelector('text')?.textContent || '');
        let lit = -1;
        const paint = () => {
          const r = wrap.getBoundingClientRect();
          const vh = window.innerHeight;
          const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
          wrap.style.setProperty('--lp', p.toFixed(4));
          const i = Math.round(p * nodes.length) % nodes.length;
          if (i !== lit) {
            lit = i;
            nodes.forEach((n, k) => n.classList.toggle('is-lit', k === i));
            if (station) station.textContent = names[i] ? `station ${i + 1} · ${names[i].toLowerCase()}` : 'closes by itself';
          }
        };
        let tick = false;
        window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; paint(); }); } }, { passive: true });
        window.addEventListener('resize', paint, { passive: true });
        paint();
      }
      const strip = $('[data-loop-strip]');
      const dots = $('[data-ls-dots]');
      if (strip && io) {
        const cards = $$('.ls-c', strip);
        if (dots) dots.innerHTML = cards.map((c, i) => `<i class="${i === 0 ? 'is-on' : ''}"></i>`).join('');
        const obs = new IntersectionObserver((es) => {
          for (const e of es) {
            if (!e.isIntersecting) continue;
            const i = cards.indexOf(e.target);
            cards.forEach((c, k) => c.classList.toggle('is-on', k === i));
            if (dots) $$('i', dots).forEach((d, k) => d.classList.toggle('is-on', k === i));
          }
        }, { root: strip, threshold: .6 });
        cards.forEach((c) => obs.observe(c));
      }
    };

    /* ── the fan: dots on the phone carousel; the phone in view is the dot lit ── */
    const fan = () => {
      const f = $('[data-fan]');
      const dots = $('[data-fan-dots]');
      if (!f || !dots) return;
      const phones = $$('[data-fan-p]', f);
      const names = phones.map((p) => p.querySelector('.phone')?.getAttribute('aria-label')?.replace(/^.*: /, '') || 'Phone');
      dots.innerHTML = phones.map((p, i) => `<button type="button" class="fan-dot" aria-pressed="${i === 0 ? 'true' : 'false'}" aria-label="Show ${names[i]}"><i></i></button>`).join('');
      const btns = $$('.fan-dot', dots);
      const ordered = () => phones.slice().sort((a, b) => a.offsetLeft - b.offsetLeft);
      btns.forEach((b, i) => b.addEventListener('click', () => {
        const target = phones[i];
        f.scrollTo({ left: target.offsetLeft - (f.clientWidth - target.clientWidth) / 2, behavior: calm.matches ? 'auto' : 'smooth' });
      }));
      const paint = () => {
        const mid = f.scrollLeft + f.clientWidth / 2;
        let best = 0, d = Infinity;
        phones.forEach((p, i) => { const c = p.offsetLeft + p.clientWidth / 2; const dd = Math.abs(c - mid); if (dd < d) { d = dd; best = i; } });
        btns.forEach((b, i) => b.setAttribute('aria-pressed', String(i === best)));
      };
      f.addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true });
      ordered();
      paint();
    };

    /* ── the scanner: a sweep, then the item lands on the shelf list ─────── */
    const scan = () => {
      const s = $('[data-scan]');
      if (!s) return;
      const phone = s.closest('[data-fan-p]');
      const list = phone && $('.list-a', phone);
      const btn = $('[data-scan-again]');
      let landed = null;
      const run = () => {
        if (landed) { landed.remove(); landed = null; }
        s.classList.remove('is-found');
        s.classList.add('is-scanning');
        const wait = calm.matches ? 120 : 2600;
        setTimeout(() => {
          s.classList.remove('is-scanning');
          s.classList.add('is-found');
          if (list) {
            const row = document.createElement('div');
            row.className = 'row-a is-new';
            row.innerHTML = '<div class="row-a-main"><span class="row-a-t">Oat milk · 1 gal</span><span class="row-a-s">Scanned just now · no par yet</span></div><span class="row-a-r"><span class="st-a" data-state="stocked"><i></i>Stocked</span><span class="row-a-v"><span class="num-a">1</span></span></span>';
            list.prepend(row);
            landed = row;
          }
        }, wait);
      };
      if (btn) btn.addEventListener('click', run);
      if (io) {
        const obs = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { obs.disconnect(); setTimeout(run, 500); } }, { threshold: .3 });
        obs.observe(s);
      } else run();
    };

    /* ── the numbers count up when they enter view ───────────────────────── */
    const counters = () => {
      const els = $$('[data-count]');
      if (!els.length) return;
      const go = (el) => {
        const end = parseFloat(el.dataset.count);
        const dec = parseInt(el.dataset.dec || '0', 10);
        if (Number.isNaN(end) || calm.matches) return;
        const t0 = performance.now();
        const dur = 1100;
        const step = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(end * e, dec);
          if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(end, dec);
        };
        requestAnimationFrame(step);
      };
      if (!io) return;
      const obs = new IntersectionObserver((es) => { for (const e of es) { if (!e.isIntersecting) continue; obs.unobserve(e.target); go(e.target); } }, { threshold: .5 });
      els.forEach((el) => obs.observe(el));
    };

    /* ── the par slider ──────────────────────────────────────────────────── */
    const par = () => {
      $$('[data-par]').forEach((d) => {
        const range = $('[data-par-range]', d);
        const out = $('[data-par-out]', d);
        const state = $('[data-par-state]', d);
        const text = $('[data-par-text]', d);
        const queue = $('[data-par-queue]', d);
        const empty = $('.mini-q-empty', d);
        const hand = parseInt(d.dataset.hand || '1', 10);
        const name = $('.shelf-t b', d)?.textContent || 'Rice';
        if (!range) return;
        const paint = (first) => {
          const p = parseInt(range.value, 10);
          out.textContent = String(p);
          range.style.setProperty('--fill', `${(p / parseInt(range.max, 10)) * 100}%`);
          const gap = p - hand;
          const st = gap > 0 ? 'short' : hand > p + 1 && p > 0 ? 'over' : 'stocked';
          state.dataset.state = st;
          text.textContent = gap > 0 ? `${gap} below par` : st === 'over' ? 'Over — a note, not an alarm' : 'Stocked';
          const has = queue.children.length > 0;
          if (gap > 0) {
            if (!has) {
              const li = document.createElement('li'); li.className = 'mini-q-r is-new';
              li.innerHTML = `<b>${name}</b><span>Par breach · ${gap} below par</span>`;
              queue.appendChild(li);
            } else { const s = $('span', queue.firstElementChild); if (s) s.textContent = `Par breach · ${gap} below par`; }
            empty.hidden = true;
          } else { queue.innerHTML = ''; empty.hidden = false; }
          d.dataset.state = st;
          if (!first && p === 0) toast('Par 0 — nothing is ever short');
        };
        range.addEventListener('input', () => paint(false));
        paint(true);
      });
    };

    /* ── approve the queue ───────────────────────────────────────────────── */
    const approve = () => {
      $$('[data-approve]').forEach((d) => {
        const stamp = $('[data-approve-stamp]', d);
        const STAGES = ['Pending', 'Approved', 'In cart', 'Bought'];
        const VERB = { Pending: 'Approve', Approved: 'To cart', 'In cart': 'Bought' };
        let mine = 0;
        d.addEventListener('click', (e) => {
          const b = e.target.closest('[data-approve-btn]');
          if (!b) return;
          const row = b.closest('.q-row');
          const i = STAGES.indexOf(row.dataset.stage);
          if (i < 0 || i >= STAGES.length - 1) return;
          const next = STAGES[i + 1];
          if (row.dataset.stage === 'Pending') { mine += 1; stamp.textContent = `${mine} approved by you`; stamp.classList.remove('is-hit'); void stamp.offsetWidth; stamp.classList.add('is-hit'); }
          row.dataset.stage = next;
          $('[data-stage-label]', row).textContent = next;
          const label = $('span', b); if (label) label.textContent = VERB[next] || next;
          row.classList.remove('is-moving'); void row.offsetWidth; row.classList.add('is-moving');
          if (next === 'Bought') toast('Bought — one purchase movement, one price on the ledger');
        });
      });
    };

    /* ── the allergen chips drive the Thursday warning on the menu phone ─── */
    const allergen = () => {
      $$('[data-allergen]').forEach((d) => {
        const note = $('[data-allergen-note]', d);
        const chips = $$('.chip[data-tag]', d);
        const wrap = d.closest('.menu-g') || document;
        const phoneNote = $('[data-menu-phone] .notice-a', wrap);
        const thu = $$('[data-menu-phone] .row-a', wrap).find((r) => /^Thu/.test(r.querySelector('.row-a-t')?.textContent || ''));
        const thuState = thu && $('.st-a', thu);
        const original = { note: phoneNote ? phoneNote.innerHTML : '', st: thuState ? thuState.outerHTML : '' };
        const paint = () => {
          const peanut = chips.find((c) => c.dataset.tag === 'peanut');
          const on = !peanut || peanut.getAttribute('aria-pressed') === 'true';
          note.textContent = on ? note.dataset.on : note.dataset.off;
          note.dataset.state = on ? 'warn' : 'clear';
          if (phoneNote) {
            if (on) { phoneNote.innerHTML = original.note; phoneNote.hidden = false; }
            else { phoneNote.innerHTML = '<b>Allergen</b> Thursday · clear. No resident on this menu carries a peanut tag.'; }
            phoneNote.classList.add('is-lit'); setTimeout(() => phoneNote.classList.remove('is-lit'), 900);
          }
          if (thuState) {
            if (on) thuState.outerHTML = original.st;
            else { thuState.setAttribute('data-state', 'stocked'); thuState.innerHTML = '<i></i>Clear'; }
          }
        };
        chips.forEach((c) => c.addEventListener('click', () => { c.setAttribute('aria-pressed', c.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); paint(); }));
      });
    };

    /* ── the reserve calculator, in gallons or litres ────────────────────── */
    const reserve = () => {
      $$('[data-reserve]').forEach((d) => {
        const inp = (k) => $(`[data-r="${k}"]`, d);
        const target = $('[data-r-target]', d), hand = $('[data-r-hand]', d), gap = $('[data-r-gap]', d);
        const state = $('[data-r-state]', d), stateT = $('[data-r-state-t]', d);
        const gapBox = gap.closest('.is-gap');
        const HAND_GAL = 6;
        const L = 3.785;
        const unit = () => d.dataset.unit;
        const show = (gal) => unit() === 'l' ? fmt(gal * L, 1) : fmt(gal, gal % 1 ? 1 : 0);
        const paint = () => {
          const days = Math.max(0, parseFloat(inp('days').value) || 0);
          const beds = Math.max(0, parseFloat(inp('beds').value) || 0);
          const perRaw = Math.max(0, parseFloat(inp('per').value) || 0);
          const per = unit() === 'l' ? perRaw / L : perRaw;
          const t = days * beds * per;
          const g = t - HAND_GAL;
          target.textContent = show(t);
          hand.textContent = show(HAND_GAL);
          gap.textContent = show(Math.max(0, g));
          const short = g > 0;
          state.dataset.state = short ? 'short' : 'stocked';
          stateT.textContent = short ? 'Gap · files into the queue' : 'Covered';
          gapBox.toggleAttribute('data-ok', !short);
          $$('[data-unit-l]', d).forEach((el) => { el.textContent = unit() === 'l' ? 'L' : 'gal'; });
        };
        $$('[data-unit-set]', d).forEach((b) => b.addEventListener('click', () => {
          const to = b.dataset.unitSet;
          if (to === unit()) return;
          const per = inp('per');
          const v = parseFloat(per.value) || 0;
          per.value = to === 'l' ? fmt(v * L, 1) : fmt(v / L, 1);
          d.dataset.unit = to;
          $$('[data-unit-set]', d).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
          paint();
        }));
        ['days', 'beds', 'per'].forEach((k) => inp(k).addEventListener('input', paint));
        paint();
      });
    };

    /* ── price memory: site.js toggles the tapped one; this closes the others ── */
    const prices = () => {
      $$('[data-price-memory]').forEach((d) => {
        const btns = $$('[data-pm]', d);
        btns.forEach((b) => b.addEventListener('click', () => {
          btns.forEach((x) => { if (x === b) return; x.setAttribute('aria-expanded', 'false'); const p = document.getElementById(x.getAttribute('aria-controls')); if (p) p.hidden = true; });
        }));
      });
    };

    /* ── the store picker re-totals from what the ledger knows ───────────── */
    const stores = () => {
      $$('[data-stores]').forEach((d) => {
        const chips = $$('[data-store]', d);
        const rows = $$('.sp-r', d);
        const total = $('[data-sp-total]', d), name = $('[data-sp-store]', d), note = $('[data-sp-note]', d);
        const paint = (store) => {
          let sum = 0, missing = 0;
          rows.forEach((r) => { const at = r.dataset.storeOf === store; r.classList.toggle('is-off', !at); if (at) sum += parseFloat(r.dataset.price) || 0; else missing += 1; });
          total.textContent = `$${fmt(sum)}`;
          name.textContent = store;
          note.textContent = missing ? `Incomplete — ${missing} item${missing > 1 ? 's' : ''} with no price at ${store} on the ledger yet.` : 'Every line has a price at this shop.';
        };
        chips.forEach((c) => c.addEventListener('click', () => { chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c))); paint(c.dataset.store); }));
        paint(chips.find((c) => c.getAttribute('aria-pressed') === 'true')?.dataset.store || 'WinCo');
      });
    };

    /* ── expiry watch: sort by urgency or by value, with the rows sliding ─── */
    const ladder = () => {
      $$('[data-ladder]').forEach((d) => {
        const list = $('.lad-l', d);
        const btns = $$('[data-sort]', d);
        const sort = (by) => {
          const rows = $$('.lad-r', list);
          const first = new Map(rows.map((r) => [r, r.getBoundingClientRect().top]));
          rows.sort((a, b) => by === 'value' ? parseFloat(b.dataset.val) - parseFloat(a.dataset.val) : parseFloat(a.dataset.days) - parseFloat(b.dataset.days));
          rows.forEach((r) => list.appendChild(r));
          if (calm.matches) return;
          rows.forEach((r) => {
            const dy = first.get(r) - r.getBoundingClientRect().top;
            if (!dy) return;
            r.style.transition = 'none'; r.style.transform = `translateY(${dy}px)`;
            requestAnimationFrame(() => { r.style.transition = ''; r.style.transform = ''; });
          });
        };
        btns.forEach((b) => b.addEventListener('click', () => { btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); sort(b.dataset.sort); }));
      });
    };

    /* ── cook mode: complete step four and the shelf goes down, once ─────── */
    const cook = () => {
      $$('[data-cook]').forEach((d) => {
        const btn = $('[data-cook-complete]', d);
        if (!btn) return;
        let done = false;
        btn.addEventListener('click', () => {
          if (done) { toast('Already completed — stock went down once'); return; }
          done = true;
          $$('.cook-s', d).forEach((s) => { s.dataset.state = 'done'; });
          const parts = [];
          $$('[data-shelf]', d).forEach((n) => {
            const v = parseInt(n.dataset.start, 10) - parseInt(n.dataset.take, 10);
            n.textContent = String(v);
            n.classList.add('is-down');
            const unit = n.closest('.shelf-row')?.querySelector('.shelf-t span')?.textContent || '';
            parts.push(`−${n.dataset.take} ${unit} ${n.closest('.shelf-row')?.querySelector('.shelf-t b')?.textContent.toLowerCase() || ''}`.trim());
          });
          $('span', btn).textContent = 'Completed';
          btn.setAttribute('aria-disabled', 'true');
          toast(`${parts.join(' · ')} — written once`);
        });
      });
    };

    /* ── ⌘K ─────────────────────────────────────────────────────────────── */
    const palette = () => {
      const pal = $('#palette');
      const btn = $('button[aria-controls="palette"]');
      if (!pal || !btn) return;
      const inp = $('.pal-in', pal);
      /* the three drawer headings are <li> too, and they are neither
         destinations nor arrow stops: they leave `items` so Enter can
         never land on one, and they leave the list entirely the moment a
         query is typed, because a filtered palette is one flat list of
         hits rather than three labelled drawers with holes in them. */
      const items = $$('.pal-l li:not(.pal-h)', pal);
      const heads = $$('.pal-l .pal-h', pal);
      const empty = $('.pal-empty', pal);
      document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); btn.click(); }
      });
      const filter = () => {
        const q = inp.value.trim().toLowerCase();
        let n = 0, firstOn = null;
        items.forEach((li) => { const hit = !q || (li.querySelector('.pal-r')?.dataset.verb || '').includes(q) || (li.textContent || '').toLowerCase().includes(q); li.hidden = !hit; li.removeAttribute('data-on'); if (hit) { n += 1; if (!firstOn) firstOn = li; } });
        if (firstOn) firstOn.setAttribute('data-on', '');
        heads.forEach((h) => { h.hidden = !!q; });
        empty.hidden = n > 0;
      };
      inp.addEventListener('input', filter);
      inp.addEventListener('keydown', (e) => {
        const on = items.filter((li) => !li.hidden);
        const i = on.findIndex((li) => li.hasAttribute('data-on'));
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); const j = e.key === 'ArrowDown' ? Math.min(on.length - 1, i + 1) : Math.max(0, i - 1); on.forEach((li, k) => li.toggleAttribute('data-on', k === j)); on[j]?.scrollIntoView({ block: 'nearest' }); }
        if (e.key === 'Enter') { const a = on[i >= 0 ? i : 0]?.querySelector('a'); if (a) { e.preventDefault(); a.click(); } }
      });
      btn.addEventListener('click', () => { if (!pal.hidden) { inp.value = ''; filter(); } });
    };

    /* ── the receipt's groups: open everywhere, closed on a phone ─────────
       The markup ships <details open>, so with scripting off, on a printer
       and above 640px the whole fifteen-line list is present — nothing is
       ever removed at a width. Below 640 it closes what the reader has not
       opened themselves, which turns 688px of duplicated navigation into
       two subtotal lines. A reader who opens one keeps it open across a
       rotation; beforeprint opens them all and never takes that back,
       because a printed receipt with a collapsed section is a bad receipt. */
    const rcGroups = () => {
      const ds = $$('.rc-d');
      if (!ds.length) return;
      const mq = window.matchMedia('(max-width: 640px)');
      let printing = false;
      const sync = () => ds.forEach((d) => { d.open = printing || !mq.matches || d.dataset.kept === '1'; });
      ds.forEach((d) => d.addEventListener('toggle', () => {
        if (printing || !mq.matches) return;
        d.dataset.kept = d.open ? '1' : '';
      }));
      mq.addEventListener('change', sync);
      window.addEventListener('beforeprint', () => { printing = true; sync(); });
      window.addEventListener('afterprint', () => { printing = false; sync(); });
      sync();
    };

    /* ── the receipt prints itself as it enters view ─────────────────────── */
    const receipt = () => {
      const rc = $('[data-receipt]');
      if (!rc) return;
      const lines = $$('.rc-top, .rc-h, .rc-l, .rc-tear, .rc-block, .rc-mail, .rc-thanks, .rc-tearlink, .rc-by, .rc-fine', rc).filter((el) => !el.closest('.rc-l') || el.classList.contains('rc-l'));
      const finish = () => { rc.classList.add('is-done'); lines.forEach((l) => l.classList.add('is-printed')); };
      if (!io || calm.matches) { finish(); return; }
      const obs = new IntersectionObserver((es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        obs.disconnect();
        lines.forEach((l, i) => setTimeout(() => l.classList.add('is-printed'), 60 * i));
        setTimeout(() => rc.classList.add('is-done'), 60 * lines.length + 400);
      }, { threshold: .08 });
      obs.observe(rc);
      setTimeout(finish, 9000);
    };

    /* ── "show me": light the row on the phone beside the text ───────────── */
    const showMe = () => {
      $$('[data-show]').forEach((b) => b.addEventListener('click', () => {
        const sec = b.closest('.sec, .st-g, .aisle-g') || document;
        const text = b.dataset.show.toLowerCase();
        const cands = $$('.phone .row-a, .phone .aisle-r, .phone .steps-i, .phone .lad-i, .phone .notice-a', sec);
        const hit = cands.find((r) => (r.textContent || '').toLowerCase().includes(text));
        $$('[data-show]', sec).forEach((x) => x.setAttribute('aria-pressed', 'false'));
        $$('.is-lit', sec).forEach((x) => x.classList.remove('is-lit'));
        if (!hit) { toast('Not on this screen'); return; }
        b.setAttribute('aria-pressed', 'true');
        hit.classList.add('is-lit');
        const content = hit.closest('.content');
        if (content) content.scrollTo({ top: Math.max(0, hit.offsetTop - 120), behavior: calm.matches ? 'auto' : 'smooth' });
        const ph = hit.closest('.ph');
        if (ph && window.innerWidth <= 900) { const r = ph.getBoundingClientRect(); if (r.top < 0 || r.bottom > window.innerHeight) ph.scrollIntoView({ block: 'center', behavior: calm.matches ? 'auto' : 'smooth' }); }
      }));
    };

    /* ── the rules legend: one popover open at a time ────────────────────── */
    const legend = () => {
      const l = $('[data-conf-legend]');
      if (!l) return;
      const ds = $$('details', l);
      ds.forEach((d) => {
        d.addEventListener('toggle', () => { if (d.open) ds.forEach((o) => { if (o !== d) o.open = false; }); });
        const s = $('summary', d);
        if (s) s.addEventListener('click', () => ds.forEach((o) => { if (o !== d) o.open = false; }));
      });
      document.addEventListener('click', (e) => { if (!e.target.closest('[data-conf-legend]')) ds.forEach((o) => { o.open = false; }); });
    };

    /* ── the stickers peel on press, not only on hover ───────────────────── */
    const stickers = () => {
      $$('.rc-soc .soc-i').forEach((a) => {
        a.addEventListener('pointerdown', () => a.classList.add('is-peel'));
        ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => a.addEventListener(ev, () => setTimeout(() => a.classList.remove('is-peel'), 220)));
      });
    };

    /* ── the entrance board, and the address of the aisle you are in ─────
       Two jobs, one scroll listener, because they answer the same
       question: which stop is the reader standing in. The board marks it
       with aria-current and pushes that ticket into view inside its OWN
       scroller — never scrollIntoView, which would move the page under a
       thumb that is already moving it. The dock's "You are in" button
       takes the same id and keeps its data-copy in step, so the shared
       [data-copy] verb — which reads the attribute at the moment of the
       press — hands over the exact address of the aisle on screen.
       Nothing here runs on a page with neither. */
    const board = () => {
      const links = $$('.dir-i');
      const cp = $('[data-here-copy]');
      if (!links.length && !cp) return;
      const base = cp ? cp.getAttribute('data-copy') : '';
      const box = links.length ? links[0].closest('.dir-l-o') : null;
      let last = null;
      const paint = () => {
        const line = window.scrollY + window.innerHeight * 0.32;
        let on = null;
        links.forEach((a) => {
          const t = document.getElementById(a.getAttribute('href').slice(1));
          if (t && t.getBoundingClientRect().top + window.scrollY <= line) on = a;
        });
        if (on !== last) {
          if (last) last.removeAttribute('aria-current');
          if (on) on.setAttribute('aria-current', 'true');
          last = on;
          if (on && box) {
            const max = box.scrollWidth - box.clientWidth;
            if (max > 4) box.scrollTo({ left: Math.max(0, Math.min(max, on.offsetLeft - (box.clientWidth - on.offsetWidth) / 2)), behavior: calm.matches ? 'auto' : 'smooth' });
          }
        }
        if (cp) cp.setAttribute('data-copy', on ? base + on.getAttribute('href') : base);
      };
      let t = false;
      const tick = () => { if (!t) { t = true; requestAnimationFrame(() => { t = false; paint(); }); } };
      window.addEventListener('scroll', tick, { passive: true });
      document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest('.fold-s')) requestAnimationFrame(paint); });
      paint();
    };

    /* ── the annotated till: a keyboard path to the callouts ───────────
       MEASURED BUG, fixed here. site.js binds BOTH pointerover and focusin
       to light a callout, but nothing inside the widget can take focus —
       the pins are aria-hidden decorations and the sentences are plain
       <li> — so the focusin half was unreachable and the feature was
       pointer-only. Measured on /shelf at 390px: 0 focusable elements
       inside [data-callouts].

       The sentence is the right target rather than the pin. It is the
       readable half, it is already in reading order, and it is a 346x110
       box where the pin is 28x28. One attribute turns on the handler that
       was already written; the ring comes from this sheet's own
       :focus-visible. The pin stays decorative and stays aria-hidden. */
    const callouts = () => {
      for (const s of $$('[data-callouts] .cal-i[data-cal]')) {
        if (!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '0');
      }
    };

    where(); ring(); fan(); scan(); counters(); par(); approve(); allergen(); reserve(); prices(); stores(); ladder(); cook(); palette(); rcGroups(); receipt(); showMe(); legend(); stickers(); board(); callouts();
  };
  if (window.PHO) init(); else document.addEventListener('pho:ready', init, { once: true });
})();
