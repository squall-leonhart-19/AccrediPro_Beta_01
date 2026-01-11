import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Clock,
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "Mind-Body Certification | ASI",
  description: "Become a certified Mind-Body Medicine Coach. Master stress, sleep, brain health, and longevity protocols. Start free.",
};

const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  cream: "#fdf8f0",
};

export default function MindBodyPage() {
  const certificationLevels = [
    {
      level: "Level 1",
      name: "Foundation Certificate",
      duration: "4-6 weeks",
      price: "FREE",
      description: "Introduction to mind-body medicine and stress management.",
      outcomes: ["Mind-body connection", "Stress basics", "Foundation knowledge"],
      cta: "Start Free",
      href: "/womens-health-mini-diploma",
      highlight: true,
    },
    {
      level: "Level 2",
      name: "Mind-Body Coach",
      duration: "8-12 weeks",
      price: "$1,997",
      description: "Comprehensive training in stress, sleep, and brain health.",
      outcomes: ["Sleep protocols", "Brain optimization", "Longevity strategies"],
      cta: "Enroll Now",
      href: "/apply",
      highlight: false,
    },
    {
      level: "Level 3",
      name: "Board Certified MBC",
      duration: "4-6 months",
      price: "$3,997",
      description: "Advanced certification with clinical mentorship.",
      outcomes: ["Advanced protocols", "Clinical mentorship", "Board certification"],
      cta: "Apply Now",
      href: "/apply",
      highlight: false,
    },
  ];

  const specializations = [
    { title: "Stress Management", description: "HPA axis, cortisol, nervous system regulation", icon: "🧘" },
    { title: "Sleep Optimization", description: "Circadian rhythms and sleep hygiene", icon: "😴" },
    { title: "Brain Health", description: "Cognitive function and neuroplasticity", icon: "🧠" },
    { title: "Longevity Medicine", description: "Healthy aging and lifespan optimization", icon: "⏳" },
    { title: "Trauma-Informed Care", description: "Supporting clients with trauma history", icon: "💚" },
    { title: "Meditation & Breathwork", description: "Contemplative practices for wellness", icon: "🌬️" },
  ];

  const careerOutcomes = [
    { value: "$70K-$140K", label: "Avg Annual Income" },
    { value: "Growing", label: "Emerging Field" },
    { value: "8,000+", label: "Certified Practitioners" },
    { value: "93%", label: "Client Satisfaction" },
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
            <Link href="/verify" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>Verify Credential</Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/ASI_LOGO-removebg-preview.png" alt="ASI" width={160} height={48} className="h-12 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  About <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/about" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>About ASI</Link>
                    <Link href="/leadership" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Leadership Team</Link>
                  </div>
                </div>
              </div>
              <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Standards</Link>
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Certifications <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[250px]">
                    <Link href="/certifications" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>All Certifications</Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link href="/certifications/functional-medicine" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Functional Medicine</Link>
                    <Link href="/certifications/womens-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Women's Health</Link>
                    <Link href="/certifications/gut-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Gut Health</Link>
                    <Link href="/certifications/nutrition" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Nutrition</Link>
                    <Link href="/certifications/mind-body" className="block px-4 py-2 text-sm hover:bg-gray-50 font-semibold" style={{ color: BRAND.gold }}>Mind-Body</Link>
                  </div>
                </div>
              </div>
              <Link href="/careers" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Careers</Link>
              <Link href="/directory" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Directory</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
              <Link href="/apply">
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/20">
                <span className="text-2xl">🧠</span>
                <span className="text-sm font-medium text-white">Mind-Body & Longevity</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Become a Certified
                <span className="block text-purple-200">Mind-Body Medicine Coach</span>
              </h1>

              <p className="text-xl mb-6 text-purple-100">
                Master stress, sleep, brain health, and longevity. Help clients optimize their mental and physical performance.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-purple-200" />
                  <span>Evidence-based protocols</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-purple-200" />
                  <span>Start free, no credit card</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/womens-health-mini-diploma">
                  <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto bg-white text-purple-600 hover:bg-purple-50">
                    Start Free Mini-Diploma
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/apply">
                  <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto border-white text-white hover:bg-white/10">
                    Apply for Full Certification
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {careerOutcomes.map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-purple-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Areas of Specialization</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specializations.map((spec, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{spec.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{spec.title}</h3>
                <p className="text-gray-600">{spec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Levels */}
      <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Choose Your Certification Level</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {certificationLevels.map((cert, i) => (
              <div key={i} className={`bg-white rounded-2xl p-8 shadow-lg border-2 ${cert.highlight ? 'border-purple-500 relative' : 'border-gray-100'}`}>
                {cert.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold bg-purple-500 text-white">Start Here</div>
                )}
                <div className="text-sm font-bold text-gray-500 mb-1">{cert.level}</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{cert.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold" style={{ color: cert.highlight ? '#7c3aed' : BRAND.burgundy }}>{cert.price}</span>
                  {cert.price !== "FREE" && <span className="text-sm text-gray-500">or payment plan</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4" />
                  {cert.duration}
                </div>
                <p className="text-gray-600 mb-6">{cert.description}</p>
                <ul className="space-y-2 mb-6">
                  {cert.outcomes.map((outcome, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: cert.highlight ? '#7c3aed' : BRAND.gold }} />
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
                <Link href={cert.href}>
                  <Button className={`w-full font-bold ${cert.highlight ? 'bg-purple-500 hover:bg-purple-600 text-white' : ''}`} style={!cert.highlight ? { backgroundColor: BRAND.burgundy, color: 'white' } : {}}>
                    {cert.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Start Your Mind-Body Journey Today</h2>
          <p className="text-xl mb-8 text-purple-200">Begin with our free Mini-Diploma. No credit card required.</p>
          <Link href="/womens-health-mini-diploma">
            <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto bg-white text-purple-600 hover:bg-purple-50">
              Start Free Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
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
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Certifications</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications/functional-medicine" className="hover:text-white transition-colors">Functional Medicine</Link></li>
                <li><Link href="/certifications/womens-health" className="hover:text-white transition-colors">Women's Health</Link></li>
                <li><Link href="/certifications/gut-health" className="hover:text-white transition-colors">Gut Health</Link></li>
                <li><Link href="/certifications/mind-body" className="hover:text-white transition-colors">Mind-Body</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Contact</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><a href="mailto:info@asi.edu" className="hover:text-white transition-colors">info@asi.edu</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm" style={{ color: "#f5e6e8" }}>© 2026 Accreditation Standards Institute. All rights reserved.</p>
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
