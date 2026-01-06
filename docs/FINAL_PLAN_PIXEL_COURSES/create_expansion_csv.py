#!/usr/bin/env python3
"""
Create Expansion_Pixels_2nd_Launch.csv with courses 2-5 for each pixel.
These are the expansion courses AFTER flagships.
"""
import csv
import re

OUTPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/Expansion_Pixels_2nd_Launch.csv"

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

# All expansion courses (2-5) for each pixel
EXPANSION_COURSES = [
    # SarahFunctionalMedicine (2-5)
    ("SarahFunctionalMedicine", "Sarah", "Certified Gut Health Specialist™"),
    ("SarahFunctionalMedicine", "Sarah", "Certified Holistic Nutrition Specialist™"),
    ("SarahFunctionalMedicine", "Sarah", "Certified Brain Health & Neuroscience Specialist™"),
    ("SarahFunctionalMedicine", "Sarah", "Certified Fibromyalgia Specialist™"),
    
    # SarahWomensHormones (2-5)
    ("SarahWomensHormones", "Sarah", "Certified Menopause & Perimenopause Specialist™"),
    ("SarahWomensHormones", "Sarah", "Certified PCOS & Metabolic Health Specialist™"),
    ("SarahWomensHormones", "Sarah", "Certified Thyroid Health Specialist™"),
    ("SarahWomensHormones", "Sarah", "Certified Adrenal Fatigue Specialist™"),
    
    # SarahIntegrativeMedicine (2-5)
    ("SarahIntegrativeMedicine", "Sarah", "Certified Ayurveda Practitioner™"),
    ("SarahIntegrativeMedicine", "Sarah", "Certified Naturopathic Practitioner™"),
    ("SarahIntegrativeMedicine", "Sarah", "Certified TCM Practitioner™"),
    ("SarahIntegrativeMedicine", "Sarah", "Certified Craniosacral Therapy Practitioner™"),
    
    # OliviaNarcTrauma (2-5)
    ("OliviaNarcTrauma", "Olivia", "Certified Trauma Recovery Specialist™"),
    ("OliviaNarcTrauma", "Olivia", "Certified Somatic Trauma Release Specialist™"),
    ("OliviaNarcTrauma", "Olivia", "Certified Inner Child Healing Specialist™"),
    ("OliviaNarcTrauma", "Olivia", "Certified Codependency Recovery Specialist™"),
    
    # OliviaNeurodiversity (2-5)
    ("OliviaNeurodiversity", "Olivia", "Certified ADHD Support Specialist™"),
    ("OliviaNeurodiversity", "Olivia", "Certified Polyvagal Theory Specialist™"),
    ("OliviaNeurodiversity", "Olivia", "Certified Nervous System Regulation Specialist™"),
    ("OliviaNeurodiversity", "Olivia", "Certified Burnout Recovery Specialist™"),
    
    # OliviaGriefEndoflife (2-5)
    ("OliviaGriefEndoflife", "Olivia", "Certified Death Doula Specialist™"),
    ("OliviaGriefEndoflife", "Olivia", "Certified Pet Grief & Loss Specialist™"),
    ("OliviaGriefEndoflife", "Olivia", "Certified Caregiver Support Specialist™"),
    ("OliviaGriefEndoflife", "Olivia", "Certified End-of-Life Doula™"),
    
    # LunaSpiritualEnergy (2-5)
    ("LunaSpiritualEnergy", "Luna", "Certified Reiki Master Practitioner™"),
    ("LunaSpiritualEnergy", "Luna", "Certified Sound Healing Practitioner™"),
    ("LunaSpiritualEnergy", "Luna", "Certified Crystal Healing Practitioner™"),
    ("LunaSpiritualEnergy", "Luna", "Certified Akashic Records Practitioner™"),
    
    # LunaSexIntimacy (2-5)
    ("LunaSexIntimacy", "Luna", "Certified Tantra Practitioner™"),
    ("LunaSexIntimacy", "Luna", "Certified Couples Intimacy Practitioner™"),
    ("LunaSexIntimacy", "Luna", "Certified Sexual Wellness Practitioner™"),
    ("LunaSexIntimacy", "Luna", "Certified Libido Practitioner™"),
    
    # MayaMindfulness (2-5)
    ("MayaMindfulness", "Maya", "Certified Meditation & Mindfulness Therapist™"),
    ("MayaMindfulness", "Maya", "Certified Play Therapy Coach™"),
    ("MayaMindfulness", "Maya", "Certified Art Therapy Facilitator™"),
    ("MayaMindfulness", "Maya", "Certified Sound Bath Facilitator™"),
    
    # MayaTherapyModalities (2-5)
    ("MayaTherapyModalities", "Maya", "Certified Family Constellations Therapist™"),
    ("MayaTherapyModalities", "Maya", "Certified Somatic Therapy Practitioner™"),
    ("MayaTherapyModalities", "Maya", "Certified NLP Practitioner™"),
    ("MayaTherapyModalities", "Maya", "Certified Hypnotherapy Practitioner™"),
    
    # EmmaParenting (2-5)
    ("EmmaParenting", "Emma", "Certified Positive Parenting Coach™"),
    ("EmmaParenting", "Emma", "Certified Child Sleep Coach™"),
    ("EmmaParenting", "Emma", "Certified Play Therapy Coach™"),
    ("EmmaParenting", "Emma", "Certified Special Needs Parenting Coach™"),
    
    # EmmaFertilityBirth (2-5)
    ("EmmaFertilityBirth", "Emma", "Certified Fertility Coach™"),
    ("EmmaFertilityBirth", "Emma", "Certified Postpartum Recovery Coach™"),
    ("EmmaFertilityBirth", "Emma", "Certified Breastfeeding Support Coach™"),
    ("EmmaFertilityBirth", "Emma", "Certified Prenatal Wellness Coach™"),
    
    # BellaPetWellness (2-5)
    ("BellaPetWellness", "Bella", "Certified Dog Nutrition Specialist™"),
    ("BellaPetWellness", "Bella", "Certified Equine Therapy Specialist™"),
    ("BellaPetWellness", "Bella", "Certified Animal-Assisted Therapy Coach™"),
    ("BellaPetWellness", "Bella", "Certified Cat Wellness Specialist™"),
    
    # SageHerbalism (2-5)
    ("SageHerbalism", "Sage", "Certified Aromatherapy Specialist™"),
    ("SageHerbalism", "Sage", "Certified Medicinal Mushroom Specialist™"),
    ("SageHerbalism", "Sage", "Certified Forest Therapy Coach™"),
    ("SageHerbalism", "Sage", "Certified Adaptogen Specialist™"),
    
    # GraceFaithBased (2-5)
    ("GraceFaithBased", "Grace", "Certified Biblical Counseling Coach™"),
    ("GraceFaithBased", "Grace", "Certified Faith-Based Marriage Coach™"),
    ("GraceFaithBased", "Grace", "Certified Faith-Based Recovery Coach™"),
    ("GraceFaithBased", "Grace", "Certified Spiritual Direction Coach™"),
]

def main():
    rows = []
    priority = 1
    
    for pixel, coach, course_name in EXPANSION_COURSES:
        slug = slugify(course_name)
        tag = tagify(course_name)
        code = pixel[:2].upper() + f"{priority:03d}"
        
        row = {
            'Category': pixel.replace("Sarah", "").replace("Olivia", "").replace("Luna", "").replace("Maya", "").replace("Emma", "").replace("Bella", "").replace("Sage", "").replace("Grace", ""),
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
            'Status': 'GENERATE WEEK 2',
            'Tier': 'EXPANSION',
            'Priority': str(priority),
        }
        rows.append(row)
        priority += 1
    
    fieldnames = [
        'Category', 'Coach', 'Pixel ID', 'Course Code', 'Course Name',
        'L1 Slug', 'L2 Slug', 'L3 Slug', 'L4 Slug',
        'L1 Tag', 'PRO Tag',
        'CF L1 SKU', 'CF PRO SKU',
        'Sales Page Slug', 'Checkout Slug', 'OTO 1 Slug', 'Thank You Page Slug',
        'L1 Price', 'PRO Price', 'Status', 'Tier', 'Priority'
    ]
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"✅ Created {len(rows)} expansion courses → {OUTPUT_FILE}")
    
    # Stats by pixel
    pixels = {}
    for row in rows:
        pixel = row['Pixel ID']
        pixels[pixel] = pixels.get(pixel, 0) + 1
    
    print("\n📊 By Pixel:")
    for pixel, count in sorted(pixels.items()):
        print(f"  {pixel}: {count}")

if __name__ == "__main__":
    main()
