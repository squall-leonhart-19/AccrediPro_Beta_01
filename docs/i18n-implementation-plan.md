# AccrediPro Multi-Language (i18n) Implementation Plan

## Recommended Approach: Single Portal with Language Routes

```
accredipro.com/en/dashboard    → English
accredipro.com/es/dashboard    → Spanish  
accredipro.com/it/dashboard    → Italian
accredipro.com/de/dashboard    → German
accredipro.com/fr/dashboard    → French
```

---

## Why Single Portal > Multiple Portals

| Factor | Multiple Portals | Single Portal + i18n |
|--------|------------------|---------------------|
| Maintenance | 3x+ work for every update | 1 codebase |
| User Database | Separate DBs | 1 unified database |
| Feature Parity | Portals drift apart | Always synced |
| SEO | Separate domain authority | Same domain + hreflang |
| Cost | 3x hosting | Same infrastructure |
| Adding Languages | New portal deployment | Add translation files |

---

## Phase 1: Spanish First (Highest ROI)

### Priority Markets
1. **Spanish** 🇪🇸🇲🇽 - 500M+ speakers, growing wellness market
2. **Italian** 🇮🇹 - Strong wellness culture
3. **German** 🇩🇪 - High purchasing power
4. **French** 🇫🇷🇨🇦 - France + Quebec
5. **Portuguese** 🇧🇷 - Brazil (huge potential)

### What to Translate First
1. Course content (lessons, quizzes)
2. Sales pages and funnels
3. Email sequences
4. Portal UI (dashboard, menus, buttons)

---

## Technical Implementation

### Folder Structure
```
/locales/
  /en/
    common.json      # UI strings
    courses.json     # Course descriptions
    emails.json      # Email templates
  /es/
    common.json
    courses.json
    emails.json
  /it/
    ...
```

### Course Content Structure
```
/courses/
  /functional-medicine/
    /en/
      Module_01/
        Lesson_01.1.html
    /es/
      Module_01/
        Lesson_01.1.html
```

### Next.js i18n Config
```javascript
// next.config.js
module.exports = {
  i18n: {
    locales: ['en', 'es', 'it', 'de', 'fr', 'pt'],
    defaultLocale: 'en',
    localeDetection: true,
  },
}
```

### Libraries
- **next-i18next** - i18n for Next.js
- **react-i18next** - Translation hooks

---

## Translation Workflow

### Option A: AI + Human Review (Recommended)
1. AI translation (GPT-4, DeepL API) - ~90% quality
2. Native speaker review - 100% quality
3. Cost: ~$0.02/word AI + $0.05/word review

### Option B: Professional Only
- Higher quality, slower, more expensive
- Cost: ~$0.15-0.25/word

### Option C: AI Only (Fast Test)
- For quick market validation
- Use for initial Spanish test
- Cost: ~$0.02/word

---

## Regional Considerations

### Pricing
| Region | Currency | Suggested Pricing |
|--------|----------|-------------------|
| US/UK | USD/GBP | $997 |
| EU | EUR | €897 |
| LATAM | USD | $497 (lower) |
| Brazil | BRL | R$2,497 |

### Payment Methods
- **LATAM**: MercadoPago, local cards
- **EU**: SEPA, Klarna
- **Brazil**: Pix, Boleto

---

## Implementation Timeline

### Week 1-2: Spanish Course Content
- [ ] Translate FM Certification lessons
- [ ] Translate quizzes
- [ ] Create Spanish sales page

### Week 3: Spanish Funnels
- [ ] Spanish email sequences
- [ ] Spanish lead magnets
- [ ] Spanish ads copy

### Week 4: Test & Validate
- [ ] Run Spanish FB/IG ads ($50/day)
- [ ] Track conversions
- [ ] Gather feedback

### Week 5+: Scale or Pivot
- If working → Portal UI translation, add more languages
- If not → Iterate on messaging, test different markets

---

## Quick Start Command

To translate course content using AI:
```bash
python tools/course-generator/translate_course.py \
  --source courses/functional-medicine/en \
  --target courses/functional-medicine/es \
  --language Spanish
```

---

## Resources
- [next-i18next docs](https://github.com/i18next/next-i18next)
- [DeepL API](https://www.deepl.com/pro-api)
- [Google Cloud Translation](https://cloud.google.com/translate)
