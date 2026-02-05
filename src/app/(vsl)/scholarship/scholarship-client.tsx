"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    Users,
    Clock,
    CheckCircle,
    Send,
    GraduationCap,
    Shield,
    Trophy,
    Star,
    Sparkles,
    ArrowRight,
    Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Wistia Player component using iframe embed (most reliable)
function WistiaPlayer({ onTimeUpdate }: { onTimeUpdate: (time: number) => void }) {
    // Track elapsed time since video started for chat sync
    useEffect(() => {
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            onTimeUpdate(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [onTimeUpdate]);

    return (
        <div className="w-full h-full">
            <iframe
                src="https://fast.wistia.net/embed/iframe/3go641tx38?videoFoam=true"
                title="Training Video"
                allow="autoplay; fullscreen"
                allowFullScreen
                frameBorder="0"
                scrolling="no"
                className="w-full h-full"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}

interface ChatMessage {
    id: string;
    type: "chat" | "sarah" | "enrollment" | "alert" | "system" | "user";
    content: string;
    profile?: {
        name: string;
        avatar?: string | null;
        location?: string | null;
    } | null;
    enrolleeName?: string | null;
    enrolleeLocation?: string | null;
    timestamp?: number;
}

interface ScholarshipClientProps {
    firstName: string;
    email: string;
    examScore: number;
    deadline: string;
}

// Countdown timer component
function CountdownTimer({ deadline }: { deadline: string }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const targetDate = new Date(deadline);

        const updateTimer = () => {
            const now = new Date();
            const diff = targetDate.getTime() - now.getTime();

            if (diff <= 0) {
                setIsExpired(true);
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeLeft({ hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [deadline]);

    if (isExpired) {
        return <span className="text-red-400 font-bold">EXPIRED</span>;
    }

    return (
        <span className="font-mono font-bold text-gold-400">
            {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
        </span>
    );
}

// Chat message component
function ChatMessageItem({ message }: { message: ChatMessage }) {
    if (message.type === "system") {
        return (
            <div className="text-center py-2">
                <span className="text-xs text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                    {message.content}
                </span>
            </div>
        );
    }

    if (message.type === "alert") {
        return (
            <div className="text-center py-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-900/30 px-3 py-1 rounded-full">
                    {message.content}
                </span>
            </div>
        );
    }

    if (message.type === "enrollment") {
        return (
            <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-2 my-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">🎉</span>
                    <div>
                        <span className="text-emerald-300 font-semibold text-sm">
                            {message.enrolleeName} just enrolled!
                        </span>
                        {message.enrolleeLocation && (
                            <span className="text-emerald-400/70 text-xs ml-1">
                                ({message.enrolleeLocation})
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const isHost = message.type === "sarah"; // Host messages (Dr. Michelle or Sarah intro)
    const isUser = message.type === "user";
    const isMichelle = isHost && message.profile?.name === "Dr. Michelle";

    // Determine avatar and name for host messages
    const hostAvatar = isMichelle
        ? (message.profile?.avatar || "https://assets.accredipro.academy/fm-certification/Michelle-D.webp")
        : "https://assets.accredipro.academy/fm-certification/Sarah-M.webp";
    const hostName = isMichelle ? "Dr. Michelle (Co-Host)" : "Sarah (Host)";

    return (
        <div className={cn("flex gap-2 py-1", isUser && "flex-row-reverse")}>
            {!isUser && (
                <div className={cn(
                    "w-8 h-8 rounded-full flex-shrink-0 overflow-hidden",
                    isHost ? "ring-2 ring-gold-500" : "bg-slate-700"
                )}>
                    {isHost ? (
                        <Image
                            src={hostAvatar}
                            alt={hostName}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                        />
                    ) : message.profile?.avatar ? (
                        <Image
                            src={message.profile.avatar}
                            alt={message.profile.name || "User"}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                            {message.profile?.name?.charAt(0) || "?"}
                        </div>
                    )}
                </div>
            )}
            <div className={cn("flex-1 min-w-0", isUser && "text-right")}>
                {!isUser && (
                    <div className="flex items-center gap-1 mb-0.5">
                        <span className={cn(
                            "text-xs font-semibold",
                            isHost ? "text-gold-400" : "text-slate-400"
                        )}>
                            {isHost ? hostName : message.profile?.name}
                        </span>
                        {message.profile?.location && !isHost && (
                            <span className="text-[10px] text-slate-500">{message.profile.location}</span>
                        )}
                    </div>
                )}
                <p className={cn(
                    "text-sm rounded-lg inline-block px-3 py-1.5",
                    isHost
                        ? "bg-gradient-to-r from-burgundy-800 to-burgundy-700 text-white"
                        : isUser
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-200"
                )}>
                    {message.content}
                </p>
            </div>
        </div>
    );
}

export function ScholarshipClient({ firstName, email, examScore, deadline }: ScholarshipClientProps) {
    const [videoStarted, setVideoStarted] = useState(false);
    const [videoTime, setVideoTime] = useState(0);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userMessage, setUserMessage] = useState("");
    const [viewerCount, setViewerCount] = useState(47);
    const [spotsRemaining, setSpotsRemaining] = useState(3);
    const [checkoutVisible, setCheckoutVisible] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);
    const lastFetchedTime = useRef(0);
    const processedMessages = useRef(new Set<string>());

    // Fetch zombie messages based on video time
    const fetchMessages = useCallback(async (from: number, to: number) => {
        if (from >= to) return;

        try {
            const res = await fetch(`/api/vsl/chat?from=${from}&to=${to}`);
            if (!res.ok) return;

            const data = await res.json();
            const newMessages: ChatMessage[] = data.messages
                .filter((m: { id: string }) => !processedMessages.current.has(m.id))
                .map((m: {
                    id: string;
                    messageType: string;
                    content: string;
                    profile?: { name: string; avatar?: string | null; location?: string | null } | null;
                    enrolleeName?: string | null;
                    enrolleeLocation?: string | null;
                    videoTime: number;
                }) => {
                    processedMessages.current.add(m.id);
                    return {
                        id: m.id,
                        type: m.messageType as ChatMessage["type"],
                        content: m.content,
                        profile: m.profile,
                        enrolleeName: m.enrolleeName,
                        enrolleeLocation: m.enrolleeLocation,
                        timestamp: m.videoTime,
                    };
                });

            if (newMessages.length > 0) {
                setMessages(prev => [...prev, ...newMessages]);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    }, []);

    // Handle Wistia video time updates
    const handleWistiaTimeUpdate = useCallback((newTime: number) => {
        setVideoTime(newTime);

        // Fetch messages for the new time range
        if (newTime > lastFetchedTime.current) {
            fetchMessages(lastFetchedTime.current, newTime + 10);
            lastFetchedTime.current = newTime + 10;
        }

        // Update spots at specific times (in seconds)
        if (newTime >= 470 && newTime < 830) setSpotsRemaining(3);
        if (newTime >= 830 && newTime < 1340) setSpotsRemaining(2);
        if (newTime >= 1340 && newTime < 2255) setSpotsRemaining(1);
        if (newTime >= 2255 && newTime < 2265) setSpotsRemaining(0);
        if (newTime >= 2265) setSpotsRemaining(1);

        // Show checkout after 38 minutes (2280 seconds)
        if (newTime >= 2280 && !checkoutVisible) {
            setCheckoutVisible(true);
        }
    }, [fetchMessages, checkoutVisible]);

    // Fetch initial messages when video starts
    useEffect(() => {
        if (videoStarted && lastFetchedTime.current === 0) {
            fetchMessages(0, 30); // Fetch first 30 seconds of messages
            lastFetchedTime.current = 30;
        }
    }, [videoStarted, fetchMessages]);

    // Fluctuate viewer count
    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount(prev => {
                const change = Math.floor(Math.random() * 5) - 2;
                return Math.max(35, Math.min(60, prev + change));
            });
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll chat
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle user message submission
    const handleSendMessage = async () => {
        if (!userMessage.trim()) return;

        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            type: "user",
            content: userMessage.trim(),
            timestamp: videoTime,
        };

        setMessages(prev => [...prev, userMsg]);
        const messageToSend = userMessage;
        setUserMessage("");

        // Get Dr. Michelle's response (co-host answering chat while Sarah presents)
        try {
            const res = await fetch("/api/vsl/sarah-response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: messageToSend, userName: firstName }),
            });

            if (res.ok) {
                const { response, delay } = await res.json();
                setTimeout(() => {
                    const michelleMsg: ChatMessage = {
                        id: `michelle-${Date.now()}`,
                        type: "sarah", // reuse sarah type for styling (host messages)
                        content: response,
                        profile: {
                            name: "Dr. Michelle",
                            avatar: "/coaches/michelle-coach.webp",
                            location: "Co-Host",
                        },
                        timestamp: videoTime,
                    };
                    setMessages(prev => [...prev, michelleMsg]);
                }, delay || 3000);
            }
        } catch (error) {
            console.error("Failed to get Dr. Michelle response:", error);
        }
    };

    // ClickFunnels checkout URL - pass email and name for pre-fill
    // TODO: Update this URL when ClickFunnels page is ready
    const checkoutUrl = `https://secure.accredipro-certificate.com/checkout?email=${encodeURIComponent(email)}&firstName=${encodeURIComponent(firstName)}`;

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-gradient-to-r from-burgundy-900 to-burgundy-800 border-b border-gold-500/30">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/asi-logo.png"
                            alt="ASI"
                            width={40}
                            height={40}
                            className="rounded"
                        />
                        <div className="hidden sm:block">
                            <p className="text-white font-bold text-sm">ASI Graduate Training</p>
                            <p className="text-gold-400 text-xs">Live with Sarah</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Live indicator */}
                        <Badge className="bg-red-600 text-white border-0 animate-pulse">
                            <span className="w-2 h-2 bg-white rounded-full mr-1.5" />
                            LIVE
                        </Badge>

                        {/* Viewer count */}
                        <div className="flex items-center gap-1 text-slate-300 text-sm">
                            <Users className="w-4 h-4" />
                            <span>{viewerCount} watching</span>
                        </div>

                        {/* Countdown */}
                        <div className="hidden sm:flex items-center gap-1 text-sm">
                            <Clock className="w-4 h-4 text-gold-400" />
                            <span className="text-slate-400">Scholarship expires:</span>
                            <CountdownTimer deadline={deadline} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Video section */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Video player */}
                        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                            <div className="aspect-video relative bg-black">
                                {!videoStarted ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-burgundy-900 to-slate-900">
                                        <div className="text-center mb-6">
                                            <Badge className="bg-emerald-600 text-white border-0 mb-4">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                You scored {examScore}%!
                                            </Badge>
                                            <h2 className="text-2xl font-bold text-white mb-2">
                                                Congratulations, {firstName}!
                                            </h2>
                                            <p className="text-slate-300 max-w-md">
                                                Watch this exclusive masterclass to discover how our graduates are building 6-figure practices
                                            </p>
                                        </div>
                                        <Button
                                            size="lg"
                                            onClick={() => setVideoStarted(true)}
                                            className="bg-gradient-to-r from-gold-500 to-gold-600 text-burgundy-900 hover:from-gold-600 hover:to-gold-700 font-bold text-lg px-8"
                                        >
                                            <Play className="w-6 h-6 mr-2" />
                                            Watch Free Masterclass
                                        </Button>
                                    </div>
                                ) : (
                                    <WistiaPlayer onTimeUpdate={handleWistiaTimeUpdate} />
                                )}
                            </div>
                        </Card>

                        {/* Spots indicator */}
                        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-gold-500" />
                                <span className="text-slate-300 text-sm">Scholarship spots remaining:</span>
                            </div>
                            <Badge className={cn(
                                "font-bold",
                                spotsRemaining <= 1
                                    ? "bg-red-600 text-white"
                                    : spotsRemaining <= 2
                                        ? "bg-amber-600 text-white"
                                        : "bg-emerald-600 text-white"
                            )}>
                                {spotsRemaining} {spotsRemaining === 1 ? "spot" : "spots"}
                            </Badge>
                        </div>
                    </div>

                    {/* Chat section */}
                    <div className="lg:col-span-1">
                        <Card className="bg-slate-900 border-slate-800 h-[500px] lg:h-[calc(100vh-200px)] flex flex-col">
                            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="font-bold text-white flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    Live Chat
                                </h3>
                                <span className="text-xs text-slate-500">{messages.length} messages</span>
                            </div>

                            <div
                                ref={chatRef}
                                className="flex-1 overflow-y-auto p-3 space-y-1"
                            >
                                {messages.map((msg) => (
                                    <ChatMessageItem key={msg.id} message={msg} />
                                ))}
                            </div>

                            <div className="p-3 border-t border-slate-800 pb-[env(safe-area-inset-bottom,12px)]">
                                <div className="flex gap-2">
                                    <Input
                                        value={userMessage}
                                        onChange={(e) => setUserMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                        placeholder="Type a message..."
                                        inputMode="text"
                                        autoComplete="off"
                                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 text-base"
                                        style={{ fontSize: "16px" }}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!userMessage.trim()}
                                        className="bg-burgundy-600 hover:bg-burgundy-700 flex-shrink-0"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Checkout section (revealed after video progress) */}
                {checkoutVisible && (
                    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
                        {/* Value stack */}
                        <Card className="bg-gradient-to-br from-burgundy-900 to-slate-900 border-gold-500/30">
                            <CardContent className="p-6">
                                <div className="text-center mb-6">
                                    <Badge className="bg-gold-500 text-burgundy-900 border-0 mb-2">
                                        <Star className="w-4 h-4 mr-1" />
                                        SCHOLARSHIP UNLOCKED
                                    </Badge>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        Your ASI Graduate Scholarship
                                    </h2>
                                    <p className="text-slate-300">
                                        Because you scored {examScore}%, you qualify for our exclusive scholarship
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-6">
                                    {[
                                        { icon: GraduationCap, title: "3 Certification Levels", desc: "Foundation, Professional, Board" },
                                        { icon: Award, title: "9 International Accreditations", desc: "IPHM, CMA, CPD, IAOTH + more" },
                                        { icon: Users, title: "52 Weeks Mentorship", desc: "Weekly calls with Sarah" },
                                        { icon: Sparkles, title: "$100K Business Accelerator", desc: "Templates, scripts, systems" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-lg p-3">
                                            <item.icon className="w-5 h-5 text-gold-500 mt-0.5" />
                                            <div>
                                                <p className="font-semibold text-white text-sm">{item.title}</p>
                                                <p className="text-xs text-slate-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mb-6">
                                    <p className="text-slate-400 text-sm mb-1">Total Value: <span className="line-through">$24,655</span></p>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-3xl font-bold text-white">$297</span>
                                        <Badge className="bg-emerald-600 text-white">Save 99%</Badge>
                                    </div>
                                </div>

                                <a
                                    href={checkoutUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <Button
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-burgundy-900 hover:from-gold-600 hover:to-gold-700 font-bold text-lg h-14"
                                    >
                                        Claim My Scholarship Now
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </a>

                                <div className="flex items-center justify-center gap-4 mt-4 text-slate-400 text-xs">
                                    <span className="flex items-center gap-1">
                                        <Shield className="w-4 h-4" />
                                        30-Day Guarantee
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" />
                                        Instant Access
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}

// Declare wistia-player as a valid JSX element
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
        interface IntrinsicElements {
            "wistia-player": React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    "media-id"?: string;
                    aspect?: string;
                },
                HTMLElement
            >;
        }
    }
}
