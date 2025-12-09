import Link from "next/link";
import { GraduationCap, Award, Users, Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold-400/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-burgundy-400/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-burgundy-500/10 blur-3xl" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <div className="text-center max-w-lg">
            {/* Animated Logo */}
            <div className="relative mb-8">
              <div className="w-32 h-32 mx-auto relative">
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 animate-pulse opacity-50" />
                {/* Main logo container */}
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <span className="text-burgundy-700 font-bold text-3xl block">AP</span>
                    <div className="w-8 h-0.5 bg-gold-500 mx-auto mt-1" />
                  </div>
                </div>
                {/* Decorative dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gold-300 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              AccrediPro
            </h1>
            <p className="text-gold-300 text-xl font-medium mb-2">Academy</p>
            <p className="text-burgundy-200 text-sm mb-10 italic">
              &ldquo;Veritas Et Excellentia&rdquo;
            </p>

            <p className="text-burgundy-100 text-lg leading-relaxed mb-12">
              Empowering professional women with world-class certifications
              and mini-diplomas for career advancement.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <GraduationCap className="w-6 h-6 text-gold-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-xs text-burgundy-200">Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <Users className="w-6 h-6 text-gold-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-xs text-burgundy-200">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                <Award className="w-6 h-6 text-gold-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-xs text-burgundy-200">Completion</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <Sparkles className="w-5 h-5 text-gold-400 mb-3" />
              <p className="text-white/90 text-sm italic leading-relaxed mb-4">
                &ldquo;AccrediPro transformed my career. The certifications opened doors
                I never thought possible.&rdquo;
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-400/30 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">SK</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Sarah K.</p>
                  <p className="text-burgundy-300 text-xs">Healthcare Professional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <div className="p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">AP</span>
            </div>
            <div>
              <span className="text-xl font-bold text-burgundy-700 block">AccrediPro</span>
              <span className="text-xs text-gray-500">Academy</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="p-6 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-burgundy-600 hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-burgundy-600 hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
          <p className="mt-2 text-xs text-gray-400">
            © {new Date().getFullYear()} AccrediPro Academy. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
