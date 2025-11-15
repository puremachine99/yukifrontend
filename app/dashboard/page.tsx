import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Package, ShoppingBag, Wallet, ArrowRight, ShieldCheck } from "lucide-react";

const summary = [
  {
    title: "Total Lelang",
    value: "12",
    desc: "Aktif + selesai",
    icon: Sparkles,
  },
  { title: "Item Aktif", value: "48", desc: "Siap tayang", icon: Package },
  { title: "Pesanan", value: "7", desc: "Perlu update", icon: ShoppingBag },
  { title: "Saldo Siap Tarik", value: "Rp 3.200.000", desc: "Menunggu payout", icon: Wallet },
];

const aktivitas = [
  "Bidder #3201 memenangkan \"Kohaku Supreme\" (Rp 3.7M)",
  "Kamu mengubah status Showa Rising Star menjadi READY",
  "Payout Rp 5M ke BCA ****090 telah selesai",
];

const todoList = [
  { label: "Upload bukti packing Tancho Premium", due: "Hari ini" },
  { label: "Setujui permintaan titip bidder #2990", due: "2 jam lagi" },
];

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl border bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">Ringkasan</p>
          <h1 className="text-2xl font-semibold leading-tight">
            Selamat datang kembali, dashboard kamu siap untuk lelang malam ini.
          </h1>
          <p className="text-sm text-white/70">
            Pastikan lot sudah terkunci sebelum jadwal mulai. Aktivitas terbaru tampil di bawah.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2" asChild>
            <a href="/dashboard/seller/auctions">
              Kelola Lelang
              <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button variant="outline" className="text-white border-white/40" asChild>
            <a href="/dashboard/seller/balance">Lihat Saldo</a>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {summary.map((card) => (
          <Card key={card.title} className="rounded-2xl border">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <card.icon className="size-4 text-muted-foreground" />
                {card.title}
              </CardTitle>
              <CardDescription>{card.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Dari lelang, payout, dan pembaruan status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aktivitas.map((item, idx) => (
              <div key={idx} className="rounded-2xl border bg-muted/40 px-4 py-3 text-sm">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Tugas Segera</CardTitle>
            <CardDescription>Prioritas sebelum live malam ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            {todoList.map((todo) => (
              <div key={todo.label} className="rounded-xl border px-3 py-2 flex items-center justify-between gap-3">
                <span>{todo.label}</span>
                <Badge variant="secondary">{todo.due}</Badge>
              </div>
            ))}
            <div className="rounded-xl border bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Semua bukti pengiriman wajib diupload dalam 12 jam setelah pickup.
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle>Transaksi Terkini</CardTitle>
          <CardDescription>Penjualan dan payout 7 hari terakhir.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {[
            { label: "Penjualan Showa Champion", amount: "+ Rp 3.100.000", status: "Settlement" },
            { label: "Payout ke BCA ****090", amount: "- Rp 5.000.000", status: "Completed" },
            { label: "Titip bidder #2990 (DP)", amount: "+ Rp 1.200.000", status: "Hold" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between rounded-xl border px-4 py-3"
            >
              <div>
                <p className="font-semibold">{row.label}</p>
                <p className="text-xs text-muted-foreground">{row.status}</p>
              </div>
              <p className="font-semibold">{row.amount}</p>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2" asChild>
            <a href="/dashboard/seller/balance">Lihat Detail Laporan</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
