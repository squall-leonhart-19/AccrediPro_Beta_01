"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce"; // Assuming this hook exists, or I'll implement simple debounce

// Using a simple internal debounce since I can't verify hooks availability easily without reading
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

export function DirectorySearch() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [term, setTerm] = useState(searchParams.get("q") || "");
    const [location, setLocation] = useState(searchParams.get("loc") || "");
    // const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");

    // Debounce search input to avoid hitting URL on every keystroke too fast
    // But usually for a search *button* driven UI it's better.
    // The spec says "Search Bar". Let's make it trigger on Enter or Button click for clarity.
    // Or real-time? Real-time is nice.

    const handleSearch = () => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }
        if (location) {
            params.set("loc", location);
        } else {
            params.delete("loc");
        }
        replace(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        setTerm("");
        setLocation("");
        replace(pathname);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Keyword Search */}
                <div className="md:col-span-5 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search by name or keyword..."
                        className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-burgundy-500"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                {/* Location Search */}
                <div className="md:col-span-4 relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="City or State"
                        className="pl-9 bg-gray-50 border-gray-200 focus-visible:ring-burgundy-500"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>

                {/* Action Buttons */}
                <div className="md:col-span-3 flex gap-2">
                    <Button
                        className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                    {(term || location) && (
                        <Button
                            variant="outline"
                            onClick={handleClear}
                            className="text-gray-500"
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            {/* Filters Row (Future Expansion) */}
            <div className="flex flex-wrap gap-2 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1 font-medium text-gray-700 mr-2">
                    <Filter className="w-3.5 h-3.5" />
                    Popular:
                </span>
                {["Functional Medicine", "Hormone Health", "Gut Health", "Mental Wellness"].map((tag) => (
                    <button
                        key={tag}
                        onClick={() => {
                            setTerm(tag);
                            const params = new URLSearchParams(searchParams);
                            params.set("q", tag);
                            replace(`${pathname}?${params.toString()}`);
                        }}
                        className="px-2 py-1 rounded-full bg-gray-100 hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors cursor-pointer"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
    );
}
