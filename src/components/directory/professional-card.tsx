"use client";

import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Star, CheckCircle, ArrowRight, User as UserIcon } from "lucide-react";
import Link from "next/link";

interface ProfessionalCardProps {
    professional: User;
}

export function ProfessionalCard({ professional }: ProfessionalCardProps) {
    // Combine name or use fallback
    const fullName =
        professional.firstName && professional.lastName
            ? `${professional.firstName} ${professional.lastName}`
            : professional.firstName || "AccrediPro Member";

    // Initials for avatar
    const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    // Location string
    const location = professional.location || "Online / Remote";

    // Title fallback
    const title = professional.professionalTitle || "Certified Practitioner";

    // Accepting clients?
    const isAccepting = professional.acceptingClients !== false; // Default true if null/undefined

    // Construct profile URL (slug or ID fallback)
    const profileUrl = `/professionals/${professional.slug || professional.id}`;

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 group">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 border-2 border-white shadow-sm ring-1 ring-gray-100">
                            <AvatarImage src={professional.avatar || ""} alt={fullName} />
                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700 font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-burgundy-700 transition-colors flex items-center gap-2">
                                {fullName}
                                {/* Verified Badge - could be conditional based on Tier */}
                                <CheckCircle className="w-4 h-4 text-gold-500 fill-gold-500/10" />
                            </h3>
                            <p className="text-sm text-burgundy-600 font-medium">{title}</p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                                <MapPin className="w-3.5 h-3.5" />
                                {location}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio Snippet */}
                <p className="text-gray-600 text-sm line-clamp-3 mb-4 min-h-[60px]">
                    {professional.bio || `A certified professional specializing in holistic health and wellness. Contact ${fullName} to learn more about their services.`}
                </p>

                {/* Tags / Specialties */}
                <div className="flex flex-wrap gap-2 mb-6 h-12 overflow-hidden">
                    {professional.specialties?.slice(0, 3).map((spec, i) => (
                        <Badge key={i} variant="secondary" className="bg-gray-50 text-gray-600 hover:bg-gray-100 font-normal">
                            {spec}
                        </Badge>
                    ))}
                    {(professional.specialties?.length || 0) > 3 && (
                        <Badge variant="outline" className="text-xs text-gray-400 border-dashed">
                            +{(professional.specialties?.length || 0) - 3} more
                        </Badge>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        {isAccepting ? (
                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 text-[10px] px-2 py-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                                Accepting Clients
                            </Badge>
                        ) : (
                            <Badge variant="outline" className="text-gray-500 bg-gray-50 text-[10px] px-2 py-0.5">
                                Fully Booked
                            </Badge>
                        )}
                    </div>

                    <Link href={profileUrl}>
                        <Button size="sm" className="gap-2 bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-sm group-hover:translate-x-1 transition-transform">
                            View Profile
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Card>
    );
}
