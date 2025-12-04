"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { CalendarRange, Clock8, Gauge, Pencil, Plus, Trash2 } from "lucide-react";

import { useAuthSession } from "@/hooks/use-auth-session";
import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import { CancelError } from "@/lib/api-client/core/CancelablePromise";

interface SellerAuction {
  id: number;
  title: string;
  description?: string | null;
  bannerUrl?: string | null;
  status?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  itemCount?: number | null;
  createdAt?: string | null;
  totalBids?: number | null;
  participants?: number | null;
  winner?: string | null;
  profit?: number | null;
}

const normalizeAuctions = (payload: unknown): SellerAuction[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as SellerAuction[];
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as SellerAuction[];
    if (Array.isArray(record.items)) return record.items as SellerAuction[];
    if (Array.isArray(record.results)) return record.results as SellerAuction[];
  }
  return [];
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "TBD";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const badgeVariantForStatus = (status?: string | null) => {
  const normalized = (status ?? "").toLowerCase();
  if (["draft", "pending"].includes(normalized)) return "outline" as const;
  if (normalized === "scheduled") return "secondary" as const;
  if (normalized === "finished") return "default" as const;
  return "default" as const;
};

export default function SellerAuctionsPage() {
  const { accessToken } = useAuthSession();
  const [auctions, setAuctions] = useState<SellerAuction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setAuctions([]);
      setError("Butuh sesi masuk untuk memuat daftar lelang.");
      return;
    }

    configureApiClient(accessToken);
    setIsLoading(true);
    setError(null);

    const request = AuctionService.auctionControllerFindAll();

    request
      .then((response) => {
        const normalized = normalizeAuctions(response);
        setAuctions(normalized);
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setError(err instanceof Error ? err.message : "Tidak dapat memuat lelang.");
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (typeof request.cancel === "function") {
        request.cancel();
      }
    };
  }, [accessToken]);

  const sortedAuctions = useMemo(() => {
    return [...auctions].sort((a, b) => {
      const dateA = new Date(a.createdAt ?? a.startsAt ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? b.startsAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [auctions]);

  const scheduledCount = useMemo(
    () =>
      sortedAuctions.filter((auction) => {
        const status = (auction.status ?? "").toLowerCase();
        return ["draft", "pending", "scheduled"].includes(status);
      }).length,
    [sortedAuctions]
  );

  const completedAuctions = useMemo(
    () =>
      sortedAuctions.filter((auction) => {
        const status = (auction.status ?? "").toLowerCase();
        return ["finished", "completed", "settled"].includes(status);
      }),
    [sortedAuctions]
  );

  const totalProfit = useMemo(
    () => completedAuctions.reduce((sum, entry) => sum + (entry.profit ?? 0), 0),
    [completedAuctions]
  );

  const totalBids = useMemo(
    () => completedAuctions.reduce((sum, entry) => sum + (entry.totalBids ?? 0), 0),
    [completedAuctions]
  );

  const totalParticipants = useMemo(
    () => completedAuctions.reduce((sum, entry) => sum + (entry.participants ?? 0), 0),
    [completedAuctions]
  );

  const handleDelete = async (auctionId: number) => {
    if (!accessToken) {
      toast.error("Butuh sesi masuk untuk menghapus lelang.");
      return;
    }

    const confirmed = window.confirm("Hapus lelang ini? Tindakan tidak dapat dibatalkan.");
    if (!confirmed) return;

    try {
      configureApiClient(accessToken);
      await AuctionService.auctionControllerRemove(String(auctionId));
      toast.success("Lelang dihapus.");
      setAuctions((prev) => prev.filter((auction) => auction.id !== auctionId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menghapus lelang.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Penjual • Lelang</p>
          <h1 className="text-2xl font-semibold tracking-tight">Lelang Saya</h1>
          <p className="text-sm text-muted-foreground">Kelola draft, jadwal, dan sesi live yang sudah selesai.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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

      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-primary/10 text-primary p-2">
              <Gauge className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Lelang</p>
              <p className="text-2xl font-semibold">{sortedAuctions.length}</p>
              <p className="text-xs text-muted-foreground">Draft • Scheduled • Live • Selesai</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6 flex items-start gap-3">
            <div className="rounded-full bg-muted p-2">
              <Clock8 className="size-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Menunggu Launch</p>
              <p className="text-2xl font-semibold">{scheduledCount}</p>
              <p className="text-xs text-muted-foreground">Draft & Scheduled</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardContent className="pt-6">
            <CardTitle className="text-sm mb-2">Ringkasan</CardTitle>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Total Bids: {totalBids.toLocaleString("id-ID")}</p>
              <p>Participants: {totalParticipants.toLocaleString("id-ID")}</p>
              <p>Estimasi Profit: Rp {totalProfit.toLocaleString("id-ID")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Daftar Lelang</CardTitle>
          <CardDescription>
            Urutan otomatis berdasarkan tanggal dibuat terbaru. Klik judul untuk mengelola detail.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading && sortedAuctions.length === 0 ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Spinner className="size-6" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Mulai</TableHead>
                  <TableHead>Selesai</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAuctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell>
                      <div className="font-semibold">{auction.title}</div>
                      <p className="text-xs text-muted-foreground">
                        Dibuat {formatDateTime(auction.createdAt)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={badgeVariantForStatus(auction.status)}>
                        {auction.status ?? "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(auction.startsAt ?? auction.startTime)}</TableCell>
                    <TableCell>{formatDateTime(auction.endsAt ?? auction.endTime)}</TableCell>
                    <TableCell>{auction.itemCount ?? 0}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Link href={`/dashboard/seller/auctions/${auction.id}`} className="inline-flex">
                        <Button variant="outline" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDelete(auction.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
