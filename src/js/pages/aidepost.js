/* aidepost.com — the page turns over.
   Everything here upgrades markup that already reads and works: the switch
   sets one attribute on <html> and CSS does the rest; the toys are buttons
   and range inputs with their resting state rendered; the sheets are the
   kit's aria-controls panels. Runs after site.js, through window.PHO. */
(() => {
  'use strict';
  const PHO = window.PHO;
  if (!PHO) return;
  const { $, $$, calm, toast, root } = PHO;
  const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch { /* private */ } } };
  const sess = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* private */ } } };
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const smooth = () => (calm.matches ? 'auto' : 'smooth');
  const initials = (name) => String(name).split(/\s+/).map((w) => w.replace(/[^A-Za-z]/g, '').charAt(0)).filter(Boolean).join('').slice(0, 2).toUpperCase();
  const pageOf = () => (($('main') || {}).dataset || {}).page || 'home';
  let explicitAt = 0;

  /* ── the two sides ─────────────────────────────────────────────────── */
  const SIDES = ['provider', 'caregiver'];
  const paintSide = () => {
    const s = root.dataset.side;
    $$('button[data-side-set]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.sideSet === s)));
  };
  const setSide = (s, remember = true) => {
    if (!SIDES.includes(s)) return;
    const changed = root.dataset.side !== s;
    root.dataset.side = s;
    if (remember) store.set('ap-side', s);
    paintSide();
    if (changed) document.dispatchEvent(new CustomEvent('ap:side', { detail: s }));
  };
  const sides = () => {
    const saved = store.get('ap-side');
    setSide(SIDES.includes(saved) ? saved : pageOf() === 'caregivers' ? 'caregiver' : 'provider', false);
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-side-set]');
      if (b) { setSide(b.dataset.sideSet); explicitAt = Date.now(); return; }
      const half = e.target.closest('[data-side-half]');
      if (half && e.target.closest('a')) { setSide(half.dataset.sideHalf); explicitAt = Date.now(); }
    });
    /* the waitlist's "You are" follows the side until the reader touches it */
    const sel = $('#joinform select[name="houses"]');
    if (sel) {
      sel.addEventListener('change', () => { sel.dataset.touched = '1'; });
      const follow = () => {
        if (sel.dataset.touched) return;
        const care = [...sel.options].find((o) => /caregiver/i.test(o.value));
        if (root.dataset.side === 'caregiver' && care) sel.value = care.value;
        else if (root.dataset.side === 'provider' && sel.value === (care && care.value)) sel.selectedIndex = 0;
      };
      document.addEventListener('ap:side', follow);
      follow();
    }
    /* the front page turns over as you scroll into the dark half */
    const half = $('[data-dark-half]');
    if (!half || half.classList.contains('is-page')) return;
    let ticking = false; let wasIn = false;
    const scan = () => {
      ticking = false;
      if (Date.now() - explicitAt < 1200) return;
      const r = half.getBoundingClientRect();
      const line = window.innerHeight * 0.45;
      const inDark = r.top < line && r.bottom > line;
      if (inDark !== wasIn) { wasIn = inDark; setSide(inDark ? 'caregiver' : 'provider', false); }
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(scan); } }, { passive: true });
  };

  /* ── keys: 1 and 2 switch sides, ⌘K the verbs, ? the card ──────────── */
  const togglePanel = (id) => { const b = $(`button[aria-controls="${id}"]`); if (b) b.click(); };
  const keys = () => {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') { e.preventDefault(); togglePanel('pal'); return; }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (e.key === '1') { setSide('provider'); explicitAt = Date.now(); toast('I run a house'); }
      else if (e.key === '2') { setSide('caregiver'); explicitAt = Date.now(); toast('I’m a caregiver'); }
      else if (e.key === '?') { e.preventDefault(); togglePanel('keys'); }
    });
  };

  /* ── the real day ──────────────────────────────────────────────────── */
  const tonight = () => {
    const el = $('[data-tonight] .tonight-v');
    if (!el) return;
    const today = DAYS[new Date().getDay()];
    el.textContent = '';
    const b = document.createElement('b'); b.textContent = today; el.appendChild(b);
    $$('.board tbody tr').forEach((tr) => {
      const name = ($('th', tr) || {}).textContent || '';
      const cell = $(`[data-day="${today}"]`, tr);
      const who = cell ? ($('.cell-t', cell) || cell).textContent.trim() : '—';
      el.appendChild(document.createTextNode(` · ${name.trim()} `));
      const w = document.createElement('span'); w.textContent = who; if (cell && cell.classList.contains('is-open')) w.className = 'is-open'; el.appendChild(w);
    });
  };
  const realDay = () => {
    const d = new Date(); const dow = d.getDay(); const today = DAYS[dow];
    const live = $('[data-live]');
    if (live) { const n = (6 - dow + 7) % 7; live.textContent = n === 0 ? 'That’s tonight.' : n === 1 ? 'That’s tomorrow night.' : `That’s in ${n} days.`; }
    $$('.board th[data-day], .pb-g th[data-day]').forEach((th) => { th.classList.toggle('is-soon', th.dataset.day === 'Sat'); th.classList.toggle('is-today', th.dataset.day === today); });
    $$('.ft-day[data-day], .wkc-d[data-day]').forEach((el) => el.toggleAttribute('data-today', el.dataset.day === today));
    /* the phone strip opens on the story: the day with the open shift */
    const strip = $('.wkc'); const openCard = strip && $('.wkc-d.has-open', strip);
    if (strip && openCard && strip.offsetParent) strip.scrollLeft = Math.max(0, openCard.offsetLeft - 12);
    tonight();
  };

  /* ── the claim: how Saturday night gets covered ─────────────────────── */
  const claim = (() => {
    const box = $('[data-claim]');
    if (!box) return { open() {}, act() {} };
    const steps = $('.claim-steps', box); const rec = $('[data-claim-rec]', box);
    const btn = (k) => $(`[data-claim-act="${k}"]`, box);
    const cell = $('[data-cell-open]'); const cellT = cell && $('.cell-t', cell); const cellI = cell && $('.cell-i', cell);
    const say = (n, t) => { const el = $(`[data-cs-r="${n}"]`, box); if (el) el.textContent = t; };
    const setStep = (n) => { steps.dataset.step = String(n); $$('.cs', steps).forEach((li) => { const s = Number(li.dataset.s); li.classList.toggle('is-on', s <= n); li.classList.toggle('is-now', s === n); }); };
    const later = (fn, ms) => setTimeout(fn, calm.matches ? 0 : ms);
    const opener = $('button[aria-controls="claim"]');
    const open = () => { if (box.hidden && opener) opener.click(); box.scrollIntoView({ behavior: smooth(), block: 'nearest' }); };
    const act = (k) => {
      if (k === 'offer' && !btn('offer').disabled) {
        setStep(1); btn('offer').disabled = true; say(1, 'Offered to 3 · Fri 09:12 — waiting.');
        later(() => { say(1, 'Offered to 3 · Fri 09:12 — nobody accepted by Friday evening. The manager and the provider are told.'); btn('post').disabled = false; btn('post').focus(); }, 900);
      } else if (k === 'post' && !btn('post').disabled) {
        setStep(2); btn('post').disabled = true; say(2, 'Posted outward · Fri 17:40 — visible to signed-in relief workers whose area covers WH-1. Never public.');
        later(() => { setStep(3); say(3, 'R. Alemu claimed it · Fri 18:02 — the first claim stands. Awaiting your confirmation.'); btn('confirm').hidden = false; btn('confirm').focus(); }, 900);
      } else if (k === 'confirm') {
        say(3, 'R. Alemu claimed it · Fri 18:02 — confirmed · Fri 18:05. She is told, and can now clock in.');
        btn('confirm').hidden = true; btn('reset').hidden = false; steps.dataset.step = '4';
        if (cell) { cell.classList.remove('is-open'); cell.classList.add('is-covered', 'is-just'); cellT.textContent = 'R. Alemu'; if (cellI) cellI.textContent = 'RA'; cell.setAttribute('aria-label', 'Sat night: R. Alemu — covered'); }
        rec.textContent = '';
        const b = document.createElement('b'); b.textContent = 'The record: '; rec.appendChild(b);
        rec.appendChild(document.createTextNode('offered inward first · Fri 09:12 → posted outward · Fri 17:40 → claimed by R. Alemu · Fri 18:02 → confirmed · Fri 18:05. On Sunday the manager records that she showed — the employer’s own fact, never another employer’s.'));
        toast('Covered · Sat night · R. Alemu');
        tonight();
      } else if (k === 'reset') {
        setStep(0); ['1', '2', '3'].forEach((n) => say(n, '')); rec.textContent = '';
        btn('offer').disabled = false; btn('post').disabled = true; btn('confirm').hidden = true; btn('reset').hidden = true;
        if (cell) { cell.classList.add('is-open'); cell.classList.remove('is-covered', 'is-just'); cellT.textContent = 'Open'; if (cellI) cellI.textContent = 'Open'; cell.setAttribute('aria-label', 'Sat night is open — see how it gets covered'); }
        tonight();
      }
    };
    box.addEventListener('click', (e) => { const b = e.target.closest('[data-claim-act]'); if (b) act(b.dataset.claimAct); });
    return { open, act };
  })();

  /* ── the verbs ─────────────────────────────────────────────────────── */
  const palette = () => {
    const pal = $('#pal'); if (!pal) return;
    const input = $('.pal-in', pal); const rows = $$('.pal-row', pal); const none = $('.pal-none', pal);
    let cur = 0;
    const visible = () => rows.filter((r) => !r.parentElement.hidden);
    const mark = () => { const v = visible(); rows.forEach((r) => r.classList.remove('is-on')); if (v[cur]) v[cur].classList.add('is-on'); };
    const close = () => { const b = $('button[aria-controls="pal"]'); if (b && !pal.hidden) b.click(); input.value = ''; rows.forEach((r) => { r.parentElement.hidden = false; }); none.hidden = true; cur = 0; mark(); };
    const goto = (id, then) => {
      const el = document.getElementById(id);
      if (!el) { window.location.href = `/#${id}`; return; }
      el.scrollIntoView({ behavior: smooth(), block: 'start' });
      if (then) setTimeout(then, calm.matches ? 0 : 420);
    };
    const run = (v) => {
      if (v === 'offer') { if ($('[data-claim]')) { claim.open(); claim.act('offer'); } else goto('board'); }
      else if (v === 'post') { if ($('[data-claim]')) { claim.open(); claim.act('offer'); setTimeout(() => claim.act('post'), calm.matches ? 0 : 1000); } else goto('board'); }
      else if (v === 'cred') goto('credentials', () => { const r = $('[data-tl-in]'); if (r) r.focus(); });
      else if (v === 'export') goto('hours', () => { const b = $('[data-ts-export]'); if (b) b.click(); });
      else if (v === 'side') { setSide(root.dataset.side === 'caregiver' ? 'provider' : 'caregiver'); explicitAt = Date.now(); toast(root.dataset.side === 'caregiver' ? 'I’m a caregiver' : 'I run a house'); }
      else if (v === 'mode') { const b = $('[data-mode-toggle]'); if (b) b.click(); }
      else if (v === 'pricing') { if (document.getElementById('pricing')) goto('pricing'); else window.location.href = '/pricing'; }
      else if (v === 'write') window.location.href = '/contact';
    };
    input.addEventListener('input', () => { const q = input.value.trim().toLowerCase(); rows.forEach((r) => { r.parentElement.hidden = Boolean(q) && !r.textContent.toLowerCase().includes(q); }); cur = 0; none.hidden = visible().length > 0; mark(); });
    input.addEventListener('keydown', (e) => {
      const v = visible(); if (!v.length) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); cur = (cur + 1) % v.length; mark(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); cur = (cur - 1 + v.length) % v.length; mark(); }
      else if (e.key === 'Enter') { e.preventDefault(); v[cur].click(); }
    });
    rows.forEach((r) => r.addEventListener('click', () => { const v = r.dataset.verb; close(); run(v); }));
    mark();
  };

  /* ── the notification, once per visit ──────────────────────────────── */
  const notify = () => {
    const n = $('#ntf'); const board = document.getElementById('board');
    if (!n || !board || !$('[data-claim]') || sess.get('ap-ntf')) return;
    let timer = 0;
    const hide = () => { n.classList.remove('is-on'); clearTimeout(timer); setTimeout(() => { n.hidden = true; }, 300); };
    const show = () => { sess.set('ap-ntf', '1'); n.hidden = false; requestAnimationFrame(() => n.classList.add('is-on')); timer = setTimeout(hide, 9000); };
    $('[data-ntf-close]', n).addEventListener('click', hide);
    $('[data-ntf-open]', n).addEventListener('click', () => {
      hide();
      if (root.dataset.side === 'caregiver') { const c = document.getElementById('caregivers'); if (c) { c.scrollIntoView({ behavior: smooth(), block: 'start' }); document.dispatchEvent(new CustomEvent('pho:openall')); } return; }
      claim.open();
    });
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); show(); } }, { threshold: 0.2 });
    io.observe(board);
  };

  /* ── the phone boards stand in for the table ────────────────────────
     The hero strip's open cell opens the claim sheet. The phone board's two
     actions open it and run it — inward first, always, so "Post outward"
     offers to own staff before it posts, the way the product does. */
  const proxies = () => {
    document.addEventListener('click', (e) => {
      const go = e.target.closest('[data-claim-go]');
      if (go) { claim.open(); claim.act('offer'); if (go.dataset.claimGo === 'post') setTimeout(() => claim.act('post'), calm.matches ? 0 : 1000); return; }
      const b = e.target.closest('[data-cell-proxy]'); if (!b) return;
      claim.open();
    });
  };

  /* ── does this shift fit you? four answers, one honest card ───────── */
  const fit = () => $$('[data-fq-box]').forEach((box) => {
    const card = $('[data-fq-card]', box); const out = $('[data-fq-out]', box);
    const val = (k) => { const b = $(`[data-fq="${k}"][aria-pressed="true"]`, box); return b ? b.dataset.v : ''; };
    const paint = () => {
      const mi = Number(val('mi')); const night = val('night'); const meds = val('meds'); const sat = val('sat');
      const near = [];
      if (mi < 6.2) near.push('it is 6.2 miles out, past your radius');
      if (night === 'no') near.push('it is awake overnight');
      if (meds === 'no') near.push('it asks for medication-certified, which shows beside your name');
      let fit = 'yes'; let text = 'This fits. Claim it, and the house confirms.';
      if (sat === 'no') { fit = 'no'; text = 'Not this one — you are not free Saturday. The next shift near you takes its place.'; }
      else if (near.length) { fit = 'near'; text = `Close: ${near.join(', and ')}. Nothing here stops you claiming it; the house decides.`; }
      card.dataset.fit = fit; out.textContent = text;
    };
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-fq]'); if (!b) return;
      $$(`[data-fq="${b.dataset.fq}"]`, box).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      paint();
    });
    paint();
  });

  /* ── the roster toy ────────────────────────────────────────────────── */
  const roster = () => $$('[data-ros]').forEach((ros) => {
    const names = (ros.dataset.names || '').split('|'); const cnt = $('[data-ros-n]', ros); const cells = $$('.ros-c', ros);
    const paint = () => { const c = cells.filter((b) => b.dataset.who !== '3').length; cnt.textContent = `${c} of ${cells.length} covered`; cnt.classList.toggle('is-open', c < cells.length); };
    ros.addEventListener('click', (e) => {
      const b = e.target.closest('.ros-c'); if (!b) return;
      const who = (Number(b.dataset.who) + 1) % 4; b.dataset.who = String(who);
      const name = who === 3 ? 'Open' : names[who];
      $('.ros-t', b).textContent = name; $('.ros-i', b).textContent = who === 3 ? 'Open' : initials(name);
      b.classList.toggle('is-open', who === 3); b.classList.toggle('is-covered', who !== 3);
      b.setAttribute('aria-label', (b.getAttribute('aria-label') || '').replace(/: .*$/, `: ${who === 3 ? 'open' : name}`));
      paint();
    });
    paint();
  });

  /* ── the credential's life: one card, one track, five stations ─────────
     Round 4. The stations sit evenly on the track, so the slider is read in
     pieces: 0–25 is ninety days out to thirty, 25–50 thirty to seven, 50–75
     seven to the day, 75–100 up to fifteen days past it. Past the day the
     card offers "Record the renewal", the fifth station — a new row, and the
     old one kept as history. */
  const timeline = () => $$('[data-tl]').forEach((tl) => {
    const inp = $('[data-tl-in]', tl); const card = $('[data-tl-card]', tl); const k = $('[data-tl-k]', tl); const when = $('[data-tl-when]', tl); const n = $('[data-tl-n]', tl); const out = $('[data-tl-out]', tl);
    const renew = $('[data-cl-renew]', tl); const stations = $$('[data-cl-s]', tl);
    const STATES = {
      current: ['Current', 'Recorded with its dates and marked self-attested, because that is what it is. Nothing to say yet.'],
      notice30: ['Thirty-day notice', 'The holder is told, by name. The manager sees a count — never a name in the message. She is still on every list.'],
      notice7: ['Seven-day notice', 'Both again. On the day itself, once more. Nothing changes on the roster yet.'],
      expired: ['Expired', 'Marked on the roster and in the eligible list, naming the credential. Still assignable — permitted, marked, recorded. Nothing is blocked.'],
      renewed: ['Renewed', 'A new row with the new dates. The expired one stays underneath, as history.'],
    };
    const AT = { current: 0, notice30: 1, notice7: 2, expired: 3, renewed: 4 };
    let renewed = false;
    const daysOf = (v) => (v <= 25 ? 90 - (v / 25) * 60 : v <= 50 ? 30 - ((v - 25) / 25) * 23 : v <= 75 ? 7 - ((v - 50) / 25) * 7 : -((v - 75) / 25) * 15);
    const paint = () => {
      const v = Number(inp.value);
      const days = Math.round(daysOf(v));
      const st = renewed ? 'renewed' : days < 0 ? 'expired' : days <= 7 ? 'notice7' : days <= 30 ? 'notice30' : 'current';
      card.dataset.state = st; tl.dataset.state = st; k.textContent = STATES[st][0]; n.textContent = STATES[st][1];
      when.textContent = st === 'renewed' ? 'Expires in 2 years' : days < 0 ? `Expired ${-days} day${days === -1 ? '' : 's'} ago` : days === 0 ? 'Expires today' : `Expires in ${days} day${days === 1 ? '' : 's'}`;
      out.textContent = st === 'renewed' ? 'renewed' : days < 0 ? `${-days} day${days === -1 ? '' : 's'} past` : days === 0 ? 'the day' : `${days} days out`;
      inp.setAttribute('aria-valuetext', when.textContent);
      inp.style.setProperty('--p', `${v}%`); tl.style.setProperty('--p', `${v}%`);
      stations.forEach((li, i) => { li.toggleAttribute('data-on', i === AT[st]); li.toggleAttribute('data-past', i < AT[st]); });
      if (renew) renew.hidden = st !== 'expired';
    };
    inp.addEventListener('input', () => { renewed = false; paint(); });
    if (renew) renew.addEventListener('click', () => { renewed = true; inp.value = '100'; paint(); toast('Renewed · the old row stays as history'); });
    paint();
  });

  /* ── the wallet: tap a card and it comes to the front ───────────────── */
  const wallet = () => $$('[data-wallet]').forEach((w) => {
    w.addEventListener('click', (e) => {
      const b = e.target.closest('.wcard-h'); if (!b || !w.contains(b)) return;
      const card = b.closest('.wcard');
      $$('.wcard', w).forEach((c) => { const on = c === card; c.toggleAttribute('data-front', on); $('.wcard-h', c).setAttribute('aria-pressed', on ? 'true' : 'false'); });
    });
  });

  /* ── the timesheet toy ─────────────────────────────────────────────── */
  const timesheet = () => $$('[data-ts]').forEach((ts) => {
    const days = $$('.ts-d', ts); const t = $('[data-ts-t]', ts); const f = $('[data-ts-f]', ts);
    const paint = () => {
      let sum = 0; days.forEach((d) => { if (d.getAttribute('aria-pressed') === 'true') sum += Number(d.dataset.h); });
      const s = Math.round(sum * 10) / 10; t.textContent = `${s} h`;
      const over = Math.round((s - 40) * 10) / 10;
      f.textContent = over > 0 ? `Over forty by ${over} h · weekly flag, never daily` : 'Under forty · no flag. There is no daily flag, because Oregon has none for this work.';
      f.classList.toggle('is-over', over > 0);
    };
    days.forEach((d) => d.addEventListener('click', () => {
      const on = d.getAttribute('aria-pressed') !== 'true'; d.setAttribute('aria-pressed', String(on));
      $('.ts-v', d).textContent = on ? d.dataset.h : '—';
      d.setAttribute('aria-label', `${$('.ts-l', d).textContent}: ${on ? `${d.dataset.h} hours` : 'not worked'}`);
      paint();
    }));
    const ex = $('[data-ts-export]', ts); if (ex) ex.addEventListener('click', () => toast('Exported as CSV · hours, never pay · recorded'));
    paint();
  });

  /* ── clock in at the house ─────────────────────────────────────────── */
  const clock = () => $$('[data-ck]').forEach((ck) => {
    const b = $('[data-ck-btn]', ck); const l = $('[data-ck-l]', ck); const st = $('[data-ck-stamp]', ck); let state = 0;
    const time = () => new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    b.addEventListener('click', () => {
      state = (state + 1) % 3;
      if (state === 1) { ck.classList.add('is-in'); ck.classList.remove('is-out'); st.textContent = `Clocked in at ${time()} · WH-1`; l.textContent = 'Clock out'; }
      else if (state === 2) { ck.classList.remove('is-in'); ck.classList.add('is-out'); st.textContent = `Clocked out at ${time()} · WH-1 — the day goes to her week`; l.textContent = 'Clear'; }
      else { ck.classList.remove('is-out'); st.textContent = ''; l.textContent = 'Clock in'; }
    });
  });

  /* ── the distance slider, on the page and in the phone ─────────────── */
  const distance = () => $$('[data-dist]').forEach((d) => {
    const inp = $('[data-dist-in]', d); const out = $('[data-dist-out]', d); const n = $('[data-dist-n]', d); const offers = $$('.offer', d);
    const near = d.closest('.sec, .hero'); const phone = (near && $('.phone[data-screen="caregiver"]', near)) || $('.phone[data-screen="caregiver"]');
    const rows = phone ? $$('.list-a .row-a', phone) : [];
    const paint = () => {
      const mi = Number(inp.value); out.textContent = String(mi); let c = 0;
      offers.forEach((o, i) => { const far = Number(o.dataset.mi) > mi; o.classList.toggle('is-far', far); if (!far) c += 1; if (rows[i]) rows[i].classList.toggle('is-far', far); });
      n.textContent = `· ${c} shift${c === 1 ? '' : 's'}`;
      inp.setAttribute('aria-valuetext', `${mi} miles, ${c} shift${c === 1 ? '' : 's'}`);
      inp.style.setProperty('--p', `${(((mi - 2) / 23) * 100).toFixed(1)}%`);
    };
    inp.addEventListener('input', paint); paint();
  });

  /* ── spotlights on the annotated board ─────────────────────────────
     Five numbered chips. Hover or focus one and the thing it names is
     ringed on the board; press it and it stays. One panel under the row
     reads the active chip's sentence, so five boxes of prose became one. */
  const spots = () => $$('[data-annot]').forEach((an) => {
    /* the figure holds both boards — the desktop shell and the phone board.
       A chip rings the same thing on each; CSS decides which one is showing,
       and only a shell that is showing is scrolled to its ringed element. */
    const fig = an.closest('[data-aboard]');
    const shell = fig ? $('[data-shell]', fig) : $('[data-shell]');
    const pb = fig ? $('[data-pboard]', fig) : null;
    const SEL = { 1: '.wk-cell[data-state="covered"]', 2: '.wk-cell[data-state="open"]', 3: '.page-main .tile-a', 4: '.page-main .btn-row', 5: '.page-side .tile-a' };
    const btns = $$('.an-b', an); const out = $('[data-an-out]', an);
    const ring = (root, el, n) => {
      $$('.is-spot', root).forEach((x) => { x.classList.remove('is-spot'); x.removeAttribute('data-spot-n'); });
      if (el) { el.classList.add('is-spot'); el.dataset.spotN = n; }
      return el;
    };
    const light = (b, scroll) => {
      const n = b.dataset.spot;
      if (shell) {
        shell.dataset.spot = n;
        const el = ring(shell, $(SEL[n], shell), n);
        if (el && scroll && shell.offsetParent) { const r = el.getBoundingClientRect(); const sr = shell.getBoundingClientRect(); shell.scrollTo({ left: r.left - sr.left + shell.scrollLeft - (sr.width - r.width) / 2, behavior: smooth() }); }
      }
      if (pb) ring(pb, $(`[data-spot-el="${n}"]`, pb), n);
      if (out) { out.textContent = ''; const t = document.createElement('b'); t.textContent = b.dataset.anT || ''; out.appendChild(t); out.appendChild(document.createTextNode(' — ' + (b.dataset.anD || ''))); }
    };
    const pressed = () => btns.find((b) => b.getAttribute('aria-pressed') === 'true') || btns[0];
    an.addEventListener('click', (e) => { const b = e.target.closest('.an-b'); if (!b) return; btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b))); light(b, true); });
    an.addEventListener('pointerover', (e) => { const b = e.target.closest('.an-b'); if (b) light(b, false); });
    an.addEventListener('pointerleave', () => { const b = pressed(); if (b) light(b, false); });
    an.addEventListener('focusin', (e) => { const b = e.target.closest('.an-b'); if (b) light(b, false); });
    if (pressed()) light(pressed(), false);
  });

  /* ── the doors: the boundary follows the pointer ───────────────────── */
  const doors = () => $$('[data-doors]').forEach((d) => {
    if (calm.matches || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let target = 50; let cur = 50; let raf = 0;
    const tick = () => { cur += (target - cur) * 0.14; d.style.setProperty('--x', `${cur.toFixed(2)}%`); raf = Math.abs(target - cur) > 0.05 ? requestAnimationFrame(tick) : 0; };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    d.addEventListener('pointermove', (e) => { const r = d.getBoundingClientRect(); target = Math.max(44, Math.min(56, ((e.clientX - r.left) / r.width) * 100)); kick(); });
    d.addEventListener('pointerleave', () => { target = 50; kick(); });
  });


  /* ── the hero device takes the side the page is on ──────────────────
     The switch flips the whole site; on /screens it flips the device too,
     which is the one place the two-sided idea can be shown instead of
     described. It drives the tablist the way a reader does — by clicking
     the tab — so site.js owns the state and there is nothing to keep in
     sync. At boot the click is followed by a blur, because a remembered
     side must not steal focus from the top of the document. */
  const heroSides = () => {
    const box = document.getElementById('sw-sides'); if (!box) return;
    const tabs = $$('[role="tab"]', box); if (tabs.length < 2) return;
    const sync = (quiet) => {
      const i = root.dataset.side === 'caregiver' ? 1 : 0;
      if (String(box.dataset.at || 0) === String(i)) return;
      tabs[i].click();
      if (quiet) tabs[i].blur();
    };
    document.addEventListener('ap:side', () => sync(false));
    box.addEventListener('click', (e) => {
      const b = e.target.closest('[data-sw-to]');
      if (!b) return;
      setSide(b.dataset.swTo === '1' ? 'caregiver' : 'provider');
      explicitAt = Date.now();
    });
    sync(true);
  };

  /* ── the contact form arrives on the side you are already on ────────
     The waitlist's "You are" follows the switch already; the topic select
     is the same question asked once more, and a caregiver who has spent
     the page on the dark side should not have to answer it twice. It
     follows until she touches it, and never again after that. */
  const topicSide = () => {
    const sel = $('#contactform select[name="topic"]'); if (!sel) return;
    const care = [...sel.options].find((o) => /caregiver/i.test(o.value)); if (!care) return;
    sel.addEventListener('change', () => { sel.dataset.touched = '1'; });
    const follow = () => {
      if (sel.dataset.touched) return;
      if (root.dataset.side === 'caregiver') sel.value = care.value;
      else if (sel.value === care.value) sel.selectedIndex = 0;
    };
    document.addEventListener('ap:side', follow);
    follow();
  };

  /* ── the form's address follows the topic, and only the topic ───────
     Everywhere else on this site the address is fixed by the ROUTE and
     rendered at build time — /caregivers prints caregiver@aidepost.com,
     every other route prints the default box — because a side remembered
     from three weeks ago must never decide what a page says.
     Inside the form it is different, and it is still not the stored side:
     the topic select is a visible choice sitting in the same screen, and
     api/contact.js derives the From address from that same topic. So the
     mail-app button and the closing line follow the select, which keeps the
     page and the inbox saying the same thing. Both addresses are rendered
     onto the form's wrapper by the page, so there is no address literal
     here; with scripting off the form keeps the default box it shipped
     with, and every local part reaches the same inbox anyway. */
  const topicBox = () => {
    const form = $('#contactform'); if (!form) return;
    const g = form.closest('[data-care-topic]'); if (!g) return;
    const sel = form.elements.topic; if (!sel) return;
    const btn = form.querySelector('[data-send-mail]');
    const link = form.querySelector('.contact-alt a');
    const paint = () => {
      const to = sel.value === g.dataset.careTopic ? g.dataset.careTo : g.dataset.mainTo;
      if (btn) btn.dataset.to = to;
      if (link) { link.textContent = to; link.setAttribute('href', `mailto:${to}`); }
    };
    sel.addEventListener('change', paint);
    /* topicSide() moves the select in code when the side changes, and a
       programmatic change fires no change event. It registers its listener
       first, so by the time this one runs the select is already set. */
    document.addEventListener('ap:side', paint);
    paint();
  };

  /* "Open every section" is a button, not a link, so menus() does not close
     the sheet behind it — and a person who has just opened every section
     wants to see the page, not the menu. */
  const openAllCloses = () => {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-open-all]')) return;
      const btn = document.querySelector('.hd-menu[aria-expanded="true"]');
      if (btn) btn.click();
    });
  };

  /* ── the swipe strip reports its own edges ──────────────────────────
     Between 641 and 900 the shell holds the 768px board in a gutter narrower
     than it, so part of the board is past the right edge. CSS fades the side
     that still has board behind it and lifts the fade on the side you have
     reached; this sets the attribute that tells it which. Deliberately
     attribute-only, so that with scripting off there is no fade at all — a
     gradient drawn over a strip that does not scroll is a worse lie than no
     gradient. Below 640 the shell is gone and the phone board stands in;
     the roster toy's strip, which scrolls at 320 because its cells are tap
     targets that cannot shrink, reports its edges the same way. */
  const stripEdges = () => {
    const strips = $$('.shell, .ros-w');
    if (!strips.length) return;
    const mq = window.matchMedia('(max-width: 1100px)');
    const paint = (s) => {
      if (!mq.matches) { s.removeAttribute('data-sx'); return; }
      const max = s.scrollWidth - s.clientWidth;
      s.dataset.sx = max <= 2 ? 'none' : s.scrollLeft <= 1 ? 'start' : s.scrollLeft >= max - 1 ? 'end' : 'mid';
    };
    const all = () => strips.forEach(paint);
    strips.forEach((s) => s.addEventListener('scroll', () => paint(s), { passive: true }));
    window.addEventListener('resize', all, { passive: true });
    mq.addEventListener('change', all);
    /* On / the board strip lives inside a folded section, so at boot it is
       0x0 and measures as "does not scroll" — and no scroll event ever fires
       to correct that, which left the first reader to open #board looking at
       the one state the fade exists for, with no fade. A ResizeObserver fires
       the moment the fold hands the strip a size. */
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => all()); strips.forEach((s) => ro.observe(s)); }
    document.addEventListener('pho:openall', () => requestAnimationFrame(all));
    all();
  };

  const boot = () => { sides(); keys(); realDay(); palette(); notify(); proxies(); fit(); roster(); timeline(); wallet(); timesheet(); clock(); distance(); spots(); doors(); heroSides(); topicSide(); topicBox(); openAllCloses(); stripEdges(); };
  boot();
})();
