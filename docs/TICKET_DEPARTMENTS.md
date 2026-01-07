# Ticket Department Routing System

> Professional ticket routing with dedicated departments and named responders

## Overview

The AccrediPro ticket system now includes intelligent department routing. Tickets are automatically routed to the appropriate department based on their category, and all responses show professional team names instead of generic "Support Team".

---

## Departments

| ID | Department Label | Full Team Name | Responder | Icon | Color |
|----|------------------|----------------|-----------|------|-------|
| `SUPPORT` | Support | Customer Success Team | Sarah M. | 🛟 LifeBuoy | Emerald |
| `BILLING` | Billing | Billing Department | Emma R. | 💳 CreditCard | Blue |
| `LEGAL` | Legal | Legal & Compliance | Jennifer K. | ⚠️ AlertCircle | Red |
| `ACADEMIC` | Academic | Academic Affairs | Dr. Michelle T. | 🎓 GraduationCap | Purple |
| `CREDENTIALING` | Credentialing | Credentialing Authority | David L. | ⭐ Star | Amber |

---

## Auto-Routing Rules

When a customer submits a ticket, the AI classifies it into a category. Each category is automatically routed to a department:

| Category | Routed To | Reason |
|----------|-----------|--------|
| **REFUND** | `LEGAL` | Refunds require compliance review |
| **BILLING** | `BILLING` | Payment and invoice issues |
| **TECHNICAL** | `SUPPORT` | General tech support |
| **ACCESS** | `SUPPORT` | Login and access issues |
| **CERTIFICATES** | `CREDENTIALING` | Credential and certification questions |
| **COURSE_CONTENT** | `ACADEMIC` | Course material inquiries |
| **GENERAL** | `SUPPORT` | All other inquiries |

---

## Ticket Flow Example

### 1. Customer Submits Refund Request

```
Subject: "I want a refund for my certification"
Message: "I purchased the Functional Medicine course but haven't had time..."
```

### 2. AI Classification

- **Category:** `REFUND`
- **Auto-routed to:** `LEGAL`

### 3. Ticket Created

```json
{
  "ticketNumber": 1234,
  "subject": "I want a refund for my certification",
  "category": "REFUND",
  "department": "LEGAL",
  "status": "NEW"
}
```

### 4. Admin Panel Display

The ticket header shows:

```
[Status: New ▾] [Priority: Medium ▾] [🚨 Legal ▾]
```

### 5. Response Display

When admin replies, the message shows:

```
┌─────────────────────────────────────────────────────────────┐
│ [J] Legal & Compliance          [Jennifer K.]   2:34 PM     │
│                                                             │
│ Thank you for reaching out. I'm reviewing your account      │
│ now and will process your refund request within 24 hours.   │
└─────────────────────────────────────────────────────────────┘
```

---

## Manual Department Change

Admins can manually change the department via the dropdown in the ticket header:

1. Click the department badge (e.g., "[Legal ▾]")
2. Select new department from list
3. Ticket is immediately re-routed

---

## Database Schema

```prisma
enum TicketDepartment {
  SUPPORT         // General support & technical issues
  BILLING         // Payments, invoices, account issues
  LEGAL           // Refunds, disputes, chargebacks, compliance
  ACADEMIC        // Course content, certificates, exams
  CREDENTIALING   // Credential verification, accreditation
}

model SupportTicket {
  // ... other fields
  department   TicketDepartment @default(SUPPORT)
  
  @@index([department])
}
```

---

## Files Modified

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Added `TicketDepartment` enum and `department` field |
| `src/hooks/use-tickets.ts` | Added `department` to Ticket type |
| `src/app/(admin)/admin/tickets/page.tsx` | Added `DEPARTMENT_CONFIG`, department dropdown, message styling |
| `src/app/api/tickets/submit/route.ts` | Added `CATEGORY_TO_DEPARTMENT` routing logic |
