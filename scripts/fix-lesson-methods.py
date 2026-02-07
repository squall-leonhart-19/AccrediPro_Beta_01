#!/usr/bin/env python3
"""
Fix lesson content JSONs to use the correct niche-specific method names
instead of D.E.P.T.H. Method™ which was copied from Functional Medicine.

Source of truth: niche-blueprints/*.json (method.name, method.steps)
Target: lessons/content/*.json
"""

import json
import os
import re

CONTENT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'components', 'mini-diploma', 'lessons', 'content')
BLUEPRINT_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'niche-blueprints')

# D.E.P.T.H. step definitions (what we're replacing FROM)
DEPTH_STEPS = {
    "D": {"letter": "D", "word": "Discover", "title": "Discover"},
    "E": {"letter": "E", "word": "Evaluate", "title": "Evaluate"},
    "P": {"letter": "P", "word": "Pinpoint", "title": "Pinpoint"},
    "T": {"letter": "T", "word": "Transform", "title": "Transform"},
    "H": {"letter": "H", "word": "Heal", "title": "Heal"},
}
DEPTH_STEP_WORDS = ["Discover", "Evaluate", "Pinpoint", "Transform", "Heal"]
DEPTH_STEP_FLOW = "Discover → Evaluate → Pinpoint → Transform → Heal"

def load_blueprint(niche_id):
    """Load the niche blueprint to get the correct method info."""
    bp_path = os.path.join(BLUEPRINT_DIR, f'{niche_id}.json')
    if not os.path.exists(bp_path):
        return None
    with open(bp_path, 'r') as f:
        bp = json.load(f)
    return bp.get('method', {})


def fix_method_references(content_str, method_info, niche_id):
    """Replace D.E.P.T.H. method references with correct niche method."""
    method_name = method_info.get('name', '')
    steps = method_info.get('steps', [])
    
    if not method_name or not steps:
        print(f"  ⚠️  No method info for {niche_id}, skipping")
        return content_str
    
    # Get the method name without ™ for pattern matching
    method_name_clean = method_name.replace('™', '').strip()
    
    # Build the correct step flow string
    step_words = [s['word'] for s in steps]
    correct_flow = ' → '.join(step_words)
    
    changes = 0
    
    # 1. Replace method name variations
    # "D.E.P.T.H. Method™" → correct method name
    for pattern in [
        r'D\.E\.P\.T\.H\.\s*Method™',
        r'D\.E\.P\.T\.H\.\s*Method',
        r'the D\.E\.P\.T\.H\.',
        r'D\.E\.P\.T\.H\.',
    ]:
        matches = len(re.findall(pattern, content_str))
        if matches > 0:
            # For "the D.E.P.T.H." pattern, replace with "the [method name]"
            if 'the D' in pattern and 'Method' not in pattern:
                content_str = re.sub(pattern, f'the {method_name}', content_str)
            elif 'Method™' in pattern:
                content_str = re.sub(pattern, method_name, content_str)
            elif 'Method' in pattern:
                content_str = re.sub(pattern, method_name_clean, content_str)
            else:
                content_str = re.sub(pattern, method_name, content_str)
            changes += matches
    
    # 2. Replace the step flow string
    content_str = content_str.replace(DEPTH_STEP_FLOW, correct_flow)
    
    # 3. Replace framework/steps section data if it exists
    # Look for framework items with D.E.P.T.H. step words and replace with correct ones
    # This handles the framework steps array in lesson 2
    for i, depth_step_word in enumerate(DEPTH_STEP_WORDS):
        if i < len(steps):
            correct_step = steps[i]
            # Replace step descriptions in the framework
            # But only replace exact matches in step titles, not in general prose
            # (e.g., "Discover" as a step name, not as a general English word)
            pass  # We handle this through the framework JSON structure below
    
    # 4. Fix the framework steps structure
    try:
        content_obj = json.loads(content_str)
        fix_framework_in_obj(content_obj, steps, method_name)
        content_str = json.dumps(content_obj, indent=4, ensure_ascii=False)
    except json.JSONDecodeError:
        print(f"  ⚠️  Could not parse JSON for framework fix")
    
    return content_str


def fix_framework_in_obj(obj, correct_steps, method_name):
    """Recursively find and fix framework step definitions in the JSON object."""
    if isinstance(obj, dict):
        # Check if this is a framework definition with steps
        if obj.get('type') == 'framework' and 'content' in obj:
            if isinstance(obj['content'], dict):
                fw = obj['content']
                # Fix framework name
                if 'name' in fw and 'D.E.P.T.H' in fw['name']:
                    fw['name'] = method_name
                # Fix framework steps
                if 'steps' in fw and isinstance(fw['steps'], list):
                    for i, step in enumerate(fw['steps']):
                        if i < len(correct_steps):
                            cs = correct_steps[i]
                            step['letter'] = cs['letter']
                            step['title'] = cs.get('title', cs['word'])
                            step['description'] = cs.get('description', step.get('description', ''))
        
        # Check if this is a comparison with "Before D.E.P.T.H." / "After D.E.P.T.H."
        if 'title' in obj and isinstance(obj['title'], str):
            if 'Before D.E.P.T.H' in obj['title']:
                obj['title'] = obj['title'].replace('Before D.E.P.T.H. Method', f'Before {method_name}').replace('Before D.E.P.T.H', f'Before {method_name}')
            if 'After D.E.P.T.H' in obj['title']:
                obj['title'] = obj['title'].replace('After D.E.P.T.H. Method', f'After {method_name}').replace('After D.E.P.T.H', f'After {method_name}')
        
        # Recurse into all dict values
        for key, val in obj.items():
            fix_framework_in_obj(val, correct_steps, method_name)
    
    elif isinstance(obj, list):
        for item in obj:
            fix_framework_in_obj(item, correct_steps, method_name)


def main():
    print("🔧 Fixing lesson content method references...\n")
    
    fixed_count = 0
    
    for filename in sorted(os.listdir(CONTENT_DIR)):
        if not filename.endswith('.json'):
            continue
        
        niche_id = filename.replace('.json', '')
        
        # Skip functional-medicine (it's already correct)
        if niche_id == 'functional-medicine':
            print(f"  ✅ {niche_id}: D.E.P.T.H. is correct (FM)")
            continue
        
        content_path = os.path.join(CONTENT_DIR, filename)
        
        # Load blueprint method info  
        method_info = load_blueprint(niche_id)
        if not method_info:
            print(f"  ⚠️  {niche_id}: No blueprint found, skipping")
            continue
        
        # Read current content
        with open(content_path, 'r') as f:
            content_str = f.read()
        
        # Count D.E.P.T.H. references before
        depth_count = content_str.count('D.E.P.T.H')
        if depth_count == 0:
            print(f"  ✅ {niche_id}: No D.E.P.T.H. references (clean)")
            continue
        
        print(f"  🔄 {niche_id}: Fixing {depth_count} D.E.P.T.H. → {method_info.get('name', '?')}...")
        
        # Fix content
        fixed_content = fix_method_references(content_str, method_info, niche_id)
        
        # Verify fix
        remaining = fixed_content.count('D.E.P.T.H')
        
        # Write fixed content
        with open(content_path, 'w') as f:
            f.write(fixed_content)
        
        if remaining > 0:
            print(f"    ⚠️  Still {remaining} D.E.P.T.H. references remaining")
        else:
            print(f"    ✅ All references fixed")
        
        fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} niche lesson content files")
    
    # Final verification
    print("\n📋 Final verification:")
    for filename in sorted(os.listdir(CONTENT_DIR)):
        if not filename.endswith('.json'):
            continue
        niche_id = filename.replace('.json', '')
        content_path = os.path.join(CONTENT_DIR, filename)
        with open(content_path, 'r') as f:
            content = f.read()
        depth_count = content.count('D.E.P.T.H')
        method_info = load_blueprint(niche_id)
        method_name = method_info.get('name', 'N/A') if method_info else 'N/A'
        correct_count = content.count(method_name.replace('™', '').split(' ')[0]) if method_name != 'N/A' else 0
        status = "✅" if (depth_count == 0 or niche_id == 'functional-medicine') else f"⚠️  {depth_count} remaining"
        print(f"  {status} {niche_id}: D.E.P.T.H.={depth_count}")


if __name__ == '__main__':
    main()
