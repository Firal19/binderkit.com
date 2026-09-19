// aidepost.com — covered or not.
//
// Two audiences, one page, and everything flips. The header is a two-sided
// switch; the front page is a light half and a dark half; the footer is the
// week. The chrome lives in ./aidepost/chrome.js, the pieces in
// ./aidepost/bits.js, the front page in ./aidepost/home.js and the
// marketing pages beside it. One accent, orchid, and it means exactly two
// things: open, and expired.

import { header, footer } from './aidepost/chrome.js';
import { home } from './aidepost/home.js';
import { providersPage } from './aidepost/providers.js';
import { caregiversPage } from './aidepost/caregivers.js';
import { pricingPage, aboutPage, contactPage } from './aidepost/pages.js';

export { header, footer };

export function render(cfg, p) {
  return home(cfg, p);
}

export const pages = [providersPage, caregiversPage, pricingPage, aboutPage, contactPage];
