#!/usr/bin/env python3
"""
Update all CSVs with Luna pixel split:
- LunaSpiritualEnergy → LunaEnergyHealing + LunaEsoteric
"""
import csv
import re

FLAGSHIP_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/flagship-courses.csv"
EXPANSION_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/Expansion_Pixels_2nd_Launch.csv"

def slugify(text):
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

def create_row(pixel, coach, course_name, tier, priority, fieldnames):
    slug = slugify(course_name)
    tag = tagify(course_name)
    code = pixel[:2].upper() + f"{priority:03d}"
    
    return {
        'Category': '',
        'Coach': coach,
        'Pixel ID': pixel,
        'Course Code': code,
        'Course Name': course_name,
        'L1 Slug': slug,
        'L2 Slug': f"{code.lower()}-pro-advanced",
        'L3 Slug': f"{code.lower()}-pro-master",
        'L4 Slug': f"{code.lower()}-pro-practice",
        'L1 Tag': f"{tag}_purchased",
        'PRO Tag': f"{code.lower()}_pro_accelerator_purchased",
        'CF L1 SKU': f"{slug}-certification",
        'CF PRO SKU': f"{code.lower()}-pro-accelerator",
        'Sales Page Slug': f"{slug}-certification",
        'Checkout Slug': f"checkout-{slug}",
        'OTO 1 Slug': f"oto-{code.lower()}-pro-accelerator",
        'Thank You Page Slug': f"thank-you-{slug}",
        'L1 Price': '97',
        'PRO Price': '397',
        'Status': 'PRIORITY 1' if tier == 'FLAGSHIP' else 'GENERATE WEEK 2',
        'Tier': tier,
        'Priority': str(priority),
    }

# New Luna courses
LUNA_ENERGY_HEALING = [
    ("LunaEnergyHealing", "Luna", "Certified Energy Healing Practitioner™", "FLAGSHIP"),
    ("LunaEnergyHealing", "Luna", "Certified Reiki Master Practitioner™", "EXPANSION"),
    ("LunaEnergyHealing", "Luna", "Certified Sound Healing Practitioner™", "EXPANSION"),
    ("LunaEnergyHealing", "Luna", "Certified Crystal Healing Practitioner™", "EXPANSION"),
    ("LunaEnergyHealing", "Luna", "Certified Chakra Healing Practitioner™", "EXPANSION"),
]

LUNA_ESOTERIC = [
    ("LunaEsoteric", "Luna", "Certified Akashic Records Practitioner™", "FLAGSHIP"),
    ("LunaEsoteric", "Luna", "Certified Past Life Regression Therapist™", "EXPANSION"),
    ("LunaEsoteric", "Luna", "Certified Astrology Practitioner™", "EXPANSION"),
    ("LunaEsoteric", "Luna", "Certified Human Design Specialist™", "EXPANSION"),
    ("LunaEsoteric", "Luna", "Certified Tarot & Oracle Reader™", "EXPANSION"),
]

def main():
    # Read existing flagship
    with open(FLAGSHIP_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        flagships = list(reader)
        fieldnames = reader.fieldnames
    
    # Remove old LunaSpiritualEnergy flagship
    flagships = [r for r in flagships if r['Pixel ID'] != 'LunaSpiritualEnergy']
    
    # Add new Luna flagships
    priority = len(flagships) + 1
    for pixel, coach, course, tier in LUNA_ENERGY_HEALING + LUNA_ESOTERIC:
        if tier == 'FLAGSHIP':
            flagships.append(create_row(pixel, coach, course, tier, priority, fieldnames))
            priority += 1
    
    # Sort by pixel
    flagships.sort(key=lambda x: x['Pixel ID'])
    
    # Write flagship
    with open(FLAGSHIP_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(flagships)
    
    print(f"✅ Updated flagships: {len(flagships)} courses")
    
    # Read existing expansion
    with open(EXPANSION_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        expansions = list(reader)
        fieldnames = reader.fieldnames
    
    # Remove old LunaSpiritualEnergy expansions
    expansions = [r for r in expansions if r['Pixel ID'] != 'LunaSpiritualEnergy']
    
    # Add new Luna expansions
    priority = len(expansions) + 1
    for pixel, coach, course, tier in LUNA_ENERGY_HEALING + LUNA_ESOTERIC:
        if tier == 'EXPANSION':
            expansions.append(create_row(pixel, coach, course, tier, priority, fieldnames))
            priority += 1
    
    # Sort by pixel
    expansions.sort(key=lambda x: x['Pixel ID'])
    
    # Write expansion
    with open(EXPANSION_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(expansions)
    
    print(f"✅ Updated expansions: {len(expansions)} courses")
    
    # Show pixel counts
    print("\n📊 New Pixel Distribution (Flagships):")
    pixels = {}
    for row in flagships:
        pixel = row['Pixel ID']
        pixels[pixel] = pixels.get(pixel, 0) + 1
    for pixel in sorted(pixels.keys()):
        print(f"  {pixel}: {pixels[pixel]}")

if __name__ == "__main__":
    main()
