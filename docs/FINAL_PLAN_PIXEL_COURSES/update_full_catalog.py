#!/usr/bin/env python3
"""
Update full catalog to split LunaSpiritualEnergy into:
- LunaEnergyHealing (hands-on healing)
- LunaEsoteric (readings/intuition)
Also remove Rachel pixel.
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = INPUT_FILE

# Esoteric keywords - these go to LunaEsoteric
ESOTERIC_KEYWORDS = [
    "akashic", "past life", "astrology", "human design", "tarot", "oracle",
    "numerology", "palmistry", "psychic", "medium", "channeling", "divination",
    "scrying", "pendulum", "runes", "i ching", "manifestation", "law of attraction",
    "moon cycle", "lunar", "intuitive development", "clairvoyant"
]

def is_esoteric(course_name):
    """Check if course belongs to LunaEsoteric based on keywords."""
    name_lower = course_name.lower()
    for keyword in ESOTERIC_KEYWORDS:
        if keyword in name_lower:
            return True
    return False

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    updated_luna = 0
    removed_rachel = 0
    
    new_rows = []
    for row in rows:
        pixel = row.get('Pixel ID', '').strip()
        course_name = row.get('Course Name', '').strip()
        
        # Remove Rachel
        if pixel == 'RachelInclusiveWellness':
            removed_rachel += 1
            continue
        
        # Split Luna
        if pixel == 'LunaSpiritualEnergy':
            if is_esoteric(course_name):
                row['Pixel ID'] = 'LunaEsoteric'
            else:
                row['Pixel ID'] = 'LunaEnergyHealing'
            updated_luna += 1
        
        new_rows.append(row)
    
    # Write back
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(new_rows)
    
    print(f"✅ Updated {updated_luna} Luna courses")
    print(f"🗑️  Removed {removed_rachel} Rachel courses")
    print(f"📊 Total courses: {len(new_rows)}")
    
    # Show Luna distribution
    luna_energy = sum(1 for r in new_rows if r['Pixel ID'] == 'LunaEnergyHealing')
    luna_esoteric = sum(1 for r in new_rows if r['Pixel ID'] == 'LunaEsoteric')
    print(f"\n📊 Luna Split:")
    print(f"  LunaEnergyHealing: {luna_energy}")
    print(f"  LunaEsoteric: {luna_esoteric}")

if __name__ == "__main__":
    main()
