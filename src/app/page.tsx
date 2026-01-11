import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";
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
    { value: "20,000+", label: "Certified Practitioners", icon: Users },
    { value: "45+", label: "Countries Worldwide", icon: Globe },
    { value: "50+", label: "Certification Specializations", icon: Award },
    { value: "4.9/5", label: "From 1,000+ Reviews", icon: Star },
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
      title: "Choose Your Path",
      description: "Take our 2-minute quiz or explore 50+ specializations to find the certification that matches your goals.",
      icon: Target,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
    },
    {
      step: "2",
      title: "Learn at Your Pace",
      description: "Complete evidence-based modules online. Most practitioners finish in 4-8 weeks while working full-time.",
      icon: BookOpen,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    },
    {
      step: "3",
      title: "Pass Your Assessment",
      description: "Demonstrate competency through our rigorous exam. 89% first-attempt pass rate with unlimited retakes.",
      icon: CheckCircle,
      image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400&h=300&fit=crop",
    },
    {
      step: "4",
      title: "Get Certified & Earn",
      description: "Receive your verified credential, join our directory, and start attracting clients immediately.",
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
      {/* Urgency Countdown Banner */}
      <div className="text-white py-2.5 px-4 text-center text-sm" style={{ background: BRAND.goldMetallic }}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
          <span className="font-bold" style={{ color: BRAND.burgundyDark }}>
            🎓 January Cohort Enrollment Open
          </span>
          <span style={{ color: BRAND.burgundyDark }}>•</span>
          <span style={{ color: BRAND.burgundyDark }}>
            <strong>47 spots remaining</strong> — Classes start Jan 20th
          </span>
          <Link href="/apply" className="font-bold underline hover:no-underline ml-2" style={{ color: BRAND.burgundyDark }}>
            Secure Your Spot →
          </Link>
        </div>
      </div>

      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden" style={{ backgroundColor: BRAND.burgundy }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm font-bold">Start Free Today</p>
            <p className="text-xs opacity-80">No credit card required</p>
          </div>
          <Link href="/womens-health-mini-diploma">
            <Button size="sm" className="font-bold shadow-lg" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
              Get Started
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Live Activity Toast - Fixed Position */}
      <div className="fixed bottom-24 left-4 z-40 hidden md:block">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4 max-w-xs animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <Sparkles className="w-5 h-5" style={{ color: BRAND.gold }} />
            </div>
            <div>
              <p className="text-sm text-gray-800">
                <span className="font-semibold">{recentActivity[0].name}</span> from {recentActivity[0].location}
              </p>
              <p className="text-xs text-gray-500">
                {recentActivity[0].action} <span className="font-medium" style={{ color: BRAND.burgundy }}>{recentActivity[0].cert}</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
            </div>
          </div>
        </div>
      </div>

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
              {/* Certifications Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-all flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Certifications <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[250px]">
                    <Link href="/certifications" className="block px-4 py-2 text-sm hover:bg-gray-50 font-medium" style={{ color: BRAND.burgundy }}>All Certifications</Link>
                    <div className="border-t border-gray-100 my-1" />
                    <Link href="/certifications/functional-medicine" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Functional Medicine</Link>
                    <Link href="/certifications/womens-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Women's Health</Link>
                    <Link href="/certifications/gut-health" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Gut Health</Link>
                    <Link href="/certifications/nutrition" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Nutrition & Coaching</Link>
                    <Link href="/certifications/mind-body" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Mind-Body & Longevity</Link>
                  </div>
                </div>
              </div>

              {/* Careers Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-all flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Careers <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/careers" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Career Paths</Link>
                    <Link href="/success-stories" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Success Stories</Link>
                    <Link href="/salary-guide" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Salary Guide</Link>
                    <Link href="/job-board" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Job Board</Link>
                  </div>
                </div>
              </div>

              {/* Standards Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-all flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Standards <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]">
                    <Link href="/standards" className="block px-4 py-2 text-sm hover:bg-gray-50 font-medium" style={{ color: BRAND.burgundy }}>Our Standards</Link>
                    <Link href="/standards/competency-framework" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Competency Framework</Link>
                    <Link href="/standards/assessment" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Assessment Process</Link>
                    <Link href="/standards/recertification" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Recertification</Link>
                  </div>
                </div>
              </div>

              {/* About Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-all flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  About <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/about" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>About ASI</Link>
                    <Link href="/leadership" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Leadership Team</Link>
                    <Link href="/code-of-ethics" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Code of Ethics</Link>
                    <Link href="/accreditation" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Accreditation</Link>
                  </div>
                </div>
              </div>

              {/* Articles & Ideas Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-all flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Articles <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]">
                    <Link href="/blog" className="block px-4 py-2 text-sm hover:bg-gray-50 font-medium" style={{ color: BRAND.burgundy }}>All Articles</Link>
                    <Link href="/blog?category=coaching" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Industry Leading Coaching</Link>
                    <Link href="/blog?category=wellness" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Total Health + Wellness</Link>
                    <Link href="/blog?category=alumni" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Alumni + Experts</Link>
                  </div>
                </div>
              </div>

              {/* Directory & Verify - Direct Links */}
              <Link href="/directory" className="px-4 py-2 font-medium hover:opacity-70 transition-all" style={{ color: BRAND.burgundy }}>Directory</Link>
              <Link href="/verify" className="px-4 py-2 font-medium hover:opacity-70 transition-all" style={{ color: BRAND.burgundy }}>Verify</Link>
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
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Est. 2026 • Globally Recognized</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              <span className="text-white">The Global Authority in</span>
              <span className="block mt-2" style={{ color: BRAND.gold }}>
                Functional Medicine
              </span>
              <span className="block mt-2 text-white">& Health Certification</span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 max-w-2xl leading-relaxed" style={{ color: "#f5e6e8" }}>
              Join <strong className="text-white">20,000+</strong> certified practitioners in <strong className="text-white">45+ countries</strong>.
              Our rigorous, competency-based certifications are recognized by employers worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/certifications">
                <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto rounded-xl shadow-xl hover:opacity-90 transition-opacity" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                  Explore Certifications
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/verify">
                <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto rounded-xl hover:opacity-90 transition-opacity" style={{
                  backgroundColor: "transparent",
                  border: "2px solid rgba(255,255,255,0.6)",
                  color: "white",
                  boxShadow: "0 0 20px rgba(255,255,255,0.1)"
                }}>
                  <Search className="w-5 h-5 mr-2" />
                  Verify a Credential
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 text-sm" style={{ color: "#f5e6e8" }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" style={{ color: BRAND.gold }} />
                <span>20,000+ Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" style={{ color: BRAND.gold }} />
                <span>45+ Countries</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" style={{ color: BRAND.gold }} />
                <span>4.9/5 Rating</span>
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
              From enrollment to earning — your path to a certified career in health & wellness
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

      {/* Certification Categories */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <Award className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>50+ Certification Specializations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              What We Certify
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              ASI sets the global standard for health and wellness practitioners.
              Choose your specialization and build your career.
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
                    View Programs <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/certifications">
              <Button size="lg" variant="outline" className="hover:text-white transition-all" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy, ["--hover-bg" as string]: BRAND.burgundy }}>
                View All 50+ Certifications
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

      {/* Comparison Table - IIN Style */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <Trophy className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>The ASI Advantage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              How ASI Compares
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See why smart practitioners choose ASI over other certification bodies
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 mt-6">
            {/* Header Row with Competitor Names */}
            <div className="grid grid-cols-5 text-center font-bold border-b border-gray-200 rounded-t-2xl overflow-hidden">
              <div className="p-4 bg-gray-50 text-gray-600 text-left">Feature</div>
              {competitors.map((comp, i) => (
                <div
                  key={i}
                  className="p-4 relative pt-6"
                  style={{
                    background: comp.highlight ? BRAND.burgundyMetallic : "transparent",
                    color: comp.highlight ? "white" : BRAND.burgundy,
                  }}
                >
                  {comp.highlight && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap z-10" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                      ⭐ Best Choice
                    </div>
                  )}
                  <span className={comp.highlight ? "text-lg font-bold" : "text-sm"}>{comp.name}</span>
                </div>
              ))}
            </div>
            {/* Feature Rows */}
            {comparisonData.map((row, i) => (
              <div key={i} className="grid grid-cols-5 text-center border-t border-gray-100 hover:bg-gray-50/50 transition-colors">
                <div className="p-4 text-left text-gray-700 font-medium text-sm">{row.feature}</div>
                {/* ASI */}
                <div className="p-4 flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}08` }}>
                  {row.asi ? (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: BRAND.goldMetallic }}>
                      <CheckCheck className="w-5 h-5" style={{ color: BRAND.burgundyDark }} />
                    </div>
                  ) : (
                    <X className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                {/* IIN */}
                <div className="p-4 flex items-center justify-center">
                  {row.iin ? (
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                {/* MindBody Green */}
                <div className="p-4 flex items-center justify-center">
                  {row.mbg ? (
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300" />
                  )}
                </div>
                {/* Health Coach Institute */}
                <div className="p-4 flex items-center justify-center">
                  {row.hci ? (
                    <CheckCircle className="w-5 h-5 text-gray-400" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300" />
                  )}
                </div>
              </div>
            ))}
            {/* Summary Row */}
            <div className="grid grid-cols-5 text-center border-t-2 border-gray-200 bg-gray-50 font-bold rounded-b-2xl overflow-hidden">
              <div className="p-4 text-left text-gray-700">Total Features</div>
              <div className="p-4" style={{ backgroundColor: `${BRAND.burgundy}15`, color: BRAND.burgundy }}>
                <span className="text-2xl">10/10</span>
              </div>
              <div className="p-4 text-gray-500">3/10</div>
              <div className="p-4 text-gray-500">0/10</div>
              <div className="p-4 text-gray-500">3/10</div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 text-sm mb-6">
              Based on publicly available information as of 2024. Features may vary.
            </p>
            <Link href="/apply">
              <Button size="lg" className="font-bold hover:opacity-90 shadow-lg" style={{ background: BRAND.burgundyMetallic, color: "white" }}>
                Apply Now — See the Difference
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
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

      {/* As Seen In - Media Logos */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-widest">As Featured In</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {mediaFeatures.map((media, i) => (
              <div key={i} className="text-gray-400 font-bold text-xl md:text-2xl tracking-tight hover:text-gray-600 transition-colors cursor-default">
                {media.name}
              </div>
            ))}
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

      {/* Final CTA */}
      <section className="py-20 md:py-28 text-white text-center" style={{ background: BRAND.burgundyMetallic }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
            Join 20,000+ practitioners who chose ASI. Start with our free Mini-Diploma today.
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
                Apply for Full Certification
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
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Logo & Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND.gold }}>
                    <Shield className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                  </div>
                  <div>
                    <div className="font-bold text-lg tracking-tight text-white">ACCREDITATION STANDARDS</div>
                    <div className="text-xs tracking-widest" style={{ color: BRAND.gold }}>INSTITUTE</div>
                  </div>
                </div>
              </div>
              <p className="mb-6 max-w-sm" style={{ color: "#f5e6e8" }}>
                The global authority in functional medicine and health certification.
                Setting standards. Building careers.
              </p>
              <div className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                  🇺🇸 USA Headquarters
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                  🇦🇪 Dubai Office
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Certifications</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">All Certifications</Link></li>
                <li><Link href="/certifications/functional-medicine" className="hover:text-white transition-colors">Functional Medicine</Link></li>
                <li><Link href="/certifications/womens-health" className="hover:text-white transition-colors">Women's Health</Link></li>
                <li><Link href="/certifications/gut-health" className="hover:text-white transition-colors">Gut Health</Link></li>
                <li><Link href="/certifications/nutrition" className="hover:text-white transition-colors">Nutrition</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/about" className="hover:text-white transition-colors">About ASI</Link></li>
                <li><Link href="/standards" className="hover:text-white transition-colors">Our Standards</Link></li>
                <li><Link href="/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
                <li><Link href="/code-of-ethics" className="hover:text-white transition-colors">Code of Ethics</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Resources</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/verify" className="hover:text-white transition-colors">Verify Credential</Link></li>
                <li><Link href="/directory" className="hover:text-white transition-colors">Find a Practitioner</Link></li>
                <li><Link href="/employers" className="hover:text-white transition-colors">For Employers</Link></li>
                <li><Link href="/partners" className="hover:text-white transition-colors">Partner With Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm" style={{ color: "#f5e6e8" }}>
              © 2026 Accreditation Standards Institute. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "#f5e6e8" }}>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <FloatingChatWidget
        coachName="ASI Admissions"
        coachImage="/coaches/sarah-coach.webp"
        page="home"
      />
    </div>
  );
}
