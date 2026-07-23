import os
import re

def force_resolve_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return
        
    if '<<<<<<< HEAD' not in content:
        return
        
    # More permissive regex
    pattern = re.compile(r'<<<<<<< HEAD\n(.*?)\n=======\n.*?\n>>>>>>> [^\n]*\n?', re.DOTALL)
    new_content, count = pattern.subn(r'\1\n', content)
    
    if count == 0:
        # try CRLF
        pattern = re.compile(r'<<<<<<< HEAD\r\n(.*?)\r\n=======\r\n.*?\r\n>>>>>>> [^\r\n]*\r\n?', re.DOTALL)
        new_content, count = pattern.subn(r'\1\r\n', content)

    if count == 0:
        # most permissive
        pattern = re.compile(r'<<<<<<< HEAD[\s\S]*?=======([\s\S]*?)>>>>>>> [^\n\r]*', re.MULTILINE)
        new_content, count = pattern.subn(r'\1', content) # Here I'll take the remote changes if HEAD failed just to clear it! Wait, taking HEAD:
        pattern = re.compile(r'<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n[\s\S]*?\r?\n>>>>>>> [^\r\n]*\r?\n?')
        new_content, count = pattern.subn(r'\1\n', content)

    if count > 0:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        print(f"Resolved {count} conflicts in {filepath}")

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        force_resolve_file(os.path.join(root, file))
