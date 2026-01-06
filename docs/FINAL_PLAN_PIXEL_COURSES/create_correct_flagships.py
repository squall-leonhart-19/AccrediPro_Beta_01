#!/usr/bin/env python3
"""
Create FINAL 16 flagships with EXACT course names
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
FLAGSHIP_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/flagship-courses.csv"

# EXACT 16 Flagships (pixel: EXACT course name or unique pattern)
FLAGSHIP_MAP = {
    "SarahFunctionalMedicine": "Certified Functional Medicine Practitioner™",
    "SarahWomensHormones": "Certified Women's Hormone Health Specialist™",
    "SarahIntegrativeMedicine": "Certified Integrative Medicine Practitioner™",
    "OliviaNarcTrauma": "Certified Narcissistic Abuse Recovery Specialist™",
    "OliviaNeurodiversity": "Certified Autism & Neurodiversity Support Specialist™",
    "OliviaGriefEndoflife": "Certified Grief & Loss Specialist™",
    "LunaSpiritualEnergy": "Certified Energy Healing Practitioner™",
    "LunaSexIntimacy": "Certified Sex Practitioner™",
    "MayaMindfulness": "Certified EFT/Tapping Therapist™",  # Use EFT from Maya
    "MayaTherapyModalities": "Certified Gestalt Therapy Practitioner™",  # Best therapy
    "EmmaParenting": "Certified Conscious Parenting Coach™",
    "EmmaFertilityBirth": "Certified Birth Doula Coach™",
    "BellaPetWellness": "Certified Senior Pet Wellness Specialist™",
    "SageHerbalism": "Certified Ayurvedic Herbalism Coach™",
    "GraceFaithBased": "Certified Christian Life Coach™",
    "RachelInclusiveWellness": "Certified LGBTQ+ Affirming Wellness Coach™",
}

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    flagships = {}
    
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        course = row.get('Course Name', '').strip()
        
        # Match by pixel AND course name
        if pixel in FLAGSHIP_MAP and FLAGSHIP_MAP[pixel] == course:
            flagships[pixel] = row
            row['Tier'] = 'FLAGSHIP'
            row['Status'] = 'PRIORITY 1'
            print(f"✅ {pixel:30} | {course}")
    
    # Check missing
    missing = set(FLAGSHIP_MAP.keys()) - set(flagships.keys())
    if missing:
        print(f"\n⚠️  Missing: {missing}")
        print("\nSearching looser matches...")
        for row in rows:
            pixel = row.get('Pixel ID', '').strip()
            course = row.get('Course Name', '').strip()
            if pixel in missing:
                target = FLAGSHIP_MAP[pixel]
                # Check if target is substring
                if target.replace("™", "").lower() in course.lower() or course.replace("™", "").lower() in target.lower():
                    flagships[pixel] = row
                    row['Tier'] = 'FLAGSHIP'
                    row['Status'] = 'PRIORITY 1'
                    print(f"✅ {pixel:30} | {course} (loose match)")
                    missing.remove(pixel)
                    if not missing:
                        break
    
    # Write flagship file
    flagship_rows = [flagships[p] for p in sorted(flagships.keys())]
    
    with open(FLAGSHIP_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flagship_rows)
    
    print(f"\n✅ Created {len(flagship_rows)} flagships → {FLAGSHIP_FILE}")

if __name__ == "__main__":
    main()
