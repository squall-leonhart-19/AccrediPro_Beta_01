import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";
import { ISIHeader } from "@/components/layout/isi-header";
import { ISIFooter } from "@/components/layout/isi-footer";
import {
  Award,
  BookOpen,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  GraduationCap,
  Shield,
  Globe,
  TrendingUp,
  Trophy,
  FileCheck,
  Briefcase,
  BadgeCheck,
  Sparkles,
  DollarSign,
  Target,
  UserCheck,
  HeartHandshake,
  Search,
  Building2,
  ScrollText,
  Quote,
  MapPin,
  Clock,
  Calendar,
  ChevronDown,
  Play,
  Zap,
  X,
  HelpCircle,
  Linkedin,
  CheckCheck,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Accreditation Standards Institute | The Global Authority in Functional Medicine & Health Certification",
  description: "Join 20,000+ certified practitioners in 45+ countries. ASI is the global authority in functional medicine and health certification. USA & Dubai offices.",
};

// Brand Colors from logo
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
  navy: "#1a1a2e",
  // Metallic gradients
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

export default function HomePage() {
  const stats = [
    { value: "20,000+", label: "Professionals Operating Under ISI Standards", icon: Users },
    { value: "45+", label: "Countries Represented", icon: Globe },
    { value: "50+", label: "Professional Specializations", icon: Award },
    { value: "2026", label: "Swiss University Partnership", icon: GraduationCap },
  ];

  const certificationCategories = [
    {
      name: "Functional Medicine",
      description: "The complete framework for root-cause health",
      certifications: ["Functional Medicine Practitioner", "Integrative Health Specialist", "Root Cause Medicine Coach"],
      icon: "🧬",
      color: "from-indigo-600 to-indigo-800",
      href: "/certifications/functional-medicine",
    },
    {
      name: "Women's Health",
      description: "Hormones, fertility, menopause & beyond",
      certifications: ["Women's Health Specialist", "Menopause Coach", "Hormone Health Practitioner"],
      icon: "👩‍⚕️",
      color: "from-pink-600 to-rose-700",
      href: "/certifications/womens-health",
    },
    {
      name: "Gut & Digestive Health",
      description: "The foundation of whole-body wellness",
      certifications: ["Gut Health Specialist", "Microbiome Coach", "Digestive Wellness Practitioner"],
      icon: "🦠",
      color: "from-emerald-600 to-teal-700",
      href: "/certifications/gut-health",
    },
    {
      name: "Metabolic & Hormones",
      description: "Thyroid, adrenals, blood sugar & metabolism",
      certifications: ["Thyroid Health Specialist", "Metabolic Health Coach", "Adrenal Specialist"],
      icon: "⚡",
      color: "from-amber-500 to-orange-600",
      href: "/certifications/metabolic-health",
    },
    {
      name: "Nutrition & Coaching",
      description: "Evidence-based nutrition and behavior change",
      certifications: ["Holistic Nutrition Coach", "Certified Health Coach", "Plant-Based Specialist"],
      icon: "🥗",
      color: "from-green-600 to-emerald-700",
      href: "/certifications/nutrition",
    },
    {
      name: "Mind-Body & Longevity",
      description: "Brain health, sleep, aging & performance",
      certifications: ["Mind-Body Medicine Coach", "Sleep Health Specialist", "Longevity Coach"],
      icon: "🧠",
      color: "from-purple-600 to-violet-700",
      href: "/certifications/mind-body",
    },
  ];

  const whyASI = [
    {
      icon: Shield,
      title: "Rigorous Standards",
      description: "Competency-based assessments, not just course completion. Our standards meet global certification benchmarks.",
    },
    {
      icon: Globe,
      title: "Globally Recognized",
      description: "USA & Dubai headquarters. Practitioners certified in 45+ countries. Accepted by employers worldwide.",
    },
    {
      icon: BadgeCheck,
      title: "Employer Trusted",
      description: "Clinics, wellness centers, and healthcare organizations actively seek ASI-certified practitioners.",
    },
    {
      icon: Award,
      title: "Lifetime Credential",
      description: "Your certification never expires. Maintain active status with continuing education credits.",
    },
    {
      icon: Users,
      title: "20,000+ Network",
      description: "Join a global community of certified practitioners. Referrals, mentorship, and collaboration.",
    },
    {
      icon: FileCheck,
      title: "Verified & Searchable",
      description: "Every credential is publicly verifiable. Employers and clients can confirm your certification instantly.",
    },
  ];

  const careerOutcomes = [
    { value: "$2,400", label: "Avg First Month Income" },
    { value: "14 Days", label: "Avg Time to First Client" },
    { value: "73%", label: "Complete Within 30 Days" },
    { value: "94%", label: "Would Recommend ASI" },
  ];

  const testimonials = [
    {
      name: "Jennifer M.",
      role: "Functional Medicine Practitioner",
      location: "Texas, USA",
      quote: "I was a nurse for 15 years, burnt out and looking for something meaningful. 6 months after my ASI certification, I'm running my own functional medicine practice and earning more than I did in the hospital.",
      outcome: "$125K",
      outcomeLabel: "Year 1 Income",
      image: "/avatars/jennifer.jpg",
    },
    {
      name: "Rachel T.",
      role: "Women's Health Specialist",
      location: "California, USA",
      quote: "I finished my Women's Health certification in 3 weeks. Two months later, I had 8 paying clients. ASI gave me the credential AND the confidence to charge what I'm worth.",
      outcome: "8",
      outcomeLabel: "Clients in 60 Days",
      image: "/avatars/rachel.jpg",
    },
    {
      name: "Diane K.",
      role: "Menopause Coach",
      location: "Florida, USA",
      quote: "At 52, I thought it was too late to change careers. ASI proved me wrong. I'm now helping women navigate menopause — something I struggled with myself.",
      outcome: "52",
      outcomeLabel: "Started at Age",
      image: "/avatars/diane.jpg",
    },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Apply for Review",
      description: "Submit your application for professional review. Our standards committee evaluates your background and goals.",
      icon: Target,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    },
    {
      step: "2",
      title: "Complete Your Education",
      description: "Access evidence-based curriculum developed by industry experts. Study at your own pace with full support.",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    },
    {
      step: "3",
      title: "Pass Assessment",
      description: "Demonstrate competency through rigorous evaluation. Our standards ensure professional credibility.",
      icon: CheckCircle,
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&h=300&fit=crop",
    },
    {
      step: "4",
      title: "Receive Your Credential",
      description: "Earn your ISI-verified credential, join the global professional directory, and access continuing opportunities.",
      icon: Award,
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
    },
  ];

  // IIN-style comparison with multiple competitors
  const competitors = [
    { name: "ASI", highlight: true },
    { name: "IIN", highlight: false },
    { name: "MindBody Green", highlight: false },
    { name: "Health Coach Institute", highlight: false },
  ];

  const comparisonData = [
    { feature: "Competency-Based Assessment", asi: true, iin: false, mbg: false, hci: false },
    { feature: "Globally Recognized (45+ Countries)", asi: true, iin: true, mbg: false, hci: false },
    { feature: "Lifetime Credential (No Expiry)", asi: true, iin: false, mbg: false, hci: false },
    { feature: "Verified Public Directory", asi: true, iin: true, mbg: false, hci: true },
    { feature: "Employer Verification API", asi: true, iin: false, mbg: false, hci: false },
    { feature: "Dedicated Success Coach", asi: true, iin: false, mbg: false, hci: true },
    { feature: "Study Pod Accountability Groups", asi: true, iin: false, mbg: false, hci: false },
    { feature: "Career Support & Job Board", asi: true, iin: true, mbg: false, hci: true },
    { feature: "Start Free (Mini-Diploma)", asi: true, iin: false, mbg: false, hci: false },
    { feature: "Functional Medicine Focus", asi: true, iin: false, mbg: false, hci: false },
  ];

  const certificationLevels = [
    {
      level: "Level 1",
      name: "Foundation",
      duration: "4-6 Weeks",
      description: "Core competencies and foundational knowledge in your chosen specialization",
      outcome: "Foundation Certificate + Directory Listing",
      icon: "📜",
    },
    {
      level: "Level 2",
      name: "Professional",
      duration: "8-12 Weeks",
      description: "Advanced training with clinical protocols, case studies, and mentorship",
      outcome: "Professional Certification + Career Support",
      icon: "🏆",
    },
    {
      level: "Level 3",
      name: "Board Certified",
      duration: "4-6 Months",
      description: "Comprehensive board-level certification with rigorous assessment and supervision",
      outcome: "Board Certification + Teaching Rights",
      icon: "🎖️",
    },
    {
      level: "Level 4",
      name: "Master Practitioner",
      duration: "6+ Months",
      description: "Expert-level mastery with specialization tracks and leadership training",
      outcome: "Master Title + Mentor Status",
      icon: "👑",
    },
  ];

  const advisoryBoard = [
    {
      name: "Dr. Sarah Mitchell",
      role: "Chief Medical Advisor",
      credential: "MD, IFMCP",
      bio: "20+ years in functional medicine. Former Cleveland Clinic.",
    },
    {
      name: "Dr. James Chen",
      role: "Standards Committee Chair",
      credential: "PhD, Certification Expert",
      bio: "Developed competency frameworks for 15+ organizations.",
    },
    {
      name: "Maria Rodriguez",
      role: "Education Director",
      credential: "MS, Adult Learning Specialist",
      bio: "Designed curriculum for 100,000+ health professionals.",
    },
    {
      name: "Dr. Emily Watson",
      role: "Women's Health Lead",
      credential: "DO, NCMP",
      bio: "Specialist in menopause and hormonal health.",
    },
  ];

  const recentActivity = [
    { name: "Sarah M.", location: "Texas", action: "just completed", cert: "Women's Health Specialist" },
    { name: "Jennifer L.", location: "California", action: "just enrolled in", cert: "Functional Medicine" },
    { name: "Lisa K.", location: "Florida", action: "earned certification in", cert: "Gut Health" },
    { name: "Amanda R.", location: "New York", action: "just completed", cert: "Thyroid Specialist" },
    { name: "Michelle T.", location: "Arizona", action: "just enrolled in", cert: "Menopause Coach" },
  ];

  const mediaFeatures = [
    { name: "Forbes", logo: "Forbes" },
    { name: "Healthline", logo: "Healthline" },
    { name: "Well+Good", logo: "Well+Good" },
    { name: "MindBodyGreen", logo: "MindBodyGreen" },
    { name: "Goop", logo: "Goop" },
    { name: "Women's Health", logo: "Women's Health" },
  ];

  const faqData = [
    {
      q: "Is ASI a legitimate certification body?",
      a: "Yes. ASI is registered in the United States with headquarters in San Francisco and a regional office in Dubai. We maintain rigorous competency-based standards that meet or exceed industry benchmarks."
    },
    {
      q: "How long does certification take?",
      a: "Most practitioners complete their certification in 4-8 weeks while working full-time. Our self-paced format allows you to study on your schedule. Some finish in as little as 2 weeks."
    },
    {
      q: "Can I start for free?",
      a: "Absolutely! Our Level 1 Mini-Diploma is completely free. No credit card required. It's the perfect way to experience ASI before committing to a full certification."
    },
    {
      q: "Is the certification recognized by employers?",
      a: "Yes. ASI credentials are recognized by clinics, wellness centers, and healthcare organizations in 45+ countries. Our employer verification system allows instant credential verification."
    },
    {
      q: "What payment options are available?",
      a: "We offer flexible payment plans with 0% APR financing. You can also pay with HSA/FSA funds. Full certification programs start at just $99/month."
    },
    {
      q: "What support do I get during the program?",
      a: "Every student gets a dedicated success coach, access to a 5-person accountability pod, weekly group calls, and unlimited email support until completion."
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ISI Mega Menu Header */}
      <ISIHeader />

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: BRAND.gold }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-30" style={{ backgroundColor: BRAND.burgundy }} />

        <div className="relative max-w-7xl mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>International Standards Authority</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              <span className="text-white">A Global Standards Authority for</span>
              <span className="block mt-2" style={{ color: BRAND.gold }}>
                Professional & Academic
              </span>
              <span className="block mt-2 text-white">Health Careers</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 max-w-3xl leading-relaxed" style={{ color: "#f5e6e8" }}>
              AccrediPro International Standards Institute defines professional standards and board recognition,
              while offering optional academic degree pathways through university partners for those seeking formal academic capital.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/apply">
                <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-xl hover:opacity-90 transition-opacity" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                  Apply for Professional Review
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/university-degrees">
                <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto rounded-xl hover:opacity-90 transition-opacity" style={{
                  backgroundColor: "transparent",
                  border: "2px solid rgba(255,255,255,0.6)",
                  color: "white",
                  boxShadow: "0 0 20px rgba(255,255,255,0.1)"
                }}>
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Explore Academic Pathways
                </Button>
              </Link>
            </div>

            {/* Trust Indicators - Institutional Tone */}
            <div className="flex flex-wrap items-center gap-8 text-sm" style={{ color: "#f5e6e8" }}>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: BRAND.gold }} />
                <span>20,000+ Professionals Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" style={{ color: BRAND.gold }} />
                <span>45+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" style={{ color: BRAND.gold }} />
                <span>University Partners</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                  <stat.icon className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                </div>
                <div className="text-3xl font-bold" style={{ color: BRAND.burgundy }}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Explainer - NEW SECTION */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <Building2 className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>The AccrediPro Ecosystem</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              How It All Works Together
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A structured pathway from education to professional recognition to academic credentials
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Academy */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                <BookOpen className="w-8 h-8" style={{ color: BRAND.burgundy }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.burgundy }}>AccrediPro Academy</h3>
              <p className="text-gray-600 leading-relaxed">
                Education & preparation. Evidence-based curriculum designed by industry experts to build real-world competency.
              </p>
            </div>

            {/* Institute */}
            <div className="rounded-2xl p-8 text-center border-2 relative" style={{ backgroundColor: `${BRAND.gold}10`, borderColor: BRAND.gold }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                CORE
              </div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: BRAND.burgundy }}>
                <Shield className="w-8 h-8" style={{ color: BRAND.gold }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.burgundy }}>AccrediPro ISI</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional standards & board recognition. The authority that defines competency benchmarks and issues verified credentials.
              </p>
            </div>

            {/* University Partners */}
            <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
                <GraduationCap className="w-8 h-8" style={{ color: BRAND.gold }} />
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: BRAND.burgundy }}>University Partners</h3>
              <p className="text-gray-600 leading-relaxed">
                Optional academic degrees. Bachelor's & Master's programs through Swiss academic institutions, fully online.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <Zap className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Simple 4-Step Process</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A structured pathway to professional recognition and board certification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative">
                {/* Connector line */}
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-24 left-[60%] w-[80%] h-0.5" style={{ backgroundColor: `${BRAND.gold}30` }} />
                )}
                <div className="relative z-10">
                  {/* Image with overlay */}
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-lg group">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    {/* Step number badge */}
                    <div className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shadow-lg" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                      {step.step}
                    </div>
                    {/* Icon in bottom corner */}
                    <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/quiz">
              <Button size="lg" className="font-bold hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                <HelpCircle className="w-5 h-5 mr-2" />
                Take the 2-Minute Career Quiz
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Professional Standards Areas */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <Award className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Professional Standards Areas</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Areas of Professional Recognition
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AccrediPro ISI defines competency standards and professional benchmarks
              across key health and wellness disciplines.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificationCategories.map((category, i) => (
              <Link key={i} href={category.href}>
                <div className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full hover:border-transparent" style={{ ["--hover-border" as string]: BRAND.gold }}>
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 transition-colors" style={{ color: BRAND.burgundy }}>
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <ul className="space-y-2 mb-6">
                    {category.certifications.map((cert, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-500">
                        <CheckCircle className="w-4 h-4" style={{ color: BRAND.gold }} />
                        {cert}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 font-semibold group-hover:gap-3 transition-all" style={{ color: BRAND.burgundy }}>
                    View Standards <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/certifications">
              <Button size="lg" variant="outline" className="hover:text-white transition-all" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy, ["--hover-bg" as string]: BRAND.burgundy }}>
                Explore All Standards Areas
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why ASI */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <Trophy className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>The Standard That Matters</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Why ASI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Not all certifications are created equal. ASI credentials are built on rigorous
              competency standards, recognized globally, and trusted by employers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyASI.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: BRAND.burgundy }}>
                  <item.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Degree Pathways - NEW SECTION */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <GraduationCap className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Optional Academic Pathway</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Academic Degree Pathways
          </h2>

          <p className="text-xl mb-12 max-w-3xl mx-auto leading-relaxed" style={{ color: "#f5e6e8" }}>
            For professionals seeking formal academic capital, AccrediPro offers optional online university degree pathways
            through Swiss academic institutions. These degrees are issued directly by partner universities,
            fully online, and documented for international recognition.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Globe className="w-8 h-8 mx-auto mb-4" style={{ color: BRAND.gold }} />
              <h3 className="font-semibold text-white mb-2">Internationally Recognized</h3>
              <p className="text-sm" style={{ color: "#f5e6e8" }}>Accredited Swiss institution with global validity</p>
            </div>
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <MapPin className="w-8 h-8 mx-auto mb-4" style={{ color: BRAND.gold }} />
              <h3 className="font-semibold text-white mb-2">Study From Anywhere</h3>
              <p className="text-sm" style={{ color: "#f5e6e8" }}>No relocation required. Fully online delivery.</p>
            </div>
            <div className="rounded-xl p-6 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Award className="w-8 h-8 mx-auto mb-4" style={{ color: BRAND.gold }} />
              <h3 className="font-semibold text-white mb-2">Physical Diploma</h3>
              <p className="text-sm" style={{ color: "#f5e6e8" }}>Official university degree mailed to your home</p>
            </div>
          </div>

          <Link href="/university-degrees">
            <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-xl hover:opacity-90 transition-opacity" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
              Explore Academic Pathways
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <p className="mt-6 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            By invitation only • Limited enrollment
          </p>
        </div>
      </section>

      {/* Career Outcomes - THE CAREER AUTHORITY */}
      <section className="py-20 md:py-28 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <TrendingUp className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.gold }}>The Only Certification Truly Focused on YOUR Career</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Built for Career Success
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "#f5e6e8" }}>
              Other certifications give you a certificate and wish you luck. <strong className="text-white">ASI is different.</strong> We're obsessed with one thing: <span style={{ color: BRAND.gold }}>your career success.</span>
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {careerOutcomes.map((outcome, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2" style={{ color: BRAND.gold }}>{outcome.value}</div>
                <div style={{ color: "#f5e6e8" }}>{outcome.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-10 py-6 h-auto hover:opacity-90 transition-opacity shadow-xl" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/success-stories">
              <Button size="lg" variant="outline" className="font-bold text-lg px-10 py-6 h-auto hover:bg-white/10" style={{ borderColor: BRAND.gold, color: BRAND.gold }}>
                Success Stories
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Real Practitioners. Real Results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5" style={{ color: BRAND.gold, fill: BRAND.gold }} />
                  ))}
                </div>
                <Quote className="w-8 h-8 mb-4" style={{ color: `${BRAND.burgundy}20` }} />
                <p className="text-gray-700 mb-6 leading-relaxed">"{t.quote}"</p>
                <div className="flex justify-between items-end border-t border-gray-100 pt-6">
                  <div>
                    <p className="font-bold" style={{ color: BRAND.burgundy }}>{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">{t.outcome}</p>
                    <p className="text-xs text-gray-500">{t.outcomeLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/success-stories">
              <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Read More Success Stories
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Certification Levels */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <GraduationCap className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Your Career Progression Path</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              4 Levels of Certification
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start where you are. Grow as far as you want. Each level builds on the last.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationLevels.map((level, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 relative group hover:shadow-xl transition-all"
                style={{ borderColor: i === 2 ? BRAND.gold : "transparent" }}
              >
                {i === 2 && (
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
                  <p className="text-xs font-semibold" style={{ color: BRAND.burgundy }}>You Get:</p>
                  <p className="text-sm text-gray-600">{level.outcome}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/apply">
              <Button size="lg" className="font-bold hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Apply Now — Start at Level 1 Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ASI Never Leaves You Alone - REVOLUTIONARY SUPPORT */}
      <section className="py-20 md:py-28 text-white" style={{ backgroundColor: BRAND.burgundy }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <HeartHandshake className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.gold }}>Revolutionary Support System</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              ASI Never Leaves You Behind
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: "#f5e6e8" }}>
              Other programs sell you a course and disappear. <strong className="text-white">We stay with you until you succeed.</strong>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Dedicated Coach */}
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: BRAND.gold }}>
                <UserCheck className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Dedicated Success Coach</h3>
              <p className="mb-4" style={{ color: "#f5e6e8" }}>
                A real human assigned to YOU. Weekly check-ins, progress tracking, and personalized guidance until you complete your certification.
              </p>
              <p className="text-sm font-semibold" style={{ color: BRAND.gold }}>
                → Until completion, not just 30 days
              </p>
            </div>

            {/* Accountability Pod */}
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: BRAND.gold }}>
                <Users className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Accountability Pod</h3>
              <p className="mb-4" style={{ color: "#f5e6e8" }}>
                Matched with 5 students at your level, in your timezone, with similar goals. Daily check-ins, shared wins, and peer support.
              </p>
              <p className="text-sm font-semibold" style={{ color: BRAND.gold }}>
                → 5 students like you, same journey together
              </p>
            </div>

            {/* Career Support */}
            <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: BRAND.gold }}>
                <Briefcase className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Career Launch Support</h3>
              <p className="mb-4" style={{ color: "#f5e6e8" }}>
                First client strategy, pricing guidance, marketing templates, and warm referrals from our network. We don't stop until you earn.
              </p>
              <p className="text-sm font-semibold" style={{ color: BRAND.gold }}>
                → We succeed when YOU succeed
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-10 py-6 h-auto hover:opacity-90 transition-opacity shadow-xl" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                Apply Now — Join a Support System That Actually Works
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                <Building2 className="w-4 h-4" style={{ color: BRAND.burgundy }} />
                <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>For Employers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
                Hire With Confidence
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                ASI-certified practitioners meet rigorous competency standards.
                Verify any credential instantly.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">Instant credential verification</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">Competency-based training standards</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">Continuing education requirements</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                  <span className="text-gray-700">Code of ethics compliance</span>
                </li>
              </ul>
              <div className="flex gap-4">
                <Link href="/employers">
                  <Button className="text-white hover:opacity-90" style={{ backgroundColor: BRAND.burgundy }}>
                    Employer Portal
                  </Button>
                </Link>
                <Link href="/verify">
                  <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                    Verify a Credential
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Verify a Credential</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Credential ID or Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2"
                  style={{ ["--tw-ring-color" as string]: BRAND.burgundy }}
                />
                <Button className="w-full text-white hover:opacity-90" style={{ backgroundColor: BRAND.burgundy }}>
                  <Search className="w-4 h-4 mr-2" />
                  Verify Now
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Results are instant and include certification status, specialization, and issue date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Educators */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold mb-6" style={{ color: BRAND.burgundy }}>Accreditation Benefits</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: `${BRAND.gold}20` }}>
                    <BadgeCheck className="w-4 h-4" style={{ color: BRAND.gold }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: BRAND.burgundy }}>Quality Recognition</p>
                    <p className="text-sm text-gray-600">ASI seal signals quality to your students</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: `${BRAND.gold}20` }}>
                    <Users className="w-4 h-4" style={{ color: BRAND.gold }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: BRAND.burgundy }}>Student Enrollment</p>
                    <p className="text-sm text-gray-600">Access to ASI's marketing channels</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: `${BRAND.gold}20` }}>
                    <ScrollText className="w-4 h-4" style={{ color: BRAND.gold }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: BRAND.burgundy }}>Standards Alignment</p>
                    <p className="text-sm text-gray-600">Curriculum review and competency mapping</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                <GraduationCap className="w-4 h-4" style={{ color: BRAND.burgundy }} />
                <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>For Educators</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
                Get Your Course ASI-Accredited
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join our network of approved training providers. ASI accreditation signals
                quality to your students and employers.
              </p>
              <Link href="/partners">
                <Button className="text-white hover:opacity-90" style={{ backgroundColor: BRAND.burgundy }}>
                  Partner With ASI
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Directory CTA */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-3xl p-12 md:p-16 text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Find an ASI-Certified Practitioner
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
              Search our global directory of 20,000+ certified health professionals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search by specialty or location..."
                className="flex-1 px-6 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 text-gray-800 placeholder:text-gray-400"
                style={{ ["--tw-ring-color" as string]: BRAND.gold, backgroundColor: "white" }}
              />
              <Button size="lg" className="font-bold px-8 hover:opacity-90" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Start Your Journey CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
            Start Your Journey
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Not sure where to start? Try our free Mini-Diploma and experience ASI training firsthand.
          </p>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center justify-center gap-2 font-semibold mb-4" style={{ color: BRAND.gold }}>
              <Sparkles className="w-5 h-5" />
              FREE MINI-DIPLOMA
            </div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Women's Health Foundations</h3>
            <ul className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-6">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: BRAND.burgundy }} />
                60 minutes
              </li>
              <li className="flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: BRAND.burgundy }} />
                Certificate included
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" style={{ color: BRAND.burgundy }} />
                No credit card required
              </li>
            </ul>
            <Link href="/womens-health-mini-diploma">
              <Button size="lg" className="text-white font-bold hover:opacity-90" style={{ backgroundColor: BRAND.burgundy }}>
                Start Free Mini-Diploma
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Advisory Board / Governance */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <Shield className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Governance & Leadership</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Our Advisory Board
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ASI standards are developed and maintained by leading experts in functional medicine,
              education, and professional certification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advisoryBoard.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: BRAND.burgundy, color: BRAND.gold }}>
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ color: BRAND.burgundy }}>{member.name}</h3>
                <p className="text-sm font-medium mb-1" style={{ color: BRAND.gold }}>{member.role}</p>
                <p className="text-xs text-gray-500 mb-3">{member.credential}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/leadership">
              <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Meet Our Full Leadership Team
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <HelpCircle className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Got Questions?</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about ASI certification
            </p>
          </div>

          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg mb-2" style={{ color: BRAND.burgundy }}>{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button variant="outline" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Contact Admissions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ISI Footer */}
      <ISIFooter />

      {/* Live Chat Widget */}
      <FloatingChatWidget
        coachName="ASI Admissions"
        coachImage="/coaches/sarah-coach.webp"
        page="home"
      />
    </div>
  );
}
