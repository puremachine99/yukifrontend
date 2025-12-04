"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { LandingNavbar } from "@/components/landing/navbar";

import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import { CancelError } from "@/lib/api-client/core/CancelablePromise";
import { formatCurrencyIDR } from "@/lib/utils/currency";

const formatDateTime = (value?: string | null) => {
  if (!value) return "Belum dijadwalkan";
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

type AuctionDetail = {
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
    openBid?: number;
    increment?: number;
    buyNow?: number | null;
    item?: {
      id?: number;
      name?: string;
      variety?: string;
      size?: number | string | null;
      media?: Array<{ url?: string | null }>;
    };
  }>;
};

const normalizeAuction = (payload: unknown): AuctionDetail | null => {
  if (!payload || typeof payload !== "object") return null;
  return payload as AuctionDetail;
};

export default function PublicAuctionDetailPage() {
  const params = useParams<{ auctionId: string }>();
  const auctionId = Number(Array.isArray(params?.auctionId) ? params?.auctionId[0] : params?.auctionId);
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!auctionId) {
      setError("Auction tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    configureApiClient();
    setIsLoading(true);
    setError(null);

    const request = AuctionService.auctionControllerGetAuctionDetail(auctionId);
    request
      .then((response) => setAuction(normalizeAuction(response)))
      .catch((err) => {
        if (err instanceof CancelError) return;
        setError(err instanceof Error ? err.message : "Gagal memuat data.");
      })
      .finally(() => setIsLoading(false));

    return () => {
      if (typeof request.cancel === "function") request.cancel();
    };
  }, [auctionId]);

  const lots = useMemo(() => auction?.items ?? [], [auction?.items]);

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            {error}
          </div>
        ) : !auction ? (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-center text-sm text-destructive">
            Auction tidak ditemukan.
          </div>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-3xl border bg-card shadow-lg">
              <div className="absolute inset-0">
                <img
                  src={auction.bannerUrl ?? "/placeholder.svg"}
                  alt={auction.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
              </div>
              <div className="relative z-10 grid gap-6 lg:grid-cols-3 p-8 md:p-12">
                <div className="lg:col-span-2 space-y-4">
                  <Badge variant="secondary" className="w-fit text-xs uppercase tracking-[0.3em]">
                    {auction.status ?? "Draft"}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{auction.title}</h1>
                  <p className="text-muted-foreground text-base md:text-lg max-w-3xl">
                    {auction.description || "Belum ada deskripsi."}
                  </p>
                </div>
                <div className="bg-background/80 backdrop-blur rounded-2xl border border-border/60 p-4 md:p-6 space-y-3 text-sm">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground/80">Mulai</p>
                    <p className="font-semibold text-foreground">{formatDateTime(auction.startTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground/80">Selesai</p>
                    <p className="font-semibold text-foreground">{formatDateTime(auction.endTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground/80">Disiapkan oleh</p>
                    <p className="font-semibold text-foreground">{auction.user?.name ?? "Anonim"}</p>
                  </div>
                </div>
              </div>
            </div>

            <section id="lots" className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Lineup Koi
                </p>
                <h2 className="text-2xl font-semibold">{lots.length} lot siap tayang</h2>
              </div>

              {lots.length === 0 ? (
                <div className="rounded-2xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
                  Belum ada item yang dipublikasikan.
                </div>
              ) : (
                <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
                  {lots.map((lot) => {
                    const image =
                      lot.item?.media?.find((media) => media?.url)?.url ??
                      auction.bannerUrl ??
                      "/placeholder.svg";
                    return (
                      <div
                        key={lot.itemId}
                        className="p-6 bg-card border border-border rounded-3xl space-y-4 h-full flex flex-col"
                      >
                        <div className="flex items-start gap-3 justify-between">
                          <div className="space-y-1 min-w-0 flex-1">
                            <p className="text-sm text-muted-foreground truncate">{auction.title}</p>
                            <h2 className="text-lg font-semibold truncate">
                              {lot.item?.name ?? `Lot #${lot.itemId}`}
                            </h2>
                          </div>
                          <Badge className="shrink-0">
                            {lot.item?.variety ?? "Varietas"}
                          </Badge>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-border">
                          <img
                            src={image}
                            alt={lot.item?.name ?? "Lot"}
                            className="h-56 w-full object-cover"
                          />
                        </div>

                        <div className="text-sm space-y-1.5 text-muted-foreground flex-1">
                          <div className="flex justify-between text-foreground">
                            <span>Open Bid</span>
                            <span>{formatCurrencyIDR(Number(lot.openBid ?? 0))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Increment</span>
                            <span>
                              {formatCurrencyIDR(Number(lot.increment ?? 0))}
                            </span>
                          </div>
                          {lot.buyNow ? (
                            <div className="flex justify-between">
                              <span>Buy Now</span>
                              <span>
                                {formatCurrencyIDR(Number(lot.buyNow ?? 0))}
                              </span>
                            </div>
                          ) : null}
                        </div>

                        <Button asChild className="w-full mt-auto">
                          <Link href={`/auction/${auction.id}/${lot.itemId}`}>
                            Masuk Live Room
                          </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
