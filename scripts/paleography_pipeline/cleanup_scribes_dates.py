import os

SCRIPTS_DIR = "_scribes"

for fname in os.listdir(SCRIPTS_DIR):
    if not fname.endswith('.md'): continue
    path = os.path.join(SCRIPTS_DIR, fname)
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    new_lines = []
    for line in lines:
        if line.strip().startswith('date:'):
            # skip this line
            continue
        new_lines.append(line)
    with open(path, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
print('Cleaned date fields from _scribes/*.md')
