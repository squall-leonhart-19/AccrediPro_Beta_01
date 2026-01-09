"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
    Award,
    CheckCircle2,
    Shield,
    Star,
    Users,
    Heart,
    Brain,
    Leaf,
    Baby,
    Moon,
    Target,
    ArrowRight,
    Gift,
    TrendingUp,
    Flame,
    GraduationCap,
    MessageCircle,
    Briefcase,
    Globe,
    FileText,
    Zap,
    Quote,
    ChevronRight,
    Play,
    Clock,
    Calendar,
    DollarSign,
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

// Track data
const TRACKS = {
    "functional-medicine": {
        name: "Functional Medicine",
        fullName: "Functional Medicine Practitioner",
        tagline: "Help clients heal chronic conditions at the root cause",
        icon: Heart,
        gradient: "from-rose-500 via-burgundy-600 to-burgundy-700",
        bgGradient: "from-burgundy-900 via-burgundy-800 to-burgundy-900",
        color: "burgundy",
        income: "$10K-$15K/mo",
        incomeYearly: "$120K-$180K/year",
        demandLevel: "Very High",
        clientTypes: "Chronic fatigue, hormonal imbalances, gut issues, autoimmune conditions, inflammation",
        credentials: {
            foundation: { abbr: "FM-FC™", name: "Foundation Certificate", hours: 25 },
            certified: { abbr: "FM-CP™", name: "Certified Professional", hours: 90 },
            board: { abbr: "BC-FMP™", name: "Board Certified FM Practitioner", hours: 150 },
        },
        secondTracks: ["Women's Hormones", "Gut Health", "Metabolic Health", "Nutrition"],
        coach: { name: "Sarah Mitchell", role: "Lead FM Coach", avatar: "/coaches/sarah-mitchell.webp" },
        testimonial: {
            quote: "I went from corporate burnout to earning $9,200/month helping women with hormonal issues. The done-for-you business setup saved me months of work.",
            author: "Jennifer K.",
            role: "Former Marketing Executive",
            income: "$110K/year",
            avatar: "/coaches/sarah-mitchell.webp",
        },
        faqs: [
            { q: "Do I need a medical background?", a: "No! Most of our successful graduates come from non-medical backgrounds. We teach you everything from the ground up." },
            { q: "How long until I can take clients?", a: "You can start taking clients as early as Week 13 when you earn your Foundation Certificate (FM-FC™)." },
            { q: "What if I don't hit $10K/month?", a: "Our Income Guarantee means we keep working with you at no extra cost until you reach your goal. No time limits." },
        ],
    },
    "holistic-nutrition": {
        name: "Holistic Nutrition",
        fullName: "Holistic Nutrition Coach",
        tagline: "Transform lives through food-as-medicine approaches",
        icon: Leaf,
        gradient: "from-emerald-500 via-green-600 to-emerald-700",
        bgGradient: "from-emerald-900 via-emerald-800 to-emerald-900",
        color: "emerald",
        income: "$8K-$12K/mo",
        incomeYearly: "$96K-$144K/year",
        demandLevel: "High",
        clientTypes: "Weight management, dietary optimization, food sensitivities, gut healing, anti-aging",
        credentials: {
            foundation: { abbr: "HN-FC™", name: "Foundation Certificate", hours: 25 },
            certified: { abbr: "HN-CP™", name: "Certified Professional", hours: 90 },
            board: { abbr: "BC-HNC™", name: "Board Certified Nutrition Coach", hours: 150 },
        },
        secondTracks: ["Weight Management", "Gut Health", "Anti-Aging", "Sports Nutrition"],
        coach: { name: "Sarah Mitchell", role: "Lead Nutrition Coach", avatar: "/coaches/sarah-mitchell.webp" },
        testimonial: {
            quote: "At 52, I finally found my calling. I now help clients lose weight naturally and earn $8,500/month doing it. The certification gave me instant credibility.",
            author: "Maria T.",
            role: "Former Teacher",
            income: "$102K/year",
            avatar: "/coaches/sarah-mitchell.webp",
        },
        faqs: [
            { q: "Is this a registered dietitian program?", a: "No, this is a holistic nutrition coaching certification. You'll learn to work alongside medical professionals, not replace them." },
            { q: "Can I work with clients online?", a: "Absolutely! Most of our graduates run 100% virtual practices, giving them location freedom." },
            { q: "What if I don't hit my income goal?", a: "Our Income Guarantee means we keep working with you at no extra cost until you reach your goal." },
        ],
    },
    "narc-recovery": {
        name: "Trauma Recovery",
        fullName: "Trauma Recovery Coach",
        tagline: "Help survivors heal from narcissistic abuse and trauma",
        icon: Brain,
        gradient: "from-violet-500 via-purple-600 to-purple-700",
        bgGradient: "from-purple-900 via-purple-800 to-purple-900",
        color: "purple",
        income: "$10K-$14K/mo",
        incomeYearly: "$120K-$168K/year",
        demandLevel: "High",
        clientTypes: "Narcissistic abuse survivors, PTSD, C-PTSD, emotional healing, relationship recovery",
        credentials: {
            foundation: { abbr: "NARC-FC™", name: "Foundation Certificate", hours: 25 },
            certified: { abbr: "NARC-CP™", name: "Certified Professional", hours: 90 },
            board: { abbr: "BC-TRC™", name: "Board Certified Trauma Coach", hours: 150 },
        },
        secondTracks: ["ADHD Coaching", "Grief & Loss", "C-PTSD Support", "Anxiety Relief"],
        coach: { name: "Olivia Reyes", role: "Lead Trauma Coach", avatar: "/coaches/olivia-reyes.webp" },
        testimonial: {
            quote: "As a survivor myself, turning my pain into purpose changed everything. I now earn $11,000/month helping others heal. This certification gave me the framework and confidence.",
            author: "Rachel M.",
            role: "Former Survivor, Now Healer",
            income: "$132K/year",
            avatar: "/coaches/olivia-reyes.webp",
        },
        faqs: [
            { q: "Do I need therapy credentials?", a: "No. Trauma coaches are distinct from therapists. We teach coaching frameworks that complement, not replace, clinical therapy." },
            { q: "Can I coach if I'm still healing?", a: "We recommend being at least 2 years into your own recovery journey before taking clients." },
            { q: "What types of trauma can I help with?", a: "Primarily narcissistic abuse, emotional abuse, and relational trauma. We teach clear scope boundaries." },
        ],
    },
    "life-coach": {
        name: "Life Coaching",
        fullName: "Certified Life Coach",
        tagline: "Empower clients to achieve their goals and transform their lives",
        icon: Star,
        gradient: "from-amber-400 via-gold-500 to-amber-600",
        bgGradient: "from-amber-900 via-amber-800 to-amber-900",
        color: "gold",
        income: "$10K-$20K/mo",
        incomeYearly: "$120K-$240K/year",
        demandLevel: "Very High",
        clientTypes: "Life transitions, goal achievement, career changes, personal growth, mindset shifts",
        credentials: {
            foundation: { abbr: "LC-FC™", name: "Foundation Certificate", hours: 25 },
            certified: { abbr: "LC-CP™", name: "Certified Professional", hours: 90 },
            board: { abbr: "BC-LCC™", name: "Board Certified Life Coach", hours: 150 },
        },
        secondTracks: ["Career Coaching", "Relationship Coaching", "Mindset", "Executive Coaching"],
        coach: { name: "Maya Chen", role: "Lead Life Coach", avatar: "/coaches/maya-chen.webp" },
        testimonial: {
            quote: "I left my 6-figure corporate job to become a life coach. Within 10 months, I replaced my income and now work 25 hours/week helping executives find clarity.",
            author: "David L.",
            role: "Former VP of Sales",
            income: "$180K/year",
            avatar: "/coaches/maya-chen.webp",
        },
        faqs: [
            { q: "What makes this different from other coaching certifications?", a: "Our Income Guarantee, done-for-you business setup, and AI coach support ensure you don't just get certified—you build a real business." },
            { q: "Can I niche down within life coaching?", a: "Absolutely! Most successful coaches specialize (executives, women, career changers, etc.). We help you find your niche." },
            { q: "How many clients do I need for $10K/month?", a: "Typically 8-12 clients at $800-$1,200/month packages. We teach you how to structure premium offers." },
        ],
    },
    "parenting": {
        name: "Conscious Parenting",
        fullName: "Conscious Parenting Coach",
        tagline: "Guide families through modern parenting challenges with compassion",
        icon: Baby,
        gradient: "from-pink-400 via-rose-500 to-pink-600",
        bgGradient: "from-pink-900 via-pink-800 to-pink-900",
        color: "pink",
        income: "$8K-$12K/mo",
        incomeYearly: "$96K-$144K/year",
        demandLevel: "Growing",
        clientTypes: "Parents, expecting families, fertility journeys, postpartum, family dynamics",
        credentials: {
            foundation: { abbr: "CP-FC™", name: "Foundation Certificate", hours: 25 },
            certified: { abbr: "CP-CP™", name: "Certified Professional", hours: 90 },
            board: { abbr: "BC-CPE™", name: "Board Certified Parenting Expert", hours: 150 },
        },
        secondTracks: ["Birth Doula", "Fertility Support", "Postpartum", "Teen Parenting"],
        coach: { name: "Emma Thompson", role: "Lead Parenting Coach", avatar: "/coaches/emma-thompson.webp" },
        testimonial: {
            quote: "After raising 4 kids, I turned my experience into a coaching business. Now I earn $9,000/month helping stressed moms find peace and connection with their children.",
            author: "Susan B.",
            role: "Mother of 4, Now Coach",
            income: "$108K/year",
            avatar: "/coaches/emma-thompson.webp",
        },
        faqs: [
            { q: "Do I need to be a parent myself?", a: "It helps but isn't required. Many successful parenting coaches come from education, childcare, or psychology backgrounds." },
            { q: "What age groups will I work with?", a: "You'll learn to coach parents of children from newborn through teens. Most coaches specialize in one stage." },
            { q: "Can I combine this with birth work?", a: "Yes! Our second track option lets you add Birth Doula or Fertility Support certifications." },
        ],
    },
    "energy-healing": {
        name: "Energy Healing",
        fullName: "Energy Healing Practitioner",
        tagline: "Channel healing energy to restore balance and vitality",
        icon: Moon,
        gradient: "from-indigo-400 via-violet-500 to-indigo-600",
        bgGradient: "from-indigo-900 via-indigo-800 to-indigo-900",
        color: "indigo",
        income: "$8K-$16K/mo",
        incomeYearly: "$96K-$192K/year",
        demandLevel: "Growing",
        clientTypes: "Spiritual seekers, energy blocks, chakra imbalances, sacred intimacy, breathwork",
        credentials: {
            foundation: { abbr: "EH-FC™", name: "Foundation Certificate", hours: 25 },
            certified: { abbr: "EH-CP™", name: "Certified Professional", hours: 90 },
            board: { abbr: "BC-EHP™", name: "Board Certified Energy Practitioner", hours: 150 },
        },
        secondTracks: ["Reiki", "Chakra Balancing", "Breathwork", "Crystal Healing"],
        coach: { name: "Luna Sinclair", role: "Lead Energy Coach", avatar: "/coaches/luna-sinclair.webp" },
        testimonial: {
            quote: "I always knew I was meant for healing work. This certification gave me the structure and credibility to charge what I'm worth. Now I earn $12,000/month.",
            author: "Crystal A.",
            role: "Energy Healer",
            income: "$144K/year",
            avatar: "/coaches/luna-sinclair.webp",
        },
        faqs: [
            { q: "Is this scientifically recognized?", a: "Energy healing is a complementary practice. We teach you how to work responsibly alongside conventional care." },
            { q: "Do I need prior energy work experience?", a: "Not required, but helpful. We teach from foundational principles through advanced techniques." },
            { q: "Can I combine modalities?", a: "Yes! Many practitioners combine energy work with coaching, bodywork, or nutrition for comprehensive offerings." },
        ],
    },
};

// All tracks for switcher
const ALL_TRACKS = Object.entries(TRACKS).map(([slug, data]) => ({
    slug,
    name: data.name,
    icon: data.icon,
}));

// Value stack
const VALUE_STACK = [
    { item: "Complete 12-Month Career Program", value: "$4,997", icon: GraduationCap },
    { item: "Board Certification INCLUDED", value: "$5,997", icon: Award, highlight: true },
    { item: "Second Career Track FREE", value: "$4,997", icon: Gift, highlight: true },
    { item: "Done-For-You Business-in-a-Box", value: "$2,997", icon: Briefcase },
    { item: "Coach Sarah AI (Lifetime)", value: "$1,997", icon: MessageCircle },
    { item: "Practitioner Directory (Lifetime)", value: "$997/yr", icon: Globe },
    { item: "Accountability Pod (12 months)", value: "$1,200", icon: Users },
    { item: "Templates & Swipe Files Vault", value: "$997", icon: FileText },
];

interface TrackPageClientProps {
    trackSlug: string;
}

export default function TrackPageClient({ trackSlug }: TrackPageClientProps) {
    const track = TRACKS[trackSlug as keyof typeof TRACKS];
    const Icon = track.icon;
    const spotsRemaining = getFoundingSpotsRemaining();

    const chatUrl = `/my-personal-roadmap-by-coach-sarah?interest=career-accelerator&track=${trackSlug}`;

    return (
        <div className="space-y-8">
            {/* TRACK SWITCHER */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                {ALL_TRACKS.map((t) => {
                    const TIcon = t.icon;
                    const isActive = t.slug === trackSlug;
                    return (
                        <Link key={t.slug} href={`/practice/${t.slug}`}>
                            <Button
                                variant={isActive ? "default" : "outline"}
                                size="sm"
                                className={isActive ? "bg-burgundy-600 hover:bg-burgundy-700" : ""}
                            >
                                <TIcon className="w-4 h-4 mr-1.5" />
                                {t.name}
                            </Button>
                        </Link>
                    );
                })}
            </div>

            {/* HERO */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${track.bgGradient} p-8 md:p-12`}>
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] translate-y-1/2" />

                <div className="relative z-10">
                    {/* Scarcity Banner */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-5 py-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-red-200 text-sm">
                                Only <strong className="text-white">{spotsRemaining}</strong> founding spots left
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                        <div className="flex-1 text-center md:text-left">
                            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-4">
                                <Award className="w-3 h-3 mr-1" />
                                ASI Career Accelerator
                            </Badge>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                                Become a Certified<br />
                                <span className="text-gold-400">{track.fullName}</span>
                            </h1>
                            <p className="text-xl text-white/70 mb-6">{track.tagline}</p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-1.5 text-base">
                                    <DollarSign className="w-4 h-4 mr-1" />
                                    {track.income}
                                </Badge>
                                <Badge className="bg-white/10 text-white/80 border-white/20 px-4 py-1.5">
                                    <TrendingUp className="w-4 h-4 mr-1" />
                                    Demand: {track.demandLevel}
                                </Badge>
                            </div>

                            <Link href={chatUrl}>
                                <Button size="lg" className="bg-gold-400 hover:bg-gold-300 text-burgundy-900 font-bold text-lg px-8 py-6 shadow-2xl">
                                    <Target className="w-5 h-5 mr-2" />
                                    Apply to Qualify
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        {/* Coach Avatar */}
                        <div className="text-center">
                            <Image
                                src={track.coach.avatar}
                                alt={track.coach.name}
                                width={150}
                                height={150}
                                className="rounded-full border-4 border-white/20 shadow-2xl mx-auto mb-3"
                            />
                            <p className="text-white font-semibold">{track.coach.name}</p>
                            <p className="text-white/60 text-sm">{track.coach.role}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOCIAL PROOF */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Certified", value: "1,447+", icon: Users },
                    { label: "Avg Income", value: "$8K/mo", icon: TrendingUp },
                    { label: "Rating", value: "4.9★", icon: Star },
                    { label: "Success Rate", value: "85%", icon: CheckCircle2 },
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

            {/* CREDENTIAL PATH */}
            <Card className="border-2 border-gold-200 bg-gradient-to-r from-gold-50 to-amber-50">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-burgundy-600" />
                        Your ASI Credential Path
                    </h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { ...track.credentials.foundation, level: 1, color: "emerald" },
                            { ...track.credentials.certified, level: 2, color: "blue" },
                            { ...track.credentials.board, level: 3, color: "gold" },
                        ].map((cred, i) => (
                            <div key={i} className="relative">
                                <div className={`p-5 rounded-xl border-2 bg-white ${cred.color === "emerald" ? "border-emerald-300" :
                                        cred.color === "blue" ? "border-blue-300" : "border-gold-300"
                                    }`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-3 ${cred.color === "emerald" ? "bg-emerald-500" :
                                            cred.color === "blue" ? "bg-blue-500" : "bg-gold-500"
                                        }`}>
                                        {cred.level}
                                    </div>
                                    <Badge variant="outline" className="font-mono mb-2">{cred.abbr}</Badge>
                                    <h3 className="font-bold text-gray-900">{cred.name}</h3>
                                    <p className="text-sm text-gray-500">{cred.hours} contact hours</p>
                                </div>
                                {i < 2 && (
                                    <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 w-6 h-6 bg-white rounded-full border-2 border-gray-200 items-center justify-center">
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* VALUE STACK */}
            <Card className="border-2">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-burgundy-600" />
                            Everything Included
                        </h2>
                        <div className="text-right">
                            <p className="text-sm text-gray-500"><s>$24,000+ Value</s></p>
                            <p className="font-bold text-burgundy-600">Qualify to see pricing</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {VALUE_STACK.map((item, i) => {
                            const ItemIcon = item.icon;
                            return (
                                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${item.highlight ? "bg-gold-50 border border-gold-200" : "bg-gray-50"
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <ItemIcon className={`w-4 h-4 ${item.highlight ? "text-gold-600" : "text-gray-400"}`} />
                                        <span className={item.highlight ? "font-semibold text-gray-900" : "text-gray-700"}>
                                            {item.item}
                                        </span>
                                        {item.highlight && (
                                            <Badge className="bg-gold-100 text-gold-700 border-0 text-[10px]">BONUS</Badge>
                                        )}
                                    </div>
                                    <span className="font-bold text-gray-900">{item.value}</span>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* SECOND TRACK */}
            <Card className="border-2 border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Gift className="w-6 h-6 text-purple-600" />
                        <div>
                            <h3 className="font-bold text-gray-900">Get a Second Track FREE</h3>
                            <p className="text-sm text-gray-600">Choose any additional certification at no extra cost</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 border-0 ml-auto">$4,997 Value</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {track.secondTracks.map((t) => (
                            <Badge key={t} variant="outline" className="border-purple-300 text-purple-700 bg-white">{t}</Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* TESTIMONIAL */}
            <Card className="border-2 overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                        <div className={`md:w-1/3 bg-gradient-to-br ${track.gradient} p-6 flex items-center justify-center`}>
                            <div className="text-center">
                                <Image
                                    src={track.testimonial.avatar}
                                    alt={track.testimonial.author}
                                    width={100}
                                    height={100}
                                    className="rounded-full border-4 border-white/30 mx-auto mb-4"
                                />
                                <p className="font-bold text-white">{track.testimonial.author}</p>
                                <p className="text-sm text-white/70">{track.testimonial.role}</p>
                                <Badge className="mt-2 bg-green-500 text-white border-0">
                                    Now earning {track.testimonial.income}
                                </Badge>
                            </div>
                        </div>
                        <div className="md:w-2/3 p-8 flex items-center">
                            <div>
                                <Quote className="w-10 h-10 text-gray-200 mb-4" />
                                <p className="text-xl text-gray-700 italic mb-4">
                                    "{track.testimonial.quote}"
                                </p>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-gold-400 text-gold-400" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* INCOME GUARANTEE */}
            <Card className="border-4 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-green-200">
                            <Shield className="w-12 h-12 text-green-600" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <Badge className="bg-green-600 text-white border-0 mb-2">THE ASI INCOME GUARANTEE</Badge>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2">
                                Hit {track.income} in 12 Months — Or It's Free Until You Do
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Complete the program, follow the path, and if you don't reach your income goal,
                                we continue supporting you at no extra cost until you do.
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                {["No time limit", "No hidden fees", "Full access continues"].map((item, i) => (
                                    <span key={i} className="flex items-center gap-2 text-green-700 font-medium">
                                        <CheckCircle2 className="w-5 h-5" /> {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border-2">
                <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {track.faqs.map((faq, i) => (
                            <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* FINAL CTA */}
            <Card className={`border-0 bg-gradient-to-r ${track.bgGradient} overflow-hidden`}>
                <CardContent className="p-8 md:p-12 text-center">
                    <Badge className="bg-red-500/90 text-white border-0 mb-4 animate-pulse">
                        <Flame className="w-4 h-4 mr-1" />
                        Only {spotsRemaining} Founding Spots Left
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                        Ready to Become a {track.fullName}?
                    </h2>
                    <p className="text-white/70 text-lg mb-6 max-w-xl mx-auto">
                        Talk to Coach Sarah about your goals. She'll help you determine if this
                        Career Accelerator is right for you.
                    </p>
                    <Link href={chatUrl}>
                        <Button size="lg" className="bg-gold-400 hover:bg-gold-300 text-burgundy-900 font-bold text-xl px-12 py-7 shadow-2xl">
                            <Target className="w-6 h-6 mr-3" />
                            Apply to Qualify Now
                            <ArrowRight className="w-6 h-6 ml-3" />
                        </Button>
                    </Link>
                    <p className="text-white/50 text-sm mt-4">No commitment required • Income guaranteed</p>
                </CardContent>
            </Card>

            {/* ASI FOOTER */}
            <div className="text-center py-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <Award className="w-4 h-4" />
                    <span>Powered by <strong className="text-gray-700">AccrediPro Standards Institute</strong></span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                    ASI credentials are recognized industry-wide • Board certification included
                </p>
            </div>
        </div>
    );
}
