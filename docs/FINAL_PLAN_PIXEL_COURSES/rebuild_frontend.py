#!/usr/bin/env python3
"""
Rebuild FRONTEND tier with exact 65 courses.
Reset all current FRONTEND to CATALOG, then set the correct ones.
"""
import csv

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
OUTPUT_FILE = INPUT_FILE

# EXACT frontend courses (partial name matching)
FRONTEND_COURSES = [
    # Bella (5)
    "Pet Wellness Specialist",
    "Dog Nutrition Specialist",
    "Cat Wellness Specialist",
    "Animal-Assisted Therapy",
    "Equine Therapy",
    
    # Emma Parenting (7) - added Play Therapy
    "Conscious Parenting Coach",
    "Positive Parenting Coach",
    "Child Development Coach",
    "Child Sleep Coach",
    "Montessori Parent Coach",
    "Special Needs Parenting Coach",
    "Play Therapy",
    
    # Emma Birth (2)
    "Birth & Postpartum Doula Coach",
    "Fertility Coach",
    
    # Grace (3)
    "Christian Life Coach",
    "Biblical Counseling Coach",
    "Faith-Based Marriage Coach",
    
    # Luna Spiritual (6)
    "Energy Healing Practitioner",
    "Reiki Master Practitioner",
    "Crystal Healing Practitioner",
    "Akashic Records Practitioner",
    "Theta Healing Practitioner",
    "Past Life Regression Therapist",
    
    # Luna Sex (2)
    "Sex & Intimacy Practitioner",
    "Tantra Practitioner",
    
    # Maya Mindfulness (7) - added Art Therapy
    "Meditation & Mindfulness Therapist",
    "Breathwork Therapist",
    "Yoga Instructor",
    "Sound Bath Facilitator",
    "Qigong",
    "Family Constellations Therapist",
    "Art Therapy",
    
    # Maya Therapy (6)
    "EFT/Tapping Therapist",
    "NLP Practitioner",
    "Hypnotherapy Practitioner",
    "Parts Work & IFS Therapist",
    "Somatic Therapy Practitioner",
    "TRE (Trauma Release",
    
    # Olivia Grief (2)
    "Grief & Loss Specialist",
    "Death Doula Specialist",
    
    # Olivia Trauma (6)
    "Narcissistic Abuse Recovery Specialist",
    "Trauma Recovery Specialist",
    "Codependency Recovery Specialist",
    "EMDR-Informed",
    "Inner Child Healing Specialist",
    "Trauma Bond",
    
    # Olivia Neuro (6)
    "ADHD Support Specialist",
    "Anxiety Recovery Specialist",
    "Nervous System Regulation Specialist",
    "Autism",
    "OCD Recovery Specialist",
    "Burnout & Stress Recovery Specialist",
    
    # Sage (3)
    "Clinical Herbalist",
    "Medicinal Mushroom Specialist",
    "Aromatherapy Specialist",
    
    # Sarah FM (4) - added Health Coach
    "Functional Medicine Practitioner",
    "Gut Health Specialist",
    "Holistic Nutrition Specialist",
    "Health Coach",
    
    # Sarah WH (4)
    "Women's Hormone Health Specialist",
    "Menopause & Perimenopause Specialist",
    "PCOS & Metabolic Health Specialist",
    "Stress & Sleep Optimization Specialist",
    
    # Sarah IM (2)
    "Integrative Medicine Practitioner",
    "Ayurveda Practitioner",
]

def matches_frontend(course_name):
    """Check if course name matches any frontend pattern."""
    for pattern in FRONTEND_COURSES:
        if pattern.lower() in course_name.lower():
            return True
    return False

def main():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames
    
    # Reset all to CATALOG first
    for row in rows:
        if row['Tier'] == 'FRONTEND':
            row['Tier'] = 'CATALOG'
            row['Status'] = 'NOT LAUNCHED'
    
    # Now set correct ones to FRONTEND
    frontend_count = 0
    priority = 1
    
    for row in rows:
        course_name = row.get('Course Name', '').strip()
        
        if matches_frontend(course_name):
            row['Tier'] = 'FRONTEND'
            row['Status'] = 'GENERATE NOW'
            row['Priority'] = str(priority)
            priority += 1
            frontend_count += 1
            print(f"✅ {row['Pixel ID']:25} | {course_name}")
    
    # Write back
    with open(OUTPUT_FILE, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"\n📊 Total FRONTEND courses: {frontend_count}")
    print(f"✅ Saved to: {OUTPUT_FILE}")
    
    # Stats by pixel
    pixels = {}
    for row in rows:
        if row['Tier'] == 'FRONTEND':
            pixel = row['Pixel ID']
            pixels[pixel] = pixels.get(pixel, 0) + 1
    
    print("\n📊 By Pixel:")
    for pixel, count in sorted(pixels.items()):
        print(f"  {pixel}: {count}")

if __name__ == "__main__":
    main()
