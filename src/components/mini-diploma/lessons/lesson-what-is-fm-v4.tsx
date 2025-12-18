"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ChevronRight, ArrowRight,
    Lightbulb, Heart, Send, Sparkles, Smile,
    MessageCircle, User, GraduationCap, Coffee,
} from "lucide-react";

interface LessonProps {
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    lessonNumber?: number;
    totalLessons?: number;
    firstName?: string;
}

interface Message {
    id: number;
    type: 'coach' | 'system' | 'user-choice';
    content: string;
    choices?: string[];
    delay?: number;
}

/**
 * VARIANT 4: Conversational Coach Format (Chat-Like)
 *
 * Design Philosophy:
 * - Simulates a 1:1 conversation with a friendly NBHWC coach
 * - Messages appear progressively like a real chat
 * - User makes choices that feel like real dialogue
 * - Warm, encouraging, supportive tone
 * - Perfect for women who value personal connection
 */
export function LessonWhatIsFMV4({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 1,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(true);
    const [userResponses, setUserResponses] = useState<string[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const messages: Message[] = [
        {
            id: 1,
            type: 'coach',
            content: `Hey ${firstName}! Welcome to your first lesson. I'm so excited to be on this journey with you!`,
            delay: 1500,
        },
        {
            id: 2,
            type: 'coach',
            content: "Before we dive in, let me ask you something...",
            delay: 1200,
        },
        {
            id: 3,
            type: 'user-choice',
            content: "Have you ever felt like something was off with your health, but your doctor said everything was 'normal'?",
            choices: ["Yes, all the time!", "Sometimes, yes", "Not really, but I know people who have"],
            delay: 800,
        },
        {
            id: 4,
            type: 'coach',
            content: "You're definitely not alone. So many women experience exactly that—being told they're 'fine' when they know deep down something isn't right.",
            delay: 1500,
        },
        {
            id: 5,
            type: 'coach',
            content: "That's actually why Functional Medicine exists! Let me explain...",
            delay: 1200,
        },
        {
            id: 6,
            type: 'system',
            content: "**What is Functional Medicine?**\n\nFunctional Medicine is a patient-centered approach that asks \"WHY\" you're experiencing symptoms—not just \"WHAT\" the symptom is.",
            delay: 1000,
        },
        {
            id: 7,
            type: 'coach',
            content: "Think of it this way... 🤔",
            delay: 1000,
        },
        {
            id: 8,
            type: 'system',
            content: "**Conventional Medicine says:**\n\"You have high blood pressure. Take this medication.\"\n\n**Functional Medicine asks:**\n\"WHY is your blood pressure high? Is it stress? Diet? Inflammation? Sleep? Let's find out!\"",
            delay: 800,
        },
        {
            id: 9,
            type: 'user-choice',
            content: "Does this difference make sense to you?",
            choices: ["Yes! This is exactly what I needed to hear", "I think so—tell me more", "I'm still a bit confused"],
            delay: 800,
        },
        {
            id: 10,
            type: 'coach',
            content: "Perfect! Here's the beautiful thing about FM—it sees YOU as a whole person, not just a collection of symptoms to fix.",
            delay: 1500,
        },
        {
            id: 11,
            type: 'coach',
            content: "Dr. Jeffrey Bland coined the term back in 1991, and it's been growing ever since. Today, even major hospitals like the Cleveland Clinic have FM centers!",
            delay: 1800,
        },
        {
            id: 12,
            type: 'system',
            content: "**Did you know?**\n\n• 60%+ of adults have chronic conditions\n• 79% of people want holistic health solutions\n• FM is growing 15%+ every year\n\nThe world NEEDS health coaches who understand this approach!",
            delay: 1000,
        },
        {
            id: 13,
            type: 'coach',
            content: `And that's where YOU come in, ${firstName}. As a certified health coach with FM training, you'll be able to help women who've been dismissed by the conventional system.`,
            delay: 1500,
        },
        {
            id: 14,
            type: 'user-choice',
            content: "Ready for the key takeaway?",
            choices: ["Yes, let's wrap it up!", "Can you summarize first?"],
            delay: 800,
        },
        {
            id: 15,
            type: 'system',
            content: "**YOUR KEY TAKEAWAY**\n\nFunctional Medicine asks \"WHY?\" instead of just \"WHAT?\"\n\nIt treats the PERSON, not just the diagnosis.\n\nAnd as a health coach, you'll learn to see the whole picture—helping your clients finally feel heard and understood.",
            delay: 1000,
        },
        {
            id: 16,
            type: 'coach',
            content: `Amazing work completing this lesson, ${firstName}! You're already on your way to becoming an incredible FM-trained health coach.`,
            delay: 1500,
        },
        {
            id: 17,
            type: 'coach',
            content: "In the next lesson, we'll explore the 7 Body Systems Model—you're going to love it! Ready to continue? 💪",
            delay: 1200,
        },
    ];

    useEffect(() => {
        if (currentMessageIndex < messages.length) {
            const currentMsg = messages[currentMessageIndex];
            const delay = currentMsg.delay || 1000;

            if (currentMsg.type === 'user-choice') {
                // For choice messages, show immediately without typing indicator
                setIsTyping(false);
                setDisplayedMessages(prev => [...prev, currentMsg]);
                // Don't auto-advance - wait for user to click a choice
                return;
            } else {
                setIsTyping(true);
                const timer = setTimeout(() => {
                    setIsTyping(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);

                    // Always advance to next message after displaying this one
                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) {
                        setTimeout(() => {
                            setCurrentMessageIndex(prev => prev + 1);
                        }, 500);
                    }
                }, delay);
                return () => clearTimeout(timer);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMessageIndex]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayedMessages, isTyping]);

    const handleUserChoice = (choice: string) => {
        setUserResponses(prev => [...prev, choice]);
        setDisplayedMessages(prev => [
            ...prev.filter(m => m.id !== messages[currentMessageIndex].id),
            { id: Date.now(), type: 'coach', content: choice } as Message
        ]);
        setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
        }, 300);
    };

    const handleMarkComplete = () => {
        setCompleted(true);
        onComplete?.();
    };

    const progressPercent = Math.min((currentMessageIndex / (messages.length - 1)) * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-rose-100 px-4 py-3">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Dr. Sarah, Your FM Coach</p>
                                <p className="text-xs text-emerald-600 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                                    Online now
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="bg-rose-100 text-rose-700 border-0">
                                Lesson {lessonNumber}/{totalLessons}
                            </Badge>
                        </div>
                    </div>
                    <Progress value={progressPercent} className="h-1.5 bg-rose-100" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Welcome Message */}
                    <div className="text-center mb-6">
                        <Badge className="bg-amber-100 text-amber-800 border-0 mb-2">
                            <Coffee className="h-3 w-3 mr-1" />
                            Module 1, Lesson 1
                        </Badge>
                        <h1 className="text-xl font-bold text-slate-800">What is Functional Medicine?</h1>
                        <p className="text-sm text-slate-500 flex items-center justify-center gap-1 mt-1">
                            <Clock className="h-3 w-3" /> 6 min • Conversational lesson
                        </p>
                    </div>

                    {/* Messages */}
                    {displayedMessages.map((msg, index) => (
                        <div
                            key={msg.id}
                            className={`animate-fade-in ${msg.type === 'user-choice' ? '' : msg.type === 'system' ? 'px-2' : ''}`}
                        >
                            {msg.type === 'coach' && !msg.choices && userResponses.includes(msg.content) ? (
                                // User's response (shown on right)
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] bg-burgundy-600 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-sm">
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            ) : msg.type === 'coach' ? (
                                // Coach message (shown on left)
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shrink-0">
                                        <User className="h-4 w-4 text-white" />
                                    </div>
                                    <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                        <p className="text-slate-700">{msg.content}</p>
                                    </div>
                                </div>
                            ) : msg.type === 'system' ? (
                                // System/info message (centered card)
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100 mx-4">
                                    {msg.content.split('\n').map((line, i) => {
                                        if (line.startsWith('**') && line.endsWith('**')) {
                                            return (
                                                <p key={i} className="font-bold text-indigo-900 text-lg mb-2">
                                                    {line.replace(/\*\*/g, '')}
                                                </p>
                                            );
                                        } else if (line.startsWith('•')) {
                                            return (
                                                <p key={i} className="text-slate-700 text-sm ml-2 mb-1">
                                                    {line}
                                                </p>
                                            );
                                        } else if (line.trim()) {
                                            return (
                                                <p key={i} className="text-slate-700 mb-2">
                                                    {line}
                                                </p>
                                            );
                                        }
                                        return <br key={i} />;
                                    })}
                                </div>
                            ) : msg.type === 'user-choice' && msg.choices ? (
                                // User choice buttons
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shrink-0">
                                            <User className="h-4 w-4 text-white" />
                                        </div>
                                        <div className="max-w-[80%] bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                            <p className="text-slate-700 font-medium">{msg.content}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 ml-11">
                                        {msg.choices.map((choice, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleUserChoice(choice)}
                                                className="bg-white border-2 border-burgundy-200 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-burgundy-50 hover:border-burgundy-300 transition-all shadow-sm"
                                            >
                                                {choice}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && currentMessageIndex < messages.length && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            </div>

            {/* Bottom Action Area */}
            {currentMessageIndex >= messages.length - 1 && (
                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            {!completed ? (
                                <Button
                                    onClick={handleMarkComplete}
                                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-5 rounded-xl"
                                >
                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                    Complete Lesson
                                </Button>
                            ) : (
                                <div className="flex items-center gap-2 text-emerald-600 font-medium">
                                    <CheckCircle2 className="h-5 w-5" />
                                    Lesson Complete!
                                </div>
                            )}
                            <Button
                                onClick={onNext}
                                className="w-full sm:w-auto bg-burgundy-600 hover:bg-burgundy-700 text-white px-6 py-5 rounded-xl"
                            >
                                Next Lesson
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
