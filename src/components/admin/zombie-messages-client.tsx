"use client";

import { useState } from "react";

interface Template {
    id: string;
    content: string;
    category: string | null;
    isActive: boolean;
    createdAt: Date;
}

interface RecentMessage {
    id: string;
    content: string;
    zombieName: string | null;
    zombieAvatar: string | null;
    createdAt: Date;
}

interface ZombieMessagesClientProps {
    templates: Template[];
    recentMessages: RecentMessage[];
    templatesByCategory: Record<string, Template[]>;
}

export default function ZombieMessagesClient({
    templates,
    recentMessages,
    templatesByCategory,
}: ZombieMessagesClientProps) {
    const [activeTab, setActiveTab] = useState<"recent" | "templates">("recent");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const categories = Object.keys(templatesByCategory);

    const filteredTemplates = templates.filter(t => {
        const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
        const matchesSearch = !searchQuery || t.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-white rounded-lg border shadow-sm">
            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab("recent")}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === "recent"
                            ? "text-burgundy-600 border-b-2 border-burgundy-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    📨 Recent Messages
                </button>
                <button
                    onClick={() => setActiveTab("templates")}
                    className={`px-6 py-3 font-medium transition-colors ${activeTab === "templates"
                            ? "text-burgundy-600 border-b-2 border-burgundy-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    📝 Templates ({templates.length})
                </button>
            </div>

            {/* Recent Messages Tab */}
            {activeTab === "recent" && (
                <div className="p-4">
                    <div className="mb-4 text-sm text-gray-500">
                        Last 100 zombie messages sent in the past 7 days
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {recentMessages.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No messages sent recently
                            </div>
                        ) : (
                            recentMessages.map((msg) => {
                                const isSarah = msg.zombieName?.toLowerCase().includes("sarah");
                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex gap-3 p-3 rounded-lg border ${isSarah
                                                ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200"
                                                : "bg-gray-50"
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full bg-cover bg-center flex-shrink-0"
                                            style={{
                                                backgroundImage: msg.zombieAvatar
                                                    ? `url(${msg.zombieAvatar})`
                                                    : undefined,
                                                backgroundColor: msg.zombieAvatar ? undefined : "#722f37",
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`font-medium text-sm ${isSarah ? "text-amber-700" : "text-gray-900"}`}>
                                                    {msg.zombieName || "Unknown"}
                                                    {isSarah && " ⭐"}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {new Date(msg.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700">{msg.content}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Templates Tab */}
            {activeTab === "templates" && (
                <div className="p-4">
                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder="Search templates..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                            />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                        >
                            <option value="all">All Categories ({templates.length})</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)} ({templatesByCategory[cat].length})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category Summary */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat
                                        ? "bg-burgundy-600 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}: {templatesByCategory[cat].length}
                            </button>
                        ))}
                    </div>

                    {/* Templates List */}
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {filteredTemplates.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No templates match your criteria
                            </div>
                        ) : (
                            filteredTemplates.map((t) => (
                                <div
                                    key={t.id}
                                    className={`p-3 rounded-lg border transition-colors ${t.isActive
                                            ? "bg-white hover:bg-gray-50"
                                            : "bg-gray-100 opacity-50"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800">{t.content}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                                                    {t.category || "uncategorized"}
                                                </span>
                                                {t.isActive ? (
                                                    <span className="text-xs text-green-600">● Active</span>
                                                ) : (
                                                    <span className="text-xs text-red-500">● Inactive</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Summary */}
                    <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                        Showing {filteredTemplates.length} of {templates.length} templates
                    </div>
                </div>
            )}
        </div>
    );
}
