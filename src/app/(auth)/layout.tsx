import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Award, Users, Sparkles, Globe, Shield, ChevronLeft } from "lucide-react";

// ASI Brand Colors
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - ASI Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: `${BRAND.gold}30` }} />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: `${BRAND.burgundy}40` }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: `${BRAND.burgundy}20` }} />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <div className="text-center max-w-lg">
            {/* ASI Logo */}
            <div className="relative mb-8">
              <div className="w-48 h-48 mx-auto relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full animate-pulse opacity-50" style={{ background: `linear-gradient(135deg, ${BRAND.gold} 0%, ${BRAND.goldLight} 50%, ${BRAND.gold} 100%)` }} />
                {/* Main logo container */}
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-2xl p-4">
                  <Image
                    src="/ASI_LOGO-removebg-preview.png"
                    alt="Accreditation Standards Institute"
                    width={160}
                    height={160}
                    className="w-full h-auto object-contain"
                  />
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full animate-bounce" style={{ backgroundColor: BRAND.gold, animationDelay: '0.2s' }} />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full animate-bounce" style={{ backgroundColor: BRAND.goldLight, animationDelay: '0.5s' }} />
              </div>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 tracking-tight">
              Accreditation Standards Institute
            </h1>
            <p className="text-xl font-medium mb-2" style={{ color: BRAND.gold }}>
              The Global Authority in Health Certification
            </p>
            <p className="text-sm mb-10 italic" style={{ color: `${BRAND.gold}90` }}>
              &ldquo;Excellence Through Standards&rdquo;
            </p>

            <p className="text-lg leading-relaxed mb-12" style={{ color: '#f5f5f5' }}>
              Join 20,000+ certified practitioners transforming healthcare in 45+ countries worldwide.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="backdrop-blur-sm rounded-2xl p-4 border transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <GraduationCap className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND.gold }} />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs" style={{ color: '#d1d5db' }}>Certifications</div>
              </div>
              <div className="backdrop-blur-sm rounded-2xl p-4 border transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <Globe className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND.gold }} />
                <div className="text-2xl font-bold text-white">45+</div>
                <div className="text-xs" style={{ color: '#d1d5db' }}>Countries</div>
              </div>
              <div className="backdrop-blur-sm rounded-2xl p-4 border transition-colors" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1)' }}>
                <Award className="w-6 h-6 mx-auto mb-2" style={{ color: BRAND.gold }} />
                <div className="text-2xl font-bold text-white">20K+</div>
                <div className="text-xs" style={{ color: '#d1d5db' }}>Certified</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="backdrop-blur-sm rounded-2xl p-6 border" style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}>
              <Sparkles className="w-5 h-5 mb-3" style={{ color: BRAND.gold }} />
              <p className="text-sm italic leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.9)' }}>
                &ldquo;ASI certification transformed my career. Within 6 months, I launched my own functional medicine practice and now earn more than I ever did in traditional healthcare.&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}30` }}>
                  <span className="text-white text-sm font-medium">JM</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Jennifer M.</p>
                  <p className="text-xs" style={{ color: BRAND.gold }}>Functional Medicine Practitioner, Texas</p>
                </div>
              </div>
            </div>

            {/* Office Locations */}
            <div className="mt-8 flex items-center justify-center gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <span className="flex items-center gap-1">
                <span>🇺🇸</span> USA
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span>🇦🇪</span> Dubai
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col" style={{ background: `linear-gradient(to bottom, ${BRAND.cream}, white)` }}>
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-sm" style={{ color: BRAND.burgundy }}>
            <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
            Secure Login
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden px-4 py-3 flex items-center justify-between shadow-md" style={{ background: `linear-gradient(to right, ${BRAND.burgundy}, ${BRAND.burgundyDark})` }}>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="ASI Logo"
                width={32}
                height={32}
                className="h-7 w-auto object-contain"
              />
            </div>
            <span className="text-white font-bold text-lg">ASI</span>
          </Link>
          <Link href="/" className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="p-6 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/terms-of-service" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
              Privacy Policy
            </Link>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            © {new Date().getFullYear()} Accreditation Standards Institute. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
