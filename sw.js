/* Duty Roster service worker: offline app shell.
   This file is a template: `npm run build` (scripts/build-sw.mjs) writes out/sw.js
   with CACHE set from a hash of the exported files and SHELL listing all of them. */
const CACHE = 'roster-dev';
const SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('roster-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Pages: network first (so a new deploy shows up), fall back to the cached shell offline.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        if (res.ok) (await caches.open(CACHE)).put('index.html', res.clone());
        return res;
      } catch {
        return (await caches.match('index.html')) || (await caches.match('./')) || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache first, then network (and remember it).
  e.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    const res = await fetch(req);
    if (res.ok && res.type === 'basic') (await caches.open(CACHE)).put(req, res.clone());
    return res;
  })());
});
