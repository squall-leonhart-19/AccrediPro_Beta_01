"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Clock,
  Award,
  Star,
  Users,
  CheckCircle,
  Sparkles,
  Gift,
  ArrowRight,
  Shield,
  BookOpen,
  MessageCircle,
  Calendar,
} from "lucide-react";
import Image from "next/image";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

interface MasterclassUnlockedProps {
  firstName: string;
}

export function MasterclassUnlocked({ firstName }: MasterclassUnlockedProps) {
  const [hasWatched, setHasWatched] = useState(false);

  // Placeholder webinar video URL - replace with actual
  const webinarVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Placeholder

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800" />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-yellow-400/30 text-yellow-200 border-yellow-400/40 font-semibold">
              <Sparkles className="w-3 h-3 mr-1" />
              UNLOCKED
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              Mini Diploma Graduate
            </Badge>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Congratulations, {firstName}! 🎉
          </h1>

          <p className="text-lg text-emerald-100 mb-6 max-w-2xl mx-auto">
            You've unlocked your exclusive Masterclass Bonus.
            This is where the real transformation begins.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 -mt-8">
        {/* Video Section */}
        <Card className="border-2 border-emerald-200 shadow-2xl overflow-hidden mb-8">
          <div className="relative aspect-video bg-slate-900">
            {/* Replace with actual video embed */}
            <iframe
              src={webinarVideoUrl}
              title="FM Certification Masterclass"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <CardContent className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-lg">
                  The FM Certification Masterclass
                </h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    47 minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    4.9 rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    2,847 watched
                  </span>
                </div>
              </div>
              {!hasWatched && (
                <Button
                  onClick={() => setHasWatched(true)}
                  variant="outline"
                  className="border-emerald-300 text-emerald-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Watched
                </Button>
              )}
              {hasWatched && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Watched
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Special Offer Section */}
        <Card className="border-2 border-amber-300 shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <div className="flex items-center justify-center gap-2">
              <Gift className="w-5 h-5 text-white" />
              <span className="text-white font-bold">
                Mini Diploma Graduate Exclusive Offer
              </span>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                Become a Certified FM Health Coach
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                You've proven your commitment. Now take the next step and get the full
                certification, protocols, and tools to transform lives professionally.
              </p>
            </div>

            {/* What's Included */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                {[
                  { icon: BookOpen, text: "20 Deep-Dive Training Modules" },
                  { icon: Award, text: "Official FM Health Coach Certification" },
                  { icon: Users, text: "Private Community (Lifetime Access)" },
                  { icon: MessageCircle, text: "Monthly Live Q&A Calls" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  { icon: Calendar, text: "Done-For-You Client Templates" },
                  { icon: Shield, text: "30-Day Money-Back Guarantee" },
                  { icon: Star, text: "Bonus: Client Acquisition Toolkit" },
                  { icon: Gift, text: "Bonus: Lab Interpretation Guide" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-slate-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-6">
              <p className="text-sm text-slate-500 mb-1">Graduate Special Price</p>
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-slate-400 line-through text-2xl">$1,497</span>
                <span className="text-4xl font-bold text-emerald-600">$997</span>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-0">
                Save $500 as a Mini Diploma Graduate
              </Badge>
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-4">
              <a
                href="https://yourcheckoutlink.com/fm-certification-997"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-md"
              >
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Enroll Now - $997
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </a>

              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                30-Day Money-Back Guarantee • Instant Access
              </p>

              <p className="text-xs text-slate-400">
                Or 3 payments of $349/month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
            What Our Certified Graduates Say
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                name: "Linda M.",
                location: "Texas",
                text: "I went from burnt-out nurse to fully booked FM coach in 6 months. This program changed everything.",
              },
              {
                name: "Maria S.",
                location: "California",
                text: "I doubled my income while working LESS. The protocols alone were worth 10x the investment.",
              },
              {
                name: "Jennifer K.",
                location: "Florida",
                text: "Finally, a certification that teaches you how to actually HELP people heal, not just manage symptoms.",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="border border-slate-200">
                <CardContent className="p-5">
                  <div className="flex gap-0.5 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm mb-3">"{testimonial.text}"</p>
                  <p className="text-sm font-medium text-slate-900">
                    {testimonial.name}
                    <span className="text-slate-400 font-normal"> • {testimonial.location}</span>
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ or Support */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Image
                src={SARAH_AVATAR}
                alt="Sarah"
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover ring-2 ring-purple-200"
              />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 mb-1">Have questions?</h3>
                <p className="text-slate-600 text-sm">
                  I'm here to help you make the right decision. Send me a message anytime!
                </p>
              </div>
              <a href="/messages">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat with Sarah
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
