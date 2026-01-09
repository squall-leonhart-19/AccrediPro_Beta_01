import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Megaphone, Pin, MessageSquare, Eye } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Get pinned posts only
async function getPinnedPosts() {
    return prisma.communityPost.findMany({
        where: { isPinned: true },
        select: {
            id: true,
            title: true,
            content: true,
            isPinned: true,
            viewCount: true,
            likeCount: true,
            reactions: true,
            categoryId: true,
            createdAt: true,
            author: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    role: true,
                },
            },
            _count: {
                select: {
                    comments: { where: { parentId: null } },
                    likes: true
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}

export default async function AnnouncementsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const posts = await getPinnedPosts();

    const formatDate = (date: Date) => {
        const d = new Date(date);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    const getInitials = (firstName?: string | null, lastName?: string | null) => {
        return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() || "U";
    };

    return (
        <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-[1200px] mx-auto px-1 sm:px-0">
            {/* MOBILE-FIRST Header */}
            <div className="flex flex-col gap-3">
                {/* Back button - full width on mobile */}
                <Link href="/community" className="w-fit">
                    <Button variant="outline" size="sm" className="gap-2 text-sm">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                </Link>

                {/* Title row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 sm:p-2 bg-burgundy-100 rounded-lg">
                            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-burgundy-600" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Announcements</h1>
                            <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">Important updates from the team</p>
                        </div>
                    </div>
                    <Badge className="bg-burgundy-100 text-burgundy-700 border-0 text-xs">
                        {posts.length}
                    </Badge>
                </div>
            </div>

            {/* Announcements List */}
            <div className="space-y-3 sm:space-y-4">
                {posts.length === 0 ? (
                    <Card className="p-8 sm:p-12 text-center">
                        <Megaphone className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-700">No announcements yet</h3>
                        <p className="text-gray-500 text-sm">Check back later for updates.</p>
                    </Card>
                ) : (
                    posts.map((post) => {
                        const reactions = (post.reactions as Record<string, number>) || {};
                        const activeReactions = Object.entries(reactions)
                            .filter(([_, count]) => count > 0)
                            .slice(0, 3); // Limit to 3 on mobile

                        return (
                            <Card key={post.id} className="overflow-hidden border border-burgundy-200">
                                {/* Compact Pinned Header */}
                                <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-600 px-3 sm:px-5 py-2 sm:py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-6 h-6 sm:w-8 sm:h-8 ring-1 ring-white/30">
                                            <AvatarImage src={post.author.avatar || "/coaches/sarah-coach.webp"} />
                                            <AvatarFallback className="bg-white/20 text-white text-[10px] sm:text-xs font-bold">
                                                {getInitials(post.author.firstName, post.author.lastName)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="text-white">
                                            <span className="font-medium text-xs sm:text-sm">
                                                {post.author.firstName}
                                            </span>
                                            <span className="text-white/60 mx-1 sm:mx-2 text-xs">•</span>
                                            <span className="text-white/80 text-xs">{formatDate(post.createdAt)}</span>
                                        </div>
                                    </div>
                                    <Badge className="bg-white/20 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2">
                                        <Pin className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                                        <span className="hidden sm:inline">Pinned</span>
                                    </Badge>
                                </div>

                                {/* Content */}
                                <CardContent className="p-3 sm:p-6">
                                    <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-4">{post.title}</h3>

                                    <div
                                        className="prose prose-sm max-w-none text-gray-700 leading-relaxed text-sm
                                            prose-p:my-1.5 sm:prose-p:my-2 prose-ul:my-1.5 sm:prose-ul:my-2 prose-li:my-0.5
                                            prose-strong:text-burgundy-800 prose-em:text-burgundy-600
                                            line-clamp-4 sm:line-clamp-none"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />

                                    {/* Footer: Stats - Simplified for mobile */}
                                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                {post.viewCount.toLocaleString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="w-3.5 h-3.5" />
                                                {post._count.comments}
                                            </span>
                                            {/* Reactions - hidden on smallest screens */}
                                            {activeReactions.length > 0 && (
                                                <span className="hidden sm:flex items-center gap-1">
                                                    {activeReactions.map(([emoji, count]) => (
                                                        <span key={emoji} className="text-xs">
                                                            {emoji} {count}
                                                        </span>
                                                    ))}
                                                </span>
                                            )}
                                        </div>

                                        <Link
                                            href={`/community/${post.id}`}
                                            className="text-burgundy-600 hover:text-burgundy-700 font-medium text-xs sm:text-sm whitespace-nowrap"
                                        >
                                            Read more →
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
