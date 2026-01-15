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
  Target,
  Users,
  Clock,
  ChevronDown,
  Star,
  DollarSign,
  Briefcase,
  GraduationCap,
  Play,
} from "lucide-react";

import { SchemaOrchestrator } from "@/components/seo/schema/SchemaOrchestrator";

export const metadata = {
  title: "Functional Medicine Certification | ASI",
  description: "Become a certified Functional Medicine Practitioner. Learn root-cause medicine, systems biology, and evidence-based protocols. Start free with our Mini-Diploma.",
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

export default function FunctionalMedicinePage() {
  const certificationLevels = [
    {
      level: "Level 1",
      name: "Foundation Certificate",
      duration: "4-6 weeks",
      price: "FREE",
      description: "Introduction to functional medicine principles and root-cause thinking.",
      outcomes: ["Understand FM principles", "Learn timeline & matrix tools", "Foundation knowledge"],
      cta: "Start Free",
      href: "/womens-health-mini-diploma",
      highlight: true,
    },
    {
      level: "Level 2",
      name: "Functional Medicine Coach",
      duration: "8-12 weeks",
      price: "$1,997",
      description: "Comprehensive training to work with clients using functional medicine approaches.",
      outcomes: ["Full FM framework mastery", "Client assessment skills", "Protocol development"],
      cta: "Enroll Now",
      href: "/apply",
      highlight: false,
    },
    {
      level: "Level 3",
      name: "Board Certified FMP",
      duration: "4-6 months",
      price: "$3,997",
      description: "Advanced certification with clinical mentorship and board-level assessment.",
      outcomes: ["Advanced protocols", "Clinical mentorship", "Board certification"],
      cta: "Apply Now",
      href: "/apply",
      highlight: false,
    },
  ];

  const curriculum = [
    {
      module: "Module 1-2",
      title: "Functional Medicine Foundations",
      topics: ["What is Functional Medicine", "Systems Biology Thinking", "The FM Timeline & Matrix", "Root Cause vs. Symptom Treatment"],
    },
    {
      module: "Module 3-4",
      title: "Clinical Assessment",
      topics: ["Health History Taking", "Pattern Recognition", "Red Flags & Referrals", "Documentation Systems"],
    },
    {
      module: "Module 5-6",
      title: "Core Body Systems",
      topics: ["Gut Health & Microbiome", "Hormonal Balance", "Detoxification Pathways", "Immune Function"],
    },
    {
      module: "Module 7-8",
      title: "Therapeutic Interventions",
      topics: ["Nutrition Protocols", "Lifestyle Medicine", "Supplement Guidance", "Stress Management"],
    },
    {
      module: "Module 9-10",
      title: "Professional Practice",
      topics: ["Scope of Practice", "Ethics & Boundaries", "Building Your Practice", "Working with Providers"],
    },
  ];

  const careerOutcomes = [
    { value: "$75K-$150K", label: "Avg Annual Income" },
    { value: "14 Days", label: "Avg to First Client" },
    { value: "20,000+", label: "Certified Practitioners" },
    { value: "45+", label: "Countries" },
  ];

  const testimonials = [
    {
      name: "Jennifer M.",
      location: "Texas",
      quote: "After 15 years as a nurse, ASI's FM certification helped me start my own practice. I'm now earning more than I did in the hospital.",
      outcome: "$125K first year",
    },
    {
      name: "Diana K.",
      location: "Florida",
      quote: "I was skeptical about online certifications, but ASI's rigor impressed me. The competency-based approach means I actually know what I'm doing.",
      outcome: "8 clients in 60 days",
    },
  ];

  return (
    <>
      <SchemaOrchestrator
        schemas={[
          {
            type: "Course",
            data: {
              name: "Certified Functional Medicine Practitioner",
              description: "Comprehensive 14-module functional medicine certification covering root-cause analysis, systems biology, and evidence-based protocols. Accredited by ASI with 50+ CEU credits.",
              duration: "P12W"
            }
          },
          {
            type: "Product",
            data: {
              name: "Functional Medicine Certification (Practitioner Kit)",
              description: "Board Certified Functional Medicine Practitioner credential including physical welcome kit and lifetime access.",
              url: "https://accredipro.academy/certifications/functional-medicine",
              price: "1997.00"
            }
          },
          {
            type: "FAQPage",
            data: {
              questions: [
                {
                  question: "What is the Functional Medicine certification?",
                  answer: "It is a comprehensive 14-module certification program covering root-cause medicine, systems biology, clinical assessment, and therapeutic interventions. Accredited by ASI with 50+ CEU credits."
                },
                {
                  question: "How long does it take to complete?",
                  answer: "The course is self-paced but typically takes 12 weeks with 3-5 hours of study per week. You have lifetime access to all materials."
                },
                {
                  question: "Is this certification accredited?",
                  answer: "Yes, the program is fully accredited by the AccrediPro Standards Institute (ASI) and provides 50+ CEU credits recognized by major health organizations."
                },
                {
                  question: "Can I start for free?",
                  answer: "Yes! Start with our free Mini-Diploma to experience the curriculum before committing to the full certification."
                }
              ]
            }
          }
        ]}
      />
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
              <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Standards</Link>
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Certifications <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[250px]">
                    <Link href="/certifications" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>All Certifications</Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link href="/certifications/functional-medicine" className="block px-4 py-2 text-sm hover:bg-gray-50 font-semibold" style={{ color: BRAND.gold }}>Functional Medicine</Link>
                    <Link href="/certifications/womens-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Women's Health</Link>
                    <Link href="/certifications/gut-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Gut Health</Link>
                    <Link href="/certifications/nutrition" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Nutrition</Link>
                    <Link href="/certifications/mind-body" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Mind-Body</Link>
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
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #818cf8 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/20">
                <span className="text-2xl">🧬</span>
                <span className="text-sm font-medium text-white">Functional Medicine</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Become a Certified
                <span className="block text-indigo-200">Functional Medicine Practitioner</span>
              </h1>

              <p className="text-xl mb-6 text-indigo-100">
                Master the complete framework for root-cause health. Join 20,000+ practitioners using functional medicine to transform lives.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-indigo-200" />
                  <span>Competency-based certification</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-indigo-200" />
                  <span>Start free, no credit card</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-indigo-200" />
                  <span>Lifetime credential</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/womens-health-mini-diploma">
                  <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto bg-white text-indigo-600 hover:bg-indigo-50">
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
                      <p className="text-sm text-indigo-200">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Levels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Choose Your Certification Level
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and advance at your own pace
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {certificationLevels.map((cert, i) => (
              <div key={i} className={`rounded-2xl p-8 shadow-lg border-2 ${cert.highlight ? 'border-indigo-500 relative' : 'border-gray-100'}`}>
                {cert.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold bg-indigo-500 text-white">
                    Start Here
                  </div>
                )}
                <div className="text-sm font-bold text-gray-500 mb-1">{cert.level}</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{cert.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl font-bold" style={{ color: cert.highlight ? '#4f46e5' : BRAND.burgundy }}>{cert.price}</span>
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
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: cert.highlight ? '#4f46e5' : BRAND.gold }} />
                      <span className="text-gray-700">{outcome}</span>
                    </li>
                  ))}
                </ul>
                <Link href={cert.href}>
                  <Button className={`w-full font-bold ${cert.highlight ? 'bg-indigo-500 hover:bg-indigo-600 text-white' : ''}`} style={!cert.highlight ? { backgroundColor: BRAND.burgundy, color: 'white' } : {}}>
                    {cert.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive curriculum covering all aspects of functional medicine practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculum.map((module, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-sm font-bold mb-2" style={{ color: '#4f46e5' }}>{module.module}</div>
                <h3 className="text-lg font-bold mb-3" style={{ color: BRAND.burgundy }}>{module.title}</h3>
                <ul className="space-y-2">
                  {module.topics.map((topic, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                      <span className="text-gray-600">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Success Stories
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-current" style={{ color: BRAND.gold }} />
                  ))}
                </div>
                <p className="text-lg text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold" style={{ color: BRAND.burgundy }}>{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#4f46e5' }}>{testimonial.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Start Your Functional Medicine Journey Today
          </h2>
          <p className="text-xl mb-8 text-indigo-200">
            Begin with our free Mini-Diploma. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/womens-health-mini-diploma">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto bg-white text-indigo-600 hover:bg-indigo-50">
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
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
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Certifications</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications/functional-medicine" className="hover:text-white transition-colors">Functional Medicine</Link></li>
                <li><Link href="/certifications/womens-health" className="hover:text-white transition-colors">Women's Health</Link></li>
                <li><Link href="/certifications/gut-health" className="hover:text-white transition-colors">Gut Health</Link></li>
                <li><Link href="/certifications/nutrition" className="hover:text-white transition-colors">Nutrition</Link></li>
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
    </>
  );
}
