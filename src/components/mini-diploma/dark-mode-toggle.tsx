"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

interface DarkModeToggleProps {
    onChange?: (isDark: boolean) => void;
    className?: string;
}

/**
 * Dark mode toggle for lesson player
 * Saves preference to localStorage
 */
export function DarkModeToggle({ onChange, className = "" }: DarkModeToggleProps) {
    const [isDark, setIsDark] = useState(false);

    // Load preference on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("mini_diploma_dark_mode");
            if (saved === "true") {
                setIsDark(true);
                document.documentElement.classList.add("dark");
            }
        }
    }, []);

    const toggleDarkMode = () => {
        const newValue = !isDark;
        setIsDark(newValue);

        if (typeof window !== "undefined") {
            localStorage.setItem("mini_diploma_dark_mode", String(newValue));

            if (newValue) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        }

        onChange?.(newValue);
    };

    return (
        <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${isDark
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } ${className}`}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
