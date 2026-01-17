"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/providers/notification-provider";
import { NotificationBell } from "@/components/ui/notification-bell";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  MessageSquare,
  Award,
  User,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Settings,
  Shield,
  Library,
  Map,
  HelpCircle,
  Briefcase,
  Package,
  Trophy,
  Flame,
  ShoppingBag,
  Lock,
  Unlock,
  Sparkles,
  Users2,
  ChevronDown,
  Gift,
} from "lucide-react";
import { InstallAppButton } from "@/components/pwa/install-app-button";
import { useState } from "react";

// GROUPED NAV: 7 sections with expandable sub-items
// See: Institute_ASI/11_PORTAL_NAVIGATION_OPTIMIZED.md
// All pages remain accessible, just visually organized

// Nav item type with optional children for grouping
interface NavItem {
  href: string;
  label: string;
  icon: any;
  tourId?: string;
  notificationKey?: "messages" | "certificates" | "announcements";
  locked?: boolean;
  external?: boolean;
  unlocked?: boolean;
  children?: NavItem[];
}

const fullNavItems: NavItem[] = [
  // 1. Dashboard - standalone
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tourId: "dashboard" },

  // 2. Start Here - for onboarding (conditionally shown - filtered in getFullNavItems)
  // { href: "/start-here", label: "Start Here", icon: Sparkles, tourId: "start-here" },

  // 3. My Learning - EXPANDABLE GROUP with sub-items
  {
    href: "/my-learning",
    label: "My Learning",
    icon: BookOpen,
    tourId: "my-learning",
    children: [
      { href: "/my-courses", label: "📚 My Courses", icon: BookOpen, tourId: "my-courses" },
      { href: "/my-personal-roadmap-by-coach-sarah", label: "🗺️ My Roadmap", icon: Map, tourId: "my-roadmap" },
      { href: "/my-learning/this-week", label: "📅 This Week", icon: BookOpen, tourId: "this-week" },
      { href: "/my-learning/notes", label: "📝 Notes", icon: BookOpen, tourId: "notes" },
    ]
  },

  // 4. Course Catalog - standalone (browse & purchase)
  { href: "/catalog", label: "Course Catalog", icon: ShoppingBag, tourId: "catalog" },


  // 4. My Library - EXPANDABLE GROUP with sub-items
  {
    href: "/my-library",
    label: "My Library",
    icon: Library,
    tourId: "my-library",
    children: [
      { href: "/my-library/course-materials", label: "📁 Course Materials", icon: Library, tourId: "course-materials" },
      { href: "/ebooks", label: "📖 Browse Guides", icon: Library, tourId: "browse-guides" },
    ]
  },

  // 5. Messages - for admin access to mentor chat
  { href: "/messages", label: "Messages", icon: MessageSquare, notificationKey: "messages", tourId: "messages" },

  // 6. My Pod - TEMPORARILY HIDDEN
  // { href: "/my-circle", label: "My Pod", icon: Users2, tourId: "my-pod" },

  // 7. Community - EXPANDABLE GROUP with sub-items
  {
    href: "/community",
    label: "Community",
    icon: Users,
    tourId: "community",
    children: [
      { href: "/community", label: "🏠 Community Hub", icon: Users, tourId: "community-hub" },
      { href: "/community/cmj94foua0000736vfwdlheir", label: "👋 Introduce Yourself", icon: Users, tourId: "intro" },
      { href: "/community/announcements", label: "📢 Announcements", icon: MessageSquare, tourId: "announcements" },
    ]
  },

  // 8. My Credentials - standalone (certificates, achievements, verify)
  { href: "/my-credentials", label: "My Credentials", icon: Award, notificationKey: "certificates", tourId: "credentials" },

  // 9. Career Center - MEGA-PAGE (career, programs, tools, directory)
  {
    href: "/practice",
    label: "Career Center",
    icon: Briefcase,
    tourId: "practice-earn",
  },

  // 10. Settings - GROUP  
  {
    href: "/profile",
    label: "Settings",
    icon: Settings,
    tourId: "settings",
    children: [
      { href: "/profile", label: "My Profile", icon: User, tourId: "profile" },
      { href: "/referrals", label: "Referral Program", icon: Gift, tourId: "referrals" },
      { href: "/help", label: "Help & Support", icon: HelpCircle, tourId: "help" },
    ]
  },
];

// Minimal nav for Mini Diploma users - maximum focus for completion
// Shows: Lessons, Introduce Yourself, Chat, and LOCKED Training (teaser)
// Note: locked state is determined dynamically based on isMiniDiplomaOnly
const getMiniDiplomaNavItems = (isLocked: boolean, courseSlug?: string | null) => {
  // Map course slugs to their correct route paths
  // Default to womens-health-diploma if unknown, but try to derive from slug
  let lessonPath = "/womens-health-diploma";

  if (courseSlug) {
    if (courseSlug === "gut-health-mini-diploma") lessonPath = "/gut-health-diploma";
    else if (courseSlug === "functional-medicine-mini-diploma") lessonPath = "/functional-medicine-diploma";
    else if (courseSlug === "health-coach-mini-diploma") lessonPath = "/health-coach-diploma";
    else if (courseSlug === "holistic-nutrition-mini-diploma") lessonPath = "/holistic-nutrition-diploma";
    else if (courseSlug === "hormone-health-mini-diploma") lessonPath = "/hormone-health-diploma";
    else if (courseSlug === "nurse-coach-mini-diploma") lessonPath = "/nurse-coach-diploma";
    else if (courseSlug === "womens-health-mini-diploma") lessonPath = "/womens-health-diploma";
  }

  return [
    { href: lessonPath, label: "My Lessons", icon: GraduationCap, tourId: "mini-diploma" },
    { href: "/community/cmj94foua0000736vfwdlheir", label: "Introduce Yourself", icon: Users, tourId: "community" },
    { href: "/messages", label: "Ask Coach Sarah", icon: MessageSquare, notificationKey: "messages" as const, tourId: "messages" },
    // { href: "/training", label: "Masterclass Bonus", icon: Award, tourId: "training", locked: isLocked, unlocked: !isLocked },
  ];
};


// Minimal nav for FM Preview users - Module 0 & 1 only
// Shows: Lessons, Chat, and locked full certification CTA
const getFMPreviewNavItems = () => [
  { href: "/fm-preview", label: "My Lessons", icon: GraduationCap, tourId: "fm-preview" },
  { href: "/messages", label: "Ask Coach Sarah", icon: MessageSquare, notificationKey: "messages" as const, tourId: "messages" },
  { href: "/fm-certification", label: "Full Certification", icon: Award, tourId: "certification", locked: true, external: true },
];


const coachNavItems = [
  { href: "/coach/workspace", label: "Coach Workspace", icon: Briefcase },
];

const adminNavItems = [
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Shield },
  { href: "/admin/pod-analytics", label: "Pod Analytics", icon: Users },
  { href: "/admin/pod-messages", label: "Pod Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["my-learning"]); // Start with My Learning expanded
  const { counts } = useNotifications();

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const user = session?.user;
  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  const isAdmin = user?.role === "ADMIN";

  // isMiniDiplomaOnly = true means user has ONLY mini diploma enrollment AND it's not completed yet
  // When completed, isMiniDiplomaOnly becomes false, but we still want to show mini diploma nav (just unlocked)
  const isMiniDiplomaOnly = user?.isMiniDiplomaOnly === true;

  // Check if user has miniDiplomaCategory - this means they're a mini diploma user (regardless of completion)
  // Mini diploma users should ALWAYS see the minimal nav, just locked/unlocked based on completion
  const isMiniDiplomaUser = !!user?.miniDiplomaCategory;
  const miniDiplomaCourseSlug = user?.miniDiplomaCourseSlug;

  // Check if user is FM Preview only (enrolled only in fm-preview course)
  const isFMPreviewOnly = user?.isFMPreviewOnly === true;

  // Check if user is a LEAD (free mini diploma user with 7-day access)
  const isLeadUser = user?.userType === "LEAD";

  // Check if user has FM Certification for My Circle access
  const hasFMCertification = user?.hasFMCertification === true || isAdmin;

  // Build full nav items with conditional Start Here and My Circle
  const getFullNavItems = () => {
    const items = [...fullNavItems];

    // Add Start Here after Dashboard if user hasn't completed onboarding
    // Uses hasCompletedOnboarding from session (checks all 6 Start Here items)
    if (!user?.hasCompletedOnboarding) {
      const dashboardIndex = items.findIndex(item => item.href === "/dashboard");
      if (dashboardIndex !== -1) {
        items.splice(dashboardIndex + 1, 0, {
          href: "/start-here",
          label: "Start Here",
          icon: Sparkles,
          tourId: "start-here",
        });
      }
    }

    // Add My Circle after Messages if user has FM certification
    /* TEMPORARILY DISABLED (HIDDEN)
    if (hasFMCertification) {
      const messagesIndex = items.findIndex(item => item.href === "/messages");
      if (messagesIndex !== -1) {
        items.splice(messagesIndex + 1, 0, {
          href: "/my-circle",
          label: "Mastermind Circle", // Renamed to add value perceptions
          icon: Users2,
          tourId: "my-circle",
        });
      }
    }
    */
    return items;
  };

  // Select nav items based on user type
  // FM Preview users: show minimal nav with locked full certification CTA
  // Mini diploma users (LEAD or with category): show minimal nav with locked/unlocked Masterclass based on completion
  // Other users: show full nav
  const navItems = isFMPreviewOnly
    ? getFMPreviewNavItems()
    : (isMiniDiplomaUser || isLeadUser)
      ? getMiniDiplomaNavItems(isMiniDiplomaOnly, miniDiplomaCourseSlug) // locked if not completed yet
      : getFullNavItems();

  const getNotificationCount = (key?: "messages" | "certificates" | "announcements") => {
    if (!key) return 0;
    return counts[key] || 0;
  };

  return (
    <>
      {/* Desktop Sidebar - Burgundy/Gold Theme */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-gradient-to-b from-burgundy-700 via-burgundy-800 to-burgundy-900 shadow-2xl">
        {/* Logo - Premium ASI Branding */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-burgundy-600/30">
          <div className="relative">
            <Image
              src="/asi-logo.png"
              alt="AccrediPro Standards Institute"
              width={48}
              height={48}
              className="rounded-lg"
              priority
            />
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)' }}
            >
              <Shield className="w-3 h-3 text-burgundy-900" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">AccrediPro</span>
            <p className="text-[9px] font-bold tracking-widest" style={{ color: '#d4af37' }}>STANDARDS INSTITUTE</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isGroupExpanded = expandedGroups.includes(item.tourId || item.href);
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const isChildActive = hasChildren && item.children?.some(child =>
              pathname === child.href || pathname.startsWith(child.href + "/")
            );
            const notificationCount = getNotificationCount(item.notificationKey);
            const isLocked = 'locked' in item && item.locked === true;
            const isUnlocked = 'unlocked' in item && item.unlocked === true;
            const isExternal = 'external' in item && item.external === true;

            // Locked items render differently
            if (isLocked) {
              if (isExternal) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-tour={item.tourId}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium relative bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/30 hover:from-gold-400/20 hover:to-gold-500/10 transition-all group"
                  >
                    <div className="relative">
                      <item.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <span className="flex-1 text-left text-gold-300">{item.label}</span>
                    <div className="flex items-center gap-1.5">
                      <Unlock className="w-3.5 h-3.5 text-gold-400" />
                    </div>
                  </Link>
                );
              }
              return (
                <div
                  key={item.href}
                  data-tour={item.tourId}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium relative bg-white/5 border border-dashed border-white/20 cursor-not-allowed group"
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5 text-amber-400/60" />
                  </div>
                  <span className="flex-1 text-left text-white/50">{item.label}</span>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400/80" />
                  </div>
                </div>
              );
            }

            // Unlocked items with celebration highlight
            if (isUnlocked) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  data-tour={item.tourId}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative",
                    isActive
                      ? "bg-gradient-to-r from-emerald-400/30 to-emerald-500/20 text-emerald-300 shadow-lg shadow-emerald-500/20 border border-emerald-400/30"
                      : "bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-emerald-300 hover:from-emerald-500/20 hover:to-emerald-600/10 border border-emerald-500/20"
                  )}
                >
                  <div className="relative">
                    <item.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </Link>
              );
            }

            // GROUP with children - expandable
            if (hasChildren) {
              return (
                <div key={item.href} className="space-y-0.5">
                  {/* Group header - clickable to expand/collapse */}
                  <button
                    onClick={() => toggleGroup(item.tourId || item.href)}
                    data-tour={item.tourId}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative",
                      isActive || isChildActive
                        ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 shadow-lg shadow-gold-500/10 border border-gold-400/20"
                        : "text-white/90 hover:bg-burgundy-600/50 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive || isChildActive ? "text-gold-400" : "text-white/60")} />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isGroupExpanded ? "rotate-180" : "",
                      isActive || isChildActive ? "text-gold-400" : "text-white/40"
                    )} />
                  </button>

                  {/* Expanded children */}
                  {isGroupExpanded && (
                    <div className="ml-4 pl-3 border-l border-burgundy-600/30 space-y-0.5">
                      {item.children?.map((child) => {
                        const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");
                        const childNotificationCount = getNotificationCount(child.notificationKey);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            prefetch={true}
                            data-tour={child.tourId}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 relative",
                              isChildActive
                                ? "bg-gold-400/10 text-gold-300 font-medium"
                                : "text-white/70 hover:bg-burgundy-600/30 hover:text-white"
                            )}
                          >
                            <child.icon className={cn("w-4 h-4", isChildActive ? "text-gold-400" : "text-white/40")} />
                            <span className="flex-1 text-left text-sm">{child.label}</span>
                            {childNotificationCount > 0 && (
                              <span className="min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                                {childNotificationCount > 99 ? "99+" : childNotificationCount}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // STANDALONE item (no children)
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                data-tour={item.tourId}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative",
                  isActive
                    ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 shadow-lg shadow-gold-500/10 border border-gold-400/20"
                    : "text-white/90 hover:bg-burgundy-600/50 hover:text-white"
                )}
              >
                <div className="relative">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-white/60")} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                      {notificationCount > 99 ? "99+" : notificationCount}
                    </span>
                  )}
                </div>
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && !notificationCount && (
                  <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                )}
              </Link>
            );
          })}


          {/* Coach Panel - only for ADMIN, INSTRUCTOR, MENTOR */}
          {user && ["ADMIN", "INSTRUCTOR", "MENTOR"].includes(user.role) && (
            <>
              <div className="pt-3 mt-3 border-t border-burgundy-600/30">
                <p className="px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  🩺 Coach Panel
                </p>
              </div>
              {coachNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 text-emerald-300 shadow-lg shadow-emerald-500/10 border border-emerald-400/20"
                        : "text-white/90 hover:bg-burgundy-600/50 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-white/60")} />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="pt-3 mt-3 border-t border-burgundy-600/30">
                <p className="px-3 py-1 text-xs font-semibold text-gold-400 uppercase tracking-wider">
                  Admin Panel
                </p>
              </div>
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 shadow-lg shadow-gold-500/10 border border-gold-400/20"
                        : "text-white/90 hover:bg-burgundy-600/50 hover:text-white"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-white/60")} />
                    {item.label}
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Install App Button */}
        <div className="px-3 pb-2">
          <InstallAppButton variant="sidebar" />
        </div>

        {/* User section */}
        <div className="flex-shrink-0 p-4 border-t border-burgundy-600/30 bg-burgundy-900/50">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 ring-2 ring-gold-400/50">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-white/70 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-white/90 hover:text-white hover:bg-burgundy-700/50"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header - Burgundy Theme */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-burgundy-800/95 backdrop-blur-md border-b border-burgundy-700">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="text-white/80 hover:text-white hover:bg-burgundy-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Center: Logo - ASI Branding */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/asi-logo.png"
              alt="AccrediPro"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <div>
              <span className="font-black text-white tracking-tight">AccrediPro</span>
              <span className="text-[7px] block font-bold tracking-widest" style={{ color: '#d4af37' }}>STANDARDS INSTITUTE</span>
            </div>
          </Link>

          {/* Right: Notification Bell */}
          <NotificationBell variant="dark" />
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-burgundy-900 pt-16 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isGroupExpanded = expandedGroups.includes(item.tourId || item.href);
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const isChildActive = hasChildren && item.children?.some(child =>
                pathname === child.href || pathname.startsWith(child.href + "/")
              );
              const notificationCount = getNotificationCount(item.notificationKey);
              const isLocked = 'locked' in item && item.locked === true;
              const isUnlocked = 'unlocked' in item && item.unlocked === true;

              // Locked items render differently on mobile
              // External locked items (like Full Certification CTA) link to external page
              const isExternalMobile = 'external' in item && item.external === true;
              if (isLocked) {
                if (isExternalMobile) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      data-tour={`mobile-${item.tourId}`}
                      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium bg-gradient-to-r from-gold-400/10 to-gold-500/5 border border-gold-400/30"
                    >
                      <item.icon className="w-5 h-5 text-gold-400" />
                      <span className="flex-1 text-left text-gold-300">{item.label}</span>
                      <Unlock className="w-4 h-4 text-gold-400" />
                    </Link>
                  );
                }
                return (
                  <div
                    key={item.href}
                    data-tour={`mobile-${item.tourId}`}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium bg-white/5 border border-dashed border-white/20"
                  >
                    <item.icon className="w-5 h-5 text-amber-400/60" />
                    <span className="flex-1 text-left text-white/50">{item.label}</span>
                    <Lock className="w-4 h-4 text-amber-400/80" />
                  </div>
                );
              }

              // Unlocked items - green highlight on mobile too
              if (isUnlocked) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    data-tour={`mobile-${item.tourId}`}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-emerald-400/30 to-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 text-emerald-300 border border-emerald-500/20"
                    )}
                  >
                    <item.icon className="w-5 h-5 text-emerald-400" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </Link>
                );
              }

              // GROUP with children - expandable on mobile
              if (hasChildren) {
                return (
                  <div key={item.href} className="space-y-1">
                    {/* Group header - tap to expand */}
                    <button
                      onClick={() => toggleGroup(item.tourId || item.href)}
                      data-tour={`mobile-${item.tourId}`}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                        isActive || isChildActive
                          ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 border border-gold-400/20"
                          : "text-white/90 hover:bg-burgundy-800"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive || isChildActive ? "text-gold-400" : "text-white/60")} />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isGroupExpanded ? "rotate-180" : "",
                        isActive || isChildActive ? "text-gold-400" : "text-white/40"
                      )} />
                    </button>

                    {/* Expanded children on mobile */}
                    {isGroupExpanded && (
                      <div className="ml-4 pl-3 border-l border-burgundy-700 space-y-1">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/");
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              prefetch={true}
                              onClick={() => setMobileMenuOpen(false)}
                              data-tour={`mobile-${child.tourId}`}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                                isChildActive
                                  ? "bg-gold-400/10 text-gold-300 font-medium"
                                  : "text-white/70 hover:bg-burgundy-800"
                              )}
                            >
                              <span className="flex-1 text-left">{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Regular item
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  data-tour={`mobile-${item.tourId}`}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 border border-gold-400/20"
                      : "text-white/90 hover:bg-burgundy-800"
                  )}
                >
                  <div className="relative">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-white/60")} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                </Link>
              );
            })}

            {/* Admin Section - Mobile */}
            {isAdmin && (
              <>
                <div className="pt-4 mt-4 border-t border-burgundy-700">
                  <p className="px-4 py-2 text-xs font-semibold text-gold-400 uppercase tracking-wider">
                    Admin Panel
                  </p>
                </div>
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 border border-gold-400/20"
                          : "text-white/90 hover:bg-burgundy-800"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-white/60")} />
                      {item.label}
                    </Link>
                  );
                })}
              </>
            )}

            {/* Install App Button - Mobile */}
            <div className="pt-4 mt-4 border-t border-burgundy-700 px-4">
              <InstallAppButton variant="sidebar" />
            </div>

            <div className="pt-4 mt-4 border-t border-burgundy-700">
              <div className="flex items-center gap-3 px-4 py-3">
                <Avatar className="h-12 w-12 ring-2 ring-gold-400/30">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-white/60">{user?.email}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start text-white/80 hover:text-white px-4 mt-2"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
