#!/usr/bin/env python3
"""
Extract flagship courses - use first FRONTEND course from each pixel
"""
import csv
from collections import defaultdict

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/flagship-courses.csv"

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    # Get first FRONTEND course per pixel
    pixel_flagships = {}
    
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        tier = row.get('Tier', '').strip()
        
        if tier == 'FRONTEND' and pixel not in pixel_flagships:
            pixel_flagships[pixel] = row
            print(f"✅ {pixel:30} | {row['Course Name']}")
    
    # Sort by pixel name
    flagship_rows = [pixel_flagships[p] for p in sorted(pixel_flagships.keys())]
    
    # Write output
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flagship_rows)
    
    print(f"\n✅ Saved {len(flagship_rows)} flagship courses to: {OUTPUT_FILE}")
    print(f"\nPixels: {sorted(pixel_flagships.keys())}")

if __name__ == "__main__":
    main()
