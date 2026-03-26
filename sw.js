const cacheName = "task-app-v1";
const assetsToCache = [
    "./",
    "./index.html",
    "./icon-192.png",
    "./icon-512.png",
    "./beep-07.wav"
    // أضف أي ملفات CSS أو JS خارجية هنا لو موجودة
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => cache.addAll(assetsToCache))
    );
    self.skipWaiting();
    console.log('Service Worker Installed');
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key)))
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedRes => cachedRes || fetch(event.request))
    );
});
