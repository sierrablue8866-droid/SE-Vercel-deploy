const https = require('https');

https.get('https://admin.sierra-estates.net/assets/index-DPfowADs.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Look for path definitions (React Router or similar)
    const routes = [...data.matchAll(/path\s*:\s*['"](\/[a-zA-Z0-9\-/]*)['"]/g)].map(m => m[1]);
    
    // Look for string literals that might be labels/features
    const strings = [...data.matchAll(/[\"']([a-zA-Z\s/-]{5,50})[\"']/g)].map(m => m[1]);
    const uniqueStrings = [...new Set(strings)];
    
    // Look for common admin features
    const features = [
      'Users', 'Leads', 'Compounds', 'Properties', 'Agents', 'Workflows',
      'Settings', 'Roles', 'Permissions', 'Analytics', 'Reports', 'API',
      'Webhooks', 'Integrations', 'Billing', 'CRM', 'Logs', 'AI'
    ].filter(f => data.toLowerCase().includes(f.toLowerCase()));
    
    console.log('--- EXTRACTED ROUTES ---');
    console.log([...new Set(routes)].join('\n'));
    
    console.log('\n--- DETECTED FEATURES ---');
    console.log(features.join(', '));
    
    console.log('\n--- SAMPLE STRINGS (Top 50) ---');
    console.log(uniqueStrings.filter(s => s.trim().length > 10).slice(0, 50).join('\n'));
  });
}).on('error', err => console.error(err));
