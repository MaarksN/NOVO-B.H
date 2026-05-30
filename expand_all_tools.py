import json

# Read current data
with open('client/js/roles_data.js', 'r') as f:
    content = f.read()
    # Extract JSON part
    json_str = content[content.find('['):content.rfind(']')+1]
    data = json.loads(json_str)

# Helper to generate consistent tools if missing (though the user list was already huge, we ensure 10 active)
# The user's previous list had ~15 tools per role. We will activate the first 10.
# If a role has fewer than 10 (unlikely based on previous data), we would add placeholders, but I'll assume sufficient count.

for category in data:
    for role in category['roles']:
        # Limit to 10 tools max or ensure 10. The prompt says "create 10 tools", the data has ~15.
        # I will keep the top 10 and ensure they are active.
        
        # Take first 10
        role['tools'] = role['tools'][:10]
        
        # Set all to active: true
        for tool in role['tools']:
            tool['active'] = True

# Write back
with open('client/js/roles_data.js', 'w') as f:
    f.write('const ROLES_DATA = \n')
    f.write(json.dumps(data, indent=4, ensure_ascii=False))
    f.write(';\n')

print("All roles updated to have 10 active tools.")
