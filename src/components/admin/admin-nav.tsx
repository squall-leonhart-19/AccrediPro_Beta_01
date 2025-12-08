"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  MessageSquare,
  Bell,
  Shield,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/communications", label: "Communications", icon: Mail },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = session?.user;
  const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() || "A";

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
            <p className="text-xs text-gold-400">Admin Panel</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 shadow-lg shadow-gold-500/10 border border-gold-400/20"
                    : "text-burgundy-100 hover:bg-burgundy-600/50 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-burgundy-300")} />
                {item.label}
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                )}
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-burgundy-600/30">
            <p className="px-4 py-2 text-xs font-semibold text-gold-400 uppercase tracking-wider">
              Switch View
            </p>
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-burgundy-100 hover:bg-burgundy-600/50 hover:text-white transition-all duration-150"
            >
              <LayoutDashboard className="w-5 h-5 text-burgundy-300" />
              Student View
            </Link>
          </div>
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
              <p className="text-xs text-burgundy-300 truncate">Administrator</p>
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
          <Link href="/admin" className="flex items-center gap-2">
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
            <span className="font-bold text-white">Admin</span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="text-burgundy-200 hover:text-white hover:bg-burgundy-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-burgundy-900 pt-16">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-gold-400/20 to-gold-500/10 text-gold-300 border border-gold-400/20"
                      : "text-burgundy-100 hover:bg-burgundy-800"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-gold-400" : "text-burgundy-300")} />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-burgundy-700">
              <p className="px-4 py-2 text-xs font-semibold text-gold-400 uppercase tracking-wider">
                Switch View
              </p>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-burgundy-100 hover:bg-burgundy-800"
              >
                <LayoutDashboard className="w-5 h-5 text-burgundy-300" />
                Student View
              </Link>
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
                  <p className="text-sm text-burgundy-300">Administrator</p>
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
