# 🧟 AccrediPro Zombie Profiles Registry

> Last Updated: January 17, 2026

## Overview

This document tracks all available zombie (AI-generated user) profiles for social proof across the AccrediPro platform.

---

## 📊 Current Inventory

| Source | Count | Status |
|--------|-------|--------|
| **AI-Generated Profile Images** | 325 | ✅ Ready |
| **Existing DB Zombie Profiles** | 328 | ✅ Active |
| **Total Available** | **653** | ✅ |

---

## 🖼️ Image Assets

**Location:** `/docs/User_Profile_img/`

### File Naming Convention
```
user_{age}_{scene}_{timestamp}.png
```

**Examples:**
- `user_45_kitchen_baking_1767801442.png`
- `user_52_hiking_trail_1767800683.png`
- `user_38_yoga_class_1767801180.png`

### Age Distribution (40-65)
All images feature women in the 40-65 age range targeting our core demographic.

### Scene Categories (109 unique scenes)

#### Home Life
- `bathroom_mirror` - Morning routines
- `bedroom_morning` - Waking up selfies
- `living_room_couch` - Relaxing at home
- `kitchen_cooking` / `kitchen_baking` - Cooking scenes
- `home_office` - Working from home
- `front_porch_coffee` - Morning coffee moments
- `laundry_room` - Everyday chores
- `craft_room` - Hobbies at home

#### Car & Errands
- `car_parking_lot` - Shopping trips
- `car_drive_thru` - Coffee runs
- `car_school_pickup` - Mom life
- `car_road_trip` - Travel vibes
- `grocery_store` / `target_shopping` / `costco_run` - Shopping

#### Outdoor & Fitness
- `hiking_trail` - Active lifestyle
- `beach_vacation` - Vacation mode
- `park_walk` / `dog_park` - Daily walks
- `gym_workout` / `yoga_class` - Fitness
- `camping` / `lake_dock` - Nature getaways

#### Healthcare Workers
- `nurse_scrubs_break` - Nurses on break
- `nurse_station` - At work
- `medical_office` - Healthcare settings
- `hospital_cafeteria` - Hospital life
- `physical_therapist` - PT clinic
- `dental_hygienist` - Dental office
- `emt_ambulance` - First responders

#### Single Mom Life
- `singlemom_morning_chaos` - Juggling it all
- `singlemom_homework_help` - Helping kids
- `singlemom_soccer_practice` - Sideline mom
- `singlemom_laundry_mountain` - Never-ending laundry
- `singlemom_dinner_prep` - Feeding the family

#### Mom with Kids
- `mom_playground` - At the park
- `mom_baby_carrier` - New mom life
- `mom_school_drop` - Freedom moments
- `mom_birthday_party` - Party planning
- `mom_dance_recital` - Proud mama

#### Wellness & Health Journey
- `health_coach_office` - Professional setting
- `nutrition_consult` - Teaching clients
- `fitness_instructor` - Leading classes
- `yoga_instructor` - Zen teacher vibes
- `functional_medicine` - Holistic practitioner

#### Social & Fun
- `book_club` - Friends gathering
- `brunch_friends` - Weekend vibes
- `wine_tasting` - Girls trip
- `restaurant_birthday` - Celebrations
- `wedding_guest` - Dressed up

---

## 🗄️ Database Schema

```prisma
model ZombieProfile {
  id              String   @id @default(cuid())
  name            String
  avatar          String?
  location        String?  // "Texas", "California"
  personalityType String   // "leader", "struggler", "questioner", "buyer"
  progressCurve   Json?    // Day-by-day progress pattern
  backstory       String?  // Short bio for authenticity
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
}
```

---

## 🎭 Personality Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Leader** | Enthusiastic, shares wins | "Just finished module 3! 🎉" |
| **Struggler** | Relatable challenges | "Module 2 was tough but worth it" |
| **Questioner** | Asks good questions | "Has anyone tried the gut protocol?" |
| **Buyer** | Testimonial-ready | "Best investment I've made!" |

---

## 📍 Location Pool (US States)

```
Texas, California, Florida, New York, Ohio, Pennsylvania, 
Illinois, Georgia, North Carolina, Michigan, Arizona, 
Washington, Colorado, Tennessee, Virginia, Oregon, Minnesota, 
Wisconsin, Massachusetts, Indiana, South Carolina
```

---

## 🔧 Usage

### For Live Chat Messages
```typescript
// Pull random zombie for chat
const zombie = await prisma.zombieProfile.findFirst({
  where: { isActive: true },
  orderBy: { createdAt: 'asc' },
  skip: Math.floor(Math.random() * totalZombies)
});
```

### For Community Posts
```typescript
// Get zombie with specific personality
const zombie = await prisma.zombieProfile.findFirst({
  where: { 
    isActive: true,
    personalityType: 'leader'
  }
});
```

### For Pod Members
```typescript
// Assign zombies to study pods
await prisma.podMember.create({
  data: {
    podId,
    zombieId: zombie.id,
    isZombie: true
  }
});
```

---

## 📈 Scaling Plan

| Phase | Zombies | Timeline |
|-------|---------|----------|
| Current | 653 | ✅ Ready |
| Phase 2 | 1,000 | Generate 347 more images |
| Phase 3 | 2,500 | For multi-niche scaling |

---

## 🔄 Image Generation Script

**Location:** `/docs/User_Profile_img/generate_user_profiles.py`

```bash
# Generate 100 new images
python3 generate_user_profiles.py --count 100
```

**Features:**
- WaveSpeed AI image generation
- Duplicate detection (checks existing files)
- 109 unique scene templates
- Age range: 40-65
- US target demographic

---

## ⚠️ Quality Control

Images have been filtered to remove:
- ❌ Negative/sad expressions
- ❌ Overly tired/exhausted looks
- ❌ AI artifacts (weird hands, distorted features)
- ❌ Duplicate age+scene combinations

**Kept:** Only positive, relatable, authentic-looking selfies.

---

## 🏷️ Tags for Filtering

Each zombie profile can be tagged for smart selection:
- `healthcare_worker` - Nurses, therapists, medical staff
- `single_mom` - Single parent themed
- `mom_with_kids` - Family-focused
- `fitness_focused` - Gym, yoga, hiking
- `home_life` - Kitchen, crafts, gardening
- `professional` - Office, coworking
- `social` - Friends, events, outings
