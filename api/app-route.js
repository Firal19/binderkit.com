// The catch-all that hands an application route back to the application.
//
// Only careshop.app uses this, because it is the only site whose product is
// live: the apex serves the marketing site and the product answers at
// app.careshop.app, so a path this site does not have is almost always a
// route into the product — a bookmark to /today, a link to /shopping, an old
// /login. Before the apex moved to this project those all resolved, and they
// keep resolving.
//
// It is reached by a *rewrite*, not a redirect, and that distinction is the
// whole mechanism: Vercel runs redirects before it looks at the filesystem, so
// a catch-all redirect would swallow the real pages too. Rewrites run after
// the filesystem, so every page this site actually has wins first, and only
// what is genuinely missing arrives here.
//
// APP_HOST names the target. Unset — which is every other site — it 404s,
// because forwarding to a product that is not live would be a lie.

export function GET(request) {
  const host = process.env.APP_HOST;
  const url = new URL(request.url);
  if (!host) {
    return new Response('Not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
    });
  }
  /* The path and the query travel intact, so ?next= survives the hop. */
  const to = `https://${host}${url.pathname}${url.search}`;
  return new Response(null, {
    status: 308,
    headers: { location: to, 'cache-control': 'no-store' },
  });
}

export const HEAD = GET;
export const POST = GET;
