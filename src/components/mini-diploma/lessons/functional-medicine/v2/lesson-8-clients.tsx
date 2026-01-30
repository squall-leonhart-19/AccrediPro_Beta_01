"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import { KnowledgeCheckQuiz, DownloadResource } from "../../shared/interactive-elements";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function Lesson8Clients({
    lessonNumber,
    totalLessons = 9,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const [score, setScore] = useState(0);

    const messages: Message[] = [
        // HOOK - The Real Fear
        {
            id: 1,
            type: 'coach',
            content: `{name}, this is the lesson most "experts" don't want to teach you. How to actually GET CLIENTS.`,
        },
        {
            id: 2,
            type: 'coach',
            content: `Because here's the truth: The best knowledge in the world means nothing if you have no one to help.`,
        },
        {
            id: 3,
            type: 'coach',
            content: `And I know what you're really worried about. It's not "where do I find clients?" It's "why would anyone pay ME when there are real doctors out there?"`,
        },

        // OBJECTION CRUSHER: "Who will take me seriously?"
        {
            id: 4,
            type: 'system',
            content: `**"But Why Would Anyone Pay ME?"**

Let me reframe this for you:

**What doctors offer:**
- 7-minute appointments
- Focus on disease management
- Prescription-first approach
- No time for lifestyle education
- Waitlists weeks/months long

**What YOU offer:**
- 60+ minute sessions
- Focus on root cause wellness
- Lifestyle-first approach
- Deep education and support
- Personalized attention

People aren't comparing you to doctors. They're comparing you to feeling stuck, frustrated, and unheard.

A graduate told us: "I was terrified no one would take me seriously. Then I realized: My first client cried in our first session because I was the first person who actually LISTENED to her health story. That's what she was paying for."`,
            systemStyle: 'comparison',
        },

        // TESTIMONIAL - First Client Story
        {
            id: 5,
            type: 'system',
            content: `**Meet Nancy, 49 - Her First Client Story**

"I'll never forget getting my first paying client. I was SO nervous. Who was I to charge $150 for health advice?

Her name was Debbie. Friend of a friend. Chronic fatigue for 5 years. Multiple doctors, no answers.

I told her upfront: 'I'm not a doctor. I can't diagnose. But I can educate you and support you through lifestyle changes.'

She said: 'That's exactly what I need. My doctors diagnose but don't explain anything.'

We worked together for 4 months. She lost 22 pounds. Her energy came back. Her brain fog cleared.

At the end, she hugged me and said: 'You changed my life.'

That one client referred 3 more. Those 3 referred 7 more. That's how it works.

Current stats (18 months later):
- 14 active clients
- $175/session
- Monthly income: $4,900
- 100% from referrals now

It all started with Debbie. And my willingness to just TRY."

- Nancy R., Illinois | ASI Graduate 2023`,
            systemStyle: 'testimonial',
        },

        // WHERE CLIENTS ARE
        {
            id: 6,
            type: 'system',
            content: `**The Client Acquisition Reality**

Most new practitioners fail NOT because they lack knowledge...
They fail because they don't know how to get clients.

**The good news:**
- You don't need a huge following
- You don't need to be "salesy"
- You don't need to be fully certified
- You CAN get clients while still learning

The people who need you are closer than you think.`,
            systemStyle: 'info',
        },
        {
            id: 7,
            type: 'coach',
            content: `Let's talk about where your ideal clients are hiding. Hint: They're probably in your phone contacts right now.`,
        },
        {
            id: 8,
            type: 'system',
            content: `**Where Your Ideal Clients Are**

**INNER CIRCLE (Easiest - Start Here)**
- Friends who complain about health issues
- Family members struggling with weight/energy
- Coworkers who are always exhausted
- People at your gym/yoga class
- Your hairdresser, neighbors, church group

**WARM NETWORK**
- Facebook friends you haven't talked to in years
- Former colleagues
- Mom groups if you have kids
- Alumni networks
- Community organizations

**ONLINE COMMUNITIES**
- Facebook health groups
- Local women's groups
- Chronic illness support groups
- Wellness-focused forums
- Neighborhood apps (NextDoor)

You already KNOW people who desperately need what you're learning.`,
            systemStyle: 'takeaway',
        },
        {
            id: 9,
            type: 'user-choice',
            content: `Quick check - can you think of at least 5 people who complain about fatigue, weight, or chronic issues?`,
            choices: [
                "Yes, I can think of many!",
                "Maybe 2-3 people",
                "I'll pay attention now",
            ],
            showReaction: true,
        },
        {
            id: 10,
            type: 'coach',
            content: `See? You're already surrounded by potential clients! The key is learning how to help them without being pushy or "salesy."`,
        },

        // THE 3 STRATEGIES
        {
            id: 11,
            type: 'coach',
            content: `Now let me give you 3 proven strategies to get your first paying clients. These work even if you're still learning.`,
        },
        {
            id: 12,
            type: 'system',
            content: `**Strategy 1: The "Practice Client" Approach**

The easiest way to start - and build confidence:

**How it works:**
1. Offer 3-5 people FREE sessions
2. Frame it as: "I'm building my practice and need feedback"
3. Ask ONLY for honest feedback + testimonial
4. Deliver your absolute best

**Why it works:**
- No pressure (they're helping YOU)
- You gain experience and confidence
- Testimonials become marketing gold
- 50%+ become paying clients or refer others

**The script:**
"I'm training to become a functional medicine health coach. I'm looking for 3 people to work with for free in exchange for honest feedback. Would you be interested, or know someone who might be?"

Every graduate who followed this strategy had paying clients within 60 days.`,
            systemStyle: 'exercise',
        },
        {
            id: 13,
            type: 'system',
            content: `**Strategy 2: The "Share What You Learn" Method**

Position yourself as knowledgeable without selling:

**How it works:**
1. Post ONE insight from your learning on social media
2. Don't sell - just educate
3. End with a question to spark conversation
4. Reply to comments genuinely
5. People will eventually ask how they can work with you

**Example posts:**
- "Just learned why you're tired even after 8 hours of sleep. It's not the sleep - it's the blood sugar crash at 3am..."
- "Mind-blown: 70% of your immune system lives in your GUT. No wonder antibiotics mess everything up..."
- "Why 'normal' labs don't mean you're healthy... (this changed how I look at bloodwork)"

**Why it works:**
- Positions you as knowledgeable
- Attracts people who resonate
- They come to YOU (no chasing)
- Builds authority over time
- Works while you sleep`,
            systemStyle: 'exercise',
        },
        {
            id: 14,
            type: 'system',
            content: `**Strategy 3: The "Workshop" Launch**

Fill your practice from ONE event:

**How it works:**
1. Host a FREE workshop (Zoom or in-person)
2. Topic: "5 Root Causes of Chronic Fatigue" (or similar)
3. Invite everyone you know (email, text, social media)
4. Deliver valuable content for 45 minutes
5. Offer a free consultation at the end

**Why it works:**
- Establishes you as the expert
- Attracts ideal clients (they chose to attend)
- Low pressure environment
- Can fill your practice from ONE workshop

**Pro tips:**
- Record it! Use as content forever
- 10-15 attendees is plenty
- Expect 20-30% to book consultations

One graduate filled 6 client spots from her first workshop.`,
            systemStyle: 'exercise',
        },

        // OBJECTION: "But I'm not certified yet"
        {
            id: 15,
            type: 'coach',
            content: `Now you might be thinking: "But Sarah, I'm not even fully certified yet. Should I wait?"`,
        },
        {
            id: 16,
            type: 'system',
            content: `**"But I'm Not Certified Yet..."**

Here's the truth about certification:

**Your certification IS your competitive advantage.**

While others make excuses, certified practitioners:
- Command higher fees ($150-300/hour vs $50-75)
- Get taken seriously by clients AND other professionals
- Have confidence to market themselves
- Build credibility that attracts referrals
- Stand out in a crowded wellness space

**The good news?**

You can START building your practice while completing your certification. This is actually the SMART approach:

✅ Take on 2-3 practice clients NOW (as you finish the course)
✅ Be honest: "I'm completing my certification in functional medicine"
✅ Gain real experience while learning
✅ Graduate with testimonials AND credentials

**But don't stop here.**

This Mini Diploma gives you a foundation. The FULL certification is what separates hobbyists from professionals who earn $5,000-$15,000/month.

A graduate said: "I started with 2 practice clients during training. By the time I got certified, I had testimonials, confidence, AND credentials. My first 'real' client said: 'I chose you because you're certified AND have proven results.'"

**Complete your certification. It's your ticket to premium pricing.**`,
            systemStyle: 'comparison',
        },

        // THE CONVERSATION FRAMEWORK
        {
            id: 17,
            type: 'coach',
            content: `Now, what do you say when someone expresses interest? Here's a simple framework that doesn't feel salesy...`,
        },
        {
            id: 18,
            type: 'system',
            content: `**The Natural Conversation Framework**

When someone mentions a health struggle:

**STEP 1: LISTEN & EMPATHIZE**
"That sounds really frustrating. How long has this been going on?"
(Let them talk. Ask follow-up questions. Show you care.)

**STEP 2: EDUCATE (Don't Diagnose)**
"You know, what you're describing might be related to [root cause concept]. Have you ever looked into that?"
(Share ONE insight. Don't overwhelm.)

**STEP 3: OFFER VALUE**
"I actually work with people on this. Would you like to chat for 15 minutes? I can share some insights that might help."
(Free value first. No pressure.)

**STEP 4: NEXT STEPS**
"Based on what you've shared, I think I could really help you. Here's how we could work together..."
(Only after the free consultation. They've experienced your value.)

It's a conversation, not a pitch. Help first, sell second.`,
            systemStyle: 'comparison',
        },

        // KNOWLEDGE CHECK
        {
            id: 19,
            type: 'coach',
            content: `Let's make sure you've got these strategies down...`,
        },
        {
            id: 20,
            type: 'custom-component',
            content: '',
            componentProps: { points: 20 },
            renderComponent: ({ onComplete }) => (
                <KnowledgeCheckQuiz
                    title="Client Acquisition Check"
                    questions={[
                        {
                            id: 'q1',
                            question: 'What\'s the easiest place to find your first clients?',
                            options: [
                                { id: 'a', label: 'Paid Facebook ads', isCorrect: false },
                                { id: 'b', label: 'Your inner circle and warm network', isCorrect: true },
                                { id: 'c', label: 'Cold calling', isCorrect: false },
                                { id: 'd', label: 'Waiting for referrals', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q2',
                            question: 'What should you ask for from practice clients?',
                            options: [
                                { id: 'a', label: 'Full payment upfront', isCorrect: false },
                                { id: 'b', label: 'Honest feedback and a testimonial', isCorrect: true },
                                { id: 'c', label: 'Nothing at all', isCorrect: false },
                                { id: 'd', label: 'Referrals immediately', isCorrect: false },
                            ],
                        },
                        {
                            id: 'q3',
                            question: 'In the Natural Conversation Framework, what comes FIRST?',
                            options: [
                                { id: 'a', label: 'Offering your services', isCorrect: false },
                                { id: 'b', label: 'Sharing your credentials', isCorrect: false },
                                { id: 'c', label: 'Listening and empathizing', isCorrect: true },
                                { id: 'd', label: 'Quoting your prices', isCorrect: false },
                            ],
                        },
                    ]}
                    onComplete={(score, total) => {
                        onComplete();
                    }}
                />
            ),
        },

        // INCOME - Unique to Client Acquisition
        {
            id: 21,
            type: 'system',
            content: `**Your First 90 Days: The Realistic Timeline**

Here's what building a practice ACTUALLY looks like:

**Month 1: Foundation**
- Complete/continue your certification
- Take on 3-5 practice clients (free)
- Post 2-3x/week on social media
- Collect feedback and testimonials
- Target: 0-2 paying clients

**Month 2: Momentum**
- Convert practice clients to paying or referrals
- Host first workshop (even just 10 people)
- Start charging (50% of your target rate)
- Target: 2-4 paying clients
- Income: $300-800/month

**Month 3: Growth**
- Raise to full rate
- Referrals starting to come in
- Systems getting smoother
- Target: 4-6 paying clients
- Income: $800-1,500/month

**Month 4-6: Establishment**
- Consistent client flow
- Word of mouth working
- Target: 6-10 active clients
- Income: $1,500-3,500/month

This is conservative and realistic. Some graduates move faster.`,
            systemStyle: 'income-hook',
        },

        // SECOND TESTIMONIAL
        {
            id: 22,
            type: 'system',
            content: `**Meet Gloria, 55 - The Slow Build Success**

"I didn't have a big following. I wasn't on social media. I was 55 and not tech-savvy at all.

But I knew people. Lots of them. 30 years of church involvement, book clubs, and neighborhood connections.

My approach was simple: I just started talking about what I was learning. At coffee. At Bible study. At the grocery store.

'Oh, you have thyroid issues? I've been studying this. Did you know...'

That's it. No fancy marketing. No website at first. Just conversations.

Month 1: 2 practice clients (friends from church)
Month 2: 1 paid client ($100/session - I was nervous to charge more)
Month 3: 3 paid clients (referrals from my first one)
Month 6: 6 clients at $150/session
Now (14 months): 9 clients at $175/session

Monthly income: $3,150 working 12 hours/week.

I'm 55, not on Instagram, and making more than I did as an office manager. You don't need fancy marketing. You need to help people."

- Gloria T., Tennessee | ASI Graduate 2024`,
            systemStyle: 'testimonial',
        },

        // DOWNLOADABLE RESOURCE
        {
            id: 23,
            type: 'coach',
            content: `Here's something that'll help you get started professionally - a client intake form template you can use right away...`,
        },
        {
            id: 24,
            type: 'custom-component',
            content: '',
            renderComponent: ({ onComplete }) => (
                <DownloadResource
                    title="Client Intake Form Template"
                    description="Professional intake form covering health history, symptoms, goals, and lifestyle factors - ready to use"
                    fileName="Client-Intake-Form.pdf"
                    downloadUrl="/resources/mini-diploma/client-intake-form.pdf"
                    icon="template"
                    onDownload={onComplete}
                />
            ),
        },

        // ACTION STEP
        {
            id: 25,
            type: 'system',
            content: `**Your Client Acquisition Action Step**

Before you move to the final lesson, do this:

1. **Make a list of 10 people** you know who have health complaints
   (fatigue, weight, gut issues, hormone problems - anything)

2. **Choose 3** you'd feel comfortable approaching

3. **Draft a message:**
   "Hey [name], I'm training to become a health coach and I'm looking for a few people to practice with. I remember you mentioning [their issue]. Would you be interested in a free session in exchange for feedback?"

That's it. Three messages. Your practice starts with one conversation.

Do this TODAY while it's fresh.`,
            systemStyle: 'exercise',
        },

        // PREVIEW
        {
            id: 26,
            type: 'coach',
            content: `{name}, you're ONE lesson away from completing this mini diploma! I'm so proud of how far you've come.`,
        },
        {
            id: 27,
            type: 'coach',
            content: `In the final lesson, we're going to map out YOUR personal income potential. You'll see exactly what's possible based on YOUR situation.`,
        },
        {
            id: 28,
            type: 'system',
            content: `**Coming Up: Your Income Calculator**

- See YOUR potential monthly income
- Based on YOUR available hours and goals
- Real math, real numbers
- Clear path from here to there
- Your certificate awaits!

This is where everything comes together. See you in Lesson 9!`,
            systemStyle: 'info',
        },
    ];

    return (
        <LessonBaseV2
            lessonNumber={lessonNumber}
            lessonTitle="Finding Your First Clients"
            lessonSubtitle="3 strategies that work (even without credentials)"
            totalLessons={totalLessons}
            messages={messages}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            currentScore={score}
            onScoreUpdate={(points) => setScore(s => s + points)}
        />
    );
}
