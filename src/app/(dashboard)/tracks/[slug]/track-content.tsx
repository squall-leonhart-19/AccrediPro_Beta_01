"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    BookOpen,
    Clock,
    Award,
    CheckCircle,
    ArrowRight,
    Play,
    Star,
    Users,
    Leaf,
    Heart,
    TrendingUp,
    DollarSign,
    Phone,
    Shield,
    MessageCircle,
    Target,
    ChevronRight,
    ChevronDown,
    Rocket,
    CircleDot,
    HelpCircle,
    Sparkles,
    Apple,
    Brain,
    Zap,
    Moon,
    Droplets,
    Lock,
} from "lucide-react";
import Image from "next/image";
import { FM_SPECIALIZATIONS } from "@/lib/specializations-data";

const ICONS = {
    Leaf,
    Heart,
    TrendingUp,
};

interface TrackContentProps {
    track: any;
    isLoggedIn: boolean;
}

export function TrackContent({ track, isLoggedIn }: TrackContentProps) {
    const Icon = ICONS[track.icon as keyof typeof ICONS] || Leaf;

    const getStepGradient = (step: number) => {
        const gradients = [
            "from-emerald-500 to-emerald-600",
            "from-amber-500 to-amber-600",
            "from-blue-500 to-blue-600",
            "from-burgundy-600 to-burgundy-700"
        ];
        return gradients[step - 1] || "from-burgundy-600 to-burgundy-700";
    };

    const getStepBgLight = (step: number) => {
        const bgs = [
            "bg-emerald-50 border-emerald-200",
            "bg-amber-50 border-amber-200",
            "bg-blue-50 border-blue-200",
            "bg-burgundy-50 border-burgundy-200"
        ];
        return bgs[step - 1] || "bg-burgundy-50 border-burgundy-200";
    };

    const getStepTextColor = (step: number) => {
        const colors = ["text-emerald-700", "text-amber-700", "text-blue-700", "text-burgundy-700"];
        return colors[step - 1] || "text-burgundy-700";
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Compact Hero Header - Matching Catalog Style */}
            <div className="relative bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-700 rounded-xl overflow-hidden">
                <div className="relative z-10 px-5 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Icon + Title + Subtitle */}
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-gold-400" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 text-xs">
                                        Career Roadmap
                                    </Badge>
                                    {track.rating && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                                            <span className="text-sm text-gold-200">{track.rating}</span>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-xl md:text-2xl font-bold text-white">{track.heroTitle}</h1>
                                <p className="text-sm text-white/70 mt-1">{track.heroDescription}</p>
                            </div>
                        </div>
                        {/* Right: Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="w-4 h-4 text-gold-400" />
                                <span>{track.format}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-gold-400" />
                                <span>{track.access}</span>
                            </div>
                            {track.totalStudents && (
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-gold-400" />
                                    <span>{track.totalStudents?.toLocaleString()} students</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* WHERE YOU ARE NOW - Emotional Anchor */}
            {track.whereYouAreNow && (
                <Card className="border-2 border-burgundy-100 bg-gradient-to-br from-burgundy-50 to-white overflow-hidden">
                    <CardContent className="p-6 md:p-8">
                        <div className="text-center mb-6">
                            <h3 className="text-xl md:text-2xl font-bold text-burgundy-800 mb-2">
                                {track.whereYouAreNow.headline}
                            </h3>
                            <p className="text-gray-500 italic">{track.whereYouAreNow.subtext}</p>
                        </div>

                        <ul className="space-y-3 mb-6 max-w-2xl mx-auto">
                            {track.whereYouAreNow.painPoints?.map((item: string, i: number) => (
                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                    <CircleDot className="w-4 h-4 text-burgundy-400 mt-1 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="text-center pt-4 border-t border-burgundy-100">
                            <p className="text-burgundy-700 font-semibold text-lg">
                                {track.whereYouAreNow.resolution}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step Overview - 4-Card Visual Flow */}
            <Card className="border-2 border-burgundy-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-gold-400" />
                        Your 4-Step Career Pathway
                    </h2>
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {track.steps?.map((step: any, index: number) => {
                            const isLaunching = step.status === "launching";
                            const isLocked = step.status === "locked" || step.requiresStep1;

                            return (
                                <div key={index} className="relative">
                                    {/* Connector Arrow */}
                                    {index < (track.steps?.length || 0) - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <ChevronRight className="w-4 h-4 text-gray-300" />
                                        </div>
                                    )}

                                    <div className={`relative p-4 rounded-xl border-2 transition-all h-full ${
                                        step.isMainCourse
                                            ? "border-gold-400 bg-gradient-to-br from-gold-50 to-amber-50 shadow-md ring-2 ring-gold-200"
                                            : isLocked
                                                ? "border-gray-200 bg-gray-50 opacity-75"
                                                : isLaunching
                                                    ? "border-blue-200 bg-blue-50/50"
                                                    : `${getStepBgLight(step.step)} border`
                                    }`}>
                                        {/* Locked overlay */}
                                        {isLocked && (
                                            <div className="absolute top-2 right-2">
                                                <Lock className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}

                                        {/* Step Badge */}
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold mb-2 ${
                                            step.isMainCourse
                                                ? "bg-gold-400 text-burgundy-900"
                                                : isLocked
                                                    ? "bg-gray-300 text-gray-600"
                                                    : isLaunching
                                                        ? "bg-blue-500 text-white"
                                                        : `bg-gradient-to-r ${getStepGradient(step.step)} text-white`
                                        }`}>
                                            {step.isMainCourse ? (
                                                <>
                                                    <Star className="w-3 h-3 fill-current" />
                                                    START HERE
                                                </>
                                            ) : isLocked ? (
                                                <>
                                                    <Lock className="w-3 h-3" />
                                                    LOCKED
                                                </>
                                            ) : isLaunching ? (
                                                <>Launching Soon</>
                                            ) : (
                                                <>Step {step.step}</>
                                            )}
                                        </div>

                                        <h3 className={`font-bold text-sm mb-1 ${isLocked ? "text-gray-500" : "text-gray-900"}`}>{step.title}</h3>

                                        {/* Question it answers */}
                                        {step.questionItAnswers && !isLocked && (
                                            <p className="text-xs text-burgundy-600 italic mb-2 flex items-start gap-1">
                                                <HelpCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                &quot;{step.questionItAnswers}&quot;
                                            </p>
                                        )}

                                        {/* Locked message for step 2 */}
                                        {isLocked && (
                                            <p className="text-xs text-gray-500 mb-2">
                                                Complete Step 1 to unlock
                                            </p>
                                        )}

                                        {/* Price */}
                                        <div className="mt-auto pt-2">
                                            <span className={`font-bold ${isLocked ? "text-gray-400" : step.isMainCourse ? "text-burgundy-700" : getStepTextColor(step.step)}`}>
                                                {step.price}
                                            </span>
                                        </div>

                                        {/* Income Preview */}
                                        {!isLocked && step.incomeVision?.starting && (
                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                → {step.incomeVision.starting}
                                            </p>
                                        )}
                                        {!isLocked && step.incomeVision?.primary && (
                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                → {step.incomeVision.primary}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* FM SPECIALIZATIONS - Choose Your Niche */}
            <Card className="border-2 border-gold-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gold-500 to-gold-600 p-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Choose Your Specialization Niche
                    </h2>
                    <p className="text-gold-100 text-sm">All 10 FM specializations are covered in Step 1. Choose what to focus on.</p>
                </div>
                <CardContent className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {FM_SPECIALIZATIONS.slice(0, 10).map((spec) => {
                            const SpecIcon = spec.icon === "Apple" ? Apple :
                                spec.icon === "Leaf" ? Leaf :
                                spec.icon === "Heart" ? Heart :
                                spec.icon === "Brain" ? Brain :
                                spec.icon === "Zap" ? Zap :
                                spec.icon === "TrendingUp" ? TrendingUp :
                                spec.icon === "Shield" ? Shield :
                                spec.icon === "Moon" ? Moon :
                                spec.icon === "Droplets" ? Droplets : Target;

                            return (
                                <div
                                    key={spec.id}
                                    className={`relative p-3 rounded-xl border-2 ${spec.borderColor} ${spec.bgColor} hover:shadow-md transition-all cursor-pointer group`}
                                >
                                    <div className="absolute -top-2 -left-2 w-5 h-5 bg-burgundy-600 rounded-full flex items-center justify-center text-white font-bold text-[10px] shadow">
                                        {spec.rank}
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${spec.gradient} flex items-center justify-center`}>
                                            <SpecIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <Badge className={`text-[9px] ${spec.bgColor} ${spec.textColor} border-0`}>
                                            {spec.badge}
                                        </Badge>
                                    </div>
                                    <h4 className="font-bold text-xs text-gray-900 mb-1 line-clamp-1">{spec.shortTitle}</h4>
                                    <p className="text-[10px] text-gray-500 line-clamp-2">{spec.description}</p>
                                    <div className="mt-2 pt-2 border-t border-gray-200 flex items-center justify-between">
                                        <span className={`text-[10px] font-medium ${spec.textColor}`}>{spec.marketDemand}</span>
                                        <span className="text-[10px] text-green-600 font-semibold">{spec.incomeRange.split(" - ")[0]}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-4">
                        Step 1 covers all these specializations. Master the core, then go deep in your chosen niche.
                    </p>
                </CardContent>
            </Card>

            {/* STEP 1 - THE MAIN COURSE (Featured) */}
            {track.steps?.[0] && (
                <Card className="border-2 border-gold-400 shadow-xl overflow-hidden bg-gradient-to-br from-white to-gold-50">
                    <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 p-5 text-white">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gold-400 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-burgundy-900">1</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className="bg-gold-400 text-burgundy-900 font-bold">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            START HERE
                                        </Badge>
                                    </div>
                                    <h2 className="text-2xl font-bold">{track.steps[0].name}</h2>
                                    <p className="text-white/80">{track.steps[0].tagline}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-gold-400">{track.steps[0].price}</p>
                                <p className="text-sm text-white/70">{track.steps[0].accessNote}</p>
                            </div>
                        </div>
                    </div>

                    <CardContent className="p-6">
                        <div className="grid lg:grid-cols-3 gap-6">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-5">
                                {/* Question it answers */}
                                {track.steps[0].questionItAnswers && (
                                    <div className="p-3 bg-burgundy-50 rounded-lg border border-burgundy-100 inline-flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-burgundy-500" />
                                        <span className="text-sm text-burgundy-700 font-medium">Question it answers: "{track.steps[0].questionItAnswers}"</span>
                                    </div>
                                )}

                                {/* What You'll Achieve */}
                                <div className="p-4 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-xl border border-burgundy-100">
                                    <p className="text-burgundy-800 font-medium">
                                        <span className="font-bold">After completing this course:</span> "{track.steps[0].represents}"
                                    </p>
                                </div>

                                {/* Course Structure */}
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border shadow-sm">
                                        <BookOpen className="w-5 h-5 text-burgundy-600" />
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{track.steps[0].structure?.modules}</p>
                                            <p className="text-xs text-gray-500">Modules</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border shadow-sm">
                                        <Play className="w-5 h-5 text-burgundy-600" />
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{track.steps[0].structure?.lessons}</p>
                                            <p className="text-xs text-gray-500">Lessons</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border shadow-sm">
                                        <Award className="w-5 h-5 text-gold-500" />
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Certification</p>
                                            <p className="text-xs text-gray-500">Included</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Core Professional Training (3 buckets) */}
                                {track.steps[0].coreTraining && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">Core Professional Training</h4>
                                        <ul className="space-y-2">
                                            {track.steps[0].coreTraining.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-4">
                                {/* Income Vision */}
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                    <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
                                        <DollarSign className="w-4 h-4" />
                                        Income Potential
                                    </h5>
                                    <p className="text-2xl font-bold text-green-600">{track.steps[0].incomeVision?.starting}</p>
                                    <p className="text-sm text-green-700">{track.steps[0].incomeVision?.note}</p>
                                </div>

                                {/* CTA */}
                                {track.steps[0].isEnrolled ? (
                                    <Link href={`/courses/${track.steps[0].slug}`}>
                                        <Button className="w-full h-12 bg-burgundy-600 hover:bg-burgundy-700">
                                            <Play className="w-4 h-4 mr-2" />
                                            Continue Learning
                                        </Button>
                                    </Link>
                                ) : track.steps[0].status === "available" ? (
                                    <Link href={`/courses/${track.steps[0].slug}`}>
                                        <Button className="w-full h-12 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 shadow-lg">
                                            <Rocket className="w-4 h-4 mr-2" />
                                            Start Your Journey
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button disabled className="w-full h-12">Not Available</Button>
                                )}

                                <p className="text-xs text-center text-burgundy-600 font-medium">
                                    {track.steps[0].ctaText}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Steps 2, 3, 4 - Full Detail Cards */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <ChevronDown className="w-5 h-5 text-burgundy-600" />
                    Continue Your Growth After Step 1
                </h3>

                {track.steps?.slice(1).map((step: any, index: number) => {
                    const isLaunching = step.status === "launching";
                    const stepNumber = index + 2;

                    return (
                        <Card
                            key={index}
                            className={`overflow-hidden transition-all ${
                                isLaunching
                                    ? "border-2 border-blue-300 shadow-lg"
                                    : `border-2 shadow-lg ${getStepBgLight(stepNumber)}`
                            }`}
                        >
                            {/* Header */}
                            <div className={`p-5 ${isLaunching ? "bg-gradient-to-r from-blue-500 to-blue-600" : `bg-gradient-to-r ${getStepGradient(stepNumber)}`} text-white`}>
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                                            <span className="text-2xl font-bold">{step.step}</span>
                                        </div>
                                        <div>
                                            {isLaunching && (
                                                <Badge className="bg-white/20 text-white border-white/30 mb-1">Launching Soon</Badge>
                                            )}
                                            <h2 className="text-2xl font-bold">{step.name}</h2>
                                            <p className="text-white/80">{step.tagline}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-bold">{step.price}</p>
                                        <p className="text-sm text-white/70">{step.accessNote}</p>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                <div className="grid lg:grid-cols-3 gap-6">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-5">
                                        {/* Question it answers */}
                                        {step.questionItAnswers && (
                                            <div className={`p-3 rounded-lg border inline-flex items-center gap-2 ${
                                                isLaunching ? "bg-blue-50 border-blue-100" : getStepBgLight(stepNumber)
                                            }`}>
                                                <HelpCircle className={`w-4 h-4 ${isLaunching ? "text-blue-500" : getStepTextColor(stepNumber)}`} />
                                                <span className={`text-sm font-medium ${isLaunching ? "text-blue-700" : getStepTextColor(stepNumber)}`}>
                                                    Question it answers: "{step.questionItAnswers}"
                                                </span>
                                            </div>
                                        )}

                                        {/* What You'll Achieve */}
                                        <div className={`p-4 rounded-xl border ${
                                            isLaunching
                                                ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100"
                                                : "bg-gradient-to-r from-burgundy-50 to-gold-50 border-burgundy-100"
                                        }`}>
                                            <p className={`font-medium ${isLaunching ? "text-blue-800" : "text-burgundy-800"}`}>
                                                <span className="font-bold">After completing this step:</span> "{step.represents}"
                                            </p>
                                        </div>

                                        {/* Course Structure */}
                                        {step.structure && (
                                            <div className="flex flex-wrap gap-4">
                                                {step.structure.modules && (
                                                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border shadow-sm">
                                                        <BookOpen className={`w-5 h-5 ${isLaunching ? "text-blue-600" : getStepTextColor(stepNumber)}`} />
                                                        <div>
                                                            <p className="text-2xl font-bold text-gray-900">{step.structure.modules}</p>
                                                            <p className="text-xs text-gray-500">Modules</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {step.structure.lessons && (
                                                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border shadow-sm">
                                                        <Play className={`w-5 h-5 ${isLaunching ? "text-blue-600" : getStepTextColor(stepNumber)}`} />
                                                        <div>
                                                            <p className="text-2xl font-bold text-gray-900">{step.structure.lessons}</p>
                                                            <p className="text-xs text-gray-500">Lessons</p>
                                                        </div>
                                                    </div>
                                                )}
                                                {step.structure.format && (
                                                    <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg border shadow-sm">
                                                        <Users className={`w-5 h-5 ${getStepTextColor(stepNumber)}`} />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{step.structure.format}</p>
                                                            <p className="text-xs text-gray-500">{step.structure.duration}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Ethical Frame for Step 2 */}
                                        {step.ethicalFrame && (
                                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                                <p className="text-sm text-amber-800 mb-3">{step.ethicalFrame.intro}</p>
                                                <p className="text-xs text-amber-700 mb-2">You are guided to build a practice that is:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {step.ethicalFrame.values.map((v: string, i: number) => (
                                                        <Badge key={i} className="bg-amber-100 text-amber-800 border-amber-300">
                                                            <CheckCircle className="w-3 h-3 mr-1" />
                                                            {v}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Strategic Note for Step 3 */}
                                        {step.strategicNote && (
                                            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                <p className="text-sm text-blue-700 font-medium">{step.strategicNote}</p>
                                            </div>
                                        )}

                                        {/* Core Professional Training */}
                                        {step.coreTraining && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                                    {step.isDoneForYou ? "Core Pillars" : "Core Professional Training"}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {step.coreTraining.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Advanced + Master Split for Step 3 */}
                                        {step.advancedIncludes && step.masterIncludes && (
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                    <h5 className="font-semibold text-blue-800 mb-2 text-sm">
                                                        ADVANCED TRACK ({step.structure?.advanced})
                                                    </h5>
                                                    <ul className="space-y-1">
                                                        {step.advancedIncludes.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-blue-700">
                                                                <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                                    <h5 className="font-semibold text-purple-800 mb-2 text-sm">
                                                        MASTER TRACK ({step.structure?.master})
                                                    </h5>
                                                    <ul className="space-y-1">
                                                        {step.masterIncludes.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-sm text-purple-700">
                                                                <CheckCircle className="w-3.5 h-3.5 text-purple-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mentorship Includes for Step 4 */}
                                        {step.mentorshipIncludes && (
                                            <div className="grid sm:grid-cols-3 gap-4">
                                                <div className="p-4 bg-burgundy-50 rounded-xl border border-burgundy-200">
                                                    <h5 className="font-semibold text-burgundy-800 mb-2 text-sm">DONE-FOR-YOU</h5>
                                                    <ul className="space-y-1">
                                                        {step.mentorshipIncludes.doneForYou.slice(0, 4).map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs text-burgundy-700">
                                                                <CheckCircle className="w-3 h-3 text-burgundy-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="p-4 bg-gold-50 rounded-xl border border-gold-200">
                                                    <h5 className="font-semibold text-gold-800 mb-2 text-sm">STRATEGY</h5>
                                                    <ul className="space-y-1">
                                                        {step.mentorshipIncludes.strategy.slice(0, 4).map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs text-gold-700">
                                                                <CheckCircle className="w-3 h-3 text-gold-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                                    <h5 className="font-semibold text-green-800 mb-2 text-sm">SUPPORT</h5>
                                                    <ul className="space-y-1">
                                                        {step.mentorshipIncludes.support.map((item: string, i: number) => (
                                                            <li key={i} className="flex items-center gap-2 text-xs text-green-700">
                                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {/* What's Included */}
                                        {step.whatHappensHere && !step.mentorshipIncludes && (
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    What's Included
                                                </h4>
                                                <ul className="grid sm:grid-cols-2 gap-2">
                                                    {step.whatHappensHere.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Ideal For (Step 4) */}
                                        {step.idealFor && (
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <h5 className="font-semibold text-gray-800 mb-2 text-sm">IDEAL FOR</h5>
                                                <ul className="space-y-1">
                                                    {step.idealFor.map((item: string, i: number) => (
                                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Target className="w-3.5 h-3.5 text-burgundy-500" />
                                                            {item}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-4">
                                        {/* Income Vision */}
                                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                            <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
                                                <DollarSign className="w-4 h-4" />
                                                Income Potential
                                            </h5>
                                            {step.incomeVision?.starting && (
                                                <p className="text-2xl font-bold text-green-600">{step.incomeVision.starting}</p>
                                            )}
                                            {step.incomeVision?.advanced && (
                                                <>
                                                    <p className="text-sm text-green-700">Advanced: <span className="font-bold">{step.incomeVision.advanced}</span></p>
                                                    <p className="text-sm text-green-700">Master: <span className="font-bold">{step.incomeVision.master}</span></p>
                                                </>
                                            )}
                                            {step.incomeVision?.primary && (
                                                <p className="text-2xl font-bold text-green-600">{step.incomeVision.primary}</p>
                                            )}
                                            {step.incomeVision?.potential && (
                                                <p className="text-sm text-green-700">Potential: <span className="font-bold">{step.incomeVision.potential}</span></p>
                                            )}
                                            {step.incomeVision?.note && (
                                                <p className="text-sm text-green-700 mt-1">{step.incomeVision.note}</p>
                                            )}
                                        </div>

                                        {/* CTA */}
                                        {step.isDoneForYou ? (
                                            <Link href="/messages?coach=sarah" className="block">
                                                <Button className="w-full h-12 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 shadow-lg">
                                                    <MessageCircle className="w-4 h-4 mr-2" />
                                                    Apply for Mentorship
                                                </Button>
                                            </Link>
                                        ) : step.status === "locked" || step.requiresStep1 ? (
                                            <Button className="w-full h-12 bg-gray-300 text-gray-600 cursor-not-allowed" disabled>
                                                <Lock className="w-4 h-4 mr-2" />
                                                Complete Step 1 First
                                            </Button>
                                        ) : isLaunching ? (
                                            <Button className="w-full h-12 bg-blue-500 hover:bg-blue-600" disabled>
                                                Launching Soon
                                            </Button>
                                        ) : step.isEnrolled ? (
                                            <Link href={`/courses/${step.slug}`}>
                                                <Button className="w-full h-12 bg-burgundy-600 hover:bg-burgundy-700">
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Continue Learning
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href={`/courses/${step.slug}`}>
                                                <Button className={`w-full h-12 bg-gradient-to-r ${getStepGradient(stepNumber)} shadow-lg`}>
                                                    <Rocket className="w-4 h-4 mr-2" />
                                                    Get Started
                                                </Button>
                                            </Link>
                                        )}

                                        {step.ctaText && (
                                            <p className={`text-xs text-center font-medium ${isLaunching ? "text-blue-600" : getStepTextColor(stepNumber)}`}>
                                                {step.ctaText}
                                            </p>
                                        )}

                                        {/* Scaling Models for Step 4 */}
                                        {step.scalingModels && (
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <h5 className="font-semibold text-gray-800 mb-3 text-sm">SCALING MODELS</h5>
                                                <div className="space-y-3">
                                                    {step.scalingModels.map((model: any, i: number) => (
                                                        <div key={i} className="pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                                                            <p className="font-medium text-gray-900 text-sm">{model.model}</p>
                                                            <p className="text-xs text-gray-500">{model.description}</p>
                                                            <p className="text-xs text-green-600 font-medium">{model.potential}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Done-For-You CTA */}
            {track.doneForYou && (
                <Card className="bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 border-0 text-white overflow-hidden">
                    <CardContent className="p-8 relative">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center md:text-left">
                                <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-3">DONE-FOR-YOU</Badge>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">{track.doneForYou.title}</h3>
                                <p className="text-burgundy-100 mb-4">{track.doneForYou.description}</p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    {track.doneForYou.features.map((f: string, i: number) => (
                                        <Badge key={i} className="bg-white/10 text-white border-white/20">
                                            <CheckCircle className="w-3 h-3 mr-1" /> {f}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <a href={track.doneForYou.ctaLink || "#"} target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 shadow-lg font-semibold">
                                    {track.doneForYou.cta}
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Success Stories with Step Labels and Star Ratings */}
            {track.testimonials && track.testimonials.length > 0 && (
                <section>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
                        What Our Students Achieve
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {track.testimonials.map((testimonial: any, i: number) => (
                            <Card key={i} className="border hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                    {/* Step Label */}
                                    {testimonial.stepLabel && (
                                        <Badge variant="outline" className="mb-3 text-xs border-burgundy-200 text-burgundy-600">
                                            {testimonial.stepLabel}
                                        </Badge>
                                    )}

                                    {/* Star Rating */}
                                    {testimonial.rating && (
                                        <div className="flex mb-2">
                                            {[...Array(5)].map((_, idx) => (
                                                <Star key={idx} className={`w-3.5 h-3.5 ${idx < testimonial.rating ? "text-gold-400 fill-gold-400" : "text-gray-200"}`} />
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">"{testimonial.quote}"</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                                                <p className="text-xs text-gray-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                        {testimonial.income && (
                                            <Badge className="bg-green-100 text-green-700 text-xs font-semibold">
                                                {testimonial.income}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}

            {/* Final CTA - Calm Close */}
            <Card className={`bg-gradient-to-r ${track.gradient} border-0 text-white overflow-hidden`}>
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Coach Info */}
                        {track.coach && (
                            <div className="flex items-center gap-4 md:flex-1">
                                {track.coach.avatar ? (
                                    <Image
                                        src={track.coach.avatar}
                                        alt={track.coach.name}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gold-400/50 flex-shrink-0"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 border-2 border-gold-400/50">
                                        {track.coach.name.split(' ').map((n: string) => n[0]).join('')}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gold-300 font-medium">YOUR INSTRUCTOR</p>
                                    <p className="font-bold text-lg">{track.coach.name}</p>
                                    <p className="text-sm text-white/80">{track.coach.title}</p>
                                </div>
                            </div>
                        )}

                        <div className="hidden md:block w-px h-16 bg-white/20" />

                        {/* Calm Close CTA */}
                        <div className="text-center md:text-right">
                            <p className="text-lg font-semibold mb-1">Your Next Step</p>
                            <p className="text-sm text-white/70 mb-4">Every professional starts at Step 1. Everything else unlocks from there.</p>
                            {track.steps?.[0]?.status === "available" ? (
                                <Link href={`/courses/${track.steps[0].slug}`}>
                                    <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-300 font-semibold shadow-lg">
                                        Begin Step 1 Now
                                    </Button>
                                </Link>
                            ) : (
                                <Button size="lg" disabled className="bg-white/20 text-white">
                                    Not Available
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
