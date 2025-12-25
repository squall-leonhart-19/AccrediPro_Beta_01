#!/usr/bin/env python3
"""
AccrediPro Verified Course Generator
Generates courses one at a time with verification between each.
Only proceeds to next course if verification passes.
"""

import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

# Configuration
COURSES_DIR = Path(__file__).parent.parent.parent / "courses"
GENERATOR_DIR = Path(__file__).parent
EXPECTED_LESSONS_PER_MODULE = {
    0: 4,   # Module 0 has 4 lessons (career content)
    **{i: 8 for i in range(1, 16)}  # Modules 1-15 have 8 lessons each
}

# All 18 courses from master-niche-catalog.md top 20 (starting from Herbalism)
COURSES_TO_GENERATE = [
    # Already have: Holistic Nutrition Practitioner, Gut Health (manual)
    "Herbalism Practitioner",
    "Holistic Nutrition Practitioner",
    "Hormone Health Coach",
    "Integrative Health Coach",
    "Weight Loss Coach",
    "Mental Wellness Coach",
    "Anti-Aging & Longevity Coach",
    "Sleep Health Coach",
    "Stress & Burnout Coach",
    "Autoimmune Specialist",
    "Thyroid Health Coach",
    "Diabetes & Blood Sugar Coach",
    "Detox & Cleanse Specialist",
    "Menopause Support Coach",
    "Fertility & Prenatal Coach",
    "Pediatric Nutrition Coach",
    "Sports Nutrition Coach",
    "Plant-Based Nutrition Coach",
]


def slugify(name: str) -> str:
    """Convert course name to folder slug"""
    return name.lower().replace(" & ", "-").replace(" ", "-").replace("'", "")


def verify_course(course_name: str) -> dict:
    """Verify course has correct number of files per module"""
    slug = slugify(course_name)
    course_path = COURSES_DIR / slug
    
    if not course_path.exists():
        return {"valid": False, "error": f"Course folder not found: {course_path}"}
    
    results = {
        "valid": True,
        "modules": {},
        "total_lessons": 0,
        "issues": []
    }
    
    for module_num in range(16):
        module_dir = course_path / f"Module_{module_num:02d}"
        
        if not module_dir.exists():
            results["issues"].append(f"Module_{module_num:02d} folder missing")
            results["valid"] = False
            continue
        
        # Count HTML lesson files
        lesson_files = list(module_dir.glob("Lesson_*.html"))
        expected = EXPECTED_LESSONS_PER_MODULE.get(module_num, 8)
        
        results["modules"][module_num] = {
            "count": len(lesson_files),
            "expected": expected,
            "ok": len(lesson_files) == expected
        }
        results["total_lessons"] += len(lesson_files)
        
        if len(lesson_files) != expected:
            results["issues"].append(
                f"Module_{module_num:02d}: {len(lesson_files)} files (expected {expected})"
            )
            results["valid"] = False
    
    # Check for final exam
    final_exam_dir = course_path / "Final_Exam"
    if not final_exam_dir.exists() or not list(final_exam_dir.glob("*.json")):
        results["issues"].append("Final exam missing")
        results["valid"] = False
    
    return results


def generate_course(course_name: str) -> bool:
    """Generate a single course and return success status"""
    print(f"\n{'='*60}")
    print(f"🚀 Generating: {course_name}")
    print(f"⏰ Started: {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run(
            ["python", "generate.py", course_name],
            cwd=GENERATOR_DIR,
            capture_output=False,
            text=True
        )
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error: {e}")
        return False


def main():
    print("\n" + "="*60)
    print("🎓 AccrediPro VERIFIED Course Generator")
    print("="*60)
    print(f"📚 Courses to generate: {len(COURSES_TO_GENERATE)}")
    print(f"⏱️ Estimated time: ~{len(COURSES_TO_GENERATE) * 15} minutes")
    print("="*60)
    
    results = []
    start_time = datetime.now()
    
    for i, course_name in enumerate(COURSES_TO_GENERATE, 1):
        print(f"\n📋 Course {i}/{len(COURSES_TO_GENERATE)}: {course_name}")
        
        # Check if already exists and valid
        verification = verify_course(course_name)
        if verification["valid"]:
            print(f"✅ Already complete with {verification['total_lessons']} lessons")
            results.append({"course": course_name, "status": "skipped", "reason": "already complete"})
            continue
        
        # Generate the course
        success = generate_course(course_name)
        
        if not success:
            print(f"❌ Generation failed for {course_name}")
            results.append({"course": course_name, "status": "failed", "reason": "generation error"})
            
            # Ask to continue or stop
            print("\n⚠️ Generation failed. Stopping to prevent issues.")
            break
        
        # Verify the course
        verification = verify_course(course_name)
        
        if verification["valid"]:
            print(f"✅ Verified: {verification['total_lessons']} lessons across 16 modules")
            results.append({"course": course_name, "status": "success", "lessons": verification['total_lessons']})
        else:
            print(f"❌ Verification failed:")
            for issue in verification["issues"]:
                print(f"   - {issue}")
            results.append({"course": course_name, "status": "verification_failed", "issues": verification["issues"]})
            
            # Stop on verification failure
            print("\n⚠️ Verification failed. Stopping to prevent issues.")
            break
    
    # Summary
    duration = datetime.now() - start_time
    print("\n" + "="*60)
    print("📊 GENERATION SUMMARY")
    print("="*60)
    print(f"⏱️ Duration: {duration}")
    
    success_count = sum(1 for r in results if r["status"] == "success")
    skipped_count = sum(1 for r in results if r["status"] == "skipped")
    failed_count = sum(1 for r in results if r["status"] in ["failed", "verification_failed"])
    
    print(f"✅ Generated: {success_count}")
    print(f"⏭️ Skipped: {skipped_count}")
    print(f"❌ Failed: {failed_count}")
    print("="*60)
    
    for r in results:
        status_icon = "✅" if r["status"] in ["success", "skipped"] else "❌"
        print(f"  {status_icon} {r['course']}: {r['status']}")
    
    # Save results
    results_path = GENERATOR_DIR / "generation_results.json"
    with open(results_path, "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "duration": str(duration),
            "results": results
        }, f, indent=2)
    print(f"\n📄 Results saved to: {results_path}")


if __name__ == "__main__":
    main()
