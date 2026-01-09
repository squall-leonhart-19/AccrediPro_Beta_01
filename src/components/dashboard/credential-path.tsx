"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Lock, ArrowRight, Award } from "lucide-react";
import Link from "next/link";

interface CredentialTier {
  tier: string;
  title: string;
  status: "completed" | "in_progress" | "locked";
  progress?: number;
  price?: string;
  earnedDate?: string;
}

interface CredentialPathProps {
  credentials: CredentialTier[];
  specialty: string; // "FM", "WH", etc.
  specialtyName: string; // "Functional Medicine", "Women's Health", etc.
}

export function CredentialPath({ credentials, specialty, specialtyName }: CredentialPathProps) {
  const completedCount = credentials.filter(c => c.status === "completed").length;
  const inProgressCred = credentials.find(c => c.status === "in_progress");

  return (
    <Card className="overflow-hidden shadow-sm">
      <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
            Your {specialty} Certification Path
          </h3>
          {completedCount > 0 && (
            <Badge className="bg-gold-400 text-burgundy-900 text-xs">
              {completedCount} Earned
            </Badge>
          )}
        </div>
        <p className="text-burgundy-200 text-xs mt-1">{specialtyName}</p>
      </div>
      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {credentials.map((cred, index) => (
          <div key={cred.tier} className="relative">
            {/* Connector line */}
            {index < credentials.length - 1 && (
              <div
                className={`absolute left-4 top-10 w-0.5 h-4 sm:h-6 ${
                  cred.status === "completed" ? "bg-green-300" : "bg-gray-200"
                }`}
              />
            )}

            <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg transition-all ${
              cred.status === "completed" ? "bg-green-50" :
              cred.status === "in_progress" ? "bg-burgundy-50 ring-1 ring-burgundy-200" :
              "bg-gray-50 opacity-60"
            }`}>
              {/* Status icon */}
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                cred.status === "completed" ? "bg-green-500 text-white" :
                cred.status === "in_progress" ? "bg-burgundy-500 text-white" :
                "bg-gray-300 text-gray-500"
              }`}>
                {cred.status === "completed" ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> :
                 cred.status === "in_progress" ? <Circle className="w-4 h-4 sm:w-5 sm:h-5" /> :
                 <Lock className="w-3 h-3 sm:w-4 sm:h-4" />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs sm:text-sm text-gray-900 truncate">{cred.tier}</p>
                <p className="text-xs text-gray-500 truncate">{cred.title}</p>
                {cred.status === "completed" && cred.earnedDate && (
                  <p className="text-xs text-green-600 mt-0.5">Earned {cred.earnedDate}</p>
                )}
                {cred.status === "in_progress" && cred.progress !== undefined && (
                  <div className="mt-1">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-burgundy-500 rounded-full transition-all duration-500"
                        style={{ width: `${cred.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-burgundy-600 mt-0.5">{cred.progress}% complete</p>
                  </div>
                )}
              </div>

              {/* Action */}
              {cred.status === "in_progress" && (
                <Link href="/my-learning">
                  <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-xs h-7 sm:h-8 px-2 sm:px-3">
                    Continue
                  </Button>
                </Link>
              )}
              {cred.status === "locked" && cred.price && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {cred.price}
                </Badge>
              )}
              {cred.status === "completed" && (
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              )}
            </div>
          </div>
        ))}

        {/* View Full Path Button */}
        <Link href="/my-personal-roadmap-by-coach-sarah" className="block">
          <Button variant="outline" className="w-full mt-2 text-xs sm:text-sm h-9 sm:h-10">
            View Full Roadmap <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </Button>
        </Link>

        {/* Upgrade CTA for users in progress */}
        {inProgressCred && (
          <div className="mt-3 p-3 bg-gradient-to-r from-gold-50 to-gold-100 rounded-lg border border-gold-200">
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Next step:</span> Complete {inProgressCred.tier} to unlock the next credential tier.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
