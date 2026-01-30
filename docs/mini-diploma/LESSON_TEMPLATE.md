# Mini Diploma Lesson Template

When creating a new mini diploma, use this template to generate appropriate lesson names.

## Lesson Structure Pattern

All mini diplomas follow a **3-module, 9-lesson** structure:

| Module | Focus | Lesson Count |
|--------|-------|--------------|
| Module 1 | **Foundation** - Core concepts, basics, what/why | 3 |
| Module 2 | **Deep Dive** - Practical skills, methods, how-to | 3 |
| Module 3 | **Application** - Practice building, career, next steps | 3 |

---

## Template by Module

### Module 1: Foundation (Lessons 1-3)
- Lesson 1: `{Topic} Foundations` or `Introduction to {Topic}`
- Lesson 2: Core concept A (the "what")
- Lesson 3: Core concept B (the "why")

### Module 2: Deep Dive (Lessons 4-6)
- Lesson 4: Practical skill A
- Lesson 5: Practical skill B  
- Lesson 6: Assessment/testing methods

### Module 3: Application (Lessons 7-9)
- Lesson 7: Client work / session structure
- Lesson 8: Business / marketing / ethics
- Lesson 9: **ALWAYS** "Your Next Step" or "Launching Your {Business/Practice/Ministry}"

---

## Examples by Diploma Type

### Health/Medical Niche
```
1. {Topic} Foundations
2. Core Concept A (e.g., "The Gut Foundation", "Microbiome Fundamentals")
3. Core Concept B (e.g., "The Inflammation Connection", "Digestive Dysfunction")
4. Practical Method A (e.g., "Healing Protocols", "Testing Methods")
5. Practical Method B (e.g., "Nutrition Strategies", "Lifestyle Interventions")
6. Assessment/Testing (e.g., "Functional Lab Interpretation", "Client Assessment")
7. Client Sessions (e.g., "Building Protocols", "Session Structure")
8. Business Side (e.g., "Documentation & Ethics", "Building Your Brand")
9. Your Next Step
```

### Coaching Niche
```
1. {Topic} Coaching Foundations
2. Client Psychology / Listening Skills
3. Core Methodology (e.g., "Goal Setting", "Behavior Change Science")
4. Coaching Technique A (e.g., "Motivational Interviewing", "Transformational Questions")
5. Coaching Technique B (e.g., "Wellness Planning", "Overcoming Limiting Beliefs")
6. Specialty Focus (e.g., "Chronic Disease", "Purpose & Calling")
7. Session Management (e.g., "Session Structure", "Documentation")
8. Business Development
9. Launching Your Business/Practice/Ministry
```

### Faith-Based Niche
```
1. Biblical/Spiritual Foundations
2. Spirit-Led Listening / Discernment
3. Identity/Purpose Theme
4. Practical Skill A
5. Practical Skill B
6. Ministry-Specific Focus
7. Faith-Based Goal Setting
8. Ministry & Business Ethics
9. Launching Your Ministry
```

---

## Auto-Generation Prompt for Claude

When user provides a topic, generate lessons using this prompt:

```
Given the mini diploma topic "{TOPIC}", generate 9 lesson titles following this structure:

Module 1 - Foundation:
1. {Topic} Foundations
2. [Core concept that explains WHAT this field is about]
3. [Core concept that explains WHY this matters]

Module 2 - Deep Dive:
4. [Practical skill or method #1]
5. [Practical skill or method #2]
6. [Assessment, testing, or evaluation methods]

Module 3 - Application:
7. [How to work with clients/apply knowledge]
8. [Business, marketing, or ethics]
9. Your Next Step (or "Launching Your {relevant term}")

Keep titles:
- Short (2-4 words)
- Action-oriented where possible
- Specific to the topic/niche
```

---

## Sample Output: Pet Nutrition

If topic = "Pet Nutrition", Claude would generate:

```typescript
const PET_NUTRITION_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Pet Nutrition Foundations", module: 1 },
    { id: 2, title: "Species-Specific Diets", module: 1 },
    { id: 3, title: "Reading Pet Food Labels", module: 1 },
    { id: 4, title: "Common Nutritional Issues", module: 2 },
    { id: 5, title: "Therapeutic Diets", module: 2 },
    { id: 6, title: "Nutritional Assessment", module: 2 },
    { id: 7, title: "Client Consultations", module: 3 },
    { id: 8, title: "Building Your Practice", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];
```
