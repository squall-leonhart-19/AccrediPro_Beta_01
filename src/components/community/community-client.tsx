"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Pin,
  Eye,
  Clock,
  Search,
  TrendingUp,
  Heart,
  Sparkles,
  Trophy,
  HelpCircle,
  Lightbulb,
  Megaphone,
  Hand,
  GraduationCap,
  Shield,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Award,
  Flame,
  BadgeCheck,
  Headphones,
  ChevronDown,
} from "lucide-react";
import { CreatePostDialog } from "@/components/community/create-post-dialog";

// Emoji reactions - same as post detail page
const REACTION_EMOJIS = ["❤️", "🔥", "👏", "💯", "🎉", "💪", "⭐", "🙌"];

// Sort options
const SORT_OPTIONS = [
  { id: "newest", label: "Newest First", icon: Clock },
  { id: "popular", label: "Most Popular", icon: TrendingUp },
  { id: "trending", label: "Trending", icon: Flame },
  { id: "most_comments", label: "Most Discussed", icon: MessageCircle },
];

// Post categories for filtering within communities
// Order: Introduce Yourself, Daily Coach Tips, Share Your Wins (merged), New Graduates, Questions & Help (last)
// Comment-only: introductions, tips (users can only comment, not create new posts)
const postCategories = [
  { id: "introductions", label: "Introduce Yourself", icon: Hand, color: "bg-pink-100 text-pink-700", bgGradient: "from-pink-50 to-rose-50", commentOnly: true },
  { id: "tips", label: "Daily Coach Tips", icon: Lightbulb, color: "bg-green-100 text-green-700", bgGradient: "from-green-50 to-emerald-50", commentOnly: true },
  { id: "wins", label: "Share Your Wins", icon: Trophy, color: "bg-amber-100 text-amber-700", bgGradient: "from-amber-50 to-yellow-50" },
  { id: "graduates", label: "New Graduates", icon: GraduationCap, color: "bg-emerald-100 text-emerald-700", bgGradient: "from-emerald-50 to-teal-50" },
  { id: "questions", label: "Questions & Help", icon: HelpCircle, color: "bg-blue-100 text-blue-700", bgGradient: "from-blue-50 to-sky-50" },
];

// Featured graduates pool - rotates daily
const FEATURED_GRADUATES = [
  {
    name: "Maria Rodriguez",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Earned $8,500 in her first 60 days!",
    quote: "The community support made all the difference. I couldn't have done it without the coaches and fellow students cheering me on!",
    certified: true,
    monthsActive: 4,
  },
  {
    name: "Jennifer Thompson",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Quit her nursing job & now earns more!",
    quote: "25 years as an ER nurse. Now I help 47+ clients and actually enjoy my work again!",
    certified: true,
    monthsActive: 12,
  },
  {
    name: "David Chen",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Signed first $1,200 client in week 3!",
    quote: "After 3 weeks of networking, someone said YES! I'm literally shaking - this is real!",
    certified: true,
    monthsActive: 2,
  },
  {
    name: "Amanda Foster",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Hit $5K monthly revenue in month 4!",
    quote: "Posting valuable content and following up with every lead. The business kits made launching so easy!",
    certified: true,
    monthsActive: 4,
  },
  {
    name: "Sarah Williams",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Booked 12 clients in first month!",
    quote: "The structured curriculum and mentor support gave me everything I needed to succeed!",
    certified: true,
    monthsActive: 3,
  },
  {
    name: "Michael Roberts",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Left corporate & earning $8K/month!",
    quote: "Best decision I ever made. The community keeps me motivated every single day!",
    certified: true,
    monthsActive: 6,
  },
  {
    name: "Lisa Martinez",
    title: "FM Practitioner",
    avatar: null,
    achievement: "Launched online practice, 20+ clients!",
    quote: "From zero to 20 clients in 2 months. The training is worth every minute!",
    certified: true,
    monthsActive: 2,
  },
];

// Get daily rotating featured graduate based on day of year
const getDailyFeaturedGraduate = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return FEATURED_GRADUATES[dayOfYear % FEATURED_GRADUATES.length];
};

// Static reaction counts for posts - total ~2000 distributed across emojis
const STATIC_REACTIONS = {
  pinned: { "❤️": 547, "🔥": 423, "👏": 356, "💯": 289, "🎉": 198, "💪": 134, "⭐": 87, "🙌": 56 }, // ~2090
  featured: { "❤️": 412, "🔥": 334, "👏": 278, "💯": 234, "🎉": 167, "💪": 123, "⭐": 78, "🙌": 45 }, // ~1671
  regular: { "❤️": 234, "🔥": 189, "👏": 156, "💯": 123, "🎉": 98, "💪": 67, "⭐": 45, "🙌": 28 }, // ~940
  question: { "❤️": 145, "🔥": 112, "👏": 89, "💯": 67, "🎉": 45, "💪": 34, "⭐": 23, "🙌": 15 }, // ~530
};

// Sample posts data for demonstration - Based on buyer personas
const SAMPLE_POSTS = [
  {
    id: "pinned-introductions",
    title: "Welcome! Introduce Yourself to the Community",
    content: `Hello and welcome to the AccrediPro Functional Medicine community!

We're so excited you're here. This is a supportive space where practitioners at every stage of their journey come together to learn, grow, and celebrate wins.

**Please introduce yourself by commenting below!**

Share a bit about:
- Your name and where you're from
- Your background (healthcare, wellness, career changer?)
- What drew you to Functional Medicine
- What you hope to achieve
- One fun fact about yourself!

Don't be shy - everyone here started exactly where you are. Our community is incredibly supportive, and many lifelong friendships have started with a simple introduction.

We can't wait to meet you and support you on your journey!`,
    category: "introductions",
    isPinned: true,
    viewCount: 12847,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    author: {
      id: "admin-1",
      firstName: "AccrediPro",
      lastName: "Founder",
      avatar: "/images/coaches/founder.jpg",
      role: "ADMIN",
      isCertified: true,
    },
    _count: { comments: 1247, likes: 2156 },
    reactions: STATIC_REACTIONS.pinned,
  },
  {
    id: "tips-daily-1",
    title: "Today's Tip: The #1 Mistake New Practitioners Make (And How to Avoid It)",
    content: `Good morning everyone!

After coaching 500+ practitioners, I see this mistake constantly:

**Waiting until you feel "ready" to start getting clients.**

Here's the truth: You'll never feel 100% ready. The confidence comes FROM doing the work, not before it.

**My challenge for you today:**
Reach out to 3 people in your network who might benefit from what you're learning. Not to sell - just to have a conversation.

You'd be amazed how many clients come from simply talking about what you do.

Who's taking me up on this challenge? Drop a 🙋 below!`,
    category: "tips",
    isPinned: true,
    viewCount: 3456,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    author: {
      id: "coach-sarah",
      firstName: "Dr. Sarah",
      lastName: "Mitchell",
      avatar: "/images/coaches/sarah.jpg",
      role: "MENTOR",
      isCertified: true,
    },
    _count: { comments: 89, likes: 412 },
    reactions: STATIC_REACTIONS.pinned,
  },
  {
    id: "graduate-featured",
    title: "I DID IT! From Burned-Out Nurse to Thriving FM Practitioner - My Journey",
    content: `I can't believe I'm writing this. After 22 years as an ICU nurse, I finally made the leap.

**Where I was 8 months ago:**
- Working 12-hour shifts, exhausted and frustrated
- Watching patients get sicker despite our interventions
- Dreaming of helping people PREVENT disease, not just manage it
- Terrified to leave my "secure" hospital job

**Where I am today:**
- Certified Functional Medicine Practitioner
- 18 paying clients in my first 3 months
- $6,200 revenue last month (working 25 hours/week!)
- Actually EXCITED to go to work

The transformation wasn't easy. There were nights I questioned everything. But this community kept me going.

Special thanks to Dr. Sarah for the 1:1 coaching calls that helped me believe in myself.

To everyone still in the studying phase - it's worth every minute. Your future clients are waiting for YOU specifically.

If I can do this at 47, so can you. 💪`,
    category: "graduates",
    isPinned: true,
    viewCount: 2847,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    author: {
      id: "user-rachel",
      firstName: "Rachel",
      lastName: "Simmons",
      avatar: null,
      role: "STUDENT",
      isCertified: true,
    },
    _count: { comments: 67, likes: 289 },
    reactions: STATIC_REACTIONS.featured,
  },
  {
    id: "wins-featured",
    title: "Just Closed My First $3,000 Package! Screaming Internally!",
    content: `IT HAPPENED!!!

After 2 months of putting myself out there, doing free discovery calls, and honestly... wanting to quit multiple times...

A woman I met at a local networking event just paid IN FULL for my 12-week gut health transformation package. $3,000.

She said: "I've been to 5 different doctors and no one has ever listened to me like you did on our call."

That's it. That's the secret. Just LISTEN.

I'm literally crying as I type this. This is real. I'm actually doing this.

To everyone who encouraged me when I got zero responses to my first posts - thank you. Your words kept me going.

Now excuse me while I go process this massive win! 🎉`,
    category: "wins",
    isPinned: false,
    viewCount: 1567,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    author: {
      id: "user-michelle",
      firstName: "Michelle",
      lastName: "Torres",
      avatar: null,
      role: "STUDENT",
      isCertified: false,
    },
    _count: { comments: 94, likes: 378 },
    reactions: STATIC_REACTIONS.featured,
  },
  {
    id: "question-1",
    title: "How do you handle clients who want to quit after 2 weeks?",
    content: `I have a client who started my 8-week program but is already saying she doesn't see results and wants to stop.

She's been doing everything right but it's only been 14 days!

I know healing takes time but I don't want to come across as pushy or salesy.

How do you experienced practitioners handle this? Do you offer refunds? Extend the program?

Any scripts or talking points would be super helpful. I really want to help her but I'm struggling with how to communicate this.`,
    category: "questions",
    isPinned: false,
    viewCount: 892,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    author: {
      id: "user-emma",
      firstName: "Emma",
      lastName: "Richardson",
      avatar: null,
      role: "STUDENT",
      isCertified: false,
    },
    _count: { comments: 34, likes: 56 },
    reactions: STATIC_REACTIONS.question,
  },
  {
    id: "graduate-2",
    title: "Left My Corporate Job 6 Months Ago - Here's My Honest Income Report",
    content: `I know a lot of people here are wondering if this is actually viable as a career change. So I'm sharing my real numbers.

**Background:** 15 years in pharmaceutical sales. Made great money but felt empty selling drugs I didn't believe in.

**My 6-Month Journey:**
- Month 1: $0 (still studying)
- Month 2: $800 (2 clients at $400 each)
- Month 3: $2,100 (started raising prices)
- Month 4: $3,400 (referrals started coming)
- Month 5: $4,200 (added group program)
- Month 6: $5,800 (best month yet!)

**Total: $16,300 in 6 months**

Not a millionaire yet 😄 but I work 30 hours/week, from home, helping people I actually care about.

My corporate salary was higher but my LIFE is infinitely better.

Happy to answer any questions about the transition!`,
    category: "graduates",
    isPinned: false,
    viewCount: 2341,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    author: {
      id: "user-james",
      firstName: "James",
      lastName: "Patterson",
      avatar: null,
      role: "STUDENT",
      isCertified: true,
    },
    _count: { comments: 78, likes: 234 },
    reactions: STATIC_REACTIONS.regular,
  },
  {
    id: "wins-2",
    title: "Month 4 Update: Hit $8K and Quit My Day Job!",
    content: `Quick update for anyone following my journey:

**Revenue breakdown this month:**
- 4 x 12-week clients ($1,497 each) = $5,988
- 1 x VIP Day ($1,500) = $1,500
- 2 x renewals ($297 each) = $594
- **Total: $8,082**

I officially submitted my resignation yesterday. My last day at the hospital is in 2 weeks.

**What's working:**
1. Instagram Reels (one went viral - 45K views!)
2. Free monthly webinar on gut health
3. Email sequence from the business kit
4. Most importantly: showing up consistently even when I didn't feel like it

To everyone still working their 9-5 while building this dream - keep going. The compound effect is REAL.`,
    category: "wins",
    isPinned: false,
    viewCount: 1823,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    author: {
      id: "user-amanda",
      firstName: "Amanda",
      lastName: "Foster",
      avatar: null,
      role: "STUDENT",
      isCertified: true,
    },
    _count: { comments: 112, likes: 467 },
    reactions: STATIC_REACTIONS.featured,
  },
  {
    id: "tips-2",
    title: "The Email Template That Gets Me 80% Response Rate",
    content: `I've tested probably 30 different follow-up email templates. This one consistently gets 80%+ response rate.

**Subject:** Quick question about [specific symptom they mentioned]

**Body:**
Hi [Name],

I was thinking about our conversation and wanted to share something that might help with [specific symptom].

[2-3 sentences of actual value - not a pitch]

Would love to hear how you're doing. No pressure to book anything - just genuinely curious how you're feeling.

[Your name]

**Why it works:**
- Personal subject line
- Provides actual value upfront
- No sales pressure
- Shows you actually listened

The key is the "no pressure" part. Counterintuitive, but removing pressure actually increases conversions.

Try it this week and report back!`,
    category: "tips",
    isPinned: false,
    viewCount: 2156,
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    author: {
      id: "coach-sarah",
      firstName: "Dr. Sarah",
      lastName: "Mitchell",
      avatar: "/images/coaches/sarah.jpg",
      role: "MENTOR",
      isCertified: true,
    },
    _count: { comments: 67, likes: 298 },
    reactions: STATIC_REACTIONS.regular,
  },
  {
    id: "question-2",
    title: "Imposter syndrome hitting hard - how do you all deal with it?",
    content: `I'm halfway through the certification and I keep thinking "who am I to help people with their health?"

I don't have a medical degree. I'm just a mom who got interested in this because of my own health struggles.

Every time I think about actually charging money for my services, I freeze up.

Did anyone else go through this? How did you get over it?

I know logically that I'm learning valuable skills but emotionally I feel like a fraud.`,
    category: "questions",
    isPinned: false,
    viewCount: 1456,
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    author: {
      id: "user-lisa",
      firstName: "Lisa",
      lastName: "Chen",
      avatar: null,
      role: "STUDENT",
      isCertified: false,
    },
    _count: { comments: 89, likes: 234 },
    reactions: STATIC_REACTIONS.question,
  },
  {
    id: "intro-new",
    title: "Hello from Texas! Corporate Lawyer Ready for a Change",
    content: `Hi everyone! I'm Katherine from Austin, Texas.

**My background:** 18 years as a corporate lawyer. Great money, zero fulfillment. I've been running on coffee and stress for so long I forgot what energy feels like.

**Why I'm here:** My own health crash 2 years ago led me to functional medicine. A practitioner helped me reverse issues my regular doctor said were "just part of aging." I was SOLD.

**My goal:** Build a practice helping other burned-out professionals reclaim their health. Eventually transition out of law completely.

**Fun fact:** I'm a competitive ballroom dancer! It's my stress relief.

So excited to be here and learn from all of you. The success stories in this community are incredibly inspiring!`,
    category: "introductions",
    isPinned: false,
    viewCount: 678,
    createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
    author: {
      id: "user-katherine",
      firstName: "Katherine",
      lastName: "Williams",
      avatar: null,
      role: "STUDENT",
      isCertified: false,
    },
    _count: { comments: 34, likes: 89 },
    reactions: STATIC_REACTIONS.regular,
  },
];

// Preview comments for each post - serious buyer persona comments
const POST_PREVIEW_COMMENTS: Record<string, Array<{
  id: string;
  author: { firstName: string; lastName: string; role: string; avatar?: string };
  content: string;
  timeAgo: string;
}>> = {
  "pinned-introductions": [
    { id: "c1", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "Welcome to everyone new this week! Don't be shy - we all started somewhere. This community changed my life and I know it will change yours too. 💕", timeAgo: "2h ago" },
    { id: "c2", author: { firstName: "Jennifer", lastName: "Martinez", role: "STUDENT" }, content: "Hi everyone! Former ER nurse from Colorado. 20 years of band-aid medicine made me realize I needed to help people PREVENT disease, not just treat it. So grateful to be here!", timeAgo: "3h ago" },
    { id: "c3", author: { firstName: "Michael", lastName: "Thompson", role: "STUDENT" }, content: "Corporate burnout survivor checking in from NYC! After my own health crisis at 42, I discovered functional medicine and it literally saved my life. Now I want to help others. 🙏", timeAgo: "4h ago" },
  ],
  "tips-daily-1": [
    { id: "c4", author: { firstName: "Rachel", lastName: "Simmons", role: "STUDENT" }, content: "🙋 Challenge accepted! I've been putting off reaching out because I didn't feel 'ready.' But you're right - I'll never feel 100% ready. Messaging 3 people today!", timeAgo: "1h ago" },
    { id: "c5", author: { firstName: "Amanda", lastName: "Foster", role: "STUDENT" }, content: "THIS. My first client came from exactly this - just having a conversation with a friend about gut health. She asked for help and I almost said no because I wasn't 'certified yet.' Now she's my best testimonial!", timeAgo: "2h ago" },
    { id: "c6", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "Love seeing everyone take action! Remember: imperfect action beats perfect inaction every single time. Keep me posted on how those conversations go! 🌟", timeAgo: "45m ago" },
  ],
  "graduate-featured": [
    { id: "c7", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "Rachel, I'm SO proud of you! Watching your transformation from that first overwhelmed coaching call to now has been incredible. You're proof that it's never too late to reinvent yourself. 💪", timeAgo: "4h ago" },
    { id: "c8", author: { firstName: "Lisa", lastName: "Chen", role: "STUDENT" }, content: "This gives me SO much hope. I'm a burned-out teacher with the same fears you had. If you can do it at 47, I can do it at 44. Thank you for sharing!", timeAgo: "5h ago" },
    { id: "c9", author: { firstName: "James", lastName: "Patterson", role: "STUDENT" }, content: "The part about 'your future clients are waiting for YOU specifically' hit me hard. There are people out there who need exactly what we have to offer. No one else can help them the way we can.", timeAgo: "5h ago" },
  ],
  "wins-featured": [
    { id: "c10", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "MICHELLE!!! 🎉🎉🎉 I am screaming with you! This is EXACTLY what happens when you show up authentically and truly listen. You earned every penny of that $3,000. So proud of you!", timeAgo: "2h ago" },
    { id: "c11", author: { firstName: "Rachel", lastName: "Simmons", role: "STUDENT" }, content: "The 'just LISTEN' part is everything. Doctors spend 7 minutes with patients on average. We have the gift of TIME and ATTENTION. Congratulations Michelle - this is huge! 🙌", timeAgo: "3h ago" },
    { id: "c12", author: { firstName: "Katherine", lastName: "Williams", role: "STUDENT" }, content: "I needed to see this today. I'm still in the studying phase but posts like this remind me WHY I'm doing this. Your client is lucky to have found you!", timeAgo: "3h ago" },
  ],
  "question-1": [
    { id: "c13", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "Great question Emma! This is so common. I always set expectations upfront: 'You didn't get here overnight, and you won't heal overnight.' Schedule a check-in call to reconnect her to her WHY. Often clients just need reassurance, not a refund.", timeAgo: "3h ago" },
    { id: "c14", author: { firstName: "James", lastName: "Patterson", role: "STUDENT" }, content: "I had this exact situation last month. I showed her a timeline of typical healing and asked what small improvements she'd noticed. Turns out she HAD improved - her sleep was better - she just hadn't noticed. She stayed!", timeAgo: "4h ago" },
    { id: "c15", author: { firstName: "Amanda", lastName: "Foster", role: "STUDENT" }, content: "Celebrating small wins is key! I have clients track 3 things daily and review weekly. Even small improvements keep them motivated. Also - your contract should specify the no-refund policy. Learned that the hard way! 😅", timeAgo: "4h ago" },
  ],
  "graduate-2": [
    { id: "c16", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "James, thank you for being so transparent with your numbers! This is EXACTLY the kind of realistic expectation-setting our community needs. $16K in 6 months while building from scratch is incredible. And you're right - the LIFE improvement is priceless.", timeAgo: "6h ago" },
    { id: "c17", author: { firstName: "Michelle", lastName: "Torres", role: "STUDENT" }, content: "The honesty here is so refreshing. I appreciate you sharing the $0 month too. So many people only share the highlights. This is real. How did you handle the doubt during that first $0 month?", timeAgo: "7h ago" },
    { id: "c18", author: { firstName: "Katherine", lastName: "Williams", role: "STUDENT" }, content: "As someone still in corporate hell (lawyer here), seeing your month-by-month progression gives me a realistic timeline. Did you have savings to cover that first month? Planning my exit strategy now.", timeAgo: "7h ago" },
  ],
  "wins-2": [
    { id: "c19", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "Amanda!!! Quitting your day job is such a milestone! 🎉 You've been one of my most consistent implementers. The compound effect comment is SO TRUE - most people give up right before it starts working.", timeAgo: "10h ago" },
    { id: "c20", author: { firstName: "Rachel", lastName: "Simmons", role: "STUDENT" }, content: "Can you share more about that viral Reel? What was it about? I've been trying to figure out what content resonates. Would love any tips!", timeAgo: "11h ago" },
    { id: "c21", author: { firstName: "Lisa", lastName: "Chen", role: "STUDENT" }, content: "The 'showing up consistently even when I didn't feel like it' part really hits home. That's my biggest struggle. How did you push through on the hard days?", timeAgo: "11h ago" },
  ],
  "tips-2": [
    { id: "c22", author: { firstName: "Amanda", lastName: "Foster", role: "STUDENT" }, content: "Dr. Sarah, this is gold! I've been struggling with follow-ups feeling 'salesy.' The 'no pressure' reframe changes everything. Trying this today with 3 leads who ghosted me!", timeAgo: "16h ago" },
    { id: "c23", author: { firstName: "James", lastName: "Patterson", role: "STUDENT" }, content: "Used this exact template yesterday and got 2 responses within an hour. One booked a discovery call! The key really is removing the sales pressure. People can FEEL when you're trying to close them.", timeAgo: "17h ago" },
    { id: "c24", author: { firstName: "Rachel", lastName: "Simmons", role: "STUDENT" }, content: "Screenshotting this immediately! I've lost so many potential clients because my follow-ups felt awkward. This feels genuinely helpful rather than pushy. Thank you! 🙏", timeAgo: "17h ago" },
  ],
  "question-2": [
    { id: "c25", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "Lisa, imposter syndrome means you CARE about doing good work. It's actually a sign you'll be a great practitioner! Here's the truth: your clients don't need you to know everything. They need you to know MORE than them and genuinely care. You already have both. 💕", timeAgo: "18h ago" },
    { id: "c26", author: { firstName: "Jennifer", lastName: "Martinez", role: "STUDENT" }, content: "I felt exactly this way 6 months ago. Now I have 12 clients and every single one of them thanked me for changing their life. Your personal health journey is your SUPERPOWER, not a weakness. You understand what they're going through!", timeAgo: "19h ago" },
    { id: "c27", author: { firstName: "Michael", lastName: "Thompson", role: "STUDENT" }, content: "Read 'The Big Leap' by Gay Hendricks - it changed how I view imposter syndrome. Also remember: doctors spend years learning to prescribe pills. You're learning to address ROOT CAUSES. That's incredibly valuable.", timeAgo: "19h ago" },
  ],
  "intro-new": [
    { id: "c28", author: { firstName: "Dr. Sarah", lastName: "Mitchell", role: "MENTOR", avatar: "/images/coaches/sarah.jpg" }, content: "Welcome Katherine! Your story is so relatable - many of our most successful practitioners are recovering corporate professionals. Your analytical skills and work ethic will serve you incredibly well here. Excited to see you grow! 🌟", timeAgo: "20h ago" },
    { id: "c29", author: { firstName: "James", lastName: "Patterson", role: "STUDENT" }, content: "Hey fellow corporate escapee! 👋 I left pharma sales 6 months ago and it was the best decision ever. The transition is scary but worth it. Feel free to DM me if you want to chat about navigating the career change.", timeAgo: "21h ago" },
    { id: "c30", author: { firstName: "Rachel", lastName: "Simmons", role: "STUDENT" }, content: "Welcome! Competitive ballroom dancing is amazing! I love that you have stress relief already built in - that's so important in this journey. Looking forward to celebrating your wins!", timeAgo: "21h ago" },
  ],
};

// Helper to get preview comments by category for DB posts
const getPreviewCommentsByCategory = (category: string | null): Array<{
  id: string;
  author: { firstName: string; lastName: string; role: string; avatar?: string };
  content: string;
  timeAgo: string;
}> | null => {
  if (!category) return null;

  // Map categories to sample post IDs that have comments
  const categoryToPostId: Record<string, string> = {
    "introductions": "pinned-introductions",
    "tips": "tips-daily-1",
    "wins": "wins-featured",
    "graduates": "graduate-featured",
    "questions": "question-1",
  };

  const postId = categoryToPostId[category];
  return postId ? POST_PREVIEW_COMMENTS[postId] || null : null;
};

interface Post {
  id: string;
  title: string;
  content: string;
  isHtml?: boolean;
  category: string | null;
  communityId: string | null;
  communityName?: string | null;
  categoryName?: string | null;
  categoryColor?: string | null;
  isPinned: boolean;
  viewCount: number;
  createdAt: Date;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    role: string;
    isCertified?: boolean;
  };
  _count: {
    comments: number;
    likes: number;
  };
  reactions?: Record<string, number>;
}

interface Stats {
  totalMembers: number;
  totalPosts: number;
  totalComments: number;
  activeToday: number;
}

interface Community {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  memberCount: number;
}

interface CommunityClientProps {
  posts: Post[];
  stats: Stats;
  communities?: Community[];
  isAdmin?: boolean;
}

export function CommunityClient({ posts: dbPosts, stats, communities = [], isAdmin = false }: CommunityClientProps) {
  const [selectedCommunity, setSelectedCommunity] = useState<string>("all");
  // Default to "introductions" - most welcoming entry point for new members
  const [selectedCategory, setSelectedCategory] = useState<string | null>("introductions");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Dynamic impressive stats - updates every 30 seconds for real-time feel
  const getDynamicStats = () => {
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const hourOfDay = now.getHours();
    const secondsInDay = hourOfDay * 3600 + now.getMinutes() * 60 + now.getSeconds();

    // Base numbers - starting high, growing day by day
    const baseMembers = 5235;
    const basePractitioners = 1403;
    const baseTransformations = 20134;
    const baseEarnings = 8400000;

    // Add realistic growth day by day (small increments)
    const memberGrowth = dayOfYear * 2; // ~2 new members per day
    const practitionerGrowth = Math.floor(dayOfYear * 0.5); // ~1 every 2 days
    const transformationGrowth = dayOfYear * 5; // ~5 per day
    const earningsGrowth = dayOfYear * 8000; // grows with practitioners

    // Online count: dynamic range 53-197
    // Use sine wave for smooth variation throughout the day
    const onlineBase = 125; // midpoint of 53-197
    const onlineRange = 72; // half of (197-53)

    // Multiple sine waves for natural variation
    const hourVariation = Math.sin((hourOfDay / 24) * Math.PI * 2) * 40; // daily cycle
    const minuteVariation = Math.sin(secondsInDay / 1800) * 20; // 30-min cycle
    const smallVariation = Math.sin(secondsInDay / 180) * 12; // 3-min micro-variation

    // Calculate online count within 53-197 range
    const rawOnline = onlineBase + hourVariation + minuteVariation + smallVariation;
    const onlineNow = Math.max(53, Math.min(197, Math.floor(rawOnline)));

    // Coaches online: 5-10 range
    const baseCoaches = 7;
    const coachVariation = Math.floor(Math.sin(secondsInDay / 600) * 2.5);
    const coachesAvailable = Math.max(5, Math.min(10, baseCoaches + coachVariation));

    return {
      totalMembers: baseMembers + memberGrowth,
      certifiedPractitioners: basePractitioners + practitionerGrowth,
      clientTransformations: baseTransformations + transformationGrowth,
      totalEarnings: baseEarnings + earningsGrowth,
      onlineNow,
      coachesOnline: coachesAvailable,
      avgResponseTime: hourOfDay >= 9 && hourOfDay <= 18 ? "< 30 min" : "< 2 hours",
      postsToday: Math.floor(15 + (dayOfYear % 10) + Math.random() * 10),
      winsThisWeek: Math.floor(23 + (dayOfYear % 7) * 3),
    };
  };

  // State for dynamic stats that updates periodically
  const [dynamicStats, setDynamicStats] = useState(getDynamicStats);

  // Update stats every 30 seconds for real-time feel
  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicStats(getDynamicStats());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Combine DB posts with sample posts for display
  const allPosts = useMemo(() => {
    // If no DB posts, show sample posts
    if (dbPosts.length === 0) {
      return SAMPLE_POSTS.map(p => ({
        ...p,
        communityId: null,
        communityName: null,
        categoryName: null,
        categoryColor: null,
      }));
    }
    return dbPosts;
  }, [dbPosts]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = allPosts.filter((post) => {
      const matchesCommunity = selectedCommunity === "all" || post.communityId === selectedCommunity;
      const matchesCategory = selectedCategory === null || post.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCommunity && matchesCategory && matchesSearch;
    });

    // Sort posts
    switch (sortBy) {
      case "popular":
        filtered = [...filtered].sort((a, b) => b._count.likes - a._count.likes);
        break;
      case "trending":
        // Trending = high engagement relative to age
        filtered = [...filtered].sort((a, b) => {
          const aScore = (a._count.likes + a._count.comments * 2) / Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60));
          const bScore = (b._count.likes + b._count.comments * 2) / Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / (1000 * 60 * 60));
          return bScore - aScore;
        });
        break;
      case "most_comments":
        filtered = [...filtered].sort((a, b) => b._count.comments - a._count.comments);
        break;
      case "newest":
      default:
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Always show pinned posts first
    const pinned = filtered.filter(p => p.isPinned);
    const notPinned = filtered.filter(p => !p.isPinned);
    return [...pinned, ...notPinned];
  }, [allPosts, selectedCommunity, selectedCategory, searchQuery, sortBy]);

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white border-0 text-[10px] font-semibold">
            <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Admin
          </Badge>
        );
      case "INSTRUCTOR":
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 text-[10px] font-semibold">
            Instructor
          </Badge>
        );
      case "MENTOR":
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px] font-semibold">
            <Award className="w-2.5 h-2.5 mr-0.5" /> Coach
          </Badge>
        );
      default:
        return null;
    }
  };

  const getCategoryStyle = (categoryId: string | null) => {
    const cat = postCategories.find(c => c.id === categoryId);
    return cat || { id: "general", label: "General", icon: MessageSquare, color: "bg-gray-100 text-gray-700", bgGradient: "from-gray-50 to-gray-100" };
  };

  const selectedCommunityData = communities.find(c => c.id === selectedCommunity);
  const currentCategoryData = selectedCategory ? postCategories.find(c => c.id === selectedCategory) : null;
  const currentSortOption = SORT_OPTIONS.find(s => s.id === sortBy) || SORT_OPTIONS[0];

  // Calculate total reactions for a post
  const getTotalReactions = (post: Post) => {
    if (!post.reactions) return post._count.likes;
    return Object.values(post.reactions).reduce((sum, count) => sum + count, 0);
  };

  // Get the daily featured graduate
  const featuredGraduate = getDailyFeaturedGraduate();

  return (
    <div className="space-y-6 animate-fade-in max-w-[1600px] mx-auto">
      {/* Compact Hero Banner */}
      <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 border-0 overflow-hidden relative">
        <CardContent className="p-4 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Title + Live Indicator */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Community</h1>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1.5 text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {dynamicStats.onlineNow} online
                  </span>
                  <span className="text-burgundy-200">•</span>
                  <span className="text-burgundy-200">{dynamicStats.coachesOnline} coaches available</span>
                </div>
              </div>
            </div>

            {/* Center: Big Impact Numbers */}
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-white">{dynamicStats.totalMembers.toLocaleString()}</p>
                <p className="text-xs text-burgundy-200">Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-gold-400">{dynamicStats.certifiedPractitioners.toLocaleString()}+</p>
                <p className="text-xs text-burgundy-200">Practitioners</p>
              </div>
              <div className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-green-400">${(dynamicStats.totalEarnings / 1000000).toFixed(1)}M+</p>
                <p className="text-xs text-burgundy-200">Earned by Grads</p>
              </div>
              <div className="text-center hidden md:block">
                <p className="text-3xl lg:text-4xl font-bold text-white">{dynamicStats.clientTransformations.toLocaleString()}+</p>
                <p className="text-xs text-burgundy-200">Lives Changed</p>
              </div>
            </div>

            {/* Right: CTA */}
            <CreatePostDialog
              communityId={selectedCommunity !== "all" ? selectedCommunity : undefined}
              communityName={selectedCommunityData?.name}
              defaultCategory={selectedCategory || undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Community Selector - Hidden for now (FM-only launch) */}
      {/* Students see only their enrolled community based on their tag/optin */}

      <div className="grid lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-4">
          {/* Featured Graduate Spotlight - Simplified */}
          <Card className="border border-gray-200">
            <div className="bg-burgundy-600 p-3">
              <h3 className="font-semibold text-white flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4" />
                Success Story
              </h3>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-semibold text-sm">
                    {featuredGraduate.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-gray-900 text-sm">{featuredGraduate.name}</span>
                  <p className="text-xs text-gray-500">{featuredGraduate.title}</p>
                </div>
              </div>
              <p className="text-sm text-green-700 font-medium mb-2">{featuredGraduate.achievement}</p>
              <p className="text-xs text-gray-600 italic">&quot;{featuredGraduate.quote}&quot;</p>
            </CardContent>
          </Card>

          {/* Topics */}
          <Card className="border border-gray-200">
            <div className="bg-gray-50 border-b border-gray-200 p-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                <Megaphone className="w-4 h-4 text-burgundy-600" />
                Topics
              </h3>
            </div>
            <CardContent className="p-3">
              <div className="space-y-1">
                {postCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all ${
                        isSelected
                          ? `bg-gradient-to-r ${cat.bgGradient} border-2 border-burgundy-200`
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${cat.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <span className={isSelected ? "font-semibold text-burgundy-700" : "text-gray-700"}>
                          {cat.label}
                        </span>
                        {"commentOnly" in cat && cat.commentOnly && (
                          <p className="text-[10px] text-gray-400">Comments only</p>
                        )}
                      </div>
                      {"isNew" in cat && cat.isNew && (
                        <Badge className="bg-purple-500 text-white border-0 text-[10px]">NEW</Badge>
                      )}
                      {isSelected && !("isNew" in cat && cat.isNew) && (
                        <div className="w-2 h-2 rounded-full bg-burgundy-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Ask a Coach CTA - Simplified */}
          <Card className="border border-gray-200 hover:border-burgundy-300 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-burgundy-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ask a Coach</h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {dynamicStats.coachesOnline} online
                  </div>
                </div>
              </div>
              <Link href="/messages">
                <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Coach
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Community Guidelines - Simplified */}
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-gray-500" />
                <h3 className="font-medium text-gray-700 text-sm">Guidelines</h3>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  Be respectful and supportive
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  Celebrate each other&apos;s wins
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                  No spam or self-promotion
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4 xl:col-span-5 space-y-5">
          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search discussions..."
                className="pl-12 h-12 rounded-xl border-2 border-gray-200 focus:border-burgundy-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-3 h-12 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              >
                <currentSortOption.icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{currentSortOption.label}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                        sortBy === option.id ? 'bg-burgundy-50 text-burgundy-700' : 'text-gray-700'
                      }`}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                      {sortBy === option.id && <CheckCircle className="w-4 h-4 ml-auto text-burgundy-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filter Badge */}
          {selectedCategory && currentCategoryData && (
            <div className="flex items-center gap-2">
              <Badge className={`${currentCategoryData.color} border-0 py-2 px-4`}>
                <currentCategoryData.icon className="w-4 h-4 mr-1.5" />
                {currentCategoryData.label}
                <button onClick={() => setSelectedCategory(null)} className="ml-2 hover:opacity-70">×</button>
              </Badge>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-5">
            {filteredAndSortedPosts.map((post) => {
              const catStyle = getCategoryStyle(post.category);
              const CatIcon = catStyle.icon;
              const totalReactions = getTotalReactions(post);

              return (
                <Link key={post.id} href={`/community/${post.id}`}>
                  <Card className={`overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 shadow-lg hover:-translate-y-1 ${
                    post.isPinned ? 'ring-2 ring-amber-300 shadow-amber-100' : ''
                  }`}>
                    {/* Category Banner */}
                    <div className={`bg-gradient-to-r ${catStyle.bgGradient} px-5 py-2 flex items-center justify-between`}>
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${catStyle.color}`}>
                          <CatIcon className="w-3 h-3" />
                        </div>
                        <span className={`text-xs font-medium ${catStyle.color.split(' ')[1]}`}>
                          {catStyle.label}
                        </span>
                      </div>
                      {post.isPinned && (
                        <Badge className="bg-amber-400 text-amber-900 border-0 text-[10px]">
                          <Pin className="w-2.5 h-2.5 mr-1" /> Pinned
                        </Badge>
                      )}
                    </div>

                    <CardContent className="p-5">
                      {/* Author Row */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                          <Avatar className="w-12 h-12 ring-2 ring-white shadow-md">
                            <AvatarImage src={post.author.avatar || undefined} />
                            <AvatarFallback className={`font-bold text-white ${
                              post.author.role === "MENTOR"
                                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                : post.author.role === "ADMIN"
                                ? "bg-gradient-to-br from-burgundy-500 to-burgundy-700"
                                : "bg-gradient-to-br from-gray-400 to-gray-600"
                            }`}>
                              {getInitials(post.author.firstName, post.author.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          {/* Verified Badge for Certified Members */}
                          {post.author.isCertified && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                              <BadgeCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900">
                              {post.author.firstName} {post.author.lastName}
                            </span>
                            {post.author.isCertified && post.author.role === "STUDENT" && (
                              <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px]">
                                <BadgeCheck className="w-2.5 h-2.5 mr-0.5" /> Certified
                              </Badge>
                            )}
                            {getRoleBadge(post.author.role)}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {post.viewCount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight hover:text-burgundy-600 transition-colors">
                        {post.title}
                      </h3>

                      {/* Content Preview */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                        {post.content.replace(/\*\*/g, '').replace(/\n/g, ' ').substring(0, 200)}...
                      </p>

                      {/* Emoji Reactions Bar - All 8 emojis with counts */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {REACTION_EMOJIS.map((emoji, idx) => {
                          const count = post.reactions?.[emoji] || 0;
                          const isFirst = emoji === "❤️";
                          return (
                            <button
                              key={emoji}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                                isFirst
                                  ? "bg-rose-100 border border-rose-200 text-rose-700"
                                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600"
                              }`}
                              onClick={(e) => e.preventDefault()}
                            >
                              <span className="text-base">{emoji}</span>
                              <span>{count}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Preview Comments - Show for all posts based on category */}
                      {(() => {
                        // Get comments by post ID first, then fall back to category-based comments
                        const comments = POST_PREVIEW_COMMENTS[post.id] || getPreviewCommentsByCategory(post.category);
                        if (!comments || comments.length === 0) return null;
                        return (
                          <div className="mb-4 space-y-2 bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span className="font-medium">Recent comments</span>
                            </div>
                            {comments.slice(0, 2).map((comment) => (
                              <div key={comment.id} className="flex gap-2">
                                <Avatar className="h-6 w-6 flex-shrink-0">
                                  <AvatarImage src={comment.author.avatar} />
                                  <AvatarFallback className={`text-[10px] font-bold text-white ${
                                    comment.author.role === "MENTOR"
                                      ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                      : "bg-gradient-to-br from-gray-400 to-gray-600"
                                  }`}>
                                    {comment.author.firstName.charAt(0)}{comment.author.lastName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-xs font-semibold text-gray-900">{comment.author.firstName}</span>
                                    {comment.author.role === "MENTOR" && (
                                      <Badge className="bg-amber-100 text-amber-700 border-0 text-[9px] px-1 py-0">Coach</Badge>
                                    )}
                                    <span className="text-[10px] text-gray-400">{comment.timeAgo}</span>
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-2">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                            {post._count.comments > 2 && (
                              <p className="text-[11px] text-burgundy-600 font-medium mt-1">
                                +{post._count.comments - 2} more comments...
                              </p>
                            )}
                          </div>
                        );
                      })()}

                      {/* Engagement Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-gray-500">
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium">{post._count.comments} comments</span>
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700 hover:bg-burgundy-50">
                          Read more <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}

            {filteredAndSortedPosts.length === 0 && (
              <Card className="border-dashed border-2">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-burgundy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-10 h-10 text-burgundy-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {searchQuery || selectedCategory
                      ? "No posts found"
                      : "Start the conversation!"}
                  </h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    {searchQuery || selectedCategory
                      ? "Try adjusting your filters or search query"
                      : "Be the first to share something with the community"}
                  </p>
                  <CreatePostDialog
                    communityId={selectedCommunity !== "all" ? selectedCommunity : undefined}
                    communityName={selectedCommunityData?.name}
                  />
                </CardContent>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
