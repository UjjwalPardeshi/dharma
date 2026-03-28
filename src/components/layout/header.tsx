"use client";

import { signOut } from "next-auth/react";
import { Menu, Sparkles, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/stores/ui-store";
import { Session } from "next-auth";
import Link from "next/link";

interface HeaderProps {
  session: Session | null;
}

export function Header({ session }: HeaderProps) {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/chat" className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-display text-lg font-semibold text-foreground">
            Divya Gyan
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {session?.user && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {session.user.name || session.user.email}
              </span>
              <div className="group relative">
                <button className="rounded-full w-9 h-9 bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <User className="h-5 w-5 text-primary" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted first:rounded-t-lg"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <button
                    onClick={() => signOut({ redirectTo: "/login" })}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted last:rounded-b-lg"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => toggleSidebar()}
            className="md:hidden p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
