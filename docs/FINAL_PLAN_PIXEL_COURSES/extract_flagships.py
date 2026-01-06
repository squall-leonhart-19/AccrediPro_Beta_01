#!/usr/bin/env python3
"""
Extract 16 flagship courses with full nomenclature from catalog
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/flagship-courses.csv"

# 16 Flagship courses (one per pixel)
FLAGSHIP_COURSES = {
    "SarahFunctionalMedicine": "Certified Functional Medicine Practitioner™",
    "SarahWomensHormones": "Certified Women's Hormone Health Specialist™",
    "SarahIntegrativeMedicine": "Certified Integrative Medicine Practitioner™",
    "OliviaNarcTrauma": "Certified Narcissistic Abuse Recovery Specialist™",
    "OliviaNeurodiversity": "Certified ADHD Support Specialist™",
    "OliviaGriefEndoflife": "Certified Grief & Loss Specialist™",
    "LunaSpiritualEnergy": "Certified Energy Healing Practitioner™",
    "LunaSexIntimacy": "Certified Sex & Intimacy Practitioner™",
    "MayaMindfulness": "Certified Meditation & Mindfulness Therapist™",
    "MayaTherapyModalities": "Certified EFT/Tapping Therapist™",
    "EmmaParenting": "Certified Conscious Parenting Coach™",
    "EmmaFertilityBirth": "Certified Birth & Postpartum Doula Coach™",
    "BellaPetWellness": "Certified Pet Wellness Specialist™",
    "SageHerbalism": "Certified Clinical Herbalist™",
    "GraceFaithBased": "Certified Christian Life Coach™",
    "RachelInclusiveWellness": "Certified LGBTQ+ Affirming Life Coach™",
}

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    flagship_rows = []
    found_pixels = set()
    
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        course_name = row.get('Course Name', '').strip()
        
        if pixel in FLAGSHIP_COURSES and FLAGSHIP_COURSES[pixel] == course_name:
            flagship_rows.append(row)
            found_pixels.add(pixel)
            print(f"✅ {pixel:30} | {course_name}")
    
    # Check for missing
    missing = set(FLAGSHIP_COURSES.keys()) - found_pixels
    if missing:
        print(f"\n⚠️  Missing pixels: {missing}")
    
    # Sort by pixel name
    flagship_rows.sort(key=lambda x: x['Pixel ID'])
    
    # Write output
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flagship_rows)
    
    print(f"\n✅ Saved {len(flagship_rows)} flagship courses to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
