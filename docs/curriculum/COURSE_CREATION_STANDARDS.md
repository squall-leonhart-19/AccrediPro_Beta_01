# AccrediPro Course Creation Standards

> This document defines the standards for creating professional certification courses on the AccrediPro LMS platform.

---

## 📁 Course Folder Structure

```
/FM/[COURSE-CODE]/
├── Module_00/                          # Orientation (always first)
│   ├── Lesson_0.1_Welcome...html
│   ├── Lesson_0.2_How_This_Program_Works.html
│   ├── Lesson_0.3_Setting_Up_For_Success.html
│   ├── Lesson_0.4_Your_Learning_Roadmap_And_Community.html
│   └── quiz_module_00.json
│
├── Module_01/                          # First content module
│   ├── Lesson_1.1_[Topic].html
│   ├── Lesson_1.2_[Topic].html
│   ├── ... (6-8 lessons per module)
│   └── quiz_module_01.json
│
├── Module_XX/                          # Additional modules
│   ├── Lesson_X.X_[Topic].html
│   └── quiz_module_XX.json
│
└── Course_Materials/                   # Central resource library
    ├── [resource_name].pdf
    ├── [template_name].pdf
    └── ...
```

---

## 🎨 Branding & Theming

### Color Themes by Course

| Course | Primary Color | Gradient |
|--------|--------------|----------|
| Functional Medicine | `#800020` (Burgundy) | `#800020` → `#9B2335` |
| Gut Health | `#059669` (Emerald) | `#059669` → `#10B981` |
| Hormone Health | `#7C3AED` (Purple) | `#7C3AED` → `#8B5CF6` |
| Mental Wellness | `#2563EB` (Blue) | `#2563EB` → `#3B82F6` |

### Accent Color (Universal)
- Gold accent: `#B8860B` → `#D4A84B`
- Used for: underlines, decorative elements, gold bar at bottom of headers

### Logo
- Path: `/logoimg/LOGO_ACCREDI.png`
- Header max-width: `220px`
- Footer max-width: `160px`

---

## 📄 Lesson HTML Structure

### Required Sections

```html
<!-- 1. Brand Header -->
<div class="brand-header">
    <img src="/logoimg/LOGO_ACCREDI.png" alt="AccrediPro Academy" class="brand-logo">
</div>

<!-- 2. Module Header -->
<header class="module-header">
    <p class="module-label">Module X: [Module Title]</p>
    <h1 class="lesson-title">Lesson X.X: [Lesson Title]</h1>
    <div class="lesson-meta">
        <span class="meta-item">XX min read</span>
        <span class="meta-item">Lesson X of X</span>
    </div>
</header>

<!-- 3. Learning Objectives (Module 1+ only) -->
<div class="objectives-box">
    <p class="box-label">Learning Objectives</p>
    <ul>
        <li>Objective 1</li>
        <li>Objective 2</li>
    </ul>
</div>

<!-- 4. Key Terms (clinical lessons) -->
<div class="key-terms-box">
    <p class="box-label">🔬 Key Terms to Know</p>
    <div class="terms-grid">
        <div class="term-item">
            <p class="term">Term Name</p>
            <p class="definition">Definition here.</p>
        </div>
    </div>
</div>

<!-- 5. Main Content -->
<h2>Section Title</h2>
<p>Content...</p>

<!-- 6. Case Study (clinical lessons) -->
<div class="case-study">
    <div class="case-study-header">
        <div class="case-study-icon">📋</div>
        <div>
            <p class="box-label">Case Study: [Title]</p>
            <p class="subtitle">[Subtitle]</p>
        </div>
    </div>
    <div class="case-study-content">
        <!-- Content -->
    </div>
</div>

<!-- 7. Check Understanding (interactive) -->
<div class="check-understanding">
    <p class="box-label">✓ Check Your Understanding</p>
    <!-- Questions with reveal buttons -->
</div>

<!-- 8. References (Module 1+ clinical lessons ONLY) -->
<div class="references-box">
    <p class="box-label">📖 References</p>
    <ol>
        <li>Author(s). (Year). Title. Journal, Volume(Issue).</li>
    </ol>
</div>

<!-- 9. Key Takeaways -->
<div class="takeaways-box">
    <p class="box-label">📝 Key Takeaways</p>
    <ul>
        <li>Takeaway 1</li>
        <li>Takeaway 2</li>
    </ul>
</div>

<!-- 10. CTA Box -->
<div class="cta-box">
    <h3>🎯 [Call to Action]</h3>
    <p>Next lesson description</p>
</div>

<!-- 11. Footer -->
<footer class="lesson-footer">
    <img src="/logoimg/LOGO_ACCREDI.png" alt="AccrediPro" class="footer-logo">
    <p class="brand">AccrediPro [Course Name] Certification</p>
    <p class="copyright">© 2024 AccrediPro Academy. All rights reserved.</p>
</footer>
```

---

## 📝 Quiz JSON Format

**File:** `quiz_module_XX.json`

```json
{
  "moduleId": "01",
  "moduleTitle": "Foundations of Gut Health",
  "passingScore": 70,
  "timeLimit": null,
  "questions": [
    {
      "id": 1,
      "question": "What percentage of the immune system is located in the gut?",
      "options": [
        "About 50%",
        "About 60%", 
        "About 70-80%",
        "About 90%"
      ],
      "correctAnswer": 2,
      "explanation": "Research shows 70-80% of immune cells reside in the gut-associated lymphoid tissue (GALT)."
    },
    {
      "id": 2,
      "question": "Which of the following is NOT a type of dysbiosis?",
      "options": [
        "Loss of beneficial organisms",
        "Overgrowth of opportunistic organisms",
        "Loss of microbial diversity",
        "Increase in bacterial diversity"
      ],
      "correctAnswer": 3,
      "explanation": "Increased diversity is generally positive. The three types of dysbiosis are: loss of beneficial organisms, overgrowth of pathogens, and loss of diversity."
    }
  ]
}
```

### Quiz Rules
- **Question type:** Multiple choice only
- **Options:** Always 4 options
- **Correct answer:** Index (0-3) of the correct option
- **Passing score:** 70% (configurable)
- **Explanation:** Always provide for learning

---

## 📚 References Format

**Added to clinical lessons (Module 1+) only. Not Module 0.**

```html
<div class="references-box">
    <p class="box-label">📖 References</p>
    <ol class="references-list">
        <li>Sender R, Fuchs S, Milo R. (2016). Revised estimates for the number of human and bacteria cells in the body. PLoS Biology, 14(8).</li>
        <li>Valdes AM, et al. (2018). Role of the gut microbiota in nutrition and health. BMJ, 361:k2179.</li>
        <li>Fasano A. (2020). All disease begins in the (leaky) gut. F1000Research, 9:69.</li>
    </ol>
</div>
```

### Citation Format
```
Author(s). (Year). Article title. Journal Name, Volume(Issue): Pages.
```

**NO links** - just text citations.

---

## 📁 Course Materials (Resources)

**Location:** `/FM/[COURSE-CODE]/Course_Materials/`

### Standard Resources by Course Type

#### Gut Health Course
- `gut_symptom_tracker.pdf`
- `bristol_stool_chart.pdf`
- `food_diary_template.pdf`
- `elimination_diet_guide.pdf`
- `5r_protocol_cheatsheet.pdf`
- `client_intake_form.pdf`
- `supplement_guide.pdf`

#### How to Reference in Lessons
```html
<div class="alert-box info">
    <p class="alert-label">Resource Available</p>
    <p>Download the <strong>Gut Symptom Tracker</strong> from your Course Materials library to use with this lesson.</p>
</div>
```

---

## 📱 Responsive Design Requirements

### Breakpoints
- Desktop: > 768px
- Tablet: 481px - 768px
- Mobile: ≤ 480px

### Mobile Adjustments (768px)
```css
@media (max-width: 768px) {
    .lesson-container { padding: 20px 16px; }
    .module-header { padding: 25px 20px 22px; }
    .lesson-title { font-size: 22px; }
    h2 { font-size: 20px; }
    p { font-size: 16px; }
    /* Grid layouts become single column */
    .feature-grid, .tips-grid, .learn-grid { grid-template-columns: 1fr; }
}

@media (max-width: 480px) {
    .lesson-container { padding: 15px 12px; }
    .brand-logo { max-width: 180px; }
}
```

### Color Rules for Dark Backgrounds
- Always use `color: white` explicitly
- Never use `opacity` for text on green/colored backgrounds

---

## 📋 Module Structure Guidelines

### Module 0: Orientation (4 lessons)
1. Welcome to Your [Course] Journey
2. How This Program Works
3. Setting Yourself Up for Success
4. Your Learning Roadmap & Community

### Clinical Modules (6-8 lessons each)
1. Introduction / Overview of Topic
2. Core Concept 1
3. Core Concept 2
4. Core Concept 3
5. Assessment / Testing Methods
6. Clinical Patterns / Case Studies
7. Treatment Approaches
8. Summary & Action Steps

### Practice Building Modules (5-6 lessons)
1. Launching Your Practice
2. Client Acquisition
3. Program Design
4. Pricing & Packages
5. Scaling Strategies
6. Summary

---

## ✅ Pre-Publish Checklist

- [ ] All lessons have brand header with logo
- [ ] Module header has correct module/lesson numbers
- [ ] Learning objectives present (Module 1+)
- [ ] Key terms defined (clinical lessons)
- [ ] Case study included (clinical lessons)
- [ ] Check Understanding questions work
- [ ] References section present (clinical lessons)
- [ ] Key Takeaways complete
- [ ] CTA box points to next lesson
- [ ] Footer has logo and copyright
- [ ] Mobile responsive tested
- [ ] Quiz JSON created
- [ ] All text colors visible on backgrounds

---

## 🎯 Quality Standards

### Lesson Length
- **Orientation lessons:** 12-18 min read (~2,500-4,000 words)
- **Clinical lessons:** 25-35 min read (~5,000-7,000 words)
- **Target file size:** 25-55 KB per HTML file

### Content Requirements
- Every concept explained with examples
- Medical claims backed by references
- Case studies feel realistic and relatable
- Interactive elements every 2-3 sections
- Visual variety (cards, grids, boxes, alerts)

### Accessibility
- Proper heading hierarchy (h1 → h2 → h3)
- Alt text on all images
- Sufficient color contrast
- Semantic HTML elements

---

*Last Updated: December 2024*
*Version: 1.0*
