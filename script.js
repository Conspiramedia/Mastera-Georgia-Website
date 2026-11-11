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
        // Иностранный номер: проверяем только правдоподобность длины (E.164).
        // Код страны не навязываем — у приезжих клиентов номер домашней страны.
        phoneForeignInvalid: 'Проверьте номер телефона: укажите его с кодом страны, например +7 916 123 45 67',
        telegramInvalid:     'Пожалуйста, введите корректный Telegram username (например: @username) или номер телефона',
        contactRequired:     'Пожалуйста, заполните хотя бы один из контактов: Telegram или WhatsApp',
        submitError:         'Ошибка при отправке. Попробуйте ещё раз.',
        // Причины отказа бота, понятные человеку. Во всех случаях заявка уже
        // продублирована на почту, поэтому про потерю не говорим.
        submitContactInText: 'Уберите телефон и ссылки из описания задачи — контакты вы уже указали в полях выше. Заявка принята, мы свяжемся с вами.',
        submitTooMany:       'Вы отправили несколько заявок подряд. Заявка уже у нас — мы свяжемся с вами в ближайшее время.',
        submitTooLong:       'Описание слишком длинное — опишите задачу короче, остальное расскажете мастеру.',
        submitProfanity:     'Пожалуйста, перефразируйте описание задачи.',
        // Надпись на кнопке, пока заявка уходит. Отправка с фото занимает
        // 4–10 секунд, и без обратной связи человек жал кнопку повторно,
        // думая, что промахнулся.
        submitSending:       'Отправляем…',
        // Быстрая форма первого экрана: человек оставляет только контакт.
        heroConsent:         'Пожалуйста, подтвердите согласие на обработку данных',
        heroContactEmpty:    'Пожалуйста, укажите номер WhatsApp',
        photoLabel:          '📷 Фото проблемы (по желанию, до 3)',
        photoAdd:            'Прикрепить фото',
        photoTooMany:        'Можно прикрепить не более 3 фото',
        photoBadType:        'Можно прикреплять только изображения',
        photoTooBig:         'Файл слишком большой (до 10 МБ)',
        photoRemove:         'Удалить',
        urgentLabel:         '🚨 Срочный заказ',
        addressInDescription: 'Укажите в описании только суть задачи, без адреса. Точный адрес вы сообщите мастеру лично, когда он возьмёт заявку.',
        // ⚠️ Коротко — по ширине поля, а не «на глаз». Прежние 60 символов
        // обрезались и на десктопе (поле 378px в правой колонке модалки),
        // и тем более на мобильном, где остаётся всего 264px под текст.
        // Замеряно в браузере: этот вариант — 191px, влезает на обоих
        // размерах с запасом. Смысл сохранён: перечислено, что принимаем.
        // Правя текст, проверяй ширину — подсказка, которой не видно
        // целиком, не подсказывает ничего.
        districtOtherPlaceholder:  'Район, ориентир, метро',
        districtOtherRequired:     'Пожалуйста, укажите район или ближайший ориентир — без этого мастер не поймёт, куда ехать',
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
        a11yDistrictOther:         'Уточните район или ориентир',
        // Бейдж в окне благодарности. До этого текст был зашит в HTML каждой
        // из 105 страниц и успел разъехаться: на лендингах «15–60 минут», на
        // главных «30–60». Теперь источник один — словарь, HTML не трогаем.
        // Окно благодарности. Собирается в JS (см. buildThankYouModal):
        // в разметке страниц его нет, поэтому до 08.11.2026 клиент
        // основной формы не видел подтверждения вообще.
        thanksTitle:               'Заявка принята!',
        thanksText:                'Заявка уже у мастеров. Свяжемся с вами, чтобы уточнить детали и назвать цену.',
        thanksTextHero:            'Мы получили ваш номер. Напишем в WhatsApp, уточним задачу и назовём цену.',
        // Ночной вариант для быстрой формы: обещать WhatsApp «в течение часа»
        // в 02:00 — значит не сдержать слово. Отдельный текст нужен потому,
        // что общий ночной говорит «свяжемся», а здесь у нас только номер
        // WhatsApp — человек ждал бы звонка.
        thanksTextHeroNight:       'Мы получили ваш номер. Напишем в WhatsApp с {time} — или раньше, если мастер освободится ночью.',
        thanksClose:               'Понятно',
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
        phoneForeignInvalid: 'შეამოწმეთ ტელეფონის ნომერი: მიუთითეთ ქვეყნის კოდით, მაგალითად +7 916 123 45 67',
        telegramInvalid:     'გთხოვთ, შეიყვანოთ სწორი Telegram მომხმარებლის სახელი (მაგ: @username) ან ტელეფონის ნომერი',
        contactRequired:     'გთხოვთ, შეავსოთ ერთ-ერთი საკონტაქტო ველი: Telegram ან WhatsApp',
        submitError:         'გაგზავნისას მოხდა შეცდომა. სცადეთ კიდევ ერთხელ.',
        submitContactInText: 'წაშალეთ ტელეფონი და ბმულები დავალების აღწერიდან — კონტაქტები უკვე მიუთითეთ ზემოთ. განაცხადი მიღებულია, დაგიკავშირდებით.',
        submitTooMany:       'თქვენ რამდენიმე განაცხადი გააგზავნეთ ზედიზედ. განაცხადი უკვე მიღებულია — მალე დაგიკავშირდებით.',
        submitTooLong:       'აღწერა ძალიან გრძელია — აღწერეთ მოკლედ, დანარჩენს ხელოსანს უამბობთ.',
        submitProfanity:     'გთხოვთ, გადააფორმულიროთ დავალების აღწერა.',
        submitSending:       'იგზავნება…',
        heroConsent:         'გთხოვთ, დაადასტუროთ თანხმობა მონაცემთა დამუშავებაზე',
        heroContactEmpty:    'გთხოვთ, მიუთითოთ WhatsApp-ის ნომერი',
        photoLabel:          '📷 პრობლემის ფოტო (სურვილისამებრ, 3-მდე)',
        photoAdd:            'ფოტოს მიმაგრება',
        photoTooMany:        'შეგიძლიათ მიამაგროთ მაქსიმუმ 3 ფოტო',
        photoBadType:        'შესაძლებელია მხოლოდ სურათების მიმაგრება',
        photoTooBig:         'ფაილი ძალიან დიდია (10 მბ-მდე)',
        photoRemove:         'წაშლა',
        urgentLabel:         '🚨 სასწრაფო შეკვეთა',
        addressInDescription: 'აღწერაში მიუთითეთ მხოლოდ დავალება, მისამართის გარეშე. ზუსტი მისამართი უთხარით ხელოსნას, როდესაც იგი აიღებს განაცხადს.',
        districtOtherPlaceholder:  'რაიონი, ორიენტირი, მეტრო',
        districtOtherRequired:     'გთხოვთ, მიუთითოთ რაიონი ან უახლოესი ორიენტირი — ამის გარეშე ხელოსანი ვერ გაიგებს, სად უნდა მივიდეს',
        // Ველების სახელები სკრინრიდერისთვის (aria-label) — ეკრანზე არ ჩანს.
        a11yName:                  'თქვენი სახელი',
        a11yPhone:                 'ტელეფონის ნომერი',
        a11yTelegram:              'Telegram',
        a11yWhatsapp:              'WhatsApp',
        a11yDistrict:              'რაიონი',
        a11yService:               'სამუშაოს კატეგორია',
        a11yMessage:               'დავალების აღწერა',
        a11yPhotos:                'დავალების ფოტოები (3-მდე)',
        a11yDistrictOther:         'დააზუსტეთ რაიონი ან ორიენტირი',
        thanksTitle:               'განაცხადი მიღებულია!',
        thanksText:                'განაცხადი უკვე ხელოსნებთანაა. დაგიკავშირდებით დეტალების დასაზუსტებლად და ფასის დასახელებლად.',
        thanksTextHero:            'მივიღეთ თქვენი ნომერი. მოგწერთ WhatsApp-ში, დავაზუსტებთ ამოცანას და დავასახელებთ ფასს.',
        thanksTextHeroNight:       'მივიღეთ თქვენი ნომერი. მოგწერთ WhatsApp-ში {time}-დან — ან უფრო ადრე, თუ ხელოსანი ღამით გათავისუფლდება.',
        thanksClose:               'გასაგებია',
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
        phoneForeignInvalid: 'Please check the phone number: include the country code, for example +7 916 123 45 67',
        telegramInvalid:     'Please enter a valid Telegram username (e.g. @username) or phone number',
        contactRequired:     'Please fill in at least one contact field: Telegram or WhatsApp',
        submitError:         'An error occurred while submitting. Please try again.',
        submitContactInText: 'Please remove phone numbers and links from the task description — you have already provided your contacts above. The request has been received, we will get in touch.',
        submitTooMany:       'You have sent several requests in a row. We already have your request and will contact you shortly.',
        submitTooLong:       'The description is too long — keep it short, you can tell the rest to the specialist.',
        submitProfanity:     'Please rephrase the task description.',
        submitSending:       'Sending…',
        heroConsent:         'Please confirm your consent to data processing',
        heroContactEmpty:    'Please enter your WhatsApp number',
        photoLabel:          '📷 Photo of the problem (optional, up to 3)',
        photoAdd:            'Attach photo',
        photoTooMany:        'You can attach up to 3 photos',
        photoBadType:        'Only images can be attached',
        photoTooBig:         'File is too large (up to 10 MB)',
        photoRemove:         'Remove',
        urgentLabel:         '🚨 Urgent order',
        addressInDescription: 'Describe only the task, without the address. Share the exact address with the specialist directly once they take the request.',
        districtOtherPlaceholder:  'District, landmark, metro',
        districtOtherRequired:     'Please specify the district or a nearby landmark — without it the specialist will not know where to go',
        // Field names for screen readers (aria-label) — not visible on screen.
        a11yName:                  'Your name',
        a11yPhone:                 'Phone number',
        a11yTelegram:              'Telegram',
        a11yWhatsapp:              'WhatsApp',
        a11yDistrict:              'District',
        a11yService:               'Service category',
        a11yMessage:               'Task description',
        a11yPhotos:                'Task photos (up to 3)',
        a11yDistrictOther:         'Specify the district or a landmark',
        thanksTitle:               'Request received!',
        thanksText:                'Your request is already with our specialists. We will contact you to confirm the details and name the price.',
        thanksTextHero:            'We have your number. We will message you on WhatsApp, confirm the task and name the price.',
        thanksTextHeroNight:       'We have your number. We will message you on WhatsApp from {time} — or sooner, if a specialist is free tonight.',
        thanksClose:               'Got it',
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
const MASTERA_VERSION = '345';
window.MASTERA_VERSION = MASTERA_VERSION;

// Личный чат владельца сервиса: сюда ведут кнопки «Написать в Telegram»
// — и CTA на главных, и нижняя панель связи. Это живой диалог, а не бот.
// ⚠️ Не путать со ссылкой «Telegram-бот» в подвале: та ведёт на
// клиентского бота по языку страницы и задана прямо в разметке.
const TELEGRAM_CHAT_URL = 'https://t.me/job_kot';

// Зеркало is_valid_fio в боте (validators.py): там имя проверяется isalpha(),
// и цифры отклоняются. Без проверки здесь мусорное имя уходит в анкете мастера
// в бота, тот её браковал — и мастер вводил заново всё, что заполнил на сайте.
const NAME_PATTERN = /^[\p{L}]{2,}(?:[\s-][\p{L}]{2,})*$/u;

// Тот же смысл для атрибута pattern: браузер компилирует его БЕЗ флага 'u',
// и \p{L} там не работает как класс букв — проверка пропускала бы даже цифры.
// Диапазоны: латиница, кириллица, грузинский (мхедрули).
//
// ⚠️ Обе константы объявлены ЗДЕСЬ, в начале файла, а не рядом с
// validateName ниже. initNamePatternAttr() вызывается из initModalForms()
// по DOMContentLoaded, а тег <script> стоит с defer: документ к этому
// моменту бывает уже разобран не до конца, и обращение к const из
// временной мёртвой зоны падало с «Cannot access 'NAME_PATTERN_ATTR'
// before initialization» — маска имени не проставлялась ни на одной
// странице. const не поднимается, поэтому объявление обязано быть выше
// любого вызова.
const NAME_PATTERN_ATTR =
    '[A-Za-zÀ-ÖØ-öø-ÿĀ-žА-Яа-яЁёა-ჰ]{2,}' +
    '(?:[ \\-][A-Za-zÀ-ÖØ-öø-ÿĀ-žА-Яа-яЁёა-ჰ]{2,})*[ ]*';

// Соответствие «поле формы → ключ подписи в i18n».
// Ключи селекторов намеренно по name/типу, а не по id: id есть не у всех
// полей, а разметка форм одинакова на всех страницах.
// ⚠️ Здесь же, в начале файла, и по той же причине, что NAME_PATTERN_ATTR
// выше: applyFieldLabels() вызывается по DOMContentLoaded, то есть раньше,
// чем разбор файла доходит до середины.
const A11Y_FIELD_LABELS = [
    ['input[name="name"]',        'a11yName'],
    ['input[name="phone"]',       'a11yPhone'],
    ['input[name="telegram"]',    'a11yTelegram'],
    ['input[name="whatsapp"]',    'a11yWhatsapp'],
    ['select[name="district"]',   'a11yDistrict'],
    ['select[name="service"]',    'a11yService'],
    ['textarea[name="message"]',  'a11yMessage'],
    ['input[name="district_other"]',  'a11yDistrictOther'],
    ['.lead-photo-input',         'a11yPhotos'],
];

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
    initSmoothScroll();
    initModalForms();
    initClientLeadFormTracking();
    initHeroQuickForm();
    initClientPhotoUpload();
    initClientDistrictOptions();
    initClientUrgentOption();
    applyFieldLabels();
});

/* Подписи полей — ещё раз после полной загрузки.
   ⚠️ Окно заявки и нижняя панель контактов собираются в
   redesign.js по событию load, то есть ПОЗЖЕ обработчика выше:
   на DOMContentLoaded их полей в документе ещё нет, и первый
   вызов их не застаёт. Повторный проход подписывает и их.
   Повтор безопасен: applyFieldLabels только проставляет
   aria-label и ничего не накапливает.

   ⚠️ Раньше applyFieldLabels вызывался ТОЛЬКО из setLanguage,
   а тот остался от старого сайта с переключением языка на лету
   и в редизайне не вызывается никогда (у каждого языка свой
   адрес). Из-за этого подписи не проставлялись вовсе, и аудит
   доступности показывал 9 полей без подписи: телефон, имя,
   Telegram, WhatsApp, район, услуга и описание задачи.
   Скринридер объявлял их как «поле ввода, пусто», а <select> —
   как «список, свёрнут», не называя, что именно выбирают.

   ⚠️ Сама подписка на load живёт В КОНЦЕ ФАЙЛА, а не здесь.
   Тег <script> стоит с defer, поэтому документ к моменту разбора
   нередко уже 'complete', и ветка с немедленным вызовом
   срабатывала прямо на этой строке — когда const A11Y_FIELD_LABELS
   (объявлен ниже) ещё в временной мёртвой зоне. В консоли падало
   «Cannot access 'A11Y_FIELD_LABELS' before initialization», и
   подписи не проставлялись ни разу. const не поднимается, поэтому
   вызов обязан стоять после объявления. */
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

            /* ⚠️ Кнопки-призывы на #lead открывают ОКНО заявки
               (обработчик в redesign.js), прокручивать к секции их
               не нужно. Слушатель здесь висит на самом элементе, а
               тот, что открывает окно, — делегированный на document,
               поэтому срабатываем мы первыми: страница уезжала вниз,
               и окно открывалось уже поверх прокрученной страницы.
               Видно это было не сразу — окно ставит body в
               overflow:hidden и обрывает плавную прокрутку на
               полпути, но при «уменьшить движение» (scroll-behavior:
               auto) она отрабатывает мгновенно и целиком, а после
               закрытия окна человек оказывается не там, где кликал.

               Условие зеркалит redesign.js: оглавление лендинга
               (.v-jumpbar) и ссылки подвала — это навигация по
               странице, от них ждут именно прокрутки. Меняя список
               исключений там, правь и здесь, иначе кнопка снова
               начнёт делать два действия сразу. */
            if (href === '#lead' &&
                !this.closest('.v-jumpbar') &&
                !this.closest('.site-footer')) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
// Соответствие «поле формы → ключ подписи в i18n».
// Ключи селекторов намеренно по name/типу, а не по id: id есть не у всех
// полей, а разметка форм одинакова на всех 108 страницах.
/* A11Y_FIELD_LABELS объявлен в начале файла —
   см. комментарий там о временной мёртвой зоне при defer. */

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
            // Окно заявки закрывает по ESC само (buildLeadModal в
            // redesign.js) — оно управляется hidden/is-open, а не
            // display, и отсюда его гасить нечем.
            closeThankYou();
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
    const src = (raw || '').trimStart();
    let digits = (raw || '').replace(/\D/g, '');
    if (!digits) return '';

    // Иностранный номер НЕ переделываем в грузинский. Клиент ставит «+» и свой
    // код страны («+7 916 …»), а прежняя маска сносила его и склеивала
    // «995» + цифры: российский +79161234567 превращался в +995 791 612 345 —
    // существующий по виду, но чужой номер. Заявка уходила мастеру с ним, и
    // дозвониться было нельзя. Клиентка из Тбилиси (01.11.2026) не смогла
    // оставить заявку именно поэтому.
    //
    // Признак «номер не грузинский» — явный «+» с кодом, отличным от 995.
    // Без «+» поведение прежнее: короткий местный набор («555123456») по-прежнему
    // получает код страны сам.
    if (src.startsWith('+') && !digits.startsWith('995')) {
        return '+' + digits.substring(0, 15);
    }

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
    if (!digits) return '';
    // Обрезка «код страны + 9 цифр» верна только для Грузии. Для иностранного
    // номера она калечила контакт: немецкий «+49 151 23456789» (13 цифр)
    // обрезался до «+49 151 2345 6» — по такому номеру не дозвониться.
    // Для не-грузинских держим общий потолок E.164 (15 цифр), как в
    // normalizeWhatsappPhone и normalize_whatsapp бота.
    const limit = digits.startsWith('995') ? 3 + PHONE_SUBSCRIBER_DIGITS : 15;
    return '+' + digits.substring(0, limit);
}

// Форматирование телефонных номеров
function initPhoneFormatting() {
    const phoneInputs = document.querySelectorAll('#leadPhone');
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
        // Жёсткий pattern вешаем ТОЛЬКО на анкету мастера: мастер работает в
        // Грузии, его рабочий номер местный. В клиентской форме (#leadPhone)
        // номер необязателен и может быть любой страны — нативная проверка
        // браузера там блокировала бы отправку у приезжего клиента ещё до
        // нашей валидации, без внятного объяснения.
        const isClientLead = input.id === 'leadPhone';
        if (!isClientLead) input.setAttribute('pattern', PHONE_PATTERN_ATTR);

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
            // Каретку к хвосту двигаем только когда номер реально грузинский:
            // у иностранного «+995» в начале нет, и прыжок курсора сбивал ввод.
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
            // В клиентской форме префикс НЕ подставляем: номер необязателен и
            // может быть иностранным. Автоподстановка «+995» заставляла клиента
            // с чужим номером сначала стирать префикс, а оставленный в поле
            // «+995» выглядел как начатый ввод.
            if (!isClientLead && e.target.value === '') e.target.value = '+995';
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
/* NAME_PATTERN и NAME_PATTERN_ATTR объявлены в начале файла —
   см. комментарий там о временной мёртвой зоне при defer. */

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
    document.querySelectorAll('#clientLeadForm input[name="name"]')
        .forEach(function (input) {
            if (input.getAttribute('pattern')) return;   // уже задано в разметке
            input.setAttribute('pattern', NAME_PATTERN_ATTR);
            input.setAttribute('title', t('nameInvalid'));
        });
}

function validatePhone(phoneInput) {
    if (!phoneInput) return true;
    const digits = phoneInput.value.replace(/\D/g, '');

    // Послабления ниже — ТОЛЬКО для клиентской заявки (#leadPhone). Мастер
    // работает в Грузии, его рабочий номер местный и обязателен, поэтому для
    // анкеты мастера правила остаются прежними: +995 и код оператора.
    const isClientLead = phoneInput.id === 'leadPhone';

    // Пустой телефон — это НЕ ошибка. Обязателен контакт, а не конкретно номер:
    // форма требует Telegram или WhatsApp (contactRequired), и именно по ним
    // сервис связывается с клиентом. Прежде validatePhone вызывался всегда и на
    // пустом поле собирал «+», который не проходил PHONE_PATTERN, — человек
    // получал «введите корректный грузинский номер» и не мог отправить заявку
    // вообще, даже заполнив Telegram.
    if (!digits && isClientLead) return true;

    // Иностранный номер принимаем как есть. Клиенты сервиса — часто приезжие,
    // и у них российский/украинский/европейский номер, на который привязан
    // мессенджер. Требовать +995 значило отказывать им в заявке: клиентка
    // 01.11.2026 из-за этого ушла писать в Telegram вручную.
    // Проверяем лишь правдоподобность длины по E.164 (10–15 цифр),
    // как это делает normalize_whatsapp в боте.
    const isGeorgian = digits.startsWith('995');
    if (!isGeorgian && isClientLead) {
        if (digits.length < 10 || digits.length > 15) {
            alert(t('phoneForeignInvalid'));
            phoneInput.focus();
            return false;
        }
        return true;
    }

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
      hintRu: 'Дидубе-Чугурети, Автовокзал, Светицховели',
      hintEn: 'Didube-Chughureti, Bus Station, Svetitskhoveli',
      hintKa: 'დიდუბე-ჩუღურეთი, ავტოსადგური, სვეტიცხოველი' },
    { slug: 'Chugureti',   ru: 'Чугурети',    en: 'Chughureti',  ka: 'ჩუღურეთი',
      hintRu: 'Грмагеле, Авлабари, Метехи',
      hintEn: 'Grmaghele, Avlabari, Metekhi',
      hintKa: 'გრმაღელე, ავლაბარი, მეტეხი' },
    { slug: 'Isani',       ru: 'Исани',       en: 'Isani',       ka: 'ისანი',
      hintRu: 'Навтлуги, Вазисубани, Мтацминда-Исани',
      hintEn: 'Navtlugi, Vazisubani, Mtatsminda-Isani',
      hintKa: 'ნავთლუღი, ვაზისუბანი, მთაწმინდა-ისანი' },
    { slug: 'Samgori',     ru: 'Самгори',     en: 'Samgori',     ka: 'სამგორი',
      hintRu: 'Восток, Лило, Дампало',
      hintEn: 'Vostok, Lilo, Dampalo',
      hintKa: 'აღმოსავლეთი, ლილო, დამპალო' },
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
      hintKa: 'ფონიჭალა, ლოჭინი, აეროპორტი' },
    /* ⚠️ Пять районов ниже добавлены 08.11.2026. Дигоми,
       Варкетили и Ортачала до этого значились МЕСТНОСТЯМИ в
       подсказках Дидубе, Самгори и Исани — оттуда они убраны
       в этой же правке. Оставить их в обоих местах нельзя:
       одно место предлагалось бы двумя пунктами списка, и
       клиент выбирал бы наугад, а район уходит мастеру в
       карточке заявки.

       ⚠️ В выпадающем меню шапки этих районов НЕТ намеренно
       (решение владельца): меню строится по DISTRICT_PAGES в
       redesign.js, куда их не вносим, пока нет своих страниц.
       Кнопка «Все районы» ведёт в блок «География», где они
       есть. Появятся страницы — добавить строки туда. */
    { slug: 'Digomi',      ru: 'Дигоми',      en: 'Digomi',      ka: 'დიღომი',
      hintRu: 'Дигоми, Вашлиджвари, Третий массив',
      hintEn: 'Digomi, Vashlijvari, Third Massif',
      hintKa: 'დიღომი, ვაშლიჯვარი, მესამე მასივი' },
    { slug: 'Varketili',   ru: 'Варкетили',   en: 'Varketili',   ka: 'ვარკეთილი',
      hintRu: 'Варкетили 1-4, Явнана, Гарекахети',
      hintEn: 'Varketili 1-4, Iavnana, Garekakheti',
      hintKa: 'ვარკეთილი 1-4, იავნანა, გარეკახეთი' },
    { slug: 'Mukhiani',    ru: 'Мухиани',     en: 'Mukhiani',    ka: 'მუხიანი',
      hintRu: 'Мухиани, Санзона, Квемо Мухиани',
      hintEn: 'Mukhiani, Sanzona, Kvemo Mukhiani',
      hintKa: 'მუხიანი, სანზონა, ქვემო მუხიანი' },
    { slug: 'Avchala',     ru: 'Авчала',      en: 'Avchala',     ka: 'ავჭალა',
      hintRu: 'Авчала, Земо Авчала, Глдани-Нахаловка',
      hintEn: 'Avchala, Zemo Avchala, Gldani-Nakhalovka',
      hintKa: 'ავჭალა, ზემო ავჭალა, გლდანი-ნახალოვკა' },
    { slug: 'Ortachala',   ru: 'Ортачала',    en: 'Ortachala',   ka: 'ორთაჭალა',
      hintRu: 'Ортачала, Абанотубани, Нижний Вера',
      hintEn: 'Ortachala, Abanotubani, Lower Vera',
      hintKa: 'ორთაჭალა, აბანოთუბანი, ქვემო ვერა' }
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

// ⚠️ Отдаём справочник наружу. script.js — не модуль и не IIFE, но
// объявления на верхнем уровне сделаны через const: у таких привязок
// область видимости — сам скрипт, и свойства window они НЕ создают
// (в отличие от var). Без этой строки redesign.js видел бы
// window.MASTERA_CITIES как undefined, молча не строил бы меню районов,
// и пункт «Районы» остался бы обычной ссылкой — ошибка тихая.
//
// Передаём именно CITIES, а не два массива по отдельности: в нём уже
// лежит связка «город → его районы», а меню шапки выбирает список по
// городу страницы. Копии списка не делаем — единый источник районов
// остаётся здесь (правило «один список районов» в CLAUDE.md).
window.MASTERA_CITIES = CITIES;

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
    var byDistrict = PAGE_DISTRICT_SLUG ? cityFromDistrictSlug(PAGE_DISTRICT_SLUG) : '';
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

// Город по slug района. Районы Тбилиси и Батуми НЕ пересекаются
// (проверено в config.yaml бота), поэтому суффиксы вида StariGradNS, как в
// Сербии, здесь не нужны — slug однозначно определяет город.
// '' означает «город неизвестен» — вызывающий решает, что делать дальше.
function cityFromDistrictSlug(slug) {
    if (!slug || slug === 'All') return '';   // «все районы» без города — город неизвестен
    if (slug === 'AllTB') return 'Тбилиси';
    if (slug === 'AllBA') return 'Батуми';
    var found = CITIES.find(function (c) {
        return c.districts.some(function (d) { return d.slug === slug; });
    });
    return found ? found.value : '';
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
        // Стиралка и посудомойка — ДО «Ремонта»: подпись «Ремонт стиральных
        // машин» содержит «ремонт», а работа это сантехническая (подключение
        // к воде и канализации), и прайс на неё лежит в «Сантехнике».
        [['стиральн', 'посудомоеч', 'washing machine', 'dishwasher',
          'სარეცხი მანქან', 'ჭურჭლის სარეცხ'], 'Сантехника'],
        // Кондиционеры и двери — ДО «Ремонта» по той же причине: «Ремонт
        // кондиционеров» и «Ремонт дверей» иначе уехали бы в бытовой ремонт
        // квартир. Обе работы ведёт категория «Ремонт», но правило должно
        // сработать на своём слове, а не на широком «ремонт».
        [['кондиционер', 'сплит-систем', 'air conditioner', 'conditioner',
          'კონდიციონერ'], 'Ремонт'],
        // Маркеры намеренно длинные и однозначные. Короткие корни здесь
        // НЕЛЬЗЯ: «замк» ловит «замкнуло проводку» (электрика), 'lock' —
        // block/clock/«blocked drain» (засор, сантехника), 'კარ' — 'კარადა'
        // (шкаф, мебель). Проверено на списке обиходных слов.
        [['двер', 'дверн', 'door', 'дверного замка', 'door lock',
          'კარის'], 'Ремонт'],
        // Бойлеры и водонагреватели — «Сантехника»: работа идёт по
        // трубам и воде, и прайс на неё лежит там же.
        // ⚠️ Правило стоит ДО «Ремонта» и ДО «мастера на час»:
        // подпись «Ремонт и установка бойлеров» содержит и «ремонт»,
        // и «установ» — без этой строки заявка уехала бы в бытовой
        // ремонт квартир или к мастеру на час, мимо сантехников.
        [['бойлер', 'водонагреват', 'boiler', 'water heater',
          'ბოილერ', 'წყალგამაცხელებელ'], 'Сантехника'],
        // Wi-Fi, роутеры и домашняя сеть — «Компьютерная помощь».
        // ⚠️ Тоже ДО «мастера на час»: «Настройка Wi-Fi» иначе
        // поймалась бы широким фолбэком. Маркер 'wi-fi' пишем и
        // без дефиса: в заявках встречается и «вайфай», и «wifi».
        [['wi-fi', 'wifi', 'вай-фай', 'вайфай', 'роутер', 'router',
          'ვაი-ფაი', 'როუტერ'], 'Компьютерная помощь'],
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
            const err = new Error('Bot rejected lead: ' + reason);
            // Код причины нужен форме, чтобы объяснить человеку, ЧТО не так.
            // Без него любой отказ выглядел одинаково — «Ошибка при отправке.
            // Попробуйте ещё раз», — и совет «попробуйте ещё раз» был вредным:
            // повтор того же текста отвергался снова.
            err.botError = reason;
            throw err;
        }
        return data;
    } finally {
        if (timer) clearTimeout(timer);
    }
}

// Переводит код отказа бота в понятную человеку фразу.
//
// Коды приходят из handle_site_request (main.py). Общий текст оставляем только
// для неизвестных причин: раньше ЛЮБОЙ отказ показывался как «Ошибка при
// отправке. Попробуйте ещё раз», и человек либо повторял тот же текст (и снова
// получал отказ), либо уходил. Во всех случаях заявка уже продублирована на
// почту, поэтому сообщения не обещают потерю.
function botErrorMessage(code) {
    switch (code) {
        case 'address_in_text':  return t('addressInDescription');
        case 'contact_in_text':  return t('submitContactInText');
        case 'too many requests': return t('submitTooMany');
        case 'too_long':         return t('submitTooLong');
        case 'profanity':        return t('submitProfanity');
        default:                 return t('submitError');
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
        /* Категория: обычно из списка услуг, но карточка услуги без
           своей страницы может задать её точнее.

           ⚠️ Список в форме укрупнённый — восемь пунктов. Заявка с
           карточки «Настройка Wi-Fi» через него стала бы «Другое»
           и ушла бы узкому кругу мастеров вместо тех, кто чинит
           компьютеры. Поэтому карточка кладёт свою категорию в
           скрытое поле service_exact (его ставит redesign.js), и
           она имеет приоритет. Поле пустое — работает прежний
           разбор по списку. */
        category:    resolveBotCategory(get('service_exact') || get('service')),
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


// ⚠️ Слоя мастеров нет В ЭТОМ РЕПОЗИТОРИИ: здесь ни анкеты, ни модалок,
// ни вызова /site/new-master. Клиентская заявка уходит в
// /site/new-request — это всё, что умеет редизайн.
//
// Но на ПРОДЕ страницы /<lang>/masters/ живы: отдают 200, стоят в
// sitemap.xml, проиндексированы, и на них рабочая анкета (шлёт на
// Formspree, не боту). В футере на них стоит ссылка «Для мастеров».
// Поэтому прежняя формулировка «слоя мастеров нет вовсе» неверна и
// уже привела к потере ссылки при редизайне.
//
// Правило: решая судьбу /masters/, сверяйся с продом, а не с
// содержимым этой папки. Саму страницу предстоит переверстать в новом
// оформлении — до тех пор она остаётся от старого сайта.

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
// Собирает список районов в клиентской форме и включает уточнение для «Другого».
function initClientDistrictOptions() {
    const form = document.getElementById('clientLeadForm');
    if (!form) return;
    const districtSel = form.querySelector('select[name="district"]');
    if (!districtSel) return;

    buildDistrictSelect(districtSel, false);  // только названия районов
    initDistrictOtherInput(form, districtSel);
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
    // form-control — общее оформление полей нового дизайна. Без него поле
    // оставалось голым системным input'ом посреди формы: рамка 1.6px inset,
    // высота 21px против 51px у соседей. В старом style.css класса
    // .form-control нет, поэтому страницы прежнего дизайна не затронуты.
    input.className = 'district-other-input form-control';
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

// Живая подсказка под описанием: предупреждает об адресе ПО ХОДУ ввода.
//
// Раньше про адрес человек узнавал только после нажатия «Отправить» — модальным
// alert, поверх уже написанного текста. Клиентка 01.11.2026 прошла через это,
// стёрла адрес и всё равно не смогла отправить заявку (телефон требовал +995),
// после чего ушла в Telegram. Подсказка на месте дешевле любого alert: человек
// видит её, пока пишет, и правит текст сразу.
function initAddressHint(leadForm) {
    const ta = leadForm.querySelector('textarea[name="message"]');
    if (!ta) return;

    const hint = document.createElement('p');
    hint.className = 'field-hint field-hint--warn';
    hint.setAttribute('role', 'status');          // скринридер объявит появление
    hint.hidden = true;
    hint.textContent = t('addressInDescription');
    ta.insertAdjacentElement('afterend', hint);

    let shown = false;
    ta.addEventListener('input', () => {
        const bad = containsAddress(ta.value);
        if (bad === shown) return;                 // перерисовываем только на смене состояния
        shown = bad;
        hint.hidden = !bad;
    });
}

function initClientLeadFormTracking() {
    const leadForm = document.getElementById('clientLeadForm');
    if (!leadForm) return;

    initAddressHint(leadForm);

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

        // 📧 Formspree — ДУБЛЬ заявки на почту, страховка на случай сбоя бота.
        //
        // ⚠️ Отправляем ДО ожидания ответа бота и независимо от него. Раньше
        // этот вызов стоял ПОСЛЕ `await sendLeadToBot`, то есть выполнялся
        // только при успехе: любой отказ бота (модерация, rate-limit, таймаут)
        // уносил лид целиком — человек видел «Ошибка при отправке», а на почту
        // не приходило ничего. Именно так 01.11.2026 потерялась заявка, и
        // клиентка пошла писать в Telegram вручную.
        // Страховка обязана срабатывать именно тогда, когда основной канал
        // отказал, — иначе это не страховка.
        // Ответа не ждём: клиенту он не нужен и добавил бы секунды к паузе.
        fetch('https://formspree.io/f/xpqjbpyk', {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        }).catch((err) => console.error('Formspree (дубль заявки):', err));

        try {
            // Telegram Bot — операционный канал. Успех формы показываем только
            // после подтверждённого принятия заявки ботом.
            await sendLeadToBot(formData, pendingIdempotencyKey);

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead_client', {
                    form_name: 'client_lead_form',
                    form_location: 'Заявка клиента',
                    user_type: 'client',
                    value: 1,
                    currency: 'USD'
                });
            }

            // Окно заявки, если оно открыто, закроется само:
            // openThankYou шлёт 'mastera:lead-sent'.
            openThankYou('lead');
            leadForm.reset();
            pendingIdempotencyKey = null;
            if (initClientPhotoUpload._reset) initClientPhotoUpload._reset(); // чистим превью фото

        } catch (error) {
            console.error(error);
            // Показываем ПРИЧИНУ, а не общее «попробуйте ещё раз»: повтор того
            // же текста отвергается снова, и человек уходит ни с чем.
            // Заявка при этом уже ушла на почту (Formspree выше) — поэтому
            // говорим, что с клиентом свяжутся, и не пугаем потерей заявки.
            alert(botErrorMessage(error && error.botError));
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
// 10.2 БЫСТРАЯ ФОРМА ПЕРВОГО ЭКРАНА
// ============================================
//
// Форма в шапке страницы (.v-float-form) спрашивает ОДИН контакт — номер
// WhatsApp. Это осознанно: на первом экране человек ещё не готов заполнять
// семь полей, и короткая форма ловит тех, кто иначе ушёл бы совсем.
// Подробности выясняются в переписке.
//
// ⚠️ До 08.11.2026 эта форма не отправляла НИКУДА. У неё нет ни action, ни
// id, а единственный обработчик submit в файле висит на #clientLeadForm —
// на форме блока заявки ниже по странице. Браузер применял поведение по
// умолчанию: GET на саму себя. Страница перезагружалась, номер оставался
// в адресной строке (/ru/?phone=555123456), и человек видел «пустую» форму
// вместо подтверждения. Лид не доходил никуда, при этом номер попадал в
// историю браузера и в логи веб-сервера.
//
// Бот требует шесть полей (district, subdistrict, category, description,
// address, contact), иначе отвечает 400 и заявка пропадает молча — сайт
// ответа не ждёт. Короткая форма их не спрашивает, поэтому подставляем:
//   district    — «Другой»: рассылка по району НЕ фильтрует (район только
//                 печатается в карточке), так что заявка не потеряется;
//   category    — категория лендинга, как у основной формы;
//   description — отмечаем, что подробностей нет и нужна переписка;
//   address     — «Не указан», как и у основной формы.
// Город берётся botCityFromUrl() — он же решает, каким мастерам слать.
function initHeroQuickForm() {
    const form = document.querySelector('.v-float-form__row');
    if (!form) return;

    // Галочка согласия лежит СНАРУЖИ формы (соседний .v-consent), поэтому
    // required на ней отправку не блокирует — браузер проверяет только поля
    // внутри <form>. Ищем её у общего родителя и проверяем сами.
    const box = form.closest('.v-float-form') || form.parentElement;
    const consent = box ? box.querySelector('.v-consent input[type="checkbox"]') : null;

    let isSubmitting = false;
    let idempotencyKey = null;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (isSubmitting) return;

        const input = form.querySelector('input[name="phone"]');
        const raw = input ? input.value.trim() : '';
        if (!raw) {
            alert(t('heroContactEmpty'));
            if (input) input.focus();
            return;
        }
        if (consent && !consent.checked) {
            alert(t('heroConsent'));
            consent.focus();
            return;
        }
        // Honeypot: поле скрыто от человека, заполнить его мог только бот.
        // Отвечаем тихим успехом — спамеру не за что зацепиться.
        const gotcha = form.querySelector('input[name="_gotcha"]');
        if (gotcha && gotcha.value.trim()) {
            form.reset();
            return;
        }

        const whatsapp = normalizeWhatsappPhone(raw);

        isSubmitting = true;
        const btn = form.querySelector('button[type="submit"]');
        const btnLabel = btn ? btn.innerHTML : null;
        if (btn) {
            btn.disabled = true;
            btn.textContent = t('submitSending');
        }

        if (!idempotencyKey) idempotencyKey = generateSiteIdempotencyKey('hero');

        // Категория страницы: на лендинге она в скрытом поле основной формы.
        // На главной там <select>, и до выбора он пуст — resolveBotCategory
        // вернул бы «Другое». Для быстрой формы это хуже «Мастера на час»:
        // «Другое» видит узкий круг мастеров, а человек, оставивший один
        // контакт, про категорию ничего не сказал — значит задача может
        // быть любой, и показать её надо как можно большему числу людей.
        const svc = document.querySelector('#clientLeadForm [name="service"]');
        const rawSvc = svc ? svc.value.trim() : '';
        const category = rawSvc ? resolveBotCategory(rawSvc) : 'Мастер на час';

        const lang = ['ru', 'en', 'ka'].includes(currentLang) ? currentLang : 'ru';

        // Район: на лендинге района он уже предвыбран в основной форме
        // (<option selected>), и терять эту подсказку незачем — мастер
        // увидит в карточке «Новый бульвар» вместо бесполезного «Другой».
        // Где предвыбора нет (главная, лендинг услуги), шлём «Другой»:
        // человек район не называл. На рассылку это не влияет — она
        // фильтрует по городу и специальности, район только печатается.
        const dSel = document.querySelector('#clientLeadForm [name="district"]');
        const dSlug = dSel && dSel.value && dSel.value !== 'Other' ? dSel.value : '';
        const district = dSlug ? (BOT_DISTRICT_MAP[dSlug] || 'Другой') : 'Другой';

        // Почта — первой и независимо от бота, тем же приёмом, что в основной
        // форме: страховка обязана срабатывать именно когда бот отказал.
        const fd = new FormData();
        fd.append('whatsapp', whatsapp);
        fd.append('_subject', 'Быстрая заявка с первого экрана');
        fd.append('_language', lang);
        fetch('https://formspree.io/f/xpqjbpyk', {
            method: 'POST',
            body: fd,
            headers: { 'Accept': 'application/json' }
        }).catch((err) => console.error('Formspree (быстрая заявка):', err));

        try {
            await postBotJson(BOT_REQUEST_URL, {
                city:        botCityFromUrl(),
                name:        '',
                phone:       '',
                district:    district,
                subdistrict: 'Не указан',
                category:    category,
                /* ⚠️ В описании НЕЛЬЗЯ называть мессенджер и слово
                   «контакт». Бот прогоняет description через ту же
                   модерацию, что и заявки из бота
                   (_validate_site_request_content → contains_contact_info),
                   а «whatsapp», «telegram», «контакт» — стоп-слова:
                   это защита от обхода платной выдачи контактов.
                   Прежний текст «клиент оставил только WhatsApp»
                   получал 400 contact_in_text, и заявка не доходила
                   НИ в бота, НИ в канал — сайт ответа не ждёт, так
                   что отказ был молчаливым. Сам номер уходит полем
                   contact: оно шифруется и модерацию не проходит.
                   Меняя текст — проверь его на contains_contact_info
                   и contains_address, а не на глаз. */
                description: 'Задача: быстрая заявка с первого экрана. '
                           + 'Подробности клиент не указал — уточняем при связи.',
                address:     'Не указан',
                contact:     '🟢 WhatsApp: ' + whatsapp,
                honeypot:    '',
                lang:        lang,
                urgent:      false,
                photos:      [],
                idempotency_key: idempotencyKey
            });

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead_client', {
                    form_name: 'hero_quick_form',
                    form_location: 'Быстрая заявка, первый экран',
                    user_type: 'client',
                    value: 1,
                    currency: 'USD'
                });
            }

            openThankYou('hero');
            form.reset();
            if (consent) consent.checked = false;
            idempotencyKey = null;

        } catch (error) {
            console.error('Быстрая заявка:', error);
            // Заявка уже ушла на почту выше, поэтому текст не пугает потерей.
            alert(botErrorMessage(error && error.botError));
        } finally {
            isSubmitting = false;
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = btnLabel;   // innerHTML: внутри кнопки есть <svg>
            }
        }
    });
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

// Собирает окно благодарности и возвращает его. Окно создаётся в JS и
// добавляется в <body> один раз за сессию.
//
// ⚠️ Почему не в разметке: #thankYouModal не существует НИ НА ОДНОЙ
// странице нового сайта. Основная форма при этом вызывала openThankYou(),
// _modal() молча не находил элемент — и клиент, отправив заявку, не видел
// никакого подтверждения: форма просто очищалась. Положить окно в разметку
// 129 страниц значит снова развести текст по копиям (так уже разъехался
// бейдж: «15–60» на лендингах против «30–60» на главных). Здесь он один.
function buildThankYouModal() {
    let modal = document.getElementById('thankYouModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'thankYouModal';
    modal.className = 'ty-modal';
    modal.style.display = 'none';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'thankYouTitle');

    modal.innerHTML =
        '<div class="ty-modal__window">' +
            '<button type="button" class="ty-modal__close" aria-label="' +
                t('thanksClose') + '">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
                'stroke-linecap="round" aria-hidden="true">' +
                '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>' +
            '</button>' +
            '<div class="ty-modal__icon">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
                'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                '<polyline points="20 6 9 17 4 12"/></svg>' +
            '</div>' +
            '<h3 class="ty-modal__title" id="thankYouTitle"></h3>' +
            '<p class="thank-you-text"></p>' +
            '<div class="ty-modal__badge">' +
                '<span class="badge-label"></span>' +
                '<strong class="badge-value"></strong>' +
            '</div>' +
            '<button type="button" class="button button--primary ty-modal__ok"></button>' +
        '</div>';

    document.body.appendChild(modal);

    // Закрытие: крестик, кнопка «Понятно» и клик по затемнению. Клик по
    // самому окну закрывать не должен — проверяем, что цель именно фон.
    modal.querySelector('.ty-modal__close').addEventListener('click', closeThankYou);
    modal.querySelector('.ty-modal__ok').addEventListener('click', closeThankYou);
    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeThankYou();
    });

    return modal;
}

// Заполняет окно благодарности: днём — обычный бейдж, ночью — честное
// «свяжемся утром». Текст берётся из словаря i18n, а не из разметки.
//
// kind: 'lead' — основная форма (задача описана, район выбран),
//       'hero' — быстрая форма первого экрана (есть только WhatsApp),
// у них разный текст: в первом случае «свяжемся», во втором — «напишем
// в WhatsApp», иначе клиент ждёт звонка, а мы пишем в мессенджер.
function applyThankYouBadge(kind) {
    const modal = document.getElementById('thankYouModal');
    if (!modal) return;
    const title = modal.querySelector('.ty-modal__title');
    const label = modal.querySelector('.badge-label');
    const value = modal.querySelector('.badge-value');
    const text  = modal.querySelector('.thank-you-text');
    const ok    = modal.querySelector('.ty-modal__ok');
    if (!label || !value) return;

    if (title) title.textContent = t('thanksTitle');
    if (ok) ok.textContent = t('thanksClose');

    const dayText = kind === 'hero' ? t('thanksTextHero') : t('thanksText');
    const replyTime = quietHoursReplyTime();

    if (!replyTime) {
        label.textContent = t('thanksBadgeLabel');
        value.textContent = t('thanksBadgeValue');
        if (text) text.textContent = dayText;
        return;
    }

    label.textContent = t('thanksBadgeLabelNight');
    value.textContent = t('thanksBadgeValueNight').replace('{time}', replyTime);

    if (text) {
        // У быстрой формы свой ночной текст: у нас от клиента только номер
        // WhatsApp, и общее «свяжемся» заставило бы его ждать звонка.
        // Галочки «срочно» в быстрой форме нет, поэтому ветку срочности
        // она не проходит.
        if (kind === 'hero') {
            text.textContent = t('thanksTextHeroNight').replace('{time}', replyTime);
            return;
        }
        // Для срочной заявки «свяжемся утром» звучит как отказ — там свой текст.
        const urgent = !!(document.getElementById('leadUrgent') &&
                          document.getElementById('leadUrgent').checked);
        text.textContent = urgent
            ? t('thanksTextNightUrgent')
            : t('thanksTextNight').replace('{time}', replyTime);
    }
}

/* Заявку могли отправить из модального окна (его собирает
   buildLeadModal в redesign.js). Окно надо закрыть до показа
   благодарности, иначе она встанет поверх формы.

   ⚠️ Событие, а не прямой вызов: redesign.js грузится ПЕРВЫМ и о
   функциях этого файла ничего не знает, а обратная зависимость
   связала бы два файла намертво. Окна заявки на странице может и
   не быть — тогда событие просто никто не слушает.

   ⚠️ Прежняя closeClientLeadForm() отсюда убрана: она гасила окно
   через style.display, а новое окно управляется атрибутом hidden
   и классом is-open. Скрытое по display окно осталось бы в потоке
   с формой внутри, и прокрутка к #lead приводила бы в пустую
   секцию. */
function openThankYou(kind)    { document.dispatchEvent(new CustomEvent('mastera:lead-sent'));
                                 buildThankYouModal();
                                 applyThankYouBadge(kind);
                                 _modal('thankYouModal',          'flex'); }
function closeThankYou()       { _modal('thankYouModal',          'none'); }

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
    // ⚠️ Окно заявки здесь НЕ проверяем, хотя раньше оно стояло в
    // списке. Оно блокирует прокрутку само (document.body.style
    // .overflow в buildLeadModal), и два механизма на один фон
    // конфликтуют: этот ставит body в position:fixed, и окно,
    // выросшее выше экрана, становится непрокручиваемым изнутри —
    // до кнопки отправки не добраться.
    const anyOpen = ['thankYouModal']
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
// 14. ССЫЛКИ WHATSAPP / TELEGRAM
// ============================================

// Собирает ссылки WhatsApp/Telegram с текстом под услугу, район и город
// страницы. Единственный потребитель — нижняя панель связи нового дизайна
// (buildContactBar в redesign.js). Функция живёт отдельно от неё, потому
// что текст сообщения опирается на скрытое поле service и разбор адреса,
// то есть на ту же логику, что и отправка заявки: держать её рядом
// надёжнее, чем дублировать в redesign.js.
/* Язык страницы для подписей и текста сообщения.
   Обычно его ставит сама страница в window.__FORCE_LANG__, но на
   служебных (/ge/terms/, /en/privacy/ и т.п.) этой переменной
   нет — там оставался русский, и грузинская страница объявляла
   кнопку связи как «Написать в WhatsApp». Запасной источник —
   атрибут lang у <html>: он проставлен везде.
   ⚠️ В разметке грузинский помечен кодом ka, а разделы сайта
   лежат в /ge/ — здесь нужен именно ka, как в таблицах ниже. */
function contactLang() {
    if (window.__FORCE_LANG__) return window.__FORCE_LANG__;
    const html = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (html.startsWith('ka') || html.startsWith('ge')) return 'ka';
    if (html.startsWith('en')) return 'en';
    return 'ru';
}

function buildContactLinks() {
    const isBatumiPage = /\/batumi(?:\/|$)/i.test(window.location.pathname);
    const lang = contactLang();

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
        const pageLang = contactLang();
        // Услугу подставляем, только если текст на языке страницы.
        const svcUsable = (code === pageLang) ? svcName : '';
        const svcDistrictUsable = (code === pageLang) ? svcDistrict : '';

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

    // ⚠️ Кнопка «Написать в Telegram» ведёт в ЛИЧНЫЙ ЧАТ, а не в бота:
    // посетитель, который жмёт «написать», хочет живого собеседника, а
    // попадал в меню бота и уходил. На бота ведёт отдельная ссылка в
    // подвале — она так и называется, «Telegram-бот».
    //
    // Параметра ?start= здесь нет намеренно: это обычный аккаунт, а не
    // бот, и Telegram такой аргумент просто игнорирует. Язык в ссылке
    // тоже не нужен — отвечает человек.
    const tgHref = TELEGRAM_CHAT_URL;

    // Подписи (доступность/тултипы) по языку.
    const labels = ({
        ru: { open: 'Связаться с нами', wa: 'Написать в WhatsApp', tg: 'Написать в Telegram' },
        en: { open: 'Contact us',       wa: 'Message on WhatsApp', tg: 'Message on Telegram' },
        ka: { open: 'დაგვიკავშირდით',   wa: 'მოგვწერეთ WhatsApp-ში', tg: 'მოგვწერეთ Telegram-ში' }
    })[lang] || { open: 'Связаться с нами', wa: 'WhatsApp', tg: 'Telegram' };

    return { waHref: waHref, tgHref: tgHref, labels: labels, lang: lang };
}

// ============================================
// ОТЛОЖЕННЫЕ ВЫЗОВЫ — только в самом конце файла
// ============================================
/* ⚠️ Стоит здесь, а НЕ рядом с обработчиком DOMContentLoaded выше.
   Тег <script> подключён с defer: к моменту разбора документ часто
   уже 'complete', и ветка с немедленным вызовом срабатывает сразу,
   на той же строке. Наверху файла const A11Y_FIELD_LABELS и
   NAME_PATTERN_ATTR ещё не инициализированы (временная мёртвая
   зона), и вызов падал с «Cannot access ... before initialization»,
   унося с собой подписи полей и маску имени. Здесь, после всех
   объявлений, этого не происходит. */
if (document.readyState === 'complete') {
    applyFieldLabels();
} else {
    window.addEventListener('load', applyFieldLabels, { once: true });
}
