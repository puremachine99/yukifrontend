"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LandingNavbar } from "@/components/landing/navbar";

const liveLots = [
  {
    id: 6001,
    title: "Kohaku Ginrin 72cm",
    sponsor: "Dainichi",
    timer: "00:03:12",
    bid: 5200000,
    increment: 250000,
    latestBidder: "bidder#2048",
    img: "/placeholder.svg",
  },
  {
    id: 6002,
    title: "Showa Sanshoku 60cm",
    sponsor: null,
    timer: "00:08:41",
    bid: 4100000,
    increment: 200000,
    latestBidder: "bidder#3320",
    img: "/placeholder.svg",
  },
  {
    id: 6003,
    title: "Tancho Premium 55cm",
    sponsor: null,
    timer: "00:01:55",
    bid: 3600000,
    increment: 150000,
    latestBidder: "bidder#2990",
    img: "/placeholder.svg",
  },
  {
    id: 6004,
    title: "Sanke High Quality 62cm",
    sponsor: "Sakai",
    timer: "00:05:25",
    bid: 3950000,
    increment: 200000,
    latestBidder: "bidder#1801",
    img: "/placeholder.svg",
  },
];

export default function LiveAuctionPage() {
  const [search, setSearch] = useState("");
  const filteredLots = liveLots.filter((lot) =>
    lot.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <section className="border-b bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Live Auction Board
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Semua koi aktif disortir otomatis
            </h1>
            <p className="text-sm text-muted-foreground">
              Algoritma hype menampilkan lot bersponsor di atas, diikuti koi dengan bid
              tertinggi dan penonton terbanyak.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/auction">Kembali ke Jadwal</Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        <Card className="rounded-2xl">
          <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between py-5">
            <Input
              placeholder="Cari koi / breeder / sponsor…"
              className="lg:w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Live viewer tersinkron otomatis setiap 5 detik (mock UI).
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredLots.map((lot) => (
            <Card key={lot.id} className="rounded-2xl border">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{lot.title}</CardTitle>
                  {lot.sponsor && (
                    <Badge variant="secondary" className="rounded-full">
                      Sponsor {lot.sponsor}
                    </Badge>
                  )}
                </div>
                <CardDescription>Lot #{lot.id}</CardDescription>
                <p className="text-xs text-muted-foreground">
                  Timer: {lot.timer} • Increment Rp {lot.increment.toLocaleString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl overflow-hidden border bg-muted/40">
                  <img src={lot.img} alt={lot.title} className="h-40 w-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Bid tertinggi</span>
                  <span className="font-semibold">Rp {lot.bid.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Bidder terakhir</span>
                  <span>{lot.latestBidder}</span>
                </div>
                <Button className="w-full">Masuk & Bid Sekarang</Button>
              </CardContent>
            </Card>
          ))}

          {filteredLots.length === 0 && (
            <Card className="col-span-full rounded-2xl border-dashed border p-12 text-center text-sm text-muted-foreground">
              Tidak ada lot yang cocok dengan pencarian.
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
