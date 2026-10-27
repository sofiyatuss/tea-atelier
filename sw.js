// The Tea Atelier service worker.
// Bump VERSION whenever you change any file in APP_SHELL, so installed copies update.
const VERSION = "1.2.0";
const SHELL = `atelier-shell-${VERSION}`;
const FONTS = "atelier-fonts-v1";

// Paths are relative to this file, so the app works at a GitHub Pages subpath (/your-repo/).
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./data.js",
  "./app.js",
  "./manifest.webmanifest",
  "./favicon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./maskable-512.png",
  "./apple-touch-icon.png"
];
const FONT_CSS = "https://fonts.googleapis.com/css2?family=Alegreya+Sans:ital,wght@0,400;0,500;0,700;1,400&family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..700,0..100;1,9..144,400..700,0..100&display=swap";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // cache: "reload" skips the HTTP cache so a new version never stores stale files.
    await cache.addAll(APP_SHELL.map(u => new Request(u, { cache: "reload" })));
    // Fonts are a nice-to-have: try to fetch them now, but never fail the install over them.
    try { await cacheFontCss(await caches.open(FONTS)); } catch (e) { /* offline at install; fonts fall back */ }
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith("atelier-shell-") && k !== SHELL).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", event => {
  if (event.data === "skipWaiting") self.skipWaiting();
});

async function cacheFontCss(cache) {
  const res = await fetch(FONT_CSS, { mode: "cors" });
  if (!res.ok) return;
  await cache.put(FONT_CSS, res.clone());
  const css = await res.text();
  const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g)].map(m => m[1]);
  await Promise.all(urls.map(async u => { try { const r = await fetch(u, { mode: "cors" }); if (r.ok) await cache.put(u, r); } catch (e) { } }));
}

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Google Fonts: cache-first, filled on first online visit.
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith((async () => {
      const cache = await caches.open(FONTS);
      const hit = await cache.match(req, { ignoreVary: true });
      if (hit) return hit;
      try { const res = await fetch(req); if (res.ok || res.type === "opaque") cache.put(req, res.clone()); return res; }
      catch (e) { return new Response("", { status: 504 }); }
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Page navigations: serve the cached app shell for this version (the app routes with #hash).
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(SHELL);
      const cached = await cache.match("./index.html");
      if (cached) return cached;
      try { return await fetch(req); } catch (e) { }
      return new Response("<h1>Offline</h1><p>Open the atelier once while online to install it.</p>", { headers: { "Content-Type": "text/html; charset=utf-8" } });
    })());
    return;
  }

  // Everything else from this site: cache-first, falling back to the network.
  event.respondWith((async () => {
    const hit = await caches.match(req, { ignoreSearch: true });
    if (hit) return hit;
    try { return await fetch(req); } catch (e) { return new Response("", { status: 504 }); }
  })());
});
