#!/usr/bin/env python3
"""
NETFLIX OF CERTIFICATIONS - 800+ Courses
Adds all new certifications + premium naming convention
"""
import csv
import re
import sys
sys.path.insert(0, '/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES')

from new_courses_batch1 import NEW_SARAH_FM, NEW_SARAH_WH
from new_courses_batch2 import NEW_OLIVIA_TRAUMA, NEW_OLIVIA_NEURO, NEW_OLIVIA_ADDICTION
from new_courses_batch3 import NEW_LUNA_SPIRITUAL, NEW_EMMA_PARENTING, NEW_BELLA_PETS

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/technical/course-nomenclature-full.csv"
OUTPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/course-nomenclature-fixed.csv"

REMOVE_CATEGORIES = {
    "LIFE COACHING & PERSONAL DEVELOPMENT", "LIFE COACHING", "MONEY & ABUNDANCE",
    "PRODUCTIVITY & TIME", "PERSONAL DEVELOPMENT FOUNDATIONS",
    "HOLISTIC LIFESTYLE & PERSONAL DEVELOPMENT", "RELATIONSHIP COACHING",
}

CATEGORY_MAP = {
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
    "SPIRITUAL HEALING & ENERGY WORK": ("LunaSpiritualEnergy", "Luna"),
    "SPIRITUAL & ENERGY": ("LunaSpiritualEnergy", "Luna"),
    "SEXUAL WELLNESS & INTIMACY": ("LunaSexIntimacy", "Luna"),
    "SEXUALITY & INTIMACY": ("LunaSexIntimacy", "Luna"),
    "FERTILITY, BIRTH & POSTPARTUM": ("EmmaFertilityBirth", "Emma"),
    "FAMILY, PARENTING & SPECIAL POPULATIONS": ("EmmaParenting", "Emma"),
    "PARENTING": ("EmmaParenting", "Emma"),
    "BODYWORK & MASSAGE THERAPY": ("MayaTherapyModalities", "Maya"),
    "EFT & TAPPING": ("MayaTherapyModalities", "Maya"),
    "YOGA & MOVEMENT": ("MayaMindfulness", "Maya"),
    "MIND-BODY MODALITIES": ("MayaMindfulness", "Maya"),
    "ART, MUSIC, SOUND & EXPRESSIVE THERAPIES": ("MayaMindfulness", "Maya"),
    "ALTERNATIVE & TRADITIONAL THERAPIES": ("MayaMindfulness", "Maya"),
    "LGBTQ+ & INCLUSIVE WELLNESS": ("RachelInclusiveWellness", "Rachel"),
    "CULTURAL & IDENTITY": ("RachelInclusiveWellness", "Rachel"),
    "HERBALISM & PLANT MEDICINE": ("SageHerbalism", "Sage"),
    "EQUINE, ANIMAL-ASSISTED & NATURE THERAPY": ("BellaPetWellness", "Bella"),
    "PET WELLNESS & ANIMAL CARE": ("BellaPetWellness", "Bella"),
    "FAITH-BASED COACHING": ("GraceFaithBased", "Grace"),
}

def upgrade_name(name, pixel):
    """Upgrade course names to premium hierarchy."""
    if not name or "Certified" not in name:
        return name
    # Sarah pixels -> Specialist/Practitioner
    if pixel.startswith("Sarah"):
        name = name.replace("Coach™", "Specialist™")
    # Olivia pixels -> Specialist
    elif pixel.startswith("Olivia"):
        name = name.replace("Coach™", "Specialist™")
    # Luna pixels -> Practitioner
    elif pixel.startswith("Luna"):
        name = name.replace("Coach™", "Practitioner™")
    # Maya pixels -> Therapist
    elif pixel.startswith("Maya"):
        name = name.replace("Coach™", "Therapist™")
    # Keep Coach for lifestyle (Emma, Bella, Grace, Rachel)
    return name

def is_valid_cert(name):
    if not name: return False
    if "Certified" not in name: return False
    junk = ["Meaning", "Market Size", "~", "programs", "courses", "certs", "Flagship", "🌸", "🤰", "🏥", "💔", "💋", "🧩", "🎨", "😢", "🎯", "🔮", "🌿", "🐾", "👶", "🙏", "🩺"]
    return not any(j in name for j in junk)

def get_pixel_and_coach(category):
    cat_upper = category.upper().strip() if category else ""
    if cat_upper in CATEGORY_MAP:
        return CATEGORY_MAP[cat_upper]
    for cat_key, val in CATEGORY_MAP.items():
        if cat_key in cat_upper or cat_upper in cat_key:
            return val
    return ("SarahFunctionalMedicine", "Sarah")

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        rows = list(csv.reader(f))
    
    header = rows[0]
    fixed_rows = []
    
    coach_idx = header.index("Coach")
    pixel_idx = header.index("Pixel ID")
    course_name_idx = header.index("Course Name")
    category_idx = header.index("Category")
    
    # Process existing courses
    for i, row in enumerate(rows[1:], 1):
        if i <= 36: continue
        category = row[category_idx] if len(row) > category_idx else ""
        name = row[course_name_idx] if len(row) > course_name_idx else ""
        if category.upper().strip() in REMOVE_CATEGORIES: continue
        if not is_valid_cert(name): continue
        
        pixel, coach = get_pixel_and_coach(category)
        row[coach_idx] = coach
        row[pixel_idx] = pixel
        row[course_name_idx] = upgrade_name(name, pixel)
        fixed_rows.append(row)
    
    # Add all new courses
    def add_courses(courses, pixel, coach, category, prefix):
        for i, (name, slug) in enumerate(courses, 1):
            code = f"{prefix}{i:03d}"
            row = [category, coach, pixel, code, name, slug]
            while len(row) < len(header): row.append("")
            try: row[header.index("L1 Price")] = "97"
            except: pass
            try: row[header.index("PRO Price")] = "397"
            except: pass
            try: row[header.index("Status")] = "NOT LAUNCHED"
            except: pass
            fixed_rows.append(row)
    
    add_courses(NEW_SARAH_FM, "SarahFunctionalMedicine", "Sarah", "CLINICAL CONDITIONS", "CC")
    add_courses(NEW_SARAH_WH, "SarahWomensHormones", "Sarah", "WOMEN'S HORMONES", "WH")
    add_courses(NEW_OLIVIA_TRAUMA, "OliviaNarcTrauma", "Olivia", "TRAUMA RECOVERY", "TR")
    add_courses(NEW_OLIVIA_NEURO, "OliviaNeurodiversity", "Olivia", "MENTAL HEALTH", "MH")
    add_courses(NEW_OLIVIA_ADDICTION, "OliviaNarcTrauma", "Olivia", "ADDICTION RECOVERY", "AR")
    add_courses(NEW_LUNA_SPIRITUAL, "LunaSpiritualEnergy", "Luna", "SPIRITUAL HEALING", "SP")
    add_courses(NEW_EMMA_PARENTING, "EmmaParenting", "Emma", "PARENTING", "PA")
    add_courses(NEW_BELLA_PETS, "BellaPetWellness", "Bella", "PET WELLNESS", "PW")
    
    # Sort
    fixed_rows.sort(key=lambda x: (x[coach_idx], x[pixel_idx], x[course_name_idx]))
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(fixed_rows)
    
    print(f"✅ Saved: {OUTPUT_FILE}")
    print(f"📊 Total: {len(fixed_rows)} courses")
    
    # Stats
    coaches = {}
    pixels = {}
    for row in fixed_rows:
        coaches[row[coach_idx]] = coaches.get(row[coach_idx], 0) + 1
        pixels[row[pixel_idx]] = pixels.get(row[pixel_idx], 0) + 1
    
    print("\n📊 By Coach:")
    for c, n in sorted(coaches.items()): print(f"  {c}: {n}")
    print("\n📊 By Pixel:")
    for p, n in sorted(pixels.items()): print(f"  {p}: {n}")

if __name__ == "__main__":
    main()
