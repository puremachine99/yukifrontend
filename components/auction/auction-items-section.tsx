"use client";

import { useMemo } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { LayoutGrid, Rows3 } from "lucide-react";

import { ItemCard } from "@/components/auction/item-card";
import { ItemRow } from "@/components/auction/item-row";
import { AuctionItemOnAuction } from "@/lib/api/auction";

type ViewMode = "grid" | "list";

interface AuctionItemsSectionProps {
  canDisplay: boolean;
  items: AuctionItemOnAuction[];
  isLoading: boolean;
  error?: string | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const toDisplayAuctionItem = (itemOnAuction: AuctionItemOnAuction) => {
  const nested = itemOnAuction.item;
  const mediaUrl = nested?.media?.[0]?.url;

  return {
    id: nested?.id ?? itemOnAuction.itemId,
    name: nested?.name ?? "Unknown Item",
    variety: nested?.variety ?? "-",
    size: nested?.size ?? "-",
    image: nested?.imageUrl ?? mediaUrl ?? "/placeholder.svg",
    openBid: Number(itemOnAuction.openBid ?? 0),
    increment: Number(itemOnAuction.increment ?? 0),
    buyNow:
      itemOnAuction.buyNow === null || itemOnAuction.buyNow === undefined
        ? undefined
        : Number(itemOnAuction.buyNow),
    status: itemOnAuction.status,
  };
};

export function AuctionItemsSection({
  canDisplay,
  items,
  isLoading,
  error,
  viewMode,
  onViewModeChange,
}: AuctionItemsSectionProps) {
  const enrichedItems = useMemo(
    () => items.map(toDisplayAuctionItem),
    [items]
  );

  if (!canDisplay) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">Items</div>
        <div className="flex gap-2 rounded-full border px-2 py-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="gap-1"
            onClick={() => onViewModeChange("grid")}
          >
            <LayoutGrid className="size-4" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="gap-1"
            onClick={() => onViewModeChange("list")}
          >
            <Rows3 className="size-4" />
            List
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Spinner className="size-6" />
        </div>
      ) : (
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle>Items in Auction</CardTitle>
            <CardDescription>
              Semua item yang sudah terpasang pada lelang ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {enrichedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Belum ada item di dalam lelang ini.
              </p>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {enrichedItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {enrichedItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
