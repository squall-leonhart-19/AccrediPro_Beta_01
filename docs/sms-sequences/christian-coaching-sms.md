# Christian Coaching SMS Sequence for GHL

Copy these messages into GoHighLevel workflows.

---

## Pre-Completion SMS

### SMS 1: Welcome (Trigger: Signup)
```
Hey {{firstName}}! Your Christian Coaching Mini Diploma is ready 🎓 Start now while it's fresh: {{lessonLink}} — Sarah
```

### SMS 2: Reminder (Trigger: +24h, not started)
```
{{firstName}}, quick reminder: your training access expires in 24h! Takes about an hour total: {{lessonLink}}
```

### SMS 3: Urgency (Trigger: +44h, not completed)
```
{{firstName}}, only 4 hours left on your Christian Coaching access! Finish now: {{lessonLink}} — Sarah
```

---

## Post-Completion SMS

### SMS 4: Celebration (Trigger: Exam passed)
```
🎉 YOU DID IT! Your Christian Life Coach certificate is ready. Check your email for the download link! — Sarah
```

### SMS 5: Scholarship (Trigger: +6h post-exam)
```
{{firstName}}, I sent you something special — a scholarship for Board Certification. Check your inbox! Expires in 48h.
```

---

## GHL Workflow Setup Notes

- Trigger SMS 1 on tag: `lead:christian-coaching-mini-diploma`
- Trigger SMS 4 on tag: `christian-coaching-mini-diploma:completed`
- Use GHL custom fields for {{firstName}} and {{lessonLink}}
