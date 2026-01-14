# AccrediPro Lesson Template Guide v5.0

## Overview

This document defines the **Gold Standard** structure for all FM certification lessons. Every lesson must follow this template to ensure consistency, quality, and proper functionality.

---

## Required Components (In Order)

### 1. HTML Document Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lesson X.X: [Lesson Title]</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
    /* FULL CSS v5.0 HERE - See CSS section below */
    </style>
</head>
<body>
<div class="lesson-wrapper">
    <!-- ALL CONTENT GOES HERE -->
</div>
<script>
function toggleAnswer(btn) {
    const answer = btn.nextElementSibling;
    const isShowing = answer.classList.contains('show');
    if (isShowing) {
        answer.classList.remove('show');
        btn.textContent = 'Reveal Answer';
    } else {
        answer.classList.add('show');
        btn.textContent = 'Hide Answer';
    }
}
</script>
</body>
</html>
```

---

### 2. Header Card (REQUIRED)

```html
<div class="module-header-card">
    <p class="module-label">Module X • Lesson Y</p>
    <h1 class="lesson-title">[Actual Lesson Title]</h1>
    <p class="lesson-subtitle">[Short Subtitle/Tagline]</p>
    <div class="lesson-meta">
        <span class="meta-badge">⏱️ XX min read</span>
        <span class="meta-badge">📋 [Type: Foundations/Application/Case Studies]</span>
    </div>
    <div class="asi-credential-strip">
        <img src="/images/asi-logo.png" alt="ASI Logo">
        <span>Accredited by the American Society of Integrative Medicine</span>
    </div>
</div>
```

**Rules:**
- `lesson-title` must be the ACTUAL lesson title, NOT "Module X: [Topic]"
- Reading time should be estimated (roughly 1 min per 200 words)
- ASI credential strip is MANDATORY

---

### 3. Table of Contents (REQUIRED)

```html
<div class="toc-box">
    <div class="toc-title">📑 In This Lesson</div>
    <div class="toc-grid">
        <div class="toc-item"><span class="toc-number">1</span> [Section Title]</div>
        <div class="toc-item"><span class="toc-number">2</span> [Section Title]</div>
        <div class="toc-item"><span class="toc-number">3</span> [Section Title]</div>
        <div class="toc-item"><span class="toc-number">4</span> [Section Title]</div>
    </div>
</div>
```

**Rules:**
- 4-6 items typically
- Match the actual H2 sections in the lesson
- Grid auto-wraps on mobile

---

### 4. Module Connection Box (REQUIRED)

```html
<div class="module-connection">
    <p><strong>Connection to Your Journey:</strong> [1-2 sentences explaining how this lesson connects to previous lessons and the overall learning journey]</p>
</div>
```

---

### 5. Learning Objectives (REQUIRED)

```html
<div class="objectives-box">
    <div class="objectives-title">🎯 Learning Objectives</div>
    <ul>
        <li>[Objective 1 - start with action verb]</li>
        <li>[Objective 2]</li>
        <li>[Objective 3]</li>
        <li>[Objective 4]</li>
        <li>[Objective 5]</li>
    </ul>
</div>
```

**Rules:**
- 4-6 objectives
- Start each with action verb (Understand, Apply, Identify, Develop, etc.)
- Be specific and measurable

---

### 6. Opening Case Study (RECOMMENDED)

```html
<div class="case-study">
    <div class="case-study-header">
        <div class="case-study-icon">👩‍💼</div>
        <div>
            <div class="case-study-label">Real-World Case</div>
            <h3 class="case-study-title">[Client Name]'s [Challenge]</h3>
        </div>
    </div>
    <div class="patient-profile">
        <p><strong>Client:</strong> [Name], [Age] years old</p>
        <p><strong>Background:</strong> [Brief context]</p>
        <p><strong>Challenge:</strong> [Main issue]</p>
    </div>
    <div class="case-quote">
        "[Direct quote from the client expressing their struggle]"
    </div>
    <div class="case-study-content">
        <p>[Analysis of the case and how it relates to the lesson topic]</p>
    </div>
</div>
```

---

### 7. Main Content Sections

Use `<h2>` for major sections (these should match TOC):

```html
<h2>Section Title</h2>
<p>Content paragraph...</p>
```

Use `<h3>` for subsections within:

```html
<h3>Subsection Title</h3>
```

**Highlighting important terms:**
```html
<span class="highlight">important term</span>
```

---

### 8. Coach Tips (REQUIRED - Minimum 4 per lesson)

```html
<div class="coach-tip">
    <div class="coach-tip-icon">💡</div>
    <div class="coach-tip-content">
        <h4>[Tip Title]</h4>
        <p>[Practical coaching insight or strategy]</p>
    </div>
</div>
```

**Rules:**
- Minimum 4 coach tips spread throughout the lesson
- Focus on practical, actionable advice
- Written from coach-to-coach perspective
- Should feel like insider knowledge

---

### 9. Check Your Understanding (REQUIRED - Exactly 4 questions)

```html
<div class="check-understanding">
    <h3>✏️ Check Your Understanding</h3>

    <div class="check-question">
        <p>1. [Question text]?</p>
        <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
        <div class="answer-text">
            [Complete answer explanation]
        </div>
    </div>

    <div class="check-question">
        <p>2. [Question text]?</p>
        <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
        <div class="answer-text">
            [Complete answer explanation]
        </div>
    </div>

    <div class="check-question">
        <p>3. [Question text]?</p>
        <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
        <div class="answer-text">
            [Complete answer explanation]
        </div>
    </div>

    <div class="check-question">
        <p>4. [Question text]?</p>
        <button class="reveal-btn" onclick="toggleAnswer(this)">Reveal Answer</button>
        <div class="answer-text">
            [Complete answer explanation]
        </div>
    </div>
</div>
```

**Rules:**
- EXACTLY 4 questions
- Questions should test application, not just recall
- Answers should be comprehensive (2-4 sentences)
- JavaScript toggle function MUST be included at bottom of page

---

### 10. Key Takeaways (REQUIRED)

```html
<div class="takeaways-box">
    <h4>🔑 Key Takeaways</h4>
    <div class="takeaway-item">
        <span class="takeaway-icon">🎯</span>
        <p><strong>[Takeaway Title]:</strong> [One sentence summary]</p>
    </div>
    <div class="takeaway-item">
        <span class="takeaway-icon">📊</span>
        <p><strong>[Takeaway Title]:</strong> [One sentence summary]</p>
    </div>
    <div class="takeaway-item">
        <span class="takeaway-icon">🔄</span>
        <p><strong>[Takeaway Title]:</strong> [One sentence summary]</p>
    </div>
    <div class="takeaway-item">
        <span class="takeaway-icon">💚</span>
        <p><strong>[Takeaway Title]:</strong> [One sentence summary]</p>
    </div>
    <div class="takeaway-item">
        <span class="takeaway-icon">🤝</span>
        <p><strong>[Takeaway Title]:</strong> [One sentence summary]</p>
    </div>
</div>
```

**Rules:**
- 4-6 takeaways
- Each should be a single, memorable point
- Use varied emojis for visual interest

---

### 11. References (REQUIRED)

```html
<div class="references-box">
    <div class="references-title">📚 References</div>
    <ol>
        <li>Author, A. (Year). <em>Title of work</em>. Publisher.</li>
        <li>Author, B. (Year). Article title. <em>Journal Name, Volume</em>(Issue), pages.</li>
    </ol>
</div>
```

**Rules:**
- Minimum 5-8 references
- Use proper academic citation format
- Include mix of books, journals, and professional sources

---

## Common Content Components

### Info Cards (for lists of concepts)

```html
<div class="info-card">
    <h4>[Card Title]</h4>
    <div class="info-item">
        <div class="info-icon">🔬</div>
        <div>
            <strong>[Item Title]</strong>
            <span>[Description]</span>
        </div>
    </div>
</div>
```

### Comparison Boxes

```html
<div class="comparison-box">
    <h4>[Comparison Title]</h4>
    <div class="comparison-grid">
        <div class="comparison-item left">
            <h5>[Option A]</h5>
            <ul>
                <li>Point 1</li>
                <li>Point 2</li>
            </ul>
        </div>
        <div class="comparison-item right">
            <h5>[Option B]</h5>
            <ul>
                <li>Point 1</li>
                <li>Point 2</li>
            </ul>
        </div>
    </div>
</div>
```

### Story/Quote Boxes

```html
<div class="story-box">
    <p class="story-quote">"[Quote or story text]"</p>
    <p>[Context or explanation]</p>
</div>
```

---

## CSS Requirements

Every lesson MUST include the complete Gold Standard CSS v5.0 in the `<style>` tag. This includes:

1. **Reset & Base** - Box-sizing, body font
2. **Main Wrapper** - `.lesson-wrapper` (max-width: 900px)
3. **Header Components** - `.module-header-card`, `.module-label`, `.lesson-title`, `.lesson-meta`, `.asi-credential-strip`
4. **Typography** - h2, h3, h4, h5, p, ul, ol, li, `.highlight`
5. **Table of Contents** - `.toc-box`, `.toc-grid`, `.toc-item`, `.toc-number`
6. **Module Connection** - `.module-connection`
7. **Objectives Box** - `.objectives-box`, `.objectives-title`
8. **Case Study** - `.case-study`, `.case-study-header`, `.case-study-icon`, `.patient-profile`, `.case-quote`
9. **Coach Tip** - `.coach-tip`, `.coach-tip-icon`, `.coach-tip-content`
10. **Check Understanding** - `.check-understanding`, `.check-question`, `.reveal-btn`, `.answer-text`
11. **Takeaways** - `.takeaways-box`, `.takeaway-item`, `.takeaway-icon`
12. **References** - `.references-box`, `.references-title`
13. **Responsive Design** - Media queries for mobile

**Full CSS is approximately 600-800 lines.**

---

## JavaScript Requirements

MUST include at bottom of page before `</body>`:

```html
<script>
function toggleAnswer(btn) {
    const answer = btn.nextElementSibling;
    const isShowing = answer.classList.contains('show');
    if (isShowing) {
        answer.classList.remove('show');
        btn.textContent = 'Reveal Answer';
    } else {
        answer.classList.add('show');
        btn.textContent = 'Hide Answer';
    }
}
</script>
```

---

## Common Mistakes to Avoid

1. ❌ Header showing "Module X: [Topic]" instead of actual lesson title
2. ❌ Missing ASI credential strip
3. ❌ Missing Table of Contents
4. ❌ Missing Module Connection box
5. ❌ Less than 4 Coach Tips
6. ❌ Missing Check Your Understanding section
7. ❌ Missing JavaScript for reveal answers
8. ❌ Wrapper div closing prematurely (content outside `.lesson-wrapper`)
9. ❌ Using incomplete CSS (missing component classes)
10. ❌ Missing References section

---

## Quality Checklist

Before finalizing any lesson, verify:

- [ ] Header has correct lesson title (not module name)
- [ ] ASI credential strip present
- [ ] Table of Contents with 4-6 items
- [ ] Module Connection box
- [ ] Learning Objectives (4-6 items)
- [ ] Opening case study (recommended)
- [ ] 4+ Coach Tips throughout
- [ ] 4 Check Your Understanding questions with reveal answers
- [ ] Key Takeaways (4-6 items)
- [ ] References (5-8 citations)
- [ ] Complete CSS v5.0 included
- [ ] JavaScript toggle function included
- [ ] All content inside `.lesson-wrapper`
- [ ] No broken HTML structure

---

## File Naming Convention

```
Lesson_X.Y_Title_With_Underscores.html
```

Examples:
- `Lesson_5.1_Introduction_To_Functional_Nutrition.html`
- `Lesson_5.8_Case_Studies_Nutrition_In_Action.html`

---

## Module Folder Structure

```
FM/FM-Update/
├── Module_00/
│   ├── Lesson_0.1_...html
│   ├── Lesson_0.2_...html
│   └── ...
├── Module_01/
├── Module_02/
├── ...
├── Module_20/
└── shared/
    └── (shared assets if any)
```

---

## Import Process

After creating/updating lessons, run:

```bash
npx tsx scripts/import-all-fm-lessons.ts
```

This imports lessons to database. Ensure the module is defined in `moduleDefinitions` in the script.
