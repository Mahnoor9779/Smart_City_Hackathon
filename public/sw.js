/**
 * Service Worker for Lahore Civic Nervous System.
 *
 * Strategy:
 * - Cache-first for static assets (CSS, JS, fonts, images)
 * - Network-first for API data and pages
 * - Offline fallback page when both cache and network fail
 */

const CACHE_NAME = "lns-v1";
const OFFLINE_URL = "/offline.html";

const PRECACHE_URLS = [
  "/offline.html",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Only this origin. Third-party requests pass straight through.
  if (url.origin !== self.location.origin) return;

  // Static assets: cache-first
  if (
    url.pathname.match(/\.(js|css|woff2?|ttf|otf|png|jpg|svg|ico)$/) ||
    url.pathname.startsWith("/_next/static/")
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // Pages and API: network-first with offline fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && request.mode === "navigate") {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) =>
            cached ||
            (request.mode === "navigate"
              ? caches.match(OFFLINE_URL)
              : new Response("", { status: 503 }))
        )
      )
  );
});
