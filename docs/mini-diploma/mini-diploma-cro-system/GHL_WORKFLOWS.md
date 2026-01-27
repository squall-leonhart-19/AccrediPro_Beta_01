# GHL (GoHighLevel) SMS Workflows

> SMS automation workflows for Mini Diploma funnel.
> Triggered via webhooks from AccrediPro LMS.

---

## Webhook Endpoint

All webhooks send to GHL's incoming webhook URL:
```
https://services.leadconnectorhq.com/hooks/[LOCATION_ID]/[WEBHOOK_ID]
```

Payload format:
```json
{
  "email": "user@example.com",
  "first_name": "Maria",
  "milestone": "mini_diploma_started",
  "category": "functional-medicine",
  "timestamp": "2024-01-15T14:30:00Z",
  "custom_data": {}
}
```

---

## Workflow 1: Welcome Sequence

**Trigger:** `mini_diploma_started`
**When:** User completes first lesson

### Message 1 - Immediate
```
Hey {{first_name}}! 🎉

It's Sarah from AccrediPro.

I saw you just started your Functional Medicine Mini Diploma - so exciting!

Quick tip: The real magic happens in Lessons 7-9. That's where everything clicks.

You've got this! 💛

Reply STOP to unsubscribe
```

### Message 2 - Day 2 (if not completed)
```
{{first_name}}, how's the Mini Diploma going?

I noticed you're making progress. Lesson {{current_lesson}} is a good one!

Remember: 15-20 minutes a day is all it takes.

Rooting for you!
- Sarah

Reply STOP to unsubscribe
```

---

## Workflow 2: Engagement Nudges

**Trigger:** `engagement_drop` (via Oracle churn risk)
**When:** User hasn't logged in for 48+ hours

### Day 2 Nudge
```
Hey {{first_name}}, just checking in!

I noticed you haven't been back to your Mini Diploma in a couple days.

Everything okay?

If you're stuck on something, just reply here - I read every message.

- Sarah

Reply STOP to unsubscribe
```

### Day 5 Nudge (if still inactive)
```
{{first_name}}, this is Sarah.

I don't want to be annoying, but I also don't want you to give up when you're so close!

You've already completed {{lessons_completed}} lessons. That's more than most people ever do.

What's holding you back? Seriously - reply and tell me. I want to help.

Reply STOP to unsubscribe
```

### Day 10 Nudge (final attempt)
```
Last message from me, {{first_name}}.

I know life gets busy. No judgment.

But you took the first step for a reason. That version of you who signed up? She's still there.

Your Mini Diploma is waiting whenever you're ready. No expiration.

💛 Sarah

Reply STOP to unsubscribe
```

---

## Workflow 3: Completion Celebration

**Trigger:** `mini_diploma_completed`
**When:** User passes final exam

### Immediate
```
{{first_name}}!!! 🎉🎉🎉

YOU DID IT!

You just passed your Functional Medicine exam!

I'm SO proud of you. Check your email - I sent you something special.

This is just the beginning!
- Sarah

Reply STOP to unsubscribe
```

---

## Workflow 4: Scholarship Urgency

**Trigger:** `scholarship_activated`
**When:** After exam completion, scholarship countdown starts

### Hour 12
```
Hey {{first_name}}, Sarah here.

Just wanted to remind you - your ASI Graduate Scholarship ($297 for everything) expires in 12 hours.

After that, you'd have to wait until next month's enrollment window.

No pressure - just didn't want you to miss it if you're interested!

Questions? Just reply.

Reply STOP to unsubscribe
```

### Hour 23 (1 hour before expiration)
```
{{first_name}} - final heads up.

Your $297 scholarship expires in 1 hour.

This is the real deal. I've seen too many women say "later" and then later never comes.

Whatever you decide, I'm proud of what you accomplished.

💛 Sarah

Reply STOP to unsubscribe
```

---

## Workflow 5: Post-Purchase Welcome

**Trigger:** `certification_enrolled`
**When:** User completes scholarship purchase

### Immediate
```
{{first_name}}!!! WELCOME TO THE FAMILY! 🎉

Best decision you'll ever make. Seriously.

Here's what happens next:
1. Check your email for login details
2. Start Module 1 when you're ready
3. Join us Thursday for mentorship!

I can't wait to see you in the community!

- Sarah

Reply STOP to unsubscribe
```

### Day 3 (if hasn't started)
```
Hey {{first_name}}!

I noticed you haven't started Module 1 yet.

Totally understand if life got busy! But the sooner you start, the sooner you can help your first client.

The login link is in your email. Let me know if you can't find it!

- Sarah

Reply STOP to unsubscribe
```

---

## Workflow 6: Recovery Sequences

### Never Logged In (Day 1)
**Trigger:** `never_logged_in` - 24h after signup, never accessed account

```
Hey {{first_name}}, it's Sarah!

I noticed you signed up for the Mini Diploma but haven't logged in yet.

Sometimes the login email goes to spam - check there first!

If you can't find it, just reply here and I'll resend it.

- Sarah

Reply STOP to unsubscribe
```

### Never Logged In (Day 3)
```
{{first_name}}, still can't get in?

Just reply "RESEND" and I'll send you a fresh login link right away.

Or if something else is going on, let me know. I'm here to help!

- Sarah

Reply STOP to unsubscribe
```

### Abandoned at Lesson 1 (Day 2)
**Trigger:** `abandoned_early` - Started L1, never progressed

```
Hey {{first_name}}!

I saw you started Lesson 1 - that's awesome!

Did something come up? Or did you have questions about the content?

Lessons 2-3 are where it really starts to get good. Just 15 min today?

- Sarah

Reply STOP to unsubscribe
```

---

## Workflow 7: Re-engagement (Long Term)

**Trigger:** `dormant_30_days` - No activity for 30+ days

```
{{first_name}}, it's been a minute!

I've been thinking about you. Your Mini Diploma is still there, waiting.

Things have been exciting here - we just certified our 1,300th practitioner!

If you ever want to pick back up, just log in. No judgment, no expiration.

Miss you in the community!
- Sarah

Reply STOP to unsubscribe
```

---

## GHL Workflow Configuration

### Tags to Create
- `mini_diploma_started`
- `mini_diploma_completed`
- `scholarship_activated`
- `scholarship_expired`
- `certification_enrolled`
- `high_engagement`
- `at_risk`
- `dormant`
- `recovered`

### Custom Fields
- `mini_diploma_category` (text)
- `lessons_completed` (number)
- `exam_score` (number)
- `scholarship_deadline` (date)
- `last_activity` (date)
- `churn_risk` (number 0-100)

### Automation Rules

1. **Entry Triggers**
   - Webhook received with matching milestone
   - Contact created/updated with specific tag

2. **Exit Conditions**
   - User completes desired action
   - User unsubscribes (STOP)
   - 10 days pass without engagement
   - User enters higher-priority workflow

3. **Timing**
   - Respect 8am-8pm local time
   - Never send more than 2 SMS per day
   - Minimum 4 hours between messages

4. **A/B Testing**
   - Test message variants by splitting 50/50
   - Track reply rates and conversion
   - Promote winners after 100+ sends

---

## Reply Handling

### Auto-Responses

**"STOP" / "UNSUBSCRIBE"**
→ Immediately remove from all SMS workflows, add `sms_opted_out` tag

**"RESEND"**
→ Trigger login link email resend
→ Reply: "Done! Check your email (and spam folder). Let me know if you still can't find it!"

**"HELP" / "QUESTION"**
→ Flag for human review
→ Reply: "Got it! I'll get back to you personally within a few hours. - Sarah"

**Positive replies (thanks, excited, etc.)**
→ Flag for human follow-up
→ Reply: "You're so welcome! Let me know if you need anything. 💛"

**Questions about content/program**
→ Flag for human review
→ Reply: "Great question! Let me look into that and get back to you soon."

---

## Compliance Notes

1. **TCPA Compliance**
   - Only message users who opted in during signup
   - Include "Reply STOP to unsubscribe" in every message
   - Process STOP requests immediately (< 30 seconds)
   - Keep opt-out records for 4 years

2. **Message Content Rules**
   - No ALL CAPS (except for emphasis on 1-2 words)
   - No excessive emojis (2-3 max)
   - No misleading claims or false urgency
   - Always identify sender (Sarah / AccrediPro)

3. **Timing Restrictions**
   - No messages before 8am or after 9pm local time
   - No messages on major holidays
   - Reduce frequency on weekends

4. **Documentation**
   - Log all messages sent and received
   - Track opt-out rates by workflow
   - Monitor reply sentiment monthly
