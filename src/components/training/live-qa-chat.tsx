"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageCircle, CheckCircle, Users, Sparkles, Crown } from "lucide-react";

// Real student profiles with verified avatars (removed duplicate Patricia Adams)
const QA_PROFILES = [
  { name: "Jennifer Collins", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg", location: "New York, NY" },
  { name: "Michelle Roberts", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/linkedin-2024.jpg", location: "Los Angeles, CA" },
  { name: "Amanda Richards", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg", location: "San Diego, CA" },
  { name: "Lisa Thompson", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1335.jpeg", location: "Austin, TX" },
  { name: "Sarah Mitchell", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1235.jpeg", location: "Denver, CO" },
  { name: "Karen Williams", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/89C2493E-DCEC-43FB-9A61-1FB969E45B6F_1_105_c.jpeg", location: "Seattle, WA" },
  { name: "Emily Harrison", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg", location: "Boston, MA" },
  { name: "Leeza Rodriguez", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg", location: "Miami, FL" },
  { name: "Nicole Brooks", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg", location: "Phoenix, AZ" },
  { name: "Diana Morales", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1695.jpeg", location: "Houston, TX" },
  { name: "Christina Lee", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_9036-1.jpeg", location: "Portland, OR" },
  { name: "Rachel Kim", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1120.jpeg", location: "Nashville, TN" },
  { name: "Angela Wright", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1085.jpeg", location: "Philadelphia, PA" },
  { name: "Stephanie Brown", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/PHOTOSHOOT-01-copy.jpg", location: "Charlotte, NC" },
  { name: "Rebecca Taylor", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Profile-Pic.jpg", location: "Atlanta, GA" },
  { name: "Maria Garcia", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg", location: "San Antonio, TX" },
  { name: "Anne Peterson", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg", location: "Minneapolis, MN" },
  { name: "Michelle Morgan", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/MICHELLEM047.jpg", location: "Dallas, TX" },
  { name: "Jessica Turner", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_7064.jpeg", location: "San Francisco, CA" },
  { name: "Laura Bennett", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3104.jpeg", location: "Jacksonville, FL" },
  { name: "Heather Cooper", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_6694.jpeg", location: "Columbus, OH" },
  { name: "Megan Foster", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2257.jpeg", location: "Indianapolis, IN" },
  { name: "Danielle Scott", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/49.jpeg", location: "Fort Worth, TX" },
  { name: "Samantha Davis", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_6995-1.jpg", location: "Scottsdale, AZ" },
  { name: "Brittany Nelson", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000037020.jpg", location: "Boulder, CO" },
  { name: "Katherine Price", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000037720.jpg", location: "Santa Monica, CA" },
  { name: "Ashley Martinez", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_6562.jpg", location: "Sedona, AZ" },
  { name: "Tiffany Hill", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1538.jpeg", location: "Asheville, NC" },
  { name: "Natalie Ward", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1540.jpeg", location: "Charleston, SC" },
  { name: "Vanessa Cruz", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_6418.jpeg", location: "Tampa, FL" },
  { name: "Crystal Hughes", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_6542.jpeg", location: "Savannah, GA" },
  { name: "Amber Long", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/IMG_4555.jpeg", location: "Santa Fe, NM" },
  { name: "Cynthia Powell", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/Screenshot-2025-08-12-162412.jpg", location: "Sarasota, FL" },
  { name: "Victoria Ross", avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000086368.jpg", location: "San Jose, CA" },
];

// Opening greetings - casual hellos when people join
const OPENING_GREETINGS = [
  "Hey everyone! 👋 Just joined, excited to learn more about this",
  "Hi! Coming in from Chicago, glad I made it on time",
  "Hello! Been wanting to watch this for weeks, finally here 🙌",
  "Hey! Anyone else here thinking about a career change?",
  "Hi all! Nurse here, really curious about functional medicine",
  "Just joined! 👋 Ready to learn",
  "Hi everyone! So excited to be here live",
  "Hello from Texas! 🤠 Let's do this",
  "Hey! First time watching, hope I'm not too late",
  "Hi! My friend told me about this, she said it changed her life",
];

// Q&A conversations organized by VIDEO TIMELINE (36 min total)
// Questions should appear AFTER the relevant section is discussed in the video

// PHASE 1: EARLY (3-10 min) - During pain cycle section
// Simple questions, relatable struggles, "what is FM"
const PHASE1_QA = [
  {
    question: "ok so I've been watching for a few mins... can someone explain what functional medicine actually is?? I keep hearing about it everywhere",
    answer: "Great question! Functional medicine is a root-cause approach to health. Instead of just giving you a pill for symptoms, we look at WHY you're having those symptoms in the first place. Is it gut issues? Hormones? Stress? We treat the whole person, not just the symptom. It's healthcare that actually makes sense!",
  },
  {
    question: "omg she's literally describing my life right now... the fatigue, the brain fog, doctors telling me I'm fine 😭",
    answer: "You're not alone! So many women feel this way. That's exactly why this field is growing so fast - millions of people are looking for practitioners who actually LISTEN and look at the root cause instead of just prescribing pills.",
  },
  {
    question: "I'm a nurse and honestly... I'm SO burned out. 12 years in the system and I feel like I'm just putting bandaids on everything. Does this actually address things differently?",
    answer: "I hear you, and your nursing background is actually a HUGE asset here! Functional medicine fills all the gaps conventional medicine leaves - nutrition, lifestyle, the gut-hormone connection. Things doctors don't have TIME to address. You'll finally be able to HELP people the way you always wanted to. Many of our best practitioners are former nurses!",
  },
  {
    question: "wait do I need a medical degree for this?? I don't have any health background",
    answer: "No medical degree needed! Many of our students come from completely different backgrounds - teachers, corporate professionals, stay-at-home moms. What matters is your passion for helping people and your commitment to learning. The certification teaches you everything from scratch.",
  },
];

// PHASE 2: MID-EARLY (10-17 min) - After opportunity section, before case studies
const PHASE2_QA = [
  {
    question: "this sounds interesting but how is it different from being a health coach",
    answer: "Great question! Health coaches focus mainly on lifestyle and accountability. Functional medicine practitioners go DEEPER - we understand lab work, root causes, complex protocols. It's a more comprehensive skill set that commands higher fees. You're not just motivating people, you're actually solving their health puzzles!",
  },
  {
    question: "I've been dealing with my own health issues for 6 years now. Doctors keep telling me my labs are 'normal' but I feel TERRIBLE every day. Brain fog, exhausted, can't lose weight no matter what I do... is this for people like me?",
    answer: "This is EXACTLY who this certification is for! Your personal health journey is your superpower. When you've lived it, you UNDERSTAND it. Some of our most successful practitioners came to this because they healed themselves first. Your story will connect deeply with clients who feel unheard by conventional medicine.",
  },
  {
    question: "$5.6 TRILLION industry?? I had no idea it was that big",
    answer: "Yes! And it's growing 15%+ every year. The demand for functional medicine practitioners is HUGE - there simply aren't enough trained people to help everyone who needs it. That's why this is such a unique opportunity right now.",
  },
  {
    question: "I'm 54 and thinking about a career change... feeling like maybe it's too late for me to start something new 😔",
    answer: "Are you kidding?! Your life experience is your BIGGEST advantage! Clients want practitioners who've been through things - menopause, raising kids, career stress. They trust wisdom over youth. Some of our most successful graduates are in their 50s and 60s. It's never too late to start a meaningful career!",
  },
];

// PHASE 3: MIDDLE (17-26 min) - During/after case studies
// Questions about income, results, specific people mentioned
const PHASE3_QA = [
  {
    question: "wait Jenny made $12,500 in her FIRST month?? is that actually real?",
    answer: "100% real! Jenny's story is one of my favorites. She was burned out as a nurse practitioner, enrolled in our program, specialized in women's hormones, and launched within weeks. 5 clients at $2,500 each. She still messages me saying 'I finally remember why I got into healthcare.'",
  },
  {
    question: "the Sarah story is hitting me hard rn... I'm also 'just a mom' with no qualifications 😅",
    answer: "Sarah's story resonates with SO many women! She had zero clinical background - just her own gut health journey and a desire to help others. $6,200 in month two while her kids were at school. 'Just a mom' is actually your superpower - you understand real life, real struggles, real time constraints. Clients LOVE that.",
  },
  {
    question: "do people who finish this actually make money? or is it one of those things where you get certified and then nothing happens",
    answer: "So many success stories! Jenny from Texas landed her first 5 clients within 60 days. Maria went from burned-out nurse to making $8K/month within 6 months. David built a virtual practice while keeping his day job. These aren't unicorns - they're normal people who followed the system. You can do this too!",
  },
  {
    question: "what kind of income can I realistically expect? I need real numbers not just 'you can make money'",
    answer: "Here's the math: Most practitioners charge $150-300 per session or $1,000-3,000 for program packages. Just 5 clients at $1,000 each = $5,000/month. Our serious graduates hit $5K-10K/month within their first year. Some go much higher. The demand is HUGE right now.",
  },
  {
    question: "I have 3 kids under 7 and work part time... is this even realistic for me rn",
    answer: "Absolutely! The program is designed for busy people. Most students study 2-4 hours per week. You can go through lessons during nap time, on your lunch break, whenever works for you. And once certified, you set your OWN schedule. Many practitioners only work 15-20 hours a week and make great money!",
  },
];

// PHASE 4: MID-LATE (26-35 min) - During certification details section
// Questions about the program structure, accreditations, what's included
const PHASE4_QA = [
  {
    question: "wait hold on... 20 certificates?? what do you mean exactly",
    answer: "Yes! Each module gives you a SEPARATE certificate. So you graduate with certifications in gut health, hormone balancing, autoimmune protocols, weight management, lab interpretation, AND MORE. No other program offers this. You become a multi-specialist which means more clients and you can charge higher fees!",
  },
  {
    question: "how does the program actually work? is it all online",
    answer: "Yes, 100% online and self-paced! Here's what makes us unique: you get 20 modules and EACH MODULE = 1 CERTIFICATE. That's 20 certifications in 1 program - first ever worldwide! You can specialize in gut health, hormones, autoimmune, weight loss... it's the most complete certification available. Plus lifetime access!",
  },
  {
    question: "9 international accreditations sounds impressive but what does that actually mean for me?",
    answer: "It means your credentials are recognized GLOBALLY. You can work with clients anywhere in the world. It means doctors and healthcare providers respect your training. It means when you put those logos on your website, potential clients see you're LEGIT. No other program has all 9 of these!",
  },
  {
    question: "how long does it take to finish? I'm impatient lol",
    answer: "Most students finish in 3-6 months depending on their schedule. Some power through it in 4-6 weeks! There's no deadline though - you have lifetime access. Life gets busy, you can pause and come back. The certification is waiting for you whenever you're ready.",
  },
  {
    question: "what if I get stuck or have questions during the program? I hate feeling alone in online courses",
    answer: "You're never alone! You get access to our private community where you can ask questions anytime, weekly Q&A calls with me, direct messaging support, and peer support from other students. This isn't a 'buy and disappear' program - we're invested in your success!",
  },
  {
    question: "the business accelerator box thing sounds amazing... other programs definitely don't include that",
    answer: "That's EXACTLY why we created it! I saw too many women get certified and then have no idea how to get clients. The business box has everything - client attraction, pricing, sales scripts, program templates, the whole thing. It's like getting a second certification in business-building, included free.",
  },
];

// PHASE 5: LATE (35-45 min) - After objection handling, around price reveal
// Questions about price, guarantees, concerns, "should I do this"
const PHASE5_QA = [
  {
    question: "ok so... what's the investment? I'm scared to ask lol",
    answer: "The full certification is $997. I know that's a real investment, but consider this: most practitioners make that back with just ONE client! Compare that to $5,000-15,000 programs that don't even teach you how to get clients. We believe life-changing education shouldn't require going into massive debt.",
  },
  {
    question: "$997 is a lot for me right now tbh... are there payment plans?",
    answer: "Yes! We offer payment plans because financial situation shouldn't stop someone from changing their life. You can break it into manageable monthly payments. Just click the enrollment link and you'll see the options. We want this to be accessible for everyone who's serious about this path.",
  },
  {
    question: "I'm nervous about investing when I'm not sure I can actually build a practice... what if I fail",
    answer: "I totally understand that fear! That's exactly why we include the business-building module AND have the 100% Certification Guarantee. If you do the work, you WILL get certified. And the business system shows you exactly how to get your first clients. 87% of graduates who follow the system land their first paying client within 60 days.",
  },
  {
    question: "is there a guarantee? what if I don't like it",
    answer: "TWO guarantees actually! 30-day money-back if you don't love it. AND a 100% Certification Guarantee - if you do the work and don't pass, we work with you until you do. You literally cannot lose unless you quit. We don't let our students fail.",
  },
  {
    question: "I've bought online courses before and never finished them... have a whole graveyard of unfinished programs 😅",
    answer: "I hear you! The difference here is support and community. You're not doing this alone - you have me, the community, weekly calls. Plus, this isn't a boring textbook course. It's engaging, practical, and you see progress immediately. Our completion rate is over 85% because people actually ENJOY it!",
  },
  {
    question: "ugh I want to do this so bad but I keep putting it off... been watching for 20 mins now and still hesitating",
    answer: "I'd say: what are you waiting FOR? Another year to pass feeling unfulfilled? More time watching others succeed? The perfect moment doesn't exist. What DOES exist is a proven path to a meaningful career that helps people AND pays well. The only thing standing between you and that life is a decision.",
  },
];

// PHASE 6: FINAL (45-55 min) - During close, after price is revealed
// Urgency, final questions, enrollments
const PHASE6_QA = [
  {
    question: "ok I think I'm ready... any last words of encouragement? I'm still nervous 😬",
    answer: "Here's the truth: EVERYONE is nervous at the beginning. Every successful practitioner started exactly where you are right now - scared but hopeful. The only difference between them and people who never try is that they took action despite the fear. Trust yourself. You can do this. We've got you!",
  },
  {
    question: "just enrolled!! so excited and terrified at the same time haha 🎉",
    answer: "CONGRATULATIONS! 🎉 You just made one of the best decisions of your life! That mix of excitement and nervousness is completely normal. Check your email for login details and jump into the community to introduce yourself. Welcome to the family - I can't wait to see you inside!",
  },
  {
    question: "how do I know if this is really right for me... I keep going back and forth",
    answer: "Ask yourself: Do you genuinely want to help people with their health? Are you frustrated by conventional medicine's limitations? Do you want flexibility and meaningful work? If you said yes, this is probably your path. The fact that you're here, watching this, tells me something is calling you!",
  },
  {
    question: "what's the worst that could happen if I try this",
    answer: "Honestly? The worst case is you gain incredible knowledge about health that helps you and your family, even if you never take a single client. But realistically, if you put in the work, you'll have a new career that gives you freedom, purpose, and income. The bigger risk is NEVER trying.",
  },
];

// Combine all phases into timeline-aware structure
const QA_CONVERSATIONS = [
  ...PHASE1_QA,  // 3-10 min
  ...PHASE2_QA,  // 10-17 min
  ...PHASE3_QA,  // 17-26 min
  ...PHASE4_QA,  // 26-35 min
  ...PHASE5_QA,  // 35-45 min
  ...PHASE6_QA,  // 45+ min
];

// Enrollment notifications - more variety
const ENROLLMENT_NOTIFICATIONS = [
  { name: "Jennifer L.", location: "Austin, TX" },
  { name: "Michelle R.", location: "Phoenix, AZ" },
  { name: "Rebecca T.", location: "Orlando, FL" },
  { name: "Amanda K.", location: "Seattle, WA" },
  { name: "Christina H.", location: "Chicago, IL" },
  { name: "Katherine P.", location: "Nashville, TN" },
  { name: "Laura B.", location: "San Diego, CA" },
  { name: "Nancy W.", location: "Boston, MA" },
  { name: "Diana M.", location: "Atlanta, GA" },
  { name: "Heather G.", location: "Dallas, TX" },
  { name: "Brittany C.", location: "Columbus, OH" },
  { name: "Megan T.", location: "San Jose, CA" },
  { name: "Ashley P.", location: "Jacksonville, FL" },
  { name: "Stephanie R.", location: "Fort Worth, TX" },
];

interface ChatMessage {
  id: string;
  type: "question" | "answer" | "enrollment" | "system" | "greeting";
  profile?: (typeof QA_PROFILES)[0];
  content: string;
  timestamp: Date;
}

// Shuffle array with seed for consistent randomization per session
function shuffleWithSeed(array: typeof QA_CONVERSATIONS, seed: number) {
  const shuffled = [...array];
  let currentIndex = shuffled.length;
  let randomValue: number;

  // Simple seeded random
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex !== 0) {
    randomValue = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomValue]] = [shuffled[randomValue], shuffled[currentIndex]];
  }

  return shuffled;
}

// Get or create session seed for randomization
function getSessionSeed(): number {
  if (typeof window === "undefined") return Date.now();

  const stored = sessionStorage.getItem("qa_session_seed");
  if (stored) {
    return parseInt(stored, 10);
  }

  const newSeed = Math.floor(Math.random() * 1000000);
  sessionStorage.setItem("qa_session_seed", newSeed.toString());
  return newSeed;
}

export function LiveQAChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(347);
  const [isStarted, setIsStarted] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const conversationIndexRef = useRef(0);
  const shuffledConversationsRef = useRef<typeof QA_CONVERSATIONS | null>(null);
  const shuffledProfilesRef = useRef<typeof QA_PROFILES | null>(null);

  // Initialize shuffled arrays but DON'T add messages yet - wait for natural start
  useEffect(() => {
    // Get session seed for consistent randomization within this browser session
    const seed = getSessionSeed();

    // Shuffle conversations and profiles
    shuffledConversationsRef.current = shuffleWithSeed(QA_CONVERSATIONS, seed);
    shuffledProfilesRef.current = shuffleWithSeed(QA_PROFILES as unknown as typeof QA_CONVERSATIONS, seed + 1) as unknown as typeof QA_PROFILES;

    // Start with empty chat - will populate naturally
    setMessages([]);
    conversationIndexRef.current = 0;

    const profiles = shuffledProfilesRef.current || QA_PROFILES;
    const timers: NodeJS.Timeout[] = [];

    // Greeting 1: After 12 seconds (delayed to give video time to play)
    timers.push(setTimeout(() => {
      const greeting = OPENING_GREETINGS[Math.floor(Math.random() * OPENING_GREETINGS.length)];
      setMessages(prev => [...prev, {
        id: `g-${Date.now()}`,
        type: "greeting",
        profile: profiles[0],
        content: greeting,
        timestamp: new Date(),
      }]);
    }, 12000));

    // Greeting 2: After 18 seconds
    timers.push(setTimeout(() => {
      const greeting = OPENING_GREETINGS[Math.floor(Math.random() * OPENING_GREETINGS.length)];
      setMessages(prev => [...prev, {
        id: `g-${Date.now()}`,
        type: "greeting",
        profile: profiles[1],
        content: greeting,
        timestamp: new Date(),
      }]);
    }, 18000));

    // Greeting 3: After 25 seconds
    timers.push(setTimeout(() => {
      const greeting = OPENING_GREETINGS[Math.floor(Math.random() * OPENING_GREETINGS.length)];
      setMessages(prev => [...prev, {
        id: `g-${Date.now()}`,
        type: "greeting",
        profile: profiles[2],
        content: greeting,
        timestamp: new Date(),
      }]);
    }, 25000));

    // Rachel's welcome after 35 seconds
    timers.push(setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `a-welcome`,
        type: "answer",
        content: "Hey everyone! Welcome to the live training! 👋 I'm Rachel - I went through this exact program 2 years ago and now I run my own practice! Happy to answer any questions as we go through this together.",
        timestamp: new Date(),
      }]);
      setIsStarted(true);
    }, 35000));

    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  // After Rachel's welcome, start the Q&A flow
  useEffect(() => {
    if (!isStarted) return;

    const conversations = shuffledConversationsRef.current || QA_CONVERSATIONS;
    const profiles = shuffledProfilesRef.current || QA_PROFILES;
    const timers: NodeJS.Timeout[] = [];

    // First real question after 45-60 seconds (giving video more time)
    timers.push(setTimeout(() => {
      const qa = conversations[0];
      const profile = profiles[3]; // Use profile 3 since 0,1,2 were used for greetings

      setMessages(prev => [...prev, {
        id: `q-${Date.now()}`,
        type: "question",
        profile,
        content: qa.question,
        timestamp: new Date(),
      }]);

      // Rachel's answer after 20-30 seconds (realistic reading/typing time)
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `a-${Date.now()}`,
          type: "answer",
          content: qa.answer,
          timestamp: new Date(),
        }]);
        conversationIndexRef.current = 1;
      }, 20000 + Math.random() * 10000);
    }, 45000 + Math.random() * 15000));

    return () => timers.forEach(t => clearTimeout(t));
  }, [isStarted]);

  // Add new messages every 90-150 seconds (much slower, realistic webinar pace)
  useEffect(() => {
    // Don't start the interval until first Q&A is done (conversationIndexRef >= 1)
    if (!isStarted) return;

    // Wait for first Q&A to complete before starting interval
    const startDelay = setTimeout(() => {
      const addMessage = () => {
        // Only add if we've completed at least first Q&A
        if (conversationIndexRef.current < 1) return;

        const rand = Math.random();

        // Use shuffled arrays or fallback to original
        const conversations = shuffledConversationsRef.current || QA_CONVERSATIONS;
        const profiles = shuffledProfilesRef.current || QA_PROFILES;

        // 85% chance of Q&A, 15% chance of enrollment notification
        if (rand < 0.85) {
          // Add Q&A using shuffled arrays
          const qaIndex = conversationIndexRef.current % conversations.length;
          const profileIndex = (conversationIndexRef.current + 3) % profiles.length;
          const qa = conversations[qaIndex];
          const profile = profiles[profileIndex];

          // Add question
          setMessages((prev) => [
            ...prev,
            {
              id: `q-${Date.now()}`,
              type: "question",
              profile,
              content: qa.question,
              timestamp: new Date(),
            },
          ]);

          // Add answer after delay (25-40 seconds for realistic reading/typing time)
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: `a-${Date.now()}`,
                type: "answer",
                content: qa.answer,
                timestamp: new Date(),
              },
            ]);
          }, 25000 + Math.random() * 15000);

          conversationIndexRef.current++;
        } else {
          // Add enrollment notification
          const enrollment = ENROLLMENT_NOTIFICATIONS[Math.floor(Math.random() * ENROLLMENT_NOTIFICATIONS.length)];
          setMessages((prev) => [
            ...prev,
            {
              id: `e-${Date.now()}`,
              type: "enrollment",
              content: `${enrollment.name} from ${enrollment.location} just enrolled!`,
              timestamp: new Date(),
            },
          ]);

          // Update viewer count
          setViewerCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
        }
      };

      // Add new message every 90-150 seconds (1.5-2.5 minutes) for realistic pace
      const interval = setInterval(addMessage, 90000 + Math.random() * 60000);
      return () => clearInterval(interval);
    }, 60000); // Wait 60 seconds after start before beginning the interval

    return () => clearTimeout(startDelay);
  }, [isStarted]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Fluctuate viewer count
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.floor(Math.random() * 7) - 2; // -2 to +4
        return Math.max(300, prev + change);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-purple-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-[10px] text-white font-bold">●</span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm flex items-center gap-2">
                Live Q&A with Rachel
                <span className="px-2 py-0.5 bg-red-500 rounded text-xs animate-pulse">LIVE</span>
              </h3>
              <p className="text-burgundy-100 text-xs">Certified Practitioner & Graduate</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <Users className="w-4 h-4" />
            <span>{viewerCount.toLocaleString()} watching</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="h-[450px] overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white scroll-smooth"
      >
        {/* Empty state - waiting for session to start */}
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-16 h-16 bg-burgundy-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-burgundy-500" />
            </div>
            <h4 className="text-gray-900 font-semibold mb-2">Connecting to Live Session...</h4>
            <p className="text-gray-500 text-sm">Rachel will be answering questions shortly</p>
            <div className="flex gap-1 mt-4">
              <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`animate-fade-in ${
              message.type === "enrollment" ? "flex justify-center" : ""
            }`}
          >
            {(message.type === "question" || message.type === "greeting") && message.profile && (
              <div className="flex gap-3 animate-slide-up">
                <div className="relative flex-shrink-0">
                  <Image
                    src={message.profile.avatar}
                    alt={message.profile.name}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {message.profile.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {message.profile.location}
                    </span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                </div>
              </div>
            )}

            {message.type === "answer" && (
              <div className="flex gap-3 pl-8 animate-slide-up">
                <div className="relative flex-shrink-0">
                  <Image
                    src="https://accredipro.academy/wp-content/uploads/2025/12/IMG_1120.jpeg"
                    alt="Rachel K."
                    width={36}
                    height={36}
                    className="rounded-full object-cover ring-2 ring-emerald-400"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-emerald-700">
                      Rachel K.
                    </span>
                    <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">
                      Graduate
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                </div>
              </div>
            )}

            {message.type === "enrollment" && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full shadow-sm animate-bounce-subtle">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {message.content}
                </span>
                <Sparkles className="w-4 h-4 text-green-500" />
              </div>
            )}

            {message.type === "system" && (
              <div className="flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-50 border border-burgundy-200 rounded-full">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-sm font-medium text-burgundy-600">
                    {message.content}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer - viewer info */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100">
        <div className="flex items-center justify-between text-gray-500 text-xs">
          <span className="text-emerald-600 font-medium">Rachel is a certified graduate answering live</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
