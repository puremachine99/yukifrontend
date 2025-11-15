"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { LandingNavbar } from "@/components/landing/navbar";

const highlights = [
  {
    title: "Lelang Kurasi",
    description: "Event mingguan dengan koi pilihan breeder Jepang & lokal.",
  },
  {
    title: "Monitoring Realtime",
    description: "Pantau 6 lot sekaligus, titip atau bundel kiriman satu klik.",
  },
  {
    title: "Settlement Aman",
    description: "Escrow, payout, dan bukti pengiriman otomatis terdokumentasi.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-24 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">
              Ekosistem Lelang Koi
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Lelang koi premium yang rapi, cepat, dan transparan.
            </h1>
            <p className="text-base text-white/80">
              Kelola lelang, pantau bid, tetapkan titip atau kirim langsung, dan simpan
              seluruh bukti pengiriman tanpa harus masuk chat yang bising. Semua langkah
              tercatat otomatis.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">Buat Akun</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/auction">Jadwal Lelang</Link>
              </Button>
            </div>
          </div>

          <div className="flex-1 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="space-y-4">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-white/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 space-y-8">
        <div className="flex flex-col gap-3 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Eksplorasi
          </p>
          <h2 className="text-3xl font-semibold">Semua alur kerja di satu platform</h2>
          <p className="text-sm text-muted-foreground">
            Penjual, bidder, atau kolektor bebas pindah mode tanpa memulai dari nol.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Konsol Penjual</CardTitle>
              <CardDescription>Lelang, stok, payout, laporan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Jadwalkan event, kunci lot SOLD, dan pantau dana masuk realtime.</p>
              <Button className="w-full" asChild>
                <Link href="/dashboard/seller/auctions">Masuk Konsol Penjual</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Ruang Bidder</CardTitle>
              <CardDescription>Wishlist, monitoring, pengiriman.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Pantau 6 lot sekaligus, pilih titip atau kirim, semua bukti tersimpan.</p>
              <Button className="w-full" variant="secondary" asChild>
                <Link href="/dashboard/bidder/wishlist">Masuk Ruang Bidder</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Marketplace</CardTitle>
              <CardDescription>Semua koi dari lelang aktif.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>Pilah berdasarkan variasi, ukuran, atau breeder favorit sebelum bid.</p>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/market">Kunjungi Market</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Sponsor Bulan Ini",
              desc: "Dainichi Koi Farm mendukung event Musim Semi.",
            },
            {
              title: "Rating Pengguna",
              desc: "9,4/10 dari 2.300 transaksi sukses di 2024.",
            },
            {
              title: "Komunitas",
              desc: "Gathering offline & forum tips perawatan koi eksklusif.",
            },
          ].map((highlight) => (
            <Card key={highlight.title} className="rounded-2xl border bg-muted/40">
              <CardHeader>
                <CardTitle>{highlight.title}</CardTitle>
                <CardDescription>{highlight.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Testimoni Komunitas</CardTitle>
            <CardDescription>Feedback langsung dari penjual & bidder aktif.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              “Monitoring board bikin saya bisa fokus analisa tanpa harus hadir di live
              room.” — Bidder #2210
            </p>
            <p>
              “Semua catatan payout dan bukti pengiriman terarsip otomatis, tinggal klik
              ekspor.” — Seller Koi Nusantara
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
