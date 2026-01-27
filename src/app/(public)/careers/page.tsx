import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Award,
  Users,
  Star,
  DollarSign,
  Clock,
  TrendingUp,
  Briefcase,
  Home,
  Building2,
  Heart,
  GraduationCap,
  Target,
  ChevronRight,
  Sparkles,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Professional Pathways | AccrediPro International Standards Institute",
  description: "Explore professional pathways in integrative health with ISI credentials. Discover where credentialed professionals work and career opportunities.",
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

export default function CareersPage() {
  const careerPaths = [
    {
      title: "Private Practice Owner",
      description: "Run your own functional medicine or health coaching practice",
      salary: "$75K - $200K+",
      icon: Home,
      color: "emerald",
      benefits: ["Set your own hours", "Choose your clients", "Unlimited income potential", "Work from anywhere"],
      timeToLaunch: "3-6 months post-certification",
    },
    {
      title: "Clinic Practitioner",
      description: "Work at integrative clinics, wellness centers, or medical offices",
      salary: "$55K - $95K",
      icon: Building2,
      color: "blue",
      benefits: ["Steady income", "Benefits package", "Established patient base", "Team collaboration"],
      timeToLaunch: "Immediately post-certification",
    },
    {
      title: "Corporate Wellness Coach",
      description: "Help companies improve employee health and reduce healthcare costs",
      salary: "$60K - $120K",
      icon: Briefcase,
      color: "purple",
      benefits: ["Corporate benefits", "Large impact", "Predictable hours", "Career advancement"],
      timeToLaunch: "1-3 months post-certification",
    },
    {
      title: "Online Health Coach",
      description: "Build a digital practice serving clients globally",
      salary: "$40K - $150K+",
      icon: Users,
      color: "pink",
      benefits: ["Location freedom", "Scalable income", "Global reach", "Flexible schedule"],
      timeToLaunch: "Immediately post-certification",
    },
    {
      title: "Wellness Retreat Facilitator",
      description: "Lead transformational health programs at resorts and retreats",
      salary: "$50K - $100K",
      icon: Heart,
      color: "amber",
      benefits: ["Travel opportunities", "Deep client impact", "Premium pricing", "Creative expression"],
      timeToLaunch: "6-12 months post-certification",
    },
    {
      title: "Supplement Company Educator",
      description: "Train practitioners and consumers for nutraceutical companies",
      salary: "$65K - $110K",
      icon: GraduationCap,
      color: "teal",
      benefits: ["Product access", "Industry connections", "Steady salary", "Teaching focus"],
      timeToLaunch: "1-3 months post-certification",
    },
  ];

  const salaryData = [
    { role: "Health Coach (Entry)", range: "$40K - $55K", avg: "$47K" },
    { role: "Health Coach (Experienced)", range: "$55K - $80K", avg: "$65K" },
    { role: "Functional Medicine Practitioner", range: "$65K - $120K", avg: "$85K" },
    { role: "Private Practice Owner", range: "$75K - $200K+", avg: "$125K" },
    { role: "Corporate Wellness Director", range: "$80K - $140K", avg: "$105K" },
    { role: "Clinic Director", range: "$90K - $150K", avg: "$115K" },
  ];

  const outcomes = [
    { value: "20K+", label: "Credentialed Professionals", icon: Users },
    { value: "500+", label: "Employer Partners", icon: Building2 },
    { value: "45+", label: "Countries Represented", icon: Target },
    { value: "94%", label: "Would Recommend ISI", icon: Star },
  ];

  const employers = [
    "Cleveland Clinic",
    "Canyon Ranch",
    "Parsley Health",
    "The UltraWellness Center",
    "Integrative Medicine Associates",
    "Life Time Fitness",
    "Optum",
    "Thrive Market",
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
              <TrendingUp className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Professional Pathways</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Professional Pathways in
              <span className="block" style={{ color: BRAND.gold }}>Integrative Health</span>
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: "#f5e6e8" }}>
              Discover where ISI credentialed professionals work and the career opportunities available to you.
            </p>
          </div>
        </div>
      </section>

      {/* Career Outcomes Stats */}
      <section className="border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {outcomes.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <stat.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: BRAND.burgundy }}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <Briefcase className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Explore Your Options</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Career Paths
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ASI certification opens doors to diverse career opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careerPaths.map((path, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <path.icon className="w-7 h-7" style={{ color: BRAND.gold }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{path.title}</h3>
                <p className="text-gray-600 mb-4">{path.description}</p>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600">{path.salary}</div>
                  <div className="text-xs text-gray-500">Annual salary range</div>
                </div>

                <ul className="space-y-2 mb-4">
                  {path.benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4" style={{ color: BRAND.gold }} />
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {path.timeToLaunch}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Salary Guide */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <DollarSign className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Know Your Worth</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Salary Guide 2025
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real salary data from ASI-certified practitioners
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: BRAND.burgundy }}>
                  <th className="text-left px-6 py-4 text-white font-semibold">Role</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Salary Range</th>
                  <th className="text-left px-6 py-4 text-white font-semibold">Average</th>
                </tr>
              </thead>
              <tbody>
                {salaryData.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium" style={{ color: BRAND.burgundy }}>{row.role}</td>
                    <td className="px-6 py-4 text-gray-600">{row.range}</td>
                    <td className="px-6 py-4 font-bold text-green-600">{row.avg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            * Based on 2024 salary survey of 2,500+ ASI-certified practitioners. Actual salaries vary by location, experience, and specialization.
          </p>
        </div>
      </section>

      {/* Employers */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Where ASI Practitioners Work
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Top employers actively seek ASI-certified practitioners
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {employers.map((employer, i) => (
              <div key={i} className="text-gray-400 font-bold text-xl md:text-2xl tracking-tight hover:text-gray-600 transition-colors">
                {employer}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Preview */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <Sparkles className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.gold }}>Real Results</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
              Hear from practitioners who transformed their careers with ASI
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Jennifer M.",
                role: "Functional Medicine Practitioner",
                quote: "6 months after my ASI certification, I'm running my own practice and earning more than I did as a hospital nurse.",
                outcome: "$125K",
                outcomeLabel: "Year 1 Income",
              },
              {
                name: "Rachel T.",
                role: "Women's Health Specialist",
                quote: "I finished my certification in 3 weeks. Two months later, I had 8 paying clients.",
                outcome: "8",
                outcomeLabel: "Clients in 60 Days",
              },
              {
                name: "Diane K.",
                role: "Menopause Coach",
                quote: "At 52, I thought it was too late to change careers. ASI proved me wrong.",
                outcome: "52",
                outcomeLabel: "Started at Age",
              },
            ].map((story, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5" style={{ color: BRAND.gold, fill: BRAND.gold }} />
                  ))}
                </div>
                <p className="text-white mb-6">"{story.quote}"</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="font-bold text-white">{story.name}</p>
                    <p className="text-sm" style={{ color: "#f5e6e8" }}>{story.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold" style={{ color: BRAND.gold }}>{story.outcome}</p>
                    <p className="text-xs" style={{ color: "#f5e6e8" }}>{story.outcomeLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/success-stories">
              <Button size="lg" className="font-bold hover:opacity-90" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                Read More Success Stories
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
            Begin Your Professional Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 20,000+ professionals building recognized careers in integrative health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Apply for Professional Review
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/directory">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Find Professionals
              </Button>
            </Link>
          </div>
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
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Career Resources</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/careers" className="hover:text-white transition-colors">Career Paths</Link></li>
                <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                <li><Link href="/salary-guide" className="hover:text-white transition-colors">Salary Guide</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Quick Links</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="/apply" className="hover:text-white transition-colors">Apply</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
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
