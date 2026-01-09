# Resource Templates Generation - Handoff Doc

## 🎯 Objective
Build 6 remaining React templates for the Course Materials page.

---

## 📍 Location
```
/Users/pochitino/Desktop/accredipro-lms/src/components/resources/templates/
```

---

## ✅ Already Built (Use as Reference)
- `ClientIntakeForm.tsx` - Personal info, health history, lifestyle, goals
- `ProtocolBuilder.tsx` - 7-step wizard with categories
- `PricingCalculator.tsx` - Income goals, service pricing

---

## 🔨 Build These 6 Templates

### 1. `GutHealthTracker.tsx`
**Module:** Gut Health  
**Features:**
- Symptoms checklist (bloating, gas, constipation, diarrhea, etc.)
- Severity rating 1-10 for each symptom
- Daily tracking with date picker
- Auto-save to localStorage
- Summary score with recommendations
- PDF export

### 2. `NutritionAssessment.tsx`
**Module:** Functional Nutrition  
**Features:**
- Food frequency questionnaire
- Macro tracking (protein, carbs, fats)
- Dietary restriction checklist
- Hydration tracking
- Auto-save + PDF export

### 3. `StressAssessmentQuiz.tsx`
**Module:** Stress & Adrenal  
**Features:**
- 15-20 stress/burnout questions
- Score calculation (low/moderate/high)
- Personalized recommendations based on score
- HPA axis dysfunction indicators
- Auto-save + PDF export

### 4. `HormoneSymptomChecker.tsx`
**Module:** Female Hormones  
**Features:**
- Symptom checklist by hormone type
- Estrogen dominance indicators
- Progesterone deficiency indicators
- Thyroid symptom overlap
- Visual mapping of symptoms to hormones
- Auto-save + PDF export

### 5. `BloodSugarTracker.tsx`
**Module:** Blood Sugar & Metabolic  
**Features:**
- Daily glucose logging (fasting, post-meal)
- Food/meal notes
- 7-day trend visualization (simple chart)
- Target ranges with color coding
- Auto-save + PDF export

### 6. `LabResultsCalculator.tsx`
**Module:** Functional Lab Testing  
**Features:**
- Common lab markers input (TSH, Vitamin D, Ferritin, etc.)
- Conventional vs. Functional optimal ranges
- Color-coded results (optimal/suboptimal/concern)
- Interpretation notes
- Auto-save + PDF export

---

## 🎨 Design Requirements

1. **Match existing style** - Use burgundy-600 branding, same card styles
2. **Icons** - Import from `lucide-react`
3. **Components** - Use `@/components/ui` (Button, Input, Label, Textarea)
4. **Auto-save** - Save to localStorage with debounce
5. **PDF Export** - Use `window.open()` print method (see existing templates)
6. **Progress indicator** - Show completion percentage where applicable

---

## 📝 After Building

### 1. Update `index.ts`
```typescript
export { GutHealthTracker } from "./GutHealthTracker";
export { NutritionAssessment } from "./NutritionAssessment";
// ... etc
```

### 2. Add to `course-materials/page.tsx`
Add to `INTERACTIVE_TOOLS` array and move from `COMING_SOON_TOOLS`.

### 3. Add to `resources/page.tsx`
Add conditional rendering for each new tool.

---

## 🚀 Start Command
```
Just paste this file path and say "follow this"
```
