// Service worker: rete prima (dati sempre freschi), cache se offline.
const CACHE = "coach-legends-20261122183437";
const CORE = ["./", "index.html", "data.json", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  e.respondWith(
    fetch(e.request).then(r => {
      if(r && (r.ok || r.type === "opaque")){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(url.origin === location.origin ? new Request(url.pathname) : e.request, copy)); }
      return r;
    }).catch(() => caches.match(url.origin === location.origin ? new Request(url.pathname) : e.request).then(r => r || caches.match("index.html")))
  );
});
