#!/usr/bin/env python3
"""
Update catalog to move 23 courses from CATALOG/QUICKWIN to FRONTEND
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"

# Courses to promote to FRONTEND
PROMOTE_TO_FRONTEND = [
    # Emma (3)
    "Certified Child Sleep Coach™",
    "Certified Breastfeeding Support Coach™",
    "Certified Birth & Postpartum Doula™",
    
    # Olivia (6)
    "Certified Intuitive Eating Specialist™",
    "Certified Burnout & Stress Recovery Specialist™",
    "Certified Body Image Specialist™",
    "Certified Emotional Resilience Specialist™",
    "Certified Masking & Burnout Specialist™",
    "Certified End-of-Life Doula Specialist™",
    
    # Sarah (4)
    "Certified Holistic Nutrition Specialist™",
    "Certified Stress & Sleep Optimization Specialist™",
    "Certified Men's Stress & Burnout Specialist™",
    "Certified Midwife Health Specialist™",
    
    # Grace (2)
    "Certified Faith-Based Wellness Coach™",
    "Certified Faith-Based Recovery Coach™",
    
    # Sage (2)
    "Certified Cannabis & CBD Wellness Specialist™",
    "Certified Herbal Stress & Adaptogenic Specialist™",
    
    # Maya (4)
    "Certified Art Therapy Facilitator™",
    "Certified Music Therapy Practitioner™",
    "Certified TRE (Trauma Release) Therapist™",
    "Certified Sound Healing Practitioner™",
    
    # Bella (2)
    "Certified Equine Therapy Specialist™",
    "Certified Animal-Assisted Therapy Specialist™",
]

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    updated_count = 0
    frontend_priority = 44  # Start after existing 43
    
    for row in rows:
        course_name = row.get('Course Name', '').strip()
        
        if course_name in PROMOTE_TO_FRONTEND:
            old_tier = row['Tier']
            row['Tier'] = 'FRONTEND'
            row['Status'] = 'GENERATE NOW'
            row['Priority'] = str(frontend_priority)
            frontend_priority += 1
            updated_count += 1
            print(f"✅ Promoted: {course_name} (was {old_tier})")
    
    # Write back
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"\n📊 Updated {updated_count} courses to FRONTEND")
    print(f"✅ Saved to: {OUTPUT_FILE}")
    
    # Stats
    tiers = {}
    for row in rows:
        tier = row['Tier']
        tiers[tier] = tiers.get(tier, 0) + 1
    
    print("\n📊 New Tier Distribution:")
    for tier, count in sorted(tiers.items()):
        print(f"  {tier}: {count}")

if __name__ == "__main__":
    main()
