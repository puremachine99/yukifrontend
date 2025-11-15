"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  TimerReset,
  TrendingUp,
  LayoutGrid,
  Rows3,
  LockKeyhole,
} from "lucide-react";

type MonitoringItem = {
  id: number;
  title: string;
  timer: string;
  openBid: number;
  increment: number;
  buyNow: number;
  latestBid: number;
  bidCount: number;
  latestBidder: string;
  isWinning?: boolean;
  image?: string;
};

const monitoringItems: MonitoringItem[] = [
  {
    id: 5001,
    title: "Kohaku Supreme 65cm",
    image: "/placeholder.svg",
    timer: "00:05:12",
    openBid: 3200000,
    increment: 250000,
    buyNow: 4200000,
    latestBid: 3700000,
    bidCount: 12,
    latestBidder: "you#8891",
    isWinning: true,
  },
  {
    id: 5002,
    title: "Showa Champion 58cm",
    image: "/placeholder.svg",
    timer: "00:12:44",
    openBid: 2500000,
    increment: 200000,
    buyNow: 3600000,
    latestBid: 3100000,
    bidCount: 9,
    latestBidder: "bidder#3021",
    isWinning: false,
  },
  {
    id: 5003,
    title: "Tancho Premium 50cm",
    image: "/placeholder.svg",
    timer: "00:02:03",
    openBid: 2100000,
    increment: 150000,
    buyNow: 2900000,
    latestBid: 2550000,
    bidCount: 7,
    latestBidder: "bidder#1988",
    isWinning: false,
  },
];

export default function WishlistMonitoringPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [pinModalItem, setPinModalItem] = useState<MonitoringItem | null>(null);
  const [pin, setPin] = useState("");
  const [bidInputs, setBidInputs] = useState<Record<number, number | undefined>>({});

  const visibleItems = useMemo(() => {
    if (!search.trim()) return monitoringItems;
    return monitoringItems.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handlePlaceBid = (item: MonitoringItem) => {
    const value = bidInputs[item.id];
    if (value == null || Number.isNaN(value)) {
      toast.error("Masukkan nominal bid");
      return;
    }
    if (value <= item.latestBid) {
      toast.error("Bid harus lebih tinggi dari bid tertinggi saat ini");
      return;
    }

    const diff = value - item.openBid;
    if (diff % item.increment !== 0) {
      toast.error("Bid harus sesuai kelipatan increment");
      return;
    }
    toast.success(`Bid Rp ${value.toLocaleString()} terkirim (UI only)`);
  };

  const handleBuyNow = () => {
    if (pin.length < 4) {
      toast.error("PIN minimal 4 digit");
      return;
    }
    toast.success("Buy Now confirmed (UI only)");
    setPin("");
    setPinModalItem(null);
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Bidder • Monitoring
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Live Wishlist Board</h1>
          <p className="text-sm text-muted-foreground">
            Pantau hingga 6 item sekaligus tanpa masuk ke room lelang
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="gap-2" asChild>
            <a href="/dashboard/bidder/wishlist">
              <TrendingUp className="size-4" />
              Back to Wishlist
            </a>
          </Button>
          <Button className="gap-2" disabled={monitoringItems.length >= 6}>
            <LayoutGrid className="size-4" />
            Add Another Item
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between py-5">
          <Input
            placeholder="Cari koi / auction…"
            className="lg:w-1/3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2 rounded-full border px-2 py-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className="gap-1"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="size-4" />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className="gap-1"
              onClick={() => setViewMode("list")}
            >
              <Rows3 className="size-4" />
              List
            </Button>
          </div>
        </CardContent>
      </Card>

      {visibleItems.length === 0 ? (
        <Card className="rounded-2xl border-dashed border p-10 text-center text-sm text-muted-foreground">
          Tidak ada item dalam monitoring.
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.map((item) => (
            <MonitoringCard
              key={item.id}
              item={item}
              bidValue={bidInputs[item.id]}
              onBidChange={(value) =>
                setBidInputs((prev) => ({ ...prev, [item.id]: value }))
              }
              onBid={() => handlePlaceBid(item)}
              onBuyNow={() => setPinModalItem(item)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleItems.map((item) => (
            <MonitoringCard
              key={item.id}
              item={item}
              isRow
              bidValue={bidInputs[item.id]}
              onBidChange={(value) =>
                setBidInputs((prev) => ({ ...prev, [item.id]: value }))
              }
              onBid={() => handlePlaceBid(item)}
              onBuyNow={() => setPinModalItem(item)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!pinModalItem} onOpenChange={() => setPinModalItem(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Buy Now Confirmation</DialogTitle>
            <CardDescription>
              Masukkan PIN untuk membeli {pinModalItem?.title}.
            </CardDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Total pembayaran:{" "}
              <span className="font-semibold">
                Rp {pinModalItem?.buyNow.toLocaleString()}
              </span>
            </p>
            <div className="space-y-2">
              <Label>PIN</Label>
              <Input
                type="password"
                value={pin}
                maxLength={6}
                onChange={(e) => setPin(e.target.value)}
                placeholder="******"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPinModalItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleBuyNow} className="gap-2">
              <LockKeyhole className="size-4" />
              Confirm Buy Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MonitoringCard({
  item,
  bidValue,
  onBidChange,
  onBid,
  onBuyNow,
  isRow = false,
}: {
  item: MonitoringItem;
  bidValue?: number;
  onBidChange: (value: number) => void;
  onBid: () => void;
  onBuyNow: () => void;
  isRow?: boolean;
}) {
  return (
    <Card className={`rounded-2xl border ${isRow ? "" : "h-full"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <CardTitle className="text-base">{item.title}</CardTitle>
            <CardDescription>Lot #{item.id}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {item.isWinning && (
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                Winning
              </Badge>
            )}
            <Badge variant="outline" className="rounded-full px-3 py-1 flex items-center gap-1">
              <TimerReset className="size-4" />
              {item.timer}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={
          isRow
            ? "flex flex-col gap-4 md:flex-row md:items-center"
            : "space-y-4"
        }
      >
        {isRow ? (
          <>
            <div className="flex w-full gap-3 md:w-1/3">
              <div className="w-28 h-28 rounded-xl overflow-hidden border bg-muted/40 shrink-0">
                <img
                  src={item.image ?? "/placeholder.svg"}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <Label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Controls
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Rp"
                    value={bidValue ?? ""}
                    onChange={(e) =>
                      onBidChange(
                        e.target.value === "" ? undefined : Number(e.target.value)
                      )
                    }
                  />
                  <Button onClick={onBid}>Bid</Button>
                </div>
                <Button variant="outline" className="gap-2" onClick={onBuyNow}>
                  <LockKeyhole className="size-4" />
                  Buy Now
                </Button>
              </div>
            </div>

            <div className="flex-1 grid gap-3 md:grid-cols-2 text-sm">
              <InfoBlock label="Open Bid" value={`Rp ${item.openBid.toLocaleString()}`} />
              <InfoBlock label="Increment" value={`Rp ${item.increment.toLocaleString()}`} />
              <InfoBlock label="Latest Bid" value={`Rp ${item.latestBid.toLocaleString()}`} />
              <InfoBlock label="Buy Now" value={`Rp ${item.buyNow.toLocaleString()}`} />
              <InfoBlock label="Total Bids" value={`${item.bidCount}`} />
              <InfoBlock label="Latest Bidder" value={item.latestBidder} />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-xl overflow-hidden border bg-muted/30 h-40">
              <img
                src={item.image ?? "/placeholder.svg"}
                alt={item.title}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <InfoBlock label="Open Bid" value={`Rp ${item.openBid.toLocaleString()}`} />
              <InfoBlock label="Increment" value={`Rp ${item.increment.toLocaleString()}`} />
              <InfoBlock label="Latest Bid" value={`Rp ${item.latestBid.toLocaleString()}`} />
              <InfoBlock label="Buy Now" value={`Rp ${item.buyNow.toLocaleString()}`} />
              <InfoBlock label="Total Bids" value={`${item.bidCount}`} />
              <InfoBlock label="Latest Bidder" value={item.latestBidder} />
            </div>

            <div className="space-y-2">
              <Label>Place Bid</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Rp"
                  value={bidValue ?? ""}
                  onChange={(e) =>
                    onBidChange(
                      e.target.value === "" ? undefined : Number(e.target.value)
                    )
                  }
                />
                <Button onClick={onBid}>Bid</Button>
              </div>
              <Button variant="outline" className="w-full gap-2" onClick={onBuyNow}>
                <LockKeyhole className="size-4" />
                Buy Now
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}
