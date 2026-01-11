import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  Globe,
  Award,
  Users,
  Target,
  Heart,
  CheckCircle,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  Trophy,
  BookOpen,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "About ASI | Accreditation Standards Institute",
  description: "Learn about the Accreditation Standards Institute - the global authority in functional medicine and health certification with 20,000+ certified practitioners in 45+ countries.",
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

export default function AboutPage() {
  const milestones = [
    { year: "2020", title: "Founded", description: "ASI was founded with a mission to set rigorous standards for functional medicine certification." },
    { year: "2021", title: "1,000 Practitioners", description: "Reached our first major milestone with practitioners in 15 countries." },
    { year: "2022", title: "Dubai Office", description: "Expanded with our Middle East & Africa regional office in Dubai, UAE." },
    { year: "2023", title: "10,000 Certified", description: "Celebrated 10,000 certified practitioners and launched 25 new specializations." },
    { year: "2024", title: "Global Recognition", description: "Partnerships with major healthcare employers and recognition in 45+ countries." },
    { year: "2025", title: "20,000+ Practitioners", description: "Now the leading authority in functional medicine certification worldwide." },
  ];

  const values = [
    {
      icon: Shield,
      title: "Rigorous Standards",
      description: "We don't just issue certificates — we verify competency. Our assessments ensure every practitioner meets real-world practice standards."
    },
    {
      icon: Heart,
      title: "Student Success First",
      description: "We measure our success by your success. That's why we never leave you behind — support until completion, career launch assistance, and lifetime community."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Quality certification shouldn't be limited by geography or finances. We offer flexible learning, fair pricing, and recognition in 45+ countries."
    },
    {
      icon: Lightbulb,
      title: "Evidence-Based Education",
      description: "Our curriculum is developed by leading practitioners and updated continuously to reflect the latest research and best practices."
    },
    {
      icon: Users,
      title: "Community & Connection",
      description: "Learning is better together. Our study pods, mentorship programs, and practitioner network create lasting professional relationships."
    },
    {
      icon: Trophy,
      title: "Career Transformation",
      description: "We're not just educators — we're career architects. From first client to thriving practice, we guide you every step of the way."
    },
  ];

  const stats = [
    { value: "20,000+", label: "Certified Practitioners" },
    { value: "45+", label: "Countries" },
    { value: "50+", label: "Specializations" },
    { value: "94%", label: "Would Recommend" },
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
            <Link href="/directory" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Find a Practitioner
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
              <div className="relative group">
                <Link href="/about" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  About <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/about" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>About ASI</Link>
                    <Link href="/leadership" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Leadership Team</Link>
                    <Link href="/code-of-ethics" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Code of Ethics</Link>
                    <Link href="/accreditation" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Accreditation</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Standards <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]">
                    <Link href="/standards" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Our Standards</Link>
                    <Link href="/standards/competency-framework" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Competency Framework</Link>
                    <Link href="/standards/assessment" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Assessment Process</Link>
                    <Link href="/standards/recertification" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Recertification</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Certifications <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[250px]">
                    <Link href="/certifications" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>All Certifications</Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link href="/certifications/functional-medicine" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Functional Medicine</Link>
                    <Link href="/certifications/womens-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Women's Health</Link>
                    <Link href="/certifications/gut-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Gut Health</Link>
                    <Link href="/certifications/nutrition" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Nutrition</Link>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <Link href="/careers" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Careers <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/careers" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Career Paths</Link>
                    <Link href="/success-stories" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Success Stories</Link>
                    <Link href="/salary-guide" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Salary Guide</Link>
                  </div>
                </div>
              </div>

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
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Est. 2020 • San Francisco & Dubai</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              About the
              <span className="block" style={{ color: BRAND.gold }}>Accreditation Standards Institute</span>
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: "#f5e6e8" }}>
              We're on a mission to elevate the standard of functional medicine and health coaching worldwide — one practitioner at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
                <BookOpen className="w-4 h-4" style={{ color: BRAND.gold }} />
                <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Our Story</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
                Why We Started ASI
              </h2>

              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  In 2020, we noticed a problem: thousands of passionate people wanted to enter the functional medicine and health coaching field, but existing certifications varied wildly in quality, rigor, and recognition.
                </p>
                <p>
                  Employers couldn't tell which credentials meant something. Practitioners invested thousands of dollars only to find their certificates weren't respected. Clients didn't know who to trust.
                </p>
                <p>
                  <strong style={{ color: BRAND.burgundy }}>We decided to fix this.</strong>
                </p>
                <p>
                  ASI was founded to create a gold standard — rigorous competency-based certification that employers recognize, practitioners are proud of, and clients can trust.
                </p>
                <p>
                  Today, with 20,000+ certified practitioners in 45+ countries, we're proving that high standards and student success go hand in hand.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-burgundy-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Our Mission</h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To set the global standard for functional medicine and health certification — ensuring every practitioner has the knowledge, skills, and support to transform lives.
                </p>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <div className="text-6xl mb-6">🌟</div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Our Vision</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    A world where anyone seeking functional medicine care can find a rigorously trained, verified practitioner — and where practitioners can build thriving careers doing work they love.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <Heart className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>What We Believe</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These aren't just words on a wall — they guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: BRAND.burgundy }}>
                  <value.icon className="w-7 h-7" style={{ color: BRAND.gold }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.burgundy }}>{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <Calendar className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Our Journey</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Key Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2" style={{ backgroundColor: `${BRAND.gold}30` }} />

            <div className="space-y-12">
              {milestones.map((milestone, i) => (
                <div key={i} className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} pl-20 md:pl-0`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 inline-block text-left">
                      <div className="text-sm font-bold mb-2" style={{ color: BRAND.gold }}>{milestone.year}</div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full -translate-x-1/2 border-4 border-white shadow-md" style={{ backgroundColor: BRAND.gold }} />

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <Globe className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.gold }}>Global Presence</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Recognized Worldwide
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
              With headquarters in San Francisco and a regional office in Dubai, ASI serves practitioners across the globe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* USA HQ */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-4xl mb-4">🇺🇸</div>
              <h3 className="text-2xl font-bold text-white mb-2">USA Headquarters</h3>
              <p className="text-lg mb-4" style={{ color: BRAND.gold }}>San Francisco, California</p>
              <p style={{ color: "#f5e6e8" }}>
                Our main operations center, housing curriculum development, standards committee, and global operations.
              </p>
            </div>

            {/* Dubai Office */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-4xl mb-4">🇦🇪</div>
              <h3 className="text-2xl font-bold text-white mb-2">Dubai Office</h3>
              <p className="text-lg mb-4" style={{ color: BRAND.gold }}>Dubai, UAE</p>
              <p style={{ color: "#f5e6e8" }}>
                Regional hub for Middle East, Africa, and Asia-Pacific — supporting local practitioners and employer partnerships.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex flex-wrap justify-center gap-4 text-sm" style={{ color: "#f5e6e8" }}>
              <span className="px-4 py-2 rounded-full bg-white/10">North America</span>
              <span className="px-4 py-2 rounded-full bg-white/10">Europe</span>
              <span className="px-4 py-2 rounded-full bg-white/10">Middle East</span>
              <span className="px-4 py-2 rounded-full bg-white/10">Africa</span>
              <span className="px-4 py-2 rounded-full bg-white/10">Asia</span>
              <span className="px-4 py-2 rounded-full bg-white/10">Oceania</span>
              <span className="px-4 py-2 rounded-full bg-white/10">South America</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
            Ready to Join the ASI Community?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Become part of a global network of 20,000+ certified practitioners committed to excellence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/certifications">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Explore Certifications
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/leadership">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Meet Our Leadership
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
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Quick Links</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="/standards" className="hover:text-white transition-colors">Standards</Link></li>
                <li><Link href="/directory" className="hover:text-white transition-colors">Directory</Link></li>
                <li><Link href="/verify" className="hover:text-white transition-colors">Verify</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
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
