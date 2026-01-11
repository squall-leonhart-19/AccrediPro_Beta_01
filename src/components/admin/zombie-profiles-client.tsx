"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Eye, EyeOff, Search, Users, MapPin,
    CheckCircle, XCircle, ExternalLink, Edit, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface ZombieProfile {
    id: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    professionalTitle: string | null;
    specialties: string[];
    acceptingClients: boolean;
    isPublicDirectory: boolean;
    slug: string | null;
    createdAt: Date;
}

interface Props {
    profiles: ZombieProfile[];
}

export default function ZombieProfilesClient({ profiles: initialProfiles }: Props) {
    const [profiles, setProfiles] = useState(initialProfiles);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "directory" | "hidden">("all");
    const [loading, setLoading] = useState<string | null>(null);

    const filteredProfiles = profiles.filter(p => {
        const name = `${p.firstName || ""} ${p.lastName || ""}`.toLowerCase();
        const matchesSearch = name.includes(search.toLowerCase()) ||
            p.professionalTitle?.toLowerCase().includes(search.toLowerCase()) ||
            p.location?.toLowerCase().includes(search.toLowerCase());

        if (filter === "directory") return matchesSearch && p.isPublicDirectory;
        if (filter === "hidden") return matchesSearch && !p.isPublicDirectory;
        return matchesSearch;
    });

    const toggleDirectory = async (profileId: string, currentState: boolean) => {
        setLoading(profileId);
        try {
            const res = await fetch("/api/admin/super-tools/zombies", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    profileId,
                    isPublicDirectory: !currentState
                }),
            });

            if (res.ok) {
                setProfiles(prev =>
                    prev.map(p =>
                        p.id === profileId
                            ? { ...p, isPublicDirectory: !currentState }
                            : p
                    )
                );
                toast.success(currentState ? "Removed from directory" : "Added to directory");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("Error updating profile");
        } finally {
            setLoading(null);
        }
    };

    const getInitials = (firstName: string | null, lastName: string | null) => {
        return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "ZP";
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by name, title, or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                    >
                        <Users className="w-4 h-4 mr-1" />
                        All ({profiles.length})
                    </Button>
                    <Button
                        variant={filter === "directory" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("directory")}
                        className={filter === "directory" ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        <Eye className="w-4 h-4 mr-1" />
                        In Directory ({profiles.filter(p => p.isPublicDirectory).length})
                    </Button>
                    <Button
                        variant={filter === "hidden" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("hidden")}
                        className={filter === "hidden" ? "bg-gray-600 hover:bg-gray-700" : ""}
                    >
                        <EyeOff className="w-4 h-4 mr-1" />
                        Hidden ({profiles.filter(p => !p.isPublicDirectory).length})
                    </Button>
                </div>
            </div>

            {/* Profiles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProfiles.map((profile) => (
                    <Card key={profile.id} className={`p-4 ${profile.isPublicDirectory ? "border-green-200 bg-green-50/30" : ""}`}>
                        <div className="flex gap-4">
                            {/* Avatar */}
                            <Avatar className="w-16 h-16 border-2 border-white shadow">
                                <AvatarImage src={profile.avatar || ""} alt={profile.firstName || ""} />
                                <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                                    {getInitials(profile.firstName, profile.lastName)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 truncate">
                                    {profile.firstName} {profile.lastName}
                                </h3>
                                <p className="text-sm text-gray-600 truncate">
                                    {profile.professionalTitle || "No title set"}
                                </p>
                                {profile.location && (
                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        {profile.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Specialties */}
                        {profile.specialties && profile.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                                {profile.specialties.slice(0, 3).map((spec, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs bg-gray-100">
                                        {spec}
                                    </Badge>
                                ))}
                                {profile.specialties.length > 3 && (
                                    <Badge variant="secondary" className="text-xs bg-gray-100">
                                        +{profile.specialties.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        {/* Bio Preview */}
                        {profile.bio && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                                {profile.bio}
                            </p>
                        )}

                        {/* Status & Actions */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                            <div className="flex items-center gap-2">
                                {profile.isPublicDirectory ? (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        In Directory
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Hidden
                                    </Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {profile.slug && profile.isPublicDirectory && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 px-2"
                                        onClick={() => window.open(`/professionals/${profile.slug}`, "_blank")}
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    variant={profile.isPublicDirectory ? "outline" : "default"}
                                    className={`h-8 ${!profile.isPublicDirectory ? "bg-green-600 hover:bg-green-700" : ""}`}
                                    onClick={() => toggleDirectory(profile.id, profile.isPublicDirectory)}
                                    disabled={loading === profile.id}
                                >
                                    {loading === profile.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : profile.isPublicDirectory ? (
                                        <>
                                            <EyeOff className="w-4 h-4 mr-1" />
                                            Hide
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4 mr-1" />
                                            Show
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredProfiles.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No profiles found matching your search.
                </div>
            )}
        </div>
    );
}
