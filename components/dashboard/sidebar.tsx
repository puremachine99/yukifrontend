"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Home,
  Bell,
  User,
  Store,
  Tag,
  Package,
  Calendar,
  Wallet,
  Megaphone,
  History,
  Heart,
  MapPin,
  Star,
  ShoppingCart,
  Truck,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <Sidebar>
      {/* HEADER / LOGO */}
      <SidebarHeader>
        <div className="px-3 py-2 font-bold text-lg tracking-tight">
          YukiAuction
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* OVERVIEW */}
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={isActive("/dashboard")} asChild>
                  <Link href="/dashboard">
                    <Home className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* SELLER */}
        <SidebarGroup>
          <SidebarGroupLabel>Seller</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/seller/auctions")}
                  asChild
                >
                  <Link href="/dashboard/seller/auctions">
                    <Store className="size-4" />
                    <span>Auctions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/seller/items")}
                  asChild
                >
                  <Link href="/dashboard/seller/items">
                    <Package className="size-4" />
                    <span>Items</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/seller/orders")}
                  asChild
                >
                  <Link href="/dashboard/seller/orders">
                    <Tag className="size-4" />
                    <span>Orders</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/seller/events")}
                  asChild
                >
                  <Link href="/dashboard/seller/events">
                    <Calendar className="size-4" />
                    <span>Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/seller/balance")}
                  asChild
                >
                  <Link href="/dashboard/seller/balance">
                    <Wallet className="size-4" />
                    <span>Balance</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/seller/ads")}
                  asChild
                >
                  <Link href="/dashboard/seller/ads">
                    <Megaphone className="size-4" />
                    <span>Advertisements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* BIDDER */}
        <SidebarGroup>
          <SidebarGroupLabel>Bidder</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/bidder/history")}
                  asChild
                >
                  <Link href="/dashboard/bidder/history">
                    <History className="size-4" />
                    <span>History</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/bidder/wishlist")}
                  asChild
                >
                  <Link href="/dashboard/bidder/wishlist">
                    <Heart className="size-4" />
                    <span>Wishlist</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/bidder/cart")}
                  asChild
                >
                  <Link href="/dashboard/bidder/cart">
                    <ShoppingCart className="size-4" />
                    <span>Cart</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/bidder/addresses")}
                  asChild
                >
                  <Link href="/dashboard/bidder/addresses">
                    <MapPin className="size-4" />
                    <span>Addresses</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/bidder/reviews")}
                  asChild
                >
                  <Link href="/dashboard/bidder/reviews">
                    <Star className="size-4" />
                    <span>Reviews</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/bidder/shipments")}
                  asChild
                >
                  <Link href="/dashboard/bidder/shipments">
                    <Truck className="size-4" />
                    <span>Shipments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* GENERAL */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/notification")}
                  asChild
                >
                  <Link href="/dashboard/notification">
                    <Bell className="size-4" />
                    <span>Notifications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isActive("/dashboard/profile")}
                  asChild
                >
                  <Link href="/dashboard/profile">
                    <User className="size-4" />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="text-xs text-center py-2 opacity-50">
          YukiAuction © 2025
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
