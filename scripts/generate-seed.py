#!/usr/bin/env python3
"""
Seed Script Generator for Tags and Courses
Generates Prisma seed data from course-nomenclature-full.csv

This script generates:
1. MarketingTag records for purchase tags (L1 + PRO)
2. Course records with proper slugs and metadata

Run this to generate seed SQL, then apply with:
  npx prisma db seed
"""

import csv
from pathlib import Path
from datetime import datetime

# Configuration
SAMPLE_SIZE = 10  # First N courses for testing (set to None for all)

def generate_seed_script(csv_path: str, output_path: str, limit: int = None):
    """Generate TypeScript seed script from CSV"""
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # Filter out rows that are category overviews (don't have "Certified" in name)
    # These are the category header rows, not actual courses
    rows = [r for r in rows if r.get('Course Name') and 'Certified' in r.get('Course Name', '')]
    
    # Apply limit if specified
    if limit:
        rows = rows[:limit]
    
    seed_content = '''// Auto-generated seed data for courses and tags
// Generated: ''' + datetime.now().isoformat() + '''
// Courses: ''' + str(len(rows)) + '''

import { PrismaClient, TagCategory } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// MARKETING TAGS (Purchase Tags)
// ========================================

const purchaseTags = [
'''

    # Generate purchase tags
    tags_seen = set()
    for row in rows:
        l1_tag = row.get('L1 Tag', '').strip()
        pro_tag = row.get('PRO Tag', '').strip()
        course_name = row.get('Course Name', '').strip()
        
        if l1_tag and l1_tag not in tags_seen:
            tags_seen.add(l1_tag)
            display_name = course_name + " - L1 Purchased"
            seed_content += f'''  {{
    name: "{display_name}",
    slug: "{l1_tag}",
    category: "SUPPRESS" as TagCategory,
    color: "#10B981",
    description: "User purchased {course_name}",
    isSystem: true,
  }},
'''
        
        if pro_tag and pro_tag not in tags_seen:
            tags_seen.add(pro_tag)
            display_name = row.get('Course Code', '') + " PRO Accelerator Purchased"
            seed_content += f'''  {{
    name: "{display_name}",
    slug: "{pro_tag}",
    category: "SUPPRESS" as TagCategory,
    color: "#8B5CF6",
    description: "User purchased PRO Accelerator for {course_name}",
    isSystem: true,
  }},
'''

    seed_content += '];'
    
    # Generate courses
    seed_content += '''

// ========================================
// COURSES
// ========================================

const courses = [
'''
    
    for row in rows:
        course_name = row.get('Course Name', '').strip()
        l1_slug = row.get('L1 Slug', '').strip()
        category = row.get('Category', '').strip()
        coach = row.get('Coach', 'Sarah').strip()
        
        if not course_name or not l1_slug:
            continue
        
        # Create description from course name
        description = f"Become a {course_name} and transform lives with evidence-based training."
        
        seed_content += f'''  {{
    title: "{course_name}",
    slug: "{l1_slug}",
    description: "{description}",
    shortDescription: "Professional certification in {category or 'Wellness'}",
    price: 97,
    regularPrice: 197,
    isFree: false,
    isPublished: false,
    isFeatured: false,
    difficulty: "BEGINNER" as const,
    certificateType: "CERTIFICATION" as const,
    learningOutcomes: [
      "Master foundational concepts",
      "Apply practical techniques with clients",
      "Earn professional certification",
      "Build your practice"
    ],
  }},
'''

    seed_content += '''];

// ========================================
// SEED FUNCTIONS
// ========================================

async function seedTags() {
  console.log('🏷️  Seeding MarketingTags...');
  
  for (const tag of purchaseTags) {
    await prisma.marketingTag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  
  console.log(`✅ Created/updated ${purchaseTags.length} marketing tags`);
}

async function seedCourses() {
  console.log('📚 Seeding Courses...');
  
  for (const course of courses) {
    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: course,
    });
  }
  
  console.log(`✅ Created/updated ${courses.length} courses`);
}

async function main() {
  console.log('\\n🌱 Starting seed...\\n');
  
  await seedTags();
  await seedCourses();
  
  console.log('\\n✨ Seed complete!\\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
'''

    # Write output
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(seed_content)
    
    print(f"✅ Generated seed script: {output_path}")
    print(f"   - Tags: {len(tags_seen)}")
    print(f"   - Courses: {len([r for r in rows if r.get('Course Name')])}")


def main():
    base_dir = Path("/Users/pochitino/Desktop/accredipro-lms")
    csv_path = base_dir / "docs" / "technical" / "course-nomenclature-full.csv"
    output_path = base_dir / "prisma" / "seed-courses.ts"
    
    print(f"📖 Reading from: {csv_path}")
    
    # Generate with limit for testing
    generate_seed_script(str(csv_path), str(output_path), limit=SAMPLE_SIZE)
    
    print(f"\n🚀 To run the seed:")
    print(f"   cd {base_dir}")
    print(f"   npx ts-node prisma/seed-courses.ts")


if __name__ == "__main__":
    main()
