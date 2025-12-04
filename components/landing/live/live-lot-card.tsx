"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrencyIDR } from "@/lib/utils/currency";

interface LiveLotCardProps {
  auctionId: number;
  breeder?: string;
  itemId: number;
  image: string;
  name: string;
  variety?: string;
  size?: string | number;
  start?: string;
  end?: string;
  watchers: number;
  lastBid: number;
  openBid: number;
  increment: number;
  buyNow?: number | null;
  bidCount: number;
}

export function LiveLotCard(props: LiveLotCardProps) {
  const {
    auctionId,
    breeder,
    itemId,
    image,
    name,
    variety,
    size,
    start,
    end,
    watchers,
    lastBid,
    openBid,
    increment,
    buyNow,
    bidCount,
  } = props;

  return (
    <article className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl shadow-slate-950/80">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950/95" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-8">
        {/* TOP */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge className="rounded-full bg-red-500/80 text-[10px] font-semibold uppercase tracking-[0.25em]">
              Live
            </Badge>

            {breeder && (
              <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
                {breeder}
              </span>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">
              Auction #{String(auctionId).padStart(4, "0")}
            </p>

            <h2 className="text-2xl font-semibold">{name}</h2>

            <p className="text-sm text-slate-300 line-clamp-2">
              {variety ? `${variety} • ` : ""}
              {size ? `Size ${size}` : ""}
            </p>
          </div>

          <div className="grid gap-2 rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Start</span>
              <span>{start ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>End</span>
              <span>{end ?? "-"}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Watchers</span>
              <span>{watchers}</span>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="space-y-4">
          <div className="grid gap-2 rounded-2xl bg-white/5 px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Last bid</span>
              <span className="font-semibold text-white">
                {formatCurrencyIDR(lastBid)}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Open bid</span>
              <span>{formatCurrencyIDR(openBid)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Increment</span>
              <span>{formatCurrencyIDR(increment)}</span>
            </div>

            {buyNow !== null && buyNow !== undefined && (
              <div className="flex items-center justify-between text-emerald-300">
                <span>Buy now</span>
                <span>{formatCurrencyIDR(buyNow)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Total bids</span>
              <span>{bidCount}</span>
            </div>
          </div>

          <Button
            asChild
            className="w-full border border-white/20 bg-white/10 text-white hover:bg-white/20"
          >
            <Link href={`/auction/${auctionId}/${itemId}`}>
              Masuk ke room koi
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
