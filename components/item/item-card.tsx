"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

type SellerItem = {
  id: number | string;
  name: string;
  size: number;
  variety: string;
  age: string;
  gender?: string;
  status?: "for-sale" | "sold" | "draft";
  openBid?: number;
  image?: string;
};

const statusLabel: Record<
  NonNullable<SellerItem["status"]>,
  { label: string; variant: "outline" | "default" | "secondary" }
> = {
  "for-sale": { label: "For Sale", variant: "outline" },
  sold: { label: "Sold", variant: "default" },
  draft: { label: "Draft", variant: "secondary" },
};

export function ItemCard({
  item,
  onEdit,
}: {
  item: SellerItem;
  onEdit?: () => void;
}) {
  const isSold = item.status === "sold";

  return (
    <Card className="rounded-2xl overflow-hidden border hover:shadow-lg transition">
      {/* HEADER */}
      <CardHeader className="p-3 pb-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold truncate">
              {item.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Varietas • {item.variety}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onEdit}
          >
            <Settings className="size-4" />
          </Button>
        </div>

        {item.status && item.status !== "sold" && (
          <Badge
            variant={statusLabel[item.status]?.variant ?? "outline"}
            className="rounded-full px-3 py-0.5 text-[11px] w-fit"
          >
            {statusLabel[item.status]?.label ?? item.status}
          </Badge>
        )}
      </CardHeader>

      {/* IMAGE */}
      <CardContent className="p-4 pb-0">
        <div className="relative">
          {isSold && (
            <div className="absolute -left-8 top-4 -rotate-45 bg-rose-600 text-white px-12 py-1 text-[10px] font-semibold shadow">
              SOLD
            </div>
          )}
          <AspectRatio
            ratio={1 / 1}
            className={cn(
              "rounded-xl overflow-hidden border bg-muted/40",
              isSold && "opacity-80"
            )}
          >
            <img
              src={item.image ?? "/placeholder.svg"}
              alt={item.name}
              className="object-cover w-full h-full"
            />
          </AspectRatio>
        </div>
      </CardContent>

      {/* INFO */}
      <CardContent className="p-4 space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-muted-foreground text-xs">Ukuran</p>
            <p className="font-semibold">{item.size} cm</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Usia</p>
            <p className="font-semibold">{item.age}</p>
          </div>
          {item.gender && (
            <div>
              <p className="text-muted-foreground text-xs">Jenis kelamin</p>
              <p className="font-semibold">{item.gender}</p>
            </div>
          )}
          {item.openBid && (
            <div>
              <p className="text-muted-foreground text-xs">
                {isSold ? "Terjual" : "Buka Bid"}
              </p>
              <p
                className={cn(
                  "font-semibold",
                  isSold ? "text-rose-500" : undefined
                )}
              >
                Rp {item.openBid.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground flex items-center gap-2">
          <Droplet className="size-3.5 text-primary" />
          Jaga foto dan ukuran selalu diperbarui agar bidder makin percaya.
        </div>
      </CardContent>
    </Card>
  );
}
