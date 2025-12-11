// Workflow Automation Templates Seed Data
// Complete automation pack for LMS - 50+ pre-built workflows

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ==================== MESSAGE TEMPLATES ====================

const messageTemplates = [
  // Welcome Templates
  {
    name: "Welcome DM",
    slug: "welcome-dm",
    category: "WELCOME",
    content: "Welcome {firstName}! 💛 Your journey starts now. I'm so excited to have you here. Take your time, explore the portal, and remember — every small step counts. You're exactly where you need to be. Let me know if you need anything!",
    variables: ["firstName", "lastName", "email"],
    isSystem: true,
  },
  {
    name: "Welcome Email",
    slug: "welcome-email",
    category: "WELCOME",
    subject: "Welcome to AccrediPro! Your Portal Access is Ready",
    content: "Hi {firstName},\n\nYour learning portal is ready! 🎉\n\nHere's what to do next:\n1. Log in and complete your profile\n2. Start with Lesson 1 of your first course\n3. Join our community to connect with fellow students\n\nWe're here to support you every step of the way.\n\nWith love,\nThe AccrediPro Team",
    variables: ["firstName", "lastName", "email"],
    isSystem: true,
  },
  {
    name: "Onboarding Follow-up",
    slug: "onboarding-followup",
    category: "WELCOME",
    content: "Hi {firstName}! I noticed you just joined us. Have you had a chance to explore the portal yet? If you have any questions about which path is right for you, I'm here to help! 💛",
    variables: ["firstName"],
    isSystem: true,
  },

  // Progress Templates
  {
    name: "First Lesson Complete",
    slug: "first-lesson-complete",
    category: "PROGRESS",
    content: "Amazing job completing your first lesson, {firstName}! 🎉 You're off to a great start. Keep that momentum going — your next lesson is waiting for you!",
    variables: ["firstName", "lessonTitle", "courseTitle"],
    isSystem: true,
  },
  {
    name: "Module Complete",
    slug: "module-complete",
    category: "PROGRESS",
    content: "{firstName}, you just completed {moduleTitle}! 🌟 This is such great progress. You're proving to yourself that you can do this. Ready for the next module?",
    variables: ["firstName", "moduleTitle", "courseTitle"],
    isSystem: true,
  },
  {
    name: "Halfway Through",
    slug: "halfway-through",
    category: "PROGRESS",
    content: "You're halfway there, {firstName}! 🎯 50% complete in {courseTitle}. You're doing incredible work. The finish line is in sight!",
    variables: ["firstName", "courseTitle", "progress"],
    isSystem: true,
  },
  {
    name: "Course Complete",
    slug: "course-complete",
    category: "MILESTONE",
    content: "🎉 CONGRATULATIONS {firstName}! You've completed {courseTitle}! This is a huge accomplishment. Your certificate is ready to download. I'm so proud of you! 💛",
    variables: ["firstName", "courseTitle", "certificateUrl"],
    isSystem: true,
  },

  // Encouragement Templates
  {
    name: "Keep Going",
    slug: "keep-going",
    category: "ENCOURAGEMENT",
    content: "Hey {firstName}, I see you've been working hard! 💪 Remember, consistency beats perfection. Every lesson you complete is bringing you closer to your goals. You've got this!",
    variables: ["firstName"],
    isSystem: true,
  },
  {
    name: "Proud of You",
    slug: "proud-of-you",
    category: "ENCOURAGEMENT",
    content: "{firstName}, I just wanted to say — I'm so proud of the commitment you're showing. This journey isn't easy, but you're showing up. That's what matters. 💛",
    variables: ["firstName"],
    isSystem: true,
  },
  {
    name: "You're Doing Better Than You Think",
    slug: "doing-better",
    category: "ENCOURAGEMENT",
    content: "Hey {firstName}, just a reminder: you're doing better than you think. Every step forward counts, no matter how small. Keep going! 🌟",
    variables: ["firstName"],
    isSystem: true,
  },

  // Reminder Templates
  {
    name: "Inactive 24h",
    slug: "inactive-24h",
    category: "REMINDER",
    content: "Hey {firstName}, just checking in! 💛 Your next lesson is waiting for you. Even 10 minutes of learning today can make a difference. Ready to continue?",
    variables: ["firstName", "nextLessonTitle"],
    isSystem: true,
  },
  {
    name: "Inactive 48h",
    slug: "inactive-48h",
    category: "REMINDER",
    content: "Hi {firstName}, I noticed you haven't logged in for a couple of days. Everything okay? Remember, your goals are waiting for you. Let me know if there's anything I can help with! 💛",
    variables: ["firstName"],
    isSystem: true,
  },
  {
    name: "Inactive 7 Days",
    slug: "inactive-7d",
    category: "REMINDER",
    content: "{firstName}, it's been a week since we've seen you! 💭 Life gets busy, I know. But your dreams and goals haven't changed. Your spot is waiting for you whenever you're ready. We miss you! 💛",
    variables: ["firstName"],
    isSystem: true,
  },

  // Upsell Templates
  {
    name: "Ready for Certification",
    slug: "ready-certification",
    category: "UPSELL",
    content: "{firstName}, based on your progress, I think you're ready for the next step! Have you considered our certification program? It could open so many doors for your career. Want to learn more?",
    variables: ["firstName", "courseTitle", "certificationName"],
    isSystem: true,
  },
  {
    name: "Credit Under 620 Offer",
    slug: "credit-under-620",
    category: "UPSELL",
    content: "Hi {firstName}! 💛 I have some perfect options for you to continue your learning journey. Check out our $97-$297 starter certifications — they're designed to help you build your foundation without a big investment.",
    variables: ["firstName"],
    isSystem: true,
  },
  {
    name: "Credit 620-679 Offer",
    slug: "credit-620-679",
    category: "UPSELL",
    content: "{firstName}, you're doing amazing! Based on your journey so far, I'd love to share our Fast Track ($497) or full Certification ($997) options with you. These programs could really accelerate your path! 🚀",
    variables: ["firstName"],
    isSystem: true,
  },
  {
    name: "Credit 680+ Offer",
    slug: "credit-680-plus",
    category: "UPSELL",
    content: "{firstName}, you've shown incredible dedication! I think you're ready for our Practitioner Path ($1,997) — it includes everything you need to build a thriving practice. Ready to take the leap? 🌟",
    variables: ["firstName"],
    isSystem: true,
  },

  // Milestone Templates
  {
    name: "First Badge Earned",
    slug: "first-badge",
    category: "MILESTONE",
    content: "🏆 {firstName}, you just earned your first badge: {badgeName}! This is just the beginning. Keep collecting achievements — you're building something amazing!",
    variables: ["firstName", "badgeName"],
    isSystem: true,
  },
  {
    name: "Streak Achievement",
    slug: "streak-achievement",
    category: "MILESTONE",
    content: "🔥 {streakDays} days in a row, {firstName}! Your consistency is incredible. This is EXACTLY what successful practitioners do. Keep that fire burning!",
    variables: ["firstName", "streakDays"],
    isSystem: true,
  },
  {
    name: "Challenge Graduate",
    slug: "challenge-graduate",
    category: "MILESTONE",
    content: "🎓 {firstName}, you did it! You've completed the challenge! This proves you have what it takes. Now, are you ready to take the next step on your certification journey?",
    variables: ["firstName", "challengeName"],
    isSystem: true,
  },

  // Community Templates
  {
    name: "First Post Welcome",
    slug: "first-post-welcome",
    category: "SUPPORT",
    content: "{firstName}, I saw your first post in the community! 💛 Your voice matters here. Thank you for sharing. The community is better because you're in it!",
    variables: ["firstName"],
    isSystem: true,
  },
  {
    name: "Community Engagement",
    slug: "community-engagement",
    category: "ENCOURAGEMENT",
    content: "Hey {firstName}! I love seeing you engage in the community. Your insights are so valuable. Keep sharing — you never know who you might inspire! 💛",
    variables: ["firstName"],
    isSystem: true,
  },

  // Announcement Templates
  {
    name: "New Course Drop",
    slug: "new-course-drop",
    category: "ANNOUNCEMENT",
    content: "🚀 {firstName}, we just dropped something special! Check out our new course: {courseName}. I think you're going to love it!",
    variables: ["firstName", "courseName", "courseUrl"],
    isSystem: true,
  },
  {
    name: "Flash Sale",
    slug: "flash-sale",
    category: "ANNOUNCEMENT",
    content: "⚡ {firstName}, FLASH SALE! For the next {hours} hours, get {discount}% off {offerName}. This is your chance! Use code: {code}",
    variables: ["firstName", "hours", "discount", "offerName", "code"],
    isSystem: true,
  },
  {
    name: "Scholarship Window",
    slug: "scholarship-window",
    category: "ANNOUNCEMENT",
    content: "💛 {firstName}, our scholarship window is now open! If budget has been holding you back, this is your opportunity. Apply now — spots are limited!",
    variables: ["firstName", "applicationUrl"],
    isSystem: true,
  },
];

// ==================== WORKFLOW TEMPLATES ====================

const workflowTemplates = [
  // ============ ENROLLMENT / WELCOME AUTOMATIONS ============
  {
    name: "Welcome Message (DM)",
    slug: "welcome-dm-automation",
    description: "Send a warm welcome DM when a user creates an account",
    category: "ENROLLMENT",
    triggerType: "USER_REGISTERED",
    triggerConfig: {},
    isSystem: true,
    priority: 100,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "welcome-dm",
          fromAssignedCoach: true,
        },
        delayMinutes: 5,
      },
    ],
  },
  {
    name: "Welcome Email Sequence",
    slug: "welcome-email-sequence",
    description: "3-email welcome sequence for new registrations",
    category: "ENROLLMENT",
    triggerType: "USER_REGISTERED",
    triggerConfig: {},
    isSystem: true,
    priority: 90,
    actions: [
      {
        order: 0,
        actionType: "SEND_EMAIL",
        config: {
          templateSlug: "welcome-email",
          subject: "Your portal access is ready!",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_EMAIL",
        config: {
          subject: "Ready to start? Your first lesson awaits",
          content: "Hi {firstName},\n\nHave you started Lesson 1 yet? It's the perfect way to begin your journey. Log in now and take that first step!\n\nBelieving in you,\nYour Coach",
        },
        delayMinutes: 1440, // 24 hours
      },
      {
        order: 2,
        actionType: "SEND_EMAIL",
        config: {
          subject: "Considering the practitioner path?",
          content: "Hi {firstName},\n\nMany of our students start with curiosity and end up building thriving practices. Curious about the certification path? Check out your roadmap to see what's possible.\n\nExcited for your journey,\nYour Coach",
        },
        delayMinutes: 4320, // 72 hours
      },
    ],
  },
  {
    name: "First Login Welcome",
    slug: "first-login-welcome",
    description: "Send personalized DM on user's first login",
    category: "ENROLLMENT",
    triggerType: "USER_FIRST_LOGIN",
    triggerConfig: {},
    isSystem: true,
    priority: 95,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "onboarding-followup",
          fromAssignedCoach: true,
        },
        delayMinutes: 60,
      },
      {
        order: 1,
        actionType: "ADD_TAG",
        config: {
          tag: "lifecycle:first-login",
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Onboarding Path Selector",
    slug: "onboarding-path-selector",
    description: "Show path selection popup on first portal entry",
    category: "ENROLLMENT",
    triggerType: "USER_FIRST_LOGIN",
    triggerConfig: {},
    isSystem: true,
    priority: 100,
    actions: [
      {
        order: 0,
        actionType: "SHOW_POPUP",
        config: {
          popupType: "path-selector",
          title: "Which path are you here for?",
          options: [
            { label: "Support my family's health", tag: "goal:family" },
            { label: "Build a career in wellness", tag: "goal:career" },
            { label: "Learn for myself", tag: "goal:personal" },
          ],
        },
        delayMinutes: 0,
      },
    ],
  },

  // ============ PROGRESS-BASED AUTOMATIONS ============
  {
    name: "First Lesson Completed",
    slug: "first-lesson-complete-automation",
    description: "Celebrate and encourage after completing first lesson",
    category: "PROGRESS",
    triggerType: "LESSON_COMPLETED",
    triggerConfig: { isFirstLesson: true },
    isSystem: true,
    priority: 80,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "first-lesson-complete",
          fromAssignedCoach: true,
        },
        delayMinutes: 10,
      },
      {
        order: 1,
        actionType: "ADD_TAG",
        config: {
          tag: "progress:first-lesson",
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Module 1 Completed",
    slug: "module-1-complete",
    description: "Send career quiz and DM after Module 1 completion",
    category: "PROGRESS",
    triggerType: "MODULE_COMPLETED",
    triggerConfig: { moduleOrder: 1 },
    isSystem: true,
    priority: 75,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "You've completed your first module, {firstName}! 🎉 You're ready for something bigger. Want to see which certification fits you best? Take our career quiz!",
          fromAssignedCoach: true,
        },
        delayMinutes: 30,
      },
      {
        order: 1,
        actionType: "SHOW_POPUP",
        config: {
          popupType: "career-quiz-cta",
          title: "Discover Your Path",
          buttonText: "Take Career Quiz",
          redirectUrl: "/roadmap",
        },
        delayMinutes: 60,
      },
    ],
  },
  {
    name: "Mini Diploma Completed",
    slug: "mini-diploma-complete",
    description: "Graduate celebration with credit-based upsell",
    category: "PROGRESS",
    triggerType: "MINI_DIPLOMA_EARNED",
    triggerConfig: {},
    isSystem: true,
    priority: 100,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "course-complete",
          fromAssignedCoach: true,
        },
        delayMinutes: 5,
      },
      {
        order: 1,
        actionType: "AWARD_BADGE",
        config: {
          badgeSlug: "mini-diploma-graduate",
        },
        delayMinutes: 0,
      },
      {
        order: 2,
        actionType: "REDIRECT_TO_PAGE",
        config: {
          url: "/roadmap",
        },
        delayMinutes: 10,
      },
    ],
  },
  {
    name: "50% Course Progress",
    slug: "progress-50-percent",
    description: "Encourage at halfway point",
    category: "PROGRESS",
    triggerType: "PROGRESS_PERCENTAGE",
    triggerConfig: { percentage: 50 },
    isSystem: true,
    priority: 70,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "halfway-through",
          fromAssignedCoach: true,
        },
        delayMinutes: 30,
      },
    ],
  },
  {
    name: "Challenge Halfway",
    slug: "challenge-halfway",
    description: "Motivate users at challenge halfway point",
    category: "PROGRESS",
    triggerType: "CHALLENGE_HALFWAY",
    triggerConfig: {},
    isSystem: true,
    priority: 75,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "You're halfway to your career breakthrough, {firstName}! 🚀 Keep pushing — the best is yet to come!",
          fromAssignedCoach: true,
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_EMAIL",
        config: {
          subject: "You're halfway there! 🎯",
          content: "Hi {firstName},\n\nYou've hit the halfway mark in your challenge! This is where real transformation happens. Keep showing up — you're doing incredible.\n\nCheering you on,\nYour Coach",
        },
        delayMinutes: 0,
      },
    ],
  },

  // ============ ENGAGEMENT AUTOMATIONS ============
  {
    name: "Inactive 24 Hours",
    slug: "inactive-24h",
    description: "Gentle reminder after 24 hours of inactivity",
    category: "ENGAGEMENT",
    triggerType: "INACTIVE_24H",
    triggerConfig: {},
    isSystem: true,
    priority: 60,
    cooldownMinutes: 1440,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "inactive-24h",
          fromAssignedCoach: true,
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Inactive 48 Hours",
    slug: "inactive-48h",
    description: "Check-in after 48 hours of inactivity",
    category: "ENGAGEMENT",
    triggerType: "INACTIVE_48H",
    triggerConfig: {},
    isSystem: true,
    priority: 55,
    cooldownMinutes: 2880,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "inactive-48h",
          fromAssignedCoach: true,
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Inactive 7 Days",
    slug: "inactive-7d",
    description: "Re-engagement after 7 days of inactivity",
    category: "ENGAGEMENT",
    triggerType: "INACTIVE_7D",
    triggerConfig: {},
    isSystem: true,
    priority: 50,
    cooldownMinutes: 10080,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "inactive-7d",
          fromAssignedCoach: true,
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_EMAIL",
        config: {
          subject: "We miss you, {firstName}! 💛",
          templateSlug: "inactive-7d",
        },
        delayMinutes: 60,
      },
    ],
  },
  {
    name: "3-Day Streak Reward",
    slug: "streak-3-days",
    description: "Award badge for 3-day login streak",
    category: "ENGAGEMENT",
    triggerType: "STREAK_ACHIEVED",
    triggerConfig: { streakDays: 3 },
    isSystem: true,
    priority: 65,
    maxExecutions: 1,
    actions: [
      {
        order: 0,
        actionType: "AWARD_BADGE",
        config: {
          badgeSlug: "consistency-starter",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_DM",
        config: {
          content: "🔥 3 days in a row, {firstName}! This consistency? It's EXACTLY what great practitioners have. Badge awarded!",
          fromAssignedCoach: true,
        },
        delayMinutes: 5,
      },
    ],
  },
  {
    name: "7-Day Streak Reward",
    slug: "streak-7-days",
    description: "Award badge for 7-day login streak",
    category: "ENGAGEMENT",
    triggerType: "STREAK_ACHIEVED",
    triggerConfig: { streakDays: 7 },
    isSystem: true,
    priority: 70,
    maxExecutions: 1,
    actions: [
      {
        order: 0,
        actionType: "AWARD_BADGE",
        config: {
          badgeSlug: "week-warrior",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_DM",
        config: {
          content: "🏆 A FULL WEEK, {firstName}! 7 days in a row — you're building habits that will change your life. So proud of you!",
          fromAssignedCoach: true,
        },
        delayMinutes: 5,
      },
    ],
  },

  // ============ SMARTROUTE FINANCE AUTOMATIONS ============
  {
    name: "Credit Under 620 - Show Low-Tier Offers",
    slug: "credit-under-620-offers",
    description: "Show $97-$297 options for users with credit under 620",
    category: "UPSELL",
    triggerType: "CREDIT_SCORE_UNDER_620",
    triggerConfig: {},
    isSystem: true,
    priority: 85,
    actions: [
      {
        order: 0,
        actionType: "ADD_TAG",
        config: {
          tag: "credit:under-620",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SHOW_OFFER",
        config: {
          offerTier: "low",
          priceRange: "$97-$297",
          showOnRoadmap: true,
        },
        delayMinutes: 0,
      },
      {
        order: 2,
        actionType: "SEND_DM",
        config: {
          templateSlug: "credit-under-620",
          fromAssignedCoach: true,
        },
        delayMinutes: 1440, // 24 hours after credit check
      },
    ],
  },
  {
    name: "Credit 620-679 - Show Mid-Tier Offers",
    slug: "credit-620-679-offers",
    description: "Show $497-$997 options for mid-tier credit",
    category: "UPSELL",
    triggerType: "CREDIT_SCORE_620_679",
    triggerConfig: {},
    isSystem: true,
    priority: 85,
    actions: [
      {
        order: 0,
        actionType: "ADD_TAG",
        config: {
          tag: "credit:620-679",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SHOW_OFFER",
        config: {
          offerTier: "mid",
          priceRange: "$497-$997",
          showOnRoadmap: true,
        },
        delayMinutes: 0,
      },
      {
        order: 2,
        actionType: "SEND_DM",
        config: {
          templateSlug: "credit-620-679",
          fromAssignedCoach: true,
        },
        delayMinutes: 1440,
      },
    ],
  },
  {
    name: "Credit 680+ - Show High-Tier Offers",
    slug: "credit-680-plus-offers",
    description: "Show $997-$1997 practitioner path for high credit",
    category: "UPSELL",
    triggerType: "CREDIT_SCORE_680_PLUS",
    triggerConfig: {},
    isSystem: true,
    priority: 85,
    actions: [
      {
        order: 0,
        actionType: "ADD_TAG",
        config: {
          tag: "credit:680-plus",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SHOW_OFFER",
        config: {
          offerTier: "high",
          priceRange: "$997-$1997",
          showOnRoadmap: true,
        },
        delayMinutes: 0,
      },
      {
        order: 2,
        actionType: "SEND_DM",
        config: {
          templateSlug: "credit-680-plus",
          fromAssignedCoach: true,
        },
        delayMinutes: 1440,
      },
    ],
  },

  // ============ BEHAVIOR AUTOMATIONS ============
  {
    name: "Catalog Viewed 3 Times",
    slug: "catalog-viewed-3x",
    description: "Offer help when user browses catalog repeatedly",
    category: "BEHAVIOR",
    triggerType: "CATALOG_VIEWED",
    triggerConfig: { viewCount: 3 },
    isSystem: true,
    priority: 70,
    cooldownMinutes: 10080, // Once per week
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "Hi {firstName}! 💛 I noticed you've been exploring our certifications. Can I help you pick the right one for your goals? I'd love to chat!",
          fromAssignedCoach: true,
        },
        delayMinutes: 30,
      },
    ],
  },
  {
    name: "Course Page Viewed - No Purchase",
    slug: "course-page-no-purchase",
    description: "Follow up when user views course but doesn't buy",
    category: "BEHAVIOR",
    triggerType: "COURSE_PAGE_VIEWED",
    triggerConfig: { noPurchaseAfterMinutes: 1440 },
    isSystem: true,
    priority: 65,
    cooldownMinutes: 4320,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "Hi {firstName}, I saw you were checking out {courseTitle}! Want help understanding if it's the right fit for you? Happy to answer any questions! 💛",
          fromAssignedCoach: true,
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Video Watched 50%",
    slug: "video-watched-50",
    description: "Engage when user watches 50% of free training",
    category: "BEHAVIOR",
    triggerType: "VIDEO_WATCHED_PERCENT",
    triggerConfig: { percentage: 50 },
    isSystem: true,
    priority: 75,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "Hey {firstName}! I noticed you're watching — excited to hear what part hit you the most! 💛",
          fromAssignedCoach: true,
        },
        delayMinutes: 60,
      },
    ],
  },
  {
    name: "Free Training Completed",
    slug: "free-training-complete",
    description: "Show certification offer after completing free training",
    category: "BEHAVIOR",
    triggerType: "VIDEO_WATCHED_PERCENT",
    triggerConfig: { percentage: 90 },
    isSystem: true,
    priority: 80,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "You finished the training, {firstName}! 🎉 If this resonated with you, you're READY for certification. Want to see your personalized path?",
          fromAssignedCoach: true,
        },
        delayMinutes: 30,
      },
      {
        order: 1,
        actionType: "SHOW_UPSELL_CTA",
        config: {
          ctaType: "certification-offer",
          showBasedOnCredit: true,
        },
        delayMinutes: 60,
      },
    ],
  },

  // ============ MILESTONE AUTOMATIONS ============
  {
    name: "First Badge Earned",
    slug: "first-badge-earned",
    description: "Celebrate when user earns their first badge",
    category: "MILESTONE",
    triggerType: "BADGE_EARNED",
    triggerConfig: { isFirstBadge: true },
    isSystem: true,
    priority: 80,
    maxExecutions: 1,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "first-badge",
          fromAssignedCoach: true,
        },
        delayMinutes: 5,
      },
      {
        order: 1,
        actionType: "SEND_NOTIFICATION",
        config: {
          title: "Your First Badge! 🏆",
          message: "Congratulations! You've earned your first achievement badge.",
          type: "ACHIEVEMENT",
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Challenge Completed",
    slug: "challenge-complete",
    description: "Graduate from challenge with certification CTA",
    category: "MILESTONE",
    triggerType: "CHALLENGE_COMPLETED",
    triggerConfig: {},
    isSystem: true,
    priority: 90,
    actions: [
      {
        order: 0,
        actionType: "AWARD_BADGE",
        config: {
          badgeSlug: "challenge-graduate",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_DM",
        config: {
          templateSlug: "challenge-graduate",
          fromAssignedCoach: true,
        },
        delayMinutes: 10,
      },
      {
        order: 2,
        actionType: "REDIRECT_TO_PAGE",
        config: {
          url: "/roadmap",
        },
        delayMinutes: 30,
      },
      {
        order: 3,
        actionType: "SHOW_UPSELL_CTA",
        config: {
          ctaType: "post-challenge-offer",
          showBasedOnCredit: true,
        },
        delayMinutes: 60,
      },
    ],
  },
  {
    name: "Certificate Issued",
    slug: "certificate-issued",
    description: "Celebrate certificate issuance",
    category: "MILESTONE",
    triggerType: "CERTIFICATE_ISSUED",
    triggerConfig: {},
    isSystem: true,
    priority: 95,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "🎓 {firstName}, your certificate is officially ready! You did it! Download it now and share your achievement with the world. I'm SO proud of you! 💛",
          fromAssignedCoach: true,
        },
        delayMinutes: 5,
      },
      {
        order: 1,
        actionType: "SEND_EMAIL",
        config: {
          subject: "Your Certificate is Ready! 🎓",
          content: "Congratulations {firstName}!\n\nYour certificate is now available for download in your portal. This is a huge accomplishment!\n\nShare it proudly — you've earned it.\n\nWith pride,\nThe AccrediPro Team",
        },
        delayMinutes: 0,
      },
      {
        order: 2,
        actionType: "SEND_NOTIFICATION",
        config: {
          title: "Certificate Ready!",
          message: "Your certificate is now available for download.",
          type: "CERTIFICATE_ISSUED",
        },
        delayMinutes: 0,
      },
    ],
  },

  // ============ COMMUNITY AUTOMATIONS ============
  {
    name: "First Community Post",
    slug: "first-community-post",
    description: "Welcome user's first community contribution",
    category: "ENGAGEMENT",
    triggerType: "FIRST_COMMUNITY_POST",
    triggerConfig: {},
    isSystem: true,
    priority: 70,
    maxExecutions: 1,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          templateSlug: "first-post-welcome",
          fromAssignedCoach: true,
        },
        delayMinutes: 30,
      },
      {
        order: 1,
        actionType: "AWARD_BADGE",
        config: {
          badgeSlug: "community-member",
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "First Community Comment",
    slug: "first-community-comment",
    description: "Acknowledge first comment in community",
    category: "ENGAGEMENT",
    triggerType: "FIRST_COMMUNITY_COMMENT",
    triggerConfig: {},
    isSystem: true,
    priority: 65,
    maxExecutions: 1,
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          content: "{firstName}, I saw your comment in the community! Your voice matters here. 💛 Keep engaging — you're building connections that will support your journey!",
          fromAssignedCoach: true,
        },
        delayMinutes: 60,
      },
    ],
  },

  // ============ SYSTEM AUTOMATIONS ============
  {
    name: "Auto-Assign Coach on Registration",
    slug: "auto-assign-coach",
    description: "Assign coach based on user's interest category",
    category: "SYSTEM",
    triggerType: "USER_REGISTERED",
    triggerConfig: {},
    isSystem: true,
    priority: 100,
    actions: [
      {
        order: 0,
        actionType: "ASSIGN_COACH",
        config: {
          assignmentRule: "by-category", // Or "round-robin", "load-balance"
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Tag by Interest",
    slug: "tag-by-interest",
    description: "Auto-tag users based on their onboarding selections",
    category: "SYSTEM",
    triggerType: "USER_ONBOARDING_COMPLETE",
    triggerConfig: {},
    isSystem: true,
    priority: 95,
    actions: [
      {
        order: 0,
        actionType: "ADD_TAG",
        config: {
          tagFromField: "focusAreas", // Use user's selected focus areas
          tagPrefix: "interest:",
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "ADD_TAG",
        config: {
          tagFromField: "learningGoal",
          tagPrefix: "goal:",
        },
        delayMinutes: 0,
      },
    ],
  },
  {
    name: "Tag by Funnel Entry",
    slug: "tag-by-funnel",
    description: "Tag users based on how they entered (ebook, training, etc.)",
    category: "SYSTEM",
    triggerType: "USER_REGISTERED",
    triggerConfig: {},
    isSystem: true,
    priority: 90,
    actions: [
      {
        order: 0,
        actionType: "ADD_TAG",
        config: {
          tagFromField: "leadSource",
          tagPrefix: "source:",
        },
        delayMinutes: 0,
      },
    ],
  },

  // ============ UPSELL DAY-BASED AUTOMATIONS ============
  {
    name: "Day 5 - Income Day CTA",
    slug: "day-5-income-cta",
    description: "Show income-based CTA on Day 5 of challenge",
    category: "UPSELL",
    triggerType: "DAYS_SINCE_ENROLLMENT",
    triggerConfig: { days: 5 },
    isSystem: true,
    priority: 75,
    actions: [
      {
        order: 0,
        actionType: "SHOW_UPSELL_CTA",
        config: {
          ctaType: "income-potential",
          message: "Practitioners earn $997-$2,997 per program",
          showOnDashboard: true,
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_DM",
        config: {
          content: "{firstName}, you're on Day 5! 💰 Did you know that certified practitioners often charge $997-$2,997 for their programs? Imagine what that could mean for you...",
          fromAssignedCoach: true,
        },
        delayMinutes: 480, // 8 hours after login
      },
    ],
  },
  {
    name: "Day 7 - Certification CTA",
    slug: "day-7-certification-cta",
    description: "Show certification offer on Day 7 based on credit tier",
    category: "UPSELL",
    triggerType: "DAYS_SINCE_ENROLLMENT",
    triggerConfig: { days: 7 },
    isSystem: true,
    priority: 80,
    actions: [
      {
        order: 0,
        actionType: "SHOW_UPSELL_CTA",
        config: {
          ctaType: "day-7-offer",
          showBasedOnCredit: true,
        },
        delayMinutes: 0,
      },
      {
        order: 1,
        actionType: "SEND_DM",
        config: {
          content: "Day 7, {firstName}! 🎯 You've shown incredible commitment. Ready to take the next step? I have a special offer just for you based on where you are in your journey...",
          fromAssignedCoach: true,
        },
        delayMinutes: 240,
      },
    ],
  },

  // ============ AI COACH DM FLOW ============
  {
    name: "AI Coach - Lesson Complete Encouragement",
    slug: "ai-coach-lesson-complete",
    description: "Send supportive AI-generated DM after any lesson completion",
    category: "PROGRESS",
    triggerType: "LESSON_COMPLETED",
    triggerConfig: {},
    isSystem: true,
    priority: 50,
    cooldownMinutes: 240, // Max once per 4 hours
    actions: [
      {
        order: 0,
        actionType: "SEND_DM",
        config: {
          useAiGeneration: true,
          aiPrompt: "Generate a short, warm, encouraging message for {firstName} who just completed lesson '{lessonTitle}'. Be supportive and mention they're making progress. Keep it under 50 words. Use emoji sparingly (1-2 max). Sign off warmly.",
          fromAssignedCoach: true,
        },
        delayMinutes: 15,
      },
    ],
  },
];

// ==================== SEED FUNCTION ====================

async function seedWorkflows() {
  console.log("🌱 Seeding message templates...");

  // Seed message templates
  for (const template of messageTemplates) {
    await prisma.messageTemplate.upsert({
      where: { slug: template.slug },
      update: template as any,
      create: template as any,
    });
  }
  console.log(`✅ Seeded ${messageTemplates.length} message templates`);

  console.log("🌱 Seeding workflow templates...");

  // Seed workflows
  for (const workflow of workflowTemplates) {
    const { actions, ...workflowData } = workflow;

    const existingWorkflow = await prisma.workflow.findUnique({
      where: { slug: workflow.slug },
    });

    if (existingWorkflow) {
      // Update existing workflow
      await prisma.workflow.update({
        where: { slug: workflow.slug },
        data: {
          ...workflowData,
          triggerConfig: workflowData.triggerConfig,
        } as any,
      });

      // Delete old actions and recreate
      await prisma.workflowAction.deleteMany({
        where: { workflowId: existingWorkflow.id },
      });

      for (const action of actions) {
        await prisma.workflowAction.create({
          data: {
            ...action,
            workflowId: existingWorkflow.id,
            config: action.config,
          } as any,
        });
      }
    } else {
      // Create new workflow with actions
      await prisma.workflow.create({
        data: {
          ...workflowData,
          triggerConfig: workflowData.triggerConfig,
          actions: {
            create: actions.map((action) => ({
              ...action,
              config: action.config,
            })) as any,
          },
        } as any,
      });
    }
  }

  console.log(`✅ Seeded ${workflowTemplates.length} workflow templates`);
  console.log("🎉 Workflow seeding complete!");
}

// Run if called directly
seedWorkflows()
  .catch((e) => {
    console.error("❌ Error seeding workflows:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { seedWorkflows, messageTemplates, workflowTemplates };
