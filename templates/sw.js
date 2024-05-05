const CacheName = 'static_cache'

const StaticAssets =[
    '/',
    '/static/rivescript/dist/rivescript.min.js',
    '/static/css/wifi.css',
    'troubleshoot/static/img/avatar.png',
    'troubleshoot/static/img/bot.png',
    '/static/js/serviceworker.js',
    "/troubleshoot/static/brain/begin.rive",
    "/troubleshoot/static/brain/advanced.rive",
    "/troubleshoot/static/brain/basic.rive",
    "/troubleshoot/static/brain/greet.rive",
    "/troubleshoot/static/brain/star.rive",
]
// const StaticAssets =[
//     '/static/css/wifi.css',
//     '/static/img/avatar.png',
//     '/static/img/bot.png',
//     '/static/js/serviceworker.js',
//     '/templates/_base.html',
// ]

async function preCache() {
    const cache = await caches.open(CacheName)
    return await cache.addAll(
        StaticAssets
    )
    // return caches.open('my-cache').then((cache) => {
    // });
}

self.addEventListener('install', event => {
    this.skipWaiting()
    event.waitUntil(preCache())
    console.log("[sw] isntalled")
})

async function cleanUpCache(){
    const keys = await caches.keys()
    const keysToDelete = keys.map(key => {
        if (key !== CacheName) {
            return caches.delete(keys)
        }
    })
    return Promise.all(keysToDelete)
}

self.addEventListener('activate', event => {
    self.clients.claim();
    event.waitUntil(cleanUpCache())
    console.log("[sw] activated")
})

// async function fetchAssets(request) {
//     const cache = await caches.open(CacheName)
//     const response = await fetch(request)
    
//     return cache.match(request) || response
// }

async function fetchAssets(request) {
    return await fetch(request).catch(function() {
        return fromCache(request)
    })
}

async function fromCache(request) {
    return caches.open(CacheName).then( async function (cache) {
        const matching = await cache.match(request)
        return matching
    })
}


// async function reFetchandCache(event) {
//     const cache = await caches.open(CacheName)
//     if (cache){
//         const fresh = await fetch(event.request)
//         await cache.put(event.request, fresh.clone())
//         return fresh
//     }else {
//         const cached = await cache.match(event.request)
//         return cached
//     }
// }

// self.addEventListener("fetch", (event) => {
//     // Let the browser do its default thing
//     // for non-GET requests.
//     if (event.request.method !== "GET") return;
  
//     // Prevent the default, and handle the request ourselves.
//     event.respondWith(
//       (async () => {
//         fetchAssets(event.request)
//         console.log("[sw] fetch")
//       })(),
//     );
// });  
// self.addEventListener("fetch", (event) => {
//     // Let the browser do its default thing
//     // for non-GET requests.
//     if (event.request.method !== "GET") return;
  
//     // Prevent the default, and handle the request ourselves.
//     event.respondWith(
//       (async () => {
//         // Try to get the response from a cache.
//         const cache = await caches.open("dynamic-v1");
//         const cachedResponse = await cache.match(event.request);
  
//         if (cachedResponse) {
//           // If we found a match in the cache, return it, but also
//           // update the entry in the cache in the background.
//           event.waitUntil(cache.add(event.request));
//           return cachedResponse;
//         }
  
//         // If we didn't find a match in the cache, use the network.
//         return fetch(event.request);
//       })(),
//     );
// });  

self.addEventListener('fetch', event => {
    event.respondWith(fetchAssets(event.request))
    console.log("[sw] fetch")
})

