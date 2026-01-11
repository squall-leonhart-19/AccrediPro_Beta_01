import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Award,
  BookOpen,
  RefreshCw,
  ChevronDown,
  Clock,
  Calendar,
  FileCheck,
  GraduationCap,
  Users,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Recertification | Accreditation Standards Institute",
  description: "Learn about ASI's lifetime credentials and continuing education requirements. Maintain your active status through ongoing professional development.",
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

export default function RecertificationPage() {
  const ceCategories = [
    {
      title: "Clinical Education",
      credits: "20 CEUs",
      description: "Courses, webinars, and workshops that expand clinical knowledge and skills.",
      examples: ["Advanced protocols training", "New research updates", "Specialty certifications"],
    },
    {
      title: "Professional Development",
      credits: "10 CEUs",
      description: "Business, communication, and practice management education.",
      examples: ["Practice building courses", "Communication training", "Ethics education"],
    },
    {
      title: "Community Participation",
      credits: "10 CEUs",
      description: "Active engagement in the ASI practitioner community.",
      examples: ["Peer mentorship", "Case presentations", "Community leadership"],
    },
  ];

  const ceWays = [
    {
      icon: BookOpen,
      title: "ASI Continuing Education",
      description: "Access our library of 100+ CE courses included with your membership.",
      credits: "Unlimited",
    },
    {
      icon: GraduationCap,
      title: "Additional Certifications",
      description: "Earn a new ASI specialty certification to fulfill all CE requirements.",
      credits: "40 CEUs",
    },
    {
      icon: Users,
      title: "Conference Attendance",
      description: "Attend approved functional medicine conferences and summits.",
      credits: "Up to 20 CEUs",
    },
    {
      icon: FileCheck,
      title: "External Courses",
      description: "Submit approved external courses for CE credit consideration.",
      credits: "Up to 20 CEUs",
    },
  ];

  const timeline = [
    {
      period: "Year 1-2",
      milestone: "Earn 20 CEUs",
      description: "Complete half your continuing education requirement in the first two years.",
    },
    {
      period: "Year 3-4",
      milestone: "Earn 20 CEUs",
      description: "Complete remaining credits and ensure all categories are fulfilled.",
    },
    {
      period: "Year 4 End",
      milestone: "Submit for Review",
      description: "Your CEU log is automatically reviewed. If complete, status is renewed.",
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
                    <Link href="/code-of-ethics" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Code of Ethics</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Standards <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]">
                    <Link href="/standards" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Our Standards</Link>
                    <Link href="/standards/competency-framework" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Competency Framework</Link>
                    <Link href="/standards/assessment" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Assessment Process</Link>
                    <Link href="/standards/recertification" className="block px-4 py-2 text-sm hover:bg-gray-50 font-semibold" style={{ color: BRAND.gold }}>Recertification</Link>
                  </div>
                </div>
              </div>
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

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <RefreshCw className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Recertification</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Lifetime Credential,
            <span className="block" style={{ color: BRAND.gold }}>Ongoing Excellence</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "#f5e6e8" }}>
            Your ASI certification never expires. Maintain active status through continuing education to stay current and connected.
          </p>

          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">40</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>CEUs per 4 years</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">100+</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>Free CE courses</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Lifetime</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>Credential validity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${BRAND.gold}20` }}>
                <Award className="w-8 h-8" style={{ color: BRAND.burgundy }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>Never Expires</h3>
              <p className="text-gray-600">Your credential is valid for life. Active status simply indicates you're current with CE requirements.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${BRAND.gold}20` }}>
                <BookOpen className="w-8 h-8" style={{ color: BRAND.burgundy }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>Free CE Library</h3>
              <p className="text-gray-600">Access 100+ continuing education courses at no additional cost as part of your certification.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${BRAND.gold}20` }}>
                <Sparkles className="w-8 h-8" style={{ color: BRAND.burgundy }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>Stay Current</h3>
              <p className="text-gray-600">CE requirements ensure you're always up-to-date with the latest research and best practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CE Requirements */}
      <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Continuing Education Requirements
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Earn 40 CEUs every 4-year cycle across three categories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {ceCategories.map((category, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>{category.title}</h3>
                  <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                    {category.credits}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-sm font-medium mb-2" style={{ color: BRAND.burgundy }}>Examples:</p>
                  <ul className="space-y-2">
                    {category.examples.map((example, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                        <span className="text-gray-700">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Earn CE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Ways to Earn CEUs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Multiple pathways to fulfill your continuing education requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ceWays.map((way, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <way.icon className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{way.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{way.description}</p>
                <p className="text-sm font-bold" style={{ color: BRAND.gold }}>{way.credits}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              4-Year Recertification Cycle
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
              Pace yourself over four years to easily meet requirements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {timeline.map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: BRAND.gold }}>
                  <Calendar className="w-4 h-4" style={{ color: BRAND.burgundyDark }} />
                  <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>{item.period}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.milestone}</h3>
                <p style={{ color: "#f5e6e8" }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Recertification FAQs
            </h2>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>What happens if I don't complete CE requirements?</h3>
              <p className="text-gray-600">Your credential status changes from "Active" to "Inactive" in the directory. Your certification remains valid — you simply need to complete CE requirements to return to active status.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>Is there a renewal fee?</h3>
              <p className="text-gray-600">No annual or renewal fees. Your initial certification investment includes lifetime credential validity. The only cost is maintaining community membership ($29/month) if you want to access the free CE library.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>Can I earn CEUs before I complete my certification?</h3>
              <p className="text-gray-600">Yes! Any qualifying education completed within 12 months before certification can count toward your first recertification cycle.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>How do I track my CEUs?</h3>
              <p className="text-gray-600">Your dashboard automatically tracks all ASI courses. For external education, simply upload your certificate and we'll review and add credits within 5 business days.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
            Ready to Get Certified?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 20,000+ practitioners with lifetime ASI credentials. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/certifications">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Explore Certifications
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
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Standards</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/standards" className="hover:text-white transition-colors">Our Standards</Link></li>
                <li><Link href="/standards/competency-framework" className="hover:text-white transition-colors">Competency Framework</Link></li>
                <li><Link href="/standards/assessment" className="hover:text-white transition-colors">Assessment Process</Link></li>
                <li><Link href="/standards/recertification" className="hover:text-white transition-colors">Recertification</Link></li>
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
