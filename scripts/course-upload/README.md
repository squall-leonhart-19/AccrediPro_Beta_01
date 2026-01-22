# Course Upload System

Scripts for uploading 80 certifications × 4 tiers = 320 courses to AccrediPro.

## Folder Structure
```
scripts/course-upload/
├── README.md           # This file
├── config.ts           # R2 and DB configuration
├── upload-pdfs.ts      # Upload PDFs to R2
├── seed-courses.ts     # Seed courses to database
├── seed-quizzes.ts     # Seed quizzes from JSON
└── utils/
    ├── r2-client.ts    # R2 S3-compatible client
    └── parser.ts       # Parse course_blueprint.json
```

## R2 Configuration
- **Bucket:** `accredipro-assets`
- **Endpoint:** `https://5329609816d063edb11f40003176f19d.r2.cloudflarestorage.com`
- **Public URL:** `https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev`

## Source Content
- **Location:** `/Courses_Updated_New_Version/`
- **Courses:** 80 certifications
- **Per Course:** L1_Main, L2_Advanced, L3_Master, L4_Practice + PDFs + Final_Exam

## Usage
```bash
# 1. Upload PDFs to R2
npx tsx scripts/course-upload/upload-pdfs.ts

# 2. Seed courses to database
npx tsx scripts/course-upload/seed-courses.ts

# 3. Seed quizzes
npx tsx scripts/course-upload/seed-quizzes.ts
```
