"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
  Bell,
  GraduationCap,
  Settings,
  Shield,
  Send,
  Library,
} from "lucide-react";
import { useState, useTransition } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/courses", label: "Course Catalog", icon: Library },
  { href: "/community", label: "Community", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/mentorship", label: "My Coach", icon: GraduationCap },
  { href: "/certificates", label: "Certificates", icon: Award },
  { href: "/profile", label: "Profile", icon: User },
];

const adminNavItems = [
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "User Management", icon: Shield },
  { href: "/admin/analytics", label: "Analytics", icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const user = session?.user;
  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  const isAdmin = user?.role === "ADMIN";

  const handleNavigation = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
    setMobileMenuOpen(false);
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
            <Button variant="ghost" size="icon" className="text-burgundy-200 hover:text-white hover:bg-burgundy-700">
              <Bell className="w-5 h-5" />
            </Button>
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
