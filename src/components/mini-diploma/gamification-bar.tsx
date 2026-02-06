"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface GamificationBarProps {
    lessonNumber: number;
    totalLessons: number;
    firstName?: string;
    justCompleted?: boolean;
}

export function GamificationBar({ justCompleted = false }: GamificationBarProps) {
    useEffect(() => {
        if (justCompleted) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
        }
    }, [justCompleted]);

    // No visible UI — confetti only
    return null;
}
