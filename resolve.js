const fs = require('fs');
const path = require('path');

function resolve(filepath) {
  try {
    let content = fs.readFileSync(filepath, 'utf8');
    const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?\r?\n>>>>>>> origin\/client\r?\n?/g;
    const newContent = content.replace(regex, '$1\n');
    if (newContent !== content) {
      fs.writeFileSync(filepath, newContent, 'utf8');
      console.log('Resolved', filepath);
    }
  } catch (e) {
    console.error(e.message);
  }
}

['app/api/closer/initiate/route.ts', 'app/api/listings/route.ts', 'lib/intelligence.ts', 'lib/services/AirtableIntegrationService.ts', 'next.config.ts'].forEach(f => resolve(path.join('apps/sierra-estates-realty', f)));
