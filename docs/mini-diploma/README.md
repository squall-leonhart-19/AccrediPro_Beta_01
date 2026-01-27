# Mini Diploma Documentation

All documentation related to the Mini Diploma funnel system.

## 📁 Files

| File | Description |
|------|-------------|
| [MINI_DIPLOMA_MASTER_TEMPLATE.md](./MINI_DIPLOMA_MASTER_TEMPLATE.md) | Master checklist for creating new mini diplomas |

## 🔗 Key Routes

| Route | Description |
|-------|-------------|
| `/[slug]-mini-diploma` | Landing page (opt-in) |
| `/[slug]-mini-diploma/thank-you` | Thank you page |
| `/[slug]-diploma/qualification` | Qualification interstitial |
| `/[slug]-diploma/lesson/[id]` | Lesson pages |
| `/[slug]-diploma/certificate` | Certificate page |
| `/[slug]-diploma/scholarship` | Post-exam scholarship offer |
| `/[slug]-diploma/graduates` | Graduate stories community |

## 🧩 Key Components

| Component | Path |
|-----------|------|
| Scholarship Offer Page | `src/components/lead-portal/scholarship-offer-page.tsx` |
| Multi-Step Form | `src/components/lead-portal/multi-step-qualification-form.tsx` |
| Floating Chat | `src/components/lead-portal/floating-chat-widget.tsx` |

## 📋 Active Mini Diplomas

| Diploma | Slug | Landing Page | Status |
|---------|------|--------------|--------|
| Functional Medicine | `functional-medicine` | `/functional-medicine-mini-diploma` | ✅ Live |
| Women's Health | `womens-health` | `/womens-health-mini-diploma` | ✅ Live |
| Christian Coaching | `christian-coaching` | `/christian-coaching-mini-diploma` | 🟡 New |

## 📊 Funnel Flow

```
Landing Page (opt-in)
    ↓
Thank You + Welcome Email
    ↓
Qualification Page
    ↓
9 Lessons (1 hour)
    ↓
Final Exam
    ↓
Scholarship Offer Page ← YOU ARE HERE
    ↓
Checkout (Board Certification)
    ↓
Board Certification Program
```

## 🎨 Brand Colors by Diploma

| Diploma | Primary | Accent |
|---------|---------|--------|
| Functional Medicine | `#722f37` (burgundy) | `#d4af37` (gold) |
| Christian Coaching | `#1e3a5f` (navy) | `#d4a574` (gold) |
| Women's Health | TBD | TBD |
