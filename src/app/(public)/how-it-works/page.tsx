import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import {
    GraduationCap,
    Award,
    Trophy,
    ArrowRight,
    CheckCircle,
    Clock,
    BookOpen,
    Users,
    Target,
    Briefcase,
    FileText,
    Shield,
    Star,
    Sparkles,
} from "lucide-react";

export const metadata = {
    title: "How It Works | AccrediPro Standards Institute",
    description: "Learn how to become a certified professional. Our 3-tier certification pathway from Foundation to Board Certified explained step by step.",
    openGraph: {
        title: "How ASI Certification Works",
        description: "Your pathway to becoming a certified health and wellness professional.",
    },
};

const steps = [
    {
        number: 1,
        title: "Choose Your Path",
        description: "Select from our range of specialty certifications based on your interests and career goals.",
        icon: Target,
    },
    {
        number: 2,
        title: "Complete Training",
        description: "Study through our comprehensive online curriculum with video lessons, resources, and mentorship.",
        icon: BookOpen,
    },
    {
        number: 3,
        title: "Pass Your Exam",
        description: "Demonstrate your knowledge through our rigorous but fair certification examination.",
        icon: FileText,
    },
    {
        number: 4,
        title: "Get Certified",
        description: "Receive your credential, digital badge, and listing in the ASI Professional Directory.",
        icon: Award,
    },
    {
        number: 5,
        title: "Start Practicing",
        description: "Begin helping clients with your new skills and recognized certification.",
        icon: Briefcase,
    },
    {
        number: 6,
        title: "Grow & Renew",
        description: "Continue learning through CE credits and advance to higher certification levels.",
        icon: Sparkles,
    },
];

const tiers = [
    {
        level: "Tier 1",
        name: "Foundation Certificate",
        abbrev: "FC™",
        tagline: "Start Your Journey",
        icon: GraduationCap,
        color: "from-blue-500 to-blue-600",
        borderColor: "border-blue-200",
        hours: "25+ hours",
        duration: "4-6 weeks",
        exam: "Knowledge Assessment",
        renewal: "Lifetime (no renewal)",
        price: "$397",
        outcomes: [
            "Foundational knowledge in specialty",
            "Digital credential badge",
            "Pathway to professional certification",
        ],
        cta: "Perfect for career explorers",
    },
    {
        level: "Tier 2",
        name: "Certified Professional",
        abbrev: "CP™",
        tagline: "Practice Professionally",
        icon: Award,
        color: "from-burgundy-600 to-burgundy-700",
        borderColor: "border-burgundy-200",
        hours: "75+ hours",
        duration: "3-6 months",
        exam: "Proctored Examination",
        renewal: "20 CE credits / 2 years",
        price: "$2,497",
        popular: true,
        outcomes: [
            "Authority to practice with clients",
            "Insurance eligibility",
            "ASI Directory listing",
            "Use of credential letters",
        ],
        cta: "For serious practitioners",
    },
    {
        level: "Tier 3",
        name: "Board Certified",
        abbrev: "BC-™",
        tagline: "Lead & Mentor",
        icon: Trophy,
        color: "from-gold-500 to-gold-600",
        borderColor: "border-gold-200",
        hours: "150+ hours",
        duration: "6-12 months",
        exam: "Board Examination",
        renewal: "40 CE credits / 2 years",
        price: "$7,997",
        outcomes: [
            "Highest credential level",
            "Practice ownership training",
            "Featured directory listing",
            "Mentor and teach others",
        ],
        cta: "For practice owners",
    },
];

const specialties = [
    "Functional Medicine",
    "Health Coaching",
    "Nutrition Coaching",
    "Gut Health",
    "Hormone Health",
    "Women's Health",
    "Weight Management",
    "Mental Wellness",
];

export default function HowItWorksPage() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-burgundy-50 via-white to-gold-50 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy-100 rounded-full blur-3xl opacity-50" />
                <div className="relative max-w-5xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        Your Path to Certification
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        How It <span className="text-burgundy-600">Works</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                        From enrollment to certification and beyond—here's your complete journey
                        to becoming a recognized health and wellness professional.
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
                            The Process
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                            6 Steps to Certification
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {steps.map((step) => (
                            <div key={step.number} className="relative">
                                <div className="bg-gray-50 rounded-2xl p-8 h-full hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-burgundy-600 rounded-xl flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">{step.number}</span>
                                        </div>
                                        <step.icon className="w-8 h-8 text-burgundy-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Certification Tiers */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
                            Choose Your Level
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Three Certification Tiers
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Progress through our credential framework from Foundation to Board Certified.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`relative bg-white rounded-2xl overflow-hidden shadow-lg ${tier.popular ? "ring-2 ring-burgundy-600 lg:scale-105" : ""
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="absolute top-0 left-0 right-0 bg-burgundy-600 text-white text-center py-2 text-sm font-semibold">
                                        <Star className="w-4 h-4 inline mr-1" /> Most Popular
                                    </div>
                                )}
                                <div className={`bg-gradient-to-br ${tier.color} p-8 ${tier.popular ? "mt-8" : ""}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-white/70 text-sm font-medium">{tier.level}</p>
                                            <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                                        </div>
                                        <tier.icon className="w-12 h-12 text-white/80" />
                                    </div>
                                    <p className="text-white/90 font-mono text-lg">{tier.abbrev}</p>
                                    <p className="text-white/70 text-sm mt-2">{tier.tagline}</p>
                                </div>
                                <div className="p-8">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                            <p className="text-xs text-gray-500">Duration</p>
                                            <p className="text-sm font-semibold text-gray-900">{tier.duration}</p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                                            <BookOpen className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                            <p className="text-xs text-gray-500">Training</p>
                                            <p className="text-sm font-semibold text-gray-900">{tier.hours}</p>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-8">
                                        {tier.outcomes.map((outcome, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-gray-600">{outcome}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-xs text-gray-500 text-center mb-4">
                                        {tier.cta}
                                    </p>

                                    <Link href="/fm-course-certification" className="block">
                                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                            Learn More <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specialties */}
            <section className="py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
                            Specializations
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                            Available Specialty Tracks
                        </h2>
                        <p className="text-gray-600">
                            Choose from our growing catalog of certification specialties.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {specialties.map((specialty) => (
                            <span
                                key={specialty}
                                className="px-5 py-3 bg-gray-100 rounded-full text-gray-700 font-medium hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors cursor-pointer"
                            >
                                {specialty}
                            </span>
                        ))}
                        <span className="px-5 py-3 bg-burgundy-100 rounded-full text-burgundy-700 font-medium">
                            + More Coming
                        </span>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-burgundy-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Shield className="w-16 h-16 text-gold-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-burgundy-100 mb-8 text-lg">
                        Join thousands of certified professionals making a difference.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/fm-course-certification">
                            <Button size="lg" className="bg-white text-burgundy-700 hover:bg-gray-100">
                                Explore Programs <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                                Talk to Admissions
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
