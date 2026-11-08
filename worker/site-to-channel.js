/**
 * Cloudflare Worker «Сайт → приватный Telegram-канал»
 * ════════════════════════════════════════════════════
 *
 * Заменяет HTTP-эндпоинты остановленного бота на время, пока бот выключен
 * (решение владельца 22.10.2026 — не платить за Railway, пока бот не нужен).
 *
 * Принимает те же два POST, что и бот, по тем же путям:
 *   POST /site/new-request  — заявка клиента  (sendLeadToBot в script.js)
 *   POST /site/new-master   — анкета мастера  (sendMasterLeadToBot в script.js)
 * и кладёт карточку в приватный канал владельца через Telegram Bot API.
 *
 * ⚠️ Worker вешается на ТОТ ЖЕ хост, что и бот (bot.mastera.ge, route
 * «bot.mastera.ge/site/*»). Поэтому script.js править НЕ нужно: константы
 * BOT_REQUEST_URL / BOT_MASTER_URL уже ведут на наш поддомен, а не на
 * технический адрес Railway. Переезд — это правка DNS/route, не правка сайта.
 *
 * ⚠️ Сайт ответа НЕ ЖДЁТ (fire-and-forget, .catch(() => {})). Значит любая
 * наша ошибка для клиента невидима: он увидит «Заявка отправлена» всегда.
 * Поэтому здесь нет места, где заявка потеряется без следа: сбой отправки
 * фото не отменяет текст, а провал всей отправки отвечает 502 (видно в
 * логах Worker) — и лид всё равно дублируется на email через Formspree,
 * который работает независимо от нас.
 *
 * Секреты (Workers → Settings → Variables, тип Secret — НЕ plaintext):
 *   BOT_TOKEN    — токен мастер-бота (тот же, что в .env; бот уже админ канала)
 *   LOG_CHAT_ID  — id приватного канала, вида -100…
 *   SITE_ORIGINS — (необяз.) список разрешённых Origin через запятую;
 *                  по умолчанию домены mastera.ge + старый mastera-tbilisi.ge
 */

// ──────────────────────────────────────────────────────────────────────
// Настройки
// ──────────────────────────────────────────────────────────────────────

// Разрешённые источники по умолчанию. Старый домен оставлен, пока жив
// 301-редирект: браузер ставит Origin по странице, С КОТОРОЙ ушёл запрос,
// поэтому со старой ссылки придёт старый Origin. Зеркалит SITE_ALLOWED_ORIGINS
// бота — списки должны совпадать, иначе заявки со старых ссылок отсеются.
const DEFAULT_ORIGINS = [
  'https://mastera.ge',
  'https://www.mastera.ge',
  'https://mastera-tbilisi.ge',
  'https://www.mastera-tbilisi.ge',
];

const TG_API = 'https://api.telegram.org';
const SEP = '━━━━━━━━━━━━━━━';     // разделитель секций — как в карточках бота
const DESC_LIMIT = 600;             // как limits.log_channel_desc_limit в config.yaml
const MAX_PHOTOS = 3;               // сайт жмёт максимум 3 фото
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;   // страховка от гигантского base64

// ──────────────────────────────────────────────────────────────────────
// Вспомогательные
// ──────────────────────────────────────────────────────────────────────

/** Экранирование под parse_mode=HTML.
 *
 * ⚠️ Обязательно на КАЖДОМ пользовательском значении. Telegram отклоняет
 * сообщение с непарными тегами ЦЕЛИКОМ — одна угловая скобка в описании
 * клиента, и карточка не придёт в канал вообще, а узнать об этом будет
 * негде (сайт ответа не ждёт). Та же защита стоит в notifications.py.
 */
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Строка в карточку: обрезка пробелов, отсечка пустышек и заглушек. */
function clean(v) {
  const s = String(v == null ? '' : v).trim();
  if (!s) return '';
  // «Не указан» / «—» в карточке только занимают строку — пропускаем,
  // как это делает _clean в notifications.py.
  if (s === '—' || s === 'Не указан' || s === 'Нет контакта') return '';
  return s;
}

/** Текущее время по Тбилиси «22.10 14:30» — как _now_str() бота. */
function nowTbilisi() {
  const parts = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Asia/Tbilisi',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => {
    const found = parts.find((p) => p.type === type);
    return found ? found.value : '';
  };
  // Собираем вручную, а не правим строку регуляркой: формат вывода
  // Intl отличается между движками (где-то «22.10, 14:30», где-то без
  // запятой), и разбор готовой строки ломался бы незаметно.
  return `${get('day')}.${get('month')} ${get('hour')}:${get('minute')}`;
}

/** CORS-заголовки ответа. Эхо-ответ строго разрешённым Origin. */
function corsHeaders(origin, allowed) {
  const h = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origin && allowed.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
  }
  return h;
}

/** Список разрешённых Origin: из секрета SITE_ORIGINS либо дефолт. */
function allowedOrigins(env) {
  const raw = (env.SITE_ORIGINS || '').trim();
  if (!raw) return DEFAULT_ORIGINS;
  return raw
    .split(',')
    .map((s) => s.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

/**
 * Проверка источника запроса. Секрета в публичном JS быть не может, поэтому
 * защита — сверка Origin/Referer + honeypot (ровно как у бота в /site/*).
 * Origin у POST из браузера приходит всегда; Referer — фолбэк.
 */
function originAllowed(request, allowed) {
  const origin = request.headers.get('Origin');
  if (origin) return allowed.includes(origin.replace(/\/$/, ''));
  const referer = request.headers.get('Referer');
  if (referer) {
    try {
      return allowed.includes(new URL(referer).origin);
    } catch (e) {
      return false;
    }
  }
  // Ни Origin, ни Referer — это не браузерный запрос с нашего сайта.
  return false;
}

// ──────────────────────────────────────────────────────────────────────
// Отправка в Telegram
// ──────────────────────────────────────────────────────────────────────

/** sendMessage в канал. Возвращает message_id или null (ошибку — в лог). */
async function sendMessage(env, text, { silent = false } = {}) {
  const url = `${TG_API}/bot${env.BOT_TOKEN}/sendMessage`;
  const body = {
    chat_id: env.LOG_CHAT_ID,
    text,
    parse_mode: 'HTML',
    disable_notification: silent,
    link_preview_options: { is_disabled: true },
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) {
      console.error('sendMessage отклонён Telegram:', JSON.stringify(data));
      return null;
    }
    return data.result && data.result.message_id;
  } catch (e) {
    console.error('sendMessage не отправлен:', e && e.message);
    return null;
  }
}

/**
 * dataURL («data:image/jpeg;base64,…») → Uint8Array.
 * Возвращает null на мусоре: одно битое фото не должно ронять заявку.
 */
function dataUrlToBytes(dataUrl) {
  try {
    const comma = String(dataUrl).indexOf(',');
    if (comma < 0) return null;
    const b64 = String(dataUrl).slice(comma + 1);
    const bin = atob(b64);
    if (!bin.length || bin.length > MAX_PHOTO_BYTES) return null;
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  } catch (e) {
    console.error('фото: не разобран dataURL:', e && e.message);
    return null;
  }
}

/**
 * Фото заявки в канал ответом на карточку (reply_to_message_id), чтобы в
 * ленте они висели под своей заявкой, а не отдельной кучей.
 *
 * Одно фото — sendPhoto, два-три — sendMediaGroup (альбомом, одним блоком).
 * Фото уходят ПОСЛЕ текста и отдельным запросом намеренно: ошибка здесь не
 * должна отменять карточку с контактами, за которой владелец и приходит.
 * Провал — только запись в лог Worker.
 */
async function sendPhotos(env, photos, replyToId) {
  const items = [];
  for (const p of photos.slice(0, MAX_PHOTOS)) {
    const bytes = dataUrlToBytes(p);
    if (bytes) items.push(bytes);
  }
  if (!items.length) return;

  const fd = new FormData();
  fd.append('chat_id', String(env.LOG_CHAT_ID));
  if (replyToId) fd.append('reply_to_message_id', String(replyToId));
  fd.append('disable_notification', 'true');

  try {
    if (items.length === 1) {
      fd.append('photo', new Blob([items[0]], { type: 'image/jpeg' }), 'photo1.jpg');
      const res = await fetch(`${TG_API}/bot${env.BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!data.ok) console.error('sendPhoto отклонён:', JSON.stringify(data));
      return;
    }
    // Альбом: media — JSON-описание со ссылками attach://<имя файла>,
    // сами файлы кладутся в ту же multipart-форму под этими именами.
    const media = items.map((_, i) => ({
      type: 'photo',
      media: `attach://photo${i + 1}`,
    }));
    fd.append('media', JSON.stringify(media));
    items.forEach((bytes, i) => {
      fd.append(
        `photo${i + 1}`,
        new Blob([bytes], { type: 'image/jpeg' }),
        `photo${i + 1}.jpg`,
      );
    });
    const res = await fetch(`${TG_API}/bot${env.BOT_TOKEN}/sendMediaGroup`, {
      method: 'POST',
      body: fd,
    });
    const data = await res.json();
    if (!data.ok) console.error('sendMediaGroup отклонён:', JSON.stringify(data));
  } catch (e) {
    console.error('фото не отправлены:', e && e.message);
  }
}

// ──────────────────────────────────────────────────────────────────────
// Карточки
// ──────────────────────────────────────────────────────────────────────

/**
 * Карточка заявки клиента. Формат повторяет карточку бота
 * (notifications._order_block + _contact_block), чтобы лента канала не
 * изменилась на вид: владелец читает её каждый день и ищет поля глазами.
 *
 * Контакты идут В КАРТОЧКУ ЦЕЛИКОМ — в канале сидит только владелец
 * (у бота это флаг limits.log_channel_client_contacts: true).
 * Появится второй участник, которому нельзя видеть телефоны, — секцию
 * контактов надо вынести во ВТОРОЙ канал, а не прятать строки: Telegram
 * не умеет показывать разным подписчикам разный текст одного поста.
 */
function buildRequestCard(p) {
  const lines = [];
  const category = clean(p.category) || '—';

  lines.push(`📦 <b>НОВАЯ ЗАЯВКА</b> · ${nowTbilisi()}`);
  lines.push(SEP);
  lines.push(`📋 <b>${esc(category.toUpperCase())}</b>`);

  const city = clean(p.city);
  if (city) lines.push(`🏙 Город: ${esc(city)}`);

  const district = clean(p.district) || '—';
  const sub = clean(p.subdistrict);
  lines.push(`📍 Район: ${esc(sub ? `${district}, ${sub}` : district)}`);

  if (p.urgent) lines.push('🚨 СРОЧНО');

  // Язык страницы, с которой пришла заявка: подсказка, на каком языке
  // звонить клиенту. У бота это поле уходило в AI-определение языка.
  const lang = clean(p.lang);
  if (lang) {
    const langName = { ru: 'русский', en: 'английский', ka: 'грузинский' }[lang] || lang;
    lines.push(`🗣 Язык клиента: ${esc(langName)}`);
  }

  lines.push('🌐 Источник: сайт');

  // Описание. Сайт присылает его строкой «Задача: …» — префикс оставляем,
  // он же стоит в карточках бота.
  const desc = clean(p.description);
  if (desc) {
    const short = desc.length > DESC_LIMIT ? `${desc.slice(0, DESC_LIMIT)}…` : desc;
    lines.push(`📝 ${esc(short)}`);
  }

  // Секция контактов.
  const contactLines = [];
  const name = clean(p.name);
  if (name) contactLines.push(`👤 Клиент: ${esc(name)}`);

  // p.contact — уже готовый многострочный блок, собранный на сайте
  // («📱 Tel.: …», «✈️ Telegram: …», «🟢 WhatsApp: …»). Экранируем
  // ПОСТРОЧНО, чтобы не потерять разбивку на строки.
  const contact = clean(p.contact);
  if (contact) {
    for (const raw of contact.split('\n')) {
      const line = raw.trim();
      if (line) contactLines.push(esc(line));
    }
  }
  // Телефон отдельным полем — страховка на случай, если строка contact
  // пустая или собралась без номера: остаться без телефона в этой модели
  // значит потерять заявку целиком, звонить больше некуда.
  const phone = clean(p.phone);
  if (phone && !contact.includes(phone)) {
    contactLines.push(`📱 Tel.: ${esc(phone)}`);
  }

  const address = clean(p.address);
  if (address) contactLines.push(`🏠 Адрес: ${esc(address)}`);

  if (contactLines.length) {
    lines.push(SEP);
    lines.push(contactLines.join('\n'));
  }

  const photos = Array.isArray(p.photos) ? p.photos.length : 0;
  if (photos) lines.push(`📸 Фото: ${photos} (ниже)`);

  return lines.join('\n');
}

/**
 * Карточка анкеты мастера. Отдельный заголовок и значок — в ленте они идут
 * вперемешку с заявками, и различать их надо с первого взгляда.
 *
 * Поле code (одноразовый код связки «анкета ↔ бот») в карточку НЕ выводим:
 * пока бот выключен, диплинк ?start=m_<code> никуда не ведёт, а лишняя
 * строка только путала бы. Сайт его присылает — просто игнорируем.
 */
function buildMasterCard(p) {
  const lines = [];
  lines.push(`👷 <b>АНКЕТА МАСТЕРА</b> · ${nowTbilisi()}`);
  lines.push(SEP);

  const name = clean(p.name);
  if (name) lines.push(`👤 Имя: ${esc(name)}`);

  const specialty = clean(p.specialty);
  if (specialty) lines.push(`🔧 Специальность: ${esc(specialty)}`);

  const city = clean(p.city);
  if (city) lines.push(`🏙 Город: ${esc(city)}`);

  const district = clean(p.district);
  if (district) lines.push(`📍 Район: ${esc(district)}`);

  const lang = clean(p.lang);
  if (lang) {
    const langName = { ru: 'русский', en: 'английский', ka: 'грузинский' }[lang] || lang;
    lines.push(`🗣 Язык анкеты: ${esc(langName)}`);
  }

  lines.push('🌐 Источник: сайт');

  const about = clean(p.message);
  if (about) {
    const short = about.length > DESC_LIMIT ? `${about.slice(0, DESC_LIMIT)}…` : about;
    lines.push(`📝 О себе: ${esc(short)}`);
  }

  // Контакты мастера — отдельной секцией, как в карточке заявки.
  const contactLines = [];
  const phone = clean(p.phone);
  if (phone) contactLines.push(`📱 Tel.: ${esc(phone)}`);
  const tg = clean(p.telegram);
  if (tg) contactLines.push(`✈️ Telegram: ${esc(tg)}`);
  const wa = clean(p.whatsapp);
  if (wa) contactLines.push(`🟢 WhatsApp: ${esc(wa)}`);

  if (contactLines.length) {
    lines.push(SEP);
    lines.push(contactLines.join('\n'));
  }

  return lines.join('\n');
}

// ──────────────────────────────────────────────────────────────────────
// Обработка запроса
// ──────────────────────────────────────────────────────────────────────

/** Ответ сайту. Форма ответа не важна (сайт его не читает), но пусть будет JSON. */
function json(data, status, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const allowed = allowedOrigins(env);
    const origin = (request.headers.get('Origin') || '').replace(/\/$/, '');
    const cors = corsHeaders(origin, allowed);

    // Предполётный запрос браузера.
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Служебная проверка живости: открыть в браузере и убедиться, что
    // route повешен и секреты заданы, НЕ отправляя заявку в канал.
    if (request.method === 'GET' && url.pathname === '/site/health') {
      return json(
        {
          ok: true,
          worker: 'site-to-channel',
          token: Boolean(env.BOT_TOKEN),
          chat: Boolean(env.LOG_CHAT_ID),
        },
        200,
        cors,
      );
    }

    if (request.method !== 'POST') {
      return json({ ok: false, error: 'method_not_allowed' }, 405, cors);
    }

    const isRequest = url.pathname === '/site/new-request';
    const isMaster = url.pathname === '/site/new-master';
    if (!isRequest && !isMaster) {
      return json({ ok: false, error: 'not_found' }, 404, cors);
    }

    // Источник. Секрета в публичном JS нет, поэтому это основной барьер.
    if (!originAllowed(request, allowed)) {
      console.warn('отклонён чужой источник:', origin || request.headers.get('Referer'));
      return json({ ok: false, error: 'forbidden_origin' }, 403, cors);
    }

    // Без секретов отправлять некуда. Отвечаем 503 и пишем в лог: сайт
    // ответа не читает, поэтому единственный способ это заметить —
    // лог Worker либо ручная проверка /site/health.
    if (!env.BOT_TOKEN || !env.LOG_CHAT_ID) {
      console.error('не заданы секреты BOT_TOKEN / LOG_CHAT_ID');
      return json({ ok: false, error: 'not_configured' }, 503, cors);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return json({ ok: false, error: 'bad_json' }, 400, cors);
    }
    if (!payload || typeof payload !== 'object') {
      return json({ ok: false, error: 'bad_payload' }, 400, cors);
    }

    // Honeypot: поле _gotcha скрыто от человека, заполнить его может только
    // бот-спамер. Отвечаем ТИХИМ УСПЕХОМ — спамеру не за что цепляться,
    // а в канал ничего не уходит. Так же устроено у бота.
    if (clean(payload.honeypot)) {
      console.warn('honeypot: запрос отброшен без отправки');
      return json({ ok: true }, 200, cors);
    }

    const text = isRequest ? buildRequestCard(payload) : buildMasterCard(payload);
    // Заявка должна звенеть: владелец реагирует на неё вручную, и чем
    // быстрее, тем выше шанс сделки. Анкета мастера не срочная — тихо.
    const msgId = await sendMessage(env, text, { silent: isMaster });

    if (!msgId) {
      // Карточка не ушла. Говорим об этом честно (502 виден в аналитике
      // Worker), хотя сайт ответа и не прочитает: лид при этом не потерян —
      // он параллельно уходит на email через Formspree.
      return json({ ok: false, error: 'telegram_failed' }, 502, cors);
    }

    // Фото — вторым запросом, ответом на карточку. Ответ сайту не ждёт их:
    // ctx.waitUntil даёт Worker достроить отправку уже после ответа.
    if (isRequest && Array.isArray(payload.photos) && payload.photos.length) {
      ctx.waitUntil(sendPhotos(env, payload.photos, msgId));
    }

    return json({ ok: true, message_id: msgId }, 200, cors);
  },
};
