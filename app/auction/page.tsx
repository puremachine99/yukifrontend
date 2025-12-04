"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { LandingNavbar } from "@/components/landing/navbar";

import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import { CancelError } from "@/lib/api-client/core/CancelablePromise";

type PublicAuction = {
  id: number;
  title: string;
  description?: string | null;
  bannerUrl?: string | null;
  status?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  user?: { id?: number; name?: string | null };
  items?: Array<{
    id: number;
    itemId: number;
    item?: {
      id?: number;
      name?: string;
      variety?: string;
      media?: Array<{ url?: string | null }>;
    };
    openBid?: number;
    increment?: number;
    buyNow?: number | null;
    bids?: Array<{ amount?: number }>;
  }>;
};

const normalizeAuctions = (payload: unknown): PublicAuction[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as PublicAuction[];
  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as PublicAuction[];
    if (Array.isArray(record.items)) return record.items as PublicAuction[];
    if (Array.isArray(record.results)) return record.results as PublicAuction[];
  }
  return [];
};

const formatDateTime = (value?: string | null) => {
  if (!value) return "Jadwal belum ditentukan";
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

export default function AuctionLandingPage() {
  const [auctions, setAuctions] = useState<PublicAuction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    configureApiClient();
    setIsLoading(true);
    setError(null);

    const request = AuctionService.auctionControllerGetAllPublicAuctions();
    request
      .then((response) => {
        setAuctions(normalizeAuctions(response));
      })
      .catch((err) => {
        if (err instanceof CancelError) return;
        setError(
          err instanceof Error
            ? err.message
            : "Tidak dapat memuat jadwal lelang."
        );
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (typeof request.cancel === "function") {
        request.cancel();
      }
    };
  }, []);

  const upcomingAuctions = useMemo(() => {
    return [...auctions].sort((a, b) => {
      const dateA = new Date(a.startTime ?? 0).getTime();
      const dateB = new Date(b.startTime ?? 0).getTime();
      return dateA - dateB;
    });
  }, [auctions]);

  const spotlightLots = useMemo(() => {
    return upcomingAuctions
      .flatMap((auction) =>
        (auction.items ?? []).map((lot) => ({
          auctionId: auction.id,
          auctionTitle: auction.title,
          lot,
        }))
      )
      .slice(0, 3);
  }, [upcomingAuctions]);

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
            Seluruh jadwal di bawah ini berasal langsung dari sistem Yukiauction.
            Klik salah satu event untuk melihat lineup koi yang akan tayang.
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

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="size-8" />
        </div>
      ) : error ? (
        <div className="mx-auto max-w-3xl px-6 py-6">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      ) : (
        <>
        <section className="mx-auto max-w-5xl px-6 py-16 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Lelang Terdekat</h2>
            <Button variant="ghost" asChild>
              <Link href="/dashboard/seller/auctions">Kelola Event</Link>
            </Button>
          </div>

          {upcomingAuctions.length === 0 ? (
            <div className="rounded-2xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
              Belum ada jadwal publik saat ini. Coba cek halaman ini beberapa saat lagi.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {upcomingAuctions.map((auction) => (
                <Card key={auction.id} className="rounded-2xl border">
                  <CardHeader className="pb-2 space-y-1">
                    <Badge variant="secondary" className="w-fit rounded-full uppercase tracking-widest">
                      {auction.status ?? "Draft"}
                    </Badge>
                    <CardTitle>{auction.title}</CardTitle>
                    <CardDescription>
                      {formatDateTime(auction.startTime)} • {auction.user?.name ?? "Anonim"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Jumlah lot</span>
                      <span className="font-semibold">{auction.items?.length ?? 0}</span>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1" asChild>
                        <Link href={`/auction/${auction.id}`}>Detail Jadwal</Link>
                      </Button>
                      <Button className="flex-1" variant="outline" asChild>
                        <Link href={`/auction/${auction.id}#lots`}>Lihat Lot</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="border-t bg-muted/20">
          <div className="mx-auto max-w-6xl px-6 py-16 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Spotlight Lots
                </p>
                <h2 className="text-2xl font-semibold">
                  Koi unggulan dari jadwal mendatang
                </h2>
              </div>
              <Button asChild>
                <Link href="/auction/live">Buka Halaman Live</Link>
              </Button>
            </div>

            {spotlightLots.length === 0 ? (
              <div className="rounded-2xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
                Belum ada lot ter-highlight. Lihat jadwal di atas untuk informasi lebih lanjut.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                {spotlightLots.map(({ auctionId, auctionTitle, lot }) => {
                  const image =
                    lot.item?.media?.find((media) => media?.url)?.url ??
                    "/placeholder.svg";
                  const bids = lot.bids ?? [];
                  const highestBid =
                    bids.length > 0
                      ? Math.max(...bids.map((b) => Number(b.amount ?? 0)))
                      : Number(lot.openBid ?? 0);
                  const totalBids = bids.length;
                  return (
                    <Card key={`${auctionId}-${lot.itemId}`} className="rounded-2xl border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base truncate">
                            {lot.item?.name ?? `Lot #${lot.itemId}`}
                          </CardTitle>
                          <Badge variant="outline" className="rounded-full">
                            {lot.item?.variety ?? "Varietas"}
                          </Badge>
                        </div>
                        <CardDescription className="truncate">
                          {auctionTitle}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="rounded-xl border overflow-hidden bg-muted/40">
                          <img
                            src={image}
                            alt={lot.item?.name ?? "Koi"}
                            className="h-36 w-full object-cover"
                          />
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Open bid</span>
                            <span>Rp {Number(lot.openBid ?? 0).toLocaleString("id-ID")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Highest bid</span>
                            <span>Rp {highestBid.toLocaleString("id-ID")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total bids</span>
                            <span>{totalBids}</span>
                          </div>
                        </div>
                        <Button className="w-full" asChild>
                          <Link href={`/auction/${auctionId}/${lot.itemId}`}>
                            Masuk Live Room
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
        </>
      )}
    </div>
  );
}
