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
  Star,
  Trophy,
  Zap,
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
}: CompletionCelebrationProps) {
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Delay content reveal for dramatic effect
      setTimeout(() => setShowContent(true), 300);

      // Fire confetti with premium colors
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const colors = ["#722F37", "#D4AF37", "#FFD700", "#8B3A42", "#FFFFFF"];

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // Initial burst
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
        colors,
        startVelocity: 45,
        gravity: 0.8,
        scalar: 1.2,
        zIndex: 9999,
      });

      // Continuous confetti
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 30 * (timeLeft / duration);

        confetti({
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors,
          startVelocity: 30,
          spread: 80,
          zIndex: 9999,
        });
        confetti({
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors,
          startVelocity: 30,
          spread: 80,
          zIndex: 9999,
        });
      }, 200);

      return () => {
        clearInterval(interval);
        setShowContent(false);
      };
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-gold-400/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${12 + Math.random() * 16}px`,
              height: `${12 + Math.random() * 16}px`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden transform transition-all duration-500 ${
          showContent ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header with gradient and animations */}
        <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-8 text-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>

          {/* Sparkles decoration */}
          <Sparkles className="w-6 h-6 text-gold-400 absolute top-6 left-1/4 animate-bounce" style={{ animationDuration: "2s" }} />
          <Sparkles className="w-4 h-4 text-gold-300 absolute top-12 right-1/4 animate-bounce" style={{ animationDelay: "0.3s", animationDuration: "2.5s" }} />
          <Zap className="w-5 h-5 text-gold-400 absolute bottom-8 left-1/3 animate-pulse" />

          <div className="relative z-10">
            {/* Trophy with glow effect */}
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gold-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-12 h-12 text-burgundy-800" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-2 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Congratulations!
            </h2>
            <p className="text-burgundy-100 text-lg animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              You&apos;ve completed the course!
            </p>

            {/* XP Badge */}
            <div className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm text-gold-200 px-4 py-2 rounded-full mt-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <Zap className="w-4 h-4" />
              <span className="font-bold">+200 XP Earned!</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-2">You&apos;ve successfully completed</p>
            <p className="text-xl font-bold text-gray-900">{courseName}</p>
          </div>

          {/* Certificate badge with animation */}
          <div className="bg-gradient-to-r from-gold-50 to-amber-50 rounded-2xl p-5 mb-6 border border-gold-200 transform hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: "3s" }}>
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-lg">Certificate Earned!</p>
                <p className="text-sm text-gray-600">Your certificate is ready to download</p>
              </div>
              <Button
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-lg"
                onClick={() => window.location.href = "/certificates"}
              >
                <Download className="w-4 h-4 mr-2" />
                View
              </Button>
            </div>
          </div>

          {/* Share section */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share your achievement
            </p>
            <div className="flex gap-2">
              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white transition-all transform hover:scale-105"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0A66C2] hover:bg-[#094d92] text-white transition-all transform hover:scale-105"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1877F2] hover:bg-[#1565d8] text-white transition-all transform hover:scale-105"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all transform hover:scale-105"
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
              className="flex-1 border-gray-300"
              onClick={onClose}
            >
              Continue Learning
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800"
              onClick={() => window.location.href = "/certificates"}
            >
              <Award className="w-4 h-4 mr-2" />
              View Certificate
            </Button>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
