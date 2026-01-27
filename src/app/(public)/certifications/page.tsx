import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Award,
  Clock,
  Users,
  Star,
  ChevronRight,
  Sparkles,
  GraduationCap,
  BookOpen,
  Heart,
} from "lucide-react";
import { ISIHeader } from "@/components/layout/isi-header";
import { ISIFooter } from "@/components/layout/isi-footer";

export const metadata = {
  title: "All Certifications | Accreditation Standards Institute",
  description: "Explore 700+ ASI certifications across 20 specializations: Functional Medicine, Women's Health, Pet Wellness, Spiritual Healing, Parenting, and more.",
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

export default function CertificationsPage() {
  const categories = [
    {
      name: "Functional Medicine",
      description: "Root-cause health & integrative protocols",
      icon: "🧬",
      count: 45,
      certifications: [
        { name: "Functional Medicine Practitioner", duration: "12 weeks", level: "Professional", popular: true },
        { name: "Integrative Medicine Practitioner", duration: "10 weeks", level: "Professional" },
        { name: "Root Cause Medicine Coach", duration: "8 weeks", level: "Foundation" },
      ],
      href: "/certifications/functional-medicine",
    },
    {
      name: "Women's Health",
      description: "Hormones, fertility, menopause & beyond",
      icon: "👩‍⚕️",
      count: 38,
      certifications: [
        { name: "Women's Health Specialist", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Menopause Coach", duration: "6 weeks", level: "Foundation" },
        { name: "Hormone Health Practitioner", duration: "8 weeks", level: "Professional" },
      ],
      href: "/certifications/womens-health",
    },
    {
      name: "Gut & Digestive Health",
      description: "Microbiome, SIBO, IBS & digestive wellness",
      icon: "🦠",
      count: 32,
      certifications: [
        { name: "Gut Health Specialist", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Microbiome Coach", duration: "6 weeks", level: "Foundation" },
        { name: "SIBO & IBS Specialist", duration: "6 weeks", level: "Foundation" },
      ],
      href: "/certifications/gut-health",
    },
    {
      name: "Pet Wellness & Animal Care",
      description: "Canine, feline, equine & exotic pet health",
      icon: "🐕",
      count: 43,
      certifications: [
        { name: "Pet Nutrition Coach", duration: "8 weeks", level: "Professional", popular: true },
        { name: "Canine Massage Therapist", duration: "6 weeks", level: "Foundation" },
        { name: "Senior Pet Wellness Specialist", duration: "8 weeks", level: "Professional" },
      ],
      href: "/certifications",
    },
    {
      name: "Fertility, Birth & Postpartum",
      description: "Doula, fertility coaching & pregnancy support",
      icon: "👶",
      count: 28,
      certifications: [
        { name: "Fertility Coach", duration: "8 weeks", level: "Professional", popular: true },
        { name: "Birth Doula Coach", duration: "10 weeks", level: "Professional" },
        { name: "Postpartum Wellness Coach", duration: "6 weeks", level: "Foundation" },
      ],
      href: "/certifications",
    },
    {
      name: "Parenting & Family",
      description: "Child development, conscious parenting & family support",
      icon: "👨‍👩‍👧‍👦",
      count: 46,
      certifications: [
        { name: "Conscious Parenting Coach", duration: "8 weeks", level: "Professional", popular: true },
        { name: "Child Sleep Coach", duration: "6 weeks", level: "Foundation" },
        { name: "Special Needs Parenting Coach", duration: "10 weeks", level: "Professional" },
      ],
      href: "/certifications",
    },
    {
      name: "Spiritual Healing & Energy Work",
      description: "Reiki, chakra, crystal healing & intuitive arts",
      icon: "✨",
      count: 65,
      certifications: [
        { name: "Energy Healing Practitioner", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Crystal Healing Practitioner", duration: "6 weeks", level: "Foundation" },
        { name: "Akashic Records Practitioner", duration: "8 weeks", level: "Professional" },
      ],
      href: "/certifications",
    },
    {
      name: "Yoga & Movement",
      description: "Yoga teacher training, breathwork & somatic therapy",
      icon: "🧘",
      count: 48,
      certifications: [
        { name: "Yoga Foundations Teacher", duration: "12 weeks", level: "Professional", popular: true },
        { name: "Trauma-Informed Yoga Therapist", duration: "10 weeks", level: "Professional" },
        { name: "Prenatal Yoga Therapist", duration: "6 weeks", level: "Foundation" },
      ],
      href: "/certifications",
    },
    {
      name: "Mind-Body & Therapy Modalities",
      description: "NLP, hypnotherapy, EFT/tapping & somatic healing",
      icon: "🧠",
      count: 47,
      certifications: [
        { name: "EFT/Tapping Therapist", duration: "8 weeks", level: "Professional", popular: true },
        { name: "Parts Work & IFS Therapist", duration: "10 weeks", level: "Professional" },
        { name: "TRE (Trauma Release) Therapist", duration: "8 weeks", level: "Foundation" },
      ],
      href: "/certifications",
    },
    {
      name: "Faith-Based Coaching",
      description: "Christian life coaching, biblical counseling & ministry",
      icon: "🕊️",
      count: 18,
      certifications: [
        { name: "Christian Life Coach", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Biblical Counselor", duration: "12 weeks", level: "Professional" },
        { name: "Faith-Based Recovery Coach", duration: "8 weeks", level: "Foundation" },
      ],
      href: "/certifications",
    },
    {
      name: "Nutrition & Health Coaching",
      description: "Holistic nutrition, plant-based & sports nutrition",
      icon: "🥗",
      count: 35,
      certifications: [
        { name: "Holistic Nutrition Coach", duration: "10 weeks", level: "Professional", popular: true },
        { name: "Certified Health Coach", duration: "12 weeks", level: "Professional" },
        { name: "Sports Nutrition Coach", duration: "8 weeks", level: "Foundation" },
      ],
      href: "/certifications/nutrition",
    },
    {
      name: "Art, Music & Expressive Therapies",
      description: "Sound healing, art therapy, dance & creative modalities",
      icon: "🎨",
      count: 22,
      certifications: [
        { name: "Sound Bath Facilitator", duration: "6 weeks", level: "Foundation", popular: true },
        { name: "Art Therapy Foundations", duration: "10 weeks", level: "Professional" },
        { name: "Music Healing Therapist", duration: "8 weeks", level: "Foundation" },
      ],
      href: "/certifications",
    },
  ];

  const certificationLevels = [
    {
      level: "Level 1",
      name: "Foundation",
      duration: "4-6 Weeks",
      price: "$497",
      description: "Core competencies and foundational knowledge",
      icon: "📜",
    },
    {
      level: "Level 2",
      name: "Professional",
      duration: "8-12 Weeks",
      price: "$997",
      description: "Advanced training with clinical protocols",
      icon: "🏆",
      popular: true,
    },
    {
      level: "Level 3",
      name: "Board Certified",
      duration: "4-6 Months",
      price: "$2,497",
      description: "Comprehensive board-level certification",
      icon: "🎖️",
    },
    {
      level: "Level 4",
      name: "Master Practitioner",
      duration: "6+ Months",
      price: "$4,997",
      description: "Expert-level mastery with specialization",
      icon: "👑",
    },
  ];

  const whyASI = [
    { icon: Shield, text: "Competency-based assessment" },
    { icon: Users, text: "20,000+ certified practitioners" },
    { icon: Award, text: "Lifetime credential" },
    { icon: Star, text: "4.9/5 rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ISIHeader />

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
              <Award className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>700+ Certification Specializations</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Build Your Career in
              <span className="block" style={{ color: BRAND.gold }}>Health & Wellness</span>
            </h1>

            <p className="text-xl md:text-2xl leading-relaxed mb-8" style={{ color: "#f5e6e8" }}>
              20 specialization areas from Functional Medicine to Pet Wellness.
              Start your transformation today.
            </p>
          </div>
        </div>
      </section>

      {/* Free Mini-Diploma Banner */}
      <section className="border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: BRAND.goldMetallic }}>
                <Sparkles className="w-8 h-8" style={{ color: BRAND.burgundyDark }} />
              </div>
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: BRAND.gold }}>Start Free</div>
                <h3 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>Women's Health Mini-Diploma</h3>
                <p className="text-gray-600">Experience ASI quality — no credit card required</p>
              </div>
            </div>
            <Link href="/womens-health-mini-diploma">
              <Button size="lg" className="font-bold hover:opacity-90 whitespace-nowrap" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Certification Levels */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
              <GraduationCap className="w-4 h-4" style={{ color: BRAND.burgundy }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Your Career Path</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              4 Levels of Certification
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start where you are. Grow as far as you want.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certificationLevels.map((level, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 relative hover:shadow-xl transition-all ${level.popular ? '' : 'border-transparent'}`}
                style={{ borderColor: level.popular ? BRAND.gold : 'transparent' }}
              >
                {level.popular && (
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
                  <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>From {level.price}</p>
                  <p className="text-xs text-gray-500">or payment plans available</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Categories */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
              <BookOpen className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>Browse by Specialty</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              Certification Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect certification for your career goals
            </p>
          </div>

          <div className="space-y-8">
            {categories.map((category, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{category.icon}</div>
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{category.name}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <Link href={category.href}>
                      <Button variant="outline" className="whitespace-nowrap" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.certifications.map((cert, j) => (
                      <Link key={j} href={category.href}>
                        <div className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold group-hover:underline" style={{ color: BRAND.burgundy }}>
                              {cert.name}
                            </h4>
                            {cert.popular && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: BRAND.gold }}>
                                Popular
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cert.duration}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-gray-200 text-xs">
                              {cert.level}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
              What's Included
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every ASI certification comes with comprehensive support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: "Evidence-Based Curriculum", description: "Developed by leading practitioners and updated continuously" },
              { icon: Users, title: "Dedicated Success Coach", description: "1-on-1 support until you complete your certification" },
              { icon: Award, title: "Verified Digital Credential", description: "Shareable badge and certificate that employers can verify instantly" },
              { icon: Star, title: "Study Pod Community", description: "Matched with 5 peers at your level for accountability and support" },
              { icon: GraduationCap, title: "Lifetime Access", description: "Your certification never expires, with free curriculum updates" },
              { icon: Heart, title: "Career Launch Support", description: "First client strategy, pricing guidance, and marketing templates" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <item.icon className="w-6 h-6" style={{ color: BRAND.gold }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ISIFooter />
    </div>
  );
}
