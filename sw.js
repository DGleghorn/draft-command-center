const CACHE='dcc-v46-0';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('dcc-v')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;
  e.respondWith((async()=>{
    try{
      const fresh=await fetch(e.request,{cache:'no-store'});
      if(fresh.ok){const c=await caches.open(CACHE);c.put(e.request,fresh.clone()).catch(()=>{});}
      return fresh;
    }catch(err){
      const cached=await caches.match(e.request);
      return cached||caches.match('./index.html')||new Response('DCC offline',{status:503});
    }
  })());
});
