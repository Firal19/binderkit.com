import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// One table. The early-access list, and nothing else: this deployment holds
// no record about any resident, any caregiver or any house.
export default defineSchema({
  waitlist: defineTable({
    email: v.string(),
    track: v.string(),
    houses: v.string(),
    product: v.string(),
    source: v.string(),
    at: v.number(),
  })
    .index('by_email', ['email'])
    .index('by_at', ['at']),
});
