import os

target_dir = r"c:\Users\ap877\2026\Ayush-Paul\src"
target_color = "0b1c30"
replacement_color = "000000"

print(f"Starting replacement of '{target_color}' with '{replacement_color}'...")

count = 0
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css', '.html')):
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if target_color in content:
                    # Match case variations just in case
                    content_lower = content.lower()
                    new_content = content
                    
                    # Simple replacements
                    new_content = new_content.replace(target_color, replacement_color)
                    new_content = new_content.replace(target_color.upper(), replacement_color)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    
                    print(f"Updated: {file_path}")
                    count += 1
            except Exception as e:
                print(f"Error processing {file_path}: {e}")

print(f"Finished replacement. Total files updated: {count}")
