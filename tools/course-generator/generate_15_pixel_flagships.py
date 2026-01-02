#!/usr/bin/env python3
"""
Generate the 4 missing flagship courses to complete 15-pixel architecture.
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from turbo_generator import TurboGenerator

# 4 courses needed to complete 15-pixel architecture
COURSES_TO_GENERATE = [
    "Birth & Postpartum Doula",      # 🤰 Fertility & Birth pixel
    "Sex & Intimacy Coach",          # 💋 Sex & Intimacy pixel
    "EFT Tapping Practitioner",      # 🎨 Therapy Modalities pixel
    "Integrative Medicine Practitioner"  # 🩺 Integrative Medicine pixel
]

async def generate_all():
    """Generate all 4 flagship courses"""
    print("=" * 70)
    print("🚀 AccrediPro 15-Pixel Flagship Generation")
    print("=" * 70)
    print(f"\nGenerating {len(COURSES_TO_GENERATE)} courses:\n")
    for i, course in enumerate(COURSES_TO_GENERATE, 1):
        print(f"  {i}. {course}")
    print()
    
    for i, course_name in enumerate(COURSES_TO_GENERATE, 1):
        print(f"\n{'='*70}")
        print(f"📚 [{i}/{len(COURSES_TO_GENERATE)}] Generating: {course_name}")
        print(f"{'='*70}")
        
        generator = TurboGenerator(course_name)
        await generator.run()
        
        print(f"\n✅ Completed: {course_name}")
    
    print("\n" + "=" * 70)
    print("🎉 ALL 4 FLAGSHIP COURSES GENERATED!")
    print("=" * 70)
    print("\nNext steps:")
    print("  1. Verify courses in /courses/ directory")
    print("  2. Import to database: npx tsx scripts/import-all-certifications.ts")
    print("  3. Update master catalog status")

if __name__ == "__main__":
    asyncio.run(generate_all())
