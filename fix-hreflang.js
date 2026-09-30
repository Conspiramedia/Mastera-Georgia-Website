const fs = require('fs');
const path = require('path');

console.log('Starting hreflang fix...');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            if (content.includes('hreflang="ru"') || content.includes('hreflang="en"')) {
                console.log('Processing: ' + fullPath);
                
                fs.writeFileSync(fullPath + '.bak', content);
                
                content = content.replace(/hreflang="ru"/g, 'hreflang="ru-ge"');
                content = content.replace(/hreflang="en"/g, 'hreflang="en-ge"');
                content = content.replace(
                    /hreflang="x-default" href="https:\/\/mastera-tbilisi\.ge\/en\//g,
                    'hreflang="x-default" href="https://mastera-tbilisi.ge/ru/'
                );
                
                fs.writeFileSync(fullPath, content);
                
                console.log('Fixed: ' + fullPath);
            }
        }
    });
}

processDirectory('.');

console.log('Done! All hreflang tags updated.');
console.log('Check changes and delete .bak files if everything is correct.');