// Dynamic Copy Variants for Quiz-Optimized Funnel
// All copy is keyed by quiz answer values and served to PersonalizedSalesPage

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export type Persona =
  | "healthcare-pro"
  | "health-coach"
  | "corporate"
  | "stay-at-home-mom"
  | "other-passionate";

export type Intent = "business" | "personal" | "both";

export type Specialization =
  | "gut-health"
  | "hormone-health"
  | "burnout"
  | "autoimmune"
  | "metabolic"
  | "explore";

export type Readiness =
  | "nothing"
  | "name-social"
  | "have-clients"
  | "have-everything";

export type PainPoint =
  | "time-for-money"
  | "stuck"
  | "meant-for-more"
  | "exhausted"
  | "no-credential";

export type DreamLife =
  | "time-freedom"
  | "financial-freedom"
  | "purpose"
  | "complete-transformation"
  | "independence"
  | "all-above";

export type Timeline =
  | "immediately"
  | "30-days"
  | "1-3-months"
  | "exploring";

export type IncomeGoal = "3k-5k" | "5k-10k" | "10k-15k" | "15k-plus";

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface PainMirrorCopy {
  headline: string;
  subheadline: string;
  expansions: Record<Persona, string>;
}

export interface FuturePacingCopy {
  headline: string;
  body: string;
  personalVariant?: string;
}

export interface HeroSubhead {
  business: string;
  personal: string;
  both: string;
}

export interface ValueStackItem {
  label: string;
  value: string;
  description: string;
  icon?: string;
}

export interface IncomeROICopy {
  headline: string;
  roiMath: string;
  multiplier: string;
  timeframe: string;
  clientsNeeded: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CTACopy {
  headline: string;
  subheadline: string;
  buttonText: string;
  urgencyText: string;
}

export interface SpecializationLabel {
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
}

// ---------------------------------------------------------------------------
// 1. PAIN MIRROR COPY (keyed by painPoint)
// ---------------------------------------------------------------------------

export const PAIN_MIRROR_COPY: Record<PainPoint, PainMirrorCopy> = {
  "time-for-money": {
    headline:
      "You're working harder than ever — and it's still not enough.",
    subheadline:
      "Trading time for money is a trap. There's a ceiling on your hours, which means there's a ceiling on your income, your impact, and your life.",
    expansions: {
      "healthcare-pro":
        "You didn't spend years in clinical training to be stuck on a treadmill of 12-hour shifts, mandatory overtime, and a salary that barely keeps up with inflation. Every extra shift you pick up is another evening away from your family, another weekend lost. You deserve a practice model where your expertise compounds — not one where your body breaks down.",
      "health-coach":
        "You're booking back-to-back sessions, creating content, answering DMs at 11pm, and still barely breaking even. The coaching model you were sold — 'just get more clients' — doesn't scale. You need a credential that lets you charge what you're worth and a business model that doesn't require you to be 'on' 24/7.",
      corporate:
        "The golden handcuffs are real. Great salary, great benefits, great misery. You've optimized someone else's business for years. You know how to build systems, manage projects, hit targets. But every Sunday night, that knot in your stomach tells you this isn't what you were meant to do with your one life.",
      "stay-at-home-mom":
        "You gave up your career to raise your kids — and you'd do it again. But somewhere between the school runs and the meal prep, you lost yourself. You want to contribute financially without sacrificing the flexibility that lets you be present for your family. You don't need another MLM. You need a real credential.",
      "other-passionate":
        "You've been helping people informally for years — friends, family, coworkers all come to you for health advice. But without a credential, you can't charge for it, you can't scale it, and you can't turn your passion into a profession. You're stuck trading your time for someone else's priorities when you could be building something meaningful.",
    },
  },
  stuck: {
    headline:
      "You can see where you want to be. You can feel it. But something keeps holding you back.",
    subheadline:
      "It's not motivation you lack. It's the bridge between where you are and where you know you belong.",
    expansions: {
      "healthcare-pro":
        "You've thought about functional medicine for months, maybe years. You've read the books, listened to the podcasts, even started recommending supplements to patients off the record. But without the formal training and credential, you can't make the leap. You're stuck between knowing this is your path and not having the structure to walk it.",
      "health-coach":
        "You've invested in courses, masterminds, maybe even another certification. But none of them gave you the clinical depth or the business blueprint to actually break through. You're stuck at the same income level, serving the same number of clients, wondering what's missing. The answer isn't more motivation — it's the right credential and the right system.",
      corporate:
        "You've been Googling 'career change at 40' for longer than you'd admit. You've saved blog posts, bookmarked courses, maybe even told your partner 'I'm thinking about something.' But thinking isn't doing. You're stuck in analysis paralysis because the gap between corporate and practitioner feels impossibly wide. It's not. It's 12 weeks.",
      "stay-at-home-mom":
        "You've wanted to start something of your own for years, but the timing never felt right. First it was the baby, then the toddler years, then school transitions. There's always a reason to wait. But your kids are growing up, and with them, the window where 'stay-at-home mom' is enough for you. You're ready. You just need the path.",
      "other-passionate":
        "You know more about functional health than most practitioners you've met. You've done the research, transformed your own health, helped friends and family. But knowledge without a credential is just a hobby. You're stuck between 'I should do something with this' and 'Who am I to call myself a practitioner?' The answer: someone who earns the credential.",
    },
  },
  "meant-for-more": {
    headline:
      "Deep down, you know you're capable of more. That feeling isn't going away.",
    subheadline:
      "That whisper telling you there's something bigger — it's not restlessness. It's your potential demanding to be used.",
    expansions: {
      "healthcare-pro":
        "You became a healthcare professional to make a difference. And you do — but within a system that often treats symptoms, not people. You see patients cycle through the same prescriptions, the same diagnoses, the same frustration. You know there's a better way. Functional medicine is that way. And your clinical background means you can master it faster than almost anyone.",
      "health-coach":
        "Coaching changed your life. Maybe even saved it. But you've hit the ceiling of what a coaching credential alone can do. You want to go deeper — to understand the biochemistry, to read labs, to create real clinical protocols. You're meant to be more than a cheerleader for wellness. You're meant to be a practitioner.",
      corporate:
        "You've climbed the ladder. Maybe you've even reached the top. And the view from up here is... underwhelming. You've proven you can succeed in business. Now you want to prove you can succeed at something that matters. Something that changes lives, including your own. That feeling of 'more' isn't a crisis — it's a calling.",
      "stay-at-home-mom":
        "You love your kids fiercely. And you love the life you've built for them. But there's a version of you that existed before motherhood — ambitious, driven, hungry to make an impact. She didn't disappear. She's just been waiting for the right opportunity. One that doesn't ask you to choose between your family and yourself.",
      "other-passionate":
        "Everyone around you sees it. 'You should really do something with this.' Your partner, your friends, even strangers at the gym who overhear your supplement recommendations. You have a gift for making complex health information accessible and actionable. The only thing between you and a career you love is the credential to back up what you already know.",
    },
  },
  exhausted: {
    headline:
      "You're running on empty. Your work is draining you, not fueling you.",
    subheadline:
      "Burnout isn't a badge of honor. It's a signal that something fundamental needs to change.",
    expansions: {
      "healthcare-pro":
        "The healthcare system is burning through its best people. You signed up to heal, not to document, comply, and survive. Compassion fatigue is real. Moral injury is real. And no amount of 'self-care' fixes a broken system. What fixes it is stepping out of the system entirely and building a practice where you actually have time to sit with patients, listen, and heal.",
      "health-coach":
        "You started coaching because you were passionate about helping people. Now you're on the verge of hating it. The constant content creation, the client chasing, the imposter syndrome. You're exhausted not because the work is hard, but because you're working without the foundation — the credential, the systems, the pricing power — that makes it sustainable.",
      corporate:
        "Sunday scaries. Monday dread. The constant pressure to perform in a role that doesn't feed your soul. You're exhausted because you're spending 100% of your energy on something that gives you back maybe 10% in fulfillment. Your body is keeping score — the headaches, the insomnia, the weight gain. Burnout is your body's way of saying: 'Not this. Something else.'",
      "stay-at-home-mom":
        "Nobody tells you how exhausting it is to lose your professional identity. The mental load of running a household is enormous, and it's invisible. You're depleted not because motherhood isn't meaningful, but because you need something that's yours. Something that refills your cup. Something that makes you feel like a whole person again, not just someone's mom.",
      "other-passionate":
        "You're exhausted because you're living someone else's version of success. The job pays the bills but drains your spirit. Every day you spend doing work that doesn't align with who you are is a day you're borrowing energy from your future self. The exhaustion isn't physical — it's existential. And it only gets better when you align your work with your purpose.",
    },
  },
  "no-credential": {
    headline:
      "You already know how to help people. You just don't have the paper that proves it.",
    subheadline:
      "Knowledge without credentials is a hobby. Knowledge with credentials is a career.",
    expansions: {
      "healthcare-pro":
        "You've been practicing functional approaches informally for years — recommending supplements, suggesting dietary changes, interpreting labs through a functional lens. But without the credential, you're limited. You can't bill for it, you can't market it, and you're always one patient complaint away from trouble. The certification makes your expertise official, protected, and profitable.",
      "health-coach":
        "Your clients get results. You know your stuff. But when a potential client asks 'What are your qualifications?' you cringe. A health coaching certificate isn't enough anymore. The market has matured, and clients want Board-Certified practitioners. The credential gap is the only thing between you and the premium rates your results deserve.",
      corporate:
        "You've spent years building skills that translate perfectly to a health practice — project management, client communication, systems thinking. What you lack isn't ability. It's the clinical knowledge and the credential. AccrediPro bridges that gap in 12 weeks, not 4 years. You don't need medical school. You need the right certification.",
      "stay-at-home-mom":
        "You've been the family's unofficial health practitioner for years. You've researched every rash, optimized every meal plan, questioned every pediatrician's recommendation. You have the instincts and the knowledge. Now you need the credential that turns 'mom who knows a lot about health' into 'Board-Certified Functional Medicine Practitioner.'",
      "other-passionate":
        "You've probably forgotten more about functional health than most doctors ever learned. You've transformed your own health, helped friends heal, built a library of knowledge through years of passionate self-education. The missing piece isn't knowledge — it's the credential that gives you permission to charge for what you already know, and the framework to do it professionally.",
    },
  },
};

// ---------------------------------------------------------------------------
// 2. FUTURE PACING COPY (keyed by dreamLife)
// ---------------------------------------------------------------------------

export const FUTURE_PACING_COPY: Record<DreamLife, FuturePacingCopy> = {
  "time-freedom": {
    headline:
      "12 months from now: You wake up without an alarm.",
    body:
      "Your first client isn't until 10am — by choice. You drop the kids at school, go for a walk, make a real breakfast. Your afternoon is blocked for two virtual consultations from your home office. By 3pm, you're done. You pick up the kids. You're present. You're not checking emails on your phone at dinner. You're not dreading tomorrow. Because tomorrow looks exactly like today — and today is exactly the life you designed.",
    personalVariant:
      "12 months from now, you wake up feeling rested for the first time in years. Your morning routine isn't rushed — it's intentional. You check in with your body, follow the protocols you've mastered, and feel the quiet confidence of someone who truly understands their own health. You're not Googling symptoms at 2am anymore. You're not at the mercy of doctors who dismiss your concerns. You have the knowledge to advocate for yourself, and the results to prove it works.",
  },
  "financial-freedom": {
    headline:
      "12 months from now: Your student loans are shrinking faster than ever.",
    body:
      "You check your business account on a Tuesday morning: $8,400 deposited this month, and you still have 6 client sessions left. Your overhead is minimal — no office rent, no staff, no inventory. Just your expertise, your laptop, and a calendar that you control. You pay extra on your loans. You fund your Roth IRA. You book the vacation without checking your balance first. Financial freedom isn't millions — it's choices. And you finally have them.",
    personalVariant:
      "12 months from now, you've stopped spending thousands on specialists who run the same tests and prescribe the same pills. You understand your own biochemistry. You know which supplements actually work for YOUR body, not some generic recommendation. The money you've saved on medical bills alone has paid for the certification three times over. But the real ROI? You can't put a price on waking up without pain.",
  },
  purpose: {
    headline:
      "12 months from now: A client messages you — 'You changed my life.'",
    body:
      "You read it twice. Not because you're surprised — you've gotten messages like this before. But because it never gets old. This particular client came to you exhausted, frustrated, failed by conventional medicine. Three months of your protocols, your guidance, your support, and she's a different person. Energy restored. Labs normalized. Hope renewed. This is why you did it. Not the money (though that's nice). Not the freedom (though that's life-changing). This. This moment. This is what you were made for.",
    personalVariant:
      "12 months from now, you sit across from your doctor and for the first time, you're not anxious. You understand every number on your lab panel. You know what questions to ask. And when your doctor raises an eyebrow at your improvement and asks, 'What have you been doing?' — you smile. Because you didn't just learn functional medicine. You lived it. And the transformation in your own body is the most powerful testimony you'll ever have.",
  },
  "complete-transformation": {
    headline:
      "12 months from now: Financial freedom. Time freedom. Purpose. You didn't choose one — you chose all three.",
    body:
      "Your morning starts slow and intentional. Your calendar has white space on purpose. Your bank account grows every month without you working harder. And the work you do? It matters. Deeply. You went from overwhelmed to overbooked (on your terms), from uncertain to undeniable, from dreaming about change to being the proof that change is possible. You didn't just change your career. You changed your entire life. And it started with a single decision — the one you're about to make right now.",
    personalVariant:
      "12 months from now, every area of your life has shifted. Your health is transformed — energy, clarity, strength you haven't felt in years. Your confidence is unshakeable because it's built on real knowledge, not wishful thinking. Your relationships have deepened because you finally have the bandwidth to be fully present. And that quiet voice that used to whisper 'Is this all there is?' has gone silent. Because this — this life — is more than you dared to imagine.",
  },
  independence: {
    headline:
      "12 months from now: You own every minute of your day.",
    body:
      "No boss scheduling your time. No commute eating your mornings. No office politics draining your energy. You decide when you work, where you work, who you work with, and how much you charge. You take on clients who inspire you and refer the rest. You block Fridays for personal projects. You take a two-week trip in October because you can. Independence isn't about isolation — it's about agency. And for the first time in your career, every decision is yours.",
    personalVariant:
      "12 months from now, you're no longer dependent on a healthcare system that treats you like a number. You don't wait 6 weeks for an appointment to get 8 minutes of face time. You understand your own body better than any generalist ever could. When something feels off, you don't spiral into WebMD anxiety — you run your own functional assessment, identify the root cause, and address it. That's not just health. That's health independence.",
  },
  "all-above": {
    headline:
      "12 months from now: Financial freedom. Time freedom. Purpose. You didn't choose one — you chose all three.",
    body:
      "Your morning starts slow and intentional. Your calendar has white space on purpose. Your bank account grows every month without you working harder. And the work you do? It matters. Deeply. You went from overwhelmed to overbooked (on your terms), from uncertain to undeniable, from dreaming about change to being the proof that change is possible. You didn't just change your career. You changed your entire life. And it started with a single decision — the one you're about to make right now.",
    personalVariant:
      "12 months from now, every area of your life has shifted. Your health is transformed — energy, clarity, strength you haven't felt in years. Your confidence is unshakeable because it's built on real knowledge, not wishful thinking. Your relationships have deepened because you finally have the bandwidth to be fully present. And that quiet voice that used to whisper 'Is this all there is?' has gone silent. Because this — this life — is more than you dared to imagine.",
  },
};

// ---------------------------------------------------------------------------
// 3. HERO SUBHEADS (keyed by persona)
// ---------------------------------------------------------------------------

export const HERO_SUBHEADS: Record<Persona, HeroSubhead> = {
  "healthcare-pro": {
    business:
      "Your clinical background gives you a massive head start. 94% of healthcare professionals complete the certification in 8 weeks or less — and their patients notice the difference immediately.",
    personal:
      "Deep clinical knowledge meets functional medicine mastery. Understand your own health at a level most practitioners never reach — and protect your family's wellbeing with evidence-based protocols.",
    both:
      "Transform your clinical practice AND your personal health. Healthcare professionals who add FM report higher patient satisfaction, doubled revenue, and dramatic improvements in their own wellbeing.",
  },
  "health-coach": {
    business:
      "Go from health coach to Board-Certified FM Practitioner. 3x your rates, eliminate imposter syndrome, and finally have the clinical credential that matches your expertise.",
    personal:
      "You've helped others transform their health — now it's your turn. Master the functional medicine protocols that go deeper than any coaching certification ever could.",
    both:
      "Upgrade your coaching practice with Board-Certified clinical depth while mastering protocols that transform your own health. The best practitioners are the ones who've walked the path themselves.",
  },
  corporate: {
    business:
      "No medical degree needed. 31% of our highest earners changed careers to get here — and their corporate skills in systems, management, and communication give them an unexpected edge.",
    personal:
      "Corporate burnout taught you what not to do. Functional medicine teaches you what to do. Reclaim your health with the same strategic, evidence-based approach you bring to everything else.",
    both:
      "Your corporate skills are the secret weapon nobody talks about. Build a thriving FM practice using the project management, client relations, and systems thinking you've already mastered — while healing your own burnout in the process.",
  },
  "stay-at-home-mom": {
    business:
      "Built to fit around your family. Study 20 minutes a day, certified in 12 weeks, first clients before the school year ends. No childcare needed. No commute required.",
    personal:
      "You've spent years optimizing your family's health. Now get the knowledge to do it with clinical precision — and finally understand what's really going on with your own body, too.",
    both:
      "Build a flexible income around your family's schedule while deepening your health knowledge for yourself and your kids. 83% of mom graduates work exclusively during school hours.",
  },
  "other-passionate": {
    business:
      "Turn your health passion into a Board-Certified profession. No medical background required — just the drive to help people and 20 minutes a day for 12 weeks.",
    personal:
      "You've been your own best health advocate for years. Now get the clinical framework to go even deeper — understand the root causes, read the labs, and optimize with precision.",
    both:
      "Your passion for health is obvious to everyone who knows you. Now make it official. Get the credential that turns self-taught expertise into a recognized profession — while taking your own health to the next level.",
  },
};

// ---------------------------------------------------------------------------
// 4. VALUE STACK ITEMS (by readiness and intent)
// ---------------------------------------------------------------------------

export const VALUE_STACK_HERO: Record<Readiness, ValueStackItem[]> = {
  nothing: [
    {
      label: "Complete Business-in-a-Box",
      value: "$4,997",
      description:
        "Done-for-you website, intake forms, client protocols, billing templates, and marketing materials. Everything you need to launch Day 1.",
    },
    {
      label: "1:1 Practice Launch Mentorship",
      value: "$2,500",
      description:
        "8 weeks of personal guidance from a practicing FM professional. Your roadmap from certified to booked.",
    },
    {
      label: "Client Acquisition Playbook",
      value: "$1,997",
      description:
        "Step-by-step system for getting your first 10 clients in 90 days. Includes scripts, templates, and outreach sequences.",
    },
  ],
  "name-social": [
    {
      label: "Practice Growth Accelerator",
      value: "$3,500",
      description:
        "Advanced marketing templates, referral systems, and automation workflows for practitioners who already have a brand foundation.",
    },
    {
      label: "1:1 Revenue Scaling Mentorship",
      value: "$2,500",
      description:
        "8 weeks of personal guidance focused on client acquisition, premium pricing, and building recurring revenue.",
    },
    {
      label: "Professional Website Upgrade Kit",
      value: "$1,500",
      description:
        "Conversion-optimized templates, SEO setup, and booking system integration for your existing web presence.",
    },
  ],
  "have-clients": [
    {
      label: "Revenue Multiplier System",
      value: "$3,500",
      description:
        "Group program templates, premium package frameworks, and retention systems to 3x your revenue with your existing client base.",
    },
    {
      label: "Advanced Clinical Protocols",
      value: "$2,000",
      description:
        "Specialty-specific protocols for complex cases. Treat conditions your competitors can't — and charge accordingly.",
    },
    {
      label: "1:1 Scale & Delegate Mentorship",
      value: "$2,500",
      description:
        "Personal guidance on hiring, delegating, and building a practice that runs without you doing everything.",
    },
  ],
  "have-everything": [
    {
      label: "Board Certification Credential",
      value: "$5,000",
      description:
        "The credential that separates you from every uncertified practitioner in your market. Recognized. Verified. Permanent.",
    },
    {
      label: "Advanced Specialty Mastery",
      value: "$2,500",
      description:
        "Go deep in your chosen specialization with advanced case studies, protocols, and clinical frameworks.",
    },
    {
      label: "Elite Practitioner Network Access",
      value: "$1,500",
      description:
        "Join a vetted community of top-performing FM practitioners for referrals, collaboration, and advanced training.",
    },
  ],
};

export const VALUE_STACK_BUSINESS: ValueStackItem[] = [
  {
    label: "FM Certification Program",
    value: "$3,997",
    description:
      "Complete Board-Certified Functional Medicine curriculum. 12 modules, clinical case studies, supervised assessments.",
  },
  {
    label: "Legal & Compliance Toolkit",
    value: "$1,500",
    description:
      "Scope-of-practice guidelines, liability protection resources, informed consent templates, HIPAA compliance checklists.",
  },
  {
    label: "Insurance & Billing Setup Guide",
    value: "$997",
    description:
      "Step-by-step insurance credentialing, superbill templates, and billing code reference for FM services.",
  },
  {
    label: "Client Management System",
    value: "$1,200",
    description:
      "HIPAA-compliant client portal, progress tracking templates, appointment scheduling, and follow-up automation.",
  },
  {
    label: "Marketing Content Library",
    value: "$800",
    description:
      "90 days of social media templates, email sequences, blog outlines, and lead magnet frameworks for FM practitioners.",
  },
  {
    label: "Pricing & Packaging Workshop",
    value: "$500",
    description:
      "Set your rates with confidence. Package structures, value-based pricing frameworks, and objection-handling scripts.",
  },
];

export const VALUE_STACK_PERSONAL: ValueStackItem[] = [
  {
    label: "FM Certification Program",
    value: "$3,997",
    description:
      "Complete Board-Certified Functional Medicine curriculum. 12 modules of deep clinical knowledge for personal mastery.",
  },
  {
    label: "Personal Health Assessment Framework",
    value: "$1,200",
    description:
      "Learn to read your own comprehensive labs, identify root causes, and create personalized protocols for your body.",
  },
  {
    label: "Family Wellness Protocol Builder",
    value: "$800",
    description:
      "Create evidence-based health protocols for your entire family — from children's nutrition to aging parent support.",
  },
  {
    label: "Supplement & Nutrition Mastery",
    value: "$600",
    description:
      "Cut through the noise. Learn which supplements actually work, proper dosing, interactions, and how to source quality products.",
  },
  {
    label: "Private Community Access",
    value: "$500",
    description:
      "Join a community of health-conscious individuals sharing protocols, lab results insights, and practitioner recommendations.",
  },
];

// ---------------------------------------------------------------------------
// 5. INCOME ROI COPY (by income goal)
// ---------------------------------------------------------------------------

export const INCOME_ROI_COPY: Record<IncomeGoal, IncomeROICopy> = {
  "3k-5k": {
    headline: "Your Path to $3,000-$5,000/Month",
    roiMath:
      "At $200/session, you need just 4-6 clients per week. That's roughly one client per working day. Most graduates reach this level within 60-90 days of certification.",
    multiplier: "10-17x return on your certification investment in Year 1",
    timeframe: "60-90 days post-certification",
    clientsNeeded: "4-6 clients/week at $200/session",
  },
  "5k-10k": {
    headline: "Your Path to $5,000-$10,000/Month",
    roiMath:
      "At $250/session with 2-3 monthly retainer clients ($400/mo each), you need 8-12 active clients. The retainer model creates predictable recurring revenue that grows every month.",
    multiplier: "17-34x return on your certification investment in Year 1",
    timeframe: "3-5 months post-certification",
    clientsNeeded: "8-12 active clients (mix of sessions + retainers)",
  },
  "10k-15k": {
    headline: "Your Path to $10,000-$15,000/Month",
    roiMath:
      "At $300/session with group programs ($997/8-week program, 10 participants) and VIP retainer clients ($600/mo), this is the income level where your practice becomes a real business. 78% of our $10K+ earners added group programs within their first 6 months.",
    multiplier: "34-51x return on your certification investment in Year 1",
    timeframe: "5-8 months post-certification",
    clientsNeeded: "12-15 active clients + 1 group program/quarter",
  },
  "15k-plus": {
    headline: "Your Path to $15,000+ Per Month",
    roiMath:
      "At $400/session VIP pricing, premium group programs ($1,997 each), corporate wellness contracts, and a referral network of 3-5 allied practitioners sending you clients — this is the practice that replaces (and exceeds) any corporate salary. 23% of our graduates reach this level within 12 months.",
    multiplier: "51x+ return on your certification investment in Year 1",
    timeframe: "8-12 months post-certification",
    clientsNeeded: "15-20 clients + group programs + corporate contracts",
  },
};

// ---------------------------------------------------------------------------
// 6. FAQ ITEMS (persona-specific + universal)
// ---------------------------------------------------------------------------

export const PERSONA_FAQ: Record<Persona, FAQItem[]> = {
  "healthcare-pro": [
    {
      question: "Will this conflict with my current clinical license?",
      answer:
        "No. The FM Certification is an additional credential that complements your existing license. Many RNs, NPs, PAs, MDs, and allied health professionals add FM to expand their scope. We provide scope-of-practice guidelines specific to your license type so you always operate within legal boundaries.",
    },
    {
      question: "I already have clinical training. Will this feel redundant?",
      answer:
        "Not at all. Your clinical background gives you a head start on anatomy and physiology, but FM approaches health from a fundamentally different framework. You'll learn functional lab interpretation, root-cause protocols, and a systems-biology approach that complements (but doesn't duplicate) your conventional training. Most healthcare professionals say this is the missing piece they've been looking for.",
    },
    {
      question: "Can I integrate FM into my current practice or do I need to start a new one?",
      answer:
        "Both options work. Many healthcare professionals add FM services to their existing practice — it often doubles revenue by adding a cash-pay tier alongside insurance-based services. Others use the certification as a bridge to an independent practice. We provide business models for both paths.",
    },
  ],
  "health-coach": [
    {
      question: "How is this different from my existing coaching certification?",
      answer:
        "Coaching certifications teach you to guide behavior change. The FM Certification teaches you clinical methodology — lab interpretation, biochemistry, pathophysiology, and evidence-based protocols. You'll go from 'accountability partner' to 'clinical practitioner.' The credential difference alone typically allows a 2-3x increase in session rates.",
    },
    {
      question: "Will I be able to order labs and create clinical protocols?",
      answer:
        "Yes. As a Board-Certified FM Practitioner, you can order functional lab panels through our partner laboratories and create evidence-based clinical protocols. The certification includes training on over 30 functional lab markers and protocol creation for the most common conditions you'll encounter.",
    },
    {
      question: "I'm worried I don't have enough science background.",
      answer:
        "Our curriculum is designed to meet you where you are. The first 3 modules build a strong biochemistry foundation before moving to clinical applications. 89% of coaches who enroll complete the certification on schedule. Your coaching skills in communication, empathy, and behavior change are actually a significant advantage most clinicians lack.",
    },
  ],
  corporate: [
    {
      question: "I have zero medical background. Can I really do this?",
      answer:
        "Absolutely. 31% of our graduates come from non-medical backgrounds — corporate, education, finance, tech. The curriculum assumes no prior medical knowledge and builds from foundations up. More importantly, your corporate skills (project management, client communication, systems thinking, marketing) give you a significant business advantage over clinicians who never learned those skills.",
    },
    {
      question: "How long before I can replace my corporate income?",
      answer:
        "It depends on your current salary and effort level, but here's the data: the median time to first paying client is 47 days post-certification. The median time to matching a $75K corporate salary is 6-8 months. Some graduates achieve this faster by leveraging their corporate network for client referrals and corporate wellness contracts.",
    },
    {
      question: "Will people take me seriously without a medical degree?",
      answer:
        "The Board-Certified FM credential stands on its own. Your clients care about results, not your undergraduate major. In fact, career changers often build stronger client relationships because they understand the real-world challenges of stress, burnout, and work-life balance that drive many health issues. Your corporate experience IS relevant clinical context.",
    },
  ],
  "stay-at-home-mom": [
    {
      question: "Can I really do this in 20 minutes a day?",
      answer:
        "Yes. The curriculum is specifically designed for micro-learning. Each lesson is 15-20 minutes, and you can do assessments at your own pace. Most mom graduates study during nap time, after bedtime, or during school hours. The 12-week timeline assumes 20 minutes per day, 5 days per week. If you have more time some weeks, you'll finish faster.",
    },
    {
      question: "What if my kids are sick or life gets chaotic?",
      answer:
        "Life happens, especially with kids. You have 6 months of access to complete a 12-week program. There are no deadlines, no live sessions you'll miss, and no penalties for pausing. 92% of mom graduates take at least one unplanned break and still complete on time.",
    },
    {
      question: "How do I see clients around my family's schedule?",
      answer:
        "Most mom practitioners see clients exclusively during school hours — typically 9:30am to 2:30pm. Virtual consultations mean no commute and no office rent. Some moms start with just 2-3 clients per week and scale up as their schedule allows. You set your own hours, your own rates, and your own client capacity.",
    },
  ],
  "other-passionate": [
    {
      question: "I've never worked in healthcare. Is this really for me?",
      answer:
        "If you're passionate about health and helping people, yes. The curriculum starts from foundations and builds up — no prerequisites. Your passion and self-taught knowledge give you a stronger starting point than you think. Many of our most successful graduates came from completely unrelated fields and brought fresh perspectives that their clients love.",
    },
    {
      question: "How is this different from a nutrition certification or health coaching course?",
      answer:
        "Functional medicine is a clinical methodology, not just nutrition or coaching. You'll learn lab interpretation, biochemistry, pathophysiology, pharmacology basics, and evidence-based protocol design. The Board-Certified credential carries significantly more weight with clients, insurance companies, and other practitioners than coaching or nutrition certificates.",
    },
    {
      question: "Will I actually be qualified to help people with real health issues?",
      answer:
        "Yes, within your scope of practice. You'll be trained to address the root causes of the most common functional conditions: gut health, hormonal imbalance, autoimmune triggers, metabolic dysfunction, and chronic fatigue. The certification includes clear scope-of-practice guidelines and teaches you when to refer out to medical doctors for issues beyond your scope.",
    },
  ],
};

export const PERSONAL_INTENT_FAQ: FAQItem[] = [
  {
    question: "I'm not looking to start a practice. Is this still worth it?",
    answer:
      "Absolutely. Many of our students enroll for personal health mastery, and they report some of the highest satisfaction scores. You'll learn to read your own labs through a functional lens, understand root causes of chronic conditions, create personalized protocols, and advocate for yourself in medical settings. The knowledge you gain is for life — and many personal-intent students end up helping friends and family informally (and some eventually start practices too).",
  },
  {
    question: "Will I be able to understand my own lab results?",
    answer:
      "That's one of the core skills you'll develop. You'll learn to interpret over 30 functional lab markers using optimal (not just 'normal') reference ranges. Most students say this single skill transforms their relationship with their own health and their doctors. You'll never sit in a doctor's office feeling confused or dismissed again.",
  },
  {
    question: "Can I use this knowledge for my family?",
    answer:
      "Yes. The protocols you learn are applicable to the whole family — children's nutrition, hormonal health for partners, aging support for parents. You'll become the most knowledgeable health advocate your family has ever had. Many students report that the ripple effect on their family's health is the most rewarding part of the entire program.",
  },
];

export const UNIVERSAL_FAQ: FAQItem[] = [
  {
    question: "What exactly is the FM Certification?",
    answer:
      "The AccrediPro FM Certification is a Board-Certified credential in Functional Medicine. It's a 12-module program covering biochemistry foundations, functional lab interpretation, clinical protocol design, and practice building. Upon completion, you receive a verified, permanent credential recognized by clients, employers, and allied health professionals.",
  },
  {
    question: "How long does the certification take?",
    answer:
      "The curriculum is designed for 12 weeks at 20 minutes per day, 5 days per week. However, you have 6 months of access. Some students complete in as few as 6 weeks (studying 40+ minutes/day), while others take the full 6 months. There's no penalty for going at your own pace.",
  },
  {
    question: "Is there a money-back guarantee?",
    answer:
      "Yes. We offer a 30-day, no-questions-asked refund guarantee. If you complete the first 3 modules and feel this isn't right for you, we'll refund 100% of your investment. We can offer this because 97% of students who reach Module 3 go on to complete the full certification.",
  },
  {
    question: "What support is included?",
    answer:
      "Every student gets access to: weekly group Q&A calls with practicing FM professionals, a private student community, 1:1 mentorship matching, email support with 24-hour response times, and lifetime access to curriculum updates. You're never alone in this journey.",
  },
  {
    question: "Is this accredited?",
    answer:
      "The AccrediPro FM Certification is issued by the American Society of Integrative Medicine (ASI) and carries Board-Certified status. The credential is recognized across the functional and integrative medicine community and satisfies continuing education requirements for most allied health licenses.",
  },
  {
    question: "What happens after I'm certified?",
    answer:
      "You receive your Board-Certified FM Practitioner credential, digital badge, and verified certificate. You'll also get lifetime access to curriculum updates, our alumni practitioner network, and ongoing business resources. Many graduates continue with specialty tracks in gut health, hormones, autoimmune, and more.",
  },
];

// ---------------------------------------------------------------------------
// 7. CTA COPY (by timeline and intent)
// ---------------------------------------------------------------------------

export const CTA_COPY: Record<Timeline, Record<Intent, CTACopy>> = {
  immediately: {
    business: {
      headline: "You're Ready. Let's Go.",
      subheadline:
        "You said you want to start immediately. We've cleared a spot in this week's cohort for you.",
      buttonText: "Start My Certification Now",
      urgencyText:
        "This week's cohort has 3 spots remaining. Your enrollment includes immediate curriculum access.",
    },
    personal: {
      headline: "Your Health Transformation Starts Today.",
      subheadline:
        "You're ready to take control of your health. The curriculum is waiting for you right now.",
      buttonText: "Begin My Health Mastery",
      urgencyText:
        "Immediate access upon enrollment. Start Module 1 today.",
    },
    both: {
      headline: "Your Transformation Starts Now.",
      subheadline:
        "Career and health — you don't have to choose. Start building both today.",
      buttonText: "Start My Certification Now",
      urgencyText:
        "This week's cohort has 3 spots remaining. Immediate curriculum access included.",
    },
  },
  "30-days": {
    business: {
      headline: "30 Days From Now, You Could Be Halfway Certified.",
      subheadline:
        "Enroll today and you'll complete the first 6 modules before most people finish deciding. Early action = early income.",
      buttonText: "Secure My Spot Today",
      urgencyText:
        "Lock in current pricing before the next cohort increase. Early enrollment includes a bonus 1:1 strategy session.",
    },
    personal: {
      headline: "In 30 Days, You'll Understand Your Body Better Than Your Doctor.",
      subheadline:
        "The first 6 modules alone will transform how you think about your health. And you'll still have 6 more to go.",
      buttonText: "Start My Health Education",
      urgencyText:
        "Current pricing available for this cohort only.",
    },
    both: {
      headline: "30 Days From Now, Everything Could Be Different.",
      subheadline:
        "Half-certified, health knowledge already deepening, practice plans taking shape. Or... still thinking about it.",
      buttonText: "Secure My Spot Today",
      urgencyText:
        "Early enrollment pricing closes when this cohort fills.",
    },
  },
  "1-3-months": {
    business: {
      headline: "The Best Time to Start Was Yesterday. The Second Best Time Is Now.",
      subheadline:
        "In 1-3 months you'll be certified and seeing your first clients. Or you'll be in the exact same place you are now, wishing you'd started sooner.",
      buttonText: "Reserve My Certification Spot",
      urgencyText:
        "Scholarship pricing is limited. Once spots fill, tuition returns to standard rate.",
    },
    personal: {
      headline: "Every Month You Wait Is a Month Without Answers.",
      subheadline:
        "Your health questions won't answer themselves. Start getting clarity now — at your own pace, on your own schedule.",
      buttonText: "Begin My Learning Journey",
      urgencyText:
        "Flexible pacing — start now, complete on your schedule within 6 months.",
    },
    both: {
      headline: "3 Months. That's All It Takes.",
      subheadline:
        "12 weeks from enrollment to Board-Certified. Then the real transformation — in your practice, your health, and your life — begins.",
      buttonText: "Reserve My Spot",
      urgencyText:
        "Scholarship pricing won't last. Secure your rate today, start when you're ready.",
    },
  },
  exploring: {
    business: {
      headline: "Still Exploring? Here's What You Need to Know.",
      subheadline:
        "We get it. This is a big decision. Let us send you the full curriculum guide, our graduate income report, and a free mini-lesson so you can experience the quality firsthand.",
      buttonText: "Get the Free Curriculum Guide",
      urgencyText:
        "No commitment required. Explore the program, then decide.",
    },
    personal: {
      headline: "Curious? Let Us Show You What's Inside.",
      subheadline:
        "We'll send you a free module preview and our personal health transformation guide. See if this resonates before you commit.",
      buttonText: "Get the Free Preview",
      urgencyText:
        "Free preview access, no credit card required.",
    },
    both: {
      headline: "Take Your Time. We'll Be Here.",
      subheadline:
        "Download our free curriculum guide and graduate success stories. When you're ready, your spot will be waiting.",
      buttonText: "Get the Free Guide",
      urgencyText:
        "No rush. But scholarship pricing does have a deadline.",
    },
  },
};

// ---------------------------------------------------------------------------
// 8. SPECIALIZATION LABELS
// ---------------------------------------------------------------------------

export const SPECIALIZATION_LABELS: Record<Specialization, SpecializationLabel> = {
  "gut-health": {
    name: "Gut Health Specialist",
    shortName: "Gut Health",
    description:
      "Master the gut-brain axis, microbiome optimization, SIBO protocols, leaky gut repair, and digestive disorder resolution. The #1 requested specialization by clients.",
    icon: "Leaf",
    color: "#4CAF50",
  },
  "hormone-health": {
    name: "Hormone Health Specialist",
    shortName: "Hormones",
    description:
      "Specialize in thyroid optimization, adrenal recovery, reproductive hormone balance, menopause support, and metabolic hormone regulation. Highest demand among 40+ women.",
    icon: "Zap",
    color: "#E91E63",
  },
  burnout: {
    name: "Burnout & Stress Recovery Specialist",
    shortName: "Burnout Recovery",
    description:
      "Address HPA axis dysfunction, cortisol patterns, nervous system regulation, and sustainable energy recovery. The fastest-growing specialty in corporate wellness.",
    icon: "Battery",
    color: "#FF9800",
  },
  autoimmune: {
    name: "Autoimmune Protocol Specialist",
    shortName: "Autoimmune",
    description:
      "Learn trigger identification, immune modulation, elimination protocols, and remission strategies for Hashimoto's, RA, lupus, MS, and other autoimmune conditions.",
    icon: "Shield",
    color: "#2196F3",
  },
  metabolic: {
    name: "Metabolic Health Specialist",
    shortName: "Metabolic Health",
    description:
      "Master blood sugar regulation, insulin resistance reversal, weight management protocols, and cardiovascular risk reduction through functional approaches.",
    icon: "Activity",
    color: "#9C27B0",
  },
  explore: {
    name: "Comprehensive FM Practitioner",
    shortName: "Full Spectrum",
    description:
      "Get certified across all specializations. The broadest foundation for a versatile practice — specialize later based on the clients who find you.",
    icon: "Compass",
    color: "#722F37",
  },
};

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------------------

/**
 * Get pain mirror copy for a given pain point, with persona-specific expansion.
 */
export function getPainMirror(
  painPoint: PainPoint,
  persona: Persona
): { headline: string; subheadline: string; expansion: string } {
  const copy = PAIN_MIRROR_COPY[painPoint];
  return {
    headline: copy.headline,
    subheadline: copy.subheadline,
    expansion: copy.expansions[persona],
  };
}

/**
 * Get future pacing copy for a given dream life value.
 * Returns personal variant if intent is "personal".
 */
export function getFuturePacing(
  dreamLife: DreamLife,
  intent: Intent
): { headline: string; body: string } {
  const copy = FUTURE_PACING_COPY[dreamLife];
  return {
    headline: copy.headline,
    body:
      intent === "personal" && copy.personalVariant
        ? copy.personalVariant
        : copy.body,
  };
}

/**
 * Get hero subhead for a given persona and intent combination.
 */
export function getHeroSubhead(persona: Persona, intent: Intent): string {
  return HERO_SUBHEADS[persona][intent];
}

/**
 * Get value stack items based on readiness and intent.
 * Combines readiness-specific hero items with intent-specific items.
 */
export function getValueStack(
  readiness: Readiness,
  intent: Intent
): { heroItems: ValueStackItem[]; additionalItems: ValueStackItem[] } {
  const heroItems = VALUE_STACK_HERO[readiness];
  const additionalItems =
    intent === "personal"
      ? VALUE_STACK_PERSONAL
      : VALUE_STACK_BUSINESS;

  return { heroItems, additionalItems };
}

/**
 * Get income ROI copy for a given income goal.
 */
export function getIncomeROI(incomeGoal: IncomeGoal): IncomeROICopy {
  return INCOME_ROI_COPY[incomeGoal];
}

/**
 * Get FAQ items for a given persona and intent.
 * Combines persona-specific, intent-specific, and universal FAQs.
 */
export function getFAQItems(
  persona: Persona,
  intent: Intent
): FAQItem[] {
  const personaFaqs = PERSONA_FAQ[persona];
  const intentFaqs = intent === "personal" ? PERSONAL_INTENT_FAQ : [];
  const universalFaqs = UNIVERSAL_FAQ;

  return [...personaFaqs, ...intentFaqs, ...universalFaqs];
}

/**
 * Get CTA copy for a given timeline and intent.
 */
export function getCTACopy(timeline: Timeline, intent: Intent): CTACopy {
  return CTA_COPY[timeline][intent];
}

/**
 * Get specialization display labels and metadata.
 */
export function getSpecializationLabel(
  specialization: Specialization
): SpecializationLabel {
  return SPECIALIZATION_LABELS[specialization];
}

// ---------------------------------------------------------------------------
// 9. "THIS CERT IS FOR" CARDS (persona-aware highlight)
// ---------------------------------------------------------------------------

export interface CertIsForCard {
  icon: string;
  title: string;
  description: string;
  matchesPersona: boolean;
}

const CERT_IS_FOR_BASE: { icon: string; title: string; description: string; personas: Persona[] }[] = [
  {
    icon: "👩‍⚕️",
    title: "Nurses & Medical Professionals",
    description: "Leverage your clinical background to confidently transition into functional medicine coaching with systematic root cause protocols",
    personas: ["healthcare-pro"],
  },
  {
    icon: "🥗",
    title: "Nutritionists & Dietitians",
    description: "Move beyond generic meal plans to address gut dysfunction, hormones, and complex health cases with clinical depth",
    personas: ["health-coach"],
  },
  {
    icon: "🧘",
    title: "Wellness Coaches & Practitioners",
    description: "Stop feeling stuck with surface-level advice — gain the clinical skills to handle thyroid issues, autoimmune conditions, and chronic fatigue",
    personas: ["health-coach"],
  },
  {
    icon: "🏥",
    title: "Health Coaches Wanting Depth",
    description: "Frustrated by basic training? Learn functional lab interpretation, systems analysis, and evidence-based protocols",
    personas: ["health-coach"],
  },
  {
    icon: "💼",
    title: "Career Changers Seeking Purpose",
    description: "Build a meaningful career earning $75-200/hour while helping clients achieve transformations traditional medicine can't",
    personas: ["corporate", "stay-at-home-mom", "other-passionate"],
  },
  {
    icon: "🔬",
    title: "Science-Minded Practitioners",
    description: "Love evidence-based approaches? Master biomarker analysis, research-backed protocols, and systematic clinical reasoning",
    personas: ["healthcare-pro", "other-passionate"],
  },
];

export function getCertIsForCards(persona: Persona): CertIsForCard[] {
  return CERT_IS_FOR_BASE.map((card) => ({
    icon: card.icon,
    title: card.title,
    description: card.description,
    matchesPersona: card.personas.includes(persona),
  }));
}

// ---------------------------------------------------------------------------
// 10. TWO CHOICES (persona-specific contrast)
// ---------------------------------------------------------------------------

export interface TwoChoicesCopy {
  bad: string[];
  good: string[];
}

const TWO_CHOICES: Record<Persona, TwoChoicesCopy> = {
  "healthcare-pro": {
    bad: [
      "Keep grinding 12-hour shifts until your body gives out",
      "Watch patients cycle through the same prescriptions without improvement",
      "Stay stuck referring out every complex case you can't solve",
      "Never command premium fees because you lack FM specialization",
      "Wonder \"what if\" for another 5 years",
    ],
    good: [
      "Confidently interpret labs and identify root causes",
      "Help patients solve complex health issues doctors can't",
      "Work 15-20 hours a week from home on your terms",
      "Earn $75-200/hour as a specialized practitioner",
      "Join 1,247+ coaches with clinical mastery",
      "Get Sarah's daily personal mentorship until you're certified",
    ],
  },
  "health-coach": {
    bad: [
      "Keep giving generic wellness advice that doesn't solve complex cases",
      "Stay stuck at $50-75/session with no way to raise rates",
      "Lose clients to practitioners with actual clinical credentials",
      "Never learn to interpret labs or design real protocols",
      "Burn out chasing clients who don't value your work",
    ],
    good: [
      "Go from health coach to Board-Certified FM Practitioner",
      "3x your rates with a recognized clinical credential",
      "Confidently handle thyroid, gut, hormone, and autoimmune cases",
      "Build a waitlist practice where clients come to YOU",
      "Earn $150-250/session as a clinical specialist",
      "Get the depth that separates coaches from practitioners",
    ],
  },
  corporate: {
    bad: [
      "Stay in your cubicle wondering \"what if\" for another decade",
      "Keep trading your best hours for someone else's dream",
      "Let Sunday scaries and Monday dread define your life",
      "Watch your health deteriorate from corporate stress",
      "Retire with regret instead of purpose",
    ],
    good: [
      "Build a career that actually matters to you and others",
      "Use your corporate skills as a secret weapon in practice building",
      "Work from home with zero commute and full schedule control",
      "Earn more than your corporate salary in 6-8 months",
      "Join a community of successful career changers who did exactly this",
      "No medical degree needed — your business skills are the advantage",
    ],
  },
  "stay-at-home-mom": {
    bad: [
      "Keep losing yourself in the daily grind of family logistics",
      "Watch the years pass without building something of your own",
      "Feel financially dependent with no income to call yours",
      "Miss the window when your kids are in school",
      "Try another MLM that goes nowhere",
    ],
    good: [
      "Study 20 minutes a day — during nap time or after bedtime",
      "Build a real practice that fits around school hours",
      "Earn more than your old corporate job on YOUR schedule",
      "Model ambition and purpose for your children",
      "Join other moms who built thriving practices around family",
      "No childcare needed — 100% virtual, 100% flexible",
    ],
  },
  "other-passionate": {
    bad: [
      "Keep giving free health advice without earning a cent",
      "Stay frustrated watching people suffer from bad medical advice",
      "Never turn your passion into a real profession",
      "Let imposter syndrome stop you from helping others",
      "Spend another year studying on your own with no credential",
    ],
    good: [
      "Turn your health passion into a Board-Certified profession",
      "Get the credential that makes your knowledge official",
      "Help people professionally instead of just informally",
      "Earn $75-200/hour doing work you genuinely love",
      "Join 1,247+ practitioners who started exactly where you are",
      "No medical background required — just passion and 20 min/day",
    ],
  },
};

export function getTwoChoices(persona: Persona): TwoChoicesCopy {
  return TWO_CHOICES[persona] || TWO_CHOICES["other-passionate"];
}

// ---------------------------------------------------------------------------
// 11. P.S. CLOSERS (persona + specialization aware)
// ---------------------------------------------------------------------------

export interface PSCloser {
  headline: string;
  body: string;
}

export function getPSClosers(
  persona: Persona,
  specialization: Specialization
): PSCloser[] {
  const specLabel = SPECIALIZATION_LABELS[specialization]?.name || "Functional Medicine";

  const personaClient: Record<Persona, string> = {
    "healthcare-pro": "a patient just left another ER visit where they were told 'everything looks normal' despite chronic fatigue, brain fog, and weight gain that's been destroying their quality of life for 2 years",
    "health-coach": "a woman is Googling 'functional medicine near me' right now because her health coach couldn't help with her hormone imbalance and she needs someone with real clinical depth",
    corporate: "someone just like you is sitting at their desk right now, Googling 'career change health,' wondering if they're too old to start over — they're not, and they need practitioners who understand burnout firsthand",
    "stay-at-home-mom": "a mom is lying awake at 2am researching her child's health issues, wishing she understood functional medicine well enough to advocate for her family — that could be you helping moms like her",
    "other-passionate": "someone you know — a friend, a neighbor, a coworker — is struggling with a health issue that conventional medicine can't solve, and they need exactly the help you could provide",
  };

  return [
    {
      headline: "The Part Where I Get Real With You",
      body: `Right now, ${personaClient[persona]}. They need someone who understands the ${specLabel.toLowerCase()} framework. Someone who can look at their labs, identify what everyone else missed, and create a protocol that actually works. They don't need another doctor who gives them 8 minutes. They need a practitioner who gives them answers. They need YOU. The version of you who has the DEPTH Method™ framework and the credential to back it up.`,
    },
    {
      headline: "One Last Thing (I Promise)",
      body: `There's a client out there right now. They just left another appointment feeling dismissed. Their labs are "normal" but they feel terrible. They're losing hope. And they need someone with ${specLabel.toLowerCase()} expertise who actually listens, who understands root causes, who can connect the dots between their gut, their hormones, their thyroid, and their symptoms. That someone is you. Not the you who's reading this right now — the you who's 12 weeks from now. Certified. Confident. Ready. The only question is whether you'll let that version of yourself exist.`,
    },
  ];
}
