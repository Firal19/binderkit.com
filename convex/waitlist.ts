import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* Called by /api/waitlist over the HTTP mutation endpoint. The serverless
   function has already checked these; this checks them again, because a
   public mutation is a public mutation. A second signup from the same
   address updates the row rather than adding one. */
export const add = mutation({
  args: {
    email: v.string(),
    phone: v.optional(v.string()),
    track: v.string(),
    houses: v.string(),
    product: v.string(),
    source: v.string(),
    at: v.number(),
  },
  handler: async (ctx, a) => {
    const email = a.email.trim().toLowerCase().slice(0, 254);
    if (!EMAIL.test(email)) throw new Error('bad email');
    const row = {
      email,
      phone: (a.phone || '').slice(0, 40) || undefined,
      track: a.track.slice(0, 40),
      houses: a.houses.slice(0, 20),
      product: a.product.slice(0, 20),
      source: a.source.slice(0, 300),
      at: a.at || Date.now(),
    };
    const seen = await ctx.db.query('waitlist').withIndex('by_email', (q) => q.eq('email', email)).first();
    if (seen) { await ctx.db.patch(seen._id, row); return seen._id; }
    return await ctx.db.insert('waitlist', row);
  },
});

/* Read the list. Guarded by a key rather than left open, because the rows are
   other people's email addresses. Set WAITLIST_KEY in the Convex environment
   and call it with the same value. */
export const list = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    if (!process.env.WAITLIST_KEY || key !== process.env.WAITLIST_KEY) throw new Error('not authorised');
    return await ctx.db.query('waitlist').withIndex('by_at').order('desc').take(500);
  },
});

/* Take a row off the list. The privacy page promises this, so it exists.
   Same key as `list`, because it is the same private operation. */
export const remove = mutation({
  args: { key: v.string(), email: v.string() },
  handler: async (ctx, { key, email }) => {
    if (!process.env.WAITLIST_KEY || key !== process.env.WAITLIST_KEY) throw new Error('not authorised');
    const row = await ctx.db
      .query('waitlist')
      .withIndex('by_email', (q) => q.eq('email', email.trim().toLowerCase()))
      .first();
    if (!row) return false;
    await ctx.db.delete(row._id);
    return true;
  },
});
