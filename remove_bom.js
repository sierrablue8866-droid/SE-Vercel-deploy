const fs = require('fs');
const content = fs.readFileSync('apps/sierra-estates-realty/package.json', 'utf8');
const cleanContent = content.replace(/^\uFEFF/, '');
fs.writeFileSync('apps/sierra-estates-realty/package.json', cleanContent, 'utf8');
