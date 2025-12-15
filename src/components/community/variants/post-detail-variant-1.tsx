"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, Heart, MessageCircle, Share2, Bookmark,
    MoreHorizontal, ChevronLeft, Send, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data Interfaces (Simplified for Display)
interface Post {
    id: string;
    title: string;
    content: string;
    author: {
        firstName: string | null;
        lastName: string | null;
        avatar: string | null;
        role: string;
        bio?: string;
    };
    createdAt: Date;
    viewCount: number;
    likeCount: number;
    category: string;
    isPinned: boolean;
}

interface VariantProps {
    post: Post;
    currentUserId: string;
    currentUserImage?: string | null;
    currentUserFirstName?: string | null;
    currentUserLastName?: string | null;
}

export default function PostDetailVariant1({
    post,
    currentUserImage,
    currentUserFirstName,
    currentUserLastName
}: VariantProps) {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likeCount);

    // Initial animation state
    const [loaded, setLoaded] = useState(false);
    useEffect(() => setLoaded(true), []);

    return (
        <div className="min-h-screen bg-[#FDFDFD] relative overflow-hidden font-sans selection:bg-rose-100">

            {/* Decorative Background Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px] opacity-60 animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-rose-100/40 rounded-full blur-[120px] opacity-60" />
            </div>

            {/* Floating Header */}
            <div className={cn(
                "fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-700 delay-100",
                "bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm",
                loaded ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
            )}>
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-black" />
                </button>

                <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border border-white shadow-sm">
                        <AvatarImage src={post.author.avatar || undefined} />
                        <AvatarFallback>
                            {post.author.firstName?.[0]}{post.author.lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold text-gray-800">
                        {post.author.firstName} {post.author.lastName}
                    </span>
                </div>

                <button className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                </button>
            </div>

            <main className="relative z-10 max-w-3xl mx-auto pt-32 pb-40 px-6">

                {/* Post Metadata */}
                <div className={cn(
                    "text-center space-y-4 mb-12 transition-all duration-700 delay-200",
                    loaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                )}>
                    <Badge variant="secondary" className="bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-100 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold">
                        {post.category}
                    </Badge>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{post.viewCount.toLocaleString()} reads</span>
                    </div>
                </div>

                {/* Glass Card Content */}
                <div className={cn(
                    "relative group transition-all duration-700 delay-300",
                    loaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
                )}>
                    {/* Glowing border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-200 to-purple-200 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

                    <div className="relative bg-white/60 backdrop-blur-md rounded-[2rem] p-8 md:p-12 border border-white/60 shadow-xl ring-1 ring-gray-900/5">
                        <div className="prose prose-lg prose-slate prose-headings:font-bold prose-p:text-gray-600 prose-a:text-rose-600 max-w-none">
                            {/* Simple Markdown Rendering (Mock for variant) */}
                            {post.content.split('\n').map((line, i) => (
                                <p key={i} className="mb-4">{line}</p>
                            ))}
                        </div>
                    </div>
                </div>

            </main>

            {/* Floating Action Bar (Bottom) */}
            <div className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 delay-500",
                loaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            )}>
                <div className="flex items-center gap-2 p-2 rounded-full bg-gray-900/90 backdrop-blur-xl text-white shadow-2xl border border-white/10 ring-1 ring-black/5">

                    <div className="flex items-center gap-1 pl-4 pr-3 border-r border-white/10">
                        <button
                            onClick={() => { setIsLiked(!isLiked); setLikeCount(c => isLiked ? c - 1 : c + 1) }}
                            className="group flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-full transition-colors"
                        >
                            <Heart className={cn("w-5 h-5 transition-all", isLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-gray-300 group-hover:text-white")} />
                            <span className="font-medium text-sm tabular-nums">{likeCount}</span>
                        </button>
                    </div>

                    <div className="flex items-center pr-2 gap-1">
                        <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white relative">
                            <MessageCircle className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-gray-900"></span>
                        </button>
                        <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white">
                            <Bookmark className="w-5 h-5" />
                        </button>
                        <button className="p-3 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white">
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="pl-2 pr-2 border-l border-white/10">
                        <Button size="sm" className="rounded-full bg-white text-black hover:bg-gray-200 font-semibold px-6">
                            Reply
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    );
}
