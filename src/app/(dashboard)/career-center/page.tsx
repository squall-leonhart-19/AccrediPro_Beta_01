import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
    Briefcase,
    TrendingUp,
    Award,
    Star,
    Users,
    DollarSign,
    ArrowRight,
    CheckCircle,
    Target,
    Sparkles,
    GraduationCap,
    Heart,
    Zap,
    BookOpen,
    Trophy,
} from "lucide-react";

const careerTracks = [
    {
        id: "health-coach",
        title: "Certified Health Coach",
        description: "Help clients achieve optimal health through nutrition and lifestyle changes",
        icon: Heart,
        color: "burgundy",
        income: "$50K - $120K",
        duration: "6-12 months",
        certifications: ["Health Coach Certification", "Gut Health Specialist"],
        skills: ["Client Assessment", "Nutrition Planning", "Behavior Change"],
    },
    {
        id: "nutrition-specialist",
        title: "Nutrition Specialist",
        description: "Specialize in dietary planning and nutritional interventions",
        icon: Zap,
        color: "emerald",
        income: "$60K - $150K",
        duration: "8-14 months",
        certifications: ["Nutrition Certification", "Sports Nutrition"],
        skills: ["Meal Planning", "Supplement Guidance", "Lab Analysis"],
    },
    {
        id: "wellness-entrepreneur",
        title: "Wellness Entrepreneur",
        description: "Build your own coaching business and brand",
        icon: Briefcase,
        color: "purple",
        income: "$80K - $250K+",
        duration: "12-18 months",
        certifications: ["Business Accelerator", "Marketing Mastery"],
        skills: ["Business Strategy", "Marketing", "Team Building"],
    },
];

const incomeOpportunities = [
    { level: "Part-Time Coach", range: "$1K - $3K/month", description: "5-10 clients, flexible hours" },
    { level: "Full-Time Coach", range: "$5K - $10K/month", description: "15-25 clients, full practice" },
    { level: "Group Programs", range: "$10K - $25K/month", description: "Courses + group coaching" },
    { level: "Agency Owner", range: "$25K - $100K+/month", description: "Team of coaches, multiple programs" },
];

const successStories = [
    {
        name: "Sarah M.",
        role: "Health Coach",
        image: null,
        quote: "I went from $0 to $8K/month in just 6 months following the AccrediPro system.",
        income: "$96K/year",
    },
    {
        name: "Michael T.",
        role: "Nutrition Specialist",
        image: null,
        quote: "The certifications gave me credibility. Now I have a waitlist of clients!",
        income: "$150K/year",
    },
    {
        name: "Lisa R.",
        role: "Wellness Entrepreneur",
        image: null,
        quote: "Built a team of 5 coaches. AccrediPro changed my life completely.",
        income: "$300K+/year",
    },
];

export default async function CareerCenterPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero */}
            <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-purple-700 border-0 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                </div>
                <CardContent className="p-8 lg:p-10 relative">
                    <div className="max-w-2xl">
                        <Badge className="bg-gold-400/20 text-gold-200 mb-4">
                            <Briefcase className="w-3 h-3 mr-1" />
                            Career Center
                        </Badge>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Build Your Dream Career in Wellness
                        </h1>
                        <p className="text-burgundy-100 text-lg mb-6">
                            Discover career paths, income opportunities, and the exact steps to become a successful certified coach.
                        </p>
                        <div className="flex gap-3">
                            <Link href="/roadmap">
                                <Button className="bg-gold-400 text-burgundy-900 hover:bg-gold-500">
                                    View My Roadmap
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/courses">
                                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                                    Browse Certifications
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Career Tracks */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-6 h-6 text-burgundy-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Career Tracks</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {careerTracks.map((track) => (
                        <Card key={track.id} className="card-premium hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className={`w-14 h-14 rounded-2xl bg-${track.color}-100 flex items-center justify-center mb-4`}>
                                    <track.icon className={`w-7 h-7 text-${track.color}-600`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{track.title}</h3>
                                <p className="text-gray-500 text-sm mb-4">{track.description}</p>

                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Income Potential</span>
                                        <span className="font-semibold text-green-600">{track.income}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-500">Timeline</span>
                                        <span className="font-medium text-gray-900">{track.duration}</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-xs font-medium text-gray-500 mb-2">Required Certifications:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {track.certifications.map((cert) => (
                                            <Badge key={cert} variant="outline" className="text-xs">
                                                {cert}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                    Start This Track
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Income Possibilities */}
            <Card className="card-premium">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <DollarSign className="w-6 h-6 text-green-600" />
                        <h2 className="text-xl font-bold text-gray-900">Income Possibilities</h2>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                        {incomeOpportunities.map((opp, index) => (
                            <div key={opp.level} className="relative">
                                {index < incomeOpportunities.length - 1 && (
                                    <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 z-10">
                                        <ArrowRight className="w-5 h-5 text-gray-300" />
                                    </div>
                                )}
                                <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 h-full">
                                    <Badge className="mb-2 bg-green-100 text-green-700">{opp.range}</Badge>
                                    <h4 className="font-semibold text-gray-900">{opp.level}</h4>
                                    <p className="text-sm text-gray-500 mt-1">{opp.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Success Stories */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Star className="w-6 h-6 text-gold-500" />
                    <h2 className="text-2xl font-bold text-gray-900">Success Stories</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {successStories.map((story) => (
                        <Card key={story.name} className="card-premium">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-burgundy-100 flex items-center justify-center">
                                        <Users className="w-6 h-6 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{story.name}</h4>
                                        <p className="text-sm text-gray-500">{story.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic mb-4">"{story.quote}"</p>
                                <Badge className="bg-green-100 text-green-700">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {story.income}
                                </Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* DFY Business Kits CTA */}
            <Card className="bg-gradient-to-r from-gold-50 to-amber-50 border-gold-200">
                <CardContent className="p-8 text-center">
                    <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Launch Faster?</h2>
                    <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                        Get done-for-you business kits, protocols, and templates to start your coaching practice immediately.
                    </p>
                    <Link href="/dfy-resources">
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                            Explore DFY Marketplace
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
