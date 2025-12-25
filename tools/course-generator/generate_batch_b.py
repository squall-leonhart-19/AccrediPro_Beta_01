#!/usr/bin/env python3
"""
AccrediPro Verified Generator - BATCH B (Courses 10-18)
Runs in parallel with Batch A for 2x speed
"""

import subprocess
import sys
import json
from pathlib import Path
from datetime import datetime

COURSES_DIR = Path(__file__).parent.parent.parent / "courses"
GENERATOR_DIR = Path(__file__).parent
EXPECTED_LESSONS = {0: 4, **{i: 8 for i in range(1, 16)}}

# BATCH B: Courses 10-18
COURSES = [
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

def slugify(name): return name.lower().replace(" & ", "-").replace(" ", "-").replace("'", "")

def verify_course(name):
    path = COURSES_DIR / slugify(name)
    if not path.exists(): return {"valid": False}
    issues = []
    total = 0
    for m in range(16):
        mdir = path / f"Module_{m:02d}"
        if not mdir.exists(): issues.append(f"M{m:02d} missing"); continue
        count = len(list(mdir.glob("Lesson_*.html")))
        exp = EXPECTED_LESSONS.get(m, 8)
        total += count
        if count != exp: issues.append(f"M{m:02d}: {count}/{exp}")
    if not (path / "Final_Exam").exists(): issues.append("Final exam missing")
    return {"valid": len(issues) == 0, "issues": issues, "total": total}

def generate_course(name):
    print(f"\n{'='*60}\n🅱️ BATCH B: {name}\n⏰ {datetime.now().strftime('%H:%M:%S')}\n{'='*60}")
    try:
        result = subprocess.run(["python", "generate.py", name], cwd=GENERATOR_DIR)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ {e}")
        return False

def main():
    print("\n" + "="*60 + "\n🅱️ BATCH B - Courses 10-18\n" + "="*60)
    results = []
    for i, course in enumerate(COURSES, 1):
        print(f"\n📋 Course {i}/9: {course}")
        v = verify_course(course)
        if v.get("valid"):
            print(f"✅ Already complete ({v['total']} lessons)")
            results.append({"course": course, "status": "skipped"})
            continue
        if not generate_course(course):
            print(f"❌ Generation failed")
            results.append({"course": course, "status": "failed"})
            break
        v = verify_course(course)
        if v.get("valid"):
            print(f"✅ Verified: {v['total']} lessons")
            results.append({"course": course, "status": "success"})
        else:
            print(f"❌ Verification failed: {v['issues']}")
            results.append({"course": course, "status": "verify_failed"})
            break
    print("\n" + "="*60 + "\n🅱️ BATCH B COMPLETE\n" + "="*60)
    for r in results: print(f"  {'✅' if r['status'] in ['success','skipped'] else '❌'} {r['course']}: {r['status']}")

if __name__ == "__main__": main()
