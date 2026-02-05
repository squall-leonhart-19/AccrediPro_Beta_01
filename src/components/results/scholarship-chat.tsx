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
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline hover:opacity-80 break-all ${
            isFromUser ? "text-blue-200" : "text-blue-600"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
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

// ─── Human-readable quiz labels ──────────────────────────────────
const INCOME_LABELS: Record<string, string> = {
  "0": "$0/month", "under-2k": "under $2K/month", "2k-5k": "$2K-$5K/month", "over-5k": "over $5K/month",
};
const GOAL_LABELS: Record<string, string> = {
  "5k": "$5,000/month", "10k": "$10,000/month", "20k": "$20,000/month", "50k-plus": "$50,000+/month",
};
const TYPE_LABELS: Record<string, string> = {
  "hormone-health": "Hormone Health", "gut-restoration": "Gut Restoration",
  "metabolic-optimization": "Metabolic Optimization", "burnout-recovery": "Burnout Recovery",
  "autoimmune-support": "Autoimmune Support",
};
const EXPERIENCE_LABELS: Record<string, string> = {
  "active-clients": "active clients", "past-clients": "past clients (took a break)",
  "informal": "informal (friends & family)", "no-experience": "no direct experience yet",
};
const VISION_LABELS: Record<string, string> = {
  "leave-job": "leave my 9-to-5", "security": "financial security",
  "fulfillment": "fulfillment & meaningful work", "all-above": "the complete transformation",
};

// ─── Helpers ──────────────────────────────────────────────────────
function saveChat(data: StoredChat) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
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
        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
          isFromUser ? "bg-white/20 hover:bg-white/30 text-white" : "bg-white hover:bg-gray-50 shadow-sm"
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
                className={`w-1 rounded-full transition-all ${
                  isFromUser
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottom = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const welcomeTimers = useRef<NodeJS.Timeout[]>([]);
  const urgencyIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const welcomeAudioRef = useRef<HTMLAudioElement | null>(null);

  // ─── Restore from localStorage on mount ─────────────────────────
  useEffect(() => {
    const stored = loadChat();
    if (stored && stored.email === email) {
      setVisitorId(stored.visitorId);
      setMessages(stored.messages);
      setHasStarted(stored.hasStarted);
      setWelcomeDone(stored.welcomeDone);
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
  useEffect(() => {
    if (!visitorId || !hasStarted) return;
    let interval: NodeJS.Timeout | null = null;

    const fetchMessages = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch(`/api/chat/messages?visitorId=${visitorId}`);
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          const serverMessages: ChatMessage[] = data.messages.map((m: any) => ({
            id: m.id || `srv-${Math.random().toString(36).substr(2, 6)}`,
            role: m.role === "user" ? "user" as const : "sarah" as const,
            content: m.text,
            timestamp: m.createdAt || new Date().toISOString(),
            fromServer: true,
            audioUrl: m.audioUrl, // Support for audio messages
          }));

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
            // Keep local-only messages (not yet synced to server) that are newer than any server message
            const serverTimestamps = new Set(serverMessages.map(m => m.timestamp));
            const serverContents = new Set(serverMessages.map(m => m.content));
            const latestServerTime = serverMessages.length > 0
              ? Math.max(...serverMessages.map(m => new Date(m.timestamp).getTime()))
              : 0;

            // Keep local messages that:
            // 1. Aren't duplicates of server messages (by content)
            // 2. Are newer than the latest server message (still pending sync)
            const pendingLocalMsgs = prev.filter(m =>
              !m.fromServer &&
              !serverContents.has(m.content) &&
              new Date(m.timestamp).getTime() > latestServerTime
            );

            // Merge server messages + pending local messages
            const merged = [...serverMessages, ...pendingLocalMsgs];
            merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            // Only update if actually different (by content, not IDs which change)
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
  }, [visitorId, hasStarted, urgencyTimer]);

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
    if (!visitorId) {
      console.error("[Scholarship Chat] No visitorId - cannot start chat");
      return;
    }
    console.log("[Scholarship Chat] Starting chat for visitor:", visitorId);
    setHasStarted(true);

    // 1. Register optin
    try {
      await fetch("/api/chat/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          name: `${firstName} ${lastName}`.trim(),
          email,
          page: `scholarship-${page}`,
        }),
      });
    } catch {}

    // 1b. Submit scholarship application (creates lead + sends email)
    try {
      await fetch("/api/scholarship/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          visitorId,
          quizData,
          page,
        }),
      });
    } catch {}

    // 2. Send application data to admin panel (silent)
    const applicationSummary = [
      `SCHOLARSHIP APPLICATION`,
      `Name: ${firstName} ${lastName}`,
      `Email: ${email}`,
      `Specialization: ${TYPE_LABELS[quizData.type] || quizData.type}`,
      `Income Goal: ${GOAL_LABELS[quizData.goal] || quizData.goal}`,
      `Current Income: ${INCOME_LABELS[quizData.currentIncome] || quizData.currentIncome}`,
      `Experience: ${EXPERIENCE_LABELS[quizData.experience] || quizData.experience}`,
      `Clinical Readiness: ${quizData.clinicalReady}`,
      `Lab Interest: ${quizData.labInterest}`,
      `Past Certs: ${quizData.pastCerts}`,
      `Missing Skill: ${quizData.missingSkill}`,
      `Commitment: ${quizData.commitment}`,
      `Vision: ${VISION_LABELS[quizData.vision] || quizData.vision}`,
      `Start Timeline: ${quizData.startTimeline}`,
      `Page: ${page}`,
    ].join("\n");

    try {
      await fetch("/api/chat/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: applicationSummary,
          page: `scholarship-${page}`,
          visitorId,
          userName: `${firstName} ${lastName}`.trim(),
          userEmail: email,
          isFromVisitor: true, // This is visitor's application data
        }),
      });
    } catch {}

    // 3. Sarah's welcome sequence — DELAYED for natural feel
    const incomeLabel = INCOME_LABELS[quizData.currentIncome] || "$0/month";
    const goalLabel = GOAL_LABELS[quizData.goal] || "$10,000/month";
    const typeLabel = TYPE_LABELS[quizData.type] || "your specialization";

    // Helper to save Sarah's message to database (so admin can see it)
    const saveSarahMessage = async (content: string) => {
      try {
        const res = await fetch("/api/chat/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            page: `scholarship-${page}`,
            visitorId,
            userName: `${firstName} ${lastName}`.trim(),
            userEmail: email,
            isFromVisitor: false, // This is Sarah's message
            repliedBy: "Sarah M. (Auto)",
          }),
        });
        if (!res.ok) {
          console.error("[Scholarship Chat] Failed to save Sarah message:", await res.text());
        }
      } catch (err) {
        console.error("[Scholarship Chat] Error saving Sarah message:", err);
      }
    };

    // NEW WELCOME SEQUENCE - Clear "Name Your Price" Scholarship Model
    const msg1Content = `Hey ${firstName}! 🎉 AMAZING news — you QUALIFY for our ASI Scholarship Program!`;
    const msg1: ChatMessage = {
      id: "sarah-1",
      role: "sarah",
      content: msg1Content,
      timestamp: new Date().toISOString(),
    };

    // Pre-fetch welcome audio from ElevenLabs (Sarah's voice)
    const fetchWelcomeAudio = async () => {
      try {
        const res = await fetch("/api/scholarship/welcome-audio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName }),
        });
        const data = await res.json();
        if (data.success && data.audio) {
          setWelcomeAudioUrl(data.audio);
          // Pre-load the audio
          const audio = new Audio(data.audio);
          audio.preload = "auto";
          welcomeAudioRef.current = audio;
          audio.addEventListener("ended", () => setIsPlayingWelcomeAudio(false));
          audio.addEventListener("error", () => setIsPlayingWelcomeAudio(false));
        }
      } catch (err) {
        console.log("Welcome audio fetch failed (non-critical):", err);
      }
    };
    fetchWelcomeAudio(); // Start fetching immediately

    // Delay message 1 by 3 seconds (Sarah "reading" the application)
    const t1 = setTimeout(() => {
      setIsTyping(true);
      const t1b = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, msg1]);
        saveSarahMessage(msg1Content); // Save to DB for admin

        // 🎵 Play welcome audio 2 seconds after message 1 appears
        const audioTimer = setTimeout(() => {
          if (welcomeAudioRef.current) {
            welcomeAudioRef.current.play()
              .then(() => setIsPlayingWelcomeAudio(true))
              .catch((err) => console.log("Audio autoplay blocked:", err));
          }
        }, 2000);
        welcomeTimers.current.push(audioTimer);

        // Delay message 2 by 6-8 more seconds
        const t2 = setTimeout(() => {
          setIsTyping(true);
          const t2b = setTimeout(() => {
            setIsTyping(false);

            // Message 2: Explain the scholarship model clearly (NO scary price!)
            const msg2Content = `Here's how our scholarship works:\n\n✨ You tell us what you can invest\n🏛️ The Institute covers THE REST\n🎓 You get the FULL certification + 9 specializations\n\n👉 This is a ONE-TIME payment — not monthly, not recurring. Just one investment and you're in for LIFE.`;

            const msg2: ChatMessage = {
              id: "sarah-2",
              role: "sarah",
              content: msg2Content,
              timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, msg2]);
            saveSarahMessage(msg2Content); // Save to DB for admin

            // Delay message 3 by another 8-10 seconds (the scholarship ask)
            const t3 = setTimeout(() => {
              setIsTyping(true);
              const t3b = setTimeout(() => {
                setIsTyping(false);

                // Message 3: Ask for their number - NO example amounts, add "I'll call the Institute"
                const msg3Content = `So ${firstName}, what amount can you realistically invest in yourself TODAY?\n\nType ANY number — there's no wrong answer. I'll call the Institute right now and see if they can cover the rest for you! 📞`;

                const msg3: ChatMessage = {
                  id: "sarah-3",
                  role: "sarah",
                  content: msg3Content,
                  timestamp: new Date().toISOString(),
                };
                setMessages(prev => [...prev, msg3]);
                saveSarahMessage(msg3Content); // Save to DB for admin
                setWelcomeDone(true);
              }, 4000); // Typing duration for msg3
              welcomeTimers.current.push(t3b);
            }, 8000); // Wait before msg3
            welcomeTimers.current.push(t3);
          }, 3500); // Typing duration for msg2
          welcomeTimers.current.push(t2b);
        }, 6000); // Wait before msg2
        welcomeTimers.current.push(t2);
      }, 2500); // Typing duration for msg1
      welcomeTimers.current.push(t1b);
    }, 3000); // Initial delay
    welcomeTimers.current.push(t1);
  }, [hasStarted, firstName, lastName, email, quizData, visitorId, page]);

  // ─── Open chat ─────────────────────────────────────────────────
  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!hasStarted) {
      startScholarshipChat();
    }
  }, [hasStarted, startScholarshipChat]);

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
    } catch {}

    // INSTANT AUTO-RESPONSE if they typed a number (their scholarship amount)
    const hasNumber = /\$?\d+/.test(userMessage);
    if (hasNumber && messages.length <= 5) { // Only for first number submission
      // Show typing indicator briefly
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const autoResponse: ChatMessage = {
            id: `sarah-auto-${Date.now()}`,
            role: "sarah",
            content: `Got it! 🙏 Let me call the Institute right now to check if they can cover the rest for you...\n\n⏳ Hold tight — I'll be back in just a moment with your scholarship decision!`,
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, autoResponse]);
          // Also save to DB so admin can see it
          fetch("/api/chat/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              message: autoResponse.content,
              page: `scholarship-${page}`,
              visitorId,
              userName: `${firstName} ${lastName}`.trim(),
              userEmail: email,
              isFromVisitor: false,
              repliedBy: "Sarah M. (Auto)",
            }),
          }).catch((err) => console.error("[Scholarship Chat] Auto-response save error:", err));
        }, 2000);
      }, 1000);
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
    <div className="fixed bottom-0 right-0 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-50 w-full sm:w-[400px] sm:max-w-[calc(100vw-32px)] bg-white sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col" style={{ height: "min(600px, 85vh)" }}>
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
              className={`max-w-[82%] p-3 sm:p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
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
                    if (welcomeAudioRef.current) {
                      if (isPlayingWelcomeAudio) {
                        welcomeAudioRef.current.pause();
                        setIsPlayingWelcomeAudio(false);
                      } else {
                        welcomeAudioRef.current.currentTime = 0;
                        welcomeAudioRef.current.play()
                          .then(() => setIsPlayingWelcomeAudio(true))
                          .catch(() => {});
                      }
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
              <span className="text-[10px] text-gray-400 ml-1">Sarah is typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-none p-2.5 sm:p-3 bg-white border-t flex gap-2" style={{ borderColor: `${B.gold}20` }}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={welcomeDone ? "Type your message..." : "Sarah is reviewing your results..."}
          disabled={!welcomeDone}
          className="flex-1 border rounded-full px-4 py-2.5 text-sm focus:outline-none transition-colors disabled:bg-gray-50 disabled:text-gray-400"
          style={{ borderColor: `${B.gold}40` }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim() || !welcomeDone}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-40"
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
