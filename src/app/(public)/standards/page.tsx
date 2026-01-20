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
  FileCheck,
  Users,
  Globe,
  ClipboardCheck,
  GraduationCap,
  RefreshCw,
  ChevronRight,
  Briefcase,
  Star,
} from "lucide-react";

export const metadata = {
  title: "Our Standards | Accreditation Standards Institute",
  description: "Learn about ASI's rigorous competency-based certification standards. Our assessments ensure every practitioner meets real-world practice requirements.",
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

export default function StandardsPage() {
  const competencyDomains = [
    {
      icon: BookOpen,
      title: "Knowledge",
      description: "Foundational understanding of functional medicine principles, pathophysiology, and evidence-based interventions.",
      weight: "30%",
    },
    {
      icon: ClipboardCheck,
      title: "Clinical Skills",
      description: "Ability to conduct assessments, interpret findings, develop protocols, and guide clients safely.",
      weight: "35%",
    },
    {
      icon: Users,
      title: "Communication",
      description: "Coaching techniques, motivational interviewing, and the ability to build trust and rapport with clients.",
      weight: "20%",
    },
    {
      icon: Briefcase,
      title: "Professional Practice",
      description: "Ethical conduct, scope of practice awareness, documentation, and collaboration with healthcare teams.",
      weight: "15%",
    },
  ];

  const assessmentProcess = [
    {
      step: "1",
      title: "Module Assessments",
      description: "Knowledge checks after each learning module ensure comprehension before moving forward.",
    },
    {
      step: "2",
      title: "Case Studies",
      description: "Apply your knowledge to realistic client scenarios, demonstrating clinical reasoning and decision-making.",
    },
    {
      step: "3",
      title: "Practical Demonstration",
      description: "Show your skills through recorded sessions, written protocols, or supervised practice.",
    },
    {
      step: "4",
      title: "Final Examination",
      description: "Comprehensive assessment covering all competency domains. 89% first-attempt pass rate.",
    },
  ];

  const standards = [
    {
      title: "Competency-Based",
      description: "We assess what you can DO, not just what you know. Every certification requires demonstration of real-world skills.",
      icon: Target,
    },
    {
      title: "Evidence-Based",
      description: "All curriculum and assessment criteria are grounded in current research and best practices in functional medicine.",
      icon: FileCheck,
    },
    {
      title: "Employer-Aligned",
      description: "Our competencies are developed in consultation with employers to ensure graduates meet workplace requirements.",
      icon: Briefcase,
    },
    {
      title: "Globally Relevant",
      description: "Standards are designed to be applicable across healthcare systems in 45+ countries.",
      icon: Globe,
    },
    {
      title: "Continuously Updated",
      description: "Our Standards Committee reviews and updates requirements annually based on emerging research and industry feedback.",
      icon: RefreshCw,
    },
    {
      title: "Transparently Assessed",
      description: "Clear rubrics, multiple attempt opportunities, and detailed feedback ensure fair and supportive evaluation.",
      icon: ClipboardCheck,
    },
  ];

  const certificationLevels = [
    {
      level: "Level 1",
      name: "Foundation",
      requirements: [
        "Complete all core modules",
        "Pass knowledge assessments (70% minimum)",
        "Complete 2 case studies",
        "No prerequisites required",
      ],
      color: "#64748b",
    },
    {
      level: "Level 2",
      name: "Professional",
      requirements: [
        "Hold Foundation certification",
        "Complete advanced modules",
        "Pass comprehensive exam (75% minimum)",
        "Submit 5 supervised case studies",
        "Complete practical skills assessment",
      ],
      color: BRAND.burgundy,
    },
    {
      level: "Level 3",
      name: "Board Certified",
      requirements: [
        "Hold Professional certification",
        "Minimum 100 client hours documented",
        "Pass board examination (80% minimum)",
        "Peer review and supervision logs",
        "Ethics and professional conduct review",
      ],
      color: BRAND.gold,
    },
    {
      level: "Level 4",
      name: "Master Practitioner",
      requirements: [
        "Hold Board certification",
        "Minimum 500 client hours documented",
        "Contribute to field (research, teaching, publication)",
        "Mentor assessment and recommendation",
        "Master's panel evaluation",
      ],
      color: "#1a1a2e",
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
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Competency-Based Certification</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Our Standards
              <span className="block" style={{ color: BRAND.gold }}>Set the Bar Higher</span>
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: "#f5e6e8" }}>
              ASI certifications are built on rigorous, competency-based standards that ensure every practitioner is ready for real-world practice.
            </p>
          </div>
        </div>
      </section>

      {/* Why Standards Matter */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Why Standards Matter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              In an industry with inconsistent credentialing, ASI stands apart with rigorous standards that protect practitioners, clients, and the profession.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {standards.map((standard, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <standard.icon className="w-7 h-7" style={{ color: BRAND.gold }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.burgundy }}>{standard.title}</h3>
                <p className="text-gray-600 leading-relaxed">{standard.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competency Framework */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <Target className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>What We Assess</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Competency Framework
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every ASI certification assesses four key domains of competency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {competencyDomains.map((domain, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: BRAND.burgundy }}>
                  <domain.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: BRAND.gold }}>{domain.weight}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{domain.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{domain.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Process */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <ClipboardCheck className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>How We Assess</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Assessment Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A multi-layered approach that ensures genuine competency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {assessmentProcess.map((step, i) => (
              <div key={i} className="relative">
                {i < assessmentProcess.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5" style={{ backgroundColor: `${BRAND.gold}30` }} />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-green-50 rounded-2xl p-8 border border-green-100 text-center">
            <div className="flex items-center justify-center gap-2 text-green-700 font-bold mb-2">
              <CheckCircle className="w-5 h-5" />
              89% First-Attempt Pass Rate
            </div>
            <p className="text-green-600">
              With clear expectations, quality preparation, and unlimited retakes, most candidates pass on their first try.
            </p>
          </div>
        </div>
      </section>

      {/* Certification Levels */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <GraduationCap className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.gold }}>Progressive Credentialing</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Certification Levels
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
              Each level builds on the last, with progressively rigorous requirements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationLevels.map((level, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: level.color }}>
                  {level.level}
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: BRAND.burgundy }}>{level.name}</h3>
                <ul className="space-y-2">
                  {level.requirements.map((req, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BRAND.gold }} />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learn from 95+ Coaches */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <Users className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Expert Faculty</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Learn from <span style={{ color: BRAND.gold }}>95+ Coaches</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our curriculum is developed and taught by certified practitioners who've transformed their own lives and built thriving practices
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {/* Sarah - Lead Coach */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border-2 hover:shadow-xl transition-shadow relative" style={{ borderColor: BRAND.gold }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                Lead Coach
              </div>
              <div className="aspect-square rounded-xl overflow-hidden mb-3 mt-2">
                <Image src="/coaches/sarah-mitchell.webp" alt="Sarah" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Sarah</h3>
              <p className="text-xs text-center text-gray-500">Functional Medicine</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>400+ clients helped</p>
            </div>

            {/* Olivia */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/olivia.webp" alt="Olivia" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Olivia</h3>
              <p className="text-xs text-center text-gray-500">Trauma Recovery</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>280+ clients helped</p>
            </div>

            {/* Luna */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/luna.webp" alt="Luna" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Luna</h3>
              <p className="text-xs text-center text-gray-500">Energy Healing</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>350+ clients helped</p>
            </div>

            {/* Maya */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/maya.webp" alt="Maya" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Maya</h3>
              <p className="text-xs text-center text-gray-500">Mindfulness & EFT</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>200+ clients helped</p>
            </div>

            {/* Emma */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/emma.webp" alt="Emma" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Emma</h3>
              <p className="text-xs text-center text-gray-500">Birth & Parenting</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>150+ clients helped</p>
            </div>

            {/* Bella */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/bella.webp" alt="Bella" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Bella</h3>
              <p className="text-xs text-center text-gray-500">Pet Wellness</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>180+ clients helped</p>
            </div>

            {/* Sage */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/sage.webp" alt="Sage" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Sage</h3>
              <p className="text-xs text-center text-gray-500">Herbalism</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>120+ clients helped</p>
            </div>

            {/* Grace */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/grace.webp" alt="Grace" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Grace</h3>
              <p className="text-xs text-center text-gray-500">Faith-Based Coaching</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>175+ clients helped</p>
            </div>

            {/* Rachel */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                <Image src="/coaches/rachel.webp" alt="Rachel" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-center" style={{ color: BRAND.burgundy }}>Rachel</h3>
              <p className="text-xs text-center text-gray-500">LGBTQ+ Wellness</p>
              <p className="text-xs text-center mt-1" style={{ color: BRAND.gold }}>140+ clients helped</p>
            </div>

            {/* +86 More */}
            <div className="bg-gradient-to-br rounded-2xl p-4 flex flex-col items-center justify-center" style={{ backgroundColor: BRAND.cream, border: `2px dashed ${BRAND.gold}` }}>
              <div className="text-4xl font-bold mb-2" style={{ color: BRAND.burgundy }}>+86</div>
              <p className="text-sm text-center font-medium" style={{ color: BRAND.burgundy }}>More Expert Coaches</p>
              <p className="text-xs text-center text-gray-500 mt-1">Across 15+ specialties</p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/directory">
              <Button size="lg" className="font-bold hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Meet All Our Coaches
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Maintaining Standards */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
                <RefreshCw className="w-4 h-4" style={{ color: BRAND.gold }} />
                <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Continuous Improvement</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
                How We Maintain Standards
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                    <Star className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>Standards Committee</h3>
                    <p className="text-gray-600">Industry experts, practitioners, and educators review standards annually.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                    <Users className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>Employer Advisory</h3>
                    <p className="text-gray-600">Regular input from hiring organizations ensures workplace relevance.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                    <BookOpen className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>Research Integration</h3>
                    <p className="text-gray-600">Continuous curriculum updates based on emerging evidence.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                    <Award className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>Graduate Outcomes</h3>
                    <p className="text-gray-600">We track career success metrics to validate program effectiveness.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Continuing Education</h3>
              <p className="text-gray-600 mb-6">
                ASI credentials are lifetime valid, but active status requires ongoing learning to stay current with best practices.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">20 CE credits per year for active status</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">Free monthly webinars for certificants</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">Discounted advanced specializations</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">Annual conference access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 text-white text-center" style={{ background: BRAND.burgundyMetallic }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Meet the Standard?
          </h2>
          <p className="text-xl mb-8" style={{ color: "#f5e6e8" }}>
            Join 20,000+ practitioners who've proven their competency through ASI certification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/certifications">
              <Button size="lg" className="font-bold text-lg px-10 py-6 h-auto shadow-xl hover:opacity-90" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                Explore Certifications
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-10 py-6 h-auto hover:opacity-90" style={{ backgroundColor: "transparent", border: "2px solid white", color: "white" }}>
                Apply Now
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
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Quick Links</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="/apply" className="hover:text-white transition-colors">Apply</Link></li>
                <li><Link href="/verify" className="hover:text-white transition-colors">Verify</Link></li>
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
