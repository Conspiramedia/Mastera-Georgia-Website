const fs = require('fs');
const path = require('path');

console.log('🚀 Массовая оптимизация Title/Description для всех страниц...\n');

// === ШАБЛОНЫ ===
const serviceTemplates = {
    santehnik: {
        ru: { title: 'Сантехник Тбилиси — от 30₾, выезд за 60 мин', desc: '🔧 Вызов сантехника в Тбилиси от 30₾. Протечки, засоры, замена смесителя. Приезд за 60 минут. Оставьте заявку сейчас!' },
        en: { title: 'Plumber Tbilisi — from 30₾, 60 min arrival', desc: '🔧 Plumber in Tbilisi from 30₾. Leaks, clogs, faucet replacement. Arrival in 60 min. Request now!' },
        ge: { title: 'სანტექნიკოსი თბილისში — 30₾-დან, 60 წთ', desc: '🔧 სანტექნიკოსი თბილისში 30₾-დან. გაჟონვა, ჩახშობა, ონკანის შეცვლა. 60 წუთში მოსვლა. დატოვეთ განაცხადი!' }
    },
    elektrik: {
        ru: { title: 'Электрик Тбилиси — от 40₾, срочно 24/7', desc: '⚡ Вызов электрика в Тбилиси от 40. Розетки, проводка, щитки. Аварийный выезд 24/7. Оставьте заявку сейчас!' },
        en: { title: 'Electrician Tbilisi — from 40₾, 24/7 urgent', desc: '⚡ Electrician in Tbilisi from 40₾. Outlets, wiring, panels. Emergency 24/7 service. Request now!' },
        ge: { title: 'ელექტრიკოსი თბილისში — სასწრაფო, 20₾-დან', desc: ' ელექტრიკოსი თბილისში 20₾-დან. როზეტები, გაყვანილობა, щитки. სასწრაფო 24/7. დატოვეთ განაცხადი!' }
    },
    'master-na-chas': {
        ru: { title: 'Мастер на час Тбилиси — от 20₾/час', desc: '🔧 Мастер на час в Тбилиси от 20₾/час. Мелкий ремонт, сборка, навеска. Выезд за 60 мин. Оставьте заявку!' },
        en: { title: 'Handyman Tbilisi — from 20₾/hour, 60 min', desc: '🔧 Handyman in Tbilisi from 20₾/hr. Small repairs, assembly, mounting. Arrival in 60 min. Request now!' },
        ge: { title: 'ოსტატი საათით თბილისში — 20₾/სთ, 60 წთ', desc: ' ოსტატი საათით თბილისში 20₾/სთ-დან. წვრილმანი რემონტი, აწყობა, დაკიდება. 60 წუთში. დატოვეთ განაცხადი!' }
    },
    gruzchiki: {
        ru: { title: 'Грузчики Тбилиси — от 25₾/час, переезд', desc: '📦 Грузчики в Тбилиси от 25₾/час. Переезды, подъём мебели, разгрузка. Быстро и аккуратно. Оставьте заявку!' },
        en: { title: 'Movers Tbilisi — from 25₾/hour, relocation', desc: '📦 Movers in Tbilisi from 25₾/hr. Relocation, furniture lifting, loading. Fast and careful. Request now!' },
        ge: { title: 'მზიდავები თბილისში — 25₾/სთ-დან, გადაზიდვა', desc: ' მზიდავები თბილისში 25₾/სთ-დან. გადაზიდვა, ავეჯის აწევა, ჩატვირთვა. სწრაფად. დატოვეთ განაცხადი!' }
    },
    klining: {
        ru: { title: 'Клининг Тбилиси — от 50₾, уборка квартир', desc: '🧹 Клининг в Тбилиси от 50₾. Генеральная уборка, после ремонта, окна. Профессионально. Оставьте заявку!' },
        en: { title: 'Cleaning Tbilisi — from 50₾, apartments', desc: '🧹 Cleaning service in Tbilisi from 50₾. General, post-renovation, windows. Professional. Request now!' },
        ge: { title: 'კლინინგი თბილისში — დასუფთავება, 50₾-დან', desc: ' კლინინგი თბილისში 50₾-დან. გენერალური, რემონტის შემდეგ, ფანჯრები. პროფესიონალურად. დატოვეთ განაცხადი!' }
    },
    'sborka-mebeli': {
        ru: { title: 'Сборка мебели Тбилиси — от 40₾, IKEA', desc: ' Сборка мебели в Тбилиси от 40₾. Шкафы, кухни, кровати, IKEA. Быстро и качественно. Оставьте заявку!' },
        en: { title: 'Furniture Assembly Tbilisi — from 40₾, IKEA', desc: '🔨 Furniture assembly in Tbilisi from 40₾. Wardrobes, kitchens, beds, IKEA. Fast and quality. Request now!' },
        ge: { title: 'ავეჯის აწყობა თბილისში — 40₾-დან, IKEA', desc: '🔨 ავეჯის აწყობა თბილისში 40-დან. კარადები, სამზარეულო, საწოლები, IKEA. სწრაფად. დატოვეთ განაცხადი!' }
    },
    'naveska-montazh': {
        ru: { title: 'Навеска в Тбилиси — ТВ, полки от 25₾', desc: '🔩 Навеска и монтаж в Тбилиси от 25₾. ТВ на стену, полки, карнизы, зеркала. Оставьте заявку сейчас!' },
        en: { title: 'Mounting Tbilisi — TV, shelves from 25', desc: '🔩 Mounting service in Tbilisi from 25₾. TV on wall, shelves, rails, mirrors. Request now!' },
        ge: { title: 'დაკიდება თბილისში — TV, თაროები 25₾-დან', desc: '🔩 დაკიდება და მონტაჟი თბილისში 25₾-დან. ტელევიზორი, თაროები, კარნიზები. დატოვეთ განაცხადი!' }
    },
    'remont-kompyuterov': {
        ru: { title: 'Ремонт ПК Тбилиси — от 50₾, Windows', desc: '💻 Ремонт компьютеров в Тбилиси от 50₾. ПК, ноутбуки, Windows, вирусы. Выезд мастера. Оставьте заявку!' },
        en: { title: 'PC Repair Tbilisi — from 50₾, Windows', desc: '💻 Computer repair in Tbilisi from 50₾. PC, laptops, Windows, viruses. Master arrival. Request now!' },
        ge: { title: 'კომპიუტერის შეკეთება თბილისში — 50₾-დან', desc: '💻 კომპიუტერის შეკეთება თბილისში 50₾-დან. PC, ლეპტოპი, Windows, ვირუსები. დატოვეთ განაცხადი!' }
    },
    'bytovoy-remont': {
        ru: { title: 'Ремонт в Тбилиси — от 30₾, мастер на час', desc: '🔧 Бытовой ремонт в Тбилиси от 30₾. Замки, мебель, двери, окна. Мастер за 60 минут. Оставьте заявку!' },
        en: { title: 'Home Repair Tbilisi — from 30₾, handyman', desc: '🔧 Home repair in Tbilisi from 30₾. Locks, furniture, doors, windows. Handyman in 60 min. Request now!' },
        ge: { title: 'საყოფაცხოვრებო რემონტი თბილისში — 30₾-დან', desc: ' საყოფაცხოვრებო რემონტი თბილისში 30₾-დან. საკეტები, ავეჯი, კარები. ოსტატი 60 წუთში. დატოვეთ განაცხადი!' }
    }
};

// Копия для Батуми (цены чуть выше)
const batumiTemplates = {};
Object.keys(serviceTemplates).forEach(key => {
    batumiTemplates[key] = {};
    ['ru', 'en', 'ge'].forEach(lang => {
        const t = serviceTemplates[key][lang];
        batumiTemplates[key][lang] = {
            title: t.title.replace('Тбилиси', 'Батуми').replace('Tbilisi', 'Batumi').replace('თბილისში', 'ბათუმში'),
            desc: t.desc.replace('Тбилиси', 'Батуми').replace('Tbilisi', 'Batumi').replace('თბილისში', 'ბათუმში')
        };
    });
});

// Шаблоны для районов
const districtTemplates = {
    ru: { title: 'Мастер {district} — от 20₾/час, за 60 мин', desc: '🔧 Мастер на час в районе {district}, Тбилиси. Мелкий ремонт, сборка, навеска от 20/час. Выезд за 60 минут. Оставьте заявку!' },
    en: { title: 'Handyman {district} — from 20/hr, 60 min', desc: '🔧 Handyman in {district} district, Tbilisi. Small repairs, assembly, mounting from 20₾/hr. Arrival in 60 min. Request now!' },
    ge: { title: 'ოსტატი {district} — 20₾/სთ-დან, 60 წთ', desc: '🔧 ოსტატი საათით {district} რაიონში, თბილისი. წვრილმანი რემონტი, აწყობა, დაკიდება 20/სთ-დან. 60 წუთში. დატოვეთ განაცხადი!' }
};

// Словарь районов
const districtNames = {
    'vake': { ru: 'Ваке', en: 'Vake', ge: 'ვაკე' },
    'saburtalo': { ru: 'Сабуртало', en: 'Saburtalo', ge: 'საბურთალო' },
    'didube': { ru: 'Дидубе', en: 'Didube', ge: 'დიდუბე' },
    'chugureti': { ru: 'Чугурети', en: 'Chugureti', ge: 'ჩუღურეთი' },
    'isani': { ru: 'Исани', en: 'Isani', ge: 'ისანი' },
    'samgori': { ru: 'Самгори', en: 'Samgori', ge: 'სამგორი' },
    'gldani': { ru: 'Глдани', en: 'Gldani', ge: 'გლდანი' },
    'nadzaladevi': { ru: 'Надзаладеви', en: 'Nadzaladevi', ge: 'ნაძალადევი' },
    'mtatsminda': { ru: 'Мтацминда', en: 'Mtatsminda', ge: 'მთაწმინდა' },
    'krtsanisi': { ru: 'Крцаниси', en: 'Krtsanisi', ge: 'კრწანისი' },
    'aeroport-batumi': { ru: 'Аэропорт Батуми', en: 'Batumi Airport', ge: 'ბათუმის აეროპორტი' },
    'stary-batumi': { ru: 'Старый Батуми', en: 'Old Batumi', ge: 'ძველი ბათუმი' },
    'novy-bulvar': { ru: 'Новый бульвар', en: 'New Boulevard', ge: 'ახალი ბულვარი' },
    'boni-gorodok': { ru: 'Бони-Городок', en: 'Boni-Gorodok', ge: 'ბონი-გოროდოკი' },
    'khimshiashvili': { ru: 'Химшиашвили', en: 'Khimshiashvili', ge: 'ხიმშიაშვილი' }
};

// Служебные файлы — не трогаем
const skipFiles = ['404.html', 'google.html', 'yandex_907b8ca3eefe4d37.html'];

let stats = { updated: 0, skipped: 0, errors: 0 };

function detectPageInfo(filePath) {
    const rel = filePath.replace(/^\.\\/, '').replace(/\\/g, '/');
    
    // Определяем язык
    let lang = 'ru';
    if (rel.startsWith('ge/') || rel.endsWith('-ge/index.html')) lang = 'ge';
    else if (rel.startsWith('en/') || rel.endsWith('-en/index.html')) lang = 'en';
    
    // Определяем город
    let city = 'tbilisi';
    if (rel.includes('batumi')) city = 'batumi';
    
    // Определяем тип и услугу/район
    let type = 'other';
    let serviceKey = null;
    let districtKey = null;
    
    // Проверяем услугу
    for (const key of Object.keys(serviceTemplates)) {
        if (rel.includes(key)) {
            type = 'service';
            serviceKey = key;
            break;
        }
    }
    
    // Проверяем район (если не услуга)
    if (!serviceKey) {
        for (const key of Object.keys(districtNames)) {
            if (rel.includes(key)) {
                type = 'district';
                districtKey = key;
                break;
            }
        }
    }
    
    // Проверяем главную
    if (rel.match(/^(ru|ge|en)\/index\.html$/) || rel === 'index.html') {
        type = 'main';
    }
    if (rel.match(/^(ru|ge|en)\/batumi\/index\.html$/)) {
        type = 'main-batumi';
    }
    
    return { lang, city, type, serviceKey, districtKey };
}

function generateMeta(info) {
    const { lang, city, type, serviceKey, districtKey } = info;
    const langKey = lang === 'ge' ? 'ge' : (lang === 'en' ? 'en' : 'ru');
    
    if (type === 'service' && serviceKey) {
        const templates = city === 'batumi' ? batumiTemplates : serviceTemplates;
        return templates[serviceKey]?.[langKey] || null;
    }
    
    if (type === 'district' && districtKey) {
        const t = districtTemplates[langKey];
        const districtName = districtNames[districtKey]?.[langKey] || districtKey;
        return {
            title: t.title.replace('{district}', districtName),
            desc: t.desc.replace('{district}', districtName).replace('Тбилиси', city === 'batumi' ? 'Батуми' : 'Тбилиси').replace('Tbilisi', city === 'batumi' ? 'Batumi' : 'Tbilisi').replace('თბილისი', city === 'batumi' ? 'ბათუმი' : 'თბილისი')
        };
    }
    
    return null;
}

function processFile(filePath) {
    const fileName = path.basename(filePath);
    if (skipFiles.includes(fileName)) return;
    
    const info = detectPageInfo(filePath);
    const meta = generateMeta(info);
    
    if (!meta) return; // Не нашли шаблон — пропускаем
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Проверяем, не оптимизирована ли уже страница
    const currentTitleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
    if (currentTitleMatch && currentTitleMatch[1].trim().length <= 60 && 
        (currentTitleMatch[1].includes('₾') || currentTitleMatch[1].includes('-დან') || currentTitleMatch[1].includes('from '))) {
        // Уже короткая и с ценой — пропускаем
        stats.skipped++;
        return;
    }
    
    // Резервная копия
    fs.writeFileSync(filePath + '.bak', content);
    
    // Заменяем Title
    content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${meta.title}</title>`);
    
    // Заменяем Description
    content = content.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${meta.desc}">`);
    
    fs.writeFileSync(filePath, content);
    stats.updated++;
    
    console.log(`✅ ${filePath}`);
    console.log(`   📌 ${meta.title} (${meta.title.length} симв.)`);
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            processFile(fullPath);
        }
    });
}

processDirectory('.');

console.log('\n' + '='.repeat(70));
console.log(`🎉 ГОТОВО! Обновлено: ${stats.updated} | Пропущено (уже ок): ${stats.skipped}`);
console.log('\n Следующие шаги:');
console.log('1. Удалите .bak: Get-ChildItem -Recurse -Filter "*.bak" | Remove-Item');
console.log('2. Задеплойте: git add . && git commit -m "seo: mass optimize meta tags" && git push');