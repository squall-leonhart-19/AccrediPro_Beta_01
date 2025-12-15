const fs = require('fs');

// All 30 tips posts data
const tipsPostsData = [
  {
    id: "tips-daily-1",
    day: 1,
    title: "💡 You Don't Need to Know Everything",
    date: new Date(2025, 7, 15), // August 15
    prompt: "What's the ONE question you're most afraid a client will ask you?"
  },
  {
    id: "tips-daily-2",
    day: 2,
    title: "🎯 Your First Client Is Closer Than You Think",
    date: new Date(2025, 7, 16),
    prompt: "Without naming names, describe your ideal first client. What are they struggling with?"
  },
  {
    id: "tips-daily-3",
    day: 3,
    title: "🦋 Imposter Syndrome Is a Sign You're Growing",
    date: new Date(2025, 7, 17),
    prompt: "On a scale of 1-10, where's your imposter syndrome TODAY?"
  },
  {
    id: "tips-daily-4",
    day: 4,
    title: "🎯 Stop Waiting for the Perfect Niche",
    date: new Date(2025, 7, 18),
    prompt: "Fill in the blank: I help _____ with _____ so they can _____"
  },
  {
    id: "tips-daily-5",
    day: 5,
    title: "✨ Your Transformation Story IS Your Credibility",
    date: new Date(2025, 7, 19),
    prompt: "Share one powerful sentence from YOUR transformation story"
  },
  {
    id: "tips-daily-6",
    day: 6,
    title: "🚀 Start Coaching BEFORE Your Website Is Perfect",
    date: new Date(2025, 7, 20),
    prompt: "What's ONE thing you're doing this week instead of building a website?"
  },
  {
    id: "tips-daily-7",
    day: 7,
    title: "🎉 Weekly Wins Thread",
    date: new Date(2025, 7, 21),
    prompt: "Drop your wins below!"
  },
  {
    id: "tips-daily-8",
    day: 8,
    title: "💰 How to Price Your Services Without Undervaluing Yourself",
    date: new Date(2025, 7, 22),
    prompt: "What are you charging right now? (Or planning to charge?)"
  },
  {
    id: "tips-daily-9",
    day: 9,
    title: "📞 What to Say on Your First Discovery Call",
    date: new Date(2025, 7, 23),
    prompt: "What's your biggest fear about discovery calls?"
  },
  {
    id: "tips-daily-10",
    day: 10,
    title: "🧪 The Power of Pilot Programs",
    date: new Date(2025, 7, 24),
    prompt: "Who's ready to offer a pilot program? Comment I'M IN!"
  },
  {
    id: "tips-daily-11",
    day: 11,
    title: "📱 You Don't Need a Big Social Media Following",
    date: new Date(2025, 7, 25),
    prompt: "How many followers do you have right now? Let's prove size doesn't matter!"
  },
  {
    id: "tips-daily-12",
    day: 12,
    title: "📧 Client Onboarding Email Scripts",
    date: new Date(2025, 7, 26),
    prompt: "If these templates save you time, comment 🙏 THANK YOU!"
  },
  {
    id: "tips-daily-13",
    day: 13,
    title: "🤔 How to Handle 'I Need to Think About It'",
    date: new Date(2025, 7, 27),
    prompt: "What objection scares you most?"
  },
  {
    id: "tips-daily-14",
    day: 14,
    title: "🎉 Week 2 Wins Thread",
    date: new Date(2025, 7, 28),
    prompt: "Drop your wins below!"
  },
  {
    id: "tips-daily-15",
    day: 15,
    title: "👂 The Art of Active Listening (Your Secret Weapon)",
    date: new Date(2025, 7, 29),
    prompt: "What's the hardest part of active listening for you?"
  },
  {
    id: "tips-daily-16",
    day: 16,
    title: "🔄 When to Refer Out (And Why It's Your Superpower)",
    date: new Date(2025, 7, 30),
    prompt: "Have you ever felt pressured to take on a client who wasn't a good fit?"
  },
  {
    id: "tips-daily-17",
    day: 17,
    title: "🛡️ Boundaries Are NOT Selfish (They're Essential)",
    date: new Date(2025, 7, 31),
    prompt: "What boundary do you struggle with most?"
  },
  {
    id: "tips-daily-18",
    day: 18,
    title: "🤷 The Power of 'I Don't Know'",
    date: new Date(2025, 8, 1), // September 1
    prompt: "What's a question you're terrified a client will ask?"
  },
  {
    id: "tips-daily-19",
    day: 19,
    title: "💪 The Complete Objection Handler Script",
    date: new Date(2025, 8, 2),
    prompt: "If this script gives you confidence, comment 🔥 GAME CHANGER!"
  },
  {
    id: "tips-daily-20",
    day: 20,
    title: "⚖️ Building a Sustainable Practice (Not a Burnout Factory)",
    date: new Date(2025, 8, 3),
    prompt: "What's ONE boundary you're committing to for sustainability?"
  },
  {
    id: "tips-daily-21",
    day: 21,
    title: "🎉 Week 3 Wins Thread",
    date: new Date(2025, 8, 4),
    prompt: "Drop your wins below!"
  },
  {
    id: "tips-daily-22",
    day: 22,
    title: "📚 Why Continuing Education Is Non-Negotiable",
    date: new Date(2025, 8, 5),
    prompt: "What's ONE way you're committing to continuing education this month?"
  },
  {
    id: "tips-daily-23",
    day: 23,
    title: "⭐ Your First Testimonial Matters More Than You Think",
    date: new Date(2025, 8, 6),
    prompt: "Have you asked for a testimonial yet? Who are you going to ask THIS WEEK?"
  },
  {
    id: "tips-daily-24",
    day: 24,
    title: "🔗 The Referral Script That Actually Works",
    date: new Date(2025, 8, 7),
    prompt: "Have you ever asked for a referral? What happened?"
  },
  {
    id: "tips-daily-25",
    day: 25,
    title: "🪞 The Truth About Comparison (It's Stealing Your Joy)",
    date: new Date(2025, 8, 8),
    prompt: "What's ONE thing you're doing BETTER than you were a month ago?"
  },
  {
    id: "tips-daily-26",
    day: 26,
    title: "📋 Professional Session Notes Template",
    date: new Date(2025, 8, 9),
    prompt: "If this template saves you stress, comment 📋 SO NEEDED!"
  },
  {
    id: "tips-daily-27",
    day: 27,
    title: "😤 How to Handle Clients Who Don't Do the Work",
    date: new Date(2025, 8, 10),
    prompt: "Have you had a client who didn't do the work? How did you handle it?"
  },
  {
    id: "tips-daily-28",
    day: 28,
    title: "🎉 Week 4 Wins Thread",
    date: new Date(2025, 8, 11),
    prompt: "Drop your wins below!"
  },
  {
    id: "tips-daily-29",
    day: 29,
    title: "🚀 You're Ready (Even If You Don't Feel Like It)",
    date: new Date(2025, 8, 12),
    prompt: "Which ONE action from the list are you committing to THIS WEEK?"
  },
  {
    id: "tips-daily-30",
    day: 30,
    title: "🎓 Celebrating Your Journey + What Comes Next",
    date: new Date(2025, 8, 13),
    prompt: "What's been your BIGGEST breakthrough over these 30 days?"
  }
];

// Read avatar URLs
const avatarCSV = fs.readFileSync('student_avatars/students-profiles-imgs.csv', 'utf-8');
const avatarUrls = avatarCSV.split('\n').slice(1).filter(l => l.startsWith('http')).map(u => u.trim());

// Shuffle function
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Comment templates for each type of post
const commentTypes = {
  fear_question: [
    { name: "Amanda", text: "THIS. 🙌", hasReply: false },
    { name: "Robert", text: "Former paramedic here. Spent 18 years being the guy who HAD to have all the answers. The mental shift to coaching is real. My fear? Complex autoimmune questions. But you're right... I have time to research. Screenshotting this.", hasReply: true, reply: "Robert, that paramedic experience is SUCH a strength - you know how to stay calm and assess. The beautiful difference here? You're supporting transformation over months, not saving lives in minutes. 🙏" },
    { name: "Lisa", text: "Crying 😭", hasReply: false },
    { name: "Karen", text: "Ok so my scary question: \"But what does my doctor think about this?\" How do you navigate that without sounding anti-medicine?", hasReply: true, reply: "Great question Karen! Try: 'We're complementing your doctor's care, not replacing it.' That framing changes everything!" },
    { name: "Patricia", text: "I'm 55. Starting completely over after divorce. Some days the imposter syndrome is so loud I can barely function.\n\nMy scary question is anything about hormones. The complexity terrifies me. But it's also exactly what I want to focus on since I've lived through menopause myself.\n\nThis post is going in my journal. Maybe I'm not supposed to know everything. Maybe my experience IS enough to start.\n\nThank you Sarah. I really needed this today.", hasReply: true, reply: "Patricia, I'm saving YOUR comment. Your lived experience with menopause is GOLD. You can look a client in the eyes and say 'I understand because I've been there.' No textbook teaches that. You're not too old - you're perfectly seasoned. 🌟" },
    { name: "Michael", text: "Needed this. Thank you.", hasReply: false },
    { name: "Emily", text: "Wait wait wait. This JUST happened to me!! First discovery call ever. She asked about a lab marker I'd never heard of. Heart pounding. Sweaty palms. I said \"That's really important - let me research it and follow up tomorrow.\"\n\nSHE SIGNED UP.\n\nShe literally said \"I appreciate that you didn't just make something up.\"\n\nSarah's advice works IRL people!!! 🎉", hasReply: true, reply: "EMILY!!! 🎉🎉🎉 THIS RIGHT HERE EVERYONE. Real proof. Honesty builds trust. So proud of you!!!" },
    { name: "Nicole", text: "Labs. That's my fear. What if I miss something? What if I misread results?", hasReply: true, reply: "Even doctors use reference ranges and consult specialists Nicole! Labs are a tool, not a test you have to ace. 💕" },
    { name: "Theresa", text: "🔥🔥🔥", hasReply: false },
    { name: "Diana", text: "\"Can you help me with [condition I've never heard of]?\"\n\nThat's my nightmare question. There are SO many rare conditions. But reading this... maybe \"I'm not familiar with that specific condition, but I'd love to learn about what you're experiencing\" is actually okay?\n\nWe support PEOPLE not conditions. Am I getting it? 😅", hasReply: true, reply: "YOU ARE 100% GETTING IT DIANA! 👏 Gold star! ⭐" }
  ],
  wins_thread: [
    { name: "Jennifer", text: "I finally posted my story on Instagram! Terrifying but I did it! 💪", hasReply: true, reply: "YESSS Jennifer!!! That's huge! So proud of you for taking that step! 🎉" },
    { name: "Marcus", text: "Had my first discovery call. She didn't sign up BUT I didn't pass out and that's a win in my book 😂", hasReply: true, reply: "Marcus that IS a win!! The first one is the hardest. It gets easier from here! 🙌" },
    { name: "Sandra", text: "Completed Module 5! One step closer!", hasReply: false },
    { name: "David", text: "I told my mom I'm a certified coach now. She cried (happy tears). Didn't expect that to feel so validating.", hasReply: true, reply: "David 😭💕 That's beautiful. Our loved ones believing in us matters so much!" },
    { name: "Rachel", text: "Set up my Calendly! Small but it's done!", hasReply: false },
    { name: "Tom", text: "Launched my pilot program yesterday... already have 2 people interested! 🤯", hasReply: true, reply: "TOM!! That's not just a win, that's a BREAKTHROUGH! Keep us posted! 🎉🎉" },
    { name: "Ashley", text: "Just showing up here every day has been my win. Thank you for this community. ❤️", hasReply: true, reply: "Ashley, consistency IS the win. You're building something. Don't underestimate that. 💕" }
  ],
  scale_rating: [
    { name: "Michelle", text: "7 today. Better than yesterday's 9 though!", hasReply: true, reply: "Progress Michelle! That downward trend is what matters! 💪" },
    { name: "James", text: "Solid 8. Who am I to do this??? 😫", hasReply: true, reply: "James - 8 just means you care deeply about doing this right. That's actually a GOOD sign. Reckless people don't have imposter syndrome. 🙏" },
    { name: "Linda", text: "3 today! I just helped someone and it felt AMAZING", hasReply: true, reply: "LINDA!! See what action does?! Keep that momentum going! 🎉" },
    { name: "Chris", text: "10. Complete 10. Imposter syndrome is LOUD today.", hasReply: true, reply: "Chris, sending you so much love. We've ALL been at 10. It passes. You belong here. 💕" },
    { name: "Amy", text: "5 - right in the middle. Some days I feel ready, some days I want to hide.", hasReply: false },
    { name: "Brian", text: "Was an 8 this morning, now reading everyone's comments... maybe a 6? This community helps.", hasReply: true, reply: "Brian, that's exactly why we do this! Lift each other up. You've got this! 🙌" }
  ],
  niche_statement: [
    { name: "Sophia", text: "I help exhausted moms with gut issues so they can have energy for their families without eliminating every food they love.", hasReply: true, reply: "Sophia this is PERFECT! Specific, relatable, clear. You're going to attract exactly the right people! 🌟" },
    { name: "Daniel", text: "I help men over 40 with declining energy so they can feel like themselves again without testosterone therapy as the first option.", hasReply: true, reply: "Daniel! Love seeing men in this space. There's such a need. Go get them! 💪" },
    { name: "Jessica", text: "I help women with PCOS navigate their diagnosis so they can feel in control of their health without being overwhelmed by conflicting advice online.", hasReply: true, reply: "Jessica YES! The overwhelm of conflicting info is SO real. You're going to be their trusted guide! ✨" },
    { name: "Mark", text: "Still working on mine... \"I help people who are tired of being tired?\" Is that too vague?", hasReply: true, reply: "Mark, it's a great start! Now get more specific - WHO exactly? What age? What's their situation? Keep refining! You're on the right track!" },
    { name: "Hannah", text: "I help burned-out nurses transition to wellness careers so they can help people heal without destroying their own health in the process.", hasReply: true, reply: "Hannah!!! As a former burned-out nurse myself, THIS HITS. You're going to change lives. 💕" }
  ],
  pricing: [
    { name: "Victoria", text: "I was thinking $50/session... now I'm rethinking everything 😳", hasReply: true, reply: "Victoria - your time, expertise, and transformation you provide is worth SO much more. Start at $150 minimum. You deserve it! 💰" },
    { name: "Nathan", text: "Planning $175/session but my stomach drops every time I think about saying it out loud", hasReply: true, reply: "Nathan, that stomach drop is normal! Practice saying it until it feels like stating a fact. \"My rate is $175.\" Say it 50 times. It works! 💪" },
    { name: "Olivia", text: "I've been doing free sessions for 3 months... this post is the kick I needed to actually charge", hasReply: true, reply: "Olivia - FREE stops TODAY. Your next client pays. Period. You've earned this! 🎉" },
    { name: "Steven", text: "Charging $200/session and clients happily pay it. The secret? I stopped apologizing for my prices.", hasReply: true, reply: "Steven dropping TRUTH! 👏 When you believe in your value, they do too. Thank you for sharing!" },
    { name: "Grace", text: "Do we include follow-up emails and check-ins in our pricing or charge extra?", hasReply: true, reply: "Grace - include basics in your package price but charge for extensive extras. You're a coach, not 24/7 support. Build it into your package structure! 📋" }
  ],
  action_commitment: [
    { name: "Rebecca", text: "I'm texting my friend Maria about her gut issues TODAY. No more waiting.", hasReply: true, reply: "Rebecca YES! Report back and let us know how it goes! You've got this! 💪" },
    { name: "Kevin", text: "Posting my story on Facebook. Just the thought makes me want to throw up. But I'm doing it.", hasReply: true, reply: "Kevin, that fear means you're growing! Can't wait to celebrate with you after you hit post! 🎉" },
    { name: "Lauren", text: "Scheduling 3 coffee chats this week with people who've asked me health questions before", hasReply: true, reply: "Lauren, smart approach! Warm leads are the easiest place to start. Go get 'em! ☕✨" },
    { name: "Ryan", text: "Updating all my social media bios to say \"Certified Health Coach\" - making it official!", hasReply: false },
    { name: "Megan", text: "Offering a pilot program to my coworker who's been asking about my weight loss journey", hasReply: true, reply: "Megan! She's already interested - that's half the battle. Perfect pilot candidate! 🌟" }
  ],
  gratitude: [
    { name: "Heather", text: "🙏 THANK YOU! These templates just saved me hours of staring at a blank screen!", hasReply: true, reply: "You're so welcome Heather! Now go use them! 💕" },
    { name: "Jason", text: "📋 SO NEEDED! Already customizing these for my first client next week!", hasReply: true, reply: "Jason that's AMAZING! You're going to look so professional! 🎉" },
    { name: "Brittany", text: "🔥 GAME CHANGER! Practiced these responses out loud and I actually feel confident now", hasReply: true, reply: "Brittany! That's exactly how you do it - practice until it's second nature! So proud! 💪" },
    { name: "Tyler", text: "Thank you Sarah for putting all this together. The value here is insane.", hasReply: true, reply: "Tyler, you're so welcome. Seeing you all succeed is why I do this! 🙏💕" }
  ]
};

// Function to generate comments for a specific post type
function generateCommentsForPost(postData, index) {
  const shuffledAvatars = shuffle(avatarUrls);
  let templateType;

  // Determine comment type based on post content
  if (postData.prompt.includes("scale") || postData.prompt.includes("1-10")) {
    templateType = "scale_rating";
  } else if (postData.prompt.includes("wins") || postData.title.includes("Wins")) {
    templateType = "wins_thread";
  } else if (postData.prompt.includes("I help") || postData.prompt.includes("blank")) {
    templateType = "niche_statement";
  } else if (postData.prompt.includes("charging") || postData.prompt.includes("price")) {
    templateType = "pricing";
  } else if (postData.prompt.includes("committing") || postData.prompt.includes("THIS WEEK") || postData.prompt.includes("action")) {
    templateType = "action_commitment";
  } else if (postData.prompt.includes("THANK YOU") || postData.prompt.includes("NEEDED") || postData.prompt.includes("GAME CHANGER")) {
    templateType = "gratitude";
  } else {
    templateType = "fear_question";
  }

  const templates = commentTypes[templateType] || commentTypes.fear_question;
  const numComments = 40 + Math.floor(Math.random() * 61); // 40-100 comments
  const comments = [];

  for (let i = 0; i < Math.min(numComments, templates.length); i++) {
    const template = templates[i % templates.length];
    const avatar = shuffledAvatars[i % shuffledAvatars.length];
    const dayOffset = Math.floor(Math.random() * 7);

    const comment = {
      id: `${postData.id}-comment-${i + 1}`,
      author: {
        name: template.name + " " + String.fromCharCode(65 + (i % 26)) + ".",
        avatar: avatar,
        role: "student"
      },
      content: template.text,
      createdAt: `new Date(2025, ${postData.date.getMonth()}, ${postData.date.getDate() + dayOffset})`,
      likes: Math.floor(Math.random() * 100) + 10,
      replies: []
    };

    if (template.hasReply) {
      comment.replies = [{
        id: `${postData.id}-reply-${i + 1}`,
        author: {
          name: "Sarah M.",
          avatar: "/coaches/sarah-coach.webp",
          role: "instructor"
        },
        content: template.reply,
        createdAt: `new Date(2025, ${postData.date.getMonth()}, ${postData.date.getDate() + dayOffset + 1})`,
        likes: Math.floor(Math.random() * 30) + 5
      }];
    }

    comments.push(comment);
  }

  return comments;
}

// Generate the exports
let output = `// Auto-generated community comments - DO NOT EDIT MANUALLY

export const INTRODUCTION_COMMENTS = [
  {
    id: "intro-1",
    author: {
      name: "Michelle Torres",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2257.jpeg",
      role: "student" as const,
    },
    content: \`Hi everyone! I'm Michelle from San Diego, California. I spent 15 years as an ER nurse and honestly, I'm completely burned out on the traditional healthcare system. That's what drew me to Functional Medicine - I want to actually HELP people heal!\`,
    createdAt: new Date(2025, 7, 16),
    likes: 24,
    replies: [{
      id: "sarah-reply-1",
      author: {
        name: "Sarah M.",
        avatar: "/coaches/sarah-coach.webp",
        role: "instructor" as const,
      },
      content: "Welcome Michelle! Your nursing background is such a gift to this work! 💕",
      createdAt: new Date(2025, 7, 16),
      likes: 8,
    }],
  },
];

`;

// Generate TIPS_COMMENTS for post 1 (keeping existing structure)
output += `export const TIPS_COMMENTS = [
  {
    id: "tips-1",
    author: {
      name: "Amanda Richards",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_1894.jpeg",
      role: "student" as const,
    },
    content: \`THIS. 🙌\`,
    createdAt: new Date(2025, 7, 15),
    likes: 29,
    replies: [],
  },
  {
    id: "tips-2",
    author: {
      name: "Robert Martinez",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_0931.jpeg",
      role: "student" as const,
    },
    content: \`Former paramedic here. Spent 18 years being the guy who HAD to have all the answers in life-or-death situations. The mental shift to coaching is real - I keep thinking I need that same level of instant expertise. My fear? Complex autoimmune questions. But you're right... this isn't the ER. I have time to research. Screenshotting this.\`,
    createdAt: new Date(2025, 7, 15),
    likes: 52,
    replies: [{
      id: "sarah-tips-2",
      author: {
        name: "Sarah M.",
        avatar: "/coaches/sarah-coach.webp",
        role: "instructor" as const,
      },
      content: "Robert, that paramedic experience is SUCH a strength - you know how to stay calm and assess. The beautiful difference here? You're supporting transformation over months, not saving lives in minutes. 🙏",
      createdAt: new Date(2025, 7, 15),
      likes: 21,
    }],
  },
  {
    id: "tips-3",
    author: {
      name: "Lisa Thompson",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_5742.jpeg",
      role: "student" as const,
    },
    content: \`Crying 😭\`,
    createdAt: new Date(2025, 7, 15),
    likes: 18,
    replies: [],
  },
  {
    id: "tips-4",
    author: {
      name: "Karen Mitchell",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_6345-1.jpeg",
      role: "student" as const,
    },
    content: \`Ok so my scary question: "But what does my doctor think about this?" How do you navigate that without sounding anti-medicine? I believe in integrative approaches but saying it confidently is hard!\`,
    createdAt: new Date(2025, 7, 16),
    likes: 38,
    replies: [{
      id: "sarah-tips-4",
      author: {
        name: "Sarah M.",
        avatar: "/coaches/sarah-coach.webp",
        role: "instructor" as const,
      },
      content: "Great question Karen! Try: 'We're complementing your doctor's care, not replacing it.' That framing changes everything!",
      createdAt: new Date(2025, 7, 16),
      likes: 15,
    }],
  },
  {
    id: "tips-5",
    author: {
      name: "Patricia Adams",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_3179.jpeg",
      role: "student" as const,
    },
    content: \`I'm 55. Starting completely over after divorce. Some days the imposter syndrome is so loud I can barely function. "Who do you think you are? You're too old. You don't know enough."

My scary question is anything about hormones. The complexity terrifies me. But it's also exactly what I want to focus on since I've lived through menopause myself and know how isolating it feels when doctors dismiss you.

This post is going in my journal. Maybe I'm not supposed to know everything. Maybe my experience IS enough to start. Maybe being honest about what I don't know is actually a strength.

Thank you Sarah. I really needed this today.\`,
    createdAt: new Date(2025, 7, 16),
    likes: 124,
    replies: [{
      id: "sarah-tips-5",
      author: {
        name: "Sarah M.",
        avatar: "/coaches/sarah-coach.webp",
        role: "instructor" as const,
      },
      content: "Patricia, I'm saving YOUR comment. Your lived experience with menopause is GOLD. You can look a client in the eyes and say 'I understand because I've been there.' No textbook teaches that. You're not too old - you're perfectly seasoned. 🌟",
      createdAt: new Date(2025, 7, 16),
      likes: 48,
    }],
  },
  {
    id: "tips-6",
    author: {
      name: "Michael Foster",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/11/Bear-Trap-Gap-MP-428-robert-Stevens-web.jpg",
      role: "student" as const,
    },
    content: \`Needed this. Thank you.\`,
    createdAt: new Date(2025, 7, 17),
    likes: 14,
    replies: [],
  },
  {
    id: "tips-7",
    author: {
      name: "Emily Harrison",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_1830.jpeg",
      role: "student" as const,
    },
    content: \`Wait wait wait. This JUST happened to me!! First discovery call ever. She asked about a lab marker I'd never heard of. Heart pounding. Sweaty palms. I said "That's really important - let me research it and follow up tomorrow with accurate info."

SHE SIGNED UP.

She literally said "I appreciate that you didn't just make something up."

Sarah's advice works IRL people!!! 🎉\`,
    createdAt: new Date(2025, 7, 18),
    likes: 167,
    replies: [{
      id: "sarah-tips-7",
      author: {
        name: "Sarah M.",
        avatar: "/coaches/sarah-coach.webp",
        role: "instructor" as const,
      },
      content: "EMILY!!! 🎉🎉🎉 THIS RIGHT HERE EVERYONE. Real proof. Honesty builds trust. So proud of you!!!",
      createdAt: new Date(2025, 7, 18),
      likes: 31,
    }],
  },
  {
    id: "tips-8",
    author: {
      name: "Nicole Brooks",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_7797.jpeg",
      role: "student" as const,
    },
    content: \`Labs. That's my fear. What if I miss something? What if I misread results? I keep telling myself "just one more course on labs" before I can start...\`,
    createdAt: new Date(2025, 7, 19),
    likes: 44,
    replies: [{
      id: "sarah-tips-8",
      author: {
        name: "Sarah M.",
        avatar: "/coaches/sarah-coach.webp",
        role: "instructor" as const,
      },
      content: "Even doctors use reference ranges and consult specialists Nicole! Labs are a tool, not a test you have to ace. Start with the basics you DO know. 💕",
      createdAt: new Date(2025, 7, 19),
      likes: 16,
    }],
  },
  {
    id: "tips-9",
    author: {
      name: "Theresa Washington",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_4540.jpeg",
      role: "student" as const,
    },
    content: \`🔥🔥🔥\`,
    createdAt: new Date(2025, 7, 20),
    likes: 23,
    replies: [],
  },
  {
    id: "tips-10",
    author: {
      name: "Diana Morales",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/09/IMG_8681.jpeg",
      role: "student" as const,
    },
    content: \`"Can you help me with [condition I've never heard of]?"

That's my nightmare question. There are SO many rare conditions. But reading this... maybe "I'm not familiar with that specific condition, but I'd love to learn about what you're experiencing" is actually okay?

We support PEOPLE not conditions. The condition is context. Am I getting it? 😅\`,
    createdAt: new Date(2025, 7, 21),
    likes: 67,
    replies: [{
      id: "sarah-tips-10",
      author: {
        name: "Sarah M.",
        avatar: "/coaches/sarah-coach.webp",
        role: "instructor" as const,
      },
      content: "YOU ARE 100% GETTING IT DIANA! 👏 We support PEOPLE, not conditions. The condition is just context. Your willingness to learn alongside them is what makes you a great practitioner. Gold star! ⭐",
      createdAt: new Date(2025, 7, 21),
      likes: 25,
    }],
  },
];

// Tips posts metadata for all 30 posts
export const TIPS_POSTS_DATA = ${JSON.stringify(tipsPostsData.map(p => ({
  ...p,
  date: `new Date(2025, ${p.date.getMonth()}, ${p.date.getDate()})`
})), null, 2).replace(/"new Date\(([^)]+)\)"/g, 'new Date($1)')};

export function getSampleComments(postId: string, category?: string) {
  if (postId === 'pinned-introductions') {
    return INTRODUCTION_COMMENTS;
  }
  if (postId.startsWith('tips-daily-')) {
    return TIPS_COMMENTS;
  }
  return [];
}

export function getTipsPostData(postId: string) {
  return TIPS_POSTS_DATA.find(p => p.id === postId);
}
`;

fs.writeFileSync('/Users/pochitino/Desktop/accredipro-lms/src/components/community/post-detail-data.ts', output);
console.log('Generated post-detail-data.ts with 30 tips posts metadata');
