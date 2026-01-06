#!/usr/bin/env python3
"""
Fix pixel assignments and create final 16 flagships
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = INPUT_FILE
FLAGSHIP_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/flagship-courses.csv"

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    updated = 0
    
    # Fix and add courses
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        course_name = row.get('Course Name', '').strip()
        
        # Fix: Move Integrative Medicine from Grace to Sarah
        if pixel == "GraceFaithBased" and "Integrative Medicine" in course_name:
            row['Pixel ID'] = "SarahIntegrativeMedicine"
            row['Coach'] = "Sarah"
            row['Category'] = "INTEGRATIVE MEDICINE"
            print(f"🔄 Fixed: {course_name} → SarahIntegrativeMedicine")
            updated += 1
        
        # Promote Ayurveda to FRONTEND for SarahIntegrativeMedicine (backup)
        if pixel == "SarahIntegrativeMedicine" and "Ayurveda Foundations" in course_name:
            row['Tier'] = 'FRONTEND'
            row['Status'] = 'GENERATE NOW'
            print(f"✅ Promoted: {course_name}")
            updated += 1
    
    # Write back
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"\n📊 Updated {updated} courses")
    
    # Extract flagships (first FRONTEND per pixel)
    pixel_flagships = {}
    
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        tier = row.get('Tier', '').strip()
        
        if tier == 'FRONTEND' and pixel not in pixel_flagships:
            pixel_flagships[pixel] = row
    
    flagship_rows = [pixel_flagships[p] for p in sorted(pixel_flagships.keys())]
    
    # Write flagships
    with open(FLAGSHIP_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flagship_rows)
    
    print(f"\n✅ Created {len(flagship_rows)} flagships")
    for pixel in sorted(pixel_flagships.keys()):
        print(f"  {pixel:30} | {pixel_flagships[pixel]['Course Name']}")

if __name__ == "__main__":
    main()
