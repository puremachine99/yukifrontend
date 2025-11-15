"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "next-themes";

import { Bell, LogOut, Moon, Sun, User } from "lucide-react";

export function DashboardNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // 👇 SOLUSI WAJIB UNTUK HYDRATION
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="flex h-14 items-center gap-4 border-b px-4">
      <SidebarTrigger className="md:hidden" />

      <div className="font-medium text-sm truncate">
        {pathname.replace("/dashboard", "Dashboard").replace(/\//g, " / ")}
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* THEME TOGGLE (fix mismatch) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {!mounted ? (
            <div className="size-4" /> // placeholder untuk SSR
          ) : theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/notification">
            <Bell className="size-4" />
          </Link>
        </Button>

        {/* USER DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>YK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="size-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600">
              <LogOut className="size-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
