"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Send, Sparkles, Heart, Award, Play, Pause, Volume2 } from "lucide-react";
import Image from "next/image";

// ─── Brand ────────────────────────────────────────────────────────
const B = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
};

const SARAH = "/coaches/sarah-coach.webp";
const STORAGE_KEY = "asi_scholarship_chat";

// ─── Types ────────────────────────────────────────────────────────
interface ScholarshipChatProps {
  firstName: string;
  lastName: string;
  email: string;
  quizData: {
    type: string;
    goal: string;
    role: string;
    currentIncome: string;
    experience: string;
    clinicalReady: string;
    labInterest: string;
    pastCerts: string;
    missingSkill: string;
    commitment: string;
    vision: string;
    startTimeline: string;
    investmentBudget?: string; // From quiz Q15: 500, 600, 700, 800, 900, 1000-plus
  };
  page?: string;
}


interface ChatMessage {
  id: string;
  role: "user" | "sarah";
  content: string;
  timestamp: string; // ISO string for serialization
  fromServer?: boolean;
  audioUrl?: string; // For audio messages
}

// Helper to render message with clickable links
function renderMessageWithLinks(text: string, isFromUser: boolean) {
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlPattern);

  return parts.map((part, index) => {
    if (part.match(urlPattern)) {
      // Clean trailing punctuation from URL
      const cleanUrl = part.replace(/[.,;:!?)]+$/, "");
      const trailing = part.slice(cleanUrl.length);
      return (
        <span key={index}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`underline font-semibold hover:opacity-80 break-all ${isFromUser ? "text-blue-200" : "text-blue-600"
              }`}
            style={{ textDecorationThickness: "2px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {cleanUrl}
          </a>
          {trailing && <span>{trailing}</span>}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

interface StoredChat {
  visitorId: string;
  messages: ChatMessage[];
  hasStarted: boolean;
  welcomeDone: boolean;
  email: string;
}

// ─── Quiz Answer Label Maps (matched to actual quiz questions) ───
const SPECIALIZATION_LABELS: Record<string, string> = {
  "gut-health": "Gut Health", "hormone-health": "Hormone Health",
  "burnout": "Burnout Recovery", "autoimmune": "Autoimmune",
  "metabolic": "Metabolic Health", "explore": "Exploring Options",
};
const BACKGROUND_LABELS: Record<string, string> = {
  "nurse": "Nurse / Nursing Assistant", "doctor": "Doctor / PA / NP",
  "allied-health": "Allied Health", "mental-health": "Mental Health Professional",
  "wellness": "Wellness / Fitness Professional", "career-change": "Career Changer",
};
const FM_KNOWLEDGE_LABELS: Record<string, string> = {
  "brand-new": "Brand New", "self-study": "Self-Study",
  "some-training": "Some Training", "already-practicing": "Already Practicing",
};
const MOTIVATION_LABELS: Record<string, string> = {
  "help-people": "Help People Heal", "leave-job": "Leave Current Job",
  "add-services": "Add FM to Practice", "work-from-home": "Work From Home",
  "burned-out": "Burned Out, Need New Path",
};
const PAIN_LABELS: Record<string, string> = {
  "time-for-money": "Trading Time for Money", "stuck": "Feeling Stuck",
  "meant-for-more": "Meant for More", "exhausted": "Exhausted",
  "no-credential": "No Credential",
};
const TIMELINE_LABELS: Record<string, string> = {
  "immediately": "Immediately", "30-days": "Within 30 Days",
  "1-3-months": "1-3 Months", "exploring": "Just Exploring",
};
const INCOME_GOAL_LABELS: Record<string, string> = {
  "3k-5k": "$3K-$5K/mo", "5k-10k": "$5K-$10K/mo",
  "10k-15k": "$10K-$15K/mo", "15k-plus": "$15K+/mo",
};
const TIME_STUCK_LABELS: Record<string, string> = {
  "less-than-month": "Less Than a Month", "1-6-months": "1-6 Months",
  "6-12-months": "6-12 Months", "over-year": "Over a Year",
};
const CURRENT_INCOME_LABELS: Record<string, string> = {
  "under-3k": "Under $3K/mo", "3k-5k": "$3K-$5K/mo",
  "5k-8k": "$5K-$8K/mo", "over-8k": "$8K+/mo",
};
const DREAM_LABELS: Record<string, string> = {
  "financial-freedom": "Financial Freedom", "time-freedom": "Time Freedom",
  "purpose": "Purpose & Meaning", "independence": "Independence",
  "all-above": "The Complete Transformation",
};
const COMMITMENT_LABELS: Record<string, string> = {
  "100-percent": "100% All In", "very-committed": "Very Committed",
  "interested": "Interested", "curious": "Curious",
};

// ─── Social Proof Notifications ──────────────────────────────────
const SOCIAL_PROOF_NAMES = [
  "Jennifer M.", "Patricia K.", "Linda S.", "Barbara T.", "Susan R.",
  "Jessica W.", "Sarah L.", "Karen D.", "Nancy P.", "Lisa H.",
  "Margaret B.", "Betty C.", "Sandra G.", "Ashley N.", "Dorothy F.",
  "Kimberly J.", "Emily V.", "Donna Z.", "Michelle A.", "Carol E.",
  "Amanda Y.", "Melissa O.", "Deborah I.", "Stephanie U.", "Rebecca Q.",
  "Sharon X.", "Laura W.", "Cynthia M.", "Kathleen P.", "Amy S.",
];

const SOCIAL_PROOF_LOCATIONS = [
  "Austin, TX", "Phoenix, AZ", "Denver, CO", "Seattle, WA", "Portland, OR",
  "Nashville, TN", "Charlotte, NC", "San Diego, CA", "Tampa, FL", "Atlanta, GA",
  "Boston, MA", "Miami, FL", "Dallas, TX", "Chicago, IL", "Los Angeles, CA",
  "Philadelphia, PA", "Houston, TX", "San Antonio, TX", "Columbus, OH", "Indianapolis, IN",
  "Jacksonville, FL", "Fort Worth, TX", "San Jose, CA", "Austin, TX", "Sacramento, CA",
];

const SOCIAL_PROOF_TIMES = [
  "2 minutes ago", "3 minutes ago", "5 minutes ago", "7 minutes ago", "12 minutes ago",
  "15 minutes ago", "just now", "1 minute ago", "4 minutes ago", "8 minutes ago",
];

function getRandomSocialProof() {
  const name = SOCIAL_PROOF_NAMES[Math.floor(Math.random() * SOCIAL_PROOF_NAMES.length)];
  const location = SOCIAL_PROOF_LOCATIONS[Math.floor(Math.random() * SOCIAL_PROOF_LOCATIONS.length)];
  const time = SOCIAL_PROOF_TIMES[Math.floor(Math.random() * SOCIAL_PROOF_TIMES.length)];
  const amounts = [297, 400, 500, 350, 450, 600, 300, 550];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  return { name, location, time, amount };
}

// ─── Helpers ──────────────────────────────────────────────────────
function saveChat(data: StoredChat) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { }
}

function loadChat(): StoredChat | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

// ─── Audio Message Player Component ───────────────────────────────
function AudioMessage({ url, isFromUser }: { url: string; isFromUser: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`flex items-center gap-2 p-2 rounded-xl ${isFromUser ? "bg-white/10" : "bg-gray-100"}`}>
      <button
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isFromUser ? "bg-white/20 hover:bg-white/30 text-white" : "bg-white hover:bg-gray-50 shadow-sm"
          }`}
        style={!isFromUser ? { color: B.burgundy } : {}}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        {/* Waveform visualization (simplified bars) */}
        <div className="flex items-center gap-0.5 h-6">
          {[...Array(20)].map((_, i) => {
            const barHeight = Math.random() * 100;
            const isActive = (i / 20) * 100 <= progress;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all ${isFromUser
                  ? isActive ? "bg-white" : "bg-white/30"
                  : isActive ? "bg-burgundy" : "bg-gray-300"
                  }`}
                style={{
                  height: `${20 + barHeight * 0.4}%`,
                  backgroundColor: !isFromUser && isActive ? B.burgundy : undefined,
                }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className={`text-[10px] ${isFromUser ? "text-white/60" : "text-gray-400"}`}>
            {formatTime(audioRef.current?.currentTime || 0)}
          </span>
          <span className={`text-[10px] ${isFromUser ? "text-white/60" : "text-gray-400"}`}>
            {formatTime(duration)}
          </span>
        </div>
      </div>
      <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${isFromUser ? "text-white/40" : "text-gray-300"}`} />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────
export function ScholarshipChat({ firstName, lastName, email, quizData, page = "healthcare-results" }: ScholarshipChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [welcomeDone, setWelcomeDone] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [showPulse, setShowPulse] = useState(true);
  const [urgencyTimer, setUrgencyTimer] = useState<number | null>(null); // 10 min countdown in seconds
  const [approvalAmount, setApprovalAmount] = useState<string | null>(null);
  const [welcomeAudioUrl, setWelcomeAudioUrl] = useState<string | null>(null);
  const [isPlayingWelcomeAudio, setIsPlayingWelcomeAudio] = useState(false);

  // 🤖 AI FOLLOW-UP STATE - Claude Sonnet 4.5 for post-approval questions
  const [scholarshipContext, setScholarshipContext] = useState<{
    amount?: string;
    couponCode?: string;
    checkoutUrl?: string;
  } | null>(null);
  // Ref always stays current (avoids stale closures in useCallback/async)
  const scholarshipContextRef = useRef<typeof scholarshipContext>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const welcomeTimers = useRef<NodeJS.Timeout[]>([]);
  const urgencyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);
  const welcomeAudioPlayed = useRef(false); // Track if audio already played (prevent restart)
  const autopilotTriggered = useRef(false); // CRITICAL: Prevent duplicate autopilot flows

  // Social proof notification state
  const [socialProofNotification, setSocialProofNotification] = useState<{
    name: string;
    location: string;
    time: string;
    amount: number;
    visible: boolean;
  } | null>(null);

  // ─── Restore from localStorage on mount ─────────────────────────
  useEffect(() => {
    const stored = loadChat();
    if (stored && stored.email === email) {
      setVisitorId(stored.visitorId);
      setMessages(stored.messages);
      setHasStarted(stored.hasStarted);
      // If chat has started and has messages, force welcomeDone to true
      // This prevents the input from being permanently locked after restore
      setWelcomeDone(stored.welcomeDone || (stored.hasStarted && stored.messages.length > 0));
    } else {
      setVisitorId("sch_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now());
    }
  }, [email]);

  // ─── Persist to localStorage on every change ───────────────────
  useEffect(() => {
    if (visitorId && hasStarted) {
      saveChat({ visitorId, messages, hasStarted, welcomeDone, email });
    }
  }, [visitorId, messages, hasStarted, welcomeDone, email]);

  // Cleanup welcome timers and audio on unmount
  useEffect(() => {
    return () => {
      welcomeTimers.current.forEach(t => clearTimeout(t));
      if (welcomeAudioRef.current) {
        welcomeAudioRef.current.pause();
        welcomeAudioRef.current.src = "";
      }
    };
  }, []);

  // ─── Auto-scroll ───────────────────────────────────────────────
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      isNearBottom.current = scrollHeight - scrollTop - clientHeight < 100;
    }
  };

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (isNearBottom.current || lastMsg?.role === "user") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when chat opens and welcome is done
  useEffect(() => {
    if (isOpen && welcomeDone && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, welcomeDone]);

  // Safety net: If welcome sequence hasn't completed after 15s but chat started, force enable input
  useEffect(() => {
    if (hasStarted && !welcomeDone) {
      const safetyTimer = setTimeout(() => {
        console.log("[Scholarship Chat] Safety timeout — forcing welcomeDone=true");
        setWelcomeDone(true);
      }, 15000);
      return () => clearTimeout(safetyTimer);
    }
  }, [hasStarted, welcomeDone]);

  // Pulse animation — stop after 12 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 12000);
    return () => clearTimeout(timer);
  }, []);

  // ─── AUTO-OPEN after 15 seconds with FOMO notification ──────────
  useEffect(() => {
    // Don't auto-open if already opened or has existing chat
    const stored = loadChat();
    if (stored && stored.email === email && stored.hasStarted) return;

    const autoOpenTimer = setTimeout(() => {
      if (!isOpen && !hasStarted) {
        // Show notification first
        setShowAutoOpenNotification(true);
      }
    }, 15000); // 15 seconds

    return () => clearTimeout(autoOpenTimer);
  }, [isOpen, hasStarted, email]);

  const [showAutoOpenNotification, setShowAutoOpenNotification] = useState(false);

  // Handle auto-open notification click
  const handleAutoOpenClick = () => {
    setShowAutoOpenNotification(false);
    setIsOpen(true);
    if (!hasStarted) {
      startScholarshipChat();
    }
  };

  // ─── Poll for admin replies (runs even when chat is closed!) ──
  // IMPORTANT: Don't start polling until welcome sequence is done,
  // otherwise polling can overwrite local Sarah messages before they're saved to DB
  useEffect(() => {
    if (!visitorId || !hasStarted || !welcomeDone) return;
    let interval: NodeJS.Timeout | null = null;

    const fetchMessages = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/chat/messages?visitorId=${visitorId}`);
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          const serverMessages: ChatMessage[] = data.messages.map((m: any) => {
            // Strip out AUTOPILOT context notes from messages (for admin view only)
            let cleanText = m.text || "";
            cleanText = cleanText.replace(/\n\n--- AUTOPILOT[^]*$/s, "").trim();
            cleanText = cleanText.replace(/\n\n--- AUTOPILOT REJECTION[^]*$/s, "").trim();
            return {
              id: m.id || `srv-${Math.random().toString(36).substr(2, 6)}`,
              role: m.role === "user" ? "user" as const : "sarah" as const,
              content: cleanText,
              timestamp: m.createdAt || new Date().toISOString(),
              fromServer: true,
              audioUrl: m.audioUrl, // Support for audio messages
            };
          });

          // Check for approval message and start urgency timer
          const approvalMsg = serverMessages.find(m =>
            m.role === "sarah" &&
            m.content.toLowerCase().includes("approved") &&
            (m.content.toLowerCase().includes("10 minute") || m.content.toLowerCase().includes("scholarship"))
          );

          if (approvalMsg && urgencyTimer === null) {
            // Extract amount from message
            const amountMatch = approvalMsg.content.match(/\$[\d,]+(?:\.\d{2})?/);
            if (amountMatch) setApprovalAmount(amountMatch[0]);

            // Calculate remaining time from when the approval was sent
            const approvalTime = new Date(approvalMsg.timestamp).getTime();
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - approvalTime) / 1000);
            const remainingSeconds = Math.max(0, 600 - elapsedSeconds); // 10 minutes = 600 seconds

            if (remainingSeconds > 0) {
              setUrgencyTimer(remainingSeconds);
            }
          }

          setMessages(prev => {
            // Keep ALL local-only messages that aren't duplicates of server messages
            const serverContents = new Set(serverMessages.map(m => m.content.trim()));

            // Keep local messages that aren't duplicates (by content) of server messages
            // This preserves pending local messages even if they're older/same time as server
            const pendingLocalMsgs = prev.filter(m =>
              !m.fromServer && !serverContents.has(m.content.trim())
            );

            // Merge server messages + pending local messages
            const merged = [...serverMessages, ...pendingLocalMsgs];
            merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            // Debug log if message count changed
            if (prev.length !== merged.length) {
              console.log("[Chat Sync] Messages:", {
                prevCount: prev.length,
                serverCount: serverMessages.length,
                pendingLocalCount: pendingLocalMsgs.length,
                mergedCount: merged.length,
              });
            }

            // Only update if actually different (by content)
            const prevContents = prev.map(m => m.content).join("|||");
            const mergedContents = merged.map(m => m.content).join("|||");
            return prevContents === mergedContents ? prev : merged;
          });
        }
      } catch (err) {
        // silent
      }
    };

    const handleVisibility = () => { if (!document.hidden) fetchMessages(); };
    document.addEventListener("visibilitychange", handleVisibility);
    fetchMessages();
    interval = setInterval(fetchMessages, 3000); // Poll every 3s for real-time sync

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [visitorId, hasStarted, welcomeDone, urgencyTimer]);

  // ─── Urgency countdown timer ──────────────────────────────────────
  useEffect(() => {
    if (urgencyTimer !== null && urgencyTimer > 0) {
      urgencyIntervalRef.current = setInterval(() => {
        setUrgencyTimer(prev => {
          if (prev === null || prev <= 1) {
            if (urgencyIntervalRef.current) clearInterval(urgencyIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (urgencyIntervalRef.current) clearInterval(urgencyIntervalRef.current);
    };
  }, [urgencyTimer !== null && urgencyTimer > 0]);

  // ─── Start scholarship chat ──────────────────────────────────────
  const startScholarshipChat = useCallback(async () => {
    if (hasStarted) return;
    // Generate visitorId inline if not set yet (race condition with useEffect)
    let vid = visitorId;
    if (!vid) {
      vid = "sch_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      setVisitorId(vid);
      console.log("[Scholarship Chat] Generated visitorId inline:", vid);
    }
    console.log("[Scholarship Chat] Starting chat for visitor:", vid);
    setHasStarted(true);

    // 1. Register optin
    try {
      await fetch("/api/chat/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: vid,
          name: `${firstName} ${lastName}`.trim(),
          email,
          page: `scholarship-${page}`,
        }),
      });
    } catch { }

    // 1b. Submit scholarship application (creates lead + sends email)
    try {
      await fetch("/api/scholarship/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          visitorId: vid,
          quizData,
          page,
        }),
      });
    } catch { }

    // 2. Send application data to admin panel (silent)
    const applicationSummary = [
      `SCHOLARSHIP APPLICATION`,
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Specialization: ${SPECIALIZATION_LABELS[quizData.type] || quizData.type}`,
      `Background: ${BACKGROUND_LABELS[quizData.currentIncome] || quizData.currentIncome}`,
      `FM Knowledge: ${FM_KNOWLEDGE_LABELS[quizData.goal] || quizData.goal}`,
      `Motivation: ${MOTIVATION_LABELS[quizData.experience] || quizData.experience}`,
      `Pain Point: ${PAIN_LABELS[quizData.clinicalReady] || quizData.clinicalReady}`,
      `Start Timeline: ${TIMELINE_LABELS[quizData.labInterest] || quizData.labInterest}`,
      `Income Goal: ${INCOME_GOAL_LABELS[quizData.pastCerts] || quizData.pastCerts}`,
      `Time Considering: ${TIME_STUCK_LABELS[quizData.missingSkill] || quizData.missingSkill}`,
      `Current Income: ${CURRENT_INCOME_LABELS[quizData.commitment] || quizData.commitment}`,
      `Dream Life: ${DREAM_LABELS[quizData.vision] || quizData.vision}`,
      `Commitment: ${COMMITMENT_LABELS[quizData.startTimeline] || quizData.startTimeline}`,
      `Page: ${page}`,
    ].join("\n");

    try {
      await fetch("/api/chat/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: applicationSummary,
          page: `scholarship-${page}`,
          visitorId: vid,
          userName: `${firstName} ${lastName}`.trim(),
          userEmail: email,
          isFromVisitor: true, // This is visitor's application data
        }),
      });
    } catch { }

    // 3. Sarah's welcome sequence — DELAYED for natural feel
    const backgroundLabel = BACKGROUND_LABELS[quizData.currentIncome] || "your background";
    const incomeGoalLabel = INCOME_GOAL_LABELS[quizData.pastCerts] || "$5K-$10K/mo";
    const typeLabel = SPECIALIZATION_LABELS[quizData.type] || "Functional Medicine";

    // Helper to save Sarah's message to database (so admin can see it)
    // Uses retry logic to ensure messages sync reliably
    const saveSarahMessage = async (content: string, retries = 3) => {
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`[Scholarship Chat] Saving Sarah message (attempt ${attempt}/${retries}): "${content.substring(0, 50)}..." visitorId=${vid}`);
          const res = await fetch("/api/chat/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: content,
              page: `scholarship-${page}`,
              visitorId: vid,
              userName: `${firstName} ${lastName}`.trim(),
              userEmail: email,
              isFromVisitor: false, // This is Sarah's message
              repliedBy: "Sarah M. (Auto)",
            }),
          });
          if (res.ok) {
            console.log(`[Scholarship Chat] ✅ Sarah message saved successfully`);
            return; // Success — exit
          }
          const errorText = await res.text();
          console.error(`[Scholarship Chat] ❌ Failed to save Sarah message (${res.status}):`, errorText);
        } catch (err) {
          console.error(`[Scholarship Chat] ❌ Error saving Sarah message (attempt ${attempt}):`, err);
        }
        // Wait before retry (500ms, 1000ms, 1500ms)
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, attempt * 500));
        }
      }
      console.error(`[Scholarship Chat] ❌ FAILED to save Sarah message after ${retries} attempts`);
    };

    // ═══ HORMOZI WELCOME SEQUENCE — Short, punchy, value-stack ═══

    const msg1Content = `Hey ${firstName}! 🎉 You QUALIFIED — I just pulled your application.`;
    const msg1: ChatMessage = {
      id: "sarah-1",
      role: "sarah",
      content: msg1Content,
      timestamp: new Date().toISOString(),
    };


    // Pre-fetch welcome audio from ElevenLabs (Sarah's voice)
    const fetchWelcomeAudio = async () => {
      try {
        console.log("[Audio] Fetching welcome audio for:", firstName);
        const res = await fetch("/api/scholarship/welcome-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName }),
        });
        const data = await res.json();
        console.log("[Audio] Response:", { success: data.success, hasAudio: !!data.audio });
        if (data.success && data.audio) {
          setWelcomeAudioUrl(data.audio);
          const audio = new Audio(data.audio);
          audio.preload = "auto";
          welcomeAudioRef.current = audio;
          audio.addEventListener("ended", () => setIsPlayingWelcomeAudio(false));
          audio.addEventListener("error", (e) => {
            console.log("[Audio] Error:", e);
            setIsPlayingWelcomeAudio(false);
          });
          audio.load();
        }
      } catch (err) {
        console.log("[Audio] Fetch failed:", err);
      }
    };
    fetchWelcomeAudio();

    // Delay message 1 by 2 seconds (Sarah "reading" the application)
    const t1 = setTimeout(() => {
      setIsTyping(true);
      const t1b = setTimeout(async () => {
        setIsTyping(false);
        setMessages(prev => [...prev, msg1]);
        saveSarahMessage(msg1Content).catch(() => { }); // Non-blocking save

        // 🎵 Play welcome audio RIGHT after first message (only once!)
        if (welcomeAudioRef.current && !welcomeAudioPlayed.current) {
          welcomeAudioPlayed.current = true;
          const audio = welcomeAudioRef.current;
          audio.currentTime = 0;
          audio.volume = 1.0;
          audio.play()
            .then(() => {
              console.log("[Audio] Playing welcome!");
              setIsPlayingWelcomeAudio(true);
            })
            .catch((err) => console.log("[Audio] Autoplay blocked:", err.message));
        }

        // Delay message 2 (HORMOZI VALUE STACK + investment ask)
        const t2 = setTimeout(() => {
          setIsTyping(true);
          const t2b = setTimeout(async () => {
            setIsTyping(false);

            const msg2Content = `You qualify for our Institute Functional Medicine Private Path to ${incomeGoalLabel} — the only program that takes you from zero to closing $3K-$5K clients in 6-12 months, ${firstName}:

🎓 Main Certification + Advanced + Master + Practice (20 Modules — 4 Levels)
🤝 1:1 Mentorship with ME — until you're 100% certified, getting clients & reading labs
🌐 Done-For-You Website to start attracting clients
📦 Business Box — offer templates, pricing strategies, client acquisition system
📋 Legal Templates — consent forms, intake forms, disclaimers
🛠 Tools & Resources to manage clients professionally
💻 Coach Workspace — your complete practitioner hub

Type the amount you can cover and I'll call the Institute right now to see if they'll approve your scholarship and pay the rest 📞`;

            const msg2: ChatMessage = {
              id: "sarah-2",
              role: "sarah",
              content: msg2Content,
              timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, msg2]);
            setWelcomeDone(true);
            saveSarahMessage(msg2Content).catch(() => { }); // Non-blocking save
          }, 3000); // Typing duration for msg2
          welcomeTimers.current.push(t2b);
        }, 4000); // Wait before msg2
        welcomeTimers.current.push(t2);
      }, 2000); // Typing duration for msg1
      welcomeTimers.current.push(t1b);
    }, 3000); // Initial delay
    welcomeTimers.current.push(t1);
  }, [hasStarted, firstName, lastName, email, quizData, visitorId, page]);


  // ─── 🤖 AI Follow-up Handler (Claude Sonnet 4.5) ─────────────────
  const handleAIResponse = useCallback(async (userMessage: string) => {
    const ctx = scholarshipContextRef.current;
    if (!ctx) return;

    setIsTyping(true);

    try {
      // Build chat history from messages (last 20 max for context)
      const chatHistory = messages.slice(-20).map(m => ({
        role: m.role as "user" | "sarah",
        content: m.content,
      }));

      const res = await fetch("/api/chat/sarah-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          chatHistory,
          firstName,
          amount: ctx.amount,
          couponCode: ctx.couponCode,
          checkoutUrl: ctx.checkoutUrl,
        }),
      });

      const data = await res.json();

      if (data.success && data.response) {
        // Natural typing delay: 2.5-4 seconds AFTER API returns
        await new Promise(r => setTimeout(r, 2500 + Math.random() * 1500));
        setIsTyping(false);

        const aiMsg: ChatMessage = {
          id: `sarah-ai-${Date.now()}`,
          role: "sarah",
          content: data.response,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMsg]);

        // Save to DB for admin visibility
        fetch("/api/chat/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: data.response,
            page: `scholarship-${page}`,
            visitorId,
            userName: `${firstName} ${lastName}`.trim(),
            userEmail: email,
            isFromVisitor: false,
            repliedBy: "Sarah M. (AI)",
          }),
        }).catch(() => { });
      } else {
        setIsTyping(false);
      }
    } catch (err) {
      console.error("[Sarah AI] Error:", err);
      setIsTyping(false);
    }
  }, [messages, firstName, lastName, email, visitorId, page]);

  // ─── Open chat ─────────────────────────────────────────────────
  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!hasStarted) {
      startScholarshipChat();
    } else if (!welcomeDone) {
      // Chat was restored from localStorage but welcome never completed — force enable input
      setWelcomeDone(true);
    }
  }, [hasStarted, welcomeDone, startScholarshipChat]);

  // Expose globally for CTAs
  useEffect(() => {
    (window as any).__openScholarshipChat = openChat;
    return () => { delete (window as any).__openScholarshipChat; };
  }, [openChat]);

  // ─── Send user message ──────────────────────────────────────────
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMessage = inputValue.trim();
    setInputValue("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    isNearBottom.current = true;

    // Send to admin panel - scholarship chats require MANUAL admin response only
    try {
      await fetch("/api/chat/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          page: `scholarship-${page}`,
          visitorId,
          userName: `${firstName} ${lastName}`.trim(),
          userEmail: email,
        }),
      });
    } catch { }

    // ═══ FULL AUTOPILOT SCHOLARSHIP SYSTEM ═══
    // Detect if user typed a number and auto-generate approval with coupon
    // CRITICAL: Only trigger ONCE per session to prevent duplicate flows!
    const hasNumber = /\$?\d+/.test(userMessage);
    const shouldTriggerAutopilot = hasNumber && !autopilotTriggered.current && messages.length <= 10;
    if (shouldTriggerAutopilot) { // Only trigger ONCE per session to prevent duplicate flows
      autopilotTriggered.current = true; // Lock immediately to prevent re-entry
      try {
        // Call autopilot API to get coupon tier and messages
        const autoReplyRes = await fetch("/api/scholarship/auto-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            firstName,
            lastName,
            email,
            visitorId,
            quizData,
          }),
        });

        const autoReply = await autoReplyRes.json();

        // REJECTION: Amount below $500 minimum
        if (autoReply.hasAmount && autoReply.rejectionMessage) {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              const rejectionMsg: ChatMessage = {
                id: `sarah-rejection-${Date.now()}`,
                role: "sarah",
                content: autoReply.rejectionMessage,
                timestamp: new Date().toISOString(),
              };
              setMessages(prev => [...prev, rejectionMsg]);

              // Save rejection message to DB with context
              // Save rejection message to DB (no context notes)
              fetch("/api/chat/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: autoReply.rejectionMessage,
                  page: `scholarship-${page}`,
                  visitorId,
                  userName: `${firstName} ${lastName}`.trim(),
                  userEmail: email,
                  isFromVisitor: false,
                  repliedBy: "Sarah M. (Auto-Rejection)",
                }),
              }).catch(() => { });

              // 🤖 Set minimal scholarshipContext so AI can handle follow-up messages
              // This allows Sarah to continue the conversation and try to upsell to $200+
              const rejCtx = { amount: `$${autoReply.fullContext?.requestedAmount || 'below minimum'}` };
              setScholarshipContext(rejCtx);
              scholarshipContextRef.current = rejCtx;
              autopilotTriggered.current = true;
            }, 2500);
          }, 1000);
          return;
        }

        if (autoReply.hasAmount && autoReply.callingMessage && autoReply.approvalMessage) {

          // 💾 Save scholarship context for AI follow-up responses
          const approvalCtx = {
            amount: autoReply.fullContext.finalAmount ? `$${autoReply.fullContext.finalAmount}` : undefined,
            checkoutUrl: autoReply.checkoutUrl || autoReply.tier?.checkoutUrl,
          };
          setScholarshipContext(approvalCtx);
          scholarshipContextRef.current = approvalCtx;

          // Step 1: Show "calling Institute" message after 1 second
          setTimeout(async () => {
            setIsTyping(true);

            setTimeout(() => {
              setIsTyping(false);

              const callingMsg: ChatMessage = {
                id: `sarah-calling-${Date.now()}`,
                role: "sarah",
                content: autoReply.callingMessage,
                timestamp: new Date().toISOString(),
              };
              setMessages(prev => [...prev, callingMsg]);

              // Save calling message to DB
              fetch("/api/chat/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: autoReply.callingMessage,
                  page: `scholarship-${page}`,
                  visitorId,
                  userName: `${firstName} ${lastName}`.trim(),
                  userEmail: email,
                  isFromVisitor: false,
                  repliedBy: "Sarah M. (Auto)",
                }),
              }).catch(() => { });

              // Step 2: ANTICIPATION — 20 second delay
              const approvalDelay = 20000;
              const typingIntervals: NodeJS.Timeout[] = [];

              // Typing pulse 1: at 8s
              const t1 = setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000);
              }, 8000);
              typingIntervals.push(t1);

              // 🔥 SOCIAL PROOF 1: at 12s
              const sp1 = setTimeout(() => {
                const proof = getRandomSocialProof();
                setSocialProofNotification({ ...proof, visible: true });
                setTimeout(() => setSocialProofNotification(null), 4000);
              }, 12000);
              typingIntervals.push(sp1);

              // Typing pulse 2: at 18s
              const t2 = setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2500);
              }, 18000);
              typingIntervals.push(t2);

              // 🔥 SOCIAL PROOF 2: at 24s
              const sp2 = setTimeout(() => {
                const proof = getRandomSocialProof();
                setSocialProofNotification({ ...proof, visible: true });
                setTimeout(() => setSocialProofNotification(null), 4000);
              }, 24000);
              typingIntervals.push(sp2);

              // Typing pulse 3: at 30s
              const t3 = setTimeout(() => {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 3000);
              }, 30000);
              typingIntervals.push(t3);

              // Final approval message (TEXT ONLY — no audio while "on the phone")
              setTimeout(async () => {
                typingIntervals.forEach(t => clearTimeout(t));

                setIsTyping(true);
                setTimeout(() => {
                  setIsTyping(false);

                  const approvalMsg: ChatMessage = {
                    id: `sarah-approval-${Date.now()}`,
                    role: "sarah",
                    content: autoReply.approvalMessage,
                    timestamp: new Date().toISOString(),
                  };
                  setMessages(prev => [...prev, approvalMsg]);

                  // Save approval message to DB
                  fetch("/api/chat/sales", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      message: autoReply.approvalMessage,
                      page: `scholarship-${page}`,
                      visitorId,
                      userName: `${firstName} ${lastName}`.trim(),
                      userEmail: email,
                      isFromVisitor: false,
                      repliedBy: "Sarah M. (Auto-Approval)",
                    }),
                  }).catch(() => { });

                  // 📧 SEND EMAIL #2: Scholarship Approved
                  if (autoReply.tier && email) {
                    fetch("/api/scholarship/send-approval-email", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        email,
                        firstName,
                        amount: autoReply.fullContext.offeredAmount,
                        finalAmount: autoReply.fullContext.finalAmount,
                        couponCode: autoReply.fullContext.couponCode,
                        savings: autoReply.tier.savings,
                      }),
                    }).catch((err) => console.error("[Scholarship Email] Failed:", err));
                  }

                  // Waiting message (TEXT ONLY — Sarah is "on the phone")
                  setTimeout(() => {
                    const waitingMsg: ChatMessage = {
                      id: `sarah-waiting-${Date.now()}`,
                      role: "sarah",
                      content: `Your scholarship code expires in 10 minutes, ${firstName} — tap the link and enter the code now while it's active! I'll stay right here if you need anything 💜`,
                      timestamp: new Date().toISOString(),
                    };
                    setMessages(prev => [...prev, waitingMsg]);
                  }, 3000);

                }, 3500); // Typing duration for approval
              }, approvalDelay);
            }, 2000); // Typing duration for calling
          }, 1000); // Initial delay
        }
      } catch (err) {
        console.error("[Scholarship Autopilot] Error:", err);
        // Fallback to old behavior if API fails
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            const fallbackMsg: ChatMessage = {
              id: `sarah-fallback-${Date.now()}`,
              role: "sarah",
              content: `Got it! 🙏 Let me check with the Institute on your scholarship amount...\n\n⏳ One moment please!`,
              timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, fallbackMsg]);
          }, 2000);
        }, 1000);
      }
    }

    // ═══ NON-NUMERIC FIRST RESPONSE — Guide them to name an amount ═══
    // When user says "I don't know", "not sure", "what do you recommend?" etc.
    // and autopilot hasn't triggered yet (no number detected, no context set)
    if (!hasNumber && !autopilotTriggered.current && !scholarshipContextRef.current) {
      // Set a minimal context so future AI follow-ups work
      const guidanceCtx = {
        amount: "pending",
        couponCode: undefined,
        checkoutUrl: "https://sarah.accredipro.academy/checkout-fm-certification-program",
      };
      setScholarshipContext(guidanceCtx);
      scholarshipContextRef.current = guidanceCtx;

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const guidanceMsg: ChatMessage = {
            id: `sarah-guidance-${Date.now()}`,
            role: "sarah",
            content: `No pressure at all, ${firstName}! 💜 Just type the amount you can cover and I'll call the Institute right now to see if they'll approve your scholarship and pay the rest 📞`,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, guidanceMsg]);

          // Save to DB
          fetch("/api/chat/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: guidanceMsg.content,
              page: `scholarship-${page}`,
              visitorId,
              userName: `${firstName} ${lastName}`.trim(),
              userEmail: email,
              isFromVisitor: false,
              repliedBy: "Sarah M. (Auto-Guidance)",
            }),
          }).catch(() => { });
        }, 2000);
      }, 1000);
      return;
    }

    // ═══ PAID/DONE DETECTION — Send Email #5 + Welcome Response ═══
    const paidKeywords = ["done", "paid", "purchased", "completed", "i paid", "just paid", "payment done", "payment complete"];
    const isPaidMessage = paidKeywords.some(kw => userMessage.toLowerCase().includes(kw));

    if (isPaidMessage) {
      // Show welcome response after 2 seconds
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const welcomeMsg: ChatMessage = {
            id: `sarah-welcome-${Date.now()}`,
            role: "sarah",
            content: `🎉 ${firstName}!! I AM SO EXCITED FOR YOU!

You just made a decision that's going to change your life!

Here's what happens next:

1️⃣ Check your email in the next 5 minutes — you'll get your login credentials
2️⃣ Log into your portal at learn.accredipro.academy  
3️⃣ Start with Module 1 — it's already unlocked for you
4️⃣ Join our private community — links are inside your portal

I'll personally check in on you in 24 hours to see how you're doing.

Congratulations on investing in yourself. You're going to do AMAZING things! 💜

SO PROUD OF YOU!`,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, welcomeMsg]);

          // Save to DB
          fetch("/api/chat/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: welcomeMsg.content,
              page: `scholarship-${page}`,
              visitorId,
              userName: `${firstName} ${lastName}`.trim(),
              userEmail: email,
              isFromVisitor: false,
              repliedBy: "Sarah M. (Auto-Welcome)",
            }),
          }).catch(() => { });

          // 📧 SEND EMAIL #5: Welcome to the family!
          if (email) {
            fetch("/api/scholarship/send-welcome-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, firstName }),
            }).catch((err) => console.error("[Scholarship Welcome Email] Failed:", err));
          }
        }, 2500);
      }, 1500);
      return; // Don't trigger AI for paid messages
    }

    // ═══ 🤖 AI FOLLOW-UP — Claude Sonnet 4.5 handles any post-approval question ═══
    if (scholarshipContextRef.current && autopilotTriggered.current && !hasNumber) {
      handleAIResponse(userMessage);
    }
  };

  // ─── Floating Button ────────────────────────────────────────────
  if (!isOpen) {
    return (
      <>
        {/* AUTO-OPEN FOMO NOTIFICATION */}
        {showAutoOpenNotification && (
          <div
            onClick={handleAutoOpenClick}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 max-w-[320px] sm:max-w-[360px] cursor-pointer animate-bounce"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl border-2 border-white/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎉</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">GREAT NEWS, {firstName}!</p>
                  <p className="text-xs text-white/90 mt-1">
                    I just reviewed your application and you qualify for a <span className="font-bold underline">scholarship!</span> Click here to chat about your special rate...
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setShowAutoOpenNotification(false); }}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                <span className="text-[10px] text-white/70 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" /> Sarah is online
                </span>
                <span className="text-xs font-bold">Tap to claim →</span>
              </div>
            </div>
            {/* Arrow pointing to chat button */}
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-gradient-to-br from-green-500 to-emerald-600 rotate-45" />
          </div>
        )}

        {/* 🔥 SOCIAL PROOF NOTIFICATION — "X just enrolled from Y location" */}
        {socialProofNotification?.visible && (
          <div
            className="fixed bottom-20 left-4 sm:bottom-24 sm:left-6 z-50 max-w-[320px] animate-bounce"
            style={{
              animation: "slideInLeft 0.4s ease-out, fadeOut 0.5s ease-in 3.5s forwards"
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl border-2 overflow-hidden" style={{ borderColor: `${B.gold}40` }}>
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${B.burgundy}15` }}>
                    <span className="text-lg">🎓</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: B.burgundy }}>
                      {socialProofNotification.name} just enrolled!
                    </p>
                    <p className="text-xs text-gray-500">
                      {socialProofNotification.location} • {socialProofNotification.time}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-3 py-2 text-center text-xs font-medium"
                style={{ background: `${B.gold}20`, color: B.burgundy }}>
                ${socialProofNotification.amount} scholarship applied ✨
              </div>
            </div>
          </div>
        )}

        <button
          onClick={openChat}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2.5 shadow-2xl transition-all hover:scale-105 rounded-full overflow-hidden"
          style={{ background: B.burgundy }}
        >
          <div className="relative flex items-center">
            <Image src={SARAH} alt="Sarah" width={52} height={52} className="w-12 h-12 sm:w-[52px] sm:h-[52px] rounded-full border-2 border-white/30 object-cover" />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div className="pr-4 sm:pr-5 pl-0.5">
            <p className="text-white text-xs sm:text-sm font-bold leading-tight">Apply for Scholarship</p>
            <p className="text-white/70 text-[10px] sm:text-[11px]">Chat with Sarah now</p>
          </div>
          {showPulse && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white animate-ping" style={{ background: B.gold }} />
          )}
        </button>
      </>
    );
  }

  // ─── Chat Window ────────────────────────────────────────────────
  return (
    <div className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-50 w-full sm:w-[400px] sm:max-w-[calc(100vw-32px)] bg-white sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col max-h-[100dvh] sm:max-h-[85vh]" style={{ height: "min(600px, 100dvh)" }}>
      {/* Header */}
      <div className="flex-none p-3 sm:p-4 flex items-center gap-3" style={{ background: B.burgundy }}>
        <div className="relative">
          <Image src={SARAH} alt="Sarah M." width={44} height={44} className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-white/30 object-cover" />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2" style={{ borderColor: B.burgundy }} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-white">Sarah M.</h4>
          <p className="text-[11px] text-white/80 flex items-center gap-1">
            <Award className="w-3 h-3" /> Scholarship Director — Online now
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white/70 hover:text-white transition-colors p-1"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* FOMO Warning Banner */}
      <div className="flex-none px-3 py-1.5 flex items-center justify-center gap-2" style={{ background: "#fef3cd", borderBottom: "1px solid #ffc107" }}>
        <span className="text-amber-600 text-sm">⚠️</span>
        <p className="text-[10px] sm:text-[11px] font-medium text-amber-800">
          Don&apos;t close this page — your scholarship spot is reserved for this session only!
        </p>
      </div>

      {/* Scholarship badge or Urgency Timer */}
      {urgencyTimer !== null && urgencyTimer > 0 ? (
        <div className="flex-none px-3 sm:px-4 py-2.5 border-b flex items-center justify-between gap-2 animate-pulse" style={{ background: "linear-gradient(90deg, #dc2626 0%, #b91c1c 100%)", borderColor: "#991b1b" }}>
          <div className="flex items-center gap-2">
            <span className="text-white text-lg">🎉</span>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-white">SCHOLARSHIP APPROVED!</p>
              <p className="text-[10px] text-white/80">{approvalAmount ? `Your rate: ${approvalAmount}` : "Special rate applied"}</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-xl font-bold text-white font-mono">
              {Math.floor(urgencyTimer / 60)}:{(urgencyTimer % 60).toString().padStart(2, "0")}
            </p>
            <p className="text-[9px] text-white/70">EXPIRES</p>
          </div>
        </div>
      ) : urgencyTimer === 0 ? (
        <div className="flex-none px-3 sm:px-4 py-2.5 border-b flex items-center gap-2" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
          <span className="text-red-500 text-lg">⏰</span>
          <p className="text-[11px] sm:text-xs font-medium text-red-700">
            Scholarship offer expired. Reply to request a new approval!
          </p>
        </div>
      ) : (
        <div className="flex-none px-3 sm:px-4 py-2 border-b flex items-center gap-2" style={{ background: `${B.gold}10`, borderColor: `${B.gold}30` }}>
          <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: B.gold }} />
          <p className="text-[10px] sm:text-[11px] font-medium" style={{ color: B.burgundy }}>
            ASI Scholarship Application — Pay What You Can, We&apos;ll Cover the Rest
          </p>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3"
        style={{ background: "#f9f7f4" }}
      >
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400">Sarah is reviewing your assessment...</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "sarah" && (
              <Image src={SARAH} alt="Sarah" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0 border" style={{ borderColor: `${B.gold}40` }} />
            )}
            <div
              className={`max-w-[82%] p-3 sm:p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                ? "rounded-br-sm text-white"
                : "rounded-bl-sm border shadow-sm"
                }`}
              style={{
                background: msg.role === "user" ? B.burgundy : "white",
                borderColor: msg.role === "user" ? "transparent" : `${B.gold}25`,
                color: msg.role === "user" ? "white" : "#374151",
              }}
            >
              {/* Audio message */}
              {msg.audioUrl ? (
                <div className="min-w-[200px]">
                  <AudioMessage url={msg.audioUrl} isFromUser={msg.role === "user"} />
                  {msg.content && (
                    <p className="whitespace-pre-wrap mt-2 text-xs opacity-80">
                      {renderMessageWithLinks(msg.content, msg.role === "user")}
                    </p>
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">
                  {renderMessageWithLinks(msg.content, msg.role === "user")}
                </p>
              )}
              {/* Voice message player for first welcome message */}
              {msg.id === "sarah-1" && welcomeAudioUrl && (
                <button
                  onClick={() => {
                    console.log("[Audio Button] Clicked, ref:", welcomeAudioRef.current);
                    if (welcomeAudioRef.current) {
                      if (isPlayingWelcomeAudio) {
                        welcomeAudioRef.current.pause();
                        setIsPlayingWelcomeAudio(false);
                      } else {
                        welcomeAudioRef.current.currentTime = 0;
                        welcomeAudioRef.current.play()
                          .then(() => {
                            console.log("[Audio Button] Playing successfully!");
                            setIsPlayingWelcomeAudio(true);
                          })
                          .catch((err) => {
                            console.error("[Audio Button] Play failed:", err);
                          });
                      }
                    } else {
                      console.error("[Audio Button] No audio ref available!");
                    }
                  }}
                  className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:scale-105"
                  style={{ background: `${B.gold}20`, border: `1px solid ${B.gold}40` }}
                >
                  {isPlayingWelcomeAudio ? (
                    <>
                      <Pause className="w-3.5 h-3.5" style={{ color: B.burgundy }} />
                      <span className="text-xs font-medium" style={{ color: B.burgundy }}>Pause</span>
                      <span className="flex gap-0.5">
                        {[...Array(4)].map((_, i) => (
                          <span
                            key={i}
                            className="w-1 rounded-full animate-pulse"
                            style={{
                              height: `${8 + Math.random() * 8}px`,
                              background: B.gold,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" style={{ color: B.burgundy }} />
                      <span className="text-xs font-medium" style={{ color: B.burgundy }}>🎧 Hear Sarah&apos;s voice</span>
                    </>
                  )}
                </button>
              )}
              <p className={`text-[10px] mt-1.5 ${msg.role === "user" ? "text-white/50" : "text-gray-400"}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <Image src={SARAH} alt="Sarah" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mr-2 mt-1 flex-shrink-0 border" style={{ borderColor: `${B.gold}40` }} />
            <div className="bg-white border p-3 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm" style={{ borderColor: `${B.gold}25` }}>
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: B.gold, animationDuration: "0.6s" }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: B.gold, animationDelay: "0.15s", animationDuration: "0.6s" }} />
              <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: B.gold, animationDelay: "0.3s", animationDuration: "0.6s" }} />
              <span className="text-[10px] text-gray-400 ml-1">Sarah is recording audio...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - safe area for mobile */}
      <div className="flex-none p-2.5 sm:p-3 bg-white border-t flex gap-2 pb-[env(safe-area-inset-bottom,8px)]" style={{ borderColor: `${B.gold}20` }}>
        <input
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          onFocus={() => {
            // Scroll to bottom when input focused (mobile keyboard)
            setTimeout(() => {
              inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
          }}
          placeholder={welcomeDone ? "Type your message..." : (messages.length > 0 ? "One moment..." : "Sarah is reviewing your results...")}
          disabled={!welcomeDone}
          className="flex-1 border rounded-full px-4 py-2.5 text-base sm:text-sm focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400"
          style={{ borderColor: `${B.gold}40`, fontSize: "16px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim() || !welcomeDone}
          className="w-10 h-10 flex-shrink-0 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
          style={{ background: inputValue.trim() ? B.burgundy : "#d1d5db" }}
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Trust footer */}
      <div className="flex-none px-3 py-1.5 flex items-center justify-center gap-3 text-[9px] text-gray-400 border-t" style={{ borderColor: `${B.gold}10` }}>
        <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" /> Private & Confidential</span>
        <span>|</span>
        <span>No obligation</span>
        <span>|</span>
        <span>Sarah responds personally</span>
      </div>
    </div>
  );
}
