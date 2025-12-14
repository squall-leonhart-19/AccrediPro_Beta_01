"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Eye,
  Pin,
  Share2,
  Reply,
  Send,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Trophy,
  HelpCircle,
  Lightbulb,
  GraduationCap,
  Hand,
  Award,
  Bookmark,
  MessageCircle,
  Heart,
} from "lucide-react";

// Banned keywords for client-side moderation warning
const BANNED_KEYWORDS = [
  "refund", "scam", "fraud", "lawsuit", "sue", "money back",
  "rip off", "ripoff", "waste of money", "pyramid scheme", "mlm",
];

function containsBannedContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return BANNED_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

// Category styling
const CATEGORY_STYLES: Record<string, { icon: typeof Trophy; color: string; bgColor: string; gradient: string; label: string }> = {
  introductions: { icon: Hand, color: "text-pink-700", bgColor: "bg-pink-100", gradient: "from-pink-500 via-rose-500 to-pink-600", label: "Introduce Yourself" },
  tips: { icon: Lightbulb, color: "text-green-700", bgColor: "bg-green-100", gradient: "from-green-500 via-emerald-500 to-green-600", label: "Daily Coach Tips" },
  wins: { icon: Trophy, color: "text-amber-700", bgColor: "bg-amber-100", gradient: "from-amber-500 via-yellow-500 to-amber-600", label: "Share Your Wins" },
  graduates: { icon: GraduationCap, color: "text-emerald-700", bgColor: "bg-emerald-100", gradient: "from-emerald-500 via-teal-500 to-emerald-600", label: "New Graduates" },
  questions: { icon: HelpCircle, color: "text-blue-700", bgColor: "bg-blue-100", gradient: "from-blue-500 via-sky-500 to-blue-600", label: "Questions & Help" },
};

interface Author {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: string;
  bio?: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: Author;
  likeCount: number;
  isLiked: boolean;
  reactions: Record<string, number>;
  userReactions: string[];
  replies: Comment[];
}

interface Post {
  id: string;
  title: string;
  content: string;
  category?: string | null;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  author: Author;
  comments: Comment[];
  isLiked: boolean;
  totalComments: number;
}

interface PostDetailClientProps {
  post: Post;
  currentUserId: string;
}

// Emoji reaction options
const REACTION_EMOJIS = ["❤️", "🔥", "👏", "💯", "🎉", "💪", "⭐", "🙌"];

// Static reaction counts for posts - must match community-client.tsx
const STATIC_REACTIONS = {
  pinned: { "❤️": 547, "🔥": 423, "👏": 356, "💯": 289, "🎉": 198, "💪": 134, "⭐": 87, "🙌": 56 }, // ~2090
  featured: { "❤️": 412, "🔥": 334, "👏": 278, "💯": 234, "🎉": 167, "💪": 123, "⭐": 78, "🙌": 45 }, // ~1671
  regular: { "❤️": 234, "🔥": 189, "👏": 156, "💯": 123, "🎉": 98, "💪": 67, "⭐": 45, "🙌": 28 }, // ~940
  question: { "❤️": 145, "🔥": 112, "👏": 89, "💯": 67, "🎉": 45, "💪": 34, "⭐": 23, "🙌": 15 }, // ~530
};

// Get reactions for a post based on category
const getPostReactions = (category?: string | null, isPinned?: boolean): Record<string, number> => {
  if (isPinned || category === "introductions" || category === "tips") {
    return STATIC_REACTIONS.pinned;
  }
  if (category === "wins" || category === "graduates") {
    return STATIC_REACTIONS.featured;
  }
  if (category === "questions") {
    return STATIC_REACTIONS.question;
  }
  return STATIC_REACTIONS.regular;
};

// Sample comments for demo posts - 50+ unique buyer persona comments
// Students have avatar: null (invisible), only coaches have avatar images
const SAMPLE_COMMENTS: Record<string, Comment[]> = {
  "pinned-introductions": [
    {
      id: "sc-1",
      content: "Welcome to everyone joining us this week! I remember my first day here - nervous, excited, wondering if I could really do this. Four months later, I have 8 paying clients and just hit my first $4K month. This community is REAL. Don't be shy, introduce yourself and let us support you on this journey. Every single success story you see started with a simple introduction just like yours. 💕",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 89,
      isLiked: false,
      reactions: { "❤️": 45, "🔥": 23, "👏": 21 },
      userReactions: [],
      replies: []
    },
    {
      id: "sc-2",
      content: "Hi everyone! Former ER nurse from Colorado here - 20 years of watching patients come back again and again with the same problems. The revolving door of band-aid medicine broke me. Three burnouts, a divorce scare, and chronic migraines later, I finally said ENOUGH. A friend told me about functional medicine and everything clicked. I'm only in month 3 of the certification but I already feel more hope than I have in years. The way Dr. Sarah breaks down complex topics makes it actually digestible. So grateful to finally be somewhere that makes sense!",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "🔥": 18, "💪": 15 },
      userReactions: [],
      replies: [
        {
          id: "sc-2-r1",
          content: "Jennifer, your story resonates SO deeply. 15 years as an ICU nurse here and the revolving door comment hit me right in the heart. I used to go home crying because I knew we weren't actually helping people heal - just managing symptoms. Welcome to the other side. It gets better, I promise. 🤗",
          createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          parentId: "sc-2",
          author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
          likeCount: 23,
          isLiked: false,
          reactions: { "❤️": 12, "👏": 11 },
          userReactions: [],
          replies: []
        },
        {
          id: "sc-2-r2",
          content: "Jennifer, I love that you're here! The nursing background is actually a HUGE advantage - you understand the body, you know how to assess symptoms, and most importantly, you know how to truly care for patients. Those skills transfer beautifully. Can't wait to see your progress!",
          createdAt: new Date(Date.now() - 2.3 * 60 * 60 * 1000),
          parentId: "sc-2",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 45,
          isLiked: false,
          reactions: { "❤️": 28, "🔥": 10, "💯": 7 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "sc-3",
      content: "Corporate burnout survivor checking in from NYC! After my own health crisis at 42 - unexplained fatigue, brain fog so bad I couldn't remember my kids' names some days, weight gain despite eating almost nothing - I discovered functional medicine when my conventional doctors literally said 'your labs are normal, maybe try antidepressants.' I was NOT depressed, I was SICK. A functional medicine practitioner found my thyroid issues, gut dysbiosis, and nutrient deficiencies in ONE visit. I want to give that gift to others who've been dismissed by the medical system. 🙏",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-michael", firstName: "Michael", lastName: "Thompson", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 28, "🔥": 15, "💪": 13 },
      userReactions: [],
      replies: [
        {
          id: "sc-3-r1",
          content: "Michael, the 'your labs are normal' story is SO common. I hear it from almost every student here. You're going to help so many people who've been gaslit by the conventional system. Your personal experience is your superpower.",
          createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
          parentId: "sc-3",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 34,
          isLiked: false,
          reactions: { "❤️": 20, "💯": 14 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "sc-4",
      content: "Hello from Austin, Texas! Corporate lawyer here, 18 years of 80-hour weeks defending companies I didn't believe in. Made great money but lost my health, my hobbies, and nearly my sanity. Two years ago I collapsed in court - literally passed out mid-argument. My body was screaming STOP. A functional medicine practitioner helped me reverse chronic fatigue and hormonal chaos that my doctors said was 'just stress.' Now I want to help other burned-out professionals escape before they hit rock bottom like I did. Fun fact: I took up competitive ballroom dancing as part of my recovery - it's my new stress relief! 💃",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-katherine", firstName: "Katherine", lastName: "Williams", avatar: null, role: "STUDENT" },
      likeCount: 45,
      isLiked: false,
      reactions: { "❤️": 23, "🎉": 12, "⭐": 10 },
      userReactions: [],
      replies: [
        {
          id: "sc-4-r1",
          content: "Welcome Katherine! Corporate escapees are some of our BEST practitioners. You understand the high-achieving, burned-out client because you WERE that client. Your analytical legal mind will help you connect dots in complex cases. And ballroom dancing?! That's amazing - movement is medicine!",
          createdAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
          parentId: "sc-4",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 34,
          isLiked: false,
          reactions: { "❤️": 18, "👏": 16 },
          userReactions: [],
          replies: []
        },
        {
          id: "sc-4-r2",
          content: "Katherine, I was in corporate finance for 12 years. The transition to FM was the best decision of my life. DM me if you want to chat about navigating the career pivot - happy to share what worked for me!",
          createdAt: new Date(Date.now() - 4.2 * 60 * 60 * 1000),
          parentId: "sc-4",
          author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
          likeCount: 22,
          isLiked: false,
          reactions: { "❤️": 12, "💪": 10 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "sc-5",
      content: "Hi! I'm Lisa from Seattle. Stay-at-home mom of 3 little ones who got interested in this after my own 5-year battle with autoimmune issues. Hashimoto's, then rheumatoid arthritis symptoms, then mysterious rashes. Doctor after doctor shrugged. I spent THOUSANDS on specialists who offered nothing but more pills. Finally found an FM practitioner who changed everything through food and lifestyle. I'm halfway through the certification now but honestly dealing with major imposter syndrome. Who am I - a mom with no medical degree - to help people with their health? 😅 The testimonials here give me hope but the doubt is real.",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
      likeCount: 78,
      isLiked: false,
      reactions: { "❤️": 45, "💪": 18, "🙌": 15 },
      userReactions: [],
      replies: [
        {
          id: "sc-5-r1",
          content: "Lisa, I need you to hear this: imposter syndrome is actually a GOOD sign. It means you care deeply about doing excellent work. The people who should worry are those who DON'T feel any doubt. Here's the truth your brain is hiding from you: your future clients don't need you to know everything. They need you to know MORE than them and genuinely care about their wellbeing. You already have both. Your personal healing journey gives you something no textbook can teach - EMPATHY. You know what it feels like to be dismissed, to struggle, to finally find answers. That's priceless. 💕",
          createdAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
          parentId: "sc-5",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 67,
          isLiked: false,
          reactions: { "❤️": 34, "💯": 23, "👏": 10 },
          userReactions: [],
          replies: []
        },
        {
          id: "sc-5-r2",
          content: "Lisa, I felt EXACTLY this way 8 months ago. Same autoimmune background, same mom guilt about 'who am I to do this.' Now I have 15 clients and every single one of them has told me my personal experience was WHY they trusted me. Your journey IS your qualification. The doctors who dismissed you spent 7 minutes with you. You'll spend HOURS truly understanding your clients. That's the difference.",
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          parentId: "sc-5",
          author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
          likeCount: 45,
          isLiked: false,
          reactions: { "❤️": 23, "🔥": 12, "💪": 10 },
          userReactions: [],
          replies: []
        },
        {
          id: "sc-5-r3",
          content: "Adding to what everyone said - I'm also a mom (2 kids) and the mom angle is actually a NICHE. So many moms are exhausted, overwhelmed, dealing with mysterious symptoms their doctors dismiss. You UNDERSTAND them. Use that.",
          createdAt: new Date(Date.now() - 4.8 * 60 * 60 * 1000),
          parentId: "sc-5",
          author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
          likeCount: 38,
          isLiked: false,
          reactions: { "❤️": 20, "💯": 18 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "sc-6",
      content: "Hello from sunny San Diego! Former pharmaceutical sales rep here - 15 years of pushing drugs I stopped believing in around year 3. The cognitive dissonance was slowly destroying my soul. I'd sit across from doctors knowing the studies were cherry-picked, knowing there were better solutions, but staying quiet because the paycheck was good. Found FM after watching my dad transform his health in 3 months after 10 years of declining on conventional treatments. Currently month 4 of building my practice - hit $5,200 last month with 7 clients! The income reports in this community gave me the courage to finally quit pharma. Never looking back.",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 28, "🎉": 15, "💪": 13 },
      userReactions: [],
      replies: [
        {
          id: "sc-6-r1",
          content: "James, $5,200 in month 4 is INCREDIBLE! And your pharma background gives you unique credibility when explaining why the conventional approach often fails. You've seen behind the curtain. Use that knowledge to help your clients understand why FM is different.",
          createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
          parentId: "sc-6",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 32,
          isLiked: false,
          reactions: { "❤️": 18, "🔥": 14 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "sc-7",
      content: "Hi everyone! Retired school teacher here, 62 years young. After 35 years of educating kids, I thought retirement would be relaxing. Instead, I watched my health decline - joint pain, terrible sleep, memory issues my doctor said was 'just aging.' A student's parent happened to be an FM practitioner and offered to help. Within 6 months, I felt 20 years younger. I realized my purpose wasn't done - I want to spend my retirement years helping other seniors reclaim their vitality. Never too old to start something new!",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-margaret", firstName: "Margaret", lastName: "O'Brien", avatar: null, role: "STUDENT" },
      likeCount: 89,
      isLiked: false,
      reactions: { "❤️": 52, "🎉": 20, "⭐": 17 },
      userReactions: [],
      replies: []
    },
    {
      id: "sc-8",
      content: "Hey y'all! Former personal trainer from Atlanta here. 12 years of helping people get fit but always felt like I was missing something. Clients would lose weight then gain it back, build muscle but still feel exhausted, look great but feel terrible inside. Then I learned about the gut-brain connection, hormone health, and inflammation - suddenly EVERYTHING made sense. Fitness is just one piece of the puzzle. Now I want to help people from the INSIDE out. So pumped to be here!",
      createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-marcus", firstName: "Marcus", lastName: "Davis", avatar: null, role: "STUDENT" },
      likeCount: 43,
      isLiked: false,
      reactions: { "❤️": 25, "🔥": 10, "💪": 8 },
      userReactions: [],
      replies: []
    },
  ],
  "tips-daily-1": [
    {
      id: "tc-1",
      content: "Challenge accepted Dr. Sarah! 🙋 I've been procrastinating on outreach for THREE WEEKS because I kept telling myself 'I'll start when I finish module 6' then 'when I finish module 7.' But you're right - I'll never feel 100% ready. Just sent my first message to a former colleague who's been complaining about fatigue on Facebook. My hands were literally shaking as I hit send. But it's DONE. One down, two to go. This is what accountability looks like!",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "🔥": 18, "💪": 15 },
      userReactions: [],
      replies: [
        {
          id: "tc-1-r1",
          content: "SO proud of you Rachel! That first message is ALWAYS the hardest - you just did the scary thing. The shaking hands mean you care, and caring is exactly what makes a great practitioner. Keep us posted on how they respond. And remember, even if they say no, you just practiced a skill you'll use thousands of times. Win-win! 🌟",
          createdAt: new Date(Date.now() - 45 * 60 * 1000),
          parentId: "tc-1",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 34,
          isLiked: false,
          reactions: { "❤️": 18, "👏": 16 },
          userReactions: [],
          replies: []
        },
        {
          id: "tc-1-r2",
          content: "Rachel, I remember sending my first message. I rewrote it like 15 times. The person said YES and became my first paying client. Rooting for you!!",
          createdAt: new Date(Date.now() - 40 * 60 * 1000),
          parentId: "tc-1",
          author: { id: "user-michelle", firstName: "Michelle", lastName: "Torres", avatar: null, role: "STUDENT" },
          likeCount: 19,
          isLiked: false,
          reactions: { "❤️": 10, "🎉": 9 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "tc-2",
      content: "THIS hit me so hard. My first client came from exactly this approach - just having a casual coffee conversation with a friend about gut health. She'd been struggling with bloating for years and I mentioned what I was learning. She literally said 'can you help me?' and I almost said no because I wasn't 'certified yet.' I pushed through the fear, charged her $300 (way too little but I was scared), and she got incredible results. Now she's my best testimonial AND has referred 3 more clients. All from one conversation I almost didn't have!",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
      likeCount: 89,
      isLiked: false,
      reactions: { "❤️": 45, "🔥": 23, "💯": 21 },
      userReactions: [],
      replies: [
        {
          id: "tc-2-r1",
          content: "Amanda, this is such a powerful example! And I love that you mentioned charging 'way too little' - that's SO normal at first. We all undercharge initially. The key is you STARTED. Now you know your value and can charge accordingly!",
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          parentId: "tc-2",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 28,
          isLiked: false,
          reactions: { "❤️": 15, "💯": 13 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "tc-3",
      content: "Love seeing everyone take action! Remember: imperfect action beats perfect inaction EVERY. SINGLE. TIME. I've coached over 500 practitioners and the ones who succeed fastest aren't the smartest or most credentialed - they're the ones who DO THE SCARY THING before they feel ready. The confidence you're waiting for? It comes FROM doing the work, not before it. Keep me posted on how those conversations go! 🌟",
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 78,
      isLiked: false,
      reactions: { "❤️": 40, "🔥": 20, "👏": 18 },
      userReactions: [],
      replies: []
    },
    {
      id: "tc-4",
      content: "Okay I'm taking this challenge too! I've been sitting on a list of 20 people I KNOW would benefit from what I'm learning but I keep making excuses. 'The timing isn't right.' 'I don't want to seem salesy.' 'What if they think I'm weird?' But people are literally suffering while I overthink. Messaging 3 people TODAY. Thank you for the push Dr. Sarah!",
      createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
      likeCount: 52,
      isLiked: false,
      reactions: { "❤️": 28, "🔥": 15, "💪": 9 },
      userReactions: [],
      replies: []
    },
    {
      id: "tc-5",
      content: "Just want to add - my biggest client came from a conversation I had at my daughter's soccer game. Another mom was complaining about her energy levels and I mentioned I was studying functional medicine. She's now a $2,500 client. Conversations = clients. It really is that simple (not easy, but simple).",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-katherine", firstName: "Katherine", lastName: "Williams", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 35, "🎉": 18, "💯": 14 },
      userReactions: [],
      replies: []
    },
  ],
  "graduate-featured": [
    {
      id: "gc-1",
      content: "Rachel, I'm SO incredibly proud of you! I remember our very first coaching call - you were overwhelmed, questioning if you were too old to start over, wondering if anyone would ever trust you. Look at you now! 18 paying clients, $6,200 last month, working 25 hours a week doing work you LOVE. You showed up every single week even when you doubted yourself. You did the homework when you were exhausted. You reached out to people when it terrified you. THAT'S what separates successful practitioners - not talent, not credentials, but the willingness to keep showing up. You're proof that it's never too late to reinvent yourself. I can't wait to see where you are in another 8 months. 💪",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 123,
      isLiked: false,
      reactions: { "❤️": 67, "🔥": 32, "👏": 24 },
      userReactions: [],
      replies: []
    },
    {
      id: "gc-2",
      content: "Rachel, this gives me SO much hope. I'm a burned-out teacher - 25 years of giving everything to students who often didn't care, administrators who made our jobs harder, and a system that was slowly crushing my soul. Same fears you had. Same age anxiety (I'm 44). Same nights lying awake wondering if it's too late to start over. Your story just proved it's not. Screenshot-ing this for the hard days ahead. If you can do it at 47 after 22 years as a nurse, I can do it too. Thank you for being so honest about the scary parts - not just the success.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "💪": 18, "🙌": 15 },
      userReactions: [],
      replies: [
        {
          id: "gc-2-r1",
          content: "Lisa, you've absolutely got this! I remember feeling exactly like you do now. The key is to just take one step at a time. Don't look at the mountain - just look at the next foothold. DM me if you want to chat about the transition - I'd love to share what worked for me and the pitfalls to avoid!",
          createdAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
          parentId: "gc-2",
          author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
          likeCount: 34,
          isLiked: false,
          reactions: { "❤️": 18, "👏": 16 },
          userReactions: [],
          replies: []
        },
        {
          id: "gc-2-r2",
          content: "Lisa, as a fellow teacher-turned-practitioner (12 years in middle school), I can tell you - your teaching skills are actually GOLD in this field. You know how to explain complex concepts simply. You know how to motivate people. You know how to be patient when someone doesn't 'get it' the first time. Those skills transfer beautifully!",
          createdAt: new Date(Date.now() - 4.3 * 60 * 60 * 1000),
          parentId: "gc-2",
          author: { id: "user-michael", firstName: "Michael", lastName: "Thompson", avatar: null, role: "STUDENT" },
          likeCount: 28,
          isLiked: false,
          reactions: { "❤️": 15, "💯": 13 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "gc-3",
      content: "The part about 'your future clients are waiting for YOU specifically' hit me like a ton of bricks. I've been so focused on my own inadequacies - what if I don't know enough, what if I mess up, what if no one trusts me - that I forgot there are REAL PEOPLE out there struggling right now. People who have been dismissed by doctors, who can't find answers, who are slowly losing hope. They need someone who will LISTEN. Someone who will care. Someone who will spend more than 7 minutes with them. That person is me. That person is all of us here. Thank you for this reminder Rachel!",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 28, "🔥": 15, "💯": 13 },
      userReactions: [],
      replies: []
    },
    {
      id: "gc-4",
      content: "I'm crying reading this. 8 months ago I was you - burnt out, scared, wondering if starting over was even possible. Now I'm 3 months into my practice with 6 clients and I just had a woman tell me I saved her marriage because she finally has energy to be present with her family. THIS is why we do this work. Rachel, you're an inspiration!",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
      likeCount: 78,
      isLiked: false,
      reactions: { "❤️": 42, "🎉": 20, "🙌": 16 },
      userReactions: [],
      replies: []
    },
    {
      id: "gc-5",
      content: "The honesty in this post is refreshing. You mentioned questioning everything in the nights. I'm in that phase RIGHT NOW. Every night I wonder if I'm crazy to leave nursing. Seeing that you pushed through those doubts and came out the other side making more money, working less hours, and actually ENJOYING your work... that's everything. Thank you!",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
      likeCount: 45,
      isLiked: false,
      reactions: { "❤️": 25, "💪": 12, "🔥": 8 },
      userReactions: [],
      replies: []
    },
  ],
  "wins-featured": [
    {
      id: "wc-1",
      content: "MICHELLE!!! 🎉🎉🎉 I am literally screaming at my computer right now! This is EXACTLY what happens when you show up authentically and truly listen. That woman has probably spent YEARS being rushed out of doctor's offices, being told her symptoms are 'in her head,' being given band-aid solutions. Then you came along and actually HEARD her. You earned every single penny of that $3,000 - and honestly, she's getting WAY more value than that. Your genuine care and attention is priceless. I remember you in our group coaching call last month saying you felt like a fraud. LOOK AT YOU NOW! So incredibly proud of you! 🌟",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 145,
      isLiked: false,
      reactions: { "❤️": 78, "🎉": 45, "🔥": 22 },
      userReactions: [],
      replies: []
    },
    {
      id: "wc-2",
      content: "The 'just LISTEN' part is EVERYTHING. I worked in healthcare for 15 years and the average doctor visit is 7 minutes. SEVEN MINUTES to explain complex symptoms, get examined, receive a diagnosis, and leave with a prescription. It's insane. We have the gift of TIME and ATTENTION - we can spend 60-90 minutes truly understanding someone's health story. That's our superpower. Congratulations Michelle - you just changed someone's life! 🙌",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
      likeCount: 89,
      isLiked: false,
      reactions: { "❤️": 45, "👏": 23, "💯": 21 },
      userReactions: [],
      replies: [
        {
          id: "wc-2-r1",
          content: "Rachel, the 7 minutes statistic always shocks me even though I know it's true. When I do my 90-minute intake calls, clients are AMAZED that someone is actually listening. One client literally started crying because no one had ever spent that much time understanding her health journey. It's sad but also shows how much we're needed.",
          createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          parentId: "wc-2",
          author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
          likeCount: 34,
          isLiked: false,
          reactions: { "❤️": 18, "💯": 16 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "wc-3",
      content: "I needed to see this today. I'm still in the studying phase and honestly had a rough week with self-doubt. My husband asked me when I was going to 'give up this hobby' and it stung. Posts like this remind me WHY I'm doing this - it's not a hobby, it's my future career. Your client is lucky to have found you, Michelle! And I'm saving this post for the next time doubt creeps in.",
      createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-katherine", firstName: "Katherine", lastName: "Williams", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "💪": 18, "🙌": 15 },
      userReactions: [],
      replies: [
        {
          id: "wc-3-r1",
          content: "Katherine, keep pushing through! The doubt from others (and ourselves) is SO normal but so temporary. My own family didn't support me at first either. Now they see my clients' transformations and they GET IT. Your future clients are already out there struggling - they NEED you! Don't let anyone dim your light. 💕",
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          parentId: "wc-3",
          author: { id: "user-michelle", firstName: "Michelle", lastName: "Torres", avatar: null, role: "STUDENT" },
          likeCount: 45,
          isLiked: false,
          reactions: { "❤️": 23, "👏": 12, "💪": 10 },
          userReactions: [],
          replies: []
        },
        {
          id: "wc-3-r2",
          content: "Katherine, my wife was skeptical too until I showed her my first client testimonial video - she was in tears watching someone talk about how I helped them. Results speak louder than explanations. Keep going!",
          createdAt: new Date(Date.now() - 2.8 * 60 * 60 * 1000),
          parentId: "wc-3",
          author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
          likeCount: 32,
          isLiked: false,
          reactions: { "❤️": 17, "💯": 15 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "wc-4",
      content: "This is so inspiring Michelle! Question - how did you structure the 12-week package? I'm trying to figure out pricing and deliverables for my first high-ticket offer. Did you include weekly calls? Support between sessions? Would love to hear more about how you set it up!",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
      likeCount: 52,
      isLiked: false,
      reactions: { "❤️": 28, "💯": 24 },
      userReactions: [],
      replies: []
    },
    {
      id: "wc-5",
      content: "I love that you mentioned almost wanting to quit multiple times. It's SO important for people to know that the success stories they see didn't happen in a straight line. There were tears, doubt, and moments of giving up. But you kept going anyway. THAT'S the difference. Congratulations, you earned this! 🎊",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
      likeCount: 61,
      isLiked: false,
      reactions: { "❤️": 32, "🔥": 15, "💪": 14 },
      userReactions: [],
      replies: []
    },
  ],
  "question-1": [
    {
      id: "qc-1",
      content: "Great question Emma, and kudos for asking it - this is SO common (probably 30%+ of clients go through this at some point). Here's what I've learned after 500+ client relationships: Most clients who want to quit early just need reassurance, not a refund. First, set expectations upfront in your intake: 'You didn't get sick overnight, and you won't heal overnight. Most clients see meaningful changes at weeks 4-6, with major transformations at 8-12 weeks.' Second, schedule a check-in call and reconnect her to her WHY. Ask: 'What brought you here? What will your life look like when you feel better?' Third, review ALL the wins - even tiny ones. Better sleep? More energy at 3pm? Fewer cravings? Document everything. Often clients don't notice improvements because they're focused on the 'big' symptoms. You've got this! 💪",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 112,
      isLiked: false,
      reactions: { "❤️": 56, "💯": 34, "👏": 22 },
      userReactions: [],
      replies: []
    },
    {
      id: "qc-2",
      content: "I had this EXACT situation last month - client wanted to quit at day 12. Here's what I did: I pulled up our intake notes and showed her a timeline of typical gut healing (4-6 weeks for initial improvements, 3-6 months for significant change). Then I asked her to list ANY improvements, no matter how small. Turns out she HAD improved - her sleep was 30% better, she was waking up with more energy, and her afternoon brain fog was less intense. She just hadn't noticed because she was laser-focused on bloating (her main complaint). Once she SAW the progress on paper, she recommitted and is now one of my biggest success stories - down 15 lbs and completely off antacids after 8 weeks!",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
      likeCount: 89,
      isLiked: false,
      reactions: { "❤️": 45, "🔥": 23, "💯": 21 },
      userReactions: [],
      replies: [
        {
          id: "qc-2-r1",
          content: "James, the 'write down ALL improvements' technique is genius. I'm stealing this! It's so easy for clients to forget the small wins when they're focused on the big goal. Thanks for sharing!",
          createdAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
          parentId: "qc-2",
          author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
          likeCount: 25,
          isLiked: false,
          reactions: { "❤️": 15, "💯": 10 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "qc-3",
      content: "Celebrating small wins is KEY! I created a daily tracking system where clients rate 3 things on a 1-10 scale: energy, digestion, and mood. We review weekly and even 0.5 point improvements are celebrated. It completely changed my client retention. Also - CRUCIAL TIP: your contract should specify the no-refund policy AND the expected timeline. I learned that the HARD way in my first month when a client demanded a refund at week 3. Now during onboarding I literally say: 'By signing this, you're committing to the full 8 weeks. Healing isn't linear and you may feel worse before you feel better. Are you ready for that journey?' It filters out people who aren't serious.",
      createdAt: new Date(Date.now() - 4.5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
      likeCount: 78,
      isLiked: false,
      reactions: { "❤️": 40, "💯": 20, "👏": 18 },
      userReactions: [],
      replies: []
    },
    {
      id: "qc-4",
      content: "Something else to consider Emma - sometimes clients who want to quit are actually having a detox or healing crisis that feels like 'getting worse.' If she's eliminating inflammatory foods, her body might be going through withdrawal. Educate her on this! It's a sign things are WORKING, not failing. I had a client who felt terrible at week 2 - headaches, fatigue, irritability. I explained it was her body detoxing from sugar and processed foods. By week 4 she felt amazing and thanked me for pushing through.",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 30, "🔥": 15, "💯": 11 },
      userReactions: [],
      replies: []
    },
    {
      id: "qc-5",
      content: "One more script that works well: 'I hear you. This is hard and I understand the frustration. But here's what I've seen with hundreds of clients - the ones who push through this moment are the ones who get the breakthrough. Can we commit to 2 more weeks and reassess? If you still want to stop then, we can discuss options.' Most people just need permission to feel frustrated + encouragement to keep going.",
      createdAt: new Date(Date.now() - 5.5 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 35, "👏": 20, "💯": 12 },
      userReactions: [],
      replies: []
    },
  ],
  "graduate-2": [
    {
      id: "g2c-1",
      content: "James, thank you for being so transparent with your actual numbers! This is EXACTLY the kind of realistic expectation-setting our community needs. Too many courses promise 'six figures in 6 months' and leave people feeling like failures when reality doesn't match. Your journey - starting at $0, slowly building month by month, dealing with doubt - is the REAL story. $16K in 6 months while building from scratch, learning a new skill, and transitioning from a corporate career is actually incredible. And you're right - the LIFE improvement is priceless. You can't put a dollar value on loving your work, having flexibility, and knowing you're making a real difference. Thank you for keeping it real! 🙏",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 98,
      isLiked: false,
      reactions: { "❤️": 56, "🔥": 28, "👏": 14 },
      userReactions: [],
      replies: []
    },
    {
      id: "g2c-2",
      content: "The honesty in this post is SO refreshing. I appreciate you sharing the $0 month - so many people only share the highlights and we're left feeling like failures when our journey looks different. The real question burning in my mind: How did you mentally handle that first $0 month? I'm terrified of that phase. Did you ever wake up at 3am panicking that you made a huge mistake? What did you tell yourself to keep going?",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-michelle", firstName: "Michelle", lastName: "Torres", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "💯": 18, "🙌": 15 },
      userReactions: [],
      replies: [
        {
          id: "g2c-2-r1",
          content: "Michelle, I'm going to be totally honest - I almost quit during that $0 month. There were nights I couldn't sleep, wondering if I'd made a catastrophic mistake. What kept me going was: 1) This community - seeing posts from people 3-6 months ahead of me making real money, 2) A mantra I repeated daily: 'I'm investing in my future, not wasting time,' and 3) Tracking my non-financial wins (skills learned, connections made, confidence built). Also, my wife reminded me I'd be miserable if I went back to pharma. That helped too 😅",
          createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
          parentId: "g2c-2",
          author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
          likeCount: 45,
          isLiked: false,
          reactions: { "❤️": 23, "💪": 12, "🔥": 10 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "g2c-3",
      content: "As someone still in corporate hell (lawyer here - 18 years and counting), seeing your month-by-month progression gives me a realistic timeline I can actually plan around. Quick questions if you don't mind: Did you have savings to cover living expenses during that ramp-up? How long did you overlap with your corporate job while building? I'm trying to map out my exit strategy and your numbers are incredibly helpful for planning.",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-katherine", firstName: "Katherine", lastName: "Williams", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 28, "💪": 15, "🙌": 13 },
      userReactions: [],
      replies: [
        {
          id: "g2c-3-r1",
          content: "Katherine, great questions! I had about 6 months of living expenses saved before I quit pharma. I actually kept my corporate job for the first 2 months while studying (nights and weekends - exhausting but necessary). Once I hit that $2,100 month and saw it was actually possible, I gave my two weeks notice. My advice for your exit: 1) Don't quit until you have at least 2-3 paying clients, 2) Calculate your ACTUAL minimum monthly expenses (not lifestyle expenses), and 3) Have a backup plan (even just 'I can always do consulting' gave me peace of mind). Happy to chat more if helpful!",
          createdAt: new Date(Date.now() - 6.5 * 60 * 60 * 1000),
          parentId: "g2c-3",
          author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
          likeCount: 67,
          isLiked: false,
          reactions: { "❤️": 34, "💯": 20, "👏": 13 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "g2c-4",
      content: "This is gold, James. The month 2 to month 3 jump ($800 to $2,100) is interesting. What changed between those months? Did you raise prices, get more clients, or both? That's the growth inflection point I'm trying to understand.",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
      likeCount: 48,
      isLiked: false,
      reactions: { "❤️": 25, "💯": 23 },
      userReactions: [],
      replies: []
    },
  ],
  "wins-2": [
    {
      id: "w2c-1",
      content: "AMANDA!!! 🎉🎉🎉 Submitting your resignation is THE milestone. I remember when you joined - overwhelmed, working brutal hospital shifts, wondering if this was even possible. Now look at you: $8K month, viral content, and freedom. You've been one of my most consistent implementers - you did the homework, showed up to coaching calls, and took action even when scared. The compound effect comment is SO TRUE. Most people quit at month 2-3 when they haven't seen results yet. They don't realize they're quitting right before the breakthrough. You trusted the process. You kept going. And now you're living proof that it works. Can't wait to see where you are in 6 months! 💪",
      createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 134,
      isLiked: false,
      reactions: { "❤️": 78, "🎉": 34, "🔥": 22 },
      userReactions: [],
      replies: []
    },
    {
      id: "w2c-2",
      content: "Okay I need ALL the details on that viral Reel! 45K views?! What was it about? How long was it? What hashtags did you use? I've been posting consistently but my content barely gets 100 views. I know I shouldn't compare but it's hard not to. Would love any tips on what made that one take off!",
      createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
      likeCount: 89,
      isLiked: false,
      reactions: { "❤️": 45, "💯": 23, "🙌": 21 },
      userReactions: [],
      replies: [
        {
          id: "w2c-2-r1",
          content: "Rachel, here's the funny thing - the viral Reel was actually the SIMPLEST one I've ever made! It was a before/after of what I ate 5 years ago vs. now, showing how I reversed my gut issues. No fancy editing, no trending audio, just me talking to the camera showing two photos. I think it hit because: 1) It was super relatable (junk food vs. whole foods), 2) I showed my REAL transformation (not just stock photos), and 3) I was vulnerable about how bad I used to feel. Sometimes the raw, authentic stuff hits way harder than polished content. My advice: stop trying to be perfect and just be real!",
          createdAt: new Date(Date.now() - 10.5 * 60 * 60 * 1000),
          parentId: "w2c-2",
          author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
          likeCount: 78,
          isLiked: false,
          reactions: { "❤️": 40, "🔥": 20, "💯": 18 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "w2c-3",
      content: "The 'showing up consistently even when I didn't feel like it' part really resonates with me - that's my BIGGEST struggle. Some days I'm motivated and batch-create content. Other days I want to hide under the covers and pretend this business doesn't exist. How did you push through on those hard days? Did you have a routine or accountability partner? I need practical strategies!",
      createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "💪": 18, "🙌": 15 },
      userReactions: [],
      replies: [
        {
          id: "w2c-3-r1",
          content: "Lisa, I SO get this - I had days where I wanted to throw my laptop out the window 😂 What saved me was creating a 'non-negotiable' daily list of just 3 things: 1) Post ONE piece of content (even if it's just a story), 2) Reach out to 2 people (DMs, comments, or emails), 3) Study for 30 min. On the WORST days, I'd do the absolute bare minimum version of each. But I NEVER did zero. Here's the key insight: consistency beats intensity. One small action every day for 6 months beats intense effort for 2 weeks then burning out. That consistency compounds into results you can't even imagine right now!",
          createdAt: new Date(Date.now() - 10.5 * 60 * 60 * 1000),
          parentId: "w2c-3",
          author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
          likeCount: 89,
          isLiked: false,
          reactions: { "❤️": 45, "💯": 23, "🔥": 21 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "w2c-4",
      content: "The breakdown of your revenue sources is SO helpful! 4 clients at $1,497, a VIP day at $1,500, and renewals. I'm still figuring out my offer suite. Did you start with the 12-week program or did you add that later? And what's included in your VIP day?",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 30, "💯": 26 },
      userReactions: [],
      replies: []
    },
  ],
  "tips-2": [
    {
      id: "t2c-1",
      content: "Dr. Sarah, this template is GOLD! I've been struggling SO much with follow-ups - they always felt awkward and salesy, like I was bothering people. The 'no pressure to book anything' line is genius because it takes the tension out of the conversation. I'm trying this TODAY with 3 leads who ghosted me after discovery calls. I've been too scared to follow up because I didn't want to seem desperate. This gives me a framework that feels genuine. Thank you! 🙏",
      createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
      likeCount: 78,
      isLiked: false,
      reactions: { "❤️": 40, "🔥": 20, "💯": 18 },
      userReactions: [],
      replies: []
    },
    {
      id: "t2c-2",
      content: "I used this EXACT template yesterday on 4 leads who had ghosted me after consultations. Within an hour I had 2 responses! One booked a discovery call for next week, and the other said she's been thinking about me but wasn't ready yet - now we have an open conversation. Here's what I learned: the key is genuinely NOT being attached to the outcome. People can FEEL desperation through the screen. When I sent those emails truly just wanting to help and check in (not close a sale), the responses came. It's counterintuitive but removing sales pressure actually increases conversions.",
      createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
      likeCount: 98,
      isLiked: false,
      reactions: { "❤️": 56, "🎉": 23, "👏": 19 },
      userReactions: [],
      replies: [
        {
          id: "t2c-2-r1",
          content: "That's AMAZING James! 2 responses from 4 emails is a 50% response rate - that's exceptional. And you nailed the insight: the best sales don't feel like sales at all. They feel like genuine human connection and concern. When you truly care about helping someone (not just getting their money), they can feel it. Keep me posted on how that discovery call goes - rooting for you! 🌟",
          createdAt: new Date(Date.now() - 16.5 * 60 * 60 * 1000),
          parentId: "t2c-2",
          author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
          likeCount: 45,
          isLiked: false,
          reactions: { "❤️": 23, "👏": 12, "🙌": 10 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "t2c-3",
      content: "Screenshotting this immediately and printing it out to put next to my computer! I've lost SO many potential clients because my follow-ups felt forced and awkward. I'd either not follow up at all (ghost anxiety) or send something so generic they'd ignore it. This template feels genuinely helpful rather than pushy - like I'm actually checking in as a human, not as a salesperson. Thank you Dr. Sarah, this is the kind of practical advice that actually moves the needle!",
      createdAt: new Date(Date.now() - 17 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "🔥": 18, "💯": 15 },
      userReactions: [],
      replies: []
    },
    {
      id: "t2c-4",
      content: "The 'I was thinking about our conversation' opener is so powerful. It shows you actually paid attention and care about them as a person, not just as a potential sale. I've been using variations of this and it works SO well. Another thing I add: I'll reference something specific they told me (like 'How's your daughter's soccer season going?') before getting into the health stuff. It builds genuine connection.",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-michelle", firstName: "Michelle", lastName: "Torres", avatar: null, role: "STUDENT" },
      likeCount: 58,
      isLiked: false,
      reactions: { "❤️": 30, "💯": 28 },
      userReactions: [],
      replies: []
    },
  ],
  "question-2": [
    {
      id: "q2c-1",
      content: "Lisa, I need you to really hear this: imposter syndrome means you CARE deeply about doing good work. It's actually a predictor that you'll be an EXCELLENT practitioner - because the people who should worry are those who feel no doubt at all. Here's the truth your brain is hiding: your clients don't need you to know everything. They don't need another expert who talks AT them with medical jargon. They need someone who knows MORE than them, genuinely cares about their wellbeing, and will actually LISTEN. You already have all three. Your personal health struggles? That's not a weakness - it's your superpower. You KNOW what it feels like to be dismissed, to be desperate for answers, to finally find healing. No medical degree can teach that empathy. Also, remember: you'll have ongoing support and resources. You're not alone on an island - you're part of a community. You've got this! 💕",
      createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 145,
      isLiked: false,
      reactions: { "❤️": 78, "💯": 40, "👏": 27 },
      userReactions: [],
      replies: []
    },
    {
      id: "q2c-2",
      content: "Lisa, I felt EXACTLY this way 6 months ago. Like, word for word - 'who am I to help people?' 'I don't have a medical degree.' 'What if I mess up someone's health?' The thoughts were relentless. Now I have 12 clients and you know what? EVERY. SINGLE. ONE. has thanked me for changing their life. Not one has asked about my credentials. They care that I listen, that I care, and that I help them feel better. Your personal health journey is your SUPERPOWER, not your weakness. You understand what they're going through because you've LIVED it. That connection matters more than any degree.",
      createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
      likeCount: 89,
      isLiked: false,
      reactions: { "❤️": 45, "💪": 23, "🔥": 21 },
      userReactions: [],
      replies: [
        {
          id: "q2c-2-r1",
          content: "Thank you SO much Jennifer, this really helps. It's so easy to compare myself to doctors with 8+ years of training and feel completely inadequate. But you're right - I KNOW what it feels like to struggle, to be dismissed, to desperately search for answers. That's something no medical school can teach. I'm going to write down 'my struggle is my superpower' and put it on my mirror. 🙏",
          createdAt: new Date(Date.now() - 18.5 * 60 * 60 * 1000),
          parentId: "q2c-2",
          author: { id: "user-lisa", firstName: "Lisa", lastName: "Chen", avatar: null, role: "STUDENT" },
          likeCount: 45,
          isLiked: false,
          reactions: { "❤️": 23, "🙌": 12, "💯": 10 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "q2c-3",
      content: "Two things that helped me: 1) Read 'The Big Leap' by Gay Hendricks - it completely changed how I view imposter syndrome and self-sabotage. It's called 'Upper Limit Problem' and it happens to everyone when they're leveling up. 2) Reframe: doctors spend 8-12 years learning to diagnose disease and prescribe pharmaceutical drugs. You're learning to identify ROOT CAUSES and help people heal naturally. Both have value - they're just different approaches. You're not competing with doctors, you're offering something they CAN'T: time, attention, and a functional approach.",
      createdAt: new Date(Date.now() - 19 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-michael", firstName: "Michael", lastName: "Thompson", avatar: null, role: "STUDENT" },
      likeCount: 78,
      isLiked: false,
      reactions: { "❤️": 40, "💯": 20, "⭐": 18 },
      userReactions: [],
      replies: []
    },
    {
      id: "q2c-4",
      content: "Something that helped me: I realized imposter syndrome often hits hardest right before a breakthrough. It's like your brain's way of trying to keep you 'safe' in your comfort zone. The fact that you're feeling this NOW, while pushing forward, means you're growing. Lean into the discomfort. On the other side is everything you want.",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 30, "🔥": 15, "💪": 11 },
      userReactions: [],
      replies: []
    },
    {
      id: "q2c-5",
      content: "Lisa, I was a stay-at-home mom too and had the EXACT same thoughts. 'I'm just a mom.' But here's what I realized: moms are literally experts at solving problems, researching obsessively, advocating for their kids, and caring deeply. Those are EXACTLY the skills needed to be a great practitioner. Don't discount everything you've already learned. 💪",
      createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-amanda", firstName: "Amanda", lastName: "Foster", avatar: null, role: "STUDENT" },
      likeCount: 62,
      isLiked: false,
      reactions: { "❤️": 35, "💯": 17, "🙌": 10 },
      userReactions: [],
      replies: []
    },
  ],
  "intro-new": [
    {
      id: "inc-1",
      content: "Welcome Katherine! Your story is SO relatable - I'd say 40% of our most successful practitioners are recovering corporate professionals. Here's why that background is actually an ASSET: You understand high-performers and their unique health challenges (stress, burnout, not having time to eat well). You have the discipline and work ethic to build something new. You're used to handling complex problems and finding solutions. And most importantly - you know firsthand what happens when you ignore your health for your career. That lived experience will help you connect with clients in a way no textbook can teach. The collapsed-in-court story? Your future clients who are heading toward that same cliff need to hear it. You're going to do amazing things here! 🌟",
      createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "coach-sarah", firstName: "Dr. Sarah", lastName: "Mitchell", avatar: "/images/coaches/sarah.jpg", role: "MENTOR" },
      likeCount: 67,
      isLiked: false,
      reactions: { "❤️": 34, "👏": 18, "🎉": 15 },
      userReactions: [],
      replies: []
    },
    {
      id: "inc-2",
      content: "Hey fellow corporate escapee! 👋 I left pharmaceutical sales 6 months ago after 15 years of cognitive dissonance, and it was genuinely the best decision I've ever made. The transition is SCARY - I won't sugarcoat it - but it's so worth it on the other side. I went from making great money but hating myself to making decent money and actually being PROUD of what I do. The legal background will actually help you SO much - you're used to building cases, finding evidence, and advocating for people. That's exactly what we do in FM, just for health instead of lawsuits 😄 Feel free to DM me if you want to chat about navigating the career change!",
      createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-james", firstName: "James", lastName: "Patterson", avatar: null, role: "STUDENT" },
      likeCount: 56,
      isLiked: false,
      reactions: { "❤️": 28, "💪": 15, "🙌": 13 },
      userReactions: [],
      replies: [
        {
          id: "inc-2-r1",
          content: "Thanks SO much James! The 'building cases and advocating' comparison is actually perfect - I never thought of it that way! I've spent 18 years making arguments; I can definitely learn to make them for health instead of contracts 😄 I'll DM you this week - would love to hear more about your transition timeline and how you knew when to make the leap!",
          createdAt: new Date(Date.now() - 20.5 * 60 * 60 * 1000),
          parentId: "inc-2",
          author: { id: "user-katherine", firstName: "Katherine", lastName: "Williams", avatar: null, role: "STUDENT" },
          likeCount: 34,
          isLiked: false,
          reactions: { "❤️": 18, "🙌": 10, "👏": 6 },
          userReactions: [],
          replies: []
        }
      ]
    },
    {
      id: "inc-3",
      content: "Welcome Katherine! Competitive ballroom dancing is AMAZING - I love that you already have stress relief built into your life! That's so important on this journey because let's be honest, building a business while learning a new skill is stressful. Having an outlet that brings you joy and gets you moving is crucial. I took up yoga when I started and it became my saving grace on tough days. Looking forward to celebrating your wins! 💃",
      createdAt: new Date(Date.now() - 21 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-rachel", firstName: "Rachel", lastName: "Simmons", avatar: null, role: "STUDENT" },
      likeCount: 45,
      isLiked: false,
      reactions: { "❤️": 23, "🎉": 12, "⭐": 10 },
      userReactions: [],
      replies: []
    },
    {
      id: "inc-4",
      content: "Katherine, welcome! Another corporate burnout survivor here (finance, 12 years). The collapsing-in-court story gave me chills because I had a similar experience - panic attack during a board presentation. That moment changed everything. The high-achieving professionals who push themselves to the brink? They're your people. They'll trust you because you've BEEN there. You're not just reading about burnout in a textbook - you lived it and healed from it. That's powerful.",
      createdAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-michael", firstName: "Michael", lastName: "Thompson", avatar: null, role: "STUDENT" },
      likeCount: 52,
      isLiked: false,
      reactions: { "❤️": 28, "💪": 14, "💯": 10 },
      userReactions: [],
      replies: []
    },
    {
      id: "inc-5",
      content: "Welcome to the community! Austin is a great city for wellness practitioners - lots of health-conscious people there. And I'm super impressed that you took up ballroom dancing as part of your recovery. Movement really is medicine. Can't wait to see where this journey takes you! 🎉",
      createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
      parentId: null,
      author: { id: "user-jennifer", firstName: "Jennifer", lastName: "Martinez", avatar: null, role: "STUDENT" },
      likeCount: 38,
      isLiked: false,
      reactions: { "❤️": 20, "🎉": 18 },
      userReactions: [],
      replies: []
    },
  ],
};

// Helper to get sample comments for demo posts - works by ID or category
const getSampleComments = (postId: string, category?: string | null): Comment[] => {
  // First try exact match by ID
  if (SAMPLE_COMMENTS[postId]) {
    return SAMPLE_COMMENTS[postId];
  }

  // Then try to match by category
  if (category) {
    const categoryToPostId: Record<string, string> = {
      "introductions": "pinned-introductions",
      "tips": "tips-daily-1",
      "wins": "wins-featured",
      "graduates": "graduate-featured",
      "questions": "question-1",
    };

    const samplePostId = categoryToPostId[category];
    if (samplePostId && SAMPLE_COMMENTS[samplePostId]) {
      return SAMPLE_COMMENTS[samplePostId];
    }
  }

  // Default to introductions comments if nothing else matches
  return SAMPLE_COMMENTS["pinned-introductions"] || [];
};

export function PostDetailClient({ post, currentUserId }: PostDetailClientProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [commentWarning, setCommentWarning] = useState("");
  const [replyWarning, setReplyWarning] = useState("");
  const [commentError, setCommentError] = useState("");

  // Get comments - always use sample comments for demo (buyer persona content)
  // Sample comments take priority for better demo experience
  const sampleComments = getSampleComments(post.id, post.category);
  const displayComments = sampleComments.length > 0 ? sampleComments : post.comments;
  const totalCommentsCount = displayComments.length + displayComments.reduce((acc, c) => acc + c.replies.length, 0);

  // Comment likes and reactions state
  const [commentLikes, setCommentLikes] = useState<Record<string, { liked: boolean; count: number }>>(() => {
    const initial: Record<string, { liked: boolean; count: number }> = {};
    displayComments.forEach((c) => {
      initial[c.id] = { liked: c.isLiked, count: c.likeCount };
      c.replies.forEach((r) => {
        initial[r.id] = { liked: r.isLiked, count: r.likeCount };
      });
    });
    return initial;
  });
  const [commentReactions, setCommentReactions] = useState<Record<string, { reactions: Record<string, number>; userReactions: string[] }>>(() => {
    const initial: Record<string, { reactions: Record<string, number>; userReactions: string[] }> = {};
    displayComments.forEach((c) => {
      initial[c.id] = { reactions: c.reactions, userReactions: c.userReactions };
      c.replies.forEach((r) => {
        initial[r.id] = { reactions: r.reactions, userReactions: r.userReactions };
      });
    });
    return initial;
  });
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [commentLikeLoading, setCommentLikeLoading] = useState<string | null>(null);

  const handleCommentChange = (value: string) => {
    setNewComment(value);
    if (containsBannedContent(value)) {
      setCommentWarning("Your comment contains restricted content. Please review community guidelines.");
    } else {
      setCommentWarning("");
    }
  };

  const handleReplyChange = (value: string) => {
    setReplyContent(value);
    if (containsBannedContent(value)) {
      setReplyWarning("Your reply contains restricted content. Please review community guidelines.");
    } else {
      setReplyWarning("");
    }
  };

  // Get category style
  const getCategoryStyle = () => {
    if (!post.category || !CATEGORY_STYLES[post.category]) {
      return { icon: MessageSquare, color: "text-gray-700", bgColor: "bg-gray-100", gradient: "from-burgundy-500 via-burgundy-600 to-burgundy-700", label: "Discussion" };
    }
    return CATEGORY_STYLES[post.category];
  };

  const categoryStyle = getCategoryStyle();
  const CategoryIcon = categoryStyle.icon;

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  };

  const getRoleBadge = (role: string, size: "sm" | "md" = "md") => {
    const baseClass = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1";
    switch (role) {
      case "ADMIN":
        return (
          <Badge className={`bg-gradient-to-r from-burgundy-500 to-burgundy-600 text-white border-0 font-semibold ${baseClass}`}>
            <Sparkles className={size === "sm" ? "w-2.5 h-2.5 mr-0.5" : "w-3 h-3 mr-1"} />
            Admin
          </Badge>
        );
      case "INSTRUCTOR":
        return (
          <Badge className={`bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 font-semibold ${baseClass}`}>
            Instructor
          </Badge>
        );
      case "MENTOR":
        return (
          <Badge className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-semibold ${baseClass}`}>
            <Award className={size === "sm" ? "w-2.5 h-2.5 mr-0.5" : "w-3 h-3 mr-1"} />
            Coach
          </Badge>
        );
      default:
        return null;
    }
  };

  const getAvatarGradient = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-gradient-to-br from-burgundy-500 to-burgundy-700";
      case "MENTOR":
        return "bg-gradient-to-br from-amber-400 to-orange-500";
      case "INSTRUCTOR":
        return "bg-gradient-to-br from-purple-500 to-purple-700";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-600";
    }
  };

  // Render markdown-like content
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <h3 key={index} className="font-bold text-gray-900 text-lg mt-4 mb-2">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
      }
      // Bold text inline
      if (line.includes('**')) {
        const parts = line.split(/(\*\*[^*]+\*\*)/);
        return (
          <p key={index} className="text-gray-700 leading-relaxed mb-2">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold text-gray-900">{part.replace(/\*\*/g, '')}</strong>;
              }
              return <span key={i}>{part}</span>;
            })}
          </p>
        );
      }
      // List items
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={index} className="flex items-start gap-3 mb-2 ml-1">
            <div className="w-2 h-2 rounded-full bg-burgundy-500 mt-2 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{line.substring(2)}</span>
          </div>
        );
      }
      // Checkmark items
      if (line.includes('✅') || line.includes('✓')) {
        return (
          <div key={index} className="flex items-start gap-3 mb-2 ml-1">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700 leading-relaxed">{line.replace(/✅|✓/g, '').trim()}</span>
          </div>
        );
      }
      // Numbered items
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        const text = line.replace(/^\d+\.\s*/, '');
        return (
          <div key={index} className="flex items-start gap-3 mb-2 ml-1">
            <span className="w-6 h-6 rounded-full bg-burgundy-100 text-burgundy-700 text-sm font-semibold flex items-center justify-center flex-shrink-0">{num}</span>
            <span className="text-gray-700 leading-relaxed">{text}</span>
          </div>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-3" />;
      }
      // Regular paragraphs
      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-2">
          {line}
        </p>
      );
    });
  };

  const handleLike = async () => {
    if (likeLoading) return;
    setLikeLoading(true);

    // Optimistic update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const response = await fetch("/api/community/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });

      const data = await response.json();

      if (!data.success) {
        // Revert on error
        setLiked(liked);
        setLikeCount(likeCount);
      }
    } catch {
      // Revert on error
      setLiked(liked);
      setLikeCount(likeCount);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || commentLoading) return;

    // Check for banned content
    if (containsBannedContent(newComment)) {
      setCommentError("Your comment contains content that violates community guidelines.");
      return;
    }

    setCommentLoading(true);
    setCommentError("");

    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: newComment }),
      });

      const data = await response.json();

      if (data.success) {
        setNewComment("");
        setCommentWarning("");
        router.refresh();
      } else {
        setCommentError(data.error || "Failed to post comment");
      }
    } catch {
      setCommentError("An error occurred. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim() || commentLoading) return;

    // Check for banned content
    if (containsBannedContent(replyContent)) {
      setReplyWarning("Your reply contains content that violates community guidelines.");
      return;
    }

    setCommentLoading(true);

    try {
      const response = await fetch("/api/community/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id, content: replyContent, parentId }),
      });

      const data = await response.json();

      if (data.success) {
        setReplyContent("");
        setReplyWarning("");
        setReplyingTo(null);
        router.refresh();
      }
    } catch {
      // Handle error silently
    } finally {
      setCommentLoading(false);
    }
  };

  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  // Handle comment like
  const handleCommentLike = async (commentId: string) => {
    if (commentLikeLoading === commentId) return;
    setCommentLikeLoading(commentId);

    // Optimistic update
    const current = commentLikes[commentId] || { liked: false, count: 0 };
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: {
        liked: !current.liked,
        count: current.liked ? current.count - 1 : current.count + 1,
      },
    }));

    try {
      const response = await fetch("/api/community/comment-like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });

      const data = await response.json();

      if (data.success) {
        setCommentLikes((prev) => ({
          ...prev,
          [commentId]: {
            liked: data.liked,
            count: data.likeCount,
          },
        }));
      } else {
        // Revert on error
        setCommentLikes((prev) => ({
          ...prev,
          [commentId]: current,
        }));
      }
    } catch {
      // Revert on error
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: current,
      }));
    } finally {
      setCommentLikeLoading(null);
    }
  };

  // Handle comment reaction
  const handleCommentReaction = async (commentId: string, emoji: string) => {
    setShowReactionPicker(null);

    // Optimistic update
    const current = commentReactions[commentId] || { reactions: {}, userReactions: [] };
    const hasReaction = current.userReactions.includes(emoji);

    setCommentReactions((prev) => {
      const newReactions = { ...current.reactions };
      const newUserReactions = [...current.userReactions];

      if (hasReaction) {
        newReactions[emoji] = Math.max(0, (newReactions[emoji] || 1) - 1);
        if (newReactions[emoji] === 0) delete newReactions[emoji];
        const idx = newUserReactions.indexOf(emoji);
        if (idx > -1) newUserReactions.splice(idx, 1);
      } else {
        newReactions[emoji] = (newReactions[emoji] || 0) + 1;
        newUserReactions.push(emoji);
      }

      return {
        ...prev,
        [commentId]: { reactions: newReactions, userReactions: newUserReactions },
      };
    });

    try {
      const response = await fetch("/api/community/comment-reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, emoji }),
      });

      const data = await response.json();

      if (data.success) {
        // Get user reactions for this comment
        const userReactionsResponse = await fetch(
          `/api/community/comment-reaction?commentId=${commentId}`
        );
        const userReactionsData = await userReactionsResponse.json();

        setCommentReactions((prev) => ({
          ...prev,
          [commentId]: {
            reactions: data.reactions,
            userReactions: userReactionsData.userReactions || [],
          },
        }));
      }
    } catch {
      // Revert on error
      setCommentReactions((prev) => ({
        ...prev,
        [commentId]: current,
      }));
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12 px-4">
      {/* Back Button */}
      <Link href="/community">
        <Button variant="ghost" className="text-gray-600 hover:text-burgundy-600 hover:bg-burgundy-50 -ml-2 rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </Link>

      {/* Main Post Card */}
      <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
        {/* Category Banner */}
        <div className={`bg-gradient-to-r ${categoryStyle.gradient} px-6 py-4 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <CategoryIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Posted in</p>
                <p className="text-white font-bold text-lg">{categoryStyle.label}</p>
              </div>
            </div>
            {post.isPinned && (
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-semibold px-3 py-1.5">
                <Pin className="w-3.5 h-3.5 mr-1.5" />
                Pinned Post
              </Badge>
            )}
          </div>
        </div>

        {/* Author Section */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-white shadow-lg">
              <AvatarImage src={post.author.avatar || undefined} />
              <AvatarFallback className={`${getAvatarGradient(post.author.role)} text-white font-bold text-xl`}>
                {getInitials(post.author.firstName, post.author.lastName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-bold text-gray-900 text-xl">
                  {post.author.firstName} {post.author.lastName}
                </span>
                {getRoleBadge(post.author.role)}
              </div>
              {post.author.bio && (
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">{post.author.bio}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(post.createdAt)}
                </span>
                <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                  <Eye className="w-3.5 h-3.5" />
                  {post.viewCount.toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Content with rich formatting */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100">
              {renderContent(post.content)}
            </div>
          </div>

          {/* Emoji Reactions Bar - Static counts matching the card view */}
          <div className="pt-6 mt-6 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {(() => {
                const reactions = getPostReactions(post.category, post.isPinned);
                return REACTION_EMOJIS.map((emoji, idx) => {
                  const count = reactions[emoji] || 0;
                  const isFirst = emoji === "❤️";
                  return (
                    <button
                      key={emoji}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 ${
                        isFirst
                          ? "bg-rose-100 border-2 border-rose-200 text-rose-700"
                          : "bg-gray-50 border-2 border-gray-200 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className="text-lg">{emoji}</span>
                      <span>{count}</span>
                    </button>
                  );
                });
              })()}
            </div>
          </div>

          {/* Engagement Bar - Just comments and actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <MessageCircle className="w-5 h-5 text-burgundy-600" />
                <span className="font-semibold text-gray-700">{totalCommentsCount || post.totalComments}</span>
                <span className="text-gray-500 text-sm">comments</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="gap-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button variant="ghost" className="gap-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section - Compact Mobile Design */}
      <Card className="border-0 shadow-lg rounded-xl overflow-hidden">
        {/* Compact Comment Header */}
        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="text-white font-semibold text-sm">
              {totalCommentsCount || post.totalComments} {(totalCommentsCount || post.totalComments) === 1 ? "Comment" : "Comments"}
            </span>
          </div>
        </div>

        <CardContent className="p-3 md:p-4">
          {/* Compact Comment Form */}
          <form onSubmit={handleComment} className="mb-4">
            {/* Warning/Error Messages */}
            {commentWarning && (
              <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">{commentWarning}</p>
              </div>
            )}
            {commentError && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{commentError}</p>
              </div>
            )}
            <div className="flex gap-2 items-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-700 text-white text-xs font-bold">
                  You
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-burgundy-400 transition-all overflow-hidden">
                <textarea
                  value={newComment}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full min-h-[60px] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none resize-none"
                />
                <div className="flex justify-end px-2 py-1.5 bg-gray-50 border-t border-gray-100">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={commentLoading || !newComment.trim() || !!commentWarning}
                    className="bg-burgundy-600 hover:bg-burgundy-700 rounded-lg px-3 h-7 text-xs"
                  >
                    {commentLoading ? "..." : <><Send className="w-3 h-3 mr-1" />Post</>}
                  </Button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List - Compact */}
          {displayComments.length > 0 ? (
            <div className="space-y-3">
              {displayComments.map((comment, idx) => (
                <div key={comment.id}>
                  {/* Divider between comments */}
                  {idx > 0 && <div className="border-t border-gray-100 mb-3" />}

                  {/* Compact Comment */}
                  <div className="flex gap-2">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={comment.author.avatar || undefined} />
                      <AvatarFallback className={`text-xs font-bold ${getAvatarGradient(comment.author.role)} text-white`}>
                        {getInitials(comment.author.firstName, comment.author.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "rounded-lg overflow-hidden",
                        comment.author.role !== "STUDENT"
                          ? "bg-amber-50 border border-amber-200"
                          : "bg-gray-50 border border-gray-100"
                      )}>
                        {/* Inline Header + Content */}
                        <div className="px-3 py-2">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="font-semibold text-gray-900 text-sm">
                              {comment.author.firstName} {comment.author.lastName}
                            </span>
                            {getRoleBadge(comment.author.role, "sm")}
                            <span className="text-[10px] text-gray-400 ml-auto">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm whitespace-pre-wrap leading-snug">
                            {comment.content}
                          </p>
                        </div>
                      </div>

                      {/* Compact Actions Row */}
                      <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-burgundy-600 font-medium px-1.5 py-0.5 rounded hover:bg-burgundy-50"
                        >
                          <Reply className="w-3 h-3" />
                          Reply
                        </button>
                        <button
                          onClick={() => handleCommentLike(comment.id)}
                          disabled={commentLikeLoading === comment.id}
                          className={cn(
                            "flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded",
                            commentLikes[comment.id]?.liked
                              ? "text-rose-600 bg-rose-50"
                              : "text-gray-500 hover:text-rose-600 hover:bg-rose-50"
                          )}
                        >
                          <Heart className={cn("w-3 h-3", commentLikes[comment.id]?.liked && "fill-current")} />
                          {(commentLikes[comment.id]?.count || 0) > 0 && commentLikes[comment.id]?.count}
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setShowReactionPicker(showReactionPicker === comment.id ? null : comment.id)}
                            className="text-xs text-gray-400 hover:text-amber-600 px-1.5 py-0.5 rounded hover:bg-amber-50"
                          >
                            +😊
                          </button>
                          {showReactionPicker === comment.id && (
                            <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-xl border border-gray-200 p-1.5 flex gap-0.5 z-50">
                              {REACTION_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleCommentReaction(comment.id, emoji)}
                                  className={cn(
                                    "w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-base hover:scale-110",
                                    commentReactions[comment.id]?.userReactions?.includes(emoji) && "bg-amber-100"
                                  )}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Inline reactions */}
                        {Object.entries(commentReactions[comment.id]?.reactions || {}).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => handleCommentReaction(comment.id, emoji)}
                            className={cn(
                              "flex items-center gap-0.5 px-1 py-0.5 rounded text-xs",
                              commentReactions[comment.id]?.userReactions?.includes(emoji)
                                ? "bg-amber-100"
                                : "bg-gray-100 hover:bg-amber-50"
                            )}
                          >
                            <span className="text-sm">{emoji}</span>
                            <span className="text-gray-600">{count}</span>
                          </button>
                        ))}
                        {comment.replies.length > 0 && (
                          <button
                            onClick={() => toggleReplies(comment.id)}
                            className="flex items-center gap-1 text-xs text-burgundy-600 font-medium px-1.5 py-0.5 rounded hover:bg-burgundy-50 ml-auto"
                          >
                            {expandedReplies.has(comment.id) ? (
                              <><ChevronUp className="w-3 h-3" />{comment.replies.length}</>
                            ) : (
                              <><ChevronDown className="w-3 h-3" />{comment.replies.length} replies</>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Compact Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="mt-2 ml-6 pl-2 border-l-2 border-burgundy-200">
                          {replyWarning && (
                            <div className="mb-1 p-1.5 bg-amber-50 border border-amber-200 rounded flex items-start gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-[10px] text-amber-700">{replyWarning}</p>
                            </div>
                          )}
                          <div className="flex gap-1.5 items-start">
                            <Avatar className="h-6 w-6 flex-shrink-0">
                              <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-700 text-white text-[10px] font-bold">
                                You
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-white rounded-lg border border-gray-200 focus-within:border-burgundy-400 overflow-hidden">
                              <textarea
                                value={replyContent}
                                onChange={(e) => handleReplyChange(e.target.value)}
                                placeholder={`Reply to ${comment.author.firstName}...`}
                                className="w-full min-h-[40px] bg-transparent px-2 py-1.5 text-xs placeholder:text-gray-400 focus:outline-none resize-none"
                                autoFocus
                              />
                              <div className="flex justify-end gap-1 px-1.5 py-1 bg-gray-50 border-t border-gray-100">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => { setReplyingTo(null); setReplyContent(""); setReplyWarning(""); }}
                                  className="h-6 px-2 text-xs text-gray-500"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleReply(comment.id)}
                                  disabled={commentLoading || !replyContent.trim() || !!replyWarning}
                                  className="h-6 px-2 text-xs bg-burgundy-600 hover:bg-burgundy-700"
                                >
                                  <Send className="w-3 h-3 mr-1" />Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Compact Nested Replies */}
                      {expandedReplies.has(comment.id) && comment.replies.length > 0 && (
                        <div className="mt-2 ml-6 pl-2 border-l border-gray-200 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-1.5">
                              <Avatar className="h-6 w-6 flex-shrink-0">
                                <AvatarImage src={reply.author.avatar || undefined} />
                                <AvatarFallback className={`text-[10px] font-bold ${getAvatarGradient(reply.author.role)} text-white`}>
                                  {getInitials(reply.author.firstName, reply.author.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className={cn(
                                  "rounded px-2 py-1.5",
                                  reply.author.role !== "STUDENT"
                                    ? "bg-amber-50"
                                    : "bg-gray-50"
                                )}>
                                  <div className="flex items-center gap-1 flex-wrap">
                                    <span className="font-semibold text-gray-900 text-xs">
                                      {reply.author.firstName} {reply.author.lastName}
                                    </span>
                                    {getRoleBadge(reply.author.role, "sm")}
                                    <span className="text-[10px] text-gray-400 ml-auto">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-xs whitespace-pre-wrap leading-snug mt-0.5">
                                    {reply.content}
                                  </p>
                                </div>
                                {/* Compact Reply Actions */}
                                <div className="flex items-center gap-1 mt-1 flex-wrap">
                                  <button
                                    onClick={() => handleCommentLike(reply.id)}
                                    disabled={commentLikeLoading === reply.id}
                                    className={cn(
                                      "flex items-center gap-0.5 text-[10px] font-medium px-1 py-0.5 rounded",
                                      commentLikes[reply.id]?.liked
                                        ? "text-rose-600 bg-rose-50"
                                        : "text-gray-400 hover:text-rose-600"
                                    )}
                                  >
                                    <Heart className={cn("w-2.5 h-2.5", commentLikes[reply.id]?.liked && "fill-current")} />
                                    {(commentLikes[reply.id]?.count || 0) > 0 && commentLikes[reply.id]?.count}
                                  </button>
                                  <div className="relative">
                                    <button
                                      onClick={() => setShowReactionPicker(showReactionPicker === reply.id ? null : reply.id)}
                                      className="text-[10px] text-gray-400 hover:text-amber-600 px-1"
                                    >
                                      +😊
                                    </button>
                                    {showReactionPicker === reply.id && (
                                      <div className="absolute bottom-full left-0 mb-1 bg-white rounded shadow-lg border p-1 flex gap-0.5 z-50">
                                        {REACTION_EMOJIS.map((emoji) => (
                                          <button
                                            key={emoji}
                                            onClick={() => handleCommentReaction(reply.id, emoji)}
                                            className={cn(
                                              "w-6 h-6 flex items-center justify-center rounded text-sm hover:scale-110",
                                              commentReactions[reply.id]?.userReactions?.includes(emoji) && "bg-amber-100"
                                            )}
                                          >
                                            {emoji}
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                  {Object.entries(commentReactions[reply.id]?.reactions || {}).map(([emoji, count]) => (
                                    <button
                                      key={emoji}
                                      onClick={() => handleCommentReaction(reply.id, emoji)}
                                      className={cn(
                                        "flex items-center gap-0.5 px-1 py-0.5 rounded text-[10px]",
                                        commentReactions[reply.id]?.userReactions?.includes(emoji)
                                          ? "bg-amber-100"
                                          : "bg-gray-100"
                                      )}
                                    >
                                      <span className="text-xs">{emoji}</span>
                                      <span className="text-gray-600">{count}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-burgundy-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-6 h-6 text-burgundy-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">No comments yet</p>
              <p className="text-xs text-gray-400">Be the first to share your thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
