#!/usr/bin/env python3
"""
Course Nomenclature Generator
Generates full nomenclature CSV from master-niche-catalog.md

Output columns:
Category, Coach, Pixel ID, Course Code, Course Name, L1 Slug, L2 Slug, L3 Slug, L4 Slug,
L1 Tag, PRO Tag, CF L1 SKU, CF PRO SKU, Sales Page Slug, Checkout Slug, OTO 1 Slug, 
Thank You Page Slug, L1 Price, PRO Price, Status
"""

import re
import csv
from pathlib import Path
from dataclasses import dataclass
from typing import Optional

# ============================================
# CATEGORY TO COACH/PIXEL MAPPING
# ============================================

CATEGORY_CONFIG = {
    # Category Name -> (Coach, Pixel ID)
    "Functional Medicine": ("Sarah", "fm-health"),
    "Women's Health & Hormones": ("Sarah", "fm-health"),
    "Hormones & Metabolism": ("Sarah", "fm-health"),
    "Gut Health": ("Sarah", "fm-health"),
    "Autoimmune & Inflammation": ("Sarah", "fm-health"),
    "Nutrition & Lifestyle": ("Sarah", "fm-health"),
    "Advanced Functional Medicine": ("Sarah", "fm-health"),
    
    "Mental Health & Nervous System": ("Olivia", "mental-health"),
    "Narcissistic Abuse & Relationship Trauma": ("Olivia", "mental-health"),
    "Emotional & Holistic Wellness": ("Olivia", "mental-health"),
    
    "Spiritual Healing & Energy Work": ("Luna", "spiritual"),
    "Art, Music, Sound & Expressive Therapies": ("Luna", "spiritual"),
    
    "Life Coaching & Personal Development": ("Marcus", "life-coaching"),
    "Holistic Lifestyle & Personal Development": ("Marcus", "life-coaching"),
    
    "Herbalism & Plant Medicine": ("Sage", "herbalism"),
    "Ayurveda & Traditional Medicine": ("Sage", "herbalism"),
    
    "Yoga & Movement": ("Maya", "yoga-movement"),
    "Bodywork & Massage Therapy": ("Maya", "yoga-movement"),
    "Mind-Body Modalities": ("Maya", "yoga-movement"),
    "Alternative & Traditional Therapies": ("Maya", "yoga-movement"),
    
    "Pet Wellness & Animal Care": ("Bella", "pet"),
    "Equine, Animal-Assisted & Nature Therapy": ("Bella", "pet"),
    
    "Family, Parenting & Special Populations": ("Emma", "parenting"),
    "Fertility, Birth & Postpartum": ("Emma", "parenting"),
    "Senior & End-of-Life": ("Emma", "parenting"),
    "Grief & Bereavement": ("Emma", "parenting"),
    
    "Christian/Faith": ("Grace", "faith"),
    
    "Business & Practice Building": ("David", "business"),
    "Specialized Populations": ("David", "business"),
    
    # Catch-all categories
    "Biohacking & Longevity": ("Sarah", "fm-health"),
    "Clinical & Condition-Specific": ("Sarah", "fm-health"),
    "Genetics & Advanced Testing": ("Sarah", "fm-health"),
    "Fitness & Athletic Performance": ("Maya", "yoga-movement"),
    "Diet & Nutrition Approaches": ("Sarah", "fm-health"),
    "Environmental & Lifestyle Wellness": ("Sarah", "fm-health"),
    "Addiction & Recovery": ("Olivia", "mental-health"),
    "Sexual Wellness & Intimacy": ("Luna", "spiritual"),
    "Men's Health": ("Sarah", "fm-health"),
    "Specialized Body Systems": ("Sarah", "fm-health"),
    "LGBTQ+ & Inclusive Wellness": ("Olivia", "mental-health"),
}


@dataclass
class Course:
    number: str
    category: str
    title: str
    upsell: str
    coach: str
    pixel_id: str


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    # Remove trademark symbols
    text = text.replace("™", "").replace("®", "")
    # Remove "Certified" prefix often present
    text = re.sub(r'^Certified\s+', '', text, flags=re.IGNORECASE)
    # Remove "Coach" suffix if at end
    text = re.sub(r'\s+Coach$', '', text, flags=re.IGNORECASE)
    # Convert to lowercase
    text = text.lower()
    # Replace special characters with spaces
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    # Replace spaces with hyphens
    text = re.sub(r'\s+', '-', text)
    # Remove multiple hyphens
    text = re.sub(r'-+', '-', text)
    # Remove leading/trailing hyphens
    text = text.strip('-')
    return text


def generate_course_code(number: str, category: str) -> str:
    """Generate 2-4 letter course code"""
    # Extract number part
    num = re.sub(r'[^\d]', '', str(number))
    
    # Get category prefix (first letters of first 2 words)
    words = category.split()
    if len(words) >= 2:
        prefix = words[0][0] + words[1][0]
    else:
        prefix = category[:2]
    
    prefix = prefix.upper()
    return f"{prefix}{num.zfill(2)}"


def parse_master_catalog(file_path: str) -> list[Course]:
    """Parse master-niche-catalog.md and extract all courses"""
    courses = []
    current_category = ""
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all category headers
    category_pattern = r'##\s+[🏥🩷⚡🦠🔥🧠🥗👨‍👩‍👧‍👦🔬💜🎨🌟🐴💔🌿🔮🧘🎯🕉️💆🧬👶🏋️🏥🧬🚫💋👨👁️🌀🏢🥗🌍🌈🧓💼🐾😢]\s+CATEGORY\s+\d+:\s+(.+)'
    
    lines = content.split('\n')
    current_category = ""
    in_table = False
    
    for i, line in enumerate(lines):
        # Check for category header
        cat_match = re.search(r'##\s+.+CATEGORY\s+\d+:\s+(.+)', line)
        if cat_match:
            current_category = cat_match.group(1).strip()
            # Clean up category name (remove pixel reference in parens)
            current_category = re.sub(r'\s*\([^)]+\)\s*$', '', current_category)
            continue
        
        # Check for table rows with course data
        # Format: | # | Course Title | Upsell/Specialization |
        if line.startswith('|') and not line.startswith('|---') and not line.startswith('| #'):
            parts = [p.strip() for p in line.split('|')[1:-1]]  # Remove empty first/last
            
            if len(parts) >= 3:
                number = parts[0]
                title = parts[1]
                upsell = parts[2] if len(parts) > 2 else ""
                
                # Skip header rows and empty rows
                if number in ['#', '---', ''] or 'Course Title' in title:
                    continue
                
                # Skip emoji-only numbers (special markers)
                if number in ['🚀']:
                    number = f"S{len(courses)+1}"  # Special course
                
                # Get coach and pixel from category
                coach, pixel_id = CATEGORY_CONFIG.get(
                    current_category, 
                    ("Sarah", "fm-health")  # Default
                )
                
                courses.append(Course(
                    number=number,
                    category=current_category,
                    title=title.strip('*'),  # Remove bold markers
                    upsell=upsell.strip('*'),
                    coach=coach,
                    pixel_id=pixel_id
                ))
    
    return courses


def generate_nomenclature_csv(courses: list[Course], output_path: str):
    """Generate the full nomenclature CSV"""
    
    headers = [
        "Category", "Coach", "Pixel ID", "Course Code", "Course Name",
        "L1 Slug", "L2 Slug", "L3 Slug", "L4 Slug",
        "L1 Tag", "PRO Tag",
        "CF L1 SKU", "CF PRO SKU",
        "Sales Page Slug", "Checkout Slug", "OTO 1 Slug", "Thank You Page Slug",
        "L1 Price", "PRO Price", "Status"
    ]
    
    rows = []
    
    for course in courses:
        # Generate slugs
        base_slug = slugify(course.title)
        code = generate_course_code(course.number, course.category).lower()
        
        l1_slug = base_slug
        l2_slug = f"{code}-pro-advanced"
        l3_slug = f"{code}-pro-master"
        l4_slug = f"{code}-pro-practice"
        
        # Generate tags
        l1_tag = base_slug.replace('-', '_') + "_purchased"
        pro_tag = f"{code}_pro_accelerator_purchased"
        
        # Generate ClickFunnels SKUs
        cf_l1_sku = f"{base_slug}-certification"
        cf_pro_sku = f"{code}-pro-accelerator"
        
        # Generate page slugs
        sales_page_slug = f"{base_slug}-certification"
        checkout_slug = f"checkout-{base_slug}"
        oto1_slug = f"oto-{code}-pro-accelerator"
        thank_you_slug = f"thank-you-{base_slug}"
        
        rows.append({
            "Category": course.category,
            "Coach": course.coach,
            "Pixel ID": course.pixel_id,
            "Course Code": code.upper(),
            "Course Name": course.title,
            "L1 Slug": l1_slug,
            "L2 Slug": l2_slug,
            "L3 Slug": l3_slug,
            "L4 Slug": l4_slug,
            "L1 Tag": l1_tag,
            "PRO Tag": pro_tag,
            "CF L1 SKU": cf_l1_sku,
            "CF PRO SKU": cf_pro_sku,
            "Sales Page Slug": sales_page_slug,
            "Checkout Slug": checkout_slug,
            "OTO 1 Slug": oto1_slug,
            "Thank You Page Slug": thank_you_slug,
            "L1 Price": 97,
            "PRO Price": 397,
            "Status": "NOT LAUNCHED"
        })
    
    # Write CSV
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"✅ Generated {len(rows)} courses to {output_path}")
    return rows


def main():
    # Paths - use absolute paths
    base_dir = Path("/Users/pochitino/Desktop/accredipro-lms")
    input_path = base_dir / "docs" / "course-catalog" / "master-niche-catalog.md"
    output_path = base_dir / "docs" / "technical" / "course-nomenclature-full.csv"
    
    print(f"📖 Reading from: {input_path}")
    
    # Parse courses
    courses = parse_master_catalog(str(input_path))
    print(f"📝 Found {len(courses)} courses")
    
    # Generate CSV
    generate_nomenclature_csv(courses, str(output_path))
    
    # Print summary by category
    print("\n📊 Summary by Category:")
    categories = {}
    for course in courses:
        categories[course.category] = categories.get(course.category, 0) + 1
    
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count} courses")


if __name__ == "__main__":
    main()
