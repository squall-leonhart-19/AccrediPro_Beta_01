import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  CheckCircle,
  ArrowRight,
  Video,
  Users,
  Globe,
  FileText,
  Award,
  Infinity,
  TrendingUp,
  Star,
  DollarSign,
  Target,
  Apple,
  Leaf,
  Heart,
  Brain,
  Zap,
  Shield,
  Moon,
  Droplets,
} from "lucide-react";
import { FM_SPECIALIZATIONS } from "@/lib/specializations-data";

export const metadata = {
  title: "Functional Medicine Certifications | 14 Modules | AccrediPro Academy",
  description: "Explore AccrediPro's 14-module Functional Medicine Certification program. Earn individual certificates in Nutrition, Hormones, Gut Health, and more. CPD & CEU approved.",
  keywords: ["functional medicine certification", "health coach certification", "nutrition certification", "gut health certification", "hormone health certification", "online health certification", "CPD approved", "CEU credits"],
  openGraph: {
    title: "Functional Medicine Certification Program | 14 Modules",
    description: "Master functional medicine with our comprehensive 14-module program. Earn a certificate for each module - a first in the industry. 100% online, self-paced.",
    type: "website",
    locale: "en_US",
    siteName: "AccrediPro Academy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Functional Medicine Certification | AccrediPro",
    description: "14 modules. 14 certificates. The most comprehensive functional medicine certification online.",
  },
  alternates: {
    canonical: "https://accredipro.academy/certifications",
  },
};

export default function CertificationsPage() {
  const stats = [
    { value: "14", label: "Complete Modules" },
    { value: "50+", label: "CEU Hours Approved" },
    { value: "6-12", label: "Months to Complete" },
    { value: "$997", label: "Total Investment" },
  ];

  const certificateFeatures = [
    "Digital certificate with unique verification code",
    "LinkedIn-compatible digital badge",
    "Lifetime validity—never expires",
    "Insurance eligibility in 30+ countries",
  ];

  const phase1Modules = [
    {
      number: "01",
      title: "Core Foundations",
      description: "Master the functional medicine timeline and matrix. Understand systems biology and root-cause philosophy.",
      topics: ["Systems Biology Intro", "Scope of Practice & Ethics", "The FM Matrix Explained"],
    },
    {
      number: "02",
      title: "Clinical Intake",
      description: "Learn the art of the 90-minute intake. Gather history, build rapport, and identify symptom clusters.",
      topics: ["Red Flag Identification", "Motivational Interviewing", "Client Forms & Documentation"],
    },
    {
      number: "03",
      title: "Functional Nutrition",
      description: "Deep dive into macronutrients, phytonutrients, and evidence-based elimination diet protocols.",
      topics: ["Elimination Diets", "Phytonutrient Spectrum", "Blood Sugar Balancing"],
    },
  ];

  const phase2Modules = [
    {
      number: "04",
      title: "Women's Hormones",
      description: "PMS, PCOS, Menopause, HPO Axis dysfunction. Comprehensive hormone health for women.",
      topics: ["Menstrual Cycle Mapping", "PCOS Protocols", "Perimenopause Support"],
    },
    {
      number: "05",
      title: "Thyroid Health",
      description: "Hashimoto's, T4 to T3 conversion, comprehensive thyroid panel interpretation.",
      topics: ["Full Thyroid Panel Reading", "Autoimmune Thyroid", "Nutrient Support"],
    },
    {
      number: "06",
      title: "Gut Health",
      description: "SIBO, Leaky Gut, Dysbiosis, and the comprehensive 5R Gut Restoration Protocol.",
      topics: ["5R Protocol", "Microbiome Testing", "SIBO Management"],
    },
    {
      number: "07",
      title: "Metabolic Health",
      description: "Insulin resistance, weight loss blocks, metabolic syndrome, and energy production.",
      topics: ["Insulin Resistance", "Weight Plateaus", "Mitochondrial Support"],
    },
    {
      number: "08",
      title: "Adrenals & Stress",
      description: "HPA Axis dysregulation, cortisol curves, burnout, and stress resilience protocols.",
      topics: ["Cortisol Patterns", "Burnout Recovery", "Adaptogen Protocols"],
    },
    {
      number: "09",
      title: "Sleep & Circadian",
      description: "Sleep architecture, circadian rhythm optimization, and light environment management.",
      topics: ["Sleep Hygiene", "Circadian Disruption", "Light Therapy"],
    },
  ];

  const phase3Modules = [
    {
      number: "10",
      title: "Autoimmunity",
      description: "Understand autoimmune triggers, inflammation pathways, and reversal protocols.",
    },
    {
      number: "11",
      title: "Detox & Toxins",
      description: "Environmental toxins, biotransformation pathways, and safe detoxification protocols.",
    },
    {
      number: "12",
      title: "Lab Interpretation",
      description: "Functional ranges vs. conventional, advanced testing, and pattern recognition.",
    },
    {
      number: "13",
      title: "Business Building",
      description: "Launch your practice with client acquisition, marketing, pricing, and systems.",
    },
    {
      number: "14",
      title: "Clinical Practicum",
      description: "Work with real clients under supervision. Graduate ready to practice confidently.",
    },
  ];

  const includedFeatures = [
    {
      icon: Video,
      title: "Video Lectures",
      description: "100+ hours of expert-led video content with downloadable resources.",
    },
    {
      icon: Users,
      title: "Daily Mentorship",
      description: "Live daily support from coaches and faculty in our community.",
    },
    {
      icon: Globe,
      title: "Your Website",
      description: "Professional coaching website built for you—included in tuition.",
    },
    {
      icon: FileText,
      title: "Client Forms",
      description: "Ready-to-use intake forms, assessments, and protocols.",
    },
    {
      icon: Award,
      title: "14 Certificates",
      description: "Individual certificate for each module completed.",
    },
    {
      icon: Infinity,
      title: "Lifetime Access",
      description: "Access all materials forever, including future updates.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-lg font-bold text-burgundy-600">AccrediPro</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/certifications" className="text-burgundy-600 font-semibold">Certifications</Link>
              <Link href="/accreditation" className="text-gray-600 hover:text-burgundy-600">Accreditations</Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-burgundy-600">Testimonials</Link>
              <Link href="/about" className="text-gray-600 hover:text-burgundy-600">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-burgundy-600">Blog</Link>
              <Link href="/contact" className="text-gray-600 hover:text-burgundy-600">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 px-4 bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <GraduationCap className="w-4 h-4 text-gold-500" />
            <span className="text-burgundy-600 font-bold text-sm uppercase tracking-wider">14 Specialization Certificates</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Master <span className="text-burgundy-600 italic">Functional Medicine</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Our comprehensive 14-module certification program takes you from foundations to clinical mastery.
            <strong> Earn a certificate for each module you complete</strong>—a first in the industry.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              100% Online
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Self-Paced
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              9 Accreditations
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              CPD Certified
            </span>
          </div>
        </div>
      </header>

      {/* Program Overview Stats */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className={`p-4 ${index > 0 ? "md:border-l border-gray-100" : ""}`}>
                <div className="text-4xl font-bold text-burgundy-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Display */}
      <section className="py-20 bg-burgundy-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Your Credentials</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">Official Certification</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upon completion of each module, you receive an official certificate of achievement. Complete all
                14 modules to earn the prestigious <strong>Functional Medicine Practitioner</strong> designation.
              </p>
              <ul className="space-y-3 mb-8">
                {certificateFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/accreditation" className="text-burgundy-600 font-bold hover:text-gold-600 transition flex items-center gap-2">
                View all 9 accreditations <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-2xl shadow-2xl border-4 border-gold-200">
                <div className="aspect-[4/3] bg-gradient-to-br from-burgundy-50 to-gold-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-gold-500 mx-auto mb-4" />
                    <p className="text-burgundy-600 font-bold text-lg">Certificate Preview</p>
                    <p className="text-gray-500 text-sm">Functional Medicine Practitioner</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-burgundy-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400" /> Accredited
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A New Standard Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Industry First</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              A New Standard in Functional Medicine Certification
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 leading-relaxed">
                Most programs hand you a single certificate at the end—an all-or-nothing gamble.
                <strong className="text-burgundy-600"> AccrediPro is different.</strong>
              </p>
              <p className="text-gray-600 leading-relaxed">
                We issue an <strong>individually verified certificate for every module you complete.</strong> That means
                14 standalone credentials—each with its own unique verification code, each listed on our public
                verification portal, each proof of your growing expertise.
              </p>
              <p className="text-gray-600 leading-relaxed">
                <strong>Why does this matter?</strong> Because real progress deserves real recognition. You don't have to wait
                12 months to prove your competence. After Module 3, you're certified in Functional Nutrition. After
                Module 6, you're certified in Gut Health. After Module 4, certified in Women's Hormones—and so on.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-burgundy-50 p-6 rounded-xl border-l-4 border-burgundy-600">
                <h3 className="font-bold text-lg text-gray-900 mb-3">What This Means For You</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Start marketing your services sooner—clients can verify every credential</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Build your niche specialty with targeted certifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Display 14 badges on LinkedIn—massive credibility boost</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Meet insurance requirements module by module</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gold-50 p-6 rounded-xl border border-gold-200">
                <p className="text-gold-800 font-medium text-center">
                  <Award className="w-5 h-5 inline-block mr-2 text-gold-600" />
                  14 modules = 14 verifiable certificates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FM Specializations Section */}
      <section className="py-20 bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Choose Your Path</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Top 10 Functional Medicine Specializations
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The certification covers all these specializations. Choose which areas to focus on based on your interests and market demand.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FM_SPECIALIZATIONS.slice(0, 9).map((spec, index) => {
              const IconComponent = spec.icon === "Apple" ? Apple :
                spec.icon === "Leaf" ? Leaf :
                spec.icon === "Heart" ? Heart :
                spec.icon === "Brain" ? Brain :
                spec.icon === "Zap" ? Zap :
                spec.icon === "TrendingUp" ? TrendingUp :
                spec.icon === "Shield" ? Shield :
                spec.icon === "Moon" ? Moon :
                spec.icon === "Droplets" ? Droplets : Target;

              return (
                <div
                  key={spec.id}
                  className={`relative p-6 rounded-xl border-2 ${spec.borderColor} ${spec.bgColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                >
                  {/* Rank Badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-burgundy-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {spec.rank}
                  </div>

                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${spec.gradient} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${spec.bgColor} ${spec.textColor} border ${spec.borderColor}`}>
                      {spec.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2">{spec.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{spec.description}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Market Demand</span>
                      <span className={`font-semibold ${spec.textColor}`}>{spec.marketDemand}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Income Range</span>
                      <span className="font-semibold text-green-600">{spec.incomeRange}</span>
                    </div>
                  </div>

                  {/* Key Topics */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-2">Key Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {spec.keyTopics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Our 14-module certification covers all these specializations. Graduate with expertise across the board.
            </p>
            <Link href="#curriculum">
              <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700">
                View Full Curriculum
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Full Curriculum */}
      <section id="curriculum" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Complete Curriculum</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">14 Comprehensive Modules</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Structured in three phases to take you from foundational knowledge to clinical mastery.
            </p>
          </div>

          {/* Phase 1 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-burgundy-600 text-white px-6 py-2 rounded-full font-bold">Phase 1</div>
              <h3 className="text-2xl font-bold text-gray-900">The Foundation</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {phase1Modules.map((module, index) => (
                <div key={index} className="bg-burgundy-50/50 p-6 rounded-xl border-l-4 border-burgundy-600 hover:-translate-y-2 transition duration-300">
                  <span className="text-gold-600 font-bold text-sm">MODULE {module.number}</span>
                  <h4 className="font-bold text-xl text-gray-900 mt-2 mb-3">{module.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {module.topics.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2 */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-burgundy-500 text-white px-6 py-2 rounded-full font-bold">Phase 2</div>
              <h3 className="text-2xl font-bold text-gray-900">Biological Systems</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {phase2Modules.map((module, index) => (
                <div key={index} className="bg-burgundy-50/50 p-6 rounded-xl border-l-4 border-burgundy-500 hover:-translate-y-2 transition duration-300">
                  <span className="text-gold-600 font-bold text-sm">MODULE {module.number}</span>
                  <h4 className="font-bold text-xl text-gray-900 mt-2 mb-3">{module.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                  {module.topics && (
                    <ul className="text-xs text-gray-500 space-y-1">
                      {module.topics.map((topic, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-gold-500 rounded-full"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Phase 3 */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-gold-500 text-white px-6 py-2 rounded-full font-bold">Phase 3</div>
              <h3 className="text-2xl font-bold text-gray-900">Clinical Mastery</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {phase3Modules.map((module, index) => (
                <div key={index} className="bg-burgundy-50/50 p-6 rounded-xl border-l-4 border-gold-500 hover:-translate-y-2 transition duration-300">
                  <span className="text-gold-600 font-bold text-sm">MODULE {module.number}</span>
                  <h4 className="font-bold text-xl text-gray-900 mt-2 mb-3">{module.title}</h4>
                  <p className="text-gray-600 text-sm">{module.description}</p>
                </div>
              ))}
              {/* Final Certification Card */}
              <div className="bg-white p-6 rounded-xl border-2 border-gold-500 border-dashed flex items-center justify-center hover:-translate-y-2 transition duration-300">
                <div className="text-center">
                  <Award className="w-12 h-12 text-gold-500 mx-auto mb-3" />
                  <p className="font-bold text-gray-900">Final Certification</p>
                  <p className="text-xs text-gray-500">Functional Medicine Practitioner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-burgundy-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-400 font-bold uppercase tracking-wider text-sm">What's Included</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Everything You Need to Succeed</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-gold-400" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-burgundy-100 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-burgundy-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Start Your Certification?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join 1,000+ graduates who transformed their careers with AccrediPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl">
                Apply Now — $997
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline">
                Ask Questions
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-6">Payment plans available. No prerequisites required.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AP</span>
                </div>
                <span className="text-lg font-bold">AccrediPro</span>
              </div>
              <p className="text-gray-400 text-sm">
                14 modules. 14 certificates. The world's most comprehensive functional medicine certification.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white text-burgundy-400">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white">Accreditation</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                <a href="mailto:info@accredipro.academy" className="hover:text-white">
                  info@accredipro.academy
                </a>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} AccrediPro Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
