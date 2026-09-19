// POST /api/inbound — where every email to this domain arrives.
//
// Resend receives mail for hello@<domain> (and any other local part) and
// calls this endpoint with an `email.received` event. The event is metadata
// only, so this fetches the message, relays it whole to the one family inbox
// with reply-to set to the original sender — replying from the inbox answers
// the person — and logs one row in Convex so nothing is lost if the relay is.
//
// Verification is Svix's scheme, done by hand so the function has no
// dependency: HMAC-SHA256 over "id.timestamp.rawBody" with the base64 secret
// after "whsec_", compared against every v1 signature in the header, with a
// five-minute tolerance. That needs the RAW body, which is why this file uses
// the Web handler signature rather than (req, res).
//
// Environment: RESEND_API_KEY, RESEND_WEBHOOK_SECRET, MAIL_INBOX, CONVEX_URL.

import { createHmac, timingSafeEqual } from 'node:crypto';
import { received, send, letters, inbox, address, named, clean } from '../lib/mail.js';

const PRODUCTS = { 'cohorthome.app': 'Cohort', 'careshop.app': 'CareShop', 'binderkit.com': 'Binderkit', 'aidepost.com': 'Aidepost', 'providerhub.us': 'Providerhub Oregon' };

const reply = (code, body) => new Response(JSON.stringify(body), { status: code, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

function verify(raw, headers, secret) {
  const id = headers.get('svix-id');
  const ts = headers.get('svix-timestamp');
  const sig = headers.get('svix-signature');
  if (!id || !ts || !sig || !secret) return false;
  const age = Math.abs(Date.now() / 1000 - Number(ts));
  if (!Number.isFinite(age) || age > 300) return false;
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const want = createHmac('sha256', key).update(`${id}.${ts}.${raw}`).digest();
  return sig.split(' ').some((part) => {
    const [v, b64] = part.split(',');
    if (v !== 'v1' || !b64) return false;
    const got = Buffer.from(b64, 'base64');
    return got.length === want.length && timingSafeEqual(got, want);
  });
}

async function log(row) {
  const url = process.env.CONVEX_URL;
  if (!url) return false;
  try {
    const r = await fetch(`${url.replace(/\/$/, '')}/api/mutation`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ path: 'mail:inbound', args: row, format: 'json' }),
    });
    return r.ok;
  } catch (e) { console.error('inbound: convex unreachable', e && e.message); return false; }
}

export async function GET() {
  return reply(200, { ok: true, configured: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_WEBHOOK_SECRET && process.env.MAIL_INBOX) });
}

export async function POST(request) {
  const raw = await request.text();
  if (!verify(raw, request.headers, process.env.RESEND_WEBHOOK_SECRET)) return reply(401, { ok: false, message: 'bad signature' });

  let event;
  try { event = JSON.parse(raw); } catch { return reply(400, { ok: false, message: 'bad json' }); }
  if (!event || event.type !== 'email.received' || !event.data || !event.data.email_id) return reply(200, { ok: true, ignored: true });

  const d = event.data;
  const to = (Array.isArray(d.to) ? d.to : [d.to]).filter(Boolean).map((x) => String(x).toLowerCase());
  const domain = (to.find((x) => PRODUCTS[x.split('@')[1]]) || to[0] || '@providerhub.us').split('@')[1];
  const site = { name: PRODUCTS[domain] || 'Providerhub Oregon', domain };

  const row = { emailId: String(d.email_id), messageId: clean(d.message_id, 300), from: clean(d.from, 254), to: to.join(', ').slice(0, 600), subject: clean(d.subject, 300), domain, at: Date.now(), relayed: false };

  let mail;
  try { mail = await received(d.email_id); } catch (e) { console.error('inbound: fetch failed', e && e.message); }

  let out = { sent: false };
  if (mail && inbox()) {
    const letter = letters.relay(site, mail);
    const sender = (mail.headers && mail.headers.from) || mail.from;
    out = await send({
      from: named(site.name, address('hello', domain)),
      to: inbox(),
      replyTo: sender,
      headers: { 'X-PHO-Site': domain, 'X-PHO-Kind': 'relay', ...(d.message_id ? { 'In-Reply-To': d.message_id, References: d.message_id } : {}) },
      tags: [{ name: 'kind', value: 'relay' }, { name: 'site', value: domain.replace(/\./g, '_') }],
      ...letter,
    });
  }
  row.relayed = Boolean(out.sent);
  await log(row);
  if (!out.sent) console.error('inbound: not relayed', row.emailId, out.error || (mail ? 'no inbox' : 'no content'));
  return reply(200, { ok: true, relayed: row.relayed });
}
