# Gold Standard Lesson Template Guide

> **Master template for premium lesson HTML across all courses**

---

## Files in This Folder

| File | Purpose |
|------|---------|
| `gold-standard-css-v5.css` | Complete CSS stylesheet (embed in lesson `<style>` tags) |
| `lesson-template.html` | Blank template with all required sections |
| `quiz-toggle-script.js` | JavaScript for reveal/hide quiz answers |
| `EXAMPLE-Lesson_1.2_FM.html` | Real example from FM Complete Certification |

---

## Required Lesson Sections

Every lesson MUST include:

| # | Section | Class/ID |
|---|---------|----------|
| 1 | **Module Header Card** | `.module-header-card` |
| 2 | **ASI Credential Strip** | `.asi-credential-strip` |
| 3 | **Table of Contents** | `.toc-box` (4-6 items) |
| 4 | **Module Connection** | `.module-connection` |
| 5 | **Welcome Box** | `.welcome-box` |
| 6 | **Learning Objectives** | `.objectives-box` (4-6 objectives) |
| 7 | **Case Study** | `.case-study` (recommended) |
| 8 | **Main Content** | `h2`, `h3`, `p`, lists |
| 9 | **Coach Tips** | `.coach-tip` (minimum 4 per lesson) |
| 10 | **Check Your Understanding** | `.check-understanding` (exactly 4 questions) |
| 11 | **Key Takeaways** | `.takeaways-box` |
| 12 | **References** | `.references-box` (5-8 citations) |

---

## CSS Classes Reference

### Header Components
- `.module-header-card` - Burgundy gradient header
- `.lesson-title` - Main lesson title
- `.meta-badge` - Time/type badges
- `.asi-credential-strip` - ASI accreditation bar

### Content Boxes
- `.welcome-box` - Cream/gold intro box
- `.objectives-box` - Purple learning objectives
- `.case-study` - White card with header
- `.coach-tip` - Yellow tip box with 💡
- `.alert-box.warning` - Yellow alert
- `.alert-box.success` - Green alert
- `.alert-box.info` - Purple alert

### Comparison Elements
- `.comparison-grid` - 2-column grid
- `.comparison-card.conventional` - Red-topped card
- `.comparison-card.functional` - Green-topped card

### Interactive
- `.check-understanding` - Quiz container
- `.question-item` - Single question
- `.reveal-btn` - Toggle answer button

---

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Burgundy | `#722F37` | Headers, accent text |
| Gold | `#B8860B` | Underlines, ASI logo |
| Purple | `#7e22ce` | Objectives, info boxes |
| Green | `#22c55e` | Success, functional |
| Red | `#ef4444` | Conventional, warning |
| Yellow | `#f59e0b` | Coach tips, alerts |

---

## AI Lesson Generation Prompt

```markdown
# Generate Lesson HTML

Generate a complete lesson in HTML using the AccrediPro Gold Standard template.

## CONTEXT:
Course: [COURSE_NAME]
Module: [MODULE_NUMBER] - [MODULE_NAME]
Lesson: [LESSON_NUMBER] - [LESSON_TITLE]
Niche: [e.g., functional medicine, autism coaching, christian coaching]
Duration: [XX] min read

## REQUIREMENTS:
1. Use ALL required sections from the Gold Standard template
2. Include exactly 4 "Coach Tips" spread throughout
3. Include exactly 4 quiz questions with reveal/hide
4. Include 5-8 academic references
5. Use the exact CSS classes from gold-standard-css-v5.css
6. Embed the full CSS in <style> tags

## LESSON CONTENT TO TRANSFORM:
[PASTE RAW LESSON CONTENT HERE]

## OUTPUT:
Complete HTML file ready to import to database.
```

---

## Workflow

1. **Create lesson content** (raw text/outline)
2. **Generate HTML** using the prompt above
3. **Embed CSS** from `gold-standard-css-v5.css`
4. **Add JavaScript** from `quiz-toggle-script.js`
5. **Import to database** via admin panel or script
