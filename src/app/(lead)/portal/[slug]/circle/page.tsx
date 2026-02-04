"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Send, Loader2, Sparkles, Volume2, Gift, Users, Play, Pause, Trophy, Clock, Target, CheckCircle2, Circle } from "lucide-react";

// =============================================================================
// BRAND COLORS - Gold Metal Premium Theme
// =============================================================================
const BRAND = {
    burgundy: "#722F37",
    burgundyDark: "#5a252c",
    gold: "#C9A227",
    goldLight: "#D4AF37",
    goldMetallic: "linear-gradient(135deg, #C9A227 0%, #D4AF37 25%, #E8C547 50%, #D4AF37 75%, #C9A227 100%)",
    cream: "#FDF8F3",
    creamLight: "#FFFBF5",
};

// Lesson metadata for gamification
const LESSON_TITLES = [
    { num: 1, title: "Your Story Is Your #1 Asset", goal: "Write 3 health struggles you've overcome" },
    { num: 2, title: "Find Your First 3 Clients", goal: "Text ONE person with the script" },
    { num: 3, title: "Charging What You're Worth", goal: "Decide your first package price" },
    { num: 4, title: "Legal Protection Made Simple", goal: "Download and customize templates" },
    { num: 5, title: "Tech for Non-Techy Women", goal: "Set up Calendly with 2-3 slots" },
    { num: 6, title: "Marketing for Women 40+", goal: "Join 2 Facebook groups" },
    { num: 7, title: "Imposter Syndrome", goal: "Write 3 things you know now" },
    { num: 8, title: "Your First Consultation", goal: "Practice the discovery call script" },
    { num: 9, title: "Building Your Practice", goal: "Create your 30-day action plan" },
];

interface Message {
    id: string;
    senderType: "sarah" | "zombie" | "user";
    senderName: string;
    senderAvatar?: string;
    content: string;
    audioUrl?: string;
    sentAt?: string;
    createdAt: string;
}

interface PodData {
    hasPod: boolean;
    message?: string;
    phase: "pre_completion" | "post_completion";
    pod?: {
        id: string;
        status: string;
        currentDay: number;
        startedAt: string;
        examPassed: boolean;
        deadlineAt?: string;
    };
    zombie?: {
        name: string;
        avatar?: string;
        background?: string;
    };
    messages?: Message[];
    hasMore?: boolean;
    oldestMessageId?: string;
    progress?: {
        userLessons: number;
        zombieLessons: number;
        totalLessons: number;
    };
}

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Audio Player Component
function AudioPlayer({ url }: { url: string }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateProgress = () => setProgress((audio.currentTime / audio.duration) * 100 || 0);
        const handleEnded = () => { setIsPlaying(false); setProgress(0); };

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    return (
        <div className="flex items-center gap-3 mt-3 p-3 rounded-xl" style={{ background: `${BRAND.gold}15` }}>
            <audio ref={audioRef} src={url} preload="metadata" />
            <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 hover:scale-105"
                style={{ background: BRAND.goldMetallic }}
            >
                {isPlaying ? <Pause className="w-5 h-5 text-white" fill="white" /> : <Play className="w-5 h-5 text-white ml-0.5" fill="white" />}
            </button>
            <div className="flex-1">
                <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: BRAND.gold }} />
                </div>
                <p className="text-xs mt-1" style={{ color: BRAND.gold }}>Voice Message</p>
            </div>
            <Volume2 className="w-5 h-5" style={{ color: BRAND.gold }} />
        </div>
    );
}

// Progress Bar Component - Compact inline version
function ProgressBar({ value, max, avatar, name, isCurrent }: { value: number; max: number; avatar?: string; name: string; isCurrent?: boolean }) {
    const percentage = (value / max) * 100;
    return (
        <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${isCurrent ? "ring-1 ring-amber-400 bg-amber-50" : "bg-white/60"}`}>
            <div className="w-7 h-7 rounded-full p-0.5 flex-shrink-0" style={{ background: BRAND.goldMetallic }}>
                <Image src={avatar || "/default-avatar.png"} alt={name} width={26} height={26} className="rounded-full object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="font-medium truncate" style={{ color: BRAND.burgundy }}>{name}</span>
                    <span className="font-bold" style={{ color: BRAND.gold }}>{value}/{max}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, background: BRAND.goldMetallic }} />
                </div>
            </div>
            {value === max && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
        </div>
    );
}

export default function CirclePodPage() {
    const [podData, setPodData] = useState<PodData | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchPod();
        // Removed auto-refresh - causes UI issues. User can refresh manually or on message send.
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [podData?.messages]);

    const fetchPod = async () => {
        try {
            const res = await fetch("/api/masterclass-pod");
            const data = await res.json();
            setPodData(data);
        } catch (err) {
            console.error("Failed to fetch pod:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (!podData?.hasMore || !podData?.oldestMessageId || loadingMore) return;
        setLoadingMore(true);
        try {
            const res = await fetch(`/api/masterclass-pod?cursor=${podData.oldestMessageId}`);
            const data = await res.json();
            if (data.messages?.length) {
                // Prepend older messages
                setPodData(prev => prev ? {
                    ...prev,
                    messages: [...data.messages, ...(prev.messages || [])],
                    hasMore: data.hasMore,
                    oldestMessageId: data.oldestMessageId,
                } : data);
            }
        } catch (err) {
            console.error("Failed to load more:", err);
        } finally {
            setLoadingMore(false);
        }
    };

    const sendMessage = async () => {
        if (!message.trim() || sending) return;
        setSending(true);
        try {
            const res = await fetch("/api/masterclass-pod", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: message.trim() }),
            });
            if (res.ok) {
                setMessage("");
                fetchPod();
            }
        } catch (err) {
            console.error("Failed to send message:", err);
        } finally {
            setSending(false);
        }
    };

    const getMessageTime = (msg: Message) => msg.sentAt || msg.createdAt;

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return "Today";
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
        return date.toLocaleDateString([], { month: "short", day: "numeric" });
    };

    const getTimeRemaining = () => {
        if (!podData?.pod?.deadlineAt) return null;
        const deadline = new Date(podData.pod.deadlineAt);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();
        if (diff <= 0) return "Expired";
        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);
        return `${hours}h ${mins}m remaining`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: `linear-gradient(to bottom, ${BRAND.cream}, ${BRAND.creamLight})` }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center animate-pulse" style={{ background: BRAND.goldMetallic }}>
                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                    </div>
                    <p className="text-lg font-medium" style={{ color: BRAND.burgundy }}>Loading Circle Pod...</p>
                </div>
            </div>
        );
    }

    if (!podData?.hasPod) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: `linear-gradient(to bottom, ${BRAND.cream}, ${BRAND.creamLight})` }}>
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-xl" style={{ background: BRAND.goldMetallic }}>
                    <Users className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Your Circle Pod</h1>
                <p className="text-lg text-gray-600 mb-8 max-w-md">{podData?.message || "Setting up your study group..."}</p>
                <button onClick={() => window.location.reload()} className="px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105" style={{ background: BRAND.goldMetallic }}>
                    Refresh
                </button>
            </div>
        );
    }

    const { pod, zombie, messages = [], progress } = podData;
    const userLessons = progress?.userLessons || 0;
    const zombieLessons = progress?.zombieLessons || Math.min(userLessons + 2, 9); // Zombie is ahead
    const totalLessons = 9;
    const currentLesson = LESSON_TITLES[userLessons] || LESSON_TITLES[0];
    const timeRemaining = getTimeRemaining();

    return (
        <div className="min-h-screen flex flex-col" style={{ background: `linear-gradient(to bottom, ${BRAND.cream}, ${BRAND.creamLight})` }}>
            {/* Header with Progress - COMPACT */}
            <div className="sticky top-0 z-10 backdrop-blur-md shadow-sm" style={{ background: "rgba(255, 255, 255, 0.95)", borderBottom: `2px solid ${BRAND.gold}30` }}>
                <div className="max-w-4xl mx-auto px-4 py-3">
                    {/* Compact Header Row */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Avatar Stack + Title */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full p-0.5" style={{ background: BRAND.goldMetallic }}>
                                    <Image src={SARAH_AVATAR} alt="Sarah" width={38} height={38} className="rounded-full object-cover w-full h-full" />
                                </div>
                                {zombie?.avatar && (
                                    <div className="absolute -right-1 -bottom-1 w-6 h-6 rounded-full p-0.5" style={{ background: BRAND.goldMetallic }}>
                                        <Image src={zombie.avatar} alt={zombie.name || "Partner"} width={22} height={22} className="rounded-full object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="font-bold text-base" style={{ color: BRAND.burgundy }}>Cohort #110</h1>
                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white animate-pulse" style={{ background: "#22c55e" }}>LIVE</span>
                                </div>
                                <p className="text-xs text-gray-500">with Sarah & {zombie?.name || "partner"}</p>
                            </div>
                        </div>

                        {/* Center: Compact Progress Bars */}
                        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
                            <ProgressBar value={zombieLessons} max={totalLessons} avatar={zombie?.avatar} name={zombie?.name || "Partner"} />
                            <ProgressBar value={userLessons} max={totalLessons} avatar="/default-avatar.png" name="You" isCurrent />
                        </div>

                        {/* Right: Time Remaining */}
                        {timeRemaining && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
                                <Clock className="w-3.5 h-3.5" style={{ color: BRAND.gold }} />
                                <span className="text-xs font-medium" style={{ color: BRAND.burgundy }}>{timeRemaining}</span>
                            </div>
                        )}
                    </div>

                    {/* Mobile Progress - Condensed row */}
                    <div className="flex md:hidden items-center gap-2 mt-2">
                        <ProgressBar value={zombieLessons} max={totalLessons} avatar={zombie?.avatar} name={zombie?.name || "Partner"} />
                        <ProgressBar value={userLessons} max={totalLessons} avatar="/default-avatar.png" name="You" isCurrent />
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 max-w-4xl mx-auto w-full">
                {/* Next Lesson CTA - Compact inline card */}
                {userLessons < totalLessons && (
                    <Link
                        href={`lesson/${userLessons + 1}`}
                        className="block mb-4 p-3 rounded-xl border transition-all hover:shadow-md hover:scale-[1.01]"
                        style={{ background: `linear-gradient(135deg, ${BRAND.gold}08 0%, ${BRAND.gold}03 100%)`, borderColor: `${BRAND.gold}30` }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BRAND.goldMetallic }}>
                                    <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold" style={{ color: BRAND.gold }}>NEXT: Lesson {currentLesson.num}</p>
                                    <p className="text-xs" style={{ color: BRAND.burgundy }}>{currentLesson.title}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400">🎯 {currentLesson.goal}</span>
                        </div>
                    </Link>
                )}

                {/* Exam Ready CTA */}
                {userLessons >= totalLessons && !pod?.examPassed && (
                    <Link
                        href="exam"
                        className="block mb-4 p-3 rounded-xl border transition-all hover:shadow-md animate-pulse"
                        style={{ background: `linear-gradient(135deg, #22c55e15 0%, #22c55e05 100%)`, borderColor: "#22c55e40" }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500">
                                    <Trophy className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-green-700">EXAM UNLOCKED!</p>
                                    <p className="text-xs text-green-600">25 questions • 80% to pass</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                )}

                {messages.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: BRAND.goldMetallic }}>
                            <Users className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-lg font-medium" style={{ color: BRAND.burgundy }}>Your Circle Pod is getting ready...</p>
                        <p className="text-sm mt-2 text-gray-400">Messages from Sarah and your study partner will appear here!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Load More Button */}
                        {podData?.hasMore && (
                            <div className="text-center pb-4">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 disabled:opacity-50"
                                    style={{ background: `${BRAND.gold}15`, color: BRAND.gold, border: `1px solid ${BRAND.gold}30` }}
                                >
                                    {loadingMore ? "Loading..." : "↑ Load earlier messages"}
                                </button>
                            </div>
                        )}
                        {messages.map((msg, idx) => {
                            const isUser = msg.senderType === "user";
                            const isSarah = msg.senderType === "sarah";
                            const msgTime = getMessageTime(msg);
                            const showDate = idx === 0 || formatDate(getMessageTime(msg)) !== formatDate(getMessageTime(messages[idx - 1]));

                            return (
                                <div key={msg.id}>
                                    {showDate && (
                                        <div className="text-center py-4">
                                            <span className="text-sm px-4 py-2 rounded-full font-medium" style={{ background: `${BRAND.gold}20`, color: BRAND.gold }}>
                                                {formatDate(msgTime)}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex ${isUser ? "justify-end" : "justify-start"} gap-3`}>
                                        {!isUser && (
                                            <div className="w-12 h-12 rounded-full p-0.5 self-end flex-shrink-0" style={{ background: isSarah ? BRAND.goldMetallic : `${BRAND.gold}50` }}>
                                                <Image
                                                    src={msg.senderAvatar || (isSarah ? SARAH_AVATAR : "/default-avatar.png")}
                                                    alt={msg.senderName}
                                                    width={44}
                                                    height={44}
                                                    className="rounded-full object-cover w-full h-full"
                                                />
                                            </div>
                                        )}
                                        <div
                                            className={`max-w-[85%] md:max-w-[70%] rounded-3xl px-5 py-4 ${isUser ? "rounded-br-lg" : "rounded-bl-lg"}`}
                                            style={
                                                isUser
                                                    ? { background: BRAND.burgundy, color: "white" }
                                                    : isSarah
                                                        ? { background: "white", border: `2px solid ${BRAND.gold}40`, borderLeft: `4px solid ${BRAND.gold}`, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
                                                        : { background: "#FEF9F0", border: `1px solid ${BRAND.gold}30` }
                                            }
                                        >
                                            {!isUser && (
                                                <p className="text-sm font-bold mb-2" style={{ color: isSarah ? BRAND.gold : BRAND.burgundy }}>
                                                    {msg.senderName} {isSarah && "✨"}
                                                </p>
                                            )}
                                            <p className={`text-base leading-relaxed whitespace-pre-wrap ${isUser ? "text-white" : "text-gray-800"}`}>
                                                {msg.content}
                                            </p>
                                            {msg.audioUrl && <AudioPlayer url={msg.audioUrl} />}
                                            <p className="text-xs mt-2 text-right" style={{ color: isUser ? "rgba(255,255,255,0.6)" : "#9ca3af" }}>
                                                {formatTime(msgTime)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="sticky bottom-0 border-t-2 px-4 py-4 safe-pb" style={{ background: "rgba(255, 255, 255, 0.98)", borderColor: `${BRAND.gold}30` }}>
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        placeholder="Share with the group..."
                        className="flex-1 px-6 py-4 rounded-full text-base outline-none transition-all"
                        style={{ border: `2px solid ${BRAND.gold}40`, background: "white", fontSize: "16px" }}
                        onFocus={(e) => e.target.style.borderColor = BRAND.gold}
                        onBlur={(e) => e.target.style.borderColor = `${BRAND.gold}40`}
                        disabled={sending}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!message.trim() || sending}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-all hover:scale-110 hover:shadow-xl disabled:hover:scale-100"
                        style={{ background: BRAND.burgundy }}
                    >
                        {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
