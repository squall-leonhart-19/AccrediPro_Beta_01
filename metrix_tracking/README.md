# Meta Conversions API Integration

Complete server-side tracking solution for your LMS portal.

## 📁 Project Structure

```
metrix_tracking/
├── supabase/
│   ├── migrations/
│   │   └── 001_meta_tracking_columns.sql  # Database schema
│   └── functions/
│       └── meta-conversions/
│           └── index.ts                    # Edge Function
└── frontend/
    ├── meta-tracking.ts     # TypeScript tracking utility
    ├── meta-tracking.js     # Vanilla JS (for any page)
    └── meta-events.ts       # Event helper functions
```

---

## 🚀 Setup Instructions

### Step 1: Configure Meta Credentials

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel → Settings
3. Copy your **Pixel ID**
4. Under "Conversions API", generate an **Access Token**

### Step 2: Set Supabase Secrets

```bash
# Via Supabase CLI
supabase secrets set META_PIXEL_ID=your_pixel_id
supabase secrets set META_ACCESS_TOKEN=your_access_token

# Optional: For testing
supabase secrets set META_TEST_EVENT_CODE=TEST12345
```

Or set via Supabase Dashboard:
- Project → Edge Functions → meta-conversions → Secrets

### Step 3: Run Database Migration

Go to Supabase Dashboard → SQL Editor → Run:
```sql
-- Copy contents from supabase/migrations/001_meta_tracking_columns.sql
```

### Step 4: Deploy Edge Function

```bash
cd /path/to/your/supabase/project
supabase functions deploy meta-conversions
```

### Step 5: Add Frontend Tracking

Add to your landing pages (before </body>):
```html
<script src="/path/to/meta-tracking.js"></script>
```

---

## 📊 Events to Track

| Event | When to Fire | Value |
|-------|--------------|-------|
| `Lead` | Form submitted | - |
| `StartMiniDiploma` | User starts freebie | - |
| `CompleteMiniDiploma` | User completes freebie | - |
| `InitiateCheckout` | Checkout page viewed | $997 |
| `Purchase` | Payment successful | $997 |

---

## 💻 Usage Examples

### In your app code (TypeScript/JavaScript):

```typescript
import { 
  trackLead, 
  trackStartMiniDiploma, 
  trackCompleteMiniDiploma,
  trackInitiateCheckout,
  trackPurchase 
} from './meta-events';

// Get tracking data (captured on page load)
const trackingData = window.MetaTracking.getTrackingData();

// 1. Lead form submitted
await trackLead('user@email.com', {}, trackingData);

// 2. Started mini diploma
await trackStartMiniDiploma('user@email.com', {}, trackingData);

// 3. Completed mini diploma
await trackCompleteMiniDiploma('user@email.com', {}, trackingData);

// 4. Viewing checkout page
await trackInitiateCheckout('user@email.com', 997, {}, trackingData);

// 5. Purchase completed
await trackPurchase('user@email.com', 997, {}, trackingData);
```

### Auto-inject tracking into forms:

```html
<form id="lead-form" action="/submit">
  <input type="email" name="email" required>
  <button type="submit">Get Free Training</button>
</form>

<script>
  // Automatically adds hidden fields for fbclid, fbc, fbp
  MetaTracking.injectIntoForm('#lead-form');
</script>
```

---

## 🧪 Testing

1. Go to Meta Events Manager → Test Events
2. Copy the **Test Event Code**
3. Set it as a secret: `META_TEST_EVENT_CODE=TEST12345`
4. Trigger events from your app
5. Watch them appear in real-time in Test Events

---

## ✅ Verification Checklist

- [ ] Meta Pixel ID configured
- [ ] Access Token generated and set
- [ ] Database migration applied
- [ ] Edge Function deployed
- [ ] Frontend tracking script added
- [ ] Test events showing in Events Manager
- [ ] Match quality score > 5/10
