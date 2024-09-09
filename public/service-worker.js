const CACHE_NAME = "posenet-model-cache";

self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
  event.waitUntil(clients.claim());
});

// Intercept network requests and serve cached files if available
self.addEventListener("fetch", (event) => {
  // console.log("Fetch event for: ", event.request.url);
  if (event.request.url.includes("group1-shard")) {
    event.respondWith(
      caches.match(event.request).then(async (cachedResponse) => {
        // Check if cache expiration is present
        const expirationResponse = await caches.match(`${CACHE_NAME}-expire`);
        const expirationTimestamp = expirationResponse
          ? parseInt(await expirationResponse.text(), 10)
          : 0;
        console.log(Date.now() < expirationTimestamp);
        if (cachedResponse && Date.now() < expirationTimestamp) {
          // console.log("Serving from cache:", event.request.url);
          return cachedResponse;
        }
        // console.log("Fetching and caching:", event.request.url);
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            const cacheExpirationTimestamp = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
            cache.put(
              `${CACHE_NAME}-expire`,
              new Response(cacheExpirationTimestamp.toString())
            );
            return networkResponse;
          });
        });
      })
    );
  }
});
