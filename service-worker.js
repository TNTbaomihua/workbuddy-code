/* 日常记录 · Service Worker（离线缓存 + 可安装） */
/* 网络优先策略：在线时始终拉取最新文件，避免旧缓存导致页面打不开；离线时回退到缓存，保证断网也能打开 */
const CACHE = 'dailylife-v18';
const ASSETS = [
  './', './index.html', './manifest.json?v=18',
  './css/styles.css?v=18', './js/icons.js?v=18', './js/app.js?v=18',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png'
];

self.addEventListener('install', e => {
  // 预缓存核心资源；若失败也不阻塞（走网络）
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    // cache:'no-cache' 强制与服务器重新验证，杜绝 HTTP 启发式缓存拿到旧文件
    fetch(e.request, { cache: 'no-cache' })
      .then(resp => {
        // 仅缓存同源且成功的响应
        if (resp && resp.ok && resp.type !== 'opaque') {
          const cp = resp.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {});
        }
        return resp;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
