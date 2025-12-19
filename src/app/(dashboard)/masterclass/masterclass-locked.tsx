"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  GraduationCap,
  Play,
  Clock,
  Award,
  Star,
  Users,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

interface MasterclassLockedProps {
  firstName: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
}

export function MasterclassLocked({
  firstName,
  progress,
  completedLessons,
  totalLessons,
}: MasterclassLockedProps) {
  const lessonsRemaining = totalLessons - completedLessons;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          {/* Lock Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center border-2 border-amber-500/30">
              <Lock className="w-10 h-10 text-amber-400" />
            </div>
          </div>

          <Badge className="mb-4 bg-amber-500/20 text-amber-300 border-amber-500/30 font-semibold">
            <Sparkles className="w-3 h-3 mr-1" />
            BONUS CONTENT
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Masterclass Bonus
          </h1>

          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            This exclusive masterclass is your reward for completing the Mini Diploma.
            <span className="text-amber-300 font-medium"> Complete your lessons to unlock!</span>
          </p>

          {/* Progress Card */}
          <Card className="max-w-md mx-auto border-2 border-amber-500/30 bg-slate-800/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 text-sm">Your Progress</span>
                <span className="text-amber-400 font-bold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3 mb-3" />
              <p className="text-slate-400 text-sm">
                {completedLessons} of {totalLessons} lessons completed •{" "}
                <span className="text-amber-300 font-medium">{lessonsRemaining} remaining</span>
              </p>

              <Link href="/mini-diploma" className="block mt-4">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold">
                  Continue My Lessons
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* What You'll Unlock */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
          What You'll Unlock
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Video Preview Card */}
          <Card className="border-2 border-slate-200 overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-slate-800 to-slate-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <Play className="w-8 h-8 text-white/50 ml-1" />
                </div>
              </div>
              <div className="absolute inset-0 bg-slate-900/60" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white/60 text-sm">Exclusive Training</p>
                <h3 className="text-white font-bold text-lg">
                  The FM Certification Masterclass
                </h3>
              </div>
              {/* Lock overlay */}
              <div className="absolute top-4 right-4">
                <div className="bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 text-xs font-medium">Locked</span>
                </div>
              </div>
            </div>
            <CardContent className="p-5">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  47 min
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  4.9 rating
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Card */}
          <Card className="border-2 border-slate-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Inside the Masterclass
              </h3>

              <ul className="space-y-3">
                {[
                  "The complete FM certification roadmap",
                  "How to get your first paying clients",
                  "Real case studies from successful graduates",
                  "Exclusive graduate discount revealed",
                  "Q&A with Sarah + live coaching demo",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-emerald-600 text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sarah's Message */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Image
                src={SARAH_AVATAR}
                alt="Sarah"
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-purple-200"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-2">A message from Sarah</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  "Hey {firstName}! I'm so excited for you to unlock this masterclass.
                  It's where I share everything about becoming a certified FM practitioner—
                  the real strategies that helped me and hundreds of our graduates build
                  thriving practices. Finish those last {lessonsRemaining} lessons and I'll see you inside!"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Proof */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-white"
                />
              ))}
            </div>
            <span className="text-sm text-slate-600 ml-2">
              <span className="font-bold text-slate-900">2,847</span> graduates have watched this masterclass
            </span>
          </div>

          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
            ))}
            <span className="text-sm text-slate-600 ml-1">
              4.9/5 average rating
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
