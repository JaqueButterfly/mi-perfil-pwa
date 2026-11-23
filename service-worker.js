
 // Nombre de la memoria caché de nuestra aplicación
const CACHE_NAME = "mi-perfil-v1";

// Archivos que queremos guardar
const ARCHIVOS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./img/foto_prueba.jpeg",
    "./img/icon-192.png",
    "./img/icon-512.png"
];

// Se ejecuta cuando se instala el Service Worker
self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ARCHIVOS);
        })
    );
    self.skipWaiting();
});

// Se ejecuta cuando el Service Worker se activa
self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((nombres) => {
            return Promise.all(
                nombres
                    .filter((nombre) => nombre !== CACHE_NAME)
                    .map((nombre) => caches.delete(nombre))
            );
        })
    );
    self.clients.claim();
});

// Permite utilizar los archivos guardados sin internet
self.addEventListener("fetch", (evento) => {
    if (evento.request.method !== "GET") return;

    evento.respondWith(
        fetch(evento.request).catch(() => {
            return caches.match(evento.request);
        })
    );
});
