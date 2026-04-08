// ================================================================
// Service Worker — NodePath Studio
// Estrategia: Network First para HTML, Cache First para assets
// ================================================================

const CACHE_NAME    = "nodepath-cache-v6"; // ← subir versión al deployar
const CACHE_STATIC  = "nodepath-static-v6";

// Assets que se pre-cachean al instalar
const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/plan.html",
  "/css/style.min.css",   
  "/css/hero.min.css",
  "/css/plan.min.css",
  "/assets/favicon-16x16.png"
];

// ── INSTALL: precachear assets críticos ──────────────────────
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // activa el SW nuevo sin esperar
  );
});

// ── ACTIVATE: borrar caches viejos ───────────────────────────
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== CACHE_STATIC)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // toma control inmediato de las tabs abiertas
  );
});

// ── FETCH: estrategia según tipo de recurso ──────────────────
self.addEventListener("fetch", event => {

  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests que no son GET o son de otros orígenes
  if (request.method !== "GET" || url.origin !== location.origin) return;

  // Ignorar requests a la API de EmailJS u otros servicios externos
  if (!url.hostname.includes("nodepathstudio.com") && url.hostname !== location.hostname) return;

  // HTML → Network First (siempre intenta traer la versión más fresca)
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Guardar copia fresca en cache
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request)) // si no hay red → cache
    );
    return;
  }

  // CSS, JS, fonts, imágenes → Cache First (rendimiento máximo)
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      // No estaba en cache → fetch y guardar
      return fetch(request).then(response => {
        // Solo cachear respuestas válidas
        if (!response || response.status !== 200 || response.type === "error") {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});

console.log("SW activo");
