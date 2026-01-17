# GHL SMS Sequences for Mini Diploma

Copy these SMS messages into GoHighLevel for your 48-hour completion sequence.

---

## PHASE 1: FIRST 6 HOURS (Critical Engagement Window)

### Hour 1 SMS - Friendly Check-in
```
Hey {{first_name}}! Sarah here. Lesson 1 takes just 7 min - perfect for a coffee break! Start now: learn.accredipro.academy/functional-medicine-diploma
```

### Hour 6 SMS - Personalized Nudge

**For "Time with Family" motivation:**
```
{{first_name}}, 10 min now = freedom to work from home with family. Start: learn.accredipro.academy/functional-medicine-diploma
```

**For "Help Others" motivation:**
```
{{first_name}}, someone needs your help. Learn how in 10 min. Go: learn.accredipro.academy/functional-medicine-diploma
```

**For "Financial Freedom" motivation:**
```
{{first_name}}, $3k-10k/month starts with 10 min today. Start: learn.accredipro.academy/functional-medicine-diploma
```

**For "Career Change" motivation:**
```
{{first_name}}, your new career starts with Lesson 1. Begin: learn.accredipro.academy/functional-medicine-diploma
```

**Default (no motivation tag):**
```
{{first_name}}, Lesson 1 is only 7 min. Get certified today! Start: learn.accredipro.academy/functional-medicine-diploma
```

---

## PHASE 2: HOURS 12-24 (Build Momentum)

### Hour 18 SMS - Evening Check-in

**For "Time with Family" motivation:**
```
{{first_name}}, 10 min now = freedom to work from home with family. 30h remaining. Start: learn.accredipro.academy/functional-medicine-diploma
```

**For "Financial Freedom" motivation:**
```
{{first_name}}, $3k-10k/month starts with 10 min today. 30h remaining. Start: learn.accredipro.academy/functional-medicine-diploma
```

**Default:**
```
{{first_name}}, Lesson 1 is only 7 min. Get certified today! 30h remaining. Start: learn.accredipro.academy/functional-medicine-diploma
```

---

## PHASE 3: HOURS 24-36 (URGENT - Last Day)

### Hour 30 SMS - 18 Hours Left

**For "Time with Family" motivation:**
```
{{first_name}}, 10 min now = freedom to work from home with family. Only 18h left! Start: learn.accredipro.academy/functional-medicine-diploma
```

**For "Financial Freedom" motivation:**
```
{{first_name}}, $3k-10k/month starts with 10 min today. Only 18h left! Start: learn.accredipro.academy/functional-medicine-diploma
```

**Default:**
```
{{first_name}}, Lesson 1 is only 7 min. Get certified today! Only 18h left! Start: learn.accredipro.academy/functional-medicine-diploma
```

---

## PHASE 4: HOURS 36-48 (FINAL - Last Push)

### Hour 42 SMS - 6 Hours Left (URGENT)
```
{{first_name}}, ONLY 6 HOURS LEFT! Your certification expires TONIGHT. 1 hour to complete = certificate for life. GO NOW: learn.accredipro.academy/functional-medicine-diploma
```

### Hour 47 SMS - FINAL 1 Hour Warning
```
{{first_name}}, 1 HOUR LEFT! This is your LAST chance. Start now, finish before midnight: learn.accredipro.academy/functional-medicine-diploma
```

---

## PHASE 5: POST-EXPIRY (Recovery)

### Hour 60 SMS - Extension Reminder (12h left)
```
{{first_name}}, 12h left on your extension! This is really it. Complete your certification: learn.accredipro.academy/functional-medicine-diploma
```

---

## TRIGGER CONDITIONS (GHL Automation)

### When to send each SMS:

| Hour | SMS | Trigger Tag |
|------|-----|-------------|
| 1 | Friendly check-in | `lead:functional-medicine-mini-diploma` AND NOT `functional-medicine-lesson-complete:1` |
| 6 | Personalized nudge | Same as above, 6 hours after optin |
| 18 | Evening check-in | Same as above, 18 hours after optin |
| 30 | 18 hours left | Same as above, 30 hours after optin |
| 42 | 6 hours left | Same as above, 42 hours after optin |
| 47 | 1 hour left | Same as above, 47 hours after optin |
| 60 | Extension reminder | Same as above, 60 hours after optin |

### Stop Conditions (Don't send if):
- User has tag `functional-medicine-lesson-complete:1` (started the course)
- User has tag `exam_passed:fm-healthcare` (completed the course)
- User has tag `unsubscribed` or `sms_optout`

### Personalization Tags to Check:
- `motivation:time-with-family`
- `motivation:help-others`
- `motivation:financial-freedom`
- `motivation:career-change`
- `income_goal:starter-3-5k`
- `income_goal:replace-job-5-10k`
- `income_goal:scale-business-10k-plus`

---

## NOTES

1. **Character Limit**: Keep SMS under 160 characters for single message pricing
2. **Link Shortening**: Consider using bit.ly or similar to shorten the URL
3. **Testing**: Always test with your own number first
4. **Compliance**: Ensure users opted in to SMS during optin form
5. **Time Zones**: Consider user's local time for sending (avoid 9pm-9am)
