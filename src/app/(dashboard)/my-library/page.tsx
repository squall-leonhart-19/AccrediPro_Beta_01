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
        author: "AccrediPro Academy",
        pages: 52,
        icon: "📘",
        category: "core",
        topics: ["Practice Setup", "Client Management", "Boundaries", "Business Basics"],
        readTime: "2-3 hours",
        unlockedDate: "2024-11-15",
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
        id: "gut-health-practitioner",
        title: "Gut Health Protocol Guide",
        subtitle: "Advanced Strategies for Practitioners",
        description: "Deep-dive into gut health protocols. Covers SIBO, dysbiosis, leaky gut, and more with specific testing and treatment approaches.",
        author: "AccrediPro Academy",
        pages: 62,
        icon: "🍃",
        category: "gut",
        topics: ["SIBO", "Dysbiosis", "Leaky Gut", "Testing", "Protocols"],
        readTime: "3-4 hours",
        unlockedDate: "2024-11-20",
        chapters: [
            {
                title: "Introduction to Gut Health in Practice",
                readTime: "8 min",
                content: `Gut health is the foundation of almost everything you'll address as a functional medicine practitioner. Up to 70% of clients present with digestive complaints—whether that's their primary concern or a secondary issue they "just live with."

This guide will help you:
• Confidently assess and address common gut conditions
• Interpret functional testing (stool, breath, bloodwork)
• Design effective protocols that get results
• Know when you're in over your head and need to refer

THE GUT-EVERYTHING CONNECTION

Gut dysfunction impacts:
• Immune function (70%+ of immune system is in the gut)
• Mood and cognition (gut-brain axis)
• Hormones (especially estrogen metabolism)
• Energy and nutrient status
• Skin health
• Inflammation systemically

When in doubt, start with the gut.

---

SCOPE CHECK: WHAT YOU CAN AND CAN'T DO

You CAN:
• Recommend dietary changes
• Suggest supplements (within scope)
• Order and interpret functional tests (if trained)
• Support lifestyle modifications
• Work alongside medical providers

You CANNOT:
• Diagnose disease
• Prescribe medications
• Treat without appropriate assessment
• Work outside your training

When something is beyond your scope, refer. A good referral builds trust.`
            },
            {
                title: "Chapter 1: Comprehensive Gut Assessment",
                readTime: "15 min",
                content: `THE ASSESSMENT FLOW

Before you can help, you need to understand. A thorough assessment includes:

1. DETAILED SYMPTOM HISTORY
• When did symptoms start?
• What makes them better/worse?
• Frequency and severity
• Impact on daily life
• Previous testing and treatments

2. DIETARY ASSESSMENT
• Current diet (food diary if possible)
• Food sensitivities/reactions
• Eating patterns (speed, timing, stress)
• Hydration status
• Recent dietary changes

3. LIFESTYLE FACTORS
• Stress levels and management
• Sleep quality and quantity
• Movement/exercise
• Work and home environment
• Travel history

4. MEDICAL HISTORY
• Medication history (especially antibiotics, PPIs, NSAIDs)
• Surgical history (especially abdominal)
• Previous diagnoses
• Family history

5. RED FLAGS TO REFER
• Unintended weight loss (>10% body weight)
• Blood in stool
• New onset symptoms over 50
• Severe or progressive symptoms
• Symptoms that wake from sleep
• Signs of obstruction

---

KEY QUESTIONS TO ASK

Stool patterns:
"What does a typical bowel movement look like for you? How often? Any changes in color, consistency, or urgency?"

Bloating:
"When does bloating happen? After eating specific foods? All the time? Does it get better overnight?"

Pain:
"Where exactly is the pain? What does it feel like? What brings it on? What relieves it?"

History:
"When was the last time you felt really good digestively? What changed?"

Food reactions:
"Are there specific foods you avoid? What happens when you eat them?"

---

THE BRISTOL STOOL CHART

Essential tool for client conversations:
• Type 1-2: Constipation
• Type 3-4: Optimal
• Type 5-7: Diarrhea

Teach your clients to recognize their patterns. This becomes valuable data.

---

DOCUMENTING YOUR ASSESSMENT

Good documentation protects you and helps track progress.

Include:
• Chief complaint
• Symptom timeline
• Assessment findings
• Working hypothesis
• Plan with rationale
• Follow-up timeline
• Any referrals made

Keep notes organized and accessible. You'll thank yourself later.`
            },
            {
                title: "Chapter 2: SIBO - Assessment and Protocols",
                readTime: "18 min",
                content: `WHAT IS SIBO?

Small Intestinal Bacterial Overgrowth (SIBO) occurs when bacteria that normally live in the large intestine migrate to the small intestine. This causes:
• Fermentation of food in the wrong place
• Nutrient malabsorption
• Bloating, gas, altered bowel habits
• Systemic symptoms (brain fog, fatigue, skin issues)

SIBO is one of the most common underlying causes of IBS-like symptoms.

---

TYPES OF SIBO

Hydrogen-dominant:
• Associated with diarrhea
• Often responds faster to treatment

Methane-dominant (now called IMO):
• Associated with constipation
• Can be more stubborn to treat
• Often requires different interventions

Hydrogen sulfide:
• Emerging research
• May cause different symptom patterns
• Testing is newer and less standardized

Many clients have mixed types.

---

TESTING FOR SIBO

Lactulose breath test:
• Most common SIBO test
• Measures hydrogen and methane over 2-3 hours
• Requires proper preparation (24-hour prep diet)
• Interpretation requires training

Positive results:
• Hydrogen rise >20 ppm within 90 minutes
• Methane >10 ppm at any point
• Early peak followed by second peak

Limitations:
• False negatives occur
• Doesn't test for hydrogen sulfide directly
• Timing and prep matter significantly

When to test:
• Bloating worse after eating
• Symptoms improve with fasting
• Previous antibiotic history
• Post-infectious IBS pattern
• Chronic symptoms despite dietary changes

---

SIBO PROTOCOLS

The 4-Phase Approach:

PHASE 1: PREPARATION (1-2 weeks)
• Support digestion (bitters, enzymes)
• Basic gut-supportive diet
• Address constipation if present
• Ensure proper bowel transit

PHASE 2: ERADICATION (2-6 weeks)
• Antimicrobial herbs OR
• Elemental diet OR
• Work with MD for rifaximin (prescription)

Common herbal protocols:
Option A:
• Berberine 500mg 2-3x daily
• Oregano oil 200mg 2x daily
• With meals for 4-6 weeks

Option B:
• Allicin (garlic) 450mg 2x daily
• Neem 300mg 2x daily
• For 4-6 weeks

For methane:
Add:
• Atrantil 2 caps 3x daily
• Or allicin specifically

PHASE 3: REPAIR (4-8 weeks)
• L-glutamine 5-10g daily
• Zinc carnosine 75-150mg daily
• Aloe vera
• Collagen peptides
• Anti-inflammatory diet

PHASE 4: PREVENTION
• Meal spacing (4-5 hours between meals)
• Prokinetics (ginger, MotilPro)
• Stress management
• Address underlying cause

---

COMMON PITFALLS

• Treating without testing (you don't know what you're fighting)
• Not addressing root cause (SIBO recurs without this)
• Too aggressive treatment (die-off can be debilitating)
• Skipping the prevention phase
• Not allowing enough time

SIBO is a marathon, not a sprint. Set expectations accordingly.`
            },
            {
                title: "Chapter 3: The 5R Protocol",
                readTime: "15 min",
                content: `THE 5R FRAMEWORK

The 5R protocol is the foundational approach for gut healing. Each step builds on the previous.

---

1. REMOVE

What to remove:
• Food triggers (elimination diet if needed)
• Pathogens (SIBO, yeast, parasites)
• Medications if possible (work with MD)
• Environmental toxins
• Stressors

How to identify what to remove:
• Elimination diet (gold standard for food triggers)
• Functional testing (stool, breath test)
• Symptom tracking
• Sometimes trial and error

Common culprits:
• Gluten
• Dairy
• Refined sugar
• Processed foods
• Excessive alcohol
• NSAIDs

Timeline: 2-4 weeks for basic removal, longer for pathogen eradication

---

2. REPLACE

What may need replacing:
• Digestive enzymes (if not making enough)
• Stomach acid (if hypochlorhydria)
• Bile support (if fat maldigestion)

Signs replacement is needed:
• Bloating/fullness after meals
• Undigested food in stool
• Fatty/floating stools
• Deficient in fat-soluble vitamins

Options:
• Digestive bitters before meals
• Broad-spectrum enzymes with meals
• Betaine HCl (with testing protocol)
• Ox bile for fat digestion

Timeline: Ongoing with meals as needed

---

3. REINOCULATE

Goal: Restore healthy microbiome diversity

Approaches:
• Probiotic supplements
• Fermented foods
• Prebiotic fibers
• Diet diversity

Probiotic selection:
• Start low, go slow
• Multi-strain formulas for general support
• Specific strains for specific conditions
• Quality matters (stability, viability)

Prebiotic foods:
• Garlic, onion, leeks
• Asparagus, artichoke
• Bananas (especially green)
• Oats, flaxseed

Note: If SIBO is present, prebiotics may need to wait until after eradication.

Timeline: 4-12 weeks, sometimes ongoing

---

4. REPAIR

Goal: Heal the gut lining

Key nutrients:
• L-glutamine (5-10g daily) - primary fuel for enterocytes
• Zinc carnosine (75-150mg daily) - mucosal healing
• Collagen/bone broth - gut lining support
• Omega-3s - anti-inflammatory
• Vitamin D - epithelial integrity
• Aloe vera - soothing and healing
• Marshmallow root, slippery elm - mucosal support

Signs lining needs repair:
• Food sensitivities (especially new ones)
• Systemic inflammation
• Autoimmune patterns
• Multiple food reactions
• Positive zonulin or LPS antibodies

Timeline: 4-12 weeks minimum, often 3-6 months

---

5. REBALANCE

Address lifestyle factors:
• Stress management (crucial!)
• Sleep optimization
• Movement/exercise
• Mind-body practices
• Social connection

Why this matters:
• Gut-brain axis is bidirectional
• Stress directly impacts gut motility and secretions
• Chronic stress prevents healing
• Lifestyle factors are often the root cause

Practical interventions:
• Vagal toning (breathing, cold exposure)
• Mindful eating practices
• Regular physical activity
• Adequate sleep (7-9 hours)
• Stress reduction techniques

Timeline: Ongoing lifestyle modification

---

CUSTOMIZING THE 5R

Not every client needs every step equally. Customize based on:
• Assessment findings
• Testing results
• What's already been tried
• Current symptoms
• Client capacity

The 5R is a framework, not a rigid protocol.`
            },
            {
                title: "Chapter 4: Diet Protocols for Gut Healing",
                readTime: "18 min",
                content: `CHOOSING THE RIGHT DIET

No single diet works for everyone. Selection depends on:
• Current symptoms
• Testing results
• Previous dietary attempts
• Client's lifestyle and capacity
• Root cause identification

THE ELIMINATION DIET

Purpose: Identify food triggers

Basic protocol:
• Remove: gluten, dairy, eggs, soy, corn, nightshades, nuts, seeds, sugar, alcohol
• Duration: 3-4 weeks
• Then: Systematic reintroduction (one food every 3 days)

When to use:
• Multiple food reactions
• Unknown triggers
• Failed previous approaches
• Systemic inflammation

Client education:
• It's temporary, not forever
• The goal is information
• Strict compliance for accurate results
• Detailed symptom tracking essential

---

LOW-FODMAP DIET

What: Reduces fermentable carbohydrates that feed bacteria

FODMAP = Fermentable Oligosaccharides, Disaccharides, Monosaccharides, And Polyols

When to use:
• SIBO (especially during treatment)
• IBS symptoms
• Significant bloating with specific foods
• When bacterial overgrowth suspected

Phases:
1. Elimination (2-6 weeks): Remove high-FODMAP foods
2. Reintroduction (6-8 weeks): Systematic testing of FODMAP groups
3. Personalization: Long-term modified approach

High-FODMAP foods to avoid:
• Onions, garlic
• Wheat, rye
• Apples, pears, watermelon
• Dairy with lactose
• Legumes
• Sugar alcohols

Caution:
• Not meant to be long-term
• Can reduce microbiome diversity if prolonged
• Requires education for proper execution

---

ANTI-INFLAMMATORY DIET

What: Reduces inflammatory foods, increases anti-inflammatory nutrients

When to use:
• Chronic inflammation
• Autoimmune patterns
• Healing phase of gut protocol
• General maintenance

Core principles:
• Remove: processed foods, sugar, refined oils, alcohol
• Increase: vegetables, omega-3s, herbs/spices, colorful plants
• Emphasize: whole foods, quality proteins, healthy fats

Foods to emphasize:
• Fatty fish (salmon, sardines)
• Leafy greens
• Berries
• Turmeric, ginger
• Bone broth
• Extra virgin olive oil

---

SPECIFIC CARBOHYDRATE DIET (SCD)

What: Removes complex carbohydrates that may feed pathogens

When to use:
• IBD support
• Severe gut dysbiosis
• When other approaches fail

Principles:
• Only "allowed" carbs (monosaccharides)
• Removes all grains, potatoes, most starches
• Emphasizes specific yogurt, nuts, fruits
• Very restrictive

Caution: Requires significant commitment. Not for everyone.

---

AUTOIMMUNE PROTOCOL (AIP)

What: Elimination diet specifically for autoimmune conditions

When to use:
• Hashimoto's, RA, MS, other autoimmune
• Suspected autoimmune gut issues
• When elimination diet needs to go deeper

Removes (in addition to basic elimination):
• Nightshades
• Eggs
• Nuts and seeds
• Coffee
• Alcohol
• Spices from seeds

Phases:
1. Elimination (30-60 days)
2. Reintroduction (slow and systematic)
3. Personalization

This is the most restrictive approach. Reserve for when needed.

---

IMPLEMENTATION TIPS

Start where they are:
• If they eat fast food daily, jumping to AIP won't work
• Meet them where they are
• Small steps build momentum

Make it practical:
• Provide meal plans
• Simple recipes
• Shopping lists
• Batch cooking strategies

Set expectations:
• It takes time to see results
• Symptoms may temporarily worsen (die-off, adjustment)
• Compliance matters
• This is diagnostic, not forever

Support adherence:
• Regular check-ins
• Troubleshooting sessions
• Flexibility where possible
• Celebrate wins`
            },
            {
                title: "Chapter 5: Interpreting Functional Testing",
                readTime: "20 min",
                content: `WHY FUNCTIONAL TESTING?

Standard labs miss a lot. Functional testing provides:
• Earlier detection of dysfunction
• Insight into root causes
• Objective data for protocol design
• Progress tracking

Limitation: Testing is a tool, not a diagnosis. Always correlate with symptoms.

---

COMPREHENSIVE STOOL TESTING

What it measures:
• Digestive function markers
• Inflammatory markers
• Microbiome composition
• Pathogens (bacteria, yeast, parasites)
• Immune markers

Key markers to evaluate:

DIGESTION:
• Pancreatic elastase-1: <200 mcg/g suggests insufficiency
• Fat: High levels suggest maldigestion
• Muscle and vegetable fibers: High suggests inadequate chewing/enzymes

INFLAMMATION:
• Calprotectin: >50-100 mcg/g indicates intestinal inflammation
• Lactoferrin: Elevated with active inflammation
• Secretory IgA: Low (<400) indicates mucosal vulnerability; high (>2000) indicates immune response

MICROBIOME:
• Diversity: Higher diversity generally better
• Commensal bacteria: Looking for adequate beneficial species
• Dysbiotic bacteria: Opportunistic overgrowths

PATHOGENS:
• Bacteria: H. pylori, opportunistic overgrowths
• Yeast: Candida species
• Parasites: Various

ZONULIN:
• Marker for intestinal permeability
• Elevated suggests "leaky gut"

---

SIBO BREATH TEST INTERPRETATION

Positive hydrogen:
• Rise of >20 ppm within 90-120 minutes
• Earlier rise suggests more proximal overgrowth

Positive methane:
• >10 ppm at any point during test
• Often associated with constipation
• May be present throughout test

Patterns:
• Early peak: Upper small intestine involvement
• Double peak: Both small and large intestine
• Flat line: Possible hydrogen sulfide or non-producer

Post-treatment testing:
• Wait 2-4 weeks after treatment
• Retest to confirm eradication
• Some practitioners skip if symptoms resolve

---

FOOD SENSITIVITY TESTING

IgG testing:
• Controversial in the field
• May indicate foods frequently eaten
• Use as guide, not gospel
• Elimination diet remains gold standard

When it can help:
• Client can't tolerate full elimination
• Multiple symptoms, no clear pattern
• As a starting point for elimination

Interpret with caution:
• High IgG doesn't always mean problematic
• Can guide where to start
• Always confirm with elimination/reintroduction

---

ORGANIC ACIDS TEST (OAT)

What it measures:
• Metabolic markers in urine
• Yeast and bacterial metabolites
• Nutrient markers
• Neurotransmitter metabolites
• Detoxification markers

Gut-related markers:
• Arabinose: Yeast/Candida marker
• HPHPA: Clostridia marker
• Various organic acids indicating dysbiosis

When to use:
• Suspected yeast overgrowth
• Brain fog, mood issues with gut symptoms
• Fatigue with digestive complaints

---

PUTTING IT TOGETHER

Testing is most useful when:
• Correlated with symptoms
• Used to guide protocol decisions
• Repeated to track progress

Testing is least useful when:
• Used in isolation
• Interpreted literally without clinical context
• Used to treat numbers, not people

Golden rule: Treat the patient, not the lab.`
            },
            {
                title: "Chapter 6: Troubleshooting and Complex Cases",
                readTime: "15 min",
                content: `WHEN PROTOCOLS DON'T WORK

You will have clients who don't respond as expected. This is normal.

Troubleshooting checklist:

1. COMPLIANCE CHECK
• Are they actually following the protocol?
• All of it, or just some?
• Are they being honest about it?
• What's getting in the way?

2. MISSED ROOT CAUSE
• Did you address the actual cause?
• Multiple things happening?
• Something outside gut (thyroid, blood sugar, etc.)?
• Stress overwhelming everything else?

3. PROTOCOL ISSUES
• Right approach, wrong timing?
• Dosing issues?
• Quality of products?
• Interactions with medications?

4. SOMETHING ELSE GOING ON
• Red flags present?
• Need further testing?
• Need referral?

---

COMMON STUCK POINTS

Client improves, then plateaus:
• May have addressed one issue but another remains
• Consider retesting
• Look at what phase they're in
• May need to maintain before progressing

Symptoms get worse with treatment:
• Die-off reaction (temporary)
• Reaction to supplements
• Wrong diagnosis
• Too aggressive approach

Solution: Slow down, reduce doses, support drainage

Chronic constipation despite protocol:
• Is it actually SIBO-related?
• Thyroid function?
• Magnesium status?
• Hydration?
• Vagal tone?
• Physical issues (pelvic floor)?

SIBO keeps recurring:
• Not addressing underlying cause
• Structural issues (adhesions, surgeries)
• Motility dysfunction (need prokinetics)
• Stress and lifestyle factors
• Food poisoning antibodies (anti-vinculin, anti-CdtB)

Multiple food sensitivities:
• Usually indicates leaky gut
• Focus on repair before restriction
• Consider histamine intolerance
• Look for hidden inflammation
• May need extended healing time

---

COMPLEX CASE CONSIDERATIONS

Autoimmune + gut issues:
• Often connected
• Gut healing supports autoimmune management
• AIP diet may be indicated
• Longer healing timeline
• Work with their medical team

SIBO + SIFO (fungal):
• Can coexist
• May need to address both
• Antifungal support
• Sugar/yeast restriction

Post-infectious gut issues:
• Different approach than dysbiosis
• May have antibody component
• Prokinetics especially important
• Often longer recovery

Eating disorder history:
• Tread carefully with restrictions
• Work with ED specialist
• Non-diet-focused approaches
• Relationship with food matters more

---

WHEN TO REFER

Red flags (always refer):
• Blood in stool
• Unintended weight loss
• New symptoms over 50
• Family history of GI cancers
• Signs of obstruction

Beyond scope:
• When condition requires diagnosis
• When prescription needed
• When symptoms don't match testing
• When you've tried everything

Not a failure to refer—it's good practice.`
            }
        ]
    },
    {
        id: "scope-ethics-guide",
        title: "Scope of Practice & Ethics Guide",
        subtitle: "Protecting Yourself While Helping Clients",
        description: "Navigate the legal and ethical landscape of functional medicine practice. Know exactly what you can and cannot do, say, and recommend.",
        author: "AccrediPro Academy",
        pages: 48,
        icon: "⚖️",
        category: "core",
        topics: ["Legal Boundaries", "Scope of Practice", "Documentation", "Liability Protection"],
        readTime: "2 hours",
        unlockedDate: "2024-12-01",
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

    // Load progress from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("library-saved");
        const progress = localStorage.getItem("library-progress");
        if (saved) setSavedEbooks(JSON.parse(saved));
        if (progress) setReadingProgress(JSON.parse(progress));
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

    const filteredEbooks = MY_EBOOKS.filter(ebook => {
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

    const inProgressCount = MY_EBOOKS.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).length;
    const completedCount = MY_EBOOKS.filter(e => isEbookComplete(e.id, e.chapters.length)).length;

    // READING VIEW
    if (readingEbook) {
        const ebookProgress = readingProgress[readingEbook.id] || { completedChapters: [], currentChapter: 0 };
        const isChapterComplete = ebookProgress.completedChapters.includes(currentChapter);

        return (
            <div className="min-h-screen bg-gray-50">
                {/* Reading Header */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

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
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <BookOpen className="w-4 h-4" /> {MY_EBOOKS.length} E-Books
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <PlayCircle className="w-4 h-4" /> {inProgressCount} In Progress
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
                            {MY_EBOOKS.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).map((ebook) => {
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
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setActiveTab("all")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "all" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        All ({MY_EBOOKS.length})
                    </button>
                    <button onClick={() => setActiveTab("inprogress")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "inprogress" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
                        <PlayCircle className="w-4 h-4 inline mr-1" /> In Progress ({inProgressCount})
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
                            <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <span className="text-4xl">{ebook.icon}</span>
                                        <div className="flex items-center gap-2">
                                            {isComplete && <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">✓ Complete</Badge>}
                                            {!isComplete && progress > 0 && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{progress}%</Badge>}
                                            <Button variant="ghost" size="sm" onClick={() => toggleSaved(ebook.id)} className={savedEbooks.includes(ebook.id) ? "text-burgundy-600" : "text-gray-400"}>
                                                {savedEbooks.includes(ebook.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                                            </Button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-burgundy-600 transition-colors">{ebook.title}</h3>
                                    <p className="text-sm text-burgundy-600 mb-2">{ebook.subtitle}</p>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>
                                    <p className="text-xs text-gray-500 mb-3">By {ebook.author}</p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {ebook.topics.slice(0, 2).map((topic) => (
                                            <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                                        ))}
                                    </div>

                                    <div className="flex items-center text-xs text-gray-500 mb-4">
                                        <span><FileText className="w-3 h-3 inline mr-1" />{ebook.chapters.length} chapters</span>
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

                {/* Get More CTA */}
                <div className="mt-12 bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-8 text-white">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Expand Your Library</h2>
                                <p className="text-white/80">Browse more professional e-books and bundles</p>
                            </div>
                        </div>
                        <a href="/ebooks">
                            <Button className="bg-white text-burgundy-700 hover:bg-burgundy-50 font-semibold px-6 py-6 text-lg">
                                <ShoppingBag className="w-5 h-5 mr-2" /> Visit E-Book Store <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
