const cacheName = "task-app-v1";
const assetsToCache = [
    "./",
    "./index.html",
    "./icon-192.png",
    "./icon-512.png",
    "./beep-07.wav"
    // أضف هنا أي ملفات CSS أو JS خارجية عندك
];

// أثناء تثبيت الـ Service Worker، خزّن الملفات
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("Caching all assets...");
            return cache.addAll(assetsToCache);
        })
    );
    self.skipWaiting();
    console.log("Service Worker Installed");
});

// أثناء التفعيل، حذف أي كاش قديم
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== cacheName)
                    .map(key => caches.delete(key))
            )
        )
    );
    console.log("Service Worker Activated");
});

// التعامل مع الطلبات: إرجاع الملف من الكاش أو الإنترنت
self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(cachedRes => {
            return cachedRes || fetch(event.request)
                .then(networkRes => {
                    // خزّن الملفات الجديدة في الكاش عند الطلب
                    return caches.open(cacheName).then(cache => {
                        // نتجنب تخزين ملفات من دومينات ثانية غير موقعنا
                        if (event.request.url.startsWith(self.location.origin)) {
                            cache.put(event.request, networkRes.clone());
                        }
                        return networkRes;
                    });
                })
                .catch(() => {
                    // ممكن نضيف fallback هنا للصور أو الصفحة لو offline
                });
        })
    );
});
