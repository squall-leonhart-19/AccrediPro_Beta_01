#!/usr/bin/env python3
"""
AccrediPro - Remaining 7 Courses Generator
"""

import subprocess
import json
from pathlib import Path
from datetime import datetime

COURSES_DIR = Path(__file__).parent.parent.parent / "courses"
GENERATOR_DIR = Path(__file__).parent
EXPECTED_LESSONS = {0: 4, **{i: 8 for i in range(1, 16)}}

COURSES = [
    "Sleep Health Coach",
    "Stress & Burnout Coach",
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
        # Accept lessons >= expected (more is OK)
        if count < exp: issues.append(f"M{m:02d}: {count}/{exp}")
    if not (path / "Final_Exam").exists(): issues.append("Final exam missing")
    return {"valid": len(issues) == 0, "issues": issues, "total": total}

def generate_course(name):
    print(f"\n{'='*60}\n🚀 Generating: {name}\n⏰ {datetime.now().strftime('%H:%M:%S')}\n{'='*60}")
    try:
        result = subprocess.run(["python", "generate.py", name], cwd=GENERATOR_DIR)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ {e}")
        return False

def main():
    print("\n" + "="*60 + "\n🎯 Remaining 7 Courses\n" + "="*60)
    results = []
    for i, course in enumerate(COURSES, 1):
        print(f"\n📋 Course {i}/7: {course}")
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
            print(f"❌ Verification failed: {v.get('issues', ['Unknown error'])}")
            results.append({"course": course, "status": "verify_failed", "issues": v['issues']})
            # Try fill-gaps once
            print("🔄 Attempting fill-gaps...")
            subprocess.run(["python", "generate.py", course, "--fill-gaps"], cwd=GENERATOR_DIR)
            v = verify_course(course)
            if v.get("valid"):
                print(f"✅ Fixed with fill-gaps: {v['total']} lessons")
                results[-1]["status"] = "success"
            else:
                break
                
    print("\n" + "="*60 + "\n📊 GENERATION COMPLETE\n" + "="*60)
    for r in results: print(f"  {'✅' if r['status'] in ['success','skipped'] else '❌'} {r['course']}: {r['status']}")

if __name__ == "__main__": main()
