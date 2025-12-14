"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Download,
    Search,
    ChevronRight,
    FileText,
    CheckCircle,
    Bookmark,
    ChevronLeft,
    Share2,
    ArrowLeft,
    BookmarkCheck,
    Clock,
    PlayCircle,
    CheckCircle2,
    Circle,
    List,
    BookMarked,
    Library,
    Sparkles,
    ShoppingBag,
} from "lucide-react";

// Categories for filtering
const CATEGORIES = [
    { id: "all", label: "All", icon: "📚" },
    { id: "core", label: "Core Guides", icon: "📘" },
    { id: "gut", label: "Gut Health", icon: "🍃" },
    { id: "hormones", label: "Hormones", icon: "🌸" },
    { id: "thyroid", label: "Thyroid", icon: "🦋" },
    { id: "nutrition", label: "Nutrition", icon: "🥗" },
    { id: "inflammation", label: "Inflammation", icon: "🔥" },
];

// Sample owned e-books (in production, this would come from database based on purchases)
// For now showing 3 sample ebooks that match the store structure
const MY_EBOOKS = [
    {
        id: "practitioner-reality-playbook",
        title: "The Practitioner Reality Playbook",
        subtitle: "What They Don't Teach in Certification Programs",
        description: "The real-world guide for new functional medicine practitioners. Covers everything from setting up your practice to handling difficult clients, managing boundaries, and building sustainable income.",
        valueProp: "The #1 reason new practitioners fail—and how to avoid it.",
        author: "AccrediPro Academy",
        pages: 52,
        icon: "📘",
        category: "core",
        topics: ["Practice Setup", "Client Management", "Boundaries", "Business Basics"],
        readTime: "2-3 hours",
        unlockedDate: "2024-11-15",
        isFree: true,
        unlockCondition: "Mini Diploma Graduate or Challenge Day 1",
        chapters: [
            {
                title: "Introduction: The Reality Nobody Talks About",
                readTime: "5 min",
                isHtml: true,
                content: `<div class="ebook-content">
  <!-- AccrediPro Logo Header -->
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-burgundy-600 tracking-wider uppercase">AccrediPro Academy</p>
      <p class="text-xs text-gray-500">Professional E-Book Series</p>
    </div>
  </div>

  <!-- Opening Message -->
  <div class="bg-gradient-to-r from-burgundy-50 to-gold-50 border-l-4 border-burgundy-600 p-6 rounded-r-xl mb-8">
    <p class="text-xl font-semibold text-burgundy-800 italic">
      "Congratulations—you've earned your certification. Now what?"
    </p>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    If you're like most new functional medicine practitioners, you're experiencing a mix of <strong>excitement and terror</strong>. You have the knowledge, but the gap between theory and practice feels enormous.
  </p>

  <!-- Reality Check Box -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-burgundy-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gold-400">The Reality Check</h3>
    </div>
    <p class="text-burgundy-100 mb-4">Here's what nobody tells you in certification programs:</p>
    <ul class="space-y-3">
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">1</span>
        </span>
        <span>Most new practitioners don't see a client for <strong class="text-gold-300">6+ months</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">2</span>
        </span>
        <span>Imposter syndrome is <strong class="text-gold-300">universal</strong>—even among experienced practitioners</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">3</span>
        </span>
        <span>The business side can feel <strong class="text-gold-300">harder than the clinical side</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">4</span>
        </span>
        <span>Your first year will look <strong class="text-gold-300">nothing like you imagined</strong></span>
      </li>
    </ul>
  </div>

  <!-- Author Note -->
  <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">✍️</span>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-2">A Note from the Author</p>
        <p class="text-gray-600 italic">
          "This playbook exists because I wish someone had given me this reality check when I started. I made every mistake in the book so you don't have to."
        </p>
      </div>
    </div>
  </div>

  <!-- What You'll Learn -->
  <div class="mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </span>
      By the End of This Guide, You'll Know:
    </h3>
    <div class="grid gap-3">
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">Exactly what your first year will look like (realistic timeline)</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">The <strong>7 mistakes</strong> that bankrupt new practitioners</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">How to handle difficult conversations with confidence</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">Pricing strategies that <strong>actually work</strong></span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">When and how to say no without guilt</span>
      </div>
    </div>
  </div>

  <!-- Call to Action -->
  <div class="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-6 text-center">
    <p class="text-white text-lg font-medium">
      Ready? Let's begin with the truth about your first year.
    </p>
    <p class="text-burgundy-200 text-sm mt-2">Click "Next" to continue to Chapter 1 →</p>
  </div>

  <!-- Footer Branding -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
            },
            {
                title: "Chapter 1: Your First Year - A Realistic Timeline",
                readTime: "12 min",
                content: `MONTHS 1-3: THE FOUNDATION PHASE

What most practitioners do:
• Panic about getting clients immediately
• Spend money on fancy websites and business cards
• Avoid telling anyone they're a practitioner
• Compare themselves to established practitioners on Instagram

What you should do instead:
• Tell EVERYONE you know what you do (this is marketing)
• Set up a simple way for people to book with you
• Practice your initial consultation on friends/family
• Create one piece of content per week

Reality check: In these first 3 months, focus on confidence, not clients. Every "practice" session counts.

---

MONTHS 4-6: THE TESTING PHASE

What typically happens:
• Your first few clients appear (often from your network)
• You realize consultations take longer than expected
• Pricing feels awkward and uncomfortable
• You second-guess everything

What to expect:
• 2-5 clients (this is normal!)
• Each session will teach you something new
• You'll want to underprice—resist this urge
• Your protocols will evolve rapidly

The truth: These early clients are golden. They'll refer others if you serve them well.

---

MONTHS 7-12: THE MOMENTUM PHASE

If you've laid the groundwork:
• Referrals start coming in
• Your confidence builds noticeably
• You develop your own style and approach
• Systems become more automatic

Warning signs you've skipped steps:
• Still no clients after 9 months
• Clients not returning for follow-ups
• Burning out from over-giving
• Resentful of your pricing

Remember: A slow build is a sustainable build. Fast starts often lead to fast burnouts.`
            },
            {
                title: "Chapter 2: The 7 Mistakes That Bankrupt New Practitioners",
                readTime: "15 min",
                content: `MISTAKE #1: UNDERPRICING YOUR SERVICES

Why it happens:
• Fear of rejection
• Imposter syndrome
• Comparing to others' old pricing
• Not understanding your true value

The reality: Underpricing hurts you AND your clients. When you're underpaid, you subconsciously resent the work. Clients don't value what they don't invest in.

Fix it: Price based on transformation, not time.

---

MISTAKE #2: OVER-DELIVERING TO COMPENSATE

The pattern:
• Two-hour "discovery calls"
• Giving protocols before they pay
• Texting with clients 24/7
• Discounting at the first objection

The damage: You train clients to expect more than you can sustain, then burn out.

Fix it: Clear boundaries from day one. Scope creep kills practices.

---

MISTAKE #3: TRYING TO HELP EVERYONE

Symptoms:
• No clear niche
• Marketing that speaks to nobody
• Attracting clients you can't help
• Exhaustion from context-switching

The truth: Generalists struggle. Specialists thrive.

Fix it: Choose ONE type of client to start. You can expand later.

---

MISTAKE #4: AVOIDING SALES CONVERSATIONS

Hiding behind:
• "I hate being salesy"
• Free content instead of selling
• Hoping clients will just find you
• Never asking for the sale

Reality check: Selling is serving. If you can help someone and don't tell them, you're doing them a disservice.

Fix it: Reframe sales as invitation. Practice makes comfortable.

---

MISTAKE #5: SKIPPING SYSTEMS

The chaos:
• Client notes in random places
• No onboarding process
• Manual scheduling back-and-forth
• Forgetting follow-ups

The cost: Hours lost weekly. Client experience suffers.

Fix it: Set up basic systems BEFORE you need them. Even simple ones help.

---

MISTAKE #6: ISOLATING YOURSELF

Signs:
• Not joining practitioner communities
• Trying to figure everything out alone
• No mentor or peer support
• Avoiding networking

The damage: Slower learning curve. Missed opportunities. Preventable mistakes.

Fix it: Find your people. Even one good mentor changes everything.

---

MISTAKE #7: WAITING UNTIL YOU'RE "READY"

The lie: "Once I get X certification / lose weight / fix my own health / feel confident... THEN I'll start."

The truth: You'll never feel ready. Start before you're ready. Grow as you go.

Fix it: Book your first consultation this week. Imperfect action beats perfect planning.`
            },
            {
                title: "Chapter 3: Scripts for Difficult Conversations",
                readTime: "18 min",
                content: `SCENARIO 1: THE PRICE OBJECTOR

Client: "That's more than I expected to pay."

DON'T say:
• "I can give you a discount"
• "What were you expecting?"
• "I know it's expensive"

DO say:
"I understand—investing in your health is a significant decision. Let me share what makes this program different from what you might have tried before. [Share transformation, not features.] Would it help if we discussed payment options?"

Why this works: You acknowledge without agreeing it's too expensive. You redirect to value. You offer solutions without discounting.

---

SCENARIO 2: THE SCOPE CREEPER

Client: "Can I just text you quick questions between sessions?"

DON'T say:
• "Sure, anytime!"
• "Well, I guess occasionally..."
• (Ignoring texts and hoping they stop)

DO say:
"I love that you're engaged in your health journey! To give you the best support, I've found that questions are most helpful during our scheduled sessions where I can give them proper attention. For urgent concerns between sessions, here's how that works in our program... [explain your policy]"

Why this works: You affirm them, redirect, and establish clear expectations without being harsh.

---

SCENARIO 3: THE NO-SHOW / CHRONIC RESCHEDULE

After the first incident:
"I noticed we missed our appointment yesterday. I hope everything's okay. Since our time together is valuable for your progress, I wanted to share how rescheduling works going forward: [your policy]. Can we find a time that works consistently for your schedule?"

After a pattern:
"I've noticed our last few sessions have been challenging to keep scheduled. I want to make sure this program is the right fit for where you are right now. Can we talk about what's getting in the way?"

Why this works: You address it directly without accusation. You create space for honesty.

---

SCENARIO 4: THE FRIEND/FAMILY WHO WANTS FREE ADVICE

Setting: Thanksgiving dinner, cousin asks about their digestion

DON'T:
• Give a full protocol
• Feel obligated to help
• Get defensive about charging

DO say:
"That sounds frustrating—gut issues can really affect everything. I'd love to help but I can't properly advise without a full consultation. Here's my booking link if you want to set something up. In the meantime, here's one general tip that helps most people: [one simple tip]."

Why this works: You show competence without giving away the store. You create a clear path to paid work.

---

SCENARIO 5: THE CLIENT WHO DOESN'T FOLLOW THROUGH

Client hasn't followed the protocol. Again.

DON'T say:
• "Why didn't you do what I recommended?"
• "This won't work if you don't try"
• (Pretend you didn't notice)

DO say:
"I noticed we haven't made the changes we discussed. That's really common, and it usually means something's getting in the way. What felt hardest about implementing this? I'd rather adjust the plan to something you'll actually do than give you perfect recommendations you can't follow."

Why this works: You normalize the struggle. You collaborate instead of lecture. You get to the real barriers.

Remember: These scripts are starting points. Adapt them to your voice. Practice them until they feel natural.`
            },
            {
                title: "Chapter 4: Pricing That Actually Works",
                readTime: "20 min",
                content: `THE PRICING MINDSET SHIFT

Old thinking: "What do I charge per hour?"
New thinking: "What is the transformation worth?"

Your client isn't buying an hour of your time. They're buying:
• Relief from symptoms that have plagued them for years
• Energy to be present with their family
• Confidence in their health decisions
• Freedom from Google rabbit holes

Price the outcome, not the hour.

---

THE PRICING FRAMEWORK

Step 1: Calculate your minimum sustainable rate
• Monthly expenses (business + personal minimum)
• Divide by hours you can actually work with clients
• This is your FLOOR, not your rate

Step 2: Research the market
• What do similar practitioners charge?
• Note: don't copy their prices, but understand the range

Step 3: Consider the transformation
• How long have they struggled with this?
• What have they already spent trying to fix it?
• What is their health worth to them?

Step 4: Set packages, not hourly rates
• Single sessions trap you in time-for-money
• Packages allow you to deliver transformation
• Packages attract committed clients

---

SAMPLE PRICING STRUCTURE

❌ What NOT to do:
• "60-minute session: $100"
• Discounts for buying multiple sessions
• Different prices for different clients

✅ What TO do:

Discovery Call (15-30 min): FREE
Purpose: Determine if you're a fit. Not a consultation!

Intensive Package (3 months): $997-2,500
Includes:
• Comprehensive initial assessment (90 min)
• Follow-up sessions (6-8)
• Protocol and meal planning
• Limited messaging support
• Resources and guides

Why this works: Clear value. Clear scope. Attracts committed clients.

---

HANDLING PRICE CONVERSATIONS

The consultation isn't about price until they ask about price.

Focus the conversation on:
1. Their current situation (pain points)
2. Where they want to be (goals)
3. What's getting in the way (obstacles)
4. How you can help (your approach)
5. Investment (only after they're excited about working with you)

When price comes up:
• State it confidently
• Stay silent after
• Let them respond
• Don't justify or apologize

If they need time: "I completely understand. Take the time you need. When would you like to follow up?"

---

RAISING YOUR PRICES

When to raise:
• Your calendar is 80%+ full
• You're getting mostly yes's to proposals
• Every 6-12 months (at minimum)

How to raise:
• New clients get new prices immediately
• Existing clients get notice + grandfather period
• Raise by meaningful amounts (not $10)

What to say:
"Starting [date], my investment for new clients will be [new price]. As a current client, you'll have the option to continue at your current rate for [X months], or you can transition to the new program structure when you're ready."

Remember: If no one ever says your prices are too high, you're undercharging.`
            },
            {
                title: "Chapter 5: How to Say No Without Guilt",
                readTime: "15 min",
                content: `WHY SAYING NO IS SAYING YES

Every "yes" to something is a "no" to something else.

When you say yes to:
• The client who drains you → You say no to energy for clients who light you up
• The scope creep → You say no to your boundaries and sustainability
• The project that's not aligned → You say no to opportunities that are

The practitioners who burn out are the ones who can't say no.

---

THE NO FRAMEWORK

Before responding, ask yourself:
1. Does this align with where I want to go?
2. Does this energize me or drain me?
3. Do I have capacity without sacrificing something important?
4. Would I say yes if this were tomorrow?

If the answer isn't a clear yes, it's a no.

---

SCRIPTS FOR SAYING NO

To a potential client who isn't a fit:
"Thank you so much for considering working with me. Based on what you've shared, I don't think I'm the best fit for what you need right now. I'd recommend [referral]. I wish you all the best in your health journey."

To scope creep:
"I appreciate that you're thinking about this! That's outside the scope of our current work together. We could discuss adding that as a separate project, or I can recommend someone who specializes in that area."

To a friend who wants free help:
"I love that you thought of me! I've found that I do my best work in a structured setting where I can give proper attention. Here's my booking link if you'd like to work together properly. In the meantime, [one general tip]."

To the last-minute request:
"I'm not able to accommodate that timeline. I could do [alternative] or we could revisit this [when you have capacity]."

To the opportunity that's not aligned:
"Thank you so much for thinking of me for this. I'm focusing my energy in a different direction right now, so I'll have to pass. Best of luck with the project!"

---

HANDLING GUILT

The guilt comes from:
• Not wanting to disappoint people
• Fear of missing out
• Feeling like you "should" help everyone
• Confusing your value with your output

Reframe the guilt:
• "My no creates space for someone else's yes"
• "I'm honoring my boundaries, which models healthy behavior"
• "I can't pour from an empty cup"
• "They'll find the right fit, even if it's not me"

---

PRACTICE EXERCISE

This week, say no to one thing you'd normally say yes to out of obligation.

Notice:
• How uncomfortable it feels initially
• How much relief comes after
• How the world doesn't end
• How you have more energy for what matters

The more you practice, the easier it gets.

Remember: The most successful practitioners are the ones who have mastered the strategic no.`
            },
            {
                title: "Chapter 6: Building Sustainable Systems",
                readTime: "15 min",
                content: `SYSTEMS VS. CHAOS

Without systems:
• You reinvent the wheel with every client
• Important follow-ups slip through cracks
• Your brand feels inconsistent
• You work harder, not smarter

With systems:
• Client experience is consistent and professional
• You save hours weekly on admin
• You can focus on what only you can do
• Scaling becomes possible

The goal: Build systems that handle the repeatable so you can focus on the personal.

---

ESSENTIAL SYSTEMS FOR PRACTITIONERS

1. CLIENT ONBOARDING SYSTEM
• Automated welcome sequence
• Intake forms that collect what you need
• Pre-session prep (what they should do before meeting)
• Clear expectations set upfront

2. SCHEDULING SYSTEM
• Online booking (essential)
• Automated reminders (24-48 hours before)
• Clear cancellation policy
• Buffer time between sessions

3. DOCUMENTATION SYSTEM
• Session notes template
• Protocol tracking
• Client progress notes
• Secure storage (HIPAA if applicable)

4. FOLLOW-UP SYSTEM
• Check-in templates
• Milestone reminders
• Re-engagement sequences for past clients
• Referral request timing

5. CONTENT SYSTEM
• Content calendar (even simple)
• Templates for common posts
• Repurposing workflow
• Batch creation schedule

---

BUILDING YOUR FIRST SYSTEM

Start simple. Here's your first week:

Day 1: Set up online scheduling
• Calendly, Acuity, or similar
• Set your available hours
• Add buffer time
• Include intake questions in the booking

Day 2: Create an intake form
• Basic health history
• Current concerns
• Goals
• What they've already tried

Day 3: Write your welcome email template
• What to expect
• How to prepare
• Logistics
• Your cancellation policy

Day 4: Create a session notes template
• Current symptoms
• Protocol changes
• Action items
• Next session plan

Day 5: Set up automated reminders
• 48-hour reminder
• 24-hour reminder
• Post-session follow-up

That's it. Five days, five systems. You'll refine as you go.

---

THE 80/20 OF SYSTEMS

Focus your system energy on:
• What you do repeatedly (onboarding, follow-ups)
• Where you lose time (scheduling, note-taking)
• Where clients get confused (expectations, logistics)
• Where things fall through cracks (follow-ups)

Don't over-engineer. A simple system you use beats a complex system you avoid.

Remember: Systems are living. Build the minimum viable version, then iterate.`
            },
            {
                title: "Chapter 7: Finding Your People",
                readTime: "12 min",
                content: `WHY COMMUNITY MATTERS

Solo practice doesn't mean solo journey.

Without community:
• Every problem feels unique (it's not)
• Learning curve is slower
• Isolation breeds imposter syndrome
• Mistakes are repeated

With community:
• Shared wisdom accelerates growth
• Accountability keeps you consistent
• Referrals flow naturally
• Support through the hard seasons

The practitioners who thrive have people behind them.

---

TYPES OF SUPPORT TO BUILD

1. MENTOR (1-2)
Someone further along who can guide you
• Shortens your learning curve
• Provides perspective on big decisions
• Holds you to higher standards
• Worth paying for

2. PEERS (3-5)
Practitioners at similar stages
• Shared struggles and wins
• Accountability partners
• Referral exchange
• Safe space to vent

3. COMMUNITY (many)
Broader practitioner communities
• Varied perspectives
• Resource sharing
• Opportunities you'd miss alone
• Normalizes the journey

4. NON-PRACTITIONER SUPPORT
Friends, family, partner
• Remind you there's life outside work
• Celebrate wins
• Ground you when work gets consuming
• Don't understand the details (and that's okay)

---

FINDING YOUR PEOPLE

Where to look:
• Certification program alumni groups
• Professional associations
• Online communities (Facebook, Slack, etc.)
• Local practitioner meetups
• Conferences and workshops

How to connect:
• Give before you take
• Be genuinely curious about others
• Share your struggles (vulnerability builds connection)
• Follow up (most people don't)
• Offer to help before asking for help

Red flags:
• Communities that only celebrate wins
• Groups with lots of judgment
• Spaces dominated by one voice
• Communities that feel like competition, not collaboration

---

BUILDING YOUR INNER CIRCLE

Quality over quantity. You need:
• One person you can call when things go wrong
• One person who will celebrate your wins without jealousy
• One person who will tell you hard truths
• One person who's been where you're going

These might be the same person or different people. Find them intentionally.

Action: This month, reach out to three practitioners. Ask for a virtual coffee. See who resonates.

Remember: Your network is your net worth in this field. Invest in it.`
            },
            {
                title: "Chapter 8: Your First 30 Days - Action Plan",
                readTime: "10 min",
                content: `YOUR 30-DAY LAUNCH PLAN

Day 1-7: FOUNDATION
□ Set up online scheduling system
□ Create simple intake form
□ Write welcome email template
□ Define your ideal client (one paragraph)
□ Tell 10 people what you do (practice your pitch)

Day 8-14: PRESENCE
□ Set up basic online presence (even just social profile update)
□ Write your "About" page/bio
□ Create one piece of helpful content
□ Join one practitioner community
□ Reach out to one potential mentor

Day 15-21: PRACTICE
□ Book 2-3 practice sessions (friends/family)
□ Refine your consultation flow
□ Create your session notes template
□ Get feedback from practice clients
□ Adjust based on what you learned

Day 22-28: LAUNCH
□ Make your first public post about your services
□ Reach out to 5 people who might know your ideal client
□ Set your prices (don't overthink)
□ Create your first offer/package
□ Book your first real consultation

Day 29-30: REFLECT
□ What worked this month?
□ What felt harder than expected?
□ What will you do differently next month?
□ Who do you need to support you?
□ What's your one focus for next month?

---

DAILY HABITS FOR SUCCESS

Morning:
• Review your schedule
• Set your top 3 priorities
• One act of visibility (post, email, outreach)

Weekly:
• Review client notes
• Batch content creation
• Community engagement
• Learning time

Monthly:
• Financial review
• Client feedback review
• System improvements
• Peer connection/accountability

---

YOUR FIRST YEAR FOCUS AREAS

Q1: Foundation
• Build basic systems
• Get practice clients
• Find your community
• Establish your niche

Q2: Momentum
• Consistent content
• First paying clients
• Refine your process
• Develop your voice

Q3: Growth
• Increase prices
• Expand services
• Deepen expertise
• Build referral relationships

Q4: Optimization
• Streamline systems
• Evaluate what's working
• Plan for year two
• Celebrate progress

---

FINAL THOUGHTS

You chose this path because you want to help people. That calling matters.

The business side can feel overwhelming, but it's learnable. Every successful practitioner started exactly where you are now.

Progress over perfection. Done is better than perfect. Imperfect action beats perfect planning.

Your first client is out there, waiting for exactly what you have to offer.

Go find them.

Welcome to the practitioner life. You've got this.`
            }
        ]
    },
    {
        id: "scope-ethics-guide",
        title: "Scope of Practice & Ethics Guide",
        subtitle: "Protecting Yourself While Helping Clients",
        description: "Navigate the legal and ethical landscape of functional medicine practice. Know exactly what you can and cannot do, say, and recommend.",
        valueProp: "One wrong word can end your career—here's how to stay safe.",
        author: "AccrediPro Academy",
        pages: 48,
        icon: "⚖️",
        category: "core",
        topics: ["Legal Boundaries", "Scope of Practice", "Documentation", "Liability Protection"],
        readTime: "2 hours",
        unlockedDate: "2024-12-01",
        isFree: true,
        unlockCondition: "Mini Diploma Graduate or Challenge Day 4",
        chapters: [
            {
                title: "Introduction: Why Scope Matters",
                readTime: "6 min",
                content: `One wrong word can end your career before it starts.

This guide exists because:
• Regulations are confusing and vary by state
• Certification programs often don't cover this adequately
• The consequences of mistakes are severe
• Good practitioners get in trouble for innocent mistakes

What's at stake:
• Cease and desist letters
• Fines and penalties
• License issues (if licensed)
• Lawsuits
• Professional reputation
• Criminal charges (in extreme cases)

---

THE GOOD NEWS

You can help people powerfully within your scope:
• Nutrition guidance
• Lifestyle recommendations
• Health education
• Emotional support
• Accountability and coaching
• Supplement recommendations (in most states)

The key is knowing where the lines are.

This guide will help you:
• Understand your scope clearly
• Communicate appropriately
• Document properly
• Protect yourself while serving clients
• Know when and how to refer

---

DISCLAIMERS ABOUT THIS GUIDE

This guide provides general education, not legal advice.

• Laws vary by state and change frequently
• Check your specific state's regulations
• Consult with a healthcare attorney if needed
• Your certification body may have specific guidelines

When in doubt, err on the side of caution.`
            },
            {
                title: "Chapter 1: What You CAN and CANNOT Do",
                readTime: "15 min",
                content: `THE BIG LINE: DIAGNOSING AND TREATING

CANNOT do (without appropriate license):
• Diagnose disease or medical conditions
• Prescribe medications
• Order medical tests (in most states)
• Treat disease
• Claim to cure anything

CAN do (with appropriate training):
• Provide nutrition education
• Make dietary recommendations
• Suggest lifestyle modifications
• Recommend supplements
• Order and interpret functional tests (varies by state)
• Support clients in implementing changes
• Work alongside medical providers

---

LANGUAGE MATTERS

AVOID saying:
• "You have SIBO" → "Your symptoms suggest possible SIBO"
• "This will cure your..." → "Many people find relief from..."
• "Take this for your diabetes" → "This nutrient supports healthy blood sugar"
• "You don't need your medication" → "Work with your doctor about your medications"
• "I'm treating your condition" → "I'm supporting your wellness journey"

USE instead:
• "Based on your symptoms..."
• "Research suggests..."
• "Many clients experience..."
• "This may support..."
• "Consider discussing with your doctor..."

---

STATE-SPECIFIC CONSIDERATIONS

Some states have:
• Specific credentials required to give nutrition advice
• Restrictions on supplement recommendations
• Rules about ordering/interpreting tests
• Differences in what's considered "practicing medicine"

Research YOUR state:
• State dietetic licensing laws
• Health coach scope laws (if any)
• Naturopathic practice laws (if applicable)
• Medical practice definitions

When in doubt, contact:
• Your certification body
• State regulatory boards
• Healthcare attorney familiar with your state

---

SPECIFIC SCOPE SCENARIOS

SCENARIO: Client asks about their medication
CAN: "I recommend discussing your medications with your prescribing doctor. I'm not qualified to advise on medications."
CANNOT: "You don't need that medication" or "That medication is causing your problems"

SCENARIO: Client wants a diagnosis
CAN: "Your symptoms suggest you might want to discuss [condition] with your doctor for proper diagnosis."
CANNOT: "You have [condition]"

SCENARIO: Client brings lab work
CAN: Review, educate about what markers mean, suggest nutritional support for patterns you see
CANNOT: Diagnose based on labs or replace medical interpretation

SCENARIO: Client asks what to take for their disease
CAN: "For general wellness support, these nutrients are often helpful for [system]. But for your specific condition, please work with your healthcare provider."
CANNOT: "Take this for your [disease]"

---

THE SAFE PHRASE FRAMEWORK

Structure your recommendations as:
"[Nutrient/approach] may support [body system/function]. Many people find [benefit]. This is for general wellness and doesn't replace medical advice for your specific condition."

Example:
"Omega-3s may support healthy inflammatory response. Many people find they support joint comfort and brain function. This is for general wellness and doesn't replace treatment for any specific condition. You might want to discuss this with your doctor if you're on any medications."

This keeps you in education/wellness space, not treatment space.`
            },
            {
                title: "Chapter 2: Documentation That Protects You",
                readTime: "12 min",
                content: `WHY DOCUMENTATION MATTERS

Good documentation:
• Creates a record of what you did and why
• Shows you stayed within scope
• Protects you if questions arise
• Helps track client progress
• Demonstrates professionalism

Poor documentation (or none):
• "He said, she said" situations
• No proof of appropriate practice
• Harder to defend your decisions
• Looks unprofessional

---

WHAT TO DOCUMENT

For every client interaction:

1. DATE AND TIME
2. CHIEF COMPLAINT/FOCUS
What is the client's main concern?

3. ASSESSMENT/OBSERVATIONS
• What you observed (not diagnosed)
• Client's reported symptoms
• Relevant history discussed

4. PLAN/RECOMMENDATIONS
• Dietary suggestions
• Lifestyle recommendations
• Supplements suggested
• Referrals made
• Follow-up plan

5. DISCLAIMERS NOTED
• Document that you provided appropriate disclaimers
• Note any referrals to medical providers

6. CLIENT AGREEMENTS
• Consent forms signed
• Scope of practice discussed
• Policies acknowledged

---

DOCUMENTATION EXAMPLES

GOOD documentation:
"Client reports ongoing digestive discomfort including bloating after meals and irregular bowel movements. Discussed potential role of diet and lifestyle factors. Recommended keeping food diary for 2 weeks, increasing water intake, and trying a basic elimination of common triggers. Suggested client follow up with MD for medical evaluation if symptoms persist. Provided general education on gut health. Client agreed to follow up in 2 weeks."

POOR documentation:
"Client has IBS. Put her on gut healing protocol."

See the difference?

---

INTAKE FORMS

Essential components:
• Health history
• Current medications (inform that this is for awareness, not medical management)
• Current symptoms
• Goals for working together
• Informed consent
• Scope of practice acknowledgment
• Privacy policy
• Cancellation/refund policy

Include statement:
"I understand that [Your Name] is not a licensed physician and does not diagnose or treat disease. The services provided are for general wellness education and support. I will continue to work with my healthcare providers for medical care."

---

ONGOING DOCUMENTATION

Session notes:
• Keep for at least 7 years (check your state)
• Store securely (HIPAA considerations)
• Back up regularly
• Use consistent format

Progress tracking:
• Client-reported changes
• Goals and progress toward them
• Protocol modifications and reasons
• Any concerns noted

Referrals:
• Document when you recommend medical care
• Document if client declines
• Document any red flags you observed

---

DIGITAL DOCUMENTATION

If using electronic systems:
• Ensure HIPAA compliance if in US
• Use secure, encrypted platforms
• Have data backup procedures
• Understand who has access
• Include privacy policy in agreements

Free/cheap options may not be compliant. Invest in proper systems.`
            },
            {
                title: "Chapter 3: Real Scenarios with Guidance",
                readTime: "15 min",
                content: `SCENARIO 1: The Self-Diagnoser

Client says: "I know I have Hashimoto's. What supplements should I take?"

WRONG response:
"For your Hashimoto's, you should take selenium, zinc, and vitamin D."

RIGHT response:
"Has Hashimoto's been diagnosed by your doctor? If so, there are nutrients that generally support thyroid health that you might discuss with them. If you haven't been formally diagnosed, I'd recommend getting proper testing first. I can suggest a thyroid panel to ask about and share general information about supporting thyroid health through diet and lifestyle."

Why it matters: You didn't diagnose or claim to treat their condition. You educated and empowered.

---

SCENARIO 2: The Medication Questioner

Client says: "I want to stop my cholesterol medication. Can I use supplements instead?"

WRONG response:
"Sure, red yeast rice is basically the same thing. You can switch."

RIGHT response:
"That's a decision to make with your prescribing doctor—I can't advise on medications. What I can do is share information about diet and lifestyle approaches that support healthy cholesterol levels, which you could then discuss with your doctor as part of an overall strategy. Many people find these approaches helpful alongside medical care."

Why it matters: You didn't interfere with medical treatment or make claims about supplements replacing medication.

---

SCENARIO 3: The Urgent Symptoms

Client reports: Blood in stool, unintended weight loss, severe pain

RIGHT response:
"These symptoms need immediate medical evaluation. Please contact your doctor or go to urgent care today. Once you've been medically cleared, I'm happy to support your wellness journey."

Document: "Client reported [symptoms]. Referred to medical provider immediately. Declined to provide further wellness recommendations until client has been medically evaluated."

Why it matters: Some symptoms are red flags. Referring isn't failure—it's essential.

---

SCENARIO 4: The Lab Interpreter

Client brings lab work: "What does this mean? My doctor said everything was normal but I still feel terrible."

WRONG response:
"Your TSH of 3.5 means you have hypothyroidism. Your doctor missed it."

RIGHT response:
"I can share some general education about what these markers represent and optimal ranges that some practitioners use. However, I can't diagnose based on labs. If you feel your concerns aren't being heard, you might consider seeking a second medical opinion or finding a doctor who does more comprehensive thyroid testing. I can share what a full thyroid panel looks like if you'd like to discuss that with your doctor."

Why it matters: You educated without diagnosing or undermining their doctor.

---

SCENARIO 5: The Friend of a Client

Someone messages: "I heard you helped my friend with her gut issues. I have the same problem. What should I take?"

WRONG response:
"Oh, for that I usually recommend [protocol]."

RIGHT response:
"Thanks for reaching out! Every person's situation is different, so I wouldn't be able to recommend anything without proper consultation. If you'd like to book a session, I'd be happy to learn more about your situation and see how I can help support your wellness goals. Here's my booking link."

Why it matters: You didn't give advice without proper consultation or imply everyone gets the same thing.

---

SCENARIO 6: Social Media

You want to post about a supplement that helped a client's acne.

WRONG post:
"This supplement clears acne! DM me to get yours!"

RIGHT post:
"Skin issues can sometimes be connected to gut health and nutrient status. I love supporting clients in exploring these connections. Disclaimer: This is for education only and isn't intended to diagnose, treat, or cure any condition."

Why it matters: Claims about treating conditions = trouble. Education about connections = appropriate.

---

THE GOLDEN RULES

1. When in doubt, refer out
2. Educate, don't diagnose
3. Support wellness, don't treat disease
4. Document everything
5. Never interfere with medical care
6. Be honest about your scope
7. Get it in writing (consent, policies)

These rules will protect you 99% of the time.`
            }
        ]
    },
    {
        id: "your-first-client-overview",
        title: "Your First Client (Overview Edition)",
        subtitle: "A Sneak Peek at Landing Your First Paying Client",
        description: "Get a taste of what it takes to attract, convert, and serve your first paying client. This lite overview gives you the framework—the full guide is unlocked when you're ready to take action.",
        valueProp: "Your first client is closer than you think—here's the roadmap.",
        author: "AccrediPro Academy",
        pages: 24,
        icon: "🎯",
        category: "core",
        topics: ["Client Acquisition", "First Steps", "Confidence Building", "Action Plan"],
        readTime: "45 min",
        unlockedDate: "2024-12-10",
        isFree: true,
        unlockCondition: "Challenge Day 3 or Day 5",
        chapters: [
            {
                title: "Introduction: Your First Client is Waiting",
                readTime: "5 min",
                isHtml: true,
                content: `<div class="ebook-content">
  <!-- AccrediPro Logo Header -->
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-burgundy-600 tracking-wider uppercase">AccrediPro Academy</p>
      <p class="text-xs text-gray-500">Overview Edition</p>
    </div>
  </div>

  <!-- Opening Message -->
  <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8">
    <p class="text-xl font-semibold text-emerald-800 italic">
      "The hardest part isn't getting good at what you do—it's getting started."
    </p>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    You've completed your training. You know the theory. But there's a gap between <strong>knowing</strong> and <strong>doing</strong>.
  </p>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    This overview is your first step across that gap. We're going to show you the exact path to your first paying client—no fluff, no theory, just actionable steps.
  </p>

  <!-- What's Inside Box -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">🎯</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">What's In This Overview</h3>
    </div>
    <ul class="space-y-3">
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">1</span>
        </span>
        <span>The <strong class="text-gold-300">3-Step Framework</strong> for finding clients</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">2</span>
        </span>
        <span>The <strong class="text-gold-300">#1 mindset shift</strong> that changes everything</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">3</span>
        </span>
        <span>Your <strong class="text-gold-300">7-Day Action Plan</strong> to get started</span>
      </li>
    </ul>
  </div>

  <!-- Reality Check -->
  <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">💡</span>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-2">This is an Overview Edition</p>
        <p class="text-gray-600">
          This lite version gives you the core framework. The full "Your First Client" guide with scripts, templates, and deep-dive strategies is available in the Professional Library.
        </p>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
    <p class="text-white text-lg font-medium">
      Ready to meet your first client? Let's build your foundation.
    </p>
    <p class="text-emerald-100 text-sm mt-2">Click "Next" to learn the 3-Step Framework →</p>
  </div>
</div>`
            },
            {
                title: "Chapter 1: The 3-Step Framework",
                readTime: "8 min",
                content: `THE SIMPLE TRUTH ABOUT GETTING CLIENTS

Forget everything you've heard about "building funnels" and "scaling your business."

Your first client doesn't come from:
• A perfect website
• A huge social media following
• Expensive ads
• Complex marketing systems

Your first client comes from: CONVERSATIONS.

---

THE 3-STEP FRAMEWORK

STEP 1: VISIBILITY
People can't hire you if they don't know you exist.

This doesn't mean "going viral" or posting constantly.
It means: letting the people who already know you understand what you do now.

Simple actions:
• Update your social media bio
• Tell 10 people this week what you do
• Post ONE helpful thing on social media
• Add your new work to your email signature

---

STEP 2: VALUE
Before someone pays you, they need to trust you can help them.

Give value BEFORE asking for anything:
• Share helpful tips (not full protocols)
• Answer questions in communities
• Offer insight, not overwhelm
• Be genuinely helpful, not "salesy"

The goal: When they think of [your specialty], they think of YOU.

---

STEP 3: INVITATION
Most new practitioners wait to be "found."

The ones who succeed? They invite people in.

This isn't pushy. It's service.

"Hey, I've started working with clients on [specific issue]. If you know anyone struggling with [symptom], I'd love to help. Feel free to pass along my info."

That's it. Simple. Direct. Effective.

---

THE FORMULA

Visibility + Value + Invitation = Clients

Skip any step, and you'll struggle.
• Visibility without value = people see you but don't trust you
• Value without invitation = people love your content but don't know they can hire you
• Invitation without visibility = nobody sees your offer

All three together? Your first client is inevitable.`
            },
            {
                title: "Chapter 2: The Mindset Shift",
                readTime: "6 min",
                content: `THE #1 THING HOLDING YOU BACK

It's not your skills.
It's not your certification.
It's not your lack of experience.

It's this thought: "Who am I to help someone?"

---

IMPOSTER SYNDROME IS UNIVERSAL

Every practitioner you admire?
They felt exactly like you do now.

The difference: They started anyway.

Here's what you need to understand:
• You don't need to know everything
• You need to know MORE than your client about their issue
• You DO. You've been trained.

---

THE REFRAME

Old thinking: "I'm not ready."
New thinking: "Someone needs what I know RIGHT NOW."

Old thinking: "What if I mess up?"
New thinking: "What if I help them change their life?"

Old thinking: "I need more training first."
New thinking: "I need more PRACTICE, which means I need CLIENTS."

---

THE TRUTH ABOUT EXPERTISE

Your clients don't need a guru.
They need someone a few steps ahead who genuinely cares.

That's you.

You've invested in learning. You've done the work.
Now it's time to USE it.

---

YOUR FIRST CLIENT DOESN'T NEED YOU TO BE PERFECT

They need you to:
• Listen
• Care
• Apply what you've learned
• Be honest about what you know and don't know

That's it. You can do all of those things TODAY.

---

PERMISSION GRANTED

Consider this your permission slip:
• You ARE ready enough
• You CAN help people
• You SHOULD start now
• You WILL figure it out as you go

Every expert was once a beginner.
Your journey starts with one client.`
            },
            {
                title: "Chapter 3: Your 7-Day Action Plan",
                readTime: "7 min",
                content: `7 DAYS TO YOUR FIRST CLIENT CONVERSATION

This isn't about getting a paying client in 7 days.
It's about building momentum and opening doors.

---

DAY 1: DECLARE IT
• Tell 3 people today: "I'm now taking clients for [specialty]"
• Update your social media bio
• Write down: "My ideal client is [describe them]"

Why it matters: You can't get clients for something people don't know you do.

---

DAY 2: PLANT SEEDS
• Post something helpful on social media related to your specialty
• Send a message to someone who might know your ideal client
• Text: "Hey! I've started helping people with [issue]. If you hear of anyone struggling with this, would you pass along my info?"

Why it matters: Your first client likely comes from your network or their network.

---

DAY 3: ADD VALUE
• Answer a question in a Facebook group or community
• Share a quick tip on social media
• Help someone without expecting anything back

Why it matters: Value builds trust. Trust leads to clients.

---

DAY 4: SHOW YOUR FACE
• Go live for 60 seconds sharing one tip
• OR record a short video/voice note and share it
• OR write a longer post sharing your story

Why it matters: People hire people. They need to see YOU.

---

DAY 5: FOLLOW UP
• Re-reach out to the people from Day 2
• "Hey! Just following up—any thoughts on what I mentioned?"
• Don't be afraid to be "annoying." Most people just forgot.

Why it matters: Fortune is in the follow-up. Period.

---

DAY 6: MAKE AN OFFER
• Create a simple offer: "I'm taking 3 clients for [X]. Here's what's included..."
• Share it somewhere: social media, email, text to your network
• Include a clear next step: "Book a call here" or "DM me 'interested'"

Why it matters: People can't buy what you're not selling.

---

DAY 7: REFLECT & REPEAT
• What worked this week?
• What felt hard?
• Who responded positively?
• What will you do next week?

Why it matters: Progress beats perfection. Keep going.

---

WHAT HAPPENS NEXT

If you followed these steps, you've likely had at least one conversation.

That conversation might become a client.
Or it might lead to someone who becomes a client.

Either way, you've started. That's everything.

---

READY FOR MORE?

This overview gave you the framework.

The full "Your First Client" guide includes:
• Word-for-word scripts for every conversation
• Templates for your offers and follow-ups
• The exact discovery call framework
• How to handle objections with confidence
• Advanced strategies for consistent client flow

Available in the Professional Library when you're ready to go deeper.

Your first client is waiting. Now go find them.`
            }
        ]
    },
    // FLAGSHIP FREE GUIDE - $5K/Month Realistic Guide
    {
        id: "5k-month-realistic-guide",
        title: "The $5K/Month Realistic Guide",
        subtitle: "Your First Clients Without Social Media Overwhelm",
        description: "The step-by-step roadmap to earning $5,000/month as a health practitioner—without needing a huge following, fancy website, or expensive ads. Built for beginners who want real results.",
        valueProp: "What if 5 clients/month could change your life?",
        author: "AccrediPro Academy",
        pages: 78,
        icon: "💰",
        category: "core",
        topics: ["Income Strategy", "Client Acquisition", "Pricing", "Action Plan"],
        readTime: "3-4 hours",
        unlockedDate: "2024-12-13",
        isFree: true,
        unlockCondition: "Challenge Completion or Mini Diploma Graduate",
        chapters: [
            {
                title: "Introduction: Why $5K is the Magic Number",
                readTime: "8 min",
                isHtml: true,
                content: `<div class="ebook-content">
  <!-- AccrediPro Logo Header -->
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-emerald-600 tracking-wider uppercase">AccrediPro Academy</p>
      <p class="text-xs text-gray-500">Flagship FREE Guide</p>
    </div>
  </div>

  <!-- Opening Message -->
  <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8">
    <p class="text-xl font-semibold text-emerald-800 italic">
      "What if just 5 clients per month could change your entire life?"
    </p>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    This isn't a "scale to 6 figures" hustle guide. This is the <strong>realistic, step-by-step path</strong> to your first $5,000/month as a health practitioner.
  </p>

  <!-- Why $5K Box -->
  <div class="bg-emerald-900 text-white rounded-2xl p-6 mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">💰</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Why $5,000/Month?</h3>
    </div>
    <ul class="space-y-3">
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It's <strong class="text-gold-300">achievable</strong> with just 4-6 clients</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It replaces most <strong class="text-gold-300">full-time jobs</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It proves your <strong class="text-gold-300">business works</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It's the <strong class="text-gold-300">foundation</strong> for everything bigger</span>
      </li>
    </ul>
  </div>

  <!-- The Math -->
  <div class="bg-white border-2 border-emerald-200 rounded-2xl p-6 mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">📊</span>
      The Simple Math
    </h3>
    <div class="grid grid-cols-2 gap-4 text-center">
      <div class="bg-emerald-50 rounded-xl p-4">
        <p class="text-3xl font-bold text-emerald-700">5</p>
        <p class="text-sm text-gray-600">Clients per month</p>
      </div>
      <div class="bg-emerald-50 rounded-xl p-4">
        <p class="text-3xl font-bold text-emerald-700">$1,000</p>
        <p class="text-sm text-gray-600">Per client package</p>
      </div>
    </div>
    <div class="mt-4 text-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white">
      <p class="text-2xl font-bold">= $5,000/month</p>
      <p class="text-sm text-emerald-100">That's it. No complicated funnels.</p>
    </div>
  </div>

  <!-- What's Inside -->
  <div class="mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn in This Guide:</h3>
    <div class="grid gap-3">
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">The <strong>exact pricing formula</strong> for $1,000+ packages</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">Where your first 5 clients are <strong>already hiding</strong></span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">How to <strong>close consultations</strong> without being salesy</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">The <strong>30-day action plan</strong> to hit $5K</span>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
    <p class="text-white text-lg font-medium">
      Ready to build your $5K/month foundation?
    </p>
    <p class="text-emerald-100 text-sm mt-2">Click "Next" to start with the mindset shift →</p>
  </div>
</div>`
            },
            {
                title: "Chapter 1: The Mindset Shift — Stop Thinking Like an Employee",
                readTime: "10 min",
                content: `THE BIGGEST MISTAKE NEW PRACTITIONERS MAKE

You've been trained to think like an employee:
• Trade time for money
• Wait to be given opportunities
• Undervalue your expertise
• Need "permission" to charge

This mindset will keep you stuck forever.

---

THE PRACTITIONER MINDSET

✓ You solve problems worth paying for
✓ Your value isn't your time—it's your transformation
✓ Clients are LOOKING for you (you just need to be visible)
✓ Charging well is an act of service, not selfishness

When you charge $150/hour, you attract tire-kickers.
When you charge $1,000 for a transformation, you attract committed clients.

---

WHY UNDERCHARGING HURTS EVERYONE

When you undercharge:
• You resent the work
• Clients don't take it seriously
• You burn out faster
• You can't sustain your practice

When you charge appropriately:
• Clients are invested and follow through
• You have energy to show up fully
• You can afford to keep learning
• Your business is sustainable

---

THE PERMISSION YOU NEED

Here it is: You're allowed to make money helping people.

In fact, you're supposed to.

How else will you:
• Keep your practice running?
• Continue your education?
• Be present for clients long-term?
• Actually make this a career?

Charging is not optional. It's essential.

---

REFRAME: SERVICE, NOT SALES

Old thought: "I feel guilty asking for money"
New thought: "If I can help them, not offering is a disservice"

Old thought: "I'm not experienced enough to charge that"
New thought: "My clients pay for the transformation, not my resume"

Old thought: "What if they can't afford it?"
New thought: "My ideal clients can. Others aren't my clients."

---

YOUR FIRST ASSIGNMENT

Write this down and put it somewhere you'll see daily:

"I help people transform their health.
That transformation is valuable.
Charging for it is an act of service."

Believe it. Live it. Build from it.`
            },
            {
                title: "Chapter 2: The Math Behind $5K (It's Simpler Than You Think)",
                readTime: "8 min",
                content: `LET'S DO THE MATH

$5,000/month can happen many ways:

OPTION A: 5 clients × $1,000 package
OPTION B: 10 clients × $500 package
OPTION C: 4 clients × $1,250 package
OPTION D: 3 clients × $1,667 package

Which sounds more sustainable?

---

WHY FEWER, HIGHER-VALUE CLIENTS WIN

5 clients at $1,000 means:
• 5 discovery calls per month (maybe 10-15 to get 5 yeses)
• 5 intensive client relationships
• Time to deliver exceptional results
• Referrals from happy clients

50 clients at $100 means:
• Constant hustling for new leads
• Shallow relationships
• No time for exceptional work
• Burnout city

---

THE $1,000 PACKAGE BREAKDOWN

What justifies $1,000?

Example 3-Month Package:
• Initial 90-min comprehensive consultation ($300 value)
• 6 follow-up sessions at 45 min each ($600 value)
• Custom protocol development ($200 value)
• Email/message support ($200 value)
• Resource library access ($100 value)
• Supplement guidance ($100 value)

Total perceived value: $1,500+
Your price: $997-1,200

This isn't expensive. It's VALUABLE.

---

THE REAL QUESTION

Would you pay $1,000 to:
• Finally understand your health?
• Have a guide through your healing journey?
• Stop guessing and start progressing?
• Have someone in your corner for 3 months?

Your future clients would. And will.

---

YOUR PRICING WORKSHEET

Calculate your own numbers:

Target monthly income: $______
Package price: $______
Clients needed per month: ______

Example:
$5,000 ÷ $1,000 = 5 clients

That's one client per week, plus one more.

Suddenly $5K doesn't seem impossible, does it?`
            },
            {
                title: "Chapter 3: Finding Clients in Your Existing Network",
                readTime: "12 min",
                content: `YOUR FIRST CLIENTS ARE NOT STRANGERS

Here's the secret nobody tells you:

Your first 5 clients are probably people who already know you exist.

They're:
• Friends of friends who've heard you talking about health
• Family members who've seen your journey
• Acquaintances who've asked for your advice before
• Social media followers who've engaged with your content
• Former colleagues who know you changed careers

---

THE "WHO DO I KNOW?" EXERCISE

Make a list of:

1. People who've asked you health questions before
2. People who've commented on your health journey
3. People who you know are struggling with health issues
4. People in your network who might know your ideal client
5. Anyone who's said "let me know when you're taking clients"

This list is GOLD. Don't skip it.

---

THE WARM OUTREACH SCRIPT

Don't be salesy. Be helpful.

"Hey [Name]! I'm officially taking clients now for [specialty].
I remembered you mentioned struggling with [issue] a while back.
If that's still going on, I'd love to chat and see if I can help.
No pressure either way—just wanted you to know I'm here!"

Simple. Direct. Not pushy.

---

THE REFERRAL ASK

Even if someone doesn't need your help:

"Hey [Name]! I'm now helping people with [issue].
Do you know anyone who might be struggling with this?
I'd really appreciate any introductions—and they'd get
a free consultation to see if we're a good fit."

Most people WANT to help. You just have to ask.

---

THE COMMUNITY TAP

Where do you already hang out?

• Church/spiritual community
• Kids' school parent groups
• Hobby groups (running club, book club, etc.)
• Professional networks
• Online communities you're part of

These people already know and trust you.

---

ACTION STEPS

This week:
1. Make your "warm list" of 20+ people
2. Send 5 genuine outreach messages
3. Post ONE thing about what you do on social media
4. Ask 3 people for referrals

Your first client is closer than you think.`
            },
            {
                title: "Chapter 4: The Discovery Call That Converts",
                readTime: "15 min",
                content: `THE DISCOVERY CALL IS NOT A CONSULTATION

Biggest mistake: Giving away the consultation for free.

The discovery call is:
✓ 15-20 minutes MAX
✓ To determine if you're a fit
✓ To understand their situation
✓ To share how you work
✓ To invite them to the paid program

It is NOT:
✗ A full health history
✗ Protocol recommendations
✗ Free coaching
✗ An hour of your time

---

THE DISCOVERY CALL FRAMEWORK

MINUTE 0-2: Build rapport
"Thanks so much for booking! How are you doing today?"

MINUTE 2-7: Understand their situation
"Tell me what's going on with your health right now."
"How long has this been happening?"
"What have you tried so far?"

MINUTE 7-12: Paint the future
"What would it look like if this was resolved?"
"What would change in your life?"

MINUTE 12-17: Share your approach
"Based on what you've shared, here's how I work..."
"My [X-month] program is designed for exactly this..."

MINUTE 17-20: The invitation
"Do you have any questions about the program?"
"Would you like to move forward?"

---

HANDLING "HOW MUCH?"

When they ask about price (they will):

"The investment for my 3-month program is $997.
This includes [brief overview of what's included].

Many clients find that finally solving this issue
is worth far more than the investment.

Does that feel like it could work for you?"

Then STOP TALKING. Let them respond.

---

HANDLING "I NEED TO THINK ABOUT IT"

"Of course—this is an important decision.
What specifically do you want to think about?
Sometimes I can help clarify right now."

Often, they have a specific question or objection.
Address it directly.

---

HANDLING "IT'S TOO EXPENSIVE"

"I understand—investing in health is a significant decision.
Can I ask what you were expecting to invest?

[Listen]

My program is designed to give you [transformation].
If budget is a concern, I also offer [payment plan].

What matters most is whether this is the right fit for you."

---

THE FOLLOW-UP

If they don't decide on the call:

Within 24 hours:
"Hi [Name]! It was great chatting with you today.
I'm here if any questions come up.
Just reply to this message anytime."

After 3-5 days (if no response):
"Hey [Name]! Just following up on our conversation.
I have one spot opening up next week if you'd like to move forward.
Let me know either way—no pressure!"

Follow-up is where most sales happen.`
            },
            {
                title: "Chapter 5: Your $1,000+ Package Structure",
                readTime: "12 min",
                content: `STOP SELLING SESSIONS. START SELLING TRANSFORMATION.

Single sessions:
• Attract price-shoppers
• Create inconsistent income
• Don't allow real transformation
• Keep you hustling forever

Packages:
• Attract committed clients
• Create predictable income
• Allow real transformation
• Build sustainable practice

---

THE TRANSFORMATION PACKAGE FORMULA

Duration: 3-4 months (minimum for real results)

Include:
1. Comprehensive Initial Assessment (90 min)
   - Full health history
   - Lifestyle evaluation
   - Goal setting
   - Initial recommendations

2. Follow-Up Sessions (6-8 sessions)
   - Progress check-ins
   - Protocol adjustments
   - Troubleshooting
   - Accountability

3. Between-Session Support
   - Limited email/message access
   - Quick questions answered
   - Keeps them on track

4. Resources & Tools
   - Meal plans or guides
   - Supplement protocols
   - Educational materials
   - Tracking tools

---

PRICING YOUR PACKAGE

Calculate your minimum:
• What do you need to earn per month?
• How many clients can you realistically serve?
• Divide to get your minimum per client

Add for value:
• What is this transformation worth to them?
• What have they already spent trying to fix this?
• What would they pay to have this solved?

Market check:
• What do similar practitioners charge?
• (Don't copy—just understand the range)

Your price: Should feel slightly uncomfortable.
If it feels totally comfortable, you're undercharging.

---

SAMPLE PACKAGE: THE FOUNDATION PROGRAM

"The Foundation Program"
3-Month Comprehensive Wellness Program

What's Included:
✓ 90-minute initial consultation
✓ 6 bi-weekly follow-up sessions
✓ Custom nutrition & lifestyle protocol
✓ Supplement recommendations
✓ Email support between sessions
✓ Resource library access

Investment: $997

Payment plan available: 3 payments of $367

---

PRESENTING YOUR PACKAGE

"Based on everything you've shared, my Foundation Program
would be perfect for you.

It's a 3-month program where we work together to
[specific outcome they want].

You'll get [quick overview of what's included].

The investment is $997, and I do offer a payment plan
if that's helpful.

What questions do you have?"

Notice: No apologizing. No justifying. Just stating.`
            },
            {
                title: "Chapter 6: Simple Marketing Without Social Media Overwhelm",
                readTime: "12 min",
                content: `YOU DON'T NEED TO GO VIRAL

The myth: You need thousands of followers to get clients.
The truth: You need to be visible to the RIGHT people.

5 clients per month requires:
• Maybe 10-15 discovery calls
• Maybe 30-50 people aware of your offer
• Maybe 100-200 people who know what you do

That's it. Not millions. Hundreds.

---

THE MINIMUM VIABLE MARKETING PLAN

Pick ONE platform. Master it. Ignore the rest.

Options:
• Instagram (visual, health-focused audience)
• Facebook (groups, local community)
• LinkedIn (professional audience)
• Email (your own list)

For most health practitioners: Instagram or Facebook.

---

THE SIMPLE CONTENT STRATEGY

Post 3-5 times per week. That's it.

Content types to rotate:

1. EDUCATIONAL (2x/week)
   - Tips related to your specialty
   - Common mistakes
   - Myth-busting

2. STORY (1x/week)
   - Your journey
   - Client wins (with permission)
   - Behind the scenes

3. ENGAGEMENT (1x/week)
   - Ask a question
   - Poll your audience
   - Invite conversation

4. OFFER (1x/week)
   - Remind people you take clients
   - Share how to work with you
   - Testimonials with CTA

---

THE 30-MINUTE DAILY ROUTINE

10 min: Create one piece of content (or repurpose)
10 min: Engage with others (comment, respond, connect)
10 min: Direct outreach (DMs, follow-ups)

That's your marketing. 30 minutes. Done.

---

WHAT TO SAY IN YOUR BIO

Include:
• Who you help (specific)
• What transformation you provide
• How to take the next step

Example:
"Helping busy moms beat exhaustion & brain fog
Gut health specialist | Functional nutrition
📩 DM 'ENERGY' for free assessment"

---

THE CONTENT BANK

Batch create content on ONE day:
• Sunday: Plan your 5 posts for the week
• Write captions
• Choose images
• Schedule if possible

Don't create daily. That's exhausting.

---

REMEMBER

Marketing is just: Letting people know you can help them.

That's it. It doesn't have to be complicated.

Your first 5 clients are probably:
• People who already follow you
• People one connection away
• People in your existing community

Reach them first. Scaling comes later.`
            },
            {
                title: "Chapter 7: Building Your Minimum Viable Practice",
                readTime: "10 min",
                content: `YOU DON'T NEED A PERFECT SETUP

What you DON'T need to start:
✗ A fancy website
✗ A logo
✗ Business cards
✗ An office
✗ A complicated booking system
✗ A professional photoshoot
✗ A registered LLC (yet)

What you DO need:
✓ A way to book calls (Calendly free version works)
✓ A way to meet (Zoom free version works)
✓ A way to collect payment (Stripe, PayPal, Venmo)
✓ A way to take notes (Google Docs works)
✓ An intake form (Google Forms works)

That's it. Really.

---

THE MVP TECH STACK (FREE VERSION)

Scheduling: Calendly (free)
Video calls: Zoom (free)
Payments: Stripe or PayPal
Documents: Google Drive
Intake forms: Google Forms or Typeform (free)
Email: Gmail
Notes: Google Docs or Notion (free)

Total cost: $0

Upgrade later when you're making money.

---

YOUR FIRST INTAKE FORM

Keep it simple. Include:

1. Basic info (name, email, age, location)
2. Main health concern (what brought them to you?)
3. Health history highlights
4. Current medications/supplements
5. What they've tried before
6. Goals for working with you
7. Any other info you should know

Send before the first session. Review before the call.

---

YOUR SESSION NOTES TEMPLATE

For each session, document:

Date:
Main topics discussed:
Current symptoms/status:
Recommendations made:
Client commitments:
Follow-up plan:
Notes for next session:

Keep it simple. Keep it consistent.

---

THE $0 WEBSITE

If you're not ready for a website, use:

• A Link in Bio tool (Linktree, Stan Store)
• Your Instagram/Facebook as your "home base"
• A simple Carrd page ($0 or $19/year)
• Google Business Profile (free, great for local)

Your website doesn't need to make money.
YOUR CONVERSATIONS make money.

---

WHEN TO UPGRADE

Upgrade your systems when:
• You're consistently at 5+ clients/month
• A limitation is actually costing you clients
• You have revenue to invest

Not before. Start scrappy. Stay scrappy until it matters.`
            },
            {
                title: "Chapter 8: The 30-Day Sprint to Your First $5K",
                readTime: "15 min",
                content: `YOUR 30-DAY ACTION PLAN

This isn't theory. This is your daily playbook.

---

WEEK 1: FOUNDATION (Days 1-7)

Day 1:
□ Write your "who I help" statement (one sentence)
□ Decide your package price ($997-1,200)
□ Set up Calendly for discovery calls

Day 2:
□ Create your intake form
□ Write your session notes template
□ Set up payment method (Stripe/PayPal)

Day 3:
□ Make your "warm list" of 30+ people
□ Update your social media bio
□ Tell 5 people what you do now

Day 4:
□ Write your discovery call script
□ Practice it out loud 3 times
□ Send 5 warm outreach messages

Day 5:
□ Create 5 pieces of content (batch)
□ Post your first piece
□ Engage for 30 minutes

Day 6:
□ Follow up with Day 4 outreach
□ Send 5 more outreach messages
□ Post content #2

Day 7:
□ Review your week
□ Count: How many conversations started?
□ Plan: What needs adjusting?

---

WEEK 2: MOMENTUM (Days 8-14)

Day 8-14: Daily routine
□ Post one piece of content
□ Engage for 20 minutes
□ Send 3 outreach messages
□ Follow up with previous conversations
□ Book discovery calls

Goal for Week 2: 3-5 discovery calls booked

---

WEEK 3: CONVERSION (Days 15-21)

Day 15-21: Daily routine
□ Conduct discovery calls
□ Follow up with people who said "let me think"
□ Continue content + outreach
□ Ask for referrals from everyone you talk to

Goal for Week 3: 1-2 clients enrolled

---

WEEK 4: EXPANSION (Days 22-30)

Day 22-30:
□ Deliver exceptional service to new clients
□ Continue discovery calls
□ Expand outreach to second-degree connections
□ Post client wins (with permission)
□ Ask happy clients for referrals

Goal for Week 4: 2-3 more clients enrolled

---

THE DAILY NON-NEGOTIABLES

Every single day:
1. One piece of visibility (post, story, DM)
2. Three outreach messages
3. Follow up with open conversations

15-30 minutes. That's all it takes.

---

TRACKING YOUR PROGRESS

Keep a simple tracker:

Week 1:
- Outreach sent: ___
- Conversations started: ___
- Discovery calls booked: ___

Week 2:
- Discovery calls conducted: ___
- Clients enrolled: ___
- Revenue: $___

Track what matters. Improve what you track.`
            },
            {
                title: "Chapter 9: Handling Objections Like a Pro",
                readTime: "10 min",
                content: `OBJECTIONS ARE NOT REJECTION

When someone objects, they're saying:
"I'm interested, but I have a concern."

Your job: Address the concern, not argue.

---

THE TOP 5 OBJECTIONS (AND HOW TO HANDLE THEM)

OBJECTION 1: "I need to think about it"

What it usually means:
- They have a specific concern they haven't voiced
- They want to check with spouse/budget
- They need more information

Response:
"Of course—it's a big decision. What specifically
would you like to think about? Sometimes I can
help clarify right here."

Then listen. Address what comes up.

---

OBJECTION 2: "It's too expensive"

What it usually means:
- They don't see the value yet
- They're comparing to cheaper alternatives
- Budget is genuinely tight

Response:
"I hear you. Investing in health is significant.
Can I ask—what have you already spent trying
to solve this issue? [Listen]

My program is designed to actually resolve this,
not just patch it temporarily. Does that
perspective help?"

Or offer payment plan: "I do have a 3-payment
option if that would make it more accessible."

---

OBJECTION 3: "I don't have time"

What it usually means:
- Health isn't priority enough (yet)
- They don't understand the time commitment
- Life is genuinely chaotic right now

Response:
"I totally understand—life is busy.
Here's the thing: the sessions are just 45 minutes
bi-weekly. The real question is: can you afford
NOT to address this? How is this health issue
affecting your time and energy right now?"

---

OBJECTION 4: "I want to try on my own first"

What it usually means:
- They've been burned before
- They want to prove they don't need help
- They're scared to commit

Response:
"I respect that. You know yourself best.
Can I ask: how long have you been working
on this on your own? [Listen]

Sometimes having a guide just shortcuts
the process significantly. When you're ready
for support, I'm here."

---

OBJECTION 5: "I need to ask my spouse/partner"

What it usually means:
- Genuine: They share financial decisions
- Sometimes: It's an easy out

Response:
"Absolutely—important decisions should
include your partner. Would it help if
I sent you information you could share
with them? Or if they have questions,
I'm happy to chat with both of you."

---

THE GOLDEN RULE

Never push. Never beg. Never convince.

Your job is to:
1. Understand their concern
2. Provide helpful information
3. Make it easy to say yes
4. Be okay if they say no

The right clients say yes. The wrong ones don't.
Both are okay.`
            },
            {
                title: "Chapter 10: Creating Referral Momentum",
                readTime: "10 min",
                content: `REFERRALS ARE THE SECRET TO SUSTAINABLE $5K+ MONTHS

New practitioners hustle for every client.
Established practitioners get referrals.

The difference? Asking for them.

---

WHEN TO ASK FOR REFERRALS

Best times:
• After a client has a breakthrough
• At the midpoint of their program (when they're excited)
• At the end of their program
• When they randomly thank you

Key: Ask when they're feeling great about working with you.

---

THE REFERRAL ASK (CLIENTS)

"[Name], I love working with you!
I'm curious—do you know anyone else who
might be struggling with similar issues?

I have one spot opening up next month and
I'd love your recommendation. They'd get
a free consultation to see if we're a fit."

That's it. Simple and direct.

---

THE REFERRAL ASK (NON-CLIENTS)

For people in your network who haven't worked with you:

"Hey [Name]! I'm taking on new clients
for [specific issue] this month.

If you know anyone struggling with
[symptom/problem], I'd appreciate you
passing along my info. They'd get a free
consultation—no commitment."

---

MAKING REFERRALS EASY

Give people:
• A simple link to your booking page
• A brief description of who you help
• Your contact info

Example:
"If you know anyone struggling with gut issues,
here's my booking link: [link]
Or they can DM me on Instagram @yourhandle"

Remove friction. Make it one-click.

---

REFERRAL REWARDS (OPTIONAL)

Consider offering:
• $50 credit toward future services
• Free session add-on
• Gift card
• Donation to charity in their name

But honestly? Most people refer because
they like helping—not for rewards.

---

THE REFERRAL FLYWHEEL

Month 1: 5 clients from outreach
→ 2 referrals
Month 2: 3 from outreach + 2 referrals = 5 clients
→ 3 referrals
Month 3: 2 from outreach + 3 referrals = 5 clients
→ 4 referrals
Month 4: 1 from outreach + 4 referrals = 5 clients

Eventually, your practice grows itself.

---

TESTIMONIALS = REFERRAL FUEL

After a win, ask:
"Would you be willing to share a few sentences
about your experience? It helps other people
who are struggling know they're not alone
and that support exists."

Post these everywhere. They do the selling for you.`
            },
            {
                title: "Chapter 11: What to Do When It's Not Working",
                readTime: "12 min",
                content: `IT'S NOT WORKING? LET'S DIAGNOSE.

Before you panic, let's troubleshoot systematically.

---

PROBLEM: Not getting enough discovery calls

Check these:
• Are you actually telling people what you do?
• Are you reaching out enough? (3+ times/day)
• Is your messaging clear about WHO you help?
• Are you following up with interested people?

Fix it:
• Double your outreach volume
• Make your niche more specific
• Share more about what you do publicly
• Follow up 2-3 times before moving on

---

PROBLEM: Discovery calls not converting

Check these:
• Are you talking too much about yourself?
• Are you giving away the consultation for free?
• Are you asking about their goals/pain?
• Are you confidently presenting your offer?
• Are you handling objections or avoiding them?

Fix it:
• Let them talk 70% of the time
• Save recommendations for paid clients
• Focus on their transformation
• Practice your pitch until it's natural
• Address objections head-on

---

PROBLEM: People say it's too expensive

Check these:
• Are you leading with value or price?
• Have you established the transformation they want?
• Are you offering payment plans?
• Are you talking to the right people?

Fix it:
• Don't mention price until they're excited
• Paint the picture of life after transformation
• Always offer a payment plan option
• Find people who value health AND have resources

---

PROBLEM: No time to do marketing

Check these:
• Are you overcomplicating marketing?
• Are you trying to be on every platform?
• Are you batching content or creating daily?
• Is this actually a time issue or a fear issue?

Fix it:
• Minimum viable marketing: 30 min/day
• Pick ONE platform only
• Batch content on one day per week
• Be honest—is fear disguised as "no time"?

---

THE REAL QUESTION

Usually, when it's "not working," it's one of two things:

1. Volume issue: You're not doing enough
   → Solution: More outreach, more content, more conversations

2. Skill issue: You're doing the wrong things
   → Solution: Get feedback, get coached, refine your approach

Which one is it for you?

---

WHEN TO ADJUST VS. WHEN TO PERSIST

Adjust when:
• You've done 30+ outreach messages with no response
• You've had 10+ discovery calls with no sales
• Your feedback consistently points to the same issue

Persist when:
• You've only been at it for 2 weeks
• You haven't actually done the volume required
• You're changing things before giving them time to work

Most people quit too early. Don't be most people.`
            },
            {
                title: "Chapter 12: From $5K to $10K and Beyond",
                readTime: "10 min",
                content: `YOU HIT $5K. NOW WHAT?

First: Celebrate. This is a huge milestone.

$5K/month means:
• Your business works
• People pay you for your expertise
• You can sustain this career

Now let's talk about what's next.

---

THE PATH TO $10K

OPTION 1: More clients at the same price
$10K = 10 clients × $1,000

Pros: Simple, proven system
Cons: More time commitment, capacity limits

OPTION 2: Same clients at higher price
$10K = 5 clients × $2,000

Pros: No extra time, premium positioning
Cons: Need to justify higher price

OPTION 3: Mix of both
$10K = 7 clients × $1,400

Pros: Balanced approach
Cons: Need both more clients AND higher prices

---

RAISING YOUR PRICES

When to raise:
• You're fully booked
• You're getting mostly yeses
• Your results are consistently good
• It's been 6+ months at current price

How to raise:
• New clients get new prices immediately
• Existing clients get grandfather period
• Raise by meaningful amount ($200-500)

---

ADDING REVENUE STREAMS

Once your 1:1 is stable, consider:

GROUP PROGRAM
• 6-12 people
• Lower price per person
• Higher revenue per hour
• Great for your best content

DIGITAL PRODUCTS
• E-books, courses, templates
• One-time creation, ongoing sales
• Requires audience

VIP/INTENSIVE OPTIONS
• Full-day or weekend intensive
• Premium pricing ($2,500-5,000+)
• For clients who want faster results

---

THE COMPOUND EFFECT

Year 1: $5K/month = $60K
Year 2: $8K/month = $96K
Year 3: $10K/month = $120K
Year 4: $15K/month = $180K

Each year builds on the last.

Your skills improve.
Your reputation grows.
Your systems get better.
Referrals compound.

$5K is just the beginning.

---

BUT FIRST...

Master $5K before chasing $10K.

Don't get distracted by shiny strategies.
Don't spread yourself thin.
Don't skip the fundamentals.

$5K consistently > $10K occasionally

Build the foundation. Then expand.`
            },
            {
                title: "Chapter 13: Your Money Mindset Check",
                readTime: "8 min",
                content: `THIS CHAPTER MIGHT BE THE MOST IMPORTANT ONE

You can have the best strategies in the world.
But if your money mindset is broken, you'll sabotage yourself.

---

COMMON MONEY BLOCKS

"I feel guilty charging for health help"
Reality: Charging allows you to sustain helping people.
Reframe: "My fee funds my ability to serve."

"Who would pay ME for this?"
Reality: People pay for transformation, not credentials.
Reframe: "My clients pay for results, which I deliver."

"My friends/family could never afford this"
Reality: Your friends/family aren't your target market.
Reframe: "My ideal clients value AND can afford this."

"I should help everyone who needs it"
Reality: You can't serve everyone sustainably.
Reframe: "I serve my ideal clients excellently."

"Rich people are greedy"
Reality: Wealth is neutral. Intent matters.
Reframe: "Money is a tool. I use it for good."

---

THE CHARGING TEST

Can you say this out loud without flinching?

"My 3-month program is $997."

If you stumbled, hesitated, or felt weird:
• Practice saying it 50 times
• Say it to yourself in the mirror
• Record yourself and listen back
• Practice with a friend

Until it feels as natural as saying your name.

---

YOUR MONEY STORY

Write this out:

1. What did you learn about money growing up?
2. What do you believe about people who have money?
3. What do you believe you deserve to earn?
4. What scares you about earning more?

Your stories shape your reality.
Rewrite the ones that aren't serving you.

---

AFFIRMATIONS THAT WORK

Don't just say them. BELIEVE them.

"I deserve to be compensated for my expertise."
"People happily pay for the value I provide."
"Money flows to me easily and consistently."
"I am worthy of a thriving practice."
"Charging well is an act of service."

Read these daily. Let them sink in.

---

THE TRUTH

Your income is not a measure of your worth.
But it IS a measure of the value you allow yourself to receive.

Allow yourself to receive.`
            },
            {
                title: "Chapter 14: Week-by-Week Implementation Calendar",
                readTime: "10 min",
                content: `YOUR 8-WEEK ROADMAP TO $5K/MONTH

Print this. Post it. Follow it.

---

WEEK 1: SETUP
□ Define your niche (who + what problem)
□ Create your package ($997-1,200)
□ Set up booking system (Calendly)
□ Set up payment system (Stripe/PayPal)
□ Create intake form
□ Write discovery call script

End of Week 1: Ready to take clients

---

WEEK 2: WARM OUTREACH
□ Make list of 50+ warm contacts
□ Send 25 outreach messages
□ Follow up with responders
□ Post announcement on social media
□ Update all bios/profiles

End of Week 2: 5-10 conversations started

---

WEEK 3: DISCOVERY CALLS
□ Book 5+ discovery calls
□ Conduct calls using script
□ Follow up with "thinking about it" folks
□ Continue outreach (15 more messages)
□ Start consistent content (1/day)

End of Week 3: 1-2 clients enrolled

---

WEEK 4: MOMENTUM
□ Deliver excellent sessions to new clients
□ 5 more discovery calls
□ Continue content + engagement
□ Ask for referrals from everyone
□ Refine what's working

End of Week 4: 2-4 clients total

---

WEEK 5: EXPANSION
□ Expand to second-degree connections
□ Join/engage in relevant communities
□ 5 more discovery calls
□ Get first testimonial (even from practice clients)
□ Post client wins

End of Week 5: 3-5 clients total

---

WEEK 6: OPTIMIZATION
□ Review what's converting (and what's not)
□ Double down on working strategies
□ Cut what's not working
□ 5 more discovery calls
□ Increase referral asks

End of Week 6: 4-6 clients total

---

WEEK 7: SCALE
□ Continue proven outreach methods
□ 5+ discovery calls
□ Establish content routine
□ Build referral momentum
□ Consider raising prices for new clients

End of Week 7: 5+ clients total

---

WEEK 8: SUSTAIN
□ Document your systems
□ Celebrate hitting $5K!
□ Plan for next month
□ Identify bottlenecks to address
□ Set goal for month 2

End of Week 8: $5K/month achieved!

---

DAILY CHECKLIST (Every day, weeks 2-8)

□ 3 outreach messages
□ 1 piece of content
□ 20 min engagement
□ Follow up with open conversations
□ Update your tracker

Consistency beats intensity. Every single day.`
            },
            {
                title: "Chapter 15: Your First Day Starts Now",
                readTime: "6 min",
                isHtml: true,
                content: `<div class="ebook-content">
  <!-- Celebration Header -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
    <div class="text-5xl mb-4">🎉</div>
    <h2 class="text-2xl font-bold mb-2">You Made It!</h2>
    <p class="text-emerald-100">You now have everything you need to hit $5K/month.</p>
  </div>

  <!-- Recap Box -->
  <div class="bg-white border-2 border-emerald-200 rounded-2xl p-6 mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4">Quick Recap: What You Learned</h3>
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">1</span>
        <span class="text-gray-700">The mindset shift from employee to practitioner</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">2</span>
        <span class="text-gray-700">The simple math: 5 clients × $1,000 = $5K</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">3</span>
        <span class="text-gray-700">Finding clients in your existing network</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">4</span>
        <span class="text-gray-700">The discovery call framework that converts</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">5</span>
        <span class="text-gray-700">Creating and pricing your transformation package</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">6</span>
        <span class="text-gray-700">Simple marketing without overwhelm</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">7</span>
        <span class="text-gray-700">Building your minimum viable practice</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">8</span>
        <span class="text-gray-700">The 30-day sprint to your first $5K</span>
      </div>
    </div>
  </div>

  <!-- The Truth -->
  <div class="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
    <h3 class="font-bold text-gray-900 mb-2">The Truth About Success</h3>
    <p class="text-gray-700">
      The difference between practitioners who hit $5K/month and those who don't isn't talent.
      It isn't credentials. It isn't luck.
    </p>
    <p class="text-gray-700 mt-2">
      <strong>It's action.</strong> Consistent, imperfect, persistent action.
    </p>
  </div>

  <!-- Your Commitment -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mb-8">
    <h3 class="text-lg font-bold text-gold-400 mb-4">Your Commitment</h3>
    <p class="text-burgundy-100 mb-4">Say this out loud:</p>
    <p class="text-xl italic text-white">
      "I commit to taking action every day for the next 30 days.
      I will reach out. I will show up. I will serve.
      I will hit $5K/month because I refuse to give up."
    </p>
  </div>

  <!-- Day 1 Actions -->
  <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
    <h3 class="text-lg font-bold text-emerald-800 mb-4">🚀 Your Day 1 Actions</h3>
    <div class="space-y-3">
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Tell ONE person what you do now</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Set up your Calendly booking link</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Write your "who I help" statement</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Decide your package price: $______</span>
      </div>
    </div>
  </div>

  <!-- Final Message -->
  <div class="text-center mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Your First Client is Waiting</h3>
    <p class="text-lg text-gray-600 mb-6">
      They're out there right now, struggling with the exact thing you can help with.
      They just don't know you exist yet.
    </p>
    <p class="text-lg text-gray-600">
      Go find them.
    </p>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center">
    <p class="text-2xl font-bold text-white mb-2">
      $5K/month starts today.
    </p>
    <p class="text-emerald-100">
      You've got this. Now go make it happen. 💪
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 text-center">
    <p class="text-sm text-gray-500">
      Made with 💚 by AccrediPro Academy
    </p>
    <p class="text-xs text-gray-400 mt-2">
      Questions? We're here to help. Keep going!
    </p>
  </div>
</div>`
            }
        ]
    },
    // FM Practitioner Decision Guide - unlocked from Challenge enrollment
    {
        id: "fm-practitioner-decision-guide",
        title: "FM Practitioner Decision Guide",
        subtitle: "Is Functional Medicine Coaching Right for You?",
        description: "A comprehensive guide to help you decide if functional medicine coaching is the right career path. Includes self-assessment, realistic timelines, investment breakdown, and success stories.",
        valueProp: "Make a confident decision about your FM career path.",
        author: "AccrediPro Academy",
        pages: 8,
        icon: "📋",
        category: "core",
        topics: ["Self-Assessment", "Career Path", "Investment Planning", "Success Stories"],
        readTime: "15 min",
        unlockedDate: "",
        isFree: true,
        unlockCondition: "Challenge Enrollment",
        isApiUnlocked: true, // This ebook requires API check for unlock status
        chapters: [
            {
                title: "Is FM Coaching Right for Me?",
                readTime: "5 min",
                isHtml: true,
                content: `<div class="ebook-content">
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-blue-600 tracking-wider uppercase">Decision Guide</p>
    </div>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Self-Assessment Quiz</h2>
  <p class="text-gray-700 mb-6">Answer these 5 questions honestly to see if FM coaching is right for you:</p>

  <div class="space-y-4">
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">1. Are you passionate about health and helping others?</p>
      <p class="text-sm text-blue-700">If you find yourself constantly researching health topics and sharing what you learn, this is a strong indicator.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">2. Are you willing to invest time in learning before earning?</p>
      <p class="text-sm text-blue-700">The first 3-6 months require focused learning and practice before consistent income.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">3. Can you commit to ongoing education?</p>
      <p class="text-sm text-blue-700">Functional medicine evolves. Successful practitioners never stop learning.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">4. Do you have basic business sense (or willingness to learn)?</p>
      <p class="text-sm text-blue-700">Running a practice requires marketing, sales, and client management skills.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">5. Can you handle rejection and slow starts?</p>
      <p class="text-sm text-blue-700">Not everyone says yes. Building a practice takes patience and persistence.</p>
    </div>
  </div>

  <div class="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
    <p class="font-bold text-green-800 mb-2">If you answered YES to 4+ questions:</p>
    <p class="text-green-700">You have strong potential for success in FM coaching!</p>
  </div>
</div>`
            },
            {
                title: "5 Signs You're Ready to Start",
                readTime: "5 min",
                content: `THE 5 SIGNS YOU'RE READY

1. YOU'VE TRANSFORMED YOUR OWN HEALTH
If you've experienced the power of functional medicine firsthand, you understand the transformation you can help others achieve.

2. YOU'RE TIRED OF YOUR CURRENT PATH
Whether it's a corporate job or an unfulfilling career, that restlessness is often a sign you're ready for change.

3. YOU KEEP TALKING ABOUT HEALTH
When friends and family already come to you for health advice, you're naturally drawn to this work.

4. YOU'VE DONE YOUR RESEARCH
You've looked into certifications, income potential, and what the work actually involves. You're not just chasing a dream—you're making an informed decision.

5. YOU FEEL CALLED TO SERVE
There's a deeper pull beyond money. You genuinely want to help people transform their health.

---

THE REALISTIC TIMELINE

Month 1-3: Learning & Setup
• Complete core training
• Set up basic systems
• Practice with friends/family

Month 4-6: First Clients
• Land 2-5 initial clients
• Refine your process
• Build confidence

Month 7-12: Momentum
• Referrals start coming
• Develop your unique approach
• Build sustainable income

Year 2+: Scale
• $60K-$120K+ annual income
• Established client base
• Consider specialization`
            },
            {
                title: "Investment & Earning Potential",
                readTime: "5 min",
                content: `YOUR INVESTMENT BREAKDOWN

CERTIFICATION INVESTMENT
• Full FM Certification: $997-$1,997
• Advanced specializations: $497-$997 each
• Continuing education: $200-$500/year

BUSINESS SETUP (OPTIONAL BUT RECOMMENDED)
• Basic website: $0-$500
• Scheduling software: $20-$50/month
• Practice management: $0-$100/month
• Marketing budget: $0-$200/month initially

TOTAL FIRST-YEAR INVESTMENT: $1,500-$4,000

---

REALISTIC EARNING POTENTIAL

PART-TIME (10-15 clients/month)
• Months 4-6: $1,000-$3,000/month
• Months 7-12: $3,000-$5,000/month
• Year 2: $5,000-$7,000/month

FULL-TIME (25-40 clients/month)
• Month 4-6: $2,000-$5,000/month
• Month 7-12: $5,000-$8,000/month
• Year 2: $8,000-$15,000/month

TOP PERFORMERS (High-ticket packages)
• First year: $60,000-$120,000
• Year 2-3: $120,000-$200,000+

---

ROI TIMELINE

Most practitioners recoup their certification investment within 3-6 months of starting with clients. By month 12, most are profitable.

Note: These are realistic figures from our graduate community. Individual results vary based on effort, market, and business acumen.`
            }
        ]
    },
    // NOTE: Purchasable ebooks are in the Professional Library (/ebooks)
    // My Library only shows FREE ebooks (unlocked via progress) + purchased ebooks
];

// Types for progress tracking
interface ReadingProgress {
    [ebookId: string]: {
        currentChapter: number;
        completedChapters: number[];
        lastRead: string;
        started: boolean;
    };
}

export default function MyLibraryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [savedEbooks, setSavedEbooks] = useState<string[]>([]);
    const [readingEbook, setReadingEbook] = useState<typeof MY_EBOOKS[0] | null>(null);
    const [currentChapter, setCurrentChapter] = useState(0);
    const [showTOC, setShowTOC] = useState(false);
    const [readingProgress, setReadingProgress] = useState<ReadingProgress>({});
    const [activeTab, setActiveTab] = useState<"all" | "inprogress" | "completed">("all");
    const [unlockedResources, setUnlockedResources] = useState<string[]>([]);

    // Load progress from localStorage and fetch unlocked resources from API
    useEffect(() => {
        const saved = localStorage.getItem("library-saved");
        const progress = localStorage.getItem("library-progress");
        if (saved) setSavedEbooks(JSON.parse(saved));
        if (progress) setReadingProgress(JSON.parse(progress));

        // Fetch unlocked resources from API
        const fetchUnlockedResources = async () => {
            try {
                const response = await fetch("/api/user/library");
                if (response.ok) {
                    const data = await response.json();
                    if (data.unlockedResources) {
                        setUnlockedResources(data.unlockedResources);
                    }
                }
            } catch (error) {
                console.error("Error fetching unlocked resources:", error);
            }
        };
        fetchUnlockedResources();
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem("library-saved", JSON.stringify(savedEbooks));
    }, [savedEbooks]);

    useEffect(() => {
        localStorage.setItem("library-progress", JSON.stringify(readingProgress));
    }, [readingProgress]);

    const toggleSaved = (ebookId: string) => {
        setSavedEbooks(prev =>
            prev.includes(ebookId)
                ? prev.filter(id => id !== ebookId)
                : [...prev, ebookId]
        );
    };

    const markChapterComplete = (ebookId: string, chapterIndex: number) => {
        setReadingProgress(prev => {
            const existing = prev[ebookId] || { currentChapter: 0, completedChapters: [], lastRead: "", started: false };
            const completed = existing.completedChapters.includes(chapterIndex)
                ? existing.completedChapters
                : [...existing.completedChapters, chapterIndex];
            return {
                ...prev,
                [ebookId]: {
                    ...existing,
                    completedChapters: completed,
                    lastRead: new Date().toISOString(),
                    started: true,
                }
            };
        });
    };

    const updateCurrentChapter = (ebookId: string, chapterIndex: number) => {
        setReadingProgress(prev => ({
            ...prev,
            [ebookId]: {
                ...prev[ebookId] || { completedChapters: [], started: false },
                currentChapter: chapterIndex,
                lastRead: new Date().toISOString(),
                started: true,
            }
        }));
        setCurrentChapter(chapterIndex);
    };

    const startReading = (ebook: typeof MY_EBOOKS[0]) => {
        const progress = readingProgress[ebook.id];
        const resumeChapter = progress?.currentChapter || 0;
        setReadingEbook(ebook);
        setCurrentChapter(resumeChapter);
        setReadingProgress(prev => ({
            ...prev,
            [ebook.id]: {
                ...prev[ebook.id] || { completedChapters: [] },
                currentChapter: resumeChapter,
                lastRead: new Date().toISOString(),
                started: true,
            }
        }));
    };

    const getEbookProgress = (ebookId: string, totalChapters: number): number => {
        const progress = readingProgress[ebookId];
        if (!progress) return 0;
        return Math.round((progress.completedChapters.length / totalChapters) * 100);
    };

    const isEbookComplete = (ebookId: string, totalChapters: number): boolean => {
        const progress = readingProgress[ebookId];
        if (!progress) return false;
        return progress.completedChapters.length === totalChapters;
    };

    // Filter ebooks - check if API-unlocked ebooks are actually unlocked
    const availableEbooks = MY_EBOOKS.filter(ebook => {
        // If ebook requires API unlock, check if it's in unlockedResources
        if ((ebook as any).isApiUnlocked) {
            return unlockedResources.includes(ebook.id);
        }
        // Otherwise, it's always available (free ebook unlocked by default)
        return true;
    });

    const filteredEbooks = availableEbooks.filter(ebook => {
        const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ebook.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory;

        if (activeTab === "inprogress") {
            const progress = readingProgress[ebook.id];
            return matchesSearch && matchesCategory && progress?.started && !isEbookComplete(ebook.id, ebook.chapters.length);
        }
        if (activeTab === "completed") {
            return matchesSearch && matchesCategory && isEbookComplete(ebook.id, ebook.chapters.length);
        }
        return matchesSearch && matchesCategory;
    });

    const inProgressCount = availableEbooks.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).length;
    const completedCount = availableEbooks.filter(e => isEbookComplete(e.id, e.chapters.length)).length;
    const totalCount = availableEbooks.length;

    // READING VIEW
    if (readingEbook) {
        const ebookProgress = readingProgress[readingEbook.id] || { completedChapters: [], currentChapter: 0 };
        const isChapterComplete = ebookProgress.completedChapters.includes(currentChapter);

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Reading Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button variant="ghost" onClick={() => { setReadingEbook(null); setCurrentChapter(0); setShowTOC(false); }}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
                                </Button>
                                <div className="hidden md:flex items-center gap-3">
                                    <span className="text-2xl">{readingEbook.icon}</span>
                                    <div>
                                        <h1 className="font-bold text-gray-900">{readingEbook.title}</h1>
                                        <p className="text-sm text-gray-500">
                                            {ebookProgress.completedChapters.length} of {readingEbook.chapters.length} chapters
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => setShowTOC(!showTOC)}>
                                    <List className="w-4 h-4 mr-2" /> Contents
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => alert("Downloading PDF...")}>
                                    <Download className="w-4 h-4 mr-2" /> PDF
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => alert("Share link copied!")}>
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                            </div>
                        </div>
                        <div className="mt-3">
                            <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-2" />
                        </div>
                    </div>
                </div>

                {/* TOC Drawer */}
                {showTOC && (
                    <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setShowTOC(false)}>
                        <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Table of Contents</h2>
                                <Button variant="ghost" size="sm" onClick={() => setShowTOC(false)}>✕</Button>
                            </div>

                            <div className="mb-4">
                                <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-3" />
                                <p className="text-xs text-gray-400 mt-1">
                                    {ebookProgress.completedChapters.length} of {readingEbook.chapters.length} complete
                                </p>
                            </div>

                            <div className="space-y-2">
                                {readingEbook.chapters.map((chapter, i) => {
                                    const isComplete = ebookProgress.completedChapters.includes(i);
                                    const isCurrent = i === currentChapter;
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => { updateCurrentChapter(readingEbook.id, i); setShowTOC(false); }}
                                            className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3 ${isCurrent ? "bg-burgundy-100 border-2 border-burgundy-300" : "bg-gray-50 hover:bg-gray-100"}`}
                                        >
                                            <div className="flex-shrink-0 mt-0.5">
                                                {isComplete ? <CheckCircle2 className="w-5 h-5 text-burgundy-500" /> : isCurrent ? <PlayCircle className="w-5 h-5 text-burgundy-600" /> : <Circle className="w-5 h-5 text-gray-300" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-medium ${isCurrent ? "text-burgundy-700" : "text-gray-900"}`}>{chapter.title}</p>
                                                <p className="text-xs text-gray-500 mt-1"><Clock className="w-3 h-3 inline mr-1" />{chapter.readTime}</p>
                                            </div>
                                            {isComplete && <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">Done</Badge>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reading Content */}
                <div className="px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex gap-8">
                        {/* Chapter Sidebar */}
                        <div className="hidden lg:block w-72 flex-shrink-0">
                            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-28">
                                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Chapters</p>
                                <div className="space-y-1">
                                    {readingEbook.chapters.map((chapter, i) => {
                                        const isComplete = ebookProgress.completedChapters.includes(i);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => updateCurrentChapter(readingEbook.id, i)}
                                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${currentChapter === i ? "bg-burgundy-100 text-burgundy-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                                            >
                                                {isComplete ? <CheckCircle2 className="w-4 h-4 text-burgundy-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                                                <span className="truncate">{chapter.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span>Progress</span>
                                        <span>{getEbookProgress(readingEbook.id, readingEbook.chapters.length)}%</span>
                                    </div>
                                    <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-2" />
                                </div>
                            </div>
                        </div>

                        {/* Reading Area */}
                        <div className="flex-1 max-w-3xl">
                            <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
                                <div className="flex items-center justify-between mb-6">
                                    <Badge variant="outline">Chapter {currentChapter + 1} of {readingEbook.chapters.length}</Badge>
                                    <span className="text-xs text-gray-500"><Clock className="w-3 h-3 inline mr-1" />{readingEbook.chapters[currentChapter].readTime}</span>
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 mb-8">{readingEbook.chapters[currentChapter].title}</h2>

                                <div className="prose prose-lg max-w-none">
                                    {readingEbook.chapters[currentChapter].isHtml ? (
                                        <div
                                            className="ebook-html-content"
                                            dangerouslySetInnerHTML={{ __html: readingEbook.chapters[currentChapter].content }}
                                        />
                                    ) : (
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                                            {readingEbook.chapters[currentChapter].content}
                                        </p>
                                    )}
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-between mt-8 pt-8 border-t border-gray-100">
                                    <Button variant="outline" onClick={() => updateCurrentChapter(readingEbook.id, Math.max(0, currentChapter - 1))} disabled={currentChapter === 0}>
                                        <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            markChapterComplete(readingEbook.id, currentChapter);
                                            if (currentChapter === readingEbook.chapters.length - 1) {
                                                alert("🎉 Congratulations! You've completed this e-book!");
                                            } else {
                                                updateCurrentChapter(readingEbook.id, currentChapter + 1);
                                            }
                                        }}
                                        className="bg-burgundy-600 hover:bg-burgundy-700"
                                    >
                                        {currentChapter === readingEbook.chapters.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LIBRARY VIEW
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <div className="px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="relative mb-10 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <Library className="w-7 h-7 text-gold-400" />
                            </div>
                            <Badge className="bg-gold-400 text-burgundy-900 border-0 font-semibold">Your Collection</Badge>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold mb-4">My Library</h1>

                        <p className="text-lg text-white/90 max-w-2xl mb-6">
                            Your professional books, guides, and reference materials — available as you progress.
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30">
                                <Sparkles className="w-4 h-4 text-green-300" /> {totalCount} Resources
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <PlayCircle className="w-4 h-4" /> {inProgressCount} Reading
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <CheckCircle2 className="w-4 h-4" /> {completedCount} Completed
                            </div>
                        </div>
                    </div>
                </div>

                {/* Continue Reading Section */}
                {inProgressCount > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <PlayCircle className="w-5 h-5 text-burgundy-600" /> Continue Reading
                        </h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {availableEbooks.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).map((ebook) => {
                                const progress = getEbookProgress(ebook.id, ebook.chapters.length);
                                const lastChapter = readingProgress[ebook.id]?.currentChapter || 0;
                                return (
                                    <div key={ebook.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => startReading(ebook)}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-3xl">{ebook.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{ebook.title}</h3>
                                                <p className="text-xs text-gray-500">Chapter {lastChapter + 1}</p>
                                            </div>
                                        </div>
                                        <Progress value={progress} className="h-1.5 mb-2" />
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-500">{progress}% complete</span>
                                            <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 h-7 text-xs">
                                                <PlayCircle className="w-3 h-3 mr-1" /> Resume
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button onClick={() => setActiveTab("all")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "all" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        All ({MY_EBOOKS.length})
                    </button>
                    <button onClick={() => setActiveTab("inprogress")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "inprogress" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        <PlayCircle className="w-4 h-4 inline mr-1" /> Reading ({inProgressCount})
                    </button>
                    <button onClick={() => setActiveTab("completed")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "completed" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        <CheckCircle2 className="w-4 h-4 inline mr-1" /> Completed ({completedCount})
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? "bg-burgundy-100 text-burgundy-700 border-2 border-burgundy-300" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
                        >
                            <span>{cat.icon}</span> {cat.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search your library..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 py-5 rounded-xl border-gray-200"
                    />
                </div>

                {/* E-Books Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEbooks.map((ebook) => {
                        const progress = getEbookProgress(ebook.id, ebook.chapters.length);
                        const isComplete = isEbookComplete(ebook.id, ebook.chapters.length);
                        const hasStarted = readingProgress[ebook.id]?.started;

                        return (
                            <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all group hover:shadow-lg hover:border-burgundy-200">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-4xl">{ebook.icon}</span>
                                        <div className="flex items-center gap-2">
                                            {ebook.isFree && (
                                                <Badge className="bg-green-100 text-green-700 border-0 text-xs flex items-center gap-1">
                                                    <Sparkles className="w-3 h-3" /> Graduate Resource
                                                </Badge>
                                            )}
                                            {isComplete && <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">Complete</Badge>}
                                            {!isComplete && progress > 0 && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{progress}%</Badge>}
                                            <Button variant="ghost" size="sm" onClick={() => toggleSaved(ebook.id)} className={savedEbooks.includes(ebook.id) ? "text-burgundy-600" : "text-gray-400"}>
                                                {savedEbooks.includes(ebook.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold mb-1 transition-colors text-gray-900 group-hover:text-burgundy-600">{ebook.title}</h3>
                                    <p className="text-sm mb-2 text-burgundy-600">{ebook.subtitle}</p>

                                    {/* Unlock Condition Badge */}
                                    {ebook.unlockCondition && (
                                        <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg border border-green-100">
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span className="text-xs text-green-700 font-medium">Unlocked: {ebook.unlockCondition}</span>
                                        </div>
                                    )}

                                    {/* Value Prop Blurb */}
                                    {ebook.valueProp && (
                                        <p className="text-sm font-medium px-3 py-2 rounded-lg mb-3 italic text-amber-700 bg-amber-50">
                                            &ldquo;{ebook.valueProp}&rdquo;
                                        </p>
                                    )}

                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {ebook.topics.slice(0, 2).map((topic) => (
                                            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <span><FileText className="w-3 h-3 inline mr-1" />{ebook.chapters.length > 0 ? `${ebook.chapters.length} chapters` : `${ebook.pages} pages`}</span>
                                        <span className="mx-2">•</span>
                                        <span><Clock className="w-3 h-3 inline mr-1" />{ebook.readTime}</span>
                                    </div>

                                    {progress > 0 && !isComplete && (
                                        <div className="mb-3">
                                            <Progress value={progress} className="h-1.5" />
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-burgundy-600 hover:bg-burgundy-700" onClick={() => startReading(ebook)}>
                                            {isComplete ? <><BookOpen className="w-4 h-4 mr-2" /> Read Again</> : hasStarted ? <><PlayCircle className="w-4 h-4 mr-2" /> Continue</> : <><BookOpen className="w-4 h-4 mr-2" /> Start Reading</>}
                                        </Button>
                                        <Button variant="outline" onClick={() => alert("Downloading PDF...")}>
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredEbooks.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 mb-4">No e-books found</p>
                        <Button variant="outline" onClick={() => { setActiveTab("all"); setSelectedCategory("all"); setSearchQuery(""); }}>
                            View All E-Books
                        </Button>
                    </div>
                )}

                {/* Expand Your Library CTA */}
                <div className="mt-12 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-purple-700 rounded-2xl p-8 text-white overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    </div>
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gold-400/20 backdrop-blur rounded-2xl flex items-center justify-center border border-gold-400/30">
                                <Sparkles className="w-8 h-8 text-gold-300" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Expand Your Professional Library</h2>
                                <p className="text-white/80">Premium guides, templates, and protocol bundles for practitioners</p>
                            </div>
                        </div>
                        <a href="/ebooks">
                            <Button className="bg-gold-500 hover:bg-gold-600 text-burgundy-900 font-semibold px-6 py-6 text-lg shadow-lg">
                                <Library className="w-5 h-5 mr-2" /> Browse Resources <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
