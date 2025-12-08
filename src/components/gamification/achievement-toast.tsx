"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { createPortal } from "react-dom";
import { Zap, Award, Flame, Trophy, Star, CheckCircle, Target, Sparkles } from "lucide-react";

interface Achievement {
  id: string;
  type: "xp" | "badge" | "streak" | "milestone" | "levelup";
  title: string;
  description?: string;
  value?: number;
  icon?: string;
}

interface AchievementContextType {
  showAchievement: (achievement: Achievement) => void;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

export function useAchievement() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error("useAchievement must be used within AchievementProvider");
  }
  return context;
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showAchievement = useCallback((achievement: Achievement) => {
    setAchievements((prev) => [...prev, { ...achievement, id: `${achievement.id}-${Date.now()}` }]);

    // Auto-remove after animation
    setTimeout(() => {
      setAchievements((prev) => prev.filter((a) => a.id !== achievement.id));
    }, 3500);
  }, []);

  const removeAchievement = useCallback((id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return (
    <AchievementContext.Provider value={{ showAchievement }}>
      {children}
      {mounted && createPortal(
        <div className="fixed bottom-24 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
          {achievements.map((achievement, index) => (
            <AchievementToast
              key={achievement.id}
              achievement={achievement}
              onClose={() => removeAchievement(achievement.id)}
              index={index}
            />
          ))}
        </div>,
        document.body
      )}
    </AchievementContext.Provider>
  );
}

function AchievementToast({
  achievement,
  onClose,
  index,
}: {
  achievement: Achievement;
  onClose: () => void;
  index: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Stagger animation
    const showTimer = setTimeout(() => setIsVisible(true), index * 100);
    // Auto close
    const closeTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [index, onClose]);

  const getIcon = () => {
    switch (achievement.type) {
      case "xp":
        return <Zap className="w-6 h-6 text-gold-400" />;
      case "badge":
        return achievement.icon ? (
          <span className="text-2xl">{achievement.icon}</span>
        ) : (
          <Award className="w-6 h-6 text-gold-400" />
        );
      case "streak":
        return <Flame className="w-6 h-6 text-orange-500 animate-fire" />;
      case "milestone":
        return <Target className="w-6 h-6 text-green-500" />;
      case "levelup":
        return <Star className="w-6 h-6 text-gold-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-gold-400" />;
    }
  };

  const getBgColor = () => {
    switch (achievement.type) {
      case "xp":
        return "from-gold-500 to-gold-600";
      case "badge":
        return "from-purple-500 to-purple-600";
      case "streak":
        return "from-orange-500 to-orange-600";
      case "milestone":
        return "from-green-500 to-green-600";
      case "levelup":
        return "from-burgundy-500 to-burgundy-600";
      default:
        return "from-gold-500 to-gold-600";
    }
  };

  return (
    <div
      className={`
        pointer-events-auto transform transition-all duration-300 ease-out
        ${isVisible && !isExiting ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
    >
      <div
        className={`
          bg-gradient-to-r ${getBgColor()}
          rounded-2xl p-4 shadow-2xl shadow-black/20
          flex items-center gap-4 min-w-[280px]
          ${achievement.type === "badge" ? "animate-badge-pop" : ""}
          ${achievement.type === "levelup" ? "animate-levelup" : ""}
        `}
      >
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-lg">{achievement.title}</p>
          {achievement.description && (
            <p className="text-white/80 text-sm">{achievement.description}</p>
          )}
        </div>

        {/* Value (for XP) */}
        {achievement.type === "xp" && achievement.value && (
          <div className="flex-shrink-0 text-right">
            <p className="text-white font-bold text-2xl">+{achievement.value}</p>
            <p className="text-white/70 text-xs">XP</p>
          </div>
        )}

        {/* Confetti for badges/levelups */}
        {(achievement.type === "badge" || achievement.type === "levelup") && (
          <ConfettiEffect />
        )}
      </div>
    </div>
  );
}

function ConfettiEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${1.5 + Math.random()}s`,
          }}
        >
          <div
            className={`w-2 h-2 ${
              i % 3 === 0 ? "bg-gold-300" : i % 3 === 1 ? "bg-white" : "bg-yellow-300"
            } ${i % 2 === 0 ? "rounded-full" : ""}`}
          />
        </div>
      ))}
    </div>
  );
}

// XP Floating Component (shows above element when earned)
export function XPFloat({
  points,
  show,
  onComplete,
}: {
  points: number;
  show: boolean;
  onComplete?: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!visible) return null;

  return (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 animate-xp-float pointer-events-none z-50">
      <div className="flex items-center gap-1 bg-gold-400 text-burgundy-900 font-bold px-3 py-1 rounded-full shadow-lg">
        <Zap className="w-4 h-4" />
        +{points} XP
      </div>
    </div>
  );
}

// Badge Unlock Modal
export function BadgeUnlockModal({
  badge,
  isOpen,
  onClose,
}: {
  badge: { name: string; icon: string; description: string; points: number } | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !badge) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
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
              className={`w-3 h-3 ${
                i % 4 === 0
                  ? "bg-gold-400"
                  : i % 4 === 1
                  ? "bg-burgundy-400"
                  : i % 4 === 2
                  ? "bg-white"
                  : "bg-yellow-300"
              } ${i % 2 === 0 ? "rounded-full" : ""}`}
            />
          </div>
        ))}
      </div>

      <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full mx-4 text-center animate-scale-in shadow-2xl">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-6 shadow-xl animate-badge-pop">
          <span className="text-5xl">{badge.icon}</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Badge Unlocked!</h2>
        <h3 className="text-xl font-semibold text-burgundy-600 mb-2">{badge.name}</h3>
        <p className="text-gray-600 mb-4">{badge.description}</p>
        <div className="inline-flex items-center gap-2 bg-gold-100 text-gold-700 px-4 py-2 rounded-full font-semibold mb-6">
          <Zap className="w-4 h-4" />
          +{badge.points} XP Earned
        </div>
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold py-3 px-6 rounded-xl transition-all"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}

// Streak Counter Component
export function StreakCounter({
  streak,
  showAnimation,
}: {
  streak: number;
  showAnimation?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 ${showAnimation ? "animate-celebrate" : ""}`}
    >
      <div className="relative">
        <Flame
          className={`w-6 h-6 text-orange-500 ${streak > 0 ? "animate-fire" : ""}`}
        />
        {streak >= 7 && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gold-400 rounded-full flex items-center justify-center">
            <Star className="w-2 h-2 text-burgundy-900" />
          </div>
        )}
      </div>
      <span className="font-bold text-gray-900">{streak}</span>
      <span className="text-gray-500 text-sm">day streak</span>
    </div>
  );
}

// Progress Milestone Component
export function ProgressMilestone({
  percentage,
  milestone,
  showCelebration,
}: {
  percentage: number;
  milestone: number;
  showCelebration: boolean;
}) {
  const achieved = percentage >= milestone;

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-xl transition-all ${
        achieved
          ? "bg-green-50 border border-green-200"
          : "bg-gray-50 border border-gray-200"
      } ${showCelebration && achieved ? "animate-celebrate" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          achieved ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        {achieved ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <Target className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div>
        <p
          className={`font-medium text-sm ${
            achieved ? "text-green-700" : "text-gray-600"
          }`}
        >
          {milestone}% Complete
        </p>
        <p className="text-xs text-gray-500">
          {achieved ? "Milestone reached!" : `${milestone - Math.floor(percentage)}% to go`}
        </p>
      </div>
    </div>
  );
}
