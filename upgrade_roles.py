import json
import re

# Read the file
with open('client/js/roles_data.js', 'r') as f:
    content = f.read()

# Extract JSON part (everything between first [ and last ])
match = re.search(r'\[.*\]', content, re.DOTALL)
if not match:
    print("Could not find JSON array")
    exit(1)

json_str = match.group(0)
data = json.loads(json_str)

def slugify(text):
    # Extract the English name part before the parenthesis if possible
    # "RevenuePredictor (Previsão de receita)" -> "RevenuePredictor"
    main_name = text.split('(')[0].strip()
    return main_name.lower().replace(' ', '-')

# Transform
for category in data:
    for role in category['roles']:
        new_tools = []
        for tool_str in role['tools']:
            tool_id = slugify(tool_str)
            tool_obj = {
                "id": tool_id,
                "name": tool_str,
                "active": False # Default to inactive
            }
            
            # Activate specific tools we are building
            if "RevenuePredictor" in tool_str:
                tool_obj["active"] = True
                tool_obj["id"] = "revenue-predictor"
            
            new_tools.append(tool_obj)
        role['tools'] = new_tools

# Write back
with open('client/js/roles_data.js', 'w') as f:
    f.write('const ROLES_DATA = \n')
    f.write(json.dumps(data, indent=4, ensure_ascii=False))
    f.write(';\n')

print("Roles data upgraded successfully.")
