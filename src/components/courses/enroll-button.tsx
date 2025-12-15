"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Fanbasis checkout URL for $997 enrollment
const FANBASIS_CHECKOUT_URL = "https://www.fanbasis.com/agency-checkout/AccrediPro/XDNQW";

interface EnrollButtonProps {
  courseId: string;
  courseName: string;
}

export function EnrollButton({ courseId, courseName }: EnrollButtonProps) {
  const handleEnroll = () => {
    // Redirect to Fanbasis checkout for payment
    window.open(FANBASIS_CHECKOUT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <Button
        className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800"
        size="lg"
        onClick={handleEnroll}
      >
        Enroll Now - $997
        <ExternalLink className="w-4 h-4 ml-2" />
      </Button>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Secure checkout powered by Fanbasis
      </p>
    </div>
  );
}
