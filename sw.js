const CACHE='dildo-v0.8.42-0842-PRODUCTION-BETSLIP';
const CORE=['./index.html?v=0.8.42','./manifest.json?v=0.8.42','./icon.png?v=0.8.42'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(e.request.mode==='navigate'){e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./index.html?v=0.8.42')));return}e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok&&u.origin===location.origin){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match(e.request)))});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();if(e.data?.type==='CLEAR_CACHES')e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))))});
