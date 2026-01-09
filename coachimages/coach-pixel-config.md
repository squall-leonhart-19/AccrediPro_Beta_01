# 👥 Coach & Pixel Configuration

> Technical reference for LMS and marketing integration  
> 16 Pixels • 9 Coaches • 614 Courses

---

## 9 COACH PROFILES

| # | Coach | Email | Specialty | Pixels |
|---|-------|-------|-----------|--------|
| 1 | Sarah | sarah@accredipro.academy | Functional medicine, root cause healing | 3 |
| 2 | Olivia | olivia@accredipro.academy | Trauma-informed healing, nervous system | 3 |
| 3 | Maya | maya@accredipro.academy | Somatic healing, mindfulness, therapy | 2 |
| 4 | Luna | luna@accredipro.academy | Spiritual energy work, sacred intimacy | 2 |
| 5 | Emma | emma@accredipro.academy | Family wellness, birth work, parenting | 2 |
| 6 | Grace | grace@accredipro.academy | Faith-based coaching, Christian ministry | 1 |
| 7 | Bella | bella@accredipro.academy | Animal wellness, holistic pet care | 1 |
| 8 | Sage | sage@accredipro.academy | Plant medicine, herbal traditions | 1 |
| 9 | Rachel | rachel@accredipro.academy | LGBTQ+ affirming, inclusive wellness | 1 |

---

## 16 PIXEL TYPE DEFINITION

```typescript
type PixelId = 
  // Sarah (3)
  | "SarahFunctionalMedicine"
  | "SarahWomensHormones"
  | "SarahIntegrativeMedicine"
  // Olivia (3)
  | "OliviaNarcTrauma"
  | "OliviaNeurodiversity"
  | "OliviaGriefEndoflife"
  // Maya (2)
  | "MayaTherapyModalities"
  | "MayaMindfulness"
  // Luna (2)
  | "LunaSpiritualEnergy"
  | "LunaSexIntimacy"
  // Emma (2)
  | "EmmaFertilityBirth"
  | "EmmaParenting"
  // Single Coaches (4)
  | "GraceFaithBased"
  | "BellaPetWellness"
  | "SageHerbalism"
  | "RachelInclusiveWellness";

type CoachId = "sarah" | "olivia" | "maya" | "luna" | "emma" | "grace" | "bella" | "sage" | "rachel";

const PIXEL_COACH_MAP: Record<PixelId, CoachId> = {
  SarahFunctionalMedicine: "sarah",
  SarahWomensHormones: "sarah",
  SarahIntegrativeMedicine: "sarah",
  OliviaNarcTrauma: "olivia",
  OliviaNeurodiversity: "olivia",
  OliviaGriefEndoflife: "olivia",
  MayaTherapyModalities: "maya",
  MayaMindfulness: "maya",
  LunaSpiritualEnergy: "luna",
  LunaSexIntimacy: "luna",
  EmmaFertilityBirth: "emma",
  EmmaParenting: "emma",
  GraceFaithBased: "grace",
  BellaPetWellness: "bella",
  SageHerbalism: "sage",
  RachelInclusiveWellness: "rachel",
};
```

---

## FLAGSHIP COURSES BY PIXEL

| Pixel | Course Slug | Methodology | Courses |
|-------|-------------|-------------|---------|
| SarahFunctionalMedicine | functional-medicine-complete-certification | F.M. Core Method™ | 173 |
| SarahWomensHormones | women-s-hormone-health-coach | N.O.U.R.I.S.H. Method™ | 28 |
| SarahIntegrativeMedicine | integrative-medicine-practitioner | B.R.I.D.G.E. Method™ | 56 |
| OliviaNarcTrauma | narcissistic-abuse-recovery-coach | N.A.R.C. Recovery Method™ | 27 |
| OliviaNeurodiversity | certified-adhd-support-specialist | A.D.H.D. Method™ | 46 |
| OliviaGriefEndoflife | grief-and-loss-coach | G.R.A.C.E. Method™ | 23 |
| MayaTherapyModalities | eft-tapping-practitioner | T.A.P.P.I.N.G. Protocol™ | 34 |
| MayaMindfulness | meditation-mindfulness-coach | M.I.N.D. Method™ | 51 |
| LunaSpiritualEnergy | energy-healing-practitioner | B.A.L.A.N.C.E. Protocol™ | 29 |
| LunaSexIntimacy | sex-intimacy-coach | I.N.T.I.M.A.T.E. Method™ | 14 |
| EmmaFertilityBirth | birth-postpartum-doula | B.I.R.T.H. Support Method™ | 10 |
| EmmaParenting | conscious-parenting-coach | R.A.I.S.E. Framework™ | 22 |
| GraceFaithBased | christian-life-coach | F.A.I.T.H. Method™ | 52 |
| BellaPetWellness | pet-wellness-coach | P.A.W.S. Method™ | 24 |
| SageHerbalism | herbalism-practitioner | H.E.R.B.S. Method™ | 15 |
| RachelInclusiveWellness | lgbtq-affirming-life-coach | I.N.C.L.U.D.E. Method™ | 10 |

---

## META PIXEL IDS (Add after creation)

```
SarahFunctionalMedicine: PIXEL_ID_HERE
SarahWomensHormones: PIXEL_ID_HERE
SarahIntegrativeMedicine: PIXEL_ID_HERE
OliviaNarcTrauma: PIXEL_ID_HERE
OliviaNeurodiversity: PIXEL_ID_HERE
OliviaGriefEndoflife: PIXEL_ID_HERE
MayaTherapyModalities: PIXEL_ID_HERE
MayaMindfulness: PIXEL_ID_HERE
LunaSpiritualEnergy: PIXEL_ID_HERE
LunaSexIntimacy: PIXEL_ID_HERE
EmmaFertilityBirth: PIXEL_ID_HERE
EmmaParenting: PIXEL_ID_HERE
GraceFaithBased: PIXEL_ID_HERE
BellaPetWellness: PIXEL_ID_HERE
SageHerbalism: PIXEL_ID_HERE
RachelInclusiveWellness: PIXEL_ID_HERE
```
