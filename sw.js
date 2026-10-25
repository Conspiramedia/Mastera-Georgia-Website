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
// v10 — состояние кнопки при отправке заявки («Отправляем…») и фоновый
//       Formspree: отправка с фото занимала до 10 секунд молча.
// v11 — предзаполненный текст WhatsApp-кнопки теперь называет услугу и район
//       лендинга («Интересует услуга: Мастер на час, район Ваке»), а не общее
//       «Нужен мастер в Тбилиси»: оператор видит запрос клиента сразу.
// v13 — кнопка «Заказать услугу» на первом экране (оранжевая, стиль сайта).
// Версию обязательно поднимать при любой правке style.css/script.js: статика
// отдаётся Cache First, и без этого вернувшийся посетитель получит свежий HTML
// со старым стилем — кнопка приедет неоформленной.
// v22 — ночной режим окна благодарности: в «тихие часы» бота (22:00–08:00,
//       выходные до 09:00) вместо «15–60 минут» показывается честное
//       «На связи с 08:00». Тексты бейджа переехали из HTML 105 страниц
//       в словарь i18n — заодно ушло расхождение «15–60» против «30–60».
// v23 — подпись ночного бейджа «Время ответа» вместо «Заявка принята»:
//       та же фраза стояла заголовком окна и дублировалась сама с собой.
//       Заодно статика в HTML подключается с ?v=<версия> (см. ниже).

// Версия статики. Одно число на три места: имя кэша, адреса в PRECACHE_URLS
// и строки `?v=` в 108 HTML-страницах.
//
// ⚠️ При правке script.js / style.css / service.css поднимать ОБЯЗАТЕЛЬНО.
// Руками править не надо — есть скрипт, он меняет номер и здесь, и во всех
// HTML сразу (иначе прекэш разойдётся со страницами, см. ниже):
//
//     python bump-version.py          # поднять на единицу
//     python bump-version.py --check  # проверить, не разошлось ли
//
// Пока номер прежний, у посетителя остаётся старый файл.
//
// Зачем версия в адресе: без неё статика отдавалась по пути /script.js с
// Cache-Control max-age=14400, и после деплоя браузер ещё 4 часа брал файл
// из своего кэша, не спрашивая сервер. Узлы Cloudflare при этом обновлялись
// неравномерно — один отдавал новый файл, другой старый, и сброс кэша
// вручную (Purge Everything) требовался после КАЖДОГО деплоя. С версией в
// адресе новый файл — это новый URL: он доезжает до людей сразу.
const ASSET_VERSION = '24';

const CACHE_NAME = `mastera-landing-v${ASSET_VERSION}`;

// ⚠️ Адреса статики ДОЛЖНЫ совпадать с тем, что стоит в HTML (включая ?v=),
// иначе service worker скачает файл дважды и отдаст страницу с одной копией,
// а прекэш забьёт другой — расхождение тихое и ловится только руками.
const PRECACHE_URLS = [
  '/',
  '/ru/',
  '/ge/',
  '/en/',
  '/site.webmanifest',
  `/style.css?v=${ASSET_VERSION}`,
  `/service.css?v=${ASSET_VERSION}`,
  `/script.js?v=${ASSET_VERSION}`,
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
