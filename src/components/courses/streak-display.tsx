"use client";

import { Flame, Award, Calendar, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  className?: string;
  variant?: "compact" | "full";
}

export function StreakDisplay({
  currentStreak,
  longestStreak,
  className,
  variant = "compact",
}: StreakDisplayProps) {
  // Get streak tier for styling
  const getStreakTier = (streak: number) => {
    if (streak >= 30) return { color: "text-purple-600", bg: "bg-purple-100", label: "Unstoppable!" };
    if (streak >= 14) return { color: "text-orange-600", bg: "bg-orange-100", label: "On Fire!" };
    if (streak >= 7) return { color: "text-amber-600", bg: "bg-amber-100", label: "Great Momentum!" };
    if (streak >= 3) return { color: "text-green-600", bg: "bg-green-100", label: "Building Habit!" };
    return { color: "text-gray-600", bg: "bg-gray-100", label: "Getting Started" };
  };

  const tier = getStreakTier(currentStreak);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
          tier.bg,
          className
        )}
      >
        <Flame className={cn("w-4 h-4", tier.color)} />
        <span className={cn("text-sm font-semibold", tier.color)}>
          {currentStreak} day{currentStreak !== 1 ? "s" : ""}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Learning Streak</h3>
        <div
          className={cn(
            "px-2.5 py-1 rounded-full text-xs font-medium",
            tier.bg,
            tier.color
          )}
        >
          {tier.label}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div
          className={cn(
            "w-16 h-16 rounded-xl flex items-center justify-center",
            tier.bg
          )}
        >
          <Flame className={cn("w-8 h-8", tier.color)} />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{currentStreak}</p>
          <p className="text-sm text-gray-500">
            day{currentStreak !== 1 ? "s" : ""} in a row
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-burgundy-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">{longestStreak}</p>
            <p className="text-xs text-gray-500">Best streak</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {currentStreak > 0
                ? Math.round((currentStreak / longestStreak) * 100)
                : 0}
              %
            </p>
            <p className="text-xs text-gray-500">Of best</p>
          </div>
        </div>
      </div>

      {/* Encouragement */}
      {currentStreak > 0 && currentStreak < longestStreak && (
        <p className="text-xs text-center text-gray-500 mt-3 pt-3 border-t border-gray-100">
          {longestStreak - currentStreak} more day
          {longestStreak - currentStreak !== 1 ? "s" : ""} to beat your record!
        </p>
      )}
      {currentStreak >= longestStreak && currentStreak > 1 && (
        <p className="text-xs text-center text-burgundy-600 font-medium mt-3 pt-3 border-t border-gray-100">
          You&apos;re at your best streak! Keep it going!
        </p>
      )}
    </div>
  );
}

// Mini streak indicator for header/nav
export function MiniStreakIndicator({ currentStreak }: { currentStreak: number }) {
  if (currentStreak <= 0) return null;

  return (
    <div className="flex items-center gap-1 text-sm">
      <Flame
        className={cn(
          "w-4 h-4",
          currentStreak >= 7 ? "text-orange-500" : "text-gray-400"
        )}
      />
      <span className="font-medium text-gray-700">{currentStreak}</span>
    </div>
  );
}
