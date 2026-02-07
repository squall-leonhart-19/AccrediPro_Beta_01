// Testimonials Bank - Tagged by persona, intent, and income level
// Used by PersonalizedSalesPage to display relevant social proof

export type Persona =
  | "healthcare-pro"
  | "health-coach"
  | "corporate"
  | "stay-at-home-mom"
  | "other-passionate";

export type Intent = "business" | "personal" | "both";

export type IncomeLevel = "starter" | "growth" | "premium" | "elite";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  highlightQuote: string;
  photo: string;
  personaTags: Persona[];
  intentTags: Intent[];
  incomeLevel: IncomeLevel;
  monthlyIncome?: string;
  timeToResults?: string;
  credential?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // 1. Jennifer Martinez, RN
  {
    id: "jennifer-martinez",
    name: "Jennifer Martinez, RN",
    role: "Former ER Nurse, Now FM Practitioner",
    quote:
      "After 18 years in the ER, I was burned out, broken, and honestly? Terrified of starting over. I thought my only options were keep grinding or leave healthcare entirely. AccrediPro showed me a third path. I got certified in 9 weeks while still working shifts, landed my first 3 clients through the marketing templates, and within 4 months I gave my notice. Last month I made $11,200 working from my home office in yoga pants. My ER colleagues think I'm crazy. My bank account disagrees.",
    highlightQuote:
      "Last month I made $11,200 working from my home office. My ER colleagues think I'm crazy. My bank account disagrees.",
    photo: "/assets/migrated/TESTIMONIAL_03.jpg",
    personaTags: ["healthcare-pro"],
    intentTags: ["business"],
    incomeLevel: "premium",
    monthlyIncome: "$11,200/mo",
    timeToResults: "4 months",
    credential: "RN",
  },

  // 2. Dr. Karen L.
  {
    id: "dr-karen-l",
    name: "Dr. Karen L.",
    role: "Integrative Medicine Physician",
    quote:
      "I was skeptical at first. I already had my MD and a functional medicine fellowship. But what AccrediPro gave me was the business framework I never learned in medical school. I added the FM Certification protocols to my existing practice and my revenue doubled in 5 months. More importantly, my patients are getting results that conventional treatment alone never achieved. The Board-Certified credential gives my recommendations the weight they deserve with insurance companies.",
    highlightQuote:
      "I added FM protocols to my existing practice and my revenue doubled in 5 months.",
    photo: "/assets/migrated/TESTIMONIAL_03.jpg",
    personaTags: ["healthcare-pro"],
    intentTags: ["business"],
    incomeLevel: "elite",
    monthlyIncome: "$15,000+/mo",
    timeToResults: "5 months",
    credential: "MD",
  },

  // 3. Lisa Chen, CNS
  {
    id: "lisa-chen",
    name: "Lisa Chen, CNS",
    role: "Board-Certified FM Practitioner",
    quote:
      "I was coaching clients on nutrition but felt like an imposter charging premium rates without a recognized credential. The AccrediPro certification changed everything. I went from generic health coach to Board-Certified FM practitioner in 12 weeks. My rates went from $75/session to $250/session overnight, and clients actually started coming to ME instead of me chasing them. My income tripled in 6 months. The credential pays for itself every single week.",
    highlightQuote:
      "I went from $75/session to $250/session. My income tripled in 6 months.",
    photo: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_05.jpeg",
    personaTags: ["health-coach"],
    intentTags: ["business"],
    incomeLevel: "premium",
    monthlyIncome: "$12,000/mo",
    timeToResults: "6 months",
    credential: "CNS",
  },

  // 4. Amanda Rodriguez
  {
    id: "amanda-rodriguez",
    name: "Amanda Rodriguez",
    role: "Certified FM Practitioner",
    quote:
      "I have zero medical background. I was a marketing coordinator who was passionate about health and wellness but thought I needed a nursing degree to actually help people professionally. AccrediPro proved me wrong. The curriculum was thorough but accessible. The mentorship was incredible. I got certified in 10 weeks and had my first paying client before I even finished the program. Six months later, I have 14 regular clients and a waitlist. Sometimes the thing holding you back is just permission to start.",
    highlightQuote:
      "Zero medical background. Certified in 10 weeks. 14 regular clients and a waitlist.",
    photo: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_04.jpg",
    personaTags: ["other-passionate"],
    intentTags: ["business"],
    incomeLevel: "growth",
    monthlyIncome: "$7,500/mo",
    timeToResults: "6 months",
  },

  // 5. Margaret S.
  {
    id: "margaret-s",
    name: "Margaret S.",
    role: "Mom of 3, Certified FM Practitioner",
    quote:
      "I studied during nap times and after bedtime. Literally 20 minutes a day. My husband thought I was watching Netflix. Ten weeks later I had my certification. The done-for-you templates meant I didn't have to figure out websites or marketing from scratch. I now see 8 clients a week during school hours and make more than I did at my old corporate job. My kids don't even know Mommy has a business because it fits so seamlessly around their schedule.",
    highlightQuote:
      "20 minutes a day during nap times. Certified in 10 weeks. More income than my old corporate job.",
    photo: "/assets/migrated/TESTIMONIAL_01.jpg",
    personaTags: ["stay-at-home-mom"],
    intentTags: ["business"],
    incomeLevel: "growth",
    monthlyIncome: "$5,800/mo",
    timeToResults: "10 weeks to certified, 4 months to full income",
  },

  // 6. Rachel Kim, RD
  {
    id: "rachel-kim",
    name: "Rachel Kim, RD",
    role: "Registered Dietitian & FM Practitioner",
    quote:
      "As a dietitian, I kept seeing the same patterns: patients with autoimmune issues, gut problems, hormonal imbalances that nutrition alone couldn't fix. Adding FM to my practice gave me the tools to treat the whole person. My patient outcomes have improved dramatically, and honestly, so has my own health. I reversed my own thyroid issues using the protocols I learned. Now I'm healthier, my patients are healthier, and my practice has a 6-month waitlist.",
    highlightQuote:
      "Reversed my own thyroid issues. Patient outcomes improved dramatically. 6-month waitlist.",
    photo: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_05.jpeg",
    personaTags: ["healthcare-pro"],
    intentTags: ["both"],
    incomeLevel: "premium",
    monthlyIncome: "$13,000/mo",
    timeToResults: "8 weeks to certified",
    credential: "RD",
  },

  // 7. Carolyn R.
  {
    id: "carolyn-r",
    name: "Carolyn R.",
    role: "Former VP of Operations, Now FM Practitioner",
    quote:
      "I left a 25-year corporate career at 52. Everyone thought I was having a midlife crisis. Turns out it was a midlife awakening. The AccrediPro certification gave me a new identity beyond 'corporate executive.' Within 3 months of getting certified, I was fully booked. My project management skills from corporate translate perfectly to creating client protocols. Last month I made $7,200 working 25 hours a week. I should have done this a decade ago.",
    highlightQuote:
      "Career change at 52. Fully booked in 3 months. $7,200/mo working 25 hours a week.",
    photo: "/assets/migrated/TESTIMONIAL_02.jpg",
    personaTags: ["corporate"],
    intentTags: ["business"],
    incomeLevel: "growth",
    monthlyIncome: "$7,200/mo",
    timeToResults: "3 months to fully booked",
  },

  // 8. Sarah W.
  {
    id: "sarah-w",
    name: "Sarah W.",
    role: "Nurse Practitioner & Personal Healing Advocate",
    quote:
      "I didn't enroll to start a business. I enrolled because I had Hashimoto's and conventional medicine kept telling me my labs were 'normal' while I could barely get out of bed. The FM certification taught me to read my own labs through a functional lens, optimize my nutrition, and address root causes my doctors missed. Within 4 months, my antibodies dropped by 60%, my energy came back, and I feel like myself again for the first time in years. This program literally gave me my life back.",
    highlightQuote:
      "Hashimoto's antibodies dropped 60%. Energy came back. This program gave me my life back.",
    photo: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_04.jpg",
    personaTags: ["healthcare-pro"],
    intentTags: ["personal"],
    incomeLevel: "starter",
    timeToResults: "4 months to health transformation",
    credential: "NP",
  },

  // 9. David Williams
  {
    id: "david-williams",
    name: "David Williams",
    role: "Former Project Manager, FM Practitioner",
    quote:
      "15 years in corporate project management and I was miserable. Great salary, zero fulfillment. A friend told me about functional medicine and I thought, 'That's not for someone like me.' But AccrediPro was designed for career changers. The curriculum assumed no medical background. The mentorship filled every knowledge gap. I got certified in 11 weeks, built my practice around corporate burnout recovery (ironic, right?), and now I make more than my PM salary while actually helping people transform their lives.",
    highlightQuote:
      "Zero medical background. Certified in 11 weeks. Now making more than my corporate PM salary.",
    photo: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_06.jpeg",
    personaTags: ["corporate"],
    intentTags: ["business"],
    incomeLevel: "premium",
    monthlyIncome: "$10,500/mo",
    timeToResults: "11 weeks to certified, 5 months to full income",
  },

  // 10. Michael Thompson, LAc
  {
    id: "michael-thompson",
    name: "Michael Thompson, LAc",
    role: "Licensed Acupuncturist & FM Practitioner",
    quote:
      "I was already running a successful acupuncture practice, but I knew I was leaving results on the table by not addressing nutrition and biochemistry. Adding the FM certification to my skill set was the best business decision I've ever made. I now offer comprehensive wellness packages instead of single-modality sessions. My average client value went from $85/visit to $400/month on retainer. Plus, my clinical outcomes have improved so dramatically that referrals are now my primary growth channel.",
    highlightQuote:
      "Average client value went from $85/visit to $400/month retainer. Referrals are now my #1 growth channel.",
    photo: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_04.jpg",
    personaTags: ["health-coach"],
    intentTags: ["business"],
    incomeLevel: "elite",
    monthlyIncome: "$16,000/mo",
    timeToResults: "8 weeks to certified",
    credential: "LAc",
  },
];

/**
 * Get testimonials filtered by persona and intent, with optional limit.
 *
 * Scoring logic:
 * - Exact persona match: +3 points
 * - Exact intent match: +2 points
 * - Intent "both" matches any intent query: +1 point
 * - Results sorted by score descending, then by income level
 */
export function getTestimonialsForPersona(
  persona: Persona,
  intent: Intent,
  limit: number = 3
): Testimonial[] {
  const incomeLevelOrder: Record<IncomeLevel, number> = {
    elite: 4,
    premium: 3,
    growth: 2,
    starter: 1,
  };

  const scored = TESTIMONIALS.map((testimonial) => {
    let score = 0;

    // Persona match
    if (testimonial.personaTags.includes(persona)) {
      score += 3;
    }

    // Exact intent match
    if (testimonial.intentTags.includes(intent)) {
      score += 2;
    }

    // "both" intent is a partial match for business or personal queries
    if (
      intent !== "both" &&
      testimonial.intentTags.includes("both") &&
      !testimonial.intentTags.includes(intent)
    ) {
      score += 1;
    }

    return { testimonial, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (
        incomeLevelOrder[b.testimonial.incomeLevel] -
        incomeLevelOrder[a.testimonial.incomeLevel]
      );
    })
    .slice(0, limit)
    .map((item) => item.testimonial);
}

/**
 * Get a single featured testimonial for the hero section.
 * Prioritizes highest income with exact persona + intent match.
 */
export function getFeaturedTestimonial(
  persona: Persona,
  intent: Intent
): Testimonial {
  const matches = getTestimonialsForPersona(persona, intent, 1);
  // Fallback to Jennifer Martinez if no match (highest income general testimonial)
  return matches[0] || TESTIMONIALS[0];
}

/**
 * Get all testimonials (unfiltered), useful for admin or fallback views.
 */
export function getAllTestimonials(): Testimonial[] {
  return TESTIMONIALS;
}
