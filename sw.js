/* PinHome 서비스워커 — 브라우저 푸시 수신 */
self.addEventListener('push', function (event) {
  var data = {};
  try { data = event.data ? event.data.json() : {}; }
  catch (e) { data = { title: 'PinHome', body: event.data ? event.data.text() : '' }; }
  var title = data.title || 'PinHome';
  var options = {
    body: data.body || '',
    data: { url: data.url || '/' },
    tag: data.tag || 'pinhome',
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf(url) !== -1 && 'focus' in list[i]) return list[i].focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

/* PWA 설치 조건 충족용 최소 fetch 핸들러 (네트워크 그대로 통과) */
self.addEventListener('fetch', function (event) {
  // 별도 캐싱 없이 기본 네트워크 요청을 그대로 사용
});
