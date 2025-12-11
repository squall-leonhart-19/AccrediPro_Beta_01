"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Clock,
  Award,
  Search,
  Star,
  GraduationCap,
  Play,
  CheckCircle,
  Grid3X3,
  List,
  Sparkles,
  Filter,
  Zap,
  Gift,
  Users,
  ArrowRight,
  UserCircle,
  Flame,
  Trophy,
  FileText,
  Video,
  Target,
  Heart,
  Brain,
  Leaf,
  Lock,
  Bell,
  TrendingUp,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Module {
  lessons: { id: string }[];
}

interface CourseAnalytics {
  totalEnrolled: number;
  avgRating: number;
}

interface Coach {
  id: string;
  name: string;
  avatar: string | null;
  title: string | null;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  shortDescription: string | null;
  thumbnail: string | null;
  difficulty: string;
  duration: number | null;
  isFeatured: boolean;
  isFree: boolean;
  price: number | null;
  certificateType: string;
  category: Category | null;
  coach: Coach | null;
  modules: Module[];
  _count: {
    enrollments: number;
    reviews: number;
  };
  analytics: CourseAnalytics | null;
}

interface Enrollment {
  courseId: string;
  status: string;
  progress: number;
}

interface CourseCatalogFiltersProps {
  courses: Course[];
  categories: Category[];
  enrollments: Enrollment[];
  specialOffers?: {
    id: string;
    title: string;
    discount: number;
    expiresAt: Date | null;
    courses: string[];
  }[];
}

// Coming Soon Courses to make catalog feel full
const COMING_SOON_COURSES = [
  // Women's Health
  { title: "Women's Hormone Specialist", category: "Women's Health", type: "CERTIFICATION", price: 997, icon: Heart, color: "pink" },
  { title: "Menopause Practitioner Mini Diploma", category: "Women's Health", type: "MINI_DIPLOMA", price: 297, icon: Heart, color: "pink" },
  { title: "Fertility Wellness Coach", category: "Women's Health", type: "CERTIFICATION", price: 797, icon: Heart, color: "pink" },
  // Herbalism
  { title: "Herbal Medicine Practitioner", category: "Herbalism", type: "CERTIFICATION", price: 997, icon: Leaf, color: "emerald" },
  { title: "Herbal Remedies Mini Diploma", category: "Herbalism", type: "MINI_DIPLOMA", price: 197, icon: Leaf, color: "emerald" },
  // Spiritual Healing
  { title: "Energy Healing Certification", category: "Spiritual Healing", type: "CERTIFICATION", price: 797, icon: Sparkles, color: "purple" },
  { title: "Chakra Healing Mini Course", category: "Spiritual Healing", type: "MINI_DIPLOMA", price: 147, icon: Sparkles, color: "purple" },
  // Business Strategy
  { title: "Coaching Business Mastery", category: "Business Strategy", type: "CERTIFICATION", price: 697, icon: TrendingUp, color: "blue" },
  { title: "Client Attraction Formula", category: "Business Strategy", type: "MINI_DIPLOMA", price: 197, icon: TrendingUp, color: "blue" },
  // Wellness & Balance
  { title: "Stress & Anxiety Coach", category: "Wellness & Balance", type: "CERTIFICATION", price: 697, icon: Brain, color: "teal" },
  { title: "Sleep Optimization Specialist", category: "Wellness & Balance", type: "MINI_DIPLOMA", price: 297, icon: Brain, color: "teal" },
  // Neurodiversity
  { title: "Neurodiversity Support Specialist", category: "Neurodiversity", type: "CERTIFICATION", price: 997, icon: Brain, color: "indigo" },
];

// Specialization Tracks - More detailed
const SPECIALIZATION_TRACKS = [
  {
    name: "Functional Medicine Track",
    icon: Leaf,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    description: "Become a certified Functional Medicine Health Coach. Master root cause analysis, gut health, hormones, and build a thriving practice.",
    duration: "6-12 months",
    items: [
      { name: "FM Foundations Mini Diploma", status: "available", price: "Free" },
      { name: "FM Health Coach Certification", status: "available", price: "$997" },
      { name: "FM Professional Practitioner", status: "coming", price: "$1,997" },
      { name: "Gut Health Specialist Add-on", status: "coming", price: "$497" },
      { name: "DFY Practice Launch Kit", status: "available", price: "$97" },
    ],
  },
  {
    name: "Women's Health Track",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    description: "Specialize in women's hormones, fertility, menopause, and holistic wellness. High-demand niche with amazing transformation stories.",
    duration: "4-8 months",
    items: [
      { name: "Hormone Health Mini Diploma", status: "coming", price: "$297" },
      { name: "Women's Health Coach Certification", status: "coming", price: "$997" },
      { name: "Menopause Specialist Add-on", status: "coming", price: "$397" },
      { name: "Fertility Support Microcourse", status: "coming", price: "$147" },
      { name: "Women's Wellness DFY Pack", status: "coming", price: "$67" },
    ],
  },
  {
    name: "Coaching Business Track",
    icon: TrendingUp,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Build a profitable coaching practice from scratch. Learn client attraction, marketing, pricing, and business systems that work.",
    duration: "3-6 months",
    items: [
      { name: "Business Foundations Mini Diploma", status: "coming", price: "$197" },
      { name: "Client Attraction Mastery", status: "coming", price: "$497" },
      { name: "Online Marketing for Coaches", status: "coming", price: "$297" },
      { name: "Pricing & Packages Workshop", status: "coming", price: "$97" },
      { name: "Coaching Templates DFY Bundle", status: "available", price: "$47" },
    ],
  },
];

// Webinars & Masterclasses
const BONUS_CONTENT = [
  { title: "How FM Coaches Earn $10K/Month", type: "Webinar", duration: "45 min", icon: "💰" },
  { title: "Client Case Studies Deep Dive", type: "Masterclass", duration: "90 min", icon: "📊" },
  { title: "Gut Health Protocol Workshop", type: "Workshop", duration: "60 min", icon: "🧬" },
  { title: "Building Your Online Presence", type: "Webinar", duration: "45 min", icon: "🌐" },
];

export function CourseCatalogFilters({
  courses,
  categories,
  enrollments,
  specialOffers = [],
}: CourseCatalogFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const enrollmentMap = new Map(enrollments.map((e) => [e.courseId, e]));
  const offerCourseIds = new Set(specialOffers.flatMap((o) => o.courses));

  // Filter courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      const matchesSearch = searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === null || course.category?.id === selectedCategory;
      const matchesDifficulty = selectedDifficulty === null || course.difficulty === selectedDifficulty;
      let matchesPrice = true;
      if (selectedPrice === "free") matchesPrice = course.isFree;
      else if (selectedPrice === "paid") matchesPrice = !course.isFree;
      else if (selectedPrice === "offers") matchesPrice = offerCourseIds.has(course.id);
      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
    });

    switch (sortBy) {
      case "newest": filtered = [...filtered].reverse(); break;
      case "popular": filtered = [...filtered].sort((a, b) => (b.analytics?.totalEnrolled || b._count.enrollments) - (a.analytics?.totalEnrolled || a._count.enrollments)); break;
      case "rating": filtered = [...filtered].sort((a, b) => (b.analytics?.avgRating || 0) - (a.analytics?.avgRating || 0)); break;
      case "price-low": filtered = [...filtered].sort((a, b) => (a.price || 0) - (b.price || 0)); break;
      case "price-high": filtered = [...filtered].sort((a, b) => (b.price || 0) - (a.price || 0)); break;
    }
    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedDifficulty, selectedPrice, sortBy, offerCourseIds]);

  const featuredCourses = courses.filter(c => c.isFeatured);

  // Get selected category name to filter Coming Soon courses
  const selectedCategoryName = selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : null;

  // Filter Coming Soon courses by selected category
  const filteredComingSoon = useMemo(() => {
    if (!selectedCategoryName) return [];
    return COMING_SOON_COURSES.filter(c => c.category === selectedCategoryName);
  }, [selectedCategoryName]);
  const freeCourses = courses.filter(c => c.isFree);
  const totalEnrolled = courses.reduce((acc, c) => acc + (c.analytics?.totalEnrolled || c._count.enrollments), 0);

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Self-paced";
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes} min`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER": return "bg-green-100 text-green-700";
      case "INTERMEDIATE": return "bg-yellow-100 text-yellow-700";
      case "ADVANCED": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCertBadgeColor = (type: string) => {
    return type === "CERTIFICATION" ? "bg-gold-400 text-gold-900" : "bg-purple-100 text-purple-700";
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSelectedPrice(null);
    setSortBy("featured");
  };

  return (
    <div className="space-y-8">
      {/* Hero Header - Branded */}
      <div className="relative bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-burgundy-800 rounded-3xl p-8 md:p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        </div>
        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex items-center gap-2 opacity-80">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold text-gold-400">A</span>
          </div>
          <span className="text-sm font-semibold text-white/80 hidden md:block">AccrediPro Academy</span>
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 border border-gold-400/30">
            <GraduationCap className="w-5 h-5 text-gold-400" />
            <span className="font-semibold text-gold-200">Professional Training</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Course Catalog</h1>
          <p className="text-lg text-white/90 mb-6">Discover {courses.length + COMING_SOON_COURSES.length}+ certifications, mini-diplomas, and training programs</p>
          <div className="flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 bg-burgundy-900/40 border border-gold-400/20 px-4 py-2 rounded-full">
              <BookOpen className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-medium">{courses.length + COMING_SOON_COURSES.length}+ Programs</span>
            </div>
            <div className="flex items-center gap-2 bg-burgundy-900/40 border border-gold-400/20 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-medium">{(totalEnrolled + 2500).toLocaleString()} Students</span>
            </div>
            <div className="flex items-center gap-2 bg-burgundy-900/40 border border-gold-400/20 px-4 py-2 rounded-full">
              <Award className="w-4 h-4 text-gold-400" />
              <span className="text-sm font-medium">Accredited Certifications</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search courses..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === null ? "bg-burgundy-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-burgundy-50"}`}>
              All
            </button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id ? "bg-burgundy-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-burgundy-50"}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 🌟 FEATURED PROGRAMS */}
      {featuredCourses.length > 0 && !searchQuery && !selectedCategory && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-gold-500 fill-gold-500" />
            <h2 className="text-xl font-bold text-gray-900">Featured Programs</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredCourses.slice(0, 2).map((course) => {
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              return (
                <Link key={course.id} href={`/courses/${course.slug}`}>
                  <Card className="overflow-hidden border-2 border-gold-200 bg-gradient-to-br from-white to-gold-50 hover:shadow-xl transition-all group h-full">
                    <div className="h-48 bg-gradient-to-br from-burgundy-600 to-burgundy-800 relative">
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gold-400 text-gold-900 border-0 font-bold"><Star className="w-3 h-3 mr-1" /> Featured</Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className={getCertBadgeColor(course.certificateType)}>{course.certificateType === "CERTIFICATION" ? "Certification" : "Mini Diploma"}</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                        <div className="flex gap-3 text-white/80 text-sm">
                          <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {totalLessons} lessons</span>
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatDuration(course.duration)}</span>
                          <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-gold-400 text-gold-400" /> {(course.analytics?.avgRating || 4.9).toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.shortDescription || course.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-burgundy-600">{course.isFree ? "Free" : `$${course.price}`}</span>
                        <Button className="bg-burgundy-600 hover:bg-burgundy-700">View Course <ArrowRight className="w-4 h-4 ml-2" /></Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 📚 ALL COURSES */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-burgundy-600" />
            <h2 className="text-xl font-bold text-gray-900">All Courses</h2>
            <Badge variant="secondary">{filteredCourses.length}</Badge>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const enrollment = enrollmentMap.get(course.id);
            const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
            const avgRating = course.analytics?.avgRating || 4.9;
            const enrolledCount = course.analytics?.totalEnrolled || course._count.enrollments;
            return (
              <Link key={course.id} href={`/courses/${course.slug}`}>
                <Card className="h-full overflow-hidden border hover:border-burgundy-300 hover:shadow-xl transition-all group">
                  <div className="h-40 relative overflow-hidden bg-gradient-to-br from-burgundy-500 to-burgundy-700">
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className={getDifficultyColor(course.difficulty)}>{course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}</Badge>
                      {course.isFree && <Badge className="bg-green-500 text-white">Free</Badge>}
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className={getCertBadgeColor(course.certificateType)}>{course.certificateType === "CERTIFICATION" ? "Certification" : "Mini Diploma"}</Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                        <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        <span className="text-white text-sm">{avgRating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                        <Users className="w-3.5 h-3.5 text-white" />
                        <span className="text-white text-sm">{enrolledCount}</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-burgundy-600 min-h-[48px]">{course.title}</h3>
                    {course.category && <Badge variant="outline" className="mb-2 text-xs">{course.category.name}</Badge>}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {totalLessons} lessons</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      {enrollment ? (
                        <div className="flex items-center gap-2 w-full"><Progress value={enrollment.progress} className="flex-1 h-2" /><span className="text-sm font-bold text-burgundy-600">{Math.round(enrollment.progress)}%</span></div>
                      ) : (
                        <><span className="text-sm text-gray-500 flex items-center gap-1"><Play className="w-3.5 h-3.5" /> Start</span><span className="font-bold text-burgundy-600">{course.isFree ? "Free" : `$${course.price}`}</span></>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}

          {/* Show Coming Soon courses when a category is selected */}
          {filteredComingSoon.map((item, i) => (
            <Card key={`coming-${i}`} className="h-full overflow-hidden border border-purple-200 hover:shadow-lg transition-all group bg-gradient-to-br from-white to-purple-50/50">
              <div className="h-40 relative overflow-hidden bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                <Lock className="w-12 h-12 text-white/60" />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-500 text-white">Coming Soon</Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className={item.type === "CERTIFICATION" ? "bg-gold-400 text-gold-900" : "bg-purple-100 text-purple-700"}>
                    {item.type === "CERTIFICATION" ? "Certification" : "Mini Diploma"}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[48px]">{item.title}</h3>
                <Badge variant="outline" className="mb-2 text-xs">{item.category}</Badge>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-sm text-gray-400">Join Waitlist</span>
                  <span className="font-bold text-gray-400">${item.price}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3 group-hover:bg-purple-50 group-hover:border-purple-300 group-hover:text-purple-600">
                  <Bell className="w-4 h-4 mr-2" /> Notify Me When Available
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 🔜 COMING SOON - BY CATEGORY */}
      {!searchQuery && !selectedCategory && (
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-900">Coming Soon</h2>
            <Badge className="bg-purple-100 text-purple-700 border-0">Join Waitlist</Badge>
          </div>

          {/* Group by category */}
          {["Women's Health", "Herbalism", "Spiritual Healing", "Business Strategy", "Wellness & Balance", "Neurodiversity"].map((catName) => {
            const categoryCourses = COMING_SOON_COURSES.filter(c => c.category === catName);
            if (categoryCourses.length === 0) return null;
            return (
              <div key={catName} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                  {catName === "Women's Health" && <Heart className="w-4 h-4 text-pink-500" />}
                  {catName === "Herbalism" && <Leaf className="w-4 h-4 text-emerald-500" />}
                  {catName === "Spiritual Healing" && <Sparkles className="w-4 h-4 text-purple-500" />}
                  {catName === "Business Strategy" && <TrendingUp className="w-4 h-4 text-blue-500" />}
                  {catName === "Wellness & Balance" && <Brain className="w-4 h-4 text-teal-500" />}
                  {catName === "Neurodiversity" && <Brain className="w-4 h-4 text-indigo-500" />}
                  {catName}
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryCourses.map((item, i) => (
                    <Card key={i} className="overflow-hidden border hover:shadow-md transition-all group">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0`}>
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{item.type === "CERTIFICATION" ? "Certification" : "Mini Diploma"}</Badge>
                            <span className="text-sm text-gray-400">${item.price}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="flex-shrink-0 group-hover:bg-purple-50 group-hover:border-purple-300 group-hover:text-purple-600">
                          <Bell className="w-3 h-3" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* 🛤️ SPECIALIZATION TRACKS */}
      {!searchQuery && !selectedCategory && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-gray-900">Specialization Tracks</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SPECIALIZATION_TRACKS.map((track, i) => (
              <Card key={i} className={`overflow-hidden border ${track.borderColor} hover:shadow-lg transition-all ${track.bgColor}`}>
                <div className={`bg-gradient-to-r ${track.color} p-5 text-white`}>
                  <track.icon className="w-8 h-8 mb-2" />
                  <h3 className="font-bold text-xl">{track.name}</h3>
                  <p className="text-sm text-white/80">{track.duration}</p>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm text-gray-600 mb-4">{track.description}</p>
                  <div className="space-y-2">
                    {track.items.map((item, j) => (
                      <div key={j} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-2">
                          {item.status === "available" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={item.status === "available" ? "text-gray-900" : "text-gray-500"}>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.status === "coming" && (
                            <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">Soon</Badge>
                          )}
                          <span className="font-semibold text-sm">{item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4 bg-burgundy-600 hover:bg-burgundy-700">
                    View Track <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 🎥 BONUS CONTENT */}
      {!searchQuery && !selectedCategory && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Webinars & Masterclasses</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BONUS_CONTENT.map((item, i) => (
              <Card key={i} className="hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <span className="text-3xl block mb-2">{item.icon}</span>
                  <Badge variant="outline" className="mb-2 text-xs">{item.type}</Badge>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.duration}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 🎓 UPGRADE CTA */}
      <Card className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 border-0 text-white overflow-hidden">
        <CardContent className="p-8 relative">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey? 🚀</h3>
              <p className="text-white/80">Get certified and transform lives with professional coaching skills</p>
            </div>
            <Button size="lg" className="bg-gold-400 text-burgundy-900 hover:bg-gold-500">
              Get Started Today <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
