import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Award,
  DollarSign,
  TrendingUp,
  Users,
  Briefcase,
  ChevronDown,
  Globe,
  Clock,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Compensation Research 2026 | AccrediPro International Standards Institute",
  description: "Industry compensation data and career earnings research for certified integrative health professionals across specializations.",
};

const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export default function SalaryGuidePage() {
  const salaryRanges = [
    {
      certification: "Functional Medicine Practitioner",
      entry: "$55,000 - $75,000",
      mid: "$75,000 - $110,000",
      senior: "$110,000 - $175,000+",
      avgHourly: "$85 - $200",
      growth: "+18%",
      color: "#4f46e5",
    },
    {
      certification: "Women's Health Specialist",
      entry: "$50,000 - $70,000",
      mid: "$70,000 - $100,000",
      senior: "$100,000 - $160,000+",
      avgHourly: "$75 - $175",
      growth: "+22%",
      color: "#db2777",
    },
    {
      certification: "Gut Health Specialist",
      entry: "$48,000 - $68,000",
      mid: "$68,000 - $95,000",
      senior: "$95,000 - $145,000+",
      avgHourly: "$70 - $165",
      growth: "+20%",
      color: "#059669",
    },
    {
      certification: "Holistic Nutrition Coach",
      entry: "$42,000 - $60,000",
      mid: "$60,000 - $85,000",
      senior: "$85,000 - $130,000+",
      avgHourly: "$60 - $150",
      growth: "+15%",
      color: "#15803d",
    },
    {
      certification: "Mind-Body Medicine Coach",
      entry: "$45,000 - $65,000",
      mid: "$65,000 - $90,000",
      senior: "$90,000 - $140,000+",
      avgHourly: "$65 - $160",
      growth: "+25%",
      color: "#7c3aed",
    },
    {
      certification: "Health Coach (General)",
      entry: "$40,000 - $55,000",
      mid: "$55,000 - $75,000",
      senior: "$75,000 - $110,000+",
      avgHourly: "$50 - $125",
      growth: "+12%",
      color: "#0891b2",
    },
  ];

  const earningFactors = [
    {
      icon: Briefcase,
      title: "Practice Model",
      description: "Private practice owners typically earn 40-60% more than employed practitioners.",
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Major metros and coastal areas command 20-35% higher rates than rural areas.",
    },
    {
      icon: Award,
      title: "Certifications",
      description: "Each additional specialty certification increases earning potential by 10-15%.",
    },
    {
      icon: Users,
      title: "Client Volume",
      description: "Full client loads (20-25 clients/week) maximize income potential.",
    },
    {
      icon: TrendingUp,
      title: "Experience",
      description: "Practitioners with 5+ years experience earn 50-80% more than new graduates.",
    },
    {
      icon: Globe,
      title: "Online vs In-Person",
      description: "Virtual practices can access higher-paying markets regardless of location.",
    },
  ];

  const incomeModels = [
    {
      model: "1:1 Coaching",
      description: "Private sessions with individual clients",
      avgPrice: "$150-$300/session",
      potentialIncome: "$75K - $150K/year",
      pros: ["High per-session rates", "Deep client relationships", "Flexible schedule"],
    },
    {
      model: "Group Programs",
      description: "Cohort-based courses and group coaching",
      avgPrice: "$497-$2,997/person",
      potentialIncome: "$100K - $300K/year",
      pros: ["Scalable income", "Community building", "Efficient time use"],
    },
    {
      model: "Hybrid Practice",
      description: "Combination of 1:1 and group offerings",
      avgPrice: "Varies",
      potentialIncome: "$125K - $250K/year",
      pros: ["Diversified income", "Best of both models", "Client pathway options"],
    },
    {
      model: "Corporate Wellness",
      description: "B2B services for companies",
      avgPrice: "$5K-$50K/contract",
      potentialIncome: "$80K - $200K/year",
      pros: ["Larger contracts", "Recurring revenue", "Professional environment"],
    },
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
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="Accreditation Standards Institute"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
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
              <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Certifications</Link>
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Careers <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/careers" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Career Paths</Link>
                    <Link href="/success-stories" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Success Stories</Link>
                    <Link href="/salary-guide" className="block px-4 py-2 text-sm hover:bg-gray-50 font-semibold" style={{ color: BRAND.gold }}>Salary Guide</Link>
                    <Link href="/job-board" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Job Board</Link>
                  </div>
                </div>
              </div>
              <Link href="/directory" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Directory</Link>
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

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <DollarSign className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Industry Compensation Research</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Professional
            <span className="block" style={{ color: BRAND.gold }}>Compensation Guide</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "#f5e6e8" }}>
            Comprehensive industry data on compensation ranges for certified integrative health professionals across all specializations.
          </p>

          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">$75K - $150K+</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>Median Annual Range</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">+18%</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>Industry Growth Rate</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">20K+</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>Professionals Surveyed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Salary Table */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Salary Ranges by Certification
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Based on 2025-2026 data from ASI graduate surveys and industry reports
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2" style={{ borderColor: BRAND.burgundy }}>
                  <th className="text-left py-4 px-4 font-bold" style={{ color: BRAND.burgundy }}>Certification</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: BRAND.burgundy }}>Entry Level</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: BRAND.burgundy }}>Mid-Career</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: BRAND.burgundy }}>Senior/Owner</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: BRAND.burgundy }}>Hourly Rate</th>
                  <th className="text-center py-4 px-4 font-bold" style={{ color: BRAND.burgundy }}>Growth</th>
                </tr>
              </thead>
              <tbody>
                {salaryRanges.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
                        <span className="font-medium" style={{ color: BRAND.burgundy }}>{row.certification}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-gray-600">{row.entry}</td>
                    <td className="text-center py-4 px-4 text-gray-600">{row.mid}</td>
                    <td className="text-center py-4 px-4 font-medium" style={{ color: BRAND.burgundy }}>{row.senior}</td>
                    <td className="text-center py-4 px-4 text-gray-600">{row.avgHourly}</td>
                    <td className="text-center py-4 px-4">
                      <span className="px-2 py-1 rounded-full text-sm font-bold bg-green-100 text-green-700">{row.growth}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            *Data based on US market. International rates vary by region.
          </p>
        </div>
      </section>

      {/* Earning Factors */}
      <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Factors That Affect Earnings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Understanding what drives higher income in the health coaching industry
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earningFactors.map((factor, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <factor.icon className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{factor.title}</h3>
                <p className="text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Income Models */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Business Models & Income Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Different ways to structure your practice for maximum income
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {incomeModels.map((model, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{model.model}</h3>
                <p className="text-gray-600 mb-4">{model.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Avg Pricing</p>
                    <p className="font-bold" style={{ color: BRAND.burgundy }}>{model.avgPrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Potential Income</p>
                    <p className="font-bold" style={{ color: BRAND.gold }}>{model.potentialIncome}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-medium mb-2" style={{ color: BRAND.burgundy }}>Key Benefits:</p>
                  <ul className="space-y-1">
                    {model.pros.map((pro, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4" style={{ color: BRAND.gold }} />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Begin Your Professional Journey
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
            Join 20,000+ professionals building recognized careers in integrative health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                Apply for Professional Review
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/job-board">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto border-white text-white hover:bg-white/10">
                Professional Opportunities
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
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Careers</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/careers" className="hover:text-white transition-colors">Career Paths</Link></li>
                <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                <li><Link href="/salary-guide" className="hover:text-white transition-colors">Salary Guide</Link></li>
                <li><Link href="/job-board" className="hover:text-white transition-colors">Job Board</Link></li>
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
