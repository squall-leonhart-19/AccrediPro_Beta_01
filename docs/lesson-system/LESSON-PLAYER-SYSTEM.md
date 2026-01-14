# Lesson Player System Documentation

## Overview

All courses on AccrediPro use a unified **LessonPlayer** component that renders lesson content with a consistent layout including sidebar navigation and coach chat.

## Route Structure

**Main Route (ALL courses):**
```
/learning/[courseSlug]/[lessonId]
```

This single route handles ALL courses:
- Functional Medicine Certification
- Gut Health Certification
- Women's Hormone Health
- All other certifications and mini-diplomas

## Component Architecture

```
src/app/(lesson)/learning/[courseSlug]/[lessonId]/page.tsx
    └── imports → src/components/courses/lesson-player.tsx
                      └── imports → src/components/courses/course-sidebar.tsx
```

### LessonPlayer Component
**Path:** `src/components/courses/lesson-player.tsx`

Features:
- Left sidebar with course modules and lessons (desktop)
- Main content area with HTML lesson content
- Right chat panel with coach messaging (desktop XL)
- Mobile-responsive with overlay sidebar/chat
- Notes section (saved to localStorage)
- Progress tracking and completion
- Navigation (prev/next lesson)

### CourseSidebar Component
**Path:** `src/components/courses/course-sidebar.tsx`

Features:
- Course title and progress percentage
- Collapsible module accordion
- Lesson list with completion checkmarks
- Current lesson highlighting

## Lesson Content Format

Lessons are stored in the database as HTML with embedded CSS. The **Gold Standard** format includes:

1. **Module Header Card** - Title, reading time, content type badges
2. **ASI Credential Strip** - "ASI Accredited Content" badge
3. **Table of Contents** - Numbered sections (01, 02, etc.)
4. **Module Connection** - Links to previous learning
5. **Welcome Box** - Introduction paragraph
6. **Learning Objectives** - What you'll learn
7. **Case Study** - Patient profile with quote
8. **Main Content** - H2 sections with content
9. **Coach Tips** - Minimum 4 practical tips
10. **Check Understanding** - 4 quiz questions with reveal answers
11. **Key Takeaways** - Summary bullet points
12. **References** - Academic citations

## Database Storage

Lesson content is stored in the `Lesson` model:
```prisma
model Lesson {
  id        String   @id
  title     String
  content   String?  @db.Text  // HTML content with embedded CSS
  // ... other fields
}
```

## Applying to New Courses

To transform lessons for a new course to Gold Standard format:

1. **Python Script:** `scripts/transform-parallel.py`
   - Uses Claude API to transform lessons
   - Requires API keys set as environment variables
   - Supports parallel processing with multiple keys

2. **Import Script:** `scripts/import-all-fm-lessons.ts`
   - Imports HTML files from `FM/FM-Update/` to database
   - Maps filenames to lesson records

## Responsive Breakpoints

| Breakpoint | Sidebar | Chat Panel | Chat Toggle |
|------------|---------|------------|-------------|
| Mobile (<1024px) | Hidden (overlay) | Hidden (overlay) | Visible |
| Tablet (1024px+) | Visible | Hidden (overlay) | Visible |
| Desktop XL (1280px+) | Visible | Visible | Hidden |

## Legacy Routes (Deprecated)

These routes exist but should NOT be used:
- `/courses/[slug]/learn-v2/[lessonId]` - Old V2 player
- `/courses/[slug]/learn-v3/[lessonId]` - Old V3 player

All links should point to `/learning/[courseSlug]/[lessonId]`

## CSS Classes Reference

Key classes used in Gold Standard lessons:
- `.lesson-wrapper` - Main container
- `.module-header-card` - Header section
- `.asi-credential-strip` - ASI badge
- `.toc-box`, `.toc-list`, `.section-num` - Table of contents
- `.module-connection` - Connection box
- `.objectives-box` - Learning objectives
- `.case-study`, `.patient-profile` - Case studies
- `.coach-tip`, `.tip-label` - Coach tips
- `.check-understanding`, `.question-item`, `.reveal-btn` - Quiz
- `.takeaways-box` - Key takeaways
- `.references-box` - References
- `.highlight` - Highlighted terms

## Quiz Functionality

Quiz reveal buttons use inline JavaScript:
```javascript
function toggleAnswer(btn) {
  const answer = btn.nextElementSibling;
  const isHidden = answer.style.display === 'none' || !answer.style.display;
  answer.style.display = isHidden ? 'block' : 'none';
  btn.textContent = isHidden ? 'Hide Answer' : 'Reveal Answer';
}
```

This script is embedded in the lesson HTML and executed by the LessonPlayer component.

---

**Last Updated:** January 2026
**Applies To:** All courses on AccrediPro LMS
