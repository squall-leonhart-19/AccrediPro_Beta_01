#!/usr/bin/env python3
"""
Add 2 missing pixels to FRONTEND and regenerate flagships
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = INPUT_FILE
FLAGSHIP_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/flagship-courses.csv"

# Add these to FRONTEND
ADD_TO_FRONTEND = [
    "Certified Sex Practitioner™",  # LunaSexIntimacy
    "Certified Integrative Medicine Practitioner™",  # SarahIntegrativeMedicine
]

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    # Promote courses to FRONTEND
    updated_count = 0
    max_priority = 0
    
    # Find max priority
    for row in rows:
        try:
            priority = int(row.get('Priority', 0))
            max_priority = max(max_priority, priority)
        except:
            pass
    
    next_priority = max_priority + 1
    
    for row in rows:
        course_name = row.get('Course Name', '').strip()
        
        if course_name in ADD_TO_FRONTEND:
            row['Tier'] = 'FRONTEND'
            row['Status'] = 'GENERATE NOW'
            row['Priority'] = str(next_priority)
            next_priority += 1
            updated_count += 1
            print(f"✅ Promoted: {row['Pixel ID']:30} | {course_name}")
    
    # Write back
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"\n📊 Promoted {updated_count} courses to FRONTEND")
    
    # Now extract flagships
    pixel_flagships = {}
    
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        tier = row.get('Tier', '').strip()
        
        if tier == 'FRONTEND' and pixel not in pixel_flagships:
            pixel_flagships[pixel] = row
    
    # Sort by pixel name
    flagship_rows = [pixel_flagships[p] for p in sorted(pixel_flagships.keys())]
    
    # Write flagship file
    with open(FLAGSHIP_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flagship_rows)
    
    print(f"\n✅ Updated flagship-courses.csv with {len(flagship_rows)} flagships")
    print(f"\nPixels: {list(sorted(pixel_flagships.keys()))}")

if __name__ == "__main__":
    main()
