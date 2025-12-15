"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { MessageCircle, CheckCircle, Users, Sparkles, Crown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fake profiles for Q&A participants - expanded list
const QA_PROFILES = [
  { name: "Amanda Richards", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_1894.jpeg", location: "San Diego, CA" },
  { name: "Robert Martinez", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_0931.jpeg", location: "Miami, FL" },
  { name: "Lisa Thompson", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_5742.jpeg", location: "Austin, TX" },
  { name: "Karen Mitchell", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_6345-1.jpeg", location: "Denver, CO" },
  { name: "Patricia Adams", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_3179.jpeg", location: "Seattle, WA" },
  { name: "Michael Foster", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/Bear-Trap-Gap-MP-428-robert-Stevens-web.jpg", location: "Chicago, IL" },
  { name: "Emily Harrison", avatar: "https://accredipro.academy/wp-content/uploads/2025/11/IMG_1830.jpeg", location: "Boston, MA" },
  { name: "Nicole Brooks", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_7797.jpeg", location: "Phoenix, AZ" },
  { name: "Theresa Washington", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_4540.jpeg", location: "Atlanta, GA" },
  { name: "Diana Morales", avatar: "https://accredipro.academy/wp-content/uploads/2025/09/IMG_8681.jpeg", location: "Los Angeles, CA" },
  { name: "Jennifer Collins", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_6678.jpeg", location: "New York, NY" },
  { name: "David Chen", avatar: "https://accredipro.academy/wp-content/uploads/2025/10/IMG_2341.jpeg", location: "San Francisco, CA" },
  { name: "Maria Santos", avatar: "https://accredipro.academy/wp-content/uploads/2025/09/IMG_5523.jpeg", location: "Houston, TX" },
  { name: "Stephanie Brown", avatar: "https://accredipro.academy/wp-content/uploads/2025/09/IMG_7812.jpeg", location: "Portland, OR" },
  { name: "Rachel Kim", avatar: "https://accredipro.academy/wp-content/uploads/2025/08/IMG_9934.jpeg", location: "Nashville, TN" },
  { name: "Angela Wright", avatar: "https://accredipro.academy/wp-content/uploads/2025/08/IMG_4456.jpeg", location: "Philadelphia, PA" },
  { name: "Christina Lee", avatar: "https://accredipro.academy/wp-content/uploads/2025/07/IMG_8876.jpeg", location: "Charlotte, NC" },
  { name: "Dorothy Miller", avatar: "https://accredipro.academy/wp-content/uploads/2025/06/IMG_6654.jpeg", location: "Detroit, MI" },
  { name: "Susan Anderson", avatar: "https://accredipro.academy/wp-content/uploads/2025/06/IMG_3321.jpeg", location: "Minneapolis, MN" },
  { name: "Gloria Cooper", avatar: "https://accredipro.academy/wp-content/uploads/2024/07/IMG_8876.jpeg", location: "Indianapolis, IN" },
];

// Comprehensive Q&A conversations - starting with deeper questions, building to price
// Organized in phases: WHAT IS IT → WHO IS IT FOR → HOW IT WORKS → CREDIBILITY → RESULTS → PRICE → URGENCY
const QA_CONVERSATIONS = [
  // PHASE 1: What is Functional Medicine? (Deep understanding questions)
  {
    question: "Can someone explain what functional medicine actually IS? I keep hearing about it but I'm confused about how it's different from regular healthcare.",
    answer: "Great question! Functional medicine is a root-cause approach to health. Instead of just treating symptoms (like giving you a pill for headaches), we look at WHY you're getting headaches in the first place. Is it stress? Gut issues? Hormones? We treat the whole person, not just the symptom. It's healthcare that actually makes sense!",
  },
  {
    question: "I'm a nurse and honestly... I'm burned out from the healthcare system. Does functional medicine address the things that traditional medicine ignores?",
    answer: "YES! And your nursing background is such an asset here. Functional medicine fills all the gaps that conventional medicine leaves - the nutrition piece, the lifestyle factors, the stress connection, the gut-hormone link. Things doctors don't have TIME to address. You'll finally be able to HELP people the way you always wanted to.",
  },
  {
    question: "What types of health issues can functional medicine practitioners help with?",
    answer: "So many! Digestive issues, hormonal imbalances, autoimmune conditions, chronic fatigue, weight struggles, skin problems, anxiety, sleep issues... basically anything where the root cause matters. And here's the thing - most people have tried EVERYTHING else before they find functional medicine. They're ready for real answers.",
  },
  {
    question: "I've been dealing with my own health issues for years. Doctors keep telling me my tests are 'normal' but I still feel terrible. Is this certification for people like me?",
    answer: "This is EXACTLY who this certification is for! Your personal health journey is your superpower. When you've lived it, you UNDERSTAND it. Some of our most successful practitioners came to this because they healed themselves first. Your story will connect with clients who feel unheard by conventional medicine.",
  },

  // PHASE 2: Who is this for? (Qualification/fit questions)
  {
    question: "Do I need a medical degree to become a functional medicine practitioner?",
    answer: "No medical degree needed! Many of our students come from completely different backgrounds - teachers, corporate professionals, stay-at-home moms. What matters is your passion for helping people and your commitment to learning. The certification teaches you everything from scratch.",
  },
  {
    question: "I'm 52 and thinking about a career change. Is it too late to start something new?",
    answer: "Are you kidding?! Your life experience is your BIGGEST advantage! Clients want practitioners who've been through things - menopause, raising kids, career stress. They trust wisdom over youth. Some of our most successful graduates are in their 50s and 60s. It's never too late to start a meaningful career!",
  },
  {
    question: "I have young kids and work part-time. Can I realistically do this?",
    answer: "Absolutely! The program is designed for busy people. Most students study 2-4 hours per week. You can watch lessons during nap time, on your lunch break, whenever works for you. And once you're certified, you set your OWN schedule. Many practitioners only work 15-20 hours a week and make great money.",
  },
  {
    question: "What if I'm already a health professional - like a dietitian or personal trainer? Would this add value?",
    answer: "This would ELEVATE everything you're already doing! Adding functional medicine to your existing credentials lets you charge premium rates and attract clients who want a deeper approach. We have dietitians who doubled their income after certification. It's the missing piece that sets you apart.",
  },

  // PHASE 3: How does the program work?
  {
    question: "How is the program structured? Is it all online?",
    answer: "Yes, it's 100% online and self-paced. You get 21 comprehensive modules covering everything from gut health to hormones to building your practice. Each module has video lessons, downloadable resources, and practical exercises. Plus you get lifetime access - learn at your own pace!",
  },
  {
    question: "How long does it typically take to complete the certification?",
    answer: "Most students finish in 3-6 months depending on their schedule. Some power through it in 4-6 weeks! There's no deadline though - you have lifetime access. Life gets busy, you can pause and come back. The certification is waiting for you whenever you're ready.",
  },
  {
    question: "Is there any hands-on learning or just videos?",
    answer: "Great question! Each module includes practical exercises and real case studies. You'll practice creating protocols, analyzing health histories, and developing client plans. By the time you're certified, you'll have worked through dozens of real scenarios. Plus our community lets you practice with other students!",
  },
  {
    question: "What kind of support do you provide during the program?",
    answer: "You're never alone! You get access to our private community where you can ask questions anytime, weekly Q&A calls with me, direct messaging support, and peer support from other students. This isn't a 'buy and disappear' program - we're invested in your success!",
  },

  // PHASE 4: Credibility & legitimacy
  {
    question: "Is this certification actually recognized in the industry?",
    answer: "Yes! Our certification is accredited and recognized by functional medicine organizations. But here's what matters MORE - it's recognized by CLIENTS who are looking for help. We have graduates working alongside doctors, running thriving practices, and consulting for wellness brands. Your skills and results are what matter most.",
  },
  {
    question: "How does this compare to other functional medicine certifications out there?",
    answer: "Most certifications either cost $5,000-$15,000 OR they teach only theory without the business side. We're different - you get comprehensive clinical training PLUS business-building strategies for a fraction of the cost. We focus on what actually gets you clients and income, not just knowledge.",
  },
  {
    question: "Can you legally call yourself a 'practitioner' after this certification?",
    answer: "You can absolutely use the title 'Certified Functional Medicine Practitioner' or 'Certified Health Coach.' The key is understanding your scope of practice - you're not diagnosing or prescribing, you're coaching and supporting. Module 4 covers all the legalities so you feel confident and protected.",
  },
  {
    question: "What makes your program different from others?",
    answer: "Three things: 1) We teach you to GET CLIENTS, not just clinical theory. 2) You get Sarah as your mentor - real support, not some faceless corporation. 3) It's priced for real people, not elite investors. Our graduates actually launch practices. That's the difference.",
  },

  // PHASE 5: Results & success stories
  {
    question: "Do graduates actually build successful practices? Can you share some real examples?",
    answer: "So many success stories! Jennifer from Texas landed her first 5 clients within 60 days. Maria went from burned-out nurse to making $8K/month within 6 months. David built a virtual practice while keeping his day job. These aren't unicorns - they're normal people who followed the system. You can do this too!",
  },
  {
    question: "What kind of income can I realistically expect?",
    answer: "It depends on your commitment, but here's the math: Most practitioners charge $150-300 per session or $1,000-3,000 for program packages. Just 5 clients at $1,000 each = $5,000/month. Our serious graduates hit $5K-10K/month within their first year. Some go much higher. The demand is HUGE right now.",
  },
  {
    question: "How quickly can I start seeing clients after I'm certified?",
    answer: "Some students start taking discovery calls WHILE they're still in the program! We actually encourage it. By module 15 you have enough knowledge to help people. The business module (#20) teaches you exactly how to launch. Many graduates have their first paying client within 30-60 days of finishing.",
  },
  {
    question: "What if I complete everything but still feel scared to actually start?",
    answer: "That fear is SO normal - imposter syndrome is real! That's exactly why we include ongoing support. You can ask questions in our community, join Q&A calls, get feedback on your first client cases. You're not alone in this. And honestly? Your first client will prove that YOU CAN DO THIS!",
  },

  // PHASE 6: Price & investment questions
  {
    question: "So... what's the investment for the full certification?",
    answer: "The full certification is $997. I know that's a real investment, but consider this: most practitioners make that back with just ONE client! Compare that to $5,000-15,000 programs that don't even teach you how to get clients. We believe life-changing education shouldn't require going into massive debt.",
  },
  {
    question: "Is the $997 really worth it compared to other certifications that cost $5,000+?",
    answer: "Here's the thing - most expensive programs are teaching the SAME foundational content with more fluff and longer timelines. Our program focuses on what actually matters: clinical skills AND client acquisition. Many students make back their investment within their first 2-3 clients. That's real ROI.",
  },
  {
    question: "I'm nervous about investing $997 when I'm not sure I can actually build a practice...",
    answer: "I totally understand that fear! That's exactly why we include the business-building module. The certification alone won't change your life - combining it with client acquisition strategies is what makes the difference. 87% of graduates who follow the system land their first paying client within 60 days.",
  },
  {
    question: "What if I can't finish the program? Do I lose my $997?",
    answer: "Absolutely not! You have lifetime access. Life happens - take a break, come back, finish at your own pace. We've had students complete it in 4 weeks, others in 6 months. Your access never expires, and neither does our support. Your investment is protected.",
  },
  {
    question: "Do you offer payment plans? $997 upfront is a lot for me right now.",
    answer: "Yes! We offer payment plans because financial situation shouldn't stop someone from changing their life. You can break it into manageable monthly payments. Just click the enrollment link and you'll see the options. We want this to be accessible for everyone who's serious about this path.",
  },
  {
    question: "What's included in the $997? Any hidden costs?",
    answer: "Everything is included - all 21 modules, certification exam, business toolkit, client intake forms, marketing templates, AND lifetime access to our community. No hidden fees, no monthly subscriptions. One payment, lifetime value. What you see is what you get!",
  },

  // PHASE 7: Urgency & final objections
  {
    question: "I want to do this but I keep putting it off. What would you tell someone who's on the fence?",
    answer: "I'd say: what are you waiting FOR? Another year to pass feeling unfulfilled? More time watching others succeed? The perfect moment doesn't exist. What DOES exist is a proven path to a meaningful career that helps people AND pays well. The only thing standing between you and that life is a decision.",
  },
  {
    question: "What's the worst that can happen if I try this?",
    answer: "Honestly? The worst case is you gain incredible knowledge about health that helps you and your family, even if you never take a single client. But realistically, if you put in the work, you'll have a new career that gives you freedom, purpose, and income. The bigger risk is NEVER trying.",
  },
  {
    question: "I've started things before and not finished. How is this different?",
    answer: "I hear you! The difference is support and community. You're not doing this alone - you have me, the community, weekly calls. Plus, this isn't a boring textbook course. It's engaging, practical, and you see progress immediately. Our completion rate is over 85% because people actually ENJOY it!",
  },
  {
    question: "When does enrollment close?",
    answer: "We do periodic enrollment windows to ensure everyone gets proper support and attention. The current enrollment window closes soon - I'd recommend securing your spot now if you're feeling called to this. Once the door closes, you'll have to wait for the next opening. Don't let hesitation cost you months of progress!",
  },
];

// Enrollment notifications - more variety
const ENROLLMENT_NOTIFICATIONS = [
  { name: "Sarah M.", location: "Denver, CO" },
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
  type: "question" | "answer" | "enrollment";
  profile?: (typeof QA_PROFILES)[0];
  content: string;
  timestamp: Date;
}

export function LiveQAChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [viewerCount, setViewerCount] = useState(347);
  const chatRef = useRef<HTMLDivElement>(null);
  const conversationIndexRef = useRef(0);

  // Initialize with some messages - start with deeper questions
  useEffect(() => {
    const initialMessages: ChatMessage[] = [];

    // Add first 4 Q&A pairs (deeper questions first)
    for (let i = 0; i < 4; i++) {
      const profile = QA_PROFILES[i];
      const qa = QA_CONVERSATIONS[i];

      initialMessages.push({
        id: `q-${i}`,
        type: "question",
        profile,
        content: qa.question,
        timestamp: new Date(Date.now() - (4 - i) * 60000),
      });

      initialMessages.push({
        id: `a-${i}`,
        type: "answer",
        content: qa.answer,
        timestamp: new Date(Date.now() - (4 - i) * 60000 + 30000),
      });
    }

    setMessages(initialMessages);
    conversationIndexRef.current = 4;
  }, []);

  // Add new messages periodically
  useEffect(() => {
    const addMessage = () => {
      const rand = Math.random();

      // 75% chance of Q&A, 25% chance of enrollment notification
      if (rand < 0.75) {
        // Add Q&A
        const qaIndex = conversationIndexRef.current % QA_CONVERSATIONS.length;
        const profileIndex = (conversationIndexRef.current + 4) % QA_PROFILES.length;
        const qa = QA_CONVERSATIONS[qaIndex];
        const profile = QA_PROFILES[profileIndex];

        // Add question
        const questionId = `q-${Date.now()}`;
        setMessages((prev) => [
          ...prev,
          {
            id: questionId,
            type: "question",
            profile,
            content: qa.question,
            timestamp: new Date(),
          },
        ]);

        // Add answer after delay (2-4 seconds for natural feel)
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
        }, 2000 + Math.random() * 2000);

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

    // Add new message every 6-10 seconds for more activity
    const interval = setInterval(addMessage, 6000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

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
                Live Q&A with Sarah
                <span className="px-2 py-0.5 bg-red-500 rounded text-xs animate-pulse">LIVE</span>
              </h3>
              <p className="text-burgundy-100 text-xs">Answering your certification questions</p>
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
        {messages.map((message) => (
          <div
            key={message.id}
            className={`animate-fade-in ${
              message.type === "enrollment" ? "flex justify-center" : ""
            }`}
          >
            {message.type === "question" && message.profile && (
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
                    src="/coaches/sarah-coach.webp"
                    alt="Sarah M."
                    width={36}
                    height={36}
                    className="rounded-full object-cover ring-2 ring-gold-400"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gold-400 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-burgundy-700">
                      Sarah M.
                    </span>
                    <span className="px-1.5 py-0.5 bg-gold-100 text-gold-700 text-xs rounded font-medium">
                      Instructor
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-burgundy-50 to-purple-50 border border-burgundy-100 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
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
          </div>
        ))}
      </div>

      {/* Footer with CTA */}
      <div className="px-4 py-4 bg-gradient-to-r from-burgundy-50 to-gold-50 border-t border-burgundy-100">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>Sarah is typing...</span>
          </div>
          <a
            href="https://www.fanbasis.com/agency-checkout/AccrediPro/XDNQW"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white gap-2 shadow-lg"
            >
              Enroll Now - $997
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
