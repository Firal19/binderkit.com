/* apex.mjs — read a live apex with a JS-executing browser.
   Vercel's challenge is a JS proof-of-work interstitial: curl and WebFetch can
   never pass it, so a 403 from them says nothing about the deploy. */
import { chromium } from '/Users/hazor/.claude/skills/desaudit/node_modules/playwright/index.mjs';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';
const br = await chromium.launch({ args: ['--disable-blink-features=AutomationControlled'] });
const ctx = await br.newContext({ userAgent: UA, viewport: { width: 1280, height: 900 }, locale: 'en-US' });
await ctx.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
const pg = await ctx.newPage();
for (const host of process.argv.slice(2)) {
  let out = { host, pass: false };
  try {
    const res = await pg.goto(`https://${host}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    out.status = res && res.status();
    // the interstitial replaces itself once the proof-of-work completes
    try { await pg.waitForFunction(() => !/Security Checkpoint/i.test(document.title), null, { timeout: 30000 }); } catch {}
    await pg.waitForTimeout(1500);
    out = { ...out, ...(await pg.evaluate(() => ({
      title: document.title.slice(0, 48),
      mailto: [...new Set([...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.getAttribute('href')))][0] || null,
      css: ([...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href.split('/').pop()).find(n => /^site\./.test(n))) || null,
      h1: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 44) || null,
    }))) };
    out.pass = !/Security Checkpoint/i.test(out.title || '');
  } catch (e) { out.err = String(e).slice(0, 90); }
  console.log(JSON.stringify(out));
}
await br.close();
