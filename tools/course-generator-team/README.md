# 🚀 AccrediPro Course Generator (Team Edition)

Simple guide to generate certification courses.

---

## 📋 Prerequisites

1. **Python 3.10+** installed
2. **API keys** in `config.env` (see below)

---

## ⚙️ Setup (One Time)

```bash
# 1. Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# OR: venv\Scripts\activate  # Windows

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy and fill in API keys
cp config.env.template config.env
# Edit config.env with your API keys
```

---

## 🎯 Generate a Course

```bash
python3 turbo_generator.py "Course Name Here"
```

### Examples:
```bash
python3 turbo_generator.py "Certified Holistic Nutrition Coach"
python3 turbo_generator.py "Certified Life Coach"
python3 turbo_generator.py "Certified Grief & Loss Coach"
```

### What Happens:
1. **PASS 1:** Generates course blueprint (~2 min)
2. **PASS 2:** Generates all lessons (~15-25 min)
3. **PASS 3:** Generates final exam (~1 min)
4. **PASS 4:** Verification (shows file counts)

---

## 📂 Output

Courses are generated to:
```
../../courses/[course-slug]/
├── L1_Main/
│   ├── Module_00/
│   ├── Module_01/
│   │   ├── Lesson_1.1_*.html
│   │   ├── Lesson_1.2_*.html
│   │   └── ...
│   └── ...
├── L2_Advanced/
├── L3_Master/
├── L4_Practice/
├── Final_Exam/
└── course_blueprint.json
```

---

## 🔄 Resume If Interrupted

Just run the same command again! The generator:
- ✅ Skips existing lesson files
- ✅ Only generates missing lessons
- ✅ Continues from where it left off

---

## ✅ Quality Check

After generation, verify:
1. Open any `.html` file in browser
2. Check it has ~20-30KB size
3. Verify colors match the niche theme
4. Test "Show Answer" buttons work

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| `API key invalid` | Check `config.env` has valid keys |
| Lessons too short | Check internet connection, retry |
| Generation stuck | Ctrl+C and restart (it resumes!) |

---

## 📞 Support

If issues persist, contact the tech lead. Do NOT push generated courses to production - just notify when generation is complete.

---

## 🔑 Available Courses

Any course from the AccrediPro catalog works. Just use the full certification name.

Examples:
- "Certified Functional Medicine Practitioner"
- "Certified Women's Hormone Health Coach"
- "Certified Narcissistic Abuse Recovery Coach"
- "Certified Pet Wellness Coach"
- etc.
