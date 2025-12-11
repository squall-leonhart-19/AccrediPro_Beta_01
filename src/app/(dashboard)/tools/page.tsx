import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Lock,
    Unlock,
    Wrench,
    FileText,
    Sparkles,
    Target,
    BookOpen,
    Palette,
    Calculator,
    MessageSquare,
    Calendar,
    Users,
    ClipboardList,
    ArrowRight,
    Zap,
    Star,
} from "lucide-react";

// Define all available tools
const allTools = [
    {
        id: "protocol-builder",
        name: "Protocol Builder",
        description: "Create custom health protocols for your clients",
        icon: ClipboardList,
        category: "Coach Tools",
        unlockMethod: "DFY Marketplace",
    },
    {
        id: "intake-forms",
        name: "Client Intake Forms",
        description: "Professional intake form templates (PDF pack)",
        icon: FileText,
        category: "Client Tools",
        unlockMethod: "DFY Marketplace",
    },
    {
        id: "worksheets",
        name: "Coaching Worksheets",
        description: "Goal-setting and tracking worksheets",
        icon: BookOpen,
        category: "Client Tools",
        unlockMethod: "DFY Marketplace",
    },
    {
        id: "program-builder",
        name: "Program Builder",
        description: "Build your signature 12-week program",
        icon: Target,
        category: "Coach Tools",
        unlockMethod: "Premium Subscription",
    },
    {
        id: "ai-meal-planner",
        name: "AI Meal Plan Generator",
        description: "AI-powered meal planning for clients",
        icon: Zap,
        category: "AI Tools",
        unlockMethod: "Premium Subscription",
    },
    {
        id: "ai-session-notes",
        name: "AI Session Notes",
        description: "Auto-generate session summaries",
        icon: MessageSquare,
        category: "AI Tools",
        unlockMethod: "Premium Subscription",
    },
    {
        id: "brand-kit",
        name: "Branding Kit",
        description: "Logo templates, color palettes, social media kit",
        icon: Palette,
        category: "Business Tools",
        unlockMethod: "DFY Marketplace",
    },
    {
        id: "pricing-calculator",
        name: "Pricing & Offer Calculator",
        description: "Calculate optimal pricing for your services",
        icon: Calculator,
        category: "Business Tools",
        unlockMethod: "Free with Certification",
    },
    {
        id: "client-scheduler",
        name: "Client Scheduler",
        description: "Booking and scheduling integration",
        icon: Calendar,
        category: "Business Tools",
        unlockMethod: "Premium Subscription",
    },
    {
        id: "dfy-gut-protocol",
        name: "DFY Gut Reset Protocol",
        description: "Ready-to-use 30-day gut health protocol",
        icon: Star,
        category: "DFY Programs",
        unlockMethod: "DFY Marketplace - $47",
    },
    {
        id: "dfy-hormone-bundle",
        name: "DFY Hormone Balance Bundle",
        description: "Complete hormone health program package",
        icon: Star,
        category: "DFY Programs",
        unlockMethod: "DFY Marketplace - $97",
    },
    {
        id: "client-portal",
        name: "Client Portal Access",
        description: "Give clients their own login to track progress",
        icon: Users,
        category: "Coach Tools",
        unlockMethod: "Premium Subscription",
    },
];

// Group tools by category
function groupByCategory(tools: typeof allTools) {
    const groups: Record<string, typeof allTools> = {};
    tools.forEach(tool => {
        if (!groups[tool.category]) {
            groups[tool.category] = [];
        }
        groups[tool.category].push(tool);
    });
    return groups;
}

export default async function ToolsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    // TODO: In future, fetch user's unlocked tools from database
    // For now, mock with empty array (no tools unlocked)
    const unlockedToolIds: string[] = [];

    const unlockedTools = allTools.filter(t => unlockedToolIds.includes(t.id));
    const lockedTools = allTools.filter(t => !unlockedToolIds.includes(t.id));
    const groupedLockedTools = groupByCategory(lockedTools);

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
                            <Wrench className="w-3 h-3 mr-1" />
                            Tools & Templates
                        </Badge>
                        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                            Your Coaching Toolkit
                        </h1>
                        <p className="text-burgundy-100 text-lg">
                            All your coaching tools, resources, and templates will appear here as you unlock them.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Unlocked Tools Section */}
            {unlockedTools.length > 0 ? (
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <Unlock className="w-6 h-6 text-green-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Your Unlocked Tools</h2>
                        <Badge className="bg-green-100 text-green-700">{unlockedTools.length} tools</Badge>
                    </div>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {unlockedTools.map((tool) => (
                            <Card key={tool.id} className="card-premium hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-5">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                        <tool.icon className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">{tool.name}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{tool.description}</p>
                                    <Button size="sm" className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                                        Open Tool
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <Card className="card-premium bg-gradient-to-br from-gray-50 to-white">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <Wrench className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tools Unlocked Yet</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Start your coaching journey by completing certifications or exploring DFY resources to unlock your first tools.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link href="/courses">
                                <Button variant="outline">Browse Certifications</Button>
                            </Link>
                            <Link href="/dfy-resources">
                                <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                    Explore DFY Marketplace
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Locked Tools Section */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-6 h-6 text-gray-400" />
                    <h2 className="text-2xl font-bold text-gray-900">Available Tools to Unlock</h2>
                </div>

                {Object.entries(groupedLockedTools).map(([category, tools]) => (
                    <div key={category} className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">{category}</h3>
                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tools.map((tool) => (
                                <Card key={tool.id} className="card-premium opacity-60 hover:opacity-80 transition-opacity">
                                    <CardContent className="p-5 relative">
                                        <div className="absolute top-3 right-3">
                                            <Lock className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 grayscale">
                                            <tool.icon className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="font-semibold text-gray-700 mb-1">{tool.name}</h3>
                                        <p className="text-sm text-gray-400 mb-3">{tool.description}</p>
                                        <Badge variant="outline" className="text-xs text-gray-500">
                                            {tool.unlockMethod}
                                        </Badge>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <Card className="bg-gradient-to-r from-gold-50 to-amber-50 border-gold-200">
                <CardContent className="p-8 text-center">
                    <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Your Full Toolkit</h2>
                    <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                        Get instant access to done-for-you protocols, templates, and AI tools to accelerate your coaching business.
                    </p>
                    <Link href="/dfy-resources">
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                            Visit DFY Marketplace
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
