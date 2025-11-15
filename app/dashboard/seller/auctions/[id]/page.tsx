"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { EditItemModal } from "@/components/auction/edit-item-modal";
import { LaunchAuctionModal } from "@/components/auction/launch-auction-modal";
import { ItemCard } from "@/components/auction/item-card";
import { ItemRow } from "@/components/auction/item-row";

import {
  Pencil,
  PlusCircle,
  Clock,
  Layers,
  LayoutGrid,
  Rows3,
  Sparkles,
} from "lucide-react";

const dummyAuction = {
  id: 1,
  title: "Evening Premium Auction",
  description: "Exclusive koi auction event for premium collectors.",
  banner: "/placeholder.svg",
  status: "Draft", // Draft | Ready | Finished
};

const dummyItems = [
  {
    id: 1,
    name: "Kohaku Jumbo",
    size: "70cm",
    variety: "Kohaku",
    openBid: 500000,
    increment: 50000,
    buyNow: 1500000,
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Showa Supreme",
    size: "62cm",
    variety: "Showa",
    openBid: 800000,
    increment: 100000,
    buyNow: 2500000,
    image: "/placeholder.svg",
  },
];

const recapItems = [
  {
    id: 1,
    name: "Kohaku Jumbo",
    bids: 18,
    participants: 7,
    snipingWinner: "bidder#3021",
    openBid: 500000,
    soldPrice: 1500000,
  },
  {
    id: 2,
    name: "Showa Supreme",
    bids: 14,
    participants: 5,
    snipingWinner: "bidder#2890",
    openBid: 800000,
    soldPrice: 2500000,
  },
];

export default function AuctionDetailPage() {
  const router = useRouter();

  const [editItem, setEditItem] = useState<any | null>(null);
  const [launchModal, setLaunchModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const addItems = () => {
    router.push(`/dashboard/seller/auctions/${dummyAuction.id}/items`);
  };

  const editAuctionDraft = () => {
    router.push(`/dashboard/seller/auctions/create`);
  };

  const totalProfit = recapItems.reduce(
    (sum, item) => sum + (item.soldPrice - item.openBid),
    0
  );
  const totalBids = recapItems.reduce((sum, item) => sum + item.bids, 0);
  const totalParticipants = recapItems.reduce(
    (sum, item) => sum + item.participants,
    0
  );

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Auction #{String(dummyAuction.id).padStart(4, "0")}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {dummyAuction.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {dummyAuction.description}
          </p>
        </div>

        <Badge
          variant={
            dummyAuction.status === "Draft"
              ? "outline"
              : dummyAuction.status === "Ready"
              ? "secondary"
              : "default"
          }
          className="px-4 py-1 text-sm w-fit"
        >
          {dummyAuction.status}
        </Badge>
      </div>

      {/* BANNER + SUMMARY */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden rounded-2xl border lg:col-span-2">
          <img
            src={dummyAuction.banner}
            className="w-full h-56 object-cover"
            alt="Auction Banner"
          />
        </Card>

        <Card className="rounded-2xl bg-gradient-to-b from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="size-4" />
              Draft Checklist
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Items added</span>
              <span className="font-semibold">{dummyItems.length}/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Schedule</span>
              <span className="font-semibold">Not set</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Featured lot</span>
              <span className="font-semibold">{dummyItems[0]?.name}</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {dummyAuction.status === "Draft" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-[140px] gap-2"
                    onClick={editAuctionDraft}
                  >
                    <Pencil className="size-4" />
                    Edit Draft
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-[140px] gap-2"
                    onClick={addItems}
                  >
                    <PlusCircle className="size-4" />
                    Add Items
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 min-w-[140px] gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onClick={() => setLaunchModal(true)}
                  >
                    <Clock className="size-4" />
                    Launch Auction
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VIEW MODE TOGGLE */}
      <div className="flex justify-end">
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
      </div>

      {/* ITEMS LIST */}
      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle>Items in Auction</CardTitle>
          <CardDescription>
            All items currently included in this auction
          </CardDescription>
        </CardHeader>

        <CardContent>
          {dummyItems.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {dummyItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onEdit={() => setEditItem(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {dummyItems.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onEdit={() => setEditItem(item)}
                  />
                ))}
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">No items added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* AUCTION RECAP */}
      <Card className="rounded-2xl border">
        <CardHeader>
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Recap & Profit</CardTitle>
              <CardDescription>
                Validate performance per item after the auction closes
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary" className="rounded-full px-4 py-1">
                Profit · Rp {totalProfit.toLocaleString()}
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-1">
                {totalBids} bids · {totalParticipants} participants
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl border bg-muted/50">
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  Highest Sniping
                </p>
                <p className="text-lg font-semibold">
                  {recapItems[0]?.snipingWinner ?? "-"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last-second bidder
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border bg-muted/50">
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  Items Sold
                </p>
                <p className="text-lg font-semibold">{recapItems.length}</p>
                <p className="text-xs text-muted-foreground">
                  Out of {dummyItems.length} total lots
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border bg-muted/50">
              <CardContent className="pt-5">
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  Avg. Profit
                </p>
                <p className="text-lg font-semibold">
                  Rp{" "}
                  {recapItems.length
                    ? Math.round(totalProfit / recapItems.length).toLocaleString()
                    : "0"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Per item above open bid
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {recapItems.map((item) => {
              const profit = item.soldPrice - item.openBid;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border p-4 space-y-3 hover:border-primary/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Lot #{item.id}</p>
                      <p className="font-semibold">{item.name}</p>
                    </div>
                    <Badge variant="outline" className="rounded-full">
                      {item.bids} bids
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs">Participants</p>
                      <p className="font-semibold">{item.participants}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Sniping</p>
                      <p className="font-semibold">{item.snipingWinner}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Open Bid</p>
                      <p className="font-semibold">
                        Rp {item.openBid.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Sold Price</p>
                      <p className="font-semibold text-green-600">
                        Rp {item.soldPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground flex justify-between">
                    <span>Profit</span>
                    <span className="font-semibold text-green-600">
                      Rp {profit.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* MODALS */}
      {editItem && (
        <EditItemModal item={editItem} onClose={() => setEditItem(null)} />
      )}

      {launchModal && (
        <LaunchAuctionModal onClose={() => setLaunchModal(false)} />
      )}
    </div>
  );
}
