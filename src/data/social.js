// The family's social handles, one register for all four sites.
//
// The handle each product carries is the one the brand register gives it
// (src/data/brand.js → handle). Every platform below is rendered on every
// site, in that site's own drawing — so the accounts must exist under these
// names. Until one is claimed, the link points at the platform's profile
// path for the handle, which is where claiming it puts it.

import { PRODUCTS } from './brand.js';

const handleOf = (id) => (PRODUCTS.find((p) => p.id === id) || PRODUCTS[0]).handle;

/* platform → how a handle becomes a URL and how it is written */
export const PLATFORMS = [
  { id: 'x', name: 'X', label: (h) => `@${h}`, href: (h) => `https://x.com/${h}` },
  { id: 'instagram', name: 'Instagram', label: (h) => `@${h}`, href: (h) => `https://www.instagram.com/${h}/` },
  { id: 'facebook', name: 'Facebook', label: (h) => `/${h}`, href: (h) => `https://www.facebook.com/${h}` },
  { id: 'linkedin', name: 'LinkedIn', label: (h) => `/company/${h}`, href: (h) => `https://www.linkedin.com/company/${h}/` },
  { id: 'youtube', name: 'YouTube', label: (h) => `@${h}`, href: (h) => `https://www.youtube.com/@${h}` },
  { id: 'tiktok', name: 'TikTok', label: (h) => `@${h}`, href: (h) => `https://www.tiktok.com/@${h}` },
  { id: 'threads', name: 'Threads', label: (h) => `@${h}`, href: (h) => `https://www.threads.net/@${h}` },
  { id: 'bluesky', name: 'Bluesky', label: (h, d) => `@${d}`, href: (h, d) => `https://bsky.app/profile/${d}` },
];

/** Every platform, resolved for one product: [{ id, name, label, href }] */
export function socialFor(productId) {
  const p = PRODUCTS.find((x) => x.id === productId) || PRODUCTS[0];
  const h = handleOf(p.id);
  return PLATFORMS.map((pl) => ({ id: pl.id, name: pl.name, label: pl.label(h, p.domain), href: pl.href(h, p.domain) }));
}

/** The umbrella's own accounts, for the byline's neighbourhood */
export const FAMILY = socialFor('pho');
