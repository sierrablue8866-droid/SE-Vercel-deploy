const fs = require('fs');
const files = [
  'apps/sierra-estates-realty/app/api/listings/route.ts',
  'apps/sierra-estates-realty/lib/intelligence.ts',
  'apps/sierra-estates-realty/lib/services/AirtableIntegrationService.ts',
  'apps/sierra-estates-realty/next.config.ts'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?\r?\n>>>>>>> origin\/client\r?\n?/g;
  const newContent = content.replace(regex, (match, p1) => p1 + '\n');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Resolved', file);
  }
}
