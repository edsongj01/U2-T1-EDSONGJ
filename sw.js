console.log("SW: clean")

const CACHE_NAME = 'cache-v1';

const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

function cleanCache(cacheName,sizeItems){
    caches.open(cacheName).then((cache)=>{
        cache.keys().then(keys=>{
            console.log(keys);
            if (keys.length >= sizeItems){
                cache.delete(keys[0]).then(()=>{
                    cleanCache(cacheName,sizeItems);
                });
            }
        });
    });
}


self.addEventListener('install',(event)=>{
    console.log("SW: installed");

    // Crear el caché y almacenar nuestro appshell
    const promesaCache = caches.open(CACHE_STATIC_NAME).then((cache)=>{
        return cache.addAll([
            'index.html',
            'images/1.png',
            'images/2.png',
            'images/3.png',
            'images/4.png',
            'JS/app.js'
        ]);
    });

    const promeInmutable = caches.open(CACHE_INMUTABLE_NAME).then((cacheInmutable)=>{
        return cacheInmutable.addAll([
            'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
            'https://code.jquery.com/jquery-3.5.1.min.js',
            'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js',
        ]);
    });

    
    event.waitUntil(Promise.all([promesaCache,promeInmutable]));
})

self.addEventListener('fetch',(event)=>{
    // 2.- Cache with network fallback
    // Primero va a buscar en cache y si lo no encuentra va a la red
    const respuestaCa = caches.match(event.request).then((res)=>{
        // Si mi request está en caché
        if (res){
            // respondemos con cache
            return res
        }
            console.log("Mi recurso no está en caché",event.request.url);
            return fetch(event.request).then(resNet=>{
                // Abro mi caché
                caches.open(CACHE_DYNAMIC_NAME).then(cache=>{
                    // Guardo mi respuesta de la red en caché
                    cache.put(event.request,resNet).then(()=>{
                        cleanCache(CACHE_DYNAMIC_NAME,4)
                    })
                    
                })
    
                // Respondo con el response de la red
                return resNet.clone();
            })
    });

    event.respondWith(respuestaCa);

});