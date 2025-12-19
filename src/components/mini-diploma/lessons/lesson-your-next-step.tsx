"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ArrowRight,
    MessageCircle, GraduationCap,
    Sparkles, Heart, TrendingUp, Target, Loader2,
    Award, Play, Pause, Star, Users, BookOpen, Shield,
} from "lucide-react";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

interface LessonProps {
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    lessonNumber?: number;
    totalLessons?: number;
    firstName?: string;
    isPaid?: boolean;
}

interface Message {
    id: number;
    type: 'coach' | 'system' | 'user-choice' | 'voice-note';
    content: string;
    choices?: string[];
    delay?: number;
    voiceDuration?: string;
    systemStyle?: 'info' | 'quote' | 'comparison' | 'stats' | 'takeaway' | 'exercise';
    showReaction?: boolean;
}

/**
 * Lesson 9: Your Next Step
 * Celebration + CTA to full certification
 */
export function LessonYourNextStep({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 9,
    totalLessons = 9,
    firstName = "friend",
}: LessonProps) {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [showReaction, setShowReaction] = useState<string | null>(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [showCertificateOffer, setShowCertificateOffer] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCache = useRef<Map<number, string>>(new Map());

    const parseVoiceDuration = (duration: string): number => {
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 30;
    };

    const calculateTypingDelay = (content: string): number => {
        const baseDelay = Math.ceil(content.length / 20) * 1000;
        const randomFactor = Math.random() * 800 - 400;
        return Math.max(2500, Math.min(baseDelay + randomFactor, 12000));
    };

    const calculateVoiceDelay = (durationStr: string): { delay: number; isLongAudio: boolean } => {
        const durationSec = parseVoiceDuration(durationStr);
        if (durationSec >= 40) {
            return { delay: 5000 + Math.random() * 3000, isLongAudio: true };
        } else {
            return { delay: durationSec * 0.65 * 1000, isLongAudio: false };
        }
    };

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
                const cleanText = text.replace(/\*\*/g, '').replace(/•/g, '').replace(/→/g, '').replace(/\n/g, ' ').trim();
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
            audio.onerror = () => { setPlayingAudioId(null); setIsAudioLoading(false); };
            await audio.play();
        } catch (error) {
            console.error('TTS error:', error);
            setPlayingAudioId(null);
            setIsAudioLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const messages: Message[] = [
        // CELEBRATION INTRO
        {
            id: 1,
            type: 'coach',
            content: `${firstName}... WE DID IT!`,
            delay: 2500,
        },
        {
            id: 2,
            type: 'coach',
            content: "You just completed all 9 lessons of the FM Mini Diploma! 🎉",
            delay: 3000,
        },
        {
            id: 3,
            type: 'voice-note',
            content: `I'm so proud of you, ${firstName}. Most people don't even finish what they start. But you showed up, lesson after lesson. That tells me everything I need to know about you.`,
            voiceDuration: "0:22",
            delay: 4000,
        },
        {
            id: 4,
            type: 'coach',
            content: "Let's recap what you learned in this Mini Diploma:",
            delay: 3000,
        },
        {
            id: 5,
            type: 'system',
            content: "**Your Mini Diploma Journey:**\n\n✅ What Functional Medicine really is (and why it matters)\n✅ The 7 Body Systems model\n✅ Why YOUR background is your unfair advantage\n✅ The gut-health connection (4R Protocol)\n✅ Hormones, thyroid, and optimal vs. normal\n✅ Connecting the dots like an FM practitioner\n✅ How to work with clients\n✅ Building your practice and getting paid",
            systemStyle: 'takeaway',
            delay: 5500,
        },
        {
            id: 6,
            type: 'coach',
            content: "That's a LOT of foundational knowledge.",
            delay: 2800,
        },
        {
            id: 7,
            type: 'coach',
            content: "You now understand FM better than 95% of health coaches out there.",
            delay: 3200,
        },
        {
            id: 8,
            type: 'user-choice',
            content: "How are you feeling right now?",
            choices: [
                "Ready to take the next step!",
                "Excited but want to learn more",
                "This confirmed I'm on the right path"
            ],
            showReaction: true,
        },

        // THE NEXT STEP
        {
            id: 9,
            type: 'coach',
            content: "I have something special for you, ${firstName}...",
            delay: 3000,
        },
        {
            id: 10,
            type: 'coach',
            content: "Because you completed the Mini Diploma, you've UNLOCKED access to something exclusive.",
            delay: 3500,
        },
        {
            id: 11,
            type: 'voice-note',
            content: "The full Functional Medicine Certification Program. This is where you go from understanding FM to actually PRACTICING it. Where you get the protocols, the tools, the confidence to change lives. And I want you to have it.",
            voiceDuration: "0:24",
            delay: 4000,
        },

        // WHAT'S INCLUDED
        {
            id: 12,
            type: 'system',
            content: "**Full FM Certification Includes:**\n\n📚 **20 Deep-Dive Modules**\nGut healing protocols, hormone optimization, lab interpretation, advanced case studies, and more.\n\n🎓 **Official Certification**\nBecome a Certified Functional Medicine Health Coach—a credential you can display proudly.\n\n👥 **Private Coaching Community**\nConnect with other coaches, get support, share wins.\n\n📞 **Monthly Q&A Calls**\nGet your questions answered by expert FM practitioners.\n\n📋 **Done-For-You Templates**\nIntake forms, protocols, client trackers—everything you need.",
            systemStyle: 'info',
            delay: 6500,
        },
        {
            id: 13,
            type: 'coach',
            content: "This is the training that launched my career.",
            delay: 3000,
        },
        {
            id: 14,
            type: 'coach',
            content: "And now you can access it—at a special Mini Diploma graduate price.",
            delay: 3200,
        },

        // SOCIAL PROOF
        {
            id: 15,
            type: 'system',
            content: "**What Our Graduates Say:**\n\n⭐⭐⭐⭐⭐\n\"I went from burnt-out nurse to fully booked FM coach in 6 months. This program gave me everything I needed.\"\n— Linda, TX\n\n⭐⭐⭐⭐⭐\n\"I doubled my income while working LESS. The protocols alone were worth 10x the investment.\"\n— Maria, CA\n\n⭐⭐⭐⭐⭐\n\"Finally, a certification that teaches you how to actually HELP people heal, not just manage symptoms.\"\n— Jennifer, FL",
            systemStyle: 'quote',
            delay: 6000,
        },
        {
            id: 16,
            type: 'coach',
            content: "These women were exactly where you are right now.",
            delay: 3000,
        },
        {
            id: 17,
            type: 'coach',
            content: "They took the next step. And it changed everything.",
            delay: 3000,
        },

        // THE ASK
        {
            id: 18,
            type: 'voice-note',
            content: `So here's my question, ${firstName}: Are you ready to go all in? To get the full certification, the complete toolkit, and start actually helping people heal? Because I believe you can do this. I've watched you show up for these 9 lessons. Now let's take it to the next level.`,
            voiceDuration: "0:28",
            delay: 4000,
        },
        {
            id: 19,
            type: 'user-choice',
            content: "What would you like to do next?",
            choices: [
                "Yes! Show me the full certification",
                "I need to think about it—send me more info",
                "I want to get my Mini Diploma certificate first"
            ],
        },
    ];

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
                if (isLongAudio) { setIsRecording(false); setIsSending(true); }
                else { setIsRecording(true); setIsSending(false); }

                const timer = setTimeout(() => {
                    setIsRecording(false);
                    setIsSending(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);
                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 800);
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
                    if (nextMsg) setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 600);
                }, typingDelay);
                return () => clearTimeout(timer);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMessageIndex, messages.length]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayedMessages, isTyping, isRecording, isSending, showReaction, showCelebration, showCertificateOffer]);

    const handleUserChoice = (choice: string) => {
        const currentChoiceMsg = messages[currentMessageIndex];
        setDisplayedMessages(prev => [
            ...prev.filter(m => m.id !== currentChoiceMsg.id),
            { id: Date.now(), type: 'coach', content: choice } as Message
        ]);

        if (currentChoiceMsg.showReaction) {
            setShowReaction(choice);
            setTimeout(() => setShowReaction(null), 2500);
        }

        // Handle final choice
        if (currentChoiceMsg.id === 19) {
            setTimeout(() => {
                if (choice.includes("Yes")) {
                    setShowCertificateOffer(true);
                } else if (choice.includes("Mini Diploma certificate")) {
                    setShowCelebration(true);
                } else {
                    // Send more info option
                    setShowCelebration(true);
                }
            }, 800);
        } else {
            setTimeout(() => setCurrentMessageIndex(prev => prev + 1), currentChoiceMsg.showReaction ? 1200 : 400);
        }
    };

    const progressPercent = Math.min((currentMessageIndex / (messages.length - 1)) * 100, 100);

    const renderSystemCard = (msg: Message) => {
        const lines = msg.content.split('\n').filter(l => l.trim());
        const bgStyles: Record<string, string> = {
            info: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
            quote: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
            comparison: 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200',
            stats: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
            takeaway: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300',
            exercise: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200',
        };
        const iconStyles: Record<string, JSX.Element> = {
            info: <Target className="h-5 w-5 text-indigo-600" />,
            quote: <Star className="h-5 w-5 text-amber-500" />,
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
                                return <p key={i} className="font-bold text-slate-900 text-lg mb-3">{line.replace(/\*\*/g, '')}</p>;
                            } else if (line.startsWith('•') || line.startsWith('✅') || line.startsWith('⭐')) {
                                return <p key={i} className="text-slate-700 text-sm ml-1 mb-1.5">{line}</p>;
                            } else if (line.startsWith('→') || line.startsWith('—')) {
                                return <p key={i} className="text-slate-500 text-sm font-medium mt-2">{line}</p>;
                            } else if (line.includes('**')) {
                                const parts = line.split(/\*\*/);
                                return <p key={i} className="text-slate-700 mb-2">{parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-slate-900">{part}</strong> : part)}</p>;
                            } else {
                                return <p key={i} className="text-slate-700 mb-2">{line}</p>;
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderCelebration = () => (
        <div className="animate-fade-in my-6 mx-2">
            <div className="bg-gradient-to-br from-amber-50 via-white to-yellow-50 rounded-3xl border-2 border-amber-300 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Award className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-white text-2xl font-bold mb-1">Congratulations, {firstName}!</h3>
                    <p className="text-amber-100">You've earned your Mini Diploma Certificate</p>
                </div>

                <div className="p-6 text-center">
                    <div className="bg-white rounded-xl border-2 border-amber-200 p-6 mb-6">
                        <GraduationCap className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-slate-800 mb-2">FM Mini Diploma</h4>
                        <p className="text-slate-600 mb-4">Integrative Health & Functional Medicine Foundations</p>
                        <p className="text-sm text-slate-500">Awarded to: <span className="font-semibold text-slate-800">{firstName}</span></p>
                    </div>

                    <Button
                        onClick={() => {
                            onComplete?.();
                            // Navigate to certificate generation
                            window.location.href = "/dashboard/certificates";
                        }}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold py-4 px-6 rounded-xl mb-4"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Award className="h-5 w-5" />
                            Download Your Certificate
                        </span>
                    </Button>

                    <p className="text-sm text-slate-500 mb-6">Your certificate is ready to download and share!</p>

                    <div className="border-t border-slate-200 pt-6">
                        <p className="text-slate-600 mb-4">Ready to become a Certified FM Health Coach?</p>
                        <Button
                            onClick={() => setShowCertificateOffer(true)}
                            variant="outline"
                            className="border-amber-400 text-amber-700 hover:bg-amber-50"
                        >
                            Learn About Full Certification →
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCertificationOffer = () => (
        <div className="animate-fade-in my-6 mx-2">
            <div className="bg-gradient-to-br from-burgundy-50 via-white to-gold-50 rounded-3xl border-2 border-burgundy-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="h-5 w-5 text-gold-400" />
                        <span className="text-gold-400 text-sm font-medium uppercase tracking-wide">Full Certification</span>
                    </div>
                    <h3 className="text-white text-xl font-bold">Become a Certified FM Health Coach</h3>
                </div>

                <div className="p-6">
                    <div className="bg-emerald-50 rounded-xl p-3 mb-5 border border-emerald-200">
                        <p className="text-xs text-emerald-700 text-center font-medium">
                            🎉 Mini Diploma Graduate Special: Save $200 off enrollment
                        </p>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <BookOpen className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">20 Deep-Dive Modules</span>
                                <span className="text-slate-500"> • Complete FM training</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                                <Award className="h-4 w-4 text-gold-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Official Certification</span>
                                <span className="text-slate-500"> • Professional credential</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Private Community</span>
                                <span className="text-slate-500"> • Lifetime access</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <MessageCircle className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Monthly Q&A Calls</span>
                                <span className="text-slate-500"> • Expert support</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-5">
                        <p className="text-xs text-slate-500 mb-1">Mini Diploma Graduate Price</p>
                        <div className="flex items-center justify-center gap-3">
                            <span className="text-slate-400 line-through text-lg">$1,997</span>
                            <span className="text-3xl font-bold text-burgundy-700">$1,797</span>
                        </div>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Or 3 payments of $649</p>
                    </div>

                    <a
                        href="/enroll/full-certification"
                        className="block w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold py-4 px-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all mb-3"
                    >
                        Enroll in Full Certification →
                    </a>

                    <Button
                        onClick={() => {
                            setShowCertificateOffer(false);
                            setShowCelebration(true);
                        }}
                        variant="ghost"
                        className="w-full text-slate-500"
                    >
                        Just give me my Mini Diploma for now
                    </Button>

                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5" />
                            30-day guarantee
                        </span>
                        <span>•</span>
                        <span>Instant access</span>
                    </div>
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
                                <Image src={SARAH_AVATAR} alt="Sarah" width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-md" />
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
                        <p className="text-xs text-slate-500 mt-1 text-center">Your Next Step</p>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="max-w-2xl mx-auto space-y-4">
                    {displayedMessages.map((msg) => (
                        <div key={msg.id} className="animate-fade-in">
                            {msg.type === 'system' ? renderSystemCard(msg) : msg.type === 'user-choice' ? (
                                <div className="flex flex-col gap-2 mx-2">
                                    <p className="text-sm text-slate-600 mb-2">{msg.content}</p>
                                    {msg.choices?.map((choice, i) => (
                                        <button key={i} onClick={() => handleUserChoice(choice)} className="w-full bg-white hover:bg-burgundy-50 border-2 border-burgundy-200 hover:border-burgundy-400 rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition-all">
                                            {choice}
                                        </button>
                                    ))}
                                </div>
                            ) : msg.type === 'voice-note' ? (
                                <div className="flex items-start gap-3">
                                    <Image src={SARAH_AVATAR} alt="Sarah" width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm" />
                                    <div className="max-w-[85%]">
                                        <div className="bg-gradient-to-r from-burgundy-100 to-rose-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => playAudio(msg.id, msg.content)} className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${playingAudioId === msg.id ? 'bg-burgundy-600 text-white' : 'bg-white text-burgundy-600 hover:bg-burgundy-50 border border-burgundy-200'}`}>
                                                    {isAudioLoading && playingAudioId === msg.id ? <Loader2 className="h-5 w-5 animate-spin" /> : playingAudioId === msg.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                                                </button>
                                                <div className="flex-1">
                                                    <div className="h-1 bg-burgundy-200 rounded-full overflow-hidden"><div className={`h-full bg-burgundy-500 rounded-full transition-all duration-300 ${playingAudioId === msg.id ? 'animate-pulse w-full' : 'w-0'}`} /></div>
                                                    <p className="text-xs text-burgundy-500 mt-1">{msg.voiceDuration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3">
                                    <Image src={SARAH_AVATAR} alt="Sarah" width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm" />
                                    <div className="max-w-[85%]"><div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100"><p className="text-slate-800 text-[15px] leading-relaxed">{msg.content}</p></div></div>
                                </div>
                            )}
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image src={SARAH_AVATAR} alt="Sarah" width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm" />
                            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {isRecording && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image src={SARAH_AVATAR} alt="Sarah" width={36} height={36} className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm" />
                            <div className="bg-gradient-to-r from-burgundy-100 to-rose-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                                <div className="flex items-center gap-2 text-burgundy-600">
                                    <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                                    <span className="text-sm font-medium">Sarah is recording...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {showReaction && (
                        <div className="flex items-center gap-2 text-sm text-burgundy-600 ml-12 animate-fade-in">
                            <Heart className="h-4 w-4 fill-burgundy-500 text-burgundy-500" />
                            <span>Sarah loved this</span>
                        </div>
                    )}

                    {showCertificateOffer && renderCertificationOffer()}
                    {showCelebration && !showCertificateOffer && renderCelebration()}

                    <div ref={chatEndRef} />
                </div>
            </div>
        </div>
    );
}
