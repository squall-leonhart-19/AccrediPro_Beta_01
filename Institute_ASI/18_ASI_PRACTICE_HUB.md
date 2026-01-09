# ASI Practice Hub

## The Complete Operating System for ASI-Certified Practitioners

**Tagline**: *"From Certification to Career. Everything You Need to Build, Run, and Grow Your Practice."*

---

## Executive Summary

The **ASI Practice Hub** is a private, members-only platform that provides ASI-certified practitioners with everything they need to build and run a successful practice. It's the "business-in-a-box" that transforms credentials into careers.

Unlike the public-facing ASI Directory, Practice Hub is the practitioner's private workspace—their command center for managing clients, tracking income, accessing resources, and growing their business.

---

## Strategic Purpose

### Problem We Solve
Most certification programs end at the certificate. Practitioners are left asking:
- "I'm certified... now what?"
- "How do I get clients?"
- "How do I run a business?"
- "What do I charge?"
- "How do I stay compliant?"

### Our Solution
Practice Hub answers every question with done-for-you resources, tools, and guidance. We don't just certify practitioners—we set them up for success.

### Value Proposition
| Without Practice Hub | With Practice Hub |
|----------------------|-------------------|
| Build website from scratch | Pre-built, branded website template |
| Create intake forms yourself | Professional intake forms ready to use |
| Figure out pricing alone | Market-researched pricing guides |
| Write marketing copy | Done-for-you email templates & social posts |
| Find clients on your own | Job board + directory listing included |
| Track clients in spreadsheets | Built-in CRM |
| Cobble together tools | Everything in one place |

---

## URL Structure

```
/practice                              → Practice Hub Dashboard
/practice/clients                      → Client CRM
/practice/clients/[id]                 → Individual Client
/practice/income                       → Income Tracker
/practice/tools                        → Practice Tools
/practice/tools/protocol-builder       → Protocol Builder
/practice/tools/invoices               → Invoicing
/practice/tools/scheduling             → Scheduling Setup
/practice/templates                    → Templates & Swipes
/practice/templates/[category]         → Template Category
/practice/contracts                    → Contracts & Legal
/practice/directory                    → Your Directory Listing
/practice/jobs                         → Find Work / Job Board
/practice/mentorship                   → Mentor Connect
/practice/learning                     → Continuing Education
/practice/referrals                    → Referral Program
/practice/settings                     → Practice Settings
```

---

## Section 1: Practice Dashboard

### Overview
The Practice Dashboard is the landing page when practitioners enter Practice Hub. It provides an at-a-glance view of their practice health and immediate action items.

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  👋 Welcome back, Sarah!                                         │
│  Your practice at a glance                          January 2026 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐       │
│  │  💰 $4,850     │ │  👥 12         │ │  📅 8          │       │
│  │  This Month    │ │  Active        │ │  Appointments  │       │
│  │  Revenue       │ │  Clients       │ │  This Week     │       │
│  │  ↑ 23% vs last │ │  +2 new        │ │                │       │
│  └────────────────┘ └────────────────┘ └────────────────┘       │
│                                                                  │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐       │
│  │  ⭐ 4.9        │ │  👁️ 234        │ │  📩 5          │       │
│  │  Directory     │ │  Profile       │ │  New           │       │
│  │  Rating        │ │  Views         │ │  Inquiries     │       │
│  │  (47 reviews)  │ │  this week     │ │                │       │
│  └────────────────┘ └────────────────┘ └────────────────┘       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📋 TODAY'S FOCUS                                Sarah says...   │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🎯 Complete your Directory profile to start getting leads  │  │
│  │    Your profile is 60% complete. Add services & pricing.   │  │
│  │    [Complete Profile →]                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📊 REVENUE TREND                                               │
├─────────────────────────────────────────────────────────────────┤
│  │                                                              │
│  │    $6k ┤                                          ╭──        │
│  │    $5k ┤                              ╭───────────╯          │
│  │    $4k ┤                    ╭─────────╯                      │
│  │    $3k ┤          ╭─────────╯                                │
│  │    $2k ┤    ╭─────╯                                          │
│  │    $1k ┤────╯                                                │
│  │     $0 ┼────┬────┬────┬────┬────┬────┬────┬────┬────┬────   │
│  │        Aug  Sep  Oct  Nov  Dec  Jan  Feb  Mar  Apr  May      │
│  │                                                              │
├─────────────────────────────────────────────────────────────────┤
│  🔔 RECENT ACTIVITY                                             │
├─────────────────────────────────────────────────────────────────┤
│  • New inquiry from Jennifer M. (Perimenopause) - 2 hours ago   │
│  • Payment received: $350 from Maria T. - Yesterday             │
│  • New review: ⭐⭐⭐⭐⭐ from Lisa K. - 2 days ago                │
│  • Client follow-up due: Amanda S. - Today                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  ⚡ QUICK ACTIONS                                                │
├─────────────────────────────────────────────────────────────────┤
│  [+ Add Client]  [📧 Send Invoice]  [📅 Schedule]  [📝 Protocol] │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Dashboard Widgets

#### 1. Revenue Summary
- Current month revenue
- Comparison to previous month (%)
- YTD total
- Revenue goal progress (if set)

#### 2. Client Summary
- Total active clients
- New clients this month
- Clients with upcoming appointments
- Clients needing follow-up

#### 3. Appointment Summary
- Appointments this week
- Next upcoming appointment
- Cancellation rate
- Availability status

#### 4. Directory Performance
- Profile views
- Inquiries received
- Current rating
- Conversion rate (views → inquiries)

#### 5. Today's Focus (AI-Powered)
Coach Sarah suggests the most impactful action:
- Complete profile (if incomplete)
- Follow up with client (if overdue)
- Send invoice (if unpaid)
- Respond to inquiry (if pending)
- Continue education (if expiring)

#### 6. Revenue Trend Chart
- 6-12 month revenue history
- Goal line overlay
- Trend indicator

#### 7. Recent Activity Feed
- New inquiries
- Payments received
- Reviews posted
- Client activity
- System notifications

---

## Section 2: Client CRM

### Overview
A lightweight but powerful client relationship management system designed specifically for wellness practitioners. Not bloated like Salesforce—just what you need.

### Client List View
```
┌─────────────────────────────────────────────────────────────────┐
│  👥 Clients                                    [+ Add Client]    │
├─────────────────────────────────────────────────────────────────┤
│  🔍 Search clients...     Status: [All ▾]   Sort: [Recent ▾]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 👩 Maria Thompson                                          │  │
│  │    Perimenopause, Hormone Optimization                     │  │
│  │    🟢 Active  •  Started: Oct 2024  •  Revenue: $2,450     │  │
│  │    📅 Next: Jan 15, 2026 (Follow-up)                       │  │
│  │    [View] [Message] [Invoice] [Notes]                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 👩 Jennifer Adams                                          │  │
│  │    Gut Health, SIBO                                        │  │
│  │    🟢 Active  •  Started: Nov 2024  •  Revenue: $1,750     │  │
│  │    📅 Next: Jan 18, 2026 (Lab Review)                      │  │
│  │    [View] [Message] [Invoice] [Notes]                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 👩 Amanda Sullivan                                         │  │
│  │    Thyroid, Weight Management                              │  │
│  │    🟡 Follow-up Due  •  Started: Aug 2024  •  Revenue: $3,100│  │
│  │    ⚠️ Last contact: 3 weeks ago                             │  │
│  │    [View] [Message] [Invoice] [Notes]                      │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 👩 Lisa Rodriguez                                          │  │
│  │    Perimenopause                                           │  │
│  │    🔵 Completed  •  Aug-Dec 2024  •  Revenue: $4,200       │  │
│  │    [View] [Message] [Re-engage]                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Showing 1-10 of 23 clients                     [< Previous] [Next >]│
└─────────────────────────────────────────────────────────────────┘
```

### Client Status Options
| Status | Color | Meaning |
|--------|-------|---------|
| Lead | ⚪ Gray | Inquiry received, not converted |
| Active | 🟢 Green | Currently in program |
| Follow-up Due | 🟡 Yellow | Needs outreach |
| Paused | 🟠 Orange | Temporarily on hold |
| Completed | 🔵 Blue | Finished program successfully |
| Churned | 🔴 Red | Left program early |

### Individual Client Profile
```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Clients                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────┐  Maria Thompson                                      │
│  │  👩    │  maria.thompson@email.com                            │
│  │        │  (555) 123-4567                                      │
│  └────────┘  San Francisco, CA                                   │
│                                                                  │
│  Status: 🟢 Active        Started: October 15, 2024             │
│  Program: 3-Month Hormone Reset                                  │
│  Total Revenue: $2,450                                           │
│                                                                  │
│  [📧 Email] [📱 Text] [📅 Schedule] [📄 Invoice] [📝 Protocol]   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Overview] [Sessions] [Documents] [Protocols] [Payments] [Notes]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PRESENTING CONCERNS                                             │
│  ─────────────────────                                           │
│  • Hot flashes (5-6 per day)                                     │
│  • Night sweats disrupting sleep                                 │
│  • Weight gain (15 lbs in 6 months)                              │
│  • Brain fog and mood swings                                     │
│  • Low energy, fatigue by 3pm                                    │
│                                                                  │
│  GOALS                                                           │
│  ─────                                                           │
│  • Reduce hot flashes to 1-2 per day                             │
│  • Sleep through the night                                       │
│  • Lose 10 lbs                                                   │
│  • Regain mental clarity                                         │
│  • Sustainable energy throughout day                             │
│                                                                  │
│  CURRENT LABS                                                    │
│  ────────────                                                    │
│  📋 DUTCH Complete - Nov 12, 2024 [View Results]                 │
│  📋 Comprehensive Metabolic Panel - Nov 10, 2024 [View Results]  │
│  📋 Thyroid Panel - Nov 10, 2024 [View Results]                  │
│                                                                  │
│  CURRENT PROTOCOL                                                │
│  ────────────────                                                │
│  📝 Hormone Reset Protocol v2 [View] [Edit]                      │
│  Started: Nov 20, 2024                                           │
│                                                                  │
│  UPCOMING                                                        │
│  ────────                                                        │
│  📅 Follow-up Session - Jan 15, 2026 at 2:00 PM                  │
│     Agenda: Review progress, adjust protocol                     │
│                                                                  │
│  SESSION HISTORY                                                 │
│  ───────────────                                                 │
│  ✓ Initial Consultation - Oct 15, 2024 (90 min)                  │
│  ✓ Lab Review - Nov 12, 2024 (60 min)                            │
│  ✓ Protocol Session - Nov 20, 2024 (45 min)                      │
│  ✓ Check-in - Dec 18, 2024 (30 min)                              │
│                                                                  │
│  PROGRESS NOTES                                                  │
│  ──────────────                                                  │
│  Dec 18: Maria reports hot flashes down to 2-3/day. Sleep        │
│  improved. Energy still dipping in afternoon. Adjusted           │
│  adrenal support. Continue current hormone protocol.             │
│                                                                  │
│  [+ Add Note]                                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Client Profile Features

#### Overview Tab
- Contact information
- Presenting concerns
- Goals
- Current status
- Quick actions

#### Sessions Tab
- Session history (date, type, duration)
- Session notes
- Upcoming appointments
- Session scheduler

#### Documents Tab
- Intake forms (completed)
- Lab results
- Uploaded files
- Signed agreements

#### Protocols Tab
- Current protocol
- Protocol history
- Custom protocol builder
- Supplement recommendations

#### Payments Tab
- Payment history
- Outstanding invoices
- Package balances
- Refunds

#### Notes Tab
- Session notes (SOAP format optional)
- Progress notes
- Quick notes
- File attachments

### CRM Features

#### Smart Reminders
- Automatic follow-up reminders
- Lab result review reminders
- Check-in prompts
- Re-engagement suggestions

#### Intake Form Integration
- Pre-built intake forms
- Custom form builder
- Auto-populate client profile
- Health history questionnaire

#### Communication Log
- Email history
- Text history (if connected)
- Notes on calls
- All in one timeline

#### Tags & Segments
- Custom tags (e.g., "VIP", "Referral", "High-touch")
- Filter by tag
- Segment for email campaigns
- Automated tag rules

---

## Section 3: Income Tracker

### Overview
Simple but comprehensive income tracking designed for solo practitioners. Know exactly where you stand financially.

### Income Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  💰 Income Tracker                              2026 ▾          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    JANUARY 2026                              ││
│  ├─────────────────────────────────────────────────────────────┤│
│  │  Revenue:        $4,850          vs Last Month: ↑ 23%       ││
│  │  Expenses:       $420            vs Last Month: ↓ 5%        ││
│  │  ─────────────────────────────────────────────────          ││
│  │  Net Income:     $4,430                                     ││
│  │                                                              ││
│  │  Goal: $5,000    ████████████████████░░░░  97% of goal      ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  YEAR TO DATE (2026)                                        │ │
│  ├────────────────────────────────────────────────────────────┤ │
│  │  Revenue:        $4,850                                     │ │
│  │  Expenses:       $420                                       │ │
│  │  Net Income:     $4,430                                     │ │
│  │                                                              │ │
│  │  Annual Goal: $60,000    ████░░░░░░░░░░░░░░  8%             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📊 REVENUE BY SOURCE                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Initial Consultations      $1,400  ████████████░░░░░░  29%     │
│  Follow-up Sessions         $1,050  ████████░░░░░░░░░░  22%     │
│  3-Month Programs           $1,997  ████████████████░░  41%     │
│  Lab Interpretation         $403    ███░░░░░░░░░░░░░░░  8%      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📈 MONTHLY TREND                                                │
├─────────────────────────────────────────────────────────────────┤
│  │                                                              │
│  │  $6k ┤                                          ╭──          │
│  │  $5k ┤                              ╭───────────╯            │
│  │  $4k ┤                    ╭─────────╯                        │
│  │  $3k ┤          ╭─────────╯                                  │
│  │  $2k ┤    ╭─────╯                                            │
│  │  $1k ┤────╯                                                  │
│  │   $0 ┼────┬────┬────┬────┬────┬────                         │
│  │       Aug  Sep  Oct  Nov  Dec  Jan                           │
│  │                                                              │
├─────────────────────────────────────────────────────────────────┤
│  📋 RECENT TRANSACTIONS                          [+ Add Income] │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Jan 8   Maria Thompson    Follow-up Session      +$175         │
│  Jan 5   Jennifer Adams    Initial Consultation   +$350         │
│  Jan 3   Amanda Sullivan   Lab Review             +$250         │
│  Jan 1   Lisa Rodriguez    3-Month Program (1/3)  +$666         │
│                                                                  │
│  [View All Transactions]                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Income Features

#### Transaction Logging
- Add income manually
- Link to invoices (auto-sync)
- Categories (consultations, programs, products, other)
- Client attribution
- Payment method tracking

#### Expense Tracking
- Business expenses
- Categories (software, marketing, education, supplies)
- Receipt upload
- Recurring expense flagging
- Tax-deductible tagging

#### Goal Setting
- Monthly income goals
- Annual income goals
- Progress visualization
- Milestone celebrations

#### Reports
- Monthly P&L summary
- Quarterly reports
- Year-end summary
- Export to CSV/PDF
- Tax-ready reports

#### Revenue Insights
- Revenue by service type
- Revenue by client
- Average revenue per client
- Client lifetime value
- Trend analysis

---

## Section 4: Practice Tools

### 4.1 Protocol Builder

#### Overview
Create, save, and share personalized client protocols. Pre-loaded with evidence-based templates.

#### Protocol Builder Interface
```
┌─────────────────────────────────────────────────────────────────┐
│  📝 Protocol Builder                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Protocol Name: [Hormone Reset Protocol - Maria T.           ]  │
│                                                                  │
│  Template: [Start from template ▾]                              │
│            • Perimenopause Support                               │
│            • Gut Restoration                                     │
│            • Thyroid Optimization                                │
│            • Adrenal Recovery                                    │
│            • Blank Protocol                                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  SUPPLEMENTS                                         [+ Add]    │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Magnesium Glycinate                                        │  │
│  │ Dosage: 400mg        Timing: Before bed                    │  │
│  │ Duration: Ongoing    Brand: Pure Encapsulations            │  │
│  │ Notes: Start at 200mg, increase after 1 week               │  │
│  │                                              [Edit] [Remove]│  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Vitamin D3 + K2                                            │  │
│  │ Dosage: 5,000 IU     Timing: With breakfast                │  │
│  │ Duration: 3 months   Brand: Thorne                         │  │
│  │ Notes: Retest levels at 3 months                           │  │
│  │                                              [Edit] [Remove]│  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  DIETARY RECOMMENDATIONS                             [+ Add]    │
├─────────────────────────────────────────────────────────────────┤
│  • Increase protein to 100g daily (current ~60g)                │
│  • Add 2 servings cruciferous vegetables daily                  │
│  • Reduce refined carbohydrates                                 │
│  • Eliminate alcohol for first 6 weeks                          │
│  • Focus on blood sugar balance (protein with each meal)        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  LIFESTYLE RECOMMENDATIONS                           [+ Add]    │
├─────────────────────────────────────────────────────────────────┤
│  • Sleep: In bed by 10pm, 7-8 hours minimum                     │
│  • Movement: 30 min walking daily + 2x strength training        │
│  • Stress: 10 min breathwork or meditation daily                │
│  • Light: Morning sunlight exposure 10-15 min                   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  FOLLOW-UP PLAN                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Week 2: Check-in call (15 min) - Assess tolerance              │
│  Week 4: Follow-up session - Review progress, adjust            │
│  Week 8: Labs retest (Thyroid, Vitamin D)                       │
│  Week 12: Program review - Next steps                           │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Save Draft]  [Save & Send to Client]  [Export PDF]  [Print]   │
└─────────────────────────────────────────────────────────────────┘
```

#### Protocol Features
- **Template Library**: Pre-built, evidence-based protocols
- **Custom Protocols**: Build from scratch
- **Supplement Database**: Search supplements with suggested dosages
- **Client Attribution**: Attach protocols to specific clients
- **Version History**: Track protocol changes over time
- **Share with Client**: Send beautiful PDF or portal link
- **Duplicate & Customize**: Copy protocols for similar clients

---

### 4.2 Invoicing

#### Overview
Simple, professional invoicing without needing a separate tool.

#### Invoice Creation
```
┌─────────────────────────────────────────────────────────────────┐
│  📄 Create Invoice                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Client: [Maria Thompson               ▾]                       │
│                                                                  │
│  Invoice #: INV-2026-0015 (auto-generated)                       │
│  Issue Date: January 8, 2026                                    │
│  Due Date: [January 22, 2026   ] (14 days)                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  LINE ITEMS                                          [+ Add]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Follow-up Session (45 min)           ▾]  Qty: [1]  $175.00    │
│  [Lab Interpretation                   ▾]  Qty: [1]  $250.00    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  SUMMARY                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Subtotal:                                        $425.00       │
│  Discount:  [ 0% ▾]                               -$0.00        │
│  ───────────────────────────────────────────────────────        │
│  Total Due:                                       $425.00       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  NOTES TO CLIENT                                                │
├─────────────────────────────────────────────────────────────────┤
│  [Thank you for your continued trust in my practice.        ]   │
│  [Payment is due within 14 days. Please let me know if you  ]   │
│  [have any questions.                                        ]   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  PAYMENT OPTIONS                                                │
├─────────────────────────────────────────────────────────────────┤
│  ☑ Online Payment (Credit Card / ACH)                           │
│  ☑ Venmo / PayPal                                                │
│  ☐ Check / Cash                                                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  [Save Draft]  [Preview]  [Send Invoice]                        │
└─────────────────────────────────────────────────────────────────┘
```

#### Invoice Features
- **Professional Templates**: Branded invoice design
- **Service Library**: Pre-defined services with pricing
- **Package Tracking**: Track package balances
- **Payment Links**: Stripe integration for online payment
- **Automatic Reminders**: Overdue invoice notifications
- **Payment Tracking**: Mark as paid, partial payments
- **Superbill Generation**: For insurance reimbursement
- **Receipt Generation**: Automatic after payment
- **Recurring Invoices**: For ongoing programs
- **Export**: PDF, CSV for accounting

---

### 4.3 Scheduling Setup

#### Overview
Integration guides and tools for connecting your scheduling system.

#### Scheduling Integration
```
┌─────────────────────────────────────────────────────────────────┐
│  📅 Scheduling Setup                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Connect your scheduling tool to sync with Practice Hub:        │
│                                                                  │
│  SUPPORTED INTEGRATIONS                                         │
│  ──────────────────────                                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Calendly   │ │   Acuity    │ │ Cal.com     │ │  Jane App   ││
│  │  ✓ Connected│ │  [Connect]  │ │  [Connect]  │ │  [Connect]  ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
│                                                                  │
│  YOUR BOOKING LINK                                              │
│  ─────────────────                                              │
│  https://calendly.com/drsarahmitchell                           │
│  [Copy Link]  [Open in New Tab]                                 │
│                                                                  │
│  This link will be shown on your Directory profile.             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  APPOINTMENT TYPES                                              │
├─────────────────────────────────────────────────────────────────┤
│  Configure your appointment types:                               │
│                                                                  │
│  ☑ Initial Consultation (90 min)           $350                 │
│  ☑ Follow-up Session (45 min)              $175                 │
│  ☑ Lab Review (60 min)                     $250                 │
│  ☑ Quick Check-in (30 min)                 $100                 │
│  ☐ VIP Day (Full Day)                      $2,500               │
│                                                                  │
│  [Edit Appointment Types]                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Form Builder

#### Overview
Create custom intake forms, questionnaires, and assessments.

#### Pre-Built Form Templates
- **New Client Intake Form** (comprehensive health history)
- **Medical History Questionnaire**
- **Symptom Assessment** (MSQ style)
- **Diet & Lifestyle Questionnaire**
- **Hormone Symptom Checklist**
- **Gut Health Assessment**
- **Sleep Quality Assessment**
- **Stress & Lifestyle Assessment**
- **Follow-up Progress Form**
- **Client Satisfaction Survey**

#### Form Builder Features
- Drag-and-drop form builder
- Question types (text, multiple choice, scale, date, file upload)
- Conditional logic (show/hide based on answers)
- Required fields
- HIPAA-compliant storage
- Auto-populate client profile
- Email form links to clients
- Embedded on website
- Response notifications
- Response analytics

---

## Section 5: Templates & Swipes

### Overview
Done-for-you marketing materials, email templates, and social media content. Never stare at a blank page again.

### Template Categories

#### 5.1 Email Templates
```
┌─────────────────────────────────────────────────────────────────┐
│  📧 Email Templates                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LEAD NURTURE                                                   │
│  ─────────────                                                  │
│  • Welcome to My Practice                                        │
│  • Thank You for Your Inquiry                                    │
│  • What to Expect in Your First Session                          │
│  • Preparing for Your Consultation                               │
│  • Why Functional Medicine? (Educational)                        │
│                                                                  │
│  CLIENT ONBOARDING                                              │
│  ─────────────────                                              │
│  • Welcome to the [Program Name] Program                         │
│  • Intake Form Reminder                                          │
│  • Lab Prep Instructions                                         │
│  • Your Personalized Protocol                                    │
│  • Week 1 Check-in                                               │
│                                                                  │
│  ONGOING CLIENT                                                 │
│  ──────────────                                                 │
│  • Session Reminder (24 hours)                                   │
│  • Session Follow-up & Notes                                     │
│  • Monthly Progress Check-in                                     │
│  • Lab Results Ready                                             │
│  • Protocol Adjustment Update                                    │
│                                                                  │
│  RE-ENGAGEMENT                                                  │
│  ────────────                                                   │
│  • We Miss You! (30 days inactive)                               │
│  • How Are You Feeling? (60 days)                                │
│  • Maintenance Phase Invitation                                  │
│  • Quarterly Check-in Offer                                      │
│  • Anniversary / Milestone Celebration                           │
│                                                                  │
│  MARKETING                                                      │
│  ─────────                                                      │
│  • New Service Announcement                                      │
│  • Workshop / Webinar Invitation                                 │
│  • Seasonal Health Tips                                          │
│  • Client Success Story (with permission)                        │
│  • Holiday Greeting                                              │
│                                                                  │
│  [Browse All Templates]                                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

#### 5.2 Social Media Templates

```
┌─────────────────────────────────────────────────────────────────┐
│  📱 Social Media Templates                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Filter: [All ▾]  [Instagram ▾]  [Facebook ▾]  [LinkedIn ▾]     │
│                                                                  │
│  EDUCATIONAL POSTS                                              │
│  ─────────────────                                              │
│  • 5 Signs Your Hormones Are Out of Balance                      │
│  • The Gut-Brain Connection Explained                            │
│  • Why Your Lab Results Might Be "Normal" But You Feel Terrible  │
│  • 3 Supplements Most Women Over 40 Need                         │
│  • What Your Cravings Are Telling You                            │
│                                                                  │
│  ENGAGEMENT POSTS                                               │
│  ────────────────                                               │
│  • This or That? (Hormone Edition)                               │
│  • Quiz: What's Your Hormone Type?                               │
│  • Comment your biggest health challenge below...                │
│  • True or False: [Myth Buster]                                  │
│  • Drop a 🔥 if you relate to this...                            │
│                                                                  │
│  PROMOTIONAL POSTS                                              │
│  ─────────────────                                              │
│  • New Client Openings Announcement                              │
│  • Free Discovery Call Offer                                     │
│  • Workshop Announcement                                         │
│  • Client Transformation Story                                   │
│  • Testimonial Highlight                                         │
│                                                                  │
│  STORY TEMPLATES                                                │
│  ───────────────                                                │
│  • Day in the Life                                               │
│  • Q&A Prompt                                                    │
│  • Poll Template                                                 │
│  • This Week I Learned...                                        │
│  • Client Win Celebration                                        │
│                                                                  │
│  [View Template]  [Copy Caption]  [Download Graphics]            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Each template includes:
- Caption text (copy-paste ready)
- Hashtag suggestions
- Posting tips
- Canva graphic template link
- Best times to post

---

#### 5.3 Website Copy

Pre-written website sections:
- **Homepage**: Hero section, about section, services overview, testimonials, CTA
- **About Page**: Bio template, credentials section, philosophy statement
- **Services Page**: Service descriptions, pricing format, FAQ
- **Blog Posts**: 10 starter blog posts on core topics
- **FAQ Page**: 20 common questions with answers
- **Contact Page**: Form intro, what to expect, office hours

---

#### 5.4 Script Templates

Conversation scripts for:
- **Discovery Call Script**: Opening, questions, objection handling, closing
- **Initial Consultation Script**: Structure, key questions, next steps
- **Sales Conversation**: Presenting programs, handling objections
- **Follow-up Call Script**: Check-in structure, adjustment conversations
- **Referral Request Script**: How to ask for referrals
- **Testimonial Request Script**: Getting video/written testimonials

---

## Section 6: Contracts & Legal

### Overview
Protect your practice with professional legal templates reviewed by healthcare attorneys.

### Available Documents

#### 6.1 Client Agreements
```
┌─────────────────────────────────────────────────────────────────┐
│  📋 Contracts & Legal                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CLIENT AGREEMENTS                                              │
│  ─────────────────                                              │
│  📄 Client Services Agreement                                    │
│     Comprehensive agreement covering scope, fees, policies       │
│     [Preview] [Customize] [Download Word] [Download PDF]         │
│                                                                  │
│  📄 Informed Consent Form                                        │
│     Consent for wellness coaching / functional nutrition         │
│     [Preview] [Customize] [Download Word] [Download PDF]         │
│                                                                  │
│  📄 Health Coaching Disclaimer                                   │
│     Clarifies you're not providing medical advice                │
│     [Preview] [Customize] [Download Word] [Download PDF]         │
│                                                                  │
│  📄 HIPAA Notice of Privacy Practices                            │
│     Required privacy disclosure (if applicable)                  │
│     [Preview] [Customize] [Download Word] [Download PDF]         │
│                                                                  │
│  📄 Cancellation & Refund Policy                                 │
│     Clear cancellation and refund terms                          │
│     [Preview] [Customize] [Download Word] [Download PDF]         │
│                                                                  │
│  📄 Telehealth Consent Form                                      │
│     For virtual consultations                                    │
│     [Preview] [Customize] [Download Word] [Download PDF]         │
│                                                                  │
│  BUSINESS DOCUMENTS                                             │
│  ──────────────────                                             │
│  📄 Independent Contractor Agreement                             │
│     For hiring other practitioners or assistants                 │
│     [Preview] [Download]                                         │
│                                                                  │
│  📄 Referral Agreement                                           │
│     For formal referral partnerships                             │
│     [Preview] [Download]                                         │
│                                                                  │
│  📄 Non-Disclosure Agreement (NDA)                               │
│     For contractors, VAs, etc.                                   │
│     [Preview] [Download]                                         │
│                                                                  │
│  📄 Photo/Video Release                                          │
│     For testimonials and marketing                               │
│     [Preview] [Download]                                         │
│                                                                  │
│  ⚠️ Disclaimer: These templates are provided for educational     │
│     purposes. Consult with a licensed attorney in your state.    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Contract Features
- **Customizable Fields**: Auto-fill your business info
- **State-Specific Notes**: Guidance on state requirements
- **E-Signature Ready**: HelloSign/DocuSign integration
- **Client Portal**: Clients can sign digitally
- **Storage**: Signed contracts stored securely
- **Expiration Tracking**: Alerts when agreements need renewal

---

## Section 7: Find Work / Job Board

### Overview
Curated job opportunities for ASI-certified practitioners. Get hired by clinics, wellness centers, and telehealth companies.

### Job Board Interface
```
┌─────────────────────────────────────────────────────────────────┐
│  💼 Find Work                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔍 Search jobs...    Location: [All ▾]   Type: [All ▾]         │
│  Specialty: [All ▾]   Remote: [All ▾]   Credential: [Your level]│
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  23 opportunities matching your credentials                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 🌟 FEATURED                                                │  │
│  │ Integrative Health Coach - Parsley Health                  │  │
│  │ 📍 Remote (US)  •  💰 $65-80/hour  •  Part-time            │  │
│  │ 📋 Requires: FM-CP™ or higher                              │  │
│  │                                                            │  │
│  │ Join our team of functional medicine health coaches        │  │
│  │ working with members on nutrition, lifestyle, and...       │  │
│  │                                                            │  │
│  │ Posted: 2 days ago  •  12 applicants                       │  │
│  │                                    [View Details] [Apply]  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Hormone Health Specialist - Women's Wellness Center        │  │
│  │ 📍 Austin, TX  •  💰 $70,000-85,000/year  •  Full-time     │  │
│  │ 📋 Requires: WH-CP™ or BC-FMP™                             │  │
│  │                                                            │  │
│  │ Growing integrative clinic seeking a hormone specialist    │  │
│  │ to work with our perimenopause and menopause patients...   │  │
│  │                                                            │  │
│  │ Posted: 1 week ago  •  8 applicants                        │  │
│  │                                    [View Details] [Apply]  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Contract Nutrition Consultant - Corporate Wellness         │  │
│  │ 📍 Remote  •  💰 $100/hour  •  Contract (10 hrs/week)      │  │
│  │ 📋 Requires: Any ASI Credential                            │  │
│  │                                                            │  │
│  │ Fortune 500 company seeking nutrition consultants for      │  │
│  │ employee wellness program. 1:1 coaching via Zoom...        │  │
│  │                                                            │  │
│  │ Posted: 3 days ago  •  5 applicants                        │  │
│  │                                    [View Details] [Apply]  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Load More Jobs]                                                │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📢 EMPLOYERS: Looking to hire ASI-certified practitioners?     │
│      [Post a Job - Free for first 30 days]                       │
└─────────────────────────────────────────────────────────────────┘
```

### Job Types
- **Full-time Employment**: Clinics, wellness centers, hospitals
- **Part-time Employment**: Flexible hours
- **Contract Work**: Project-based, hourly
- **Telehealth Positions**: Remote coaching/consulting
- **Clinic Partnerships**: Revenue share arrangements
- **Locum/Temp**: Short-term coverage

### Job Features
- **Credential Matching**: Only see jobs you qualify for
- **Salary Transparency**: All jobs show compensation
- **One-Click Apply**: Use your Practice Hub profile
- **Application Tracking**: Track your applications
- **Job Alerts**: Email when matching jobs post
- **Employer Reviews**: See what others say about employers

---

## Section 8: Mentor Connect

### Overview
Connect with experienced practitioners for guidance, supervision, and support.

### Mentor Features
```
┌─────────────────────────────────────────────────────────────────┐
│  🧭 Mentor Connect                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Connect with experienced practitioners for:                     │
│  • Case supervision and consultation                             │
│  • Business mentorship                                           │
│  • Clinical guidance                                             │
│  • Career advice                                                 │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  FIND A MENTOR                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Specialty: [Functional Medicine ▾]  Focus: [Clinical ▾]        │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ┌──────┐  Dr. Jennifer Williams, MC-FMP™                   │  │
│  │ │      │  Master Functional Medicine Practitioner          │  │
│  │ │ 👩‍⚕️ │  15 years experience • 200+ mentees               │  │
│  │ │      │  ★★★★★ (47 reviews)                               │  │
│  │ └──────┘                                                   │  │
│  │                                                            │  │
│  │  Specialties: Gut health, thyroid, autoimmune              │  │
│  │  Offers: Case supervision, business mentorship             │  │
│  │  Rate: $150/hour (1:1) • $50/month (group)                │  │
│  │                                                            │  │
│  │  [View Profile]  [Book Session]                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ┌──────┐  Sarah Chen, BC-FMP™                              │  │
│  │ │      │  Board Certified FM Practitioner                  │  │
│  │ │ 👩 │  8 years experience • 75+ mentees                  │  │
│  │ │      │  ★★★★★ (32 reviews)                               │  │
│  │ └──────┘                                                   │  │
│  │                                                            │  │
│  │  Specialties: Women's hormones, perimenopause              │  │
│  │  Offers: Clinical mentorship, practice building            │  │
│  │  Rate: $125/hour (1:1)                                     │  │
│  │                                                            │  │
│  │  [View Profile]  [Book Session]                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  YOUR MENTORSHIP                                                │
├─────────────────────────────────────────────────────────────────┤
│  Current Mentor: Dr. Jennifer Williams                          │
│  Sessions Completed: 4                                          │
│  Next Session: Jan 20, 2026 at 11:00 AM                         │
│  [View Notes]  [Reschedule]  [Message Mentor]                   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  📢 BECOME A MENTOR                                              │
│  MC-™ or BC-™ credential holders can apply to become mentors.   │
│  Earn $100-200/hour sharing your expertise.                      │
│  [Apply to Become a Mentor]                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Mentor Types
- **Clinical Mentors**: Case supervision, protocol guidance
- **Business Mentors**: Practice building, marketing, operations
- **Career Mentors**: Career transitions, specialization guidance
- **Group Mentorship**: Monthly group calls on specific topics

### Mentorship Requirements
- **To Be a Mentee**: Any ASI credential
- **To Be a Mentor**: BC-™ or MC-™ credential + application

---

## Section 9: Directory Profile Management

### Overview
Edit and manage your public Directory listing from within Practice Hub.

### Profile Editor
```
┌─────────────────────────────────────────────────────────────────┐
│  🌐 Your Directory Listing                     Status: ✓ Live   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Profile Completeness: ████████████████░░░░ 80%                 │
│  Complete your profile to improve visibility!                    │
│                                                                  │
│  Missing:                                                        │
│  • Add a video introduction (+15%)                               │
│  • Add 3 more conditions you treat (+5%)                         │
│                                                                  │
│  [Edit Full Profile]  [View Public Profile]  [Copy Profile Link] │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  QUICK STATS (Last 30 Days)                                     │
├─────────────────────────────────────────────────────────────────┤
│  👁️ 234 Profile Views   📩 12 Inquiries   ⭐ 4.9 Rating (47)   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  RECENT REVIEWS                                                 │
├─────────────────────────────────────────────────────────────────┤
│  ★★★★★ "Amazing practitioner!"                    Jan 5, 2026   │
│  Maria T. - Verified Client                                      │
│  [Respond]                                                       │
│                                                                  │
│  ★★★★★ "Finally found someone who listens"        Dec 28, 2025  │
│  Jennifer K. - Verified Client                                   │
│  [View Response]                                                 │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  SUBSCRIPTION                                                   │
├─────────────────────────────────────────────────────────────────┤
│  Current Plan: Professional ($29/month)                          │
│  Next billing: February 1, 2026                                  │
│                                                                  │
│  [Upgrade to Featured]  [Manage Subscription]                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Section 10: Continuing Education

### Overview
Track CE credits, access ongoing training, and maintain your credentials.

### CE Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  📚 Continuing Education                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  YOUR CREDENTIALS                                               │
│  ─────────────────                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ BC-FMP™ - Board Certified Functional Medicine           │    │
│  │ Issued: March 2024  •  Expires: March 2027              │    │
│  │ CE Required: 30 credits / 3 years                       │    │
│  │ Progress: ████████░░░░░░░░ 16/30 credits (53%)          │    │
│  │                                           [View Details] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ WH-CP™ - Women's Hormone Certified Professional         │    │
│  │ Issued: August 2024  •  Expires: August 2027            │    │
│  │ CE Required: 20 credits / 3 years                       │    │
│  │ Progress: ████░░░░░░░░░░░░ 8/20 credits (40%)           │    │
│  │                                           [View Details] │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  AVAILABLE CE COURSES                                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Advanced Thyroid Protocols                     6 CE Credits│  │
│  │ Dr. Jennifer Williams, MC-FMP™                             │  │
│  │ Deep dive into complex thyroid cases...                    │  │
│  │ Duration: 6 hours  •  Format: On-demand video             │  │
│  │ Price: Included with credential                            │  │
│  │                                      [Start Course]        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Gut-Brain Axis: Latest Research          4 CE Credits     │  │
│  │ Dr. Sarah Chen, BC-FMP™                                    │  │
│  │ New research on the microbiome and mental health...        │  │
│  │ Duration: 4 hours  •  Format: On-demand video             │  │
│  │ Price: Included with credential                            │  │
│  │                                      [Start Course]        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Building a 6-Figure Practice               2 CE Credits   │  │
│  │ Business Development                                       │  │
│  │ Practical strategies for growing your practice...          │  │
│  │ Duration: 2 hours  •  Format: Live webinar + recording    │  │
│  │ Next Live: Jan 25, 2026                                    │  │
│  │                              [Register]  [Notify Me]       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Browse All CE Courses]                                        │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  CE TRANSCRIPT                                                  │
├─────────────────────────────────────────────────────────────────┤
│  Jan 2026  │ Advanced Hormone Testing            │  4 credits  │
│  Dec 2025  │ Perimenopause Protocols             │  6 credits  │
│  Nov 2025  │ Practice Building Essentials        │  2 credits  │
│  Oct 2025  │ Functional Lab Interpretation       │  4 credits  │
│                                                                  │
│  [Download Full Transcript]  [Print Certificate]                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### CE Features
- **Automatic Tracking**: CE credits auto-logged when you complete courses
- **Expiration Alerts**: Reminders before credentials expire
- **Transcript**: Downloadable CE transcript for records
- **External CE**: Log CE from other approved providers
- **Renewal Reminders**: Notifications when it's time to renew

---

## Section 11: Referral Program

### Overview
Earn by referring new practitioners to ASI certification programs.

### Referral Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│  🎁 Referral Program                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  YOUR REFERRAL LINK                                             │
│  ─────────────────────                                          │
│  https://accredipro.com/join?ref=SARAH2024                      │
│  [Copy Link]  [Share via Email]  [Share on Social]              │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  EARNINGS                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐│
│  │      $850        │  │       12         │  │       3          ││
│  │  Total Earned    │  │   Referrals      │  │   This Month     ││
│  │                  │  │   (All Time)     │  │                  ││
│  └──────────────────┘  └──────────────────┘  └──────────────────┘│
│                                                                  │
│  COMMISSION STRUCTURE                                           │
│  ─────────────────────                                          │
│  • FC™ Certification: $50 per referral                          │
│  • CP™ Certification: $150 per referral                         │
│  • Career Accelerator: $500 per referral                        │
│  • BC™ Upgrade: $250 per referral                               │
│                                                                  │
│  Commissions paid monthly via Stripe or PayPal.                  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  REFERRAL HISTORY                                               │
├─────────────────────────────────────────────────────────────────┤
│  Jan 5   │ Jennifer M.  │ Career Accelerator │ $500 │ ✓ Paid   │
│  Dec 20  │ Amanda S.    │ FM-CP™             │ $150 │ ✓ Paid   │
│  Dec 15  │ Lisa R.      │ WH-FC™             │ $50  │ ✓ Paid   │
│  Dec 10  │ Maria T.     │ FM-CP™             │ $150 │ Pending  │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│  REFERRAL TOOLS                                                 │
├─────────────────────────────────────────────────────────────────┤
│  📧 Email Templates for Sharing                                  │
│  📱 Social Media Graphics                                        │
│  📝 Talking Points & Scripts                                     │
│  🎥 Video Testimonial Request Template                          │
│                                                                  │
│  [View Referral Toolkit]                                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Subscription Tiers

### Practice Hub Pricing

| Feature | Starter (Free) | Pro ($49/mo) | Elite ($99/mo) |
|---------|----------------|--------------|----------------|
| **Dashboard** | Basic | Full | Full + Insights |
| **Client CRM** | 5 clients | 50 clients | Unlimited |
| **Income Tracker** | Basic | Full | Full + Forecasting |
| **Protocol Builder** | 3 templates | All templates | Custom + AI |
| **Invoicing** | 5/month | Unlimited | Unlimited |
| **Templates** | 10 templates | Full library | Full + Exclusive |
| **Contracts** | 3 documents | Full library | Full library |
| **Job Board** | View only | Apply | Featured applications |
| **Mentor Connect** | Browse only | Book sessions | Priority booking |
| **Directory Tier** | Free listing | Professional | Featured |
| **CE Tracking** | Basic | Full | Full + Bonus CE |
| **Referral Program** | Standard rates | Standard rates | Higher rates (+25%) |
| **Support** | Community | Email | Priority + Calls |

### Who Should Choose Each Tier

**Starter (Free)**
- New graduates building their first clients
- Part-time practitioners
- Those exploring the platform

**Pro ($49/month)**
- Active practitioners with growing clientele
- Want full CRM and invoicing
- Need all templates and contracts
- Serious about job opportunities

**Elite ($99/month)**
- Established practitioners scaling their practice
- Want maximum visibility and leads
- Need advanced tools and AI features
- Value priority support and mentorship access

---

## Technical Requirements

### Database Schema (Key Models)

```prisma
model Practice {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  // Business Info
  businessName    String?
  businessType    String?  // Solo, LLC, PLLC, etc.
  taxId           String?  // Encrypted
  timezone        String   @default("America/New_York")

  // Subscription
  tier            PracticeTier @default(STARTER)
  tierExpiresAt   DateTime?
  stripeCustomerId String?
  stripeSubscriptionId String?

  // Settings
  currency        String   @default("USD")
  fiscalYearStart Int      @default(1) // Month

  // Relations
  clients         PracticeClient[]
  income          PracticeIncome[]
  invoices        PracticeInvoice[]
  protocols       PracticeProtocol[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum PracticeTier {
  STARTER
  PRO
  ELITE
}

model PracticeClient {
  id              String   @id @default(cuid())
  practiceId      String
  practice        Practice @relation(fields: [practiceId], references: [id])

  // Contact
  firstName       String
  lastName        String
  email           String
  phone           String?

  // Location
  city            String?
  state           String?
  country         String?

  // Status
  status          ClientStatus @default(LEAD)
  startDate       DateTime?
  endDate         DateTime?

  // Clinical
  presentingConcerns String? @db.Text
  goals              String? @db.Text
  notes              String? @db.Text
  tags               String[]

  // Relations
  sessions        ClientSession[]
  documents       ClientDocument[]
  protocols       ClientProtocol[]
  invoices        PracticeInvoice[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum ClientStatus {
  LEAD
  ACTIVE
  FOLLOWUP_DUE
  PAUSED
  COMPLETED
  CHURNED
}

model PracticeIncome {
  id              String   @id @default(cuid())
  practiceId      String
  practice        Practice @relation(fields: [practiceId], references: [id])

  type            IncomeType
  amount          Decimal  @db.Decimal(10, 2)
  description     String?
  category        String?

  clientId        String?
  invoiceId       String?

  date            DateTime
  createdAt       DateTime @default(now())
}

enum IncomeType {
  INCOME
  EXPENSE
}

model PracticeInvoice {
  id              String   @id @default(cuid())
  practiceId      String
  practice        Practice @relation(fields: [practiceId], references: [id])

  invoiceNumber   String
  clientId        String?
  client          PracticeClient? @relation(fields: [clientId], references: [id])

  status          InvoiceStatus @default(DRAFT)
  issueDate       DateTime
  dueDate         DateTime

  subtotal        Decimal  @db.Decimal(10, 2)
  discount        Decimal  @db.Decimal(10, 2) @default(0)
  total           Decimal  @db.Decimal(10, 2)

  items           Json     // Array of line items
  notes           String?
  paymentUrl      String?

  paidAt          DateTime?
  paidAmount      Decimal? @db.Decimal(10, 2)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum InvoiceStatus {
  DRAFT
  SENT
  VIEWED
  PAID
  PARTIAL
  OVERDUE
  CANCELLED
}

model PracticeProtocol {
  id              String   @id @default(cuid())
  practiceId      String
  practice        Practice @relation(fields: [practiceId], references: [id])

  name            String
  templateId      String?  // If based on a template
  content         Json     // Structured protocol data
  isTemplate      Boolean  @default(false)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## Implementation Phases

### Phase 1: Core Foundation (Weeks 1-6)
- [ ] Practice Dashboard
- [ ] Basic Client CRM (add, view, edit)
- [ ] Income tracking (manual entry)
- [ ] Directory profile connection
- [ ] Settings & preferences

### Phase 2: Business Tools (Weeks 7-12)
- [ ] Invoicing system
- [ ] Protocol builder
- [ ] Form builder & intake forms
- [ ] Templates library (email, social)
- [ ] Contracts library

### Phase 3: Growth Features (Weeks 13-18)
- [ ] Job board
- [ ] Mentor connect
- [ ] Referral program
- [ ] CE tracking
- [ ] Analytics & reporting

### Phase 4: Advanced (Weeks 19-24)
- [ ] Stripe payment integration
- [ ] Scheduling integrations
- [ ] AI-powered insights
- [ ] Mobile app
- [ ] API for third-party tools

---

## Success Metrics

### KPIs

| Metric | Target (Year 1) |
|--------|-----------------|
| Active Practice Hub Users | 500+ |
| Pro Subscribers | 150 (30%) |
| Elite Subscribers | 50 (10%) |
| Clients Managed in CRM | 5,000+ |
| Invoices Sent | 2,000+ |
| Practice Hub MRR | $12,000+ |
| User Retention (monthly) | 85%+ |
| Feature Adoption | 60%+ using 3+ features |

### Revenue Projections

```
Year 1:
- Starter (free): 300 users × $0 = $0
- Pro: 150 × $49/mo = $7,350/mo
- Elite: 50 × $99/mo = $4,950/mo
- Total MRR: $12,300
- Annual: ~$148,000

Year 2:
- Pro: 400 × $49/mo = $19,600/mo
- Elite: 150 × $99/mo = $14,850/mo
- Total MRR: $34,450
- Annual: ~$413,000
```

---

## Integration with ASI Ecosystem

Practice Hub is the operational center that connects all ASI products:

```
┌─────────────────────────────────────────────────────────────────┐
│                        ASI ECOSYSTEM                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      │
│  │             │      │             │      │             │      │
│  │ Certification│ ──▶ │ Practice   │ ──▶ │ Directory   │      │
│  │ Programs     │      │ Hub        │      │             │      │
│  │             │      │             │      │             │      │
│  └─────────────┘      └──────┬──────┘      └─────────────┘      │
│                              │                                   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      │
│  │             │      │             │      │             │      │
│  │ Career      │ ◀──▶ │ Coach      │ ◀──▶ │ Community   │      │
│  │ Accelerator │      │ Sarah AI    │      │             │      │
│  │             │      │             │      │             │      │
│  └─────────────┘      └─────────────┘      └─────────────┘      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Data Flow:**
- Certification completion → Auto-unlocks Practice Hub features
- Practice Hub profiles → Sync to Directory listings
- CRM data → Informs Coach Sarah's recommendations
- Job applications → Use Practice Hub profile data
- CE completion → Updates credential status

---

## Conclusion

The ASI Practice Hub transforms ASI from a certification program into a complete career solution. It answers the eternal question: "I'm certified... now what?"

With Practice Hub, every ASI credential holder has everything they need to:
1. **Build** a professional practice
2. **Manage** clients efficiently
3. **Earn** sustainable income
4. **Grow** their career continuously

This is the ultimate differentiator from competitors who stop at the certificate.
