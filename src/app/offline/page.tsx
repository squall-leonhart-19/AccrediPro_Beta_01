"use client";

import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#fdf8f0] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-[#722f37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="w-12 h-12 text-[#722f37]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-[#722f37] mb-3">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          It looks like you've lost your internet connection. Don't worry - any
          lessons you've previously viewed are still available offline.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href="/my-courses"
            className="block w-full bg-[#722f37] text-white py-3 px-6 rounded-full font-semibold hover:bg-[#5a252c] transition-colors"
          >
            View Offline Lessons
          </a>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 w-full bg-white text-[#722f37] py-3 px-6 rounded-full font-semibold border-2 border-[#722f37] hover:bg-[#722f37]/5 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Tips</h3>
          <ul className="text-sm text-gray-600 text-left space-y-2">
            <li>• Lessons you've viewed before are cached offline</li>
            <li>• Your progress will sync when you're back online</li>
            <li>• Check your WiFi or mobile data connection</li>
          </ul>
        </div>

        {/* Brand */}
        <div className="mt-8 text-sm text-gray-400">
          AccrediPro Academy
        </div>
      </div>
    </div>
  );
}
