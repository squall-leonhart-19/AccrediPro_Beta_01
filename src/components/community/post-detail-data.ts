// Community comments data

// Import refined comments from JSON (247 buyer persona comments)
import refinedCommentsData from '../../../refined_comments.json';

// Type for the refined comments structure
const refinedComments = refinedCommentsData as Record<string, any[]>;

export const INTRODUCTION_COMMENTS = [
  {
    id: "intro-1",
    author: {
      name: "Michelle Torres",
      avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2257.jpeg",
      role: "student" as const,
    },
    content: `Hi everyone! I'm Michelle from San Diego, California. I spent 15 years as an ER nurse and honestly, I'm completely burned out on the traditional healthcare system. That's what drew me to Functional Medicine - I want to actually HELP people heal!`,
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

// 75 unique humanized comments for Tips Post 1: "You Don't Need to Know Everything"
// Responding to: "What's the ONE question you're most afraid a client will ask you?"
export function getTipsPost1Comments() {
  return [
    {
      id: "t1-1",
      author: { name: "Amanda Richards", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_1894.jpeg", role: "student" as const },
      content: `THIS. 🙌`,
      createdAt: new Date(2025, 7, 15),
      likes: 34,
      replies: [],
    },
    {
      id: "t1-2",
      author: { name: "Robert Martinez", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_0931.jpeg", role: "student" as const },
      content: `Former paramedic here. Spent 18 years being the guy who HAD to have all the answers in life-or-death situations. The mental shift to coaching is real - I keep thinking I need that same level of instant expertise. My fear? Complex autoimmune questions. But you're right... this isn't the ER. I have time to research. Screenshotting this.`,
      createdAt: new Date(2025, 7, 15),
      likes: 87,
      replies: [{
        id: "t1-2r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Robert, that paramedic experience is SUCH a strength - you know how to stay calm and assess. The beautiful difference here? You're supporting transformation over months, not saving lives in minutes. 🙏",
        createdAt: new Date(2025, 7, 15),
        likes: 31,
      }],
    },
    {
      id: "t1-3",
      author: { name: "Lisa Thompson", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_5742.jpeg", role: "student" as const },
      content: `Crying 😭`,
      createdAt: new Date(2025, 7, 15),
      likes: 19,
      replies: [],
    },
    {
      id: "t1-4",
      author: { name: "Karen Mitchell", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_6345-1.jpeg", role: "student" as const },
      content: `Ok so my scary question: "But what does my doctor think about this?" How do you navigate that without sounding anti-medicine?`,
      createdAt: new Date(2025, 7, 15),
      likes: 56,
      replies: [{
        id: "t1-4r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Great question Karen! Try: 'We're complementing your doctor's care, not replacing it.' That framing changes everything!",
        createdAt: new Date(2025, 7, 15),
        likes: 24,
      }],
    },
    {
      id: "t1-5",
      author: { name: "Patricia Adams", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_3179.jpeg", role: "student" as const },
      content: `I'm 55. Starting completely over after divorce. Some days the imposter syndrome is so loud I can barely function. "Who do you think you are? You're too old. You don't know enough."

My scary question is anything about hormones. The complexity terrifies me. But it's also exactly what I want to focus on since I've lived through menopause myself and know how isolating it feels when doctors dismiss you.

This post is going in my journal. Maybe I'm not supposed to know everything. Maybe my experience IS enough to start. Maybe being honest about what I don't know is actually a strength.

Thank you Sarah. I really needed this today.`,
      createdAt: new Date(2025, 7, 15),
      likes: 156,
      replies: [{
        id: "t1-5r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Patricia, I'm saving YOUR comment. Your lived experience with menopause is GOLD. You can look a client in the eyes and say 'I understand because I've been there.' No textbook teaches that. You're not too old - you're perfectly seasoned. 🌟",
        createdAt: new Date(2025, 7, 15),
        likes: 67,
      }],
    },
    {
      id: "t1-6",
      author: { name: "Michael Foster", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/Bear-Trap-Gap-MP-428-robert-Stevens-web.jpg", role: "student" as const },
      content: `Needed this. Thank you.`,
      createdAt: new Date(2025, 7, 15),
      likes: 12,
      replies: [],
    },
    {
      id: "t1-7",
      author: { name: "Emily Harrison", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_1830.jpeg", role: "student" as const },
      content: `Wait wait wait. This JUST happened to me!! First discovery call ever. She asked about a lab marker I'd never heard of. Heart pounding. Sweaty palms. I said "That's really important - let me research it and follow up tomorrow with accurate info."

SHE SIGNED UP.

She literally said "I appreciate that you didn't just make something up."

Sarah's advice works IRL people!!! 🎉`,
      createdAt: new Date(2025, 7, 15),
      likes: 203,
      replies: [{
        id: "t1-7r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "EMILY!!! 🎉🎉🎉 THIS RIGHT HERE EVERYONE. Real proof. Honesty builds trust. So proud of you!!!",
        createdAt: new Date(2025, 7, 15),
        likes: 45,
      }],
    },
    {
      id: "t1-8",
      author: { name: "Nicole Brooks", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_7797.jpeg", role: "student" as const },
      content: `Labs. That's my fear. What if I miss something important? What if I misread results?`,
      createdAt: new Date(2025, 7, 15),
      likes: 41,
      replies: [{
        id: "t1-8r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Even doctors use reference ranges and consult specialists Nicole! Labs are a tool, not a test you have to ace. 💕",
        createdAt: new Date(2025, 7, 15),
        likes: 18,
      }],
    },
    {
      id: "t1-9",
      author: { name: "Theresa Washington", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_4540.jpeg", role: "student" as const },
      content: `🔥🔥🔥`,
      createdAt: new Date(2025, 7, 15),
      likes: 15,
      replies: [],
    },
    {
      id: "t1-10",
      author: { name: "Diana Morales", avatar: "https://accredipro.academy/wp-content/uploads/2025/09/IMG_8681.jpeg", role: "student" as const },
      content: `"Can you help me with [condition I've never heard of]?"

That's my nightmare question. There are SO many rare conditions. But reading this... maybe "I'm not familiar with that specific condition, but I'd love to learn about what you're experiencing" is actually okay?

We support PEOPLE not conditions. Am I getting it? 😅`,
      createdAt: new Date(2025, 7, 15),
      likes: 78,
      replies: [{
        id: "t1-10r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "YOU ARE 100% GETTING IT DIANA! 👏 Gold star! ⭐",
        createdAt: new Date(2025, 7, 15),
        likes: 29,
      }],
    },
    {
      id: "t1-11",
      author: { name: "Jennifer Collins", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_6678.jpeg", role: "student" as const },
      content: `My scary question: "What supplements should I take?" There are SO MANY and they all interact differently. I feel like I'd need a pharmacology degree!`,
      createdAt: new Date(2025, 7, 15),
      likes: 52,
      replies: [{
        id: "t1-11r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Jennifer, this is why we focus on FOOD FIRST and basics. You don't need to know every supplement - start with the foundational ones and build from there!",
        createdAt: new Date(2025, 7, 15),
        likes: 21,
      }],
    },
    {
      id: "t1-12",
      author: { name: "David Chen", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_2341.jpeg", role: "student" as const },
      content: `Reading this while procrastinating launching my practice because I "need to study more." Called out. 😬`,
      createdAt: new Date(2025, 7, 15),
      likes: 89,
      replies: [{
        id: "t1-12r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "David! Close this comment and go reach out to ONE potential client today. Just one! You've got this! 💪",
        createdAt: new Date(2025, 7, 15),
        likes: 34,
      }],
    },
    {
      id: "t1-13",
      author: { name: "Maria Santos", avatar: "https://accredipro.academy/wp-content/uploads/2025/09/IMG_5523.jpeg", role: "student" as const },
      content: `Perfect timing`,
      createdAt: new Date(2025, 7, 15),
      likes: 8,
      replies: [],
    },
    {
      id: "t1-14",
      author: { name: "Stephanie Brown", avatar: "https://accredipro.academy/wp-content/uploads/2025/09/IMG_7812.jpeg", role: "student" as const },
      content: `I'm afraid they'll ask "how long until I feel better?" and then I won't be able to give them a straight answer because everyone's different and healing isn't linear and what if they get frustrated and quit before seeing results???

Sorry that was a lot lol. This post really got me thinking.`,
      createdAt: new Date(2025, 7, 15),
      likes: 67,
      replies: [{
        id: "t1-14r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Stephanie - that's actually a GREAT question to be asked because it lets you set realistic expectations upfront. 'Healing takes time and looks different for everyone. Here's what we typically see...' Honesty builds trust!",
        createdAt: new Date(2025, 7, 15),
        likes: 28,
      }],
    },
    {
      id: "t1-15",
      author: { name: "Rachel Kim", avatar: "https://accredipro.academy/wp-content/uploads/2025/08/IMG_9934.jpeg", role: "student" as const },
      content: `Bookmarked. Printing. Framing. Putting on my wall. 📌`,
      createdAt: new Date(2025, 7, 15),
      likes: 31,
      replies: [],
    },
    {
      id: "t1-16",
      author: { name: "Angela Wright", avatar: "https://accredipro.academy/wp-content/uploads/2025/08/IMG_4456.jpeg", role: "student" as const },
      content: `"Why should I work with you instead of going to a doctor?"

That question haunts me. Like how do I explain the value of what we do without sounding like I'm bashing conventional medicine?`,
      createdAt: new Date(2025, 7, 16),
      likes: 73,
      replies: [{
        id: "t1-16r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Angela! 'I work WITH your medical team, not against them. Doctors have 15 minutes - I have the time to dive deep into lifestyle, nutrition, and root causes.' That's your answer! 💕",
        createdAt: new Date(2025, 7, 16),
        likes: 35,
      }],
    },
    {
      id: "t1-17",
      author: { name: "Tina Jackson", avatar: "https://accredipro.academy/wp-content/uploads/2025/08/IMG_3321.jpeg", role: "student" as const },
      content: `Just wow. I've been certified for 4 months and haven't taken a single client because of this exact fear. Today that changes.`,
      createdAt: new Date(2025, 7, 16),
      likes: 112,
      replies: [{
        id: "t1-17r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "TINA!! Come back and tell us when you sign your first client! We're all rooting for you! 🎉",
        createdAt: new Date(2025, 7, 16),
        likes: 42,
      }],
    },
    {
      id: "t1-18",
      author: { name: "Laura Peterson", avatar: "https://accredipro.academy/wp-content/uploads/2025/08/IMG_2267.jpeg", role: "student" as const },
      content: `YES`,
      createdAt: new Date(2025, 7, 16),
      likes: 7,
      replies: [],
    },
    {
      id: "t1-19",
      author: { name: "Christina Lee", avatar: "https://accredipro.academy/wp-content/uploads/2025/07/IMG_8876.jpeg", role: "student" as const },
      content: `My fear is medication interactions. What if they're on a bunch of meds and I suggest something that interacts badly? That keeps me up at night.`,
      createdAt: new Date(2025, 7, 16),
      likes: 64,
      replies: [{
        id: "t1-19r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Christina - this is exactly why we say 'check with your doctor before adding supplements.' And there are great interaction checkers online! You're being responsible, not inadequate.",
        createdAt: new Date(2025, 7, 16),
        likes: 27,
      }],
    },
    {
      id: "t1-20",
      author: { name: "Samantha Green", avatar: "https://accredipro.academy/wp-content/uploads/2025/07/IMG_5543.jpeg", role: "student" as const },
      content: `I literally saved this post, read it 3 times, cried a little, and then immediately messaged a friend who's been asking about my services. She wants to book a call.

This community is EVERYTHING.`,
      createdAt: new Date(2025, 7, 16),
      likes: 134,
      replies: [{
        id: "t1-20r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "SAMANTHA!!! This is what ACTION looks like! So proud of you! Keep us posted! 💪🎉",
        createdAt: new Date(2025, 7, 16),
        likes: 51,
      }],
    },
    {
      id: "t1-21",
      author: { name: "Michelle Taylor", avatar: "https://accredipro.academy/wp-content/uploads/2025/07/IMG_4432.jpeg", role: "student" as const },
      content: `❤️❤️❤️`,
      createdAt: new Date(2025, 7, 16),
      likes: 11,
      replies: [],
    },
    {
      id: "t1-22",
      author: { name: "James Wilson", avatar: "https://accredipro.academy/wp-content/uploads/2025/06/IMG_9987.jpeg", role: "student" as const },
      content: `As a guy in this space, I sometimes feel extra pressure to "know everything" because there's this assumption men should be experts. Really needed to hear that it's okay to say "let me look into that."`,
      createdAt: new Date(2025, 7, 16),
      likes: 58,
      replies: [{
        id: "t1-22r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "James, thank you for sharing this! That pressure is real. Vulnerability and honesty are STRENGTHS, not weaknesses - regardless of gender. You're going to be an amazing coach!",
        createdAt: new Date(2025, 7, 16),
        likes: 23,
      }],
    },
    {
      id: "t1-23",
      author: { name: "Dorothy Miller", avatar: "https://accredipro.academy/wp-content/uploads/2025/06/IMG_6654.jpeg", role: "student" as const },
      content: `67 years old here. Was a nurse for 40 years. Still feel like I don't know enough some days. This post reminded me that the desire to keep learning IS the qualification. Thank you Sarah.`,
      createdAt: new Date(2025, 7, 16),
      likes: 189,
      replies: [{
        id: "t1-23r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Dorothy - 40 YEARS of nursing wisdom! You have so much to offer. Your humility after all that experience? That's what makes a great practitioner. We're honored to have you here! 🙏💕",
        createdAt: new Date(2025, 7, 16),
        likes: 78,
      }],
    },
    {
      id: "t1-24",
      author: { name: "Susan Anderson", avatar: "https://accredipro.academy/wp-content/uploads/2025/06/IMG_3321.jpeg", role: "student" as const },
      content: `Sending this to my friend who keeps saying she's "not ready yet." Been saying that for 2 years.`,
      createdAt: new Date(2025, 7, 16),
      likes: 45,
      replies: [],
    },
    {
      id: "t1-25",
      author: { name: "Brittany Moore", avatar: "https://accredipro.academy/wp-content/uploads/2025/05/IMG_8865.jpeg", role: "student" as const },
      content: `The question I dread: "Is this program evidence-based?"

I know functional medicine has tons of research backing it but articulating that on the spot makes me freeze.`,
      createdAt: new Date(2025, 7, 16),
      likes: 49,
      replies: [{
        id: "t1-25r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Brittany - 'Yes! Functional medicine is grounded in peer-reviewed research about nutrition, lifestyle, and root cause approaches. I can share some resources if you'd like!' Have a few studies bookmarked. You've got this!",
        createdAt: new Date(2025, 7, 16),
        likes: 19,
      }],
    },
    {
      id: "t1-26",
      author: { name: "Kimberly Davis", avatar: "https://accredipro.academy/wp-content/uploads/2025/05/IMG_5543.jpeg", role: "student" as const },
      content: `Literally crying in my car reading this before a discovery call. I CAN DO THIS.`,
      createdAt: new Date(2025, 7, 16),
      likes: 97,
      replies: [{
        id: "t1-26r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Kimberly - YOU CAN!! Deep breath. You've got this. Come back and tell us how it went! 💪❤️",
        createdAt: new Date(2025, 7, 16),
        likes: 38,
      }],
    },
    {
      id: "t1-27",
      author: { name: "Nancy White", avatar: "https://accredipro.academy/wp-content/uploads/2025/04/IMG_2234.jpeg", role: "student" as const },
      content: `Facts 💯`,
      createdAt: new Date(2025, 7, 16),
      likes: 14,
      replies: [],
    },
    {
      id: "t1-28",
      author: { name: "Heather Thomas", avatar: "https://accredipro.academy/wp-content/uploads/2025/04/IMG_9912.jpeg", role: "student" as const },
      content: `My biggest fear is "What if this doesn't work for me?"

Because I've seen functional approaches work miracles but what if THEIR case is the exception? What if I can't help them?`,
      createdAt: new Date(2025, 7, 16),
      likes: 61,
      replies: [{
        id: "t1-28r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Heather - honesty works here too! 'Every person is unique and I can't guarantee specific results, but I CAN promise to support you fully and adjust our approach as needed.' You're not responsible for healing them - you're walking alongside them!",
        createdAt: new Date(2025, 7, 16),
        likes: 26,
      }],
    },
    {
      id: "t1-29",
      author: { name: "Amy Robinson", avatar: "https://accredipro.academy/wp-content/uploads/2025/03/IMG_6678.jpeg", role: "student" as const },
      content: `This post should be pinned forever. Like at the top of the community forever. Can we make that happen? 😂`,
      createdAt: new Date(2025, 7, 17),
      likes: 76,
      replies: [{
        id: "t1-29r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Amy 😂 I'll keep sharing these reminders because we ALL need them! Even me sometimes!",
        createdAt: new Date(2025, 7, 17),
        likes: 32,
      }],
    },
    {
      id: "t1-30",
      author: { name: "Jessica Clark", avatar: "https://accredipro.academy/wp-content/uploads/2025/03/IMG_4456.jpeg", role: "student" as const },
      content: `🙌🙌🙌`,
      createdAt: new Date(2025, 7, 17),
      likes: 9,
      replies: [],
    },
    {
      id: "t1-31",
      author: { name: "Megan Lewis", avatar: "https://accredipro.academy/wp-content/uploads/2025/02/IMG_3321.jpeg", role: "student" as const },
      content: `I've been lurking in this community for months. First time commenting. This post finally made me feel like maybe I CAN do this.`,
      createdAt: new Date(2025, 7, 17),
      likes: 83,
      replies: [{
        id: "t1-31r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Megan!! Welcome out of lurking! 👋 You absolutely CAN do this. We're so glad you're here!",
        createdAt: new Date(2025, 7, 17),
        likes: 29,
      }],
    },
    {
      id: "t1-32",
      author: { name: "Danielle Hall", avatar: "https://accredipro.academy/wp-content/uploads/2025/02/IMG_8876.jpeg", role: "student" as const },
      content: `My scary question: anything about kids. I don't have children and don't know much about pediatric health. What if a mom asks me about her kid's symptoms?`,
      createdAt: new Date(2025, 7, 17),
      likes: 37,
      replies: [{
        id: "t1-32r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Danielle - perfect time to refer! 'Pediatric health isn't my specialty, but I can connect you with someone who focuses on that.' Knowing your limits IS expertise!",
        createdAt: new Date(2025, 7, 17),
        likes: 16,
      }],
    },
    {
      id: "t1-33",
      author: { name: "Katherine Young", avatar: "https://accredipro.academy/wp-content/uploads/2025/01/IMG_5543.jpeg", role: "student" as const },
      content: `Currently have 47 browser tabs open trying to learn "everything" before taking my first client. Closing them now. Going to reach out to someone today. Thank you for the permission slip.`,
      createdAt: new Date(2025, 7, 17),
      likes: 145,
      replies: [{
        id: "t1-33r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "KATHERINE! 47 tabs closed = 1 action taken! THAT'S the energy! Go get it! 🎉💪",
        createdAt: new Date(2025, 7, 17),
        likes: 54,
      }],
    },
    {
      id: "t1-34",
      author: { name: "Olivia King", avatar: "https://accredipro.academy/wp-content/uploads/2025/01/IMG_2267.jpeg", role: "student" as const },
      content: `Exactly what I needed today`,
      createdAt: new Date(2025, 7, 17),
      likes: 13,
      replies: [],
    },
    {
      id: "t1-35",
      author: { name: "Victoria Scott", avatar: "https://accredipro.academy/wp-content/uploads/2024/12/IMG_9934.jpeg", role: "student" as const },
      content: `The question I fear: "Can you cure my [serious disease]?"

Because no, I can't cure anything. I can support. I can educate. I can empower. But "cure"? That word scares me.`,
      createdAt: new Date(2025, 7, 17),
      likes: 58,
      replies: [{
        id: "t1-35r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Victoria - you're absolutely right and that's important! 'I don't cure anything - your body does the healing. My role is to support your body's natural ability to heal.' That's honest AND empowering!",
        createdAt: new Date(2025, 7, 17),
        likes: 25,
      }],
    },
    {
      id: "t1-36",
      author: { name: "Hannah Adams", avatar: "https://accredipro.academy/wp-content/uploads/2024/12/IMG_6654.jpeg", role: "student" as const },
      content: `Coming back to say I had my first client call after reading this. I DID say "I don't know, let me research that" TWICE. She thanked me for being honest. I'm shaking. In a good way.`,
      createdAt: new Date(2025, 7, 18),
      likes: 234,
      replies: [{
        id: "t1-36r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "HANNAH!!!! 🎉🎉🎉🎉 THIS IS EVERYTHING!!! Twice!! And she appreciated it!! THIS is what we're talking about! SO SO SO proud of you!!! 💕💪",
        createdAt: new Date(2025, 7, 18),
        likes: 89,
      }],
    },
    {
      id: "t1-37",
      author: { name: "Elizabeth Baker", avatar: "https://accredipro.academy/wp-content/uploads/2024/11/IMG_3321.jpeg", role: "student" as const },
      content: `Screenshotted. Saved. Will read daily. 📱`,
      createdAt: new Date(2025, 7, 18),
      likes: 21,
      replies: [],
    },
    {
      id: "t1-38",
      author: { name: "Sarah Johnson", avatar: "https://accredipro.academy/wp-content/uploads/2024/11/IMG_8865.jpeg", role: "student" as const },
      content: `I'm scared of: "My friend tried functional medicine and it didn't work for her. Why would it work for me?"

How do you handle skeptics without getting defensive?`,
      createdAt: new Date(2025, 7, 18),
      likes: 44,
      replies: [{
        id: "t1-38r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Great question Sarah! 'Every person's journey is different. I'd love to understand what her experience was like and what might be different for you.' Curiosity, not defensiveness!",
        createdAt: new Date(2025, 7, 18),
        likes: 18,
      }],
    },
    {
      id: "t1-39",
      author: { name: "Cynthia Nelson", avatar: "https://accredipro.academy/wp-content/uploads/2024/10/IMG_5543.jpeg", role: "student" as const },
      content: `This hit different today. Really different.`,
      createdAt: new Date(2025, 7, 18),
      likes: 27,
      replies: [],
    },
    {
      id: "t1-40",
      author: { name: "Deborah Carter", avatar: "https://accredipro.academy/wp-content/uploads/2024/10/IMG_2234.jpeg", role: "student" as const },
      content: `My fear: "How much do you charge?" Because then I have to actually say a number out loud and not immediately apologize for it.`,
      createdAt: new Date(2025, 7, 18),
      likes: 96,
      replies: [{
        id: "t1-40r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Deborah - we're covering pricing this week! But spoiler: state your price, then STOP TALKING. No apologizing, no justifying. Just breathe. 💰",
        createdAt: new Date(2025, 7, 18),
        likes: 41,
      }],
    },
    {
      id: "t1-41",
      author: { name: "Rebecca Phillips", avatar: "https://accredipro.academy/wp-content/uploads/2024/09/IMG_9912.jpeg", role: "student" as const },
      content: `Truth bomb 💣`,
      createdAt: new Date(2025, 7, 18),
      likes: 16,
      replies: [],
    },
    {
      id: "t1-42",
      author: { name: "Sharon Evans", avatar: "https://accredipro.academy/wp-content/uploads/2024/09/IMG_6678.jpeg", role: "student" as const },
      content: `I'm a dietitian transitioning into FM coaching and I STILL feel like I don't know enough. Imposter syndrome doesn't care about your credentials apparently!

This post is medicine for my soul today.`,
      createdAt: new Date(2025, 7, 18),
      likes: 71,
      replies: [{
        id: "t1-42r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Sharon - a DIETITIAN feeling imposter syndrome! See everyone? It doesn't discriminate! Your background is incredible. Trust it! 💕",
        createdAt: new Date(2025, 7, 18),
        likes: 30,
      }],
    },
    {
      id: "t1-43",
      author: { name: "Carolyn Turner", avatar: "https://accredipro.academy/wp-content/uploads/2024/08/IMG_4456.jpeg", role: "student" as const },
      content: `Following! 👀`,
      createdAt: new Date(2025, 7, 18),
      likes: 8,
      replies: [],
    },
    {
      id: "t1-44",
      author: { name: "Janet Roberts", avatar: "https://accredipro.academy/wp-content/uploads/2024/08/IMG_3321.jpeg", role: "student" as const },
      content: `The question haunting me: "What qualifications do you have?"

I know our cert is legit but I still feel like I need a PhD to be taken seriously.`,
      createdAt: new Date(2025, 7, 19),
      likes: 53,
      replies: [{
        id: "t1-44r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Janet - your certification IS legitimate! But more importantly, your results speak. 'I'm a certified functional medicine coach, and more importantly, I've helped X people achieve Y.' Lead with impact!",
        createdAt: new Date(2025, 7, 19),
        likes: 22,
      }],
    },
    {
      id: "t1-45",
      author: { name: "Gloria Cooper", avatar: "https://accredipro.academy/wp-content/uploads/2024/07/IMG_8876.jpeg", role: "student" as const },
      content: `60 years old, just certified, terrified. This post is now my screensaver. Thank you Sarah.`,
      createdAt: new Date(2025, 7, 19),
      likes: 127,
      replies: [{
        id: "t1-45r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Gloria - 60 years of LIFE WISDOM! Your clients are going to be so lucky. Age is your superpower! 🌟💕",
        createdAt: new Date(2025, 7, 19),
        likes: 52,
      }],
    },
    {
      id: "t1-46",
      author: { name: "Julie Reed", avatar: "https://accredipro.academy/wp-content/uploads/2024/07/IMG_5543.jpeg", role: "student" as const },
      content: `Amen! 🙏`,
      createdAt: new Date(2025, 7, 19),
      likes: 11,
      replies: [],
    },
    {
      id: "t1-47",
      author: { name: "Donna Morgan", avatar: "https://accredipro.academy/wp-content/uploads/2024/06/IMG_2267.jpeg", role: "student" as const },
      content: `Reading these comments is almost as valuable as the post itself. We're all struggling with the same fears. We're not alone. This community is magic.`,
      createdAt: new Date(2025, 7, 19),
      likes: 104,
      replies: [{
        id: "t1-47r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Donna - YES! That's exactly why we do these daily posts. You are NOT alone. We all struggle. We all learn. We all grow together! 💕",
        createdAt: new Date(2025, 7, 19),
        likes: 43,
      }],
    },
    {
      id: "t1-48",
      author: { name: "Judith Bell", avatar: "https://accredipro.academy/wp-content/uploads/2024/06/IMG_9934.jpeg", role: "student" as const },
      content: `So good!`,
      createdAt: new Date(2025, 7, 19),
      likes: 9,
      replies: [],
    },
    {
      id: "t1-49",
      author: { name: "Sandra Howard", avatar: "https://accredipro.academy/wp-content/uploads/2024/05/IMG_6654.jpeg", role: "student" as const },
      content: `My fear question: "I've tried everything and nothing works. Can you really help me?"

The desperation in that question terrifies me. What if I CAN'T help them?`,
      createdAt: new Date(2025, 7, 19),
      likes: 68,
      replies: [{
        id: "t1-49r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Sandra - that's actually the BEST client! They've tried surface-level stuff - you'll look at ROOT CAUSES. 'You haven't tried THIS approach yet.' Be confident in the functional difference!",
        createdAt: new Date(2025, 7, 19),
        likes: 28,
      }],
    },
    {
      id: "t1-50",
      author: { name: "Andrea Ward", avatar: "https://accredipro.academy/wp-content/uploads/2024/05/IMG_3321.jpeg", role: "student" as const },
      content: `I don't even have words. Just grateful tears. Thank you all. 💕`,
      createdAt: new Date(2025, 7, 19),
      likes: 47,
      replies: [],
    },
    {
      id: "t1-51",
      author: { name: "Monica Cox", avatar: "https://accredipro.academy/wp-content/uploads/2024/04/IMG_8865.jpeg", role: "student" as const },
      content: `🔥`,
      createdAt: new Date(2025, 7, 19),
      likes: 12,
      replies: [],
    },
    {
      id: "t1-52",
      author: { name: "Pamela Kelly", avatar: "https://accredipro.academy/wp-content/uploads/2024/04/IMG_5543.jpeg", role: "student" as const },
      content: `Copy pasting "let me research that and get back to you" into my notes for future use! Simple but so powerful.`,
      createdAt: new Date(2025, 7, 20),
      likes: 63,
      replies: [{
        id: "t1-52r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Pamela - that phrase will serve you SO well! Professional, honest, and shows you care about accuracy. 💪",
        createdAt: new Date(2025, 7, 20),
        likes: 24,
      }],
    },
    {
      id: "t1-53",
      author: { name: "Carol Price", avatar: "https://accredipro.academy/wp-content/uploads/2024/03/IMG_2234.jpeg", role: "student" as const },
      content: `Every new coach needs to read this. Every. Single. One.`,
      createdAt: new Date(2025, 7, 20),
      likes: 38,
      replies: [],
    },
    {
      id: "t1-54",
      author: { name: "Ruth Sanders", avatar: "https://accredipro.academy/wp-content/uploads/2024/03/IMG_9912.jpeg", role: "student" as const },
      content: `This is why I love this community. Real talk. Real support. Real growth. ❤️`,
      createdAt: new Date(2025, 7, 20),
      likes: 54,
      replies: [],
    },
    {
      id: "t1-55",
      author: { name: "Alice Barnes", avatar: "https://accredipro.academy/wp-content/uploads/2024/02/IMG_6678.jpeg", role: "student" as const },
      content: `🙌💪❤️`,
      createdAt: new Date(2025, 7, 20),
      likes: 14,
      replies: [],
    },
    {
      id: "t1-56",
      author: { name: "Judy Murphy", avatar: "https://accredipro.academy/wp-content/uploads/2024/02/IMG_4456.jpeg", role: "student" as const },
      content: `My scary question is anything about mental health. What if someone's depressed or anxious and I don't know how to handle it properly?`,
      createdAt: new Date(2025, 7, 20),
      likes: 51,
      replies: [{
        id: "t1-56r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Judy - important awareness! Know when to refer to mental health professionals. 'I'd love to work on the lifestyle factors that support mental health, but I'd also recommend connecting with a therapist for that aspect.' Team approach!",
        createdAt: new Date(2025, 7, 20),
        likes: 21,
      }],
    },
    {
      id: "t1-57",
      author: { name: "Cheryl James", avatar: "https://accredipro.academy/wp-content/uploads/2024/01/IMG_3321.jpeg", role: "student" as const },
      content: `needed this so much today 🙏`,
      createdAt: new Date(2025, 7, 20),
      likes: 18,
      replies: [],
    },
    {
      id: "t1-58",
      author: { name: "Teresa Gonzalez", avatar: "https://accredipro.academy/wp-content/uploads/2024/01/IMG_8876.jpeg", role: "student" as const },
      content: `Just had my 5th client tell me she appreciates that I don't pretend to know everything. THIS WORKS. Trust Sarah's advice!`,
      createdAt: new Date(2025, 7, 21),
      likes: 178,
      replies: [{
        id: "t1-58r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Teresa - 5 clients!! And they're all appreciating your honesty!! This is the validation everyone needs to see! Thank you for sharing! 🎉💕",
        createdAt: new Date(2025, 7, 21),
        likes: 67,
      }],
    },
    {
      id: "t1-59",
      author: { name: "Ann Russell", avatar: "https://accredipro.academy/wp-content/uploads/2023/12/IMG_5543.jpeg", role: "student" as const },
      content: `Commenting so I can come back and read this every day! 💕`,
      createdAt: new Date(2025, 7, 21),
      likes: 22,
      replies: [],
    },
    {
      id: "t1-60",
      author: { name: "Margaret Griffin", avatar: "https://accredipro.academy/wp-content/uploads/2023/12/IMG_2267.jpeg", role: "student" as const },
      content: `Reading this post BEFORE my discovery call in 30 mins. Deep breaths. I've got this. We've all got this.`,
      createdAt: new Date(2025, 7, 21),
      likes: 91,
      replies: [{
        id: "t1-60r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "YOU'VE GOT THIS MARGARET!! Come back and tell us how it went! 💪🎉",
        createdAt: new Date(2025, 7, 21),
        likes: 35,
      }],
    },
    {
      id: "t1-61",
      author: { name: "Evelyn Diaz", avatar: "https://accredipro.academy/wp-content/uploads/2023/11/IMG_9934.jpeg", role: "student" as const },
      content: `The best community on the internet. Period. 💯`,
      createdAt: new Date(2025, 7, 21),
      likes: 42,
      replies: [],
    },
    {
      id: "t1-62",
      author: { name: "Jean Hayes", avatar: "https://accredipro.academy/wp-content/uploads/2023/11/IMG_6654.jpeg", role: "student" as const },
      content: `Saved. 📌`,
      createdAt: new Date(2025, 7, 21),
      likes: 10,
      replies: [],
    },
    {
      id: "t1-63",
      author: { name: "Rose Coleman", avatar: "https://accredipro.academy/wp-content/uploads/2023/10/IMG_3321.jpeg", role: "student" as const },
      content: `What if they ask about my personal health journey and it's not a "success story" yet? I'm still working on my own stuff. Does that make me a fraud?`,
      createdAt: new Date(2025, 7, 21),
      likes: 67,
      replies: [{
        id: "t1-63r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "Rose - some of the BEST coaches are still on their journey! 'I'm walking this path too, which means I truly understand what you're going through.' Authenticity wins!",
        createdAt: new Date(2025, 7, 21),
        likes: 29,
      }],
    },
    {
      id: "t1-64",
      author: { name: "Marie Powell", avatar: "https://accredipro.academy/wp-content/uploads/2023/10/IMG_8865.jpeg", role: "student" as const },
      content: `I've read this 4 times now. Still hits. 🎯`,
      createdAt: new Date(2025, 7, 22),
      likes: 33,
      replies: [],
    },
    {
      id: "t1-65",
      author: { name: "Irene Long", avatar: "https://accredipro.academy/wp-content/uploads/2023/09/IMG_5543.jpeg", role: "student" as const },
      content: `Thank you thank you thank you. That's all. Just thank you. 🙏`,
      createdAt: new Date(2025, 7, 22),
      likes: 28,
      replies: [{
        id: "t1-65r",
        author: { name: "Sarah M.", avatar: "/coaches/sarah-coach.webp", role: "instructor" as const },
        content: "You're so welcome Irene! We're all in this together! 💕",
        createdAt: new Date(2025, 7, 22),
        likes: 12,
      }],
    },
  ];
}

export function getSampleComments(postId: string, category?: string) {
  // Check if we have refined comments for this post
  if (refinedComments[postId]) {
    return refinedComments[postId];
  }

  // Fallback to hardcoded data
  if (postId === 'pinned-introductions') {
    return INTRODUCTION_COMMENTS;
  }
  return [];
}
