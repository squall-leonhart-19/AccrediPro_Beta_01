# Pet Nutrition & Wellness - SMS Sequence for GoHighLevel

## Overview
SMS templates for the Pet Nutrition & Wellness Mini Diploma 48-hour completion window.

## Trigger Tags
- `lead:pet-nutrition-mini-diploma` - User enrolled in mini diploma
- `pet-nutrition-lesson-complete:X` - User completed lesson X

## SMS Templates

### Hour 1 - Friendly Welcome
**Trigger:** 1 hour after signup, no lesson started
```
Hey {{contact.first_name}}! 🐾 Sarah here. Lesson 1 takes just 7 min - perfect while your fur baby naps! Start now: learn.accredipro.academy/portal/pet-nutrition
```

### Hour 6 - Motivation Nudge
**Trigger:** 6 hours after signup, no lesson started
```
👋 {{contact.first_name}}, your pets are counting on you! 10 min now = healthier pets for life. 42h left! Start: learn.accredipro.academy/portal/pet-nutrition
```

### Hour 18 - Evening Check-in
**Trigger:** 18 hours after signup, no lesson started
```
⏰ {{contact.first_name}}, 30h remaining on your pet nutrition certification. Help your fur babies thrive! Go: learn.accredipro.academy/portal/pet-nutrition
```

### Hour 30 - Urgency Building
**Trigger:** 30 hours after signup, no lesson started
```
🐾 {{contact.first_name}}, 18 hours left! Your pets' health starts with nutrition. Complete your certification: learn.accredipro.academy/portal/pet-nutrition
```

### Hour 42 - URGENT
**Trigger:** 42 hours after signup, no lesson started
```
🚨 {{contact.first_name}}, ONLY 6 HOURS LEFT! Your pet nutrition certification expires TONIGHT. 1 hour to complete = healthier pets for life. GO NOW: learn.accredipro.academy/portal/pet-nutrition
```

### Hour 47 - FINAL WARNING
**Trigger:** 47 hours after signup, no lesson started
```
⏰ {{contact.first_name}}, 1 HOUR LEFT! This is your LAST chance for your pet nutrition certification. Start now, finish before midnight: learn.accredipro.academy/portal/pet-nutrition
```

### Hour 60 - Extension Reminder
**Trigger:** 60 hours after signup (12h into extension), no completion
```
⏰ {{contact.first_name}}, 12h left on your extension! This is really it. Complete your pet nutrition certification: learn.accredipro.academy/portal/pet-nutrition
```

## Completion SMS

### Certificate Earned
**Trigger:** User completes all 9 lessons
```
🎉 CONGRATULATIONS {{contact.first_name}}! You're now a Certified Pet Nutrition Specialist! Download your certificate: learn.accredipro.academy/portal/pet-nutrition/certificate
```

## GHL Workflow Setup

1. **Trigger:** Contact gets tag `lead:pet-nutrition-mini-diploma`
2. **Wait Steps:** Set wait timers for each SMS based on hours above
3. **Conditions:** Check for `pet-nutrition-lesson-complete:1` tag before sending nudges
4. **Stop Condition:** If contact has `pet-nutrition-mini-diploma:completed` tag, exit workflow

## Pixel Tracking
- Pixel Name: BellaPetWellness
- Pixel ID: 1532546858004361
