const fs = require('fs');
const path = require('path');
const dir = 'apps/sierra-estates-realty/public/client-page';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const supabaseComment = '<!-- Supabase JS SDK (PostgreSQL + Realtime + Auth) -->';
const firebaseComment = '<!-- Firebase JS SDK (Firestore) -->\n<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>\n<script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>';

for (let file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  if (content.includes(supabaseComment)) {
    content = content.replace(supabaseComment, firebaseComment);
    changed = true;
  }
  if (content.includes('supabase.min.js')) {
    content = content.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/@supabase\/supabase-js.*"><\/script>\r?\n?/g, '');
    changed = true;
  }
  if (content.includes('supabase-config.js')) {
    content = content.replace(/<script src="supabase-config\.js"><\/script>/g, '<script src="firebase-config.js"></script>');
    changed = true;
  }
  if (content.includes('supabase.js')) {
    content = content.replace(/<script src="supabase\.js"><\/script>/g, '<script src="firebase-data.js"></script>');
    changed = true;
  }
  
  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
