# Zombie Profiles System

## Overview
Zombie profiles are AI-controlled fake profiles used for:
1. **Social proof** - Make the platform appear active and thriving
2. **Community engagement** - Generate realistic comments on community posts
3. **Professionals Directory** - Showcase "verified professionals"

## Profile Sources

### Avatar Images
- Stored in: `/student_avatars/students-profiles-imgs.csv`
- Total: 584 professional headshots
- Source: WordPress uploads at `accredipro.academy/wp-content/uploads/`

### Profile Data
- **Names**: Generated from realistic first/last name combinations
- **Bios**: Rich, varied content with career backgrounds, achievements, and approaches
- **Titles**: Professional certifications (e.g., "Certified Functional Medicine Practitioner")
- **Specialties**: Health/wellness focus areas (Hormone Health, Gut Health, etc.)
- **Locations**: US cities with wellness professional presence

## Current Stats
| Metric | Count |
|--------|-------|
| Total Zombie Profiles | 328 |
| In Professionals Directory | 50 |
| With Rich Bio | 328 |
| With Professional Title | 50 |

## Database Schema

Zombie profiles are stored in the `User` model with:
```prisma
model User {
  isFakeProfile      Boolean @default(false)  // TRUE for zombies
  isPublicDirectory  Boolean @default(false)  // TRUE = shows in /professionals
  professionalTitle  String?                   // "Certified FM Practitioner"
  specialties        String[]                  // ["Hormone Health", "Gut Health"]
  slug               String?                   // URL slug for profile page
  acceptingClients   Boolean @default(false)   // Availability status
}
```

## Management

### Admin Interface
**Location:** `/admin/super-tools/zombies`

Features:
- View all 328 zombie profiles
- Filter by: All | In Directory | Hidden
- Search by name, title, or location
- Toggle directory visibility with one click
- Preview profile cards with avatar, bio, specialties

### API Endpoints
- `GET /api/admin/super-tools/zombies` - Fetch all zombie profiles
- `PATCH /api/admin/super-tools/zombies` - Toggle directory visibility

### Seed Scripts
1. **`prisma/seed-fake-profiles.ts`** - Creates initial fake profiles with avatars from CSV
2. **`prisma/update-directory-profiles.ts`** - Updates existing profiles with professional info

## Usage Guidelines

### When to Add to Directory
- Profile has a realistic, professional avatar
- Bio sounds authentic and detailed
- Title and specialties are set
- Location is specified

### When to Remove from Directory
- Avatar looks obviously AI-generated
- Bio is too generic or templated
- User reports suspicious profile

## Future Improvements
- [ ] Bulk edit functionality
- [ ] AI-generated activity simulation
- [ ] Automated profile rotation
- [ ] Quality scoring algorithm
