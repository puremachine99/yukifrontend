"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LandingNavbar } from "@/components/landing/navbar";

const upcomingAuctions = [
  {
    id: "AUC-402",
    title: "Festival Kohaku Musim Semi",
    date: "20 Maret • 19.00 WIB",
    lots: 24,
    status: "Preview Dibuka",
    sponsor: "Dainichi Koi Farm",
  },
  {
    id: "AUC-399",
    title: "Showa Rising Star",
    date: "25 Maret • 20.00 WIB",
    lots: 18,
    status: "Draft Kurasi",
    sponsor: "Izumiya",
  },
];

const liveHighlights = [
  {
    id: 501,
    title: "Kohaku Ginrin 72cm",
    sponsor: true,
    bid: 5200000,
    viewers: 132,
    img: "/placeholder.svg",
  },
  {
    id: 502,
    title: "Showa Sanshoku 60cm",
    sponsor: false,
    bid: 4100000,
    viewers: 98,
    img: "/placeholder.svg",
  },
  {
    id: 503,
    title: "Tancho Premium 55cm",
    sponsor: false,
    bid: 3600000,
    viewers: 76,
    img: "/placeholder.svg",
  },
];

export default function AuctionLandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <section className="border-b bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Jadwal Lelang
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">
            Kalendar lelang koi eksklusif
          </h1>
          <p className="text-sm text-muted-foreground">
            Semua lelang menggunakan algoritma promosi otomatis. Sponsor ditampilkan di
            atas live feed agar bidder langsung melihat lot unggulan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/login">Masuk untuk Bid</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/signup">Daftar Penjual</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/auction/live">Buka Live Auction</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Lelang Terdekat</h2>
          <Button variant="ghost" asChild>
            <Link href="/dashboard/seller/auctions">Kelola Event</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {upcomingAuctions.map((auction) => (
            <Card key={auction.id} className="rounded-2xl border">
              <CardHeader className="pb-2 space-y-1">
                <Badge variant="secondary" className="w-fit rounded-full">
                  {auction.status}
                </Badge>
                <CardTitle>{auction.title}</CardTitle>
                <CardDescription>{auction.date}</CardDescription>
                <p className="text-xs text-muted-foreground">
                  Sponsor: {auction.sponsor}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Total lot kurasi</span>
                  <span className="font-semibold">{auction.lots}</span>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1">Lihat Lot</Button>
                  <Button className="flex-1" variant="outline">
                    Ingatkan Saya
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-6xl px-6 py-16 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Live Auction Feed
              </p>
              <h2 className="text-2xl font-semibold">
                Semua koi live disortir oleh algoritma hype
              </h2>
            </div>
            <Button asChild>
              <Link href="/auction/live">Buka Halaman Live</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {liveHighlights.map((item) => (
              <Card key={item.id} className="rounded-2xl border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                    {item.sponsor && (
                      <Badge variant="outline" className="rounded-full">
                        Sponsor
                      </Badge>
                    )}
                  </div>
                  <CardDescription>Lot #{item.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-xl border bg-muted/40 overflow-hidden">
                    <img src={item.img} alt={item.title} className="h-36 w-full object-cover" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Bid tertinggi</span>
                    <span className="font-semibold">Rp {item.bid.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.viewers} penonton sedang memantau lot ini.
                  </p>
                  <Button className="w-full" variant={item.sponsor ? "secondary" : "default"}>
                    Masuk ke Live Room
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
