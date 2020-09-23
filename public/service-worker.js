const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";


var urlsToCache = ["/", "/db.js", "/index.js", "/manifest.json", "/styles.css", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]
    // var CACHE_NAME = "static_cache";

self.addEventListener("install", function(evt) {
    // pre cache image data
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("open cache");
            return cache.addAll(urlsToCache)
        })
    );
});

self.addEventListener("fetch", function(event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request).then(response => {
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone())
                    }
                    return response
                }).catch(err => {
                    return cache.match(event.request)
                });
            }).catch(err => console.log(err))

        )
        return;
    }

    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
})



// tell the browser to activate this service worker immediately once it
// has finished installing