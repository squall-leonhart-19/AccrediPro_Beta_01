"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Download,
  Search,
  ChevronRight,
  FileText,
  CheckCircle,
  Bookmark,
  ChevronLeft,
  Share2,
  ArrowLeft,
  BookmarkCheck,
  Clock,
  PlayCircle,
  CheckCircle2,
  Circle,
  List,
  BookMarked,
  Library,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

// Categories for filtering
const CATEGORIES = [
  { id: "all", label: "All", icon: "📚" },
  { id: "fm-free", label: "FM Free Resources", icon: "🎁" },
  { id: "core", label: "Core Guides", icon: "📘" },
  { id: "gut", label: "Gut Health", icon: "🍃" },
  { id: "hormones", label: "Hormones", icon: "🌸" },
  { id: "thyroid", label: "Thyroid", icon: "🦋" },
  { id: "nutrition", label: "Nutrition", icon: "🥗" },
  { id: "inflammation", label: "Inflammation", icon: "🔥" },
];

// Sample owned e-books (in production, this would come from database based on purchases)
// For now showing 3 sample ebooks that match the store structure
const MY_EBOOKS = [
  {
    id: "practitioner-reality-playbook",
    title: "The Practitioner Reality Playbook",
    subtitle: "What They Don't Teach in Certification Programs",
    description: "The real-world guide for new functional medicine practitioners. Covers everything from setting up your practice to handling difficult clients, managing boundaries, and building sustainable income.",
    valueProp: "The #1 reason new practitioners fail—and how to avoid it.",
    author: "AccrediPro Academy",
    pages: 52,
    icon: "📘",
    category: "core",
    topics: ["Practice Setup", "Client Management", "Boundaries", "Business Basics"],
    readTime: "2-3 hours",
    unlockedDate: "2024-11-15",
    isFree: true,
    unlockCondition: "Mini Diploma Graduate or Challenge Day 1",
    chapters: [
      {
        title: "Introduction: The Reality Nobody Talks About",
        readTime: "5 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- AccrediPro Logo Header -->
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-burgundy-600 tracking-wider uppercase">AccrediPro Academy</p>
      <p class="text-xs text-gray-500">Professional E-Book Series</p>
    </div>
  </div>

  <!-- Opening Message -->
  <div class="bg-gradient-to-r from-burgundy-50 to-gold-50 border-l-4 border-burgundy-600 p-6 rounded-r-xl mb-8">
    <p class="text-xl font-semibold text-burgundy-800 italic">
      "Congratulations—you've earned your certification. Now what?"
    </p>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    If you're like most new functional medicine practitioners, you're experiencing a mix of <strong>excitement and terror</strong>. You have the knowledge, but the gap between theory and practice feels enormous.
  </p>

  <!-- Reality Check Box -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-burgundy-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M12 9v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gold-400">The Reality Check</h3>
    </div>
    <p class="text-burgundy-100 mb-4">Here's what nobody tells you in certification programs:</p>
    <ul class="space-y-3">
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">1</span>
        </span>
        <span>Most new practitioners don't see a client for <strong class="text-gold-300">6+ months</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">2</span>
        </span>
        <span>Imposter syndrome is <strong class="text-gold-300">universal</strong>—even among experienced practitioners</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">3</span>
        </span>
        <span>The business side can feel <strong class="text-gold-300">harder than the clinical side</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">4</span>
        </span>
        <span>Your first year will look <strong class="text-gold-300">nothing like you imagined</strong></span>
      </li>
    </ul>
  </div>

  <!-- Author Note -->
  <div class="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">✍️</span>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-2">A Note from the Author</p>
        <p class="text-gray-600 italic">
          "This playbook exists because I wish someone had given me this reality check when I started. I made every mistake in the book so you don't have to."
        </p>
      </div>
    </div>
  </div>

  <!-- What You'll Learn -->
  <div class="mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </span>
      By the End of This Guide, You'll Know:
    </h3>
    <div class="grid gap-3">
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">Exactly what your first year will look like (realistic timeline)</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">The <strong>7 mistakes</strong> that bankrupt new practitioners</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">How to handle difficult conversations with confidence</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">Pricing strategies that <strong>actually work</strong></span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">When and how to say no without guilt</span>
      </div>
    </div>
  </div>

  <!-- Call to Action -->
  <div class="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-6 text-center">
    <p class="text-white text-lg font-medium">
      Ready? Let's begin with the truth about your first year.
    </p>
    <p class="text-burgundy-200 text-sm mt-2">Click "Next" to continue to Chapter 1 →</p>
  </div>

  <!-- Footer Branding -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 1: Your First Year - A Realistic Timeline",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-burgundy-100 to-burgundy-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">📅</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 1</p>
      <h2 class="text-xl font-bold text-gray-900">Your First Year - A Realistic Timeline</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-8">
    Let's map out what your first year <strong>actually</strong> looks like—not the fantasy version, the real one.
  </p>

  <!-- Phase 1 -->
  <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
        <span class="text-white font-bold">1</span>
      </div>
      <h3 class="text-lg font-bold text-blue-800">Months 1-3: The Foundation Phase</h3>
    </div>
    
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="bg-red-50 border border-red-100 rounded-xl p-4">
        <p class="text-sm font-semibold text-red-700 mb-2">❌ What Most Practitioners Do:</p>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2"><span class="text-red-400">•</span> Panic about getting clients immediately</li>
          <li class="flex items-start gap-2"><span class="text-red-400">•</span> Spend money on fancy websites and business cards</li>
          <li class="flex items-start gap-2"><span class="text-red-400">•</span> Avoid telling anyone they're a practitioner</li>
          <li class="flex items-start gap-2"><span class="text-red-400">•</span> Compare themselves to established practitioners</li>
        </ul>
      </div>
      <div class="bg-green-50 border border-green-100 rounded-xl p-4">
        <p class="text-sm font-semibold text-green-700 mb-2">✅ What You Should Do Instead:</p>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2"><span class="text-green-500">•</span> Tell EVERYONE you know what you do</li>
          <li class="flex items-start gap-2"><span class="text-green-500">•</span> Set up a simple way for people to book</li>
          <li class="flex items-start gap-2"><span class="text-green-500">•</span> Practice consultations on friends/family</li>
          <li class="flex items-start gap-2"><span class="text-green-500">•</span> Create one piece of content per week</li>
        </ul>
      </div>
    </div>
    
    <div class="bg-blue-100 rounded-lg p-3">
      <p class="text-sm text-blue-800"><strong>Reality check:</strong> In these first 3 months, focus on <em>confidence</em>, not clients. Every "practice" session counts.</p>
    </div>
  </div>

  <!-- Phase 2 -->
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-6 border border-amber-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
        <span class="text-white font-bold">2</span>
      </div>
      <h3 class="text-lg font-bold text-amber-800">Months 4-6: The Testing Phase</h3>
    </div>
    
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="bg-white border border-amber-100 rounded-xl p-4">
        <p class="text-sm font-semibold text-amber-700 mb-2">🔄 What Typically Happens:</p>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> Your first few clients appear (from your network)</li>
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> Consultations take longer than expected</li>
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> Pricing feels awkward and uncomfortable</li>
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> You second-guess everything</li>
        </ul>
      </div>
      <div class="bg-white border border-amber-100 rounded-xl p-4">
        <p class="text-sm font-semibold text-amber-700 mb-2">📊 What to Expect:</p>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> <strong>2-5 clients</strong> (this is normal!)</li>
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> Each session teaches you something new</li>
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> You'll want to underprice—resist this urge</li>
          <li class="flex items-start gap-2"><span class="text-amber-500">•</span> Your protocols will evolve rapidly</li>
        </ul>
      </div>
    </div>
    
    <div class="bg-amber-100 rounded-lg p-3">
      <p class="text-sm text-amber-800"><strong>The truth:</strong> These early clients are <em>golden</em>. They'll refer others if you serve them well.</p>
    </div>
  </div>

  <!-- Phase 3 -->
  <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 border border-emerald-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
        <span class="text-white font-bold">3</span>
      </div>
      <h3 class="text-lg font-bold text-emerald-800">Months 7-12: The Momentum Phase</h3>
    </div>
    
    <div class="grid md:grid-cols-2 gap-4 mb-4">
      <div class="bg-white border border-emerald-100 rounded-xl p-4">
        <p class="text-sm font-semibold text-emerald-700 mb-2">🚀 If You've Laid the Groundwork:</p>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2"><span class="text-emerald-500">✓</span> Referrals start coming in</li>
          <li class="flex items-start gap-2"><span class="text-emerald-500">✓</span> Your confidence builds noticeably</li>
          <li class="flex items-start gap-2"><span class="text-emerald-500">✓</span> You develop your own style and approach</li>
          <li class="flex items-start gap-2"><span class="text-emerald-500">✓</span> Systems become more automatic</li>
        </ul>
      </div>
      <div class="bg-red-50 border border-red-100 rounded-xl p-4">
        <p class="text-sm font-semibold text-red-700 mb-2">⚠️ Warning Signs You've Skipped Steps:</p>
        <ul class="space-y-2 text-sm text-gray-700">
          <li class="flex items-start gap-2"><span class="text-red-400">!</span> Still no clients after 9 months</li>
          <li class="flex items-start gap-2"><span class="text-red-400">!</span> Clients not returning for follow-ups</li>
          <li class="flex items-start gap-2"><span class="text-red-400">!</span> Burning out from over-giving</li>
          <li class="flex items-start gap-2"><span class="text-red-400">!</span> Resentful of your pricing</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">💡</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Remember</h3>
    </div>
    <p class="text-burgundy-100 text-lg">
      A <strong class="text-white">slow build</strong> is a <strong class="text-gold-300">sustainable build</strong>. Fast starts often lead to fast burnouts.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 2: The 7 Mistakes That Bankrupt New Practitioners",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">⚠️</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 2</p>
      <h2 class="text-xl font-bold text-gray-900">The 7 Mistakes That Bankrupt New Practitioners</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-8">
    These aren't theoretical mistakes. They're the <strong>real reasons</strong> talented practitioners fail—even when they know their stuff clinically.
  </p>

  <!-- Mistake 1 -->
  <div class="bg-white border-2 border-red-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold">1</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Underpricing Your Services</h3>
        <div class="bg-red-50 rounded-lg p-3 mb-3">
          <p class="text-sm font-medium text-red-700 mb-2">Why it happens:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Fear of rejection</li>
            <li>• Imposter syndrome</li>
            <li>• Comparing to others' old pricing</li>
            <li>• Not understanding your true value</li>
          </ul>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>The reality:</strong> Underpricing hurts you AND your clients. When you're underpaid, you subconsciously resent the work. Clients don't value what they don't invest in.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-2">
          <p class="text-sm text-green-700"><strong>✅ Fix it:</strong> Price based on transformation, not time.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mistake 2 -->
  <div class="bg-white border-2 border-red-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold">2</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Over-Delivering to Compensate</h3>
        <div class="bg-red-50 rounded-lg p-3 mb-3">
          <p class="text-sm font-medium text-red-700 mb-2">The pattern:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Two-hour "discovery calls"</li>
            <li>• Giving protocols before they pay</li>
            <li>• Texting with clients 24/7</li>
            <li>• Discounting at the first objection</li>
          </ul>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>The damage:</strong> You train clients to expect more than you can sustain, then burn out.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-2">
          <p class="text-sm text-green-700"><strong>✅ Fix it:</strong> Clear boundaries from day one. Scope creep kills practices.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mistake 3 -->
  <div class="bg-white border-2 border-red-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold">3</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Trying to Help Everyone</h3>
        <div class="bg-red-50 rounded-lg p-3 mb-3">
          <p class="text-sm font-medium text-red-700 mb-2">Symptoms:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• No clear niche</li>
            <li>• Marketing that speaks to nobody</li>
            <li>• Attracting clients you can't help</li>
            <li>• Exhaustion from context-switching</li>
          </ul>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>The truth:</strong> Generalists struggle. Specialists thrive.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-2">
          <p class="text-sm text-green-700"><strong>✅ Fix it:</strong> Choose ONE type of client to start. You can expand later.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mistake 4 -->
  <div class="bg-white border-2 border-red-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold">4</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Avoiding Sales Conversations</h3>
        <div class="bg-red-50 rounded-lg p-3 mb-3">
          <p class="text-sm font-medium text-red-700 mb-2">Hiding behind:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• "I hate being salesy"</li>
            <li>• Free content instead of selling</li>
            <li>• Hoping clients will just find you</li>
            <li>• Never asking for the sale</li>
          </ul>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>Reality check:</strong> Selling is serving. If you can help someone and don't tell them, you're doing them a disservice.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-2">
          <p class="text-sm text-green-700"><strong>✅ Fix it:</strong> Reframe sales as invitation. Practice makes comfortable.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mistake 5 -->
  <div class="bg-white border-2 border-red-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold">5</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Skipping Systems</h3>
        <div class="bg-red-50 rounded-lg p-3 mb-3">
          <p class="text-sm font-medium text-red-700 mb-2">The chaos:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Client notes in random places</li>
            <li>• No onboarding process</li>
            <li>• Manual scheduling back-and-forth</li>
            <li>• Forgetting follow-ups</li>
          </ul>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>The cost:</strong> Hours lost weekly. Client experience suffers.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-2">
          <p class="text-sm text-green-700"><strong>✅ Fix it:</strong> Set up basic systems BEFORE you need them. Even simple ones help.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mistake 6 -->
  <div class="bg-white border-2 border-red-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold">6</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Isolating Yourself</h3>
        <div class="bg-red-50 rounded-lg p-3 mb-3">
          <p class="text-sm font-medium text-red-700 mb-2">Signs:</p>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Not joining practitioner communities</li>
            <li>• Trying to figure everything out alone</li>
            <li>• No mentor or peer support</li>
            <li>• Avoiding networking</li>
          </ul>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>The damage:</strong> Slower learning curve. Missed opportunities. Preventable mistakes.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-2">
          <p class="text-sm text-green-700"><strong>✅ Fix it:</strong> Find your people. Even one good mentor changes everything.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Mistake 7 -->
  <div class="bg-white border-2 border-red-200 rounded-2xl p-5 mb-4 hover:shadow-md transition-shadow">
    <div class="flex items-start gap-4">
      <div class="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
        <span class="text-white font-bold">7</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2">Waiting Until You're "Ready"</h3>
        <div class="bg-red-50 rounded-lg p-3 mb-3">
          <p class="text-sm font-medium text-red-700 mb-2">The lie:</p>
          <p class="text-sm text-gray-700 italic">"Once I get X certification / lose weight / fix my own health / feel confident... THEN I'll start."</p>
        </div>
        <p class="text-sm text-gray-600 mb-2"><strong>The truth:</strong> You'll never feel ready. Start before you're ready. Grow as you go.</p>
        <div class="bg-green-50 border border-green-200 rounded-lg p-2">
          <p class="text-sm text-green-700"><strong>✅ Fix it:</strong> Book your first consultation this week. Imperfect action beats perfect planning.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mt-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">💡</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">The Bottom Line</h3>
    </div>
    <p class="text-burgundy-100 text-lg">
      These mistakes are <strong class="text-white">100% preventable</strong>. Now that you know them, you can avoid the traps that catch most new practitioners.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 3: Scripts for Difficult Conversations",
        readTime: "18 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">💬</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 3</p>
      <h2 class="text-xl font-bold text-gray-900">Scripts for Difficult Conversations</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-8">
    Copy, adapt, and practice these scripts until they become <strong>second nature</strong>. The right words at the right time can save a relationship—or protect your boundaries.
  </p>

  <!-- Scenario 1 -->
  <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-purple-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">1</span>
      </div>
      <h3 class="text-lg font-bold text-gray-900">The Price Objector</h3>
    </div>
    
    <div class="bg-white rounded-xl p-4 mb-4 border-l-4 border-purple-400">
      <p class="text-sm text-gray-500 mb-1">Client says:</p>
      <p class="text-gray-800 font-medium italic">"That's more than I expected to pay."</p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-3 mb-4">
      <div class="bg-red-50 rounded-lg p-3 border border-red-100">
        <p class="text-sm font-semibold text-red-700 mb-2">❌ DON'T Say:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• "I can give you a discount"</li>
          <li>• "What were you expecting?"</li>
          <li>• "I know it's expensive"</li>
        </ul>
      </div>
      <div class="bg-green-50 rounded-lg p-3 border border-green-100">
        <p class="text-sm font-semibold text-green-700 mb-2">✅ DO Say:</p>
        <p class="text-sm text-gray-700 italic">"I understand—investing in your health is a significant decision. Let me share what makes this program different. Would it help to discuss payment options?"</p>
      </div>
    </div>
    
    <div class="bg-purple-100 rounded-lg p-3">
      <p class="text-sm text-purple-800"><strong>Why it works:</strong> You acknowledge without agreeing. You redirect to value. You offer solutions without discounting.</p>
    </div>
  </div>

  <!-- Scenario 2 -->
  <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 mb-5 border border-amber-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">2</span>
      </div>
      <h3 class="text-lg font-bold text-gray-900">The Scope Creeper</h3>
    </div>
    
    <div class="bg-white rounded-xl p-4 mb-4 border-l-4 border-amber-400">
      <p class="text-sm text-gray-500 mb-1">Client says:</p>
      <p class="text-gray-800 font-medium italic">"Can I just text you quick questions between sessions?"</p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-3 mb-4">
      <div class="bg-red-50 rounded-lg p-3 border border-red-100">
        <p class="text-sm font-semibold text-red-700 mb-2">❌ DON'T Say:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• "Sure, anytime!"</li>
          <li>• "Well, I guess occasionally..."</li>
          <li>• (Ignore texts hoping they stop)</li>
        </ul>
      </div>
      <div class="bg-green-50 rounded-lg p-3 border border-green-100">
        <p class="text-sm font-semibold text-green-700 mb-2">✅ DO Say:</p>
        <p class="text-sm text-gray-700 italic">"I love that you're engaged! Questions are most helpful during sessions where I can give them proper attention. For urgent concerns, here's how that works..."</p>
      </div>
    </div>
    
    <div class="bg-amber-100 rounded-lg p-3">
      <p class="text-sm text-amber-800"><strong>Why it works:</strong> You affirm them, redirect, and establish clear expectations without being harsh.</p>
    </div>
  </div>

  <!-- Scenario 3 -->
  <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 mb-5 border border-blue-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">3</span>
      </div>
      <h3 class="text-lg font-bold text-gray-900">The No-Show / Chronic Reschedule</h3>
    </div>
    
    <div class="space-y-3 mb-4">
      <div class="bg-white rounded-xl p-4 border-l-4 border-blue-400">
        <p class="text-sm font-semibold text-blue-700 mb-2">After the first incident:</p>
        <p class="text-sm text-gray-700 italic">"I noticed we missed our appointment. I hope everything's okay. Since our time is valuable for your progress, here's how rescheduling works: [your policy]. Can we find a time that works consistently?"</p>
      </div>
      <div class="bg-white rounded-xl p-4 border-l-4 border-blue-600">
        <p class="text-sm font-semibold text-blue-700 mb-2">After a pattern:</p>
        <p class="text-sm text-gray-700 italic">"I've noticed our sessions have been challenging to schedule. I want to make sure this is the right fit for where you are. Can we talk about what's getting in the way?"</p>
      </div>
    </div>
    
    <div class="bg-blue-100 rounded-lg p-3">
      <p class="text-sm text-blue-800"><strong>Why it works:</strong> You address it directly without accusation. You create space for honesty.</p>
    </div>
  </div>

  <!-- Scenario 4 -->
  <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-5 mb-5 border border-pink-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">4</span>
      </div>
      <h3 class="text-lg font-bold text-gray-900">The Friend/Family Who Wants Free Advice</h3>
    </div>
    
    <div class="bg-white rounded-xl p-4 mb-4 border-l-4 border-pink-400">
      <p class="text-sm text-gray-500 mb-1">Setting:</p>
      <p class="text-gray-800 font-medium">Thanksgiving dinner—cousin asks about their digestion 🦃</p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-3 mb-4">
      <div class="bg-red-50 rounded-lg p-3 border border-red-100">
        <p class="text-sm font-semibold text-red-700 mb-2">❌ DON'T:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• Give a full protocol</li>
          <li>• Feel obligated to help</li>
          <li>• Get defensive about charging</li>
        </ul>
      </div>
      <div class="bg-green-50 rounded-lg p-3 border border-green-100">
        <p class="text-sm font-semibold text-green-700 mb-2">✅ DO Say:</p>
        <p class="text-sm text-gray-700 italic">"That sounds frustrating! I'd love to help but can't advise without a consultation. Here's my booking link. In the meantime, here's one tip that helps most people..."</p>
      </div>
    </div>
    
    <div class="bg-pink-100 rounded-lg p-3">
      <p class="text-sm text-pink-800"><strong>Why it works:</strong> You show competence without giving away the store. You create a clear path to paid work.</p>
    </div>
  </div>

  <!-- Scenario 5 -->
  <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 mb-5 border border-emerald-100">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
        <span class="text-white font-bold text-sm">5</span>
      </div>
      <h3 class="text-lg font-bold text-gray-900">The Client Who Doesn't Follow Through</h3>
    </div>
    
    <div class="bg-white rounded-xl p-4 mb-4 border-l-4 border-emerald-400">
      <p class="text-sm text-gray-500 mb-1">Situation:</p>
      <p class="text-gray-800 font-medium">Client hasn't followed the protocol. Again.</p>
    </div>
    
    <div class="grid md:grid-cols-2 gap-3 mb-4">
      <div class="bg-red-50 rounded-lg p-3 border border-red-100">
        <p class="text-sm font-semibold text-red-700 mb-2">❌ DON'T Say:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• "Why didn't you do what I recommended?"</li>
          <li>• "This won't work if you don't try"</li>
          <li>• (Pretend you didn't notice)</li>
        </ul>
      </div>
      <div class="bg-green-50 rounded-lg p-3 border border-green-100">
        <p class="text-sm font-semibold text-green-700 mb-2">✅ DO Say:</p>
        <p class="text-sm text-gray-700 italic">"I noticed we haven't made those changes yet. That's really common. What felt hardest? I'd rather adjust the plan to something you'll actually do."</p>
      </div>
    </div>
    
    <div class="bg-emerald-100 rounded-lg p-3">
      <p class="text-sm text-emerald-800"><strong>Why it works:</strong> You normalize the struggle. You collaborate instead of lecture. You get to the real barriers.</p>
    </div>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">📝</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Remember</h3>
    </div>
    <p class="text-burgundy-100 text-lg">
      These scripts are <strong class="text-white">starting points</strong>. Adapt them to your voice. Practice them until they feel <strong class="text-gold-300">natural</strong>.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 4: Pricing That Actually Works",
        readTime: "20 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">💰</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 4</p>
      <h2 class="text-xl font-bold text-gray-900">Pricing That Actually Works</h2>
    </div>
  </div>

  <!-- Mindset Shift -->
  <div class="bg-gradient-to-r from-burgundy-50 to-gold-50 border-l-4 border-burgundy-600 p-6 rounded-r-xl mb-8">
    <h3 class="text-lg font-bold text-burgundy-800 mb-3">💡 The Pricing Mindset Shift</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-red-50 rounded-lg p-4 border border-red-100">
        <p class="text-sm font-semibold text-red-700 mb-2">❌ Old Thinking:</p>
        <p class="text-gray-700">"What do I charge per hour?"</p>
      </div>
      <div class="bg-green-50 rounded-lg p-4 border border-green-100">
        <p class="text-sm font-semibold text-green-700 mb-2">✅ New Thinking:</p>
        <p class="text-gray-700">"What is the transformation worth?"</p>
      </div>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    Your client isn't buying an hour of your time. They're buying:
  </p>
  
  <div class="grid grid-cols-2 gap-3 mb-8">
    <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
      <span class="text-2xl block mb-2">😌</span>
      <p class="text-sm text-gray-700">Relief from symptoms that have plagued them for years</p>
    </div>
    <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
      <span class="text-2xl block mb-2">⚡</span>
      <p class="text-sm text-gray-700">Energy to be present with their family</p>
    </div>
    <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
      <span class="text-2xl block mb-2">💪</span>
      <p class="text-sm text-gray-700">Confidence in their health decisions</p>
    </div>
    <div class="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-100">
      <span class="text-2xl block mb-2">🔓</span>
      <p class="text-sm text-gray-700">Freedom from Google rabbit holes</p>
    </div>
  </div>

  <div class="bg-emerald-900 text-white rounded-2xl p-4 mb-8 text-center">
    <p class="text-lg font-semibold">Price the <span class="text-gold-400">outcome</span>, not the hour.</p>
  </div>

  <!-- The Pricing Framework -->
  <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <span class="text-2xl">📊</span> The Pricing Framework
  </h3>

  <div class="space-y-4 mb-8">
    <div class="bg-white border-2 border-blue-200 rounded-xl p-5">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold">1</span>
        </div>
        <h4 class="font-bold text-gray-900">Calculate Your Minimum Sustainable Rate</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• Monthly expenses (business + personal minimum)</li>
        <li>• Divide by hours you can actually work with clients</li>
        <li>• This is your <strong>FLOOR</strong>, not your rate</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-blue-200 rounded-xl p-5">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold">2</span>
        </div>
        <h4 class="font-bold text-gray-900">Research the Market</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• What do similar practitioners charge?</li>
        <li>• Note: don't copy their prices, but understand the range</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-blue-200 rounded-xl p-5">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold">3</span>
        </div>
        <h4 class="font-bold text-gray-900">Consider the Transformation</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• How long have they struggled with this?</li>
        <li>• What have they already spent trying to fix it?</li>
        <li>• What is their health worth to them?</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-blue-200 rounded-xl p-5">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold">4</span>
        </div>
        <h4 class="font-bold text-gray-900">Set Packages, Not Hourly Rates</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• Single sessions trap you in time-for-money</li>
        <li>• Packages allow you to deliver transformation</li>
        <li>• Packages attract committed clients</li>
      </ul>
    </div>
  </div>

  <!-- Sample Pricing Structure -->
  <h3 class="text-xl font-bold text-gray-900 mb-4">📋 Sample Pricing Structure</h3>

  <div class="grid md:grid-cols-2 gap-4 mb-8">
    <div class="bg-red-50 border border-red-200 rounded-xl p-5">
      <p class="text-lg font-bold text-red-700 mb-3">❌ What NOT to Do:</p>
      <ul class="text-sm text-gray-700 space-y-2">
        <li>• "60-minute session: $100"</li>
        <li>• Discounts for buying multiple sessions</li>
        <li>• Different prices for different clients</li>
      </ul>
    </div>
    
    <div class="bg-green-50 border border-green-200 rounded-xl p-5">
      <p class="text-lg font-bold text-green-700 mb-3">✅ What TO Do:</p>
      <div class="space-y-3">
        <div class="bg-white rounded-lg p-3 border border-green-100">
          <p class="font-semibold text-gray-900">Discovery Call (15-30 min)</p>
          <p class="text-sm text-green-600 font-bold">FREE</p>
          <p class="text-xs text-gray-500">Purpose: Determine fit. Not a consultation!</p>
        </div>
        <div class="bg-white rounded-lg p-3 border border-green-100">
          <p class="font-semibold text-gray-900">Intensive Package (3 months)</p>
          <p class="text-sm text-green-600 font-bold">$997-2,500</p>
          <p class="text-xs text-gray-500">Initial assessment + 6-8 sessions + protocols + support</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Handling Price Conversations -->
  <div class="bg-purple-50 border border-purple-200 rounded-2xl p-5 mb-6">
    <h3 class="text-lg font-bold text-purple-800 mb-3">🗣️ Handling Price Conversations</h3>
    <p class="text-sm text-gray-700 mb-3">Focus the conversation on (in order):</p>
    <div class="space-y-2">
      <div class="flex items-center gap-2"><span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span><span class="text-sm">Their current situation (pain points)</span></div>
      <div class="flex items-center gap-2"><span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span><span class="text-sm">Where they want to be (goals)</span></div>
      <div class="flex items-center gap-2"><span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span><span class="text-sm">What's getting in the way (obstacles)</span></div>
      <div class="flex items-center gap-2"><span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span><span class="text-sm">How you can help (your approach)</span></div>
      <div class="flex items-center gap-2"><span class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span><span class="text-sm"><strong>Investment</strong> (only after they're excited)</span></div>
    </div>
  </div>

  <!-- Raising Prices -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
    <h3 class="text-lg font-bold text-amber-800 mb-3">📈 Raising Your Prices</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <p class="text-sm font-semibold text-amber-700 mb-2">When to raise:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• Calendar is 80%+ full</li>
          <li>• Getting mostly yes's to proposals</li>
          <li>• Every 6-12 months minimum</li>
        </ul>
      </div>
      <div>
        <p class="text-sm font-semibold text-amber-700 mb-2">How to raise:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• New clients = new prices immediately</li>
          <li>• Existing clients = notice + grandfather</li>
          <li>• Raise by meaningful amounts (not $10)</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">💡</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Remember</h3>
    </div>
    <p class="text-burgundy-100 text-lg">
      If <strong class="text-white">no one ever says your prices are too high</strong>, you're <strong class="text-gold-300">undercharging</strong>.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 5: How to Say No Without Guilt",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🚫</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 5</p>
      <h2 class="text-xl font-bold text-gray-900">How to Say No Without Guilt</h2>
    </div>
  </div>

  <!-- Core Insight -->
  <div class="bg-gradient-to-r from-burgundy-50 to-rose-50 border-l-4 border-burgundy-600 p-6 rounded-r-xl mb-8">
    <h3 class="text-lg font-bold text-burgundy-800 mb-3">💡 Why Saying No Is Saying Yes</h3>
    <p class="text-gray-700 mb-4">Every "yes" to something is a "no" to something else.</p>
    <div class="space-y-2">
      <div class="flex items-center gap-3 text-sm">
        <span class="text-rose-500">When you say yes to the client who drains you →</span>
        <span class="text-gray-600">You say no to energy for clients who light you up</span>
      </div>
      <div class="flex items-center gap-3 text-sm">
        <span class="text-rose-500">When you say yes to scope creep →</span>
        <span class="text-gray-600">You say no to your boundaries and sustainability</span>
      </div>
      <div class="flex items-center gap-3 text-sm">
        <span class="text-rose-500">When you say yes to misaligned projects →</span>
        <span class="text-gray-600">You say no to opportunities that ARE aligned</span>
      </div>
    </div>
  </div>

  <div class="bg-rose-900 text-white rounded-2xl p-4 mb-8 text-center">
    <p class="text-lg font-semibold">The practitioners who <span class="text-rose-300">burn out</span> are the ones who can't say <span class="text-gold-400">no</span>.</p>
  </div>

  <!-- The No Framework -->
  <div class="bg-white border-2 border-purple-200 rounded-2xl p-5 mb-6">
    <h3 class="text-lg font-bold text-purple-800 mb-4 flex items-center gap-2">
      <span class="text-2xl">🎯</span> The No Framework
    </h3>
    <p class="text-sm text-gray-700 mb-4">Before responding, ask yourself:</p>
    <div class="space-y-3">
      <div class="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-sm">1</span>
        </div>
        <span class="text-gray-700">Does this align with where I want to go?</span>
      </div>
      <div class="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-sm">2</span>
        </div>
        <span class="text-gray-700">Does this energize me or drain me?</span>
      </div>
      <div class="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-sm">3</span>
        </div>
        <span class="text-gray-700">Do I have capacity without sacrificing something important?</span>
      </div>
      <div class="flex items-center gap-3 bg-purple-50 rounded-xl p-3">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-sm">4</span>
        </div>
        <span class="text-gray-700">Would I say yes if this were tomorrow?</span>
      </div>
    </div>
    <div class="bg-purple-100 rounded-xl p-3 mt-4 text-center">
      <p class="text-purple-800 font-semibold">If the answer isn't a clear YES, it's a NO.</p>
    </div>
  </div>

  <!-- Scripts for Saying No -->
  <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <span class="text-2xl">📝</span> Scripts for Saying No
  </h3>

  <div class="space-y-4 mb-8">
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
      <p class="text-sm font-semibold text-blue-700 mb-2">To a potential client who isn't a fit:</p>
      <p class="text-sm text-gray-700 italic">"Thank you for considering working with me. Based on what you've shared, I don't think I'm the best fit for what you need right now. I'd recommend [referral]. I wish you all the best!"</p>
    </div>
    
    <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
      <p class="text-sm font-semibold text-amber-700 mb-2">To scope creep:</p>
      <p class="text-sm text-gray-700 italic">"I appreciate that you're thinking about this! That's outside the scope of our current work. We could discuss adding it as a separate project, or I can recommend someone who specializes in that area."</p>
    </div>
    
    <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
      <p class="text-sm font-semibold text-pink-700 mb-2">To a friend who wants free help:</p>
      <p class="text-sm text-gray-700 italic">"I love that you thought of me! I do my best work in a structured setting. Here's my booking link if you'd like to work together properly. In the meantime, [one general tip]."</p>
    </div>
    
    <div class="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
      <p class="text-sm font-semibold text-gray-700 mb-2">To the last-minute request:</p>
      <p class="text-sm text-gray-700 italic">"I'm not able to accommodate that timeline. I could do [alternative] or we could revisit this [when you have capacity]."</p>
    </div>
    
    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
      <p class="text-sm font-semibold text-emerald-700 mb-2">To an opportunity that's not aligned:</p>
      <p class="text-sm text-gray-700 italic">"Thank you so much for thinking of me! I'm focusing my energy in a different direction right now, so I'll have to pass. Best of luck with the project!"</p>
    </div>
  </div>

  <!-- Handling Guilt -->
  <div class="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-6">
    <h3 class="text-lg font-bold text-rose-800 mb-4">😟 Handling Guilt</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-white rounded-xl p-4 border border-rose-100">
        <p class="text-sm font-semibold text-rose-700 mb-2">The guilt comes from:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• Not wanting to disappoint people</li>
          <li>• Fear of missing out</li>
          <li>• Feeling like you "should" help everyone</li>
          <li>• Confusing your value with your output</li>
        </ul>
      </div>
      <div class="bg-white rounded-xl p-4 border border-green-100">
        <p class="text-sm font-semibold text-green-700 mb-2">✨ Reframe the guilt:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• "My no creates space for someone else's yes"</li>
          <li>• "I'm honoring my boundaries"</li>
          <li>• "I can't pour from an empty cup"</li>
          <li>• "They'll find the right fit, even if it's not me"</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Practice Exercise -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
    <h3 class="text-lg font-bold text-amber-800 mb-3">✍️ Practice Exercise</h3>
    <p class="text-gray-700 mb-3">This week, say <strong>no</strong> to one thing you'd normally say yes to out of obligation.</p>
    <p class="text-sm text-amber-700 mb-2">Notice:</p>
    <ul class="text-sm text-gray-700 space-y-1">
      <li>• How uncomfortable it feels initially</li>
      <li>• How much <strong>relief</strong> comes after</li>
      <li>• How the world doesn't end</li>
      <li>• How you have more energy for what matters</li>
    </ul>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">🏆</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Remember</h3>
    </div>
    <p class="text-burgundy-100 text-lg">
      The most <strong class="text-white">successful practitioners</strong> are the ones who have mastered the <strong class="text-gold-300">strategic no</strong>.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 6: Building Sustainable Systems",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">⚙️</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 6</p>
      <h2 class="text-xl font-bold text-gray-900">Building Sustainable Systems</h2>
    </div>
  </div>

  <!-- Systems vs Chaos -->
  <div class="grid md:grid-cols-2 gap-4 mb-8">
    <div class="bg-red-50 border border-red-200 rounded-2xl p-5">
      <h3 class="text-lg font-bold text-red-700 mb-3">❌ Without Systems:</h3>
      <ul class="text-sm text-gray-700 space-y-2">
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> You reinvent the wheel with every client</li>
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> Important follow-ups slip through cracks</li>
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> Your brand feels inconsistent</li>
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> You work harder, not smarter</li>
      </ul>
    </div>
    <div class="bg-green-50 border border-green-200 rounded-2xl p-5">
      <h3 class="text-lg font-bold text-green-700 mb-3">✅ With Systems:</h3>
      <ul class="text-sm text-gray-700 space-y-2">
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Client experience is consistent and professional</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> You save hours weekly on admin</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> You can focus on what only you can do</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Scaling becomes possible</li>
      </ul>
    </div>
  </div>

  <div class="bg-cyan-900 text-white rounded-2xl p-4 mb-8 text-center">
    <p class="text-lg font-semibold">Build systems that handle the <span class="text-cyan-300">repeatable</span> so you can focus on the <span class="text-gold-400">personal</span>.</p>
  </div>

  <!-- Essential Systems -->
  <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <span class="text-2xl">🏗️</span> Essential Systems for Practitioners
  </h3>

  <div class="space-y-4 mb-8">
    <div class="bg-white border-2 border-blue-200 rounded-xl p-4">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-sm">1</span></div>
        <h4 class="font-bold text-gray-900">Client Onboarding System</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• Automated welcome sequence</li>
        <li>• Intake forms that collect what you need</li>
        <li>• Pre-session prep instructions</li>
        <li>• Clear expectations set upfront</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-purple-200 rounded-xl p-4">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-sm">2</span></div>
        <h4 class="font-bold text-gray-900">Scheduling System</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• Online booking (essential)</li>
        <li>• Automated reminders (24-48 hours before)</li>
        <li>• Clear cancellation policy</li>
        <li>• Buffer time between sessions</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-emerald-200 rounded-xl p-4">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-sm">3</span></div>
        <h4 class="font-bold text-gray-900">Documentation System</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• Session notes template</li>
        <li>• Protocol tracking</li>
        <li>• Client progress notes</li>
        <li>• Secure storage (HIPAA if applicable)</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-amber-200 rounded-xl p-4">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-sm">4</span></div>
        <h4 class="font-bold text-gray-900">Follow-Up System</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• Check-in templates</li>
        <li>• Milestone reminders</li>
        <li>• Re-engagement sequences for past clients</li>
        <li>• Referral request timing</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-pink-200 rounded-xl p-4">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center"><span class="text-white font-bold text-sm">5</span></div>
        <h4 class="font-bold text-gray-900">Content System</h4>
      </div>
      <ul class="text-sm text-gray-700 space-y-1 ml-11">
        <li>• Content calendar (even simple)</li>
        <li>• Templates for common posts</li>
        <li>• Repurposing workflow</li>
        <li>• Batch creation schedule</li>
      </ul>
    </div>
  </div>

  <!-- 5-Day Action Plan -->
  <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 mb-6 border border-indigo-100">
    <h3 class="text-lg font-bold text-indigo-800 mb-4 flex items-center gap-2">
      <span class="text-2xl">📅</span> Your First Week: Build 5 Systems
    </h3>
    <div class="space-y-3">
      <div class="bg-white rounded-xl p-3 border border-indigo-100">
        <p class="font-semibold text-indigo-700">Day 1: Online Scheduling</p>
        <p class="text-xs text-gray-600">Calendly/Acuity • Available hours • Buffer time • Intake questions</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-indigo-100">
        <p class="font-semibold text-indigo-700">Day 2: Intake Form</p>
        <p class="text-xs text-gray-600">Health history • Current concerns • Goals • What they've tried</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-indigo-100">
        <p class="font-semibold text-indigo-700">Day 3: Welcome Email Template</p>
        <p class="text-xs text-gray-600">What to expect • How to prepare • Logistics • Cancellation policy</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-indigo-100">
        <p class="font-semibold text-indigo-700">Day 4: Session Notes Template</p>
        <p class="text-xs text-gray-600">Current symptoms • Protocol changes • Action items • Next session plan</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-indigo-100">
        <p class="font-semibold text-indigo-700">Day 5: Automated Reminders</p>
        <p class="text-xs text-gray-600">48-hour reminder • 24-hour reminder • Post-session follow-up</p>
      </div>
    </div>
    <div class="bg-indigo-100 rounded-xl p-3 mt-4 text-center">
      <p class="text-indigo-800 font-semibold">5 days. 5 systems. You'll refine as you go.</p>
    </div>
  </div>

  <!-- 80/20 Rule -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
    <h3 class="text-lg font-bold text-amber-800 mb-3">📊 The 80/20 of Systems</h3>
    <p class="text-sm text-gray-700 mb-3">Focus your system energy on:</p>
    <ul class="text-sm text-gray-700 space-y-1">
      <li>• What you do <strong>repeatedly</strong> (onboarding, follow-ups)</li>
      <li>• Where you <strong>lose time</strong> (scheduling, note-taking)</li>
      <li>• Where <strong>clients get confused</strong> (expectations, logistics)</li>
      <li>• Where <strong>things fall through cracks</strong> (follow-ups)</li>
    </ul>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">💡</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Remember</h3>
    </div>
    <p class="text-burgundy-100 text-lg">
      A <strong class="text-white">simple system you use</strong> beats a <strong class="text-gold-300">complex system you avoid</strong>. Systems are living—build the MVP, then iterate.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 7: Finding Your People",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">👥</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 7</p>
      <h2 class="text-xl font-bold text-gray-900">Finding Your People</h2>
    </div>
  </div>

  <!-- Why Community Matters -->
  <div class="bg-gradient-to-r from-violet-50 to-purple-50 border-l-4 border-violet-600 p-6 rounded-r-xl mb-8">
    <h3 class="text-lg font-bold text-violet-800 mb-3">💜 Why Community Matters</h3>
    <p class="text-gray-700 italic mb-4">Solo practice doesn't mean solo journey.</p>
    
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-red-50 rounded-xl p-4 border border-red-100">
        <p class="text-sm font-semibold text-red-700 mb-2">❌ Without Community:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• Every problem feels unique (it's not)</li>
          <li>• Learning curve is slower</li>
          <li>• Isolation breeds imposter syndrome</li>
          <li>• Mistakes are repeated</li>
        </ul>
      </div>
      <div class="bg-green-50 rounded-xl p-4 border border-green-100">
        <p class="text-sm font-semibold text-green-700 mb-2">✅ With Community:</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• Shared wisdom accelerates growth</li>
          <li>• Accountability keeps you consistent</li>
          <li>• Referrals flow naturally</li>
          <li>• Support through hard seasons</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="bg-violet-900 text-white rounded-2xl p-4 mb-8 text-center">
    <p class="text-lg font-semibold">The practitioners who <span class="text-violet-300">thrive</span> have <span class="text-gold-400">people behind them</span>.</p>
  </div>

  <!-- Types of Support -->
  <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <span class="text-2xl">🤝</span> Types of Support to Build
  </h3>

  <div class="grid md:grid-cols-2 gap-4 mb-8">
    <div class="bg-white border-2 border-blue-200 rounded-xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🎯</span>
        <h4 class="font-bold text-gray-900">Mentor (1-2)</h4>
      </div>
      <p class="text-sm text-gray-600 mb-2">Someone further along who can guide you</p>
      <ul class="text-xs text-gray-700 space-y-1">
        <li>• Shortens your learning curve</li>
        <li>• Perspective on big decisions</li>
        <li>• Holds you to higher standards</li>
        <li>• Worth paying for</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-purple-200 rounded-xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">👯</span>
        <h4 class="font-bold text-gray-900">Peers (3-5)</h4>
      </div>
      <p class="text-sm text-gray-600 mb-2">Practitioners at similar stages</p>
      <ul class="text-xs text-gray-700 space-y-1">
        <li>• Shared struggles and wins</li>
        <li>• Accountability partners</li>
        <li>• Referral exchange</li>
        <li>• Safe space to vent</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-emerald-200 rounded-xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">🌐</span>
        <h4 class="font-bold text-gray-900">Community (Many)</h4>
      </div>
      <p class="text-sm text-gray-600 mb-2">Broader practitioner communities</p>
      <ul class="text-xs text-gray-700 space-y-1">
        <li>• Varied perspectives</li>
        <li>• Resource sharing</li>
        <li>• Opportunities you'd miss alone</li>
        <li>• Normalizes the journey</li>
      </ul>
    </div>

    <div class="bg-white border-2 border-pink-200 rounded-xl p-4">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-2xl">❤️</span>
        <h4 class="font-bold text-gray-900">Non-Practitioner Support</h4>
      </div>
      <p class="text-sm text-gray-600 mb-2">Friends, family, partner</p>
      <ul class="text-xs text-gray-700 space-y-1">
        <li>• Remind you there's life outside work</li>
        <li>• Celebrate wins</li>
        <li>• Ground you when work gets consuming</li>
        <li>• Don't understand details (and that's okay)</li>
      </ul>
    </div>
  </div>

  <!-- Finding and Connecting -->
  <div class="grid md:grid-cols-2 gap-4 mb-6">
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
      <h4 class="font-bold text-blue-800 mb-3">📍 Where to Look:</h4>
      <ul class="text-sm text-gray-700 space-y-1">
        <li>• Certification program alumni groups</li>
        <li>• Professional associations</li>
        <li>• Online communities (Facebook, Slack)</li>
        <li>• Local practitioner meetups</li>
        <li>• Conferences and workshops</li>
      </ul>
    </div>

    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
      <h4 class="font-bold text-emerald-800 mb-3">🔗 How to Connect:</h4>
      <ul class="text-sm text-gray-700 space-y-1">
        <li>• Give before you take</li>
        <li>• Be genuinely curious about others</li>
        <li>• Share your struggles (vulnerability connects)</li>
        <li>• Follow up (most people don't)</li>
        <li>• Offer help before asking for help</li>
      </ul>
    </div>
  </div>

  <!-- Red Flags -->
  <div class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
    <h4 class="font-bold text-red-700 mb-2">🚩 Red Flags to Avoid:</h4>
    <ul class="text-sm text-gray-700 space-y-1">
      <li>• Communities that only celebrate wins</li>
      <li>• Groups with lots of judgment</li>
      <li>• Spaces dominated by one voice</li>
      <li>• Communities that feel like competition, not collaboration</li>
    </ul>
  </div>

  <!-- Inner Circle -->
  <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
    <h3 class="text-lg font-bold text-amber-800 mb-3">⭐ Building Your Inner Circle</h3>
    <p class="text-sm text-gray-700 mb-3">Quality over quantity. You need:</p>
    <div class="grid grid-cols-2 gap-2 mb-4">
      <div class="bg-white rounded-lg p-2 text-center text-xs border border-amber-100">
        <span class="text-lg block mb-1">📞</span>
        One person to call when things go wrong
      </div>
      <div class="bg-white rounded-lg p-2 text-center text-xs border border-amber-100">
        <span class="text-lg block mb-1">🎉</span>
        One person to celebrate wins without jealousy
      </div>
      <div class="bg-white rounded-lg p-2 text-center text-xs border border-amber-100">
        <span class="text-lg block mb-1">💬</span>
        One person to tell you hard truths
      </div>
      <div class="bg-white rounded-lg p-2 text-center text-xs border border-amber-100">
        <span class="text-lg block mb-1">🗺️</span>
        One person who's been where you're going
      </div>
    </div>
    <div class="bg-amber-100 rounded-lg p-3 text-center">
      <p class="text-sm text-amber-800"><strong>Action:</strong> This month, reach out to 3 practitioners. Ask for a virtual coffee. See who resonates.</p>
    </div>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">💎</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Remember</h3>
    </div>
    <p class="text-burgundy-100 text-lg">
      Your <strong class="text-white">network</strong> is your <strong class="text-gold-300">net worth</strong> in this field. Invest in it.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      },
      {
        title: "Chapter 8: Your First 30 Days - Action Plan",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🚀</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 8</p>
      <h2 class="text-xl font-bold text-gray-900">Your First 30 Days - Action Plan</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    This is your <strong>launch blueprint</strong>. Follow it step by step, and in 30 days you'll have the foundation for a real practice.
  </p>

  <!-- 30-Day Plan -->
  <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
    <span class="text-2xl">📅</span> Your 30-Day Launch Plan
  </h3>

  <div class="space-y-4 mb-8">
    <!-- Week 1 -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold">1</span>
        </div>
        <div>
          <h4 class="font-bold text-gray-900">Day 1-7: Foundation</h4>
          <p class="text-xs text-blue-600">Set up your essential tools</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center gap-2 text-sm"><span class="text-blue-500">□</span> Set up online scheduling system</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-blue-500">□</span> Create simple intake form</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-blue-500">□</span> Write welcome email template</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-blue-500">□</span> Define your ideal client (one paragraph)</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-blue-500">□</span> Tell 10 people what you do (practice your pitch)</div>
      </div>
    </div>

    <!-- Week 2 -->
    <div class="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-5 border border-purple-100">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold">2</span>
        </div>
        <div>
          <h4 class="font-bold text-gray-900">Day 8-14: Presence</h4>
          <p class="text-xs text-purple-600">Get visible and connect</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center gap-2 text-sm"><span class="text-purple-500">□</span> Set up basic online presence (social profile update)</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-purple-500">□</span> Write your "About" page/bio</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-purple-500">□</span> Create one piece of helpful content</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-purple-500">□</span> Join one practitioner community</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-purple-500">□</span> Reach out to one potential mentor</div>
      </div>
    </div>

    <!-- Week 3 -->
    <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold">3</span>
        </div>
        <div>
          <h4 class="font-bold text-gray-900">Day 15-21: Practice</h4>
          <p class="text-xs text-amber-600">Refine your process</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center gap-2 text-sm"><span class="text-amber-500">□</span> Book 2-3 practice sessions (friends/family)</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-amber-500">□</span> Refine your consultation flow</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-amber-500">□</span> Create your session notes template</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-amber-500">□</span> Get feedback from practice clients</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-amber-500">□</span> Adjust based on what you learned</div>
      </div>
    </div>

    <!-- Week 4 -->
    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold">4</span>
        </div>
        <div>
          <h4 class="font-bold text-gray-900">Day 22-28: Launch</h4>
          <p class="text-xs text-emerald-600">Go public and get your first client</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center gap-2 text-sm"><span class="text-emerald-500">□</span> Make your first public post about your services</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-emerald-500">□</span> Reach out to 5 people who might know your ideal client</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-emerald-500">□</span> Set your prices (don't overthink)</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-emerald-500">□</span> Create your first offer/package</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-emerald-500">□</span> Book your first real consultation</div>
      </div>
    </div>

    <!-- Days 29-30 -->
    <div class="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-100">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
          <span class="text-white font-bold">✓</span>
        </div>
        <div>
          <h4 class="font-bold text-gray-900">Day 29-30: Reflect</h4>
          <p class="text-xs text-rose-600">Evaluate and plan next steps</p>
        </div>
      </div>
      <div class="grid grid-cols-1 gap-2">
        <div class="flex items-center gap-2 text-sm"><span class="text-rose-500">?</span> What worked this month?</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-rose-500">?</span> What felt harder than expected?</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-rose-500">?</span> What will you do differently next month?</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-rose-500">?</span> Who do you need to support you?</div>
        <div class="flex items-center gap-2 text-sm"><span class="text-rose-500">?</span> What's your ONE focus for next month?</div>
      </div>
    </div>
  </div>

  <!-- Daily Habits -->
  <h3 class="text-xl font-bold text-gray-900 mb-4">⏰ Daily Habits for Success</h3>
  <div class="grid md:grid-cols-3 gap-4 mb-8">
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h4 class="font-bold text-blue-700 mb-2">🌅 Morning</h4>
      <ul class="text-sm text-gray-700 space-y-1">
        <li>• Review your schedule</li>
        <li>• Set your top 3 priorities</li>
        <li>• One act of visibility</li>
      </ul>
    </div>
    <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <h4 class="font-bold text-purple-700 mb-2">📆 Weekly</h4>
      <ul class="text-sm text-gray-700 space-y-1">
        <li>• Review client notes</li>
        <li>• Batch content creation</li>
        <li>• Community engagement</li>
        <li>• Learning time</li>
      </ul>
    </div>
    <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <h4 class="font-bold text-emerald-700 mb-2">📊 Monthly</h4>
      <ul class="text-sm text-gray-700 space-y-1">
        <li>• Financial review</li>
        <li>• Client feedback review</li>
        <li>• System improvements</li>
        <li>• Peer connection</li>
      </ul>
    </div>
  </div>

  <!-- First Year Roadmap -->
  <h3 class="text-xl font-bold text-gray-900 mb-4">🗺️ Your First Year Focus Areas</h3>
  <div class="grid grid-cols-2 gap-3 mb-8">
    <div class="bg-blue-100 rounded-xl p-4 text-center">
      <div class="font-bold text-blue-800 mb-1">Q1: Foundation</div>
      <p class="text-xs text-gray-600">Systems • Practice clients • Community • Niche</p>
    </div>
    <div class="bg-purple-100 rounded-xl p-4 text-center">
      <div class="font-bold text-purple-800 mb-1">Q2: Momentum</div>
      <p class="text-xs text-gray-600">Content • Paying clients • Process • Voice</p>
    </div>
    <div class="bg-amber-100 rounded-xl p-4 text-center">
      <div class="font-bold text-amber-800 mb-1">Q3: Growth</div>
      <p class="text-xs text-gray-600">Prices • Services • Expertise • Referrals</p>
    </div>
    <div class="bg-emerald-100 rounded-xl p-4 text-center">
      <div class="font-bold text-emerald-800 mb-1">Q4: Optimization</div>
      <p class="text-xs text-gray-600">Streamline • Evaluate • Plan • Celebrate</p>
    </div>
  </div>

  <!-- Final Thoughts -->
  <div class="bg-gradient-to-r from-burgundy-50 to-gold-50 border-l-4 border-burgundy-600 p-6 rounded-r-xl mb-6">
    <h3 class="text-lg font-bold text-burgundy-800 mb-3">💫 Final Thoughts</h3>
    <p class="text-gray-700 mb-3">You chose this path because you want to help people. That calling matters.</p>
    <p class="text-gray-700 mb-3">The business side can feel overwhelming, but it's learnable. Every successful practitioner started exactly where you are now.</p>
    <p class="text-gray-700 font-semibold">Progress over perfection. Done is better than perfect. Imperfect action beats perfect planning.</p>
  </div>

  <!-- Key Takeaway -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">🎯</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Your First Client is Waiting</h3>
    </div>
    <p class="text-burgundy-100 text-lg mb-3">
      They're out there, waiting for exactly what you have to offer.
    </p>
    <p class="text-gold-300 font-bold text-xl text-center">
      Go find them. Welcome to the practitioner life. You've got this. 💪
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • The Practitioner Reality Playbook</span>
  </div>
</div>`
      }
    ]
  },
  {
    id: "scope-ethics-guide",
    title: "Scope of Practice & Ethics Guide",
    subtitle: "Protecting Yourself While Helping Clients",
    description: "Navigate the legal and ethical landscape of functional medicine practice. Know exactly what you can and cannot do, say, and recommend.",
    valueProp: "One wrong word can end your career—here's how to stay safe.",
    author: "AccrediPro Academy",
    pages: 48,
    icon: "⚖️",
    category: "core",
    topics: ["Legal Boundaries", "Scope of Practice", "Documentation", "Liability Protection"],
    readTime: "2 hours",
    unlockedDate: "2024-12-01",
    isFree: true,
    unlockCondition: "Mini Diploma Graduate or Challenge Day 4",
    chapters: [
      {
        title: "Introduction: Why Scope Matters",
        readTime: "6 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">⚖️</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Introduction</p>
      <h2 class="text-xl font-bold text-gray-900">Why Scope Matters</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    One wrong word can end your career before it starts.
  </p>

  <!-- Warning Box -->
  <div class="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8">
    <div class="flex items-center gap-3 mb-3">
      <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
        <span class="text-xl">⚠️</span>
      </div>
      <h3 class="text-lg font-bold text-red-800">What's at Stake</h3>
    </div>
    <div class="grid md:grid-cols-2 gap-3">
      <div class="bg-white/50 rounded-lg p-2 text-sm text-red-900 font-medium">• Cease and desist letters</div>
      <div class="bg-white/50 rounded-lg p-2 text-sm text-red-900 font-medium">• Fines and penalties</div>
      <div class="bg-white/50 rounded-lg p-2 text-sm text-red-900 font-medium">• License issues (if licensed)</div>
      <div class="bg-white/50 rounded-lg p-2 text-sm text-red-900 font-medium">• Lawsuits</div>
      <div class="bg-white/50 rounded-lg p-2 text-sm text-red-900 font-medium">• Professional reputation</div>
      <div class="bg-white/50 rounded-lg p-2 text-sm text-red-900 font-medium">• Criminal charges (extreme cases)</div>
    </div>
  </div>

  <!-- The Good News -->
  <div class="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
    <h3 class="text-lg font-bold text-green-800 mb-4">✅ The Good News</h3>
    <p class="text-green-900 mb-4">You can help people powerfully within your scope:</p>
    <ul class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
      <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Nutrition guidance</li>
      <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Lifestyle recommendations</li>
      <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Health education</li>
      <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Emotional support</li>
      <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Accountability and coaching</li>
      <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>Supplement recommendations*</li>
    </ul>
    <p class="text-xs text-green-700 mt-4 italic">*In most states</p>
  </div>

  <div class="bg-slate-800 text-white rounded-xl p-5 mb-8 text-center">
    <p class="text-lg font-medium">The key is knowing where the <span class="text-gold-400 font-bold">lines</span> are.</p>
  </div>

  <!-- Guide Goals -->
  <div class="border-l-4 border-slate-300 pl-4 py-2 mb-8">
    <h4 class="font-bold text-gray-900 mb-2">This guide will help you:</h4>
    <ul class="space-y-2 text-gray-700 text-sm">
      <li>• Understand your scope clearly</li>
      <li>• Communicate appropriately</li>
      <li>• Document properly</li>
      <li>• Protect yourself while serving clients</li>
      <li>• Know when and how to refer</li>
    </ul>
  </div>

  <!-- Disclaimers -->
  <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
    <strong class="block mb-2">⚖️ Disclaimers about this guide:</strong>
    <p class="mb-2">This guide provides general education, not legal advice.</p>
    <ul class="space-y-1 list-disc pl-4 text-amber-800">
      <li>Laws vary by state and change frequently</li>
      <li>Check your specific state's regulations</li>
      <li>Consult with a healthcare attorney if needed</li>
      <li>Your certification body may have specific guidelines</li>
    </ul>
    <p class="mt-3 font-bold">When in doubt, err on the side of caution.</p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 1: What You CAN and CANNOT Do",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🚦</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 1</p>
      <h2 class="text-xl font-bold text-gray-900">What You CAN and CANNOT Do</h2>
    </div>
  </div>

  <div class="bg-gray-100 rounded-xl p-4 mb-8 text-center border border-gray-200">
    <h3 class="font-bold text-gray-900">The Big Line: Diagnosing and Treating</h3>
  </div>

  <!-- Can/Cannot Grid -->
  <div class="grid md:grid-cols-2 gap-4 mb-8">
    <div class="bg-red-50 border border-red-200 rounded-2xl p-5">
      <h3 class="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
        <span class="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs">❌</span> CANNOT Do:
      </h3>
      <p class="text-xs text-red-600 mb-3 font-semibold uppercase tracking-wider">Without Appropriate License</p>
      <ul class="space-y-2 text-sm text-gray-700">
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> Diagnose disease or medical conditions</li>
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> Prescribe medications</li>
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> Order medical tests (most states)</li>
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> Treat disease</li>
        <li class="flex items-start gap-2"><span class="text-red-400">•</span> Claim to cure anything</li>
      </ul>
    </div>

    <div class="bg-green-50 border border-green-200 rounded-2xl p-5">
      <h3 class="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
        <span class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">✅</span> CAN Do:
      </h3>
      <p class="text-xs text-green-600 mb-3 font-semibold uppercase tracking-wider">With Appropriate Training</p>
      <ul class="space-y-2 text-sm text-gray-700">
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Provide nutrition education</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Make dietary recommendations</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Suggest lifestyle modifications</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Recommend supplements</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Order/interpret functional tests*</li>
        <li class="flex items-start gap-2"><span class="text-green-500">•</span> Work alongside medical providers</li>
      </ul>
      <p class="text-xs text-green-600 mt-2 ml-4 italic">*Varies by state</p>
    </div>
  </div>

  <!-- Language Matters -->
  <div class="bg-white border-2 border-slate-100 rounded-2xl p-6 mb-8">
    <h3 class="font-bold text-slate-800 mb-4 flex items-center gap-2">
      <span class="text-xl">🗣️</span> Language Matters
    </h3>
    <div class="space-y-3">
      <div class="bg-gray-50 rounded-xl p-3 text-sm">
        <div class="flex items-center gap-2 text-red-500 line-through text-xs mb-1">
          "You have SIBO"
        </div>
        <div class="flex items-center gap-2 text-green-700 font-medium">
          → "Your symptoms suggest possible SIBO"
        </div>
      </div>
      <div class="bg-gray-50 rounded-xl p-3 text-sm">
        <div class="flex items-center gap-2 text-red-500 line-through text-xs mb-1">
          "This will cure your..."
        </div>
        <div class="flex items-center gap-2 text-green-700 font-medium">
          → "Many people find relief from..."
        </div>
      </div>
      <div class="bg-gray-50 rounded-xl p-3 text-sm">
        <div class="flex items-center gap-2 text-red-500 line-through text-xs mb-1">
          "Take this for your diabetes"
        </div>
        <div class="flex items-center gap-2 text-green-700 font-medium">
          → "This nutrient supports healthy blood sugar"
        </div>
      </div>
      <div class="bg-gray-50 rounded-xl p-3 text-sm">
        <div class="flex items-center gap-2 text-red-500 line-through text-xs mb-1">
          "You don't need your medication"
        </div>
        <div class="flex items-center gap-2 text-green-700 font-medium">
          → "Work with your doctor about your medications"
        </div>
      </div>
    </div>
  </div>

  <!-- State Specific -->
  <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-blue-800 mb-2">🗺️ State-Specific Considerations</h3>
    <p class="text-sm text-blue-900 mb-3">Laws vary significantly. You must research YOUR state:</p>
    <div class="grid grid-cols-2 gap-2 text-xs text-blue-800">
      <div class="bg-white/50 p-2 rounded">• Dietetic licensing laws</div>
      <div class="bg-white/50 p-2 rounded">• Health coach scope laws</div>
      <div class="bg-white/50 p-2 rounded">• Naturopathic laws</div>
      <div class="bg-white/50 p-2 rounded">• Medical practice stats</div>
    </div>
    <p class="text-xs text-blue-800 mt-3 font-semibold">When in doubt: Contact a healthcare attorney in your state.</p>
  </div>

  <!-- Specific Scenarios -->
  <h3 class="font-bold text-gray-900 mb-4">Specific Scope Scenarios</h3>
  <div class="space-y-4 mb-8">
    <!-- Medication -->
    <div class="border border-gray-200 rounded-xl p-4">
      <p class="font-semibold text-gray-900 text-sm mb-2">Scenario: Client asks about medication</p>
      <div class="space-y-2 text-sm">
        <div class="flex items-start gap-2 text-green-700">
          <span class="text-xs mt-1">✅</span> "Discuss with your prescribing doctor. I'm not qualified to advise on meds."
        </div>
        <div class="flex items-start gap-2 text-red-600">
          <span class="text-xs mt-1">❌</span> "You don't need that" or "That's causing your problems."
        </div>
      </div>
    </div>
    <!-- Diagnosis -->
    <div class="border border-gray-200 rounded-xl p-4">
      <p class="font-semibold text-gray-900 text-sm mb-2">Scenario: Client wants a diagnosis</p>
      <div class="space-y-2 text-sm">
        <div class="flex items-start gap-2 text-green-700">
          <span class="text-xs mt-1">✅</span> "Symptoms suggest you might want to discuss [condition] with your doctor."
        </div>
        <div class="flex items-start gap-2 text-red-600">
          <span class="text-xs mt-1">❌</span> "You have [condition]."
        </div>
      </div>
    </div>
    <!-- Lab Work -->
    <div class="border border-gray-200 rounded-xl p-4">
      <p class="font-semibold text-gray-900 text-sm mb-2">Scenario: Client brings lab work</p>
      <div class="space-y-2 text-sm">
        <div class="flex items-start gap-2 text-green-700">
          <span class="text-xs mt-1">✅</span> Review, educate on markers, suggest nutritional support for patterns.
        </div>
        <div class="flex items-start gap-2 text-red-600">
          <span class="text-xs mt-1">❌</span> Diagnose based on labs or replace medical interpretation.
        </div>
      </div>
    </div>
  </div>

  <!-- Safe Phrase Framework -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mb-6">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">🛡️</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">The Safe Phrase Framework</h3>
    </div>
    <div class="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm border border-white/20">
      <p class="font-mono text-sm text-gold-200">
        "[Nutrient] may support [function]. Many people find [benefit]. This is for general wellness and doesn't replace medical advice."
      </p>
    </div>
    <p class="text-sm text-burgundy-200">
      This keeps you in the <strong class="text-white">education/wellness space</strong>, not the treatment space.
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 2: Documentation That Protects You",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">📋</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 2</p>
      <h2 class="text-xl font-bold text-gray-900">Documentation That Protects You</h2>
    </div>
  </div>

  <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-blue-800 mb-3">Why Documentation Matters</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <p class="text-xs font-bold text-green-700 uppercase mb-2">Good Documentation:</p>
        <ul class="space-y-1 text-sm text-green-800">
          <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Creates a record of what/why</li>
          <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Shows stayed within scope</li>
          <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Protects you from questions</li>
          <li class="flex items-start gap-2"><span class="text-green-500">✓</span> Tracks client progress</li>
        </ul>
      </div>
      <div>
        <p class="text-xs font-bold text-red-700 uppercase mb-2">Poor Documentation:</p>
        <ul class="space-y-1 text-sm text-red-800">
          <li class="flex items-start gap-2"><span class="text-red-400">✗</span> "He said, she said" risks</li>
          <li class="flex items-start gap-2"><span class="text-red-400">✗</span> No proof of practice</li>
          <li class="flex items-start gap-2"><span class="text-red-400">✗</span> Harder to defend decisions</li>
          <li class="flex items-start gap-2"><span class="text-red-400">✗</span> Looks unprofessional</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="border-t border-gray-100 my-6"></div>

  <!-- What to Document -->
  <h3 class="font-bold text-gray-900 mb-4">What to Document (Every Interaction)</h3>
  <div class="grid gap-3 mb-8">
    <div class="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
      <span class="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">1</span>
      <div>
        <p class="font-bold text-gray-900 text-sm">Date & Time</p>
      </div>
    </div>
    <div class="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
      <span class="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">2</span>
      <div>
        <p class="font-bold text-gray-900 text-sm">Chief Complaint/Focus</p>
        <p class="text-xs text-gray-500">What is the client's main concern today?</p>
      </div>
    </div>
    <div class="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
      <span class="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">3</span>
      <div>
        <p class="font-bold text-gray-900 text-sm">Assessment/Observations</p>
        <p class="text-xs text-gray-500">Observations (not diagnosis), reported symptoms, history discussed.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
      <span class="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">4</span>
      <div>
        <p class="font-bold text-gray-900 text-sm">Plan/Recommendations</p>
        <p class="text-xs text-gray-500">Diet, lifestyle, supplements, referrals, follow-up plan.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
      <span class="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">5</span>
      <div>
        <p class="font-bold text-gray-900 text-sm">Disclaimers Noted</p>
        <p class="text-xs text-gray-500">Document disclaimers given and referrals to medical providers.</p>
      </div>
    </div>
    <div class="flex gap-3 items-start p-3 bg-gray-50 rounded-xl border border-gray-100">
      <span class="w-6 h-6 bg-slate-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-700">6</span>
      <div>
        <p class="font-bold text-gray-900 text-sm">Client Agreements</p>
        <p class="text-xs text-gray-500">Consent, scope discussed, policies acknowledged.</p>
      </div>
    </div>
  </div>

  <!-- Examples -->
  <h3 class="font-bold text-gray-900 mb-4">Documentation Example</h3>
  <div class="space-y-4 mb-8">
    <div class="bg-green-50 border border-green-200 rounded-xl p-4">
      <strong class="text-green-800 text-sm block mb-2">✅ GOOD Documentation:</strong>
      <p class="text-sm text-green-900 italic">"Client reports ongoing digestive discomfort including bloating after meals. Discussed potential role of diet factors. Recommended keeping food diary for 2 weeks, increasing water intake, and trying a basic elimination of common triggers. Suggested client follow up with MD for medical evaluation if symptoms persist. Provided general education on gut health..."</p>
    </div>
    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
      <strong class="text-red-800 text-sm block mb-2">❌ POOR Documentation:</strong>
      <p class="text-sm text-red-900 italic">"Client has IBS. Put her on gut healing protocol."</p>
    </div>
    <p class="text-center text-sm font-medium text-gray-600">See the difference in liability exposure?</p>
  </div>

  <!-- Intake Forms -->
  <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-amber-800 mb-3">📋 Essentials for Intake Forms</h3>
    <div class="grid grid-cols-2 gap-2 text-sm text-amber-900 mb-4">
      <div>• Health History</div>
      <div>• Informed Consent</div>
      <div>• Current Medications</div>
      <div>• Scope Acknowledgment</div>
      <div>• Current Symptoms</div>
      <div>• Privacy Policy</div>
      <div>• Goals</div>
      <div>• Cancel/Refund Policy</div>
    </div>
    <div class="bg-white/60 p-3 rounded-lg border border-amber-100 text-xs italic text-amber-800">
      "I understand that [Your Name] is not a licensed physician and does not diagnose or treat disease. The services provided are for general wellness education and support. I will continue to work with my healthcare providers for medical care."
    </div>
  </div>

  <!-- Digital Documentation -->
  <div class="bg-gray-100 rounded-xl p-5">
    <h3 class="font-bold text-gray-900 mb-2">🖥️ Digital Documentation</h3>
    <ul class="space-y-2 text-sm text-gray-700">
      <li class="flex items-start gap-2"><span class="text-burgundy-500">•</span> Ensure HIPAA compliance (if in US)</li>
      <li class="flex items-start gap-2"><span class="text-burgundy-500">•</span> Use secure, encrypted platforms</li>
      <li class="flex items-start gap-2"><span class="text-burgundy-500">•</span> Maintain regular backups</li>
      <li class="flex items-start gap-2"><span class="text-burgundy-500">•</span> Understand access controls</li>
    </ul>
    <p class="mt-3 text-xs text-gray-500">Free/cheap options may not be compliant. Invest in proper systems.</p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 3: Real Scenarios with Guidance",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🗣️</span>
    </div>
    <div>
      <p class="text-sm text-burgundy-600 font-medium">Chapter 3</p>
      <h2 class="text-xl font-bold text-gray-900">Real Scenarios with Guidance</h2>
    </div>
  </div>

  <p class="text-gray-600 text-sm mb-6">
    Navigating conversations is an art. Here are real-world scenarios you will likely face, with scripts on how to handle them ethically.
  </p>

  <div class="space-y-6 mb-10">
    <!-- Scenario 1 -->
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2">
        <span class="font-bold text-gray-800 text-sm">Scenario 1: The Self-Diagnoser</span>
      </div>
      <div class="p-4">
        <div class="flex gap-2 mb-4">
          <span class="text-2xl mt-1">👤</span>
          <div class="bg-blue-50 p-3 rounded-lg rounded-tl-none text-sm text-blue-900 flex-1">
            "I know I have Hashimoto's. What supplements should I take?"
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="pl-4 border-l-2 border-red-300">
            <p class="text-xs text-red-500 font-bold mb-1">❌ WRONG Response:</p>
            <p class="text-sm text-gray-600 italic">"For your Hashimoto's, you should take selenium, zinc, and vitamin D."</p>
          </div>
          <div class="pl-4 border-l-2 border-green-500">
            <p class="text-xs text-green-600 font-bold mb-1">✅ RIGHT Response:</p>
            <p class="text-sm text-gray-800">"Has Hashimoto's been diagnosed by your doctor? If not, I recommend discussing testing with them. I can share general info on supporting thyroid health through diet and lifestyle, but I can't treat a condition."</p>
          </div>
          <div class="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 mt-2">
             <strong>Why it matters:</strong> You didn't diagnose or claim to treat. You educated and empowered.
          </div>
        </div>
      </div>
    </div>

    <!-- Scenario 2 -->
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2">
        <span class="font-bold text-gray-800 text-sm">Scenario 2: The Medication Questioner</span>
      </div>
      <div class="p-4">
        <div class="flex gap-2 mb-4">
          <span class="text-2xl mt-1">👤</span>
          <div class="bg-blue-50 p-3 rounded-lg rounded-tl-none text-sm text-blue-900 flex-1">
            "I want to stop my cholesterol meds. Can I use supplements instead?"
          </div>
        </div>
        
        <div class="space-y-3">
          <div class="pl-4 border-l-2 border-red-300">
            <p class="text-xs text-red-500 font-bold mb-1">❌ WRONG Response:</p>
            <p class="text-sm text-gray-600 italic">"Sure, red yeast rice is basically the same thing. You can switch."</p>
          </div>
          <div class="pl-4 border-l-2 border-green-500">
            <p class="text-xs text-green-600 font-bold mb-1">✅ RIGHT Response:</p>
            <p class="text-sm text-gray-800">"That's a decision to make with your prescribing doctor—I can't advise on medications. I can share diet/lifestyle approaches to support healthy cholesterol levels that you can discuss with your doctor as part of your overall plan."</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Scenario 3 -->
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2">
        <span class="font-bold text-gray-800 text-sm">Scenario 3: The Urgent Symptoms</span>
      </div>
      <div class="p-4">
        <p class="text-sm text-gray-600 mb-3">Client reports red flags: Blood in stool, unintended weight loss, severe pain.</p>
        <div class="space-y-3">
          <div class="pl-4 border-l-2 border-green-500">
            <p class="text-xs text-green-600 font-bold mb-1">✅ RIGHT Response:</p>
            <p class="text-sm text-gray-800">"These symptoms need immediate medical evaluation. Please contact your doctor or urgent care today. Once you're medically cleared, I'm happy to support your wellness."</p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 mt-2">
             <strong>Document:</strong> "Referred to medical provider immediately. Declined recommendations until medically evaluated."
          </div>
        </div>
      </div>
    </div>

    <!-- Scenario 4 -->
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-3 border-b border-gray-200 flex items-center gap-2">
        <span class="font-bold text-gray-800 text-sm">Scenario 4: The Lab Interpreter</span>
      </div>
      <div class="p-4">
        <div class="flex gap-2 mb-4">
          <span class="text-2xl mt-1">👤</span>
          <div class="bg-blue-50 p-3 rounded-lg rounded-tl-none text-sm text-blue-900 flex-1">
            "My doctor said my labs are normal, but I feel terrible. What do they mean?"
          </div>
        </div>
        <div class="pl-4 border-l-2 border-green-500">
            <p class="text-xs text-green-600 font-bold mb-1">✅ RIGHT Response:</p>
            <p class="text-sm text-gray-800">"I can share general education on what these markers represent and optimal ranges some practitioners use. I can't diagnose based on labs. If you feel unheard, you might consider a second medical opinion."</p>
        </div>
      </div>
    </div>
  </div>

  <!-- The Golden Rules -->
  <div class="bg-gradient-to-r from-gold-50 to-amber-50 border border-gold-200 rounded-2xl p-6 mb-6">
    <div class="flex items-center gap-3 mb-4">
      <span class="text-2xl">🌟</span>
      <h3 class="text-lg font-bold text-gold-700">The Golden Rules</h3>
    </div>
    <ul class="grid md:grid-cols-2 gap-3 text-sm text-amber-900">
      <li class="flex items-center gap-2"><span class="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center text-xs text-gold-800 font-bold">1</span> When in doubt, refer out</li>
      <li class="flex items-center gap-2"><span class="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center text-xs text-gold-800 font-bold">2</span> Educate, don't diagnose</li>
      <li class="flex items-center gap-2"><span class="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center text-xs text-gold-800 font-bold">3</span> Support wellness, don't treat disease</li>
      <li class="flex items-center gap-2"><span class="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center text-xs text-gold-800 font-bold">4</span> Document everything</li>
      <li class="flex items-center gap-2"><span class="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center text-xs text-gold-800 font-bold">5</span> Never interfere with medical care</li>
      <li class="flex items-center gap-2"><span class="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center text-xs text-gold-800 font-bold">6</span> Be honest about your scope</li>
      <li class="flex items-center gap-2"><span class="w-6 h-6 bg-gold-200 rounded-full flex items-center justify-center text-xs text-gold-800 font-bold">7</span> Get it in writing</li>
    </ul>
    <p class="text-center font-bold text-amber-800 mt-6 text-sm">These rules will protect you 99% of the time.</p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span class="w-4 h-4 bg-burgundy-600 rounded flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      </svg>
    </span>
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 4: Collaborating with Medical Providers",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🤝</span>
    </div>
    <div>
      <p class="text-sm text-indigo-600 font-medium">Chapter 4</p>
      <h2 class="text-xl font-bold text-gray-900">Collaborating with Medical Providers</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    The future of healthcare isn't separation; it's <strong>collaboration</strong>. But to sit at the table with doctors, you must speak their language and respect their lane.
  </p>

  <div class="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-xl mb-8">
    <h3 class="font-bold text-indigo-900 mb-2">The "Bridge" Role</h3>
    <p class="text-sm text-indigo-800">
      Doctors diagnose and treat. You coach and implement.
      <br><br>
      The Doctor says: <em>"You need to lose 20lbs and lower your cholesterol."</em>
      <br>
      The Client asks: <em>"How?"</em>
      <br>
      <strong>You say:</strong> <em>"Let's build a plan to make that happen."</em>
    </p>
  </div>

  <h3 class="font-bold text-gray-900 mb-4">3 Tiers of Collaboration</h3>
  <div class="space-y-4 mb-8">
    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h4 class="font-bold text-gray-900 flex items-center gap-2">
        <span class="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">1</span>
        Parallel Play
      </h4>
      <p class="text-sm text-gray-600 mt-1">You work with the client. The doctor works with the client. You rarely speak, but you respect each other's advice.</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h4 class="font-bold text-gray-900 flex items-center gap-2">
        <span class="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs text-indigo-700">2</span>
        Referral Network
      </h4>
      <p class="text-sm text-gray-600 mt-1">You actively refer clients to specific doctors, and they refer to you. Trust is established.</p>
    </div>
    <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h4 class="font-bold text-gray-900 flex items-center gap-2">
        <span class="w-6 h-6 bg-gold-100 rounded-full flex items-center justify-center text-xs text-gold-700">3</span>
        Integrated Care
      </h4>
      <p class="text-sm text-gray-600 mt-1">You co-manage cases with explicit permission (ROI forms signed). You share notes and progress updates.</p>
    </div>
  </div>

  <h3 class="font-bold text-gray-900 mb-4">How to Introduce Yourself</h3>
  <p class="text-sm text-gray-600 mb-4">Don't just show up. Send a professional "Letter of Introduction" to doctors you want to connect with.</p>

  <div class="bg-gray-50 border border-gray-300 rounded-xl p-5 font-mono text-sm text-gray-700 mb-8">
    <p class="mb-2"><strong>Subject:</strong> Collaborative support for your patient, [Client Name]</p>
    <p class="mb-4">Dear Dr. [Last Name],</p>
    <p class="mb-4">I am writing to introduce myself as the Functional Medicine Health Coach working with your patient, [Client Name].</p>
    <p class="mb-4">My role is to support [Client Name] in implementing the lifestyle and dietary modifications necessary to achieve the health goals you have established together. I do not diagnose or prescribe; my focus is on adherence, behavior change, and sustainable habit formation.</p>
    <p class="mb-4">I have attached a signed Release of Information form from the patient.</p>
    <p>Sincerely,<br>[Your Name]<br>Certified FM Health Coach</p>
  </div>

  <div class="bg-red-50 border border-red-200 rounded-xl p-5">
    <h3 class="font-bold text-red-900 mb-2">The Golden Rule of Collaboration</h3>
    <p class="text-sm text-red-800">
      <strong>NEVER</strong> contradict a doctor's medical advice to a client.
      <br>If you disagree, ask the client: <em>"Have you shared your concerns about this medication with your doctor?"</em>
      <br>Empower them to have the conversation. Don't have it for them.
    </p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 5: Marketing Without Crossing Lines",
        readTime: "18 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">📢</span>
    </div>
    <div>
      <p class="text-sm text-purple-600 font-medium">Chapter 5</p>
      <h2 class="text-xl font-bold text-gray-900">Marketing Without Crossing Lines</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    Marketing in health is different from marketing any other product. You aren't just selling a result; you are making implied promises about a person's biology. The FTCA (Federal Trade Commission) cares very much about what you say.
  </p>

  <h3 class="font-bold text-gray-900 mb-4">The Red Light vs. Green Light Framework</h3>
  <div class="grid md:grid-cols-2 gap-6 mb-8">
    <div class="bg-red-50 border-t-4 border-red-500 rounded-xl p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">🛑</span>
        <h4 class="font-bold text-red-900">RED LIGHT (Forbidden)</h4>
      </div>
      <p class="text-xs text-red-700 mb-3 font-semibold uppercase tracking-wide">Do not use these words:</p>
      <ul class="space-y-2 text-sm text-gray-700">
        <li>• "Cure" / "Heal" / "Treat"</li>
        <li>• "Fix your [Disease]"</li>
        <li>• "Stop taking medications"</li>
        <li>• "Medical protocol"</li>
        <li>• "Prescription"</li>
      </ul>
      <div class="mt-4 bg-white bg-opacity-50 p-2 rounded text-xs text-red-800 italic">
        "I can cure your Hashimoto's in 90 days." <br>(This is illegal practicing of medicine.)
      </div>
    </div>

    <div class="bg-green-50 border-t-4 border-green-500 rounded-xl p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xl">🟢</span>
        <h4 class="font-bold text-green-900">GREEN LIGHT (Safe)</h4>
      </div>
      <p class="text-xs text-green-700 mb-3 font-semibold uppercase tracking-wide">Use these instead:</p>
      <ul class="space-y-2 text-sm text-gray-700">
        <li>• "Support" / "Optimize"</li>
        <li>• "Balance" / "Nourish"</li>
        <li>• "Lifestyle strategies"</li>
        <li>• "Wellness plan"</li>
        <li>• "Work with your doctor"</li>
      </ul>
      <div class="mt-4 bg-white bg-opacity-50 p-2 rounded text-xs text-green-800 italic">
        "I help you optimize your lifestyle to support thyroid health." <br>(This is safe and accurate.)
      </div>
    </div>
  </div>

  <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-yellow-900 mb-2">The Testimonial Trap</h3>
    <p class="text-sm text-gray-700 mb-2">
      You are responsible for what your clients say on your website.
    </p>
    <p class="text-sm text-gray-700">
      If a client writes: <em>"Jane CURED my diabetes!"</em> and you use that testimonial, YOU are making that claim.
    </p>
    <div class="mt-3 bg-white p-3 rounded-lg border border-yellow-100 text-sm">
      <span class="font-bold text-gray-900">The Fix:</span> Edit for compliance (with permission) or use a disclaimer.
      <br><em>"Jane helped me manage my lifestyle, and my A1C dropped by 2 points!"</em> (Better).
    </div>
  </div>

  <h3 class="font-bold text-gray-900 mb-4">Required Disclaimers</h3>
  <div class="space-y-3 mb-8">
    <div class="flex gap-3 items-start">
      <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
      <div>
        <h4 class="font-bold text-gray-800 text-sm">Website Footer</h4>
        <p class="text-xs text-gray-600">"Information presented is for educational purposes only and is not intended to diagnose, treat, or cure any disease."</p>
      </div>
    </div>
    <div class="flex gap-3 items-start">
      <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
      <div>
        <h4 class="font-bold text-gray-800 text-sm">Social Media Bio</h4>
        <p class="text-xs text-gray-600">"Health Coach (Not a Doctor). Tips are for education only."</p>
      </div>
    </div>
    <div class="flex gap-3 items-start">
      <div class="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
      <div>
        <h4 class="font-bold text-gray-800 text-sm">Client Agreement</h4>
        <p class="text-xs text-gray-600">Must be initialed: "I understand [Coach Name] is not a physician and I should consult my doctor..."</p>
      </div>
    </div>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 6: Liability & Insurance",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🛡️</span>
    </div>
    <div>
      <p class="text-sm text-blue-600 font-medium">Chapter 6</p>
      <h2 class="text-xl font-bold text-gray-900">Liability & Insurance</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-8">
    Hoping nothing goes wrong is not a business strategy. You need a shield. Here are the three layers of protection every practitioner must have.
  </p>

  <div class="space-y-6 mb-8">
    <!-- Layer 1 -->
    <div class="bg-white border-l-4 border-blue-500 rounded-xl p-5 shadow-sm">
      <h3 class="font-bold text-gray-900 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded uppercase">Layer 1</span>
        Scope Awareness
      </h3>
      <p class="text-sm text-gray-600 mt-2 mb-3">
        The best defense is never crossing the line in the first place. If you never diagnose or prescribe, it is very hard to sue you for malpractice (because you weren't practicing medicine).
      </p>
      <div class="bg-blue-50 p-2 rounded text-xs text-blue-800">
        <strong>Action:</strong> Review "The Golden Rules" (Chapter 3) monthly.
      </div>
    </div>

    <!-- Layer 2 -->
    <div class="bg-white border-l-4 border-blue-500 rounded-xl p-5 shadow-sm">
      <h3 class="font-bold text-gray-900 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded uppercase">Layer 2</span>
        Legal Documents
      </h3>
      <p class="text-sm text-gray-600 mt-2 mb-3">
        Your Client Agreement must include an "Informed Consent" and "Liability Waiver."
      </p>
      <ul class="text-xs text-gray-700 space-y-1 ml-2">
        <li>• Explicitly states you are not a doctor.</li>
        <li>• Client assumes responsibility for their own health decisions.</li>
        <li>• Refund and cancellation policies (prevents money disputes).</li>
      </ul>
    </div>

    <!-- Layer 3 -->
    <div class="bg-white border-l-4 border-blue-500 rounded-xl p-5 shadow-sm">
      <h3 class="font-bold text-gray-900 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded uppercase">Layer 3</span>
        Insurance
      </h3>
      <p class="text-sm text-gray-600 mt-2 mb-3">
        You need <strong>Professional Liability Insurance</strong> (often called "Errors & Omissions").
      </p>
      <div class="grid grid-cols-2 gap-4 mt-2">
        <div class="bg-gray-50 p-3 rounded-lg">
          <p class="font-bold text-gray-800 text-xs">General Liability</p>
          <p class="text-xs text-gray-500">"Slip and fall." (If you have an office).</p>
        </div>
        <div class="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p class="font-bold text-blue-800 text-xs">Professional Liability</p>
          <p class="text-xs text-blue-600 italic">"You gave me advice that hurt me." (Must have).</p>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-red-50 border border-red-200 rounded-xl p-5">
    <h3 class="font-bold text-red-900 mb-2">Scenario: "I feel worse..."</h3>
    <p class="text-sm text-gray-700 mb-2">
      A client calls and says: <em>"I took that supplement you mentioned and now I feel dizzy. What should I do?"</em>
    </p>
    <p class="text-sm font-bold text-red-800 mb-2">DO NOT ADVISE THEM ON WHAT TO DO.</p>
    <div class="bg-white p-3 rounded text-sm text-gray-800 italic border border-red-100">
      "I'm so sorry you're not feeling well. Because I am not a doctor, I cannot determine if this is a reaction. <strong>Please stop taking it immediately and call your primary care physician or go to urgent care to be safe.</strong>"
    </div>
    <p class="text-xs text-gray-500 mt-2">Then document this conversation immediately.</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 7: The Ethics of Sales",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🪙</span>
    </div>
    <div>
      <p class="text-sm text-green-600 font-medium">Chapter 7</p>
      <h2 class="text-xl font-bold text-gray-900">The Ethics of Sales</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    Sales is not a dirty word. Sales is simply an invitation to transformation. But in health, we are dealing with vulnerable people. That requires a higher standard of ethics.
  </p>

  <h3 class="font-bold text-gray-900 mb-4">The "Pressure Test"</h3>
  <div class="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
    <div class="grid grid-cols-2 text-center">
      <div class="bg-red-50 p-4 border-r border-gray-100">
        <h4 class="font-bold text-red-800 text-sm mb-2">Manipulation</h4>
        <ul class="text-xs text-gray-600 space-y-2 text-left">
          <li>• Agitating pain to create fear</li>
          <li>• "This is your last chance" (fake scarcity)</li>
          <li>• "If you cared about your health, you'd buy"</li>
        </ul>
      </div>
      <div class="bg-green-50 p-4">
        <h4 class="font-bold text-green-800 text-sm mb-2">Ethical Enrollment</h4>
        <ul class="text-xs text-gray-600 space-y-2 text-left">
          <li>• Highlighting the gap between current/desired state</li>
          <li>• Genuine scarcity (only 3 spots)</li>
          <li>• "This is a choice for your future self"</li>
        </ul>
      </div>
    </div>
  </div>

  <h3 class="font-bold text-gray-900 mb-4">The Fit Call Framework</h3>
  <p class="text-sm text-gray-600 mb-4">
    Ethical sales means <strong>disqualifying</strong> people who aren't a good fit.
  </p>
  <div class="space-y-3 mb-8">
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span class="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
      <div>
        <p class="text-sm font-bold text-gray-900">Medical Necessity</p>
        <p class="text-xs text-gray-500">Do they need a doctor right now instead of a coach? If yes, refer out.</p>
      </div>
    </div>
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span class="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
      <div>
        <p class="text-sm font-bold text-gray-900">Financial Safety</p>
        <p class="text-xs text-gray-500">Will paying you cause them immediate harm (e.g., miss rent)? Don't take their money.</p>
      </div>
    </div>
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <span class="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
      <div>
        <p class="text-sm font-bold text-gray-900">Readiness</p>
        <p class="text-xs text-gray-500">Are they looking for a "magic pill" or are they ready to do the work?</p>
      </div>
    </div>
  </div>

  <div class="bg-green-100 rounded-xl p-5 text-center">
    <p class="font-bold text-green-900 mb-2">Transparent Pricing Pledge</p>
    <p class="text-sm text-green-800">
      "I will always be clear about the total investment. No hidden fees. No comprehensive 'supplement protocols' required to start that I didn't mention."
    </p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 8: Maintaining Scope & Conclusion",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🏆</span>
    </div>
    <div>
      <p class="text-sm text-gold-600 font-medium">Chapter 8</p>
      <h2 class="text-xl font-bold text-gray-900">Staying Safe & Moving Forward</h2>
    </div>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    Ethics isn't a one-time test. It's a daily practice. As you grow, the temptation to "play doctor" will actually increase because you'll know more.
  </p>

  <div class="bg-white border-2 border-gray-100 rounded-2xl p-6 mb-8">
    <h3 class="font-bold text-gray-900 mb-4">The "Expert Trap" Warning Signs</h3>
    <ul class="space-y-3 text-sm text-gray-600">
      <li class="flex items-start gap-3">
        <span class="text-red-500 font-bold">⚠️</span>
        <span>You start saying "You definitely have parasites" instead of "That sounds like it could be..."</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-red-500 font-bold">⚠️</span>
        <span>You feel annoyed when clients question your "protocols."</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="text-red-500 font-bold">⚠️</span>
        <span>You stop referring people out because "I can fix this."</span>
      </li>
    </ul>
    <div class="mt-4 bg-gray-50 p-3 rounded-lg text-center text-xs font-bold text-gray-500 uppercase tracking-wide">
      Diagnosis: Ego. Prescription: Humility.
    </div>
  </div>

  <h3 class="font-bold text-gray-900 mb-4">Your Maintenance Plan</h3>
  <div class="grid grid-cols-2 gap-4 mb-8">
    <div class="bg-blue-50 p-4 rounded-xl text-center">
      <div class="text-2xl mb-2">📚</div>
      <h4 class="font-bold text-blue-900 text-sm">Continuing Ed</h4>
      <p class="text-xs text-blue-700">Commit to 1 scope-related training per year.</p>
    </div>
    <div class="bg-purple-50 p-4 rounded-xl text-center">
      <div class="text-2xl mb-2">👥</div>
      <h4 class="font-bold text-purple-900 text-sm">Peer Supervision</h4>
      <p class="text-xs text-purple-700">Have a mentor you can ask "Is this in scope?"</p>
    </div>
  </div>

  <!-- Conclusion -->
  <div class="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white rounded-2xl p-8 text-center relative overflow-hidden">
    <div class="relative z-10">
      <h3 class="text-2xl font-bold text-gold-400 mb-4">Your Ethics Are Your Brand</h3>
      <p class="text-burgundy-100 text-lg mb-6 leading-relaxed">
        Being a "safe" practitioner doesn't make you weak. It makes you <strong>trusted</strong>.
        <br><br>
        Doctors will refer to you because they trust you won't undermine them.
        <br>Clients will trust you because you don't promise fake cures.
        <br>You will trust <em>yourself</em> because you are building on a solid foundation.
      </p>
      <div class="inline-block border-2 border-gold-400 px-6 py-2 rounded-full font-bold text-gold-400 tracking-wider">
        GO CHANGE LIVES
      </div>
    </div>
    <!-- Decorative Circle -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Scope of Practice & Ethics Guide</span>
  </div>
</div>`
      }, ,
    ]
  },
  {
    id: "your-first-client-overview",
    title: "Your First Client (Overview Edition)",
    subtitle: "A Sneak Peek at Landing Your First Paying Client",
    description: "Get a taste of what it takes to attract, convert, and serve your first paying client. This lite overview gives you the framework—the full guide is unlocked when you're ready to take action.",
    valueProp: "Your first client is closer than you think—here's the roadmap.",
    author: "AccrediPro Academy",
    pages: 24,
    icon: "🎯",
    category: "core",
    topics: ["Client Acquisition", "First Steps", "Confidence Building", "Action Plan"],
    readTime: "45 min",
    unlockedDate: "2024-12-10",
    isFree: true,
    unlockCondition: "Challenge Day 3 or Day 5",
    chapters: [
      {
        title: "Introduction: Your First Client is Waiting",
        readTime: "5 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- AccrediPro Logo Header -->
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-burgundy-600 to-burgundy-800 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-burgundy-600 tracking-wider uppercase">AccrediPro Academy</p>
      <p class="text-xs text-gray-500">Overview Edition</p>
    </div>
  </div>

  <!-- Opening Message -->
  <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8">
    <p class="text-xl font-semibold text-emerald-800 italic">
      "The hardest part isn't getting good at what you do—it's getting started."
    </p>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    You've completed your training. You know the theory. But there's a gap between <strong>knowing</strong> and <strong>doing</strong>.
  </p>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    This overview is your first step across that gap. We're going to show you the exact path to your first paying client—no fluff, no theory, just actionable steps.
  </p>

  <!-- What's Inside Box -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">🎯</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">What's In This Overview</h3>
    </div>
    <ul class="space-y-3">
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">1</span>
        </span>
        <span>The <strong class="text-gold-300">3-Step Framework</strong> for finding clients</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">2</span>
        </span>
        <span>The <strong class="text-gold-300">#1 mindset shift</strong> that changes everything</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-burgundy-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">3</span>
        </span>
        <span>Your <strong class="text-gold-300">7-Day Action Plan</strong> to get started</span>
      </li>
    </ul>
  </div>

  <!-- Reality Check -->
  <div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span class="text-2xl">💡</span>
      </div>
      <div>
        <p class="font-semibold text-gray-900 mb-2">This is an Overview Edition</p>
        <p class="text-gray-600">
          This lite version gives you the core framework. The full "Your First Client" guide with scripts, templates, and deep-dive strategies is available in the Professional Library.
        </p>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
    <p class="text-white text-lg font-medium">
      Ready to meet your first client? Let's build your foundation.
    </p>
    <p class="text-emerald-100 text-sm mt-2">Click "Next" to learn the 3-Step Framework →</p>
  </div>
</div>`
      },
      {
        title: "Chapter 1: The 3-Step Framework",
        readTime: "8 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🏗️</span>
    </div>
    <div>
      <p class="text-sm text-emerald-600 font-medium">Chapter 1</p>
      <h2 class="text-xl font-bold text-gray-900">The 3-Step Framework</h2>
    </div>
  </div>

  <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-gray-900 mb-2">The Simple Truth</h3>
    <p class="text-sm text-gray-600 mb-4">
      Forget "funnels" and "scaling" for now. Your first client doesn't come from a perfect website or expensive ads.
    </p>
    <div class="bg-white p-3 rounded-lg border border-gray-200 text-center font-bold text-emerald-800">
      Your first client comes from: <span class="text-gold-600">CONVERSATIONS</span>.
    </div>
  </div>

  <h3 class="font-bold text-gray-900 mb-4">The Framework</h3>
  <div class="space-y-4 mb-8">
    <!-- Step 1 -->
    <div class="flex gap-4">
      <div class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">1</div>
      <div>
        <h4 class="font-bold text-emerald-900">Visibility</h4>
        <p class="text-sm text-gray-600 mb-2">People can't hire you if they don't know you exist.</p>
        <div class="bg-emerald-50 p-3 rounded-lg text-xs list-disc list-inside text-emerald-800">
          <li>Update your bio</li>
          <li>Tell 10 people this week</li>
          <li>Add to email signature</li>
        </div>
      </div>
    </div>

    <!-- Step 2 -->
    <div class="flex gap-4">
      <div class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">2</div>
      <div>
        <h4 class="font-bold text-emerald-900">Value</h4>
        <p class="text-sm text-gray-600 mb-2">Give value BEFORE asking for anything. Build trust first.</p>
        <div class="bg-emerald-50 p-3 rounded-lg text-xs list-disc list-inside text-emerald-800">
          <li>Share helpful tips</li>
          <li>Answer questions in groups</li>
          <li>Be genuinely helpful</li>
        </div>
      </div>
    </div>

    <!-- Step 3 -->
    <div class="flex gap-4">
      <div class="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">3</div>
      <div>
        <h4 class="font-bold text-emerald-900">Invitation</h4>
        <p class="text-sm text-gray-600 mb-2">Don't wait to be found. Invite people in.</p>
        <div class="bg-white border-l-4 border-gold-400 pl-3 py-2 italic text-sm text-gray-700">
          "Hey, I've started working with clients on [Issue]. If you know anyone struggling with [Symptom], I'd love to help. Feel free to pass along my info."
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-5 text-center text-white">
    <p class="font-bold text-lg">Visibility + Value + Invitation = Clients</p>
    <p class="text-emerald-100 text-xs mt-1">Skip one step, and you'll struggle. Do all three, and success is inevitable.</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Your First Client</span>
  </div>
</div>`
      },
      {
        title: "Chapter 2: The Mindset Shift",
        readTime: "6 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🧠</span>
    </div>
    <div>
      <p class="text-sm text-indigo-600 font-medium">Chapter 2</p>
      <h2 class="text-xl font-bold text-gray-900">The Mindset Shift</h2>
    </div>
  </div>

  <p class="text-gray-700 text-sm mb-6">
    The #1 thing holding you back isn't your website—it's the thought: <span class="italic font-semibold text-indigo-700">"Who am I to help someone?"</span>
  </p>

  <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-indigo-900 mb-4">The Reframe</h3>
    <div class="space-y-4">
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <div class="text-right text-gray-500 italic">"I'm not ready."</div>
        <div class="text-center font-bold text-indigo-400">→</div>
        <div class="font-bold text-indigo-900">"Someone needs what I know right now."</div>
      </div>
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <div class="text-right text-gray-500 italic">"What if I mess up?"</div>
        <div class="text-center font-bold text-indigo-400">→</div>
        <div class="font-bold text-indigo-900">"What if I help them change their life?"</div>
      </div>
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <div class="text-right text-gray-500 italic">"I need more training."</div>
        <div class="text-center font-bold text-indigo-400">→</div>
        <div class="font-bold text-indigo-900">"I need more practice (clients)."</div>
      </div>
    </div>
  </div>

  <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
    <h3 class="font-bold text-amber-900 mb-2">The Truth About Expertise</h3>
    <p class="text-sm text-amber-800">
      Your clients don't need a guru. They need someone a few steps ahead who genuinely cares. <span class="font-bold">That's you.</span>
    </p>
  </div>

  <div class="space-y-2 text-sm text-gray-700 px-4">
    <p class="font-bold mb-2">Your first client needs you to:</p>
    <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Listen and care</li>
    <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Apply what you've learned</li>
    <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Be honest about your scope</li>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Your First Client</span>
  </div>
</div>`
      },
      {
        title: "Chapter 3: Your 7-Day Action Plan",
        readTime: "7 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">⚡</span>
    </div>
    <div>
      <p class="text-sm text-gold-600 font-medium">Chapter 3</p>
      <h2 class="text-xl font-bold text-gray-900">Your 7-Day Action Plan</h2>
    </div>
  </div>

  <p class="text-gray-600 text-sm mb-6">Let's build momentum. This week is about opening doors.</p>

  <div class="space-y-4 mb-8">
    <!-- Day 1-2 -->
    <div class="border-l-4 border-emerald-500 pl-4 py-1">
      <h4 class="font-bold text-gray-900">Day 1: Declare It</h4>
      <p class="text-xs text-gray-500 mb-1">Tell the world (and 3 specific people) you are open for business.</p>
      <div class="bg-gray-100 inline-block px-2 py-1 rounded text-xs text-gray-700 italic">"I'm now taking clients for..."</div>
    </div>
    <div class="border-l-4 border-emerald-500 pl-4 py-1">
      <h4 class="font-bold text-gray-900">Day 2: Plant Seeds</h4>
      <p class="text-xs text-gray-500 mb-1">Message your network.</p>
      <div class="bg-gray-100 inline-block px-2 py-1 rounded text-xs text-gray-700 italic">"If you hear of anyone struggling with X..."</div>
    </div>
    <!-- Day 3-4 -->
    <div class="border-l-4 border-emerald-500 pl-4 py-1">
      <h4 class="font-bold text-gray-900">Day 3: Add Value</h4>
      <p class="text-xs text-gray-500 mb-1">Answer a question or share a tip publicly.</p>
    </div>
    <div class="border-l-4 border-emerald-500 pl-4 py-1">
      <h4 class="font-bold text-gray-900">Day 4: Show Your Face</h4>
      <p class="text-xs text-gray-500 mb-1">Video or photo of YOU. People buy from people.</p>
    </div>
    <!-- Day 5-6 -->
    <div class="border-l-4 border-emerald-500 pl-4 py-1">
      <h4 class="font-bold text-gray-900">Day 5: Follow Up</h4>
      <p class="text-xs text-gray-500 mb-1">Re-engage Day 2 people. "Just following up..."</p>
    </div>
    <div class="border-l-4 border-emerald-500 pl-4 py-1">
      <h4 class="font-bold text-gray-900">Day 6: Make an Offer</h4>
      <p class="text-xs text-gray-500 mb-1">"I have 3 spots open for..."</p>
    </div>
    <!-- Day 7 -->
    <div class="border-l-4 border-gold-500 pl-4 py-1">
      <h4 class="font-bold text-gray-900">Day 7: Reflect & Repeat</h4>
      <p class="text-xs text-gray-500 mb-1">What worked? Keep going.</p>
    </div>
  </div>

  <div class="bg-burgundy-50 border border-burgundy-100 rounded-xl p-5 mb-8 text-center">
    <h3 class="font-bold text-burgundy-900 mb-2">Ready for the Full Guide?</h3>
    <p class="text-sm text-burgundy-800 mb-4">
      This overview gave you the start. The full guide includes word-for-word scripts, templates, and advanced strategies.
    </p>
    <div class="inline-block bg-burgundy-600 text-white px-4 py-2 rounded-lg text-sm font-bold opacity-50 cursor-not-allowed">
      Unlock Full Guide
    </div>
    <p class="text-xs text-gray-400 mt-2">Available in Professional Library</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Your First Client</span>
  </div>
</div>`
      },
    ]
  },
  // FLAGSHIP FREE GUIDE - $5K/Month Realistic Guide
  {
    id: "5k-month-realistic-guide",
    title: "The $5K/Month Realistic Guide",
    subtitle: "Your First Clients Without Social Media Overwhelm",
    description: "The step-by-step roadmap to earning $5,000/month as a health practitioner—without needing a huge following, fancy website, or expensive ads. Built for beginners who want real results.",
    valueProp: "What if 5 clients/month could change your life?",
    author: "AccrediPro Academy",
    pages: 78,
    icon: "💰",
    category: "core",
    topics: ["Income Strategy", "Client Acquisition", "Pricing", "Action Plan"],
    readTime: "3-4 hours",
    unlockedDate: "2024-12-13",
    isFree: true,
    unlockCondition: "Challenge Completion or Mini Diploma Graduate",
    chapters: [
      {
        title: "Introduction: Why $5K is the Magic Number",
        readTime: "8 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- AccrediPro Logo Header -->
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-emerald-600 tracking-wider uppercase">AccrediPro Academy</p>
      <p class="text-xs text-gray-500">Flagship FREE Guide</p>
    </div>
  </div>

  <!-- Opening Message -->
  <div class="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-600 p-6 rounded-r-xl mb-8">
    <p class="text-xl font-semibold text-emerald-800 italic">
      "What if just 5 clients per month could change your entire life?"
    </p>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    This isn't a "scale to 6 figures" hustle guide. This is the <strong>realistic, step-by-step path</strong> to your first $5,000/month as a health practitioner.
  </p>

  <!-- Why $5K Box -->
  <div class="bg-emerald-900 text-white rounded-2xl p-6 mb-8">
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 bg-gold-400 rounded-xl flex items-center justify-center">
        <span class="text-xl">💰</span>
      </div>
      <h3 class="text-lg font-bold text-gold-400">Why $5,000/Month?</h3>
    </div>
    <ul class="space-y-3">
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It's <strong class="text-gold-300">achievable</strong> with just 4-6 clients</span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It replaces most <strong class="text-gold-300">full-time jobs</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It proves your <strong class="text-gold-300">business works</strong></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="w-6 h-6 bg-emerald-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <span class="text-gold-400 text-sm">✓</span>
        </span>
        <span>It's the <strong class="text-gold-300">foundation</strong> for everything bigger</span>
      </li>
    </ul>
  </div>

  <!-- The Math -->
  <div class="bg-white border-2 border-emerald-200 rounded-2xl p-6 mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
      <span class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">📊</span>
      The Simple Math
    </h3>
    <div class="grid grid-cols-2 gap-4 text-center">
      <div class="bg-emerald-50 rounded-xl p-4">
        <p class="text-3xl font-bold text-emerald-700">5</p>
        <p class="text-sm text-gray-600">Clients per month</p>
      </div>
      <div class="bg-emerald-50 rounded-xl p-4">
        <p class="text-3xl font-bold text-emerald-700">$1,000</p>
        <p class="text-sm text-gray-600">Per client package</p>
      </div>
    </div>
    <div class="mt-4 text-center p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white">
      <p class="text-2xl font-bold">= $5,000/month</p>
      <p class="text-sm text-emerald-100">That's it. No complicated funnels.</p>
    </div>
  </div>

  <!-- What's Inside -->
  <div class="mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4">What You'll Learn in This Guide:</h3>
    <div class="grid gap-3">
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">The <strong>exact pricing formula</strong> for $1,000+ packages</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">Where your first 5 clients are <strong>already hiding</strong></span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">How to <strong>close consultations</strong> without being salesy</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
        <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <span class="text-gray-700">The <strong>30-day action plan</strong> to hit $5K</span>
      </div>
    </div>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-center">
    <p class="text-white text-lg font-medium">
      Ready to build your $5K/month foundation?
    </p>
    <p class="text-emerald-100 text-sm mt-2">Click "Next" to start with the mindset shift →</p>
  </div>
</div>`
      },
      {
        title: "Chapter 1: The Mindset Shift — Stop Thinking Like an Employee",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🧠</span>
    </div>
    <div>
      <p class="text-sm text-emerald-600 font-medium">Chapter 1</p>
      <h2 class="text-xl font-bold text-gray-900">The Mindset Shift</h2>
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-4 mb-8">
    <div class="bg-red-50 border border-red-200 rounded-xl p-5">
      <h3 class="font-bold text-red-800 mb-2">Employee Mindset</h3>
      <ul class="space-y-2 text-sm text-red-700">
        <li>• Trades time for money</li>
        <li>• Waits for opportunities</li>
        <li>• Needs "permission"</li>
        <li>• Undervalues expertise</li>
      </ul>
    </div>
    <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
      <h3 class="font-bold text-emerald-800 mb-2">Practitioner Mindset</h3>
      <ul class="space-y-2 text-sm text-emerald-700">
        <li>• Sells transformation</li>
        <li>• Creates opportunities</li>
        <li>• Gives themselves permission</li>
        <li>• Values their impact</li>
      </ul>
    </div>
  </div>

  <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-gray-900 mb-2">Reframe: Service, Not Sales</h3>
    <div class="space-y-4">
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <div class="text-right text-gray-500 italic">"I feel guilty charging."</div>
        <div class="text-center font-bold text-emerald-400">→</div>
        <div class="font-bold text-emerald-900">"If I help them, charging is service."</div>
      </div>
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
        <div class="text-right text-gray-500 italic">"What if they can't afford it?"</div>
        <div class="text-center font-bold text-emerald-400">→</div>
        <div class="font-bold text-emerald-900">"My ideal clients can."</div>
      </div>
    </div>
  </div>

  <div class="bg-emerald-900 text-white rounded-xl p-6 text-center">
    <p class="font-serif italic text-lg opacity-90">"I help people transform their health. That transformation is valuable. Charging for it is an act of service."</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 2: The Math Behind $5K (It's Simpler Than You Think)",
        readTime: "8 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🧮</span>
    </div>
    <div>
      <p class="text-sm text-green-600 font-medium">Chapter 2</p>
      <h2 class="text-xl font-bold text-gray-900">The Math Behind $5K</h2>
    </div>
  </div>

  <div class="mb-8">
    <p class="text-gray-600 mb-4 text-sm">Which path looks more sustainable to you?</p>
    <div class="space-y-3">
      <div class="bg-red-50 p-4 rounded-xl border border-red-100 flex justify-between items-center opacity-70">
        <span class="font-medium text-red-800">50 clients × $100</span>
        <span class="font-bold text-red-900">= Burnout ($5,000)</span>
      </div>
      <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex justify-between items-center shadow-sm transform scale-105">
        <span class="font-bold text-emerald-800">5 clients × $1,000</span>
        <span class="font-bold text-emerald-900">= Freedom ($5,000)</span>
      </div>
    </div>
  </div>

  <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-gray-900 mb-3">The $1,000 Package Breakdown</h3>
    <ul class="space-y-2 text-sm text-gray-700">
      <li class="flex justify-between"><span>Initial 90-min Consultation</span> <span class="text-gray-400">$300 value</span></li>
      <li class="flex justify-between"><span>6 Follow-up Sessions</span> <span class="text-gray-400">$600 value</span></li>
      <li class="flex justify-between"><span>Custom Protocols</span> <span class="text-gray-400">$200 value</span></li>
      <li class="flex justify-between"><span>Email Support</span> <span class="text-gray-400">$200 value</span></li>
      <li class="flex justify-between border-t border-gray-200 pt-2 font-bold text-emerald-700">
        <span>Total Value: $1,500+</span>
        <span class="text-emerald-900">Your Price: $997</span>
      </li>
    </ul>
  </div>

  <div class="bg-emerald-100 rounded-xl p-5 text-center">
    <p class="font-bold text-emerald-900 mb-2">Think about it:</p>
    <p class="text-sm text-emerald-800">You only need to find <span class="font-bold underline">one client per week</span> (plus one more) to hit $5,000/month.</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 3: Finding Clients in Your Existing Network",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🔍</span>
    </div>
    <div>
      <p class="text-sm text-indigo-600 font-medium">Chapter 3</p>
      <h2 class="text-xl font-bold text-gray-900">Finding Clients Nearby</h2>
    </div>
  </div>

  <div class="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-xl mb-8">
    <p class="text-indigo-900 font-medium italic">"Your first 5 clients are probably people who already know you exist."</p>
  </div>

  <div class="space-y-6 mb-8">
    <div>
      <h3 class="font-bold text-gray-900 mb-2">The Warm Outreach Script</h3>
      <div class="bg-gray-100 p-4 rounded-xl text-sm text-gray-700 italic border border-gray-200">
        "Hey [Name]! I'm officially taking clients now for [specialty]. I remembered you mentioned struggling with [issue] a while back. If that's still going on, I'd love to chat and see if I can help. No pressure either way—just wanted you to know I'm here!"
      </div>
    </div>
    <div>
      <h3 class="font-bold text-gray-900 mb-2">The Referral Ask</h3>
      <div class="bg-gray-100 p-4 rounded-xl text-sm text-gray-700 italic border border-gray-200">
        "Hey [Name]! I'm now helping people with [issue]. Do you know anyone who might be struggling with this? I'd really appreciate any introductions—and they'd get a free consultation to see if we're a good fit."
      </div>
    </div>
  </div>

  <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <h3 class="font-bold text-gray-900 mb-3">Action Steps This Week</h3>
    <ul class="space-y-2 text-sm text-gray-600">
      <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Make your "warm list" (20+ people)</li>
      <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Send 5 genuine outreach messages</li>
      <li class="flex items-center gap-2"><span class="text-green-500">✓</span> Ask 3 people for referrals</li>
    </ul>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 4: The Discovery Call That Converts",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">📞</span>
    </div>
    <div>
      <p class="text-sm text-purple-600 font-medium">Chapter 4</p>
      <h2 class="text-xl font-bold text-gray-900">The Discovery Call</h2>
    </div>
  </div>

  <div class="bg-gray-50 p-4 rounded-xl mb-8 text-center">
    <p class="text-sm text-gray-600"><span class="font-bold text-red-500">STOP</span> giving away free consultations.</p>
    <p class="text-sm text-gray-600">This calls is to determine fit, not to treat.</p>
  </div>

  <div class="space-y-4 mb-8">
    <div class="flex gap-4">
      <div class="w-20 font-bold text-purple-800 text-xs text-right mt-1">Min 0-2</div>
      <div class="border-l-2 border-purple-200 pl-4 pb-4">
        <h4 class="font-bold text-gray-900 text-sm">Rapport</h4>
        <p class="text-xs text-gray-500">"How are you doing today?"</p>
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-20 font-bold text-purple-800 text-xs text-right mt-1">Min 2-7</div>
      <div class="border-l-2 border-purple-200 pl-4 pb-4">
        <h4 class="font-bold text-gray-900 text-sm">Understand Situation</h4>
        <p class="text-xs text-gray-500">"Tell me what's going on... How long has this been happening?"</p>
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-20 font-bold text-purple-800 text-xs text-right mt-1">Min 7-12</div>
      <div class="border-l-2 border-purple-200 pl-4 pb-4">
        <h4 class="font-bold text-gray-900 text-sm">Paint the Future</h4>
        <p class="text-xs text-gray-500">"What would change in your life if this was resolved?"</p>
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-20 font-bold text-purple-800 text-xs text-right mt-1">Min 12-17</div>
      <div class="border-l-2 border-purple-200 pl-4 pb-4">
        <h4 class="font-bold text-gray-900 text-sm">Share Approach</h4>
        <p class="text-xs text-gray-500">"Based on what you shared, here's how I work..."</p>
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-20 font-bold text-purple-800 text-xs text-right mt-1">Min 17-20</div>
      <div class="border-l-2 border-purple-200 pl-4">
        <h4 class="font-bold text-gray-900 text-sm">Invitation</h4>
        <p class="text-xs text-gray-500">"Would you like to move forward?"</p>
      </div>
    </div>
  </div>

  <div class="bg-purple-50 rounded-xl p-5 border border-purple-100">
    <h3 class="font-bold text-purple-900 text-sm mb-2">Handling "How Much?"</h3>
    <p class="text-sm text-purple-800 italic">"The investment for my 3-month program is $997. This includes [benefits]. Many clients find that finally solving this issue is worth far more. Does that feel like it could work for you?"</p>
    <p class="text-xs text-purple-500 mt-2 font-bold uppercase">Then stop talking.</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 5: Your $1,000+ Package Structure",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-gold-100 to-gold-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">📦</span>
    </div>
    <div>
      <p class="text-sm text-gold-600 font-medium">Chapter 5</p>
      <h2 class="text-xl font-bold text-gray-900">Your Package Structure</h2>
    </div>
  </div>

  <div class="bg-gray-800 text-white rounded-xl p-6 mb-8 shadow-lg">
    <h3 class="font-serif text-xl text-gold-400 mb-4 text-center">The Foundation Program</h3>
    <div class="space-y-3 text-sm">
      <div class="flex items-center gap-3">
        <span class="text-gold-400">✓</span> 90-minute initial consultation
      </div>
      <div class="flex items-center gap-3">
        <span class="text-gold-400">✓</span> 6 bi-weekly follow-up sessions
      </div>
      <div class="flex items-center gap-3">
        <span class="text-gold-400">✓</span> Custom nutrition & lifestyle protocol
      </div>
      <div class="flex items-center gap-3">
        <span class="text-gold-400">✓</span> Email support between sessions
      </div>
      <div class="flex items-center gap-3">
        <span class="text-gold-400">✓</span> Supplement recommendations
      </div>
    </div>
    <div class="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
      <span class="text-gray-400 text-xs">Investment</span>
      <span class="text-2xl font-bold text-white">$997</span>
    </div>
  </div>

  <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
    <h3 class="font-bold text-gray-900 mb-2">Why Packages Win</h3>
    <ul class="space-y-2 text-sm text-gray-600">
      <li>• <span class="font-bold text-red-500">Single Sessions:</span> Attract price-shoppers, inconsistent income, partial results.</li>
      <li>• <span class="font-bold text-green-600">Packages:</span> Attract committed clients, predictable income, real transformation.</li>
    </ul>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 6: Simple Marketing Without Social Media Overwhelm",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">📢</span>
    </div>
    <div>
      <p class="text-sm text-pink-600 font-medium">Chapter 6</p>
      <h2 class="text-xl font-bold text-gray-900">Simple Marketing</h2>
    </div>
  </div>

  <div class="mb-8">
    <p class="text-gray-600 text-sm mb-4">You don't need millions of followers. You need <span class="font-bold text-pink-600">visibility</span> with the right <span class="font-bold text-pink-600">hundreds</span>.</p>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
        <h4 class="font-bold text-gray-900">Education</h4>
        <p class="text-xs text-gray-500">Tips, myth-busting</p>
      </div>
      <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
        <h4 class="font-bold text-gray-900">Story</h4>
        <p class="text-xs text-gray-500">Your journey, wins</p>
      </div>
      <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
        <h4 class="font-bold text-gray-900">Engagement</h4>
        <p class="text-xs text-gray-500">Polls, questions</p>
      </div>
      <div class="bg-pink-50 p-3 rounded-lg border border-pink-200 text-center">
        <h4 class="font-bold text-pink-900">Offer</h4>
        <p class="text-xs text-pink-700">"I have 3 spots open"</p>
      </div>
    </div>
  </div>

  <div class="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
    <h3 class="font-bold text-gray-900 mb-3">The 30-Minute Daily Routine</h3>
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <div class="w-16 text-xs font-bold text-gray-400 text-right">0-10 min</div>
        <div class="flex-1 bg-gray-50 p-2 rounded text-sm text-gray-700">Create one piece of content</div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-16 text-xs font-bold text-gray-400 text-right">10-20 min</div>
        <div class="flex-1 bg-gray-50 p-2 rounded text-sm text-gray-700">Engage (comment, reply)</div>
      </div>
      <div class="flex items-center gap-3">
        <div class="w-16 text-xs font-bold text-gray-400 text-right">20-30 min</div>
        <div class="flex-1 bg-pink-50 text-pink-800 font-medium p-2 rounded text-sm">Direct Outreach (DMs)</div>
      </div>
    </div>
  </div>

  <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">
    <h3 class="font-bold text-gray-900 mb-2">Bio Audit</h3>
    <p class="text-sm text-gray-600 mb-2">Does your bio answer:</p>
    <ul class="text-xs text-gray-500 space-y-1">
      <li>1. Who do you help?</li>
      <li>2. What transformation do you provide?</li>
      <li>3. How do they take the next step?</li>
    </ul>
    <div class="mt-3 bg-white p-3 rounded border border-gray-200 text-xs italic text-gray-600">
      "Helping busy moms beat exhaustion... DM 'ENERGY' for free assessment"
    </div>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 7: Building Your Minimum Viable Practice",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🛠️</span>
    </div>
    <div>
      <p class="text-sm text-gray-600 font-medium">Chapter 7</p>
      <h2 class="text-xl font-bold text-gray-900">Minimum Viable Practice</h2>
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-6 mb-8">
    <div>
      <h3 class="font-bold text-red-800 mb-3 flex items-center gap-2"><span class="bg-red-100 p-1 rounded">✗</span> You DON'T Need</h3>
      <ul class="space-y-2 text-sm text-gray-600">
        <li>• Fancy Website</li>
        <li>• Logo / Branding</li>
        <li>• Office Space</li>
        <li>• Expensive Software</li>
        <li>• LLC (yet)</li>
      </ul>
    </div>
    <div>
      <h3 class="font-bold text-green-800 mb-3 flex items-center gap-2"><span class="bg-green-100 p-1 rounded">✓</span> You DO Need</h3>
      <ul class="space-y-2 text-sm text-gray-600">
        <li>• Booking Link (Calendly)</li>
        <li>• Video Call (Zoom)</li>
        <li>• Payment (Stripe)</li>
        <li>• Docs (Google Drive)</li>
        <li>• Intake Form</li>
      </ul>
    </div>
  </div>

  <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-blue-900 mb-2">The $0 Tech Stack</h3>
    <div class="grid grid-cols-2 gap-2 text-sm">
      <div class="text-gray-600">Scheduling:</div><div class="font-medium text-blue-800">Calendly (Free)</div>
      <div class="text-gray-600">Video:</div><div class="font-medium text-blue-800">Zoom (Free)</div>
      <div class="text-gray-600">Payments:</div><div class="font-medium text-blue-800">Stripe / PayPal</div>
      <div class="text-gray-600">Forms:</div><div class="font-medium text-blue-800">Google Forms</div>
    </div>
    <div class="mt-4 pt-3 border-t border-blue-100 text-center font-bold text-blue-900">
      Total Cost: $0
    </div>
  </div>

  <div class="bg-amber-50 rounded-xl p-5 text-center text-sm text-amber-900">
    Start scrappy. Stay scrappy until it matters.Upgrade only when you have revenue.
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 8: The 30-Day Sprint to Your First $5K",
        readTime: "15 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🏃</span>
    </div>
    <div>
      <p class="text-sm text-orange-600 font-medium">Chapter 8</p>
      <h2 class="text-xl font-bold text-gray-900">30-Day Sprint</h2>
    </div>
  </div>

  <div class="space-y-6">
    <!-- Week 1 -->
    <div class="border-l-4 border-orange-200 pl-4">
      <h3 class="font-bold text-gray-900">Week 1: Foundation</h3>
      <p class="text-xs text-gray-500 mb-2">Days 1-7</p>
      <ul class="text-sm text-gray-600 space-y-1">
        <li>□ Define niche & price</li>
        <li>□ Set up Calendly & Stripe</li>
        <li>□ Build "warm list" (30+ people)</li>
        <li>□ Send 10 outreach messages</li>
      </ul>
    </div>

    <!-- Week 2 -->
    <div class="border-l-4 border-orange-300 pl-4">
      <h3 class="font-bold text-gray-900">Week 2: Momentum</h3>
      <p class="text-xs text-gray-500 mb-2">Days 8-14</p>
      <ul class="text-sm text-gray-600 space-y-1">
        <li>□ Daily: 1 Post, 3 Outreach</li>
        <li>□ Follow up with previous convos</li>
        <li>□ <span class="font-bold text-orange-600">Goal:</span> 3-5 Discovery Calls Booked</li>
      </ul>
    </div>

    <!-- Week 3 -->
    <div class="border-l-4 border-orange-400 pl-4">
      <h3 class="font-bold text-gray-900">Week 3: Conversion</h3>
      <p class="text-xs text-gray-500 mb-2">Days 15-21</p>
      <ul class="text-sm text-gray-600 space-y-1">
        <li>□ Conduct discovery calls</li>
        <li>□ Ask for referrals from everyone</li>
        <li>□ <span class="font-bold text-orange-600">Goal:</span> 1-2 Clients Enrolled</li>
      </ul>
    </div>

    <!-- Week 4 -->
    <div class="border-l-4 border-orange-500 pl-4">
      <h3 class="font-bold text-gray-900">Week 4: Expansion</h3>
      <p class="text-xs text-gray-500 mb-2">Days 22-30</p>
      <ul class="text-sm text-gray-600 space-y-1">
        <li>□ Deliver excellence to new clients</li>
        <li>□ Expand outreach to 2nd degree</li>
        <li>□ <span class="font-bold text-orange-600">Goal:</span> 2-3 More Clients Enrolled</li>
      </ul>
    </div>
  </div>

  <div class="mt-8 bg-gray-900 text-white p-5 rounded-xl text-center">
    <p class="font-bold mb-2">The Daily Non-Negotiables</p>
    <div class="flex justify-center gap-4 text-xs opacity-80">
      <span>1. Visibility (Post/Story)</span>
      <span>2. Outreach (3x)</span>
      <span>3. Follow-up</span>
    </div>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 9: Handling Objections Like a Pro",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🛡️</span>
    </div>
    <div>
      <p class="text-sm text-red-600 font-medium">Chapter 9</p>
      <h2 class="text-xl font-bold text-gray-900">Handling Objections</h2>
    </div>
  </div>

  <div class="bg-red-50 p-4 rounded-xl text-center mb-8">
    <p class="text-red-900 font-medium">"I'm interested, but I have a concern."</p>
    <p class="text-xs text-red-700 mt-1">Objections are not rejection. They are requests for clarity.</p>
  </div>

  <div class="space-y-4 mb-8">
    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-3 font-bold text-gray-900 text-sm">"I need to think about it."</div>
      <div class="p-4 bg-white text-sm text-gray-600">
        "Of course—it's a big decision. <span class="font-bold text-gray-900">What specifically would you like to think about?</span> Sometimes I can help clarify right here."
      </div>
    </div>

    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-3 font-bold text-gray-900 text-sm">"It's too expensive."</div>
      <div class="p-4 bg-white text-sm text-gray-600">
        "I hear you. <span class="font-bold text-gray-900">What have you already spent trying to solve this issue?</span> My program is designed to actually resolve this, not just patch it."
      </div>
    </div>

    <div class="border border-gray-200 rounded-xl overflow-hidden">
      <div class="bg-gray-50 p-3 font-bold text-gray-900 text-sm">"I don't have time."</div>
      <div class="p-4 bg-white text-sm text-gray-600">
        "The sessions are just 45 minutes bi-weekly. The real question is: <span class="font-bold text-gray-900">can you afford NOT to address this?</span>"
      </div>
    </div>
  </div>

  <div class="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
    <h3 class="font-bold text-emerald-900 text-sm mb-2">The Golden Rule</h3>
    <p class="text-sm text-emerald-800">Never push. Never beg. Provide information, make it easy to say yes, but be okay if they say no.</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 10: Creating Referral Momentum",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🤝</span>
    </div>
    <div>
      <p class="text-sm text-cyan-600 font-medium">Chapter 10</p>
      <h2 class="text-xl font-bold text-gray-900">Referral Momentum</h2>
    </div>
  </div>

  <div class="bg-white border border-gray-200 p-5 rounded-xl text-center shadow-sm mb-8">
    <h3 class="font-bold text-gray-900 mb-2">The Difference</h3>
    <div class="flex justify-center gap-8 text-sm">
      <div class="opacity-50">
        <p>New Practitioner</p>
        <p class="font-bold">Hustles for every lead</p>
      </div>
      <div>
        <p class="text-cyan-600">Established</p>
        <p class="font-bold">Gets Referrals</p>
      </div>
    </div>
  </div>

  <div class="space-y-4 mb-8">
    <div>
      <h4 class="font-bold text-gray-900 text-sm mb-2">Asking Clients (When they're happy)</h4>
      <div class="bg-cyan-50 p-3 rounded-lg text-sm text-cyan-900 italic">
        "I love working with you! Do you know anyone else struggling with similar issues? I have one spot opening up..."
      </div>
    </div>
    <div>
      <h4 class="font-bold text-gray-900 text-sm mb-2">Asking Network</h4>
      <div class="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic">
        "If you know anyone struggling with [issue], I'd appreciate you passing along my info. They'd get a free consultation."
      </div>
    </div>
  </div>

  <div class="bg-gray-900 text-white p-5 rounded-xl">
    <h3 class="font-bold mb-3">The Referral Flywheel</h3>
    <div class="space-y-2 text-xs opacity-80">
      <p>Month 1: 5 clients (Outreach) → 2 Referrals</p>
      <p>Month 2: 3 Outreach + 2 Referrals = 5 Clients → 3 Referrals</p>
      <p>Month 3: 2 Outreach + 3 Referrals = 5 Clients → 4 Referrals</p>
    </div>
    <p class="mt-4 font-bold text-cyan-400">Eventually, your practice grows itself.</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 11: What to Do When It's Not Working",
        readTime: "12 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🔧</span>
    </div>
    <div>
      <p class="text-sm text-yellow-600 font-medium">Chapter 11</p>
      <h2 class="text-xl font-bold text-gray-900">Troubleshooting</h2>
    </div>
  </div>

  <div class="space-y-6 mb-8">
    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-3">
        <span class="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">!</span>
        Problem: Not enough calls
      </h3>
      <div class="bg-gray-50 p-3 rounded-lg mb-2 text-sm">
        <span class="font-bold text-gray-700">Check:</span> Are you telling people what you do? Outreach volume?
      </div>
      <div class="bg-green-50 p-3 rounded-lg text-sm">
        <span class="font-bold text-green-800">Fix:</span> Double outreach volume. Clarify niche.
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-3">
        <span class="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">!</span>
        Problem: Calls not converting
      </h3>
      <div class="bg-gray-50 p-3 rounded-lg mb-2 text-sm">
        <span class="font-bold text-gray-700">Check:</span> Talking too much? Giving free advice?
      </div>
      <div class="bg-green-50 p-3 rounded-lg text-sm">
        <span class="font-bold text-green-800">Fix:</span> Let them talk 70%. Focus on transformation.
      </div>
    </div>

    <div class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <h3 class="font-bold text-gray-900 flex items-center gap-2 mb-3">
        <span class="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs">!</span>
        Problem: "Too expensive"
      </h3>
      <div class="bg-gray-50 p-3 rounded-lg mb-2 text-sm">
        <span class="font-bold text-gray-700">Check:</span> Leading with price or value?
      </div>
      <div class="bg-green-50 p-3 rounded-lg text-sm">
        <span class="font-bold text-green-800">Fix:</span> Paint the "after" picture first. Offer payment plans.
      </div>
    </div>
  </div>

  <div class="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-xl">
    <h3 class="font-bold text-indigo-900 mb-2">Volume vs. Skill</h3>
    <p class="text-sm text-indigo-800">Usually it's a <span class="font-bold">Volume Issue</span> (do more). Sometimes it's a <span class="font-bold">Skill Issue</span> (learn more). Be honest about which one it is.</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 12: From $5K to $10K and Beyond",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">🚀</span>
    </div>
    <div>
      <p class="text-sm text-purple-600 font-medium">Chapter 12</p>
      <h2 class="text-xl font-bold text-gray-900">Scaling to $10k</h2>
    </div>
  </div>

  <div class="mb-8">
    <h3 class="font-bold text-gray-900 mb-4">3 Paths to $10k</h3>
    <div class="grid gap-3">
      <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 class="font-bold text-gray-800 text-sm">1. More Clients</h4>
        <p class="text-xs text-gray-500">10 clients × $1,000</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 class="font-bold text-gray-800 text-sm">2. Higher Price</h4>
        <p class="text-xs text-gray-500">5 clients × $2,000</p>
      </div>
      <div class="bg-purple-50 p-4 rounded-xl border border-purple-200">
        <h4 class="font-bold text-purple-900 text-sm">3. The Mix (Recommended)</h4>
        <p class="text-xs text-purple-700">7 clients × $1,400</p>
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6 mb-8">
    <h3 class="font-bold text-gold-400 mb-4">The Compound Effect</h3>
    <div class="space-y-3 text-sm">
      <div class="flex justify-between items-center border-b border-gray-700 pb-2">
        <span>Year 1 ($5k/mo)</span>
        <span class="font-mono text-gold-400">$60,000</span>
      </div>
      <div class="flex justify-between items-center border-b border-gray-700 pb-2">
        <span>Year 2 ($8k/mo)</span>
        <span class="font-mono text-gold-400">$96,000</span>
      </div>
      <div class="flex justify-between items-center border-b border-gray-700 pb-2">
        <span>Year 3 ($10k/mo)</span>
        <span class="font-mono text-gold-400">$120,000</span>
      </div>
    </div>
  </div>

  <div class="text-center p-5 bg-yellow-50 rounded-xl border border-yellow-200 text-sm text-yellow-800">
    <span class="font-bold">Warning:</span> Master $5k before chasing $10k. Consistency builds the foundation.
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 13: Your Money Mindset Check",
        readTime: "8 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">💭</span>
    </div>
    <div>
      <p class="text-sm text-teal-600 font-medium">Chapter 13</p>
      <h2 class="text-xl font-bold text-gray-900">Money Mindset</h2>
    </div>
  </div>

  <div class="space-y-4 mb-8">
    <div class="bg-red-50 p-4 rounded-xl border-l-4 border-red-400">
      <p class="text-xs text-red-500 font-bold uppercase mb-1">Block</p>
      <p class="text-red-900 text-sm italic">"I feel guilty charging."</p>
      <div class="mt-2 text-emerald-700 text-sm font-bold bg-white p-2 rounded shadow-sm">
        Reframe: "My fee funds my ability to serve."
      </div>
    </div>
    <div class="bg-red-50 p-4 rounded-xl border-l-4 border-red-400">
      <p class="text-xs text-red-500 font-bold uppercase mb-1">Block</p>
      <p class="text-red-900 text-sm italic">"Who would pay ME?"</p>
      <div class="mt-2 text-emerald-700 text-sm font-bold bg-white p-2 rounded shadow-sm">
        Reframe: "My clients pay for results, which I deliver."
      </div>
    </div>
  </div>

  <div class="bg-emerald-900 text-white p-6 rounded-xl text-center shadow-xl">
    <h3 class="text-emerald-300 uppercase tracking-widest text-xs font-bold mb-4">Daily Affirmations</h3>
    <div class="space-y-3 font-serif italic text-lg opacity-90">
      <p>"I deserve to be compensated for my expertise."</p>
      <p>"Money flows to me easily as I serve."</p>
      <p>"Charging well IS an act of service."</p>
    </div>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 14: Week-by-Week Implementation Calendar",
        readTime: "10 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">📅</span>
    </div>
    <div>
      <p class="text-sm text-blue-600 font-medium">Chapter 14</p>
      <h2 class="text-xl font-bold text-gray-900">8-Week Roadmap</h2>
    </div>
  </div>

  <div class="space-y-4 mb-8">
    <div class="flex gap-4">
      <div class="w-16 flex-shrink-0 text-right pt-1">
        <span class="block font-bold text-gray-900">Week 1</span>
        <span class="text-xs text-gray-500">Setup</span>
      </div>
      <div class="flex-1 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
        Niche, Package, Calendly, Stripe, Forms
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-16 flex-shrink-0 text-right pt-1">
        <span class="block font-bold text-gray-900">Week 2</span>
        <span class="text-xs text-gray-500">Outreach</span>
      </div>
      <div class="flex-1 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
        Warm list (50 sent), Social announcement
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-16 flex-shrink-0 text-right pt-1">
        <span class="block font-bold text-gray-900">Week 3</span>
        <span class="text-xs text-gray-500">Sales</span>
      </div>
      <div class="flex-1 bg-purple-50 rounded-lg p-3 text-sm text-purple-800 border border-purple-100 font-medium">
        5+ Discovery Calls, 1-2 Clients Enrolled
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-16 flex-shrink-0 text-right pt-1">
        <span class="block font-bold text-gray-900">Week 4-6</span>
        <span class="text-xs text-gray-500">Growth</span>
      </div>
      <div class="flex-1 bg-gray-50 rounded-lg p-3 text-sm text-gray-600 border border-gray-100">
        Deliver sessions, Ask referrals, expand outreach
      </div>
    </div>
    <div class="flex gap-4">
      <div class="w-16 flex-shrink-0 text-right pt-1">
        <span class="block font-bold text-gray-900">Week 7-8</span>
        <span class="text-xs text-gray-500">Scale</span>
      </div>
      <div class="flex-1 bg-emerald-50 rounded-lg p-3 text-sm text-emerald-800 border border-emerald-100 font-bold">
        Hit $5,000/month run rate!
      </div>
    </div>
  </div>

  <div class="bg-blue-600 text-white p-5 rounded-xl text-center">
    <h3 class="font-bold mb-2">Daily Checklist (Weeks 2-8)</h3>
    <div class="flex justify-center gap-6 text-sm">
      <div class="flex flex-col items-center">
        <span class="text-xl">✉️</span>
        <span class="mt-1">3 Outreach</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-xl">📝</span>
        <span class="mt-1">1 Post</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-xl">💬</span>
        <span class="mt-1">20min Engage</span>
      </div>
    </div>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • $5K/Month Guide</span>
  </div>
</div>`
      },
      {
        title: "Chapter 15: Your First Day Starts Now",
        readTime: "6 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Celebration Header -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center mb-8">
    <div class="text-5xl mb-4">🎉</div>
    <h2 class="text-2xl font-bold mb-2">You Made It!</h2>
    <p class="text-emerald-100">You now have everything you need to hit $5K/month.</p>
  </div>

  <!-- Recap Box -->
  <div class="bg-white border-2 border-emerald-200 rounded-2xl p-6 mb-8">
    <h3 class="text-xl font-bold text-gray-900 mb-4">Quick Recap: What You Learned</h3>
    <div class="space-y-3">
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">1</span>
        <span class="text-gray-700">The mindset shift from employee to practitioner</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">2</span>
        <span class="text-gray-700">The simple math: 5 clients × $1,000 = $5K</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">3</span>
        <span class="text-gray-700">Finding clients in your existing network</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">4</span>
        <span class="text-gray-700">The discovery call framework that converts</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">5</span>
        <span class="text-gray-700">Creating and pricing your transformation package</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">6</span>
        <span class="text-gray-700">Simple marketing without overwhelm</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">7</span>
        <span class="text-gray-700">Building your minimum viable practice</span>
      </div>
      <div class="flex items-center gap-3">
        <span class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">8</span>
        <span class="text-gray-700">The 30-day sprint to your first $5K</span>
      </div>
    </div>
  </div>

  <!-- The Truth -->
  <div class="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl mb-8">
    <h3 class="font-bold text-gray-900 mb-2">The Truth About Success</h3>
    <p class="text-gray-700">
      The difference between practitioners who hit $5K/month and those who don't isn't talent.
      It isn't credentials. It isn't luck.
    </p>
    <p class="text-gray-700 mt-2">
      <strong>It's action.</strong> Consistent, imperfect, persistent action.
    </p>
  </div>

  <!-- Your Commitment -->
  <div class="bg-burgundy-900 text-white rounded-2xl p-6 mb-8">
    <h3 class="text-lg font-bold text-gold-400 mb-4">Your Commitment</h3>
    <p class="text-burgundy-100 mb-4">Say this out loud:</p>
    <p class="text-xl italic text-white">
      "I commit to taking action every day for the next 30 days.
      I will reach out. I will show up. I will serve.
      I will hit $5K/month because I refuse to give up."
    </p>
  </div>

  <!-- Day 1 Actions -->
  <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
    <h3 class="text-lg font-bold text-emerald-800 mb-4">🚀 Your Day 1 Actions</h3>
    <div class="space-y-3">
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Tell ONE person what you do now</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Set up your Calendly booking link</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Write your "who I help" statement</span>
      </div>
      <div class="flex items-center gap-3 p-3 bg-white rounded-lg">
        <div class="w-6 h-6 border-2 border-emerald-500 rounded flex items-center justify-center flex-shrink-0">
          <span class="text-emerald-600 text-xs">□</span>
        </div>
        <span class="text-gray-700">Decide your package price: $______</span>
      </div>
    </div>
  </div>

  <!-- Final Message -->
  <div class="text-center mb-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-4">Your First Client is Waiting</h3>
    <p class="text-lg text-gray-600 mb-6">
      They're out there right now, struggling with the exact thing you can help with.
      They just don't know you exist yet.
    </p>
    <p class="text-lg text-gray-600">
      Go find them.
    </p>
  </div>

  <!-- CTA -->
  <div class="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-center">
    <p class="text-2xl font-bold text-white mb-2">
      $5K/month starts today.
    </p>
    <p class="text-emerald-100">
      You've got this. Now go make it happen. 💪
    </p>
  </div>

  <!-- Footer -->
  <div class="mt-8 pt-6 border-t border-gray-100 text-center">
    <p class="text-sm text-gray-500">
      Made with 💚 by AccrediPro Academy
    </p>
    <p class="text-xs text-gray-400 mt-2">
      Questions? We're here to help. Keep going!
    </p>
  </div>
</div>`
      }
    ]
  },
  // FM Practitioner Decision Guide - unlocked from Challenge enrollment
  {
    id: "fm-practitioner-decision-guide",
    title: "FM Practitioner Decision Guide",
    subtitle: "Is Functional Medicine Coaching Right for You?",
    description: "A comprehensive guide to help you decide if functional medicine coaching is the right career path. Includes self-assessment, realistic timelines, investment breakdown, and success stories.",
    valueProp: "Make a confident decision about your FM career path.",
    author: "AccrediPro Academy",
    pages: 8,
    icon: "📋",
    category: "core",
    topics: ["Self-Assessment", "Career Path", "Investment Planning", "Success Stories"],
    readTime: "15 min",
    unlockedDate: "",
    isFree: true,
    unlockCondition: "Challenge Enrollment",
    // isApiUnlocked: true, // Commented out to ensure visibility for now
    chapters: [
      {
        title: "Is FM Coaching Right for Me?",
        readTime: "5 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-blue-600 tracking-wider uppercase">Decision Guide</p>
    </div>
  </div>

  <h2 class="text-2xl font-bold text-gray-900 mb-4">Self-Assessment Quiz</h2>
  <p class="text-gray-700 mb-6">Answer these 5 questions honestly to see if FM coaching is right for you:</p>

  <div class="space-y-4">
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">1. Are you passionate about health and helping others?</p>
      <p class="text-sm text-blue-700">If you find yourself constantly researching health topics and sharing what you learn, this is a strong indicator.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">2. Are you willing to invest time in learning before earning?</p>
      <p class="text-sm text-blue-700">The first 3-6 months require focused learning and practice before consistent income.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">3. Can you commit to ongoing education?</p>
      <p class="text-sm text-blue-700">Functional medicine evolves. Successful practitioners never stop learning.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">4. Do you have basic business sense (or willingness to learn)?</p>
      <p class="text-sm text-blue-700">Running a practice requires marketing, sales, and client management skills.</p>
    </div>
    <div class="bg-blue-50 rounded-xl p-4 border border-blue-200">
      <p class="font-semibold text-blue-800 mb-2">5. Can you handle rejection and slow starts?</p>
      <p class="text-sm text-blue-700">Not everyone says yes. Building a practice takes patience and persistence.</p>
    </div>
  </div>

  <div class="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
    <p class="font-bold text-green-800 mb-2">If you answered YES to 4+ questions:</p>
    <p class="text-green-700">You have strong potential for success in FM coaching!</p>
  </div>
</div>`
      },
      {
        title: "5 Signs You're Ready to Start",
        readTime: "5 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">✨</span>
    </div>
    <div>
      <p class="text-sm text-blue-600 font-medium">Chapter 1</p>
      <h2 class="text-xl font-bold text-gray-900">5 Signs You're Ready</h2>
    </div>
  </div>

  <div class="space-y-4 mb-8">
    <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
      <div>
        <h4 class="font-bold text-gray-900">You've Transformed Your Own Health</h4>
        <p class="text-sm text-gray-600">You understand the power of functional medicine because you've lived it.</p>
      </div>
    </div>
    <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
      <div>
        <h4 class="font-bold text-gray-900">You're Tired of Your Current Path</h4>
        <p class="text-sm text-gray-600">That restlessness isn't boredom—it's a sign you're ready for more meaningful work.</p>
      </div>
    </div>
    <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
      <div>
        <h4 class="font-bold text-gray-900">You Keep Talking About Health</h4>
        <p class="text-sm text-gray-600">Friends already come to you for advice. You're naturally drawn to this.</p>
      </div>
    </div>
    <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</div>
      <div>
        <h4 class="font-bold text-gray-900">You've Done Your Research</h4>
        <p class="text-sm text-gray-600">You're not just dreaming; you're looking at facts. That shows commitment.</p>
      </div>
    </div>
    <div class="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">5</div>
      <div>
        <h4 class="font-bold text-gray-900">You Feel Called to Serve</h4>
        <p class="text-sm text-gray-600">It's deeper than money. You want to help people change their lives.</p>
      </div>
    </div>
  </div>

  <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-xl">
    <h3 class="font-bold text-blue-900 mb-4">The Realistic Timeline</h3>
    <div class="relative pl-6 space-y-6 border-l-2 border-blue-200 ml-2">
      <div class="relative">
        <span class="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></span>
        <h4 class="font-bold text-gray-900 text-sm">Months 1-3: Learning</h4>
        <p class="text-xs text-gray-600">Training, systems setup, practice practice practice.</p>
      </div>
      <div class="relative">
        <span class="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></span>
        <h4 class="font-bold text-gray-900 text-sm">Months 4-6: First Clients</h4>
        <p class="text-xs text-gray-600">Your first 2-5 paying clients. Building confidence.</p>
      </div>
      <div class="relative">
        <span class="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></span>
        <h4 class="font-bold text-gray-900 text-sm">Months 7-12: Momentum</h4>
        <p class="text-xs text-gray-600">Referrals start. Income stabilizes.</p>
      </div>
      <div class="relative">
        <span class="absolute -left-[31px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></span>
        <h4 class="font-bold text-gray-900 text-sm">Year 2+: Scale</h4>
        <p class="text-xs text-gray-600">Full-time income ($60k-120k+). Specialization.</p>
      </div>
    </div>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Decision Guide</span>
  </div>
</div>`
      },
      {
        title: "Investment & Earning Potential",
        readTime: "5 min",
        isHtml: true,
        content: `<div class="ebook-content">
  <!-- Chapter Header -->
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
      <span class="text-2xl">💰</span>
    </div>
    <div>
      <p class="text-sm text-green-600 font-medium">Chapter 2</p>
      <h2 class="text-xl font-bold text-gray-900">Investment & Earning Potential</h2>
    </div>
  </div>

  <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
    <h3 class="font-bold text-gray-900 mb-4">Investment Breakdown</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-800 text-sm mb-2">Education</h4>
        <ul class="space-y-1 text-xs text-gray-600">
          <li>• Core Certification: $997-$1,997</li>
          <li>• Specializations: $497+</li>
          <li>• Continuing Ed: ~$300/yr</li>
        </ul>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <h4 class="font-bold text-gray-800 text-sm mb-2">Business Setup</h4>
        <ul class="space-y-1 text-xs text-gray-600">
          <li>• Website: $0-$500</li>
          <li>• Software: $20-$100/mo</li>
          <li>• Marketing: $0 initially</li>
        </ul>
      </div>
    </div>
    <div class="mt-4 text-center">
      <span class="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-bold">Total Year 1 Investment: $1,500 - $4,000</span>
    </div>
  </div>

  <div class="mb-8">
    <h3 class="font-bold text-gray-900 mb-4">Earning Potential</h3>
    <div class="space-y-3">
      <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
        <div>
          <p class="font-bold text-green-900 text-sm">Part-Time (10-15 clients)</p>
          <p class="text-xs text-green-700">Months 7-12</p>
        </div>
        <p class="font-bold text-green-800">$3k - $5k <span class="text-xs font-normal">/mo</span></p>
      </div>
      <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
        <div>
          <p class="font-bold text-green-900 text-sm">Full-Time (25+ clients)</p>
          <p class="text-xs text-green-700">Year 2</p>
        </div>
        <p class="font-bold text-green-800">$8k - $15k <span class="text-xs font-normal">/mo</span></p>
      </div>
    </div>
  </div>

  <div class="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-5 text-white">
    <h3 class="font-bold text-lg mb-2">ROI Reality Check</h3>
    <p class="text-sm opacity-90 mb-2">Most practitioners recoup their entire certification investment within 3-6 months.</p>
    <p class="text-xs opacity-75 italic">"Investing in yourself pays the highest dividends."</p>
  </div>

  <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
    <span>AccrediPro Academy • Decision Guide</span>
  </div>
</div>`
      },
    ]
  },
  // FM Income Calculator - Interactive Tool
  {
    id: "fm-income-calculator",
    title: "FM Income Calculator",
    subtitle: "Calculate Your Earning Potential",
    description: "See what you could earn as a Functional Medicine Practitioner. Customize your work schedule, pricing tier, and program model to calculate your monthly and annual income potential.",
    valueProp: "Discover your earning potential in minutes.",
    author: "AccrediPro Academy",
    pages: 1,
    icon: "💰",
    category: "fm-free",
    topics: ["Income Planning", "Business Model", "Pricing Strategy"],
    readTime: "5 min",
    unlockedDate: "2024-12-01",
    isFree: true,
    unlockCondition: "Mini Diploma Graduate",
    chapters: [
      {
        title: "FM Income Calculator",
        readTime: "Interactive",
        isHtml: true,
        content: `<div class="ebook-content">
  <div class="flex justify-center mb-8">
    <div class="text-center">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      </div>
      <p class="text-sm font-semibold text-green-600 tracking-wider uppercase">AccrediPro Tool</p>
      <p class="text-xs text-gray-500">Interactive Income Calculator</p>
    </div>
  </div>

  <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-xl mb-8">
    <p class="text-xl font-semibold text-green-800 italic">
      "See your potential income as a Functional Medicine Practitioner"
    </p>
  </div>

  <p class="text-lg text-gray-700 leading-relaxed mb-6">
    Use this interactive calculator to see what you could earn based on your preferred work schedule and pricing model.
  </p>

  <div class="my-8">
    <iframe
      src="/resources/FM_Income_Calculator.html"
      width="100%"
      height="900px"
      style="border: none; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.1);"
      title="FM Income Calculator"
    ></iframe>
  </div>

  <div class="bg-gold-50 border border-gold-200 rounded-xl p-6 mt-8">
    <h3 class="text-lg font-bold text-burgundy-800 mb-3">💡 Ready to Make This Your Reality?</h3>
    <p class="text-gray-700 mb-4">
      The numbers you just calculated are based on real practitioner data. To start building toward this income, explore our full Functional Medicine Certification program.
    </p>
    <a href="/courses/functional-medicine-complete-certification" class="inline-flex items-center gap-2 bg-burgundy-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-burgundy-700 transition-colors">
      Explore Full Certification →
    </a>
  </div>
</div>`
      },
    ]
  },
  // NOTE: Purchasable ebooks are in the Professional Library (/ebooks)
  // My Library only shows FREE ebooks (unlocked via progress) + purchased ebooks
];

// Types for progress tracking
interface ReadingProgress {
  [ebookId: string]: {
    currentChapter: number;
    completedChapters: number[];
    lastRead: string;
    started: boolean;
  };
}

export default function MyLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [savedEbooks, setSavedEbooks] = useState<string[]>([]);
  const [readingEbook, setReadingEbook] = useState<typeof MY_EBOOKS[0] | null>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [showTOC, setShowTOC] = useState(false);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress>({});
  const [activeTab, setActiveTab] = useState<"all" | "inprogress" | "completed">("all");
  const [unlockedResources, setUnlockedResources] = useState<string[]>([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedEbook, setCompletedEbook] = useState<typeof MY_EBOOKS[0] | null>(null);

  // Load progress from localStorage and fetch unlocked resources/progress from API
  useEffect(() => {
    const saved = localStorage.getItem("library-saved");
    const localProgress = localStorage.getItem("library-progress");
    if (saved) setSavedEbooks(JSON.parse(saved));
    if (localProgress) setReadingProgress(JSON.parse(localProgress));

    // Fetch unlocked resources and progress from API
    const fetchData = async () => {
      try {
        // Fetch Unlocked Resources
        const resourcesResponse = await fetch("/api/user/library");
        if (resourcesResponse.ok) {
          const data = await resourcesResponse.json();
          if (data.unlockedResources) {
            setUnlockedResources(data.unlockedResources);
          }
        }

        // Fetch Progress
        const progressResponse = await fetch("/api/user/library/progress");
        if (progressResponse.ok) {
          const data = await progressResponse.json();
          if (data.progress) {
            // Merge DB progress with local (DB takes precedence if exists)
            setReadingProgress(prev => {
              const merged = { ...prev };
              Object.entries(data.progress).forEach(([ebookId, remoteProgress]) => {
                // Only override if remote has valid data
                if ((remoteProgress as any)?.completedChapters) {
                  merged[ebookId] = remoteProgress as any;
                }
              });
              return merged;
            });
          }
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      }
    };
    fetchData();
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("library-saved", JSON.stringify(savedEbooks));
  }, [savedEbooks]);

  useEffect(() => {
    localStorage.setItem("library-progress", JSON.stringify(readingProgress));
  }, [readingProgress]);

  const saveProgressToDb = async (ebookId: string, progress: any) => {
    try {
      if (!ebookId || !progress || !Array.isArray(progress.completedChapters)) {
        console.warn("Skipping DB save: invalid payload", { ebookId, progress });
        return;
      }

      const res = await fetch("/api/user/library/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ebookId, progress })
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Failed to save progress to DB:", err);
      } else {
        // console.log("Progress saved successfully for", ebookId);
      }
    } catch (error) {
      console.error("Network error saving progress to DB:", error);
    }
  };

  const toggleSaved = (ebookId: string) => {
    setSavedEbooks(prev =>
      prev.includes(ebookId)
        ? prev.filter(id => id !== ebookId)
        : [...prev, ebookId]
    );
  };

  const markChapterComplete = (ebookId: string, chapterIndex: number) => {
    // Calculate new state based on current readingProgress
    const existing = readingProgress[ebookId] || { currentChapter: 0, completedChapters: [], lastRead: "", started: false };
    const completed = existing.completedChapters.includes(chapterIndex)
      ? existing.completedChapters
      : [...existing.completedChapters, chapterIndex];

    const updatedEbookProgress = {
      ...existing,
      completedChapters: completed,
      lastRead: new Date().toISOString(),
      started: true,
    };

    setReadingProgress(prev => ({
      ...prev,
      [ebookId]: updatedEbookProgress
    }));

    saveProgressToDb(ebookId, updatedEbookProgress);
  };

  const handleNextChapter = (ebookId: string, currentChapterIndex: number, totalChapters: number) => {
    setReadingProgress((prev) => {
      const existing = prev[ebookId] || { currentChapter: 0, completedChapters: [], lastRead: "", started: false };

      // 1. Mark current complete
      const completed = existing.completedChapters.includes(currentChapterIndex)
        ? existing.completedChapters
        : [...existing.completedChapters, currentChapterIndex];

      // 2. Move to next chapter
      const nextIndex = currentChapterIndex + 1;

      const updatedEbookProgress = {
        ...existing,
        completedChapters: completed,
        currentChapter: nextIndex,
        lastRead: new Date().toISOString(),
        started: true,
      };

      // Side effect: Save to DB
      saveProgressToDb(ebookId, updatedEbookProgress);

      return {
        ...prev,
        [ebookId]: updatedEbookProgress
      };
    });

    setCurrentChapter(currentChapterIndex + 1);
  };

  const updateCurrentChapter = (ebookId: string, chapterIndex: number) => {
    const existing = readingProgress[ebookId] || { completedChapters: [], started: false };
    const updatedEbookProgress = {
      ...existing,
      currentChapter: chapterIndex,
      lastRead: new Date().toISOString(),
      started: true,
    };

    setReadingProgress(prev => ({
      ...prev,
      [ebookId]: updatedEbookProgress
    }));
    setCurrentChapter(chapterIndex);

    saveProgressToDb(ebookId, updatedEbookProgress);
  };

  const startReading = (ebook: typeof MY_EBOOKS[0]) => {
    const progress = readingProgress[ebook.id];
    const resumeChapter = progress?.currentChapter || 0;

    // Create updated progress
    const updatedEbookProgress = {
      ...(progress || { completedChapters: [] }),
      currentChapter: resumeChapter,
      lastRead: new Date().toISOString(),
      started: true,
    };

    setReadingEbook(ebook);
    setCurrentChapter(resumeChapter);

    setReadingProgress(prev => ({
      ...prev,
      [ebook.id]: updatedEbookProgress
    }));

    saveProgressToDb(ebook.id, updatedEbookProgress);
  };

  const getEbookProgress = (ebookId: string, totalChapters: number): number => {
    const progress = readingProgress[ebookId];
    if (!progress) return 0;
    return Math.round((progress.completedChapters.length / totalChapters) * 100);
  };

  const isEbookComplete = (ebookId: string, totalChapters: number): boolean => {
    const progress = readingProgress[ebookId];
    if (!progress) return false;
    return progress.completedChapters.length === totalChapters;
  };

  // Filter ebooks - check if API-unlocked ebooks are actually unlocked
  const availableEbooks = MY_EBOOKS.filter(ebook => {
    // If ebook requires API unlock, check if it's in unlockedResources
    if ((ebook as any).isApiUnlocked) {
      return unlockedResources.includes(ebook.id);
    }
    // Otherwise, it's always available (free ebook unlocked by default)
    return true;
  });

  const filteredEbooks = availableEbooks.filter(ebook => {
    const matchesSearch = ebook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ebook.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || ebook.category === selectedCategory;

    if (activeTab === "inprogress") {
      const progress = readingProgress[ebook.id];
      return matchesSearch && matchesCategory && progress?.started && !isEbookComplete(ebook.id, ebook.chapters.length);
    }
    if (activeTab === "completed") {
      return matchesSearch && matchesCategory && isEbookComplete(ebook.id, ebook.chapters.length);
    }
    return matchesSearch && matchesCategory;
  });

  const inProgressCount = availableEbooks.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).length;
  const completedCount = availableEbooks.filter(e => isEbookComplete(e.id, e.chapters.length)).length;
  const totalCount = availableEbooks.length;

  // READING VIEW
  if (readingEbook) {
    const ebookProgress = readingProgress[readingEbook.id] || { completedChapters: [], currentChapter: 0 };
    const isChapterComplete = ebookProgress.completedChapters.includes(currentChapter);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Reading Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => { setReadingEbook(null); setCurrentChapter(0); setShowTOC(false); }}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
                </Button>
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-2xl">{readingEbook.icon}</span>
                  <div>
                    <h1 className="font-bold text-gray-900">{readingEbook.title}</h1>
                    <p className="text-sm text-gray-500">
                      {ebookProgress.completedChapters.length} of {readingEbook.chapters.length} chapters
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowTOC(!showTOC)}>
                  <List className="w-4 h-4 mr-2" /> Contents
                </Button>

                <Button variant="outline" size="sm" onClick={() => alert("Share link copied!")}>
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              </div>
            </div>
            <div className="mt-3">
              <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-2" />
            </div>
          </div>
        </div>

        {/* TOC Drawer */}
        {showTOC && (
          <div className="fixed inset-0 z-30 bg-black/50" onClick={() => setShowTOC(false)}>
            <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Table of Contents</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowTOC(false)}>✕</Button>
              </div>

              <div className="mb-4">
                <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-3" />
                <p className="text-xs text-gray-400 mt-1">
                  {ebookProgress.completedChapters.length} of {readingEbook.chapters.length} complete
                </p>
              </div>

              <div className="space-y-2">
                {readingEbook.chapters.map((chapter, i) => {
                  if (!chapter) return null;
                  const isComplete = ebookProgress.completedChapters.includes(i);
                  const isCurrent = i === currentChapter;
                  return (
                    <button
                      key={i}
                      onClick={() => { updateCurrentChapter(readingEbook.id, i); setShowTOC(false); }}
                      className={`w-full text-left p-4 rounded-xl transition-all flex items-start gap-3 ${isCurrent ? "bg-burgundy-100 border-2 border-burgundy-300" : "bg-gray-50 hover:bg-gray-100"}`}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {isComplete ? <CheckCircle2 className="w-5 h-5 text-burgundy-500" /> : isCurrent ? <PlayCircle className="w-5 h-5 text-burgundy-600" /> : <Circle className="w-5 h-5 text-gray-300" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${isCurrent ? "text-burgundy-700" : "text-gray-900"}`}>{chapter.title}</p>
                        <p className="text-xs text-gray-500 mt-1"><Clock className="w-3 h-3 inline mr-1" />{chapter.readTime}</p>
                      </div>
                      {isComplete && <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">Done</Badge>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reading Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Chapter Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-28">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Chapters</p>
                <div className="space-y-1">
                  {readingEbook.chapters.map((chapter, i) => {
                    if (!chapter) return null;
                    const isComplete = ebookProgress.completedChapters.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => updateCurrentChapter(readingEbook.id, i)}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${currentChapter === i ? "bg-burgundy-100 text-burgundy-700 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
                      >
                        {isComplete ? <CheckCircle2 className="w-4 h-4 text-burgundy-500" /> : <Circle className="w-4 h-4 text-gray-300" />}
                        <span className="truncate">{chapter.title}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>{getEbookProgress(readingEbook.id, readingEbook.chapters.length)}%</span>
                  </div>
                  <Progress value={getEbookProgress(readingEbook.id, readingEbook.chapters.length)} className="h-2" />
                </div>
              </div>
            </div>

            {/* Reading Area */}
            <div className="flex-1 max-w-3xl">
              <div className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
                <div className="flex items-center justify-between mb-6">
                  <Badge variant="outline">Chapter {currentChapter + 1} of {readingEbook.chapters.length}</Badge>
                  <span className="text-xs text-gray-500"><Clock className="w-3 h-3 inline mr-1" />{readingEbook.chapters[currentChapter]?.readTime}</span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-8">{readingEbook.chapters[currentChapter]?.title}</h2>

                <div className="prose prose-lg max-w-none">
                  {readingEbook.chapters[currentChapter]?.isHtml ? (
                    <div
                      className="ebook-html-content"
                      dangerouslySetInnerHTML={{ __html: readingEbook.chapters[currentChapter]?.content || "" }}
                    />
                  ) : (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                      {readingEbook.chapters[currentChapter]?.content}
                    </p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-8 pt-8 border-t border-gray-100">
                  <Button variant="outline" onClick={() => updateCurrentChapter(readingEbook.id, Math.max(0, currentChapter - 1))} disabled={currentChapter === 0}>
                    <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                  </Button>
                  <Button
                    onClick={() => {
                      if (currentChapter === readingEbook.chapters.length - 1) {
                        markChapterComplete(readingEbook.id, currentChapter);
                        setCompletedEbook(readingEbook);
                        setShowCompletionModal(true);
                      } else {
                        handleNextChapter(readingEbook.id, currentChapter, readingEbook.chapters.length);
                      }
                    }}
                    className="bg-burgundy-600 hover:bg-burgundy-700"
                  >
                    {currentChapter === readingEbook.chapters.length - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Completion Celebration Modal */}
                {showCompletionModal && completedEbook && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowCompletionModal(false)}>
                    {/* Backdrop with blur */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                    {/* Confetti Animation */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(50)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute animate-confetti"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `-10px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 2}s`,
                          }}
                        >
                          <div
                            className="w-3 h-3 rotate-45"
                            style={{
                              backgroundColor: ['#722F37', '#D4AF37', '#E8D4A8', '#4CAF50', '#9C27B0', '#FF6B6B'][Math.floor(Math.random() * 6)],
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Modal Content */}
                    <div
                      className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header with gradient */}
                      <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-300 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Trophy/Badge */}
                        <div className="relative z-10">
                          <div className="inline-flex items-center justify-center w-20 h-20 bg-gold-400 rounded-full shadow-lg mb-4 animate-bounce">
                            <span className="text-4xl">🏆</span>
                          </div>
                          <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
                          <p className="text-gold-200">You've completed</p>
                        </div>
                      </div>

                      {/* Book Info */}
                      <div className="p-6">
                        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-6">
                          <span className="text-4xl">{completedEbook.icon}</span>
                          <div>
                            <h3 className="font-bold text-gray-900">{completedEbook.title}</h3>
                            <p className="text-sm text-gray-500">{completedEbook.chapters.length} chapters completed</p>
                          </div>
                        </div>

                        {/* Badge Earned */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-gold-50 to-amber-50 border border-gold-200 rounded-xl p-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-2xl">📚</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">Knowledge Seeker Badge</p>
                            <p className="text-sm text-gray-500">Added to your achievements</p>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
                        </div>

                        {/* Next Recommended */}
                        {(() => {
                          // Use optional chaining or assertion since we are inside the conditional block
                          if (!completedEbook) return null;
                          const nextEbook = MY_EBOOKS.find(e => e.id !== completedEbook!.id && !isEbookComplete(e.id, e.chapters.length));
                          return nextEbook ? (
                            <div className="bg-burgundy-50 border border-burgundy-100 rounded-xl p-4 mb-6">
                              <p className="text-xs font-semibold text-burgundy-600 uppercase mb-2">Up Next</p>
                              <div
                                className="flex items-center gap-3 cursor-pointer hover:bg-burgundy-100 rounded-lg p-2 -m-2 transition-colors"
                                onClick={() => {
                                  setShowCompletionModal(false);
                                  setReadingEbook(null);
                                  setTimeout(() => {
                                    const ebook = MY_EBOOKS.find(e => e.id === nextEbook.id);
                                    if (ebook) startReading(ebook);
                                  }, 100);
                                }}
                              >
                                <span className="text-2xl">{nextEbook.icon}</span>
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900 text-sm">{nextEbook.title}</p>
                                  <p className="text-xs text-gray-500">{nextEbook.chapters.length} chapters</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-burgundy-400" />
                              </div>
                            </div>
                          ) : null;
                        })()}

                        {/* Share Buttons */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!completedEbook) return;
                              if (navigator.share) {
                                navigator.share({
                                  title: `I completed ${completedEbook!.title}!`,
                                  text: `Just finished reading "${completedEbook!.title}" on AccrediPro Academy! 📚`,
                                  url: window.location.href,
                                });
                              } else {
                                navigator.clipboard.writeText(`Just finished reading "${completedEbook!.title}" on AccrediPro Academy! 📚`);
                                alert('Share text copied to clipboard!');
                              }
                            }}
                            className="flex-1"
                          >
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Achievement
                          </Button>
                        </div>

                        {/* Back to Library */}
                        <Button
                          onClick={() => {
                            setShowCompletionModal(false);
                            setReadingEbook(null);
                            setCurrentChapter(0);
                          }}
                          className="w-full bg-burgundy-600 hover:bg-burgundy-700"
                        >
                          Back to My Library
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LIBRARY VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
      <div className="px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="relative mb-10 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Library className="w-7 h-7 text-gold-400" />
              </div>
              <Badge className="bg-gold-400 text-burgundy-900 border-0 font-semibold">Your Collection</Badge>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">My Library</h1>

            <p className="text-lg text-white/90 max-w-2xl mb-6">
              Your professional books, guides, and reference materials — available as you progress.
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-green-500/20 px-4 py-2 rounded-full border border-green-400/30">
                <Sparkles className="w-4 h-4 text-green-300" /> {totalCount} Resources
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <PlayCircle className="w-4 h-4" /> {inProgressCount} Reading
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4" /> {completedCount} Completed
              </div>
            </div>
          </div>
        </div>

        {/* Continue Reading Section */}
        {inProgressCount > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-burgundy-600" /> Continue Reading
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {availableEbooks.filter(e => readingProgress[e.id]?.started && !isEbookComplete(e.id, e.chapters.length)).map((ebook) => {
                const progress = getEbookProgress(ebook.id, ebook.chapters.length);
                const lastChapter = readingProgress[ebook.id]?.currentChapter || 0;
                return (
                  <div key={ebook.id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => startReading(ebook)}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{ebook.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{ebook.title}</h3>
                        <p className="text-xs text-gray-500">Chapter {lastChapter + 1}</p>
                      </div>
                    </div>
                    <Progress value={progress} className="h-1.5 mb-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{progress}% complete</span>
                      <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 h-7 text-xs">
                        <PlayCircle className="w-3 h-3 mr-1" /> Resume
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setActiveTab("all")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "all" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
            All ({MY_EBOOKS.length})
          </button>
          <button onClick={() => setActiveTab("inprogress")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "inprogress" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
            <PlayCircle className="w-4 h-4 inline mr-1" /> Reading ({inProgressCount})
          </button>
          <button onClick={() => setActiveTab("completed")} className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === "completed" ? "bg-burgundy-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>
            <CheckCircle2 className="w-4 h-4 inline mr-1" /> Completed ({completedCount})
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id ? "bg-burgundy-100 text-burgundy-700 border-2 border-burgundy-300" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-5 rounded-xl border-gray-200"
          />
        </div>

        {/* E-Books Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEbooks.map((ebook) => {
            const progress = getEbookProgress(ebook.id, ebook.chapters.length);
            const isComplete = isEbookComplete(ebook.id, ebook.chapters.length);
            const hasStarted = readingProgress[ebook.id]?.started;

            return (
              <div key={ebook.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all group hover:shadow-lg hover:border-burgundy-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{ebook.icon}</span>
                    <div className="flex items-center gap-2">
                      {ebook.isFree && (
                        <Badge className="bg-green-100 text-green-700 border-0 text-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Graduate Resource
                        </Badge>
                      )}
                      {isComplete && <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">Complete</Badge>}
                      {!isComplete && progress > 0 && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{progress}%</Badge>}
                      <Button variant="ghost" size="sm" onClick={() => toggleSaved(ebook.id)} className={savedEbooks.includes(ebook.id) ? "text-burgundy-600" : "text-gray-400"}>
                        {savedEbooks.includes(ebook.id) ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold mb-1 transition-colors text-gray-900 group-hover:text-burgundy-600">{ebook.title}</h3>
                  <p className="text-sm mb-2 text-burgundy-600">{ebook.subtitle}</p>

                  {/* Unlock Condition Badge */}
                  {ebook.unlockCondition && (
                    <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg border border-green-100">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-xs text-green-700 font-medium">Unlocked: {ebook.unlockCondition}</span>
                    </div>
                  )}

                  {/* Value Prop Blurb */}
                  {ebook.valueProp && (
                    <p className="text-sm font-medium px-3 py-2 rounded-lg mb-3 italic text-amber-700 bg-amber-50">
                      &ldquo;{ebook.valueProp}&rdquo;
                    </p>
                  )}

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ebook.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {ebook.topics.slice(0, 2).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">{topic}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <span><FileText className="w-3 h-3 inline mr-1" />{ebook.chapters.length > 0 ? `${ebook.chapters.length} chapters` : `${ebook.pages} pages`}</span>
                    <span className="mx-2">•</span>
                    <span><Clock className="w-3 h-3 inline mr-1" />{ebook.readTime}</span>
                  </div>

                  {progress > 0 && !isComplete && (
                    <div className="mb-3">
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-burgundy-600 hover:bg-burgundy-700" onClick={() => startReading(ebook)}>
                      {isComplete ? <><BookOpen className="w-4 h-4 mr-2" /> Read Again</> : hasStarted ? <><PlayCircle className="w-4 h-4 mr-2" /> Continue</> : <><BookOpen className="w-4 h-4 mr-2" /> Start Reading</>}
                    </Button>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEbooks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">No e-books found</p>
            <Button variant="outline" onClick={() => { setActiveTab("all"); setSelectedCategory("all"); setSearchQuery(""); }}>
              View All E-Books
            </Button>
          </div>
        )}

        {/* Expand Your Library CTA */}
        <div className="mt-12 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-purple-700 rounded-2xl p-8 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          </div>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold-400/20 backdrop-blur rounded-2xl flex items-center justify-center border border-gold-400/30">
                <Sparkles className="w-8 h-8 text-gold-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Expand Your Professional Library</h2>
                <p className="text-white/80">Premium guides, templates, and protocol bundles for practitioners</p>
              </div>
            </div>
            <a href="/ebooks">
              <Button className="bg-gold-500 hover:bg-gold-600 text-burgundy-900 font-semibold px-6 py-6 text-lg shadow-lg">
                <Library className="w-5 h-5 mr-2" /> Browse Resources <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
