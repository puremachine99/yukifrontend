"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LandingNavbar } from "@/components/landing/navbar";

import { formatCurrencyIDR } from "@/lib/utils/currency";
import { configureApiClient } from "@/lib/api-client/configure";
import { AuctionService } from "@/lib/api-client/services/AuctionService";
import { useAuthSession } from "@/hooks/use-auth-session";

type LiveAuction = {
  id: number;
  title: string;
  description?: string | null;
  bannerUrl?: string | null;
  status?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  user?: { id?: number; name?: string | null };
  items?: LiveAuctionLot[];
};

type LiveAuctionLot = {
  id: number;
  itemId: number;
  openBid?: number;
  increment?: number;
  buyNow?: number | null;
  status?: string | null;
  bids?: { id?: number; amount?: number; createdAt?: string }[];
  item?: {
    id?: number;
    name?: string;
    variety?: string;
    size?: string | number | null;
    media?: { url?: string | null }[];
  };
};

const normalize = (p: unknown): LiveAuction[] => {
  if (!p) return [];
  if (Array.isArray(p)) return p;
  const r = p as Record<string, any>;
  if (Array.isArray(r.data)) return r.data;
  if (Array.isArray(r.items)) return r.items;
  return [];
};

export default function LiveAuctionPage() {
  const { accessToken } = useAuthSession();

  const [search, setSearch] = useState("");
  const [auctions, setAuctions] = useState<LiveAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  /** --------------------------
   *  FETCH LIVE AUCTIONS
   *  -------------------------*/
  useEffect(() => {
    configureApiClient();

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    AuctionService.auctionControllerGetLiveAuctions({
      signal: controller.signal,
    })
      .then((res) => {
        setAuctions(normalize(res));
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Gagal memuat auction live."
        );
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  /** --------------------------
   *  SOCKET: LIVE STATUS + BIDS
   *  -------------------------*/
  useEffect(() => {
    if (!accessToken) return;
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
    ).replace(/\/$/, "");
    const ws = baseUrl.replace(/^http/, "ws");

    const socket = io(`${ws}/auction`, {
      transports: ["websocket"],
      auth: { token: accessToken },
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    const actives = auctions.filter((a) => (a.status ?? "").toLowerCase() === "active");
    actives.forEach((a) => socket.emit("subscribeAuction", { auctionId: a.id }));

    socket.on("auction:bid", ({ auctionId, itemId, bid }) => {
      setAuctions((prev) =>
        prev.map((auction) => {
          if (auction.id !== auctionId) return auction;
          return {
            ...auction,
            items: auction.items?.map((lot) =>
              lot.id === itemId || lot.itemId === itemId
                ? {
                    ...lot,
                    bids: [...(lot.bids ?? []), bid],
                    status: bid?.isBuyNow ? "sold" : lot.status,
                  }
                : lot
            ),
          };
        })
      );
    });

    socket.on("bid:new", ({ auctionId, itemOnAuctionId, itemId, bid }) => {
      const targetId = itemOnAuctionId ?? itemId;
      setAuctions((prev) =>
        prev.map((auction) => {
          if (auction.id !== auctionId) return auction;
          return {
            ...auction,
            items: auction.items?.map((lot) =>
              lot.id === targetId || lot.itemId === targetId
                ? {
                    ...lot,
                    bids: [...(lot.bids ?? []), bid],
                    status: bid?.isBuyNow ? "sold" : lot.status,
                  }
                : lot
            ),
          };
        })
      );
    });

    socket.on("auction:buyNow", ({ auctionId, itemId, price }) => {
      setAuctions((prev) =>
        prev.map((auction) => {
          if (auction.id !== auctionId) return auction;
          return {
            ...auction,
            items: auction.items?.map((lot) =>
              lot.id === itemId || lot.itemId === itemId
                ? { ...lot, status: "sold", buyNow: price }
                : lot
            ),
          };
        })
      );
    });

    socket.on("buyNow", ({ auctionId, itemOnAuctionId, price }) => {
      setAuctions((prev) =>
        prev.map((auction) => {
          if (auction.id !== auctionId) return auction;
          return {
            ...auction,
            items: auction.items?.map((lot) =>
              lot.id === itemOnAuctionId || lot.itemId === itemOnAuctionId
                ? { ...lot, status: "sold", buyNow: price }
                : lot
            ),
          };
        })
      );
    });

    socket.on("auction:status", ({ auctionId, status }) => {
      setAuctions((prev) =>
        prev.map((a) => (a.id === auctionId ? { ...a, status } : a))
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, auctions]);

  /** --------------------------
   *  MEMO FILTERS
   *  -------------------------*/
  const activeAuctions = useMemo(
    () => auctions.filter((a) => (a.status ?? "").toLowerCase() === "active"),
    [auctions]
  );

  const activeLots = useMemo(
    () =>
      activeAuctions.flatMap((auction) =>
        (auction.items ?? []).map((lot) => ({ auction, lot }))
      ),
    [activeAuctions]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return activeLots;

    return activeLots.filter(({ auction, lot }) => {
      const haystack = [
        auction.title,
        auction.description,
        auction.user?.name,
        lot.item?.name,
        lot.item?.variety,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [activeLots, search]);

  /** --------------------------
   *  UI
   *  -------------------------*/
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />

      <header className="border-b border-border bg-card/70 backdrop-blur">
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-10xl mx-auto px-4 md:px-6 py-10 md:py-16 space-y-6 md:space-y-8">
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight">Live Auctions</h1>
          <p className="text-muted-foreground text-sm md:text-base">Koi yang sedang tayang real-time.</p>

          <div className="flex flex-col md:flex-row gap-3 md:gap-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari koi / auction / breeder"
            />
            <Button variant="outline" asChild>
              <Link href="/auction">Lihat Jadwal</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl xl:max-w-7xl 2xl:max-w-10xl mx-auto px-4 md:px-6 py-10 md:py-16">
        {loading ? (
          <div className="border border-border p-16 rounded-3xl text-center">
            Memuat data live…
          </div>
        ) : error ? (
          <div className="border border-destructive p-8 rounded-xl bg-destructive/10 text-destructive text-center">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-border p-16 rounded-3xl text-center text-muted-foreground">
            Tidak ada lot live saat ini.
          </div>
        ) : (
          <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
            {filtered.map(({ auction, lot }) => {
              const lastBid =
                lot.bids && lot.bids.length
                  ? Math.max(...lot.bids.map((b) => Number(b.amount ?? 0)))
                  : Number(lot.openBid ?? 0);

              const img =
                lot.item?.media?.[0]?.url ??
                auction.bannerUrl ??
                "/placeholder.svg";

              return (
                <div
                  key={lot.id}
                  className="p-6 bg-card border border-border rounded-3xl space-y-4 h-full flex flex-col"
                >
                  <div className="flex items-start gap-3 justify-between">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm text-muted-foreground truncate">{auction.title}</p>
                      <h2 className="text-lg md:text-xl font-semibold truncate">
                        {lot.item?.name ?? `Lot #${lot.itemId}`}
                      </h2>
                    </div>
                    <Badge className="shrink-0">
                      {lot.item?.variety ?? "Varietas"}
                    </Badge>
                  </div>

                  <div className="rounded-2xl overflow-hidden border border-border">
                    <img
                      src={img}
                      alt={lot.item?.name}
                      className="h-56 md:h-64 w-full object-cover"
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
                    <div className="flex justify-between">
                      <span>Total Bids</span>
                      <span>{lot.bids?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Highest Bid</span>
                      <span>{formatCurrencyIDR(lastBid)}</span>
                    </div>
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
      </main>
    </div>
  );
}
