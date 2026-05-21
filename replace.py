import os
import re

files_to_check = [
    r'c:\Users\MML\Documents\projek2\projek2\index.html',
    r'c:\Users\MML\Documents\projek2\projek2\jscp\main.js',
    r'c:\Users\MML\Documents\projek2\projek2\jscp\settings.js',
    r'c:\Users\MML\Documents\projek2\projek2\jscp\ui.js',
    r'c:\Users\MML\Documents\projek2\projek2\lang.js'
]

replacements = {
    "HAPPYBIRTHDAY": "HAPPYANNIVERSARY",
    "HAPPY|BIRTHDAY": "HAPPY|ANNIVERSARY",
    "Happy Birthday": "Happy Anniversary",
    "happy birthday": "happy anniversary",
    "HAPPY BIRTHDAY": "HAPPY ANNIVERSARY"
}

for filepath in files_to_check:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath}, does not exist.")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original_content = content
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
    else:
        print(f"No changes for {filepath}")
