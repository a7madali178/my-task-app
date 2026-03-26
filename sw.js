// sw.js
const cacheName = "task-app-v1";
const assetsToCache = [
    "/",
    "/index.html",
    "/icon.png",
    "/screenshot1.png",
    // أي ملفات CSS أو JS عندك
];

// أثناء التثبيت، خزّن الملفات
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
});

// أثناء تفعيل Service Worker، حذف الكاش القديم
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys
                    .filter(key => key !== cacheName)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// استجابة الملفات من الكاش أو من الإنترنت
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedRes => {
            return cachedRes || fetch(event.request);
        })
    );
});