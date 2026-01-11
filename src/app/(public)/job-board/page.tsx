import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Award,
  Briefcase,
  DollarSign,
  Clock,
  ChevronDown,
  Globe,
  Building2,
  Heart,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Job Board | Accreditation Standards Institute",
  description: "Find health coaching jobs and opportunities. Exclusive positions for ASI-certified practitioners in functional medicine, women's health, nutrition, and more.",
};

const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export default function JobBoardPage() {
  const featuredJobs = [
    {
      title: "Functional Medicine Health Coach",
      company: "Parsley Health",
      location: "Remote (US)",
      type: "Full-time",
      salary: "$65,000 - $85,000",
      posted: "2 days ago",
      tags: ["Functional Medicine", "Telehealth", "Benefits"],
      logo: "🌿",
      featured: true,
    },
    {
      title: "Women's Health Specialist",
      company: "The Well",
      location: "New York, NY",
      type: "Full-time",
      salary: "$70,000 - $90,000",
      posted: "3 days ago",
      tags: ["Women's Health", "In-Person", "Luxury Wellness"],
      logo: "✨",
      featured: true,
    },
    {
      title: "Gut Health Coach",
      company: "Viome Life Sciences",
      location: "Remote",
      type: "Contract",
      salary: "$50 - $75/hour",
      posted: "1 week ago",
      tags: ["Gut Health", "Microbiome", "Tech-Forward"],
      logo: "🦠",
      featured: false,
    },
    {
      title: "Corporate Wellness Coach",
      company: "Google Health",
      location: "Mountain View, CA",
      type: "Full-time",
      salary: "$90,000 - $120,000",
      posted: "5 days ago",
      tags: ["Corporate", "On-site", "Top Benefits"],
      logo: "🏢",
      featured: true,
    },
    {
      title: "Nutrition Coach - Virtual",
      company: "Noom",
      location: "Remote",
      type: "Part-time",
      salary: "$25 - $35/hour",
      posted: "1 week ago",
      tags: ["Nutrition", "Flexible Hours", "App-Based"],
      logo: "📱",
      featured: false,
    },
    {
      title: "Integrative Health Practitioner",
      company: "Cleveland Clinic Wellness",
      location: "Cleveland, OH",
      type: "Full-time",
      salary: "$75,000 - $95,000",
      posted: "4 days ago",
      tags: ["Hospital Setting", "Benefits", "Research"],
      logo: "🏥",
      featured: true,
    },
    {
      title: "Mind-Body Coach",
      company: "Headspace Health",
      location: "Remote",
      type: "Full-time",
      salary: "$60,000 - $80,000",
      posted: "1 week ago",
      tags: ["Mental Health", "Digital Health", "Meditation"],
      logo: "🧘",
      featured: false,
    },
    {
      title: "Holistic Health Director",
      company: "Equinox",
      location: "Los Angeles, CA",
      type: "Full-time",
      salary: "$100,000 - $130,000",
      posted: "3 days ago",
      tags: ["Leadership", "Luxury Fitness", "Benefits"],
      logo: "💪",
      featured: true,
    },
  ];

  const jobCategories = [
    { name: "All Jobs", count: 156 },
    { name: "Functional Medicine", count: 42 },
    { name: "Women's Health", count: 28 },
    { name: "Nutrition", count: 35 },
    { name: "Corporate Wellness", count: 24 },
    { name: "Remote", count: 89 },
  ];

  const employerLogos = [
    "Parsley Health", "Cleveland Clinic", "Google", "Equinox",
    "Headspace", "Noom", "Viome", "The Well"
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
                    <Link href="/salary-guide" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Salary Guide</Link>
                    <Link href="/job-board" className="block px-4 py-2 text-sm hover:bg-gray-50 font-semibold" style={{ color: BRAND.gold }}>Job Board</Link>
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
      <section className="relative py-16 md:py-20 text-white overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
              <Briefcase className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span className="text-sm font-medium" style={{ color: BRAND.gold }}>ASI Job Board</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream
              <span className="block" style={{ color: BRAND.gold }}>Health Coaching Job</span>
            </h1>

            <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "#f5e6e8" }}>
              Exclusive opportunities for ASI-certified practitioners. Updated weekly with positions from top employers.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-xl">
              <div className="flex-1 flex items-center gap-2 px-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, company, or keyword..."
                  className="flex-1 py-3 outline-none text-gray-800"
                />
              </div>
              <Button size="lg" className="font-bold px-8" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-sm" style={{ color: "#f5e6e8" }}>
              <Briefcase className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span><strong>156</strong> Open Positions</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#f5e6e8" }}>
              <Building2 className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span><strong>48</strong> Companies Hiring</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#f5e6e8" }}>
              <Globe className="w-4 h-4" style={{ color: BRAND.gold }} />
              <span><strong>89</strong> Remote Positions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.burgundy }}>
                  <Filter className="w-4 h-4" />
                  Filter Jobs
                </h3>

                <div className="space-y-2">
                  {jobCategories.map((cat, i) => (
                    <button
                      key={i}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-left text-sm transition-colors ${i === 0 ? 'bg-white shadow-sm' : 'hover:bg-white'}`}
                      style={{ color: i === 0 ? BRAND.burgundy : '#666' }}
                    >
                      <span>{cat.name}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: i === 0 ? `${BRAND.gold}30` : '#e5e7eb', color: i === 0 ? BRAND.burgundy : '#666' }}>
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-200 my-6 pt-6">
                  <h4 className="font-bold text-sm mb-3" style={{ color: BRAND.burgundy }}>Job Type</h4>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract", "Remote"].map((type, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 my-6 pt-6">
                  <h4 className="font-bold text-sm mb-3" style={{ color: BRAND.burgundy }}>Salary Range</h4>
                  <div className="space-y-2">
                    {["$40K - $60K", "$60K - $80K", "$80K - $100K", "$100K+"].map((range, i) => (
                      <label key={i} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        {range}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>
                  156 Jobs Found
                </h2>
                <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>Most Recent</option>
                  <option>Highest Salary</option>
                  <option>Most Relevant</option>
                </select>
              </div>

              <div className="space-y-4">
                {featuredJobs.map((job, i) => (
                  <div
                    key={i}
                    className={`bg-white rounded-xl p-6 border-2 hover:shadow-lg transition-shadow ${job.featured ? 'border-l-4' : 'border-gray-100'}`}
                    style={{ borderLeftColor: job.featured ? BRAND.gold : undefined }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ backgroundColor: `${BRAND.gold}20` }}>
                        {job.logo}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-lg font-bold" style={{ color: BRAND.burgundy }}>{job.title}</h3>
                            <p className="text-gray-600">{job.company}</p>
                          </div>
                          {job.featured && (
                            <span className="self-start px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.tags.map((tag, j) => (
                            <span key={j} className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{job.posted}</span>
                          <Button variant="outline" size="sm" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                            View Details
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button variant="outline" size="lg" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                  Load More Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Employer Section */}
      <section className="py-16" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8" style={{ color: BRAND.burgundy }}>
            Top Employers Hiring ASI Graduates
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            {employerLogos.map((name, i) => (
              <div key={i} className="px-6 py-3 bg-white rounded-lg shadow-sm text-gray-600 font-medium">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Non-Certified */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Not Yet Certified?
            </h2>
            <p className="text-gray-600 mb-6">
              ASI certification opens doors to exclusive job opportunities. Start with our free Mini-Diploma today.
            </p>
            <Link href="/womens-health-mini-diploma">
              <Button size="lg" className="font-bold" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Start Free Mini-Diploma
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
