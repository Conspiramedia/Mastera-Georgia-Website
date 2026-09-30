const fs = require('fs');
const path = require('path');

console.log(' Оптимизируем Title и Description для Тбилиси и Батуми (все языки)...\n');

const metaConfig = {
    // ТБИЛИСИ
    'ru/index.html': {
        title: 'Мастер на час Тбилиси — выезд 60 мин, от 20₾ | Мастера Грузии',
        description: '🔧 Срочный вызов мастера в Тбилиси за 60 минут. Сантехник, электрик, сборка мебели — от 20₾. Проверенные специалисты, оплата после работы. Оставьте заявку сейчас!'
    },
    'ge/index.html': {
        title: 'ხელოსანი თბილისში — 60 წთ, 20₾-დან | Mastera Georgia',
        description: '🔧 ხელოსნის სასწრაფო გამოძახება თბილისში 60 წუთში. სანტექნიკა, ელექტრიკა, ავეჯის აწყობა — 20₾-დან. გადამოწმებული სპეციალისტები. დატოვეთ განაცხადი ახლავე!'
    },
    'en/index.html': {
        title: 'Handyman Tbilisi — 60 min, from 20₾ | Mastera Georgia',
        description: '🔧 Urgent handyman service in Tbilisi within 60 minutes. Plumbing, electrical, furniture assembly — from 20₾. Verified specialists, pay after work. Request now!'
    },
    
    // БАТУМИ
    'ru/batumi/index.html': {
        title: 'Мастер на час Батуми — выезд 60 мин, от 25₾ | Мастера Грузии',
        description: '🔧 Срочный вызов мастера в Батуми за 60 минут. Сантехник, электрик, сборка мебели — от 25₾. Проверенные специалисты, оплата после работы. Оставьте заявку сейчас!'
    },
    'ge/batumi/index.html': {
        title: 'ხელოსანი ბათუმში — 60 წთ, 25₾-დან | Mastera Georgia',
        description: ' ხელოსნის სასწრაფო გამოძახება ბათუმში 60 წუთში. სანტექნიკა, ელექტრიკა, ავეჯის აწყობა — 25-დან. გადამოწმებული სპეციალისტები. დატოვეთ განაცხადი ახლავე!'
    },
    'en/batumi/index.html': {
        title: 'Handyman Batumi — 60 min, from 25₾ | Mastera Georgia',
        description: '🔧 Urgent handyman service in Batumi within 60 minutes. Plumbing, electrical, furniture assembly — from 25₾. Verified specialists, pay after work. Request now!'
    }
};

let updatedFiles = [];

Object.keys(metaConfig).forEach(filePath => {
    const fullPath = path.join('.', filePath);
    
    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️  Файл не найден: ${fullPath}`);
        return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    const config = metaConfig[filePath];
    
    // Резервная копия
    fs.writeFileSync(fullPath + '.bak', content);
    
    // Заменяем Title
    content = content.replace(/<title>[\s\S]*?<\/title>/i, `<title>${config.title}</title>`);
    
    // Заменяем Description
    content = content.replace(/<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i, `<meta name="description" content="${config.description}">`);
    
    fs.writeFileSync(fullPath, content);
    
    console.log(`✅ ${filePath}`);
    console.log(`   Title: ${config.title} (${config.title.length} симв.)`);
    console.log(`   Desc:  ${config.description.substring(0, 65)}... (${config.description.length} симв.)\n`);
    
    updatedFiles.push(filePath);
});

console.log('='.repeat(70));
console.log(` ГОТОВО! Обновлено файлов: ${updatedFiles.length}`);
console.log('\n📋 Следующие шаги:');
console.log('1. Удалите .bak файлы: Get-ChildItem -Recurse -Filter "*.bak" | Remove-Item');
console.log('2. Задеплойте: git add . && git commit -m "seo: optimize meta tags for Tbilisi + Batumi" && git push');
