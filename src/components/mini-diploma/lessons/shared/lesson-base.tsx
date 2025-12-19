"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ArrowRight, Volume2,
    MessageCircle, GraduationCap,
    Sparkles, Heart, TrendingUp, Target, Loader2,
    Award, Play, Pause,
} from "lucide-react";

// Sarah's profile image
const SARAH_AVATAR = "/coaches/sarah-coach.webp";

export interface Message {
    id: number;
    type: 'coach' | 'system' | 'user-choice' | 'voice-note';
    content: string;
    choices?: string[];
    delay?: number;
    voiceDuration?: string;
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
    preRecordedAudioUrl?: string; // Pre-recorded welcome audio URL
}

/**
 * Base lesson component that handles:
 * - Message display with typing indicators
 * - Voice note playback (pre-recorded audio)
 * - User choices
 * - Progress tracking
 * - Lesson completion
 */
export function LessonBase({
    lessonNumber,
    lessonTitle,
    lessonSubtitle,
    totalLessons = 9,
    messages,
    onComplete,
    onNext,
    isCompleted = false,
    firstName = "friend",
    preRecordedAudioUrl,
}: LessonBaseProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [userResponses, setUserResponses] = useState<string[]>([]);
    const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [showReaction, setShowReaction] = useState<string | null>(null);
    const [lessonComplete, setLessonComplete] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCache = useRef<Map<number, string>>(new Map());

    // Parse voice duration string "1:24" to seconds
    const parseVoiceDuration = (duration: string): number => {
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 30;
    };

    // Calculate realistic typing delay
    const calculateTypingDelay = (content: string): number => {
        const baseDelay = Math.ceil(content.length / 20) * 1000;
        const randomFactor = Math.random() * 800 - 400;
        return Math.max(2500, Math.min(baseDelay + randomFactor, 12000));
    };

    // Calculate voice note indicator delay
    const calculateVoiceDelay = (durationStr: string): { delay: number; isLongAudio: boolean } => {
        const durationSec = parseVoiceDuration(durationStr);
        if (durationSec >= 40) {
            return { delay: 5000 + Math.random() * 3000, isLongAudio: true };
        } else {
            return { delay: durationSec * 0.65 * 1000, isLongAudio: false };
        }
    };

    // Play audio using ElevenLabs TTS API
    const playAudio = async (messageId: number, text: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        if (playingAudioId === messageId) {
            setPlayingAudioId(null);
            return;
        }

        setIsAudioLoading(true);
        setPlayingAudioId(messageId);

        try {
            let audioUrl = audioCache.current.get(messageId);

            if (!audioUrl) {
                const cleanText = text
                    .replace(/\*\*/g, '')
                    .replace(/•/g, '')
                    .replace(/→/g, '')
                    .replace(/\n/g, ' ')
                    .trim();

                const response = await fetch('/api/public/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: cleanText }),
                });

                if (!response.ok) throw new Error('Failed to generate audio');

                const data = await response.json();
                if (!data.success || !data.audio) throw new Error('No audio in response');

                audioUrl = data.audio;
                audioCache.current.set(messageId, audioUrl);
            }

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.oncanplaythrough = () => setIsAudioLoading(false);
            audio.onended = () => setPlayingAudioId(null);
            audio.onerror = () => {
                setPlayingAudioId(null);
                setIsAudioLoading(false);
            };

            await audio.play();
        } catch (error) {
            console.error('TTS error:', error);
            setPlayingAudioId(null);
            setIsAudioLoading(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Message progression logic
    useEffect(() => {
        if (currentMessageIndex < messages.length) {
            const currentMsg = messages[currentMessageIndex];

            if (currentMsg.type === 'user-choice') {
                setIsTyping(false);
                setIsRecording(false);
                setIsSending(false);
                setDisplayedMessages(prev => [...prev, currentMsg]);
                return;
            } else if (currentMsg.type === 'voice-note') {
                const { delay: voiceDelay, isLongAudio } = calculateVoiceDelay(currentMsg.voiceDuration || '0:30');

                setIsTyping(false);
                if (isLongAudio) {
                    setIsRecording(false);
                    setIsSending(true);
                } else {
                    setIsRecording(true);
                    setIsSending(false);
                }

                const timer = setTimeout(() => {
                    setIsRecording(false);
                    setIsSending(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);

                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) {
                        setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 800);
                    } else {
                        // Last message - lesson complete
                        setTimeout(() => setLessonComplete(true), 1000);
                    }
                }, voiceDelay);
                return () => clearTimeout(timer);
            } else {
                const typingDelay = calculateTypingDelay(currentMsg.content);

                setIsTyping(true);
                setIsRecording(false);
                setIsSending(false);

                const timer = setTimeout(() => {
                    setIsTyping(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);

                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) {
                        setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 600);
                    } else {
                        // Last message - lesson complete
                        setTimeout(() => setLessonComplete(true), 1000);
                    }
                }, typingDelay);
                return () => clearTimeout(timer);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMessageIndex, messages.length]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayedMessages, isTyping, isRecording, isSending, showReaction, lessonComplete]);

    const handleUserChoice = (choice: string) => {
        setUserResponses(prev => [...prev, choice]);
        const currentChoiceMsg = messages[currentMessageIndex];
        setDisplayedMessages(prev => [
            ...prev.filter(m => m.id !== currentChoiceMsg.id),
            { id: Date.now(), type: 'coach', content: choice } as Message
        ]);

        if (currentChoiceMsg.showReaction) {
            setShowReaction(choice);
            setTimeout(() => setShowReaction(null), 2500);
        }

        setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
        }, currentChoiceMsg.showReaction ? 1200 : 400);
    };

    const handleComplete = () => {
        onComplete?.();
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
                            } else if (line.startsWith('•')) {
                                return (
                                    <p key={i} className="text-slate-700 text-sm ml-1 mb-1.5">
                                        {line}
                                    </p>
                                );
                            } else if (line.startsWith('→')) {
                                return (
                                    <p key={i} className="text-slate-500 text-sm font-medium mt-2">
                                        {line}
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
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="h-5 w-5 text-yellow-300" />
                        <span className="text-yellow-300 text-sm font-medium uppercase tracking-wide">Lesson Complete!</span>
                    </div>
                    <h3 className="text-white text-xl font-bold">Lesson {lessonNumber}: {lessonTitle}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                        <span className="text-slate-700 font-medium">
                            {lessonNumber} of {totalLessons} lessons completed
                        </span>
                    </div>

                    {/* Progress bar */}
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
                                Get Your Mini Diploma Certificate!
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
                                <p className="font-semibold text-slate-800">Sarah, Your FM Coach</p>
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
                            ) : msg.type === 'voice-note' ? (
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
                                                    onClick={() => playAudio(msg.id, msg.content)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                        playingAudioId === msg.id
                                                            ? 'bg-burgundy-600 text-white'
                                                            : 'bg-white text-burgundy-600 hover:bg-burgundy-50 border border-burgundy-200'
                                                    }`}
                                                >
                                                    {isAudioLoading && playingAudioId === msg.id ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : playingAudioId === msg.id ? (
                                                        <Pause className="h-5 w-5" />
                                                    ) : (
                                                        <Play className="h-5 w-5 ml-0.5" />
                                                    )}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="h-1 bg-burgundy-200 rounded-full overflow-hidden">
                                                        <div className={`h-full bg-burgundy-500 rounded-full transition-all duration-300 ${
                                                            playingAudioId === msg.id ? 'animate-pulse w-full' : 'w-0'
                                                        }`} />
                                                    </div>
                                                    <p className="text-xs text-burgundy-500 mt-1">{msg.voiceDuration}</p>
                                                </div>
                                            </div>
                                        </div>
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

                    {/* Recording indicator */}
                    {isRecording && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <div className="bg-gradient-to-r from-burgundy-100 to-rose-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2 text-burgundy-600">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                    </span>
                                    <span className="text-sm font-medium">Sarah is recording...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sending indicator */}
                    {isSending && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <div className="bg-gradient-to-r from-burgundy-100 to-rose-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2 text-burgundy-600">
                                    <Volume2 className="h-4 w-4 animate-pulse" />
                                    <span className="text-sm font-medium">Sending voice note...</span>
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
