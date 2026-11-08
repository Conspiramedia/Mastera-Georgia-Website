/* ============================================================
   Mastera — интерактив шапки
   ============================================================
   Два элемента:
     1. Выпадающий список услуг в меню (открытие по наведению).
     2. Модальное окно выбора города.

   Почему списки лежат здесь, а не в разметке каждой страницы:
   страниц будет порядка сотни, и повторённый в них список
   разойдётся при первой же правке. Здесь он один.
   ============================================================ */

(function () {
    'use strict';

    // Язык берём из <html lang>, а не из URL: на локальном сервере
    // путь может начинаться с чего угодно.
    var LANG = (document.documentElement.lang || 'ru').toLowerCase();
    // ⚠️ В разметке грузинский помечен как ka — это его код по
    // ISO, и так его понимают поисковик и экранный диктор. В
    // путях и ключах словарей он остаётся ge (/ge/, name.ge),
    // поэтому здесь приводим одно к другому. Без этой строки
    // грузинские страницы молча откатывались на русский: на
    // /ge/ в меню стояло «Тбилиси» вместо «თბილისი».
    if (LANG === 'ka') LANG = 'ge';
    if (LANG !== 'ru' && LANG !== 'en' && LANG !== 'ge') LANG = 'ru';

    /* ── Данные ──────────────────────────────────────────────
       ⚠️ Услуги и города дублируются в боте (config.yaml →
       locations и master_registration.specialties). Добавляя
       запись здесь, правь и там — иначе заявка уйдёт в «Другое».
       Подробности — в CLAUDE.md, раздел «Парные правки». */

    var CITIES = [
        {
            slug: 'tbilisi',
            name: { ru: 'Тбилиси', en: 'Tbilisi', ge: 'თბილისი' },
            note: {
                ru: '10 районов · выезд в день обращения',
                en: '10 districts · same-day visit',
                ge: '10 უბანი · გასვლა მიმართვის დღეს'
            }
        },
        {
            slug: 'batumi',
            name: { ru: 'Батуми', en: 'Batumi', ge: 'ბათუმი' },
            note: {
                ru: '5 районов · выезд в день обращения',
                en: '5 districts · same-day visit',
                ge: '5 უბანი · გასვლა მიმართვის დღეს'
            }
        }
    ];

    // Услуги для выпадашки. slug — папка лендинга, все страницы
    // лежат по схеме /<lang>/<city>/<slug>/.
    //
    // ⚠️ ready — СПИСОК ГОРОДОВ, где страница уже существует, а не
    // «да/нет»: сайт делается постепенно, и страница сантехника
    // есть в Тбилиси, но ещё нет в Батуми. Выбрав Батуми,
    // посетитель уходил бы в 404. Где страницы нет — ссылка ведёт
    // на форму заявки: это хуже лендинга, но лучше ошибки.
    // Создав страницу, добавь сюда её город.
    /* ⚠️ Слаги — ровно те, что на работающем mastera.ge. Их
       нельзя придумывать: новый сайт заменит старый на том же
       домене, и адрес, не совпавший со старым, означает либо
       потерянную позицию в поиске, либо редирект — а редиректов
       мы не делаем (ТЗ, «ГЛАВНОЕ ПРАВИЛО»).

       Слаг зависит от города: у большинства услуг он с
       суффиксом (santehnik-tbilisi / santehnik-batumi), но у
       трёх — кондиционеры, стиральные машины, двери и замки —
       суффикса нет вовсе, и города различает только путь. Поэтому
       здесь `slugs`, а не один `slug`.

       Названия взяты с карточек старого сайта на всех трёх
       языках — не переведены заново, чтобы подписи совпадали. */
    var SERVICES = [
        { icon: 'tool',   slugs: { tbilisi: 'master-na-chas-tbilisi',     batumi: 'master-na-chas-batumi' },
          name: { ru: 'Мастер на час',      en: 'Handyman',                ge: 'ხელოსანი' } },
        { icon: 'drop',   slugs: { tbilisi: 'santehnik-tbilisi',          batumi: 'santehnik-batumi' },
          name: { ru: 'Сантехник',          en: 'Plumber',                 ge: 'სანტექნიკოსი' } },
        { icon: 'bolt',   slugs: { tbilisi: 'elektrik-tbilisi',           batumi: 'elektrik-batumi' },
          name: { ru: 'Электрик',           en: 'Electrician',             ge: 'ელექტრიკოსი' } },
        { icon: 'box',    slugs: { tbilisi: 'sborka-mebeli-tbilisi',      batumi: 'sborka-mebeli-batumi' },
          name: { ru: 'Сборка мебели',      en: 'Furniture Assembly',      ge: 'ავეჯის აწყობა' } },
        { icon: 'plug',   slugs: { tbilisi: 'bytovoy-remont-tbilisi',     batumi: 'bytovoy-remont-batumi' },
          name: { ru: 'Бытовой ремонт',     en: 'Home Repairs',            ge: 'საყოფაცხოვრებო რემონტი' } },
        { icon: 'frame',  slugs: { tbilisi: 'naveska-montazh-tbilisi',    batumi: 'naveska-montazh-batumi' },
          name: { ru: 'Навеска и монтаж',   en: 'Mounting & Installation', ge: 'დაკიდება და მონტაჟი' } },
        { icon: 'pc',     slugs: { tbilisi: 'remont-kompyuterov-tbilisi', batumi: 'remont-kompyuterov-batumi' },
          name: { ru: 'Компьютерный мастер',en: 'Computer Repair',         ge: 'კომპიუტერული ოსტატი' } },
        { icon: 'truck',  slugs: { tbilisi: 'gruzchiki-tbilisi',          batumi: 'gruzchiki-batumi' },
          name: { ru: 'Грузчики',           en: 'Movers',                  ge: 'მზიდავები' } },
        { icon: 'spark',  slugs: { tbilisi: 'klining-tbilisi',            batumi: 'klining-batumi' },
          name: { ru: 'Уборка / Клининг',   en: 'Cleaning',                ge: 'დასუფთავება' } },
        // ⚠️ Ниже — три услуги без суффикса города в слаге.
        //    Так на старом сайте; выравнивать «для красоты»
        //    нельзя, это смена адреса.
        { icon: 'snow',   slugs: { tbilisi: 'konditsionery',              batumi: 'konditsionery' },
          name: { ru: 'Кондиционеры',       en: 'Air conditioners',        ge: 'კონდიციონერები' } },
        { icon: 'washer', slugs: { tbilisi: 'stiralnye-mashiny',          batumi: 'stiralnye-mashiny' },
          name: { ru: 'Стиральные машины',  en: 'Washing machines',        ge: 'სარეცხი მანქანები' } },
        { icon: 'lock',   slugs: { tbilisi: 'dveri-zamki',                batumi: 'dveri-zamki' },
          name: { ru: 'Двери и замки',      en: 'Doors and locks',         ge: 'კარები და საკეტები' } }
    ];

    /* Районы выпадающего меню шапки: слаг справочника → слаг
       страницы /<lang>/<city>/master-na-chas-<slug>/.

       ⚠️ Карта нужна именно потому, что слаги НЕ совпадают: у
       Тбилиси они отличаются регистром (Vake → vake), а у Батуми
       расходятся совсем (OldBatumi → stary-batumi, NewBoulevard →
       novy-bulvar, BatumiAirport → aeroport-batumi). Выводить адрес
       из слага нельзя — треть ссылок ушла бы в 404.

       ⚠️ НАЗВАНИЙ районов здесь нет намеренно: единый источник
       подписей — CITIES в script.js (правило «один список районов»
       в CLAUDE.md), оттуда же строятся <option> формы и
       BOT_DISTRICT_MAP для бота. Второй список разошёлся бы с
       первым при первой же правке. Порядок пунктов тоже берётся из
       справочника, а не отсюда.

       Добавляя район: запись в CITIES (script.js) и строка сюда —
       в одном коммите, иначе район не появится в меню. */
    var DISTRICT_PAGES = {
        tbilisi: {
            Vake: 'vake', Saburtalo: 'saburtalo', Didube: 'didube',
            Chugureti: 'chugureti', Isani: 'isani', Samgori: 'samgori',
            Gldani: 'gldani', Nadzaladevi: 'nadzaladevi',
            Mtatsminda: 'mtatsminda', Krtsanisi: 'krtsanisi'
        },
        batumi: {
            OldBatumi: 'stary-batumi', NewBoulevard: 'novy-bulvar',
            Khimshiashvili: 'khimshiashvili', BoniGorodok: 'boni-gorodok',
            BatumiAirport: 'aeroport-batumi'
        }
    };

    // Подписи интерфейса.
    var T = {
        services:   { ru: 'Услуги',          en: 'Services',        ge: 'სერვისები' },
        allServices:{ ru: 'Все направления', en: 'All services',    ge: 'ყველა მიმართულება' },
        districts:  { ru: 'Районы',          en: 'Districts',       ge: 'რაიონები' },
        allDistricts: { ru: 'Все районы',    en: 'All districts',   ge: 'ყველა რაიონი' },
        geo:        { ru: 'География обслуживания', en: 'Service area', ge: 'მომსახურების გეოგრაფია' },
        chooseCity: { ru: 'Выберите город',  en: 'Choose a city',   ge: 'აირჩიეთ ქალაქი' },
        cityLead:   {
            ru: 'Мы работаем в двух городах Грузии. При переходе выбранная услуга сохранится.',
            en: 'We work in two cities in Georgia. Your chosen service will be kept.',
            ge: 'ჩვენ ვმუშაობთ საქართველოს ორ ქალაქში. არჩეული სერვისი შენარჩუნდება.'
        },
        close:      { ru: 'Закрыть',         en: 'Close',           ge: 'დახურვა' },
        showPhone:  { ru: 'Показать номер',  en: 'Show the number', ge: 'ნომრის ჩვენება' },
        lang:       { ru: 'Язык сайта',      en: 'Site language',   ge: 'საიტის ენა' },
        openMenu:   { ru: 'Открыть меню',    en: 'Open menu',       ge: 'მენიუს გახსნა' },
        closeMenu:  { ru: 'Закрыть меню',    en: 'Close menu',      ge: 'მენიუს დახურვა' },
        callMaster: { ru: 'Вызвать мастера', en: 'Book a master',   ge: 'ოსტატის გამოძახება' }
    };

    function t(key) { return T[key][LANG] || T[key].ru; }

    /* ── Значки ──────────────────────────────────────────────
       Контуры рисуем здесь: иначе каждая страница тащила бы
       двенадцать <svg> в разметке. */
    var ICONS = {
        tool:  '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
        drop:  '<path d="M12 2.7s6 6.6 6 10.3a6 6 0 0 1-12 0c0-3.7 6-10.3 6-10.3z"/>',
        bolt:  '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
        plug:  '<path d="M9 2v6"/><path d="M15 2v6"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
        box:   '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/>',
        frame: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>',
        snow:  '<line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
        washer:'<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="14" r="5"/><line x1="8" y1="6" x2="8.01" y2="6"/>',
        lock:  '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
        spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/>',
        brush: '<path d="M4 20s2-1 4-1 2 1 4 1 2-1 4-1 4 1 4 1"/><path d="M6 15V4a2 2 0 0 1 4 0v11"/><path d="M14 15V7a2 2 0 0 1 4 0v8"/>',
        truck: '<rect x="1" y="6" width="13" height="10" rx="1.5"/><path d="M14 9h4l3 3.5V16h-7z"/><circle cx="6" cy="18.5" r="2"/><circle cx="17" cy="18.5" r="2"/>',
        pc:    '<rect x="2" y="4" width="20" height="12" rx="2"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/>',
        pin:   '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>'
    };

    function svg(name, cls) {
        return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" fill="none" ' +
               'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
               'stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
    }

    /* ── Текущий город ───────────────────────────────────────
       Город страницы определяется ТОЛЬКО адресом.
       /ru/batumi/… — Батуми, всё остальное (/ru/, /ru/tbilisi/…) —
       Тбилиси: корень языка это главная Тбилиси, у неё свой
       заголовок «мастеров Тбилиси» и свои 10 районов.

       ⚠️ Раньше для корня брался город из localStorage, и это
       давало прямое противоречие на экране: посетитель, однажды
       выбравший Батуми, возвращался на /ru/ и видел «Батуми» в
       переключателе над заголовком «Сервис подбора мастеров
       Тбилиси». Память о выборе не может спорить с содержимым
       страницы — страницы у городов разные, и выбор города это
       переход, а не переключение подписи. */
    function currentCity() {
        var parts = location.pathname.split('/').filter(Boolean);
        for (var i = 0; i < CITIES.length; i++) {
            if (parts.indexOf(CITIES[i].slug) !== -1) return CITIES[i];
        }
        return CITIES[0];
    }

    /* Адрес услуги в заданном городе. Страница есть — ведём на
       неё, нет — на форму заявки. На странице услуги якорь
       «#lead» ведёт в никуда, поэтому даём абсолютный путь. */
    /* Какие страницы услуг уже свёрстаны на новом сайте.
       ⚠️ Перечисляем «город/слаг», а не город целиком: пока
       готова одна страница из двенадцати, остальные ссылки
       должны вести на форму, иначе посетитель попадёт в 404.
       Дописывать сюда строку в том же коммите, где появляется
       сама страница. */
    var READY_PAGES = [
        // Тбилиси
        'tbilisi/master-na-chas-tbilisi',
        'tbilisi/santehnik-tbilisi',
        'tbilisi/elektrik-tbilisi',
        'tbilisi/sborka-mebeli-tbilisi',
        'tbilisi/bytovoy-remont-tbilisi',
        'tbilisi/naveska-montazh-tbilisi',
        'tbilisi/remont-kompyuterov-tbilisi',
        'tbilisi/gruzchiki-tbilisi',
        'tbilisi/klining-tbilisi',
        'tbilisi/konditsionery',
        'tbilisi/stiralnye-mashiny',
        'tbilisi/dveri-zamki',
        // Батуми
        'batumi/master-na-chas-batumi',
        'batumi/santehnik-batumi',
        'batumi/elektrik-batumi',
        'batumi/sborka-mebeli-batumi',
        'batumi/bytovoy-remont-batumi',
        'batumi/naveska-montazh-batumi',
        'batumi/remont-kompyuterov-batumi',
        'batumi/gruzchiki-batumi',
        'batumi/klining-batumi',
        'batumi/konditsionery',
        'batumi/stiralnye-mashiny',
        'batumi/dveri-zamki'
    ];

    function serviceSlug(service, citySlug) {
        return service.slugs[citySlug] || service.slugs.tbilisi;
    }

    function serviceHref(service, citySlug) {
        var slug = serviceSlug(service, citySlug);
        if (READY_PAGES.indexOf(citySlug + '/' + slug) !== -1) {
            return '/' + LANG + '/' + citySlug + '/' + slug + '/';
        }
        // Страницы ещё нет — ведём на форму, а не в 404.
        return '/' + LANG + '/#lead';
    }

    /* ── Выпадающий список услуг ─────────────────────────── */

    function buildServicesDropdown() {
        var nav = document.querySelector('.site-nav');
        if (!nav) return;

        // Находим пункт «Услуги» — именно его превращаем в кнопку.
        var link = nav.querySelector('a[href$="#services"], a[href="#services"]');
        if (!link) return;

        var city = currentCity().slug;

        var wrap = document.createElement('div');
        wrap.className = 'nav-dropdown';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'site-nav__link nav-dropdown__btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-haspopup', 'true');
        btn.innerHTML = t('services') +
            '<svg class="nav-dropdown__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<polyline points="6 9 12 15 18 9"/></svg>';

        var panel = document.createElement('div');
        panel.className = 'nav-dropdown__panel';

        var grid = document.createElement('div');
        grid.className = 'nav-dropdown__grid';

        SERVICES.forEach(function (s, i) {
            var a = document.createElement('a');
            // Страницы готовы не все: недоделанные ведут на форму,
            // а не в 404. Город берётся из адреса страницы и при
            // жизни страницы не меняется — смена города это переход
            // на главную другого города.
            a.href = serviceHref(s, city);
            a.innerHTML = '<span class="nav-dropdown__icon">' + svg(s.icon) + '</span>' +
                          '<strong>' + (s.name[LANG] || s.name.ru) + '</strong>';
            grid.appendChild(a);
        });

        var all = document.createElement('a');
        all.className = 'nav-dropdown__all';
        all.href = (link.getAttribute('href').indexOf('/') === 0 ? '/' + LANG + '/' : '') + '#services';
        all.innerHTML = '<span>' + t('allServices') + '</span>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

        panel.appendChild(grid);
        panel.appendChild(all);
        wrap.appendChild(btn);
        wrap.appendChild(panel);
        link.parentNode.replaceChild(wrap, link);

        // Наведение на десктопе, нажатие — везде (на тач-экране
        // события наведения не приходят).
        var timer = null;

        function open() {
            clearTimeout(timer);
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        }

        function close() {
            wrap.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        }

        // ⚠️ Закрытие с задержкой: между кнопкой и панелью есть
        // зазор 18 px, и без паузы меню захлопывается, пока курсор
        // идёт к нужной услуге.
        function closeSoon() {
            clearTimeout(timer);
            timer = setTimeout(close, 180);
        }

        wrap.addEventListener('mouseenter', open);
        wrap.addEventListener('mouseleave', closeSoon);
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            wrap.classList.contains('is-open') ? close() : open();
        });
        btn.addEventListener('focus', open);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) close();
        });
    }

    /* ── Выпадающий список районов ────────────────────────
       Устроен так же, как список услуг: наведение на десктопе,
       нажатие на тач-экране, та же панель и та же задержка
       закрытия. Отличий два.

       Первое — сетка на 5 колонок: 10 районов Тбилиси ложатся
       ровно в две строки, 5 районов Батуми в одну. В трёх
       колонках (как у услуг) выходило бы четыре строки с одинокой
       записью в последней.

       Второе — без иконок-плашек: у услуг иконка различает
       сантехника и электрика, а 15 одинаковых булавок рядом
       читались бы как шум и съедали бы ширину у названий.

       ⚠️ Подписи берутся из window.MASTERA_CITIES — это CITIES из
       script.js. Он подключён ПОСЛЕ redesign.js, оба с defer,
       поэтому на момент init() справочника ещё нет: меню строится
       по событию load (тот же приём, что у buildContactBar).
       Без ожидания функция тихо вышла бы на первой же проверке. */

    function buildDistrictsDropdown() {
        var nav = document.querySelector('.site-nav');
        if (!nav) return;

        var link = nav.querySelector('a[href$="#districts"], a[href="#districts"]');
        if (!link) return;

        var city = currentCity().slug;
        var pages = DISTRICT_PAGES[city];
        if (!pages) return;

        /* Справочник районов из script.js. Если его нет (скрипт не
           загрузился, порядок подключения изменили) — выходим, и
           пункт остаётся обычной ссылкой на блок районов страницы.
           Это рабочее поведение, а не поломка. */
        var book = window.MASTERA_CITIES;
        if (!Array.isArray(book)) return;

        /* Город сопоставляем по РУССКОМУ названию: в справочнике
           script.js слага города нет вовсе (slug там у района), а
           поле ru — каноническое имя для бота и стабильное. */
        var RU_CITY = { tbilisi: 'Тбилиси', batumi: 'Батуми' };
        var entry = null;
        for (var i = 0; i < book.length; i++) {
            if (book[i] && book[i].ru === RU_CITY[city]) {
                entry = book[i];
                break;
            }
        }
        if (!entry || !Array.isArray(entry.districts)) return;

        /* Берём только районы, у которых есть страница: запись без
           страницы пропускаем молча — ссылка вела бы в 404, а это
           хуже отсутствующего пункта. */
        var items = entry.districts.filter(function (d) { return pages[d.slug]; });
        if (!items.length) return;

        var wrap = document.createElement('div');
        wrap.className = 'nav-dropdown';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'site-nav__link nav-dropdown__btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-haspopup', 'true');
        btn.innerHTML = t('districts') +
            '<svg class="nav-dropdown__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<polyline points="6 9 12 15 18 9"/></svg>';

        var panel = document.createElement('div');
        panel.className = 'nav-dropdown__panel nav-dropdown__panel--districts';

        var grid = document.createElement('div');
        grid.className = 'nav-dropdown__grid nav-dropdown__grid--districts';

        items.forEach(function (d) {
            var a = document.createElement('a');
            a.href = '/' + LANG + '/' + city + '/master-na-chas-' + pages[d.slug] + '/';
            /* ⚠️ В справочнике script.js грузинский ключ — ka (код по
               ISO), а в разметке и в LANG здесь — ge. Без перевода
               ключа грузинские подписи молча падали бы в русский
               фолбэк. */
            var name = d[LANG === 'ge' ? 'ka' : LANG] || d.ru;
            a.innerHTML = '<strong>' + name + '</strong>';
            grid.appendChild(a);
        });

        var all = document.createElement('a');
        all.className = 'nav-dropdown__all';
        all.href = (link.getAttribute('href').indexOf('/') === 0 ? '/' + LANG + '/' : '') + '#districts';
        all.innerHTML = '<span>' + t('allDistricts') + '</span>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

        panel.appendChild(grid);
        panel.appendChild(all);
        wrap.appendChild(btn);
        wrap.appendChild(panel);
        link.parentNode.replaceChild(wrap, link);

        var timer = null;

        function open() {
            clearTimeout(timer);
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        }

        function close() {
            wrap.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        }

        /* Задержка та же, что у услуг: между кнопкой и панелью зазор
           18 px, и без паузы меню захлопывается по пути к району. */
        function closeSoon() {
            clearTimeout(timer);
            timer = setTimeout(close, 180);
        }

        wrap.addEventListener('mouseenter', open);
        wrap.addEventListener('mouseleave', closeSoon);
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            wrap.classList.contains('is-open') ? close() : open();
        });
        btn.addEventListener('focus', open);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) close();
        });
    }

    /* ── Переключатель языка: три кнопки → одна ────────────
       В разметке лежат три обычные ссылки: так поисковик видит
       перелинковку языковых версий, и без JS переключатель
       остаётся рабочим. Здесь мы сворачиваем их в одну кнопку с
       выпадающим списком — три кнопки занимали 110 px, которые
       в шапке нужны городу, заявке и кнопке меню. */

    var LANG_NAMES = { ru: 'Русский', en: 'English', ge: 'ქართული' };

    function buildLangSwitch() {
        var box = document.querySelector('.lang-switch');
        if (!box) return;

        var links = box.querySelectorAll('.lang-switch__btn');
        if (links.length < 2) return;

        // Читаем адреса до перестройки: сами ссылки уедут в панель.
        var items = Array.prototype.map.call(links, function (a) {
            return {
                code: (a.textContent || '').trim().toLowerCase(),
                href: a.getAttribute('href'),
                active: a.classList.contains('is-active')
            };
        });

        var wrap = document.createElement('div');
        wrap.className = 'lang-drop';

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lang-drop__btn';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-label', t('lang'));
        btn.innerHTML =
            '<svg class="lang-drop__globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<circle cx="12" cy="12" r="9"/><path d="M3.2 9h17.6M3.2 15h17.6"/>' +
            '<path d="M12 3a16 16 0 0 1 0 18a16 16 0 0 1 0-18z"/></svg>' +
            '<span class="lang-drop__code">' + LANG.toUpperCase() + '</span>' +
            '<svg class="lang-drop__chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<polyline points="6 9 12 15 18 9"/></svg>';

        var panel = document.createElement('div');
        panel.className = 'lang-drop__panel';

        items.forEach(function (it) {
            var a = document.createElement('a');
            a.href = it.href;
            a.className = 'lang-drop__item' + (it.active ? ' is-active' : '');
            // ⚠️ В атрибуте — код языка по ISO: грузинский это ka,
            // ge — код страны. Экранный диктор по нему выбирает
            // произношение.
            a.setAttribute('lang', it.code === 'ge' ? 'ka' : it.code);
            a.innerHTML = '<span class="lang-drop__abbr">' + it.code.toUpperCase() + '</span>' +
                          '<span class="lang-drop__name">' +
                          (LANG_NAMES[it.code] || it.code.toUpperCase()) + '</span>' +
                          (it.active ? '<svg class="lang-drop__tick" viewBox="0 0 24 24" fill="none" ' +
                           'stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
                           'stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>' : '');
            panel.appendChild(a);
        });

        wrap.appendChild(btn);
        wrap.appendChild(panel);
        box.parentNode.replaceChild(wrap, box);

        var timer = null;

        function open() {
            clearTimeout(timer);
            wrap.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
        }

        function close() {
            wrap.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        }

        // Та же задержка, что у выпадающих услуг: между кнопкой и
        // панелью есть зазор, и без паузы список захлопывается,
        // пока курсор идёт к нужному языку.
        function closeSoon() {
            clearTimeout(timer);
            timer = setTimeout(close, 180);
        }

        wrap.addEventListener('mouseenter', open);
        wrap.addEventListener('mouseleave', closeSoon);
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            wrap.classList.contains('is-open') ? close() : open();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) close();
        });
    }

    /* ── Модальное окно выбора города ────────────────────── */

    function buildCityModal() {
        var pill = document.querySelector('.city-pill');
        if (!pill) return;

        var modal = document.createElement('div');
        modal.className = 'city-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', t('chooseCity'));
        modal.hidden = true;

        var cards = CITIES.map(function (c) {
            var isNow = c.slug === currentCity().slug;
            // Сохраняем страницу при переходе:
            // /ru/tbilisi/santehnik-tbilisi/ → /ru/batumi/santehnik-batumi/.
            // На главной — просто главная.
            var parts = location.pathname.split('/').filter(Boolean);
            var idx = -1;
            CITIES.forEach(function (x) {
                var i = parts.indexOf(x.slug);
                if (i !== -1) idx = i;
            });
            // Слаг после города: есть — страница услуги/района,
            // нет — главная города (или корневая /ru/).
            var slugInPath = idx !== -1 ? (parts[idx + 1] || '') : '';
            var href;
            if (slugInPath) {
                // Страница услуги: переходим на ту же услугу в
                // другом городе.
                // ⚠️ Меняется не только город в пути, но и сам
                // слаг: santehnik-tbilisi → santehnik-batumi.
                // Простая подмена сегмента города дала бы
                // /ru/batumi/santehnik-tbilisi/ — несуществующий
                // адрес.
                var svcHere = null;
                SERVICES.forEach(function (s) {
                    for (var key in s.slugs) {
                        if (s.slugs[key] === slugInPath) svcHere = s;
                    }
                });
                // Районная страница «мастер на час в районе»: в
                // SERVICES её нет (там только основная услуга
                // master-na-chas-tbilisi/batumi). Ведём на основную
                // «мастер на час» в другом городе.
                var isDistrict = /^master-na-chas-(?!tbilisi$|batumi$)/.test(slugInPath);
                var target;
                if (svcHere) {
                    target = serviceSlug(svcHere, c.slug);
                } else if (isDistrict) {
                    target = 'master-na-chas-' + c.slug;
                } else {
                    target = '';
                }
                if (target && READY_PAGES.indexOf(c.slug + '/' + target) !== -1) {
                    var copy = parts.slice();
                    copy[idx] = c.slug;
                    copy[idx + 1] = target;
                    href = '/' + copy.join('/') + '/';
                } else {
                    // Этой услуги в выбранном городе ещё нет —
                    // ведём на главную выбранного города, а не в ошибку.
                    href = '/' + LANG + '/' + (c.slug === CITIES[0].slug ? '' : c.slug + '/');
                }
            } else {
                // Главная города: ведём на главную выбранного
                // города. Тбилиси — корень /ru/, Батуми — /ru/batumi/.
                href = '/' + LANG + '/' + (c.slug === CITIES[0].slug ? '' : c.slug + '/');
            }
            return '<a class="city-card' + (isNow ? ' is-current' : '') + '" href="' + href +
                   '" data-city="' + c.slug + '">' +
                   '<span class="city-card__icon">' + svg('pin') + '</span>' +
                   '<span class="city-card__body">' +
                   '<strong>' + (c.name[LANG] || c.name.ru) + '</strong>' +
                   '<span class="city-card__note">' + (c.note[LANG] || c.note.ru) + '</span>' +
                   '</span></a>';
        }).join('');

        modal.innerHTML =
            '<div class="city-modal__backdrop" data-close></div>' +
            '<div class="city-modal__window">' +
              '<button type="button" class="city-modal__close" data-close aria-label="' + t('close') + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
                'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
              '</button>' +
              '<div class="section-head__eyebrow">' + t('geo') + '</div>' +
              '<h2 class="city-modal__title">' + t('chooseCity') + '</h2>' +
              '<p class="city-modal__lead">' + t('cityLead') + '</p>' +
              '<div class="city-modal__grid">' + cards + '</div>' +
            '</div>';

        document.body.appendChild(modal);

        var lastFocus = null;

        function open(e) {
            if (e) e.preventDefault();
            lastFocus = document.activeElement;
            modal.hidden = false;
            // Страница под окном не должна прокручиваться.
            document.body.style.overflow = 'hidden';
            // ⚠️ Пересчёт стилей вместо requestAnimationFrame: в
            // фоновой вкладке кадры не выдаются и обратный вызов
            // не приходит — окно остаётся прозрачным навсегда.
            void modal.offsetHeight;
            modal.classList.add('is-open');
            var first = modal.querySelector('.city-card');
            if (first) first.focus();
        }

        function close() {
            modal.classList.remove('is-open');
            document.body.style.overflow = '';
            // Ждём конца перехода, иначе окно исчезнет рывком.
            setTimeout(function () { modal.hidden = true; }, 200);
            if (lastFocus) lastFocus.focus();
        }

        pill.addEventListener('click', open);

        // ⚠️ Кнопка города в мобильном меню создаётся позже этой
        // модалки, поэтому слушаем через document, а не вешаем
        // обработчик на сам элемент — его в этот момент ещё нет.
        document.addEventListener('click', function (e) {
            if (e.target.closest && e.target.closest('[data-open-city]')) open(e);
        });

        modal.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-close') ||
                e.target.closest('[data-close]')) { close(); return; }

            // Карточка города — обычная ссылка на главную этого
            // города (/ru/ или /ru/batumi/). Браузер уходит по ней
            // сам, перехватывать нечего: город определяется адресом
            // страницы, а не состоянием в памяти.
            if (!e.target.closest('.city-card')) return;
            close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.hidden) close();
        });
    }

    /* ── Телефон под глазом ──────────────────────────────────
       Номер показан частично, полностью открывается по клику.
       Это не защита от роботов (номер лежит в разметке), а
       конверсия: чтобы узнать телефон, посетитель делает шаг,
       и этот шаг виден в статистике.

       ⚠️ Звонок остаётся рабочим и до раскрытия: href="tel:"
       настоящий. Прятать его смысла нет — на телефоне человек
       жмёт по номеру, а не разглядывает его. */

    function maskPhone(num) {
        // +995 557 645 196 → +995 (557) ***-**-96
        //
        // Маска донора: код страны и оператора открыты, середина
        // закрыта, видны две последние цифры. Форма номера
        // сохраняется — посетитель видит, что номер настоящий и
        // местный, но позвонить по нему не может, не раскрыв.
        //
        // ⚠️ Открыты ДВЕ цифры, не три: три давали бы вместе с
        // кодом оператора слишком много — номера в Грузии
        // девятизначные, и подобрать остаток стало бы заметно
        // проще.
        var digits = num.replace(/[^\d]/g, '');
        if (digits.length < 9) return num;

        var country = digits.slice(0, 3);   // 995
        var operator = digits.slice(3, 6);  // 557
        var tail = digits.slice(-2);        // 96

        return '+' + country + ' (' + operator + ') ***-**-' + tail;
    }

    function buildPhoneReveal() {
        var links = document.querySelectorAll('.topbar__phone');

        Array.prototype.forEach.call(links, function (link) {
            if (link.dataset.masked) return;

            var full = link.textContent.trim();
            link.dataset.masked = '1';
            link.dataset.full = full;

            var num = document.createElement('span');
            num.className = 'topbar__phone-num';
            num.textContent = maskPhone(full);

            var eye = document.createElement('span');
            eye.className = 'topbar__phone-eye';
            eye.setAttribute('role', 'button');
            eye.setAttribute('tabindex', '0');
            eye.setAttribute('aria-label', t('showPhone'));
            eye.innerHTML =
                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
                '<path d="M12 5C7 5 3.1 8.1 1 12c2.1 3.9 6 7 11 7s8.9-3.1 11-7c-2.1-3.9-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>' +
                '</svg>';

            link.textContent = '';
            link.appendChild(num);
            link.parentNode.insertBefore(eye, link.nextSibling);

            function reveal(e) {
                // Глаз раскрывает номер, но не уводит на звонок:
                // иначе на десктопе клик открыл бы приложение.
                if (e) { e.preventDefault(); e.stopPropagation(); }
                num.textContent = link.dataset.full;
                eye.remove();
            }

            eye.addEventListener('click', reveal);
            eye.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') reveal(e);
            });
        });
    }

    /* ── Мобильное меню ────────────────────────────────────
       Ниже 1120 px пункты меню скрыты, ниже 768 — ещё город и
       кнопка заявки. До этой правки они просто исчезали: на
       телефоне в шапке оставались логотип и язык, а попасть в
       услуги или оставить заявку из шапки было нельзя.

       Панель собирается из тех же данных, что и выпадающее меню
       услуг, плюс ссылки разметки — отдельного списка в HTML нет,
       иначе он разошёлся бы с десктопным. */

    function buildBurger() {
        var actions = document.querySelector('.header-actions');
        var header = document.querySelector('.site-header');
        if (!actions || !header) return;

        var cityObj = currentCity();
        var city = cityObj.slug;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'burger';
        btn.setAttribute('aria-label', t('openMenu'));
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', 'mobile-menu');
        btn.innerHTML = '<span></span><span></span><span></span>';
        actions.appendChild(btn);

        var menu = document.createElement('div');
        menu.className = 'mobile-menu';
        menu.id = 'mobile-menu';
        menu.hidden = true;
        menu.setAttribute('aria-hidden', 'true');

        var inner = document.createElement('div');
        inner.className = 'container mobile-menu__inner';

        // 1. Город — открывает ту же модалку, что и кнопка шапки
        //    на десктопе.
        var cityBtn = document.createElement('button');
        cityBtn.type = 'button';
        cityBtn.className = 'mobile-menu__city';
        cityBtn.setAttribute('data-open-city', '');
        cityBtn.innerHTML = svg('pin') +
            // ⚠️ Сразу текущий город, а не «Выберите город»:
            // город известен из адреса страницы, и приглашение
            // выбрать то, что уже выбрано, только путает.
            '<span class="mobile-menu__city-label">' +
            (cityObj.name[LANG] || cityObj.name.ru) + '</span>' +
            '<svg class="mobile-menu__city-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
            '<polyline points="9 18 15 12 9 6"/></svg>';
        inner.appendChild(cityBtn);

        // 2. Пункты основного меню — из разметки, чтобы названия
        //    и якоря не пришлось держать в двух местах.
        //    ⚠️ Только прямые потомки: внутри .site-nav к этому
        //    моменту лежит панель выпадающих услуг, и простой
        //    .site-nav a поймал бы все двенадцать — список услуг
        //    задвоился бы (проверено: 16 ссылок вместо 4).
        var navLinks = document.querySelectorAll('.site-nav > a[href]');
        if (navLinks.length) {
            var navGroup = document.createElement('div');
            navGroup.className = 'mobile-menu__group';
            Array.prototype.forEach.call(navLinks, function (src) {
                var a = document.createElement('a');
                a.href = src.getAttribute('href');
                a.className = 'mobile-menu__link';
                a.textContent = (src.textContent || '').trim();
                navGroup.appendChild(a);
            });
            inner.appendChild(navGroup);
        }

        // 3. Услуги. Заголовок нужен: без него список читается как
        //    продолжение пунктов меню.
        var head = document.createElement('p');
        head.className = 'mobile-menu__head';
        head.textContent = t('services');
        inner.appendChild(head);

        var group = document.createElement('div');
        group.className = 'mobile-menu__group';
        SERVICES.forEach(function (s, i) {
            var a = document.createElement('a');
            a.className = 'mobile-menu__link mobile-menu__link--svc';
            a.href = serviceHref(s, city);
            a.innerHTML = '<span class="mobile-menu__icon">' + svg(s.icon) + '</span>' +
                          '<span>' + (s.name[LANG] || s.name.ru) + '</span>';
            group.appendChild(a);
        });
        inner.appendChild(group);

        // 4. Телефон и заявка — внизу, как у донора: до них
        //    долистывают, уже решившись.
        //    ⚠️ Языков здесь нет намеренно: свёрнутая кнопка
        //    языка помещается в шапке на любой ширине (55 px
        //    против прежних 110 у трёх кнопок), и второй список
        //    в меню был бы дублем.
        var phoneSrc = document.querySelector('.topbar__phone');
        if (phoneSrc) {
            var tel = document.createElement('a');
            tel.className = 'mobile-menu__phone';
            tel.href = phoneSrc.getAttribute('href');
            // Номер открытый: сюда долистали намеренно, прятать его
            // здесь — мешать позвонить.
            tel.textContent = (phoneSrc.getAttribute('data-full') ||
                               phoneSrc.textContent || '').trim();
            inner.appendChild(tel);
        }

        var cta = document.createElement('a');
        cta.className = 'button button--primary mobile-menu__cta';
        // На странице услуги якорь #lead ведёт на её собственную
        // форму; на главной — тоже на свою. Берём ссылку из кнопки
        // шапки, чтобы не расходиться с ней.
        var headCta = document.querySelector('.header-actions .button');
        cta.href = headCta ? headCta.getAttribute('href') : '#lead';
        cta.textContent = t('callMaster');
        inner.appendChild(cta);

        menu.appendChild(inner);
        header.parentNode.insertBefore(menu, header.nextSibling);

        // ⚠️ Панель прижата к низу шапки, но шапка sticky, а
        // топбар над ней прокручивается: до прокрутки низ шапки на
        // 113 px, после — на 77. Жёсткий top в CSS разошёлся бы с
        // ней, поэтому считаем по факту при каждом открытии.
        function placeUnderHeader() {
            menu.style.top = Math.round(header.getBoundingClientRect().bottom) + 'px';
        }

        function open() {
            placeUnderHeader();
            menu.hidden = false;
            // ⚠️ Принудительный пересчёт стилей, а не
            // requestAnimationFrame: браузер должен увидеть
            // элемент видимым ДО класса, иначе переход не
            // проиграется — но в фоновой вкладке кадры не
            // выдаются, и обратный вызов rAF не приходит вовсе.
            // Меню тогда не открывается совсем: hidden снят, а
            // класса нет. Проверено — ровно так и было.
            void menu.offsetHeight;
            menu.classList.add('is-open');
            btn.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
            btn.setAttribute('aria-label', t('closeMenu'));
            menu.setAttribute('aria-hidden', 'false');
            document.body.classList.add('menu-open');
        }

        function close() {
            menu.classList.remove('is-open');
            btn.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', t('openMenu'));
            menu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-open');
            // Прячем после перехода: hidden сразу оборвал бы его.
            setTimeout(function () {
                if (!menu.classList.contains('is-open')) menu.hidden = true;
            }, 220);
        }

        btn.addEventListener('click', function () {
            menu.classList.contains('is-open') ? close() : open();
        });

        // Переход по ссылке внутри меню закрывает его: якорь на той
        // же странице адрес не меняет, и панель осталась бы висеть
        // поверх того, к чему человек прокрутился.
        menu.addEventListener('click', function (e) {
            if (e.target.closest && e.target.closest('a')) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
        });

        // ⚠️ Возврат на десктоп при открытом меню: без этого панель
        // остаётся в DOM с классом is-open, а блокировка прокрутки
        // на body висит, и страница не скроллится при закрытом с
        // виду меню.
        window.addEventListener('resize', function () {
            if (!menu.classList.contains('is-open')) return;
            if (window.innerWidth > 1120) { close(); return; }
            placeUnderHeader();
        });

        // Прокрутка страницы при открытом меню: топбар уезжает,
        // шапка поднимается — панель должна идти за её низом,
        // иначе между ними откроется щель.
        window.addEventListener('scroll', function () {
            if (menu.classList.contains('is-open')) placeUnderHeader();
        }, { passive: true });
    }

    /* ── Подпись города в шапке ───────────────────────────
       Страховка на случай, если в разметке страницы осталось
       чужое название: приводим подпись к городу из адреса.
       Ссылки услуг здесь не трогаем — они уже построены под
       нужный город в buildServicesDropdown(). */
    function syncCityLabel(slug) {
        var city = null;
        CITIES.forEach(function (c) { if (c.slug === slug) city = c; });
        if (!city) return;

        var labels = document.querySelectorAll(
            '.city-pill__label, .mobile-menu__city-label');
        Array.prototype.forEach.call(labels, function (el) {
            el.textContent = city.name[LANG] || city.name.ru;
        });

        var cards = document.querySelectorAll('.city-card');
        Array.prototype.forEach.call(cards, function (c) {
            c.classList.toggle('is-current', c.getAttribute('data-city') === slug);
        });
    }

    // Поиск по полному прайсу лендинга: строки фильтруются по
    // названию, пустые категории прячутся целиком.
    /* ── Нижняя панель связи: WhatsApp и Telegram ────────────
       Закреплена внизу экрана и не исчезает при прокрутке: на
       телефоне клиент решается написать в произвольный момент,
       а кнопки формы к этому времени уже уехали вверх.

       Ссылки берём из buildContactLinks() в script.js — там
       текст сообщения собирается под услугу, район и город
       страницы и выбирается бот по языку. Свой экземпляр этой
       логики здесь завёл бы вторую правду: правка текста в
       одном месте тихо разошлась бы с другим.

       Панель только для мобильных: на десктопе связь есть в
       шапке и подвале, и полоса внизу там лишь закрывала бы
       содержимое. Показ/скрытие — в CSS по max-width. */
    function buildContactBar() {
        if (document.querySelector('.contact-bar')) return;   // уже построена

        // ⚠️ buildContactLinks живёт в script.js, а тот подключён
        // ПОСЛЕ redesign.js и тоже с defer — к моменту init() его
        // код ещё не выполнен, и функции нет. Поэтому панель ждёт
        // полной загрузки, иначе молча не строится (проверено).
        if (typeof window.buildContactLinks !== 'function') {
            if (document.readyState !== 'complete') {
                window.addEventListener('load', buildContactBar, { once: true });
            }
            return;
        }

        var links = window.buildContactLinks();
        if (!links || !links.waHref || !links.tgHref) return;

        var caption = {
            ru: { wa: 'WhatsApp', tg: 'Telegram' },
            en: { wa: 'WhatsApp', tg: 'Telegram' },
            ge: { wa: 'WhatsApp', tg: 'Telegram' }
        }[LANG] || { wa: 'WhatsApp', tg: 'Telegram' };

        var bar = document.createElement('nav');
        bar.className = 'contact-bar';
        // Подпись для скринридера: без неё панель объявляется
        // безымянной группой ссылок.
        bar.setAttribute('aria-label', links.labels.open);

        bar.innerHTML =
            '<a class="contact-bar__btn contact-bar__btn--wa" href="' + links.waHref + '"' +
            ' target="_blank" rel="noopener" aria-label="' + links.labels.wa + '">' +
                '<span class="contact-bar__ico" aria-hidden="true">' +
                    '<img src="/image/whatsapp-icon.webp" alt="" width="192" height="192"' +
                    ' loading="lazy" decoding="async">' +
                '</span>' +
                '<span>' + caption.wa + '</span>' +
            '</a>' +
            '<a class="contact-bar__btn contact-bar__btn--tg" href="' + links.tgHref + '"' +
            ' target="_blank" rel="noopener" aria-label="' + links.labels.tg + '">' +
                '<span class="contact-bar__ico" aria-hidden="true">' +
                    '<img src="/image/telegram-icon.webp" alt="" width="192" height="192"' +
                    ' loading="lazy" decoding="async">' +
                '</span>' +
                '<span>' + caption.tg + '</span>' +
            '</a>';

        document.body.appendChild(bar);
        // Поле снизу у страницы, чтобы панель не накрывала подвал
        // и последние строки текста.
        //
        // ⚠️ Раньше отступ ставился инлайном (document.body.style).
        // Инлайн сильнее любой медиазапроса, поэтому при расширении
        // окна панель пряталась, а 76 px пустоты под подвалом
        // оставались навсегда. Теперь JS только вешает класс, а
        // величину отступа задаёт CSS внутри того же
        // @media (max-width: 768px), что и саму панель: исчезает
        // панель — исчезает и отступ, пересчитывать ничего не надо.
        document.body.classList.add('has-contact-bar');
    }

    function buildPriceSearch() {
        var boxes = document.querySelectorAll('.price-search');
        Array.prototype.forEach.call(boxes, function (box) {
            var input = box.querySelector('input');
            var reset = box.querySelector('button');
            if (!input) return;

            var full = box.closest('.price-full');
            if (!full) return;
            var lines = full.querySelectorAll('.price-line');
            var groups = full.querySelectorAll('.price-group');

            function filter() {
                var q = (input.value || '').trim().toLowerCase();
                Array.prototype.forEach.call(lines, function (line) {
                    var name = line.querySelector('.price-line__name');
                    var text = name ? name.textContent.toLowerCase() : '';
                    line.classList.toggle('is-hidden', !!q && text.indexOf(q) === -1);
                });
                Array.prototype.forEach.call(groups, function (group) {
                    var anyVisible = Array.prototype.some.call(
                        group.querySelectorAll('.price-line'),
                        function (l) { return !l.classList.contains('is-hidden'); });
                    group.style.display = anyVisible ? '' : 'none';
                });
            }

            input.addEventListener('input', filter);
            if (reset) {
                reset.addEventListener('click', function () {
                    input.value = '';
                    filter();
                });
            }
        });
    }

    function init() {
        // ⚠️ Порядок не произвольный. Бургер собирает панель из уже
        // готовой шапки: пункты меню берёт из .site-nav, телефон —
        // из data-full, куда его кладёт маскировка. Поставить его
        // первым — значит получить панель без услуг и с закрытым
        // маской номером.
        // ⚠️ buildLangSwitch идёт ПОСЛЕ бургера: он заменяет
        // .lang-switch на свою кнопку, а бургер читает оттуда
        // список языков для мобильного меню. Поменять местами —
        // значит остаться на телефоне без выбора языка вовсе: в
        // шапке он ниже 420 px скрыт.
        buildServicesDropdown();
        /* ⚠️ По load, а не сразу: меню районов читает справочник
           из script.js, а тот подключён ниже и на этот момент ещё
           не выполнен. См. комментарий у самой функции. */
        window.addEventListener('load', buildDistrictsDropdown, { once: true });
        buildCityModal();
        buildPhoneReveal();
        buildBurger();
        buildLangSwitch();
        buildPriceSearch();
        buildContactBar();

        // Подпись города приводим к адресу страницы: в разметке
        // части страниц зашито «Тбилиси» независимо от города.
        syncCityLabel(currentCity().slug);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
