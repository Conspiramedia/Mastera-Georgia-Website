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

    // ============================================================
    // БЛОКИРОВКА ПРОКРУТКИ ПОД МОДАЛЬНЫМ ОКНОМ
    // ============================================================
    // ⚠️ Одна функция на все окна сайта (заявка, выбор города,
    // мобильное меню). Раньше каждое само писало
    // body.style.overflow = 'hidden', и все три одинаково дёргали
    // вёрстку вбок.
    //
    // Что происходило: overflow: hidden убирает полосу прокрутки,
    // освободившиеся 15 px достаются содержимому, и вся страница
    // становится шире — при открытии окна контент прыгал вправо,
    // при закрытии возвращался. Пользователь видит это как
    // «страница съехала и приблизилась» (замер на 1024: ширина
    // 1009 → 1024 → 1009).
    //
    // ⚠️ scrollbar-gutter: stable на <html> тут НЕ спасает, хотя и
    // стоит в стилях: при overflow: hidden место под полосу больше
    // не резервируется. Проверено замером — сдвиг те же 15 px и с
    // блокировкой на <html>, и на <body>.
    //
    // Поэтому ширину исчезнувшей полосы возвращаем отступом справа.
    // Счётчик, а не флаг: окно выбора города можно открыть поверх
    // формы заявки, и закрытие верхнего окна не должно снимать
    // блокировку, пока открыто нижнее.
    // ⚠️ Одного overflow: hidden НЕДОСТАТОЧНО. Он останавливает
    // жест и колесо, но НЕ программную и не инерционную прокрутку:
    // страница под меню продолжает ехать. Замер на 375x812: при
    // открытом меню scrollTop уводился с 1500 на 2400, а на телефоне
    // то же самое делает «доинерция» пальца после отпускания.
    //
    // Видно это было так: открыли бургер, фон тихо уполз, при
    // закрытии браузер вернул страницу к своей позиции — контент
    // прыгал вниз при открытии и сильнее вверх при закрытии.
    //
    // Поэтому держим тело на position: fixed со смещением top на
    // текущую прокрутку: уезжать становится нечему. При снятии
    // возвращаем ровно ту же позицию.
    var scrollLockCount = 0;
    var scrollLockPad = '';
    var scrollLockY = 0;
    var scrollLockStyles = null;

    function lockScroll() {
        scrollLockCount += 1;
        if (scrollLockCount > 1) return;
        // Ширина полосы прокрутки = сколько viewport потеряет при
        // её исчезновении. На телефонах и при overlay-полосах это
        // 0, и тогда отступ не нужен вовсе.
        var sbw = window.innerWidth - document.documentElement.clientWidth;
        var b = document.body;
        // ⚠️ Ширину снимаем ДО правки стилей. Как только встанет
        // overflow: hidden, полоса прокрутки исчезнет и
        // clientWidth вырастет на её толщину — прочитанное после
        // значение дало бы телу лишние 15 px.
        var shirinaDo = document.documentElement.clientWidth;
        scrollLockY = window.pageYOffset || document.documentElement.scrollTop || 0;
        // Запоминаем инлайновые значения целиком, а не по одному:
        // страница может прийти со своими, и затереть их нельзя.
        scrollLockStyles = {
            overflow: b.style.overflow,
            position: b.style.position,
            top: b.style.top,
            left: b.style.left,
            right: b.style.right,
            width: b.style.width
        };
        scrollLockPad = b.style.paddingRight;

        b.style.overflow = 'hidden';
        b.style.position = 'fixed';
        b.style.top = (-scrollLockY) + 'px';
        b.style.left = '0';
        b.style.right = '0';
        // ⚠️ width обязателен: position: fixed вынимает тело из
        // потока, и без явной ширины оно съёживается по содержимому.
        //
        // Берём ИМЕННО ту ширину, что была с полосой прокрутки
        // (clientWidth), а не 100%. При fixed тело меряется от
        // окна, в котором полосы уже нет, и 100% дало бы +15 px:
        // страница становилась шире, чем была.
        b.style.width = shirinaDo + 'px';

        // ⚠️ Отступа справа здесь БЫТЬ НЕ ДОЛЖНО. Он нужен был
        // старому способу (overflow: hidden без fixed), где тело
        // растягивалось на освободившееся место. Сейчас ширина
        // зафиксирована явно, и padding-right вдобавок к ней
        // сдвигал бы содержимое внутрь.
        //
        // Именно так и было видно на десктопной ширине 1024:
        // правый край шапки (position: sticky, то есть внутри
        // тела) уезжал с 1009 на 994 при открытии меню и
        // возвращался при закрытии. Замер: sbw = 15 px.
        //
        // Переменная sbw оставлена: она показывает, была ли полоса
        // вообще, и по ней видно, что компенсация уже не нужна.
        void sbw;
    }

    function unlockScroll() {
        if (scrollLockCount === 0) return;
        scrollLockCount -= 1;
        if (scrollLockCount > 0) return;
        var b = document.body;
        var st = scrollLockStyles || {};
        b.style.overflow = st.overflow || '';
        b.style.position = st.position || '';
        b.style.top = st.top || '';
        b.style.left = st.left || '';
        b.style.right = st.right || '';
        b.style.width = st.width || '';
        b.style.paddingRight = scrollLockPad;
        scrollLockStyles = null;

        // ⚠️ Возврат позиции — без плавности. На <html> стоит
        // scroll-behavior: smooth, и обычный scrollTo проигрывал бы
        // обратный путь анимацией: после закрытия меню страница
        // заметно «доезжала» на место. Поэтому выключаем поведение
        // на время прыжка и возвращаем как было.
        var htmlEl = document.documentElement;
        var sb = htmlEl.style.scrollBehavior;
        htmlEl.style.scrollBehavior = 'auto';
        window.scrollTo(0, scrollLockY);
        htmlEl.style.scrollBehavior = sb;
    }
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
        callMaster: { ru: 'Вызвать мастера', en: 'Book a master',   ge: 'ოსტატის გამოძახება' },

        /* ── Модальное окно заявки ───────────────────────────── */
        leadEyebrow: { ru: 'Заявка в Mastera Georgia',
                       en: 'Request to Mastera Georgia',
                       ge: 'განაცხადი Mastera Georgia-ში' },
        leadTitle:   { ru: 'Расскажите, что случилось',
                       en: 'Tell us what happened',
                       ge: 'მოგვიყევით, რა მოხდა' },
        leadLead:    { ru: 'Ответим в течение часа: уточним детали и предложим следующий шаг.',
                       en: 'We reply within an hour: we will clarify the details and suggest the next step.',
                       ge: 'ვუპასუხებთ ერთ საათში: დავაზუსტებთ დეტალებს და შემოგთავაზებთ შემდეგ ნაბიჯს.' },
        leadCity:    { ru: 'Город обслуживания', en: 'Service city', ge: 'მომსახურების ქალაქი' },

        /* ── Блок предварительной оценки ─────────────────────── */
        estTitle:    { ru: 'Нужна предварительная оценка?',
                       en: 'Need a rough estimate?',
                       ge: 'გჭირდებათ წინასწარი შეფასება?' },
        estNote:     { ru: 'Ответим в течение часа',
                       en: 'We reply within an hour',
                       ge: 'ვუპასუხებთ ერთ საათში' },

        /* ── Полоска после списка услуг ──────────────────────── */
        notFoundTitle: { ru: 'Не нашли свою задачу?',
                         en: 'Not found your task?',
                         ge: 'ვერ იპოვეთ თქვენი ამოცანა?' },
        notFoundText:  { ru: 'Опишите её своими словами — подберём мастера.',
                         en: 'Describe it in your own words — we will find a specialist.',
                         ge: 'აღწერეთ თქვენი სიტყვებით — შეგირჩევთ ოსტატს.' },
        notFoundBtn:   { ru: 'Получить консультацию',
                         en: 'Get a consultation',
                         ge: 'კონსულტაციის მიღება' },

        /* ── Финальный призыв ────────────────────────────────── */
        finalEyebrow: { ru: 'Заявка на вызов мастера',
                        en: 'Request a specialist',
                        ge: 'განაცხადი ოსტატის გამოძახებაზე' },
        finalTitle:   { ru: 'Опишите задачу — назовём цену заранее',
                        en: 'Describe the task — we name the price upfront',
                        ge: 'აღწერეთ ამოცანა — ფასს წინასწარ გეტყვით' },
        finalText:    { ru: 'Ответим в течение часа. Уточним детали, предложим мастера и начнём работу только после согласования цены.',
                        en: 'We reply within an hour. We will clarify the details, suggest a specialist and start only after the price is agreed.',
                        ge: 'ვუპასუხებთ ერთ საათში. დავაზუსტებთ დეტალებს, შემოგთავაზებთ ოსტატს და სამუშაოს დავიწყებთ მხოლოდ ფასის შეთანხმების შემდეგ.' },
        finalBtn:     { ru: 'Оставить заявку', en: 'Leave a request', ge: 'განაცხადის დატოვება' },
        finalCall:    { ru: 'Позвонить', en: 'Call', ge: 'დარეკვა' },

        /* ── Подвал ──────────────────────────────────────────── */
        ftAbout:     { ru: 'Mastera Georgia — ваш надёжный помощник по дому. Сантехника, электрика, ремонт бытовой техники, сборка мебели и мелкий бытовой ремонт. Работаем качественно и по фиксированным ценам. Условия и стоимость уточняйте в вашем городе.',
                       en: 'Mastera Georgia is your reliable help around the home. Plumbing, electrics, appliance repair, furniture assembly and small household repairs. We work to a high standard at fixed prices. Check terms and prices for your city.',
                       ge: 'Mastera Georgia — თქვენი საიმედო დამხმარე სახლში. სანტექნიკა, ელექტრიკა, საყოფაცხოვრებო ტექნიკის შეკეთება, ავეჯის აწყობა და წვრილი საოჯახო რემონტი. ვმუშაობთ ხარისხიანად და ფიქსირებულ ფასებში. პირობები და ღირებულება დააზუსტეთ თქვენს ქალაქში.' },
        ftAllServices: { ru: 'Все услуги', en: 'All services', ge: 'ყველა სერვისი' },
        ftHome:      { ru: 'Помощь по дому', en: 'Household help', ge: 'დახმარება სახლში' },
        ftAppliance: { ru: 'Бытовая техника', en: 'Home appliances', ge: 'საყოფაცხოვრებო ტექნიკა' },
        ftTech:      { ru: 'Уборка и переезд', en: 'Cleaning and moving', ge: 'დასუფთავება და გადაზიდვა' },
        ftCityInfo:  { ru: 'Город и информация', en: 'City and information', ge: 'ქალაქი და ინფორმაცია' },
        ftYourCity:  { ru: 'Ваш город', en: 'Your city', ge: 'თქვენი ქალაქი' },
        /* ⚠️ Часы работы в подвале обязаны совпадать с верхней
           плашкой: там 09:00–23:00 на 294 страницах разметки, и
           подвал был единственным местом с другим временем. */
        ftSchedule:  { ru: 'Ежедневно, 09:00–23:00', en: 'Daily, 09:00–23:00', ge: 'ყოველდღე, 09:00–23:00' },
        ftFacebook:  { ru: 'Мы в Facebook', en: 'We are on Facebook', ge: 'ჩვენ Facebook-ზე' },
        ftPrivacy:   { ru: 'Политика конфиденциальности', en: 'Privacy policy', ge: 'კონფიდენციალურობის პოლიტიკა' },
        ftTerms:     { ru: 'Пользовательское соглашение', en: 'Terms of service', ge: 'მომხმარებლის შეთანხმება' },
        ftDistricts: { ru: 'Районы обслуживания', en: 'Service districts', ge: 'მომსახურების რაიონები' },
        ftRights:    { ru: 'Все права защищены', en: 'All rights reserved', ge: 'ყველა უფლება დაცულია' }
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
        pin:   '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
        // Облачко реплики — у полоски «не нашли свою задачу».
        chat:  '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.9-.9L3 20.5l1.6-4.6A8.3 8.3 0 0 1 3.6 11 8.4 8.4 0 0 1 12 2.6a8.4 8.4 0 0 1 9 8.4z"/>',
        // Трубка — запасной вариант кнопки связи в финальном
        // призыве, если ссылка WhatsApp почему-то не собралась.
        phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>'
    };

    /* Значки мессенджеров — готовые картинки из /image/, те же
       самые, что в нижней панели связи. Рисовать их контуром
       нельзя: у WhatsApp и Telegram узнаваемые фирменные знаки,
       и самодельный похожий читается как подделка.

       Размер в атрибутах width/height — чтобы браузер отвёл
       место до загрузки и строка кнопки не дёргалась. */
    function brandIcon(name) {
        /* ⚠️ Без loading="lazy": значок крошечный, а отложенная
           загрузка даёт заметный скачок — кнопка доезжает до
           экрана пустой и значок появляется уже на глазах.
           Размеры в атрибутах — чтобы место было отведено
           заранее и строка не дёргалась. */
        return '<img class="button__brand" src="/image/' + name + '-icon.webp"' +
               ' alt="" width="24" height="24" decoding="async">';
    }

    /* Страница сервиса в Facebook. Конечный адрес, без
       profile.php?id=… — тот отдаёт 301. */
    var FACEBOOK_URL =
        'https://www.facebook.com/people/' +
        '%D0%9C%D0%B0%D1%81%D1%82%D0%B5%D1%80%D0%B0-' +
        '%D0%93%D1%80%D1%83%D0%B7%D0%B8%D0%B8/61595113524507/';

    /* ⚠️ Своя разметка, а не ICONS + svg(): та функция жёстко ставит
       fill="none" и stroke, под штриховые иконки сайта. Логотип
       Facebook — сплошная фигура, в обводке он не читается. */
    var FACEBOOK_ICON =
        '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
        '<path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 ' +
        '8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.92 3.77-3.92 1.1 0 ' +
        '2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 ' +
        '2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94z"/></svg>';

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
        panel.className = 'nav-dropdown__panel';

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

    /* ── Местности в карточках районов ───────────────────────
       Блок «География» на главных страницах показывал только имя
       района, а те же карточки на лендингах (.area-card) — ещё и
       популярные местности: «Сабуртало, Дельиси». Клиент, который
       не знает деления Тбилиси на районы, по голому названию не
       находил своё место.

       Подсказки берём из справочника script.js (window.
       MASTERA_CITIES), а НЕ вписываем в разметку шести страниц:
       список районов по правилу проекта живёт в одном месте, и
       копия здесь разошлась бы с ним при первой же правке.

       ⚠️ Район ищем по подписи, а не по ссылке: slug страницы и
       slug справочника совпадают не всегда (Старый Батуми —
       stary-batumi против OldBatumi), а подпись в карточке
       напечатана ровно тем же значением, что лежит в справочнике
       под языком страницы.

       ⚠️ В <select> формы те же подсказки намеренно НЕ выводятся
       (см. комментарий к DISTRICTS в script.js): там длинная
       подпись мешает выбору на телефоне. Карточка — другое
       место, в ней вторая строка как раз помогает. */
    function fillDistrictHints() {
        var cards = document.querySelectorAll('.district-card');
        if (!cards.length) return;

        var book = window.MASTERA_CITIES;
        if (!Array.isArray(book)) return;

        var RU_CITY = { tbilisi: 'Тбилиси', batumi: 'Батуми' };
        var cityRu = RU_CITY[currentCity().slug];
        var entry = null;
        for (var i = 0; i < book.length; i++) {
            if (book[i] && book[i].ru === cityRu) { entry = book[i]; break; }
        }
        if (!entry || !Array.isArray(entry.districts)) return;

        /* Ключи справочника — ru/en/ka, а LANG здесь ge: в
           разметке сайта грузинский раздел называется /ge/, тогда
           как код языка по ISO — ka. Без перевода ключа подписи
           молча падали бы в русский фолбэк. */
        var key = LANG === 'ge' ? 'ka' : LANG;
        var hintKey = 'hint' + key.charAt(0).toUpperCase() + key.slice(1);

        /* В справочнике у района три местности — он питает и
           другие места. В карточку главной они не влезают:
           карточек 15, сетка даёт ~217 px, а трём местностям
           нужно 331-430 px (замерено). Обрезка многоточием на
           полуслове выглядит поломкой, поэтому список режем
           заранее, по месту: ниже, когда карточки уже в DOM и
           ширину видно, оставляем столько местностей, сколько
           помещается целиком, но не меньше одной. */
        var byName = {};
        entry.districts.forEach(function (d) {
            var name = d[key] || d.ru;
            if (!name) return;
            var low = name.toLowerCase();
            byName[name] = (d[hintKey] || d.hintRu || '')
                .split(',')
                .map(function (s) { return s.trim(); })
                .filter(Boolean)
                /* Отбрасываем местность, совпадающую с названием
                   района: у Дигоми и Ортачалы первая в списке —
                   сам район, и подсказка читалась «Дигоми /
                   Дигоми», не добавляя ничего. В справочнике
                   такой повтор уместен (там список местностей
                   полный), в карточке — нет. */
                .filter(function (s) { return s.toLowerCase() !== low; });
        });

        var built = [];
        Array.prototype.forEach.call(cards, function (card) {
            // Уже достроена (повторный вызов) — не трогаем.
            if (card.querySelector('.district-card__name')) return;

            /* Имя лежит голым текстовым узлом рядом со значком.
               Берём именно его, а не textContent всей карточки:
               внутри есть ещё <svg>, и его разметка в текст не
               попадает, но пробелы вокруг — да. */
            var textNode = null;
            for (var n = 0; n < card.childNodes.length; n++) {
                var node = card.childNodes[n];
                if (node.nodeType === 3 && node.nodeValue.trim()) {
                    textNode = node;
                    break;
                }
            }
            if (!textNode) return;

            var name = textNode.nodeValue.trim();
            var parts = byName[name];
            if (!parts || !parts.length) return;   // нет в справочнике — оставляем как есть

            var wrap = document.createElement('span');
            wrap.className = 'district-card__text';

            var nameEl = document.createElement('span');
            nameEl.className = 'district-card__name';
            nameEl.textContent = name;

            var hintEl = document.createElement('span');
            hintEl.className = 'district-card__hint';
            hintEl.textContent = parts[0];

            wrap.appendChild(nameEl);
            wrap.appendChild(hintEl);
            card.replaceChild(wrap, textNode);

            built.push({ hint: hintEl, parts: parts });
        });

        /* Вторую местность добавляем отдельным проходом, когда
           все карточки уже в DOM: ширину можно только замерить,
           а замер после каждой вставки заставлял бы браузер
           пересчитывать раскладку по кругу.

           Условие — подсказка помещается целиком (scrollWidth не
           больше clientWidth). Если нет, остаётся одна местность:
           лучше короткая, но читаемая подсказка, чем обрезанная
           многоточием на середине слова. */
        built.forEach(function (item) {
            if (item.parts.length < 2) return;
            var one = item.hint.textContent;
            item.hint.textContent = item.parts[0] + ', ' + item.parts[1];
            if (item.hint.scrollWidth > item.hint.clientWidth) {
                item.hint.textContent = one;
            }
        });
    }

    /* ── Центрирование выпадающих панелей по экрану ───────
       Панели услуг и районов должны стоять ровно по середине
       окна, а не под своей кнопкой: кнопки стоят в разных местах
       шапки, и панель шириной 760 px, привязанная к краю кнопки,
       упиралась в край экрана.

       CSS сам этого не умеет. Панель позиционируется absolute от
       своей кнопки (position: fixed не годится: у .site-header
       есть backdrop-filter, а он делает шапку содержащим блоком
       для fixed-потомков — см. комментарий в redesign.css).
       Поэтому середину экрана добираем арифметикой: в CSS стоит
       left: calc(50% - var(--nav-dd-shift)), а здесь мы считаем,
       насколько центр кнопки отстоит от центра окна.

       ⚠️ Величину нельзя посчитать один раз: она зависит от
       ширины окна, от языка (длина слов двигает пункты меню) и от
       появления полосы прокрутки. Пересчитываем на resize.

       ⚠️ Читаем геометрию ДО записи стиля и пишем всем панелям
       после замеров — иначе каждая запись заставляла бы браузер
       пересчитывать раскладку перед следующим чтением. */

    function centerDropdownPanels() {
        var wraps = document.querySelectorAll('.nav-dropdown');
        if (!wraps.length) return;

        var screenCenter = document.documentElement.clientWidth / 2;
        var shifts = [];

        for (var i = 0; i < wraps.length; i++) {
            var r = wraps[i].getBoundingClientRect();
            shifts.push((r.left + r.width / 2) - screenCenter);
        }

        for (var j = 0; j < wraps.length; j++) {
            wraps[j].style.setProperty('--nav-dd-shift', shifts[j].toFixed(2) + 'px');
        }
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

    /* ── Подвал ──────────────────────────────────────────────
       Собираем здесь по трём причинам: он одинаков на всех
       страницах, в нём лежит список всех услуг (а он меняется),
       и на страницах политики и соглашения подвала НЕ БЫЛО вовсе
       — человек дочитывал документ и упирался в край страницы.

       ⚠️ Услуги берём из SERVICES — того же справочника, что
       строит меню шапки. Второй список разошёлся бы с первым при
       первой же правке, и подвал увёл бы в 404. */

    function buildFooter() {
        var old = document.querySelector('.site-footer');
        var city = currentCity();

        // Ссылка на услугу в городе страницы: есть готовая
        // страница — ведём на неё, нет — на форму заявки.
        function svcLink(s) {
            var slug = serviceSlug(s, city.slug);
            var ready = READY_PAGES.indexOf(city.slug + '/' + slug) !== -1;
            var href = ready
                ? '/' + LANG + '/' + city.slug + '/' + slug + '/'
                : '/' + LANG + '/#lead';
            return '<li><a href="' + href + '">' +
                   (s.name[LANG] || s.name.ru) + '</a></li>';
        }

        /* Услуги разложены по смыслу, а не подряд: двенадцать
           пунктов одной колонкой читаются как свалка. Группы те
           же, что у донора — техника, бытовые приборы, работы по
           дому. Индексы — порядок в SERVICES. */
        var GROUPS = [
            // Работы по дому: мастер, сантехник, электрик, мебель,
            // навеска, бытовой ремонт, двери и замки.
            { key: 'ftHome',      idx: [0, 1, 2, 3, 5, 4, 11] },
            // Техника: стиралки, кондиционеры, компьютеры.
            { key: 'ftAppliance', idx: [10, 9, 6] },
            // Прочие услуги по дому, не связанные с починкой.
            { key: 'ftTech',      idx: [8, 7] }
        ];

        var cols = GROUPS.map(function (g) {
            var items = g.idx.map(function (i) {
                return SERVICES[i] ? svcLink(SERVICES[i]) : '';
            }).join('');
            /* h4, а не h5: заголовки подвала идут после h2
               «Нужен мастер сегодня?», и уровни нельзя
               перепрыгивать — аудит доступности помечает разрыв
               h2 -> h4 как ошибку навигации. Колонки вложены в
               блок с h3, поэтому здесь ровно следующий уровень. */
            return '<div class="site-footer__col">' +
                   '<h4>' + t(g.key) + '</h4>' +
                   '<ul>' + items + '</ul></div>';
        }).join('');

        // Второй город — ссылка на его главную.
        var other = CITIES.filter(function (c) { return c.slug !== city.slug; })[0];
        var otherHref = '/' + LANG + '/' +
            (other.slug === CITIES[0].slug ? '' : other.slug + '/');

        var tel = pageTel();
        var telText = tel.replace('tel:', '')
            .replace(/^(\+\d{3})(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3 $4');

        var f = document.createElement('footer');
        f.className = 'site-footer';
        f.innerHTML =
            '<div class="container">' +
              '<div class="site-footer__top">' +

                '<div class="site-footer__brand">' +
                  /* Знак и название — теми же классами, что в
                     шапке: подвал и шапка показывают один логотип,
                     и дублировать его стили незачем.
                     ⚠️ .logo__sub здесь НЕ используем: он задуман
                     под «СЕРВИС ДЛЯ ДОМА» — прописные с разрядкой,
                     и часы работы в нём выглядели бы заголовком. */
                  '<div class="logo site-footer__logo">' +
                    '<span class="logo__mark">' + svg('tool') + '</span>' +
                    '<span class="logo__text">' +
                      '<span class="logo__name">Mastera Georgia</span>' +
                    '</span>' +
                  '</div>' +
                  '<p class="site-footer__about">' + t('ftAbout') + '</p>' +
                  '<ul class="site-footer__contacts">' +
                    '<li><a href="' + tel + '">' + telText + '</a></li>' +
                    '<li><a href="mailto:info@mastera.ge">info@mastera.ge</a></li>' +
                    /* ⚠️ Ссылка на Facebook была в футере старого сайта на
                       151 странице, а JS редизайна перерисовывает подвал
                       целиком — и терял её. Это возврат потерянного, а не
                       новый пункт.
                       Адрес сразу конечный: profile.php?id=… отдаёт 301 на
                       /people/…, и прежняя ссылка стоила лишнего редиректа.
                       Место выбрано в контактах, а не в site-footer__links:
                       там юридические ссылки (политика, соглашение), среди
                       них соцсеть теряется.
                       Порядок: телефон, почта, Facebook — это всё способы
                       связаться. Расписание идёт последним и закрывает
                       блок: оно не канал связи, а примечание к ним. */
                    '<li class="site-footer__social">' +
                      '<a href="' + FACEBOOK_URL + '" target="_blank" rel="noopener">' +
                        FACEBOOK_ICON +
                        '<span>' + t('ftFacebook') + '</span>' +
                      '</a>' +
                    '</li>' +
                    '<li class="site-footer__hours">' + t('ftSchedule') + '</li>' +
                  '</ul>' +
                '</div>' +

                '<div class="site-footer__services">' +
                  '<h3>' + t('ftAllServices') + '</h3>' +
                  '<div class="site-footer__cols">' + cols + '</div>' +
                '</div>' +

                '<div class="site-footer__info">' +
                  '<h3>' + t('ftCityInfo') + '</h3>' +
                  /* Карточка города — кнопка выбора, как в шапке:
                     подвал последнее, что видит человек, и смена
                     города здесь экономит ему путь наверх. */
                  '<button type="button" class="site-footer__city" data-open-city>' +
                    '<span class="site-footer__city-icon">' + svg('pin') + '</span>' +
                    '<span class="site-footer__city-body">' +
                      '<span class="site-footer__city-label">' + t('ftYourCity') + '</span>' +
                      '<strong>' + (city.name[LANG] || city.name.ru) + '</strong>' +
                    '</span>' +
                    '<svg class="site-footer__city-arrow" viewBox="0 0 24 24" fill="none" ' +
                    'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
                    'stroke-linejoin="round" aria-hidden="true">' +
                    '<line x1="5" y1="12" x2="19" y2="12"/>' +
                    '<polyline points="12 5 19 12 12 19"/></svg>' +
                  '</button>' +
                  '<ul class="site-footer__links">' +
                    '<li><a href="' + otherHref + '">' +
                      (other.name[LANG] || other.name.ru) + '</a></li>' +
                    /* ⚠️ Пункта «Мастерам» здесь быть не должно:
                       мастеров сервис не набирает, страниц
                       /<lang>/masters/ в проекте нет, и ссылка
                       вела в 404. См. заметку в script.js о том,
                       что слоя мастеров на сайте нет вовсе. */
                    '<li><a href="/' + LANG + '/#districts">' + t('ftDistricts') + '</a></li>' +
                    '<li><a href="/' + LANG + '/privacy/">' + t('ftPrivacy') + '</a></li>' +
                    '<li><a href="/' + LANG + '/terms/">' + t('ftTerms') + '</a></li>' +
                  '</ul>' +
                '</div>' +

              '</div>' +

              '<div class="site-footer__bottom">' +
                '<span>© ' + new Date().getFullYear() +
                  ' Mastera Georgia · ' + t('ftRights') + '</span>' +
                '<span>' + CITIES.map(function (c) {
                    return c.name[LANG] || c.name.ru;
                }).join(' · ') + '</span>' +
              '</div>' +
            '</div>';

        if (old) {
            old.parentNode.replaceChild(f, old);
        } else {
            // Политика и соглашение: подвала в разметке нет.
            document.body.appendChild(f);
        }
    }

    /* ── Модальное окно заявки ───────────────────────────────
       Кнопки «Оставить заявку» разбросаны по всей странице, а
       форма лежит одна — внизу, в секции #lead. Раньше они просто
       прокручивали к ней, и с первого экрана человек проезжал мимо
       всего содержимого, теряя по дороге намерение.

       ⚠️ Форма сюда ПЕРЕНОСИТСЯ, а не копируется. Копия означала бы
       два элемента с id="clientLeadForm" на странице: по этому id
       в script.js висят и обработчик отправки, и подстановка
       района, и блок загрузки фото, а getElementById возвращает
       только ПЕРВЫЙ найденный. Половина кнопок осталась бы без
       обработчика, а вторая слала бы заявку дважды. Поэтому узел
       один и тот же, он просто переезжает между секцией и окном.

       Из-за переезда окно собирается по событию load: к этому
       моменту script.js уже навесил обработчики и достроил форму
       (районы, фото). Переносить раньше — значит переносить
       полуфабрикат. */

    function buildLeadModal() {
        var form = document.getElementById('clientLeadForm');
        if (!form) return;

        // Место, откуда форму забрали: пустой якорь, по которому её
        // потом возвращают. Без него порядок блоков в секции #lead
        // сломался бы — форма встала бы в конец.
        var home = document.createComment('lead-form-home');
        form.parentNode.insertBefore(home, form);

        var modal = document.createElement('div');
        modal.className = 'lead-modal';
        modal.id = 'clientLeadFormModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', t('leadTitle'));
        modal.hidden = true;

        var cityNow = currentCity();

        modal.innerHTML =
            '<div class="lead-modal__backdrop" data-close></div>' +
            '<div class="lead-modal__window">' +
              '<button type="button" class="lead-modal__close" data-close aria-label="' + t('close') + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
                'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
              '</button>' +
              '<div class="lead-modal__scroll">' +
                '<div class="section-head__eyebrow">' + t('leadEyebrow') + '</div>' +
                '<h2 class="lead-modal__title">' + t('leadTitle') + '</h2>' +
                '<p class="lead-modal__lead">' + t('leadLead') + '</p>' +
                /* Город показываем всегда, даже когда он уже выбран:
                   человек должен видеть, куда поедет мастер. Кнопка
                   открывает ту же модалку городов, что и в шапке —
                   выбор города это переход на другую страницу, и
                   второго механизма для него заводить нельзя. */
                '<div class="lead-modal__city">' +
                  '<span class="lead-modal__city-label">' + t('leadCity') + '</span>' +
                  /* ⚠️ Подписи «Сменить» здесь нет намеренно. Поле
                     выглядит и ведёт себя как список рядом, а у
                     списка шеврон справа и так означает «можно
                     выбрать другое» — слово только дублировало
                     смысл и утяжеляло строку. */
                  '<button type="button" class="lead-modal__city-btn" data-open-city>' +
                    svg('pin') +
                    '<span>' + (cityNow.name[LANG] || cityNow.name.ru) + '</span>' +
                    '<svg class="lead-modal__city-chev" viewBox="0 0 24 24" fill="none" ' +
                    'stroke="currentColor" stroke-width="2.2" stroke-linecap="round" ' +
                    'stroke-linejoin="round" aria-hidden="true">' +
                    '<polyline points="6 9 12 15 18 9"/></svg>' +
                  '</button>' +
                '</div>' +
                '<div class="lead-modal__slot"></div>' +
              '</div>' +
            '</div>';

        document.body.appendChild(modal);

        var slot = modal.querySelector('.lead-modal__slot');
        var lastFocus = null;

        function open(e) {
            if (e) e.preventDefault();
            lastFocus = document.activeElement;
            slot.appendChild(form);
            // Кнопка отправки в окне — по содержимому, а не во всю
            // ширину: в узком окне растянутая кнопка выглядит
            // тяжёлой. В секции #lead она остаётся широкой.
            form.classList.add('lead-form--modal');
            modal.hidden = false;
            lockScroll();
            // Пересчёт стилей вместо requestAnimationFrame — тот же
            // приём, что в модалке городов: в фоновой вкладке кадры
            // не выдаются и окно осталось бы прозрачным.
            void modal.offsetHeight;
            modal.classList.add('is-open');
            var first = form.querySelector('input, select, textarea');
            if (first) first.focus();
        }

        function close() {
            modal.classList.remove('is-open');
            unlockScroll();
            setTimeout(function () {
                modal.hidden = true;
                // Форма возвращается на своё место в секции #lead.
                // Держать её в скрытом окне нельзя: без этого
                // прокрутка к #lead приводила бы к пустой секции.
                form.classList.remove('lead-form--modal');
                if (home.parentNode) home.parentNode.insertBefore(form, home.nextSibling);
            }, 200);
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }

        /* Какие кнопки открывают окно.

           ⚠️ НЕ все ссылки на #lead: пункт «Заявка» во внутренней
           навигации лендинга (.v-jumpbar) и ссылки в подвале — это
           оглавление страницы, от них ждут прокрутки, а не окна.
           Окно вешаем на призывы к действию: шапка, первый экран,
           блок цен, финальный призыв.

           ⚠️ Класс навигации именно .v-jumpbar. Проверено по
           разметке: .v-subnav на сайте нет вовсе, и guard по нему
           молча не срабатывал бы — пункт оглавления открывал бы
           окно вместо прокрутки.

           Слушаем на document, потому что часть кнопок (мобильное
           меню, нижняя панель связи, новые блоки ниже) создаётся
           позже этой функции. */
        document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[href$="#lead"], [data-open-lead]');
            if (!a) return;

            /* Карточка района или услуги без своей страницы
               (data-district / data-service): подставляем выбор в
               форму, чтобы человек не искал его в списке заново.
               Делаем это ДО открытия окна — иначе он увидит, как
               значение подставляется само уже на глазах. */
            var preDistrict = a.getAttribute('data-district');
            var preService = a.getAttribute('data-service');
            if (preDistrict || preService) {
                var form = document.getElementById('clientLeadForm');
                if (form) {
                    if (preDistrict) {
                        var ds = form.querySelector('[name="district"]');
                        // Список строит script.js из DISTRICTS. Если
                        // слага там нет, молча ничего не трогаем:
                        // пустой select лучше неверного района.
                        if (ds && ds.querySelector('option[value="' + preDistrict + '"]')) {
                            ds.value = preDistrict;
                            ds.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                    if (preService) {
                        var ss = form.querySelector('[name="service"]');
                        /* На лендинге это скрытое поле — туда кладём
                           категорию как есть. На главной это список,
                           и в нём ВОСЕМЬ укрупнённых пунктов, а не
                           все категории бота: «Стиральных машин» и
                           «Компьютерной помощи» среди них нет.

                           ⚠️ Поэтому значение сначала сводим к пункту
                           списка. Без этого присваивание молча не
                           срабатывало (проверено: поле оставалось
                           пустым) — select игнорирует значение, для
                           которого нет option. */
                        if (ss) {
                            var val = preService;
                            if (ss.tagName === 'SELECT' &&
                                !ss.querySelector('option[value="' + val + '"]')) {
                                val = LEAD_SELECT_FALLBACK[val] || '';
                            }
                            if (val) {
                                ss.value = val;
                                ss.dispatchEvent(new Event('change', { bubbles: true }));
                            }
                            /* Точная категория — скрытым полем, рядом
                               со списком. Список укрупнённый, и
                               «Настройка Wi-Fi» через него стала бы
                               «Другое»: заявку увидел бы узкий круг
                               мастеров вместо компьютерщиков.
                               script.js читает это поле первым. */
                            setExactService(form, preService);
                        }
                    }
                }
            }
            // Оглавление и подвал — обычная прокрутка.
            if (a.closest('.v-jumpbar') || a.closest('.site-footer')) return;
            // Ссылка на форму ДРУГОЙ страницы (/ru/#lead с лендинга):
            // пусть браузер уходит по ней, формы здесь может не быть.
            var href = a.getAttribute('href') || '';
            if (href.indexOf('#') > 0 && href !== '#lead') return;
            open(e);
        });

        modal.addEventListener('click', function (e) {
            if (e.target.hasAttribute('data-close') ||
                (e.target.closest && e.target.closest('[data-close]'))) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.hidden) close();
        });

        /* Окно благодарности показывает script.js после успешной
           отправки. Если заявку отправили из окна, его надо
           закрыть — иначе благодарность встанет поверх формы.
           Следим за появлением #thankYouModal: прямого вызова
           между файлами нет и заводить его незачем. */
        document.addEventListener('mastera:lead-sent', close);
    }

    /* ── Блоки-призывы по странице ───────────────────────────
       Три блока, которые должны стоять на всех 129 страницах.
       Собираем их здесь, а не правим разметку: блоки одинаковые
       везде, и вписанные руками они разошлись бы при первой же
       правке текста — как это уже случилось с .local-content.

       Каждый блок проверяет, нет ли его в разметке: на главных
       финальный призыв свёрстан, второй раз его рисовать не надо. */

    /* Категория бота → пункт списка услуг в форме.

       Список в форме укрупнённый: восемь пунктов вместо двенадцати
       с лишним категорий бота. Карточки новых услуг помечены
       категорией бота (её ждёт /site/new-request), и для предвыбора
       её надо свести к существующему пункту.

       ⚠️ Правим здесь только те категории, которых в списке НЕТ.
       Совпадающие («Сантехника», «Клининг» и прочие) подставляются
       напрямую и в этой карте не нужны. */
    var LEAD_SELECT_FALLBACK = {
        // Посудомойки и стиралки — работа сантехническая: подвод
        // воды и слив. Так же их разбирает resolveBotCategory.
        'Стиральные машины': 'Сантехника',
        // Компьютеры и Wi-Fi: своего пункта в укрупнённом списке
        // нет, показываем «Другое». На заявку это НЕ влияет —
        // точная категория уходит скрытым полем service_exact
        // (ниже), и бот получает «Компьютерная помощь».
        'Компьютерная помощь': 'Другое',
        'Кондиционеры': 'Ремонт',
        'Двери и замки': 'Ремонт'
    };

    /* Точная категория заявки в скрытое поле service_exact.

       ⚠️ Поле создаётся здесь, а не в разметке 129 страниц: иначе
       пришлось бы править их все, и на любой забытой странице
       предвыбор молча терял бы категорию.

       ⚠️ Сбрасываем его, когда человек сам меняет список услуг:
       иначе он выбрал бы «Электрика», а заявка ушла бы с прежней
       категорией карточки — выбор на экране разошёлся бы с тем,
       что получит бот. */
    function setExactService(form, category) {
        var hid = form.querySelector('input[name="service_exact"]');
        if (!hid) {
            hid = document.createElement('input');
            hid.type = 'hidden';
            hid.name = 'service_exact';
            form.appendChild(hid);

            var sel = form.querySelector('select[name="service"]');
            if (sel) {
                sel.addEventListener('change', function (ev) {
                    // Снимаем только при ручном выборе: наши
                    // предвыборы шлют событие программно, у них
                    // isTrusted === false.
                    if (ev.isTrusted) hid.value = '';
                });
            }

            /* ⚠️ Чистим поле и после отправки — на form.reset()
               полагаться НЕЛЬЗЯ. Проверено: reset() возвращает
               скрытому полю значение атрибута value, а у созданного
               скриптом его нет, и поле сохраняет прежнее значение.
               Без этого следующая заявка с той же страницы ушла бы
               с категорией предыдущей карточки — человек выбрал бы
               электрику, а мастерам ушла бы «Компьютерная помощь».

               Слушаем то же событие, что закрывает окно: его шлёт
               openThankYou в script.js после успешной отправки. */
            document.addEventListener('mastera:lead-sent', function () {
                hid.value = '';
            });
        }
        hid.value = category || '';
    }

    /* Телефон страницы — из первой ссылки tel: в разметке.
       Запасной вариант на случай страницы без неё: кнопка звонка
       без href была бы кнопкой в никуда. */
    function pageTel() {
        var a = document.querySelector('a[href^="tel:"]');
        return a ? a.getAttribute('href') : 'tel:+995557645196';
    }

    function buildPageCtas() {
        var main = document.querySelector('main') || document.body;

        /* 1. Полоска после списка услуг: «не нашли свою задачу».
              Узкая и в одну строку — это подсказка, а не блок:
              рядом стоит сетка из двенадцати услуг, и второй
              крупный блок соревновался бы с ней за внимание. */
        var services = document.getElementById('services');
        if (services && !document.querySelector('.cta-strip')) {
            /* Болванка только для разбора HTML — в документ она не
               попадает, берём из неё готовый узел. Класса на ней
               нет намеренно: он бы никуда не доехал. Ширину
               полоске задаёт .container секции, внутрь которой мы
               её кладём. */
            var strip = document.createElement('div');
            strip.innerHTML =
                '<div class="cta-strip">' +
                  '<span class="cta-strip__icon">' + svg('chat') + '</span>' +
                  '<span class="cta-strip__body">' +
                    '<strong>' + t('notFoundTitle') + '</strong>' +
                    '<span>' + t('notFoundText') + '</span>' +
                  '</span>' +
                  '<button type="button" class="cta-strip__btn" data-open-lead>' +
                    t('notFoundBtn') + '</button>' +
                '</div>';
            // Внутрь секции, последним: снаружи полоска оторвалась
            // бы от списка услуг и читалась как отдельный блок.
            var sc = services.querySelector('.container') || services;
            sc.appendChild(strip.firstChild);
        }

        /* 2. Блок предварительной оценки. Ставим перед секцией
              заявки: человек, доскроллив до низа, получает
              короткий путь (один номер) рядом с длинным (форма). */
        var lead = document.getElementById('lead');
        if (lead && !document.querySelector('.est-card')) {
            var est = document.createElement('section');
            est.className = 'est-section';
            est.innerHTML =
                '<div class="container">' +
                  '<div class="est-card">' +
                    '<div class="est-card__head">' +
                      '<h2 class="est-card__title">' + t('estTitle') + '</h2>' +
                      '<span class="est-card__note">' + t('estNote') + '</span>' +
                    '</div>' +
                    '<button type="button" class="est-card__btn" data-open-lead>' +
                      t('finalBtn') +
                      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
                      'aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/>' +
                      '<polyline points="12 5 19 12 12 19"/></svg>' +
                    '</button>' +
                  '</div>' +
                '</div>';
            lead.parentNode.insertBefore(est, lead);
        }

        /* 3. Финальный призыв. На главных он свёрстан в разметке —
              там его не трогаем. На лендингах его не было вовсе:
              страница заканчивалась формой, и человек, дочитавший
              до конца, упирался в подвал.

           ⚠️ Главное действие — КНОПКА там, где форма есть на
           странице, и ССЫЛКА на /<lang>/#lead там, где её нет
           (политика, соглашение). Кнопка с data-open-lead на
           такой странице нажималась бы вхолостую: открывать
           нечего, и ничего не происходило бы вообще — проверено,
           клик не делал ни-че-го. */
        if (!document.querySelector('.final-cta')) {
            var hasForm = !!document.getElementById('clientLeadForm');
            var mainAction = hasForm
                ? '<button type="button" class="button button--white button--large" data-open-lead>'
                : '<a class="button button--white button--large" href="/' + LANG + '/#lead">';
            var mainClose = hasForm ? '</button>' : '</a>';

            /* Вторая кнопка — «Написать в WhatsApp». Раньше тут
               стоял звонок, но в переписке клиент успевает
               приложить фото и описать задачу, а по телефону
               диктует адрес на слух.

               Ссылку и подпись берём у buildContactLinks() из
               script.js — той же функции, что питает нижнюю
               панель связи: там текст сообщения уже собран под
               услугу, район и город страницы. Свой экземпляр
               этой логики завёл бы вторую правду.

               ⚠️ script.js подключён ПОСЛЕ redesign.js и тоже с
               defer, поэтому к моменту init() функции может ещё
               не быть. Если её нет — ждём load и строим блок
               тогда; без этого кнопка молча осталась бы
               телефонной. Так же устроен buildContactBar(). */
            if (typeof window.buildContactLinks !== 'function') {
                if (document.readyState !== 'complete') {
                    window.addEventListener('load', buildPageCtas, { once: true });
                }
                return;
            }
            var contacts = window.buildContactLinks();
            var secondAction = contacts && contacts.waHref
                ? '<a class="button button--ghost-dark button--large" href="' +
                      contacts.waHref + '" target="_blank" rel="noopener">' +
                      brandIcon('whatsapp') + contacts.labels.wa + '</a>'
                /* Запасной вариант: если ссылка почему-то не
                   собралась, оставляем звонок — кнопка в никуда
                   хуже телефонной. Номер из разметки, а не
                   константой: он уже стоит в шапке каждой
                   страницы. */
                : '<a class="button button--ghost-dark button--large" href="' +
                      pageTel() + '">' + svg('phone') + t('finalCall') + '</a>';
            var fin = document.createElement('section');
            fin.className = 'final-cta final-cta--built';
            fin.innerHTML =
                '<div class="container">' +
                  '<div class="final-cta__card">' +
                    '<div class="final-cta__text">' +
                      '<div class="section-head__eyebrow">' + t('finalEyebrow') + '</div>' +
                      '<h2>' + t('finalTitle') + '</h2>' +
                      '<p>' + t('finalText') + '</p>' +
                    '</div>' +
                    '<div class="final-cta__actions">' +
                      /* Стрелку здесь больше не рисуем: её даёт
                         правило .button::after в redesign.css —
                         одно на все кнопки действия. Разметка со
                         своим <svg> давала вторую стрелку. */
                      mainAction + t('finalBtn') + mainClose +
                      secondAction +
                    '</div>' +
                  '</div>' +
                '</div>';
            main.appendChild(fin);
        }
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
            lockScroll();
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
            unlockScroll();
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

            /* ⚠️ Номер ЗАКРЫТ и открывается глазком — как и везде на
               сайте. Раньше здесь он стоял открытым («сюда долистали
               намеренно»), но это ломало смысл маскировки: сборщики
               номеров листают страницу целиком и забирали его из
               меню, пока в шапке он был закрыт. Решение владельца
               10.11.2026 — прятать во всех местах без исключений.

               Полный номер берём из data-full у топбара: туда его
               кладёт buildPhoneReveal() при маскировке. Если меню
               собралось раньше неё, data-full ещё нет — тогда
               читаем видимый текст. */
            var fullNum = (phoneSrc.getAttribute('data-full') ||
                           phoneSrc.textContent || '').trim();

            var telNum = document.createElement('span');
            telNum.className = 'mobile-menu__phone-num';
            telNum.textContent = maskPhone(fullNum);
            tel.appendChild(telNum);

            var telEye = document.createElement('span');
            telEye.className = 'mobile-menu__phone-eye';
            telEye.setAttribute('role', 'button');
            telEye.setAttribute('tabindex', '0');
            telEye.setAttribute('aria-label', t('showPhone'));
            telEye.innerHTML =
                '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
                '<path d="M12 5C7 5 3.1 8.1 1 12c2.1 3.9 6 7 11 7s8.9-3.1 11-7c-2.1-3.9-6-7-11-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>' +
                '</svg>';
            tel.appendChild(telEye);

            function revealMenuPhone(e) {
                // Глазок только раскрывает номер и не звонит: иначе
                // первое же касание уводило бы в набор, и человек не
                // успел бы увидеть, какой номер набирает.
                if (e) { e.preventDefault(); e.stopPropagation(); }
                telNum.textContent = fullNum;
                telEye.remove();
            }

            telEye.addEventListener('click', revealMenuPhone);
            telEye.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') revealMenuPhone(e);
            });

            /* ⚠️ Пока номер скрыт, сама ссылка звонить не должна:
               иначе смысл маскировки теряется — достаточно нажать
               на строку, и номер уйдёт в набор нераскрытым. После
               раскрытия обработчик снимается и ссылка работает. */
            tel.addEventListener('click', function (e) {
                if (telEye.isConnected) {
                    e.preventDefault();
                    revealMenuPhone(e);
                }
            });

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
            // ⚠️ Класс в CSS ничего не красит (проверено: правил с
            // .menu-open в redesign.css нет) — он остаётся только
            // как признак состояния для скриптов и отладки.
            // Прокрутку держит общая lockScroll().
            document.body.classList.add('menu-open');
            lockScroll();
        }

        function close() {
            menu.classList.remove('is-open');
            btn.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.setAttribute('aria-label', t('openMenu'));
            menu.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('menu-open');
            unlockScroll();
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

        // Страховка: при открытом меню фон держит lockScroll(), так
        // что прокрутке взяться неоткуда. Но если она всё же
        // случится (внешний скрипт, восстановление позиции при
        // возврате назад), панель должна идти за низом шапки —
        // иначе между ними откроется щель. Замер на старом коде:
        // шапка уходила со 113 на 77, а панель оставалась на 113.
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
                    '<img src="/image/whatsapp-icon.webp" alt="" width="96" height="96"' +
                    ' decoding="async">' +
                '</span>' +
                '<span>' + caption.wa + '</span>' +
            '</a>' +
            '<a class="contact-bar__btn contact-bar__btn--tg" href="' + links.tgHref + '"' +
            ' target="_blank" rel="noopener" aria-label="' + links.labels.tg + '">' +
                '<span class="contact-bar__ico" aria-hidden="true">' +
                    '<img src="/image/telegram-icon.webp" alt="" width="96" height="96"' +
                    ' decoding="async">' +
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
        window.addEventListener('load', function () {
            buildDistrictsDropdown();
            // Тот же справочник из script.js, та же причина ждать
            // load: местности в карточках районов на главных.
            fillDistrictHints();
            // Центрируем ПОСЛЕ сборки обоих меню: до неё пункт
            // «Районы» — обычная ссылка, и мерить нечего.
            centerDropdownPanels();
        }, { once: true });

        // Сразу — чтобы панель услуг встала по центру, не дожидаясь
        // картинок страницы: load может прийти заметно позже.
        centerDropdownPanels();

        /* Ширина окна меняет и место кнопки, и центр экрана.
           Пересчёт отложен кадром: resize приходит пачками, а
           считать раскладку на каждое событие незачем. */
        var centerTimer = null;
        window.addEventListener('resize', function () {
            clearTimeout(centerTimer);
            centerTimer = setTimeout(centerDropdownPanels, 120);
        });
        buildPageCtas();
        /* Подвал строим до окна заявки: оно ищет форму, а подвал
           её не трогает — порядок тут только ради предсказуемости
           разметки на момент остальных сборок. */
        buildFooter();
        /* ⚠️ Окно заявки — только по load. Оно переносит в себя
           живую форму #clientLeadForm, а её достраивает script.js
           (районы, блок фото) и на неё же вешает отправку. Этот
           файл грузится ПЕРВЫМ, и на DOMContentLoaded форма ещё
           полуфабрикат — в окно уехал бы пустой селект районов.
           Тот же приём, что у buildContactBar и меню районов. */
        window.addEventListener('load', buildLeadModal, { once: true });
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
