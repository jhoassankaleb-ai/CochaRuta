// Service Worker de CochaRuta: guarda en caché lo que la app va pidiendo para que siga funcionando sin internet.
const CACHE = "cocharuta-v2";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));
// Con internet: responde desde la red y guarda una copia. Sin internet: responde con la copia guardada.
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).pathname.startsWith("/api/")) return; // la API nunca se cachea
  e.respondWith(
    fetch(e.request)
      .then((res) => { if (res.ok || res.type === "opaque") { const copia = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copia)); } return res; })
      .catch(() => caches.match(e.request).then((r) => r || Response.error()))
  );
});