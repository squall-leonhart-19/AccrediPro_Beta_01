import { NicheLandingConfig } from "./landing-page-types";

const PIXEL_FM = "1340178367364771";
const A1 = "/zombie-avatars/user_47_backyard_bbq_1767801467.webp";
const A2 = "/zombie-avatars/user_52_bedroom_morning_1767801467.webp";
const A3 = "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp";
const A4 = "/zombie-avatars/user_55_cooking_class_1767801442.webp";
const A5 = "/zombie-avatars/user_41_coffee_shop_working_1768611487.webp";
const A6 = "/zombie-avatars/user_38_home_office_1768611487.webp";

// ─── HEALTH COACH ─────────────────────────────────────────────
export const healthCoachConfig: NicheLandingConfig = {
    nicheId: "health-coach",
    nicheSlug: "health-coach-mini-diploma",
    displayName: "Health Coaching",
    courseSlug: "health-coach",
    portalSlug: "health-coach",
    brand: { primary: "#059669", primaryDark: "#064e3b", primaryLight: "#34d399" },
    hero: { badge: "1-Hour Mini Diploma for Health Coaches", headline: "Health Coaching", subheadline: "Get certified in 1 hour. Help clients build healthier habits and transform their lives. Start earning $4K-$8K/month.", socialProofCount: "4,247", socialProofLabel: "coaches certified", enrolledToday: 42 },
    sarah: { quoteHeadline: "\"People Don't Need More Diets.|They Need Someone Who Listens.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years in integrative wellness and health coaching. Board-Certified Health Coach and Wellness Strategist.", "The client who opened my eyes? A <strong>52-year-old executive</strong> who'd tried every diet, every gym, every wellness trend. She had the knowledge. She had the motivation. What she didn't have was someone who actually <strong>listened to what she needed</strong> and helped her build habits that stuck.", "Now I train coaches who create real, lasting change. <strong>2,400+ women</strong> have gone through this program and are helping clients who are tired of quick fixes."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Were Already Helping People.|Now They Get Paid For It.", sectionSubheadline: "", stories: [
            { name: "Andrea M.", age: "44", income: "$5,200/mo", before: "Fitness Studio Manager", story: "I managed a gym for 10 years watching people start and quit. When I became a health coach, I finally helped people stick with it.", avatar: A1 },
            { name: "Brenda K.", age: "48", income: "$6,800/mo", before: "School Nurse, 20 years", story: "I patched up kids all day but couldn't help adults stay healthy. Health coaching lets me do what school nursing never could.", avatar: A2 },
            { name: "Catherine L.", age: "38", income: "$4,400/mo", before: "HR Wellness Coordinator", story: "I ran corporate wellness programs. Now I help individuals 1-on-1 and see way more impact — and earn more too.", avatar: A3 },
            { name: "Evelyn P.", age: "53", income: "$7,500/mo", before: "Pharmaceutical Sales Rep", story: "I sold pills for 20 years knowing lifestyle changes work better. Now I help people change their lives without a prescription.", avatar: A4 },
            { name: "Gloria T.", age: "41", income: "$3,800/mo", before: "Stay-at-Home Mom", story: "Everyone says I should coach. Now I do — helping other moms prioritize their health. I wish I'd done this 10 years ago.", avatar: A5 },
            { name: "Helen S.", age: "36", income: "$5,600/mo", before: "Personal Trainer", story: "I could write meal plans and workouts, but clients needed more. Health coaching gave me the tools to help the whole person.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Health Coach", description: "Help clients make lasting lifestyle changes. Work from home, set your own schedule, and build real relationships with the people you serve.", benefits: ["Work with clients 1-on-1 (virtual or in-person)", "Help people build sustainable healthy habits", "Be your own boss with flexible hours", "Focus on the whole person, not just symptoms"], incomeRange: "$4K-$8K/mo", perSession: "$150", clientsPerMonth: "10-15" },
    advantages: {
        sectionHeadline: "Your Life Experience Is|Your Unfair Advantage", sectionDescription: "If you've navigated your own health journey, raised a family, or worked in any people-facing role — you already have the skills clients pay for.", cards: [
            { iconName: "Heart", title: "Natural Caregiver", desc: "You've always been the person others come to for health advice. Now turn that instinct into a professional practice." },
            { iconName: "Users", title: "People Skills", desc: "You know how to listen, motivate, and hold space. These soft skills are what make health coaching effective." },
            { iconName: "BookOpen", title: "Health Knowledge", desc: "You've read the books, watched the documentaries, and done your own research. Now formalize that knowledge into a credential." }
        ]
    },
    thisIsForYou: { loveIt: ["You're the 'health guru' friend everyone comes to for advice", "You've been through your own health transformation and want to help others", "You want meaningful work from home that actually helps people", "You're burned out in healthcare but still passionate about wellness", "You believe health is about lifestyle, not just medicine"], notRightNow: ["You're not willing to invest 60 minutes", "You're looking for a medical license", "You're not interested in lifestyle-based approaches", "You don't enjoy working with people one-on-one"] },
    lessons: [
        { num: 1, title: "The Health Coaching Revolution", desc: "Why health coaching is the fastest-growing profession in wellness, and the science of behavior change" },
        { num: 2, title: "The T.H.R.I.V.E. Method™", desc: "Your signature framework: Track, Heal, Rebalance, Integrate, Vitalize & Empower — lasting health transformation" },
        { num: 3, title: "Getting Your First Clients", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Health Coaching Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "T.H.R.I.V.E. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Private Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Aspiring Health Coaches Only" },
    faq: {
        sectionTitle: "Questions About Health Coaching", items: [
            { q: "Do I need a medical degree?", a: "No. Health coaching is about lifestyle guidance, accountability, and behavior change — not medical diagnosis. Many top health coaches come from non-medical backgrounds." },
            { q: "How is this different from personal training?", a: "Health coaching takes a whole-person approach: nutrition, sleep, stress, relationships, mindset — not just exercise. You help clients build sustainable lifestyles, not just workout programs." },
            { q: "Can I really earn money as a health coach?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. Health coaching is one of the fastest-growing professions — demand far exceeds supply." },
            { q: "What's the catch? Why is it free?", a: "We give you a genuinely valuable free certification. If you love it, continue with our full Board Certification. If not, you walk away with a real credential." },
            { q: "Can I start part-time?", a: "Absolutely! Most graduates start with 3-5 clients while working their current job. You can scale up at your own pace." }
        ]
    },
    certificateTitle: "Health Coaching Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "A Certified Health Coach.", subheadline: `${42} coaches enrolled today. 89% finished the same day. <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Health Coaching Mini Diploma", contentId: "hc-mini-diploma", pixelId: PIXEL_FM },
};

// ─── HOLISTIC NUTRITION ───────────────────────────────────────
export const holisticNutritionConfig: NicheLandingConfig = {
    nicheId: "holistic-nutrition",
    nicheSlug: "holistic-nutrition-mini-diploma",
    displayName: "Holistic Nutrition",
    courseSlug: "holistic-nutrition",
    portalSlug: "holistic-nutrition",
    brand: { primary: "#d97706", primaryDark: "#78350f", primaryLight: "#fbbf24" },
    hero: { badge: "1-Hour Mini Diploma for Nutrition Coaches", headline: "Holistic Nutrition", subheadline: "Get certified in 1 hour. Help clients use food as medicine. Start earning $4K-$8K/month as a holistic nutrition specialist.", socialProofCount: "4,247", socialProofLabel: "coaches certified", enrolledToday: 36 },
    sarah: { quoteHeadline: "\"Every Doctor Said 'Eat Better.'|No One Showed Her How.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years in nutrition and functional wellness. Board-Certified Holistic Nutritionist and Integrative Health Practitioner.", "The moment I knew I had to train others? A <strong>41-year-old single mom</strong> with Type 2 diabetes, pre-hypertension, and chronic fatigue. Her doctor said \"change your diet.\" That was it. No plan, no guidance, no support. She was googling \"anti-inflammatory meal plan\" at 2am and <strong>getting more confused every hour</strong>.", "Now I train coaches who actually guide people through the process. <strong>2,400+ women</strong> passed through this program, learning how to turn food into the most powerful medicine on earth."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Changed Their Own Health with Food.|Now They Help Others.", sectionSubheadline: "", stories: [
            { name: "Lisa M.", age: "40", income: "$5,400/mo", before: "Personal Chef", story: "I cooked for families for 12 years. When I added nutrition coaching, I went from cooking meals to changing lives. And my income doubled.", avatar: A1 },
            { name: "Patricia K.", age: "47", income: "$6,100/mo", before: "Naturopathic Clinic Assistant", story: "I saw what nutrition could do in the clinic. Now I have my own practice helping women reverse chronic symptoms through food.", avatar: A2 },
            { name: "Danielle L.", age: "35", income: "$4,800/mo", before: "Food Blogger", story: "I had 50K followers but no income. Getting certified changed everything. Now my blog drives clients to my coaching practice.", avatar: A3 },
            { name: "Barbara P.", age: "54", income: "$7,200/mo", before: "Retired Dietitian", story: "Hospital dietetics burned me out. Holistic nutrition lets me help people eat for healing — not just counting calories.", avatar: A4 },
            { name: "Michelle T.", age: "42", income: "$4,000/mo", before: "Mom Who Healed Her Kids", story: "My daughter's eczema vanished when I changed her diet. Now I help other parents use food to heal their families.", avatar: A5 },
            { name: "Amanda S.", age: "38", income: "$5,900/mo", before: "Yoga Teacher", story: "I taught the movement. Adding nutrition coaching made my offerings complete. My retreat packages sell out in hours now.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Holistic Nutritionist", description: "Help clients use food as medicine to transform their health. Work from home, design meal protocols, and guide lasting change.", benefits: ["Work with clients 1-on-1 (virtual)", "Help people heal through nutrition", "Be your own boss with flexible hours", "Use food as the most powerful tool for healing"], incomeRange: "$4K-$8K/mo", perSession: "$150", clientsPerMonth: "10-15" },
    advantages: {
        sectionHeadline: "Your Food Knowledge Is|Your Unfair Advantage", sectionDescription: "You already know more about nutrition than most people. Now turn that passion into a professional credential.", cards: [
            { iconName: "BookOpen", title: "Nutrition Knowledge", desc: "You've read the books, watched the docs, and done your own research. You know food is medicine — now prove it professionally." },
            { iconName: "Heart", title: "Personal Healing", desc: "If you've healed yourself or your family through nutrition, you understand the transformation at a level no textbook can teach." },
            { iconName: "Star", title: "Growing Demand", desc: "People are desperate for real nutrition guidance. Holistic nutrition coaching is one of the fastest-growing wellness professions." }
        ]
    },
    thisIsForYou: { loveIt: ["You believe food is the most powerful medicine on earth", "You've transformed your own health through nutrition", "You're the friend who always gives diet and recipe advice", "You want work from home that helps people heal", "You're tired of watching people follow bad nutrition advice"], notRightNow: ["You think a pill is easier than a meal plan", "You're not willing to invest 60 minutes", "You're looking for a registered dietitian license", "You're not passionate about food and healing"] },
    lessons: [
        { num: 1, title: "Food as Functional Medicine", desc: "The science of how food heals inflammation, gut issues, and chronic disease — beyond calories and macros" },
        { num: 2, title: "The N.O.U.R.I.S.H. Method™", desc: "Your signature framework: Nourish, Optimize, Understand, Restore, Integrate, Sustain & Heal through whole-food protocols" },
        { num: 3, title: "Building Your Nutrition Practice", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Holistic Nutrition Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "N.O.U.R.I.S.H. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Private Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Aspiring Nutrition Coaches Only" },
    faq: {
        sectionTitle: "Questions About Holistic Nutrition", items: [
            { q: "Do I need a dietetics degree?", a: "No. Holistic nutrition coaching focuses on whole-food guidance and lifestyle — not medical nutrition therapy. You work within scope to help clients eat for healing." },
            { q: "How is this different from being a dietitian?", a: "Dietitians focus on medical nutrition therapy in clinical settings. Holistic nutritionists take a whole-person, food-as-medicine approach to help clients heal through lifestyle changes." },
            { q: "Can I really earn money as a nutritionist?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. Holistic nutrition is booming — people are desperate for real food guidance." },
            { q: "What's the catch? Why is it free?", a: "We give you a genuinely valuable free certification. If you love it, continue with our full Board Certification. If not, you walk away with a real credential." },
            { q: "Can I combine this with fitness or wellness?", a: "Absolutely! Nutrition coaching pairs perfectly with personal training, yoga, health coaching, and functional medicine practices." }
        ]
    },
    certificateTitle: "Holistic Nutrition Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "Certified in Holistic Nutrition.", subheadline: `${36} coaches enrolled today. 89% finished the same day. <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Holistic Nutrition Mini Diploma", contentId: "hn-mini-diploma", pixelId: PIXEL_FM },
};

// ─── HORMONE HEALTH ───────────────────────────────────────────
export const hormoneHealthConfig: NicheLandingConfig = {
    nicheId: "hormone-health",
    nicheSlug: "hormone-health-mini-diploma",
    displayName: "Hormone Health",
    courseSlug: "hormone-health",
    portalSlug: "hormone-health",
    brand: { primary: "#e11d48", primaryDark: "#881337", primaryLight: "#fb7185" },
    hero: { badge: "1-Hour Mini Diploma for Hormone Coaches", headline: "Hormone Health", subheadline: "Get certified in 1 hour. Help women balance their hormones naturally. Start earning $4K-$8K/month as a hormone health specialist.", socialProofCount: "4,247", socialProofLabel: "coaches certified", enrolledToday: 40 },
    sarah: { quoteHeadline: "\"She Thought She Was Going Crazy.|It Was Her Hormones.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years in hormone health and functional medicine. Certified Hormone Health Specialist and Integrative Practitioner.", "The moment that broke me? A <strong>47-year-old lawyer</strong> who told her doctor she was exhausted, gaining weight, losing her hair, and couldn't think straight. His answer? \"That's just aging.\" She was crying in my office because she thought she was <strong>losing her mind</strong>. It wasn't aging. It was a hormone imbalance that could be addressed naturally.", "Now I train coaches who give women answers instead of dismissals. <strong>2,400+ women</strong> have completed this program, helping clients reclaim their energy, bodies, and confidence."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Balanced Their Own Hormones.|Now They Help Other Women.", sectionSubheadline: "", stories: [
            { name: "Jennifer M.", age: "47", income: "$5,800/mo", before: "Pharmaceutical Sales Rep", story: "I sold hormone drugs for 15 years. When I learned what women actually need, I quit and started coaching. My clients love finally being heard.", avatar: A1 },
            { name: "Natalie K.", age: "44", income: "$6,500/mo", before: "OB/GYN Office Manager", story: "I watched doctors dismiss hormonal complaints daily. Now I help women understand their bodies and get real relief.", avatar: A2 },
            { name: "Samantha L.", age: "39", income: "$4,600/mo", before: "Fitness Trainer", story: "My female clients hit walls that workouts couldn't fix. It was hormones. Adding hormone coaching made me the go-to trainer in my area.", avatar: A3 },
            { name: "Teresa P.", age: "52", income: "$7,200/mo", before: "Retired Nurse Practitioner", story: "After menopause hit me like a truck, I dove into hormone science. Now I help other women navigate what I went through.", avatar: A4 },
            { name: "Rachel T.", age: "41", income: "$4,100/mo", before: "Mom with Thyroid Issues", story: "My thyroid crisis taught me everything about hormones. Now I help women who feel dismissed by their doctors.", avatar: A5 },
            { name: "Victoria S.", age: "46", income: "$5,400/mo", before: "Wellness Blogger", story: "I blogged about hormones for 5 years but had no credential. Now I have both — and clients trust me more for it.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Hormone Health Specialist", description: "Help women balance hormones naturally and reclaim their vitality. Work from home with clients who desperately need what you offer.", benefits: ["Work with women 1-on-1 (virtual or in-person)", "Help clients with perimenopause, thyroid, and hormonal imbalances", "Be your own boss with flexible hours", "Address what traditional medicine often dismisses"], incomeRange: "$4K-$8K/mo", perSession: "$150", clientsPerMonth: "10-15" },
    advantages: {
        sectionHeadline: "Your Hormone Journey Is|Your Unfair Advantage", sectionDescription: "If you've navigated your own hormonal challenges, you understand the frustration, the dismissals, and the relief of finally finding answers.", cards: [
            { iconName: "Heart", title: "Lived Experience", desc: "You've been through hormonal chaos yourself. That journey gives you credibility and empathy that no textbook can match." },
            { iconName: "Brain", title: "Deep Understanding", desc: "You've researched thyroid, adrenals, estrogen, and progesterone. That knowledge is exactly what your clients need." },
            { iconName: "Sparkles", title: "Massive Demand", desc: "80% of women experience hormonal issues. There are far more women needing help than coaches available to help them." }
        ]
    },
    thisIsForYou: { loveIt: ["You've dealt with hormonal imbalances yourself and know the struggle", "You're passionate about women's health and natural approaches", "You're furious that doctors dismiss women's symptoms", "You want to work from home with clients who truly need you", "You believe women deserve answers, not dismissals"], notRightNow: ["You're not interested in women's wellness", "You're not willing to invest 60 minutes", "You're looking to prescribe hormone therapy (medical scope)", "You don't believe in lifestyle-based hormone management"] },
    lessons: [
        { num: 1, title: "Hormone Fundamentals", desc: "How hormones control energy, weight, mood, and sleep — and why conventional medicine misses imbalances" },
        { num: 2, title: "The B.A.L.A.N.C.E. Method™", desc: "Your signature framework: Baseline, Assess, Lifestyle, Adapt, Nourish, Cycle & Evaluate — natural hormone harmony" },
        { num: 3, title: "Building Your Hormone Practice", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Hormone Health Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "B.A.L.A.N.C.E. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Private Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Aspiring Hormone Coaches Only" },
    faq: {
        sectionTitle: "Questions About Hormone Health Coaching", items: [
            { q: "Do I need to be a doctor?", a: "No! Hormone health coaching is about education, lifestyle guidance, and empowerment — not diagnosis or prescribing. You help women understand their hormones and make lifestyle changes." },
            { q: "Is this evidence-based?", a: "Absolutely. The B.A.L.A.N.C.E. Method™ is grounded in endocrinology research, functional medicine, and published clinical studies on lifestyle interventions for hormonal health." },
            { q: "Can I work with menopausal women?", a: "Yes! Perimenopause and menopause are the #1 reasons women seek hormone coaching. You'll learn to guide clients through these transitions naturally." },
            { q: "Can I really earn money doing this?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. Hormone health coaching is in massive demand." },
            { q: "What's the catch? Why is it free?", a: "Free certification lets you experience the training. If you love it, continue with full Board Certification. If not, you have a real credential." }
        ]
    },
    certificateTitle: "Hormone Health Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "Certified in Hormone Health.", subheadline: `${40} coaches enrolled today. 89% finished the same day. <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Hormone Health Mini Diploma", contentId: "hh-mini-diploma", pixelId: PIXEL_FM },
};

// ─── INTEGRATIVE HEALTH ───────────────────────────────────────
export const integrativeHealthConfig: NicheLandingConfig = {
    nicheId: "integrative-health",
    nicheSlug: "integrative-health-mini-diploma",
    displayName: "Integrative Health",
    courseSlug: "integrative-health",
    portalSlug: "integrative-health",
    brand: { primary: "#475569", primaryDark: "#1e293b", primaryLight: "#94a3b8" },
    hero: { badge: "1-Hour Mini Diploma for Integrative Health Coaches", headline: "Integrative Health", subheadline: "Get certified in 1 hour. Bridge conventional and holistic medicine to help clients heal. Start earning $4K-$8K/month.", socialProofCount: "4,247", socialProofLabel: "coaches certified", enrolledToday: 33 },
    sarah: { quoteHeadline: "\"She Had 5 Specialists.|Nobody Was Talking to Each Other.\"", paragraphs: ["I'm Sarah Mitchell. 20+ years in integrative wellness and functional medicine. Board-Certified Integrative Health Practitioner.", "The case that changed everything: a <strong>51-year-old executive</strong> seeing a cardiologist, endocrinologist, gastroenterologist, therapist, and rheumatologist. Five specialists, five treatment plans, zero coordination. She was <strong>taking 12 supplements and 4 medications</strong>, and nobody asked if they were working together. I helped her integrate everything into one coherent wellness plan.", "Now I train coaches who bridge the gap. <strong>2,400+ women</strong> have completed this program, becoming the coordinator their clients desperately need."], credentials: "20+ Years Experience" },
    testimonials: {
        sectionHeadline: "They Saw the Gaps in Healthcare.|Now They Bridge Them.", sectionSubheadline: "", stories: [
            { name: "Sandra M.", age: "50", income: "$5,500/mo", before: "Hospital Case Manager", story: "I spent 20 years watching patients fall through the cracks between specialists. Now I help them connect the dots. It's what I always wished I could do.", avatar: A1 },
            { name: "Lynn K.", age: "46", income: "$6,000/mo", before: "Pharmacy Technician", story: "I saw people on 8+ medications daily. Nobody asked about lifestyle. Now I help clients use both medicine AND natural approaches — together.", avatar: A2 },
            { name: "Martha L.", age: "42", income: "$4,900/mo", before: "Health Insurance Analyst", story: "I processed claims and saw what actually worked. Integrative approaches had the best outcomes. Now I help people find that balance.", avatar: A3 },
            { name: "Dorothy P.", age: "55", income: "$7,800/mo", before: "Retired RN", story: "Nursing taught me medicine. But integrative health taught me healing. There's a difference, and my clients feel it.", avatar: A4 },
            { name: "Karen T.", age: "43", income: "$3,700/mo", before: "Medical Office Administrator", story: "I ran a doctor's office for 15 years. When I learned integrative approaches, I finally understood what was missing from conventional care.", avatar: A5 },
            { name: "Deborah S.", age: "48", income: "$5,200/mo", before: "Physical Therapist", story: "Adding integrative health to my PT practice was a game changer. My patients heal faster and more completely now.", avatar: A6 }
        ]
    },
    careerPath: { practitionerTitle: "Certified Integrative Health Practitioner", description: "Help clients bridge conventional and holistic medicine for total wellness. Be the coordinator they desperately need.", benefits: ["Bridge the gap between conventional and holistic", "Work with clients 1-on-1 (virtual or in-person)", "Be your own boss with flexible hours", "Help people who've been failed by fragmented care"], incomeRange: "$4K-$8K/mo", perSession: "$150", clientsPerMonth: "10-15" },
    advantages: {
        sectionHeadline: "Your Healthcare Background Is|Your Unfair Advantage", sectionDescription: "If you've worked in any area of healthcare, you already see the gaps. Now become the person who fills them.", cards: [
            { iconName: "Shield", title: "Clinical Awareness", desc: "You understand how the medical system works — and where it fails. That insight is invaluable to clients navigating complex health issues." },
            { iconName: "Heart", title: "Holistic Perspective", desc: "You see the whole person, not just the diagnosis. This perspective is exactly what integrative health clients are missing." },
            { iconName: "Globe", title: "Bridging Two Worlds", desc: "You can speak both 'medical' and 'holistic.' This bilingual ability makes you uniquely valuable in the wellness space." }
        ]
    },
    thisIsForYou: { loveIt: ["You've worked in healthcare and see the gaps", "You believe in both medicine AND holistic approaches", "You want to help people who are tired of fragmented care", "You dream of meaningful, flexible work from home", "You believe in treating the whole person, not just symptoms"], notRightNow: ["You're not open to holistic approaches", "You're not willing to invest 60 minutes", "You're looking for a medical degree equivalent", "You don't believe conventional and alternative can co-exist"] },
    lessons: [
        { num: 1, title: "The Integrative Health Model", desc: "Why fragmented healthcare fails and how integrative approaches create better outcomes by treating the whole person" },
        { num: 2, title: "The B.R.I.D.G.E. Method™", desc: "Your signature framework: Baseline, Review, Integrate, Design, Guide & Evaluate — whole-person wellness coordination" },
        { num: 3, title: "Building Your Integrative Practice", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: { items: [{ item: "3-Lesson Integrative Health Mini-Diploma", value: "$97" }, { item: "ASI-Verified Certificate", value: "$47" }, { item: "B.R.I.D.G.E. Method™ Framework", value: "$197" }, { item: "Scope of Practice Module", value: "$47" }, { item: "Private Community Access", value: "$47" }], totalValue: "$435", forLabel: "For Aspiring Integrative Health Coaches Only" },
    faq: {
        sectionTitle: "Questions About Integrative Health Coaching", items: [
            { q: "How is this different from functional medicine?", a: "Functional medicine focuses on root-cause analysis within a clinical model. Integrative health coaching bridges conventional and holistic — helping clients navigate both systems effectively." },
            { q: "Do I need a medical background?", a: "It helps, but it's not required. Many excellent integrative health coaches come from non-medical backgrounds. What matters is your ability to see the whole person." },
            { q: "Can I earn money as an integrative health coach?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. The market is huge — people are frustrated with fragmented care." },
            { q: "What's the catch? Why is it free?", a: "Free certification lets you experience the approach. Continue with full Board Certification if you love it." },
            { q: "Can I combine this with my current healthcare role?", a: "Absolutely! Many nurses, PTs, and allied health professionals add integrative health coaching to enhance their current practice." }
        ]
    },
    certificateTitle: "Integrative Health Foundation",
    finalCta: { headline: "1 Hour From Now, You Could Be", highlightedPart: "Certified in Integrative Health.", subheadline: `${33} coaches enrolled today. 89% finished the same day. <strong>$4K-$8K/month from home.</strong>` },
    tracking: { contentName: "Integrative Health Mini Diploma", contentId: "ih-mini-diploma", pixelId: PIXEL_FM },
};

export const NICHE_LANDING_CONFIGS_2: Record<string, NicheLandingConfig> = {
    "health-coach": healthCoachConfig,
    "holistic-nutrition": holisticNutritionConfig,
    "hormone-health": hormoneHealthConfig,
    "integrative-health": integrativeHealthConfig,
};
