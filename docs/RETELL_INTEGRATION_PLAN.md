# RetellAI Full Closing System — Final Architecture

> **Last Updated:** 2026-01-19 | **Based on:** [Retell AI Docs](https://docs.retellai.com)

## Overview

Complete AI-powered sales closing system using Sarah AI agent. Leads opt-in via Vercel form → GHL stores & triggers → Retell calls → Functions handle actions → GHL manages follow-ups.

---

## System Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  1. LEAD CAPTURE (Vercel)                                                   │
│     Form collects: firstName, lastName, email, phone, 5 qualification Qs   │
│     → API calculates lead_score → Creates user → Webhooks to GHL           │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. GHL WORKFLOW                                                            │
│     Wait 20s → Check dedupe → Set flags → HTTP Request to Retell API       │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. RETELL SARAH CALLS                                                      │
│     Warm intro → Expand motivation → Present offer → Handle objections     │
│     → Close (send_payment_link / schedule_callback / tag_not_now)          │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. POST-CALL (Webhook → GHL)                                               │
│     SOLD → Welcome sequence | CALLBACK → Reminder | NOT NOW → Nurture      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## API: Create Phone Call

**Endpoint:** `POST https://api.retellai.com/v2/create-phone-call`

**Headers:**
```
Authorization: Bearer YOUR_RETELL_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "from_number": "+14157774444",
  "to_number": "+12137774445",
  "override_agent_id": "agent_sarah_closer",
  
  "metadata": {
    "vercel_lead_id": "user_abc123",
    "ghl_contact_id": "ghl_xyz456",
    "source": "mini-diploma"
  },
  
  "retell_llm_dynamic_variables": {
    "first_name": "Jennifer",
    "certification": "Functional Medicine",
    "income_goal": "replace-job-5-10k",
    "budget": "1k-3k",
    "time_commitment": "part-time-10-15h",
    "motivation": "time-with-family",
    "readiness": "yes-ready",
    "lead_score": "85"
  }
}
```

> ⚠️ **CRITICAL:** All values in `retell_llm_dynamic_variables` must be **STRINGS**. Numbers like `85` must be `"85"`.

---

## Dynamic Variables

### Variables You Pass (from GHL contact)

| Variable | Type | Example | Used For |
|----------|------|---------|----------|
| `first_name` | String | `"Jennifer"` | Personalized greeting |
| `certification` | String | `"Functional Medicine"` | Context framing |
| `income_goal` | String | `"replace-job-5-10k"` | Motivation anchoring |
| `budget` | String | `"1k-3k"` | Offer selection |
| `time_commitment` | String | `"part-time-10-15h"` | Objection handling |
| `motivation` | String | `"time-with-family"` | Emotional connection |
| `readiness` | String | `"yes-ready"` | Close strategy |
| `lead_score` | String | `"85"` | Priority/urgency |

### Free System Variables (Auto-Provided)

| Variable | Description |
|----------|-------------|
| `{{current_time}}` | "Thursday, January 19, 2026 at 6:44 PM PST" |
| `{{user_number}}` | Lead's phone number |
| `{{call_id}}` | Unique call ID for tracking |
| `{{session_duration}}` | How long call has been running |
| `{{direction}}` | "outbound" |

### Agent-Level Defaults (Fallbacks)

Set these in Retell agent settings:
```json
{
  "first_name": "there",
  "certification": "Functional Medicine",
  "income_goal": "building a practice",
  "budget": "what works for you",
  "motivation": "making a change",
  "readiness": "exploring options"
}
```

---

## Metadata vs Dynamic Variables

| Field | Purpose | Passed to Agent? |
|-------|---------|------------------|
| `metadata` | Your internal tracking (lead_id, source) | ❌ No |
| `retell_llm_dynamic_variables` | Injected into prompt | ✅ Yes |

---

## Webhook Events

Configure webhook URL in Retell dashboard to receive:

| Event | When | Use Case |
|-------|------|----------|
| `call_started` | Call connected | Update GHL status |
| `call_ended` | Call finished | Log outcome, trigger follow-up |
| `call_analyzed` | Analysis complete | Extract sentiment, summary |

### Disconnection Reasons

| Reason | Meaning | Action |
|--------|---------|--------|
| `user_hangup` | Lead hung up | Tag as "call completed" |
| `agent_hangup` | Sarah ended | Check if closed |
| `dial_no_answer` | No pickup | Retry in 2 hours |
| `dial_busy` | Line busy | Retry in 1 hour |
| `dial_failed` | Technical error | Alert + retry |

### Webhook Payload Example

```json
{
  "event": "call_ended",
  "call": {
    "call_id": "Jabr9TXYYJHfvl6Syypi88rdAHYHmcq6",
    "call_status": "ended",
    "from_number": "+14157774444",
    "to_number": "+12137774445",
    "direction": "outbound",
    "start_timestamp": 1714608475945,
    "end_timestamp": 1714608491736,
    "duration_ms": 15791,
    "disconnection_reason": "user_hangup",
    "transcript": "Agent: Hi Jennifer! It's Sarah...",
    "metadata": { "vercel_lead_id": "user_abc123" },
    "retell_llm_dynamic_variables": { "first_name": "Jennifer" },
    "call_analysis": {
      "call_summary": "Lead expressed interest in Essentials program...",
      "user_sentiment": "Positive",
      "call_successful": true
    }
  }
}
```

---

## GHL Custom Fields

| Field Name | Type | Purpose |
|------------|------|---------|
| `certification` | Text | Certification name |
| `income_goal` | Text | Q1 answer |
| `budget` | Text | Q4 answer (investment level) |
| `time_commitment` | Text | Q2 answer |
| `motivation` | Text | Q3 answer |
| `readiness` | Text | Q5 answer |
| `lead_score` | Number | Calculated score |
| `vercel_lead_id` | Text | Internal ID |
| `retell_call_started` | Checkbox | Dedupe flag |
| `retell_last_call_at` | Date | Last call timestamp |
| `last_payment_link` | URL | Payment link sent |
| `call_outcome` | Dropdown | sold/callback/not_now/no_answer |

---

## Offer Matrix

| Budget Answer | Offer | Price |
|---------------|-------|-------|
| `under-1k` | Starter | $297 |
| `1k-3k` | Essentials | $997 |
| `3k-5k` | Accelerator | $2,997 |
| `5k-plus` | VIP | $4,997 |

---

## Vercel Endpoints to Build

### 1. `/api/retell/send-payment-link`
```
Receives: lead_id, offer_type, phone
Actions: Create Stripe link → Send SMS → Update GHL
```

### 2. `/api/retell/schedule-callback`
```
Receives: lead_id, time_slot
Actions: Book calendar slot → Update GHL → Send SMS
```

### 3. `/api/retell/call-ended`
```
Receives: lead_id, outcome, notes
Actions: Update GHL → Trigger workflow
```

### 4. `/api/webhooks/retell` (Incoming)
```
Receives: Retell webhook events
Actions: Parse event → Update GHL → Log
```

---

## Environment Variables

```bash
RETELL_API_KEY=your_retell_key
RETELL_AGENT_ID=your_agent_id
RETELL_PHONE_NUMBER=+14157774444
GHL_WEBHOOK_URL=your_ghl_webhook
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
STRIPE_SECRET_KEY=your_stripe_key
```

---

## Checklist

- [x] Enhanced GHL webhook payload (Vercel)
- [ ] Create GHL custom fields
- [ ] Create Retell agent with variables
- [ ] Get Retell Agent ID + API Key
- [ ] Buy Retell phone number
- [ ] Create GHL workflow
- [ ] Build Vercel endpoints
- [ ] Configure Retell webhook
- [ ] Test full flow
