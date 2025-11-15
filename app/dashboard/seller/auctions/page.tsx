"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  CalendarRange,
  Gauge,
  Clock8,
  LineChart,
} from "lucide-react";

const dummyAuctions = [
  {
    id: 1,
    title: "Kohaku Premium #12",
    starts: "2025-03-12 09:00",
    ends: "2025-03-12 12:00",
    status: "Scheduled",
    items: 5,
  },
  {
    id: 2,
    title: "Showa Supreme",
    starts: "2025-03-10 19:00",
    ends: "2025-03-10 22:00",
    status: "Finished",
    items: 3,
  },
  {
    id: 3,
    title: "Sanke Auction Evening",
    starts: "2025-03-15 20:00",
    ends: "2025-03-15 23:00",
    status: "Pending",
    items: 4,
  },
];

const auctionRecap = [
  {
    id: 201,
    title: "Showa Supreme",
    date: "Mar 10, 2025",
    itemsSold: 3,
    bids: 38,
    participants: 14,
    snipingWinner: "bidder#2048",
    profit: 5800000,
  },
  {
    id: 188,
    title: "Kohaku Year End",
    date: "Dec 28, 2024",
    itemsSold: 4,
    bids: 52,
    participants: 19,
    snipingWinner: "bidder#1933",
    profit: 7200000,
  },
];

export default function SellerAuctionsPage() {
  const scheduledCount = dummyAuctions.filter(
    (auction) => auction.status === "Scheduled"
  ).length;
  const finishedCount = dummyAuctions.filter(
    (auction) => auction.status === "Finished"
  ).length;
  const upcomingTitle = dummyAuctions.find(
    (auction) => auction.status === "Scheduled"
  )?.title;
  const totalProfit = auctionRecap.reduce((sum, item) => sum + item.profit, 0);
  const totalBids = auctionRecap.reduce((sum, item) => sum + item.bids, 0);
  const totalParticipants = auctionRecap.reduce(
    (sum, item) => sum + item.participants,
    0
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Penjual • Event
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Manajemen Lelang</h1>
          <p className="text-sm text-muted-foreground">
            Pastikan jadwal dan lineup koi terbaik selalu konsisten sebelum live.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/seller/items">
              <CalendarRange className="size-4" />
              Kelola Item
            </a>
          </Button>

          <Button className="gap-2" asChild>
            <a href="/dashboard/seller/auctions/create">
              <Plus className="size-4" />
              Buat Lelang
            </a>
          </Button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-primary/10 text-primary p-2">
              <Gauge className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Lelang</p>
              <p className="text-2xl font-semibold">{dummyAuctions.length}</p>
              <p className="text-xs text-muted-foreground">
                Draft • Live • Selesai
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Clock8 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Terjadwal / Draft</p>
              <p className="text-2xl font-semibold">{scheduledCount}</p>
              <p className="text-xs text-muted-foreground">
                Selanjutnya: {upcomingTitle ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <CalendarRange className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Selesai</p>
              <p className="text-2xl font-semibold">{finishedCount}</p>
              <p className="text-xs text-muted-foreground">
                Cocok dianalisa & remarketing
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FINISHED AUCTION RECAP */}
      <Card className="rounded-2xl border">
        <CardHeader>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Rekap Lelang Selesai</CardTitle>
              <CardDescription>
                Ringkasan bid, peserta, dan profit tiap event
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary" className="rounded-full px-4 py-1">
                Total Profit · Rp {totalProfit.toLocaleString()}
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-1">
                {totalBids} bid · {totalParticipants} peserta
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {auctionRecap.map((recap) => (
            <div
              key={recap.id}
              className="rounded-2xl border p-4 space-y-3 hover:border-primary/40 transition"
            >
              <div className="flex flex-wrap items-center gap-2 justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    #{String(recap.id).padStart(4, "0")}
                  </p>
                  <p className="text-lg font-semibold">{recap.title}</p>
                </div>
                <div className="text-sm text-muted-foreground">{recap.date}</div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                    Jumlah Bid
                  </p>
                  <p className="text-xl font-semibold">{recap.bids}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                    Peserta
                  </p>
                  <p className="text-xl font-semibold">{recap.participants}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                    Pemenang Sniping
                  </p>
                  <p className="text-xl font-semibold">{recap.snipingWinner}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                    Profit
                  </p>
                  <p className="text-xl font-semibold text-green-600">
                    Rp {recap.profit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {auctionRecap.length === 0 && (
            <div className="rounded-2xl border-dashed border p-10 text-center text-sm text-muted-foreground">
              Belum ada rekap. Selesaikan lelang untuk melihat analitik.
            </div>
          )}
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Lelang Aktif & Lampau</CardTitle>
          <CardDescription>Aktivitas terbaru kamu</CardDescription>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {dummyAuctions.map((auction) => (
                <TableRow key={auction.id}>
                  <TableCell className="font-medium">
                    <div>{auction.title}</div>
                    <p className="text-xs text-muted-foreground">
                      #{String(auction.id).padStart(4, "0")}
                    </p>
                  </TableCell>

                  <TableCell className="text-sm">
                    <p>Mulai: {auction.starts}</p>
                    <p className="text-muted-foreground text-xs">
                      Selesai: {auction.ends}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        auction.status === "Finished"
                          ? "secondary"
                          : auction.status === "Pending"
                          ? "outline"
                          : "default"
                      }
                      className="rounded-full"
                    >
                      {auction.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{auction.items}</TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" aria-label="Lihat detail">
                      <Eye className="size-4" />
                    </Button>

                    <Button variant="ghost" size="icon" aria-label="Edit">
                      <Pencil className="size-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      aria-label="Hapus"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
