"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Hash, Globe, Coffee, Trophy, Megaphone } from "lucide-react";

interface Channel {
    id: string;
    slug: string;
    name: string;
    emoji: string;
    type: string;
    description?: string;
    isLocked?: boolean;
    adminOnly?: boolean;
    autoPost?: boolean;
    postCount: number;
}

interface CategoryGroup {
    category: {
        id: string;
        name: string;
        slug: string;
        icon: string;
    };
    channels: Channel[];
}

interface ChannelSidebarProps {
    onChannelSelect: (channel: Channel | null) => void;
    selectedChannelId?: string | null;
    className?: string;
}

export function ChannelSidebar({
    onChannelSelect,
    selectedChannelId,
    className,
}: ChannelSidebarProps) {
    const [globalChannels, setGlobalChannels] = useState<Channel[]>([]);
    const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        try {
            const res = await fetch("/api/community/channels");
            const data = await res.json();
            if (data.success) {
                setGlobalChannels(data.data.global);
                setCategoryGroups(data.data.categories);
                // Expand first category by default
                if (data.data.categories.length > 0) {
                    setExpandedCategories(new Set([data.data.categories[0].category.id]));
                }
            }
        } catch (error) {
            console.error("Failed to fetch channels:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    const getChannelIcon = (channel: Channel) => {
        if (channel.type === "GLOBAL_WINS") return <Trophy className="h-4 w-4 text-yellow-500" />;
        if (channel.type === "GLOBAL_ANNOUNCEMENTS") return <Megaphone className="h-4 w-4 text-blue-500" />;
        if (channel.type === "GLOBAL_LOUNGE") return <Coffee className="h-4 w-4 text-amber-600" />;
        return <span className="text-sm">{channel.emoji}</span>;
    };

    if (loading) {
        return (
            <div className={cn("p-4 space-y-3", className)}>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-muted rounded animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col h-full overflow-y-auto", className)}>
            {/* All Posts */}
            <button
                onClick={() => onChannelSelect(null)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 mx-2 my-1 rounded-md text-sm font-medium transition-colors",
                    !selectedChannelId
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
            >
                <Globe className="h-4 w-4" />
                All Posts
            </button>

            {/* Global Channels */}
            <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    🌐 Global
                </h3>
                <div className="space-y-0.5">
                    {globalChannels.map((channel) => (
                        <button
                            key={channel.id}
                            onClick={() => onChannelSelect(channel)}
                            className={cn(
                                "flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors",
                                selectedChannelId === channel.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {getChannelIcon(channel)}
                            <span className="truncate">{channel.name}</span>
                            {channel.postCount > 0 && (
                                <span className="ml-auto text-xs text-muted-foreground">
                                    {channel.postCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Category Channels */}
            <div className="flex-1 px-3 py-2 space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    📁 Categories
                </h3>

                {categoryGroups.map((group) => (
                    <div key={group.category.id} className="mb-1">
                        {/* Category Header */}
                        <button
                            onClick={() => toggleCategory(group.category.id)}
                            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm font-medium hover:bg-muted transition-colors"
                        >
                            {expandedCategories.has(group.category.id) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span>{group.category.icon}</span>
                            <span className="truncate">{group.category.name}</span>
                        </button>

                        {/* Category Channels */}
                        {expandedCategories.has(group.category.id) && (
                            <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-muted pl-2">
                                {group.channels.map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => onChannelSelect(channel)}
                                        className={cn(
                                            "flex items-center gap-2 w-full px-2 py-1 rounded-md text-sm transition-colors",
                                            selectedChannelId === channel.id
                                                ? "bg-primary/10 text-primary font-medium"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                        )}
                                    >
                                        <span className="text-xs">{channel.emoji}</span>
                                        <span className="truncate">{channel.name}</span>
                                        {channel.postCount > 0 && (
                                            <span className="ml-auto text-xs text-muted-foreground">
                                                {channel.postCount}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
