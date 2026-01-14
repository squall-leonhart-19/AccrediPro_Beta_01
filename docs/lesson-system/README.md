# AccrediPro Lesson System Documentation

This folder contains all documentation and templates for the AccrediPro lesson system.

## Contents

| File | Description |
|------|-------------|
| `README.md` | This file - overview and quick start |
| `LESSON-PLAYER-SYSTEM.md` | React component architecture, routes, database |
| `LESSON_TEMPLATE_GUIDE.md` | Detailed HTML template guide with rules |
| `lesson-template.html` | Blank HTML template to copy for new lessons |
| `gold-standard-css-v5.css` | Complete CSS stylesheet (embed in lessons) |
| `quiz-toggle-script.js` | JavaScript for quiz reveal/hide functionality |
| `example-lesson-5.1.html` | Complete working example (Lesson 5.1) |

## Quick Start

### Creating a New Lesson

1. Copy `lesson-template.html` and rename following convention:
   ```
   Lesson_X.Y_Title_With_Underscores.html
   ```

2. Open `gold-standard-css-v5.css` and paste ALL CSS into the `<style>` tag

3. Fill in all required sections (see checklist below)

4. Test locally by opening in browser

5. Import to database:
   ```bash
   npx tsx scripts/import-all-fm-lessons.ts
   ```

## Required Sections Checklist

Every lesson MUST have:

- [ ] Module Header Card (title, reading time, badges)
- [ ] ASI Credential Strip ("ASI Accredited Content")
- [ ] Table of Contents (4-6 items matching H2 sections)
- [ ] Module Connection (link to previous learning)
- [ ] Welcome Box (intro paragraph)
- [ ] Learning Objectives (4-6 with action verbs)
- [ ] Case Study (patient profile + quote) - *recommended*
- [ ] Main Content (H2 sections matching TOC)
- [ ] Coach Tips (MINIMUM 4 spread throughout)
- [ ] Check Understanding (EXACTLY 4 questions with reveal buttons)
- [ ] Key Takeaways (4-6 bullet points)
- [ ] References (5-8 academic citations)
- [ ] Toggle Script (JavaScript at bottom)

## File Structure

```
docs/lesson-system/
├── README.md                    # This file
├── LESSON-PLAYER-SYSTEM.md      # Component docs
├── LESSON_TEMPLATE_GUIDE.md     # Template rules
├── lesson-template.html         # Blank template
├── gold-standard-css-v5.css     # CSS to embed
├── quiz-toggle-script.js        # Quiz JS
└── example-lesson-5.1.html      # Working example
```

## CSS Classes Quick Reference

### Layout
- `.lesson-wrapper` - Main container
- `.module-header-card` - Header section
- `.lesson-title` - Main title (H1)

### Content Boxes
- `.asi-credential-strip` - ASI badge
- `.toc-box` - Table of contents
- `.module-connection` - Connection box
- `.welcome-box` - Intro paragraph
- `.objectives-box` - Learning objectives
- `.case-study` - Case study section
- `.coach-tip` - Coach tip boxes
- `.check-understanding` - Quiz section
- `.takeaways-box` - Key takeaways
- `.references-box` - References

### Utilities
- `.highlight` - Highlighted text
- `.alert-box.warning` - Warning/insight box
- `.comparison-grid` - Side-by-side comparison

## Automation Scripts

### Transform Lessons (Python + Claude API)
```bash
source .venv/bin/activate
python scripts/transform-parallel.py --modules Module_06
```

### Import to Database
```bash
npx tsx scripts/import-all-fm-lessons.ts
```

## Related Files

- `scripts/transform-parallel.py` - Batch transformation script
- `scripts/import-all-fm-lessons.ts` - Database import script
- `src/components/courses/lesson-player.tsx` - React player component
- `src/components/courses/course-sidebar.tsx` - Sidebar component

---

**Version:** 5.0
**Last Updated:** January 2026
**Applies To:** All AccrediPro courses
