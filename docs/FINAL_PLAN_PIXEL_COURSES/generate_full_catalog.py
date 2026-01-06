#!/usr/bin/env python3
"""
Generate full catalog with complete nomenclature for all 805 courses.
22 columns: Category, Coach, Pixel ID, Course Code, Course Name,
L1-L4 Slugs, L1/PRO Tags, CF SKUs, Funnel Page Slugs, Pricing, Status, Tier
"""
import csv
import re

INPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/course-nomenclature-fixed.csv"
OUTPUT_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/full-catalog-nomenclature.csv"
PRIORITY_FILE = "/Users/pochitino/Desktop/accredipro-lms/docs/FINAL_PLAN_PIXEL_COURSES/launch-priority.csv"

# Load priority courses to mark their tier
priority_courses = {}
try:
    with open(PRIORITY_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = row.get('Course Name', '').strip()
            if name:
                priority_courses[name] = {
                    'tier': row.get('Tier', 'CATALOG'),
                    'priority': row.get('Priority', ''),
                    'status': row.get('Status', 'NOT LAUNCHED')
                }
except:
    pass

def slugify(text):
    """Convert text to URL-friendly slug."""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[™®©]', '', text)
    text = re.sub(r'certified\s+', '', text)
    text = re.sub(r"[''`]", '', text)
    text = re.sub(r'[&+]', '-and-', text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    text = text.strip('-')
    return text[:50]

def tagify(text):
    """Convert text to tag format (snake_case)."""
    slug = slugify(text)
    return slug.replace('-', '_')

def generate_nomenclature(category, coach, pixel, course_code, course_name):
    """Generate full nomenclature row for a course."""
    base_slug = slugify(course_name)
    base_tag = tagify(course_name)
    code_lower = course_code.lower()
    
    # Check if this is a priority course
    priority_info = priority_courses.get(course_name, {})
    tier = priority_info.get('tier', 'CATALOG')
    priority = priority_info.get('priority', '')
    status = priority_info.get('status', 'NOT LAUNCHED')
    
    return {
        'Category': category,
        'Coach': coach,
        'Pixel ID': pixel,
        'Course Code': course_code,
        'Course Name': course_name,
        'L1 Slug': base_slug,
        'L2 Slug': f"{code_lower}-pro-advanced",
        'L3 Slug': f"{code_lower}-pro-master",
        'L4 Slug': f"{code_lower}-pro-practice",
        'L1 Tag': f"{base_tag}_purchased",
        'PRO Tag': f"{code_lower}_pro_accelerator_purchased",
        'CF L1 SKU': f"{base_slug}-certification",
        'CF PRO SKU': f"{code_lower}-pro-accelerator",
        'Sales Page Slug': f"{base_slug}-certification",
        'Checkout Slug': f"checkout-{base_slug}",
        'OTO 1 Slug': f"oto-{code_lower}-pro-accelerator",
        'Thank You Page Slug': f"thank-you-{base_slug}",
        'L1 Price': '97',
        'PRO Price': '397',
        'Status': status,
        'Tier': tier,
        'Priority': priority
    }

def main():
    # Read existing courses
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        rows = list(reader)
    
    if not rows:
        print("❌ No data in input file")
        return
    
    # Find column indices
    header = rows[0]
    try:
        cat_idx = header.index('Category')
        coach_idx = header.index('Coach')
        pixel_idx = header.index('Pixel ID')
        code_idx = header.index('Course Code')
        name_idx = header.index('Course Name')
    except ValueError as e:
        print(f"❌ Missing column: {e}")
        return
    
    # Process courses
    course_count = {}  # Per pixel counter
    output_rows = []
    
    for i, row in enumerate(rows[1:], 1):
        if len(row) <= name_idx:
            continue
            
        category = row[cat_idx].strip() if cat_idx < len(row) else ""
        coach = row[coach_idx].strip() if coach_idx < len(row) else ""
        pixel = row[pixel_idx].strip() if pixel_idx < len(row) else ""
        course_name = row[name_idx].strip() if name_idx < len(row) else ""
        
        # Skip invalid rows
        if not course_name or "Certified" not in course_name:
            continue
        if not pixel:
            continue
        
        # Generate course code based on pixel
        pixel_prefix = {
            'SarahFunctionalMedicine': 'FM',
            'SarahWomensHormones': 'WH',
            'SarahIntegrativeMedicine': 'IM',
            'OliviaNarcTrauma': 'NT',
            'OliviaNeurodiversity': 'ND',
            'OliviaGriefEndoflife': 'GL',
            'LunaSpiritualEnergy': 'SE',
            'LunaSexIntimacy': 'SI',
            'MayaMindfulness': 'MM',
            'MayaTherapyModalities': 'TM',
            'EmmaParenting': 'EP',
            'EmmaFertilityBirth': 'FB',
            'BellaPetWellness': 'PW',
            'SageHerbalism': 'HB',
            'GraceFaithBased': 'GF',
            'RachelInclusiveWellness': 'IW',
        }.get(pixel, 'XX')
        
        course_count[pixel] = course_count.get(pixel, 0) + 1
        course_code = f"{pixel_prefix}{course_count[pixel]:03d}"
        
        nom = generate_nomenclature(category, coach, pixel, course_code, course_name)
        output_rows.append(nom)
    
    # Sort by Coach, Pixel, then Course Name
    output_rows.sort(key=lambda x: (x['Coach'], x['Pixel ID'], x['Course Name']))
    
    # Reassign priority numbers for non-priority courses
    priority_num = 93  # Start after the 92 priority courses
    for row in output_rows:
        if not row['Priority']:
            row['Priority'] = str(priority_num)
            priority_num += 1
    
    # Write output
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
        writer.writerows(output_rows)
    
    print(f"✅ Full catalog saved to: {OUTPUT_FILE}")
    print(f"📊 Total courses: {len(output_rows)}")
    
    # Stats by tier
    tiers = {}
    for row in output_rows:
        tier = row['Tier']
        tiers[tier] = tiers.get(tier, 0) + 1
    
    print("\n📊 By Tier:")
    for tier, count in sorted(tiers.items()):
        print(f"  {tier}: {count}")
    
    # Stats by pixel
    pixels = {}
    for row in output_rows:
        pixel = row['Pixel ID']
        pixels[pixel] = pixels.get(pixel, 0) + 1
    
    print("\n📊 By Pixel:")
    for pixel, count in sorted(pixels.items()):
        print(f"  {pixel}: {count}")

if __name__ == "__main__":
    main()
