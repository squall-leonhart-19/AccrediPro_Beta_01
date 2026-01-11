import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Award,
  Clock,
  Users,
  Star,
  ChevronRight,
  Sparkles,
  GraduationCap,
  BookOpen,
  Heart,
} from "lucide-react";

export const metadata = {
  title: "Certifications | Accreditation Standards Institute",
  description: "Explore 50+ ASI certifications in Functional Medicine, Women's Health, Gut Health, Nutrition, and more. Start your career transformation today.",
};

const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

export default function CertificationsPage() {
  const categories = [
    {
      name: "Functional Medicine",
      description: "The complete framework for root-cause health",
      icon: "🧬",
      certifications: [
        { name: "Functional Medicine Practitioner", duration: "12 weeks", level: "Professional", popular: true },
        { name: "Integrative Health Specialist", duration: "10 weeks", level: "Professional" },
        { name: "Root Cause Medicine Coach", duration: "8 weeks", level: "Foundation" },
        { name: "Functional Medicine Health Coach", duration: "8 weeks", level: "Foundation" },
      ],
      href: "/certifications/functional-medicine",
    },
    {
      name: "Women's Health",
      description: "Hormones, fertility, menopause & beyond",
      icon: "👩‍⚕️",
      certifications: [
        { name: "Women's Health Specialist", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Menopause Coach", duration: "6 weeks", level: "Foundation" },
        { name: "Hormone Health Practitioner", duration: "8 weeks", level: "Professional" },
        { name: "Fertility Wellness Coach", duration: "8 weeks", level: "Foundation" },
        { name: "Perimenopause Specialist", duration: "6 weeks", level: "Foundation" },
      ],
      href: "/certifications/womens-health",
    },
    {
      name: "Gut & Digestive Health",
      description: "The foundation of whole-body wellness",
      icon: "🦠",
      certifications: [
        { name: "Gut Health Specialist", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Microbiome Coach", duration: "6 weeks", level: "Foundation" },
        { name: "Digestive Wellness Practitioner", duration: "8 weeks", level: "Professional" },
        { name: "SIBO & IBS Specialist", duration: "6 weeks", level: "Foundation" },
      ],
      href: "/certifications/gut-health",
    },
    {
      name: "Metabolic & Hormones",
      description: "Thyroid, adrenals, blood sugar & metabolism",
      icon: "⚡",
      certifications: [
        { name: "Thyroid Health Specialist", duration: "8 weeks", level: "Professional", popular: true },
        { name: "Metabolic Health Coach", duration: "6 weeks", level: "Foundation" },
        { name: "Adrenal Specialist", duration: "6 weeks", level: "Foundation" },
        { name: "Blood Sugar Balance Coach", duration: "4 weeks", level: "Foundation" },
        { name: "Weight Management Specialist", duration: "8 weeks", level: "Professional" },
      ],
      href: "/certifications/metabolic-health",
    },
    {
      name: "Nutrition & Coaching",
      description: "Evidence-based nutrition and behavior change",
      icon: "🥗",
      certifications: [
        { name: "Holistic Nutrition Coach", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Certified Health Coach", duration: "12 weeks", level: "Professional" },
        { name: "Plant-Based Nutrition Specialist", duration: "6 weeks", level: "Foundation" },
        { name: "Sports Nutrition Coach", duration: "8 weeks", level: "Foundation" },
        { name: "Eating Psychology Coach", duration: "8 weeks", level: "Professional" },
      ],
      href: "/certifications/nutrition",
    },
    {
      name: "Mind-Body & Longevity",
      description: "Brain health, sleep, aging & performance",
      icon: "🧠",
      certifications: [
        { name: "Mind-Body Medicine Coach", duration: "10 weeks", level: "Professional" },
        { name: "Sleep Health Specialist", duration: "6 weeks", level: "Foundation", popular: true },
        { name: "Longevity Coach", duration: "8 weeks", level: "Professional" },
        { name: "Stress Management Specialist", duration: "6 weeks", level: "Foundation" },
        { name: "Cognitive Health Coach", duration: "8 weeks", level: "Foundation" },
      ],
      href: "/certifications/mind-body",
    },
  ];

  const certificationLevels = [
    {
      level: "Level 1",
      name: "Foundation",
      duration: "4-6 Weeks",
      price: "$497",
      description: "Core competencies and foundational knowledge",
      icon: "📜",
    },
    {
      level: "Level 2",
      name: "Professional",
      duration: "8-12 Weeks",
      price: "$997",
      description: "Advanced training with clinical protocols",
      icon: "🏆",
      popular: true,
    },
    {
      level: "Level 3",
      name: "Board Certified",
      duration: "4-6 Months",
      price: "$2,497",
      description: "Comprehensive board-level certification",
      icon: "🎖️",
    },
    {
      level: "Level 4",
      name: "Master Practitioner",
      duration: "6+ Months",
      price: "$4,997",
      description: "Expert-level mastery with specialization",
      icon: "👑",
    },
  ];

  const whyASI = [
    { icon: Shield, text: "Competency-based assessment" },
    { icon: Users, text: "20,000+ certified practitioners" },
    { icon: Award, text: "Lifetime credential" },
    { icon: Star, text: "4.9/5 rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div style={{ backgroundColor: BRAND.burgundyDark }} className="text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              🇺🇸 USA Headquarters
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              🇦🇪 Dubai Office
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/verify" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Verify Credential
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/asi-home" className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="Accreditation Standards Institute"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <Link href="/about" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>About</Link>
              <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Standards</Link>
              <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Certifications</Link>
              <Link href="/careers" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Careers</Link>
              <Link href="/directory" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Directory</Link>
              <Link href="/verify" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Verify</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
              <Link href="/apply">
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: BRAND.gold }} />

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <Award className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>50+ Certification Specializations</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build Your Career in
              <span className="block" style={{ color: BRAND.gold }}>Functional Medicine & Health</span>
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: "#f5e6e8" }}>
              Rigorous, competency-based certifications recognized by employers in 45+ countries.
              Start your transformation today.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {whyASI.map((item, i) => (
                <div key={i} className="flex items-center gap-2" style={{ color: "#f5e6e8" }}>
                  <item.icon className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Free Mini-Diploma Banner */}
      <section className="border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: BRAND.goldMetallic }}>
                <Sparkles className="w-8 h-8" style={{ color: BRAND.burgundyDark }} />
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: BRAND.gold }}>Start Free</div>
                <h3 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>Women's Health Mini-Diploma</h3>
                <p className="text-gray-600">Experience ASI quality — no credit card required</p>
              </div>
            </div>
            <Link href="/womens-health-mini-diploma">
              <Button size="lg" className="font-bold hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Certification Levels */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <GraduationCap className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Your Career Path</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              4 Levels of Certification
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start where you are. Grow as far as you want.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationLevels.map((level, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 relative hover:shadow-xl transition-all ${level.popular ? '' : 'border-transparent'}`}
                style={{ borderColor: level.popular ? BRAND.gold : 'transparent' }}
              >
                {level.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: BRAND.gold }}>
                    Most Popular
                  </div>
                )}
                <div className="text-4xl mb-4">{level.icon}</div>
                <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: BRAND.gold }}>{level.level}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{level.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4" />
                  {level.duration}
                </div>
                <p className="text-sm text-gray-600 mb-4">{level.description}</p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>From {level.price}</p>
                  <p className="text-xs text-gray-500">or payment plans available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Categories */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <BookOpen className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Browse by Specialty</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Certification Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect certification for your career goals
            </p>
          </div>

          <div className="space-y-8">
            {categories.map((category, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{category.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{category.name}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <Link href={category.href}>
                      <Button variant="outline" className="whitespace-nowrap" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.certifications.map((cert, j) => (
                      <Link key={j} href={`${category.href}/${cert.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold group-hover:underline" style={{ color: BRAND.burgundy }}>
                              {cert.name}
                            </h4>
                            {cert.popular && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: BRAND.gold }}>
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cert.duration}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-gray-200 text-xs">
                              {cert.level}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              What's Included
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every ASI certification comes with comprehensive support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Evidence-Based Curriculum", description: "Developed by leading practitioners and updated continuously" },
              { icon: Users, title: "Dedicated Success Coach", description: "1-on-1 support until you complete your certification" },
              { icon: Award, title: "Verified Digital Credential", description: "Shareable badge and certificate that employers can verify instantly" },
              { icon: Star, title: "Study Pod Community", description: "Matched with 5 peers at your level for accountability and support" },
              { icon: GraduationCap, title: "Lifetime Access", description: "Your certification never expires, with free curriculum updates" },
              { icon: Heart, title: "Career Launch Support", description: "First client strategy, pricing guidance, and marketing templates" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <item.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-white text-center" style={{ background: BRAND.burgundyMetallic }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8" style={{ color: "#f5e6e8" }}>
            Join 20,000+ practitioners who've transformed their careers with ASI certification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/womens-health-mini-diploma">
              <Button size="lg" className="font-bold text-lg px-10 py-6 h-auto shadow-xl hover:opacity-90" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                Start Free Mini-Diploma
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-10 py-6 h-auto hover:opacity-90" style={{ backgroundColor: "transparent", border: "2px solid white", color: "white" }}>
                Apply for Certification
              </Button>
            </Link>
          </div>
          <p className="text-sm mt-6" style={{ color: "#f5e6e8" }}>
            0% APR financing available • HSA/FSA accepted • From $99/month
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND.gold }}>
                  <Shield className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                </div>
                <div>
                  <div className="font-bold text-lg tracking-tight text-white">ACCREDITATION STANDARDS</div>
                  <div className="text-xs tracking-widest" style={{ color: BRAND.gold }}>INSTITUTE</div>
                </div>
              </div>
              <p className="mb-6 max-w-sm" style={{ color: "#f5e6e8" }}>
                The global authority in functional medicine and health certification.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Categories</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications/functional-medicine" className="hover:text-white transition-colors">Functional Medicine</Link></li>
                <li><Link href="/certifications/womens-health" className="hover:text-white transition-colors">Women's Health</Link></li>
                <li><Link href="/certifications/gut-health" className="hover:text-white transition-colors">Gut Health</Link></li>
                <li><Link href="/certifications/nutrition" className="hover:text-white transition-colors">Nutrition</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Quick Links</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link href="/standards" className="hover:text-white transition-colors">Our Standards</Link></li>
                <li><Link href="/verify" className="hover:text-white transition-colors">Verify Credential</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm" style={{ color: "#f5e6e8" }}>
              © 2026 Accreditation Standards Institute. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "#f5e6e8" }}>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
