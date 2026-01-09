"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function CoachQuickHelp() {
    return (
        <Card className="bg-gradient-to-br from-burgundy-50/80 to-white shadow-sm">
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-burgundy-200">
                            <img
                                src="/coaches/sarah-coach.webp"
                                alt="Coach Sarah"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Need Help?</p>
                        <p className="text-xs text-gray-500 truncate">Sarah responds in &lt;2 hours</p>
                    </div>
                    <Link href="/messages">
                        <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 flex-shrink-0">
                            <MessageSquare className="w-4 h-4" />
                            <span className="ml-2 hidden sm:inline">Chat</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
