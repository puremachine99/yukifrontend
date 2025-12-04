"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, TrendingUp } from "lucide-react";

import { formatCurrencyIDR } from "@/lib/utils/currency";

type AuctionItem = {
  id: number | string;
  name: string;
  size: number | string;
  variety: string;
  openBid: number;
  increment: number;
  buyNow?: number;
  image?: string;
  status?: "draft" | "ready" | "sold";
};

const statusCopy: Record<
  NonNullable<AuctionItem["status"]>,
  { label: string; variant: "outline" | "secondary" | "default" }
> = {
  draft: { label: "Draft", variant: "outline" },
  ready: { label: "Ready", variant: "secondary" },
  sold: { label: "Sold", variant: "default" },
};

export function ItemCard({
  item,
  onEdit,
}: {
  item: AuctionItem;
  onEdit?: () => void;
}) {
  return (
    <Card className="rounded-2xl overflow-hidden border hover:border-primary/40 hover:shadow-lg transition">
      {/* HEADER */}
      <CardHeader className="px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold truncate leading-tight">
            {item.name}
          </CardTitle>

          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              onClick={onEdit}
            >
              <Settings className="size-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Variety • {item.variety}</span>
          <span className="text-muted-foreground/60">|</span>
          <span>Size • {item.size}</span>
        </div>

        {item.status && (
          <Badge
            variant={statusCopy[item.status]?.variant ?? "outline"}
            className="w-fit rounded-full px-3 py-0.5 text-xs"
          >
            {statusCopy[item.status]?.label ?? item.status}
          </Badge>
        )}
      </CardHeader>

      {/* IMAGE */}
      <CardContent className="px-4">
        <AspectRatio ratio={1 / 1} className="rounded-xl overflow-hidden border bg-muted">
          <img
            src={item.image ?? "/placeholder.svg"}
            alt={item.name}
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </CardContent>

      {/* INFO */}
      <CardContent className="px-4 pt-3 pb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Open Bid</span>
          <span className="font-semibold">{formatCurrencyIDR(item.openBid)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Increment</span>
          <span className="font-medium">{formatCurrencyIDR(item.increment)}</span>
        </div>

        {item.buyNow && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Buy Now</span>
            <span className="font-semibold text-primary">
              {formatCurrencyIDR(item.buyNow)}
            </span>
          </div>
        )}

        <div className="rounded-xl bg-muted/50 px-3 py-2 flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="size-3.5 text-primary" />
          Keep bid increment aligned with lot quality to maximize hype.
        </div>
      </CardContent>
    </Card>
  );
}
