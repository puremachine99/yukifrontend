"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

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

import { Bell, Loader2, LogOut, Moon, Sun, User } from "lucide-react";
import { useAuthSession } from "@/hooks/use-auth-session";
import { clearAuthSession } from "@/lib/api/auth";
import { configureApiClient } from "@/lib/api-client/configure";
import type { CancelablePromise } from "@/lib/api-client/core/CancelablePromise";
import { NotificationService } from "@/lib/api-client/services/NotificationService";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export function DashboardNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const { displayName, initials, user, isAuthenticated, accessToken } = useAuthSession();

  type Notification = {
    id: number;
    message: string;
    type: string;
    data?: Record<string, unknown> | null;
    isRead: boolean;
    createdAt: string;
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [socketLoading, setSocketLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fetchRequest = useRef<CancelablePromise<any> | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // 👇 SOLUSI WAJIB UNTUK HYDRATION
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }
    configureApiClient(accessToken);
    setLoadingNotif(true);
    fetchRequest.current = NotificationService.notificationControllerGetUserNotifications();
    fetchRequest.current
      .then((res: Notification[]) => setNotifications(res ?? []))
      .catch(() => {
        toast.error("Gagal memuat notifikasi");
      })
      .finally(() => setLoadingNotif(false));

    return () => {
      fetchRequest.current?.cancel?.();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocketLoading(true);
    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
    ).replace(/\/$/, "");
    const wsHost = baseUrl.replace(/^http/, "ws");
    const socket = io(`${wsHost}/notification`, {
      transports: ["websocket"],
      auth: { token: accessToken },
    });
    socketRef.current = socket;

    socket.on("connect", () => setSocketLoading(false));
    socket.on("notification:new", (payload: Notification) => {
      if (!payload) return;
      setNotifications((prev) => [payload, ...prev].slice(0, 50));
      toast.success(payload.message);
    });
    socket.on("error", () => setSocketLoading(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [isAuthenticated, accessToken]);

  const markAllAsRead = () => {
    if (!notifications.length) return;
    NotificationService.notificationControllerMarkAllAsRead().catch(() => {
      toast.error("Gagal menandai semua sebagai terbaca");
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    NotificationService.notificationControllerPatchRead(String(id)).catch(() => {
      toast.error("Gagal menandai notifikasi");
    });
  };

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
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {!mounted ? (
            <div className="size-4" /> // placeholder untuk SSR
          ) : theme === "dark" ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </Button>

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              {socketLoading && (
                <Loader2 className="absolute -left-2 -bottom-2 size-3 animate-spin text-muted-foreground" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-auto p-0">
            <div className="flex items-center justify-between px-3 py-2 border-b">
              <div>
                <p className="text-sm font-semibold">Notifikasi</p>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0 ? `${unreadCount} belum dibaca` : "Up to date"}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
                Tandai semua
              </Button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loadingNotif ? (
                <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Memuat notifikasi...
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted-foreground">
                  Belum ada notifikasi.
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    className={`flex w-full flex-col gap-1 border-b px-3 py-3 text-left transition hover:bg-muted/50 ${
                      n.isRead ? "bg-transparent" : "bg-muted/30"
                    }`}
                    onClick={() => handleMarkAsRead(n.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {n.type.replace(/_/g, " ")}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{n.message}</span>
                  </button>
                ))
              )}
            </div>
            <div className="border-t px-3 py-2 text-right">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/notification">Lihat semua</Link>
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="hidden flex-col items-end text-right sm:flex">
          <span className="truncate font-semibold text-foreground max-w-[140px]">
            {isAuthenticated ? displayName || "User" : "Guest"}
          </span>

          {/* Optional: boleh tampilin hint kecil kalo mau */}
          {!isAuthenticated && (
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Not signed in
            </span>
          )}
        </div>

        {/* USER DROPDOWN */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>{initials ?? "YK"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                {displayName ?? "YukiAuction user"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email ?? "No email stored"}
              </p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/80">
                {isAuthenticated ? "Session active" : "Guest view"}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="size-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              asChild
            >
              <button
                type="button"
                className="flex w-full items-center gap-2"
                onClick={() => {
                  clearAuthSession();
                  router.push("/login");
                }}
              >
                <LogOut className="size-4 mr-2" />
                Logout
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
