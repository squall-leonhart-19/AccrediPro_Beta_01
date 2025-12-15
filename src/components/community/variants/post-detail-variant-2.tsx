"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft, Heart, MessageSquare, Share2,
    BookmarkPlus, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VariantProps {
    post: any; // Using loose typing for quick variant iteration
    currentUserId: string;
    currentUserImage?: string | null;
    currentUserFirstName?: string | null;
    currentUserLastName?: string | null;
}

export default function PostDetailVariant2({ post }: VariantProps) {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="min-h-screen bg-[#fffcf8] font-serif text-gray-900 selection:bg-amber-200">

            {/* Minimal Navbar */}
            <nav className="sticky top-0 z-50 bg-[#fffcf8]/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <button onClick={() => router.back()} className="group flex items-center gap-2 text-sm font-sans font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    BACK
                </button>
                <div className="font-sans text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
                    AccrediPro Journal
                </div>
                <div className="w-16"></div> {/* Spacer balance */}
            </nav>

            <article className="max-w-2xl mx-auto pt-24 pb-32 px-6">

                {/* Header Info */}
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-8 font-sans">
                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                            {post.category}
                        </span>
                        <span className="text-gray-400 text-xs font-medium tracking-wide uppercase">
                            • {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-serif font-medium leading-[1.1] mb-8 text-gray-900">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-center gap-4 font-sans border-t border-b border-gray-100 py-6">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-white">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback>{post.author.firstName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className="text-left">
                                <p className="text-sm font-bold text-gray-900">{post.author.firstName} {post.author.lastName}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{post.author.role}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="prose prose-xl prose-serif prose-gray max-w-none 
          prose-headings:font-normal prose-headings:text-gray-900 
          prose-p:leading-relaxed prose-p:text-gray-800 
          prose-strong:font-semibold prose-strong:text-gray-900
          first-letter:text-6xl first-letter:font-bold first-letter:text-gray-900 first-letter:mr-3 first-letter:float-left">
                    {post.content.split('\n').map((line: string, i: number) => line ? <p key={i}>{line}</p> : <br key={i} />)}
                </div>

                {/* Footer Interactions */}
                <div className="mt-20 pt-10 border-t border-gray-200 font-sans">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-6">
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className="flex items-center gap-2 group"
                            >
                                <div className={cn("p-2 rounded-full transition-colors", isLiked ? "bg-red-50" : "bg-gray-50 group-hover:bg-gray-100")}>
                                    <Heart className={cn("w-5 h-5", isLiked ? "fill-red-500 text-red-500" : "text-gray-600")} />
                                </div>
                                <span className="text-sm font-semibold text-gray-600">{post.likeCount + (isLiked ? 1 : 0)}</span>
                            </button>

                            <button className="flex items-center gap-2 group">
                                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-gray-100 transition-colors">
                                    <MessageSquare className="w-5 h-5 text-gray-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-600">54</span>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
                                <BookmarkPlus className="w-5 h-5 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-full">
                                <Share2 className="w-5 h-5 text-gray-500" />
                            </Button>
                        </div>
                    </div>
                </div>

            </article>
        </div>
    );
}
