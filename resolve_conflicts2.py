import os

def resolve_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception:
        return
        
    new_lines = []
    keep = True
    resolved = 0
    for line in lines:
        if line.startswith('<<<<<<< HEAD'):
            resolved += 1
            continue
        if line.startswith('======='):
            keep = False
            continue
        if line.startswith('>>>>>>>'):
            keep = True
            continue
        
        if keep:
            new_lines.append(line)
            
    if resolved > 0:
        with open(filepath, 'w', encoding='utf-8', newline='') as f:
            f.writelines(new_lines)
        print(f"Resolved {resolved} conflicts in {filepath}")

for root, dirs, files in os.walk('apps/sierra-estates-realty'):
    for file in files:
        if file.endswith(('.ts', '.tsx', '.js', '.mjs', '.json', '.rules', '.css', '.html')):
            resolve_file(os.path.join(root, file))
