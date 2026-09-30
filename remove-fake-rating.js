const fs = require('fs');
const path = require('path');

console.log('🧹 Начинаем удаление фейкового aggregateRating из Schema...\n');

let fixedCount = 0;

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Проверяем, есть ли вообще этот блок в файле
            if (content.includes('"aggregateRating"')) {
                console.log('📝 Обрабатываем: ' + fullPath);
                
                // Делаем резервную копию
                fs.writeFileSync(fullPath + '.bak', content);
                
                // Регулярное выражение для безопасного удаления блока aggregateRating
                // Оно учитывает переносы строк и удаляет лишние запятые, чтобы не сломать JSON
                const regex1 = /,\s*"aggregateRating"\s*:\s*\{[\s\S]*?"worstRating"\s*:\s*"1"\s*\}/g;
                const regex2 = /"aggregateRating"\s*:\s*\{[\s\S]*?"worstRating"\s*:\s*"1"\s*\},\s*/g;
                
                content = content.replace(regex1, '');
                content = content.replace(regex2, '');
                
                fs.writeFileSync(fullPath, content);
                fixedCount++;
                console.log('✅ Очищено: ' + fullPath);
            }
        }
    });
}

processDirectory('.');

console.log(`\n🎉 Готово! Исправлено файлов: ${fixedCount}`);
console.log('Пожалуйста, проверьте один любой файл вручную, чтобы убедиться, что JSON валиден,');
console.log('а затем удалите все .bak файлы командой: Get-ChildItem -Recurse -Filter "*.bak" | Remove-Item');