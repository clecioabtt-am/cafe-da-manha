const CACHE="cafe-da-manha-v13-premium";
const APP_SHELL=["/","/index.html","/assets/premium.css","/manifest.webmanifest","/icons/icon.svg","/icons/icon-192.png","/icons/icon-512.png","/icons/apple-touch-icon.png","/offline.html"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("cafe-da-manha-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith("/api/")){
    // Cache only the public catalog and appearance. Orders and admin data stay online.
    const publicCatalog=["/api/menu","/api/settings"].includes(url.pathname);
    event.respondWith((async()=>{
      try{const response=await fetch(request);if(publicCatalog&&response.ok){const copy=response.clone();await (await caches.open(CACHE)).put(request,copy).catch(()=>{});}return response;}
      catch{const cached=publicCatalog?await caches.match(request):null;return cached||new Response(JSON.stringify({error:"Sem conexão com o servidor."}),{status:503,headers:{"Content-Type":"application/json"}});}
    })());return;
  }
  if(request.mode==="navigate"){
    event.respondWith((async()=>{try{const response=await fetch(request);if(response.ok){const copy=response.clone();await (await caches.open(CACHE)).put("/index.html",copy).catch(()=>{});}return response;}catch{return await caches.match("/index.html")||await caches.match("/offline.html");}})());return;
  }
  event.respondWith((async()=>{const cached=await caches.match(request);if(cached)return cached;const response=await fetch(request);if(response.ok){const copy=response.clone();await (await caches.open(CACHE)).put(request,copy).catch(()=>{});}return response;})());
});
