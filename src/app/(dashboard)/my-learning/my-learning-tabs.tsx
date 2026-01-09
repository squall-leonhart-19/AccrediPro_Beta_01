"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { BookOpen, Library, Map } from "lucide-react";

interface MyLearningTabsProps {
    children: {
        courses: React.ReactNode;
        catalog: React.ReactNode;
        roadmap: React.ReactNode;
    };
    defaultTab?: string;
}

const tabs = [
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "catalog", label: "Catalog", icon: Library },
    { id: "roadmap", label: "Roadmap", icon: Map },
];

export function MyLearningTabs({ children, defaultTab = "courses" }: MyLearningTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    return (
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
                <nav className="flex gap-1 overflow-x-auto pb-px -mb-px scrollbar-hide" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    isActive
                                        ? "border-burgundy-600 text-burgundy-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                )}
                            >
                                <tab.icon className={cn("w-4 h-4", isActive ? "text-burgundy-600" : "text-gray-400")} />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
                {activeTab === "courses" && children.courses}
                {activeTab === "catalog" && children.catalog}
                {activeTab === "roadmap" && children.roadmap}
            </div>
        </div>
    );
}
