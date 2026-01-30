# Form A/B Testing System

The A/B testing system allows you to compare different qualification form variants to optimize conversion rates.

## How It Works

1. **URL Parameter Detection**: Add `?v=A` or `?v=B` to the mini diploma URL
2. **Variant Tracking**: Each lead's form variant is saved to their user record
3. **Analytics Dashboard**: View comparison at `/admin/funnel-analytics`

## Usage

### Sending Traffic to Variants

```
# Current form (default)
https://learn.accredipro.academy/functional-medicine-mini-diploma?v=A

# Test variant  
https://learn.accredipro.academy/functional-medicine-mini-diploma?v=B
```

In Meta Ads, create separate ad sets pointing to each variant URL.

### Metrics Tracked Per Variant

| Metric | Description |
|--------|-------------|
| **Form Completion** | % who complete the qualification form |
| **Diploma Start** | % who start at least 1 lesson |
| **Diploma Completion** | % who finish all 9 lessons |

### Viewing Results

1. Go to `/admin/funnel-analytics`
2. Scroll to "Form Variant A/B Testing" section
3. Compare metrics side-by-side

## Database Field

The variant is stored in the `User` model:

```prisma
formVariant  String?  // A/B testing: "A", "B", etc.
```

## Creating New Form Variants

To test different form flows:

1. Create variant-specific question sets in `typeform-qualification-form.tsx`
2. Use URL param to switch between them:

```tsx
const variant = searchParams.get("v") || "A";
const QUESTIONS = variant === "B" ? QUESTIONS_B : QUESTIONS_A;
```

## Best Practices

- Run tests for at least 7 days
- Need 100+ leads per variant for statistical significance  
- Test one variable at a time (length, copy, steps)
- Document winning variants in this file
