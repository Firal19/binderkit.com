// A static server for dist/, with the same clean URLs Vercel serves. Enough
// to check the page in a real browser; not a build step and not a dependency.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = Number(process.env.PORT || 4321);
const TYPE = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

const tryFiles = (p) => {
  const cands = [p, `${p}.html`, path.join(p, 'index.html')];
  return cands.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
};

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const target = path.normalize(path.join(ROOT, url));
  if (!target.startsWith(ROOT)) { res.writeHead(403).end('no'); return; }
  const file = tryFiles(target);
  if (!file) {
    const four = path.join(ROOT, '404.html');
    res.writeHead(404, { 'content-type': TYPE['.html'] });
    res.end(fs.existsSync(four) ? fs.readFileSync(four) : 'not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPE[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(fs.readFileSync(file));
}).listen(PORT, () => console.log(`  http://localhost:${PORT}`));
