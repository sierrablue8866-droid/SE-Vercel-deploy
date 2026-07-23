import os
import re

def resolve_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return
    
    pattern = re.compile(r'<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>> [^\r\n]*\r?\n?', re.DOTALL)
    new_content, count = pattern.subn(r'\1\n', content)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.write(new_content)
        print(f"Resolved {count} conflicts in {filepath}")

for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root:
        continue
    for file in files:
        resolve_file(os.path.join(root, file))
