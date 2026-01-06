#!/usr/bin/env python3
"""
Fix the course nomenclature CSV - FINAL PREMIUM VERSION
- Removes ALL junk data (lesson titles, metadata, duplicates)
- Only keeps rows with "Certified" in name
- Adds trending high-value certifications
"""

import csv
import re

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/technical/course-nomenclature-full.csv"
OUTPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/course-nomenclature-fixed.csv"

# Categories to REMOVE
REMOVE_CATEGORIES = {
    "LIFE COACHING & PERSONAL DEVELOPMENT",
    "LIFE COACHING",
    "MONEY & ABUNDANCE",
    "PRODUCTIVITY & TIME",
    "PERSONAL DEVELOPMENT FOUNDATIONS",
    "HOLISTIC LIFESTYLE & PERSONAL DEVELOPMENT",
    "RELATIONSHIP COACHING",
}

# CATEGORY → PIXEL MAPPING
CATEGORY_MAP = {
    # SARAH (3)
    "FUNCTIONAL MEDICINE": ("SarahFunctionalMedicine", "Sarah"),
    "GUT HEALTH": ("SarahFunctionalMedicine", "Sarah"),
    "AUTOIMMUNE & INFLAMMATION": ("SarahFunctionalMedicine", "Sarah"),
    "NUTRITION & LIFESTYLE": ("SarahFunctionalMedicine", "Sarah"),
    "DIET & NUTRITION": ("SarahFunctionalMedicine", "Sarah"),
    "DIET & NUTRITION APPROACHES": ("SarahFunctionalMedicine", "Sarah"),
    "BIOHACKING & LONGEVITY": ("SarahFunctionalMedicine", "Sarah"),
    "MEN'S HEALTH": ("SarahFunctionalMedicine", "Sarah"),
    "FITNESS & ATHLETIC PERFORMANCE": ("SarahFunctionalMedicine", "Sarah"),
    "ENVIRONMENTAL & LIFESTYLE WELLNESS": ("SarahFunctionalMedicine", "Sarah"),
    "SPECIALIZED BODY SYSTEMS": ("SarahFunctionalMedicine", "Sarah"),
    "SPECIALIZED POPULATIONS": ("SarahFunctionalMedicine", "Sarah"),
    "BUSINESS & PRACTICE BUILDING": ("SarahFunctionalMedicine", "Sarah"),
    
    "WOMEN'S HEALTH & HORMONES": ("SarahWomensHormones", "Sarah"),
    "HORMONES & METABOLISM": ("SarahWomensHormones", "Sarah"),
    
    "CLINICAL & CONDITION-SPECIFIC": ("SarahIntegrativeMedicine", "Sarah"),
    "GENETICS & ADVANCED TESTING": ("SarahIntegrativeMedicine", "Sarah"),
    "AYURVEDA & TRADITIONAL MEDICINE": ("SarahIntegrativeMedicine", "Sarah"),
    "INTEGRATIVE MEDICINE": ("SarahIntegrativeMedicine", "Sarah"),
    "ADVANCED FUNCTIONAL MEDICINE": ("SarahIntegrativeMedicine", "Sarah"),
    "HEALTHCARE PROFESSIONAL TRACKS": ("SarahIntegrativeMedicine", "Sarah"),
    
    # OLIVIA (3)
    "NARCISSISTIC ABUSE & RELATIONSHIP TRAUMA": ("OliviaNarcTrauma", "Olivia"),
    "TRAUMA & ABUSE RECOVERY": ("OliviaNarcTrauma", "Olivia"),
    "ADDICTION & RECOVERY": ("OliviaNarcTrauma", "Olivia"),
    "VETERANS & MILITARY": ("OliviaNarcTrauma", "Olivia"),
    
    "MENTAL HEALTH & NERVOUS SYSTEM": ("OliviaNeurodiversity", "Olivia"),
    "NEURODIVERSITY": ("OliviaNeurodiversity", "Olivia"),
    "DISABILITY WELLNESS": ("OliviaNeurodiversity", "Olivia"),
    "EMOTIONAL & HOLISTIC WELLNESS": ("OliviaNeurodiversity", "Olivia"),
    
    "SENIOR & END-OF-LIFE": ("OliviaGriefEndoflife", "Olivia"),
    "GRIEF & BEREAVEMENT": ("OliviaGriefEndoflife", "Olivia"),
    
    # LUNA (2)
    "SPIRITUAL HEALING & ENERGY WORK": ("LunaSpiritualEnergy", "Luna"),
    "SPIRITUAL & ENERGY": ("LunaSpiritualEnergy", "Luna"),
    
    "SEXUAL WELLNESS & INTIMACY": ("LunaSexIntimacy", "Luna"),
    "SEXUALITY & INTIMACY": ("LunaSexIntimacy", "Luna"),
    
    # EMMA (2)
    "FERTILITY, BIRTH & POSTPARTUM": ("EmmaFertilityBirth", "Emma"),
    
    "FAMILY, PARENTING & SPECIAL POPULATIONS": ("EmmaParenting", "Emma"),
    "PARENTING": ("EmmaParenting", "Emma"),
    
    # MAYA (2)
    "BODYWORK & MASSAGE THERAPY": ("MayaTherapyModalities", "Maya"),
    "EFT & TAPPING": ("MayaTherapyModalities", "Maya"),
    
    "YOGA & MOVEMENT": ("MayaMindfulness", "Maya"),
    "MIND-BODY MODALITIES": ("MayaMindfulness", "Maya"),
    "ART, MUSIC, SOUND & EXPRESSIVE THERAPIES": ("MayaMindfulness", "Maya"),
    "ALTERNATIVE & TRADITIONAL THERAPIES": ("MayaMindfulness", "Maya"),
    
    # RACHEL (1)
    "LGBTQ+ & INCLUSIVE WELLNESS": ("RachelInclusiveWellness", "Rachel"),
    "CULTURAL & IDENTITY": ("RachelInclusiveWellness", "Rachel"),
    
    # SAGE (1)
    "HERBALISM & PLANT MEDICINE": ("SageHerbalism", "Sage"),
    
    # BELLA (1)
    "EQUINE, ANIMAL-ASSISTED & NATURE THERAPY": ("BellaPetWellness", "Bella"),
    "PET WELLNESS & ANIMAL CARE": ("BellaPetWellness", "Bella"),
    
    # GRACE (1)
    "FAITH-BASED COACHING": ("GraceFaithBased", "Grace"),
}

# TRENDING HIGH-VALUE CERTS TO ADD
TRENDING_CERTS = [
    # SARAH - Trending Health (SarahFunctionalMedicine)
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND01", "Certified Ozempic Alternative & GLP-1 Coach™", "ozempic-alternative-glp1"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND02", "Certified Carnivore Diet Specialist™", "carnivore-diet-specialist"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND03", "Certified Seed Oil Detox Coach™", "seed-oil-detox"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND04", "Certified Semaglutide Support Coach™", "semaglutide-support"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND05", "Certified Red Light Therapy Specialist™", "red-light-therapy"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND06", "Certified Peptide Therapy Coach™", "peptide-therapy"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND07", "Certified Cold Plunge & Hormesis Coach™", "cold-plunge-hormesis"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND08", "Certified Metabolic Health Optimization Coach™", "metabolic-optimization"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND09", "Certified Cycle Syncing & Female Biohacking Coach™", "cycle-syncing-biohacking"),
    ("TRENDING HEALTH", "Sarah", "SarahFunctionalMedicine", "TREND10", "Certified Protein Optimization Coach™", "protein-optimization"),
    
    # SARAH - Women's Hormones Trending
    ("TRENDING HORMONES", "Sarah", "SarahWomensHormones", "TREND11", "Certified Hormone Pellet Therapy Coach™", "hormone-pellet-therapy"),
    ("TRENDING HORMONES", "Sarah", "SarahWomensHormones", "TREND12", "Certified HRT & Bioidentical Hormone Coach™", "hrt-bioidentical"),
    ("TRENDING HORMONES", "Sarah", "SarahWomensHormones", "TREND13", "Certified Perimenopause Weight Liberation Coach™", "perimenopause-weight"),
    
    # OLIVIA - Mental Health Trending
    ("TRENDING MENTAL", "Olivia", "OliviaNeurodiversity", "TREND14", "Certified Ketamine-Assisted Wellness Coach™", "ketamine-assisted"),
    ("TRENDING MENTAL", "Olivia", "OliviaNeurodiversity", "TREND15", "Certified Psychedelic Integration Coach™", "psychedelic-integration"),
    ("TRENDING MENTAL", "Olivia", "OliviaNeurodiversity", "TREND16", "Certified Nervous System Regulation Coach™", "nervous-system-regulation"),
    ("TRENDING MENTAL", "Olivia", "OliviaNeurodiversity", "TREND17", "Certified Polyvagal Therapy Coach™", "polyvagal-therapy"),
    ("TRENDING MENTAL", "Olivia", "OliviaNeurodiversity", "TREND18", "Certified High-Functioning Anxiety Coach™", "high-functioning-anxiety"),
    
    # MAYA - Mindfulness Trending
    ("TRENDING MINDFULNESS", "Maya", "MayaMindfulness", "TREND19", "Certified Cold Exposure & Breathwork Coach™", "cold-exposure-breathwork"),
    ("TRENDING MINDFULNESS", "Maya", "MayaMindfulness", "TREND20", "Certified Wim Hof Method Coach™", "wim-hof-method"),
    
    # SAGE - Herbalism Trending
    ("TRENDING HERBALISM", "Sage", "SageHerbalism", "TREND21", "Certified Functional Mushroom Practitioner™", "functional-mushroom"),
    ("TRENDING HERBALISM", "Sage", "SageHerbalism", "TREND22", "Certified Adaptogen & Nootropic Coach™", "adaptogen-nootropic"),
    ("TRENDING HERBALISM", "Sage", "SageHerbalism", "TREND23", "Certified Lion's Mane & Cognitive Health Coach™", "lions-mane-cognitive"),
]

def is_valid_cert(course_name):
    """Check if this is a real certification, not junk data."""
    if not course_name:
        return False
    
    # Must contain "Certified" to be a real cert
    if "Certified" not in course_name:
        return False
    
    # Filter out obvious junk
    junk_patterns = [
        "Meaning", "Market Size", "Thousands", "~", "programs", 
        "courses", "certs", "Flagship", "🌸", "🤰", "🏥", "💔",
        "💋", "🧩", "🎨", "😢", "🎯", "🔮", "🌿", "🐾", "👶", "🙏", "🩺"
    ]
    for junk in junk_patterns:
        if junk in course_name:
            return False
    
    return True

def get_pixel_and_coach(category):
    """Get pixel and coach from category."""
    cat_upper = category.upper().strip() if category else ""
    
    if cat_upper in CATEGORY_MAP:
        return CATEGORY_MAP[cat_upper]
    
    for cat_key, (pixel, coach) in CATEGORY_MAP.items():
        if cat_key in cat_upper or cat_upper in cat_key:
            return pixel, coach
    
    return "SarahFunctionalMedicine", "Sarah"

def should_remove(category):
    """Check if category should be removed."""
    cat_upper = category.upper().strip() if category else ""
    return cat_upper in REMOVE_CATEGORIES

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as infile:
        reader = csv.reader(infile)
        rows = list(reader)
    
    header = rows[0]
    data_rows = rows[1:]
    
    coach_idx = header.index("Coach")
    pixel_idx = header.index("Pixel ID")
    course_name_idx = header.index("Course Name")
    category_idx = header.index("Category")
    
    fixed_rows = []
    removed_junk = 0
    removed_category = 0
    
    for i, row in enumerate(data_rows):
        if i < 36:  # Skip category headers
            continue
            
        category = row[category_idx] if len(row) > category_idx else ""
        course_name = row[course_name_idx] if len(row) > course_name_idx else ""
        
        # Skip removed categories
        if should_remove(category):
            removed_category += 1
            continue
        
        # Skip junk data
        if not is_valid_cert(course_name):
            removed_junk += 1
            continue
        
        pixel, coach = get_pixel_and_coach(category)
        row[coach_idx] = coach
        row[pixel_idx] = pixel
        
        fixed_rows.append(row)
    
    # ADD TRENDING CERTS
    for cat, coach, pixel, code, name, slug in TRENDING_CERTS:
        new_row = [cat, coach, pixel, code, name, slug]
        # Pad with empty values to match header length
        while len(new_row) < len(header):
            new_row.append("")
        new_row[header.index("L1 Price")] = "97"
        new_row[header.index("PRO Price")] = "397"
        new_row[header.index("Status")] = "NOT LAUNCHED"
        fixed_rows.append(new_row)
    
    # Sort by Coach, then Pixel
    fixed_rows.sort(key=lambda x: (x[coach_idx], x[pixel_idx], x[course_name_idx]))
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(header)
        writer.writerows(fixed_rows)
    
    print(f"✅ Fixed CSV saved to: {OUTPUT_FILE}")
    print(f"📊 Total courses: {len(fixed_rows)}")
    print(f"🗑️  Removed {removed_junk} junk rows")
    print(f"🗑️  Removed {removed_category} excluded category rows")
    print(f"🆕 Added {len(TRENDING_CERTS)} trending certifications")
    
    # Stats
    coach_counts = {}
    pixel_counts = {}
    for row in fixed_rows:
        coach = row[coach_idx]
        pixel = row[pixel_idx]
        coach_counts[coach] = coach_counts.get(coach, 0) + 1
        pixel_counts[pixel] = pixel_counts.get(pixel, 0) + 1
    
    print("\n📊 Courses per Coach:")
    for coach, count in sorted(coach_counts.items()):
        print(f"  {coach}: {count}")
    
    print("\n📊 Courses per Pixel:")
    for pixel, count in sorted(pixel_counts.items()):
        print(f"  {pixel}: {count}")

if __name__ == "__main__":
    main()
