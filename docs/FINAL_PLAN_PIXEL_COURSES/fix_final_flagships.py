#!/usr/bin/env python3
"""
Fix 2 flagship names and regenerate CSV:
1. SageHerbalism: Create "Certified Clinical Herbalist™" 
2. BellaPetWellness: Create "Certified Pet Wellness Specialist™"
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
FLAGSHIP_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/flagship-courses.csv"

# Correct 16 Flagships with FIXED names
FLAGSHIP_MAP = {
    "SarahFunctionalMedicine": "Certified Functional Medicine Practitioner™",
    "SarahWomensHormones": "Certified Women's Hormone Health Specialist™",
    "SarahIntegrativeMedicine": "Certified Integrative Medicine Practitioner™",
    "OliviaNarcTrauma": "Certified Narcissistic Abuse Recovery Specialist™",
    "OliviaNeurodiversity": "Certified Autism & Neurodiversity Support Specialist™",
    "OliviaGriefEndoflife": "Certified Grief & Loss Specialist™",
    "LunaSpiritualEnergy": "Certified Energy Healing Practitioner™",
    "LunaSexIntimacy": "Certified Sex Practitioner™",
    "MayaMindfulness": "Certified EFT/Tapping Therapist™",
    "MayaTherapyModalities": "Certified Gestalt Therapy Practitioner™",
    "EmmaParenting": "Certified Conscious Parenting Coach™",
    "EmmaFertilityBirth": "Certified Birth Doula Coach™",
    # FIXED:
    "BellaPetWellness": "Certified Pet Wellness Specialist™",  # NEW - not "Senior Pet"
    "SageHerbalism": "Certified Clinical Herbalist™",  # NEW - not "Ayurvedic Herbalism"
    "GraceFaithBased": "Certified Christian Life Coach™",
    "RachelInclusiveWellness": "Certified LGBTQ+ Affirming Wellness Coach™",
}

def slugify(text):
    import re
    text = text.lower()
    text = re.sub(r'[™®©]', '', text)
    text = re.sub(r'certified\s+', '', text)
    text = re.sub(r'[&+]', '-and-', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')[:50]

def tagify(text):
    return slugify(text).replace('-', '_')

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    flagships = {}
    
    # First pass: find exact matches
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        course = row.get('Course Name', '').strip()
        
        if pixel in FLAGSHIP_MAP and FLAGSHIP_MAP[pixel] == course:
            flagships[pixel] = row
            row['Tier'] = 'FLAGSHIP'
            row['Status'] = 'PRIORITY 1'
            print(f"✅ Found: {pixel:30} | {course}")
    
    # Create missing flagships (Pet Wellness and Clinical Herbalist)
    for pixel, course_name in FLAGSHIP_MAP.items():
        if pixel not in flagships:
            # Find any course from this pixel to use as template
            template = None
            for row in rows:
                if row.get('Pixel ID') == pixel:
                    template = row.copy()
                    break
            
            if template:
                # Create new flagship
                slug = slugify(course_name)
                tag = tagify(course_name)
                code = pixel[:2].upper() + "000"
                
                template['Course Name'] = course_name
                template['L1 Slug'] = slug
                template['L1 Tag'] = f"{tag}_purchased"
                template['CF L1 SKU'] = f"{slug}-certification"
                template['Sales Page Slug'] = f"{slug}-certification"
                template['Checkout Slug'] = f"checkout-{slug}"
                template['Thank You Page Slug'] = f"thank-you-{slug}"
                template['Tier'] = 'FLAGSHIP'
                template['Status'] = 'PRIORITY 1'
                template['Priority'] = '1'
                
                flagships[pixel] = template
                print(f"✨ Created: {pixel:30} | {course_name}")
    
    # Write flagship file
    flagship_rows = [flagships[p] for p in sorted(flagships.keys())]
    
    with open(FLAGSHIP_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flagship_rows)
    
    print(f"\n✅ Created {len(flagship_rows)} flagships → {FLAGSHIP_FILE}")

if __name__ == "__main__":
    main()
