"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, Trophy, UserCheck, Sparkles } from "lucide-react";

export default function ProfilePage() {
  // Dummy UI-only user data
  const user = {
    name: "John Auctioneer",
    email: "john@example.com",
    avatar: "",
    location: "Indonesia",
    joinDate: "April 2024",
  };

  const initials = user.name
    .split(" ")
    .map((v) => v[0])
    .join("");

  const stats = {
    auctionsCreated: 14,
    itemsSold: 22,
    bidsPlaced: 48,
    wonAuctions: 6,
    sellerRating: 4.7,
  };

  const recentAuctions = [
    { title: "Kohaku Jumbo #21", status: "Finished", bids: 12 },
    { title: "Showa Female Supreme", status: "Finished", bids: 8 },
    { title: "Sanke High Quality", status: "Pending", bids: 0 },
  ];

  const recentWins = [
    { title: "Doitsu Platinum", amount: "Rp 2.350.000", date: "1 week ago" },
    { title: "Asagi 35cm", amount: "Rp 1.200.000", date: "2 weeks ago" },
  ];

  const achievements = [
    { name: "Trusted Seller", icon: Trophy },
    { name: "Fast Responder", icon: Trophy },
    { name: "Top 10 Seller", icon: Trophy },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* PROFILE HERO */}
      <Card className="rounded-3xl border bg-card">
        <div className="px-6 py-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24 border border-border rounded-2xl">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-semibold uppercase">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Seller Profile
              </p>
              <h1 className="text-2xl font-semibold leading-tight">
                {user.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{user.email}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  {user.location}
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" className="gap-2">
              <UserCheck className="size-4" />
              View Public Profile
            </Button>
            <Button className="gap-2">
              <Sparkles className="size-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4 px-6 py-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
              Seller Rating
            </p>
            <div className="flex items-center gap-2 mt-2 text-2xl font-semibold">
              <Star className="size-5 text-yellow-400" />
              {stats.sellerRating}
            </div>
            <p className="text-xs text-muted-foreground">
              Consistent response time & shipping
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
              Auctions Created
            </p>
            <p className="mt-2 text-2xl font-semibold">
              {stats.auctionsCreated}
            </p>
            <p className="text-xs text-muted-foreground">
              Draft + live events this year
            </p>
          </div>

          <div className="rounded-2xl border bg-muted/40 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
              Items Sold
            </p>
            <p className="mt-2 text-2xl font-semibold">{stats.itemsSold}</p>
            <p className="text-xs text-muted-foreground">
              Across all categories
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="auctions">Auctions</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-2xl lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle>Performance Snapshot</CardTitle>
                <CardDescription>Seller + bidder journey</CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Bids Placed</p>
                  <p className="text-2xl font-semibold">{stats.bidsPlaced}</p>
                  <p className="text-xs text-muted-foreground">
                    Active engagement across live auctions
                  </p>
                </div>

                <div className="rounded-2xl border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Auctions Won
                  </p>
                  <p className="text-2xl font-semibold">{stats.wonAuctions}</p>
                  <p className="text-xs text-muted-foreground">
                    Buyers trust your bids
                  </p>
                </div>

                <div className="rounded-2xl border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Active Listings
                  </p>
                  <p className="text-2xl font-semibold">{recentAuctions.length}</p>
                  <p className="text-xs text-muted-foreground">
                    Draft + pending approval
                  </p>
                </div>

                <div className="rounded-2xl border p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Live Alerts</p>
                  <p className="text-2xl font-semibold">02</p>
                  <p className="text-xs text-muted-foreground">
                    Auctions starting soon
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle>Recent Wins</CardTitle>
                <CardDescription>Auctions you secured</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentWins.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-center justify-between rounded-2xl border p-4"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.date}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{item.amount}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle>Recent Auctions</CardTitle>
              <CardDescription>Your latest created auctions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAuctions.map((auction) => (
                <div
                  key={auction.title}
                  className="flex flex-col gap-2 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">{auction.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {auction.bids} bids
                    </p>
                  </div>
                  <Badge
                    variant={
                      auction.status === "Finished" ? "secondary" : "outline"
                    }
                    className="rounded-full px-3 py-1"
                  >
                    {auction.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AUCTIONS TAB */}
        <TabsContent value="auctions" className="space-y-4">
          {recentAuctions.map((auction) => (
            <Card key={auction.title} className="rounded-2xl">
              <CardContent className="flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-semibold">{auction.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {auction.bids} bids total
                  </p>
                </div>
                <Badge className="rounded-full px-3 py-1">{auction.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ITEMS TAB */}
        <TabsContent value="items">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle>Your Items</CardTitle>
              <CardDescription>Items you listed or sold</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border p-4 space-y-1">
                  <p className="font-semibold">Item #{i}</p>
                  <p className="text-xs text-muted-foreground">Status: Sold</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACHIEVEMENTS TAB */}
        <TabsContent value="achievements">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your profile badges</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {achievements.map((a) => (
                <Badge
                  key={a.name}
                  variant="secondary"
                  className="rounded-2xl px-4 py-2 flex items-center gap-2"
                >
                  <a.icon className="size-4" />
                  {a.name}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update user information (UI only)</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon…</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
