"use client";

import { useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { X } from "lucide-react";

interface MilestoneToastProps {
  message: string;
  emoji: string;
  badge?: string | null;
  onClose: () => void;
}

export function MilestoneToast({ message, emoji, badge, onClose }: MilestoneToastProps) {
  const triggerConfetti = useCallback(() => {
    // Fire confetti from both sides
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  useEffect(() => {
    // Trigger confetti on mount
    triggerConfetti();

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose, triggerConfetti]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-900 p-4 rounded-xl shadow-2xl max-w-sm relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-burgundy-700 hover:text-burgundy-900 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-4">
          <div className="text-3xl flex-shrink-0">{emoji}</div>
          <div>
            <p className="font-bold text-sm">Milestone Reached!</p>
            <p className="text-sm mt-1">{message}</p>
            {badge && (
              <p className="text-xs mt-2 opacity-75 font-medium">
                +1 Badge Earned: {formatBadgeName(badge)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to format badge names nicely
function formatBadgeName(badge: string): string {
  return badge
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
