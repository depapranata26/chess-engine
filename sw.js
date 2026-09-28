const CACHE='jewel-chess-v1';
const CORE=['./','./index.html','./manifest.json'];
const CDN=[
  'https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js'
];
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll(CORE);
    try{ await c.addAll(CDN); }catch(_){/* offline-nanti */}
    self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const ks=await caches.keys();
    await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    self.clients.claim();
  })());
});
self.addEventListener('fetch',e=>{
  e.respondWith((async()=>{
    const hit=await caches.match(e.request);
    if(hit) return hit;
    try{
      const res=await fetch(e.request);
      if(e.request.method==='GET' && res.ok){
        const c=await caches.open(CACHE);
        c.put(e.request,res.clone());
      }
      return res;
    }catch(_){ return caches.match('./index.html'); }
  })());
});
