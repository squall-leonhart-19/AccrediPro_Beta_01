"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  Search,
  MapPin,
  Award,
  Star,
  ExternalLink,
  Filter,
  ChevronDown,
  CheckCircle,
  Globe,
  Users,
} from "lucide-react";

const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

const practitioners = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    title: "Board Certified Functional Medicine Practitioner",
    credentials: "BC-FMP, RDN",
    specialties: ["Thyroid Health", "Women's Health", "Autoimmune"],
    location: "San Francisco, CA",
    country: "USA",
    image: "/avatars/practitioner-1.webp",
    rating: 4.9,
    reviews: 127,
    virtual: true,
    inPerson: true,
    verified: true,
  },
  {
    id: "2",
    name: "Jennifer Williams",
    title: "Certified Professional Functional Medicine Practitioner",
    credentials: "FM-CP",
    specialties: ["Gut Health", "SIBO", "Food Sensitivities"],
    location: "Austin, TX",
    country: "USA",
    image: "/avatars/practitioner-2.webp",
    rating: 4.8,
    reviews: 89,
    virtual: true,
    inPerson: true,
    verified: true,
  },
  {
    id: "3",
    name: "Dr. Rachel Thompson",
    title: "Board Certified Women's Health Specialist",
    credentials: "BC-WHS, CNS",
    specialties: ["Menopause", "PCOS", "Hormone Balance"],
    location: "Dubai",
    country: "UAE",
    image: "/avatars/practitioner-3.webp",
    rating: 5.0,
    reviews: 64,
    virtual: true,
    inPerson: false,
    verified: true,
  },
  {
    id: "4",
    name: "Emily Chen",
    title: "Certified Health Coach",
    credentials: "CHC",
    specialties: ["Weight Management", "Metabolic Health", "Nutrition"],
    location: "New York, NY",
    country: "USA",
    image: "/avatars/practitioner-4.webp",
    rating: 4.7,
    reviews: 156,
    virtual: true,
    inPerson: true,
    verified: true,
  },
  {
    id: "5",
    name: "Dr. Amanda Foster",
    title: "Board Certified Functional Medicine Practitioner",
    credentials: "BC-FMP, MD",
    specialties: ["Chronic Fatigue", "Autoimmune", "Detoxification"],
    location: "Los Angeles, CA",
    country: "USA",
    image: "/avatars/practitioner-5.webp",
    rating: 4.9,
    reviews: 203,
    virtual: true,
    inPerson: true,
    verified: true,
  },
  {
    id: "6",
    name: "Lisa Martinez",
    title: "Certified Professional Nutrition Coach",
    credentials: "HN-CP",
    specialties: ["Anti-Inflammatory Diet", "Sports Nutrition", "Plant-Based"],
    location: "Miami, FL",
    country: "USA",
    image: "/avatars/practitioner-6.webp",
    rating: 4.8,
    reviews: 78,
    virtual: true,
    inPerson: false,
    verified: true,
  },
];

const specialties = [
  "All Specialties",
  "Functional Medicine",
  "Women's Health",
  "Gut Health",
  "Thyroid Health",
  "Autoimmune",
  "Nutrition",
  "Metabolic Health",
  "Mental Health",
];

const locations = [
  "All Locations",
  "USA",
  "UAE",
  "UK",
  "Canada",
  "Australia",
];

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPractitioners = practitioners.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === "All Specialties" ||
      p.specialties.some(s => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    const matchesLocation = selectedLocation === "All Locations" ||
      p.country === selectedLocation;
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

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
              <Link href="/about" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>About</Link>
              <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Standards</Link>
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
      <section className="relative py-16 md:py-20 text-white overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <Users className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>20,000+ Certified Practitioners Worldwide</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find an ASI-Certified
            <span className="block" style={{ color: BRAND.gold }}>Practitioner</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "#f5e6e8" }}>
            Connect with verified, rigorously trained practitioners in your area or online.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-2 shadow-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-burgundy-500 text-gray-700"
                />
              </div>
              <Button
                size="lg"
                className="px-8 py-4 h-auto font-bold hover:opacity-90"
                style={{ backgroundColor: BRAND.burgundy, color: "white" }}
              >
                Search
              </Button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="mt-4 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {showFilters && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 flex flex-col md:flex-row gap-4">
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-700 border-0"
                >
                  {specialties.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-700 border-0"
                >
                  {locations.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Stats */}
      <section className="border-b border-gray-100 py-4" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600">
            Showing <span className="font-bold" style={{ color: BRAND.burgundy }}>{filteredPractitioners.length}</span> verified practitioners
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" style={{ color: BRAND.gold }} />
              All credentials verified
            </span>
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" style={{ color: BRAND.gold }} />
              Virtual consultations available
            </span>
          </div>
        </div>
      </section>

      {/* Practitioner Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPractitioners.map((practitioner) => (
              <div key={practitioner.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-burgundy-100 to-burgundy-50 flex items-center justify-center text-2xl font-bold" style={{ color: BRAND.burgundy }}>
                      {practitioner.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold" style={{ color: BRAND.burgundy }}>{practitioner.name}</h3>
                        {practitioner.verified && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND.gold }}>
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{practitioner.title}</p>
                      <p className="text-xs font-semibold" style={{ color: BRAND.gold }}>{practitioner.credentials}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" style={{ color: BRAND.gold, fill: BRAND.gold }} />
                      <span className="font-bold text-sm" style={{ color: BRAND.burgundy }}>{practitioner.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({practitioner.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {practitioner.location}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {practitioner.specialties.map((specialty, i) => (
                      <span key={i} className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: `${BRAND.burgundy}10`, color: BRAND.burgundy }}>
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 text-xs text-gray-500 mb-4">
                    {practitioner.virtual && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded bg-green-50 text-green-700">
                        <Globe className="w-3 h-3" />
                        Virtual
                      </span>
                    )}
                    {practitioner.inPerson && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 text-blue-700">
                        <MapPin className="w-3 h-3" />
                        In-Person
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 font-semibold hover:opacity-90"
                      style={{ backgroundColor: BRAND.burgundy, color: "white" }}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      className="px-4"
                      style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPractitioners.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>No practitioners found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-white text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Are You an ASI-Certified Practitioner?
          </h2>
          <p className="text-lg mb-6" style={{ color: "#f5e6e8" }}>
            Claim your free directory listing and connect with clients actively seeking certified practitioners.
          </p>
          <Link href="/login">
            <Button size="lg" className="font-bold px-8 py-4 h-auto hover:opacity-90" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
              Claim Your Listing
            </Button>
          </Link>
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
                <li><Link href="/directory" className="hover:text-white transition-colors">Directory</Link></li>
                <li><Link href="/verify" className="hover:text-white transition-colors">Verify</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
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
