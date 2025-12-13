"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
} from "lucide-react";
import { useState, useTransition } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/start-here", label: "Start Here", icon: GraduationCap },
  { href: "/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/courses", label: "Catalog", icon: Library },
  { href: "/roadmap", label: "Your Roadmap", icon: Map },
  { href: "/career-center", label: "Career Center", icon: Briefcase },
  { href: "/programs", label: "Client Program Library", icon: Package },
  { href: "/community", label: "Community", icon: Users },
  { href: "/messages", label: "Private Mentor Chat", icon: MessageSquare, notificationKey: "messages" as const },
  { href: "/challenges", label: "Challenges", icon: Flame },
  { href: "/gamification", label: "XP & Levels", icon: Trophy },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/my-library", label: "My Library", icon: Library },
  { href: "/training", label: "Training", icon: GraduationCap },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
  { href: "/profile", label: "Profile", icon: User },
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
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { counts } = useNotifications();

  const user = session?.user;
  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  const isAdmin = user?.role === "ADMIN";

  const handleNavigation = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
    setMobileMenuOpen(false);
  };

  const getNotificationCount = (key?: "messages" | "announcements") => {
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
            <p className="text-xs text-burgundy-200">Academy</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const notificationCount = getNotificationCount(item.notificationKey);

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                disabled={isPending}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative",
                  isActive
                    ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 shadow-lg shadow-gold-500/10 border border-gold-400/20"
                    : "text-burgundy-100 hover:bg-burgundy-600/50 hover:text-white",
                  isPending && "opacity-50 cursor-wait"
                )}
              >
                <div className="relative">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-burgundy-300")} />
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
              </button>
            );
          })}

          {/* My Mini Diploma - Only for freebie users */}
          {user?.miniDiplomaCategory && (
            <button
              onClick={() => handleNavigation("/my-mini-diploma")}
              disabled={isPending}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 relative",
                pathname === "/my-mini-diploma"
                  ? "bg-gradient-to-r from-green-400/20 to-emerald-500/10 text-green-300 shadow-lg shadow-green-500/10 border border-green-400/20"
                  : "text-green-200 hover:bg-green-600/30 hover:text-white bg-green-700/20 border border-green-500/20",
                isPending && "opacity-50 cursor-wait"
              )}
            >
              <GraduationCap className={cn("w-5 h-5", pathname === "/my-mini-diploma" ? "text-green-400" : "text-green-300")} />
              <span className="flex-1 text-left">🎁 My Mini Diploma</span>
              <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">FREE</span>
            </button>
          )}

          {/* Coach Section - visible to ALL users including students */}
          {user && (
            <>
              <div className="pt-4 mt-4 border-t border-burgundy-600/30">
                <p className="px-4 py-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  🩺 Coach Practice
                </p>
              </div>
              {coachNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    disabled={isPending}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-gradient-to-r from-emerald-400/20 to-emerald-500/10 text-emerald-300 shadow-lg shadow-emerald-500/10 border border-emerald-400/20"
                        : "text-burgundy-100 hover:bg-burgundy-600/50 hover:text-white",
                      isPending && "opacity-50 cursor-wait"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-400" : "text-burgundy-300")} />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </>
          )}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="pt-4 mt-4 border-t border-burgundy-600/30">
                <p className="px-4 py-2 text-xs font-semibold text-gold-400 uppercase tracking-wider">
                  Admin Panel
                </p>
              </div>
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <button
                    key={item.href}
                    onClick={() => handleNavigation(item.href)}
                    disabled={isPending}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                      isActive
                        ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 shadow-lg shadow-gold-500/10 border border-gold-400/20"
                        : "text-burgundy-100 hover:bg-burgundy-600/50 hover:text-white",
                      isPending && "opacity-50 cursor-wait"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-burgundy-300")} />
                    {item.label}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </>
          )}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-burgundy-600/30 bg-burgundy-900/50">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-burgundy-800/50 border border-burgundy-600/20">
            <Avatar className="h-11 w-11 ring-2 ring-gold-400/30">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-burgundy-300 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-burgundy-200 hover:text-white hover:bg-burgundy-700/50"
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
          <button onClick={() => handleNavigation("/dashboard")} className="flex items-center gap-2">
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
          </button>

          <div className="flex items-center gap-2">
            <NotificationBell variant="dark" />
            <Button
              variant="ghost"
              size="icon"
              className="text-burgundy-200 hover:text-white hover:bg-burgundy-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-burgundy-900 pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const notificationCount = getNotificationCount(item.notificationKey);

              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 border border-gold-400/20"
                      : "text-burgundy-100 hover:bg-burgundy-800"
                  )}
                >
                  <div className="relative">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-burgundy-300")} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {notificationCount > 99 ? "99+" : notificationCount}
                      </span>
                    )}
                  </div>
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
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
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 border border-gold-400/20"
                          : "text-burgundy-100 hover:bg-burgundy-800"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-burgundy-300")} />
                      {item.label}
                    </button>
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
                  <p className="text-sm text-burgundy-300">{user?.email}</p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start text-burgundy-200 hover:text-white px-4 mt-2"
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
