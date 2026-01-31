"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ChevronRight,
    ChevronLeft,
    DollarSign,
    Clock,
    Briefcase,
    Gem,
    Calendar,
    Heart,
    Sparkles,
    CheckCircle,
} from "lucide-react";

interface QuestionsClientProps {
    userId: string;
    firstName: string;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6;

// Sarah's conversation copy for each step
const sarahMessages: Record<Step, string> = {
    1: "Hi {{firstName}}! I'm so excited you're here. Before we dive in, I want to make sure I can help you reach YOUR specific goals. Let's start with the big one - what monthly income do you want from your practice within 12 months?",
    2: "Perfect! Now, by when do you NEED to start earning from this? Be honest with yourself - a deadline creates action!",
    3: "Got it! Understanding where you're starting from helps me guide you better. What best describes you right now?",
    4: "You've already invested in yourself by being here - that's huge! Are you open to investing in tools, marketing, and growth to get clients faster?",
    5: "Here's where it gets real. I want you to pick a date for your FIRST paying client. This isn't just a goal - it's a commitment. When will you do it?",
    6: "Last question, and it's the most important one. What's the REAL reason you're doing this? The thing that keeps you up at night. Select all that apply.",
};

const incomeOptions = [
    { value: "10k_plus", label: "$10,000+ - I want to replace my income", emoji: "🚀" },
    { value: "5k_10k", label: "$5,000-$10,000 - A serious side business", emoji: "📈" },
    { value: "2k_5k", label: "$2,000-$5,000 - Consistent extra income", emoji: "💰" },
    { value: "starter", label: "I want my first paying clients", emoji: "🌱" },
];

const timelineOptions = [
    { value: "asap", label: "ASAP - I'm ready to take action this week", emoji: "⚡" },
    { value: "1_3_months", label: "1-3 months - I want to launch soon", emoji: "📅" },
    { value: "3_6_months", label: "3-6 months - Building skills first", emoji: "🎯" },
    { value: "exploring", label: "I'm not sure yet", emoji: "🤔" },
];

const situationOptions = [
    { value: "burnout", label: "I'm employed but burnt out - need an exit plan", emoji: "🔥" },
    { value: "add_credentials", label: "Already in health/wellness - adding credentials", emoji: "🎓" },
    { value: "career_change", label: "Starting fresh - this is my new career", emoji: "✨" },
    { value: "flexibility", label: "Home with family - want flexible income", emoji: "🏠" },
    { value: "purpose", label: "Retired/semi-retired - want to give back", emoji: "❤️" },
];

const investmentOptions = [
    { value: "ready_now", label: "Yes - I'm ready to invest in my success", emoji: "💎" },
    { value: "need_details", label: "Maybe - show me what would help", emoji: "🔍" },
    { value: "later", label: "Not yet - let me complete this first", emoji: "⏳" },
];

const driverOptions = [
    { value: "financial_freedom", label: "Financial freedom - tired of money stress", emoji: "💰" },
    { value: "flexibility", label: "Work from home - be present for family", emoji: "🏠" },
    { value: "loved_one", label: "Someone I love is struggling", emoji: "👶" },
    { value: "burnout", label: "I'm burnt out - need to escape", emoji: "🔥" },
    { value: "purpose", label: "I want to make an impact", emoji: "💪" },
    { value: "credibility", label: "I want credibility and respect", emoji: "🎓" },
    { value: "entrepreneur", label: "I want to build a real business", emoji: "🚀" },
];

export function QuestionsClient({ userId, firstName }: QuestionsClientProps) {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data
    const [incomeGoal, setIncomeGoal] = useState<string>("");
    const [timeline, setTimeline] = useState<string>("");
    const [situation, setSituation] = useState<string>("");
    const [investment, setInvestment] = useState<string>("");
    const [firstClientDate, setFirstClientDate] = useState<string>(() => {
        // Default to 60 days from now
        const date = new Date();
        date.setDate(date.getDate() + 60);
        return date.toISOString().split("T")[0];
    });
    const [shareInCommunity, setShareInCommunity] = useState(false);
    const [drivers, setDrivers] = useState<string[]>([]);

    const getSarahMessage = (stepNum: Step) => {
        return sarahMessages[stepNum].replace("{{firstName}}", firstName || "friend");
    };

    const canProceed = (): boolean => {
        switch (step) {
            case 1: return !!incomeGoal;
            case 2: return !!timeline;
            case 3: return !!situation;
            case 4: return !!investment;
            case 5: return !!firstClientDate;
            case 6: return drivers.length > 0;
            default: return false;
        }
    };

    const handleNext = async () => {
        if (step < 6) {
            setStep((step + 1) as Step);
        } else {
            // Submit all data
            setIsSubmitting(true);
            try {
                const response = await fetch("/api/user/onboarding", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        incomeGoal,
                        timeline,
                        currentSituation: situation,
                        investmentReadiness: investment,
                        firstClientDate,
                        shareInCommunity,
                        drivers,
                    }),
                });

                if (response.ok) {
                    // Store in localStorage for immediate UI update
                    localStorage.setItem(`onboarding-complete-${userId}`, "true");

                    // Send intro message to Coach Sarah
                    try {
                        // Get formatted labels
                        const incomeLabel = incomeOptions.find(o => o.value === incomeGoal)?.label || incomeGoal;
                        const timelineLabel = timelineOptions.find(o => o.value === timeline)?.label || timeline;
                        const situationLabel = situationOptions.find(o => o.value === situation)?.label || situation;
                        const driverLabels = drivers.map(d => driverOptions.find(o => o.value === d)?.label || d);

                        // Format the date nicely
                        const dateObj = new Date(firstClientDate);
                        const formattedDate = dateObj.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });

                        // Build the intro message
                        const introMessage = `Hi Coach Sarah! 👋 I just completed my goal setting. Here's my plan:

💰 Income Goal: ${incomeLabel}
📅 First Client Deadline: ${formattedDate}
🎯 Current Situation: ${situationLabel}
⏰ Timeline: ${timelineLabel}
❤️ Why I'm doing this: ${driverLabels.join(', ')}

I'm ready to start! What should I focus on first?`;

                        // Get Sarah's userId from mentors endpoint
                        const mentorsRes = await fetch("/api/messages/mentors");
                        const mentorsData = await mentorsRes.json();
                        const sarah = mentorsData.mentors?.find((m: any) =>
                            m.email?.includes("sarah") || m.firstName?.toLowerCase() === "sarah"
                        );

                        if (sarah?.id) {
                            await fetch("/api/messages", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    receiverId: sarah.id,
                                    content: introMessage,
                                }),
                            });
                        }
                    } catch (msgError) {
                        console.error("Failed to send intro message:", msgError);
                        // Don't block navigation if message fails
                    }

                    router.push("/start-here");
                }
            } catch (error) {
                console.error("Failed to save onboarding data:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };


    const handleBack = () => {
        if (step > 1) {
            setStep((step - 1) as Step);
        }
    };

    const toggleDriver = (value: string) => {
        setDrivers((prev) =>
            prev.includes(value)
                ? prev.filter((d) => d !== value)
                : [...prev, value]
        );
    };

    const renderOptions = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-3">
                        {incomeOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setIncomeGoal(option.value)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${incomeGoal === option.value
                                    ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-burgundy-200 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-2xl">{option.emoji}</span>
                                <span className={`font-medium ${incomeGoal === option.value ? "text-burgundy-700" : "text-gray-700"}`}>
                                    {option.label}
                                </span>
                                {incomeGoal === option.value && (
                                    <CheckCircle className="w-5 h-5 text-burgundy-600 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-3">
                        {timelineOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setTimeline(option.value)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${timeline === option.value
                                    ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-burgundy-200 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-2xl">{option.emoji}</span>
                                <span className={`font-medium ${timeline === option.value ? "text-burgundy-700" : "text-gray-700"}`}>
                                    {option.label}
                                </span>
                                {timeline === option.value && (
                                    <CheckCircle className="w-5 h-5 text-burgundy-600 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-3">
                        {situationOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSituation(option.value)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${situation === option.value
                                    ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-burgundy-200 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-2xl">{option.emoji}</span>
                                <span className={`font-medium ${situation === option.value ? "text-burgundy-700" : "text-gray-700"}`}>
                                    {option.label}
                                </span>
                                {situation === option.value && (
                                    <CheckCircle className="w-5 h-5 text-burgundy-600 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-3">
                        {investmentOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setInvestment(option.value)}
                                className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${investment === option.value
                                    ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-burgundy-200 hover:bg-gray-50"
                                    }`}
                            >
                                <span className="text-2xl">{option.emoji}</span>
                                <span className={`font-medium ${investment === option.value ? "text-burgundy-700" : "text-gray-700"}`}>
                                    {option.label}
                                </span>
                                {investment === option.value && (
                                    <CheckCircle className="w-5 h-5 text-burgundy-600 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Choose your first client date:
                            </label>
                            <input
                                type="date"
                                value={firstClientDate}
                                onChange={(e) => setFirstClientDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium"
                            />
                        </div>

                        <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <Checkbox
                                    checked={shareInCommunity}
                                    onCheckedChange={(checked) => setShareInCommunity(checked === true)}
                                    className="w-5 h-5"
                                />
                                <div>
                                    <p className="font-medium text-gray-900">Hold me accountable! 🔥</p>
                                    <p className="text-sm text-gray-600">Share my commitment in the community</p>
                                </div>
                            </label>
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-3">
                        {driverOptions.map((option) => {
                            const isSelected = drivers.includes(option.value);
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => toggleDriver(option.value)}
                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${isSelected
                                        ? "border-burgundy-500 bg-burgundy-50 shadow-md"
                                        : "border-gray-200 bg-white hover:border-burgundy-200 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-2xl">{option.emoji}</span>
                                    <span className={`font-medium ${isSelected ? "text-burgundy-700" : "text-gray-700"}`}>
                                        {option.label}
                                    </span>
                                    {isSelected && (
                                        <CheckCircle className="w-5 h-5 text-burgundy-600 ml-auto" />
                                    )}
                                </button>
                            );
                        })}
                        {drivers.length > 0 && (
                            <p className="text-sm text-gray-500 text-center mt-2">
                                {drivers.length} selected
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    const stepIcons: Record<Step, React.ReactNode> = {
        1: <DollarSign className="w-5 h-5" />,
        2: <Clock className="w-5 h-5" />,
        3: <Briefcase className="w-5 h-5" />,
        4: <Gem className="w-5 h-5" />,
        5: <Calendar className="w-5 h-5" />,
        6: <Heart className="w-5 h-5" />,
    };

    const stepLabels: Record<Step, string> = {
        1: "Income Goal",
        2: "Timeline",
        3: "Situation",
        4: "Investment",
        5: "Commitment",
        6: "Your Why",
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-white flex items-center justify-center p-4">
            <div className="w-full max-w-xl">
                {/* Progress bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Step {step} of 6</span>
                        <span className="text-sm font-medium text-burgundy-600">{stepLabels[step]}</span>
                    </div>
                    <Progress value={(step / 6) * 100} className="h-2" />
                </div>

                {/* Sarah's message card */}
                <Card className="border-0 shadow-xl overflow-hidden">
                    {/* Sarah header */}
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                                <img
                                    src="/coaches/sarah-coach.webp"
                                    alt="Coach Sarah"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="text-white">
                                <p className="font-semibold">Coach Sarah</p>
                                <div className="flex items-center gap-1 text-sm text-burgundy-200">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Your Personal Mentor</span>
                                </div>
                            </div>
                            <Badge className="ml-auto bg-white/20 text-white border-0">
                                {stepIcons[step]}
                            </Badge>
                        </div>
                    </div>

                    <CardContent className="p-6">
                        {/* Sarah's message bubble */}
                        <div className="mb-6">
                            <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 inline-block max-w-[95%]">
                                <p className="text-gray-700 leading-relaxed">
                                    {getSarahMessage(step)}
                                </p>
                            </div>
                        </div>

                        {/* Options */}
                        {renderOptions()}

                        {/* Navigation buttons */}
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={step === 1}
                                className="text-gray-600"
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Back
                            </Button>

                            <Button
                                onClick={handleNext}
                                disabled={!canProceed() || isSubmitting}
                                className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-6"
                            >
                                {isSubmitting ? (
                                    "Saving..."
                                ) : step === 6 ? (
                                    <>
                                        Complete Setup
                                        <Sparkles className="w-4 h-4 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Skip link */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    <button
                        onClick={() => router.push("/start-here")}
                        className="hover:text-burgundy-600 underline"
                    >
                        Skip for now
                    </button>
                </p>
            </div>
        </div>
    );
}
