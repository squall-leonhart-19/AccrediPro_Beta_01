"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LayoutDashboard,
  BookOpen,
  Map,
  MessageSquare,
  Users,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  GraduationCap,
  Library,
  Trophy,
} from "lucide-react";

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  highlight: string;
  color: string;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "welcome",
    title: "Welcome to AccrediPro Academy!",
    description:
      "Let me give you a quick tour so you feel right at home. This will only take a minute, and you'll be ready to start your certification journey.",
    icon: GraduationCap,
    highlight: "",
    color: "from-gold-400 to-gold-600",
  },
  {
    id: "dashboard",
    title: "Your Dashboard",
    description:
      "This is your command center — where you'll see your progress, upcoming lessons, streaks, and personalized next steps at a glance.",
    icon: LayoutDashboard,
    highlight: "/dashboard",
    color: "from-burgundy-500 to-burgundy-700",
  },
  {
    id: "my-courses",
    title: "My Courses",
    description:
      "Here you'll find all the programs you're enrolled in. Click anytime to continue learning right where you left off.",
    icon: BookOpen,
    highlight: "/my-courses",
    color: "from-green-500 to-green-700",
  },
  {
    id: "catalog",
    title: "Course Catalog",
    description:
      "This is your Course Catalog — explore all the certifications and specializations available to you as you advance in your career.",
    icon: Library,
    highlight: "/courses",
    color: "from-purple-500 to-purple-700",
  },
  {
    id: "roadmap",
    title: "Your Personalized Roadmap",
    description:
      "This is your personalized career roadmap. It shows what you've completed, what you're ready for next, and your long-term certification journey.",
    icon: Map,
    highlight: "/my-personal-roadmap-by-coach-sarah",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "messages",
    title: "Private Mentor Chat",
    description:
      "Here you can message your coach directly for support, guidance, or any questions. Get personalized mentorship as you learn.",
    icon: MessageSquare,
    highlight: "/messages",
    color: "from-pink-500 to-pink-700",
  },
  {
    id: "community",
    title: "Community",
    description:
      "Join conversations, ask questions, share wins, and connect with other students on the same journey. You're never alone here!",
    icon: Users,
    highlight: "/community",
    color: "from-orange-500 to-orange-700",
  },
  {
    id: "achievements",
    title: "Achievements & Badges",
    description:
      "Track your progress with badges, streaks, and XP points. Celebrate every milestone on your certification journey!",
    icon: Trophy,
    highlight: "/achievements",
    color: "from-gold-500 to-gold-700",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description:
      "Perfect! You now know your way around. Click 'Start Learning' to begin your first lesson and take the first step toward your certification.",
    icon: Sparkles,
    highlight: "",
    color: "from-gold-400 to-gold-600",
  },
];

interface WalkthroughProps {
  userName: string;
  coachName?: string;
  userId?: string;
  onComplete: () => void;
}

export function Walkthrough({ userName, coachName, userId, onComplete }: WalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  const step = walkthroughSteps[currentStep];
  const progress = ((currentStep + 1) / walkthroughSteps.length) * 100;
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStep < walkthroughSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    // Set tour complete in localStorage BEFORE redirect
    // Always set it - with userId if available, without as fallback
    if (userId) {
      try { localStorage.setItem(`tour-complete-${userId}`, "true"); } catch {}
    }
    // Also set a general flag as fallback
    try { localStorage.setItem("tour-complete-general", "true"); } catch {}

    setIsVisible(false);
    onComplete();
    router.push("/start-here");
  };

  // Personalize description with names
  const getPersonalizedDescription = (desc: string) => {
    let text = desc;
    if (coachName) {
      text = text.replace("your coach", coachName);
    }
    return text;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-burgundy-900/80 backdrop-blur-sm" />

      {/* Confetti effect for welcome/complete steps */}
      {(currentStep === 0 || currentStep === walkthroughSteps.length - 1) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${i % 3 === 0
                  ? "bg-gold-400"
                  : i % 3 === 1
                    ? "bg-burgundy-400"
                    : "bg-white"
                  } ${i % 2 === 0 ? "rounded-full" : ""}`}
                style={{
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Content Card */}
      <div className="relative w-full max-w-lg mx-4 animate-fade-in">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1 transition-colors"
        >
          Skip tour
          <X className="w-4 h-4" />
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${step.color} p-8 text-center relative overflow-hidden`}>
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/30">
                <Icon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {currentStep === 0 ? `Welcome, ${userName}!` : step.title}
              </h2>
              <p className="text-white/80 text-sm">
                Step {currentStep + 1} of {walkthroughSteps.length}
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <p className="text-gray-600 text-center leading-relaxed mb-8 text-lg">
              {getPersonalizedDescription(step.description)}
            </p>

            {/* Progress bar */}
            <div className="mb-6">
              <Progress value={progress} className="h-2 bg-gray-100" />
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {walkthroughSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentStep
                    ? "bg-burgundy-600 w-6"
                    : index < currentStep
                      ? "bg-burgundy-300"
                      : "bg-gray-200"
                    }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                className={`bg-gradient-to-r ${step.color} hover:opacity-90 text-white px-8 py-6 text-lg font-semibold shadow-lg`}
              >
                {currentStep === walkthroughSteps.length - 1 ? (
                  <>
                    Let's Go!
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Tip below */}
        <p className="text-center text-white/60 text-sm mt-4">
          Press <kbd className="px-2 py-0.5 bg-white/20 rounded">→</kbd> to continue or{" "}
          <kbd className="px-2 py-0.5 bg-white/20 rounded">Esc</kbd> to skip
        </p>
      </div>

      {/* Keyboard navigation */}
      <KeyboardHandler
        onNext={handleNext}
        onPrev={handlePrev}
        onSkip={handleSkip}
      />
    </div>
  );
}

function KeyboardHandler({
  onNext,
  onPrev,
  onSkip,
}: {
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        onNext();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "Escape") {
        onSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrev, onSkip]);

  return null;
}
