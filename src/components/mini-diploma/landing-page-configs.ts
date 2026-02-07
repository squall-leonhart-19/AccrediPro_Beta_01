import { NicheLandingConfig } from "./landing-page-types";

// Pixel IDs
const PIXEL_FM = "1340178367364771";

// Default zombie avatars
const A1 = "/zombie-avatars/user_47_backyard_bbq_1767801467.webp";
const A2 = "/zombie-avatars/user_52_bedroom_morning_1767801467.webp";
const A3 = "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp";
const A4 = "/zombie-avatars/user_55_cooking_class_1767801442.webp";
const A5 = "/zombie-avatars/user_41_coffee_shop_working_1768611487.webp";
const A6 = "/zombie-avatars/user_38_home_office_1768611487.webp";

// ─── ADHD COACHING ────────────────────────────────────────────
export const adhdCoachingConfig: NicheLandingConfig = {
    nicheId: "adhd-coaching",
    nicheSlug: "adhd-coaching-mini-diploma",
    displayName: "ADHD Coaching",
    courseSlug: "adhd-coaching",
    portalSlug: "adhd-coaching",
    brand: { primary: "#2563eb", primaryDark: "#1e3a8a", primaryLight: "#60a5fa" },
    hero: {
        badge: "1-Hour Mini Diploma for ADHD Coaches",
        headline: "ADHD Coaching",
        subheadline: "Get certified in 1 hour. Help clients with ADHD thrive — not just cope. Start earning $4K-$8K/month as a certified ADHD coach.",
        socialProofCount: "4,247",
        socialProofLabel: "coaches certified",
        enrolledToday: 34,
    },
    sarah: {
        quoteHeadline: "\"I Watched Brilliant People Struggle With Systems|That Were Never Built for Their Brains.\"",
        paragraphs: [
            "I'm Sarah Mitchell. 20+ years in coaching and wellness. Certified ADHD Coach and Integrative Health Practitioner.",
            "The moment that changed everything for me? Watching a <strong>brilliant 35-year-old entrepreneur</strong> break down in tears because she couldn't understand why she could build a six-figure business but couldn't remember to eat lunch. Traditional advice — \"just make a list\" — was useless. She needed strategies built for <strong>how her brain actually works</strong>.",
            "Now I train coaches who understand that ADHD isn't a deficit — it's a different operating system. <strong>2,400+ graduates</strong> are already helping clients unlock their potential."
        ],
        credentials: "20+ Years Experience",
    },
    testimonials: {
        sectionHeadline: "They Stopped Fighting Their Brains.|Now They Coach Others to Thrive.",
        sectionSubheadline: "",
        stories: [
            { name: "Rebecca M.", age: "42", income: "$5,200/mo", before: "Former Special Ed Teacher", story: "I spent 15 years trying to fit ADHD kids into neurotypical boxes. Now I help adults build systems that actually work for their brains. My clients cry happy tears.", avatar: A1 },
            { name: "Amanda K.", age: "38", income: "$6,800/mo", before: "Corporate HR Manager", story: "I have ADHD myself. I spent years masking. Now I help other women stop masking and start thriving. My waitlist is 3 months deep.", avatar: A2 },
            { name: "Christine L.", age: "47", income: "$4,500/mo", before: "Stay-at-Home Mom", story: "My son's ADHD diagnosis sent me down the rabbit hole. I got certified and now I coach parents AND their kids. Best decision I ever made.", avatar: A3 },
            { name: "Laura P.", age: "51", income: "$7,100/mo", before: "School Psychologist", story: "The school system had zero resources for ADHD adults. I left to become a coach and now I actually see real change happen in my clients' lives.", avatar: A4 },
            { name: "Diana R.", age: "44", income: "$3,900/mo", before: "Executive Assistant", story: "I developed my own ADHD coping strategies over 20 years. Now I share them professionally. My clients call me their 'brain translator.'", avatar: A5 },
            { name: "Nicole S.", age: "36", income: "$5,600/mo", before: "Marketing Coordinator", story: "Everyone thought I was lazy. Turns out I was brilliant with ADHD. Now I help women like me turn their 'weaknesses' into superpowers.", avatar: A6 },
        ],
    },
    careerPath: {
        practitionerTitle: "Certified ADHD Coach",
        description: "Help clients with ADHD build systems that work for their unique brains. Work from home, set your own schedule, and make a real difference.",
        benefits: [
            "Work with clients 1-on-1 (virtual or in-person)",
            "Help people with ADHD thrive, not just survive",
            "Be your own boss with flexible hours",
            "Turn your understanding of ADHD into income"
        ],
        incomeRange: "$4K-$8K/mo",
        perSession: "$150",
        clientsPerMonth: "10-15",
    },
    advantages: {
        sectionHeadline: "Your Understanding of ADHD Is|Your Unfair Advantage",
        sectionDescription: "Whether you have ADHD yourself, raised a child with ADHD, or worked with neurodivergent people — you already have the empathy and insight that clients pay for.",
        cards: [
            { iconName: "Brain", title: "Neurodivergent Insight", desc: "You understand that ADHD brains work differently. That understanding is the foundation of effective coaching." },
            { iconName: "Heart", title: "Empathy & Patience", desc: "You know what it's like to struggle with executive function. That lived experience builds instant trust with clients." },
            { iconName: "Sparkles", title: "Strength-Based Thinking", desc: "You see ADHD as a superpower, not a disability. This mindset shift is exactly what your clients need." },
        ],
    },
    thisIsForYou: {
        loveIt: [
            "You have ADHD yourself and want to help others like you",
            "You've raised a child with ADHD and know the challenges firsthand",
            "You're burned out from work that doesn't use your neurodivergent strengths",
            "You want to work from home with clients who truly need you",
            "You believe ADHD is a superpower, not a deficit"
        ],
        notRightNow: [
            "You think ADHD just means 'can't focus'",
            "You're not willing to invest 60 minutes",
            "You're looking for a medical diagnosis certification",
            "You're not open to strength-based approaches"
        ],
    },
    lessons: [
        { num: 1, title: "Understanding the ADHD Brain", desc: "The neuroscience of ADHD, why traditional advice fails, and how to think about attention differently" },
        { num: 2, title: "The F.O.C.U.S. Method™", desc: "Your signature 5-step framework: Filter, Organize, Channel, Unlock & Sustain — coaching that works with ADHD brains" },
        { num: 3, title: "Getting Your First Clients", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: {
        items: [
            { item: "3-Lesson ADHD Coaching Mini-Diploma", value: "$97" },
            { item: "ASI-Verified Certificate of Completion", value: "$47" },
            { item: "ADHD Coaching Framework & Tools", value: "$197" },
            { item: "Scope of Practice Clarity Module", value: "$47" },
            { item: "Private Community Access (1,200+ coaches)", value: "$47" },
        ],
        totalValue: "$435",
        forLabel: "For Aspiring ADHD Coaches Only",
    },
    faq: {
        sectionTitle: "Questions About ADHD Coaching",
        items: [
            { q: "Do I need an ADHD diagnosis to become a coach?", a: "No! While many of our graduates have ADHD themselves, it's not required. What matters is your understanding and empathy. Parents of children with ADHD, teachers, and therapists all make excellent ADHD coaches." },
            { q: "Is this a medical certification?", a: "No. ADHD coaching is a separate discipline from medical treatment. You're coaching clients on strategies, systems, and mindset — not diagnosing or prescribing. This is explicitly within scope for non-medical professionals." },
            { q: "Can I really earn $4-8K/month doing this?", a: "Here's the math: $150/session × 3 sessions/client × 10 clients = $4,500/month. ADHD coaching is in huge demand — there are far more people who need help than there are coaches available." },
            { q: "What if I can't finish in one sitting? (I have ADHD!)", a: "We get it! The lessons are designed in short, focused segments. You can pause and resume anytime within your 48-hour window. Most people finish in about 60 minutes, but there's no pressure." },
            { q: "What's the catch? Why is it free?", a: "Simple: we give you a genuinely valuable free certification so you can experience the training. If you love it (most do), you'll want to continue with our full Board Certification. If not, you still walk away with a real credential." },
        ],
    },
    certificateTitle: "ADHD Coaching Foundation",
    finalCta: {
        headline: "1 Hour From Now, You Could Be",
        highlightedPart: "Certified in ADHD Coaching.",
        subheadline: `${34} coaches enrolled today. 89% finished the same day. Your understanding of ADHD + this certification = <strong>$4K-$8K/month from home.</strong>`,
    },
    tracking: { contentName: "ADHD Coaching Mini Diploma", contentId: "adhd-mini-diploma", pixelId: PIXEL_FM },
};

// ─── CHRISTIAN COACHING ───────────────────────────────────────
export const christianCoachingConfig: NicheLandingConfig = {
    nicheId: "christian-coaching",
    nicheSlug: "christian-coaching-mini-diploma",
    displayName: "Christian Coaching",
    courseSlug: "christian-coaching",
    portalSlug: "christian-coaching",
    brand: { primary: "#1e3a5f", primaryDark: "#0f2440", primaryLight: "#3b6ba5" },
    hero: {
        badge: "1-Hour Mini Diploma for Faith-Based Coaches",
        headline: "Christian Coaching",
        subheadline: "Get certified in 1 hour. Combine your faith with coaching skills to help others transform their lives. Start earning $4K-$8K/month.",
        socialProofCount: "4,247",
        socialProofLabel: "coaches certified",
        enrolledToday: 31,
    },
    sarah: {
        quoteHeadline: "\"I Watched Women of Faith Struggle in Silence|Because No One Spoke Their Language.\"",
        paragraphs: [
            "I'm Sarah Mitchell. 20+ years in coaching and ministry. Certified Christian Life Coach and Integrative Wellness Practitioner.",
            "The woman who changed my path was a <strong>pastor's wife, age 49</strong>, burning out in silence. She'd tried secular coaches — they didn't understand her faith. She'd tried her church — they told her to \"pray more.\" She needed someone who could meet her at the intersection of <strong>faith and practical strategy</strong>.",
            "Now I train coaches who honor both. <strong>2,400+ women</strong> have gone through this program. Many were just like you — deeply faithful women who knew God was calling them to help others."
        ],
        credentials: "20+ Years Experience",
    },
    testimonials: {
        sectionHeadline: "They Answered the Call.|Now They Coach with Purpose.",
        sectionSubheadline: "",
        stories: [
            { name: "Mary Beth K.", age: "48", income: "$5,400/mo", before: "Church Administrator, 15 years", story: "I ran the church office but felt called to more. Now I coach women through life transitions using biblical principles and real strategy. My clients say I'm the coach they've been praying for.", avatar: A1 },
            { name: "Sandra L.", age: "52", income: "$6,200/mo", before: "Women's Ministry Leader", story: "Ministry work was unpaid and exhausting. Now I do similar work but with structure, certification, and income. God opened this door and I walked through it.", avatar: A2 },
            { name: "Katherine R.", age: "45", income: "$4,800/mo", before: "Stay-at-Home Mom of 4", story: "I raised 4 kids and led Bible studies. My friends always came to me for advice. Now I get paid to do what I was already doing — and I'm better at it.", avatar: A3 },
            { name: "Patricia M.", age: "55", income: "$7,000/mo", before: "Former Missionary", story: "After 20 years in the mission field, I came home lost. Christian coaching gave me a new calling that uses everything I learned overseas.", avatar: A4 },
            { name: "Donna T.", age: "41", income: "$3,800/mo", before: "Elementary School Teacher", story: "I wanted work that aligned with my values AND paid my bills. Christian coaching lets me serve God and support my family from home.", avatar: A5 },
            { name: "Janet D.", age: "50", income: "$5,100/mo", before: "Nurse Turned Ministry Worker", story: "I left nursing for ministry but could barely pay rent. Now I combine healing and faith in coaching. My clients find hope again.", avatar: A6 },
        ],
    },
    careerPath: {
        practitionerTitle: "Certified Christian Coach",
        description: "Help others grow in faith and life. Work from home, set your own hours, and turn your calling into a career that sustains you.",
        benefits: [
            "Work with clients 1-on-1 (virtual or in-person)",
            "Help people integrate faith with practical life strategies",
            "Be your own boss with flexible hours",
            "Turn your ministry experience into income"
        ],
        incomeRange: "$4K-$8K/mo",
        perSession: "$150",
        clientsPerMonth: "10-15",
    },
    advantages: {
        sectionHeadline: "Your Faith Background Is|Your Unfair Advantage",
        sectionDescription: "You already understand spiritual depth, active listening, and walking alongside people through their hardest moments. Now add coaching methodology.",
        cards: [
            { iconName: "Heart", title: "Spiritual Depth", desc: "You understand the soul-deep struggles your clients face. Secular coaches can't compete with faith-based empathy." },
            { iconName: "BookOpen", title: "Biblical Foundation", desc: "Years of Bible study gave you wisdom that no coaching program can teach. You bring eternal perspective to everyday problems." },
            { iconName: "Users", title: "Community Connection", desc: "Your church network is a warm market of people who already trust you. Your first clients are closer than you think." },
        ],
    },
    thisIsForYou: {
        loveIt: [
            "You feel called by God to help others but need a framework",
            "You've been the 'counselor friend' in your church for years",
            "You want work that aligns with your faith AND pays your bills",
            "You dream of coaching from home with a flexible schedule",
            "You believe God has more for you than your current path"
        ],
        notRightNow: [
            "You're not open to faith-integrated coaching methods",
            "You're not willing to invest 60 minutes",
            "You're looking for pastoral counseling certification",
            "You don't believe coaching can be a ministry"
        ],
    },
    lessons: [
        { num: 1, title: "What Is Christian Coaching?", desc: "Understanding faith-based coaching, how it differs from counseling and ministry, and the biblical foundation for helping others transform" },
        { num: 2, title: "The G.R.A.C.E. Method™", desc: "Your signature 5-step framework: Ground, Reveal, Align, Commit & Empower — coaching that honors faith" },
        { num: 3, title: "Getting Your First Clients", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: {
        items: [
            { item: "3-Lesson Christian Coaching Mini-Diploma", value: "$97" },
            { item: "ASI-Verified Certificate of Completion", value: "$47" },
            { item: "Faith-Based Coaching Framework & Tools", value: "$197" },
            { item: "Scope of Practice Clarity Module", value: "$47" },
            { item: "Private Community Access (1,200+ coaches)", value: "$47" },
        ],
        totalValue: "$435",
        forLabel: "For Faith-Based Coaches Only",
    },
    faq: {
        sectionTitle: "Questions About Christian Coaching",
        items: [
            { q: "How is this different from pastoral counseling?", a: "Christian coaching focuses on helping clients move forward — setting goals, creating action plans, and building accountability. Pastoral counseling addresses spiritual and emotional wounds. Many pastors refer to coaches for the 'what now' part of growth." },
            { q: "Do I need a theology degree?", a: "No. This is coaching, not ministry leadership. What matters is your faith, your heart for people, and your willingness to learn the coaching framework. Many of our best graduates are laywomen with deep faith." },
            { q: "Will this conflict with my church role?", a: "Most churches love it! You're helping their members grow. Many graduates coach church members, lead faith-based workshops, and partner with their pastors." },
            { q: "Can I really earn money coaching Christians?", a: "Absolutely. $150/session × 3 sessions/client × 10 clients = $4,500/month. There's enormous demand for faith-integrated coaching — most coaching programs are secular." },
            { q: "What's the catch? Why is it free?", a: "Simple: we give you a genuinely valuable free certification so you can experience faith-based coaching. If you love it, you'll want to continue with our full Board Certification. If not, you walk away with a real credential." },
        ],
    },
    certificateTitle: "Christian Coaching Foundation",
    finalCta: {
        headline: "1 Hour From Now, You Could Be",
        highlightedPart: "Certified in Christian Coaching.",
        subheadline: `${31} coaches enrolled today. 89% finished the same day. Your faith + this certification = <strong>$4K-$8K/month from home.</strong>`,
    },
    tracking: { contentName: "Christian Coaching Mini Diploma", contentId: "cc-mini-diploma", pixelId: PIXEL_FM },
};

// ─── ENERGY HEALING ───────────────────────────────────────────
export const energyHealingConfig: NicheLandingConfig = {
    nicheId: "energy-healing",
    nicheSlug: "energy-healing-mini-diploma",
    displayName: "Energy Healing",
    courseSlug: "energy-healing",
    portalSlug: "energy-healing",
    brand: { primary: "#0d9488", primaryDark: "#134e4a", primaryLight: "#2dd4bf" },
    hero: {
        badge: "1-Hour Mini Diploma for Energy Healers",
        headline: "Energy Healing",
        subheadline: "Get certified in 1 hour. Learn to work with the body's energy systems to help clients heal. Start earning $4K-$8K/month.",
        socialProofCount: "4,247",
        socialProofLabel: "healers certified",
        enrolledToday: 29,
    },
    sarah: {
        quoteHeadline: "\"I Felt Energy My Whole Life|But Had No Framework to Help Others.\"",
        paragraphs: [
            "I'm Sarah Mitchell. 20+ years in energy healing and integrative wellness. Certified Energy Medicine Practitioner.",
            "The turning point came when a <strong>45-year-old teacher</strong> came to me after doctors said there was nothing wrong. Her labs were normal. Her scans were clear. But she was exhausted, anxious, and couldn't sleep. <strong>Her energy was completely depleted</strong> — and nobody in conventional medicine could see it.",
            "Now I train healers who can. <strong>2,400+ women</strong> have gone through this program. Many were just like you — sensitive souls who always felt energy but didn't know how to channel it professionally."
        ],
        credentials: "20+ Years Experience",
    },
    testimonials: {
        sectionHeadline: "They Always Felt Energy.|Now They Heal Professionally.",
        sectionSubheadline: "",
        stories: [
            { name: "Crystal M.", age: "43", income: "$5,600/mo", before: "Former Yoga Instructor", story: "I felt energy in every class but had no language for it. This certification gave me the framework to actually help people heal, not just stretch.", avatar: A1 },
            { name: "Tamara K.", age: "49", income: "$6,400/mo", before: "Massage Therapist, 18 years", story: "I always sensed something beyond the physical. When I added energy healing to my practice, my client results — and income — doubled.", avatar: A2 },
            { name: "Veronica L.", age: "39", income: "$4,200/mo", before: "Corporate Marketing Manager", story: "I was the 'woo-woo friend' at the office. Turns out my sensitivity is a superpower. Now I have 8 regular clients and a waitlist.", avatar: A3 },
            { name: "Darlene P.", age: "54", income: "$7,800/mo", before: "Retired Nurse", story: "After 30 years in nursing, I knew the body heals differently when energy flows freely. Now I help clients who've given up on conventional medicine.", avatar: A4 },
            { name: "Angela T.", age: "41", income: "$3,900/mo", before: "Stay-at-Home Mom", story: "My kids always said I had 'magic hands.' Turns out they were right. Now I help other moms heal — and get paid for it.", avatar: A5 },
            { name: "Wendy S.", age: "46", income: "$5,300/mo", before: "Acupuncturist Assistant", story: "I saw what energy work could do in the acupuncture clinic. Now I practice independently with my own growing client base.", avatar: A6 },
        ],
    },
    careerPath: {
        practitionerTitle: "Certified Energy Healing Practitioner",
        description: "Help clients release energetic blocks, restore balance, and heal at the deepest level. Work from home on your own terms.",
        benefits: [
            "Work with clients 1-on-1 (virtual or in-person)",
            "Help people heal energetically — beyond what medicine can reach",
            "Be your own boss with flexible hours",
            "Turn your sensitivity into a thriving practice"
        ],
        incomeRange: "$4K-$8K/mo",
        perSession: "$150",
        clientsPerMonth: "10-15",
    },
    advantages: {
        sectionHeadline: "Your Sensitivity Is|Your Unfair Advantage",
        sectionDescription: "You've always felt things others didn't. You sense energy in rooms, people, and situations. That natural ability is the foundation of professional energy healing.",
        cards: [
            { iconName: "Sparkles", title: "Natural Sensitivity", desc: "You already sense energy shifts that others miss. That's not imagination — it's the core skill of energy healing." },
            { iconName: "Heart", title: "Empathic Connection", desc: "You naturally attune to others' emotional and energetic states. Clients feel safe and understood in your presence." },
            { iconName: "Zap", title: "Intuitive Knowing", desc: "You've always 'just known' things about people. Now you'll have a framework to channel that knowing into healing." },
        ],
    },
    thisIsForYou: {
        loveIt: [
            "You've always been sensitive to energy and want to use it professionally",
            "You're drawn to healing work that goes beyond the physical",
            "You want to help people who've been let down by conventional medicine",
            "You dream of meaningful work from home with flexible hours",
            "You believe there's more to health than what labs can measure"
        ],
        notRightNow: [
            "You're skeptical about energy healing as a modality",
            "You're not willing to invest 60 minutes",
            "You're looking for a medical license",
            "You don't believe in subtle energy systems"
        ],
    },
    lessons: [
        { num: 1, title: "What Is Energy Healing?", desc: "The science of biofield energy, how energy systems affect health, and real case studies proving energy healing works" },
        { num: 2, title: "The A.U.R.A. Method™", desc: "Your signature framework: Assess, Unblock, Restore & Activate — a professional energy healing protocol" },
        { num: 3, title: "Getting Your First Clients", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: {
        items: [
            { item: "3-Lesson Energy Healing Mini-Diploma", value: "$97" },
            { item: "ASI-Verified Certificate of Completion", value: "$47" },
            { item: "Energy Healing Framework & Tools", value: "$197" },
            { item: "Scope of Practice Clarity Module", value: "$47" },
            { item: "Private Community Access (1,200+ healers)", value: "$47" },
        ],
        totalValue: "$435",
        forLabel: "For Aspiring Energy Healers Only",
    },
    faq: {
        sectionTitle: "Questions About Energy Healing",
        items: [
            { q: "Is energy healing scientifically supported?", a: "Yes — growing research in biofield science supports energy healing. The NIH has funded studies on therapeutic touch, and major hospitals like Cleveland Clinic and Johns Hopkins offer integrative energy programs." },
            { q: "Do I need any special abilities?", a: "No special 'gifts' required. Everyone can learn energy healing — just like everyone can learn music. Some have natural talent, but the skills are teachable and learnable." },
            { q: "Can I combine this with another practice?", a: "Absolutely! Many graduates add energy healing to existing massage, yoga, counseling, or nursing practices. It enhances everything you already do." },
            { q: "Can I really earn money as an energy healer?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. The wellness industry is booming and energy healing is one of the fastest-growing modalities." },
            { q: "What's the catch? Why is it free?", a: "We give you a genuinely valuable free certification so you can experience energy healing training. If you love it, you'll want to continue with our full Board Certification." },
        ],
    },
    certificateTitle: "Energy Healing Foundation",
    finalCta: {
        headline: "1 Hour From Now, You Could Be",
        highlightedPart: "Certified in Energy Healing.",
        subheadline: `${29} healers enrolled today. 89% finished the same day. Your sensitivity + this certification = <strong>$4K-$8K/month from home.</strong>`,
    },
    tracking: { contentName: "Energy Healing Mini Diploma", contentId: "eh-mini-diploma", pixelId: PIXEL_FM },
};

// ─── GUT HEALTH ───────────────────────────────────────────────
export const gutHealthConfig: NicheLandingConfig = {
    nicheId: "gut-health",
    nicheSlug: "gut-health-mini-diploma",
    displayName: "Gut Health",
    courseSlug: "gut-health",
    portalSlug: "gut-health",
    brand: { primary: "#16a34a", primaryDark: "#14532d", primaryLight: "#4ade80" },
    hero: {
        badge: "1-Hour Mini Diploma for Gut Health Coaches",
        headline: "Gut Health",
        subheadline: "Get certified in 1 hour. Help clients heal bloating, IBS, and chronic digestive issues. Start earning $4K-$8K/month.",
        socialProofCount: "4,247",
        socialProofLabel: "specialists certified",
        enrolledToday: 38,
    },
    sarah: {
        quoteHeadline: "\"I Watched Doctors Tell Brilliant Women|'Just Eat More Fiber' for 15 Years.\"",
        paragraphs: [
            "I'm Sarah Mitchell. 20+ years in functional medicine and gut health. Certified Gut Health Specialist and Functional Nutrition Expert.",
            "The client who broke me? A <strong>48-year-old teacher</strong> with IBS so severe she'd lost 3 jobs. Doctors said \"manage stress\" and \"eat more fiber.\" She'd tried everything they suggested for <strong>15 years</strong>. I helped her resolve her symptoms in 12 weeks using the R.E.S.E.T. Method™.",
            "Now I train coaches who actually address the root cause. <strong>2,400+ women</strong> have gone through this program. 70% of your immune system lives in your gut — and most people's guts are a mess."
        ],
        credentials: "20+ Years Experience",
    },
    testimonials: {
        sectionHeadline: "They Healed Their Own Guts.|Now They Help Others Heal.",
        sectionSubheadline: "",
        stories: [
            { name: "Diana M.", age: "48", income: "$4,600/mo", before: "High School Teacher", story: "I had IBS for 15 years. Doctors said 'eat more fiber.' I found the R.E.S.E.T. Method and resolved my own symptoms in 12 weeks. Now I help others do the same.", avatar: A1 },
            { name: "Gabrielle K.", age: "43", income: "$6,200/mo", before: "Former Dietitian", story: "I was taught calories in, calories out. When I learned about the microbiome, everything changed. My gut health clients get results I never saw in my dietetics practice.", avatar: A2 },
            { name: "Stephanie L.", age: "39", income: "$5,100/mo", before: "Fitness Trainer", story: "All my fit clients still had bloating, brain fog, and fatigue. I realized it was all gut-related. Adding gut health coaching tripled my income.", avatar: A3 },
            { name: "Margaret P.", age: "55", income: "$7,400/mo", before: "Retired Pharmacist", story: "I spent 25 years dispensing pills that treated symptoms, never causes. Gut health coaching lets me help people actually heal.", avatar: A4 },
            { name: "Jennifer T.", age: "41", income: "$4,100/mo", before: "Mom with Autoimmune Issues", story: "My Hashimoto's diagnosis sent me down the gut health rabbit hole. I healed myself and now I help other women with autoimmune conditions.", avatar: A5 },
            { name: "Rachel S.", age: "36", income: "$5,800/mo", before: "Nutritional Supplement Rep", story: "I sold probiotics for 8 years but had no real framework. This certification gave me the protocol to create actual gut healing programs for clients.", avatar: A6 },
        ],
    },
    careerPath: {
        practitionerTitle: "Certified Gut Health Specialist",
        description: "Help clients heal their guts and transform their entire health. Work from home, set your own hours, and address the root cause.",
        benefits: [
            "Work with clients 1-on-1 (virtual or in-person)",
            "Help people actually heal — not just manage symptoms",
            "Be your own boss with flexible hours",
            "Address the root cause of chronic illness"
        ],
        incomeRange: "$4K-$8K/mo",
        perSession: "$150",
        clientsPerMonth: "10-15",
    },
    advantages: {
        sectionHeadline: "Your Health Journey Is|Your Unfair Advantage",
        sectionDescription: "Whether you healed your own gut issues or you've seen others suffer — you understand the pain points that clients are desperate to solve.",
        cards: [
            { iconName: "Heart", title: "Personal Experience", desc: "If you've dealt with bloating, IBS, or food sensitivities yourself, you understand your clients on a level no textbook can teach." },
            { iconName: "BookOpen", title: "Research Curiosity", desc: "You've already gone down the microbiome rabbit hole. That research drive is exactly what makes great gut health coaches." },
            { iconName: "Users", title: "Everyone Has a Gut", desc: "This isn't a niche — it's universal. Bloating, fatigue, and digestive issues affect millions. Your clients are everywhere." },
        ],
    },
    thisIsForYou: {
        loveIt: [
            "You've healed your own gut issues and want to help others",
            "You're fascinated by the microbiome and functional nutrition",
            "You're tired of watching people suffer with digestive problems",
            "You want meaningful work from home with flexible hours",
            "You believe food is medicine and the gut is the foundation of health"
        ],
        notRightNow: [
            "You think digestive issues are 'just stress'",
            "You're not willing to invest 60 minutes",
            "You're looking for a medical gastroenterology credential",
            "You're not interested in nutrition-based approaches"
        ],
    },
    lessons: [
        { num: 1, title: "The Gut-Everything Connection", desc: "Why 70% of your immune system lives in your gut, the gut-brain axis, and why conventional medicine misses gut issues" },
        { num: 2, title: "The R.E.S.E.T. Method™", desc: "Your signature 5-step protocol: Remove, Evaluate, Seed, Enrich & Track — a clinical-grade gut healing framework" },
        { num: 3, title: "Building Your Gut Health Practice", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
    ],
    valueStack: {
        items: [
            { item: "3-Lesson Gut Health Mini-Diploma", value: "$97" },
            { item: "ASI-Verified Certificate of Completion", value: "$47" },
            { item: "R.E.S.E.T. Method™ Framework & Tools", value: "$197" },
            { item: "Scope of Practice Clarity Module", value: "$47" },
            { item: "Private Community Access (1,200+ specialists)", value: "$47" },
        ],
        totalValue: "$435",
        forLabel: "For Aspiring Gut Health Specialists Only",
    },
    faq: {
        sectionTitle: "Questions About Gut Health Coaching",
        items: [
            { q: "Do I need a medical degree to be a gut health coach?", a: "No. Gut health coaching focuses on nutrition, lifestyle, and functional approaches — not medical diagnosis. Many top gut health coaches come from non-medical backgrounds." },
            { q: "Is gut health coaching evidence-based?", a: "Absolutely. The R.E.S.E.T. Method™ is built on published research in microbiome science, nutritional biochemistry, and functional medicine." },
            { q: "Can I combine this with other certifications?", a: "Yes! Many graduates combine gut health with functional medicine, holistic nutrition, or health coaching certifications." },
            { q: "Can I really earn money as a gut health coach?", a: "$150/session × 3 sessions/client × 10 clients = $4,500/month. Gut issues are epidemic — IBS alone affects 45 million Americans. The demand is enormous." },
            { q: "What's the catch? Why is it free?", a: "We give you a genuinely valuable free certification so you can experience the training. If you love it, continue with our full Board Certification. If not, you walk away with a real credential." },
        ],
    },
    certificateTitle: "Gut Health Foundation",
    finalCta: {
        headline: "1 Hour From Now, You Could Be",
        highlightedPart: "Certified in Gut Health.",
        subheadline: `${38} coaches enrolled today. 89% finished the same day. Your passion + this certification = <strong>$4K-$8K/month from home.</strong>`,
    },
    tracking: { contentName: "Gut Health Mini Diploma", contentId: "gh-mini-diploma", pixelId: PIXEL_FM },
};

// Export registry for easy lookup
export const NICHE_LANDING_CONFIGS: Record<string, NicheLandingConfig> = {
    "adhd-coaching": adhdCoachingConfig,
    "christian-coaching": christianCoachingConfig,
    "energy-healing": energyHealingConfig,
    "gut-health": gutHealthConfig,
};
