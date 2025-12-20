# CLAUDE.md - AccrediPro LMS

This file provides guidance for AI assistants working on this codebase.

## Project Overview

AccrediPro LMS is a professional certification and mini-diploma platform for 40+ US women in health and wellness. It's a career transformation platform that issues verified certificates for completed specialization modules.

## Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **Database**: PostgreSQL via Prisma 7.1 (hosted on Supabase)
- **Auth**: NextAuth.js 4 with Credentials provider
- **Email**: Resend
- **AI**: OpenAI SDK, Anthropic Claude SDK, ElevenLabs (voice)
- **Forms**: React Hook Form + Zod validation

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Marketing pages
│   ├── (auth)/            # Login, register
│   ├── (dashboard)/       # Authenticated user area
│   ├── (admin)/           # Admin pages
│   └── api/               # API routes
├── components/            # React components (feature-based folders)
│   ├── ui/               # shadcn/ui base components
│   └── [feature]/        # Feature-specific components
├── lib/                   # Utilities & services
├── types/                 # TypeScript definitions
└── hooks/                 # Custom React hooks

prisma/
├── schema.prisma          # Database schema (2000+ lines)
└── scripts/              # Seed scripts
```

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build (prisma generate + next build)
npm run lint         # Run ESLint
npm run db:seed      # Seed database
npm run db:push      # Push schema to DB
npm run db:studio    # Open Prisma Studio
```

## Code Conventions

### Imports
Use the `@/` path alias for src imports:
```typescript
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
```

### Styling
Always use `cn()` utility for class merging:
```typescript
import { cn } from "@/lib/utils";
cn("base-class", conditional && "conditional-class")
```

### API Routes
Follow NextRequest/NextResponse pattern:
```typescript
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Process
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: "Message" }, { status: 500 });
  }
}
```

### Forms
Use React Hook Form with Zod:
```typescript
const schema = z.object({ email: z.string().email() });
const form = useForm({ resolver: zodResolver(schema) });
```

### Database
Use singleton Prisma client from `@/lib/prisma`:
```typescript
import { prisma } from "@/lib/prisma";
const user = await prisma.user.findUnique({ where: { id } });
```

## Key Models

- `User` - Main user account (roles: STUDENT, INSTRUCTOR, MENTOR, ADMIN)
- `Course`, `Module`, `Lesson` - Learning content hierarchy
- `LessonProgress`, `ModuleProgress` - Progress tracking
- `Certificate` - Issued certificates (types: COMPLETION, CERTIFICATION, MINI_DIPLOMA)
- `Enrollment` - User-course enrollments
- `Message` - Direct messaging
- `CommunityPost`, `PostComment` - Community features

## Environment Variables

Required in `.env.local`:
```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
RESEND_API_KEY=...
```

## Important Notes

1. **Build errors ignored** - `next.config.ts` ignores TypeScript/ESLint build errors
2. **No test framework** - No Jest/Vitest setup currently
3. **Turbopack enabled** - Fast dev builds via turbopack
4. **Mini Diploma** - Free lead magnet funnel, key conversion path
5. **Email wrappers** - Use branded wrapper for transactional, personal wrapper for marketing
6. **Certificate generation** - Uses html2canvas + jsPDF

## Recent Development Focus

- CRO (Conversion Rate Optimization) pages
- FM Certification curriculum
- Mini Diploma checkout flows
- Holiday/seasonal offers
- Tracking & analytics
