import { NicheLandingConfig } from "./landing-page-types";

const PIXEL_FM = "1340178367364771";
const A1 = "/zombie-avatars/user_47_backyard_bbq_1767801467.webp";
const A2 = "/zombie-avatars/user_52_bedroom_morning_1767801467.webp";
const A3 = "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp";
const A4 = "/zombie-avatars/user_55_cooking_class_1767801442.webp";
const A5 = "/zombie-avatars/user_41_coffee_shop_working_1768611487.webp";
const A6 = "/zombie-avatars/user_38_home_office_1768611487.webp";

// ─── LIFE COACHING ────────────────────────────────────────────
export const lifeCoachingConfig: NicheLandingConfig = {
    nicheId: "life-coaching",
    nicheSlug: "life-coaching-mini-diploma",
    displayName: "Life Coaching",
    courseSlug: "life-coaching",
    portalSlug: "life-coaching",
    brand: { primary: "#7c3aed", primaryDark: "#3b0764", primaryLight: "#a78bfa" },
    hero: { badge: "1-Hour Mini Diploma for Life Coaches", headline: "Life Coaching", subheadline: "Get certified in 1 hour. Help people break through limiting beliefs and design the life they want. Start earning $4K-$8K/month.", socialProofCount: "4,247", socialProofLabel: "coaches certified", enrolledToday: 45 },
    sarah: { quoteHeadline: "\"She Had Everything on Paper.|But She Was Completely Stuck.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years coaching leaders, women, and career changers through life's biggest transitions.", "The woman I'll never forget: a <strong>46-year-old VP</strong> making $180K/year with the house, the car, the family photo on the desk. She sat across from me and said, \"I have everything I was supposed to want, and I've never felt emptier.\" She didn't need therapy. She needed someone to help her <strong>redesign her life around what actually mattered.</strong>", "Now I train coaches who help people stop settling. <strong>2,400+ graduates</strong> are already guiding their clients from stuck to unstoppable."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Transformed Their Own Lives.|Now They Transform Others'.", sectionSubheadline: "", stories: [
            { name: "Rebecca M.", age: "43", income: "$5,800/mo", before: "Corporate HR Director", story: "I spent 15 years helping companies manage people. Now I help the people manage themselves. Way more rewarding — and way more profitable.", avatar: A1 },
            { name: "Michelle K.", age: "47", income: "$6,900/mo", before: "Divorce Recovery Group Leader", story: "I led free support groups for divorced women. When I got certified, those same women became paying clients. They wanted to keep growing.", avatar: A2 },
            { name: "Ashley L.", age: "36", income: "$4,500/mo", before: "Social Worker, 12 years", story: "Social work burned me out. Life coaching lets me help people who actually want to change. The energy is completely different.", avatar: A3 },
            { name: "Carol P.", age: "52", income: "$7,600/mo", before: "Empty Nester", story: "Kids left. Husband traveled. I was lost. Life coaching saved me — and now I help other women find their second act.", avatar: A4 },
            { name: "Dana T.", age: "39", income: "$4,100/mo", before: "Elementary School Teacher", story: "I loved helping kids grow but felt called to help adults. Now I coach women through career changes and it's the best work I've ever done.", avatar: A5 },
            { name: "Fiona S.", age: "50", income: "$5,400/mo", before: "Ministry Worker", story: "I counseled women in my church for free for 20 years. Getting certified gave me the structure — and the confidence — to charge for my gifts.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Life Coach", description: "Help people break through limiting beliefs, navigate transitions, and design lives they love. Work from home on your own terms.", benefits: ["Work with clients 1-on-1 (virtual or in-person)", "Help people design their ideal life", "Be your own boss with ultimate flexibility", "Turn your life experience into income"], incomeRange: "$4K-$8K/mo", perSession: "$150", clientsPerMonth: "10-15" },
    advantages: {
        sectionHeadline: "Your Life Experiences Are|Your Unfair Advantage", sectionDescription: "Every challenge, transition, and breakthrough you've navigated gives you the empathy and wisdom clients pay for.", cards: [
            { iconName: "Heart", title: "Emotional Intelligence", desc: "You naturally read people and create safe spaces. That's the #1 skill every life coaching client needs from you." },
            { iconName: "Sparkles", title: "Personal Transformation", desc: "You've reinvented yourself before. That lived experience is more valuable than any degree." },
            { iconName: "Users", title: "The 'Advice Friend'", desc: "People already come to you for guidance. Now turn that natural ability into a professional practice — and get paid." }
        ]
    },
    thisIsForYou: { loveIt: ["People already come to you for life advice", "You've been through major transitions and found your way through", "You want meaningful work that makes a real difference", "You dream of flexible, location-independent work", "You believe everyone has potential they haven't unlocked yet"], notRightNow: ["You're not willing to invest 60 minutes", "You're looking for a therapy license", "You don't enjoy working with people one-on-one", "You're not interested in personal development"] },
    lessons: [
        { num: 1, title: "What Makes a Great Life Coach", desc: "The psychology of transformation, why people get stuck, and the foundational skills every effective coach needs" },
        { num: 2, title: "The S.H.I.F.T. Method™", desc: "Your signature framework: See, Heal, Identify, Focus & Transform — the breakthrough coaching protocol" },
        { num: 3, title: "Getting Your First Clients", desc: "Warm market strategy, pricing your packages, and a 30-day plan to hit $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Life Coaching Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "S.H.I.F.T. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Private Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Aspiring Life Coaches Only" },
    faq: {
        sectionTitle: "Questions About Life Coaching", items: [
            { q: "Do I need a psychology degree?", a: "No! Life coaching is about helping people move forward — setting goals, breaking patterns, and creating accountability. It's fundamentally different from therapy." },
            { q: "How is coaching different from therapy?", a: "Therapy addresses past wounds and mental health conditions. Coaching is future-focused — helping people set goals, overcome blocks, and build the life they want." },
            { q: "Can I really earn $4-8K/month?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. Life coaching is a $2.85B industry growing 15% per year." },
            { q: "What's the catch? Why is it free?", a: "Free certification so you can experience the training. Continue with full Board Certification if you love it." },
            { q: "Can I start while keeping my current job?", a: "Absolutely! Most graduates start part-time with 3-5 clients and scale up when ready." }
        ]
    },
    certificateTitle: "Life Coaching Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "A Certified Life Coach.", subheadline: `${45} coaches enrolled today. 89% finished the same day. <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Life Coaching Mini Diploma", contentId: "lc-mini-diploma", pixelId: PIXEL_FM },
};

// ─── NURSE COACH ──────────────────────────────────────────────
export const nurseCoachConfig: NicheLandingConfig = {
    nicheId: "nurse-coach",
    nicheSlug: "nurse-coach-mini-diploma",
    displayName: "Nurse Coach",
    courseSlug: "nurse-coach",
    portalSlug: "nurse-coach",
    brand: { primary: "#0891b2", primaryDark: "#164e63", primaryLight: "#22d3ee" },
    hero: { badge: "1-Hour Mini Diploma for Nurses Ready for More", headline: "Nurse Coach", subheadline: "Get certified in 1 hour. Use your nursing background to coach patients holistically. Start earning $4K-$8K/month from home.", socialProofCount: "4,247", socialProofLabel: "nurses certified", enrolledToday: 37 },
    sarah: { quoteHeadline: "\"She Was a Great Nurse.|But She Was Dying Inside.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years helping healthcare professionals transition to meaningful coaching careers.", "The nurse who changed everything: <strong>Sharon, 49, RN for 24 years</strong>. Three 12-hour shifts, mandatory overtime, and a two-hour commute. She loved patients but was running on empty. She'd already tried bedside nursing, charge nursing, and case management — all the same burnout, different title. She needed a <strong>completely different model of helping people.</strong>", "Now I train nurses to use their clinical skills in a whole new way. <strong>2,400+ nurses</strong> have made the transition. No more night shifts. No more being treated like a number. Just meaningful work on your own terms."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Left the Hospital.|They Didn't Leave Healthcare.", sectionSubheadline: "", stories: [
            { name: "Sharon R.", age: "49", income: "$6,200/mo", before: "ICU Nurse, 24 years", story: "24 years of night shifts nearly killed me. Nurse coaching saved my career — and my health. I help nurses and patients now, on MY schedule.", avatar: A1 },
            { name: "Linda K.", age: "52", income: "$7,400/mo", before: "ER Nurse, 18 years", story: "The ER was adrenaline and burnout. Now I coach healthcare workers through career transitions. I'm using everything I learned in nursing.", avatar: A2 },
            { name: "Nancy L.", age: "44", income: "$5,100/mo", before: "School Nurse", story: "School nursing was safe but unstimulating. Nurse coaching lets me use my medical knowledge to actually transform lives.", avatar: A3 },
            { name: "Janet P.", age: "56", income: "$8,200/mo", before: "Nurse Practitioner", story: "I was an NP making $120K but working 60 hours. Now I make similar money in half the hours doing work that fills me up.", avatar: A4 },
            { name: "Debra T.", age: "41", income: "$4,300/mo", before: "Pediatric Nurse", story: "I loved my little patients but the system was broken. Now I coach parents on child wellness and family health. Same passion, zero bureaucracy.", avatar: A5 },
            { name: "Carol S.", age: "48", income: "$5,800/mo", before: "Home Health Nurse", story: "Home health was lonely and exhausting. Nurse coaching lets me use my clinical skills from my own home, with clients who value me.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Board-Certified Nurse Coach", description: "Use your nursing background to coach clients holistically. No more 12-hour shifts. No more being a number. Just meaningful work.", benefits: ["Work from home — no commute, no scrubs", "Use your clinical knowledge in coaching", "Be your own boss with flexible hours", "Help patients the way the system never let you"], incomeRange: "$4K-$8K/mo", perSession: "$150", clientsPerMonth: "10-15" },
    advantages: {
        sectionHeadline: "Your Nursing License Is|Your Unfair Advantage", sectionDescription: "Nurses make the BEST coaches. You have clinical knowledge, patient rapport skills, and the work ethic to build a thriving practice.", cards: [
            { iconName: "Shield", title: "Clinical Credibility", desc: "Your RN/BSN/NP credentials give you instant credibility that non-medical coaches can't match. Clients trust you immediately." },
            { iconName: "Heart", title: "Patient Rapport", desc: "You've comforted scared patients at 3am. Building coaching relationships is second nature to you." },
            { iconName: "Brain", title: "Medical Knowledge", desc: "You understand anatomy, pharmacology, and pathophysiology. You bring clinical depth to every coaching conversation." }
        ]
    },
    thisIsForYou: { loveIt: ["You're a nurse who loves patients but hates the system", "You're burned out from 12-hour shifts and mandatory overtime", "You want to use your nursing skills in a new way", "You dream of working from home on your own schedule", "You believe patients need coaching, not just treatment"], notRightNow: ["You're not a nurse or healthcare professional", "You're not willing to invest 60 minutes", "You love bedside nursing and don't want to change", "You're not interested in entrepreneurship"] },
    lessons: [
        { num: 1, title: "The Nurse Coach Revolution", desc: "Why nurses make the best coaches, the nurse coaching scope of practice, and how to leverage your clinical background" },
        { num: 2, title: "The C.A.R.E. Method™", desc: "Your signature framework: Connect, Assess, Redirect & Empower — nurse-centered holistic coaching" },
        { num: 3, title: "Building Your Nurse Coaching Practice", desc: "Warm market strategy, pricing, and a 30-day launch plan to start earning $4K-$8K/month from home" }
    ],
    valueStack: { items: [{ item: "3-Lesson Nurse Coach Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "C.A.R.E. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Private Nurse Coach Community", value: "$47" }], totalValue: "$435", forLabel: "For Nurses Ready for Their Next Chapter" },
    faq: {
        sectionTitle: "Questions About Nurse Coaching", items: [
            { q: "Do I need to leave my nursing job?", a: "No! Many graduates start coaching part-time while keeping their nursing position. You decide when (or if) to transition fully." },
            { q: "Is nurse coaching within my scope of practice?", a: "Yes. Nurse coaching is recognized by the ANA and AHNCC. You're leveraging your nursing knowledge in a coaching (not clinical) capacity." },
            { q: "Will my nursing license help?", a: "Absolutely. Your RN credential gives you instant credibility. Clients specifically seek out nurse coaches because they trust your clinical knowledge." },
            { q: "Can I really make $4-8K/month?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. Many nurse coaches earn more than their hospital salary within a year." },
            { q: "What's the catch? Why is it free?", a: "Free certification so you can experience nurse coaching. If you love it, continue with full Board Certification." }
        ]
    },
    certificateTitle: "Nurse Coach Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "A Certified Nurse Coach.", subheadline: `${37} nurses enrolled today. 89% finished the same day. Your RN + this certification = <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Nurse Coach Mini Diploma", contentId: "nc-mini-diploma", pixelId: PIXEL_FM },
};

// ─── PET NUTRITION ────────────────────────────────────────────
export const petNutritionConfig: NicheLandingConfig = {
    nicheId: "pet-nutrition",
    nicheSlug: "pet-nutrition-mini-diploma",
    displayName: "Pet Nutrition & Wellness",
    courseSlug: "pet-nutrition",
    portalSlug: "pet-nutrition",
    brand: { primary: "#ea580c", primaryDark: "#7c2d12", primaryLight: "#fb923c" },
    hero: { badge: "1-Hour Mini Diploma for Pet Wellness Coaches", headline: "Pet Nutrition & Wellness", subheadline: "Get certified in 1 hour. Help pet parents feed and care for their animals the right way. Start earning $4K-$8K/month.", socialProofCount: "4,247", socialProofLabel: "coaches certified", enrolledToday: 28 },
    sarah: { quoteHeadline: "\"Her Dog Was 'Fine' on Paper.|But He Was Suffering.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years in integrative wellness with a special focus on animal nutrition and holistic pet care.", "The case that started everything: a <strong>golden retriever named Max</strong>. His owner, Lisa, had tried 6 different commercial foods. Max had chronic ear infections, dull coat, and constant itching. The vet said \"it's just allergies.\" It wasn't. It was the ingredients in his food. When we switched to a <strong>whole-food, species-appropriate diet</strong>, every symptom resolved in 8 weeks.", "Now I train pet wellness coaches who understand what most vets don't teach: nutrition is the foundation of animal health. <strong>2,400+ graduates</strong> are already helping pet parents make better choices."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Healed Their Own Pets.|Now They Help Others.", sectionSubheadline: "", stories: [
            { name: "Lisa M.", age: "44", income: "$5,100/mo", before: "Veterinary Technician", story: "I worked in a vet clinic where diet was an afterthought. When I started coaching pet parents on nutrition, the transformations were incredible.", avatar: A1 },
            { name: "Theresa K.", age: "48", income: "$6,200/mo", before: "Dog Groomer, 15 years", story: "I could see health problems in every dog's coat. Now I help owners fix those problems from the inside out through nutrition.", avatar: A2 },
            { name: "Renee L.", age: "38", income: "$4,400/mo", before: "Pet Store Manager", story: "I sold pet food for years but felt guilty about the ingredients. Now I teach people how to truly nourish their animals.", avatar: A3 },
            { name: "Gail P.", age: "52", income: "$7,000/mo", before: "Retired Veterinarian", story: "Vet school barely covered nutrition. This opened my eyes to what we were missing. My consulting practice is booming.", avatar: A4 },
            { name: "Hannah T.", age: "35", income: "$3,800/mo", before: "Dog Walker & Pet Sitter", story: "I loved animals but had no qualifications. Now I'm a certified pet nutrition coach and my dog walking clients are my first coaching clients.", avatar: A5 },
            { name: "Kathy S.", age: "50", income: "$5,600/mo", before: "Human Nutritionist", story: "I already knew nutrition for humans. Adding pet nutrition doubled my client base. Pet parents are just as dedicated as human health clients.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Pet Nutrition Coach", description: "Help pet parents make informed nutrition and wellness decisions. Work from home, serve passionate clients, and improve animal health.", benefits: ["Work with pet parents 1-on-1 (virtual or in-person)", "Help animals thrive through proper nutrition", "Be your own boss with flexible hours", "Work in a passion-driven niche with devoted clients"], incomeRange: "$4K-$8K/mo", perSession: "$125", clientsPerMonth: "12-18" },
    advantages: {
        sectionHeadline: "Your Love for Animals Is|Your Unfair Advantage", sectionDescription: "If you've always been the person your friends come to for pet advice, you already have the passion and knowledge base to thrive.", cards: [
            { iconName: "Heart", title: "Animal Passion", desc: "You already go above and beyond for your own pets. That dedication is exactly what makes amazing pet nutrition coaches." },
            { iconName: "BookOpen", title: "Research Curiosity", desc: "You've already read pet food labels, researched raw diets, and studied ingredients. Now formalize that knowledge." },
            { iconName: "Star", title: "Passionate Market", desc: "Pet parents spend $136B/year on their animals. They're actively looking for trusted nutrition guidance." }
        ]
    },
    thisIsForYou: { loveIt: ["You've seen your own pet's health transform through better nutrition", "You work with animals and want to add nutrition coaching", "You're passionate about animal welfare and holistic pet care", "You want meaningful work from home serving a niche you love", "You believe pet food companies don't have pets' best interests in mind"], notRightNow: ["You're not interested in animal health", "You're not willing to invest 60 minutes", "You're looking for a veterinary license", "You don't have any interest in nutrition"] },
    lessons: [
        { num: 1, title: "Pet Nutrition Foundations", desc: "Species-appropriate nutrition, why commercial pet food fails, and the link between diet and chronic pet health issues" },
        { num: 2, title: "The P.A.W.S. Method™", desc: "Your signature framework: Profile, Assess, Whole-food & Supplement — evidence-based pet nutrition coaching" },
        { num: 3, title: "Building Your Pet Wellness Practice", desc: "Warm market strategy, pricing, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Pet Nutrition Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "P.A.W.S. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Pet Wellness Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Aspiring Pet Wellness Coaches Only" },
    faq: {
        sectionTitle: "Questions About Pet Nutrition Coaching", items: [
            { q: "Do I need a veterinary degree?", a: "No! Pet nutrition coaching focuses on dietary guidance and wellness support. You work alongside vets, not in place of them." },
            { q: "Can I work with all types of pets?", a: "This certification focuses on dogs and cats — the most common pets. The principles apply broadly, and you can specialize as you grow." },
            { q: "Is there really demand for this?", a: "Pet parents spend $136B/year in the US alone. Pet nutrition consulting is one of the fastest-growing niches — and it's still early." },
            { q: "Can I really earn money doing this?", a: "$125/session × 4 sessions/client × 12 clients = $6,000/month. Pet parents are some of the most dedicated clients you'll ever work with." },
            { q: "What's the catch? Why is it free?", a: "Free certification so you can experience the training. Continue with full Board Certification if you love it." }
        ]
    },
    certificateTitle: "Pet Nutrition & Wellness Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "Certified in Pet Nutrition.", subheadline: `${28} coaches enrolled today. 89% finished the same day. Your love for animals + this certification = <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Pet Nutrition Mini Diploma", contentId: "pn-mini-diploma", pixelId: PIXEL_FM },
};

// ─── REIKI HEALING ────────────────────────────────────────────
export const reikiHealingConfig: NicheLandingConfig = {
    nicheId: "reiki-healing",
    nicheSlug: "reiki-healing-mini-diploma",
    displayName: "Reiki Healing",
    courseSlug: "reiki-healing",
    portalSlug: "reiki-healing",
    brand: { primary: "#4f46e5", primaryDark: "#312e81", primaryLight: "#818cf8" },
    hero: { badge: "1-Hour Mini Diploma for Reiki Practitioners", headline: "Reiki Healing", subheadline: "Get certified in 1 hour. Channel universal life force energy to help clients heal. Start earning $4K-$8K/month.", socialProofCount: "4,247", socialProofLabel: "healers certified", enrolledToday: 32 },
    sarah: { quoteHeadline: "\"I Felt Energy in My Hands|But Had No One to Guide Me.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years in energy medicine and Reiki practice. Certified Reiki Master Teacher and Integrative Practitioner.", "My own Reiki journey started when <strong>nothing else worked</strong>. Chronic back pain, anxiety, insomnia — I'd tried everything conventional. When a friend placed her hands above my shoulders and I felt a wave of warmth move through my body, I knew <strong>something profound was happening</strong>. I later learned it was Reiki — and it changed my life.", "Now I train healers who want to share this gift. <strong>2,400+ women</strong> have completed this program. Many felt the energy years ago but didn't know what to do with it."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Discovered Reiki Changed Everything.|Now They Share the Gift.", sectionSubheadline: "", stories: [
            { name: "Megan M.", age: "41", income: "$5,400/mo", before: "Former Massage Therapist", story: "Massage was physical. Reiki is spiritual. When I added Reiki to my sessions, my clients started having breakthroughs I'd never seen in 12 years.", avatar: A1 },
            { name: "Heather K.", age: "45", income: "$6,800/mo", before: "Yoga Studio Owner", story: "I taught yoga for 15 years. Reiki took my teaching to a whole new level. My workshops sell out and my private sessions are fully booked.", avatar: A2 },
            { name: "Christina L.", age: "37", income: "$4,200/mo", before: "Graphic Designer", story: "I felt energy my whole life but never had a name for it. Getting Reiki certified gave me the language and confidence to practice professionally.", avatar: A3 },
            { name: "Joanne P.", age: "53", income: "$7,600/mo", before: "Hospice Nurse", story: "I saw Reiki bring peace to dying patients. When I got certified, I started offering Reiki in hospitals. Now I have my own thriving practice.", avatar: A4 },
            { name: "Tanya T.", age: "40", income: "$3,900/mo", before: "Stay-at-Home Mom", story: "My kids always called my hugs 'magic.' Turns out they were right. Now I use that energy professionally and love every minute.", avatar: A5 },
            { name: "Valerie S.", age: "48", income: "$5,200/mo", before: "Acupuncturist", story: "Adding Reiki to my acupuncture practice was the best decision I made. My patients heal faster and book more often.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Reiki Practitioner", description: "Channel universal energy to help clients heal, relax, and transform. Work from home or in a healing studio on your own terms.", benefits: ["Work with clients 1-on-1 (in-person or distance)", "Help people heal at the energetic level", "Be your own boss with flexible hours", "Share a gift that transforms lives"], incomeRange: "$4K-$8K/mo", perSession: "$125", clientsPerMonth: "12-18" },
    advantages: {
        sectionHeadline: "Your Sensitivity to Energy Is|Your Unfair Advantage", sectionDescription: "If you've always sensed energy, felt things others don't, or been drawn to healing — Reiki may be your calling.", cards: [
            { iconName: "Zap", title: "Energy Sensitivity", desc: "You feel energy shifts in rooms and people. That's not your imagination — it's the core skill of Reiki practice." },
            { iconName: "Heart", title: "Natural Healer", desc: "People have always felt calmer in your presence. You already channel healing energy — now learn to do it with intention." },
            { iconName: "Sparkles", title: "Spiritual Connection", desc: "You're drawn to the sacred and the unseen. Reiki gives you a structured practice to channel that connection." }
        ]
    },
    thisIsForYou: { loveIt: ["You've always been drawn to energy work and healing", "You feel energy in your hands or in the presence of others", "You want to combine spiritual practice with professional income", "You dream of helping people heal on a deep, energetic level", "You believe healing happens beyond what medicine can measure"], notRightNow: ["You're skeptical about energy healing", "You're not willing to invest 60 minutes", "You're looking for a medical license", "You don't believe in subtle energy or life force"] },
    lessons: [
        { num: 1, title: "Reiki Origins & Principles", desc: "The history of Usui Reiki, the 5 principles, how energy flows through the body, and the science behind biofield healing" },
        { num: 2, title: "The L.I.G.H.T. Method™", desc: "Your signature framework: Listen, Intuit, Ground, Heal & Transfer — professional Reiki practice protocol" },
        { num: 3, title: "Building Your Reiki Practice", desc: "Warm market strategy, pricing, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Reiki Healing Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "L.I.G.H.T. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Reiki Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Aspiring Reiki Practitioners Only" },
    faq: {
        sectionTitle: "Questions About Reiki Healing", items: [
            { q: "Do I need a Reiki attunement first?", a: "This Mini Diploma teaches Reiki foundations and coaching frameworks. Full attunements are part of the advanced Board Certification program. Many practitioners start here." },
            { q: "Is Reiki scientifically supported?", a: "Growing research supports Reiki for pain reduction, anxiety relief, and relaxation. Over 800 US hospitals now offer Reiki programs, including Cleveland Clinic and Yale." },
            { q: "Can I combine this with massage or yoga?", a: "Absolutely! Reiki enhances any hands-on modality. Many massage therapists, yoga teachers, and therapists add Reiki to their offerings." },
            { q: "Can I really earn money doing Reiki?", a: "$125/session × 4 sessions/client × 12 clients = $6,000/month. Reiki is mainstream now — demand is growing every year." },
            { q: "What's the catch? Why is it free?", a: "Free certification so you can experience Reiki training. If you love it, continue with our full Board Certification." }
        ]
    },
    certificateTitle: "Reiki Healing Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "A Certified Reiki Healer.", subheadline: `${32} healers enrolled today. 89% finished the same day. Your energy + this certification = <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Reiki Healing Mini Diploma", contentId: "rh-mini-diploma", pixelId: PIXEL_FM },
};

// ─── WOMEN'S HORMONE HEALTH ──────────────────────────────────
export const womensHormoneHealthConfig: NicheLandingConfig = {
    nicheId: "womens-hormone-health",
    nicheSlug: "womens-hormone-health-mini-diploma",
    displayName: "Women's Hormone Health",
    courseSlug: "womens-hormone-health",
    portalSlug: "womens-hormone-health",
    brand: { primary: "#db2777", primaryDark: "#831843", primaryLight: "#f472b6" },
    hero: { badge: "1-Hour Mini Diploma for Women's Health Coaches", headline: "Women's Hormone Health", subheadline: "Get certified in 1 hour. Help women navigate menopause, perimenopause, and hormonal imbalances. Start earning $4K-$8K/month.", socialProofCount: "4,247", socialProofLabel: "coaches certified", enrolledToday: 43 },
    sarah: { quoteHeadline: "\"Her Doctor Said 'It's Just Menopause.'|She Deserved Better Than That.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years specializing in women's hormonal health, menopause support, and integrative wellness.", "The moment I became obsessed with women's hormones: a <strong>50-year-old executive</strong> who went from running a company to barely getting out of bed. Hot flashes every hour. Brain fog so severe she forgot her own address. Weight gain that no diet could touch. Her doctor said \"welcome to menopause\" and offered antidepressants. She didn't need antidepressants — she needed someone who understood <strong>what was happening to her body</strong>.", "Now I train coaches who refuse to let women suffer in silence. <strong>2,400+ women</strong> have completed this program, becoming the advocates that every woman over 40 deserves."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Survived Their Own Hormone Hell.|Now They Guide Other Women Through.", sectionSubheadline: "", stories: [
            { name: "Pamela M.", age: "52", income: "$6,400/mo", before: "OB/GYN Nurse, 22 years", story: "I watched doctors dismiss menopausal women for two decades. Now I help those same women take control. My practice is 100% word of mouth.", avatar: A1 },
            { name: "Diane K.", age: "48", income: "$7,200/mo", before: "Pharmaceutical Sales Rep", story: "I sold HRT for 10 years. When I learned what women actually need — beyond a pill — I quit and started coaching. Best decision ever.", avatar: A2 },
            { name: "Cheryl L.", age: "44", income: "$5,100/mo", before: "Fitness Instructor", story: "At 42, suddenly nothing worked. My own hormonal crash taught me what millions of women go through. Now I help them navigate it.", avatar: A3 },
            { name: "Brenda P.", age: "55", income: "$8,000/mo", before: "Retired Family Doctor", story: "Medical school barely mentioned menopause. I'm embarrassed how little I knew. Now I help women with what my training never taught me.", avatar: A4 },
            { name: "Lorraine T.", age: "47", income: "$4,600/mo", before: "HR Manager", story: "I managed workplace wellness and saw women suffering in silence at their desks. Now I help them understand their bodies and reclaim their careers.", avatar: A5 },
            { name: "Suzanne S.", age: "50", income: "$5,800/mo", before: "Health Blogger", story: "I blogged about menopause for 3 years and built a following. Getting certified turned my audience into clients. Now I have a real practice.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Women's Hormone Coach", description: "Help women navigate menopause, perimenopause, and hormonal transitions with confidence. Be the advocate every woman over 40 needs.", benefits: ["Specialize in women's hormonal health", "Work with women 1-on-1 (virtual or in-person)", "Be your own boss with flexible hours", "Fill the massive gap in women's healthcare"], incomeRange: "$4K-$8K/mo", perSession: "$150", clientsPerMonth: "10-15" },
    advantages: {
        sectionHeadline: "Your Experience as a Woman Is|Your Unfair Advantage", sectionDescription: "If you've navigated your own hormonal journey — or watched someone you love struggle — you have the empathy and understanding that clients pay for.", cards: [
            { iconName: "Heart", title: "Lived Experience", desc: "You know what it's like to feel dismissed. That rage you feel when doctors say 'it's just aging' is exactly what drives great coaches." },
            { iconName: "Brain", title: "Deep Research", desc: "You've already spent hours learning about estrogen, progesterone, thyroid, and adrenals. Now formalize that knowledge." },
            { iconName: "Users", title: "Built-In Market", desc: "Every woman you know over 40 is a potential client. The demand for women's hormone coaching is enormous — and growing." }
        ]
    },
    thisIsForYou: { loveIt: ["You've experienced hormonal upheaval yourself (perimenopause, menopause, thyroid)", "You're angry that women are dismissed by their doctors", "You want to help women over 40 reclaim their bodies and minds", "You dream of flexible work from home that makes a real impact", "You believe women deserve specialized hormone support"], notRightNow: ["You're not interested in women's health", "You're not willing to invest 60 minutes", "You're looking to prescribe HRT (medical scope)", "You don't believe lifestyle can affect hormones"] },
    lessons: [
        { num: 1, title: "The Women's Hormone Landscape", desc: "Estrogen, progesterone, thyroid, cortisol — how they interact, why they crash, and what drives symptoms in women 35+" },
        { num: 2, title: "The H.E.R. Protocol™", desc: "Your signature framework: Hormone Education, Empowerment & Restoration — evidence-based women's hormone coaching" },
        { num: 3, title: "Building Your Women's Health Practice", desc: "Warm market strategy, pricing, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Women's Hormone Health Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "H.E.R. Protocol™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Women's Health Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Women's Health Coaches Only" },
    faq: {
        sectionTitle: "Questions About Women's Hormone Coaching", items: [
            { q: "Do I need a medical degree?", a: "No. Women's hormone coaching is about education, lifestyle guidance, and support — not prescribing HRT or diagnosing conditions. You empower women to understand their own bodies." },
            { q: "What age group of women does this serve?", a: "Primarily women 35-65 experiencing perimenopause, menopause, and post-menopause. This is the largest underserved demographic in healthcare." },
            { q: "Is there really demand for this?", a: "1.3 million women enter menopause every year in the US alone. There's a massive shortage of hormone-literate professionals. The market is enormous." },
            { q: "Can I really earn money doing this?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. Women are desperate for this support and willing to invest." },
            { q: "What's the catch? Why is it free?", a: "Free certification to experience the training. Continue with full Board Certification if you love it." }
        ]
    },
    certificateTitle: "Women's Hormone Health Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "Certified in Women's Hormone Health.", subheadline: `${43} coaches enrolled today. 89% finished the same day. <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Women's Hormone Health Mini Diploma", contentId: "whh-mini-diploma", pixelId: PIXEL_FM },
};

export const NICHE_LANDING_CONFIGS_3: Record<string, NicheLandingConfig> = {
    "life-coaching": lifeCoachingConfig,
    "nurse-coach": nurseCoachConfig,
    "pet-nutrition": petNutritionConfig,
    "reiki-healing": reikiHealingConfig,
    "womens-hormone-health": womensHormoneHealthConfig,
};
