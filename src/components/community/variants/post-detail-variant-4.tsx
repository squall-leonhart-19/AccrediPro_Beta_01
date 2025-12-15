"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    ArrowLeft, Heart, Send, MoreVertical, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VariantProps {
    post: any;
    currentUserId: string;
    currentUserImage?: string | null;
    currentUserFirstName?: string | null;
    currentUserLastName?: string | null;
}

export default function PostDetailVariant4({ post, currentUserImage, currentUserFirstName }: VariantProps) {
    const router = useRouter();
    const [comment, setComment] = useState("");

    // Mock comments for chat view
    const chatComments = [
        { id: 1, user: "Alex T.", text: "This is amazing! Congrats everyone!", avatar: null },
        { id: 2, user: "Sarah M.", text: "So proud of this group ❤️", avatar: "/coaches/sarah-coach.webp" },
        { id: 3, user: "John D.", text: "Can't wait to start practicing.", avatar: null },
        { id: 4, user: "Lisa P.", text: "Does anyone know when the next cohort starts?", avatar: null },
        // repeat for scroll
        { id: 5, user: "Mike R.", text: "Just got my certificate printed!", avatar: null },
        { id: 6, user: "Jenny", text: "Woohoo! 🥂", avatar: null },
    ];

    return (
        <div className="h-screen flex flex-col md:flex-row bg-white overflow-hidden">

            {/* LEFT PANEL: CONTENT (Scrollable) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-gray-200 relative">

                {/* Sticky Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white z-10 shrink-0">
                    <Button variant="ghost" className="gap-2 -ml-2 text-gray-500" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden md:inline">Back</span>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <span className="font-bold block leading-none">{post.author.firstName} {post.author.lastName}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">{post.category}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon"><MoreVertical className="w-5 h-5 text-gray-400" /></Button>
                </div>

                {/* Scrollable Content */}
                <ScrollArea className="flex-1">
                    <div className="max-w-2xl mx-auto p-8 md:p-12 pb-32">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight">
                            {post.title}
                        </h1>

                        {/* Highlight Box */}
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 mb-8 rounded-r-lg">
                            <p className="text-amber-900 font-medium italic">
                                "Official thread for community graduation announcements. Check pinned rules before posting."
                            </p>
                        </div>

                        <div className="prose prose-lg text-gray-700">
                            {post.content.split('\n').map((line: string, i: number) => line ? <p key={i}>{line}</p> : <br key={i} />)}
                        </div>

                        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200" />
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                    +2K
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{post.likeCount}</p>
                                <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Likes</p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* RIGHT PANEL: CHAT/INTERACTIONS (Fixed Width) */}
            <div className="w-full md:w-[400px] flex flex-col bg-gray-50 h-[40vh] md:h-full shrink-0 border-t md:border-t-0 md:border-l border-gray-200 shadow-xl z-20">

                <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white shrink-0">
                    <h3 className="font-bold text-gray-700">Discussion (24)</h3>
                    <Button variant="ghost" size="icon" className="md:hidden"><X className="w-4 h-4" /></Button>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {chatComments.map(c => (
                            <div key={c.id} className="flex gap-3 items-start animate-fade-in">
                                <Avatar className="w-8 h-8 mt-1">
                                    <AvatarImage src={c.avatar || undefined} />
                                    <AvatarFallback className="bg-gray-200 text-gray-500 text-xs">{c.user[0]}</AvatarFallback>
                                </Avatar>
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm text-sm">
                                    <p className="font-bold text-gray-900 text-xs mb-1">{c.user}</p>
                                    <p className="text-gray-600 leading-relaxed">{c.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Chat Input */}
                <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                    <div className="relative">
                        <Input
                            placeholder="Type a message..."
                            className="pr-12 bg-gray-50 border-gray-200 focus:bg-white transition-all"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button size="icon" className="absolute right-1 top-1 h-8 w-8 bg-burgundy-600 hover:bg-burgundy-700 rounded-lg">
                            <Send className="w-3 h-3 text-white" />
                        </Button>
                    </div>
                    <p className="text-[10px] text-center text-gray-400 mt-2">
                        Press Enter to send • <b>{currentUserFirstName}</b>
                    </p>
                </div>
            </div>

        </div>
    );
}
