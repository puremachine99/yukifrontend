"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

type AuctionRowItem = {
  id: number | string;
  name: string;
  size: number | string;
  variety: string;
  openBid: number;
  increment: number;
  buyNow?: number;
  image?: string;
  status?: string;
};

export function ItemRow({
  item,
  onEdit,
}: {
  item: AuctionRowItem;
  onEdit?: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border p-4 hover:border-primary/40 hover:bg-muted/40 transition md:flex-row md:items-center md:justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <div className="size-20 rounded-xl overflow-hidden border bg-muted">
          <img
            src={item.image ?? "/placeholder.svg"}
            className="object-cover w-full h-full"
            alt={item.name}
          />
        </div>

        <div className="space-y-1">
          <p className="font-semibold leading-tight">{item.name}</p>
          <p className="text-xs text-muted-foreground">
            Size {item.size} • {item.variety}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Open: Rp {item.openBid.toLocaleString()}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Inc: {item.increment.toLocaleString()}</span>
            {item.buyNow && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-primary font-medium">
                  Buy: Rp {item.buyNow.toLocaleString()}
                </span>
              </>
            )}
          </div>

          {item.status && (
            <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[11px]">
              {item.status}
            </Badge>
          )}
        </div>
      </div>

      {/* EDIT BUTTON */}
      <Button
        variant="outline"
        size="sm"
        className="rounded-full w-full md:w-auto"
        onClick={onEdit}
      >
        <Settings className="size-4 mr-2" />
        Adjust
      </Button>
    </div>
  );
}
