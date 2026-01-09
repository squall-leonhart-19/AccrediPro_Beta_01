import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeadCommunityPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Community</h1>

            {/* Introduce Yourself CTA */}
            <Card className="mb-6 border-2 border-burgundy-200 bg-gradient-to-r from-burgundy-50 to-white">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-burgundy-100 flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-burgundy-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-gray-900">Introduce Yourself!</h2>
                            <p className="text-gray-600 text-sm">
                                Join 1,520 other women who have introduced themselves to our community
                            </p>
                        </div>
                        <Link href="/community/cmj94foua0000736vfwdlheir">
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Say Hello
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Community Feed Preview */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-burgundy-600" />
                        <h2 className="font-semibold text-gray-900">Recent Discussions</h2>
                    </div>

                    {/* Preview posts */}
                    <div className="space-y-4">
                        {[
                            { author: "Jennifer M.", time: "2h ago", content: "Just finished Lesson 3 - the hormone section was eye-opening! 🎉" },
                            { author: "Lisa K.", time: "4h ago", content: "Booked my first consultation client today! $150 for 45 mins 💰" },
                            { author: "Maria T.", time: "1d ago", content: "The gut-hormone connection lesson changed how I think about my own health..." },
                        ].map((post, i) => (
                            <div key={i} className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center text-sm font-bold text-burgundy-600">
                                        {post.author[0]}
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-900">{post.author}</span>
                                        <span className="text-gray-400 text-sm ml-2">{post.time}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600">{post.content}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t text-center">
                        <Link href="/community">
                            <Button variant="outline" className="border-burgundy-200 text-burgundy-600">
                                View Full Community
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
