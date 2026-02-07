"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Clock, CheckCircle2, ArrowRight, Volume2, VolumeX,
    MessageCircle, User, GraduationCap, Coffee,
    Sparkles, Heart, TrendingUp, Target, Loader2,
    Lock, Award, Users, Shield, BookOpen, DollarSign,
    Play, Pause, Bookmark,
} from "lucide-react";

// Sarah's profile image
const SARAH_AVATAR = "/coaches/sarah-coach.webp";

interface LessonProps {
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    lessonNumber?: number;
    totalLessons?: number;
    firstName?: string;
    isPaid?: boolean;
    checkoutUrl?: string;
}

interface Message {
    id: number;
    type: 'coach' | 'system' | 'user-choice' | 'voice-note';
    content: string;
    choices?: string[];
    delay?: number;
    voiceDuration?: string; // For voice note display e.g. "0:47"
    systemStyle?: 'info' | 'quote' | 'comparison' | 'stats' | 'takeaway';
    showReaction?: boolean; // Show "❤️ Sarah loved this" after user choice
}

/**
 * VARIANT 4: Conversational Coach Format
 * Full Lesson 1 - Based on 1,300+ buyer data analysis
 *
 * Target: 40+ women, 33% nurses/healthcare, burnt out on system
 * Sarah = Former RN, thyroid/fatigue story, found FM, now teaches
 */
export function LessonWhatIsFMV4({
    onComplete,
    onNext,
    isCompleted = false,
    lessonNumber = 1,
    totalLessons = 9,
    firstName: initialFirstName,
    isPaid = false,
    checkoutUrl = "/checkout/mini-diploma",
}: LessonProps) {
    // Name input state - ALWAYS ask for name first, ignore any initialFirstName prop
    const [userName, setUserName] = useState<string>("");
    const [nameInput, setNameInput] = useState("");
    const [hasEnteredName, setHasEnteredName] = useState(false);
    const [isWelcomeVoicePlaying, setIsWelcomeVoicePlaying] = useState(false);

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false); // Start false until name is entered
    const [isRecording, setIsRecording] = useState(false); // "Sarah is recording..." (short audios < 40s)
    const [isSending, setIsSending] = useState(false); // "Sending voice note..." (long audios 40s+)
    const [userResponses, setUserResponses] = useState<string[]>([]);
    const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
    const [isAudioLoading, setIsAudioLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showReaction, setShowReaction] = useState<string | null>(null); // "❤️ Sarah loved this"
    const [showEmailCapture, setShowEmailCapture] = useState(false);
    const [email, setEmail] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioCache = useRef<Map<number, string>>(new Map()); // Cache audio URLs

    // Use userName throughout the conversation (fallback to "friend" if somehow empty)
    const firstName = userName || "friend";

    // Paywall triggers after the last message (id 61) completes
    const PAYWALL_AFTER_MESSAGE = 61;

    // Parse voice duration string "1:24" to seconds
    const parseVoiceDuration = (duration: string): number => {
        const parts = duration.split(':');
        if (parts.length === 2) {
            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
        }
        return 30; // default
    };

    // Calculate realistic typing delay based on content length (~20 chars/sec for comfortable reading)
    const calculateTypingDelay = (content: string): number => {
        const baseDelay = Math.ceil(content.length / 20) * 1000; // Slower: 20 chars/sec instead of 35
        const randomFactor = Math.random() * 800 - 400; // +/- 400ms variance
        return Math.max(2500, Math.min(baseDelay + randomFactor, 12000)); // min 2.5s, max 12s
    };

    // Calculate voice note indicator delay based on duration
    // Short audios (<40s): "Recording..." at 65% of duration
    // Long audios (40s+): "Sending..." at 5-8 seconds
    const calculateVoiceDelay = (durationStr: string): { delay: number; isLongAudio: boolean } => {
        const durationSec = parseVoiceDuration(durationStr);
        if (durationSec >= 40) {
            // Long audio: pre-recorded, just "sending"
            return { delay: 5000 + Math.random() * 3000, isLongAudio: true }; // 5-8 seconds
        } else {
            // Short audio: feels like live recording at 65% of duration
            return { delay: durationSec * 0.65 * 1000, isLongAudio: false };
        }
    };

    // Play audio using ElevenLabs TTS API
    const playAudio = async (messageId: number, text: string) => {
        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // If clicking the same message that's playing, just stop it
        if (playingAudioId === messageId) {
            setPlayingAudioId(null);
            return;
        }

        setIsAudioLoading(true);
        setPlayingAudioId(messageId);

        try {
            // Check cache first
            let audioUrl = audioCache.current.get(messageId);

            if (!audioUrl) {
                // Clean the text (remove markdown formatting)
                const cleanText = text
                    .replace(/\*\*/g, '')
                    .replace(/•/g, '')
                    .replace(/→/g, '')
                    .replace(/\n/g, ' ')
                    .trim();

                // Call ElevenLabs TTS API
                const response = await fetch('/api/public/tts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: cleanText }),
                });

                if (!response.ok) {
                    throw new Error('Failed to generate audio');
                }

                const data = await response.json();
                if (!data.success || !data.audio) {
                    throw new Error('No audio in response');
                }

                audioUrl = data.audio;
                // Cache the audio URL
                audioCache.current.set(messageId, audioUrl);
            }

            // Create and play audio
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.oncanplaythrough = () => {
                setIsAudioLoading(false);
            };

            audio.onended = () => {
                setPlayingAudioId(null);
            };

            audio.onerror = () => {
                console.error('Audio playback error');
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

    // Handle name submission - starts the conversation with a personal voice note
    const handleNameSubmit = async () => {
        if (!nameInput.trim()) return;

        const enteredName = nameInput.trim();
        setUserName(enteredName);
        setHasEnteredName(true);

        // Show "Sarah is recording..." indicator FIRST
        setIsRecording(true);
        setIsWelcomeVoicePlaying(true);

        // Generate personalized welcome voice note - warm, personal, builds connection
        try {
            const welcomeText = `Hey ${enteredName}! I'm so glad you're here. I'm Sarah. I was a nurse for 12 years, and what I'm about to share with you changed everything for me. This isn't a video you watch. It's a real conversation between us. I'm going to tell you my story... and I have a feeling it might sound a lot like yours. Let's find out together.`;

            // Fetch audio in background while showing "recording..."
            const responsePromise = fetch('/api/public/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: welcomeText }),
            });

            // Show "recording" for at least 2-3 seconds before playing
            const minRecordingTime = new Promise(resolve => setTimeout(resolve, 2500));

            // Wait for both: minimum recording time AND audio fetch
            const [response] = await Promise.all([responsePromise, minRecordingTime]);

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.audio) {
                    // Cache this as message ID 0 (welcome message)
                    audioCache.current.set(0, data.audio);

                    // Play the audio
                    const audio = new Audio(data.audio);
                    audioRef.current = audio;
                    setPlayingAudioId(0);

                    audio.onended = () => {
                        setPlayingAudioId(null);
                        setIsRecording(false);
                        setIsWelcomeVoicePlaying(false);
                        // Start showing conversation messages
                        setIsTyping(true);
                    };

                    audio.onerror = () => {
                        setPlayingAudioId(null);
                        setIsRecording(false);
                        setIsWelcomeVoicePlaying(false);
                        setIsTyping(true);
                    };

                    await audio.play();
                    return;
                }
            }
        } catch (error) {
            console.error('Welcome voice error:', error);
        }

        // If TTS fails, just start conversation after a brief delay
        setTimeout(() => {
            setIsRecording(false);
            setIsWelcomeVoicePlaying(false);
            setIsTyping(true);
        }, 2000);
    };

    const messages: Message[] = [
        // PART 1: Welcome + Hook
        // Note: The personalized "Hey [Name]!" intro is now handled via the welcome voice note
        // that plays immediately after the user enters their name. So we skip the old id:1 message.
        {
            id: 2,
            type: 'user-choice',
            content: "What best describes you right now?",
            choices: [
                "Healthcare worker (nurse, PA, medical background)",
                "Wellness professional (coach, yoga, nutrition)",
                "On my own healing journey",
                "Career changer looking for purpose"
            ],
        },
        {
            id: 3,
            type: 'coach',
            content: "I see you. Wherever you're starting from, you're in exactly the right place.",
            delay: 2800,
        },
        {
            id: 4,
            type: 'user-choice',
            content: "Have you ever felt frustrated with the \"sick care\" system—either as a provider, or as a patient?",
            choices: [
                "YES. I've seen the system fail people over and over",
                "Absolutely. I've been dismissed by doctors myself",
                "Both. I've seen it AND lived it"
            ],
        },

        // PART 2: Sarah's Story - Emotional Core
        {
            id: 5,
            type: 'coach',
            content: "I felt that frustration too. Deeply. Before I teach you anything about Functional Medicine, let me share my story—I have a feeling it might sound familiar...",
            delay: 3500,
        },
        {
            id: 6,
            type: 'voice-note',
            content: "I was an RN for 12 years. ICU. Night shifts. I loved my patients. But I hated what I was doing TO them. Every day, the same thing: Patient comes in. We stabilize them. Send them home with prescriptions. See them again in 3 months. Worse.",
            voiceDuration: "1:24",
            delay: 4000,
        },
        {
            id: 7,
            type: 'coach',
            content: "I kept asking \"WHY is this happening?\" And no one had answers. Just more meds.",
            delay: 3500,
        },
        {
            id: 8,
            type: 'coach',
            content: "Then it happened to ME.",
            delay: 2500,
        },
        {
            id: 9,
            type: 'coach',
            content: "At 41, I crashed.",
            delay: 2500,
        },
        {
            id: 12,
            type: 'coach',
            content: "Exhausted doesn't even cover it. Brain fog so bad I'd forget why I walked into a room. My joints ached. I gained 25 pounds eating the same way I always had.",
            delay: 4000,
        },
        {
            id: 13,
            type: 'coach',
            content: "I went to my own doctor. Ran labs. Everything \"within normal range.\"",
            delay: 3200,
        },
        {
            id: 14,
            type: 'coach',
            content: "She looked at me and said...",
            delay: 2500,
        },
        {
            id: 15,
            type: 'voice-note',
            content: "You're just stressed. Maybe it's perimenopause. Here's an antidepressant. I wanted to SCREAM. I wasn't depressed. I was SICK. And no one was listening.",
            voiceDuration: "0:28",
            delay: 3500,
        },
        {
            id: 16,
            type: 'user-choice',
            content: "Does any of this sound familiar?",
            choices: [
                "This is literally my story 😭",
                "I've heard this from so many patients/clients",
                "I'm going through something like this right now"
            ],
            showReaction: true, // Will show "❤️ Sarah loved this" after selection
        },

        // PART 3: Reaction + Discovery
        {
            id: 17,
            type: 'voice-note',
            content: "I KNEW you'd feel that. I get chills every time someone says that. Because I remember feeling so alone. Like no one understood. But I see you. I do.",
            voiceDuration: "0:22",
            delay: 3000,
        },
        {
            id: 18,
            type: 'coach',
            content: "That moment changed everything.",
            delay: 2800,
        },
        {
            id: 19,
            type: 'coach',
            content: "A friend sent me a podcast about Functional Medicine—a doctor who spent 90 MINUTES with patients.",
            delay: 3500,
        },
        {
            id: 20,
            type: 'coach',
            content: "Who asked about their childhood, their stress, their gut, their sleep. I thought: \"That's not real medicine.\" But I was desperate.",
            delay: 3800,
        },
        {
            id: 21,
            type: 'coach',
            content: "My first FM appointment? She asked me questions no one had ever asked.",
            delay: 3000,
        },
        {
            id: 22,
            type: 'system',
            content: "**She asked:**\n\n• \"Tell me about your digestion.\"\n• \"How do you sleep? Do you dream?\"\n• \"What was happening in your life when this started?\"\n• \"What do you eat in a typical day?\"\n• \"How are your relationships? Your stress?\"",
            systemStyle: 'info',
            delay: 3500,
        },
        {
            id: 23,
            type: 'coach',
            content: "Two hours. She SAW me. Not my lab numbers. ME.",
            delay: 3200,
        },
        {
            id: 24,
            type: 'coach',
            content: "Turns out: My gut was a wreck. (Hello, years of hospital coffee and stress eating.) My thyroid was \"normal\" but NOT optimal. My cortisol was tanked.",
            delay: 4000,
        },
        {
            id: 25,
            type: 'coach',
            content: "Everything was connected.",
            delay: 2500,
        },
        {
            id: 26,
            type: 'voice-note',
            content: "Six months later? I had my brain back. My energy back. My LIFE back. I felt like MYSELF again for the first time in years.",
            voiceDuration: "0:38",
            delay: 4000,
        },
        {
            id: 27,
            type: 'coach',
            content: "That's when I understood: This isn't alternative medicine. This is what medicine SHOULD be.",
            delay: 3500,
        },

        // PART 4: What FM Actually Is
        {
            id: 28,
            type: 'coach',
            content: "So let me teach you what I learned...",
            delay: 2800,
        },
        {
            id: 29,
            type: 'system',
            content: "**What is Functional Medicine?**\n\nFunctional Medicine is a patient-centered, science-based approach that asks **\"WHY\"** you're sick—not just **\"WHAT\"** disease you have.\n\nIt looks at root causes, not just symptoms.",
            systemStyle: 'info',
            delay: 3500,
                    },
        {
            id: 30,
            type: 'coach',
            content: "Here's the simplest way to understand the difference:",
            delay: 2800,
        },
        {
            id: 31,
            type: 'system',
            content: "**Conventional Medicine:**\n\"You have high blood pressure. Take this medication.\"\n→ Treats the WHAT\n\n**Functional Medicine:**\n\"WHY is your blood pressure high? Is it stress? Gut health? Inflammation? Insulin resistance? Sleep?\"\n→ Asks the WHY",
            systemStyle: 'comparison',
            delay: 4000,
        },
        {
            id: 32,
            type: 'coach',
            content: "Same symptom. Completely different approach.",
            delay: 3000,
        },
        {
            id: 33,
            type: 'user-choice',
            content: "How does this land for you?",
            choices: [
                "THIS is what's been missing",
                "I've been trying to practice this way but didn't have the framework",
                "I want to learn how to do this"
            ],
        },

        // PART 5: Why This Matters NOW
        {
            id: 34,
            type: 'coach',
            content: "Here's why this matters so much right now...",
            delay: 2800,
        },
        {
            id: 35,
            type: 'system',
            content: "**The Reality:**\n\n• 60%+ of adults have a chronic condition\n• 90% of healthcare spending goes to chronic disease\n• Yet most doctors get ZERO training in root-cause medicine",
            systemStyle: 'stats',
            delay: 3500,
        },
        {
            id: 36,
            type: 'coach',
            content: "The system isn't broken. It was designed this way. Acute care. 15-minute appointments. A pill for every symptom.",
            delay: 3800,
        },
        {
            id: 37,
            type: 'coach',
            content: "But people are waking up. They're DONE being dismissed.",
            delay: 3200,
                    },
        {
            id: 38,
            type: 'system',
            content: "**The Opportunity:**\n\n• 79% of people want holistic health solutions\n• Functional Medicine is growing 15%+ every year\n• There aren't enough trained practitioners to meet demand",
            systemStyle: 'stats',
            delay: 3500,
        },
        {
            id: 39,
            type: 'coach',
            content: "And that's exactly why I created this program. Because the world doesn't just need more doctors.",
            delay: 3500,
        },
        {
            id: 40,
            type: 'coach',
            content: "It needs people like YOU. People who understand root causes. Who LISTEN. Who've maybe even lived it yourself.",
            delay: 3800,
                    },

        // PART 6: SUCCESS STORIES - Activating Mirror Neurons
        {
            id: 41,
            type: 'coach',
            content: "Let me tell you about some women who were exactly where you are right now...",
            delay: 3200,
        },
        {
            id: 42,
            type: 'system',
            content: "**Linda, 52 — ER Nurse from Texas**\n\n\"After 23 years in the ER, I was burned out. I couldn't save one more person just to send them home with pills that wouldn't fix anything.\"\n\n→ Now she runs her own FM health coaching practice\n→ She charges $125/hour and has a 3-week waitlist\n→ \"I finally feel like I'm actually HELPING people heal.\"",
            systemStyle: 'takeaway',
            delay: 4500,
        },
        {
            id: 43,
            type: 'coach',
            content: "Linda didn't need another nursing degree. She needed a different FRAMEWORK.",
            delay: 3200,
                    },
        {
            id: 44,
            type: 'system',
            content: "**Maria, 47 — Former Corporate HR from California**\n\n\"I had Hashimoto's for 8 years. Doctors just kept adjusting my meds. I was exhausted, gaining weight, losing my hair.\"\n\n→ She learned the FM approach and healed HERSELF first\n→ Now she coaches other women with thyroid issues\n→ \"My clients pay me $85/session. I do 15-20 sessions a week from home.\"",
            systemStyle: 'takeaway',
            delay: 4500,
        },
        {
            id: 45,
            type: 'coach',
            content: "Maria turned her own struggle into her superpower. Her clients trust her because she's LIVED it.",
            delay: 3500,
        },
        {
            id: 46,
            type: 'system',
            content: "**Jennifer, 44 — Yoga Teacher from Florida**\n\n\"I loved teaching yoga but I kept hitting a wall with clients who had chronic issues. Poses weren't enough.\"\n\n→ Adding FM coaching let her offer deeper transformation\n→ She now runs 6-week \"Yoga + Root Cause\" programs for $497 each\n→ \"I went from $40/class to $5,000/month in 4 months.\"",
            systemStyle: 'takeaway',
            delay: 4500,
        },
        {
            id: 47,
            type: 'user-choice',
            content: "Which of these stories resonates most with you?",
            choices: [
                "Linda — I'm in healthcare and ready for something different",
                "Maria — I've struggled with my own health and want to help others",
                "Jennifer — I'm a wellness pro who wants to go deeper"
            ],
        },

        // PART 7: Income Opportunity
        {
            id: 48,
            type: 'coach',
            content: "Here's what I want you to understand about the OPPORTUNITY here...",
            delay: 3200,
                    },
        {
            id: 49,
            type: 'system',
            content: "**What FM Health Coaches Earn:**\n\n• Part-time (10 clients/week): $3,000-$5,000/month\n• Full-time (20 clients/week): $8,000-$12,000/month\n• Premium packages: $150/hour or $2,000+ programs\n\nMost start part-time while keeping their current job.",
            systemStyle: 'stats',
            delay: 4000,
        },
        {
            id: 50,
            type: 'coach',
            content: "You don't need to quit your job tomorrow. You don't need a medical degree. You just need the RIGHT training and framework.",
            delay: 3800,
        },
        {
            id: 51,
            type: 'coach',
            content: "That's exactly what this Mini Diploma gives you—the foundation to start helping people (and earning) within days, not years.",
            delay: 3800,
                    },
        {
            id: 52,
            type: 'user-choice',
            content: "What would earning $50-$150/hour helping people heal mean for YOUR life?",
            choices: [
                "Freedom to leave a job that's burning me out",
                "Extra income while I build something meaningful",
                "A purpose-driven career I actually LOVE"
            ],
        },

        // PART 8: The Takeaway + Close
        {
            id: 53,
            type: 'coach',
            content: "Whether you're a burnt-out nurse who's seen the system fail... A wellness pro who wants deeper tools... Or someone on your own healing journey...",
            delay: 4000,
        },
        {
            id: 54,
            type: 'coach',
            content: "You can learn to think this way. To help people this way. To build something YOURS.",
            delay: 3500,
        },
        {
            id: 55,
            type: 'coach',
            content: "That's what this program is for.",
            delay: 2800,
        },
        {
            id: 56,
            type: 'system',
            content: "**Your Key Takeaway:**\n\nFunctional Medicine asks **\"WHY?\"** instead of **\"WHAT?\"**\n\nIt treats the PERSON, not just the diagnosis.\n\nAnd YOU can learn to do this—whether you want to coach others, heal yourself, or both.",
            systemStyle: 'takeaway',
            delay: 4000,
                    },
        {
            id: 57,
            type: 'coach',
            content: `You just finished Lesson 1, ${firstName}. I'm proud of you for being here. This is the first step.`,
            delay: 3500,
        },
        {
            id: 58,
            type: 'coach',
            content: "Here's what's coming next...",
            delay: 2500,
        },
        {
            id: 59,
            type: 'system',
            content: "📚 **Lesson 2:** The 7 Body Systems Model\nHow everything in the body connects\n\n📚 **Lesson 3-7:** Deep Dives\nGut health. Hormones. Inflammation.\nThe real frameworks you'll use.\n\n📚 **Lesson 8-9:** Your Practice\nHow to find clients, price yourself, and start earning.\n\nPlus your **Mini Diploma certificate** at the end.",
            systemStyle: 'takeaway',
            delay: 5000,
        },
        {
            id: 60,
            type: 'coach',
            content: "This is where you go from 'that's interesting' to 'I can actually do this.'",
            delay: 3500,
        },
        {
            id: 61,
            type: 'coach',
            content: `${firstName}, before we continue — can I be honest with you for a second?`,
            delay: 3000,
        },
    ];

    useEffect(() => {
        // Don't start messages until user has entered their name and welcome voice is done
        if (!hasEnteredName || isWelcomeVoicePlaying) return;

        if (currentMessageIndex < messages.length) {
            const currentMsg = messages[currentMessageIndex];

            if (currentMsg.type === 'user-choice') {
                setIsTyping(false);
                setIsRecording(false);
                setIsSending(false);
                setDisplayedMessages(prev => [...prev, currentMsg]);
                return;
            } else if (currentMsg.type === 'voice-note') {
                // Calculate realistic voice note timing
                const { delay: voiceDelay, isLongAudio } = calculateVoiceDelay(currentMsg.voiceDuration || '0:30');

                setIsTyping(false);
                if (isLongAudio) {
                    // Long audio: "Sending voice note..." (pre-recorded)
                    setIsRecording(false);
                    setIsSending(true);
                } else {
                    // Short audio: "Sarah is recording..." (feels live)
                    setIsRecording(true);
                    setIsSending(false);
                }

                const timer = setTimeout(() => {
                    setIsRecording(false);
                    setIsSending(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);

                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) {
                        setTimeout(() => {
                            setCurrentMessageIndex(prev => prev + 1);
                        }, 800);
                    }
                }, voiceDelay);
                return () => clearTimeout(timer);
            } else {
                // Calculate realistic typing delay based on content length
                const typingDelay = calculateTypingDelay(currentMsg.content);

                // Show "Sarah is typing..." for text messages
                setIsTyping(true);
                setIsRecording(false);
                setIsSending(false);
                const timer = setTimeout(() => {
                    setIsTyping(false);
                    setDisplayedMessages(prev => [...prev, currentMsg]);

                    const nextMsg = messages[currentMessageIndex + 1];
                    if (nextMsg) {
                        setTimeout(() => {
                            setCurrentMessageIndex(prev => prev + 1);
                        }, 600);
                    } else if (currentMsg.id >= PAYWALL_AFTER_MESSAGE && !isPaid) {
                        // Last message reached - show paywall with typing indicator first
                        setTimeout(() => {
                            setIsTyping(true); // Show "Sarah is typing..." first
                            setTimeout(() => {
                                setIsTyping(false);
                                setShowPaywall(true);
                            }, 2500); // Wait 2.5s before showing paywall
                        }, 800);
                    }
                }, typingDelay);
                return () => clearTimeout(timer);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMessageIndex, hasEnteredName, isWelcomeVoicePlaying]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [displayedMessages, isTyping, isRecording, isSending, showPaywall, showReaction]);

    const handleUserChoice = (choice: string) => {
        setUserResponses(prev => [...prev, choice]);
        // Remove the choice message and add user's response
        const currentChoiceMsg = messages[currentMessageIndex];
        setDisplayedMessages(prev => [
            ...prev.filter(m => m.id !== currentChoiceMsg.id),
            { id: Date.now(), type: 'coach', content: choice } as Message
        ]);

        // Show reaction if this choice triggers it
        if (currentChoiceMsg.showReaction) {
            setShowReaction(choice);
            setTimeout(() => {
                setShowReaction(null);
            }, 2500);
        }

        // Continue to next message after choice
        setTimeout(() => {
            setCurrentMessageIndex(prev => prev + 1);
        }, currentChoiceMsg.showReaction ? 1200 : 400);
    };

    const progressPercent = Math.min((currentMessageIndex / (messages.length - 1)) * 100, 100);

    const renderSystemCard = (msg: Message) => {
        const lines = msg.content.split('\n').filter(l => l.trim());

        const bgStyles = {
            info: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
            quote: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200',
            comparison: 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200',
            stats: 'bg-gradient-to-br from-gold-50 to-gold-100 border-gold-300',
            takeaway: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300',
        };

        const iconStyles = {
            info: <Target className="h-5 w-5 text-indigo-600" />,
            quote: <MessageCircle className="h-5 w-5 text-red-500" />,
            comparison: <Sparkles className="h-5 w-5 text-slate-600" />,
            stats: <TrendingUp className="h-5 w-5 text-gold-600" />,
            takeaway: <Heart className="h-5 w-5 text-emerald-600" />,
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
                                // Handle inline bold
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

    // Paywall Card Component with Voice Ask + Save Progress
    const renderPaywallCard = () => (
        <div className="animate-fade-in my-6 space-y-4">
            {/* Sarah's voice message ask */}
            <div className="flex items-start gap-3">
                <Image
                    src={SARAH_AVATAR}
                    alt="Sarah"
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                />
                <div className="max-w-[85%]">
                    {/* Voice message bubble */}
                    <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-burgundy-100">
                        <p className="text-xs text-burgundy-600 font-medium mb-2 flex items-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Voice message from Sarah
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => playAudio(9999, `${firstName}, you're still here. Most people leave after 30 seconds. But not you. That tells me everything. This is just the beginning of becoming a certified functional medicine coach—and finally doing work that matters.`)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                    playingAudioId === 9999
                                        ? 'bg-burgundy-600 text-white'
                                        : 'bg-white text-burgundy-600 hover:bg-burgundy-100 border border-burgundy-200'
                                }`}
                            >
                                {isAudioLoading && playingAudioId === 9999 ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : playingAudioId === 9999 ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Play className="h-5 w-5 ml-0.5" />
                                )}
                            </button>
                            <div className="flex-1">
                                <div className="h-1 bg-burgundy-200 rounded-full overflow-hidden">
                                    <div className={`h-full bg-burgundy-500 rounded-full transition-all duration-300 ${
                                        playingAudioId === 9999 ? 'animate-pulse w-full' : 'w-0'
                                    }`} />
                                </div>
                                <p className="text-xs text-burgundy-500 mt-1">0:20</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Paywall Card */}
            <div className="bg-gradient-to-br from-burgundy-50 via-white to-gold-50 rounded-3xl border-2 border-burgundy-200 shadow-xl overflow-hidden mx-2">
                {/* Header */}
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <GraduationCap className="h-5 w-5 text-gold-400" />
                        <span className="text-gold-400 text-sm font-medium uppercase tracking-wide">Functional Medicine</span>
                    </div>
                    <h3 className="text-white text-xl font-bold mb-1">Mini Diploma</h3>
                    <p className="text-burgundy-200 text-sm">Start earning $50-$150/hr in 7 days</p>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Success reminder */}
                    <div className="bg-emerald-50 rounded-xl p-3 mb-5 border border-emerald-200">
                        <p className="text-xs text-emerald-700 text-center font-medium">
                            Linda charges $125/hr • Maria earns $1,700/week • Jennifer hit $5K/month
                        </p>
                    </div>

                    {/* What's included */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <BookOpen className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Complete FM Framework</span>
                                <span className="text-slate-500"> • 2 modules</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                                <Award className="h-4 w-4 text-gold-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Mini Diploma Certificate</span>
                                <span className="text-slate-500"> • Shareable credential</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">1:1 Coach Support</span>
                                <span className="text-slate-500"> • Until you finish</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <DollarSign className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Business Starter Kit</span>
                                <span className="text-slate-500"> • $800+ value</span>
                            </div>
                        </div>
                    </div>

                    {/* Social proof */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-5">
                        <p className="text-xs text-slate-600 text-center">
                            <span className="font-semibold text-slate-800">843+ nurses & coaches</span> already started their FM journey here
                        </p>
                    </div>

                    {/* Price */}
                    <div className="text-center mb-5">
                        <div className="flex items-center justify-center gap-3 mb-1">
                            <span className="text-slate-400 line-through text-lg">$97</span>
                            <span className="text-4xl font-bold text-burgundy-700">$7</span>
                        </div>
                        <p className="text-xs text-slate-500">Less than a coffee — could change your career</p>
                    </div>

                    {/* CTA Button */}
                    <a
                        href={checkoutUrl}
                        className="block w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold py-4 px-6 rounded-xl text-center shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] mb-3"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <Lock className="h-4 w-4" />
                            Continue with Sarah — $7
                        </span>
                    </a>

                    {/* Save Progress Option */}
                    {!showEmailCapture ? (
                        <button
                            onClick={() => setShowEmailCapture(true)}
                            className="block w-full text-center py-3 text-sm text-slate-500 hover:text-burgundy-600 transition-colors"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Bookmark className="h-4 w-4" />
                                Not ready yet? Save my progress
                            </span>
                        </button>
                    ) : (
                        <div className="space-y-3 animate-fade-in mt-4">
                            {/* Sarah's personalized message */}
                            <div className="flex items-start gap-2">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={28}
                                    height={28}
                                    className="w-7 h-7 rounded-full object-cover shrink-0"
                                />
                                <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 shadow-sm border border-slate-100">
                                    <p className="text-sm text-slate-700">
                                        No problem, {firstName}! I'll save everything so you can come back anytime.
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-7" />
                                <div className="bg-white rounded-xl rounded-tl-sm px-3 py-2 shadow-sm border border-slate-100">
                                    <p className="text-sm text-slate-700 font-medium">
                                        Where should I send your link?
                                    </p>
                                </div>
                            </div>
                            {/* Email input */}
                            <div className="flex gap-2 ml-9">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-2.5 border-2 border-burgundy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                                />
                                <Button
                                    onClick={() => {
                                        // In production, this would save email
                                        alert(`Progress saved for ${firstName}! Check your email.`);
                                        setShowEmailCapture(false);
                                    }}
                                    className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-4 py-2.5 rounded-xl text-sm"
                                >
                                    Save
                                </Button>
                            </div>
                            {/* Bonus teaser */}
                            <div className="flex items-start gap-2">
                                <div className="w-7" />
                                <p className="text-xs text-slate-500 italic px-1">
                                    I'll also include my Root Cause Cheat Sheet as a thank you.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Trust badges */}
                    <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                            <Shield className="h-3.5 w-3.5" />
                            Secure checkout
                        </span>
                        <span>•</span>
                        <span>Instant access</span>
                        <span>•</span>
                        <span>30-day guarantee</span>
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
                            <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">
                                Lesson {lessonNumber}/{totalLessons}
                            </Badge>
                        </div>
                    </div>
                    <Progress value={progressPercent} className="h-1.5 bg-burgundy-100" />
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Name Input Screen - Shows FIRST before any content */}
                    {!hasEnteredName && (
                        <div className="animate-fade-in">
                            {/* Welcome Header with Context */}
                            <div className="text-center mb-8">
                                <Badge className="bg-gold-100 text-gold-700 border-0 mb-3">
                                    <Coffee className="h-3 w-3 mr-1" />
                                    FREE Mini Diploma • 3 Lessons
                                </Badge>
                                <h1 className="text-2xl font-bold text-slate-800 mb-2">Discover Functional Medicine</h1>
                                <p className="text-sm text-burgundy-600 font-medium mb-2">
                                    The root-cause approach that's helping nurses leave burnout behind
                                </p>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Join 843+ healthcare professionals in this free interactive lesson with Sarah, your FM coach.
                                </p>
                            </div>

                            {/* Sarah's name ask message */}
                            <div className="flex items-start gap-3 mb-4">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                                />
                                <div className="max-w-[85%]">
                                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                        <p className="text-slate-700 leading-relaxed">
                                            Hey! I'm Sarah. 👋
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-9" /> {/* Spacer for alignment */}
                                <div className="max-w-[85%]">
                                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                        <p className="text-slate-700 leading-relaxed">
                                            Before we dive in, I'd love to know who I'm talking to.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 mb-6">
                                <div className="w-9" /> {/* Spacer for alignment */}
                                <div className="max-w-[85%]">
                                    <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                        <p className="text-slate-700 leading-relaxed font-medium">
                                            What's your first name?
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Name Input Field */}
                            <div className="flex items-center gap-3 ml-12">
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={nameInput}
                                        onChange={(e) => setNameInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && nameInput.trim()) {
                                                handleNameSubmit();
                                            }
                                        }}
                                        placeholder="Type your name..."
                                        autoFocus
                                        className="w-full px-4 py-3 border-2 border-burgundy-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent bg-white shadow-sm"
                                    />
                                </div>
                                <button
                                    onClick={handleNameSubmit}
                                    disabled={!nameInput.trim()}
                                    className={`px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                                        nameInput.trim()
                                            ? 'bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-md hover:shadow-lg'
                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    Send
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Welcome Voice Note Playing (after name submitted) */}
                    {hasEnteredName && isWelcomeVoicePlaying && (
                        <div className="animate-fade-in">
                            {/* Module Badge */}
                            <div className="text-center mb-6">
                                <Badge className="bg-gold-100 text-gold-700 border-0">
                                    <Coffee className="h-3 w-3 mr-1" />
                                    Module 1 • Lesson 1
                                </Badge>
                            </div>

                            {/* Show user's name as their response */}
                            <div className="flex justify-end mb-4">
                                <div className="max-w-[80%] bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md">
                                    <p>{userName}</p>
                                </div>
                            </div>

                            {/* Sarah's voice note response */}
                            <div className="flex items-start gap-3">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                                />
                                <div className="max-w-[85%]">
                                    <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-burgundy-100">
                                        <p className="text-xs text-burgundy-600 font-medium mb-2 flex items-center gap-1.5">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            {playingAudioId === 0 ? 'Playing voice message...' : 'Sarah is recording a voice message...'}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                playingAudioId === 0
                                                    ? 'bg-burgundy-600 text-white'
                                                    : 'bg-white text-burgundy-600 border border-burgundy-200'
                                            }`}>
                                                {playingAudioId === 0 ? (
                                                    <Volume2 className="h-5 w-5 animate-pulse" />
                                                ) : (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex gap-0.5">
                                                    {[...Array(16)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-1 bg-burgundy-400 rounded-full animate-pulse"
                                                            style={{
                                                                height: `${8 + Math.random() * 12}px`,
                                                                animationDelay: `${i * 80}ms`
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content - Shows after name entered and welcome voice done */}
                    {hasEnteredName && !isWelcomeVoicePlaying && (
                        <>
                            {/* Welcome Header */}
                            <div className="text-center mb-8">
                                <Badge className="bg-gold-100 text-gold-700 border-0 mb-3">
                                    <Coffee className="h-3 w-3 mr-1" />
                                    Module 1 • Lesson 1
                                </Badge>
                                <h1 className="text-2xl font-bold text-slate-800 mb-1">What is Functional Medicine?</h1>
                                <p className="text-sm text-burgundy-600 font-medium mb-1">
                                    Why health coaches are earning $50–$150/hr with this approach
                                </p>
                                <p className="text-xs text-slate-500">
                                    Learn 1:1 with Sarah — a real conversation, not a video.
                                </p>
                            </div>

                            {/* Show user's name as first response in conversation */}
                            <div className="flex justify-end mb-4 animate-fade-in">
                                <div className="max-w-[80%] bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md">
                                    <p>{userName}</p>
                                </div>
                            </div>

                            {/* Welcome voice note (replayable) */}
                            <div className="flex items-start gap-3 mb-4 animate-fade-in">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                                />
                                <div className="max-w-[85%]">
                                    <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-burgundy-100">
                                        <p className="text-xs text-burgundy-600 font-medium mb-2 flex items-center gap-1">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                            </span>
                                            Voice message from Sarah
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => playAudio(0, `Hey ${userName}! I'm so glad you're here. I'm Sarah. I was a nurse for 12 years, and what I'm about to share with you changed everything for me. This isn't a video you watch. It's a real conversation between us. I'm going to tell you my story... and I have a feeling it might sound a lot like yours. Let's find out together.`)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                    playingAudioId === 0
                                                        ? 'bg-burgundy-600 text-white'
                                                        : 'bg-white text-burgundy-600 hover:bg-burgundy-100 border border-burgundy-200'
                                                }`}
                                            >
                                                {isAudioLoading && playingAudioId === 0 ? (
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                ) : playingAudioId === 0 ? (
                                                    <Pause className="h-5 w-5" />
                                                ) : (
                                                    <Play className="h-5 w-5 ml-0.5" />
                                                )}
                                            </button>
                                            <div className="flex-1">
                                                <div className="h-1 bg-burgundy-200 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-burgundy-500 rounded-full transition-all duration-300 ${
                                                        playingAudioId === 0 ? 'animate-pulse w-full' : 'w-0'
                                                    }`} />
                                                </div>
                                                <p className="text-xs text-burgundy-500 mt-1">0:22</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Messages - Only show after welcome sequence */}
                    {hasEnteredName && !isWelcomeVoicePlaying && displayedMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className="animate-fade-in"
                        >
                            {msg.type === 'coach' && !userResponses.includes(msg.content) ? (
                                // Coach message
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
                                            <p className="text-slate-700 leading-relaxed">{msg.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : msg.type === 'coach' && userResponses.includes(msg.content) ? (
                                // User's response
                                <div className="flex justify-end">
                                    <div className="max-w-[80%] bg-gradient-to-br from-burgundy-600 to-burgundy-700 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-md">
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            ) : msg.type === 'voice-note' ? (
                                // Voice note bubble
                                <div className="flex items-start gap-3">
                                    <Image
                                        src={SARAH_AVATAR}
                                        alt="Sarah"
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                                    />
                                    <div className="max-w-[85%]">
                                        <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-burgundy-100">
                                            <p className="text-xs text-burgundy-600 font-medium mb-2 flex items-center gap-1">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                </span>
                                                Voice message from Sarah
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => playAudio(msg.id, msg.content)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                        playingAudioId === msg.id
                                                            ? 'bg-burgundy-600 text-white'
                                                            : 'bg-white text-burgundy-600 hover:bg-burgundy-100 border border-burgundy-200'
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
                                                    <p className="text-xs text-burgundy-500 mt-1">{msg.voiceDuration || '0:00'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : msg.type === 'system' ? (
                                renderSystemCard(msg)
                            ) : msg.type === 'user-choice' && msg.choices ? (
                                // Choice buttons
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Image
                                            src={SARAH_AVATAR}
                                            alt="Sarah"
                                            width={36}
                                            height={36}
                                            className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                                        />
                                        <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                            <p className="text-slate-700 font-medium">{msg.content}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 ml-12">
                                        {msg.choices.map((choice, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleUserChoice(choice)}
                                                className="text-left bg-white border-2 border-burgundy-200 text-burgundy-700 px-4 py-3 rounded-xl text-sm font-medium hover:bg-burgundy-50 hover:border-burgundy-400 hover:shadow-md transition-all active:scale-[0.98]"
                                            >
                                                {choice}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}

                    {/* Reaction Heart */}
                    {showReaction && (
                        <div className="flex justify-center animate-fade-in">
                            <div className="bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm border border-rose-200">
                                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                                Sarah loved this
                            </div>
                        </div>
                    )}

                    {/* Paywall Card */}
                    {showPaywall && renderPaywallCard()}

                    {/* Typing Indicator */}
                    {hasEnteredName && !isWelcomeVoicePlaying && isTyping && currentMessageIndex < messages.length && !showPaywall && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-slate-100">
                                <p className="text-xs text-slate-400 mb-1.5">Sarah is typing...</p>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-burgundy-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recording Indicator - for short audios (<40s) */}
                    {hasEnteredName && !isWelcomeVoicePlaying && isRecording && currentMessageIndex < messages.length && !showPaywall && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-burgundy-100">
                                <p className="text-xs text-burgundy-600 font-medium mb-1.5 flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                    </span>
                                    Sarah is recording a voice message...
                                </p>
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-burgundy-400 rounded-full animate-pulse"
                                                style={{
                                                    height: `${8 + Math.random() * 12}px`,
                                                    animationDelay: `${i * 100}ms`
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sending Indicator - for long audios (40s+), pre-recorded */}
                    {hasEnteredName && !isWelcomeVoicePlaying && isSending && currentMessageIndex < messages.length && !showPaywall && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={36}
                                height={36}
                                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm"
                            />
                            <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-burgundy-100">
                                <p className="text-xs text-burgundy-600 font-medium mb-1.5 flex items-center gap-1.5">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    Sending voice note...
                                </p>
                                <p className="text-xs text-slate-500 italic">
                                    "I recorded something for you..."
                                </p>
                            </div>
                        </div>
                    )}

                    <div ref={chatEndRef} />
                </div>
            </div>

        </div>
    );
}
