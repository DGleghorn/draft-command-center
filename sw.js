const CACHE="dcc-v39-0-mobile";
self.addEventListener("install",e=>e.waitUntil(self.skipWaiting()));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("dcc-v")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(fetch(e.request).then(r=>{if(new URL(e.request.url).origin===location.origin){const q=r.clone();caches.open(CACHE).then(c=>c.put(e.request,q)).catch(()=>{});}return r}).catch(()=>caches.match(e.request)))});
self.addEventListener("message",e=>{if(e.data?.type==="SKIP_WAITING")self.skipWaiting();if(e.data?.type==="DCC_CHECK_VERSION")e.source?.postMessage({type:"DCC_UPDATE",version:"39.0"})});
