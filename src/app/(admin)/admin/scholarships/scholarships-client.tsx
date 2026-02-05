"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  GraduationCap,
  Send,
  User,
  Clock,
  RefreshCw,
  Search,
  Filter,
  StickyNote,
  Zap,
  Mail,
  DollarSign,
  Target,
  Briefcase,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Bell,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Phone,
  Calendar,
  Download,
  Mic,
  Square,
  Volume2,
  Play,
  Pause,
  Trash2,
  Bot,
  Timer,
  X,
} from "lucide-react";
import Image from "next/image";

interface ChatMessage {
  id: string;
  visitorId: string;
  page: string;
  message: string;
  isFromVisitor: boolean;
  isRead: boolean;
  createdAt: string;
  repliedBy?: string | null;
}

interface ScholarshipApplication {
  visitorId: string;
  visitorName: string | null;
  visitorEmail: string | null;
  visitorPhone?: string | null;
  page: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  scholarshipExpiresAt?: string | null;
  applicationData?: {
    specialization?: string;
    incomeGoal?: string;
    currentIncome?: string;
    experience?: string;
    clinicalReady?: string;
    labInterest?: string;
    pastCerts?: string;
    missingSkill?: string;
    commitment?: string;
    vision?: string;
    startTimeline?: string;
  };
}

// Helper to render message with clickable links
function renderMessageWithLinks(text: string, isFromVisitor: boolean) {
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
          className={`underline hover:opacity-80 break-all ${isFromVisitor ? "text-blue-600" : "text-blue-200"
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

// Scholarship quick reply templates
const SCHOLARSHIP_REPLIES = [
  {
    label: "⏳ Bear With Me",
    text: "Hold on! 🙏 Let me call the Institute right now to check on your scholarship approval. I'll be back in just a moment... ⏳",
    color: "bg-amber-50 border-amber-300 text-amber-700",
    isAutoStep: "initiate" as const,
  },
  {
    label: "🎉 APPROVED",
    text: "🎉 AMAZING NEWS!\n\nI just got off the phone with the Institute and they've APPROVED your scholarship!\n\n✅ Your scholarship has been approved for [AMOUNT]\n✅ Full FM Certification access\n✅ 9 Clinical Certifications\n✅ Lifetime access + mentorship\n\n⚠️ IMPORTANT: This scholarship approval is only valid for the next 24 HOURS. After that, I'll have to resubmit your application.\n\nReady to lock in your spot? Just reply \"YES\" and I'll send you the secure payment link right now! 💜",
    color: "bg-green-100 border-green-300 text-green-700 font-bold",
    isAutoStep: "approve" as const,
  },
  {
    label: "👋 Hello",
    text: "Hey! I just received your scholarship application. Give me a moment to review everything... 💜",
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    label: "✅ Approved",
    text: "Great news! I've reviewed your application and I'm happy to approve a scholarship for you. With your scholarship, you'll only pay [AMOUNT]. This covers everything - 9 certifications, mentorship, and lifetime access. Ready to get started? 🎉",
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    label: "🤝 Counter",
    text: "I appreciate you sharing what's comfortable for you. Here's what I can do - I can meet you at [AMOUNT]. This is a special scholarship rate that still includes everything you need. What do you think?",
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },
  {
    label: "💰 Budget?",
    text: "Thanks for applying! To find the right scholarship level for you, what investment feels comfortable for your situation right now? There's no wrong answer.",
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    label: "📅 Plan",
    text: "I understand budget can be tight. What if we set up a payment plan? You could start with [AMOUNT] today and then [AMOUNT]/month. Would that work better?",
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    label: "🔔 Follow Up",
    text: "Hey! Just checking in on your scholarship application. Did you have any questions? I'm here to help! 💜",
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    label: "💳 Link",
    text: "Perfect! Here's your secure payment link to lock in your scholarship:\n\n🔗 [PAYMENT LINK]\n\nThis link is only valid for the next 24 hours. Once you complete the payment, you'll get instant access to everything! 💜",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    label: "⏰ Urgency",
    text: "Hey! Just a quick reminder - your scholarship expires soon. I really don't want you to miss this opportunity! Are you ready to proceed? 💜",
    color: "bg-red-50 border-red-200 text-red-700",
  },
];

// Parse application data from the initial message
function parseApplicationMessage(messages: ChatMessage[]): ScholarshipApplication["applicationData"] {
  const applicationMsg = messages.find(m => m.message.includes("SCHOLARSHIP APPLICATION"));
  if (!applicationMsg) return undefined;

  const lines = applicationMsg.message.split("\n");
  const data: ScholarshipApplication["applicationData"] = {};

  lines.forEach(line => {
    if (line.startsWith("Specialization:")) data.specialization = line.replace("Specialization:", "").trim();
    if (line.startsWith("Income Goal:")) data.incomeGoal = line.replace("Income Goal:", "").trim();
    if (line.startsWith("Current Income:")) data.currentIncome = line.replace("Current Income:", "").trim();
    if (line.startsWith("Experience:")) data.experience = line.replace("Experience:", "").trim();
    if (line.startsWith("Clinical Readiness:")) data.clinicalReady = line.replace("Clinical Readiness:", "").trim();
    if (line.startsWith("Lab Interest:")) data.labInterest = line.replace("Lab Interest:", "").trim();
    if (line.startsWith("Past Certs:")) data.pastCerts = line.replace("Past Certs:", "").trim();
    if (line.startsWith("Missing Skill:")) data.missingSkill = line.replace("Missing Skill:", "").trim();
    if (line.startsWith("Commitment:")) data.commitment = line.replace("Commitment:", "").trim();
    if (line.startsWith("Vision:")) data.vision = line.replace("Vision:", "").trim();
    if (line.startsWith("Start Timeline:")) data.startTimeline = line.replace("Start Timeline:", "").trim();
  });

  return data;
}

// Check if visitor is "online" (active in last 5 minutes)
const isOnline = (lastMessageAt: string) => {
  const lastActive = new Date(lastMessageAt).getTime();
  const now = Date.now();
  return now - lastActive < 5 * 60 * 1000;
};

// Get user's offered amount from messages
const getUserOfferedAmount = (messages: ChatMessage[]) => {
  const userMessages = messages.filter(m => m.isFromVisitor && !m.message.includes("SCHOLARSHIP APPLICATION"));
  for (const msg of userMessages) {
    const match = msg.message.match(/\$?(\d{1,3}(?:,?\d{3})*(?:\.\d{2})?)/);
    if (match) {
      return match[0].startsWith("$") ? match[0] : `$${match[0]}`;
    }
  }
  return null;
};

// Calculate time remaining
const getTimeRemaining = (expiresAt: string | null | undefined) => {
  if (!expiresAt) return null;
  const now = Date.now();
  const expires = new Date(expiresAt).getTime();
  const remaining = expires - now;
  if (remaining <= 0) return { expired: true, text: "Expired" };

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) return { expired: false, text: `${hours}h ${minutes}m left` };
  return { expired: false, text: `${minutes}m left` };
};

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Audio player component
function AudioMessageAdmin({ url, isFromVisitor }: { url: string; isFromVisitor: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;
    const audio = new Audio(url);
    audioRef.current = audio;

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

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg ${isFromVisitor ? "bg-gray-200" : "bg-white/10"}`}>
      <button
        onClick={togglePlay}
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isFromVisitor ? "bg-white shadow-sm text-gray-700" : "bg-white/20 text-white"
          }`}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-0.5 h-5">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all ${(i / 16) * 100 <= progress
                  ? (isFromVisitor ? "bg-gray-600" : "bg-white")
                  : (isFromVisitor ? "bg-gray-300" : "bg-white/30")
                }`}
              style={{ height: `${6 + Math.random() * 10}px` }}
            />
          ))}
        </div>
      </div>
      <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${isFromVisitor ? "text-gray-400" : "text-white/40"}`} />
    </div>
  );
}

export default function ScholarshipsClient() {
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<ScholarshipApplication | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "unread" | "responded">("all");
  const [visitorNotes, setVisitorNotes] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoApproveStep, setAutoApproveStep] = useState<"idle" | "initiating" | "waiting" | "approving">("idle");
  const [autoApproveCountdown, setAutoApproveCountdown] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<{ blob: Blob; url: string } | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedVisitorIdRef = useRef<string | null>(null);
  const prevUnreadCountRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize notification sound
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.volume = 0.5;
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      setNotificationsEnabled(true);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") {
      alert("Notifications not supported");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      new Notification("🎓 Notifications Enabled!", {
        body: "You'll receive alerts for new scholarship messages",
        icon: "/favicon.ico",
      });
    }
  };

  // Notify new message
  const notifyNewMessage = useCallback((appName: string, message: string) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
    if (notificationsEnabled && typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(`🎓 New Scholarship Message`, {
        body: `${appName}: ${message.substring(0, 100)}${message.length > 100 ? "..." : ""}`,
        icon: "/favicon.ico",
        tag: "scholarship-notification",
        requireInteraction: true,
      });
    }
  }, [notificationsEnabled]);

  // Keep ref in sync
  useEffect(() => {
    selectedVisitorIdRef.current = selectedApp?.visitorId || null;
  }, [selectedApp?.visitorId]);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/scholarships");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      const newApps: ScholarshipApplication[] = (data.applications || []).map((app: ScholarshipApplication) => ({
        ...app,
        applicationData: parseApplicationMessage(app.messages),
      }));

      // Check for new messages and notify
      const newTotalUnread = newApps.reduce((acc, a) => acc + a.unreadCount, 0);
      if (newTotalUnread > prevUnreadCountRef.current && prevUnreadCountRef.current >= 0 && !loading) {
        const appWithNewMsg = newApps.find(a => a.unreadCount > 0);
        if (appWithNewMsg) {
          notifyNewMessage(appWithNewMsg.visitorName || "New Applicant", appWithNewMsg.lastMessage);
        }
      }
      prevUnreadCountRef.current = newTotalUnread;

      setApplications(newApps);

      // Update selected app
      const currentVisitorId = selectedVisitorIdRef.current;
      if (currentVisitorId) {
        const updated = newApps.find(a => a.visitorId === currentVisitorId);
        if (updated) {
          setSelectedApp(updated);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setError("Failed to load. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [loading, notifyNewMessage]);

  // Poll every 2 seconds
  useEffect(() => {
    fetchApplications();
    const interval = setInterval(() => {
      if (!document.hidden) fetchApplications();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchApplications]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedApp?.messages?.length]);

  // Load notes when selecting app
  useEffect(() => {
    if (selectedApp) {
      try {
        const saved = localStorage.getItem(`scholarship_notes_${selectedApp.visitorId}`);
        setVisitorNotes(saved || "");
      } catch {
        setVisitorNotes("");
      }
    }
  }, [selectedApp?.visitorId]);

  // Send reply
  const sendReply = async (quickReplyText?: string) => {
    if (!selectedApp) return;
    const msg = quickReplyText || replyMessage;
    if (!msg.trim()) return;

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/scholarships/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: selectedApp.visitorId, message: msg }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReplyMessage("");
        setShowQuickReplies(false);
        await fetchApplications();
        textareaRef.current?.focus();
      } else {
        setError(data.error || "Failed to send");
      }
    } catch {
      setError("Network error");
    } finally {
      setSending(false);
    }
  };

  // Save notes
  const saveNotes = async () => {
    if (!selectedApp) return;
    setSavingNotes(true);
    try {
      localStorage.setItem(`scholarship_notes_${selectedApp.visitorId}`, visitorNotes);
    } finally {
      setSavingNotes(false);
    }
  };

  // Generate AI Reply
  const generateAiReply = async () => {
    if (!selectedApp) return;
    setGeneratingAi(true);
    try {
      const res = await fetch("/api/scholarship/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedApp.visitorId,
          messages: selectedApp.messages,
          visitorName: selectedApp.visitorName,
          applicationData: selectedApp.applicationData,
        }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setReplyMessage(data.reply);
        textareaRef.current?.focus();
      }
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally {
      setGeneratingAi(false);
    }
  };

  // Auto-approve with FOMO sequence
  const triggerAutoApprove = async (step: "initiate" | "approve", offeredAmount?: string) => {
    if (!selectedApp) return;

    if (step === "initiate") {
      setAutoApproveStep("initiating");
      try {
        const res = await fetch("/api/admin/scholarships/auto-approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: selectedApp.visitorId, step: "initiate" }),
        });
        if (res.ok) {
          await fetchApplications();
          setAutoApproveStep("waiting");
          setAutoApproveCountdown(30);
          const countdown = setInterval(() => {
            setAutoApproveCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdown);
                setAutoApproveStep("idle");
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } catch {
        setError("Failed to initiate auto-approve");
        setAutoApproveStep("idle");
      }
    } else if (step === "approve") {
      const amount = offeredAmount || prompt("Enter the scholarship amount (e.g., $500):");
      if (!amount) return;

      setAutoApproveStep("approving");
      try {
        const res = await fetch("/api/admin/scholarships/auto-approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: selectedApp.visitorId,
            step: "approve",
            offeredAmount: amount,
          }),
        });
        if (res.ok) {
          await fetchApplications();
          setAutoApproveStep("idle");
          setAutoApproveCountdown(0);
        }
      } catch {
        setError("Failed to send approval");
        setAutoApproveStep("idle");
      }
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diff < 1) return "Now";
    if (diff < 60) return `${diff}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return date.toLocaleDateString();
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    if (filterMode === "unread" && app.unreadCount === 0) return false;
    if (filterMode === "responded" && !app.messages.some(m => !m.isFromVisitor)) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      return app.visitorName?.toLowerCase().includes(s) ||
        app.visitorEmail?.toLowerCase().includes(s) ||
        app.lastMessage.toLowerCase().includes(s);
    }
    return true;
  });

  const totalUnread = applications.reduce((acc, a) => acc + a.unreadCount, 0);

  // Export all chats to CSV
  const [exporting, setExporting] = useState(false);

  const exportToCSV = async () => {
    if (exporting) return;
    setExporting(true);

    try {
      const res = await fetch("/api/admin/scholarships/export-csv", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const filename = res.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1]
        || `scholarship-applications-${new Date().toISOString().split("T")[0]}.csv`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Failed to export CSV. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio({ blob: audioBlob, url: audioUrl });
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      alert("Could not start recording. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const togglePreview = () => {
    if (!recordedAudio) return;
    if (!previewAudioRef.current) {
      previewAudioRef.current = new Audio(recordedAudio.url);
      previewAudioRef.current.onended = () => setIsPlayingPreview(false);
    }
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const discardRecording = () => {
    if (recordedAudio) URL.revokeObjectURL(recordedAudio.url);
    setRecordedAudio(null);
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
  };

  const sendAudioMessage = async () => {
    if (!recordedAudio || !selectedApp) return;
    setUploadingAudio(true);
    try {
      const formData = new FormData();
      formData.append("audio", recordedAudio.blob, "voice-message.webm");
      formData.append("visitorId", selectedApp.visitorId);

      const uploadRes = await fetch("/api/admin/scholarships/upload-audio", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) throw new Error("Failed to upload audio");

      const { audioUrl } = await uploadRes.json();

      const res = await fetch("/api/admin/scholarships/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId: selectedApp.visitorId,
          message: `[AUDIO:${audioUrl}]🎤 Voice message from Sarah`,
        }),
      });

      if (res.ok) {
        discardRecording();
        await fetchApplications();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (err) {
      console.error("Error sending audio:", err);
      alert("Failed to send audio message. Please try again.");
    } finally {
      setUploadingAudio(false);
    }
  };

  // Handle selecting an app
  const handleSelectApp = (app: ScholarshipApplication) => {
    setSelectedApp(app);
    setMobileSheetOpen(true);
    setShowQuickReplies(false);
    setReplyMessage("");
  };

  // Chat Content Component (shared between desktop and mobile)
  const ChatContent = () => {
    if (!selectedApp) return null;

    const timeRemaining = getTimeRemaining(selectedApp.scholarshipExpiresAt);
    const offeredAmount = getUserOfferedAmount(selectedApp.messages);

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-3 border-b bg-gradient-to-r from-[#722f37]/5 to-transparent flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="w-9 h-9 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-[#722f37] to-[#4e1f24] text-white text-sm">
                  {selectedApp.visitorName?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-900 text-sm truncate">{selectedApp.visitorName || "Applicant"}</h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="outline" className={`text-[10px] py-0 px-1 ${isOnline(selectedApp.lastMessageAt) ? "text-green-600 border-green-200" : "text-gray-400"}`}>
                    {isOnline(selectedApp.lastMessageAt) ? "Online" : "Offline"}
                  </Badge>
                  {timeRemaining && (
                    <Badge className={`text-[10px] py-0 px-1 ${timeRemaining.expired ? "bg-red-500" : "bg-amber-500"} text-white`}>
                      <Timer className="w-2.5 h-2.5 mr-0.5" />
                      {timeRemaining.text}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {offeredAmount && (
              <div className="bg-green-50 border border-green-200 rounded-lg px-2 py-1 flex-shrink-0">
                <p className="text-xs text-green-600">Offer</p>
                <p className="text-sm font-bold text-green-700">{offeredAmount}</p>
              </div>
            )}
          </div>

          {/* Application Summary */}
          {selectedApp.applicationData && (
            <div className="mt-2 flex flex-wrap gap-1">
              {selectedApp.applicationData.specialization && (
                <Badge variant="outline" className="text-[10px] py-0"><Briefcase className="w-2.5 h-2.5 mr-0.5" />{selectedApp.applicationData.specialization}</Badge>
              )}
              {selectedApp.applicationData.incomeGoal && (
                <Badge variant="outline" className="text-[10px] py-0 text-green-600 border-green-200"><Target className="w-2.5 h-2.5 mr-0.5" />{selectedApp.applicationData.incomeGoal}</Badge>
              )}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          <div className="space-y-3">
            {selectedApp.messages
              .filter(msg => !msg.message.includes("SCHOLARSHIP APPLICATION"))
              .map((msg) => (
                <div key={msg.id} className={`flex ${msg.isFromVisitor ? "justify-start" : "justify-end"}`}>
                  {msg.isFromVisitor && (
                    <Avatar className="w-7 h-7 mr-2 flex-shrink-0">
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                        {selectedApp.visitorName?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${msg.isFromVisitor
                      ? "bg-gray-100 text-gray-900 rounded-tl-sm"
                      : "bg-gradient-to-br from-[#722f37] to-[#5a252c] text-white rounded-tr-sm"
                    }`}>
                    {msg.message.startsWith("[AUDIO:") ? (
                      <div className="min-w-[180px]">
                        <AudioMessageAdmin
                          url={msg.message.match(/\[AUDIO:(https?:\/\/[^\]]+)\]/)?.[1] || ""}
                          isFromVisitor={msg.isFromVisitor}
                        />
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {renderMessageWithLinks(msg.message, msg.isFromVisitor)}
                      </p>
                    )}
                    <div className={`flex items-center gap-1 mt-1 ${msg.isFromVisitor ? "text-gray-400" : "text-white/60"}`}>
                      <span className="text-[10px]">{formatTime(msg.createdAt)}</span>
                      {!msg.isFromVisitor && <span className="text-[10px]">• Sarah</span>}
                    </div>
                  </div>
                  {!msg.isFromVisitor && (
                    <Avatar className="w-7 h-7 ml-2 flex-shrink-0">
                      <AvatarImage src={SARAH_AVATAR} alt="Sarah" />
                      <AvatarFallback className="bg-[#722f37] text-white text-xs">SM</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Replies */}
        {showQuickReplies && (
          <div className="px-3 py-2 border-t bg-purple-50/50 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-800 flex items-center gap-1">
                <Zap className="w-3 h-3" /> Templates
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowQuickReplies(false)} className="h-5 text-[10px] px-2">
                Close
              </Button>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
              {SCHOLARSHIP_REPLIES.map((qr, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (qr.isAutoStep === "initiate") triggerAutoApprove("initiate");
                    else if (qr.isAutoStep === "approve") {
                      const amt = getUserOfferedAmount(selectedApp?.messages || []);
                      triggerAutoApprove("approve", amt || undefined);
                    } else {
                      setReplyMessage(qr.text);
                      setShowQuickReplies(false);
                      textareaRef.current?.focus();
                    }
                  }}
                  className={`text-[10px] h-7 px-2 whitespace-nowrap flex-shrink-0 ${qr.color}`}
                >
                  {qr.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="px-3 py-1.5 border-t bg-yellow-50/50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <StickyNote className="w-3.5 h-3.5 text-yellow-600 flex-shrink-0" />
            <Input
              placeholder="Notes..."
              value={visitorNotes}
              onChange={(e) => setVisitorNotes(e.target.value)}
              onBlur={saveNotes}
              className="flex-1 h-7 text-xs bg-white border-yellow-200"
            />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 border-t bg-gray-50 flex-shrink-0">
          {error && (
            <div className="mb-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-lg">{error}</div>
          )}

          {/* Audio Recording UI */}
          {(isRecording || recordedAudio) && (
            <div className="mb-2 p-2 rounded-lg bg-purple-50 border border-purple-200">
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-purple-800 flex-1">Recording...</span>
                  <Button variant="outline" size="sm" onClick={stopRecording} className="h-7 text-xs bg-red-100 border-red-300 text-red-700">
                    <Square className="w-3 h-3 mr-1 fill-current" />Stop
                  </Button>
                </div>
              ) : recordedAudio && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={togglePreview} className="h-7 w-7 p-0 bg-white">
                    {isPlayingPreview ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </Button>
                  <div className="flex-1 flex items-center gap-0.5">
                    {[...Array(12)].map((_, i) => (
                      <div key={i} className="w-1 bg-purple-400 rounded-full" style={{ height: `${6 + Math.random() * 12}px` }} />
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" onClick={discardRecording} className="h-7 w-7 p-0 text-red-500">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <Button size="sm" onClick={sendAudioMessage} disabled={uploadingAudio} className="h-7 text-xs bg-[#722f37]">
                    {uploadingAudio ? <RefreshCw className="w-3 h-3 animate-spin" /> : <><Send className="w-3 h-3 mr-1" />Send</>}
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 mb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQuickReplies(!showQuickReplies)}
              className="h-8 text-xs text-[#722f37] border-[#722f37]/30"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1">Templates</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={!!recordedAudio}
              className={`h-8 text-xs ${isRecording ? "bg-red-100 border-red-300 text-red-700" : "text-purple-700 border-purple-300"}`}
            >
              <Mic className={`w-3.5 h-3.5 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={generateAiReply}
              disabled={generatingAi}
              className="h-8 text-xs text-blue-700 border-blue-300"
            >
              {generatingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline ml-1">AI</span>
            </Button>
            <span className="text-[10px] text-gray-400 ml-auto flex items-center gap-1">
              <Image src={SARAH_AVATAR} alt="Sarah" width={14} height={14} className="rounded-full" />
              <span className="hidden sm:inline">Sarah M.</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              placeholder="Type your response..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendReply();
                }
              }}
              disabled={sending || isRecording}
              className="flex-1 min-h-[44px] max-h-[100px] resize-none text-sm"
              style={{ fontSize: '16px' }} // Prevent zoom on iOS
            />
            <Button
              onClick={() => sendReply()}
              disabled={sending || !replyMessage.trim() || isRecording}
              className="bg-[#722f37] hover:bg-[#5a252c] h-auto px-3"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[100dvh] flex flex-col bg-gray-50">
      {/* Header - Compact on mobile */}
      <div className="flex-shrink-0 p-3 md:p-4 border-b bg-white">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#722f37] to-[#4e1f24] flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-xl font-bold text-gray-900">Scholarships</h1>
              <p className="text-[10px] md:text-xs text-gray-500">{applications.length} apps • {totalUnread} pending</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {!notificationsEnabled ? (
              <Button onClick={requestNotificationPermission} size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-white text-xs">
                <Bell className="w-3.5 h-3.5" />
                <span className="hidden sm:inline ml-1">Alerts</span>
              </Button>
            ) : (
              <Badge className="bg-green-100 text-green-700 border-green-200 py-1 px-2 text-xs">
                <Bell className="w-3 h-3" />
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={exportToCSV} disabled={applications.length === 0} className="h-8 text-xs">
              <Download className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="sm" onClick={fetchApplications} disabled={loading} className="h-8 text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Search & Filters - Compact */}
        <div className="mt-2 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
          <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
            {(["all", "unread", "responded"] as const).map((mode) => (
              <Button
                key={mode}
                variant={filterMode === mode ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterMode(mode)}
                className={`h-7 px-2 text-[10px] ${filterMode === mode ? "bg-[#722f37] hover:bg-[#5a252c]" : ""}`}
              >
                {mode === "all" ? "All" : mode === "unread" ? `New (${totalUnread})` : "Replied"}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content - Desktop: side by side, Mobile: list only */}
      <div className="flex-1 flex min-h-0">
        {/* Applications List */}
        <div className={`${selectedApp && !mobileSheetOpen ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 lg:w-96 border-r bg-white`}>
          <ScrollArea className="flex-1">
            {loading && applications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : filteredApps.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No applications found</div>
            ) : (
              filteredApps.map((app) => {
                const offeredAmount = getUserOfferedAmount(app.messages);
                const isSelected = selectedApp?.visitorId === app.visitorId;
                const online = isOnline(app.lastMessageAt);
                const timeRemaining = getTimeRemaining(app.scholarshipExpiresAt);

                return (
                  <div
                    key={app.visitorId}
                    onClick={() => handleSelectApp(app)}
                    className={`p-3 border-b cursor-pointer transition-all active:bg-gray-100 ${isSelected
                        ? "bg-[#722f37]/5 border-l-4 border-l-[#722f37]"
                        : "hover:bg-gray-50 border-l-4 border-l-transparent"
                      }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-br from-[#722f37] to-[#4e1f24] text-white text-sm">
                            {app.visitorName?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        {online && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-sm text-gray-900 truncate">
                            {app.visitorName || "Unknown"}
                          </span>
                          <div className="flex items-center gap-1">
                            {app.unreadCount > 0 && (
                              <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0 h-4 min-w-[18px] flex items-center justify-center">
                                {app.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {offeredAmount && (
                            <Badge className="bg-green-100 text-green-700 text-[10px] px-1 py-0">
                              {offeredAmount}
                            </Badge>
                          )}
                          {timeRemaining && (
                            <Badge className={`text-[10px] px-1 py-0 ${timeRemaining.expired ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                              <Timer className="w-2.5 h-2.5 mr-0.5" />
                              {timeRemaining.text}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {app.lastMessage.includes("SCHOLARSHIP") ? "New application" : app.lastMessage}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5 text-gray-300" />
                          <span className="text-[10px] text-gray-400">{formatTime(app.lastMessageAt)}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-gray-300 flex-shrink-0 ${isSelected ? "text-[#722f37]" : ""}`} />
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* Desktop Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-white">
          {selectedApp ? (
            <ChatContent />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">Select an application</p>
                <p className="text-xs">Choose from the list to view conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Chat Sheet */}
      <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col h-full">
          <SheetHeader className="sr-only">
            <SheetTitle>Chat with {selectedApp?.visitorName || "Applicant"}</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-2 p-3 border-b">
            <Button variant="ghost" size="sm" onClick={() => setMobileSheetOpen(false)} className="h-8 w-8 p-0">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold text-sm">{selectedApp?.visitorName || "Applicant"}</span>
          </div>
          <div className="flex-1 min-h-0">
            <ChatContent />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
