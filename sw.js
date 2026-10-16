// Service Worker для лендинга Мастера Грузии
// Базовое кэширование: оболочка страниц, манифест, стили, шрифты

// v3: районы из справочника в script.js, раскладка анкеты мастера парами,
// валидация имени и защита префикса +995. Версию ОБЯЗАТЕЛЬНО поднимать при
// изменении script.js/style.css — иначе у вернувшихся посетителей останется
// старая копия из кэша, и исправления до них не доедут.
// v6: подсказки местностей в script.js синхронизированы с подрайонами бота.
// v7: WhatsApp больше не форматируется под грузинский шаблон (номер может
// быть любой страны), коды операторов сведены с ботом, плейсхолдер телефона
// приведён к реальной маске «+995 5XX XXX XXX».
// v8: рамка поля телефона зеленеет только после полностью введённого
// номера — правка затрагивает и script.js, и style.css.
// v5: из прекэша убран путь /gradient-dots-bg--portable.css — такого файла в
// репозитории нет и никогда не было (стили класса .gradient-dots-bg лежат в
// style.css). Это ломало PWA целиком: cache.addAll() атомарен, один 404
// отклоняет весь промис, событие install падает, и service worker не
// устанавливался ВООБЩЕ — ни офлайна, ни ускорения повторных загрузок.
// ⚠️ Версию ОБЯЗАТЕЛЬНО поднимать при каждой правке script.js / style.css:
// оба файла лежат в PRECACHE_URLS ниже, и пока имя кэша прежнее, у
// вернувшегося посетителя service worker отдаёт СТАРЫЕ файлы из кэша —
// правка не доходит до людей, хотя на сервере она уже лежит.
// v9 — раскладка поля «Другой район» в модалке заявки + короткий плейсхолдер.
const CACHE_NAME = 'mastera-landing-v9';

const PRECACHE_URLS = [
  '/',
  '/ru/',
  '/ge/',
  '/en/',
  '/site.webmanifest',
  '/style.css',
  '/service.css',
  '/script.js',
  '/image/favicon.svg',
  '/image/favicon.ico',
  '/image/web-app-manifest-192x192.png',
  '/image/web-app-manifest-512x512.png',
];

// ── Установка: прекэш ключевых ресурсов ──────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// ── Активация: удаляем старые кэши ───────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: стратегия Network First для HTML, Cache First для статики ─────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Только собственные запросы
  if (url.origin !== self.location.origin) return;

  // HTML-страницы — Network First (свежий контент важнее)
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
    return;
  }

  // Статика (CSS, JS, изображения, шрифты) — Cache First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      });
    })
  );
});
