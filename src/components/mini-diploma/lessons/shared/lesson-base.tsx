"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ArrowRight,
    MessageCircle, GraduationCap,
    Sparkles, Heart, TrendingUp, Target,
    Award, Play, Pause, Volume2,
} from "lucide-react";

// Sarah's profile image
const SARAH_AVATAR = "/coaches/sarah-coach.webp";

export interface Message {
    id: number;
    type: 'coach' | 'system' | 'user-choice' | 'pre-recorded-audio';
    content: string;
    choices?: string[];
    delay?: number;
    audioUrl?: string; // For pre-recorded audio
    audioDuration?: string; // e.g., "0:17"
    systemStyle?: 'info' | 'quote' | 'comparison' | 'stats' | 'takeaway' | 'exercise';
    showReaction?: boolean;
}

interface LessonBaseProps {
    lessonNumber: number;
    lessonTitle: string;
    lessonSubtitle: string;
    totalLessons?: number;
    messages: Message[];
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    firstName?: string;
    moduleIntroAudioUrl?: string; // Pre-recorded module intro audio
}

/**
 * Base lesson component - FAST VERSION
 * - Reduced typing delays (1-3s instead of 2.5-12s)
 * - Quick gaps between messages (400ms)
 * - Pre-recorded audio support (no TTS generation)
 */
export function LessonBase({
    lessonNumber,
    lessonTitle,
    lessonSubtitle,
    totalLessons = 3,
    messages,
    onComplete,
    onNext,
    isCompleted = false,
    firstName = "friend",
    moduleIntroAudioUrl,
}: LessonBaseProps) {
    // If already completed, show everything instantly
    const [currentMessageIndex, setCurrentMessageIndex] = useState(isCompleted ? messages.length : 0);
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>(
        isCompleted ? messages.filter(m => m.type !== 'user-choice') : []
    );
    const [isTyping, setIsTyping] = useState(!isCompleted);
    const [userResponses, setUserResponses] = useState<string[]>([]);
    const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
    const [showReaction, setShowReaction] = useState<string | null>(null);
    const [lessonComplete, setLessonComplete] = useState(isCompleted);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // FAST typing delay: 1-3 seconds based on content length
    const calculateTypingDelay = (content: string): number => {
        const baseDelay = Math.ceil(content.length / 50) * 1000; // Much faster
        const randomFactor = Math.random() * 400 - 200;
        return Math.max(1000, Math.min(baseDelay + randomFactor, 3000)); // 1-3 seconds
    };

    // Play pre-recorded audio
    const playPreRecordedAudio = (messageId: number, audioUrl: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        if (playingAudioId === messageId) {
            setPlayingAudioId(null);
            return;
        }

        setPlayingAudioId(messageId);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setPlayingAudioId(null);
        audio.onerror = () => setPlayingAudioId(null);
        audio.play().catch(() => setPlayingAudioId(null));
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // FAST message progression
    useEffect(() => {
        if (currentMessageIndex < messages.length) {
            const currentMsg = messages[currentMessageIndex];

            if (currentMsg.type === 'user-choice') {
                // Show choices immediately, no typing
                setIsTyping(false);
                setDisplayedMessages(prev => [...prev, currentMsg]);
                return;
            } else if (currentMsg.type === 'pre-recorded-audio') {
                // Show audio message with brief delay
                setIsTyping(true);
                const timer = setTimeout(() => {
                    setIsTyping(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);
                    // Auto-advance after showing audio
                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) {
                        setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 400);
                    } else {
                        setTimeout(() => setLessonComplete(true), 800);
                    }
                }, 1500); // Brief delay for audio messages
                return () => clearTimeout(timer);
            } else {
                // Regular messages with FAST typing delay
                const typingDelay = calculateTypingDelay(currentMsg.content);
                setIsTyping(true);

                const timer = setTimeout(() => {
                    setIsTyping(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);

                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) {
                        setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 400); // Fast gap
                    } else {
                        setTimeout(() => setLessonComplete(true), 800);
                    }
                }, typingDelay);
                return () => clearTimeout(timer);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMessageIndex, messages.length]);

    // Auto-scroll
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayedMessages, isTyping, showReaction, lessonComplete]);

    const handleUserChoice = (choice: string) => {
        setUserResponses(prev => [...prev, choice]);
        const currentChoiceMsg = messages[currentMessageIndex];

        // Replace choice message with user's response
        setDisplayedMessages(prev => [
            ...prev.filter(m => m.id !== currentChoiceMsg.id),
            { id: Date.now(), type: 'coach', content: choice } as Message
        ]);

        if (currentChoiceMsg.showReaction) {
            setShowReaction(choice);
            setTimeout(() => setShowReaction(null), 1500);
        }

        setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
        }, currentChoiceMsg.showReaction ? 800 : 300);
    };

    const handleComplete = async () => {
        await onComplete?.();
        onNext?.();
    };

    const progressPercent = Math.min((currentMessageIndex / (messages.length - 1)) * 100, 100);

    const renderSystemCard = (msg: Message) => {
        const lines = msg.content.split('\n').filter(l => l.trim());

        const bgStyles: Record<string, string> = {
            info: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
            quote: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
            comparison: 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200',
            stats: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
            takeaway: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300',
            exercise: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
        };

        const iconStyles: Record<string, JSX.Element> = {
            info: <Target className="h-5 w-5 text-indigo-600" />,
            quote: <MessageCircle className="h-5 w-5 text-red-500" />,
            comparison: <Sparkles className="h-5 w-5 text-slate-600" />,
            stats: <TrendingUp className="h-5 w-5 text-amber-600" />,
            takeaway: <Heart className="h-5 w-5 text-emerald-600" />,
            exercise: <CheckCircle2 className="h-5 w-5 text-blue-600" />,
        };

        const style = msg.systemStyle || 'info';

        // Helper to render text with **bold** markers
        const renderTextWithBold = (text: string) => {
            if (!text.includes('**')) return text;
            const parts = text.split(/\*\*/);
            return parts.map((part, j) =>
                j % 2 === 1 ? <strong key={j} className="font-semibold">{part}</strong> : part
            );
        };

        return (
            <div className={`rounded-2xl p-5 border-2 ${bgStyles[style]} mx-2 my-1`}>
                <div className="flex items-start gap-3">
                    <div className="mt-0.5">{iconStyles[style]}</div>
                    <div className="flex-1">
                        {lines.map((line, i) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                                return (
                                    <p key={i} className="font-bold text-slate-900 text-lg mb-3">
                                        {line.replace(/\*\*/g, '')}
                                    </p>
                                );
                            } else if (line.startsWith('•') || line.startsWith('✓')) {
                                return (
                                    <p key={i} className="text-slate-700 text-sm ml-1 mb-1.5">
                                        {renderTextWithBold(line)}
                                    </p>
                                );
                            } else if (line.startsWith('→')) {
                                return (
                                    <p key={i} className="text-slate-500 text-sm font-medium mt-2">
                                        {renderTextWithBold(line)}
                                    </p>
                                );
                            } else if (line.includes('**')) {
                                const parts = line.split(/\*\*/);
                                return (
                                    <p key={i} className="text-slate-700 mb-2">
                                        {parts.map((part, j) =>
                                            j % 2 === 1 ? <strong key={j} className="text-slate-900">{part}</strong> : part
                                        )}
                                    </p>
                                );
                            } else {
                                return (
                                    <p key={i} className="text-slate-700 mb-2">
                                        {line}
                                    </p>
                                );
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderLessonComplete = () => (
        <div className="animate-fade-in my-6 mx-2">
            <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 rounded-3xl border-2 border-emerald-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-yellow-300" />
                        <span className="text-yellow-300 text-sm font-medium uppercase tracking-wide">Lesson Complete!</span>
                    </div>
                    <h3 className="text-white text-xl font-bold">Lesson {lessonNumber}: {lessonTitle}</h3>
                </div>

                <div className="p-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        <span className="text-slate-700 font-medium">
                            {lessonNumber} of {totalLessons} lessons completed
                        </span>
                    </div>

                    <div className="mb-6">
                        <Progress value={(lessonNumber / totalLessons) * 100} className="h-3" />
                        <p className="text-center text-sm text-slate-500 mt-2">
                            {Math.round((lessonNumber / totalLessons) * 100)}% complete
                        </p>
                    </div>

                    {lessonNumber < totalLessons ? (
                        <Button
                            onClick={handleComplete}
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-xl"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Continue to Lesson {lessonNumber + 1}
                                <ArrowRight className="h-5 w-5" />
                            </span>
                        </Button>
                    ) : (
                        <Button
                            onClick={handleComplete}
                            className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-4 px-6 rounded-xl"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Complete & Take Final Exam! →
                            </span>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gold-50/30 flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-burgundy-100 px-4 py-3 shadow-sm">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 rounded-full object-cover shadow-md"
                                />
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Sarah, Your Health Coach</p>
                                <p className="text-xs text-emerald-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    Online now
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">{lessonNumber}/{totalLessons}</span>
                            <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                    </div>
                    <div>
                        <Progress value={progressPercent} className="h-1.5" />
                        <p className="text-xs text-slate-500 mt-1 text-center">
                            {lessonTitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {displayedMessages.map((msg) => (
                        <div key={msg.id} className="animate-fade-in">
                            {msg.type === 'system' ? (
                                renderSystemCard(msg)
                            ) : msg.type === 'user-choice' ? (
                                <div className="flex flex-col gap-2 mx-2">
                                    <p className="text-sm text-slate-600 mb-2">{msg.content}</p>
                                    {msg.choices?.map((choice, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleUserChoice(choice)}
                                            className="w-full bg-white hover:bg-burgundy-50 border-2 border-burgundy-200 hover:border-burgundy-400 rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition-all"
                                        >
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            ) : msg.type === 'pre-recorded-audio' ? (
                                <div className="flex items-start gap-3">
                                    <Image
                                        src={SARAH_AVATAR}
                                        alt="Sarah"
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                                    />
                                    <div className="max-w-[85%]">
                                        <div className="bg-gradient-to-r from-burgundy-100 to-rose-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => msg.audioUrl && playPreRecordedAudio(msg.id, msg.audioUrl)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${playingAudioId === msg.id
                                                            ? 'bg-burgundy-600 text-white'
                                                            : 'bg-white text-burgundy-600 hover:bg-burgundy-50 border border-burgundy-200'
                                                        }`}
                                                >
                                                    {playingAudioId === msg.id ? (
                                                        <Pause className="h-5 w-5" />
                                                    ) : (
                                                        <Play className="h-5 w-5 ml-0.5" />
                                                    )}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="flex gap-0.5">
                                                        {[3, 5, 8, 4, 7, 9, 5, 6, 8, 4, 6, 3, 5, 7, 4].map((h, i) => (
                                                            <div
                                                                key={i}
                                                                className={`w-1 rounded-full transition-colors ${playingAudioId === msg.id ? 'bg-burgundy-500 animate-pulse' : 'bg-burgundy-300'
                                                                    }`}
                                                                style={{ height: `${h * 2}px` }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-burgundy-500 mt-1">{msg.audioDuration || '0:17'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 ml-2">{msg.content}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <Image
                                        src={SARAH_AVATAR}
                                        alt="Sarah"
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                                    />
                                    <div className="max-w-[85%]">
                                        <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                            <p className="text-slate-800 text-[15px] leading-relaxed">
                                                {msg.content.replace('{name}', firstName)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Reaction */}
                    {showReaction && (
                        <div className="flex items-center gap-2 text-sm text-burgundy-600 ml-12 animate-fade-in">
                            <Heart className="h-4 w-4 fill-burgundy-500 text-burgundy-500" />
                            <span>Sarah loved this</span>
                        </div>
                    )}

                    {/* Lesson Complete Card */}
                    {lessonComplete && renderLessonComplete()}

                    <div ref={chatEndRef} />
                </div>
            </div>
        </div>
    );
}
