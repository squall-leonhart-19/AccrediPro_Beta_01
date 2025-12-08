import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold-400 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-burgundy-400 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full px-12">
          <div className="text-center">
            {/* Logo placeholder - replace with your actual logo */}
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-burgundy-600 font-bold text-2xl">AP</span>
            </div>

            <h1 className="text-4xl font-bold text-white mb-2">AccrediPro</h1>
            <p className="text-gold-300 text-lg mb-8">Educational Excellence</p>

            <div className="max-w-md mx-auto">
              <p className="text-burgundy-100 text-lg leading-relaxed mb-8">
                Empowering professional women with world-class certifications
                and mini-diplomas for career advancement.
              </p>

              <div className="flex justify-center gap-8 text-white/80">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-300">50+</div>
                  <div className="text-sm">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-300">10K+</div>
                  <div className="text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold-300">95%</div>
                  <div className="text-sm">Completion</div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-burgundy-200 text-sm italic">
              "Veritas Et Excellentia"
              <br />
              <span className="text-xs">Truth and Excellence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AP</span>
            </div>
            <span className="text-xl font-bold text-burgundy-600">AccrediPro</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>

        <div className="p-6 text-center text-sm text-gray-500">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-burgundy-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-burgundy-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
