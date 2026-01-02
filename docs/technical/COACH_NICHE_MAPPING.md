# 🎓 AccrediPro Coach-Niche Mapping

> **Version:** 1.0  
> **Updated:** 2026-01-02  
> **Source of Truth:** `src/config/coach-personas.ts`

---

## 📊 Coach → Niche Assignment

| Niche Code | Niche Name | Coach | Persona Key | Coach Role |
|------------|------------|-------|-------------|------------|
| **FM** | Functional Medicine | Sarah M. | `fm-health` | Lead Instructor |
| **WH** | Women's Hormones | Sarah M. | `fm-health` | Lead Instructor |
| **IM** | Integrative Medicine | Sarah M. | `fm-health` | Lead Instructor |
| **HN** | Holistic Nutrition | Sarah M. | `fm-health` | Lead Instructor |
| **NR** | NARC Recovery | Olivia | `mental-health` | Trauma Specialist |
| **ND** | Neurodiversity (ADHD) | Olivia | `mental-health` | Trauma Specialist |
| **GL** | Grief & Loss | Olivia | `mental-health` | Trauma Specialist |
| **SI** | Sex & Intimacy | Luna | `spiritual` | Energy Healer |
| **LC** | Life Coaching | Marcus | `life-coaching` | Performance Coach |
| **SE** | Spiritual & Energy | Luna | `spiritual` | Energy Healer |
| **HB** | Herbalism | Sage | `herbalism` | Master Herbalist |
| **TM** | Therapy Modalities (EFT) | Maya | `yoga-movement` | Somatic Specialist |
| **PW** | Pet Wellness | Bella | `pet` | Animal Wellness |
| **FB** | Fertility & Birth | Emma | `parenting` | Family Specialist |
| **PC** | Parenting & Child | Emma | `parenting` | Family Specialist |
| **CF** | Christian/Faith | Grace | `faith` | Faith-Based Mentor |

---

## 👩‍🏫 Coach Roster (10 Personas)

### Sarah M. 🏥
- **Email:** sarah@accredipro-certificate.com
- **Role:** Lead Instructor & FM Practitioner
- **Tone:** Warm, medical, scientific, encouraging
- **Covers:** FM, WH, IM, HN (4 niches)
- **Keywords:** functional medicine, root cause, labs, hormones, gut health

### Olivia 🧠
- **Email:** olivia@accredipro-certificate.com
- **Role:** Trauma-Informed Specialist
- **Tone:** Deeply empathetic, safe, calm, validating
- **Covers:** NR, ND, GL (3 niches)
- **Keywords:** trauma, nervous system, safety, healing

### Marcus 🎯
- **Email:** marcus@accredipro-certificate.com
- **Role:** Master Performance Coach
- **Tone:** Motivational, strategic, high-energy, direct
- **Covers:** LC (1 niche)
- **Keywords:** goals, success, mindset, action, growth

### Luna 🔮
- **Email:** luna@accredipro-certificate.com
- **Role:** Spiritual Guide & Energy Healer
- **Tone:** Mystical, intuitive, deep, soulful
- **Covers:** SE, SI (2 niches)
- **Keywords:** energy, alignment, soul, manifestation

### Sage 🌿
- **Email:** sage@accredipro-certificate.com
- **Role:** Master Herbalist
- **Tone:** Earthy, grounded, wise, naturalistic
- **Covers:** HB (1 niche)
- **Keywords:** plants, roots, nature, remedies

### Maya 🧘
- **Email:** maya@accredipro-certificate.com
- **Role:** Somatic & Movement Specialist
- **Tone:** Calm, flowing, zen, embodied
- **Covers:** TM (1 niche)
- **Keywords:** flow, breath, movement, body

### Bella 🐾
- **Email:** bella@accredipro-certificate.com
- **Role:** Animal Wellness Advocate
- **Tone:** Enthusiastic, loving, caring
- **Covers:** PW (1 niche)
- **Keywords:** animals, love, connection, bond

### Emma 👶
- **Email:** emma@accredipro-certificate.com
- **Role:** Family Wellness Specialist
- **Tone:** Nurturing, practical, understanding
- **Covers:** FB, PC (2 niches)
- **Keywords:** family, kids, connection, growth

### Grace 🙏
- **Email:** grace@accredipro-certificate.com
- **Role:** Faith-Based Wellness Mentor
- **Tone:** Spiritual, biblical, encouraging
- **Covers:** CF (1 niche)
- **Keywords:** faith, God, purpose, calling

### David 💼
- **Email:** david@accredipro-certificate.com
- **Role:** Business Success Mentor
- **Tone:** Professional, strategic, confident
- **Covers:** All (Practice Building upsells)
- **Keywords:** business, scale, clients, ROI

---

## 🔗 Persona Key Lookup

To get coach for a niche in code:

```typescript
const NICHE_TO_PERSONA: Record<string, string> = {
  'FM': 'fm-health',
  'WH': 'fm-health',
  'IM': 'fm-health',
  'HN': 'fm-health',
  'NR': 'mental-health',
  'ND': 'mental-health',
  'GL': 'mental-health',
  'SI': 'spiritual',
  'LC': 'life-coaching',
  'SE': 'spiritual',
  'HB': 'herbalism',
  'TM': 'yoga-movement',
  'PW': 'pet',
  'FB': 'parenting',
  'PC': 'parenting',
  'CF': 'faith',
};
```

---

## 📧 Coach Email Mapping

```typescript
const COACH_EMAILS: Record<string, string> = {
  'fm-health': 'sarah@accredipro-certificate.com',
  'mental-health': 'olivia@accredipro-certificate.com',
  'life-coaching': 'marcus@accredipro-certificate.com',
  'spiritual': 'luna@accredipro-certificate.com',
  'herbalism': 'sage@accredipro-certificate.com',
  'yoga-movement': 'maya@accredipro-certificate.com',
  'pet': 'bella@accredipro-certificate.com',
  'parenting': 'emma@accredipro-certificate.com',
  'faith': 'grace@accredipro-certificate.com',
  'business': 'david@accredipro-certificate.com',
};
```
