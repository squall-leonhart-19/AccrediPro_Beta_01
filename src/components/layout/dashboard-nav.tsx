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
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, tourId: "dashboard" },
  { href: "/start-here", label: "Start Here", icon: GraduationCap, tourId: "start-here" },
  { href: "/my-courses", label: "My Courses", icon: BookOpen, tourId: "my-courses" },
  { href: "/catalog", label: "Catalog", icon: Library, tourId: "catalog" },
  { href: "/roadmap", label: "Your Roadmap", icon: Map, tourId: "roadmap" },
  { href: "/career-center", label: "Career Center", icon: Briefcase, tourId: "career-center" },
  { href: "/programs", label: "Client Program Library", icon: Package, tourId: "programs" },
  { href: "/community", label: "Community", icon: Users, tourId: "community" },
  { href: "/messages", label: "Private Mentor Chat", icon: MessageSquare, notificationKey: "messages" as const, tourId: "messages" },
  // TEMPORARILY HIDDEN - Re-enable when videos arrive (5-7 days from Dec 16, 2024)
  // See: /docs/CHALLENGES_REACTIVATION.md
  // { href: "/challenges", label: "Challenges", icon: Flame, tourId: "challenges" },
  { href: "/certificates", label: "My Certificates", icon: Award, notificationKey: "certificates" as const, tourId: "certificates" },
  { href: "/my-library", label: "My Library", icon: Library, tourId: "my-library" },
  { href: "/ebooks", label: "Professional Library", icon: ShoppingBag, tourId: "ebooks" },
  { href: "/training", label: "Training", icon: GraduationCap, tourId: "training" },
  { href: "/help", label: "Help & Support", icon: HelpCircle, tourId: "help" },
  { href: "/profile", label: "My Account", icon: User, tourId: "profile" },
];

const coachNavItems = [
  { href: "/coach/workspace", label: "Coach Workspace", icon: Briefcase },
];

const adminNavItems = [
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { counts } = useNotifications();

  const user = session?.user;
  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  const isAdmin = user?.role === "ADMIN";

  const getNotificationCount = (key?: "messages" | "certificates" | "announcements") => {
    if (!key) return 0;
    return counts[key] || 0;
  };

  return (
    <>
      {/* Desktop Sidebar - Burgundy/Gold Theme */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-gradient-to-b from-burgundy-700 via-burgundy-800 to-burgundy-900 shadow-2xl">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-burgundy-600/30">
          <div className="p-1.5 bg-white rounded-xl shadow-lg">
            <Image
              src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
              alt="AccrediPro Academy"
              width={40}
              height={40}
              className="rounded-lg"
              priority
              unoptimized
            />
          </div>
          <div>
            <span className="text-xl font-bold text-white">AccrediPro</span>
            <p className="text-xs text-white/70">Academy</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const notificationCount = getNotificationCount(item.notificationKey);

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

          {/* My Mini Diploma - Only for freebie users */}
          {user?.miniDiplomaCategory && (
            <Link
              href="/my-mini-diploma"
              prefetch={true}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative",
                pathname === "/my-mini-diploma"
                  ? "bg-gradient-to-r from-green-400/20 to-emerald-500/10 text-green-300 shadow-lg shadow-green-500/10 border border-green-400/20"
                  : "text-green-200 hover:bg-green-600/30 hover:text-white bg-green-700/20 border border-green-500/20"
              )}
            >
              <GraduationCap className={cn("w-5 h-5", pathname === "/my-mini-diploma" ? "text-green-400" : "text-green-300")} />
              <span className="flex-1 text-left">🎁 My Mini Diploma</span>
              <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">FREE</span>
            </Link>
          )}

          {/* Coach Section - visible to ALL users including students */}
          {user && (
            <>
              <div className="pt-3 mt-3 border-t border-burgundy-600/30">
                <p className="px-3 py-1 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  🩺 Coach Practice
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
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="p-1 bg-white rounded-lg shadow-md">
              <Image
                src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
                alt="AccrediPro"
                width={28}
                height={28}
                className="rounded"
                unoptimized
              />
            </div>
            <span className="font-bold text-white">AccrediPro</span>
          </Link>

          <div className="flex items-center gap-2">
            <NotificationBell variant="dark" />
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-burgundy-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-burgundy-900 pt-16 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const notificationCount = getNotificationCount(item.notificationKey);

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
