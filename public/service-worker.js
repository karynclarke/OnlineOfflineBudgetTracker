var CACHE_NAME = "static_cache";
// install
self.addEventListener("install", function(evt) {
    evt.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener("fetch", function(evt) {
    // console.log("[service worker] fetching something: ", evt);
    evt.respondWith(fetch(evt.request));
});

var promise = new Promise(function(resolve, reject) {
    setTimeout(function() {
        resolve("execution done");
        //reject({ code: 500, message: "error happened" });
    }, 3000);
});

promise.then(function(value) {
    console.log(value);
}).catch(function(error) {
    console.log(error.code, error.message);
}).then(function(value) {
    console.log(value);
});

fetch("https://httpbin.org/ip").then(function(response) {
        console.log("response: ", response);
        return response.json();
    })
    .then(function(data) { console.log(data); })
    .catch(function(error) { console.log(error); });