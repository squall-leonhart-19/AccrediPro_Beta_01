---
description: Verify all niche mini diplomas have correct method names, lesson content, and zombie profiles — run after creating or editing any niche
---

# Niche Mini Diploma Consistency Checker

Run this verification workflow after creating a new mini diploma, editing lesson content, or modifying niche blueprints. This ensures all niche-specific data is consistent across the system.

## 1. Method Name Consistency

// turbo
Run the method name audit script to verify lesson JSONs match their blueprint method:

```bash
cd /Users/pochitino/Desktop/accredipro-lms && python3 -c "
import json, os
content_dir = 'src/components/mini-diploma/lessons/content'
blueprint_dir = 'src/data/niche-blueprints'
errors = 0
for f in sorted(os.listdir(content_dir)):
    if not f.endswith('.json'): continue
    niche = f.replace('.json','')
    bp_path = os.path.join(blueprint_dir, f)
    if not os.path.exists(bp_path):
        print(f'  ⚠️  {niche}: NO BLUEPRINT FOUND')
        errors += 1
        continue
    bp = json.load(open(bp_path))
    method_name = bp.get('method',{}).get('name','')
    content = open(os.path.join(content_dir, f)).read()
    depth = content.count('D.E.P.T.H')
    has_method = method_name.split(' ')[0].replace('™','') in content if method_name else False
    if niche != 'functional-medicine' and depth > 0:
        print(f'  ❌ {niche}: Has {depth} D.E.P.T.H. refs (should be {method_name})')
        errors += 1
    elif not has_method:
        print(f'  ⚠️  {niche}: Correct method ({method_name}) not found in content')
        errors += 1
    else:
        print(f'  ✅ {niche}: {method_name}')
print(f'\n{\"ALL CLEAR\" if errors == 0 else f\"{errors} ERRORS FOUND\"}')"
```

**Expected**: All niches show ✅ with their correct method name. Zero D.E.P.T.H. references outside of functional-medicine.

## 2. Zombie Profile Uniqueness

// turbo
Verify each niche has a unique zombie profile:

```bash
cd /Users/pochitino/Desktop/accredipro-lms && python3 -c "
import json, os
zombie_dir = 'src/data/zombies'
seen_names = {}
for f in sorted(os.listdir(zombie_dir)):
    if not f.endswith('.json'): continue
    z = json.load(open(os.path.join(zombie_dir, f)))
    name = z.get('firstName', z.get('name', 'UNKNOWN'))
    niche = f.replace('.json','')
    if name in seen_names:
        print(f'  ❌ DUPLICATE: {name} used by {seen_names[name]} AND {niche}')
    else:
        print(f'  ✅ {niche}: {name}')
    seen_names[name] = niche
print(f'\n{len(seen_names)} unique zombie profiles')"
```

**Expected**: Each niche has a unique zombie name. No duplicates.

## 3. Diploma Config Slug Mapping

// turbo
Verify every niche in the landing page registry has a matching diploma config:

```bash
cd /Users/pochitino/Desktop/accredipro-lms && grep -oP '"[a-z-]+-diploma"' src/components/lead-portal/diploma-configs.ts | sort
```

Cross-check against content JSONs:

```bash
ls src/components/mini-diploma/lessons/content/ | sed 's/.json//' | sort
```

**Expected**: Every content JSON has a matching diploma config entry.

## 4. Build Verification

// turbo
Run the production build to catch any TypeScript errors:

```bash
cd /Users/pochitino/Desktop/accredipro-lms && npx next build 2>&1 | tail -5
```

**Expected**: Exit code 0, no errors.

## 5. Auto-Fix (if needed)

If Step 1 finds D.E.P.T.H. references in non-FM niches, run the fix script:

```bash
cd /Users/pochitino/Desktop/accredipro-lms && python3 scripts/fix-lesson-methods.py
```

Then re-run Step 1 to verify the fix.
