#!/usr/bin/env python3
"""
Update catalog - promote remaining courses to FRONTEND using partial matching
"""
import csv
import re

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = INPUT_FILE

# Partial matches for courses to promote
PROMOTE_PATTERNS = [
    # Already done - these will be skipped
    # Missing ones:
    (r"Sound Bath", "Certified Sound Bath Facilitator™"),
    (r"TRE.*Trauma.*Release", "Certified TRE Therapist™"),
    (r"Cannabis.*CBD", "Certified Cannabis & CBD Wellness Coach™"),
    (r"Adaptogen", "Certified Herbal Stress & Adaptogenic Coach™"),
    (r"Art Therapy", "Certified Art Therapy Facilitator™"),
    (r"Music Therapy", "Certified Music Therapy Practitioner™"),
    (r"Equine.*Therapy", "Certified Equine Therapy Specialist™"),
    (r"Animal.*Assisted.*Therapy", "Certified Animal-Assisted Therapy Specialist™"),
]

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    updated_count = 0
    current_max_priority = 0
    
    # Find current max priority for FRONTEND
    for row in rows:
        if row['Tier'] == 'FRONTEND':
            try:
                priority = int(row.get('Priority', 0))
                current_max_priority = max(current_max_priority, priority)
            except:
                pass
    
    next_priority = current_max_priority + 1
    
    for row in rows:
        course_name = row.get('Course Name', '').strip()
        tier = row.get('Tier', '')
        
        # Skip if already FRONTEND
        if tier == 'FRONTEND':
            continue
        
        # Check patterns
        for pattern, display_name in PROMOTE_PATTERNS:
            if re.search(pattern, course_name, re.IGNORECASE):
                old_tier = row['Tier']
                row['Tier'] = 'FRONTEND'
                row['Status'] = 'GENERATE NOW'
                row['Priority'] = str(next_priority)
                next_priority += 1
                updated_count += 1
                print(f"✅ Promoted: {course_name} (was {old_tier})")
                break
    
    # Write back
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"\n📊 Updated {updated_count} more courses to FRONTEND")
    print(f"✅ Saved to: {OUTPUT_FILE}")
    
    # Stats
    tiers = {}
    for row in rows:
        tier = row['Tier']
        tiers[tier] = tiers.get(tier, 0) + 1
    
    print("\n📊 Final Tier Distribution:")
    for tier, count in sorted(tiers.items()):
        print(f"  {tier}: {count}")

if __name__ == "__main__":
    main()
