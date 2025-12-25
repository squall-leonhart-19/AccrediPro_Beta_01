# 🚀 AccrediPro Course Generator

AI-powered course content generation using **Gemini 3 Flash** with multi-key parallel processing.

---

## 📋 Overview

This tool automatically generates complete certification courses including:
- **Unique methodology acronym** (e.g., THRIVE Method™)
- **16 modules** with 8 lessons each
- **Quizzes** (10 questions per module)
- **Final exam** (20 questions)
- **Career/earnings content** for motivation

---

## ⚡ Features

| Feature | Description |
|---------|-------------|
| **39 API Keys** | Parallel processing for fast generation |
| **8 Modules Parallel** | Generates 8 modules simultaneously |
| **Auto Quality Checks** | Validates size, structure, required sections |
| **Resume Capability** | Database tracks progress |
| **Career Content** | Automatically adds earnings potential ($10K-30K/month) |
| **Consistent Branding** | Uses AccrediPro templates |
| **No Header Logo** | LMS provides logo, only footer branding |

---

## 🛠️ Setup

### 1. Install Dependencies

```bash
cd /Users/pochitino/Desktop/accredipro-lms/tools/course-generator
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configuration

API keys are pre-configured in `config.env` with 39 Gemini keys.

---

## 🎯 Usage

### Generate a Complete Course

```bash
cd /Users/pochitino/Desktop/accredipro-lms/tools/course-generator
source venv/bin/activate
python generate.py "Holistic Nutrition Practitioner"
```

### What Happens

```
1. 📋 Generate unique methodology (e.g., THRIVE Method™)
2. 📚 Create 16-module outline
3. ⚡ Generate 8 modules in parallel (batch 1)
4. ⚡ Generate 8 modules in parallel (batch 2)
5. ⚡ Generate remaining modules (batch 3)
6. 🎓 Generate final exam
7. 💾 Save to /courses/{course-name}/
```

---

## 📁 Output Structure

```
courses/holistic-nutrition-practitioner/
├── course_outline.json
├── Module_00/
│   ├── Lesson_0.1_Your_Journey_to_Certification.html
│   ├── Lesson_0.2_Understanding_Holistic_Nutrition.html
│   ├── Lesson_0.3_The_THRIVE_Method.html
│   └── Lesson_0.4_Navigating_the_Course.html
├── Module_01/
│   ├── Lesson_1.1_...html
│   ├── ...
│   └── quiz_module_01.json
├── ...
├── Module_15/
│   ├── ...
│   └── quiz_module_15.json
└── Final_Exam/
    └── final_exam.json
```

---

## 🏗️ Architecture

### Files

| File | Purpose |
|------|---------|
| `generate.py` | Main CLI orchestrator |
| `core.py` | API key pool, database, quality checks |
| `prompts.py` | All AI prompt templates |
| `config.env` | 39 Gemini API keys |
| `reference/` | Sample lessons from Gut Health |
| `courses.db` | SQLite tracking database |

### Key Classes

```python
# API Key Pool - Round-robin rotation with failure handling
class APIKeyPool:
    async def get_key() -> str
    def mark_failed(key: str)

# Database - Track generation progress
class CourseDatabase:
    def create_course(name: str) -> int
    def get_course_status(name: str) -> Dict
    def mark_course_complete(course_id: int)

# Generator - Gemini API calls
class GeminiGenerator:
    async def generate(prompt: str) -> Dict

# Quality Checker - Validate output
class QualityChecker:
    def check_lesson(html: str) -> Dict
    def check_quiz(json: str) -> Dict
```

---

## ⚙️ Configuration Options

Edit `config.env`:

```env
# API Keys (comma-separated)
GEMINI_API_KEYS=key1,key2,key3...

# Model selection
GEMINI_MODEL=gemini-2.0-flash

# Output paths
OUTPUT_DIR=../../courses
REFERENCE_DIR=./reference

# Quality thresholds
LESSON_MIN_SIZE=20000  # 20KB minimum
LESSON_MAX_SIZE=40000  # 40KB maximum
MAX_RETRIES=3

# Parallel processing
PARALLEL_MODULES=8     # Modules to generate simultaneously
```

---

## 📊 Quality Checks

### Lesson Validation

| Check | Requirement |
|-------|-------------|
| Size | 20-40KB |
| Objectives | Must have objectives-box |
| Interactive | Must have "Check Your Understanding" |
| Takeaways | Must have Key Takeaways section |
| Branding | Must mention AccrediPro |
| No CTAs | No "Next Lesson" navigation |

### Quiz Validation

| Check | Requirement |
|-------|-------------|
| Questions | Exactly 10 |
| Options | 4 per question |
| Answer | Valid index (0-3) |
| Explanation | Required |

---

## 📈 Speed Comparison

| Approach | Time for 120 Lessons |
|----------|---------------------|
| Sequential (1 at a time) | ~60 minutes |
| **Parallel (8 modules)** | **~15-20 minutes** |
| Full Parallel (39 keys) | ~5-8 minutes |

Current implementation uses **8 parallel modules** for best balance of speed and coherence.

---

## 📋 Planned Certifications

| Course | Status |
|--------|--------|
| Gut Health Practitioner | ✅ Complete (manual) |
| Holistic Nutrition | 🔄 In Progress |
| Herbalism Practitioner | 📋 Planned |
| Ayurveda Practitioner | 📋 Planned |
| Sleep Science | 📋 Planned |
| Stress & Burnout Recovery | 📋 Planned |
| Women's Health | 📋 Planned |
| Men's Health | 📋 Planned |
| Longevity & Anti-Aging | 📋 Planned |

---

## 🔧 Troubleshooting

### "Module not found" Error

```bash
source venv/bin/activate  # Make sure venv is active
pip install -r requirements.txt
```

### Course Already Exists

Delete from database to regenerate:

```bash
rm courses.db
rm -rf ../../courses/course-name/
```

### Rate Limiting

The system automatically rotates through 39 API keys. If all keys hit limits, it waits and retries.

---

## 📝 Methodology Generation

Each course gets a unique branded methodology:

| Course | Methodology |
|--------|-------------|
| Gut Health | G.U.T.S. Method™ |
| Holistic Nutrition | THRIVE Method™ |
| (Auto-generated for each new course) |

The methodology is woven throughout lessons as a central framework.
