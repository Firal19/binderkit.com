// POST /api/waitlist — the one endpoint on this site.
//
// It takes the four fields the form has, checks them, and writes one row to
// Convex over the documented HTTP mutation endpoint. No SDK, no dependency,
// no build step: a Vercel Node function and fetch.
//
// Configure on the Vercel project:
//   CONVEX_URL        https://<deployment>.convex.cloud   (required)
//   RESEND_API_KEY    lets the site write two letters      (optional)
//   MAIL_INBOX        the one inbox every notice is copied to
//
// With CONVEX_URL unset the endpoint answers 503 and says so, and the page
// tells the reader rather than pretending the row was kept. With Resend set,
// the signer gets a receipt from hello@<domain> and the inbox gets a notice
// whose reply-to is the signer, so answering them is an ordinary reply.

import { configured, inbox, address, named, domainOf, send, letters } from '../lib/mail.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TRACKS = new Set(['APD', 'DD', 'OHA', 'Agency', 'Not licensed yet']);
const HOUSES = new Set(['1', '2–3', '4–9', '10+', 'An agency', 'I’m a caregiver']);
const PRODUCTS = new Set(['cohort', 'careshop', 'binderkit', 'aidepost']);
const NAMES = { cohort: 'Cohort', careshop: 'CareShop', binderkit: 'Binderkit', aidepost: 'Aidepost' };

const json = (res, code, body) => {
  res.status(code);
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
};

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return json(res, 200, { ok: true, configured: Boolean(process.env.CONVEX_URL) });
  }
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return json(res, 405, { ok: false, message: 'Use POST.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  // The hidden field. A browser never fills it; a form-filling bot always does.
  if (clean(body.company, 200)) return json(res, 200, { ok: true });

  const email = clean(body.email, 254).toLowerCase();
  if (!EMAIL.test(email)) return json(res, 400, { ok: false, message: 'That email does not look right.' });

  const track = TRACKS.has(clean(body.track, 40)) ? clean(body.track, 40) : 'Not licensed yet';
  const houses = HOUSES.has(clean(body.houses, 20)) ? clean(body.houses, 20) : '1';
  const product = PRODUCTS.has(clean(body.product, 20)) ? clean(body.product, 20) : 'cohort';

  const url = process.env.CONVEX_URL;
  if (!url) {
    return json(res, 503, {
      ok: false,
      message: 'The list is not open yet on our side — try again shortly.',
    });
  }

  const row = {
    email,
    track,
    houses,
    product,
    source: clean(req.headers.referer, 300) || `https://${clean(req.headers.host, 120)}/`,
    at: Date.now(),
  };

  try {
    const r = await fetch(`${url.replace(/\/$/, '')}/api/mutation`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: 'waitlist:add', args: row, format: 'json' }),
    });
    const out = await r.json().catch(() => ({}));
    if (!r.ok || out.status === 'error') {
      console.error('waitlist: convex refused', r.status, out.errorMessage || out);
      return json(res, 502, { ok: false, message: 'That did not save. Try again in a moment.' });
    }
  } catch (e) {
    console.error('waitlist: convex unreachable', e && e.message);
    return json(res, 502, { ok: false, message: 'That did not save. Try again in a moment.' });
  }

  // The two letters. The row is already kept; these are the courtesy.
  let sent = false;
  if (configured()) {
    const domain = domainOf(req);
    const site = { name: NAMES[product], domain };
    const from = named(site.name, address('hello', domain));
    const r1 = await send({ from, to: email, replyTo: address('hello', domain), tags: [{ name: 'kind', value: 'waitlist_receipt' }], ...letters.waitlistReceipt(site, row) });
    sent = r1.sent;
    if (inbox()) await send({ from, to: inbox(), replyTo: email, headers: { 'X-PHO-Site': domain, 'X-PHO-Kind': 'waitlist' }, tags: [{ name: 'kind', value: 'waitlist' }, { name: 'site', value: domain.replace(/\./g, '_') }], ...letters.waitlistNotice(site, row) });
  }

  return json(res, 200, { ok: true, sent });
}
