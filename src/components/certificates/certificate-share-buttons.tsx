"use client";

import { Button } from "@/components/ui/button";
import { Facebook, Linkedin, Instagram } from "lucide-react";

interface CertificateShareButtonsProps {
  certificateTitle: string;
  certificateUrl: string;
}

export function CertificateShareButtons({ certificateTitle, certificateUrl }: CertificateShareButtonsProps) {
  const shareText = `I just earned my ${certificateTitle} from AccrediPro Academy! Check out my verified credential:`;

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certificateUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificateUrl)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct share URL, open Instagram app/site
    window.open("https://www.instagram.com/", "_blank");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={shareToFacebook}
        className="h-8 px-3 text-xs bg-[#1877F2] hover:bg-[#166FE5] text-white border-0"
      >
        <Facebook className="w-3 h-3 mr-1" />
        Facebook
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToLinkedIn}
        className="h-8 px-3 text-xs bg-[#0A66C2] hover:bg-[#095196] text-white border-0"
      >
        <Linkedin className="w-3 h-3 mr-1" />
        LinkedIn
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={shareToInstagram}
        className="h-8 px-3 text-xs bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-90 text-white border-0"
      >
        <Instagram className="w-3 h-3 mr-1" />
        Instagram
      </Button>
    </div>
  );
}
