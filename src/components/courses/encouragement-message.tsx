"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Star, Target, Flame, Trophy, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface EncouragementMessageProps {
  progressPercent: number;
  moduleName: string;
  lessonNumber: number;
  totalLessons: number;
  className?: string;
}

interface Milestone {
  percent: number;
  icon: React.ReactNode;
  title: string;
  message: string;
  gradient: string;
  bgColor: string;
}

const milestones: Milestone[] = [
  {
    percent: 25,
    icon: <Star className="w-5 h-5" />,
    title: "Great Start!",
    message: "You're 25% through this module. Your dedication is showing!",
    gradient: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
  },
  {
    percent: 50,
    icon: <Target className="w-5 h-5" />,
    title: "Halfway There!",
    message: "Amazing! You've completed half the module. Keep going strong!",
    gradient: "from-emerald-400 to-teal-500",
    bgColor: "bg-emerald-50",
  },
  {
    percent: 75,
    icon: <Flame className="w-5 h-5" />,
    title: "Almost Done!",
    message: "You're 75% there! The finish line is in sight. You've got this!",
    gradient: "from-purple-400 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    percent: 100,
    icon: <Trophy className="w-5 h-5" />,
    title: "Module Complete!",
    message: "Congratulations! You've completed this entire module!",
    gradient: "from-burgundy-500 to-rose-600",
    bgColor: "bg-burgundy-50",
  },
];

export function EncouragementMessage({
  progressPercent,
  moduleName,
  lessonNumber,
  totalLessons,
  className,
}: EncouragementMessageProps) {
  const [dismissed, setDismissed] = useState<number | null>(null);
  const [animate, setAnimate] = useState(false);

  // Find the current milestone (if we just hit one)
  const currentMilestone = milestones.find(
    (m) => Math.floor(progressPercent) === m.percent
  );

  // Check if this milestone was already dismissed in session
  const storageKey = `milestone_${moduleName}_${currentMilestone?.percent}`;

  useEffect(() => {
    if (currentMilestone) {
      const wasDismissed = sessionStorage.getItem(storageKey);
      if (wasDismissed) {
        setDismissed(currentMilestone.percent);
      } else {
        setAnimate(true);
      }
    }
  }, [currentMilestone, storageKey]);

  const handleDismiss = () => {
    if (currentMilestone) {
      sessionStorage.setItem(storageKey, "true");
      setDismissed(currentMilestone.percent);
    }
  };

  // Don't show if no milestone or already dismissed
  if (!currentMilestone || dismissed === currentMilestone.percent) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border shadow-sm transition-all duration-500",
        currentMilestone.bgColor,
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        className
      )}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Sparkles className="w-full h-full text-gray-800" />
      </div>

      <div className="relative p-4 sm:p-5">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${currentMilestone.gradient} flex items-center justify-center text-white shadow-lg`}
          >
            {currentMilestone.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">
                {currentMilestone.title}
              </h4>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/70 text-gray-600 font-medium">
                {currentMilestone.percent}%
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {currentMilestone.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {moduleName} - Lesson {lessonNumber} of {totalLessons}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline encouragement banner for smaller milestones
export function MiniEncouragement({
  lessonsCompleted,
  totalLessons,
}: {
  lessonsCompleted: number;
  totalLessons: number;
}) {
  const messages = [
    { min: 1, max: 2, msg: "You're on a roll!", icon: <Sparkles className="w-4 h-4" /> },
    { min: 3, max: 4, msg: "Keep it up!", icon: <Star className="w-4 h-4" /> },
    { min: 5, max: 6, msg: "You're doing great!", icon: <Heart className="w-4 h-4" /> },
    { min: 7, max: 8, msg: "Almost there!", icon: <Flame className="w-4 h-4" /> },
  ];

  const applicable = messages.find(
    (m) => lessonsCompleted >= m.min && lessonsCompleted <= m.max
  );

  if (!applicable || lessonsCompleted >= totalLessons) return null;

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-burgundy-600 bg-burgundy-50 px-2.5 py-1 rounded-full">
      {applicable.icon}
      <span className="font-medium">{applicable.msg}</span>
    </div>
  );
}
