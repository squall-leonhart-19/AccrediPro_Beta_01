"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    Send,
    Crown,
    MessageCircle,
    Sparkles,
    ArrowLeft,
    Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { COACH_SARAH } from "@/lib/zombies";

interface PodMessage {
    id: string;
    senderName: string;
    senderAvatar?: string;
    senderType: "coach" | "zombie" | "user";
    content: string;
    createdAt: Date;
    isCoach: boolean;
}

interface ZombieProfile {
    id: string;
    name: string;
    avatar?: string;
    personalityType: string;
}

interface CurrentUser {
    id: string;
    name: string;
    avatar?: string;
    progress: number;
}

interface PodChatClientProps {
    podName: string;
    messages: PodMessage[];
    zombies: ZombieProfile[];
    currentUser: CurrentUser | null;
    daysSinceEnrollment: number;
}

function timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// FM Module names for leaderboard (21 modules total = 5% per module)
const FM_MODULES = [
    "Orientation",           // 0: 0-4%
    "FM Foundations",        // 1: 5-9%
    "Health Coaching",       // 2: 10-14%
    "Clinical Assessment",   // 3: 15-19%
    "Ethics & Scope",        // 4: 20-24%
    "Functional Nutrition",  // 5: 25-29%
    "Gut Health",            // 6: 30-34%
    "Stress & Adrenals",     // 7: 35-39%
    "Blood Sugar",           // 8: 40-44%
    "Women's Hormones",      // 9: 45-49%
    "Perimenopause",         // 10: 50-54%
    "Thyroid Health",        // 11: 55-59%
    "Metabolic Health",      // 12: 60-64%
    "Autoimmunity",          // 13: 65-69%
    "Mental Health",         // 14: 70-74%
    "Cardiometabolic",       // 15: 75-79%
    "Energy & Mito",         // 16: 80-84%
    "Detox",                 // 17: 85-89%
    "Immune Health",         // 18: 90-94%
    "Protocol Building",     // 19: 95-99%
    "Certified! 🎓",         // 20: 100%
];

// Convert progress % to current module name
function getModuleName(progress: number): string {
    if (progress >= 100) return FM_MODULES[20];
    const moduleIndex = Math.floor(progress / 5);
    return FM_MODULES[Math.min(moduleIndex, FM_MODULES.length - 1)];
}

// Zombie progress: Deterministic, always-increasing based on enrollment date
// Each personality starts at a different point and progresses at different rates
// This creates FOMO - some students are ahead from day 1!
function getZombieProgress(
    personality: string,
    daysSinceEnrollment: number,
    zombieIndex: number = 0
): number {
    // Starting progress by personality (they "enrolled before" the user)
    // This creates immediate FOMO on day 1!
    const startingProgress: Record<string, number> = {
        leader: 35,      // Already ahead - "wow they're crushing it!"
        buyer: 28,       // Invested early, showing results
        questioner: 18,  // Steady, relatable pace
        struggler: 12,   // Behind but trying - makes user feel good
    };

    // Daily progress rate by personality
    const dailyRate: Record<string, number> = {
        leader: 1.8,     // Fast learner - gains ~2% per day
        buyer: 1.5,      // Motivated - gains ~1.5% per day
        questioner: 1.2, // Steady - gains ~1.2% per day
        struggler: 0.8,  // Slower but persistent - gains ~0.8% per day
    };

    const baseProgress = startingProgress[personality] || 20;
    const rate = dailyRate[personality] || 1.0;

    // Add variance per zombie index so same personalities differ slightly
    // Index 0: +3%, Index 1: +1%, Index 2: -1%, Index 3: -3%, Index 4: +2%
    const indexVariance = [3, 1, -1, -3, 2][zombieIndex % 5];

    // Calculate progress
    const calculatedProgress = baseProgress + indexVariance + (daysSinceEnrollment * rate);

    // Clamp between starting progress and 100%
    return Math.min(Math.max(Math.round(calculatedProgress), baseProgress), 100);
}

export function PodChatClient({
    podName,
    messages: initialMessages,
    zombies,
    currentUser,
    daysSinceEnrollment,
}: PodChatClientProps) {
    const [inputValue, setInputValue] = useState("");
    const [chatMessages, setChatMessages] = useState<PodMessage[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingResponder, setTypingResponder] = useState<{ name: string; avatar?: string; isCoach: boolean } | null>(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Reactions state - tracks user's reactions to messages
    const [reactions, setReactions] = useState<Record<string, { hearts: number; fire: number; userReacted: string | null }>>({});

    // Pre-seed reactions for script messages (1-4 max)
    useEffect(() => {
        const preSeeded: Record<string, { hearts: number; fire: number; userReacted: string | null }> = {};
        initialMessages.forEach(msg => {
            // Educational tips and coach messages get more reactions
            const isEducational = msg.content.includes("tip:") || msg.content.includes("formula") || msg.content.includes("questions:");
            const isCelebration = msg.content.includes("🎉") || msg.content.includes("FIRST CLIENT");
            preSeeded[msg.id] = {
                // Max 4 reactions: educational gets 2-4, regular gets 1-2
                hearts: isEducational ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 2) + 1,
                // Max 4 reactions: celebration gets 2-4, regular gets 0
                fire: isCelebration ? Math.floor(Math.random() * 3) + 1 : 0,
                userReacted: null,
            };
        });
        setReactions(preSeeded);
    }, [initialMessages]);

    // Analytics - track engagement events
    const trackEngagement = useCallback((eventType: string, metadata?: Record<string, any>) => {
        fetch("/api/pod/engagement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ eventType, metadata: { ...metadata, daysSinceEnrollment } }),
        }).catch(() => { }); // Fire and forget
    }, [daysSinceEnrollment]);

    // Track page visit on mount
    useEffect(() => {
        trackEngagement("visit");
    }, [trackEngagement]);

    const handleReaction = (msgId: string, type: 'hearts' | 'fire') => {
        setReactions(prev => {
            const current = prev[msgId] || { hearts: 0, fire: 0, userReacted: null };
            if (current.userReacted === type) {
                // Remove reaction
                return { ...prev, [msgId]: { ...current, [type]: current[type] - 1, userReacted: null } };
            } else {
                // Add reaction (remove previous if different)
                const newCounts = { ...current };
                if (current.userReacted) {
                    newCounts[current.userReacted as 'hearts' | 'fire'] -= 1;
                }
                newCounts[type] += 1;
                // Track reaction engagement
                trackEngagement("reaction", { messageId: msgId, reactionType: type });
                return { ...prev, [msgId]: { ...newCounts, userReacted: type } };
            }
        });
    };

    // Active now dots - 3-4 random zombies are "online"
    const [activeZombieIds] = useState<string[]>(() => {
        const shuffled = [...zombies].sort(() => Math.random() - 0.5);
        const numActive = 3 + Math.floor(Math.random() * 2); // 3-4 active
        return shuffled.slice(0, numActive).map(z => z.id);
    });

    // Streak counter from localStorage
    const [streak, setStreak] = useState(1);

    useEffect(() => {
        if (!currentUser?.id) return;
        const streakKey = `pod-streak-${currentUser.id}`;
        const lastVisitKey = `pod-last-visit-${currentUser.id}`;

        const stored = localStorage.getItem(streakKey);
        const lastVisit = localStorage.getItem(lastVisitKey);
        const today = new Date().toDateString();

        if (lastVisit === today) {
            // Already visited today, keep current streak
            setStreak(stored ? parseInt(stored) : 1);
        } else {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastVisit === yesterday.toDateString()) {
                // Consecutive day, increment streak
                const newStreak = (stored ? parseInt(stored) : 0) + 1;
                setStreak(newStreak);
                localStorage.setItem(streakKey, newStreak.toString());
            } else {
                // Streak broken, reset to 1
                setStreak(1);
                localStorage.setItem(streakKey, "1");
            }
            localStorage.setItem(lastVisitKey, today);
        }
    }, [currentUser?.id]);

    // Progress Milestones - celebrate achievements
    const [showMilestone, setShowMilestone] = useState<{
        percent: number;
        title: string;
        message: string;
        emoji: string;
    } | null>(null);

    const MILESTONES = [
        { percent: 25, title: "Quarter Champion! 🎯", message: "You've completed 25% of your certification. You're building real expertise!", emoji: "🎯" },
        { percent: 50, title: "Halfway Hero! 🔥", message: "50% complete! You're halfway to becoming a Certified Practitioner!", emoji: "🔥" },
        { percent: 75, title: "Almost There! 💪", message: "75% done! The finish line is in sight. You've got this!", emoji: "💪" },
        { percent: 100, title: "CERTIFIED! 🏆", message: "Congratulations! You've completed your Functional Medicine Certification!", emoji: "🏆" },
    ];

    useEffect(() => {
        if (!currentUser?.id) return;
        const progress = currentUser.progress;
        const milestoneKey = `pod-milestones-${currentUser.id}`;
        const seenMilestones: number[] = JSON.parse(localStorage.getItem(milestoneKey) || "[]");

        // Check each milestone
        for (const milestone of MILESTONES) {
            if (progress >= milestone.percent && !seenMilestones.includes(milestone.percent)) {
                // Show this milestone!
                setShowMilestone(milestone);
                // Mark as seen
                seenMilestones.push(milestone.percent);
                localStorage.setItem(milestoneKey, JSON.stringify(seenMilestones));
                // Track engagement
                trackEngagement("milestone", { milestone: milestone.percent, progress });
                break; // Only show one at a time
            }
        }
    }, [currentUser?.id, currentUser?.progress, trackEngagement]);

    // Load messages from DATABASE + initial scripted messages
    useEffect(() => {
        if (!currentUser?.id) {
            setChatMessages(initialMessages);
            return;
        }

        // Fetch user messages from database
        const loadMessages = async () => {
            try {
                const res = await fetch("/api/pod/message");
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages && data.messages.length > 0) {
                        // Convert DB messages to PodMessage format
                        const dbMessages: PodMessage[] = [];
                        for (const msg of data.messages) {
                            // Add user message
                            dbMessages.push({
                                id: `user-${msg.id}`,
                                senderName: currentUser.name,
                                senderAvatar: currentUser.avatar,
                                senderType: "user",
                                content: msg.content,
                                createdAt: new Date(msg.createdAt),
                                isCoach: false,
                            });
                            // Add AI response if exists
                            if (msg.aiResponse && msg.aiResponderName) {
                                dbMessages.push({
                                    id: `response-${msg.id}`,
                                    senderName: msg.aiResponderName,
                                    senderAvatar: msg.aiResponderName.includes("Sarah")
                                        ? "https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp"
                                        : undefined,
                                    senderType: msg.aiResponderName.includes("Sarah") ? "coach" : "zombie",
                                    content: msg.aiResponse,
                                    createdAt: new Date(new Date(msg.createdAt).getTime() + 1000), // 1 sec after
                                    isCoach: msg.aiResponderName.includes("Sarah"),
                                });
                            }
                        }
                        // Merge with initial scripted messages
                        const allMessages = [...initialMessages, ...dbMessages];
                        allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        setChatMessages(allMessages);
                        return;
                    }
                }
            } catch (error) {
                console.error("Failed to load pod messages from DB:", error);
            }
            // Fallback to just initial messages
            setChatMessages(initialMessages);
        };

        loadMessages();
    }, [initialMessages, currentUser?.id, currentUser?.name, currentUser?.avatar]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Call Anthropic API for response
    const handleSend = async () => {
        if (!inputValue.trim() || !currentUser || isSending) return;

        setIsSending(true);

        // Add user message immediately
        const userMessage: PodMessage = {
            id: `user-${Date.now()}`,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatar,
            senderType: "user",
            content: inputValue,
            createdAt: new Date(),
            isCoach: false,
        };

        const updatedMessages = [...chatMessages, userMessage];
        setChatMessages(updatedMessages);

        // Track message engagement
        trackEngagement("message", { contentLength: inputValue.length });

        const sentMessage = inputValue;
        setInputValue("");

        // IMMEDIATELY save user message to database (don't wait for AI response)
        fetch("/api/pod/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: sentMessage,
                daysSinceEnrollment,
                aiResponderName: null, // Will be updated when AI responds
                aiResponse: null,
            }),
        }).catch(err => console.error("Failed to save message:", err));

        try {
            // Call API to get response(s)
            const res = await fetch("/api/pod-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: sentMessage,
                    conversationHistory: chatMessages.slice(-10).map(m => ({
                        senderName: m.senderName,
                        senderType: m.senderType,
                        content: m.content,
                    })),
                    zombies,
                    daysSinceEnrollment,
                }),
            });

            const data = await res.json();
            console.log("Pod chat response:", data);

            if (!res.ok) {
                console.error("Pod chat API failed:", data);
                throw new Error(data.error || "API call failed");
            }

            // Handle WELCOME SEQUENCE (first message - multiple responses)
            if (data.isWelcomeSequence && data.responses) {
                console.log("Welcome sequence detected, processing", data.responses.length, "responses");

                let currentMessages = [...updatedMessages];

                // Process each response with its own delay
                for (const response of data.responses) {
                    // Show typing indicator for this responder
                    setTypingResponder({
                        name: response.senderName,
                        avatar: response.senderAvatar,
                        isCoach: response.isCoach,
                    });
                    setIsTyping(true);

                    // Wait for the specified delay
                    await new Promise(resolve => setTimeout(resolve, response.delay));

                    // Add the response
                    const newMessage: PodMessage = {
                        id: response.id,
                        senderName: response.senderName,
                        senderAvatar: response.senderAvatar,
                        senderType: response.senderType,
                        content: response.content,
                        createdAt: new Date(response.createdAt),
                        isCoach: response.isCoach,
                    };

                    currentMessages = [...currentMessages, newMessage];
                    setChatMessages(currentMessages);

                    // Hide typing for a moment between responses
                    setIsTyping(false);
                    setTypingResponder(null);

                    // Small pause before next typing indicator (if more responses)
                    if (data.responses.indexOf(response) < data.responses.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
            // Handle NORMAL single response
            else if (data.success && data.response) {
                // Wait a bit before showing typing (simulates reading)
                const preTypingDelay = 5000 + Math.random() * 5000;
                await new Promise(resolve => setTimeout(resolve, preTypingDelay));

                // Show typing indicator with the responder's info
                setTypingResponder({
                    name: data.response.senderName,
                    avatar: data.response.senderAvatar,
                    isCoach: data.response.isCoach,
                });
                setIsTyping(true);

                // Wait for typing delay
                const typingDelay = 8000 + Math.random() * 7000;
                await new Promise(resolve => setTimeout(resolve, typingDelay));

                // Add AI response
                const newMessages = [...updatedMessages, {
                    id: data.response.id,
                    senderName: data.response.senderName,
                    senderAvatar: data.response.senderAvatar,
                    senderType: data.response.senderType,
                    content: data.response.content,
                    createdAt: new Date(data.response.createdAt),
                    isCoach: data.response.isCoach,
                }];
                setChatMessages(newMessages);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            // Fallback response
            await new Promise(resolve => setTimeout(resolve, 2000));
            const fallbackMessages = [...updatedMessages, {
                id: `fallback-${Date.now()}`,
                senderName: "Coach Sarah M.",
                senderAvatar: COACH_SARAH.avatar,
                senderType: "coach" as const,
                content: "Thanks for sharing! Keep up the great work! 💪",
                createdAt: new Date(),
                isCoach: true,
            }];
            setChatMessages(fallbackMessages);
        } finally {
            setIsTyping(false);
            setTypingResponder(null);
            setIsSending(false);
        }
    };

    // Build student list - deterministic progress based on enrollment date
    const studentMembers = zombies.map((z, index) => ({
        id: z.id,
        name: z.name,
        avatar: z.avatar,
        progress: getZombieProgress(z.personalityType, daysSinceEnrollment, index),
    })).sort((a, b) => b.progress - a.progress);

    if (currentUser) {
        studentMembers.push({
            id: currentUser.id,
            name: currentUser.name,
            avatar: currentUser.avatar,
            progress: currentUser.progress,
        });
        studentMembers.sort((a, b) => b.progress - a.progress);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Milestone Celebration Modal */}
            {showMilestone && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center animate-in zoom-in-95 duration-300">
                        {/* Confetti effect with emojis */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-4 left-8 text-4xl animate-bounce">🎉</div>
                            <div className="absolute top-8 right-12 text-3xl animate-bounce delay-100">⭐</div>
                            <div className="absolute top-12 left-16 text-2xl animate-bounce delay-200">✨</div>
                            <div className="absolute top-6 right-24 text-3xl animate-bounce delay-300">🎊</div>
                        </div>

                        {/* Main celebration emoji */}
                        <div className="text-7xl mb-4 animate-pulse">{showMilestone.emoji}</div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {showMilestone.title}
                        </h2>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 rounded-full transition-all duration-1000"
                                style={{ width: `${showMilestone.percent}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{showMilestone.percent}% Complete</p>

                        {/* Message */}
                        <p className="text-gray-600 mb-6">{showMilestone.message}</p>

                        {/* Continue button */}
                        <Button
                            onClick={() => setShowMilestone(null)}
                            className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-8 py-2"
                        >
                            Keep Going! 🚀
                        </Button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-burgundy-600 -ml-2">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Button>
                            </Link>
                            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-600 flex items-center justify-center shadow-lg shadow-burgundy-200/50">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-lg font-bold text-gray-900">{podName}</h1>
                                    <p className="text-xs text-gray-500 hidden sm:block">Day {daysSinceEnrollment} of your journey</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {streak > 1 && (
                                <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                                    🔥 {streak} day streak
                                </Badge>
                            )}
                            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Sparkles className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">{studentMembers.length + 1} Members</span>
                                <span className="sm:hidden">{studentMembers.length + 1}</span>
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Sidebar */}
                    <div className="w-full lg:w-80 xl:w-96 space-y-4 lg:sticky lg:top-24 lg:self-start">

                        {/* Coach Card */}
                        <Card className="bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-14 h-14 border-2 border-gold-300 shadow-lg">
                                        <AvatarImage src={COACH_SARAH.avatar} />
                                        <AvatarFallback className="bg-gold-100 text-gold-700 font-bold">SM</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{COACH_SARAH.name}</p>
                                        <Badge className="text-xs bg-gold-100 text-gold-700 border-gold-200 mt-1">
                                            <Crown className="w-3 h-3 mr-1" />
                                            Your Mentor
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Student Leaderboard */}
                        <Card className="bg-white">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Trophy className="w-4 h-4 text-burgundy-500" />
                                    Pod Leaderboard
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 pt-0">
                                {studentMembers.map((member, index) => {
                                    const isCurrentUser = currentUser && member.id === currentUser.id;
                                    return (
                                        <div
                                            key={member.id}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl transition-all",
                                                isCurrentUser ? "bg-burgundy-50 ring-1 ring-burgundy-200" : "hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="relative">
                                                <Avatar className="w-9 h-9 border-2 border-white shadow shrink-0">
                                                    <AvatarImage src={member.avatar} />
                                                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-xs font-medium">
                                                        {member.name.split(" ").map(n => n[0]).join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                {/* Active now green dot */}
                                                {!isCurrentUser && activeZombieIds.includes(member.id) && (
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "text-sm font-medium truncate",
                                                    isCurrentUser ? "text-burgundy-700" : "text-gray-900"
                                                )}>
                                                    {member.name}
                                                    {isCurrentUser && <span className="text-burgundy-500"> (You)</span>}
                                                </p>
                                                <div className="mt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Progress
                                                            value={member.progress}
                                                            className={cn(
                                                                "h-1.5 flex-1",
                                                                isCurrentUser ? "[&>div]:bg-burgundy-500" : "[&>div]:bg-emerald-500"
                                                            )}
                                                        />
                                                        <span className="text-[10px] font-medium text-gray-500 w-8 text-right">
                                                            {member.progress}%
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-gray-400 truncate mt-0.5">
                                                        {getModuleName(member.progress)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* DFY Counter - Social Proof */}
                        {daysSinceEnrollment >= 15 && (
                            <Card className="bg-gradient-to-br from-burgundy-50 to-burgundy-100/50 border-burgundy-200">
                                <CardContent className="p-4 text-center">
                                    <p className="text-sm font-medium text-burgundy-700">
                                        ✨ 3 pod members enrolled in DFY this quarter
                                    </p>
                                    <p className="text-xs text-burgundy-500 mt-1">
                                        Only 1 spot remaining
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 min-w-0">
                        <Card className="bg-white flex flex-col" style={{ height: 'calc(100vh - 140px)', minHeight: '500px' }}>
                            <CardHeader className="py-3 px-4 border-b shrink-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                                            <MessageCircle className="w-5 h-5 text-burgundy-600" />
                                            Private Accountability Group
                                        </CardTitle>
                                        <p className="text-xs text-gray-500 mt-0.5">Your coach + 5 peers supporting your journey</p>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{chatMessages.length} messages</span>
                                </div>
                            </CardHeader>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                                {/* Pinned DFY Announcement - Shows after Day 18 */}
                                {daysSinceEnrollment >= 18 && (
                                    <div className="bg-gradient-to-r from-gold-50 to-amber-50 border border-gold-200 rounded-xl p-4 mb-4 relative">
                                        <div className="absolute -top-2 left-4 bg-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                            📌 PINNED
                                        </div>
                                        <div className="flex items-start gap-3 mt-1">
                                            <Avatar className="w-10 h-10 border-2 border-gold-200">
                                                <AvatarImage src={COACH_SARAH.avatar} />
                                                <AvatarFallback className="bg-gold-100 text-gold-700">SM</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium text-gold-700 mb-1">Coach Sarah M.</p>
                                                <p className="text-sm text-gray-700">
                                                    🌿 <strong>DFY Practice Launch spots are LIMITED</strong> - If you want help setting up your website, booking system, and client attraction system, DM me. Only 4 spots per quarter and 3 are already taken!
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {chatMessages.map((msg) => {
                                    const isCurrentUser = msg.senderType === "user";
                                    return (
                                        <div key={msg.id} className={cn("flex gap-3", isCurrentUser && "flex-row-reverse")}>
                                            <Avatar className="w-9 h-9 shrink-0 border border-white shadow-sm">
                                                <AvatarImage src={msg.senderAvatar} />
                                                <AvatarFallback className={cn(
                                                    "text-xs font-medium",
                                                    msg.isCoach ? "bg-gold-100 text-gold-700" : "bg-burgundy-100 text-burgundy-700"
                                                )}>
                                                    {msg.senderName.split(" ").map(n => n[0]).join("")}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className={cn("max-w-[80%] sm:max-w-[70%]", isCurrentUser && "text-right")}>
                                                <div className={cn("flex items-center gap-2 mb-1", isCurrentUser && "flex-row-reverse")}>
                                                    <span className={cn(
                                                        "text-sm font-medium",
                                                        msg.isCoach ? "text-gold-700" : "text-gray-900"
                                                    )}>
                                                        {msg.senderName}
                                                    </span>
                                                    {msg.isCoach && (
                                                        <Badge className="text-[10px] bg-gold-100 text-gold-700 border-0 h-4 px-1">Coach</Badge>
                                                    )}
                                                    <span className="text-[10px] text-gray-400">{timeAgo(new Date(msg.createdAt))}</span>
                                                </div>
                                                <div className={cn(
                                                    "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
                                                    isCurrentUser
                                                        ? "bg-burgundy-500 text-white rounded-br-sm"
                                                        : msg.isCoach
                                                            ? "bg-gold-50 text-gray-800 border border-gold-200 rounded-bl-sm"
                                                            : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                                                )}>
                                                    {msg.content}
                                                </div>
                                                {/* Quick reactions */}
                                                {!isCurrentUser && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <button
                                                            onClick={() => handleReaction(msg.id, 'hearts')}
                                                            className={cn(
                                                                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all",
                                                                reactions[msg.id]?.userReacted === 'hearts'
                                                                    ? "bg-pink-100 text-pink-600"
                                                                    : "bg-gray-100 hover:bg-pink-50 text-gray-500 hover:text-pink-500"
                                                            )}
                                                        >
                                                            ❤️ {reactions[msg.id]?.hearts || 0}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReaction(msg.id, 'fire')}
                                                            className={cn(
                                                                "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all",
                                                                reactions[msg.id]?.userReacted === 'fire'
                                                                    ? "bg-orange-100 text-orange-600"
                                                                    : "bg-gray-100 hover:bg-orange-50 text-gray-500 hover:text-orange-500"
                                                            )}
                                                        >
                                                            🔥 {reactions[msg.id]?.fire || 0}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {isTyping && typingResponder && (
                                    <div className="flex gap-3">
                                        <Avatar className="w-9 h-9 border border-white shadow-sm">
                                            <AvatarImage src={typingResponder.avatar} />
                                            <AvatarFallback className={cn(
                                                "text-xs font-medium",
                                                typingResponder.isCoach ? "bg-gold-100 text-gold-700" : "bg-burgundy-100 text-burgundy-700"
                                            )}>
                                                {typingResponder.name.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <span className={cn(
                                                "text-xs font-medium mb-1 block",
                                                typingResponder.isCoach ? "text-gold-700" : "text-gray-600"
                                            )}>
                                                {typingResponder.name} is typing...
                                            </span>
                                            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 border border-gray-200 shadow-sm">
                                                <div className="flex gap-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            {currentUser && (
                                <div className="p-4 border-t bg-white shrink-0">
                                    {/* Show prompt if user hasn't messaged recently */}
                                    {chatMessages.filter(m => m.senderType === "user").length === 0 && daysSinceEnrollment >= 2 && (
                                        <div className="mb-3 bg-burgundy-50 border border-burgundy-200 rounded-lg p-3 text-center">
                                            <p className="text-sm text-burgundy-700">
                                                💬 Your pod wants to hear from you! Share an update or ask a question.
                                            </p>
                                        </div>
                                    )}
                                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                                        <Input
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            placeholder="Share your progress..."
                                            className="flex-1 h-11 rounded-xl border-gray-200"
                                            disabled={isSending}
                                        />
                                        <Button
                                            type="submit"
                                            className="h-11 px-5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-xl"
                                            disabled={!inputValue.trim() || isSending}
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            )}

                            {!currentUser && (
                                <div className="p-4 border-t bg-amber-50 shrink-0">
                                    <p className="text-sm text-amber-700 text-center">
                                        👀 Viewing as coach — students see their own participation here
                                    </p>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
