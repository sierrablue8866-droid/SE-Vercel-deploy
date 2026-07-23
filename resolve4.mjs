import fs from 'fs';

function resolveFile(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');
  const output = [];
  let inHead = false;
  let inClient = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('<<<<<<< HEAD')) {
      inHead = true;
      continue;
    }
    if (line.startsWith('=======')) {
      inHead = false;
      inClient = true;
      continue;
    }
    if (line.startsWith('>>>>>>> origin/client')) {
      inClient = false;
      continue;
    }
    
    if (inHead) {
      output.push(line);
    } else if (!inClient) {
      output.push(line);
    }
  }

  const newContent = output.join('\n');
  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent, 'utf8');
    console.log('Resolved', filepath);
  }
}

const files = [
  'apps/sierra-estates-realty/app/api/listings/route.ts',
  'apps/sierra-estates-realty/lib/intelligence.ts',
  'apps/sierra-estates-realty/lib/services/AirtableIntegrationService.ts',
  'apps/sierra-estates-realty/next.config.ts'
];

files.forEach(resolveFile);
