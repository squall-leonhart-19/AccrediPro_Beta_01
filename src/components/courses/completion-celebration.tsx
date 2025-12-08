"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Award,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CompletionCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  courseSlug: string;
  certificateId?: string;
}

export function CompletionCelebration({
  isOpen,
  onClose,
  courseName,
  courseSlug,
  certificateId,
}: CompletionCelebrationProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Since particles fall down, start a bit higher than random
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#722F37", "#D4AF37", "#FFD700", "#8B3A42"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#722F37", "#D4AF37", "#FFD700", "#8B3A42"],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/courses/${courseSlug}`;
  const shareText = `I just completed ${courseName} at AccrediPro Academy! 🎓`;

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Award className="w-10 h-10 text-gold-400" />
            </div>
            <Sparkles className="w-6 h-6 text-gold-400 absolute top-6 left-1/4 animate-pulse" />
            <Sparkles className="w-4 h-4 text-gold-300 absolute top-12 right-1/4 animate-pulse" />

            <h2 className="text-3xl font-bold text-white mb-2">
              Congratulations!
            </h2>
            <p className="text-burgundy-100 text-lg">
              You&apos;ve completed the course!
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">You&apos;ve successfully completed</p>
            <p className="text-xl font-bold text-gray-900">{courseName}</p>
          </div>

          {/* Certificate badge */}
          <div className="bg-gradient-to-r from-gold-50 to-gold-100/50 rounded-2xl p-4 mb-6 border border-gold-200/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Certificate Earned!</p>
                <p className="text-sm text-gray-600">Your certificate is ready to view</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gold-300 text-gold-700 hover:bg-gold-50"
                onClick={() => window.location.href = "/certificates"}
              >
                <Download className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>

          {/* Share section */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share your achievement
            </p>
            <div className="flex gap-2">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0A66C2] hover:bg-[#094d92] text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1877F2] hover:bg-[#1565d8] text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Continue Learning
            </Button>
            <Button
              className="flex-1 bg-burgundy-600 hover:bg-burgundy-700"
              onClick={() => window.location.href = "/certificates"}
            >
              View Certificate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
