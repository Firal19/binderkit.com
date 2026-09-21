// POST /api/contact — a message from a person, to a person.
//
// Takes { name, email, topic, message, product } from the contact form,
// checks them, keeps one row in Convex, and sends two letters through Resend:
// one to the family inbox with reply-to set to the writer — so answering is
// an ordinary reply — and one receipt to the writer from this site's own
// hello@ address, which is received by Resend and relayed to the same inbox.
//
// The row is the record; the mail is the nicety. With CONVEX_URL unset and
// Resend unset the endpoint says 503 rather than pretending.

import { EMAIL, clean, configured, inbox, address, named, domainOf, send, letters } from '../lib/mail.js';

const PRODUCTS = { cohort: 'Cohort', careshop: 'CareShop', binderkit: 'Binderkit', aidepost: 'Aidepost' };
const TOPICS = new Set(['Question', 'Early access', 'Pricing', 'Security and privacy', 'Press', 'Something else']);

const json = (res, code, body) => {
  res.status(code);
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(body));
};

export default async function handler(req, res) {
  if (req.method === 'GET') return json(res, 200, { ok: true, mail: configured(), store: Boolean(process.env.CONVEX_URL) });
  if (req.method !== 'POST') { res.setHeader('allow', 'POST'); return json(res, 405, { ok: false, message: 'Use POST.' }); }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body || typeof body !== 'object') body = {};
  if (clean(body.company, 200)) return json(res, 200, { ok: true });      // the honeypot

  const email = clean(body.email, 254).toLowerCase();
  const message = clean(body.message, 4000);
  const name = clean(body.name, 120);
  const phone = clean(body.phone, 40);
  const topic = TOPICS.has(clean(body.topic, 40)) ? clean(body.topic, 40) : 'Question';
  const product = PRODUCTS[clean(body.product, 20)] ? clean(body.product, 20) : 'cohort';
  if (!EMAIL.test(email)) return json(res, 400, { ok: false, message: 'That email does not look right.' });
  if (message.length < 4) return json(res, 400, { ok: false, message: 'Write a line or two so we know what to answer.' });

  const domain = domainOf(req);
  const site = { name: PRODUCTS[product], domain };
  const msg = { name, email, phone, topic, message, product, source: clean(req.headers.referer, 300) || `https://${domain}/`, at: Date.now() };

  let kept = false;
  const url = process.env.CONVEX_URL;
  if (url) {
    try {
      const r = await fetch(`${url.replace(/\/$/, '')}/api/mutation`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ path: 'mail:contact', args: msg, format: 'json' }),
      });
      const out = await r.json().catch(() => ({}));
      kept = r.ok && out.status !== 'error';
      if (!kept) console.error('contact: convex refused', r.status, out.errorMessage || out);
    } catch (e) { console.error('contact: convex unreachable', e && e.message); }
  }

  let sent = false;
  if (configured() && inbox()) {
    const from = named(site.name, address('hello', domain));
    const notice = letters.contactNotice(site, msg);
    const a = await send({ from, to: inbox(), replyTo: named(name || email, email), headers: { 'X-PHO-Site': domain, 'X-PHO-Kind': 'contact' }, tags: [{ name: 'kind', value: 'contact' }, { name: 'site', value: domain.replace(/\./g, '_') }], ...notice });
    sent = a.sent;
    const receipt = letters.contactReceipt(site, msg);
    await send({ from, to: email, replyTo: address('hello', domain), tags: [{ name: 'kind', value: 'contact_receipt' }], ...receipt });
  }

  if (!kept && !sent) return json(res, 503, { ok: false, message: 'Our side is not ready to take a message yet — write to hello@' + domain + ' instead.' });
  return json(res, 200, { ok: true, kept, sent });
}
