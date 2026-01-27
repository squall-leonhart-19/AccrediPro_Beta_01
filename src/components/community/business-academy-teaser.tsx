"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Lock,
    Users,
    MessageSquare,
    DollarSign,
    CheckCircle2,
    Sparkles,
    Zap,
    ArrowRight,
    Star,
    TrendingUp,
    Briefcase,
    Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessAcademyTeaserProps {
    categoryName: string;
    categorySlug: string;
}

// AccrediPro brand colors
const BRAND = {
    gold: "#D4AF37",
    goldLight: "#F5E6B8",
    burgundy: "#722F37",
    burgundyLight: "#9D4654",
    burgundyDark: "#5A252C",
};

// CTA checkout link
const CHECKOUT_URL = "https://www.fanbasis.com/agency-checkout/AccrediPro/xnlOP";

// Fake post titles for blurred preview (enticing content)
const TEASER_POSTS = [
    { title: "How I landed my first $5K client in 30 days", author: "Jessica M.", ago: "2h ago", reactions: 47 },
    { title: "The exact script I use for discovery calls (90% close rate)", author: "Amanda R.", ago: "5h ago", reactions: 89 },
    { title: "Stop undercharging! Here's my pricing breakdown...", author: "Lisa T.", ago: "1d ago", reactions: 156 },
    { title: "Client intake template that saves me 10hrs/week", author: "Victoria H.", ago: "2d ago", reactions: 73 },
    { title: "From $0 to $8K/month - my 6-month journey", author: "Michelle P.", ago: "3d ago", reactions: 234 },
];

// Dynamic stats
function getStats() {
    const today = new Date();
    const hash = today.getDate() + today.getMonth() * 31;
    return {
        members: 847 + (hash % 50),
        posts: 234 + (hash % 30),
        earnings: 2.4 + (hash % 5) / 10,
        newThisWeek: 17 + (hash % 12),
    };
}

export function BusinessAcademyTeaser({ categoryName, categorySlug }: BusinessAcademyTeaserProps) {
    const [isHovering, setIsHovering] = useState(false);
    const stats = getStats();

    return (
        <div className="min-h-screen" style={{ background: `linear-gradient(135deg, #FDF8F0 0%, #FFFBF5 50%, ${BRAND.goldLight}20 100%)` }}>
            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 border"
                        style={{
                            background: `linear-gradient(135deg, ${BRAND.goldLight} 0%, #FFF8E7 100%)`,
                            borderColor: BRAND.gold,
                            color: BRAND.burgundy
                        }}
                    >
                        <Briefcase className="w-4 h-4" />
                        <span>Business Academy</span>
                        <Crown className="w-4 h-4" style={{ color: BRAND.gold }} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: BRAND.burgundy }}>
                        Turn Your Certification Into a
                        <span style={{ color: BRAND.gold }}> 6-Figure Practice</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Exclusive strategies, templates, and live coaching from practitioners
                        who've built thriving {categoryName} practices.
                    </p>
                </div>

                {/* Sarah's Message Card */}
                <div
                    className="rounded-2xl shadow-lg p-6 mb-8 relative overflow-hidden"
                    style={{
                        background: 'white',
                        border: `2px solid ${BRAND.gold}40`
                    }}
                >
                    <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-bl-full"
                        style={{ background: `linear-gradient(to bottom left, ${BRAND.goldLight}40, transparent)` }}
                    />

                    <div className="flex items-start gap-4 relative z-10">
                        <div className="relative">
                            <Image
                                src="/coaches/sarah-coach.webp"
                                alt="Sarah M."
                                width={80}
                                height={80}
                                className="rounded-full shadow-lg"
                                style={{ border: `4px solid ${BRAND.gold}` }}
                            />
                            <div
                                className="absolute -bottom-1 -right-1 text-white rounded-full p-1"
                                style={{ background: BRAND.burgundy }}
                            >
                                <Star className="w-3 h-3 fill-current" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold" style={{ color: BRAND.burgundy }}>Sarah M.</span>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full"
                                    style={{ background: BRAND.goldLight, color: BRAND.burgundy }}
                                >
                                    Founder
                                </span>
                            </div>
                            <blockquote className="text-gray-700 italic leading-relaxed">
                                "I created this space for coaches who are ready to stop struggling and start thriving.
                                Inside, you'll find everything I wish I had when I was building my first practice —
                                the exact scripts, templates, and strategies that helped me scale to multiple 6-figures.
                                <span className="font-medium not-italic" style={{ color: BRAND.burgundy }}> See you inside!</span>"
                            </blockquote>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: `1px solid ${BRAND.gold}30` }}>
                        <div className="flex items-center justify-center gap-2 mb-1" style={{ color: BRAND.burgundy }}>
                            <Users className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{stats.members}</div>
                        <div className="text-sm text-gray-500">Active Members</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: `1px solid ${BRAND.gold}30` }}>
                        <div className="flex items-center justify-center gap-2 mb-1" style={{ color: BRAND.burgundy }}>
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{stats.posts}+</div>
                        <div className="text-sm text-gray-500">Resources & Posts</div>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm" style={{ border: `1px solid ${BRAND.gold}30` }}>
                        <div className="flex items-center justify-center gap-2 mb-1" style={{ color: BRAND.gold }}>
                            <DollarSign className="w-5 h-5" />
                        </div>
                        <div className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>${stats.earnings}M</div>
                        <div className="text-sm text-gray-500">Member Earnings</div>
                    </div>
                </div>

                {/* Blurred Posts Preview */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden" style={{ border: `1px solid ${BRAND.gold}30` }}>
                    <div
                        className="px-5 py-3 flex items-center justify-between"
                        style={{ background: `linear-gradient(135deg, ${BRAND.burgundy} 0%, ${BRAND.burgundyLight} 100%)` }}
                    >
                        <span className="text-white font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Latest Discussions
                        </span>
                        <span className="text-white/70 text-sm">{stats.posts}+ posts</span>
                    </div>

                    <div className="relative">
                        {/* Blurred posts */}
                        <div className="divide-y divide-gray-100">
                            {TEASER_POSTS.map((post, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "px-5 py-4 flex items-center gap-4",
                                        i >= 2 && "blur-sm"
                                    )}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex-shrink-0"
                                        style={{ background: `linear-gradient(135deg, ${BRAND.goldLight} 0%, ${BRAND.gold}50 100%)` }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{post.title}</div>
                                        <div className="text-sm text-gray-500">{post.author} · {post.ago}</div>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <span>❤️ {post.reactions}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />

                        {/* Lock icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg" style={{ border: `2px solid ${BRAND.gold}` }}>
                                <Lock className="w-8 h-8" style={{ color: BRAND.burgundy }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* What's Inside Card */}
                <div
                    className="rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${BRAND.burgundy} 0%, ${BRAND.burgundyDark} 100%)` }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: `${BRAND.gold}10` }} />
                    <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full translate-y-1/2 -translate-x-1/2" style={{ background: `${BRAND.gold}10` }} />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6" style={{ color: BRAND.gold }} />
                            What You'll Unlock
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            {[
                                "Client acquisition playbooks that actually work",
                                "Pricing & packaging templates (steal mine!)",
                                "Discovery call scripts with 90%+ close rates",
                                "Weekly live Q&A with 6-figure coaches",
                                "Private mastermind discussions",
                                "Marketing funnels & email sequences",
                                "Contract & intake form templates",
                                "Group coaching replay library",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                                    <span className="text-white/90">{item}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div
                            className="rounded-xl p-6 text-center"
                            style={{ background: `${BRAND.gold}20`, backdropFilter: 'blur(8px)' }}
                        >
                            <div className="mb-4">
                                <span className="text-white/60 line-through text-lg">$97/month</span>
                                <span className="text-4xl font-bold ml-3" style={{ color: BRAND.gold }}>$47</span>
                                <span className="text-white/80">/month</span>
                            </div>

                            <Link href={CHECKOUT_URL} target="_blank">
                                <Button
                                    size="lg"
                                    className={cn(
                                        "w-full md:w-auto font-semibold text-lg px-8 py-6 h-auto",
                                        "transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                                    )}
                                    style={{
                                        background: `linear-gradient(135deg, ${BRAND.gold} 0%, #E6C84D 100%)`,
                                        color: BRAND.burgundyDark
                                    }}
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                >
                                    <span>Unlock Business Academy</span>
                                    <ArrowRight className={cn(
                                        "w-5 h-5 ml-2 transition-transform",
                                        isHovering && "translate-x-1"
                                    )} />
                                </Button>
                            </Link>

                            <p className="text-white/70 text-sm mt-3">
                                Cancel anytime · Instant access · 7-day money back guarantee
                            </p>
                        </div>
                    </div>
                </div>

                {/* Urgency Banner */}
                <div
                    className="rounded-xl p-4 flex items-center justify-center gap-3 text-white"
                    style={{ background: `linear-gradient(135deg, ${BRAND.gold} 0%, #C9A227 100%)` }}
                >
                    <Zap className="w-5 h-5" style={{ color: BRAND.burgundyDark }} />
                    <span className="font-medium" style={{ color: BRAND.burgundyDark }}>
                        <span className="font-bold">{stats.newThisWeek} coaches</span> joined this week — Don't get left behind!
                    </span>
                    <TrendingUp className="w-5 h-5" style={{ color: BRAND.burgundyDark }} />
                </div>

                {/* Testimonial snippet */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 italic">
                        "Business Academy paid for itself in the first week. I closed my first $2K client using Sarah's discovery call script!"
                    </p>
                    <p className="font-medium mt-2" style={{ color: BRAND.burgundy }}>— Amanda R., {categoryName} Coach</p>
                </div>

            </div>
        </div>
    );
}
