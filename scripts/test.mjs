// Smoke tests for the CodeConduit site.
// Local: node scripts/test.mjs            (serves ./site on a free port)
// Live:  node scripts/test.mjs --live     (or set BASE_URL to any deployed copy)
// Live with version check: also set EXPECT_VERSION=v1.2.0 to wait until that release is being served.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

const CONTACT = 'project@codeconduit.com';
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };

async function serveSite() {
  const root = path.resolve('site');
  const mime = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.woff2':'font/woff2','.txt':'text/plain','.xml':'application/xml'};
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
      if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
      const data = await readFile(file);
      res.writeHead(200, {'Content-Type': mime[path.extname(file)] || 'application/octet-stream'}).end(data);
    } catch { res.writeHead(404).end('Not found'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  return {server, url: `http://127.0.0.1:${server.address().port}/`};
}

async function waitForVersion(base, version) {
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    try {
      const html = await (await fetch(`${base}?v=${Date.now()}`, {cache: 'no-store'})).text();
      if (html.includes(`name="codeconduit-version" content="${version}"`)) return;
    } catch {}
    console.log(`Waiting for ${base} to serve ${version}...`);
    await new Promise(r => setTimeout(r, 15000));
  }
  throw new Error(`${base} did not serve ${version} within 10 minutes`);
}

const target = process.env.BASE_URL || (process.argv.includes('--live') ? 'https://codeconduit.com/' : '');
const {server, url: base} = target ? {url: target.replace(/\/?$/, '/')} : await serveSite();
if (process.env.EXPECT_VERSION) await waitForVersion(base, process.env.EXPECT_VERSION);
console.log(`Testing ${base}`);

const browser = await chromium.launch();
try {
  for (const viewport of [{width: 1440, height: 900, name: 'desktop'}, {width: 390, height: 844, name: 'mobile'}]) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push(e.message));
    page.on('requestfailed', r => errors.push(`request failed: ${r.url()}`));
    page.on('response', r => { if (r.url().startsWith(base) && r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });

    const response = await page.goto(process.env.EXPECT_VERSION ? `${base}?cb=${Date.now()}` : base, {waitUntil: 'networkidle'});
    check(response.ok(), `[${viewport.name}] page returned ${response.status()}`);
    check(errors.length === 0, `[${viewport.name}] browser errors:\n  ${errors.join('\n  ')}`);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    check(overflow <= 0, `[${viewport.name}] page scrolls sideways by ${overflow}px`);

    if (viewport.name !== 'desktop') { await page.close(); continue; }

    const info = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || '',
      h1: document.querySelectorAll('h1').length,
      anchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')),
      ids: [...document.querySelectorAll('[id]')].map(e => e.id),
      mailtos: [...document.querySelectorAll('a[href^="mailto:"]')].map(a => a.getAttribute('href')),
      images: [...document.images].map(i => ({src: i.currentSrc, ok: i.complete && i.naturalWidth > 0})),
      fonts: [...document.fonts].filter(f => f.status === 'error').map(f => f.family)
    }));
    check(info.title.includes('CodeConduit'), 'title is missing "CodeConduit"');
    check(info.description.length > 50, 'meta description is missing or too short');
    check(info.h1 === 1, `expected one h1, found ${info.h1}`);
    for (const href of new Set(info.anchors)) check(href === '#' ? false : info.ids.includes(href.slice(1)), `link ${href} has no matching section`);
    check(info.mailtos.length >= 2, 'contact email links are missing');
    for (const href of info.mailtos) check(href.startsWith(`mailto:${CONTACT}`), `email link points to ${href}`);
    for (const img of info.images) check(img.ok, `image did not load: ${img.src}`);
    check(info.fonts.length === 0, `fonts failed to load: ${info.fonts.join(', ')}`);

    // The workflow explorer swaps its text when a scenario is picked.
    const before = await page.textContent('#friction');
    await page.click('[data-scenario="ai"]');
    check((await page.textContent('#friction')) !== before, 'workflow explorer buttons do not change the text');

    for (const file of ['robots.txt', 'sitemap.xml', 'assets/favicon.svg', 'assets/social.jpg', 'assets/apple-touch-icon.png']) {
      const r = await page.request.get(new URL(file, base).href);
      check(r.ok(), `${file} returned ${r.status()}`);
    }
    await page.close();
  }
} finally {
  await browser.close();
  server?.close();
}

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log('All checks passed.');
