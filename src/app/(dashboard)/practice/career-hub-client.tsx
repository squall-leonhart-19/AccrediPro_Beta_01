"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Award,
    CheckCircle2,
    Star,
    Users,
    Heart,
    Brain,
    Leaf,
    Baby,
    Moon,
    ArrowRight,
    TrendingUp,
    Flame,
    Shield,
} from "lucide-react";

// Dynamic scarcity
function getFoundingSpotsRemaining(): number {
    const launchDate = new Date("2026-01-01");
    const today = new Date();
    const daysSinceLaunch = Math.floor((today.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));
    let spots = 100;
    for (let i = 0; i < daysSinceLaunch; i++) {
        spots -= (i % 3 === 0) ? 2 : 1;
    }
    return Math.max(7, spots);
}

// Career Tracks
const CAREER_TRACKS = [
    {
        slug: "functional-medicine",
        name: "Functional Medicine",
        role: "FM Practitioner",
        icon: Heart,
        gradient: "from-rose-500 via-burgundy-600 to-burgundy-700",
        income: "$10K-$15K/mo",
        demand: "Very High",
        clients: "Chronic conditions, hormones, gut health",
        credential: "BC-FMP™",
        popular: true,
    },
    {
        slug: "holistic-nutrition",
        name: "Holistic Nutrition",
        role: "Nutrition Coach",
        icon: Leaf,
        gradient: "from-emerald-500 via-green-600 to-emerald-700",
        income: "$8K-$12K/mo",
        demand: "High",
        clients: "Weight loss, food healing, dietary plans",
        credential: "BC-HNC™",
        popular: true,
    },
    {
        slug: "narc-recovery",
        name: "Trauma Recovery",
        role: "Trauma Coach",
        icon: Brain,
        gradient: "from-violet-500 via-purple-600 to-purple-700",
        income: "$10K-$14K/mo",
        demand: "High",
        clients: "Narcissistic abuse, PTSD, healing",
        credential: "BC-TRC™",
        popular: false,
    },
    {
        slug: "life-coach",
        name: "Life Coaching",
        role: "Life Coach",
        icon: Star,
        gradient: "from-amber-400 via-gold-500 to-amber-600",
        income: "$10K-$20K/mo",
        demand: "Very High",
        clients: "Goals, transitions, personal growth",
        credential: "BC-LCC™",
        popular: false,
    },
    {
        slug: "parenting",
        name: "Conscious Parenting",
        role: "Parenting Coach",
        icon: Baby,
        gradient: "from-pink-400 via-rose-500 to-pink-600",
        income: "$8K-$12K/mo",
        demand: "Growing",
        clients: "Parents, families, fertility",
        credential: "BC-CPE™",
        popular: false,
    },
    {
        slug: "energy-healing",
        name: "Energy Healing",
        role: "Energy Practitioner",
        icon: Moon,
        gradient: "from-indigo-400 via-violet-500 to-indigo-600",
        income: "$8K-$16K/mo",
        demand: "Growing",
        clients: "Spiritual seekers, energy work",
        credential: "BC-EHP™",
        popular: false,
    },
];

export default function CareerHubClient() {
    const spotsRemaining = getFoundingSpotsRemaining();

    return (
        <div className="space-y-8">
            {/* HERO - Premium Gold/Burgundy */}
            <div
                className="relative overflow-hidden rounded-3xl p-8 md:p-12 shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #1e1e1e 0%, #4e1f24 50%, #1e1e1e 100%)' }}
            >
                <div
                    className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] -translate-y-1/2 opacity-30"
                    style={{ backgroundColor: '#d4af37' }}
                />
                <div
                    className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px] translate-y-1/2 opacity-20"
                    style={{ backgroundColor: '#722f37' }}
                />

                <div className="relative z-10 text-center max-w-3xl mx-auto">
                    <Badge
                        className="mb-6 px-4 py-1.5 border-0 font-bold"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)', color: '#d4af37' }}
                    >
                        <Award className="w-4 h-4 mr-2" />
                        AccrediPro Standards Institute
                    </Badge>

                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                        Choose Your
                        <span className="block" style={{ color: '#d4af37' }}>Career Path</span>
                    </h1>

                    <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto">
                        Select a certification track. We'll show you how to go from zero to
                        <span className="text-white font-semibold"> $10K/month</span> in 12 months—guaranteed.
                    </p>

                    {/* Scarcity */}
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-red-300 text-sm">
                            Only <strong className="text-white">{spotsRemaining}</strong> founding spots left this year
                        </span>
                    </div>
                </div>
            </div>

            {/* TRACK CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {CAREER_TRACKS.map((track) => {
                    const Icon = track.icon;

                    return (
                        <Link key={track.slug} href={`/practice/${track.slug}`} className="group">
                            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                                {/* Gradient Header */}
                                <div className={`bg-gradient-to-r ${track.gradient} p-6 pb-16`}>
                                    {track.popular && (
                                        <Badge className="absolute top-4 right-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                                            <Flame className="w-3 h-3 mr-1" /> Popular
                                        </Badge>
                                    )}
                                    <Icon className="w-10 h-10 text-white/90 mb-4" strokeWidth={1.5} />
                                    <h3 className="text-2xl font-bold text-white">{track.name}</h3>
                                    <p className="text-white/70 text-sm">{track.role}</p>
                                </div>

                                {/* Content */}
                                <div className="bg-white p-6 -mt-8 rounded-t-3xl relative">
                                    <div className="absolute -top-5 right-6">
                                        <Badge className="bg-green-500 text-white border-0 text-base px-4 py-1.5 shadow-lg">
                                            {track.income}
                                        </Badge>
                                    </div>

                                    <div className="pt-4 space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ideal Clients</p>
                                            <p className="text-gray-700">{track.clients}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Demand</p>
                                                <p className="font-semibold text-gray-900">{track.demand}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Credential</p>
                                                <p className="font-bold text-burgundy-600">{track.credential}</p>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white group-hover:bg-gold-500 transition-colors">
                                            View Career Path
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* GUARANTEE BANNER */}
            <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-4">
                    <Shield className="w-12 h-12 text-green-600 flex-shrink-0" />
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-bold text-gray-900">Every Track Comes With Our Income Guarantee</h3>
                        <p className="text-gray-600 text-sm">Hit your income goal in 12 months — or we keep working with you FREE until you do.</p>
                    </div>
                </CardContent>
            </Card>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Certified", value: "1,447+", icon: Users },
                    { label: "Avg Income", value: "$8K/mo", icon: TrendingUp },
                    { label: "Rating", value: "4.9★", icon: Star },
                    { label: "Success", value: "85%", icon: CheckCircle2 },
                ].map((stat, i) => (
                    <Card key={i} className="border-0 bg-gray-50">
                        <CardContent className="p-4 text-center">
                            <stat.icon className="w-5 h-5 mx-auto mb-2 text-burgundy-600" />
                            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                            <p className="text-xs text-gray-500">{stat.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* FOOTER */}
            <div className="text-center py-4 text-sm text-gray-400">
                <div className="flex items-center justify-center gap-2">
                    <Award className="w-4 h-4" />
                    Powered by <strong className="text-gray-600">AccrediPro Standards Institute</strong>
                </div>
            </div>
        </div>
    );
}
