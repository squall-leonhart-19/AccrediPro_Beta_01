import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import {
    Briefcase,
    DollarSign,
    Clock,
    Users,
    ArrowRight,
    CheckCircle,
    TrendingUp,
    Heart,
    Building,
    Laptop,
    Globe,
    Award,
    Star,
} from "lucide-react";

export const metadata = {
    title: "Career Paths | AccrediPro Standards Institute",
    description: "Discover career opportunities with ASI certification. From private practice to corporate wellness, explore where your certification can take you.",
    openGraph: {
        title: "Career Paths for ASI Certified Professionals",
        description: "Explore career opportunities in health and wellness.",
    },
};

const careerPaths = [
    {
        title: "Private Practice Owner",
        icon: Building,
        description: "Start your own wellness practice helping clients one-on-one or in groups.",
        earnings: "$60,000 - $150,000+",
        workStyle: "Flexible, self-employed",
        credential: "FM-CP™ or BC-FMP™",
        skills: ["Client consultation", "Protocol development", "Business management"],
    },
    {
        title: "Health Coach",
        icon: Heart,
        description: "Coach clients on lifestyle changes, nutrition, and sustainable wellness habits.",
        earnings: "$45,000 - $85,000",
        workStyle: "Flexible, virtual or in-person",
        credential: "HC-CP™ or FM-CP™",
        skills: ["Behavior change", "Motivational interviewing", "Goal setting"],
    },
    {
        title: "Corporate Wellness Consultant",
        icon: Briefcase,
        description: "Design and implement wellness programs for companies and organizations.",
        earnings: "$70,000 - $120,000",
        workStyle: "B2B, contract or employed",
        credential: "FM-CP™ or BC-FMP™",
        skills: ["Program design", "Presentations", "ROI measurement"],
    },
    {
        title: "Telehealth Practitioner",
        icon: Laptop,
        description: "Serve clients remotely through virtual consultations and online programs.",
        earnings: "$50,000 - $100,000+",
        workStyle: "100% remote, global reach",
        credential: "Any CP™ credential",
        skills: ["Virtual consultation", "Digital marketing", "Online course creation"],
    },
    {
        title: "Wellness Retreat Facilitator",
        icon: Globe,
        description: "Lead health retreats and immersive wellness experiences.",
        earnings: "$40,000 - $100,000+",
        workStyle: "Seasonal, travel",
        credential: "FM-CP™, HN-CP™",
        skills: ["Group facilitation", "Event planning", "Holistic programming"],
    },
    {
        title: "Integrative Health Team Member",
        icon: Users,
        description: "Join a medical practice or clinic as part of an integrative health team.",
        earnings: "$55,000 - $90,000",
        workStyle: "Employed, clinic-based",
        credential: "FM-CP™ or BC-FMP™",
        skills: ["Collaborative care", "Case management", "Clinical protocols"],
    },
];

const successMetrics = [
    { value: "$68,000", label: "Average Year 1 Income" },
    { value: "6 months", label: "Avg Time to First Client" },
    { value: "85%", label: "Working in Field Within 1 Year" },
    { value: "92%", label: "Would Recommend Program" },
];

const journeySteps = [
    {
        step: 1,
        title: "Get Certified",
        description: "Complete your ASI certification program and pass your examination.",
        timeframe: "3-6 months",
    },
    {
        step: 2,
        title: "Define Your Niche",
        description: "Choose your specialty focus and ideal client profile.",
        timeframe: "Month 1-2",
    },
    {
        step: 3,
        title: "Launch Your Practice",
        description: "Set up your business, marketing, and client acquisition systems.",
        timeframe: "Month 2-3",
    },
    {
        step: 4,
        title: "Grow & Scale",
        description: "Expand your client base, add services, and increase your income.",
        timeframe: "Ongoing",
    },
];

export default function CareerPathsPage() {
    return (
        <PublicLayout>
            {/* Hero */}
            <section className="relative py-20 lg:py-28 bg-gradient-to-br from-burgundy-50 via-white to-gold-50 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-burgundy-100 rounded-full blur-3xl opacity-50" />
                <div className="relative max-w-5xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <TrendingUp className="w-4 h-4" />
                        Your Future Career
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        Career <span className="text-burgundy-600">Paths</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Discover where ASI certification can take you. From private practice
                        to corporate wellness, the opportunities are endless.
                    </p>
                </div>
            </section>

            {/* Success Metrics */}
            <section className="py-12 bg-burgundy-600">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {successMetrics.map((metric, i) => (
                            <div key={i}>
                                <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-1">
                                    {metric.value}
                                </div>
                                <div className="text-sm text-burgundy-200">{metric.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Career Paths Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
                            Opportunities
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                            Where Will Your Certification Take You?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {careerPaths.map((path, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-14 h-14 bg-burgundy-100 rounded-xl flex items-center justify-center mb-6">
                                    <path.icon className="w-7 h-7 text-burgundy-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                                <p className="text-gray-600 text-sm mb-6">{path.description}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3">
                                        <DollarSign className="w-4 h-4 text-green-600" />
                                        <span className="text-sm text-gray-700">{path.earnings}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-gray-700">{path.workStyle}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Award className="w-4 h-4 text-burgundy-600" />
                                        <span className="text-sm text-gray-700 font-mono">{path.credential}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Key Skills</p>
                                    <div className="flex flex-wrap gap-2">
                                        {path.skills.map((skill, j) => (
                                            <span
                                                key={j}
                                                className="text-xs bg-white px-2 py-1 rounded text-gray-600"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Your Journey */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
                            The Path Forward
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                            Your Journey to Success
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {journeySteps.map((step) => (
                            <div key={step.step} className="text-center">
                                <div className="w-12 h-12 bg-burgundy-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                                    {step.step}
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                                <p className="text-burgundy-600 text-xs font-medium">{step.timeframe}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-burgundy-600">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Star className="w-16 h-16 text-gold-400 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Start Building Your Future
                    </h2>
                    <p className="text-burgundy-100 mb-8 text-lg">
                        Join thousands of professionals who have transformed their careers
                        with ASI certification.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link href="/fm-course-certification">
                            <Button size="lg" className="bg-white text-burgundy-700 hover:bg-gray-100">
                                Get Certified <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        <Link href="/testimonials">
                            <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                                Read Success Stories
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
