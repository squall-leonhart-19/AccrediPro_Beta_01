"use client";

import { ClassicLessonBase, LessonSection } from "../../shared/classic-lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function ClassicLessonRootCauseMedicine({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        {
            type: 'intro',
            content: `Hey {name}! I'm Sarah, and I'm genuinely SO excited you're here. Can I be honest with you? 4 years ago, I was exactly where you might be right now - curious about health coaching, but terrified I wasn't "qualified enough." I wasn't a doctor. I didn't have a science degree. I was a 43-year-old mom who'd struggled with my OWN health issues and finally found answers. Today? I work 15 hours a week, earn $6,200/month, and I've helped 200+ women transform their health. And I'm going to show you exactly how.`,
        },
        {
            type: 'heading',
            content: 'The Healthcare Crisis Nobody Talks About',
        },
        {
            type: 'key-point',
            content: `60% of Americans have a chronic disease. 42% have TWO or more. The average doctor visit? 7 minutes. Doctors are trained to treat SYMPTOMS, not causes. They're overwhelmed, overworked, and have no time. People are DESPERATE for someone who will actually LISTEN. This isn't about replacing doctors. It's about filling a massive gap they can't fill.`,
        },
        {
            type: 'text',
            content: `Here's what I want you to understand: The world doesn't need more doctors. It needs more HEALTH GUIDES - people who can help others navigate their health journey.`,
        },
        {
            type: 'heading',
            content: '"But Sarah, I\'m Not a Doctor..."',
        },
        {
            type: 'text',
            content: `Neither am I. And here's why that's actually an ADVANTAGE:`,
        },
        {
            type: 'list',
            content: 'What Doctors Do (Medical Practice):',
            items: [
                'Diagnose diseases',
                'Prescribe medications',
                'Perform procedures',
                'Require MD/DO degree + license',
            ],
        },
        {
            type: 'list',
            content: 'What Health Coaches Do (Health Education):',
            items: [
                'Educate on nutrition & lifestyle',
                'Support behavior change',
                'Help implement healthy habits',
                'Guide, don\'t diagnose or prescribe',
            ],
        },
        {
            type: 'callout',
            content: `You're not replacing doctors. You're partnering with them. As a certified health coach, you legally provide EDUCATION and SUPPORT - not medical advice. This is 100% legal in all 50 states.`,
            style: 'info',
        },
        {
            type: 'text',
            content: `Think about it - your friends already ask YOU for health advice, right? They trust you MORE than their doctor because you actually LISTEN.`,
        },
        {
            type: 'heading',
            content: 'Real Story: Linda, 52 - Former Accountant',
        },
        {
            type: 'quote',
            content: `"I spent 25 years in corporate accounting. When I started this program, I thought 'Who will listen to me? I'm not a health professional.' My first client was my sister-in-law who'd struggled with fatigue for years. After 3 months working together, she was off her afternoon energy drinks and lost 18 pounds. She told me: 'You helped me more in 3 months than my doctor did in 3 years.' I quit my corporate job 8 months ago. I now work 20 hours/week and earned $4,800 last month. Not bad for someone who 'isn't qualified.'" - Linda M., Ohio | ASI Graduate 2024`,
        },
        {
            type: 'heading',
            content: 'The Root Cause Revolution',
        },
        {
            type: 'text',
            content: `Now let me teach you the most important concept in functional medicine - the thing that separates average health coaches from practitioners who get REAL results. It's called ROOT CAUSE thinking. And once you understand it, you'll never look at health the same way.`,
        },
        {
            type: 'list',
            content: 'Conventional Approach (Symptom Treatment):',
            items: [
                'Headache? Take Advil',
                'Can\'t sleep? Sleeping pills',
                'Fatigue? More coffee',
                'Anxious? Anxiety meds',
            ],
        },
        {
            type: 'callout',
            content: `The symptom goes away... until it comes back. Or shows up somewhere else.`,
            style: 'warning',
        },
        {
            type: 'list',
            content: 'Root Cause Approach (Ask WHY):',
            items: [
                'Headache? Why? Dehydration? Gut issues? Stress?',
                'Can\'t sleep? Why? Cortisol dysregulation? Blood sugar?',
                'Fatigue? Why? Nutrient deficiency? Inflammation?',
                'Anxious? Why? Hormone imbalance? Gut-brain axis?',
            ],
        },
        {
            type: 'key-point',
            content: `When you fix the ROOT CAUSE, the symptoms disappear - permanently. This is what separates practitioners who get paid $50/hour from those who charge $200+ and have waitlists.`,
        },
        {
            type: 'heading',
            content: 'The 5 Root Causes of Chronic Disease',
        },
        {
            type: 'text',
            content: `Almost EVERY chronic health issue traces back to one of these five root causes:`,
        },
        {
            type: 'list',
            content: 'The 5 Root Causes:',
            items: [
                'Gut Dysfunction - 70% of immune system lives here',
                'Chronic Inflammation - The silent killer behind all disease',
                'Toxin Overload - 80,000+ chemicals in our environment',
                'Nutrient Deficiencies - Even in the "well-fed"',
                'HPA Axis Dysfunction - Chronic stress destroying health',
            ],
        },
        {
            type: 'callout',
            content: `The magic? These are all CONNECTED. Fix one, others start improving. This is what you'll learn to identify and address. Not with prescriptions - with education, nutrition, and lifestyle changes.`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Why People Trust Health Coaches',
        },
        {
            type: 'text',
            content: `Research shows clients prefer health coaches because:`,
        },
        {
            type: 'list',
            content: 'The Trust Factor:',
            items: [
                'TIME: Coaches spend 60+ minutes. Doctors spend 7.',
                'EMPATHY: You\'ve LIVED it. Doctors studied it.',
                'ACCESSIBILITY: You\'re not intimidating in a white coat',
                'ACCOUNTABILITY: You walk alongside them',
                'RESULTS: You focus on root causes, not quick fixes',
            ],
        },
        {
            type: 'key-point',
            content: `"My health coach changed my life. She actually LISTENED." - We hear this daily. Your personal health journey? It's not a weakness. It's your SUPERPOWER.`,
        },
        {
            type: 'heading',
            content: 'Real Story: Patricia, 47 - Former Teacher',
        },
        {
            type: 'quote',
            content: `"I taught high school for 20 years. Zero health background. When my own thyroid issues led me down the functional medicine rabbit hole, I finally felt better for the first time in a decade. I thought: 'I have to share this with other women.' The certification gave me the structure and credibility I needed. Now I specialize in helping women with thyroid and hormone issues. Last month: 8 clients, $3,400 in income, working from home while my kids are at school. The best part? I'm HELPING people. That never happened in the classroom." - Patricia K., Texas | ASI Graduate 2023`,
        },
        {
            type: 'heading',
            content: 'A Day in My Life',
        },
        {
            type: 'text',
            content: `Let me paint a picture of what your life could look like as a certified practitioner:`,
        },
        {
            type: 'list',
            content: 'My Typical Day:',
            items: [
                '7:30 AM - Kids off to school. Coffee. Check client messages (15 min)',
                '9:00 AM - Client session with Jennifer (Zoom). Reviewing her food journal, adjusting her gut protocol. 60 min = $175',
                '10:30 AM - Quick workout, shower, lunch',
                '12:00 PM - Client session with Maria. Her inflammation markers improved! She\'s crying happy tears. 60 min = $175',
                '1:30 PM - Admin: update client notes, prep for tomorrow (45 min)',
                '3:00 PM - Kids home. I\'m DONE for the day.',
            ],
        },
        {
            type: 'key-point',
            content: `Today's income: $350 for 3 hours of actual work. This is what "part-time practitioner" looks like.`,
        },
        {
            type: 'heading',
            content: 'The Root Cause Premium',
        },
        {
            type: 'text',
            content: `Why do root cause practitioners earn MORE than average health coaches?`,
        },
        {
            type: 'list',
            content: 'Average Health Coach ($50-75/session):',
            items: [
                'Clients see you 2-3 times then leave',
                'Always chasing new clients',
                '"I don\'t see results"',
            ],
        },
        {
            type: 'list',
            content: 'Root Cause Practitioner ($150-300/session):',
            items: [
                'Clients stay 4-6 months (ongoing revenue)',
                'Referrals from happy clients',
                'Waitlists form organically',
            ],
        },
        {
            type: 'callout',
            content: `The difference? RESULTS. When you fix root causes, people get better. And they tell everyone. One graduate told us: "I raised my rates to $225 and STILL have a waitlist."`,
            style: 'success',
        },
        {
            type: 'heading',
            content: 'Coming Up: The Gut Connection',
        },
        {
            type: 'text',
            content: `In the next lesson, we're diving into the GUT - because Hippocrates said "All disease begins in the gut" 2,000 years ago. And science is proving he was RIGHT.`,
        },
        {
            type: 'list',
            content: 'What you\'ll learn:',
            items: [
                'Why 70% of your immune system lives in your gut',
                'The 5R Protocol every practitioner needs to know',
                'A real case study for you to solve',
                'Why gut health specialists are in MASSIVE demand',
            ],
        },
    ];

    const keyTakeaways = [
        'You don\'t need a medical degree - health coaches provide EDUCATION and SUPPORT, not diagnoses',
        'Root cause thinking separates $50/hour coaches from $200+/hour practitioners',
        'The 5 root causes: Gut, Inflammation, Toxins, Nutrients, Stress (HPA axis)',
        'Your personal health struggles are your SUPERPOWER, not a weakness',
        'Clients trust coaches because you LISTEN and spend TIME with them',
        'Part-time work (15-20 hrs/week) can generate $3,000-6,000/month',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Why Root Cause Medicine Wins"
            lessonSubtitle="And why YOU can do this (even without a medical degree)"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="functional-medicine"
            nicheLabel="Functional Medicine Diploma"
            baseUrl="/functional-medicine-diploma"
            courseSlug="functional-medicine-complete-certification"
        />
    );
}
