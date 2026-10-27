// ============================================
// ОПТИМИЗИРОВАННЫЙ SCRIPT.JS — MULTILINGUAL
// Языки: RU / KA / GE
// ============================================

// ============================================
// ГЛОБАЛЬНЫЕ ПЕРЕВОДЫ (все alert и тексты)
// ============================================

const i18n = {
    ru: {
        phoneInvalid:        'Пожалуйста, введите корректный грузинский номер телефона в формате: +995XXXXXXXXX (9 цифр после +995)',
        nameInvalid:         'Пожалуйста, введите имя буквами — без цифр и символов (минимум 2 буквы)',
        phoneOperator:       'Пожалуйста, введите корректный код оператора. Номер должен начинаться с +995 и далее 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99',
        telegramInvalid:     'Пожалуйста, введите корректный Telegram username (например: @username) или номер телефона',
        contactRequired:     'Пожалуйста, заполните хотя бы один из контактов: Telegram или WhatsApp',
        telegramRequiredMaster: 'Пожалуйста, укажите Telegram — верификация мастера проходит в Telegram-боте',
        submitError:         'Ошибка при отправке. Попробуйте ещё раз.',
        // Надпись на кнопке, пока заявка уходит. Отправка с фото занимает
        // 4–10 секунд, и без обратной связи человек жал кнопку повторно,
        // думая, что промахнулся.
        submitSending:       'Отправляем…',
        photoLabel:          '📷 Фото проблемы (по желанию, до 3)',
        photoAdd:            'Прикрепить фото',
        photoTooMany:        'Можно прикрепить не более 3 фото',
        photoBadType:        'Можно прикреплять только изображения',
        photoTooBig:         'Файл слишком большой (до 10 МБ)',
        photoRemove:         'Удалить',
        masterFinishTelegram:'✅ Продолжить в Telegram',
        urgentLabel:         '🚨 Срочный заказ',
        addressInDescription: 'Укажите в описании только суть задачи, без адреса. Точный адрес вы сообщите мастеру лично, когда он возьмёт заявку.',
        specialtyOtherPlaceholder: 'Укажите вашу специальность',
        specialtyOtherRequired:    'Пожалуйста, укажите вашу специальность',
        // ⚠️ Коротко — по ширине поля, а не «на глаз». Прежние 60 символов
        // обрезались и на десктопе (поле 378px в правой колонке модалки),
        // и тем более на мобильном, где остаётся всего 264px под текст.
        // Замеряно в браузере: этот вариант — 191px, влезает на обоих
        // размерах с запасом. Смысл сохранён: перечислено, что принимаем.
        // Правя текст, проверяй ширину — подсказка, которой не видно
        // целиком, не подсказывает ничего.
        districtOtherPlaceholder:  'Район, ориентир, метро',
        districtOtherRequired:     'Пожалуйста, укажите район или ближайший ориентир — без этого мастер не поймёт, куда ехать',
        masterCityLabel:           'Город работы',
        masterCityPlaceholder:     'Город',
        masterDistrictPlaceholder: 'Сначала выберите город',
        masterDistrictLabel:       'Район работы',
        masterCityRequired:        'Пожалуйста, выберите город — заявки приходят мастерам своего города',
        // Подписи полей форм для скринридера (aria-label). На экране их не
        // видно: поля опознаются по placeholder, а он для скринридера не
        // подпись — исчезает при вводе и читается не всеми программами.
        // Особенно важно для <select>: без подписи он объявляется просто
        // «список, свёрнут», и человек не понимает, что именно выбирает.
        a11yName:                  'Ваше имя',
        a11yPhone:                 'Номер телефона',
        a11yTelegram:              'Telegram',
        a11yWhatsapp:              'WhatsApp',
        a11yDistrict:              'Район',
        a11yService:               'Категория работ',
        a11yMessage:               'Описание задачи',
        a11yPhotos:                'Фотографии задачи (до 3 штук)',
        a11yCity:                  'Город',
        a11ySpecialty:             'Специальность',
        a11yExperience:            'Опыт работы в годах',
        a11yAbout:                 'О себе и опыте работы',
        a11yDistrictOther:         'Уточните район или ориентир',
        a11ySpecialtyOther:        'Уточните специальность',
        // Бейдж в окне благодарности. До этого текст был зашит в HTML каждой
        // из 105 страниц и успел разъехаться: на лендингах «15–60 минут», на
        // главных «30–60». Теперь источник один — словарь, HTML не трогаем.
        thanksBadgeLabel:          'Среднее время отклика',
        thanksBadgeValue:          '15–60 минут',
        // Ночной вариант. Показывается в «тихие часы» бота: обещать отклик за
        // час в 01:30 — значит гарантированно его не сдержать и потерять
        // клиента утром, хотя заявка в системе есть и мастер её возьмёт.
        // ⚠️ Подпись не повторяет заголовок окна («Заявка принята!») — иначе
        // одна и та же фраза стоит в окне дважды подряд и выглядит ошибкой.
        thanksBadgeLabelNight:     'Время ответа',
        thanksBadgeValueNight:     'На связи с {time}',
        // Заявка уходит мастерам сразу (ночью — беззвучно), поэтому про
        // «возможно, раньше» говорим честно: ночные заявки иногда берут.
        thanksTextNight:           'Ваша заявка уже у мастеров. Свяжемся с {time} — или раньше, если кто-то возьмёт её ночью.',
        // Для срочных ночных «свяжемся утром» читается как отказ, поэтому
        // текст другой: срочность видна мастерам, но ночью откликов меньше.
        thanksTextNightUrgent:     'Срочную заявку мастера видят сразу. Ночью откликов меньше, поэтому ответ может занять больше времени.',
    },
    ka: {
        phoneInvalid:        'გთხოვთ, შეიყვანოთ სწორი ქართული ტელეფონის ნომერი ფორმატში: +995XXXXXXXXX (9 ციფრი +995-ის შემდეგ)',
        nameInvalid:         'გთხოვთ, შეიყვანოთ სახელი მხოლოდ ასოებით — ციფრებისა და სიმბოლოების გარეშე (მინიმუმ 2 ასო)',
        phoneOperator:       'გთხოვთ, შეიყვანოთ სწორი ოპერატორის კოდი. ნომერი უნდა იწყებოდეს +995-ით და შემდეგ 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99',
        telegramInvalid:     'გთხოვთ, შეიყვანოთ სწორი Telegram მომხმარებლის სახელი (მაგ: @username) ან ტელეფონის ნომერი',
        contactRequired:     'გთხოვთ, შეავსოთ ერთ-ერთი საკონტაქტო ველი: Telegram ან WhatsApp',
        telegramRequiredMaster: 'გთხოვთ, მიუთითოთ Telegram — ხელოსნის ვერიფიკაცია მიმდინარეობს Telegram-ბოტში',
        submitError:         'გაგზავნისას მოხდა შეცდომა. სცადეთ კიდევ ერთხელ.',
        submitSending:       'იგზავნება…',
        photoLabel:          '📷 პრობლემის ფოტო (სურვილისამებრ, 3-მდე)',
        photoAdd:            'ფოტოს მიმაგრება',
        photoTooMany:        'შეგიძლიათ მიამაგროთ მაქსიმუმ 3 ფოტო',
        photoBadType:        'შესაძლებელია მხოლოდ სურათების მიმაგრება',
        photoTooBig:         'ფაილი ძალიან დიდია (10 მბ-მდე)',
        photoRemove:         'წაშლა',
        masterFinishTelegram:'✅ გაგრძელება Telegram-ში',
        urgentLabel:         '🚨 სასწრაფო შეკვეთა',
        addressInDescription: 'აღწერაში მიუთითეთ მხოლოდ დავალება, მისამართის გარეშე. ზუსტი მისამართი უთხარით ხელოსნას, როდესაც იგი აიღებს განაცხადს.',
        specialtyOtherPlaceholder: 'მიუთითეთ თქვენი სპეციალობა',
        specialtyOtherRequired:    'გთხოვთ, მიუთითოთ თქვენი სპეციალობა',
        districtOtherPlaceholder:  'რაიონი, ორიენტირი, მეტრო',
        districtOtherRequired:     'გთხოვთ, მიუთითოთ რაიონი ან უახლოესი ორიენტირი — ამის გარეშე ხელოსანი ვერ გაიგებს, სად უნდა მივიდეს',
        masterCityLabel:           'სამუშაო ქალაქი',
        masterCityPlaceholder:     'ქალაქი',
        masterDistrictPlaceholder: 'ჯერ აირჩიეთ ქალაქი',
        masterDistrictLabel:       'სამუშაო რაიონი',
        masterCityRequired:        'გთხოვთ, აირჩიოთ ქალაქი — განაცხადები მიდის იმავე ქალაქის ხელოსნებთან',
        // Ველების სახელები სკრინრიდერისთვის (aria-label) — ეკრანზე არ ჩანს.
        a11yName:                  'თქვენი სახელი',
        a11yPhone:                 'ტელეფონის ნომერი',
        a11yTelegram:              'Telegram',
        a11yWhatsapp:              'WhatsApp',
        a11yDistrict:              'რაიონი',
        a11yService:               'სამუშაოს კატეგორია',
        a11yMessage:               'დავალების აღწერა',
        a11yPhotos:                'დავალების ფოტოები (3-მდე)',
        a11yCity:                  'ქალაქი',
        a11ySpecialty:             'სპეციალობა',
        a11yExperience:            'სამუშაო გამოცდილება წლებში',
        a11yAbout:                 'თქვენ შესახებ და გამოცდილება',
        a11yDistrictOther:         'დააზუსტეთ რაიონი ან ორიენტირი',
        a11ySpecialtyOther:        'დააზუსტეთ სპეციალობა',
        thanksBadgeLabel:          'პასუხის საშუალო დრო',
        thanksBadgeValue:          '15–60 წუთი',
        thanksBadgeLabelNight:     'პასუხის დრო',
        thanksBadgeValueNight:     'დაგიკავშირდებით {time}-დან',
        thanksTextNight:           'თქვენი განაცხადი უკვე ხელოსნებთანაა. დაგიკავშირდებით {time}-დან — ან უფრო ადრე, თუ ვინმე ღამით აიღებს.',
        thanksTextNightUrgent:     'სასწრაფო განაცხადს ხელოსნები მაშინვე ხედავენ. ღამით პასუხები ნაკლებია, ამიტომ მოლოდინი შეიძლება გაგრძელდეს.',
    },
    en: {
        phoneInvalid:        'Please enter a valid Georgian phone number in the format: +995XXXXXXXXX (9 digits after +995)',
        nameInvalid:         'Please enter your name using letters only — no digits or symbols (at least 2 letters)',
        phoneOperator:       'Please enter a valid operator code. The number must start with +995 followed by 55, 56, 57, 58, 59, 51-54, 68, 70-79, 90-99',
        telegramInvalid:     'Please enter a valid Telegram username (e.g. @username) or phone number',
        contactRequired:     'Please fill in at least one contact field: Telegram or WhatsApp',
        telegramRequiredMaster: 'Please provide your Telegram — master verification is done in the Telegram bot',
        submitError:         'An error occurred while submitting. Please try again.',
        submitSending:       'Sending…',
        photoLabel:          '📷 Photo of the problem (optional, up to 3)',
        photoAdd:            'Attach photo',
        photoTooMany:        'You can attach up to 3 photos',
        photoBadType:        'Only images can be attached',
        photoTooBig:         'File is too large (up to 10 MB)',
        photoRemove:         'Remove',
        masterFinishTelegram:'✅ Continue in Telegram',
        urgentLabel:         '🚨 Urgent order',
        addressInDescription: 'Describe only the task, without the address. Share the exact address with the specialist directly once they take the request.',
        specialtyOtherPlaceholder: 'Specify your specialty',
        specialtyOtherRequired:    'Please specify your specialty',
        districtOtherPlaceholder:  'District, landmark, metro',
        districtOtherRequired:     'Please specify the district or a nearby landmark — without it the specialist will not know where to go',
        masterCityLabel:           'City of work',
        masterCityPlaceholder:     'City',
        masterDistrictPlaceholder: 'Choose a city first',
        masterDistrictLabel:       'Work district',
        masterCityRequired:        'Please choose a city — requests go to specialists in the same city',
        // Field names for screen readers (aria-label) — not visible on screen.
        a11yName:                  'Your name',
        a11yPhone:                 'Phone number',
        a11yTelegram:              'Telegram',
        a11yWhatsapp:              'WhatsApp',
        a11yDistrict:              'District',
        a11yService:               'Service category',
        a11yMessage:               'Task description',
        a11yPhotos:                'Task photos (up to 3)',
        a11yCity:                  'City',
        a11ySpecialty:             'Specialty',
        a11yExperience:            'Years of experience',
        a11yAbout:                 'About you and your experience',
        a11yDistrictOther:         'Specify the district or a landmark',
        a11ySpecialtyOther:        'Specify your specialty',
        thanksBadgeLabel:          'Average response time',
        thanksBadgeValue:          '15–60 minutes',
        thanksBadgeLabelNight:     'Response time',
        thanksBadgeValueNight:     'We reply from {time}',
        thanksTextNight:           'Your request is already with our specialists. We will get in touch from {time} — or sooner, if someone picks it up tonight.',
        thanksTextNightUrgent:     'Specialists see urgent requests right away. At night there are fewer of them online, so a reply may take longer.',
    }
};

// Версия статики — та же, что в ?v= у <script> и в ASSET_VERSION (sw.js).
// Нужна, чтобы проверить, какой файл реально исполняется у посетителя:
// в консоли `MASTERA_VERSION` отвечает сразу, без сверки размеров и дат.
// Поднимается скриптом bump-version.py вместе с остальными местами.
const MASTERA_VERSION = '37';
window.MASTERA_VERSION = MASTERA_VERSION;

// Публичный username бота мастеров — для диплинка «завершить регистрацию».
const MASTER_BOT_DEEPLINK = 'https://t.me/mastera_tbilisi_bot?start=master';

// Глобальная переменная текущего языка
// window.__FORCE_LANG__ устанавливается в языковых подстраницах (/ru/, /ge/, /en/)
let currentLang = window.__FORCE_LANG__ || 'ru';

// Вспомогательная функция — получить перевод
function t(key) {
    return (i18n[currentLang] || i18n.ru)[key] || i18n.ru[key] || key;
}

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initStatsAnimation();
    initSmoothScroll();
    initButtonHoverEffects();
    initOnlineCounter();
    initLanguageSwitcher();
    initModalForms();
    initScrollToTop();
    initClientLeadFormTracking();
    initClientPhotoUpload();
    initCityDropdown();
    initClientDistrictOptions();
    initClientUrgentOption();
    initMasterLeadFormTracking();
    initMasterDistrictOptions();
    initMasterSpecialtyOther();
    initWhatsAppButtonTracking();
    initFAQ();
});

// ============================================
// 1. АНИМАЦИЯ ЦИФР (УНИВЕРСАЛЬНАЯ)
// ============================================

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const element = entry.target;
                const target = parseInt(element.dataset.target, 10);
                const suffix = element.dataset.suffix || '';
                const startVal = parseInt(element.dataset.start, 10) || 0;
                element.dataset.animated = 'true';
                animateCounter(element, target, 2500, suffix, startVal);
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    stats.forEach(stat => {
        if (!stat.dataset.target) {
            const rawText = stat.textContent.trim();
            const match = rawText.match(/^(\d+)(.*)$/);
            if (match) {
                stat.dataset.target = match[1];
                stat.dataset.suffix = match[2];
            } else {
                return;
            }
        }
        stat.textContent = '0' + (stat.dataset.suffix || '');
        observer.observe(stat);
    });
}

function animateCounter(element, target, duration, suffix, start) {
    start = start || 0;
    const range = target - start;
    const isReverse = start > target;
    const startTime = performance.now();

    function ease(t) {
        return isReverse ? t : (1 - Math.pow(1 - t, 5));
    }

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = ease(progress);
        const current = Math.floor(start + easedProgress * range);
        element.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(animate);
}

// ============================================
// 2. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
// ============================================

// Появление карточек по скроллу убрано вместе с CSS-анимациями появления.
// Функция ставила .section-card в opacity:0 и возвращала видимость только
// когда карточка попадала во вьюпорт. Пока элемент прозрачен, он не
// засчитывается в LCP, а в среде без отрисовки кадров (фоновая вкладка,
// рендер поисковика) IntersectionObserver мог не сработать вовсе — и
// карточки услуг оставались невидимыми. Контент показывается сразу.

// ============================================
// 3. ПЛАВНАЯ ПРОКРУТКА
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ============================================
// 4. ЭФФЕКТЫ НАВЕДЕНИЯ НА КНОПКИ
// ============================================

function initButtonHoverEffects() {
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// 5. СЧЕТЧИК ОНЛАЙН МАСТЕРОВ
// ============================================

function initOnlineCounter() {
    const counterElement = document.querySelector('.online-count');
    if (!counterElement) return;

    const minCount = 3;
    const maxCount = 16;
    const baseVal = parseInt(counterElement.dataset.base, 10);
    const initialCount = !isNaN(baseVal) ? baseVal : Math.floor(Math.random() * 8) + 1;
    counterElement.textContent = initialCount;
    let currentCount = initialCount;

    function updateCounter() {
        const change = Math.floor(Math.random() * 7) - 3; // -3..+3
        let targetCount = Math.max(minCount, Math.min(maxCount, currentCount + change));
        counterElement.classList.add('updating');
        setTimeout(() => {
            counterElement.textContent = targetCount;
            counterElement.classList.remove('updating');
            currentCount = targetCount;
        }, 150);
    }

    function scheduleNextUpdate() {
        const delay = Math.random() * 8000 + 12000;
        setTimeout(() => {
            updateCounter();
            scheduleNextUpdate();
        }, delay);
    }

    setTimeout(scheduleNextUpdate, 5000);
}

// ============================================
// 6. FAQ АККОРДЕОН
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });
}

// ============================================
// 7. ПЕРЕКЛЮЧЕНИЕ ЯЗЫКОВ
// ============================================

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');

    // На языковых подстраницах (/ru/, /ge/, /en/) язык задан принудительно
    if (window.__FORCE_LANG__) {
        setLanguage(window.__FORCE_LANG__);
        return;
    }

    const browserLang = navigator.language || navigator.userLanguage;

    let defaultLang = 'ru';
    if (browserLang.startsWith('ka')) defaultLang = 'ka';
    else if (browserLang.startsWith('en')) defaultLang = 'en';

    const savedLang = localStorage.getItem('language') || defaultLang;
    setLanguage(savedLang);

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('language', lang);
        });
    });
}

// Соответствие «поле формы → ключ подписи в i18n».
// Ключи селекторов намеренно по name/типу, а не по id: id есть не у всех
// полей, а разметка форм одинакова на всех 108 страницах.
const A11Y_FIELD_LABELS = [
    ['input[name="name"]',        'a11yName'],
    ['input[name="phone"]',       'a11yPhone'],
    ['input[name="telegram"]',    'a11yTelegram'],
    ['input[name="whatsapp"]',    'a11yWhatsapp'],
    ['select[name="district"]',   'a11yDistrict'],
    ['select[name="service"]',    'a11yService'],
    ['select[name="city"]',       'a11yCity'],
    ['select[name="specialty"]',  'a11ySpecialty'],
    ['textarea[name="message"]',  'a11yMessage'],
    ['textarea[name="about"]',    'a11yAbout'],
    ['input[name="experience"]',  'a11yExperience'],
    ['input[name="district_other"]',  'a11yDistrictOther'],
    ['input[name="specialty_other"]', 'a11ySpecialtyOther'],
    ['.lead-photo-input',         'a11yPhotos'],
];

/**
 * Проставляет полям форм aria-label — подпись, которую читает скринридер.
 *
 * Зачем это нужно. Поля опознаются только по placeholder, а он подписью не
 * считается: исчезает при вводе и читается не всеми программами. Хуже всего
 * с <select> — у них placeholder'а нет вовсе, и без подписи скринридер
 * объявляет «список, свёрнут», не называя, что выбирают. Аудит доступности
 * помечает это как critical.
 *
 * Почему в JS, а не атрибутом в разметке: подписи переводятся вместе со
 * страницей (вызов стоит в setLanguage), и правка одна на все 108 страниц
 * вместо 108 одинаковых правок в HTML.
 *
 * На внешний вид не влияет: aria-label не отображается, placeholder и
 * оформление остаются как были.
 */
function applyFieldLabels() {
    const lang = ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru';
    const dict = i18n[lang] || i18n.ru;

    A11Y_FIELD_LABELS.forEach(function (pair) {
        const selector = pair[0];
        const text = dict[pair[1]];
        if (!text) return;
        document.querySelectorAll(selector).forEach(function (el) {
            // Скрытые служебные поля (honeypot _gotcha, hidden service на
            // лендингах) озвучивать не нужно — скринридер их и так пропускает,
            // а лишний aria-label сбивает с толку при отладке.
            if (el.type === 'hidden') return;
            el.setAttribute('aria-label', text);
        });
    });
}

function setLanguage(lang) {
    // Обновляем глобальную переменную
    currentLang = lang;

    // Активная кнопка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // HTML lang атрибут
    document.documentElement.lang = lang;

    // Переводим все элементы с data-атрибутами
    document.querySelectorAll('[data-ru], [data-ka], [data-en]').forEach(element => {
        // Отдельная ветка для .hero-title убрана вместе с эффектом печатной
        // машинки: она существовала только чтобы снять курсор перед переводом.
        // Сам перевод делает общий код ниже — он же обрабатывает hero-title.
        const text = element.dataset[lang];
        if (text) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else if (element.tagName === 'OPTION') {
                element.textContent = text;
            } else if (element.hasAttribute('content')) {
                element.setAttribute('content', text);
            } else {
                element.textContent = text;
            }
        }
    });

    // Placeholders через отдельные атрибуты
    document.querySelectorAll('[data-ru-placeholder], [data-ka-placeholder], [data-en-placeholder]').forEach(element => {
        const placeholder = element.dataset[lang + 'Placeholder'];
        if (placeholder) element.placeholder = placeholder;
    });

    // Подписи полей форм для скринридера — на текущем языке страницы.
    applyFieldLabels();

    // Title страницы
    const titleElement = document.querySelector('title');
    if (titleElement && titleElement.dataset[lang]) {
        titleElement.textContent = titleElement.dataset[lang];
    }

    // Суффиксы счётчиков статистики
    document.querySelectorAll('.stat-number[data-suffix-ru], .stat-number[data-suffix-ka], .stat-number[data-suffix-en]').forEach(element => {
        const suffixKey = lang === 'en' ? 'suffixEn' : lang === 'ka' ? 'suffixKa' : 'suffixRu';
        const newSuffix = element.dataset[suffixKey];
        if (newSuffix) {
            element.dataset.suffix = newSuffix;
            if (element.dataset.animated === 'true') {
                const target = parseInt(element.dataset.target, 10);
                element.textContent = target + newSuffix;
            } else {
                element.textContent = '0' + newSuffix;
            }
        }
    });

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && metaDesc.dataset[lang]) {
        metaDesc.setAttribute('content', metaDesc.dataset[lang]);
    }

    // title-атрибуты на полях ввода (браузерные подсказки при нативной валидации)
    document.querySelectorAll('input[type="tel"][pattern]').forEach(el => {
        el.title = t('phoneInvalid');
    });
    document.querySelectorAll('input[name="telegram"][pattern]').forEach(el => {
        el.title = t('telegramInvalid');
    });
}

// ============================================
// 8. МОДАЛЬНЫЕ ОКНА
// ============================================

function initModalForms() {
    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeClientLeadForm();
            closeMasterLeadForm();
            closeThankYou();
            closeMasterThankYou();
        }
    });

    initPhoneFormatting();
    initNamePatternAttr();
}

// Сколько цифр стоит после +995. Ровно как в боте (validators.is_valid_phone:
// 995 + 9 цифр). Ввод обрезается по этой длине — лишние цифры не набрать.
const PHONE_SUBSCRIBER_DIGITS = 9;

// Приводит грузинский номер к виду +995XXXXXXXXX (код страны + 9 цифр).
//
// ⚠️ Отдельно разбирается НЕПОЛНЫЙ код страны («+99», «+9»). Он появляется,
// когда человек стирает номер и доходит до префикса. Без этого остаток «99»
// не считался кодом, и к нему спереди дописывалось «995»: «+995» → Backspace →
// «+99599». Префикс размножался, и очистить поле было невозможно.
function formatGeorgianPhone(raw) {
    let digits = (raw || '').replace(/\D/g, '');
    if (!digits) return '';

    if (digits === '9' || digits === '99') {
        digits = '995';
    } else if (digits.startsWith('995')) {
        // уже с кодом страны — оставляем как есть
    } else if (digits.startsWith('99') && digits.length > 2) {
        digits = '995' + digits.substring(2);
    } else {
        digits = '995' + digits;
    }

    digits = digits.replace(/^9950+/, '995');
    digits = digits.substring(0, 3 + PHONE_SUBSCRIBER_DIGITS);

    const country = digits.substring(0, 3);
    const subscriber = digits.substring(3);
    const groups = subscriber.match(/.{1,3}/g) || [];
    return '+' + country + (groups.length ? ' ' + groups.join(' ') : '');
}

// WhatsApp мастера/клиента может быть привязан к номеру ЛЮБОЙ страны — человек
// переехал в Грузию, а мессенджер остался на домашнем номере. Поэтому здесь
// никакого «+995» не навязываем: оставляем ведущий «+» (если был) и цифры.
//
// Зеркало normalize_whatsapp в боте (validators.py): 10–15 цифр по E.164.
// Короче 10 цифр — почти наверняка местный номер без кода страны, ему
// дописываем грузинский код, иначе бот такой контакт отбросит.
function normalizeWhatsappPhone(value) {
    const digits = (value || '').replace(/\D/g, '');
    if (!digits) return '';
    // Ровно 9 цифр — местный грузинский номер, набранный без кода страны
    // («555123456»). Дописываем 995 сами: бот принимает WhatsApp только с
    // кодом страны (normalize_whatsapp: 10-15 цифр), иначе контакт отбросится.
    if (digits.length === PHONE_SUBSCRIBER_DIGITS) return '+995' + digits;
    return '+' + digits.substring(0, 15);
}

function normalizeGeorgianPhone(value) {
    const digits = (value || '').replace(/\D/g, '');
    return digits ? '+' + digits.substring(0, 3 + PHONE_SUBSCRIBER_DIGITS) : '';
}

// Форматирование телефонных номеров
function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('#leadPhone, #masterLeadPhone');
    const whatsappInputs = document.querySelectorAll('input[name="whatsapp"]');
    const PREFIX_LEN = '+995'.length;

    // Нативный pattern из HTML («^\+995[0-9]{9}$») не знает про пробелы, которые
    // расставляет маска, поэтому полностью введённый «+995 555 123 456» считался
    // бы ошибочным. Но просто снять pattern нельзя: тогда у поля остаётся один
    // required, и подставленный при фокусе префикс «+995» уже делает его :valid —
    // CSS красит рамку зелёным на пустом номере, человек думает, что ввод принят.
    // Поэтому pattern не убираем, а заменяем на тот же шаблон С пробелами.
    const PHONE_PATTERN_ATTR = '\\+995 ?[0-9]{3} ?[0-9]{3} ?[0-9]{3}';

    phoneInputs.forEach(input => {
        input.setAttribute('pattern', PHONE_PATTERN_ATTR);

        function clampCaret() {
            if (!input.value.startsWith('+995')) return;
            const start = input.selectionStart, end = input.selectionEnd;
            if (start === 0 && end === input.value.length) return;
            if (start < PREFIX_LEN || end < PREFIX_LEN) {
                input.setSelectionRange(Math.max(start, PREFIX_LEN), Math.max(end, PREFIX_LEN));
            }
        }

        input.addEventListener('input', (e) => {
            const el = e.target;
            el.value = formatGeorgianPhone(el.value);
            if (el.value.startsWith('+995') && el.selectionStart < PREFIX_LEN) {
                el.setSelectionRange(el.value.length, el.value.length);
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key !== 'Backspace' && e.key !== 'Delete') return;
            const el = e.target;
            if (!el.value.startsWith('+995')) return;
            const start = el.selectionStart, end = el.selectionEnd;
            if (start === 0 && end === el.value.length) return;
            if (start !== end) return;
            if ((e.key === 'Backspace' && start <= PREFIX_LEN) ||
                (e.key === 'Delete' && start < PREFIX_LEN)) {
                e.preventDefault();
                el.setSelectionRange(PREFIX_LEN, PREFIX_LEN);
            }
        });

        input.addEventListener('click', clampCaret);
        input.addEventListener('keyup', clampCaret);

        input.addEventListener('focus', (e) => {
            if (e.target.value === '') e.target.value = '+995';
            requestAnimationFrame(() => {
                if (e.target.value.startsWith('+995') && e.target.selectionStart < PREFIX_LEN) {
                    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
                }
            });
        });

        input.addEventListener('blur', (e) => {
            if (e.target.value === '+995') e.target.value = '';
        });
    });

    // WhatsApp НЕ форматируем под грузинский шаблон: номер может быть любой
    // страны. Раньше здесь стоял formatGeorgianPhone(), и британский
    // «+44 7700 900123» превращался в «+995 447 700 900» — чужой несуществующий
    // номер, по которому с мастером было не связаться.
    // Чистим только мусорные символы, сохраняя ведущий «+».
    whatsappInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const el = e.target;
            if (!el.value.trim()) return;
            const hasPlus = el.value.trimStart().startsWith('+');
            const digits = el.value.replace(/\D/g, '').substring(0, 15);
            el.value = digits ? (hasPlus ? '+' : '') + digits : '';
        });
    });
}

// ============================================
// 9. ВАЛИДАЦИЯ — ОБЩИЕ ФУНКЦИИ
// ============================================

const VALID_OPERATOR_CODES = ['55','56','57','58','59','51','52','53','54','68','70','71','72','74','75','77','79','90','91','92','93','94','95','96','97','98','99'];
const PHONE_PATTERN    = new RegExp('^\\+995[0-9]{' + PHONE_SUBSCRIBER_DIGITS + '}$');
const TELEGRAM_PATTERN = /^(@[a-zA-Z0-9_]{5,32}|[0-9]{9,15})$/;

// Имя: только буквы (кириллица, латиница, грузинский алфавит), пробелы и дефис
// для составных имён («Анна-Мария», «Giorgi Beridze»). Каждое слово — от 2 букв.
//
// Зеркало is_valid_fio в боте (validators.py): там имя проверяется isalpha(),
// и цифры отклоняются. Без проверки здесь мусорное имя уходит в анкете мастера
// в бота, тот её браковал — и мастер вводил заново всё, что заполнил на сайте.
const NAME_PATTERN = /^[\p{L}]{2,}(?:[\s-][\p{L}]{2,})*$/u;

// Тот же смысл для атрибута pattern: браузер компилирует его БЕЗ флага 'u',
// и \p{L} там не работает как класс букв — проверка пропускала бы даже цифры.
// Диапазоны: латиница, кириллица, грузинский (мхедрули).
const NAME_PATTERN_ATTR =
    '[A-Za-zÀ-ÖØ-öø-ÿĀ-žА-Яа-яЁёა-ჰ]{2,}' +
    '(?:[ \\-][A-Za-zÀ-ÖØ-öø-ÿĀ-žА-Яа-яЁёა-ჰ]{2,})*[ ]*';

function validateName(nameInput) {
    if (!nameInput) return true;
    const val = nameInput.value.trim();
    if (!val) return true;   // пустое поле ловит required самого браузера

    if (!NAME_PATTERN.test(val)) {
        alert(t('nameInvalid'));
        nameInput.focus();
        return false;
    }
    return true;
}

// Проставляет полям имени нативную проверку «только буквы» на всех страницах —
// через JS, без правки HTML каждого лендинга (как районы выше).
function initNamePatternAttr() {
    document.querySelectorAll('#clientLeadForm input[name="name"], #masterLeadForm input[name="name"]')
        .forEach(function (input) {
            if (input.getAttribute('pattern')) return;   // уже задано в разметке
            input.setAttribute('pattern', NAME_PATTERN_ATTR);
            input.setAttribute('title', t('nameInvalid'));
        });
}

function validatePhone(phoneInput) {
    if (!phoneInput) return true;
    const digits = phoneInput.value.replace(/\D/g, '');
    const val = '+' + digits;

    if (!PHONE_PATTERN.test(val)) {
        alert(t('phoneInvalid'));
        phoneInput.focus();
        return false;
    }

    const code = digits.substring(3, 5);
    if (!VALID_OPERATOR_CODES.includes(code)) {
        alert(t('phoneOperator'));
        phoneInput.focus();
        return false;
    }

    return true;
}

function validateTelegram(telegramInput) {
    if (!telegramInput) return true;
    const val = telegramInput.value.trim();
    if (!val) return true; // необязательное поле — проверяем только если заполнено

    if (!TELEGRAM_PATTERN.test(val)) {
        alert(t('telegramInvalid'));
        telegramInput.focus();
        return false;
    }
    return true;
}

// Валидация стандартных форм (clientForm / masterForm)
function validateForm(e) {
    const form = e.target;
    const phoneInput    = form.querySelector('input[type="tel"]');
    const telegramInput = form.querySelector('input[name="telegram"]');

    if (!validatePhone(phoneInput)) { e.preventDefault(); return false; }
    if (!validateTelegram(telegramInput)) { e.preventDefault(); return false; }

    return true;
}

// ============================================
// 10. ЛИД-ФОРМА КЛИЕНТА
// ============================================

// Адрес эндпоинта бота для приёма заявок с сайта (напрямую, без секрета).
// Защита от спама на стороне бота: проверка домена-источника + honeypot.
//
// ⚠️ Это НАШ поддомен (CNAME на Railway, проксируется Cloudflare), а не
// технический адрес вида *.up.railway.app. Так и должно быть: прежний адрес
// принадлежал Railway, и переименование сервиса или переезд на другой хостинг
// тихо убили бы приём заявок — сайт ответа не ждёт (fire-and-forget), человек
// всё равно увидел бы «Заявка отправлена», а лид не дошёл бы до мастеров.
// Теперь любой переезд — это правка DNS, а не правка сайта.
const BOT_REQUEST_URL = 'https://bot.mastera.ge/site/new-request';
// Эндпоинт бота для анкет мастеров с сайта (уведомление админу-лид).
const BOT_MASTER_URL  = 'https://bot.mastera.ge/site/new-master';

// ============================================
// 9.9 РАЙОНЫ ТБИЛИСИ — ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ
// ============================================
//
// Раньше список районов лежал в HTML каждой страницы, и они разъехались: где-то
// 8 районов, где-то 10, Мтацминда и Крцаниси были не везде. Теперь весь список
// живёт ЗДЕСЬ и строится скриптом (buildDistrictSelect), а в HTML достаточно
// пустого <select name="district"> — добавление района правится в одном месте.
//
// Поля записи:
//   slug  — value в <option> и ключ маппинга в канон-RU для бота;
//   ru/en/ka — подпись района на языке страницы;
//   hintRu/hintEn/hintKa — популярные местности района (подсказка в подписи).
//
// Подсказки хранятся здесь как справочные данные, но НЕ показываются в селекте:
// на мобильном длинные подписи делают выбор района неудобным. Клиент выбирает
// крупный район, а для «Другого» есть отдельное поле с ориентиром.
//
// ВАЖНО: slug → канон-RU обязан совпадать с ключами config.locations бота, иначе
// заявка молча уедет в «Другой». Chugureti по-английски у бота — Chughureti
// (locales/geo.py), держим ту же форму.
const DISTRICTS = [
    { slug: 'Vake',        ru: 'Ваке',        en: 'Vake',        ka: 'ვაკე',
      hintRu: 'Верхний Ваке, Нижний Ваке, Мухатгверди',
      hintEn: 'Upper Vake, Lower Vake, Mukhatgverdi',
      hintKa: 'ზემო ვაკე, ქვემო ვაკე, მუხათგვერდი' },
    { slug: 'Saburtalo',   ru: 'Сабуртало',   en: 'Saburtalo',   ka: 'საბურთალო',
      hintRu: 'Верхний Сабуртало, Нижний Сабуртало, Политехнический',
      hintEn: 'Upper Saburtalo, Lower Saburtalo, Politekhnikuri',
      hintKa: 'ზემო საბურთალო, ქვემო საბურთალო, პოლიტექნიკური' },
    { slug: 'Mtatsminda',  ru: 'Мтацминда',   en: 'Mtatsminda',  ka: 'მთაწმინდა',
      hintRu: 'Центр, Вера, Сололаки',
      hintEn: 'Center, Vera, Sololaki',
      hintKa: 'ცენტრი, ვერა, სოლოლაკი' },
    { slug: 'Didube',      ru: 'Дидубе',      en: 'Didube',      ka: 'დიდუბე',
      hintRu: 'Дидубе-Чугурети, Автовокзал, Дигоми',
      hintEn: 'Didube-Chughureti, Bus Station, Digomi',
      hintKa: 'დიდუბე-ჩუღურეთი, ავტოსადგური, დიღომი' },
    { slug: 'Chugureti',   ru: 'Чугурети',    en: 'Chughureti',  ka: 'ჩუღურეთი',
      hintRu: 'Грмагеле, Авлабари, Метехи',
      hintEn: 'Grmaghele, Avlabari, Metekhi',
      hintKa: 'გრმაღელე, ავლაბარი, მეტეხი' },
    { slug: 'Isani',       ru: 'Исани',       en: 'Isani',       ka: 'ისანი',
      hintRu: 'Самгори, Навтлуги, Ортачала',
      hintEn: 'Samgori, Navtlugi, Ortachala',
      hintKa: 'სამგორი, ნავთლუღი, ორთაჭალა' },
    { slug: 'Samgori',     ru: 'Самгори',     en: 'Samgori',     ka: 'სამგორი',
      hintRu: 'Восток, Варкетили, Лило',
      hintEn: 'Vostok, Varketili, Lilo',
      hintKa: 'აღმოსავლეთი, ვარკეთილი, ლილო' },
    { slug: 'Gldani',      ru: 'Глдани',      en: 'Gldani',      ka: 'გლდანი',
      hintRu: 'Темка, Муштаиди, Ахметели',
      hintEn: 'Temka, Mushtaidi, Akhmeteli',
      hintKa: 'თემქა, მუშთაიდი, ახმეტელი' },
    { slug: 'Nadzaladevi', ru: 'Надзаладеви', en: 'Nadzaladevi', ka: 'ნაძალადევი',
      hintRu: 'Вокзал, Дидубе Рынок, Церетели',
      hintEn: 'Station, Didube Market, Tsereteli',
      hintKa: 'ვაგზალი, დიდუბის ბაზარი, წერეთელი' },
    { slug: 'Krtsanisi',   ru: 'Крцаниси',    en: 'Krtsanisi',   ka: 'კრწანისი',
      hintRu: 'Понтичала, Лочини, Аэропорт',
      hintEn: 'Ponichala, Lochini, Airport',
      hintKa: 'ფონიჭალა, ლოჭინი, აეროპორტი' }
];

// ── Районы Батуми ──
// Отдельный список: сервис работает в двух городах, и заявка рассылается
// мастерам ТОЛЬКО своего города (бот фильтрует по city точным совпадением).
// Названия ru — канонические: именно они уходят в бота и должны совпадать
// с config.yaml (cities → Батуми).
const BATUMI_DISTRICTS = [
    { slug: 'OldBatumi',   ru: 'Старый Батуми',   en: 'Old Batumi',      ka: 'ძველი ბათუმი',
      hintRu: 'Приморский бульвар, Пьяцца, Порт',
      hintEn: 'Seaside Boulevard, Piazza, Port',
      hintKa: 'ზღვისპირა ბულვარი, პიაცა, პორტი' },
    { slug: 'NewBoulevard', ru: 'Новый бульвар',  en: 'New Boulevard',   ka: 'ახალი ბულვარი',
      hintRu: 'Алфавитная башня, Дельфинарий, Ардагани',
      hintEn: 'Alphabet Tower, Dolphinarium, Ardagani',
      hintKa: 'ანბანის კოშკი, დელფინარიუმი, არდაგანი' },
    { slug: 'Khimshiashvili', ru: 'Химшиашвили', en: 'Khimshiashvili',   ka: 'ხიმშიაშვილი',
      hintRu: 'Тбел Абусеридзе, Инасаридзе, Ангиса',
      hintEn: 'Tbel Abuseridze, Inasaridze, Angisa',
      hintKa: 'თბელ აბუსერიძე, ინასარიძე, ანგისა' },
    { slug: 'BatumiAirport', ru: 'Аэропорт Батуми', en: 'Batumi Airport', ka: 'ბათუმის აეროპორტი',
      hintRu: 'Хелвачаури, Гонио, Квариати',
      hintEn: 'Khelvachauri, Gonio, Kvariati',
      hintKa: 'ხელვაჩაური, გონიო, კვარიათი' },
    { slug: 'BoniGorodok', ru: 'Бони-Городок',   en: 'Boni-Gorodok',     ka: 'ბონი-გოროდოკი',
      hintRu: 'Джавахишвили, Тамар Мепе, Аджария',
      hintEn: 'Javakhishvili, Tamar Mepe, Adjara',
      hintKa: 'ჯავახიშვილი, თამარ მეფე, აჭარა' }
];

// Города сервиса. Значение ru — каноническое для бота (users.city / requests.city).
const CITIES = [
    { value: 'Тбилиси', ru: 'Тбилиси', en: 'Tbilisi', ka: 'თბილისი', districts: DISTRICTS },
    { value: 'Батуми',  ru: 'Батуми',  en: 'Batumi',  ka: 'ბათუმი',  districts: BATUMI_DISTRICTS }
];

// Подписи служебных опций, которых нет в config.locations бота:
//   Other — «мой район не в списке» (клиентская форма), уточняется текстом;
//   All   — «работаю по всему городу» (форма мастера).
const DISTRICT_SPECIAL = {
    Other: { ru: 'Другой район', en: 'Other district', ka: 'სხვა რაიონი', bot: 'Другой' },
    All:   { ru: 'Все районы',   en: 'All districts',  ka: 'ყველა რაიონი', bot: 'Все районы' }
};

// Район на сайте выбирается слугами (Vake, Saburtalo...), а бот ждёт названия
// по-русски. Карта собирается из DISTRICTS автоматически — отдельный список
// больше не ведём, рассинхрон невозможен.
const BOT_DISTRICT_MAP = DISTRICTS.concat(BATUMI_DISTRICTS).reduce(function (map, d) {
    map[d.slug] = d.ru;
    return map;
}, { Other: DISTRICT_SPECIAL.Other.bot, All: DISTRICT_SPECIAL.All.bot });

// Город КЛИЕНТСКОЙ заявки — по URL страницы, а не вопросом в форме.
//
// Клиент оставляет заявку в момент проблемы, и каждое лишнее поле теряет часть
// людей. Раз он открыл батумский лендинг — он в Батуми, спрашивать нечего.
// Заодно пара «город + район» согласована автоматически: список районов в форме
// на этой странице тоже батумский (см. clientDistrictsForPage).
//
// Бот рассылает заявку мастерам ТОЛЬКО этого города (фильтр city в
// get_masters_by_rating), поэтому значение должно быть канон-RU из config.yaml.
// Район, зашитый в разметку лендинга (<option ... selected>), снятый ОДИН РАЗ
// при загрузке скрипта — до того, как buildDistrictSelect() пересоберёт список
// и этот <option> из DOM исчезнет. Именно по нему определяется город страницы.
var PAGE_DISTRICT_SLUG = (function () {
    var opt = document.querySelector('#clientLeadForm select[name="district"] option[selected]');
    return opt ? (opt.getAttribute('value') || '') : '';
})();

function botCityFromUrl() {
    // Город страницы. Порядок проверок важен.
    //
    // 1) По РАЙОНУ лендинга (PAGE_DISTRICT_SLUG). Проверять URL на подстроку
    //    «batumi» недостаточно: у районов novy-bulvar, khimshiashvili и
    //    boni-gorodok названия города в slug нет, и заявка уходила бы в Тбилиси
    //    с батумским районом — пара рассогласована, рассылка не нашла бы ни
    //    одного мастера, и заявка молча пропала бы.
    //
    //    Значение берём из снимка выше, а не из живого селекта: список районов
    //    строит buildDistrictSelect(), который сам спрашивает город у этой
    //    функции. На момент вызова селект ещё тбилисский, а предвыбор уже
    //    затёрт — получался замкнутый круг.
    var byDistrict = PAGE_DISTRICT_SLUG ? masterCityFromDistrict(PAGE_DISTRICT_SLUG) : '';
    if (byDistrict) return byDistrict;

    // 2) По URL — для страниц без района: хабы (/ru/batumi/) и сервисные
    //    лендинги вида santehnik-batumi.
    return window.location.pathname.includes('batumi') ? 'Батуми' : 'Тбилиси';
}



// Районы для КЛИЕНТСКОЙ формы — по городу страницы (см. botCityFromUrl).
// Показывать тбилисские районы на батумском лендинге нельзя: заявка ушла бы
// с районом чужого города и не нашла бы ни одного мастера.
function clientDistrictsForPage() {
    return botCityFromUrl() === 'Батуми' ? BATUMI_DISTRICTS : DISTRICTS;
}

// Город мастера по выбранному району. Районы Тбилиси и Батуми НЕ пересекаются
// (проверено в config.yaml бота), поэтому суффиксы вида StariGradNS, как в
// Сербии, здесь не нужны — slug однозначно определяет город.
// '' означает «город неизвестен»: бот спросит его сам на шаге дособора анкеты.
function masterCityFromDistrict(slug) {
    if (!slug || slug === 'All') return '';   // «все районы» без города — город неизвестен
    if (slug === 'AllTB') return 'Тбилиси';
    if (slug === 'AllBA') return 'Батуми';
    var found = CITIES.find(function (c) {
        return c.districts.some(function (d) { return d.slug === slug; });
    });
    return found ? found.value : '';
}

// Район мастера в каноническом виде для бота: «все районы» в пределах города
// тоже сводим к общему значению, которое понимает бот.
function masterDistrictForBot(slug) {
    if (!slug) return 'Все районы';
    if (slug === 'All' || slug === 'AllTB' || slug === 'AllBA') return 'Все районы';
    return BOT_DISTRICT_MAP[slug] || slug;
}

// Подпись района на языке страницы; с подсказкой местностей — для <option>.
function districtLabel(entry, lang, withHint) {
    const name = entry[lang] || entry.ru;
    if (!withHint) return name;
    const hintKey = 'hint' + lang.charAt(0).toUpperCase() + lang.slice(1);
    const hint = entry[hintKey] || entry.hintRu;
    return hint ? name + ' — ' + hint : name;
}

// Категория работ в EN/GE формах выбирается на своём языке, а бот принимает только
// канонические русские названия (specialties в config.yaml). Без этого маппинга
// заявки с английской/грузинской форм бот отбраковывает (на email они всё равно уходят).
// RU-значения уже канонические — проходят через fallback в sendLeadToBot без записи здесь.
// Категория работ приходит на языке страницы, а бот принимает только канонические
// русские названия (specialties в config.yaml). У мастеров категория ВСЕГДА по-русски,
// поэтому любую подпись сайта приводим к канону.
//
// service берётся из двух мест: <select name="service"> на главных формах и
// <input type="hidden" name="service"> на страницах услуг/районов (там подписи
// свободные и с суффиксом района: «Handyman — Vake», «Мастер на час — Дидубе»,
// «ოსტატი საათით — გლდანი», «Home Repairs», «ავეჯის აწყობა» и т.п.).
// Сопоставляем НЕ по точному совпадению, а по ключевым словам (RU/EN/GE) — тогда
// новые страницы районов не ломают маппинг.
function resolveBotCategory(rawService) {
    const s = (rawService || '').toString().trim().toLowerCase();
    if (!s) return 'Другое';
    // Порядок важен: сначала специфичные категории, потом «мастер на час» как широкий фолбэк.
    const rules = [
        [['сантехник', 'plumb', 'სანტექნიკა'], 'Сантехника'],
        [['электрик', 'electric', 'ელექტრიკა'], 'Электрика'],
        [['мебел', 'furniture', 'ავეჯ'], 'Мебель'],
        [['грузчик', 'mover', 'მზიდ', 'გადაზიდვ'], 'Грузчики'],
        [['клининг', 'уборк', 'clean', 'დასუფთავება'], 'Клининг'],
        // Компьютерная помощь — ДО «Ремонта»: подпись «Ремонт компьютеров»
        // содержит слово «ремонт» и иначе уехала бы в бытовой ремонт квартир.
        [['компьютер', 'computer', 'კომპიუტერ'], 'Компьютерная помощь'],
        [['ремонт', 'repair', 'რემონტ'], 'Ремонт'],
        // «Мастер на час», «Handyman …», «ოსტატი საათით …», навеска/монтаж — работа мастера на час.
        [['мастер на час', 'handyman', 'ოსტატი საათით', 'навеск', 'монтаж',
          'mounting', 'installation', 'დაკიდება', 'მონტაჟ'], 'Мастер на час'],
    ];
    for (const [keys, canon] of rules) {
        if (keys.some(k => s.includes(k))) return canon;
    }
    return 'Другое';
}

// Отправка клиентской заявки в Telegram-бота через прокси.
// Не блокирует пользователя и не зависит от ответа — заявка в любом случае уйдёт на email.
function generateSiteIdempotencyKey(prefix) {
    try {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return prefix + '_' + window.crypto.randomUUID();
        }
    } catch (e) {}
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
}

async function postBotJson(url, payload, timeoutMs = 12000) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            // Не используем keepalive для заявок с фото: Base64-тело может превышать лимит браузера ~64 КБ.
            keepalive: !(Array.isArray(payload.photos) && payload.photos.length > 0),
            ...(controller ? { signal: controller.signal } : {})
        });
        const text = await response.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch (e) {}
        if (!response.ok || !data || data.ok !== true) {
            const reason = data && data.error ? data.error : ('HTTP ' + response.status);
            throw new Error('Bot rejected lead: ' + reason);
        }
        return data;
    } finally {
        if (timer) clearTimeout(timer);
    }
}

async function sendLeadToBot(formData, idempotencyKey) {
    const get = (k) => (formData.get(k) || '').toString().trim();

    const phone    = normalizeGeorgianPhone(get('phone'));
    const telegram = get('telegram');
    const whatsapp = normalizeWhatsappPhone(get('whatsapp'));
    const name     = get('name');

    // Подпись к номеру нужна наравне с Telegram и WhatsApp: в карточке
    // мастера строки идут столбиком, и без неё номер висел голым рядом с
    // подписанными соседями — читалось как недоделка.
    //
    // ⚠️ Подпись НЕ переводим, хотя рядом есть i18n. Эта строка уходит в бота
    // как есть (contact_hidden шифруется и показывается мастеру без всякой
    // локализации), а читает её МАСТЕР, язык которого не связан с языком
    // клиента: грузинская заявка «ტელეფონი:» ничего не сказала бы мастеру,
    // работающему на русском. «Tel.» понятен на всех трёх языках — как и
    // соседние Telegram/WhatsApp, которые тоже не переводятся.
    const contactParts = [];
    if (phone)    contactParts.push('📱 Tel.: ' + phone);
    if (telegram) contactParts.push('✈️ Telegram: ' + telegram);
    if (whatsapp) contactParts.push('🟢 WhatsApp: ' + whatsapp);

    // В описание идёт ТОЛЬКО задача клиента. Имя уходит отдельным полем payload.name
    // — бот кладёт его в name_hidden (шифрованное) и печатает мастеру строкой
    // «👤 Имя:», как у заявок из бота.
    //
    // ⚠️ Раньше имя вклеивалось сюда строкой «Имя: X», потому что handle_site_request
    // поле name терял. Это давало три тихих проблемы: имя лежало в БД открытым
    // текстом, карточка сайта не совпадала с карточкой бота, а служебная строка
    // попадала в AI-оценку и модерацию описания. Не возвращать: бот имя принимает.
    const descParts = [];
    descParts.push('Задача: ' + (get('message') || '—'));

    const districtOther = get('district_other');

    const payload = {
        city:        botCityFromUrl(),
        name:        name,
        phone:       phone,
        district:    BOT_DISTRICT_MAP[get('district')] || get('district') || 'Другой',
        subdistrict: districtOther || 'Не указан',
        category:    resolveBotCategory(get('service')),
        description: descParts.join('\n'),
        address:     'Не указан',
        contact:     contactParts.join('\n') || 'Нет контакта',
        honeypot:    get('_gotcha'),
        lang:        ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru',
        urgent:      !!(document.getElementById('leadUrgent') && document.getElementById('leadUrgent').checked),
        photos:      leadPhotoDataUrls.slice(0, MAX_LEAD_PHOTOS),
        idempotency_key: idempotencyKey
    };

    return await postBotJson(BOT_REQUEST_URL, payload);
}
// ============================================
// 10.0 ФОТО ПРОБЛЕМЫ В КЛИЕНТСКОЙ ФОРМЕ (до 3, по желанию)
// ============================================

const MAX_LEAD_PHOTOS = 3;          // максимум фото на заявку
const LEAD_PHOTO_MAX_BYTES = 10 * 1024 * 1024;  // ограничение на исходный файл (10 МБ)
let leadPhotoDataUrls = [];          // сжатые dataURL для отправки в бота

// Сжимает изображение через <canvas> до ~1280px по длинной стороне (JPEG ~0.7).
// Возвращает Promise<dataURL>. На ошибке — отклоняется.
function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('read error'));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('decode error'));
            img.onload = () => {
                const MAX = 1280;
                let { width, height } = img;
                if (width > MAX || height > MAX) {
                    const k = Math.min(MAX / width, MAX / height);
                    width = Math.round(width * k);
                    height = Math.round(height * k);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

// Инжектит блок загрузки фото в clientLeadForm (как initClientDistrictOptions — без правки HTML).
function initClientPhotoUpload() {
    const form = document.getElementById('clientLeadForm');
    if (!form) return;
    if (form.querySelector('.lead-photo-wrap')) return; // уже добавлено

    const wrap = document.createElement('div');
    wrap.className = 'lead-photo-wrap';

    const label = document.createElement('label');
    label.className = 'lead-photo-label';
    label.textContent = t('photoLabel');

    const input = document.createElement('input');
    input.type = 'file';
    input.name = 'photo';            // попадёт в FormData → Formspree приложит оригиналы к email
    input.accept = 'image/*';
    input.multiple = true;
    input.className = 'lead-photo-input';
    // Подпись для скринридера: у <input type="file"> нет placeholder'а, и без
    // неё поле объявляется просто «кнопка выбора файла».
    input.setAttribute('aria-label', t('a11yPhotos'));
    // Прячем нативный input: его текст («Выбрать файлы / Файлы не выбраны») задаётся
    // локалью браузера и не переводится. Вместо него — своя кнопка с переводом.

    // Кастомная кнопка вместо нативной «Выбрать файлы»
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lead-photo-btn';
    btn.textContent = t('photoAdd');
    btn.addEventListener('click', () => input.click());

    const previews = document.createElement('div');
    previews.className = 'lead-photo-previews';

    wrap.appendChild(label);
    wrap.appendChild(input);
    wrap.appendChild(btn);
    wrap.appendChild(previews);

    // Вставляем перед блоком согласия/кнопкой отправки (или в конец формы)
    const consent = form.querySelector('.consent-label') || form.querySelector('button[type="submit"]');
    if (consent) form.insertBefore(wrap, consent);
    else form.appendChild(wrap);

    function renderPreviews() {
        previews.innerHTML = '';
        leadPhotoDataUrls.forEach((url, idx) => {
            const item = document.createElement('div');
            item.className = 'lead-photo-thumb';
            const im = document.createElement('img');
            im.src = url;
            const rm = document.createElement('button');
            rm.type = 'button';
            rm.className = 'lead-photo-remove';
            rm.setAttribute('aria-label', t('photoRemove'));
            rm.textContent = '×';
            rm.addEventListener('click', () => {
                leadPhotoDataUrls.splice(idx, 1);
                renderPreviews();
            });
            item.appendChild(im);
            item.appendChild(rm);
            previews.appendChild(item);
        });
    }

    input.addEventListener('change', async () => {
        const files = Array.from(input.files || []);
        input.value = ''; // позволяем выбрать те же файлы повторно после удаления
        for (const file of files) {
            if (leadPhotoDataUrls.length >= MAX_LEAD_PHOTOS) { alert(t('photoTooMany')); break; }
            if (!file.type.startsWith('image/')) { alert(t('photoBadType')); continue; }
            if (file.size > LEAD_PHOTO_MAX_BYTES) { alert(t('photoTooBig')); continue; }
            try {
                leadPhotoDataUrls.push(await compressImage(file));
            } catch (e) {
                console.error('compressImage error:', e);
            }
        }
        renderPreviews();
    });

    // Доступно снаружи для очистки после успешной отправки
    initClientPhotoUpload._reset = () => { leadPhotoDataUrls = []; renderPreviews(); };
}

// Значение опции «Другое» в select специальности по языкам (value из HTML).
const SPECIALTY_OTHER_VALUE = { ru: 'Другое', en: 'Other', ka: 'სხვა' };

// Инжектит поле «уточните специальность» в форму мастера: показывается только
// когда в select специальности выбрано «Другое». Без правки HTML каждой страницы
// (как initClientPhotoUpload / initClientUrgentOption).
function initMasterSpecialtyOther() {
    const form = document.getElementById('masterLeadForm');
    if (!form) return;
    const select = form.querySelector('select[name="specialty"]');
    if (!select) return;
    if (form.querySelector('input[name="specialty_other"]')) return; // уже добавлено

    const lang = ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru';
    const otherValue = SPECIALTY_OTHER_VALUE[lang] || SPECIALTY_OTHER_VALUE.ru;

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'specialty_other';
    input.placeholder = t('specialtyOtherPlaceholder');
    input.setAttribute('aria-label', t('a11ySpecialtyOther'));
    input.style.display = 'none';           // скрыто, пока не выбрано «Другое»
    input.minLength = 2;

    // Вставляем сразу после select специальности
    select.insertAdjacentElement('afterend', input);

    function sync() {
        const isOther = select.value === otherValue;
        input.style.display = isOther ? '' : 'none';
        input.required = isOther;
        if (!isOther) input.value = '';
    }
    select.addEventListener('change', sync);
    sync();
}

// Одноразовый код связки «анкета на сайте ↔ мастер в боте». Генерируется при
// отправке формы, уходит в бота полем code и подставляется в диплинк кнопки
// «Завершить регистрацию» (?start=m_<code>). По нему бот подтянет анкету, и
// мастеру не придётся вводить данные заново — только пройти селфи-верификацию.
let masterLeadCode = '';
function generateMasterLeadCode() {
    // 24 hex-символа в нижнем регистре: безопасно для диплинка Telegram (?start=…
    // допускает [A-Za-z0-9_-]) и переживает .toLowerCase() при разборе в боте.
    try {
        const bytes = new Uint8Array(12);
        crypto.getRandomValues(bytes);
        return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        // Фолбэк без Web Crypto (очень старые браузеры)
        return (Date.now().toString(16) + Math.random().toString(16).slice(2)).slice(0, 24);
    }
}

// Отправка анкеты мастера в Telegram-бота (лид админу). Fire-and-forget, не влияет на email.
async function sendMasterLeadToBot(formData) {
    const get = (k) => (formData.get(k) || '').toString().trim();

    const lang = ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru';
    const otherValue = SPECIALTY_OTHER_VALUE[lang] || SPECIALTY_OTHER_VALUE.ru;
    const specialtyOther = get('specialty_other');
    let specialty = get('specialty');
    if (specialty === otherValue && specialtyOther) {
        specialty = specialtyOther;
    }
    const experience = get('experience');

    const payload = {
        name:      get('name'),
        phone:     normalizeGeorgianPhone(get('phone')),
        telegram:  get('telegram'),
        whatsapp:  normalizeWhatsappPhone(get('whatsapp')),
        specialty: experience ? specialty + ' (опыт: ' + experience + ' лет)' : specialty,
        city:      get('city') || masterCityFromDistrict(get('district')),
        district:  masterDistrictForBot(get('district')),
        message:   get('about'),
        specialty_raw: specialty,
        experience:    experience,
        code:          masterLeadCode,
        honeypot:      get('_gotcha'),
        lang:         lang
    };

    return await postBotJson(BOT_MASTER_URL, payload);
}
// Диплинк «завершить регистрацию»: если есть код связки — ведём на ?start=m_<code>
// (бот подтянет анкету и попросит только селфи), иначе на общий ?start=master.
function masterFinishDeeplink() {
    if (masterLeadCode) {
        // Меняем аргумент master → m_<code>, сохраняя базовый URL бота.
        return MASTER_BOT_DEEPLINK.replace(/\?start=.*$/, '') + '?start=m_' + masterLeadCode;
    }
    return MASTER_BOT_DEEPLINK;
}

// Добавляет в модалку благодарности мастеру кнопку «Завершить регистрацию в Telegram».
// При повторном вызове (после отправки формы) обновляет href актуальным кодом связки.
function ensureMasterTelegramButton() {
    const modal = document.getElementById('masterThankYouModal');
    if (!modal) return;
    const content = modal.querySelector('.thank-you-content');
    if (!content) return;
    let link = content.querySelector('.master-tg-finish-btn');
    if (!link) {
        link = document.createElement('a');
        link.className = 'master-tg-finish-btn';
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = t('masterFinishTelegram');
        // Вставляем перед кнопкой «Отлично!», если она есть
        const okBtn = content.querySelector('.thank-you-btn');
        if (okBtn) content.insertBefore(link, okBtn);
        else content.appendChild(link);
    }
    link.href = masterFinishDeeplink();
}

// ============================================
// 10.1 КАСКАД: РАЙОН → ПОДРАЙОН (данные из бота, config.yaml)
// ============================================

// Пересобирает <select name="district"> из DISTRICTS — один список на все страницы.
// Раньше районы лежали в HTML каждой страницы и разъехались (8/9/11 опций, Мтацминда
// и Крцаниси не везде): клиент не находил свой район и жал «Другой». Теперь HTML-опции
// полностью заменяются сгенерированными.
//
// Что сохраняется из исходного HTML:
//   • плейсхолдер (<option value="">) с его подписью и data-* переводами;
//   • предвыбранный район лендинга (<option selected>, напр. Ваке на /master-na-chas-vake/);
//   • служебная опция «Все районы» (All) — она есть только в форме мастера.
//
// :param withHints: добавлять ли к подписи справочные местности.
//     В клиентской форме — нет: на мобильном длинные подписи мешают быстрому выбору.
//     В форме мастера — также нет.
function buildDistrictSelect(select, withHints) {
    if (!select) return;

    const lang = ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru';

    // Запоминаем исходное состояние ДО очистки списка.
    const placeholder = select.querySelector('option[value=""]');
    const hadAll = !!select.querySelector('option[value="All"]');
    const hadOther = !!select.querySelector('option[value="Other"]');
    // Что было выбрано: value непустой — это предвыбор лендинга, его и восстановим.
    const preselected = select.value;

    // Собираем опцию с data-* переводами: при смене языка setLanguage переведёт её сам
    // (в нём есть ветка для OPTION), без повторной пересборки списка.
    const makeOption = (value, labels) => {
        const opt = document.createElement('option');
        opt.value = value;
        opt.setAttribute('data-ru', labels.ru);
        opt.setAttribute('data-en', labels.en);
        opt.setAttribute('data-ka', labels.ka);
        opt.textContent = labels[lang] || labels.ru;
        return opt;
    };

    select.innerHTML = '';

    // 1. Плейсхолдер «Выберите район» — переносим из HTML как есть (подписи у форм разные:
    //    «Выберите район» у клиента, «Район работы» у мастера).
    if (placeholder) select.appendChild(placeholder);

    // 2. Районы бота — по ГОРОДУ СТРАНИЦЫ (см. clientDistrictsForPage).
    //    На батумском лендинге тбилисские районы показывать нельзя: заявка
    //    ушла бы с районом чужого города и не нашла бы ни одного мастера.
    clientDistrictsForPage().forEach(function (d) {
        select.appendChild(makeOption(d.slug, {
            ru: districtLabel(d, 'ru', withHints),
            en: districtLabel(d, 'en', withHints),
            ka: districtLabel(d, 'ka', withHints)
        }));
    });

    // 3. Служебные опции — в том же составе, что были в HTML этой формы.
    //    «Все районы» только у мастера, «Другой» — у клиента (там его уточняют текстом).
    if (hadAll) select.appendChild(makeOption('All', DISTRICT_SPECIAL.All));
    if (hadOther) select.appendChild(makeOption('Other', DISTRICT_SPECIAL.Other));

    // 4. Возвращаем предвыбор лендинга (район страницы) — он пережил пересборку.
    if (preselected) select.value = preselected;
}

// ── Переключатель города в шапке ───────────────────────────────────────────
// На десктопе плашка показывает только текущий город, остальные — списком по
// клику: при добавлении городов ширина шапки не меняется. На мобильном (<769px)
// кнопки остаются в ряд, там CSS-правила дропдауна не действуют.
//
// Ширину плашки считаем в JS, а не в CSS: она должна совпадать с «Для мастеров»
// над ней, а длина той надписи меняется при переключении языка (RUS/GEO/ENG).
function initCityDropdown() {
    const DESKTOP = '(min-width: 769px)';
    const city = document.querySelector('.city-switcher');
    if (!city) return;

    // Нумеруем пункты выпадающей части: CSS по --i ставит их друг под другом.
    // Активный город в список не входит, поэтому считаем только остальные —
    // иначе первый пункт уехал бы на место второго.
    city.querySelectorAll('.city-btn:not(.active)').forEach((btn, i) => {
        btn.style.setProperty('--i', i);
    });

    // Раскрытие по клику
    city.addEventListener('click', (e) => {
        if (!window.matchMedia(DESKTOP).matches) return;
        // Клик по пункту списка — это переход по ссылке, не мешаем
        if (e.target.closest('.city-btn:not(.active)')) return;
        e.preventDefault();
        city.classList.toggle('is-open');
    });

    // Клик вне плашки и Escape — закрываем
    document.addEventListener('click', (e) => {
        if (!city.contains(e.target)) city.classList.remove('is-open');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') city.classList.remove('is-open');
    });

    // Плашка-ориентир, по ширине которой равняем переключатель города.
    // На главных и хабах это «Для мастеров» (стоит прямо над городом), а на
    // сервисных и районных лендингах её в шапке нет — там равняемся на счётчик
    // онлайна. Без запасного варианта --city-switcher-w не задавалась вовсе, и
    // выпадающий список получал ширину по содержимому, не совпадающую с плашкой.
    const masters = document.querySelector('.audience-link')
                 || document.querySelector('.online-counter');

    // Вторая пара: языковой переключатель равняется по счётчику онлайна, чтобы
    // правые края обеих строк шапки сходились в одну вертикаль (как в Сербии).
    // Радужной рамке (.language-switcher::before) это не вредит: она задана
    // через inset: -2px от самого элемента и растягивается вместе с ним.
    const lang = document.querySelector('.language-switcher');
    const counter = document.querySelector('.online-counter');

    function syncWidth() {
        const root = document.documentElement.style;

        if (!window.matchMedia(DESKTOP).matches) {
            // На мобильном ширины не навязываем — плашки тянутся сами
            root.removeProperty('--city-switcher-w');
            root.removeProperty('--lang-switcher-w');
            return;
        }

        // Снимаем прежние значения, чтобы замерить естественную ширину
        root.removeProperty('--city-switcher-w');
        root.removeProperty('--lang-switcher-w');

        // Округляем вверх: дробная ширина (например 174.6px) даёт субпиксельный
        // сдвиг, и рамка выпадающего списка не сходится с рамкой плашки ровно.
        if (masters) {
            const need = Math.ceil(Math.max(masters.offsetWidth, city.scrollWidth));
            root.setProperty('--city-switcher-w', need + 'px');
        }
        if (counter && lang) {
            const need = Math.ceil(Math.max(counter.offsetWidth, lang.scrollWidth));
            root.setProperty('--lang-switcher-w', need + 'px');
        }
    }

    // Первый расчёт — после загрузки шрифтов: до неё ширины текста отличаются,
    // и плашки разъезжались бы при подмене шрифта.
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(syncWidth);
    } else {
        syncWidth();
    }
    syncWidth();

    // Пересчёт при изменении размера окна и смене языка
    let t = null;
    window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(syncWidth, 150);
    });
    document.querySelectorAll('.lang-btn').forEach(b =>
        b.addEventListener('click', () => setTimeout(syncWidth, 50))
    );
}

// Собирает список районов в клиентской форме и включает уточнение для «Другого».
function initClientDistrictOptions() {
    const form = document.getElementById('clientLeadForm');
    if (!form) return;
    const districtSel = form.querySelector('select[name="district"]');
    if (!districtSel) return;

    buildDistrictSelect(districtSel, false);  // только названия районов
    initDistrictOtherInput(form, districtSel);
}

// Связка «город → районы» в анкете мастера.
//
// Зачем: бот рассылает заявки мастерам ОДНОГО города (фильтр city в
// get_masters_by_rating), поэтому город обязан быть известен точно. Раньше
// сервис работал в одном Тбилиси и город не спрашивали вовсе. С появлением
// Батуми мастер выбирает город явно, а список районов перестраивается под него
// — рассогласование «Батуми + Ваке» стало невозможным в принципе.
//
// Селект города создаётся ЗДЕСЬ, а не в разметке: страниц много, и правка через
// JS не требует обхода каждого HTML (тот же приём, что у районов и фото).
function initMasterCityDistrict() {
    const form = document.getElementById('masterLeadForm');
    if (!form) return;
    const districtSel = form.querySelector('select[name="district"]');
    if (!districtSel) return;

    const lang = ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru';

    // Селект города: создаём один раз и ставим ПЕРЕД селектом района.
    let citySel = form.querySelector('select[name="city"]');
    if (!citySel) {
        citySel = document.createElement('select');
        citySel.name = 'city';
        citySel.required = true;
        citySel.setAttribute('aria-label', t('a11yCity'));
        citySel.className = districtSel.className;   // те же стили, что у района

        const ph = document.createElement('option');
        ph.value = '';
        ph.disabled = true;
        ph.selected = true;
        ph.setAttribute('data-ru', i18n.ru.masterCityPlaceholder);
        ph.setAttribute('data-en', i18n.en.masterCityPlaceholder);
        ph.setAttribute('data-ka', i18n.ka.masterCityPlaceholder);
        ph.textContent = t('masterCityPlaceholder');
        citySel.appendChild(ph);

        CITIES.forEach(function (c) {
            const opt = document.createElement('option');
            opt.value = c.value;                      // канон-RU для бота
            opt.setAttribute('data-ru', c.ru);
            opt.setAttribute('data-en', c.en);
            opt.setAttribute('data-ka', c.ka);
            opt.textContent = c[lang] || c.ru;
            citySel.appendChild(opt);
        });

        districtSel.insertAdjacentElement('beforebegin', citySel);
    }

    // Районы выбранного города. Пока город не выбран — район недоступен:
    // выбирать не из чего, и это сразу видно по подписи.
    function fillDistricts() {
        const city = CITIES.find(function (c) { return c.value === citySel.value; });
        districtSel.innerHTML = '';

        const ph = document.createElement('option');
        ph.value = '';
        ph.disabled = true;
        ph.selected = true;
        const phKey = city ? 'masterDistrictLabel' : 'masterDistrictPlaceholder';
        ph.setAttribute('data-ru', i18n.ru[phKey]);
        ph.setAttribute('data-en', i18n.en[phKey]);
        ph.setAttribute('data-ka', i18n.ka[phKey]);
        ph.textContent = t(phKey);
        districtSel.appendChild(ph);

        if (!city) {
            districtSel.disabled = true;
            return;
        }
        districtSel.disabled = false;

        city.districts.forEach(function (d) {
            const opt = document.createElement('option');
            opt.value = d.slug;
            opt.setAttribute('data-ru', d.ru);
            opt.setAttribute('data-en', d.en);
            opt.setAttribute('data-ka', d.ka);
            opt.textContent = d[lang] || d.ru;
            districtSel.appendChild(opt);
        });

        // «Все районы» — в пределах ВЫБРАННОГО города, поэтому значение своё:
        // по нему masterCityFromDistrict восстановит город, если он потеряется.
        const allOpt = document.createElement('option');
        allOpt.value = city.value === 'Батуми' ? 'AllBA' : 'AllTB';
        allOpt.setAttribute('data-ru', DISTRICT_SPECIAL.All.ru);
        allOpt.setAttribute('data-en', DISTRICT_SPECIAL.All.en);
        allOpt.setAttribute('data-ka', DISTRICT_SPECIAL.All.ka);
        allOpt.textContent = DISTRICT_SPECIAL.All[lang] || DISTRICT_SPECIAL.All.ru;
        districtSel.appendChild(allOpt);
    }

    citySel.addEventListener('change', fillDistricts);
    fillDistricts();
}

// Совместимость: старое имя вызывается из инициализации страниц.
function initMasterDistrictOptions() {
    initMasterCityDistrict();
}

// Уточнение района для варианта «Другой»: без него заявка приходит мастеру как
// «Район: Другой» — мастер не понимает, ехать ли ему, и либо не берёт заявку,
// либо выкупает контакт вслепую за 10 ₾.
//
// Поле появляется ТОЛЬКО при выборе «Другой» и тогда же становится обязательным.
// Значение уходит боту в subdistrict (а не в district): поле уже есть в контракте,
// бот умеет показывать «Район, Подрайон» (notifications.py), менять бота не нужно.
// Карточка мастера становится «🇬🇪 Район: Другой, Вазисубани».
function initDistrictOtherInput(form, select) {
    if (form.querySelector('input[name="district_other"]')) return; // уже добавлено

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'district_other';
    input.className = 'district-other-input';
    // data-*-placeholder → плейсхолдер переводится в setLanguage при смене языка.
    input.setAttribute('data-ru-placeholder', i18n.ru.districtOtherPlaceholder);
    input.setAttribute('data-en-placeholder', i18n.en.districtOtherPlaceholder);
    input.setAttribute('data-ka-placeholder', i18n.ka.districtOtherPlaceholder);
    input.placeholder = t('districtOtherPlaceholder');
    input.setAttribute('aria-label', t('a11yDistrictOther'));
    input.style.display = 'none';   // скрыто, пока не выбран «Другой»
    input.minLength = 3;            // «ок» и прочие отписки не пройдут

    select.insertAdjacentElement('afterend', input);

    function sync() {
        const isOther = select.value === 'Other';
        input.style.display = isOther ? '' : 'none';
        input.required = isOther;
        if (!isOther) input.value = '';   // чтобы скрытое поле не уехало в заявку
    }
    select.addEventListener('change', sync);
    sync();
}

// Инжектит галочку «Срочный заказ» в клиентскую форму на всех страницах —
// через JS, без правки HTML каждой страницы (как фото/районы выше).
// Галочка необязательная и по умолчанию снята. У неё НЕТ name — она не уходит
// в Formspree; состояние читается в sendLeadToBot и шлётся боту полем urgent.
function initClientUrgentOption() {
    const form = document.getElementById('clientLeadForm');
    if (!form) return;
    if (form.querySelector('.lead-urgent-label')) return; // уже добавлено

    // Точка вставки ищется ДО создания нашей метки, иначе querySelector('.consent-label')
    // зацепил бы её саму (у неё тот же класс consent-label для одинакового вида).
    const consent = form.querySelector('.consent-label') || form.querySelector('button[type="submit"]');

    const label = document.createElement('label');
    // Тот же класс, что у строки согласия → идентичный стиль (в т.ч. компактный чекбокс,
    // иначе общий стиль формы растягивает input на всю ширину). Своя метка — для guard.
    label.className = 'consent-label lead-urgent-label';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'leadUrgent';   // без name — в Formspree не уходит, читаем в sendLeadToBot

    const span = document.createElement('span');
    // data-атрибуты → строка переводится автоматически при смене языка (см. setLanguage)
    span.setAttribute('data-ru', i18n.ru.urgentLabel);
    span.setAttribute('data-ka', i18n.ka.urgentLabel);
    span.setAttribute('data-en', i18n.en.urgentLabel);
    span.textContent = t('urgentLabel');

    label.appendChild(input);
    label.appendChild(span);

    // Вставляем прямо над строкой согласия (или перед кнопкой отправки, если согласия нет)
    if (consent) form.insertBefore(label, consent);
    else form.appendChild(label);
}

function initClientLeadFormTracking() {
    const leadForm = document.getElementById('clientLeadForm');
    if (!leadForm) return;

    let isSubmitting = false;
    let pendingIdempotencyKey = null;

    leadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (isSubmitting) return;
        if (!validateLeadForm(e)) return;

        isSubmitting = true;
        // 🕐 Показываем, что заявка уходит. Отправка занимает до 10 секунд,
        // когда приложены фото (тело до ~1.6 МБ с мобильного интернета), и
        // без обратной связи кнопка выглядела «мёртвой»: человек жал её
        // повторно, думая, что промахнулся. Повторная отправка и раньше
        // отсекалась флагом isSubmitting — не хватало именно ВИДИМОГО
        // признака, что процесс идёт.
        const submitBtn = leadForm.querySelector('button[type="submit"]');
        const submitLabel = submitBtn ? submitBtn.textContent : null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = t('submitSending');
        }

        const formData = new FormData(leadForm);
        const transactionId = 'client_' + Date.now();
        if (!pendingIdempotencyKey) {
            pendingIdempotencyKey = generateSiteIdempotencyKey('client');
        }

        try {
            // Telegram Bot — операционный канал. Успех формы показываем только
            // после подтверждённого принятия заявки ботом.
            await sendLeadToBot(formData, pendingIdempotencyKey);

            // 📧 Formspree — ДУБЛЬ заявки на почту, страховка на случай сбоя
            // бота. Его ответа НЕ ждём: клиенту он не нужен, а ожидание
            // добавляло к паузе ещё несколько секунд. Ошибку только логируем —
            // заявка уже принята ботом, и показывать из-за почты «не удалось
            // отправить» было бы прямой ложью.
            fetch('https://formspree.io/f/xpqjbpyk', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).catch((err) => console.error('Formspree (дубль заявки):', err));

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead_client', {
                    form_name: 'client_lead_form',
                    form_location: 'Заявка клиента',
                    user_type: 'client',
                    value: 1,
                    currency: 'USD'
                });
            }

            closeClientLeadForm();
            openThankYou();
            leadForm.reset();
            pendingIdempotencyKey = null;
            if (initClientPhotoUpload._reset) initClientPhotoUpload._reset(); // чистим превью фото

        } catch (error) {
            console.error(error);
            alert(t('submitError'));
            isSubmitting = false;
        } finally {
            // Кнопку возвращаем в исходный вид ВСЕГДА — и после успеха тоже.
            // Форма не пересоздаётся: при следующем открытии модалки клиент
            // увидел бы ту же кнопку «Отправляем…», навсегда выключенную.
            //
            // disabled снимаем по состоянию галочки согласия: без неё кнопка
            // должна остаться выключенной, как при первом открытии формы.
            if (submitBtn) {
                submitBtn.textContent = submitLabel;
                const consent = document.getElementById('leadConsent');
                submitBtn.disabled = !!(consent && !consent.checked);
            }
        }
    });

    // Checkbox
    const leadConsent   = document.getElementById('leadConsent');
    const leadSubmitBtn = document.getElementById('leadSubmitBtn');
    if (leadConsent && leadSubmitBtn) {
        leadSubmitBtn.disabled = !leadConsent.checked;
        leadConsent.addEventListener('change', function () {
            leadSubmitBtn.disabled = !this.checked;
        });
    }
}


// ============================================
// Детектор адреса в описании заявки
// ============================================
// Описание уходит мастерам в рассылке ДО оплаты заявки: если там адрес,
// мастер может приехать, не выкупив контакт (обход оплаты). Зеркало серверной
// проверки бота (validators.contains_address) — предупреждаем сразу, чтобы
// клиент не получил отказ уже после отправки формы.
const ADDR_STREET_WORDS = [
    'улица', 'улице', 'улицу', 'ул.', 'ул ',
    'проспект', 'проспекте', 'пр-т', 'пр.', 'пр ',
    'переулок', 'переулке', 'пер.',
    'шоссе', 'бульвар', 'набережная', 'площадь', 'тупик', 'квартал',
    'корпус', 'корп.', 'стр.', 'строение',
    'street', 'str.', 'avenue', 'ave.', 'road', 'rd.', 'lane', 'square',
    'ქუჩა', 'გამზირი', 'ციხი', 'მოედანი',
    'мепе', 'мере'
];
const ADDR_UNIT_WORDS = [
    'дом ', 'д.', 'квартира', 'кв.', 'кв ', 'подъезд', 'этаж', 'домофон',
    'apt', 'apartment', 'flat', 'floor', 'entrance', 'building',
    'ბინა', 'სადარბაზო', 'სართული'
];
const HOUSE_NUM_RE = /(^|[\s,.;])(д|дом|кв|квартира|корп|корпус|под|подъезд|эт|этаж)\.?\s*№?\s*\d+/i;
const STREET_NUM_RE = /(улиц[а-яё]*|проспект[а-яё]*|пр-т|переул[а-яё]*|шоссе|бульвар|наб[а-яё]*|площад[а-яё]*|street|avenue|road|lane|ქუჩა|გამზირი|мепе|мере)\s*[^\s,;]{0,25}[\s,]*\d+/i;

function containsAddress(text) {
    if (!text) return false;
    const low = ' ' + String(text).toLowerCase().replace(/\n/g, ' ') + ' ';
    if (HOUSE_NUM_RE.test(low)) return true;
    if (STREET_NUM_RE.test(low)) return true;
    const hasStreet = ADDR_STREET_WORDS.some(function (w) { return low.indexOf(w) !== -1; });
    const hasUnit   = ADDR_UNIT_WORDS.some(function (w) { return low.indexOf(w) !== -1; });
    return hasStreet && hasUnit;
}


function validateLeadForm(e) {
    const form          = e.target;
    const nameInput     = form.querySelector('input[name="name"]');
    const phoneInput    = document.getElementById('leadPhone');
    const telegramInput = form.querySelector('input[name="telegram"]');
    const whatsappInput = form.querySelector('input[name="whatsapp"]');

    const telegramValue = telegramInput ? telegramInput.value.trim() : '';
    const whatsappValue = whatsappInput ? whatsappInput.value.trim() : '';

    // Имя буквами: цифры в этом поле — либо опечатка, либо спам-бот.
    if (!validateName(nameInput)) return false;

    if (!telegramValue && !whatsappValue) {
        alert(t('contactRequired'));
        if (telegramInput && !telegramValue) telegramInput.focus();
        else if (whatsappInput) whatsappInput.focus();
        return false;
    }

    if (!validatePhone(phoneInput)) return false;
    if (telegramValue && !validateTelegram(telegramInput)) return false;

    // Район «Другой» обязан быть уточнён: иначе мастер получает заявку без географии
    // и не может решить, ехать ли. Проверяем здесь, а не только через required —
    // поле создаётся скриптом, и на минимальную длину нужна явная проверка.
    const districtSel = form.querySelector('select[name="district"]');
    const districtOther = form.querySelector('input[name="district_other"]');
    if (districtSel && districtSel.value === 'Other' && districtOther) {
        if (districtOther.value.trim().length < 3) {
            alert(t('districtOtherRequired'));
            districtOther.focus();
            return false;
        }
    }

    // Адрес в описании запрещён: текст уходит мастерам ДО оплаты,
    // и сервер бота такую заявку всё равно отклонит (address_in_text).
    const messageInput = form.querySelector('textarea[name="message"]');
    if (messageInput && containsAddress(messageInput.value)) {
        alert(t('addressInDescription'));
        messageInput.focus();
        return false;
    }

    return true;
}

// ============================================
// 11. ЛИД-ФОРМА МАСТЕРА
// ============================================

function initMasterLeadFormTracking() {
    const masterLeadForm = document.getElementById('masterLeadForm');
    if (!masterLeadForm) return;

    let isSubmitting = false;
    let pendingMasterLeadCode = null;

    // Кнопка-диплинк в модалке благодарности готовится заранее (до открытия модалки)
    ensureMasterTelegramButton();

    masterLeadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (isSubmitting) return;
        if (!validateMasterLeadForm(e)) return;

        isSubmitting = true;
        // Состояние кнопки — как в клиентской форме: без него анкета
        // выглядит «зависшей», и человек жмёт отправку повторно.
        const submitBtn = masterLeadForm.querySelector('button[type="submit"]');
        const submitLabel = submitBtn ? submitBtn.textContent : null;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = t('submitSending');
        }

        const formData = new FormData(masterLeadForm);

        // Один код сохраняется до успешной отправки. При retry после сетевого
        // сбоя бот получит тот же code и не создаст новую связку.
        if (!pendingMasterLeadCode) pendingMasterLeadCode = generateMasterLeadCode();
        masterLeadCode = pendingMasterLeadCode;

        try {
            await sendMasterLeadToBot(formData);

            // Formspree — дубль анкеты на почту, ответа не ждём (см. тот же
            // приём в клиентской форме): анкета уже принята ботом, и держать
            // мастера лишние секунды ради письма незачем.
            fetch('https://formspree.io/f/mykdoebj', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).catch((err) => console.error('Formspree (дубль анкеты):', err));

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead_master', {
                    form_name: 'master_lead_form',
                    form_location: 'Регистрация мастера',
                    user_type: 'master',
                    value: 0,
                    currency: 'USD'
                });
            }

            closeMasterLeadForm();
            ensureMasterTelegramButton();
            openMasterThankYou();
            masterLeadForm.reset();
            pendingMasterLeadCode = null;

        } catch (error) {
            console.error('Master form error:', error);
            alert(t('submitError'));
            isSubmitting = false;
        } finally {
            // Возвращаем кнопку всегда — иначе при повторном открытии анкеты
            // она осталась бы выключенной с надписью «Отправляем…».
            if (submitBtn) {
                submitBtn.textContent = submitLabel;
                const consent = document.getElementById('masterLeadConsent');
                submitBtn.disabled = !!(consent && !consent.checked);
            }
        }
    });

    // Checkbox
    const masterLeadConsent   = document.getElementById('masterLeadConsent');
    const masterLeadSubmitBtn = document.getElementById('masterLeadSubmitBtn');
    if (masterLeadConsent && masterLeadSubmitBtn) {
        masterLeadSubmitBtn.disabled = !masterLeadConsent.checked;
        masterLeadConsent.addEventListener('change', function () {
            masterLeadSubmitBtn.disabled = !this.checked;
        });
    }
}

function validateMasterLeadForm(e) {
    const form          = e.target;
    const nameInput     = form.querySelector('input[name="name"]');
    const phoneInput    = document.getElementById('masterLeadPhone');
    const telegramInput = form.querySelector('input[name="telegram"]');

    const telegramValue = telegramInput ? telegramInput.value.trim() : '';

    // Имя буквами — зеркало is_valid_fio в боте. Если не проверить здесь, бот
    // забракует анкету и мастер будет вводить все данные заново.
    if (!validateName(nameInput)) return false;

    // Для мастера Telegram обязателен: верификация (селфи+код) проходит в Telegram-боте.
    // WhatsApp — по желанию, дополнительный контакт.
    if (!telegramValue) {
        alert(t('telegramRequiredMaster'));
        if (telegramInput) telegramInput.focus();
        return false;
    }

    if (!validatePhone(phoneInput)) return false;
    if (!validateTelegram(telegramInput)) return false;

    // Если специальность «Другое» — уточнение обязательно.
    const specialtySel = form.querySelector('select[name="specialty"]');
    const otherInput   = form.querySelector('input[name="specialty_other"]');
    if (specialtySel && otherInput) {
        const lang = ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru';
        const otherValue = SPECIALTY_OTHER_VALUE[lang] || SPECIALTY_OTHER_VALUE.ru;
        if (specialtySel.value === otherValue && !otherInput.value.trim()) {
            alert(t('specialtyOtherRequired'));
            otherInput.focus();
            return false;
        }
    }

    return true;
}

// ============================================
// 12. УПРАВЛЕНИЕ МОДАЛЬНЫМИ ОКНАМИ
// ============================================

// ============================================
// 12.1 НОЧНОЙ РЕЖИМ ОКНА БЛАГОДАРНОСТИ
// ============================================

// «Тихие часы» — зеркало config.yaml → quiet_hours у бота (quiet_hours.py).
// В это время бот шлёт заявку мастерам СРАЗУ, но беззвучно, поэтому ночью
// отклик приходит в среднем не за час, а утром. Сайт обязан обещать то же
// самое: иначе клиент ждёт звонка через час, не дожидается и уходит, хотя
// заявка в системе есть и мастер её возьмёт.
//
// ⚠️ ПАРНАЯ ПРАВКА: меняя часы здесь, поменяй их в config.yaml бота
// (секция quiet_hours) — и наоборот. Разъехавшиеся значения не ломают
// ничего явно, но сайт начнёт называть время, которого бот не держит.
const QUIET_HOURS = {
    weekday: { start: '22:00', end: '08:00' },   // Пн–Пт
    weekend: { start: '22:00', end: '09:00' },   // Сб, Вс
};

// Текущие дата и время в поясе Тбилиси.
//
// ⚠️ Считаем именно по Тбилиси, а НЕ по часам устройства: среди клиентов
// много релокантов и туристов с чужим поясом на телефоне, плюс VPN. По
// локальному времени мы показали бы «мы спим» в разгар рабочего дня.
// Intl с timeZone даёт время города независимо от настроек устройства.
function tbilisiNow() {
    try {
        const parts = new Intl.DateTimeFormat('en-GB', {
            timeZone: 'Asia/Tbilisi',
            hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false,
        }).formatToParts(new Date());
        const get = (type) => (parts.find(p => p.type === type) || {}).value;
        const hour = parseInt(get('hour'), 10);
        const minute = parseInt(get('minute'), 10);
        // weekday приходит как Mon/Tue/…; переводим в номер (Пн=0 … Вс=6)
        const days = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
        const weekday = days[get('weekday')];
        if (isNaN(hour) || isNaN(minute) || weekday === undefined) return null;
        return { minutes: hour * 60 + minute, weekday };
    } catch (e) {
        // Старый браузер без поддержки timeZone в Intl — молча отключаем
        // ночной режим. Показать обычный бейдж лучше, чем сломать окно.
        return null;
    }
}

function _hhmmToMinutes(value) {
    const [h, m] = String(value).split(':').map(Number);
    return h * 60 + m;
}

// Ночной ли сейчас час в Тбилиси. Окно пересекает полночь, поэтому момент
// «тихий», если он либо после вечернего start, либо до утреннего end —
// та же формула, что в quiet_hours.is_quiet у бота.
// Возвращает время начала работы ('08:00') или null, если сейчас день.
function quietHoursReplyTime() {
    const now = tbilisiNow();
    if (!now) return null;
    const block = now.weekday >= 5 ? QUIET_HOURS.weekend : QUIET_HOURS.weekday;
    const start = _hhmmToMinutes(block.start);
    const end   = _hhmmToMinutes(block.end);
    if (now.minutes < end) {
        // Ночь после полуночи: отвечаем утром того же дня.
        return block.end;
    }
    if (now.minutes >= start) {
        // Вечер до полуночи: отвечаем утром СЛЕДУЮЩЕГО дня, а у него может
        // быть другое время конца тишины (будни 08:00 / выходные 09:00).
        const tomorrow = (now.weekday + 1) % 7;
        const next = tomorrow >= 5 ? QUIET_HOURS.weekend : QUIET_HOURS.weekday;
        return next.end;
    }
    return null;
}

// Заполняет окно благодарности: днём — обычный бейдж, ночью — честное
// «свяжемся утром». Текст берётся из словаря i18n, а не из HTML страницы:
// раньше он был зашит в каждую из 105 страниц и успел разъехаться
// («15–60» на лендингах против «30–60» на главных).
//
// HTML при этом НЕ трогаем: зашитый текст остаётся запасным вариантом на
// случай, если скрипт не отработает — пустое окно хуже неточной цифры.
function applyThankYouBadge() {
    const modal = document.getElementById('thankYouModal');
    if (!modal) return;
    const label = modal.querySelector('.badge-label');
    const value = modal.querySelector('.badge-value');
    const text  = modal.querySelector('.thank-you-text');
    if (!label || !value) return;

    // Исходный дневной текст запоминаем при первом вызове: окно открывается
    // много раз за сессию, и без этого ночная подмена стала бы постоянной.
    if (text && !text.dataset.dayText) text.dataset.dayText = text.innerHTML;

    const replyTime = quietHoursReplyTime();

    if (!replyTime) {
        label.textContent = t('thanksBadgeLabel');
        value.textContent = t('thanksBadgeValue');
        if (text && text.dataset.dayText) text.innerHTML = text.dataset.dayText;
        return;
    }

    label.textContent = t('thanksBadgeLabelNight');
    value.textContent = t('thanksBadgeValueNight').replace('{time}', replyTime);

    if (text) {
        // Для срочной заявки «свяжемся утром» звучит как отказ — там свой текст.
        const urgent = !!(document.getElementById('leadUrgent') &&
                          document.getElementById('leadUrgent').checked);
        text.textContent = urgent
            ? t('thanksTextNightUrgent')
            : t('thanksTextNight').replace('{time}', replyTime);
    }
}

function openClientLeadForm()  { _modal('clientLeadFormModal',   'flex'); }
function closeClientLeadForm() { _modal('clientLeadFormModal',   'none'); }
function openThankYou()        { applyThankYouBadge();
                                 _modal('thankYouModal',          'flex'); }
function closeThankYou()       { _modal('thankYouModal',          'none'); }
function openMasterThankYou()  { _modal('masterThankYouModal',   'flex'); }
function closeMasterThankYou() { _modal('masterThankYouModal',   'none'); }
function openMasterLeadForm()  { _modal('masterLeadFormModal',   'flex'); }
function closeMasterLeadForm() { _modal('masterLeadFormModal',   'none'); }

function _modal(id, display) {
    const el = document.getElementById(id);
    if (el) el.style.display = display;
    _toggleBodyScrollLock();
}

// Блокировка прокрутки фона, пока открыта хотя бы одна модалка.
// Фиксируем позицию скролла через position:fixed — иначе на мобильных
// фон всё равно «протаскивается» пальцем под окном.
let _savedScrollY = 0;
function _toggleBodyScrollLock() {
    const anyOpen = ['clientLeadFormModal', 'thankYouModal',
                     'masterLeadFormModal', 'masterThankYouModal']
        .some(id => {
            const m = document.getElementById(id);
            return m && m.style.display !== 'none' && m.style.display !== '';
        });
    const body = document.body;
    const locked = body.classList.contains('modal-open');

    if (anyOpen && !locked) {
        _savedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        body.style.top = `-${_savedScrollY}px`;
        body.classList.add('modal-open');
    } else if (!anyOpen && locked) {
        body.classList.remove('modal-open');
        body.style.top = '';
        window.scrollTo(0, _savedScrollY);
    }
}

// ============================================
// 13. КНОПКА «НАВЕРХ» / TELEGRAM FAB
// ============================================

function initScrollToTop() {
    const scrollButton = document.getElementById('scrollToTop');
    if (!scrollButton) return;

    // Кнопка WhatsApp видна СРАЗУ, с первого экрана, а не после прокрутки.
    // Прежде класс visible вешался только при pageYOffset > 300: посетитель,
    // готовый написать сразу, кнопки не видел и уходил. Это главный канал
    // связи — прятать его до скролла нечем оправдать.
    //
    // Слушатель скролла убран совсем, а не оставлен «на всякий случай»:
    // при любом его срабатывании toggle снял бы класс у самого верха
    // страницы, и кнопка моргала бы при возврате наверх.
    scrollButton.classList.add('visible');
}

// ============================================
// 14. ТРЕКИНГ КНОПКИ WHATSAPP
// ============================================

function initWhatsAppButtonTracking() {
    const fab = document.getElementById('scrollToTop');
    if (!fab) return;

    const isMastersPage = window.location.pathname.includes('/masters/');
    const isBatumiPage = /\/batumi(?:\/|$)/i.test(window.location.pathname);
    const lang = window.__FORCE_LANG__ || 'ru';

    // ── Услуга и район лендинга для предзаполненного текста WhatsApp ──
    // Берём из скрытого поля service, а НЕ из URL: на каждом лендинге оно уже
    // заполнено подписью на языке страницы («Сантехника», «Plumbing»,
    // «სანტექნიკა», «Мастер на час — Ваке»), и это ровно то значение, которое
    // уходит в заявке через resolveBotCategory(). Так подпись в WhatsApp
    // гарантированно совпадает с категорией заявки, а переименование slug'ов
    // в адресе текст не ломает.
    //
    // На главных страницах (/ru/, /ru/batumi/) поле ПУСТОЕ — услугу там клиент
    // выбирает сам, поэтому остаётся прежний общий текст по городу.
    const serviceField = document.querySelector('input[name="service"]');
    const serviceValue = serviceField ? (serviceField.value || '').trim() : '';

    // Лендинг района даёт «Мастер на час — Ваке»: делим по тире на услугу и
    // район, чтобы собрать живую фразу вместо сухого перечисления.
    // Тире именно длинное (—), как в разметке лендингов.
    const serviceParts = serviceValue.split('—').map(s => s.trim()).filter(Boolean);
    const svcName = serviceParts[0] || '';
    const svcDistrict = serviceParts[1] || '';

    // Город подписью на языке страницы — для хвоста фразы.
    const cityNames = {
        ru: isBatumiPage ? 'Батуми' : 'Тбилиси',
        en: isBatumiPage ? 'Batumi' : 'Tbilisi',
        ka: isBatumiPage ? 'ბათუმი' : 'თბილისი'
    };

    // Сборщик текста по языку: услуга есть → конкретная фраза, нет → общая.
    // Формы «нужен/нужна» в русском зависят от рода услуги («нужен сантехник»,
    // но «нужна сборка мебели»), поэтому род не угадываем, а строим фразу
    // нейтрально: «Интересует услуга: …» — звучит естественно для любой.
    //
    // ⚠️ Поле service ЛОКАЛИЗОВАНО под язык страницы: на /ru/ там «Сантехника»,
    // на /en/ — «Plumbing», на /ge/ — «სანტექნიკა». Поэтому подставлять его
    // можно ТОЛЬКО в текст того же языка, что и страница. Иначе переключение
    // языка на лету дало бы «I'm interested in: Мастер на час» — английская
    // фраза с русской услугой. Для остальных языков отдаём общий текст:
    // лучше нейтральная фраза целиком, чем смесь двух языков.
    function buildWaText(code) {
        const city = cityNames[code] || cityNames.ru;
        const pageLang = window.__FORCE_LANG__ || 'ru';
        // Услугу подставляем, только если текст на языке страницы.
        const svcUsable = (code === pageLang) ? svcName : '';
        const svcDistrictUsable = (code === pageLang) ? svcDistrict : '';

        if (isMastersPage) {
            return ({
                ru: 'Здравствуйте! Хочу стать партнёром сервиса.',
                en: 'Hello! I want to become a partner.',
                ka: 'გამარჯობა! მინდა გავხდე პარტნიორი.'
            })[code];
        }

        // Главная страница (service пустой) или чужой язык — общий текст.
        if (!svcUsable) {
            return ({
                ru: 'Здравствуйте! Нужен мастер в ' + (isBatumiPage ? 'Батуми' : 'Тбилиси') + '.',
                en: 'Hello! I need a handyman in ' + city + '.',
                ka: 'გამარჯობა! მჭირდება ოსტატი ' + (isBatumiPage ? 'ბათუმში' : 'თბილისში') + '.'
            })[code];
        }

        // Лендинг района: услуга + район + город.
        if (svcDistrictUsable) {
            return ({
                ru: 'Здравствуйте! Интересует услуга: ' + svcUsable + ', район ' + svcDistrictUsable + ' (' + city + ').',
                en: 'Hello! I\'m interested in: ' + svcUsable + ', ' + svcDistrictUsable + ' district (' + city + ').',
                ka: 'გამარჯობა! მაინტერესებს: ' + svcUsable + ', ' + svcDistrictUsable + ' (' + city + ').'
            })[code];
        }

        // Лендинг услуги без района: услуга + город.
        return ({
            ru: 'Здравствуйте! Интересует услуга: ' + svcUsable + ' (' + city + ').',
            en: 'Hello! I\'m interested in: ' + svcUsable + ' (' + city + ').',
            ka: 'გამარჯობა! მაინტერესებს: ' + svcUsable + ' (' + city + ').'
        })[code];
    }

    // Предзаполненный текст для WhatsApp по языку страницы.
    const waTexts = {
        ru: encodeURIComponent(buildWaText('ru')),
        ka: encodeURIComponent(buildWaText('ka')),
        en: encodeURIComponent(buildWaText('en'))
    };
    const waHref = 'https://wa.me/995557645196?text=' + (waTexts[lang] || waTexts.ru);

    // Telegram-бот: на странице мастеров — бот мастеров, иначе клиентский бот по языку
    // страницы (RU/EN/GE). start=site_<lang> — для атрибуции.
    const tgBots = { ru: 'mastera_ru_bot', en: 'mastera_en_bot', ka: 'mastera_ka_bot' };
    const tgBot = isMastersPage ? 'mastera_tbilisi_bot' : (tgBots[lang] || tgBots.ru);
    const tgHref = 'https://t.me/' + tgBot + '?start=site_' + lang;

    // Подписи (доступность/тултипы) по языку.
    const labels = ({
        ru: { open: 'Связаться с нами', wa: 'Написать в WhatsApp', tg: 'Написать в Telegram' },
        en: { open: 'Contact us',       wa: 'Message on WhatsApp', tg: 'Message on Telegram' },
        ka: { open: 'დაგვიკავშირდით',   wa: 'მოგვწერეთ WhatsApp-ში', tg: 'მოგვწერეთ Telegram-ში' }
    })[lang] || { open: 'Связаться с нами', wa: 'WhatsApp', tg: 'Telegram' };

    // FAB больше не прямая ссылка, а переключатель меню с нейтральной «чат»-иконкой.
    fab.removeAttribute('href');
    fab.removeAttribute('target');
    fab.classList.add('contact-fab');
    fab.setAttribute('role', 'button');
    fab.setAttribute('tabindex', '0');
    fab.setAttribute('aria-label', labels.open);
    fab.setAttribute('aria-expanded', 'false');
    // FAB морфит иконку между двумя логотипами (WhatsApp ↔ Telegram). Смена —
    // плавный «wipe»: новый слой прокрашивается по диагонали слева направо вслед
    // за бликом. Стартует с WhatsApp (передний слой — is-front).
    fab.innerHTML =
        '<span class="cf-morph">' +
            '<span class="cf-layer cf-layer--wa is-front" aria-hidden="true"><img src="/image/whatsapp-icon.png" alt=""></span>' +
            '<span class="cf-layer cf-layer--tg" aria-hidden="true"><img src="/image/telegram-icon.png" alt=""></span>' +
            '<span class="cf-shine" aria-hidden="true"></span>' +
        '</span>';

    // Две опции живут отдельным контейнером у <body> — у FAB overflow:hidden, иначе их обрежет.
    const menu = document.createElement('div');
    menu.className = 'contact-fab-menu';
    menu.innerHTML =
        '<a class="contact-opt contact-opt--tg" href="' + tgHref + '" target="_blank" rel="noopener" ' +
        'aria-label="' + labels.tg + '" title="' + labels.tg + '">' +
        '<img src="/image/telegram-icon.png" alt="Telegram" loading="lazy"></a>' +
        '<a class="contact-opt contact-opt--wa" href="' + waHref + '" target="_blank" rel="noopener" ' +
        'aria-label="' + labels.wa + '" title="' + labels.wa + '">' +
        '<img src="/image/whatsapp-icon.png" alt="WhatsApp" loading="lazy"></a>';
    document.body.appendChild(menu);

    // Ротация слоёв FAB: блик и смена иконки играют всегда, независимо от
    // системной настройки prefers-reduced-motion.
    const cfLayers = Array.from(fab.querySelectorAll('.cf-layer'));
    const cfShine = fab.querySelector('.cf-shine');
    let cfIndex = 0;
    let cfTimer = null;
    // Перезапуск CSS-анимации: снять класс, форсировать reflow, навесить снова.
    const cfRestart = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
    const cfMorph = () => {
        const next = (cfIndex + 1) % cfLayers.length;
        cfLayers[cfIndex].classList.remove('is-front');
        cfLayers[next].classList.add('is-front');
        // Блик и прокраска — на одном таймере, поэтому всегда совпадают.
        // Играем всегда, независимо от prefers-reduced-motion.
        cfRestart(cfShine, 'go');
        cfRestart(cfLayers[next], 'cf-wipe');
        cfIndex = next;
    };
    const cfStart = () => { if (!cfTimer && cfLayers.length > 1) cfTimer = setInterval(cfMorph, 3200); };
    const cfStop = () => { if (cfTimer) { clearInterval(cfTimer); cfTimer = null; } };
    cfStart();

    let isOpen = false;
    const setOpen = (v) => {
        isOpen = v;
        fab.classList.toggle('open', v);
        menu.classList.toggle('open', v);
        fab.setAttribute('aria-expanded', String(v));
        // Пока меню открыто — иконка стабильна; закрыли — снова играет.
        if (v) cfStop(); else cfStart();
    };

    // Открытие/закрытие меню по клику на FAB (+ событие аналитики при открытии).
    fab.addEventListener('click', function (e) {
        e.preventDefault();
        setOpen(!isOpen);
        if (isOpen && typeof gtag === 'function') {
            gtag('event', 'contact_open', { event_category: 'engagement', event_label: 'contact_fab' });
        }
    });
    // Клавиатурная доступность: Enter/Space открывает, Esc закрывает.
    fab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fab.click(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    // Закрытие по клику вне меню и при прокрутке к верху (FAB скрывается).
    document.addEventListener('click', function (e) {
        if (isOpen && !menu.contains(e.target) && !fab.contains(e.target)) setOpen(false);
    });
    window.addEventListener('scroll', function () { if (window.pageYOffset <= 300) setOpen(false); });

    // Клик по опции: при наличии gtag шлём событие и открываем канал с небольшой задержкой.
    const bindOption = (selector, method, href) => {
        const el = menu.querySelector(selector);
        if (!el) return;
        el.addEventListener('click', function (e) {
            setOpen(false);
            if (typeof gtag !== 'function') return; // нет аналитики — обычный переход по ссылке
            e.preventDefault();
            gtag('event', method + '_click', {
                event_category: 'engagement',
                event_label: method + '_fab',
                method: method
            });
            setTimeout(function () { window.open(href, '_blank', 'noopener'); }, 300);
        });
    };
    bindOption('.contact-opt--wa', 'whatsapp', waHref);
    bindOption('.contact-opt--tg', 'telegram', tgHref);
}


// ============================================
// АКТУАЛЬНЫЙ EMAIL И МОБИЛЬНЫЙ ФУТЕР
// ============================================
function initFooter() {
    document.querySelectorAll('.footer-text').forEach((footer) => {
        // Десктоп не трогаем вообще.
        if (window.innerWidth > 768) return;

        // Сохраняем исходные элементы до перестройки DOM.
        const mail = footer.querySelector('a[href^="mailto:"]');
        const phone = footer.querySelector('a[href^="tel:"]');
        const telegram = footer.querySelector('a[href*="t.me/"]');
        const facebook = footer.querySelector('a[href*="facebook.com"]');
        const brand = footer.querySelector('strong');
        const oldCopyright = footer.querySelector('.footer-copyright-mobile');

        // Текст после названия бренда содержит описание сервиса.
        // Берём его из исходной разметки до очистки футера.
        let urgentText = '';
        if (brand && brand.nextSibling && brand.nextSibling.nodeType === Node.TEXT_NODE) {
            urgentText = brand.nextSibling.nodeValue
                .replace(/^\s*•\s*/, '')
                .trim();
        }

        // Если футер уже был обработан старой версией скрипта, восстанавливаем
        // почтовую ссылку из уже созданного контейнера.
        const existingMail = mail || footer.querySelector('.footer-email-mobile a[href^="mailto:"]');
        const email = existingMail || document.createElement('a');
        email.href = 'mailto:info@mastera.ge';
        email.textContent = 'info@mastera.ge';
        email.className = 'footer-link';

        // Берём название бренда из исходного <strong>. Если старый запуск уже
        // удалил его, используем существующий copyright как резерв.
        const copyrightStrong = brand
            ? brand.cloneNode(true)
            : oldCopyright?.querySelector('strong')?.cloneNode(true);

        // Нормализуем футер целиком. Это делает функцию идемпотентной:
        // повторный запуск никогда не создаёт дубликаты или пустые строки.
        footer.replaceChildren();

        const appendBreak = () => footer.appendChild(document.createElement('br'));

        // 1. Срочный выезд
        if (urgentText) {
            footer.appendChild(document.createTextNode(urgentText));
        }
        appendBreak();

        // 2. Телефон
        if (phone) {
            footer.appendChild(document.createTextNode('📞 '));
            footer.appendChild(phone);
        }
        appendBreak();

        // 3. Telegram + Facebook — одна строка, без «•»
        if (telegram) {
            footer.appendChild(document.createTextNode('💬 '));
            footer.appendChild(telegram);
        }
        if (facebook) {
            footer.appendChild(document.createTextNode('  '));
            footer.appendChild(document.createTextNode('📘 '));
            footer.appendChild(facebook);
        }
        appendBreak();

        // 4. Email — отдельная строка с иконкой
        const emailLine = document.createElement('span');
        emailLine.className = 'footer-email-mobile';
        emailLine.appendChild(document.createTextNode('✉️ '));
        emailLine.appendChild(email);
        footer.appendChild(emailLine);
        appendBreak();

        // 5. Copyright — всегда последним
        const copyrightLine = document.createElement('span');
        copyrightLine.className = 'footer-copyright-mobile';
        copyrightLine.appendChild(document.createTextNode('© 2026 '));
        if (copyrightStrong) {
            copyrightLine.appendChild(copyrightStrong);
        } else {
            copyrightLine.appendChild(document.createTextNode('Мастера Грузии'));
        }
        footer.appendChild(copyrightLine);

        footer.dataset.footerFixed = '1';
    });
}

document.addEventListener('DOMContentLoaded', initFooter);
